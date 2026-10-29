// Chapter 3 demonstrations: defense, hooks and uppercuts, keyed by drill ID. Captions follow each drill's steps.
import {ACTIONS,KNEELING,READY,STAND,act,bow,combo,cut,exercise,fight,hit,lift,march,neckTurns,pivot,ready,script,shoulderCircles,shuffle,
 snap,squat,stance,trunkTurns,unready,type Builder,type MoveTable,type Phase,type Spec} from "../shadow-kit";

const walk=(b:Builder,n:number,swing=.35)=>march(b,n,.62,.025,swing);
const stepBack=(b:Builder,say:[string,string]=["Step back","Rear foot first, then the front foot. Guard high."])=>shuffle(b,"back",{say});
const stepIn=(b:Builder,say:[string,string]=["Reset","Front foot first, back to where you began."])=>shuffle(b,"forward",{say});
// The cover held in real seconds (the count stays a count when the demo is slowed).
const COVER=ACTIONS.cover.p[0][0] as Partial<Spec>;
const shell=(b:Builder,secs:number,say?:[string,string])=>{const home=snap(b,COVER);if(say)b.say(...say);return b.to(COVER,.18).wait(secs).to(home,.3);};
// The roll the other way: in on the rear side, under, and up on the lead side.
const ROLL_BACK:Phase[]=[[{tilt:.12,drop:.13,sz:.09},.18,"inOut"],[{tilt:0,drop:.22,lean:.24,sz:.05},.22,"in"],[{tilt:-.16,drop:.12,lean:.1,sz:.01},.22,"out"]];
const rollBack=(b:Builder,o:{k?:number;say?:[string,string]}={})=>act(b,ROLL_BACK,{hold:.2,back:.32,...o});
// Half-range straight punches from standing, hands raised beside the cheeks.
const halfJabs=(b:Builder,n:number)=>{b.to({leadUp:1,rearUp:1,grip:.8},.6);for(let i=0;i<n;i++)b.to({jab:.5},.3).to({jab:0},.3);for(let i=0;i<n;i++)b.to({cross:.5},.3).to({cross:0},.3);return b.to({leadUp:0,rearUp:0,grip:.3},.6);};
// Calf stretch at the wall: one foot steps back, heel down, a lean toward the wall; then the foot returns.
const calfStretch=(b:Builder)=>{b.to({wall:1,grip:.1},.9).to({weight:.65},.3);lift(b,"rear",-.36,0,.8,.03,{rearYaw:0});b.to({drop:.075,lean:.17,weight:.66},.9).breathe(1);
 b.to({drop:STAND.drop,lean:.02,weight:.4},.6);lift(b,"rear",.36,0,.8,.03,{rearYaw:STAND.rearYaw});return b.to({weight:.5,wall:0,grip:.3},.6);};

