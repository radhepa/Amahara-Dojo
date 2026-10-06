import './typescript-loader.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const {freshGame,campaignMain,campaignOpenings,openingIndex,mainCompleted,sceneAvailable,requiredOpening}=await import('../lib/game.ts');
const {gameAction}=await import('../lib/game-actions.ts');
const {sessionAction}=await import('../lib/session-actions.ts');
const {MONTH_MAIN,MONTH_OPENINGS,PILOT_PROLOGUE,pilotLines,MAIN,ALL_SCENES}=await import('../lib/story/index.ts');
const {CAST,LOCATIONS,characterPortrait}=await import('../lib/story/cast.ts');
const now=Date.parse('2026-10-05T12:00:00-04:00');
function current(g,s){const save=g.scenes[s.id],list=pilotLines(s,save?.flags??g.flags,save?.choices);return list.find(l=>l.id===save?.passageId)??list[0];}
function read(g,s,picks={},reload=false){let guard=0;while(!g.scenes[s.id]?.done){assert(guard++<300,s.id);if(reload)g=JSON.parse(JSON.stringify(g));const line=current(g,s),input={action:'scene',id:s.id,operation:'advance',passageId:line.id};if(line.decision&&!g.scenes[s.id]?.choices?.[line.decision.flag])Object.assign(input,{operation:'choose',decision:line.decision.flag,option:picks[line.decision.flag]??line.decision.options[0].id});gameAction(g,input,now);const snapshot=JSON.stringify(g);gameAction(g,input,now);assert.equal(JSON.stringify(g),snapshot,'repeat action must not advance twice');}return g;}
assert.equal(MONTH_MAIN.length,24);assert.equal(MONTH_OPENINGS.length,8);assert.equal(MAIN.length,48);assert.equal(ALL_SCENES.length,80);
const scenes=[PILOT_PROLOGUE,...MONTH_MAIN,...MONTH_OPENINGS];
assert.equal(new Set(scenes.map(s=>s.id)).size,scenes.length);
const authoredOptions=new Map();
for(const s of scenes){
 assert.equal(new Set(s.lines.map(l=>l.id)).size,s.lines.length);
 if(s.kind==='main'){const words=s.lines.reduce((n,l)=>n+l.text.split(/\s+/).length,0);assert(words>=1200,`${s.id} lacks an expanded episode`);}
 for(const l of s.lines){
  assert(CAST[l.speaker],l.speaker);if(l.location)assert(LOCATIONS[l.location]);
  for(const item of [l,...(l.decision?.options.flatMap(o=>o.reply)??[])]){assert(CAST[item.speaker]);const portrait=characterPortrait(item.speaker,item.expression);if(portrait)assert(fs.existsSync('public'+portrait));}
  if(l.illustration)assert(fs.existsSync('public'+l.illustration));
  if(l.decision){assert(!authoredOptions.has(l.decision.flag),'A decision flag cannot have two owners');authoredOptions.set(l.decision.flag,l.decision.options.map(o=>o.id));}
 }
}
for(const s of scenes)for(const l of s.lines)if(l.when&&authoredOptions.has(l.when.flag))assert(authoredOptions.get(l.when.flag).includes(l.when.value),'callback must refer to an authored option');
const paths=[...authoredOptions].flatMap(([flag,options])=>options.map(option=>({[flag]:option})));
for(const repair of ['floor','welcome'])for(const access of ['open','quiet'])for(const consult of ['open','verify'])for(const mistake of ['public','direct'])paths.push({repair,access,consult,mistake});
for(const picks of paths){
 let g=read(freshGame(now),PILOT_PROLOGUE,picks);
 for(let i=0;i<24;i++){
  const opening=MONTH_OPENINGS.find(o=>openingIndex(o)===i);
  if(opening){assert.equal(requiredOpening(g)?.id,opening.id);assert(sceneAvailable(g,opening));const before=JSON.stringify({practices:g.practices,supplies:g.supplies,bonds:g.bonds,rewards:g.rewards});assert.throws(()=>sessionAction(g,{action:'start',readiness:'ready',companion:'solo'},now,1,new Set()),/opening/);assert(!sceneAvailable(g,MONTH_MAIN[i]));g=read(g,opening,picks);assert.equal(JSON.stringify({practices:g.practices,supplies:g.supplies,bonds:g.bonds,rewards:g.rewards}),before);}
  assert(!sceneAvailable(g,MONTH_MAIN[i]),'practice is still required');g.practices=i+1;assert(sceneAvailable(g,MONTH_MAIN[i]));g=read(g,MONTH_MAIN[i],picks);
 }
 assert.equal(mainCompleted(g),24);assert.equal(requiredOpening(g),undefined);g.practices=25;assert.equal(campaignMain(g)[24].id,'c1-e5-b1');assert(sceneAvailable(g,MAIN[24]));
 for(const s of MONTH_MAIN){const save=g.scenes[s.id];const replay=pilotLines(s,save.flags,save.choices);assert(replay.every(l=>!l.when||({...save.flags,...save.choices})[l.when.flag]===l.when.value));g.flags.access='later-change';assert.deepEqual(pilotLines(s,save.flags,save.choices),replay);}
 const emi=g.scenes['c1-month-w4-b1'],tin=g.scenes['c1-month-w4-b6'];
 const emiLines=pilotLines(MONTH_MAIN[18],emi.flags,emi.choices),tinLines=pilotLines(MONTH_MAIN[23],tin.flags,tin.choices);
 assert(emiLines.some(l=>l.speaker==='emi'&&l.when?.flag==='access'&&l.when.value===(picks.access??'open')));
 assert.equal(tinLines.filter(l=>l.when?.flag==='month:tin'&&l.speaker==='narrator').length,1,'the agreed tin action occurs once');
}
// JSON reload at every new passage, including immediately selected replies.
let resumed=read(freshGame(now),PILOT_PROLOGUE,{},true);
for(let i=0;i<24;i++){const opening=MONTH_OPENINGS.find(o=>openingIndex(o)===i);if(opening)resumed=read(resumed,opening,{},true);resumed.practices=i+1;resumed=read(resumed,MONTH_MAIN[i],{},true);}
assert.equal(mainCompleted(resumed),24);
// A pilot account that already opened an original later week retains that week.
const started=structuredClone(resumed);for(const s of MONTH_MAIN.slice(6))delete started.scenes[s.id];for(const s of MONTH_OPENINGS.filter(o=>o.episode>1))delete started.scenes[s.id];started.practices=7;started.scenes['c1-e2-b1']={position:2,done:false,flags:{access:'quiet'}};
const save=JSON.stringify(started.scenes['c1-e2-b1']);assert.deepEqual(campaignMain(started).slice(6,12).map(s=>s.id),MAIN.slice(6,12).map(s=>s.id));assert(!campaignOpenings(started).some(o=>o.episode===2));assert.equal(requiredOpening(started),undefined);assert(sceneAvailable(started,MAIN[6]));assert(!sceneAvailable(started,MONTH_MAIN[6]));assert.equal(JSON.stringify(started.scenes['c1-e2-b1']),save);
for(const s of MAIN.slice(6,12))started.scenes[s.id]={position:0,done:true,flags:{access:'quiet'}};started.practices=12;assert.equal(mainCompleted(started),12);assert.equal(requiredOpening(started).episode,3);assert(sceneAvailable(started,requiredOpening(started)));
const legacy=freshGame(now);delete legacy.storyRevision;assert.equal(campaignMain(legacy),MAIN);assert.deepEqual(campaignOpenings(legacy),[]);
console.log(`Passed: ${paths.length} month paths, all 24 episodes/eight openings, every option and major branch combination, portrait assets, exact callbacks, all-passage reload/retry/replay checks, old-save preservation and week-five handoff.`);
