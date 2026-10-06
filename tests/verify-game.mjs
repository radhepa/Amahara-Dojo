import './typescript-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const game=await import(pathToFileURL(path.join(root,'lib/game.ts')));
const stories=await import(pathToFileURL(path.join(root,'lib/story/index.ts')));
const {gameAction}=await import(pathToFileURL(path.join(root,'lib/game-actions.ts')));
const {sessionAction,activeSession,sessionRemaining}=await import(pathToFileURL(path.join(root,'lib/session-actions.ts')));
const {dateKey,dayIndex}=await import(pathToFileURL(path.join(root,'lib/training.ts')));
const {CAST}=await import(pathToFileURL(path.join(root,'lib/story/cast.ts')));
function legacyGame(now){const g=game.freshGame(now);delete g.storyRevision;return g;}
const monday=Date.parse('2026-10-05T12:00:00-04:00');
assert.equal(stories.MAIN.length,48);assert.equal(stories.ALL_SCENES.length,80);assert.equal(new Set(stories.ALL_SCENES.map(s=>s.id)).size,80);
for(const s of stories.ALL_SCENES){assert(s.lines.length>0);for(const l of s.lines)assert(CAST[l.speaker],s.id+' unknown speaker '+l.speaker);if(s.choice){assert(s.choice.options.length>=2);assert.equal(new Set(s.choice.options.map(o=>o.id)).size,s.choice.options.length);}}
function read(g,s,option=0){assert(game.sceneAvailable(g,s),s.id+' unavailable');let bound=0;while(!g.scenes[s.id]?.done){assert(bound++<200);const save=g.scenes[s.id];const count=stories.visibleLines(s,save?.flags??g.flags).length;if(s.choice&&!save?.choice&&(save?.position??0)===count-1)gameAction(g,{action:'scene',id:s.id,operation:'choose',option:s.choice.options[option].id},monday);else gameAction(g,{action:'scene',id:s.id,operation:'advance',position:save?.position??0},monday);}}
function fullPractice(g,now,readiness='ready',companion='akari',reflection='comfortable'){sessionAction(g,{action:'start',readiness,companion},now,1,new Set());let s=activeSession(g);const minutes=s.plan.reduce((n,b)=>n+b.seconds,0)/60;assert.throws(()=>sessionAction(g,{action:'next',id:s.id,index:0,confirm:true},now,1,new Set()));for(let i=0;i<s.plan.length;i++){now+=s.plan[i].seconds*1000;assert.equal(sessionRemaining(s,now),0);sessionAction(g,{action:'next',id:s.id,index:i,confirm:true},now,1,new Set());}const out=sessionAction(g,{action:'finalize',id:s.id,note:'test private note',reflection},now,1,new Set());const snapshot=JSON.stringify(g);sessionAction(g,{action:'finalize',id:s.id,note:'retry',reflection},now,1,new Set());assert.equal(JSON.stringify(g),snapshot);assert.equal(out.record.minutes,minutes);return out;}
const normal=legacyGame(monday),recovery=legacyGame(monday);fullPractice(normal,monday);fullPractice(recovery,monday,'tired');assert.equal(normal.practices,1);assert.equal(normal.supplies,20);assert.equal(normal.bonds.akari,12);assert.deepEqual(normal.bonds,recovery.bonds);assert.equal(normal.supplies,recovery.supplies);
// The new 45-minute ceiling includes pauses and survives reload/retry.
for(const paused of [false,true]){
 const capped=legacyGame(monday);sessionAction(capped,{action:'start',readiness:'ready',companion:'solo'},monday,5,new Set());
 let s=activeSession(capped);assert.equal(s.deadline,monday+45*60_000);
 if(paused)sessionAction(capped,{action:'pause',id:s.id},monday+30_000,5,new Set());
 const reloaded=JSON.parse(JSON.stringify(capped));s=activeSession(reloaded);
 sessionAction(reloaded,{action:'resume',id:s.id},s.deadline,5,new Set());
 assert.equal(s.status,'summary');assert.equal(s.runningSince,null);assert.equal(s.skipped,true);assert.equal(s.elapsed,paused?30:300);
 const result=sessionAction(reloaded,{action:'finalize',id:s.id,note:''},s.deadline+60_000,5,new Set());
 assert.equal(result.record.kind,'partial');assert.equal(result.record.minutes,paused?0.5:5);assert.equal(reloaded.supplies,0);
 const snapshot=JSON.stringify(reloaded);sessionAction(reloaded,{action:'finalize',id:s.id,note:''},s.deadline+120_000,5,new Set());assert.equal(JSON.stringify(reloaded),snapshot);
}
// Time after the deadline cannot finish a later block; old saved sessions keep their plan.
{
 const g=legacyGame(monday);sessionAction(g,{action:'start',readiness:'ready',companion:'solo'},monday,1,new Set());const s=activeSession(g);
 sessionAction(g,{action:'next',id:s.id,index:0,confirm:true},monday+44*60_000,1,new Set());
 assert.equal(sessionRemaining(s,monday+60*60_000),240);
 sessionAction(g,{action:'next',id:s.id,index:1,confirm:true},monday+60*60_000,1,new Set());assert.equal(s.status,'summary');assert.equal(s.checks[1],false);
 const old=legacyGame(monday);sessionAction(old,{action:'start',readiness:'ready',companion:'solo'},monday,1,new Set());const legacy=activeSession(old);delete legacy.deadline;legacy.plan=[{id:'w1-stance',seconds:600}];legacy.checks=[false];
 sessionAction(old,{action:'next',id:legacy.id,index:0,confirm:true},monday+60*60_000,1,new Set());assert.equal(legacy.status,'summary');assert.equal(legacy.skipped,false);assert.equal(legacy.elapsed,600);
}
for(const reflection of game.REFLECTIONS){const g=legacyGame(monday);fullPractice(g,monday,'ready','akari',reflection.id);assert.equal(g.bonds.akari,12);}
const p=legacyGame(monday);sessionAction(p,{action:'start',readiness:'ready',companion:'ren'},monday,1,new Set());const sid=activeSession(p).id;sessionAction(p,{action:'pause',id:sid},monday+30000,1,new Set());assert.equal(sessionRemaining(activeSession(p),monday+600000),270);sessionAction(p,{action:'stop',id:sid},monday+600000,1,new Set());const part=sessionAction(p,{action:'finalize',id:sid,note:''},monday+600000,1,new Set());assert.equal(part.record.kind,'partial');assert.equal(p.practices,0);assert.equal(p.supplies,0);assert.equal(p.bonds.ren,0);
assert.throws(()=>sessionAction(legacyGame(monday),{action:'start',readiness:'ready',companion:'ren'},Date.parse('2026-10-07T12:00:00-04:00'),1,new Set()),/rest/);
assert.equal(dateKey(new Date('2026-10-07T03:59:59Z')),'2026-10-06');assert.equal(dayIndex(new Date('2026-10-07T04:00:00Z')),2);
const g0=legacyGame(monday);read(g0,stories.PROLOGUE);assert(!game.sceneAvailable(g0,stories.MAIN[0]));
for(let variant=0;variant<256;variant++){const g=legacyGame(monday);read(g,stories.PROLOGUE);let choice=0;for(let i=0;i<48;i++){g.practices=i+1;read(g,stories.MAIN[i],stories.MAIN[i].choice?(variant>>choice++)&1:0);}assert.equal(game.mainCompleted(g),48);assert.equal(Object.keys(g.rewards).filter(k=>k.startsWith('scene:')).length,49);const before=JSON.stringify(g);read(g,stories.MAIN[0]);assert.equal(JSON.stringify(g),before);}
const season=legacyGame(monday);read(season,stories.PROLOGUE);let now=monday;for(let i=0;i<48;i++){while(dayIndex(new Date(now))===2)now+=86400000;fullPractice(season,now,'ready',['akari','ren','sora','daichi','yuzu'][i%5]);read(season,stories.MAIN[i],i%2);let available=game.availableScenes(season).filter(s=>s.kind==='personal'||s.kind==='quest');while(available.length){for(const s of available)read(season,s);available=game.availableScenes(season).filter(s=>s.kind==='personal'||s.kind==='quest');}now+=86400000;}
assert.equal(stories.PERSONAL.filter(s=>season.scenes[s.id]?.done).length,20);assert.equal(season.practices,48);
for(const s of stories.ALL_SCENES.filter(s=>s.kind==='relationship'))read(season,s,0);assert.equal(season.flags.romance,'none');
const project=game.PROJECTS[0];const supplies=season.supplies;gameAction(season,{action:'upgrade',id:project.id},now);gameAction(season,{action:'upgrade',id:project.id},now);assert.equal(season.supplies,supplies-project.cost);
gameAction(season,{action:'assign',member:'ren',hours:12},now);const a=season.assignments[0];assert.equal(game.claimable(a,now+100*3600000),32);gameAction(season,{action:'claim',id:a.id},now+100*3600000);const after=season.supplies;gameAction(season,{action:'claim',id:a.id},now+100*3600000);assert.equal(season.supplies,after);assert.equal(game.claimable(a,now+108*3600000),8);gameAction(season,{action:'release',id:a.id},now+108*3600000);assert.equal(season.assignments.length,0);
const words=stories.ALL_SCENES.reduce((n,s)=>n+s.lines.reduce((t,l)=>t+l.text.split(/\s+/).length,0),0);
console.log(JSON.stringify({result:'passed',mainScenes:48,personalScenes:20,sideQuests:6,relationshipInvitations:5,branchPlaythroughs:256,words,checks:'timed confirmations, rewards, recovery parity, Wednesday, timezone, partial, replay, personal availability, projects, idle cap and retry idempotence'},null,2));
