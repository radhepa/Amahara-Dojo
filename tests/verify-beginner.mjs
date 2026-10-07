import assert from 'node:assert/strict';
import './typescript-loader.mjs';
const {makePlan,dateKey,dayIndex,DRILLS}=await import('../lib/training.ts');
const {beginnerProgress}=await import('../lib/beginner.ts');
const {MILESTONES,MILESTONE_NOTE,earnedMilestones,stageLabel}=await import('../lib/levels.ts');
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
assert.equal(beginnerProgress([],checks,today).week,1);assert.equal(beginnerProgress(records,[],today).week,1);assert.equal(beginnerProgress(records,checks,today).week,8);assert.equal(beginnerProgress(records,checks,today).complete,true);assert.equal(beginnerProgress(records.map(r=>({...r,kind:'partial'})),checks,today).week,1);assert.equal(MILESTONES.length,10);
assert.equal(dateKey(new Date('2026-10-04T02:00:00Z')),'2026-10-03');assert.equal(dayIndex(new Date('2026-10-04T02:00:00Z')),5);

// ---- Chapters 2–10: the whole solo programme (docs/training-architecture.md) ----
const C=await import('../lib/curriculum/index.ts');
const B=await import('../lib/blocks.ts');
const {SOURCES}=await import('../lib/curriculum/sources.ts');
const {weekInfo,lastPlayableWeek}=await import('../lib/beginner.ts');
const {MAIN}=await import('../lib/story/index.ts');
assert.equal(C.CHAPTERS.length,10);assert.equal(C.PROGRAMME_WEEKS,68);
assert.deepEqual(C.CHAPTERS.map(c=>c.weeks),[8,6,6,6,8,6,8,6,8,6]);
assert.deepEqual(C.CHAPTERS.map(c=>c.firstWeek),[1,9,15,21,27,35,41,49,55,63]);
let totalPractices=0,newPractices=0;const used=new Set();
for(let w=1;w<=68;w++){
 const chapter=C.chapterForWeek(w);const schedule=C.programmeSchedule(w);assert.equal(schedule.length,7);
 assert.equal(weekInfo(w).goals.length,3,`Week ${w} has three check-in goals`);
 for(let d=0;d<7;d++){
  const p=makePlan(d,'ready',w);
  if(d===2){assert.deepEqual(p.blocks,[]);assert.equal(p.minutes,0);continue;}
  totalPractices++;if(w>8)newPractices++;
  assert.ok(p.minutes>=30&&p.minutes<=40,`Week ${w} day ${d} stays within 30–40 minutes (${p.minutes})`);assert.ok(p.minutes<=MAX_PRACTICE_MINUTES);
  assert.equal(makePlan(d,'pain',w).minutes,0);assert.deepEqual(makePlan(d,'tired',w).blocks,p.blocks,'Gentle practice keeps the same plan and rewards');
  if(w<=8)continue;
  const pw=C.programmeWeek(w);assert.equal(p.minutes,C.FEEL_MINUTES[pw.feel][d],`Week ${w} ${pw.feel} day ${d} matches the weekly rhythm`);
  assert.equal(p.blocks[0].seconds,300);assert.equal(DRILLS[p.blocks[0].id].timing,'warmup');assert.equal(p.blocks.at(-1).seconds,300);assert.equal(DRILLS[p.blocks.at(-1).id].timing,'cooldown');
  assert.ok(p.blocks.length>=4&&p.blocks.length<=8);
  for(const b of p.blocks){
   const lesson=DRILLS[b.id];assert(lesson,`Drill ${b.id} exists`);used.add(b.id);
   assert.equal(lesson.steps.length,4);assert.equal(lesson.checkpoints.length,2);assert(lesson.avoid&&lesson.cue&&lesson.dose);
   assert.equal(b.seconds,B.blockMinutes(lesson)*60,`${b.id} keeps its format's length`);
   if(lesson.format)assert.ok(w>=C.FORMAT_FROM[lesson.format],`${b.id} (${lesson.format}) is not used before week ${C.FORMAT_FROM[lesson.format]}`);
   const chapterOf=Number(/^c(\d+)-/.exec(b.id)?.[1]??1);assert.ok(chapterOf<=chapter.chapter,`${b.id} never comes from a later chapter`);
  }
  if(pw.feel.includes('Trial')&&d===5)assert.ok(p.blocks.some(b=>DRILLS[b.id].category.endsWith('Chapter trial')),`Week ${w} Saturday is the chapter trial`);
 }
}
assert.equal(totalPractices,408);assert.equal(newPractices,360);
// Every new drill is assigned somewhere and names standing, supported and seated versions.
for(const [id,d] of Object.entries(C.CURRICULUM_DRILLS)){
 assert.ok(used.has(id),`${id} is assigned in a practice`);
 assert.match(d.easier,/^Supported: .+ Seated: .+/,`${id} names supported and seated versions`);
 assert.match(d.category,/^Chapter (\d+) · /);
 for(const key of d.sources??[])assert.ok(SOURCES[key],`${id} cites a known source`);
 assert.doesNotMatch(d.steps.join(' '),/partner|sparring|instructor|coach|training buddy|heavy bag|someone else/i,`${id} stays solo`);
 if(/Kicks|Chapter trial/.test(d.category)&&/kick/i.test(d.name))assert.match(d.steps.join(' ')+d.avoid+d.checkpoints.join(' '),/hip|high kicks?/i,`${id} keeps kicks at or below the hip`);
}
for(const key of Object.keys(SOURCES))assert.ok(Object.values(C.CURRICULUM_DRILLS).some(d=>d.sources?.includes(key)),`Source ${key} is cited`);
// Trial weeks end each chapter; check-in goals stay honest and never require a pass.
for(const c of C.CHAPTERS.slice(1)){const last=c.firstWeek+c.weeks-1;assert.ok(C.programmeWeek(last).feel.includes('Trial'));assert.match(weekInfo(last).goals[1],/honestly/);assert.equal(c.trial.checks.length,4);}
// Block formats: every timeline fills its block, and the bell rings at every phase change.
const byFormat=f=>Object.values(C.CURRICULUM_DRILLS).find(d=>d.format===f&&!d.minutes&&(f!=='H'||d.hold===20));
const bells=(d,sec)=>bellCues(d,sec).map(c=>c.at);
assert.deepEqual(bells(byFormat('B'),300),[30,70,90,130,150,190,210,250,270,300]);
assert.deepEqual(bells(byFormat('F'),300),[30,70,90,130,150,190,210,250,270,300]);
assert.deepEqual(bells(byFormat('S'),300),[30,70,90,130,150,190,210,250,270,300]);
assert.deepEqual(bells(byFormat('H'),300),[60,80,100,120,140,160,180,300]);
assert.deepEqual(bells(byFormat('C'),600),[60,180,240,360,420,540,600]);
assert.deepEqual(bells(byFormat('D'),600),[30,210,270,450,510,600]);
assert.deepEqual(bells(byFormat('G'),600),[60,420,600]);
assert.deepEqual(bells(byFormat('E'),300),[30,135,165,270,300]);
assert.deepEqual(bells(DRILLS['c7-form'],600),[60,270,330,510,600]);
assert.deepEqual(bells(DRILLS['c9-hold'],300),[60,90,120,150,180,210,240,300]);
for(const d of Object.values(C.CURRICULUM_DRILLS)){if(!d.format||d.format==='A')continue;const sec=B.blockMinutes(d)*60;const t=B.blockTimeline(d,sec);assert.equal(t.at(-1).start+t.at(-1).length,sec);assert.equal(drillPhase(d,sec,sec).kind,'complete');assert.equal(drillPhase(d,sec,0).kind,'setup');}
assert.equal(drillPhase(DRILLS['c2-core'],300,35).label,'Dead bug · 1 of 4');assert.match(drillPhase(DRILLS['c2-core'],300,75).label,/next: Bird dog/);
assert.equal(drillPhase(DRILLS['c6-form'],300,170).label,'Count-tempo run');assert.equal(drillPhase(DRILLS['c6-form'],300,170).count,true);
// Cue scheduler (Chapter 7): deterministic per session block, inside cued rounds, never rushed.
const cueDrill=DRILLS['c7-cue-defense'];const cues=B.cueSchedule(cueDrill,300,'session-1:3');
assert.deepEqual(B.cueSchedule(cueDrill,300,'session-1:3'),cues,'The same block always gets the same calls');
assert.notDeepEqual(B.cueSchedule(cueDrill,300,'session-2:3'),cues,'A different session gets different calls');
assert.ok(cues.length>=16&&cues.length<=40);
const cuedSegs=B.blockTimeline(cueDrill,300).filter(s=>s.cued);assert.equal(cuedSegs.length,4);
for(const c of cues){const seg=cuedSegs.find(s=>c.at>=s.start&&c.at<s.start+s.length);assert(seg,'Calls only come in practice rounds');assert.ok(c.at>=seg.start+2&&c.at<=seg.start+seg.length-2);assert.ok(c.cue>=0&&c.cue<cueDrill.cues.length);}
for(let i=1;i<cues.length;i++){const same=cuedSegs.find(s=>cues[i].at>=s.start&&cues[i].at<s.start+s.length)===cuedSegs.find(s=>cues[i-1].at>=s.start&&cues[i-1].at<s.start+s.length);if(same)assert.ok(cues[i].at-cues[i-1].at>=cueDrill.cueGap[0]-0.01);if(i>=2)assert.ok(!(cues[i].cue===cues[i-1].cue&&cues[i-1].cue===cues[i-2].cue),'No call three times running');}
assert.equal(B.currentCue(cueDrill,300,'session-1:3',cues[0].at+.5).call,cueDrill.cues[cues[0].cue].call);assert.equal(B.currentCue(cueDrill,300,'session-1:3',1),undefined);
// Steady count (Chapter 9): metronome beats only in count phases, accent on count one, adjustable tempo.
const countDrill=DRILLS['c9-count-base'];const beats=B.countBeats(countDrill,600,56);
assert.ok(beats.every(b=>b.at>60&&b.at<420));assert.ok(Math.abs(beats[0].at-(60+60/56))<0.01);
for(let i=1;i<beats.length;i++)assert.ok(Math.abs(beats[i].at-beats[i-1].at-60/56)<0.01);
assert.ok(beats.filter(b=>b.accent).every(b=>b.beat===1));assert.equal(beats.filter(b=>b.accent).length,Math.ceil(beats.length/8));
assert.equal(B.countTempo(countDrill,8),64);assert.equal(B.countTempo(countDrill,-100),B.COUNT_TEMPO_RANGE[0]);assert.equal(B.countTempo(DRILLS['c2-jab'],8),0);
assert.equal(B.countBeats(DRILLS['c6-form'],300,40).every(b=>b.at>=165&&b.at<270),true,'Form blocks tick only in the count-tempo run');
// Story gate: a chapter's curriculum opens with its story and never runs ahead of it.
assert.ok(C.STORY_READY_CHAPTERS>=1&&C.STORY_READY_CHAPTERS<=10);
assert.ok(C.playableWeeks()*6<=MAIN.length,'Playable training never outruns the playable story');
assert.equal(lastPlayableWeek(),C.playableWeeks());
const longRecords=Array.from({length:420},(_,i)=>{const d=new Date('2025-01-01T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return {date:d.toISOString().slice(0,10),kind:'training',minutes:35,day:0,readiness:'ready',note:''};});
const allChecks=Array.from({length:68},(_,i)=>({week:i+1,goals:[true,true,true]}));
const capped=beginnerProgress(longRecords,allChecks,'2026-10-07');
assert.equal(capped.week,C.playableWeeks());assert.equal(capped.complete,true);assert.equal(capped.chapter,C.STORY_READY_CHAPTERS);
assert.deepEqual(earnedMilestones(capped),Array.from({length:C.STORY_READY_CHAPTERS},(_,i)=>i+1));
for(const g of C.programmeLibrary(C.playableWeeks()))assert.ok(g.chapter.chapter<=C.STORY_READY_CHAPTERS,'The technique library hides unopened chapters');
assert.ok(Object.keys(C.programmeLibrary(9)[0].drills).includes('c2-jab'));assert.ok(!Object.keys(C.programmeLibrary(9)[0].drills).includes('c2-cross'));
// Solo milestones replace instructor levels: practice records, never ranks.
assert.deepEqual(MILESTONES.map(m=>m.name),['Foundations','Hands','Guard','Kicks','Combinations','Anywhere','Form','Endurance','Steady Count','Lifelong']);
assert.equal(MILESTONE_NOTE,'This records your practice and self-review. It is not a rank or a measure of fighting ability.');
assert.equal(MILESTONES.at(-1).totalPractices,408);assert.equal(stageLabel(1),'Chapter 1 · Foundations');assert.equal(stageLabel(40),'Chapter 6 · Anywhere');assert.equal(stageLabel(70),'Continuing practice');
assert.deepEqual(earnedMilestones({week:15,complete:false}),[1,2]);assert.deepEqual(earnedMilestones({week:8,complete:true}),[1]);assert.deepEqual(earnedMilestones({week:8,complete:false}),[]);
assert.doesNotMatch(JSON.stringify(MILESTONES),/instructor|coach|partner|sparring/i);
// After Chapter 10: a seven-week rotation with a lighter seventh week.
for(let w=69;w<=83;w++){const s=C.programmeSchedule(w);assert.equal(s.length,7);assert.equal(C.continuingSource(w),C.CONTINUING_ROTATION[(w-69)%7]);assert.equal(weekInfo(w).goals.length,3);}
assert.equal(C.programmeWeek(75).feel,'Recovery');
console.log('Passed: durations, rest protection, weekly drill progression, honest week gates and local date boundaries; 68 weeks / 408 practices across ten chapters, weekly rhythm and feel tags, 30–40 minute plans, every block format and bell, deterministic cue calls, the steady count, story-gated curriculum, and ten solo milestones.');
