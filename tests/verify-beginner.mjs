import assert from 'node:assert/strict';
import './typescript-loader.mjs';
const {makePlan,dateKey,dayIndex,DRILLS}=await import('../lib/training.ts');
const {beginnerProgress}=await import('../lib/beginner.ts');
const {LEVELS}=await import('../lib/levels.ts');
const {roundTiming,practicePhase}=await import('../lib/week-one.ts');
const {drillPhase,bellCues}=await import('../lib/practice-timing.ts');
const {FOUNDATION_DRILLS,foundationLibrary,MAX_PRACTICE_MINUTES}=await import('../lib/foundations.ts');
const durations=[[30,30,0,30,30,30,30],[30,30,0,30,30,30,30],[30,30,0,35,30,35,30],[30,30,0,35,30,35,30],[30,30,0,40,30,35,30],[30,30,0,40,30,35,30],[30,30,0,40,30,35,30],[30,30,0,30,30,30,30]];
let practiceCount=0;
for(let w=1;w<=8;w++)for(let d=0;d<7;d++){
 const p=makePlan(d,'ready',w);assert.equal(p.minutes,durations[w-1][d]);assert.equal(p.blocks.reduce((n,b)=>n+b.seconds,0),p.minutes*60);assert.ok(p.minutes<=MAX_PRACTICE_MINUTES);
 assert.equal(makePlan(d,'pain',w).minutes,0);assert.equal(makePlan(d,'tired',w).minutes,p.minutes);assert.deepEqual(makePlan(d,'tired',w).blocks,p.blocks,'Gentle alternatives retain the same time and reward eligibility');
 assert.doesNotMatch(JSON.stringify(p),/lifting|sprints|upper day|lower day|your run/i);
 if(d===2){assert.deepEqual(p.blocks,[]);continue;}practiceCount++;
 assert.deepEqual(p.blocks[0],{id:'f2-warm',seconds:300});assert.deepEqual(p.blocks.at(-1),{id:'f2-cool',seconds:300});
 for(const b of p.blocks){
  const lesson=DRILLS[b.id];assert(lesson);assert.equal(lesson.steps.length,4);assert(lesson.easier&&lesson.avoid);assert.equal(lesson.checkpoints.length,2);
  if(lesson.timedRounds){const t=roundTiming(b.seconds);assert.equal(t.rounds,3);assert.equal(t.work,30);assert.equal(t.rest,30);assert.equal(t.setup+t.rounds*(t.work+t.rest)+t.review,b.seconds);}
 }
}
assert.equal(practiceCount,48);
const firstWeekIds=new Set();
for(let d=0;d<7;d++)for(const b of makePlan(d,'ready',1).blocks){
 firstWeekIds.add(b.id);if(!DRILLS[b.id].timedRounds)continue;assert.equal(DRILLS[b.id].checkpoints.length,2);
 const t=roundTiming(b.seconds);assert.ok(t.rounds>=3);assert.equal(t.work,t.rest);assert.equal(t.setup+t.rounds*(t.work+t.rest)+t.review,b.seconds);assert.equal(t.review,60);
}
for(const id of ['f2-stance','f2-guard','f2-shift','f2-forward','f2-side','f2-flow'])assert.ok(firstWeekIds.has(id));
assert.deepEqual(makePlan(3,'ready',1).blocks,makePlan(3,'tired',1).blocks,'Seated preparation keeps the agreed duration and rewards');
assert.equal(practicePhase(300,0).kind,'setup');assert.equal(practicePhase(300,59).remaining,1);assert.equal(practicePhase(300,60).kind,'work');assert.equal(practicePhase(300,89).remaining,1);assert.equal(practicePhase(300,90).kind,'rest');assert.equal(practicePhase(300,120).round,2);assert.equal(practicePhase(300,240).kind,'review');assert.equal(practicePhase(300,300).kind,'complete');
for(const [w,id] of [[2,'stop'],[3,'four'],[4,'moving-guard'],[5,'distance'],[6,'corner'],[7,'choice'],[8,'review']]){
 assert(makePlan(3,'ready',w).blocks.some(b=>b.id===`f2-${id}`));assert(foundationLibrary(w)[`f2-${id}`]);assert(!foundationLibrary(w-1)[`f2-${id}`]);
}
assert.deepEqual(Object.keys(foundationLibrary(8)).sort(),Object.keys(FOUNDATION_DRILLS).sort());
// Saved legacy plans retain their IDs, doses, and timing implementation.
for(const id of ['warm','ankle','hinge','stance','step','cool','shift','guard','sequence','w1-forward','w1-stance'])assert(DRILLS[id]);
assert.equal(roundTiming(600).rounds,8);
assert.deepEqual(bellCues(DRILLS['f2-stance'],300),[60,90,120,150,180,210,240,300].map(at=>({at,finish:at===300})));
assert.deepEqual(bellCues(DRILLS['f2-warm'],300),[{at:30,finish:false},{at:300,finish:true}]);
assert.deepEqual(bellCues(DRILLS['f2-cool'],300),[{at:300,finish:true}]);
assert.equal(drillPhase(DRILLS['f2-warm'],300,29).kind,'setup');assert.equal(drillPhase(DRILLS['f2-warm'],300,30).kind,'work');assert.equal(drillPhase(DRILLS['f2-warm'],300,299).remaining,1);assert.equal(drillPhase(DRILLS['f2-cool'],300,300).kind,'complete');
const today='2026-10-03';const records=Array.from({length:48},(_,i)=>{const d=new Date('2026-08-08T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return {date:d.toISOString().slice(0,10),kind:'training',minutes:30,day:0,readiness:'ready',note:''};});
const checks=Array.from({length:8},(_,i)=>({week:i+1,goals:[true,true,true]}));
assert.equal(beginnerProgress([],checks,today).week,1);assert.equal(beginnerProgress(records,[],today).week,1);assert.equal(beginnerProgress(records,checks,today).week,8);assert.equal(beginnerProgress(records,checks,today).complete,true);assert.equal(beginnerProgress(records.map(r=>({...r,kind:'partial'})),checks,today).week,1);assert.equal(LEVELS.length,10);
assert.equal(dateKey(new Date('2026-10-04T02:00:00Z')),'2026-10-03');assert.equal(dayIndex(new Date('2026-10-04T02:00:00Z')),5);
console.log('Passed: durations, rest protection, weekly drill progression, honest week gates, ten-level roadmap, and local date boundaries.');
