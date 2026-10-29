// Chapter 2 demonstrations: the straight punches, keyed by drill ID. Captions follow each drill's steps.
import {ACTIONS,FIGHT,READY,STAND,armSwings,bow,birdDog,bridge,combo,cut,deadBug,doubleJab,exercise,fight,goalposts,heelTurn,hit,
 KNEELING,march,pose,ready,script,shoulderCircles,shuffle,snap,stance,stepJab,SUPINE,unready,wristCircles,type Builder,type MoveTable,type Spec,type V} from "../shadow-kit";

const JAB=ACTIONS.jab.p[0][0] as Partial<Spec>;
const rail=(start:Spec,out:Partial<Spec>,hand:"hand"|"rearHand"="hand"):[V,V]=>[pose(start)[hand],pose({...start,...out})[hand]];
const ONE:[string,string]=["1 · jab","Lead hand out and home. Breathe out: tss."],TWO:[string,string]=["2 · cross","Rear heel turns; the lead hand guards the cheek."];
const stepBack=(b:Builder,say:[string,string]=["Step out","Rear foot first, then the front foot. Guard home."])=>shuffle(b,"back",{say});
const stepIn=(b:Builder)=>shuffle(b,"forward",{say:["Step in","Front foot first; the rear foot follows."]});
// A short walk in place with loose arms: the start of a warm-up or a cool-down.
const walk=(b:Builder,n:number,swing=.35)=>march(b,n,.62,.025,swing);