export const CHAPTER_03:MoveTable={
 "c3-warm":{make(){
  const b=script({...STAND});
  b.say("March","March gently in place; let your breathing rise a little.");walk(b,6);
  trunkTurns(b,1,{say:["Trunk turns","Slow turns, then easy shoulder circles."]});shoulderCircles(b,2);
  neckTurns(b,1,{say:["Neck","Turn the head slowly left and right, chin level. No circles."]});
  squat(b,2,{depth:.16,say:["Quarter-squats","Six slow quarter-squats."]});
  b.say("Half-range jabs","Five per hand, easy.");halfJabs(b,2);
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, eyes on your point, a small bow."]});
  ready(b,{say:["Guard up","Step into your stance; guard up on one sharp breath out."]});
  b.say("Stillness","One breath of stillness. Practice begins.").breathe(1);
  unready(b);
  return b.done(exercise({title:"Trunk, neck and knees"}));
 }},
 "c3-cool":{make(){
  const b=script({...STAND});
  b.say("Walk it out","Hands down. Walk slowly, shake out the arms; head still and level.");walk(b,6,.5);
  trunkTurns(b,1,{say:["Trunk rotation","Gentle and slow."]});
  b.say("Calf stretch","Against the wall, 15–20 seconds each side.");calfStretch(b);
  neckTurns(b,1,{say:["Neck turns","Slow turns each way."]});
  b.say("Breathe","In for 4, out for 6. One clean defense, one that needs work.").to({inhale:1},1.6).to({inhale:0},2.4);
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, a small bow."]});
  return b.done(exercise({title:"Settle the spine",props:{wall:.55}}));
 }},
 "c3-cover":{speed:1,make(){
  const b=script(stance());
  b.say("Guard","Eyes on your point.").wait(.8);
  shell(b,1.6,["Cover","Fists to the forehead, elbows in front of the ribs. Two counts; keep breathing."]);
  hit(b,"jab",{say:["Answer","Open to guard and answer with a jab. Then guard home."]});
  b.wait(1);
  shell(b,1.2,["Round 3","Cover…"]);stepBack(b,["Round 3","…then step back out of range and reset your guard."]);
  b.wait(1);stepIn(b);b.wait(.8);
  return b.done(fight(false,{title:"High cover and guard recovery"}));
 }},
 "c3-parry":{speed:1,make(){
  const b=script(stance());
  b.say("Ready","Picture a jab coming from your point.").wait(.9);
  hit(b,"parryRear",{say:["Rear-hand parry","Open palm just in front of the face; a small push toward the lead shoulder."]});b.wait(1);
  hit(b,"parryLead",{say:["Lead-hand parry","Picture a cross: the lead palm turns it aside, then returns."]});b.wait(1);
  b.say("Parry-jab","Catch with the rear hand, answer with your jab.");combo(b,["parryRear","jab"]);
  b.say("Small","Near the centre line, never a big swipe. Eyes on the point.").wait(1.3);
  return b.done(fight(false,{title:"Parries in the air",trail:true}));
 }},
 "c3-slip":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.say("Picture a jab","Coming at your nose. Eyes on the point.").wait(1);
  hit(b,"slipRight",{hold:.5,say:["Slip {r}","Knees bend, shoulders turn: the head moves a hand's width outside."]});
  b.say("Centre","Straight back, guard up. The head stays above your stance.").wait(1.4);
  hit(b,"slipLeft",{hold:.5,say:["Slip {l}","The same small distance. Knees and shoulders, not the waist."]});
  b.say("Centre","Slowly: one slip every 3–4 seconds.").wait(1.6);
  return b.done(fight(s,{title:"The slip",view:"front"}));
 }},
 "c3-roll":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.say("Picture a hook","At head height from your lead side.").wait(1);
  hit(b,"roll",{say:["Roll","Knees bend, back long: down, across under the hook, and up."]});
  b.say("Up","Full stance and guard. No deeper than a quarter squat.").wait(1.6);
  rollBack(b,{say:["Other way","The same shallow U in the other direction."]});b.wait(1.4);
  hit(b,"roll",{say:["Round 3","Roll…"]});hit(b,"jab",{say:["Round 3","…then jab as you rise."]});
  b.wait(1.2);
  return b.done(fight(s,{title:"The roll",view:"front"}));
 }},
 "c3-exits":{speed:1,make(){
  const b=script(stance());
  b.wait(.8);stepBack(b,["Step-back exit","Rear foot first, then the front foot. Guard high, eyes forward."]);
  b.say("Stop","Still in stance, guard up.").wait(1.2);stepIn(b);b.wait(.8);
  pivot(b,.8,{k:1.6,say:["Pivot exit","Turn on the ball of the front foot; the rear foot swings a short arc."]});
  b.say("New angle","A quarter turn or less. Feet never cross.").wait(1.4);
  pivot(b,-.8,{k:1.6,say:["Pivot back","The same way back. Check: still in stance, guard up."]});
  b.wait(1.2);
  return b.done(fight(false,{title:"Step-back and pivot exits",view:"above"}));
 }},
 "c3-hook":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.say("Guard","Eyes on your point.").wait(.9);
  hit(b,"leadHook",{say:["Lead hook","Arm bent at shoulder height; hips and shoulders turn, lead heel out. Breathe out."]});
  b.say("Home",s?"No wider than the shoulder line. Turn back, hand to guard.":"No wider than the shoulders; the rear hand stays on the cheek.").wait(1.4);
  b.say("Round 3","Jab, then the hook from the returning jab.");combo(b,["jab","leadHook"]);
  b.wait(1.3);
  return b.done(fight(s,{title:"Lead hook",trail:true}));
 }},
 "c3-counters":{speed:1,make(){
  const b=script(stance());
  b.wait(.8);
  b.say("Slip-2","Slip outside the imagined jab…");hit(b,"slipRight");hit(b,"cross",{say:["Slip-2","…and the cross as the head comes back to centre."]});
  b.say("Pause","Feet planted and apart.").wait(1.3);
  b.say("Parry-1","Catch the jab with the rear hand…");hit(b,"parryRear");hit(b,"jab",{say:["Parry-1","…and answer at once with your jab."]});
  b.say("Pause","The answer starts only when the defense is complete.").wait(1.5);
  return b.done(fight(false,{title:"Defense into counter",trail:true}));
 }},
 "c3-uppercut":{speed:1,make(){
  const b=script(stance());
  b.wait(.8);
  hit(b,"rearUpper",{say:["Rear uppercut","Hand drops a little, palm to you; heel and hip turn, the fist drives up."]});
  b.say("Home","Straight home. No higher than your own chin. Breathe out.").wait(1.3);
  hit(b,"leadUpper",{say:["Lead uppercut","The same on the lead side, with a small turn the other way."]});
  b.say("Home","Close, short, up through the chin line.").wait(1.3);
  return b.done(fight(false,{title:"Short uppercuts",trail:true}));
 }},
 "c3-curves":{speed:1,make(){
  const b=script(stance());
  b.wait(.8);
  combo(b,["jab","cross","leadHook"],{says:[["1-2-hook","Jab…"],["1-2-hook","…cross: its turn loads…"],["1-2-hook","…the lead hook."]]});
  b.say("Hold","Guard home, eyes on the point for one count.").wait(1.3);
  combo(b,["rearUpper","leadHook"],{says:[["Uppercut-hook","Rear uppercut…"],["Uppercut-hook","…then lead hook. Both short, driven by the hips."]]});
  b.say("Hold","If either strike widens, slow down.").wait(1.4);
  return b.done(fight(false,{title:"Hook and uppercut, guard home",trail:true}));
 }},
 "c3-flow":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);
  shell(b,1.2,["Cover","Two counts, then open."]);b.wait(.4);
  hit(b,"parryRear",{say:["Parry","Catch the imagined jab."]});b.wait(.4);
  hit(b,"slipRight",{say:["Slip","Outside the punch and back."]});b.wait(.4);
  hit(b,"roll",{say:["Roll","Under the imagined hook."]});b.wait(.4);
  stepBack(b,["Step back","Each defense comes home before the next."]);b.wait(.4);
  combo(b,["jab","cross"],{says:[["Rounds 3–4","Finish the chain with a 1-2."],undefined]});
  b.wait(.8);stepIn(b);b.wait(.6);
  return b.done(fight(false,{title:"Defense flow"}));
 }},
 "c3-mobility":{make(){
  const b=script({...STAND});
  trunkTurns(b,2,{say:["Trunk rotations","Slow, within a comfortable range."]});
  neckTurns(b,1,{say:["Head turns","Left and right with the chin level. Never neck circles."]});
  cut(b,{...STAND,...KNEELING});
  b.say("Cat-cow","Hands and knees: round the back slowly…").to({tuck:.09,drop:.47,lean:1.4},1.6).wait(.4);
  b.say("Cat-cow","…then arch it slowly.").to({tuck:-.03,drop:.52,lean:1.55},1.6).wait(.4).to({tuck:KNEELING.tuck!,drop:KNEELING.drop!,lean:KNEELING.lean!},1.2);
  cut(b,{...STAND});
  b.say("Rest","Hands down. Recovery, not a workout.").breathe(1);
  return b.done(exercise({title:"Spine and neck care"}));
 }},
 "c3-strength":{make(){
  const b=script({...STAND});
  b.say("Open book","Standing version: arms out in front…").to({lReach:1,rReach:1,lX:.45,lY:.42,lZ:-.1,rX:.45,rY:.42,rZ:.1,grip:.2},.9);
  b.say("Open book","…open one arm across; the eyes follow it.").to({rX:-.05,rZ:.55,chestYaw:.6,headYaw:.5},1.8).wait(.6).to({rX:.45,rZ:.1,chestYaw:0,headYaw:0},1.6);
  b.say("Open book","Switch sides halfway.").to({lReach:0,rReach:0,grip:.3},.7);
  squat(b,2,{depth:.36,say:["Squat to chair","Sit back as if to the seat and stand: chest up, knees over toes."]});
  b.say("Side plank","Standing version: a sideways forearm lean on the wall, body in one line.").to({lReach:1,lX:0,lY:.42,lZ:-.5,lEl:1,sz:-.05,tilt:-.15,grip:.2},1).breathe(2).to({lReach:0,lEl:0,sz:0,tilt:0,grip:.3},.9);
  neckTurns(b,1,{say:["Neck mobility","Slow turns within a comfortable range. Never forced circles."]});
  b.say("Stop early","End each exercise 2–3 reps before it gets hard.").wait(1);
  return b.done(exercise({title:"Trunk and legs for defense"}));
 }},
 "c3-selfcheck":{speed:1,make(){
  const b=script(stance());
  b.say("Usual lead","Three defenses, slow. Watch the form checks.").wait(.6);
  hit(b,"slipRight",{k:1.4});b.wait(.6);hit(b,"roll",{k:1.4});b.wait(.6);shell(b,1);b.wait(.6);
  b.say("Other lead","The same. Which side and which defense is cleaner?").wait(1.6);
  b.say("Round 3","Repeat whichever needed the most help, slowly.").wait(1.4);
  b.say("Review","One repeatable defense, one correction for next week.").wait(1.4);
  return b.done(fight(false,{title:"Defense self-check"}));
 }},
 "c3-trial-1":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);
  b.say("Round 1","Slow slips to both sides; the head returns to centre.");hit(b,"slipRight",{k:1.3});b.wait(.5);hit(b,"slipLeft",{k:1.3});b.wait(.8);
  b.say("Round 2","Slow rolls: knees bend, back stays long.");hit(b,"roll",{k:1.3});b.wait(.5);rollBack(b,{k:1.3});b.wait(.8);
  b.say("Round 3","Lead hook, rear uppercut, then 1-2-hook. The guard returns.");
  hit(b,"leadHook");b.wait(.6);hit(b,"rearUpper");b.wait(.6);combo(b,["jab","cross","leadHook"]);
  b.say("Mark it honestly","'Not yet' means repeat a week; it never blocks the story.").wait(1.6);
  return b.done(fight(false,{title:"Trial · slips, rolls and curves",trail:true}));
 }},
 "c3-trial-2":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);
  b.say("Round 1 · slip-2","Slip outside, cross as the head returns.");hit(b,"slipRight");hit(b,"cross");b.wait(1.2);
  b.say("Round 2 · parry-1","Rear-hand catch, then your jab.");hit(b,"parryRear");hit(b,"jab");b.wait(1.2);
  b.say("Rounds 3–4","A pair of your choice, then a compact hook; guard returns.");hit(b,"slipRight");hit(b,"cross");b.wait(.4);hit(b,"leadHook");
  b.say("Review","Which pair flowed, and which needs another week?").wait(1.6);
  return b.done(fight(false,{title:"Trial · defense into counter",trail:true}));
 }},
};
