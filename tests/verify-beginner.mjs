import assert from 'node:assert/strict';
import './typescript-loader.mjs';
const {makePlan,dateKey,dayIndex,DRILLS}=await import('../lib/training.ts');
const {beginnerProgress}=await import('../lib/beginner.ts');
const {LEVELS}=await import('../lib/levels.ts');
for(let w=1;w<=8;w++)for(let d=0;d<7;d++){const p=makePlan(d,'ready',w);assert.equal(p.minutes,[30,30,0,45,40,30,30][d]);assert.equal(p.blocks.reduce((n,b)=>n+b.seconds,0),p.minutes*60);for(const b of p.blocks)assert.ok(DRILLS[b.id]);assert.equal(makePlan(d,'pain',w).minutes,0);assert.equal(makePlan(d,'tired',w).minutes,p.minutes);}
assert.ok(makePlan(3,'ready',1).blocks.some(b=>b.id==='shift'));assert.ok(makePlan(3,'ready',3).blocks.some(b=>b.id==='step'));assert.ok(makePlan(3,'ready',5).blocks.some(b=>b.id==='guard'));assert.ok(makePlan(3,'ready',7).blocks.some(b=>b.id==='sequence'));
const today='2026-10-03';const records=Array.from({length:48},(_,i)=>{const d=new Date('2026-08-08T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return {date:d.toISOString().slice(0,10),kind:'training',minutes:30,day:0,readiness:'ready',note:''};});
const checks=Array.from({length:8},(_,i)=>({week:i+1,goals:[true,true,true]}));
assert.equal(beginnerProgress([],checks,today).week,1);assert.equal(beginnerProgress(records,[],today).week,1);assert.equal(beginnerProgress(records,checks,today).week,8);assert.equal(beginnerProgress(records,checks,today).complete,true);assert.equal(beginnerProgress(records.map(r=>({...r,kind:'partial'})),checks,today).week,1);assert.equal(LEVELS.length,10);
assert.equal(dateKey(new Date('2026-10-04T02:00:00Z')),'2026-10-03');assert.equal(dayIndex(new Date('2026-10-04T02:00:00Z')),5);
console.log('Passed: durations, rest protection, weekly drill progression, honest week gates, ten-level roadmap, and local date boundaries.');