export const CHAPTER_02:MoveTable={
 "c2-warm":{make(){
  const b=script({...STAND});
  b.say("March","Walk or march gently in place. Breathing rises a little.");walk(b,6);
  armSwings(b,3,{say:["Arm swings","Easy swings across the chest."]});
  shoulderCircles(b,3,{say:["Shoulder circles","Small circles, both directions."]});shoulderCircles(b,2,{back:true});
  wristCircles(b,3,{say:["Wrists","Circle the wrists; open and close the hands."]});
  goalposts(b,3,{say:["Goalposts","Elbows at shoulder height. Raise and lower the forearms."]});
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, eyes on your point, a small bow."]});
  ready(b,{say:["Guard up","Step back into your stance; guard up on one sharp breath out."]});
  b.say("Stillness","One breath of stillness. Practice begins.").breathe(1);
  unready(b);
  return b.done(exercise({title:"Wake the shoulders",view:"angle"}));
 }},
 "c2-cool":{make(){
  const b=script({...STAND});
  b.say("Walk it out","Hands down. Walk slowly and shake out the arms.");walk(b,6,.5);
  b.say("Forearm stretch","Palm on the wall, fingers down. Mild tension only.")
   .to({lReach:1,lX:.55,lY:.42,lZ:-.14,lPalm:-1,chestYaw:-.15},.9).wait(1.8).to({lReach:0,lPalm:0,chestYaw:0},.7)
   .to({rReach:1,rX:.55,rY:.42,rZ:.14,rPalm:-1,chestYaw:.15},.9).wait(1.8).to({rReach:0,rPalm:0,chestYaw:0},.7);
  shoulderCircles(b,2,{back:true,say:["Shoulder rolls","Slow and easy."]});
  b.say("Breathe","In through the nose for 4, out for 6.").to({inhale:1},1.6).to({inhale:0},2.4).to({inhale:1},1.6).to({inhale:0},2.4);
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Close as you opened: feet together, a small bow."]});
  return b.done(exercise({title:"Unwind the arms",view:"angle",props:{wall:.95}}));
 }},
 "c2-fist":{speed:2,make(){
  const start=stance(),b=script(start);
  b.say("Fist","Fold the fingers in; thumb across the outside. Knuckles and forearm in one line.").wait(1.4);
  b.say("Rail","Slide the lead hand toward your point. Elbow down, shoulder easy.").to({jab:.7,hipYaw:-.7,chestYaw:-.85},1.1,"inOut");
  b.say("Turn","Palm down only in the last third.").to({jab:1,hipYaw:-.78,chestYaw:-.98,headYaw:-.32},.5);
  b.say("Pause","Elbow still softly bent. One count.").wait(.9);
  b.say("Home","Back along the same rail to your cheek.").to({jab:0,hipYaw:FIGHT.hipYaw,chestYaw:FIGHT.chestYaw,headYaw:FIGHT.headYaw},1.3);
  b.say("Rail, turn, home","No speed yet.").wait(1.2);
  return b.done(fight(false,{title:"Fist, path and return",rail:rail(start,JAB),trail:true}));
 }},
 "c2-jab":{speed:1,make(){
  const start=stance(),b=script(start),home=snap(b,JAB);
  b.say("Guard","Eyes on your point. Rear hand by the cheek.").wait(1.1);
  const t0=b.t;b.say("Rail","The fist moves first, with no hitch or dip.").to(JAB,.2,"punch");
  b.say("Turn","Palm down in the last third. Breathe out: tss.",t0+.2*.51);
  b.say("Soft elbow","Stop just short of straight.").wait(.06,false);
  b.say("Home","Same line back, at least as fast.").to(home,.21);
  b.say("Guard","The rear hand never left the cheek.").wait(1.3);
  const r=rail(start,JAB),end=r[1];
  return b.done(fight(false,{title:"The jab",origin:[.25,.95,0],rail:r,point:[end[0]+.38,end[1],end[2]+.01],trail:true,scrub:[1.1,1.57]}));
 }},
 "c2-cross":{speed:1,make(){
  const start=stance(),b=script(start);
  b.say("Pivot alone","Rear heel turns out; knee and hip turn toward your point.").wait(.5);
  heelTurn(b,{k:1.4});heelTurn(b,{k:1.4});
  b.wait(.5);hit(b,"cross",{say:["Cross","Heel and hip turn; the rear fist travels straight. Lead hand guards."]});
  b.say("Balance","Head behind the front knee. Hand home, heel back, one count.").wait(1.4);
  return b.done(fight(false,{title:"The cross",rail:rail(start,ACTIONS.cross.p[0][0] as Partial<Spec>,"rearHand"),trail:true}));
 }},
 "c2-onetwo":{speed:1,make(){
  const b=script(stance());
  b.say("Ready","Stance and guard, eyes on your point.").wait(1);
  combo(b,["jab","cross"],{says:[ONE,TWO]});
  b.say("Zanshin","Guard held for one count: ready after you strike.").wait(1.3);
  b.say("Relax","Shoulders soften; hands stay up.").to({shrug:-.01},.5).to({shrug:0},.5);
  return b.done(fight(false,{title:"The 1-2",trail:true}));
 }},
 "c2-still":{speed:0,make(){
  const b=script(stance());
  b.say("Stillness","Nothing moves before the fist: no hitch, no breath in, no dip.").wait(2.4);
  hit(b,"jab",{say:["Gone","The fist moves first. Breathe out short; home."]});
  b.say("Wait","Vary the wait so it never becomes a rhythm.").wait(3.4);
  hit(b,"jab",{say:["Gone","Relaxed until the last moment."]});
  b.say("Wait","Two to four seconds of stillness.").wait(2);
  hit(b,"jab");b.wait(2.8);
  return b.done(fight(false,{title:"Still, then snap",trail:true}));
 }},
 "c2-stepjab":{speed:1,make(){
  const b=script(stance());
  b.say("Ready","Guard up, eyes on your point.").wait(.9);
  stepJab(b,{k:1.3,say:["Step and strike","The fist and the front foot land together. Breathe out."],follow:["Follow","The rear foot follows to rebuild the stance."]});
  b.wait(.8);stepBack(b,["Step back out","Rear foot first, then the front foot. Hands home."]);
  b.say("Check","Stop. Check your spacing: one cycle.").wait(1.3);
  return b.done(fight(false,{title:"Step-and-strike",view:"side",trail:true}));
 }},
 "c2-stepjab-build":{speed:1,make(){
  const b=script(stance());
  b.wait(.8);
  stepJab(b,{say:["In with the jab","Foot and fist land together."]});
  hit(b,"cross",{say:["Cross","Thrown from where you land."]});
  b.wait(.15,false);stepBack(b);
  b.say("One count","Guard home, eyes on your point.").wait(1.3);
  return b.done(fight(false,{title:"Strike, then step out",view:"side",trail:true}));
 }},
 "c2-double":{speed:1,make(){
  const b=script(stance());
  b.wait(.9);
  doubleJab(b,{say:["1","The first jab comes only halfway home…"],second:["1","…before the second goes out. Straight and small."]});
  hit(b,"cross",{say:TWO});
  b.say("Hold","Guard and eyes for one count.").wait(1.3);
  return b.done(fight(false,{title:"Double jab · 1-1-2",trail:true}));
 }},
 "c2-exit":{speed:1,make(){
  const b=script(stance());
  b.wait(.8);combo(b,["jab","cross"],{says:[["1-2","A smooth 1-2 from your stance."],undefined]});
  stepBack(b,["Exit","Rear foot first, then the front foot. Guard high, chin down."]);
  b.say("Hold","One count, eyes on your point.").wait(1.1);
  stepIn(b);b.wait(1);
  return b.done(fight(false,{title:"1-2 and step-back exit",view:"side",trail:true}));
 }},
 "c2-tempo":{speed:0,make(){
  const b=script(stance());
  b.say("Slow","A full pause between the strikes.").wait(.6);combo(b,["jab","cross"],{k:2.2,gap:.8});b.wait(1.2);
  b.say("Smooth","No pause between; a pause after.");combo(b,["jab","cross"],{k:1.4});b.wait(1.2);
  b.say("Crisp","Fast out, faster back. Quick, not hard.");combo(b,["jab","cross"]);b.wait(1.4);
  return b.done(fight(false,{title:"Tempo ladder",trail:true}));
 }},
 "c2-mobility":{make(){
  const b=script({...STAND});
  shoulderCircles(b,3,{say:["Shoulder circles","Slow, forwards…"]});shoulderCircles(b,3,{back:true,say:["Shoulder circles","…and backwards."]});
  armSwings(b,3,{say:["Arm swings","Small and easy across the chest."]});
  wristCircles(b,3,{say:["Wrists","Circle; open and close the hands."]});
  goalposts(b,3,{say:["Goalposts","Raise and lower the forearms without forcing the range."]});
  b.say("Rest","Hands down. This is recovery, not a workout.").breathe(1);
  return b.done(exercise({title:"Shoulders and wrists, easy"}));
 }},
 "c2-core":{make(){
  const b=script({...STAND,...SUPINE});
  deadBug(b,2,{say:["Dead bug","Lower one arm and the opposite foot; lower back stays gently down."]});
  cut(b,{...STAND,...KNEELING});
  b.say("Bird dog","Hands and knees.").wait(.8);
  birdDog(b,2,{say:["Bird dog","Arm forward, opposite leg back until level. Hips square; pause two counts."]});
  cut(b,{...STAND,...SUPINE});
  bridge(b,2,{say:["Glute bridge","Press through the heels until knees, hips and shoulders line up."]});
  cut(b,{...STAND});
  goalposts(b,2,{slide:true,say:["Wall slides","Back to the wall. Slide the arms up and down in an easy range."]});
  b.say("Stop early","End each exercise 2–3 reps before it gets hard.").wait(1);
  cut(b,{...STAND,...SUPINE});
  return b.done(exercise({title:"Core basics",view:"side",origin:[-.15,.38,0]}));
 }},
 "c2-selfcheck":{speed:1,make(){
  const b=script(stance());
  b.say("Usual lead","3 jabs and 3 crosses, slow. Watch the form checks.").wait(.6);
  combo(b,["jab"],{k:1.6});b.wait(.9);hit(b,"cross",{k:1.6});b.wait(1);
  b.say("Notice","Which side is cleaner? Repeat whichever needs most help.").wait(1.6);
  b.say("Review","One thing repeatable, one correction for next week.").wait(1.4);
  return b.done(fight(false,{title:"Hands self-check",trail:true}));
 }},
 "c2-trial-1":{speed:1,make(){
  const b=script(stance());
  b.say("Slow 1-2","A full pause after each.").wait(.6);combo(b,["jab","cross"],{k:1.8,gap:.4});b.wait(1.4);
  b.say("Smooth 1-2","Elbows soft; hands come home.");combo(b,["jab","cross"],{k:1.2});b.wait(1.4);
  b.say("Mark it honestly","'Not yet' is useful information.").wait(1.2);
  return b.done(fight(false,{title:"Trial · the 1-2",trail:true}));
 }},
 "c2-trial-2":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);stepJab(b,{say:["Step in with the jab","Foot and fist land together."]});hit(b,"cross",{say:TWO});stepBack(b);b.wait(1.2);
  b.say("1-1-2","Double jab and cross…");doubleJab(b);hit(b,"cross");stepBack(b,["Exit","…with a step-back exit."]);b.wait(1);
  stepIn(b);b.wait(.8);
  return b.done(fight(false,{title:"Trial · step, strike, return",view:"side",trail:true}));
 }},
};
