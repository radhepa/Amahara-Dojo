import assert from 'node:assert/strict';
import './typescript-loader.mjs';
const {makePlan,dateKey,dayIndex,DRILLS}=await import('../lib/training.ts');
const {beginnerProgress}=await import('../lib/beginner.ts');
const {LEVELS}=await import('../lib/levels.ts');
const {roundTiming,practicePhase}=await import('../lib/week-one.ts');
for(let w=1;w<=8;w++)for(let d=0;d<7;d++){const p=makePlan(d,'ready',w);assert.equal(p.minutes,(w===1?[30,30,0,30,30,30,30]:[30,30,0,45,40,30,30])[d]);assert.equal(p.blocks.reduce((n,b)=>n+b.seconds,0),p.minutes*60);for(const b of p.blocks)assert.ok(DRILLS[b.id]);assert.equal(makePlan(d,'pain',w).minutes,0);assert.equal(makePlan(d,'tired',w).minutes,p.minutes);assert.doesNotMatch(JSON.stringify(p),/lifting|sprints|upper day|lower day|your run/i);}
const firstWeekIds=new Set();
for(let d=0;d<7;d++)for(const b of makePlan(d,'ready',1).blocks){
 firstWeekIds.add(b.id);assert.ok(DRILLS[b.id].timedRounds,`Missing timed rounds for ${b.id}`);assert.equal(DRILLS[b.id].checkpoints.length,2);
 const t=roundTiming(b.seconds);assert.ok(t.rounds>=3);assert.equal(t.work,t.rest);assert.equal(t.setup+t.rounds*(t.work+t.rest)+t.review,b.seconds);assert.equal(t.review,60);
}
for(const id of ['w1-stance','w1-guard','w1-shift','w1-forward','w1-side','w1-flow'])assert.ok(firstWeekIds.has(id));
assert.deepEqual(makePlan(3,'ready',1).blocks,makePlan(3,'tired',1).blocks,'Seated preparation keeps the agreed duration and rewards');
assert.equal(practicePhase(300,0).kind,'setup');assert.equal(practicePhase(300,59).remaining,1);assert.equal(practicePhase(300,60).kind,'work');assert.equal(practicePhase(300,89).remaining,1);assert.equal(practicePhase(300,90).kind,'rest');assert.equal(practicePhase(300,120).round,2);assert.equal(practicePhase(300,240).kind,'review');assert.equal(practicePhase(300,300).kind,'complete');
assert.ok(makePlan(3,'ready',2).blocks.some(b=>b.id==='shift'));assert.ok(makePlan(3,'ready',3).blocks.some(b=>b.id==='step'));assert.ok(makePlan(3,'ready',5).blocks.some(b=>b.id==='guard'));assert.ok(makePlan(3,'ready',7).blocks.some(b=>b.id==='sequence'));
const today='2026-10-03';const records=Array.from({length:48},(_,i)=>{const d=new Date('2026-08-08T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return {date:d.toISOString().slice(0,10),kind:'training',minutes:30,day:0,readiness:'ready',note:''};});
const checks=Array.from({length:8},(_,i)=>({week:i+1,goals:[true,true,true]}));
assert.equal(beginnerProgress([],checks,today).week,1);assert.equal(beginnerProgress(records,[],today).week,1);assert.equal(beginnerProgress(records,checks,today).week,8);assert.equal(beginnerProgress(records,checks,today).complete,true);assert.equal(beginnerProgress(records.map(r=>({...r,kind:'partial'})),checks,today).week,1);assert.equal(LEVELS.length,10);
assert.equal(dateKey(new Date('2026-10-04T02:00:00Z')),'2026-10-03');assert.equal(dayIndex(new Date('2026-10-04T02:00:00Z')),5);
console.log('Passed: durations, rest protection, weekly drill progression, honest week gates, ten-level roadmap, and local date boundaries.');
