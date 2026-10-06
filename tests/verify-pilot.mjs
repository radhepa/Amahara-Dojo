import './typescript-loader.mjs';
import assert from 'node:assert/strict';
const {freshGame,campaignMain,mainCompleted,companionsUnlocked,sceneAvailable,availableScenes,requiredOpening}=await import('../lib/game.ts');
const {gameAction}=await import('../lib/game-actions.ts');
const {sessionAction,activeSession}=await import('../lib/session-actions.ts');
const {PILOT_MAIN,PILOT_OPENINGS,PILOT_PROLOGUE,MONTH_OPENINGS,pilotLines,SCENE_BY_ID}=await import('../lib/story/index.ts');
const {CAST,LOCATIONS,characterPortrait}=await import('../lib/story/cast.ts');
import fs from 'node:fs';
const now=Date.parse('2026-10-05T12:00:00-04:00');
function current(g,s){const save=g.scenes[s.id];const list=pilotLines(s,save?.flags??g.flags,save?.choices);return list.find(l=>l.id===save?.passageId)??list[0];}
function advance(g,s){const line=current(g,s);gameAction(g,{action:'scene',id:s.id,operation:'advance',passageId:line.id},now);}
function read(g,s,picks={}){let count=0;while(!g.scenes[s.id]?.done){assert(count++<300);const l=current(g,s);const save=g.scenes[s.id];if(l.decision&&!save?.choices?.[l.decision.flag])gameAction(g,{action:'scene',id:s.id,operation:'choose',passageId:l.id,decision:l.decision.flag,option:picks[l.decision.flag]??l.decision.options[0].id},now);else advance(g,s);}}
assert.equal(PILOT_MAIN.length,6);assert.equal(PILOT_OPENINGS.length,2);
for(const s of [...PILOT_MAIN,...PILOT_OPENINGS,PILOT_PROLOGUE]){
 const ids=s.lines.map(l=>l.id).filter(Boolean);assert.equal(new Set(ids).size,ids.length);
 const words=s.lines.reduce((n,l)=>n+l.text.split(/\s+/).length,0);if(s.kind==='main')assert(words>=1900,s.title+' is too short for the episode target');
 for(const l of s.lines){assert(CAST[l.speaker]);if(l.location)assert(LOCATIONS[l.location]);for(const item of [l,...(l.decision?.options.flatMap(o=>o.reply)??[])]){assert(CAST[item.speaker]);const portrait=characterPortrait(item.speaker,item.expression);if(portrait)assert(fs.existsSync('public'+portrait));}if(l.decision)assert.equal(new Set(l.decision.options.map(o=>o.id)).size,l.decision.options.length);}
}
const fresh=freshGame(now);assert.deepEqual(companionsUnlocked(fresh),[]);assert.equal(requiredOpening(fresh).beat,1);
assert.throws(()=>sessionAction(fresh,{action:'start',readiness:'ready',companion:'solo'},now,1,new Set()),/opening/);
read(fresh,PILOT_PROLOGUE);read(fresh,PILOT_OPENINGS[0]);assert.deepEqual(companionsUnlocked(fresh),[]);assert.equal(fresh.supplies,0);assert.equal(fresh.practices,0);assert.deepEqual(fresh.rewards,{'scene:c1-pilot-prologue':true});
assert.throws(()=>sessionAction(fresh,{action:'start',readiness:'ready',companion:'akari'},now,1,new Set()),/Meet/);
sessionAction(fresh,{action:'start',readiness:'ready',companion:'solo'},now,1,new Set());const session=activeSession(fresh);let end=now;
for(let i=0;i<session.plan.length;i++){end+=session.plan[i].seconds*1000;sessionAction(fresh,{action:'next',id:session.id,index:i,confirm:true},end,1,new Set());}
sessionAction(fresh,{action:'finalize',id:session.id,note:'private',reflection:'private'},end,1,new Set());assert.equal(fresh.practices,1);assert.equal(fresh.supplies,20);assert(Object.values(fresh.bonds).every(v=>v===0));
const fullSnapshot=JSON.stringify(fresh);sessionAction(fresh,{action:'finalize',id:session.id,note:'retry'},end,1,new Set());assert.equal(JSON.stringify(fresh),fullSnapshot);
const s=PILOT_MAIN[0];while(current(fresh,s).introduces!=='akari')advance(fresh,s);assert.deepEqual(companionsUnlocked(fresh),[]);
const intro=current(fresh,s);advance(fresh,s);assert.deepEqual(companionsUnlocked(fresh).map(m=>m.id),['akari']);const snapshot=JSON.stringify(fresh);gameAction(fresh,{action:'scene',id:s.id,operation:'advance',passageId:intro.id},now);assert.equal(JSON.stringify(fresh),snapshot,'stale introduction advance');
read(fresh,s);assert.deepEqual(companionsUnlocked(fresh).map(m=>m.id),['akari','ren']);assert(!sceneAvailable(fresh,SCENE_BY_ID['c1-e1-b1']));
// Each embedded option is exercised, alongside every meaningful callback combination.
const paths=[...PILOT_MAIN,...PILOT_OPENINGS].flatMap(scene=>scene.lines.flatMap(l=>l.decision?l.decision.options.map(o=>({[l.decision.flag]:o.id})):[]));
for(const ren of ['plain','private','question'])for(const repair of ['floor','welcome'])paths.push({'pilot:ren-stop':ren,repair});
for(const picks of paths){const g=freshGame(now);read(g,PILOT_PROLOGUE);read(g,PILOT_OPENINGS[0]);for(let i=0;i<6;i++){
 if(i===3){assert.equal(requiredOpening(g).beat,4);assert.throws(()=>sessionAction(g,{action:'start',readiness:'ready',companion:'solo'},now,1,new Set()),/opening/);read(g,PILOT_OPENINGS[1],picks);}
 g.practices=i+1;read(g,PILOT_MAIN[i],picks);
 if(i===1)assert.deepEqual(companionsUnlocked(g).map(m=>m.id),['akari','ren','sora']);if(i===2)assert.equal(companionsUnlocked(g).length,4);
 }
 assert.equal(mainCompleted(g),6);assert.equal(companionsUnlocked(g).length,5);g.practices=7;assert(!sceneAvailable(g,campaignMain(g)[6]));read(g,MONTH_OPENINGS.find(o=>o.episode===2&&o.beat===1));assert(sceneAvailable(g,campaignMain(g)[6]));
 const saved=JSON.stringify(g);read(g,PILOT_MAIN[0],{'pilot:arrival':'reserved'});assert.equal(JSON.stringify(g),saved);
 const ep6=g.scenes[PILOT_MAIN[5].id],replay=pilotLines(PILOT_MAIN[5],ep6.flags,ep6.choices);
 assert.equal(replay.filter(l=>l.when?.flag==='pilot:ren-stop').length,1);assert.equal(replay.filter(l=>l.when?.flag==='repair').length,1);
 g.flags['pilot:ren-stop']='changed';assert.deepEqual(pilotLines(PILOT_MAIN[5],ep6.flags,ep6.choices),replay,'replay must retain entry context');
}
// Reload at every passage and decision; answered replies retain their stable IDs.
let g=freshGame(now);read(g,PILOT_PROLOGUE);read(g,PILOT_OPENINGS[0]);g.practices=1;while(!g.scenes[s.id]?.done){g=JSON.parse(JSON.stringify(g));const l=current(g,s);if(l.decision&&!g.scenes[s.id]?.choices?.[l.decision.flag]){const body={action:'scene',id:s.id,operation:'choose',passageId:l.id,decision:l.decision.flag,option:l.decision.options[0].id};gameAction(g,body,now);const state=JSON.stringify(g);gameAction(g,{...body,option:l.decision.options.at(-1).id},now);assert.equal(JSON.stringify(g),state);}else advance(g,s);}
const legacy=freshGame(now);delete legacy.storyRevision;legacy.practices=5;legacy.supplies=400;legacy.scenes['c1-prologue']={position:3,done:false};const reset={action:'reset-pilot',token:'pilot-reset-test-1234'};assert.equal(gameAction(legacy,reset,now).reset,true);assert.equal(legacy.practices,0);assert.equal(legacy.supplies,0);assert.deepEqual(legacy.scenes,{});const resetState=JSON.stringify(legacy);assert.equal(gameAction(legacy,reset,now),undefined);assert.equal(JSON.stringify(legacy),resetState);assert.throws(()=>gameAction(legacy,{...reset,token:'different-reset-1234'},now),/already/);
assert.throws(()=>sessionAction(freshGame(now),{action:'start',readiness:'ready',companion:'solo'},Date.parse('2026-10-07T12:00:00-04:00'),1,new Set()),/rest/);
console.log(`Passed: ${paths.length} pilot paths, every choice option, required openings, introduction locks, solo rewards, all resume points, immutable decisions/replays, week-two handoff, reset retry and Wednesday.`);
