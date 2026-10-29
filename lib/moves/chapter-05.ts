// Chapter 5 demonstrations: combinations, angles, punch-kick links, the set sequence and rounds, keyed by drill ID.
import {CHAIR,FIGHT_CHAIR,KNEELING,READY,SIDE_LYING,STAND,armSwings,birdDog,bow,calfRaise,combo,cut,doubleJab,exercise,fight,hipCircles,hit,kick,
 lift,march,pivot,ready,script,shoulderCircles,shuffle,sidePlank,stance,trunkTurns,unready,type ActionId,type Builder,type MoveTable,type Spec} from "../shadow-kit";

export const C12H:ActionId[]=["jab","cross","leadHook"];
// The kit's side-lying pose with the bottom foot a hair off the floor, so the planted-leg clamp no longer pulls the hips through it.
export const SIDE:Partial<Spec>=SIDE_LYING;
// A short walk in place with loose arms: the start of a warm-up or a cool-down.
export const walk=(b:Builder,n:number,swing=.35)=>march(b,n,.62,.025,swing);
// Guard home, eyes on the point, one short breath: the pause that ends every combination.
export const still=(b:Builder,say?:[string,string])=>{if(say)b.say(...say);return b.wait(.5).to({inhale:1},.6).to({inhale:0},.7);};
// The 1-1-2: a double jab, then the cross.
const oneOneTwo=(b:Builder,k=1,say?:[string,string])=>{doubleJab(b,{k,say});return hit(b,"cross",{k});};
// Calf stretch: hands on the wall, one foot steps back with the heel down, a gentle lean (as in Chapter 1). Needs a wall prop at .5.
export function calfStretch(b:Builder,say?:[string,string]){
 if(say)b.say(...say);
 b.to({wall:1,grip:.1},.9).to({weight:.65},.3);lift(b,"rear",-.36,0,.8,.03,{rearYaw:0});
 b.to({drop:.075,lean:.17,weight:.66},.9).breathe(1).to({drop:STAND.drop,lean:.02,weight:.4},.6);
 lift(b,"rear",.36,0,.8,.03,{rearYaw:STAND.rearYaw});
 return b.to({weight:.5,wall:0,grip:.3},.6);
}
// Standing hip-flexor stretch: one foot steps well back, heel up; the back knee softens and the hips ease forward.
export function flexor(b:Builder,foot:"lead"|"rear"="rear",say?:[string,string]){
 if(say)b.say(...say);
 const r=foot==="rear",Y=r?"rearYaw":"leadYaw",H=r?"rearHeel":"leadHeel",yaw=b.value(Y);
 b.to({weight:r?.65:.35},.3);lift(b,foot,-.42,0,.7,.03,{[Y]:0,[H]:.1} as Partial<Spec>);
 b.to({drop:.16,sx:.05,lean:-.03},1).breathe(1).to({drop:STAND.drop,sx:0,lean:.02},.8);
 lift(b,foot,.42,0,.7,.03,{[Y]:yaw,[H]:0} as Partial<Spec>);
 return b.to({weight:.5},.3);
}
// Doorway chest stretch: forearms on the frame at shoulder height, the chest eases forward between them.
export function chestStretch(b:Builder,say?:[string,string]){
 if(say)b.say(...say);
 b.to({lReach:1,rReach:1,lX:0,lY:.72,lZ:-.5,rX:0,rY:.72,rZ:.5,lEl:1,rEl:1,grip:.2},.8);
 b.to({sx:.06,lean:.08,lX:-.08,rX:-.08},.9).breathe(1).to({sx:0,lean:.02,lX:0,rX:0},.8);
 return b.to({lReach:0,rReach:0,lEl:0,rEl:0,grip:.3},.7);
}
// Ankle circles: weight over the rear foot, the lead foot lifts a little and draws slow circles.
export function ankles(b:Builder,n=2,say?:[string,string]){
 if(say)b.say(...say);
 const yaw=b.value("leadYaw");
 b.to({weight:.15,sz:.03},.4).to({leadLift:.06},.3);
 for(let i=0;i<n;i++)b.to({leadYaw:yaw+.35,leadHeel:.03},.35).to({leadYaw:yaw,leadHeel:-.04},.35).to({leadYaw:yaw-.35,leadHeel:.03},.35).to({leadYaw:yaw,leadHeel:0},.35);
 return b.to({leadLift:0},.3).to({weight:.5,sz:0},.4);
}
// Leg swings holding the chair: weight over the rear foot, the lead leg swings forward and back.
const legSwings=(b:Builder,n:number)=>{b.to({chair:1,weight:.1,sz:.03},.6);for(let i=0;i<n;i++)b.to({leadX:.28,leadLift:.14},.55).to({leadX:-.22,leadLift:.08},.65);return b.to({leadX:0,leadLift:0},.5).to({chair:0,weight:.5,sz:0},.6);};
// Small quiet steps sideways in a lowered stance: the nearest foot first, the other the same distance.
const sidestep=(b:Builder,dz:number)=>{const [a,c]:("lead"|"rear")[]=dz<0?["lead","rear"]:["rear","lead"];lift(b,a,0,dz,.4,.025);lift(b,c,0,dz,.38,.02);return b;};
// The set sequence: four combinations in order, each closed with stillness and a breath.
function setSeq(b:Builder,k=1){
 combo(b,C12H,{k,says:[["1 · 1-2-hook","Jab, cross, lead hook, then step back."],undefined,undefined]});shuffle(b,"back",{k,d:.1});
 still(b,["Still","Guard home, eyes on your point, one breath."]);
 combo(b,["slipRight","cross","leadHook"],{k,says:[["2 · Slip-2-hook","Slip, cross, lead hook."],undefined,undefined]});still(b);
 combo(b,["parryRear","jab","cross"],{k,says:[["3 · Parry-1-2","Parry, jab, cross, then pivot out."],undefined,undefined]});pivot(b,.6,{k});still(b);
 combo(b,["jab","cross"],{k,says:[["4 · 1-2-low kick","Rear low round kick, set down, guard."],undefined]});kick(b,"round",{k});
 still(b,["Still","Strike, still, breathe, next."]);
 pivot(b,-.6,{say:["Reset","Face your point; back to your mark."]});
 return shuffle(b,"forward",{d:.1});
}

export const CHAPTER_05:MoveTable={
 "c5-warm":{make(){
  const b=script({...STAND});
  b.say("Set up","Clear your space, chair within reach. Picture your opponent at your point.").wait(1.4);
  b.say("March","March or walk in place. Breathing rises a little.");walk(b,4);
  armSwings(b,2,{say:["Arm swings","Easy swings across the chest."]});
  trunkTurns(b,1,{say:["Trunk turns","Slow and easy."]});
  b.say("Leg swings","Small swings, holding the chair.");legSwings(b,2);
  b.to({...READY,grip:.3},.6);ready(b,{say:["Slow shadow","Half speed: a jab, a slip, a step."]});
  hit(b,"jab",{k:2});hit(b,"slipRight",{k:2});shuffle(b,"forward",{k:1.5});shuffle(b,"back",{k:1.5});unready(b);
  calfRaise(b,1,{say:["Calf raises","Then hip circles."]});hipCircles(b,1);
  bow(b,{say:["Bow","Feet together, a small bow toward your point."]});
  ready(b,{say:["Guard up","Step into stance; guard up on one sharp breath out."]});
  b.say("Stillness","One breath of stillness. Practice begins.").breathe(1);
  unready(b);
  return b.done(exercise({title:"Full-body flow",props:{chair:CHAIR}}));
 }},
 "c5-cool":{make(){
  const b=script({...STAND});
  b.say("Walk it down","Walk slowly, shake out the arms, let the breathing slow.");walk(b,6,.5);
  calfStretch(b,["Calf stretch","Against the wall, heel down. 15–20 seconds."]);
  flexor(b,"rear",["Hip flexor","A gentle standing stretch, 15–20 seconds."]);
  chestStretch(b,["Chest stretch","Light, in a doorway. 15–20 seconds."]);
  b.say("Breathe","In for 4, out for 6. One combination that felt like yours, one to clean up.").to({inhale:1},1.6).to({inhale:0},2.4);
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, a small bow. No extra rounds."]});
  return b.done(exercise({title:"Walk it down",props:{wall:.5}}));
 }},
 "c5-grammar":{speed:1,make(){
  const b=script(stance());
  b.say("1-2-hook","Jab, cross, lead hook. Say the numbers quietly if it helps.").wait(.8);
  combo(b,C12H,{k:1.3});
  still(b,["The end","Hands home, eyes on your point, one count of stillness."]);
  oneOneTwo(b,1.2,["1-1-2","Double jab, then the cross."]);
  still(b,["The pause","It is part of the sentence."]);
  b.say("Check","If the third strike drags the guard down, go back to the 1-2.").wait(1.4);
  return b.done(fight(false,{title:"Combination grammar",trail:true}));
 }},
 "c5-ladder":{speed:0,make(){
  const b=script(stance());
  b.say("Slow","One combination: 1-2-hook. A pause between strikes.").wait(.6);combo(b,C12H,{k:2.2,gap:.7});b.wait(1.2);
  b.say("Smooth","No pauses inside the combination.");combo(b,C12H,{k:1.4});b.wait(1.2);
  b.say("Crisp","Fast out, faster back, short of a straight elbow.");combo(b,C12H);b.wait(1.4);
  return b.done(fight(false,{title:"Combination tempo ladder",trail:true}));
 }},
 "c5-defense-in":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);combo(b,["jab","cross","slipRight","cross"],{says:[["1-2-slip-2","Jab, cross…"],undefined,["Slip","…slip outside the counter-jab…"],["2","…and cross again."]]});
  still(b,["Finish it","Eyes on your point before the next strike."]);
  combo(b,["parryRear","jab","cross"],{says:[["Parry-1-2","Catch the jab with the rear hand…"],["1-2","…then jab and cross."],undefined]});
  still(b,["The middle","The defense is a full part of the combination."]);
  return b.done(fight(false,{title:"Defense inside combinations",trail:true}));
 }},
 "c5-angles":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);combo(b,["jab","cross"],{says:[["1-2","Strike from here."],undefined]});
  pivot(b,.7,{k:1.4,say:["Pivot out","Turn on the ball of the front foot; the rear foot swings a short arc."]});
  b.say("Check","Facing your point from a new angle, in stance.").wait(1.2);
  pivot(b,-.7,{k:1.4,say:["Reset","Pivot back to the start."]});b.wait(.6);
  combo(b,["jab","cross"],{says:[["1-2","Again."],undefined]});
  shuffle(b,"left",{k:1.3,say:["Step off","A small step to the side, nearest foot first…"]});
  pivot(b,-.3,{k:1.3,say:["Turn","…then turn to face your point again."]});
  b.say("Check","Feet never cross. In stance, facing your point.").wait(1.2);
  pivot(b,.3,{k:1.3,say:["Reset","Back to the centre."]});shuffle(b,"right",{k:1.3});b.wait(.5);
  return b.done(fight(false,{title:"Angles: pivot out or step off",view:"above",trail:true}));
 }},
 "c5-angles-build":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);combo(b,C12H,{says:[["Combination","Any from this chapter: here, 1-2-hook…"],undefined,undefined]});
  pivot(b,.6,{k:1.3,say:["Angle","…finished with a pivot out."]});
  still(b,["See them again","Find your point, guard up, one breath."]);
  oneOneTwo(b,1,["Next","A 1-1-2 from the new angle…"]);
  pivot(b,-.6,{k:1.3,say:["Vary the exits","…then pivot the other way."]});
  still(b,["Again","Vary the combinations and the exits."]);
  return b.done(fight(false,{title:"Combination, then angle",view:"above",trail:true}));
 }},
 "c5-punch-kick":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);combo(b,["jab","cross"],{says:[["1-2-low kick","Jab, cross…"],undefined]});
  kick(b,"round",{say:["Kick","…rear low round kick, set down in stance."]});
  b.say("Balance","Check your balance before the next strike.").wait(1);
  kick(b,"teep",{say:["Front kick-1-2","Lead low push kick…"]});
  shuffle(b,"forward",{say:["Set down","…the foot sets down forward…"]});
  combo(b,["jab","cross"],{says:[["1-2","…then jab, cross."],undefined]});
  b.say("Balance","Hands high, kick low, home again.").wait(.9);
  shuffle(b,"back",{say:["Reset","Step back to your start."]});b.wait(.5);
  return b.done(fight(false,{title:"Punch-kick links",props:{chair:FIGHT_CHAIR},trail:true}));
 }},
 "c5-set":{speed:0,make(){
  const b=script(stance());
  b.say("The set","Four combinations, always in this order.").wait(.8);
  setSeq(b,1.3);b.wait(.4);
  return b.done(fight(false,{title:"The set sequence",trail:true}));
 }},
 "c5-rounds":{speed:0,make(){
  const b=script(stance());
  b.say("Picture them","Your opponent at your point: height, guard, how they step.").wait(1.6);
  combo(b,["jab","cross"],{says:[["1-2","Choose freely from the menu."],undefined]});
  pivot(b,.4,{say:["Move","After every combination: guard home, a small pivot or step."]});
  combo(b,["cross","leadHook","cross"],{says:[["2-hook-2","Cross, lead hook, cross."],undefined,undefined]});b.wait(.4);
  combo(b,["jab","cross"],{says:[["1-2-low kick","See them. Answer them."],undefined]});kick(b,"round");
  shuffle(b,"left",{say:["Step","Small steps, never hopping."]});
  combo(b,["slipRight","cross"],{says:[["Slip-2","Breathe."],undefined]});b.wait(.4);
  combo(b,["roll","leadHook"],{says:[["Roll-hook","Effort: you can still speak in short sentences."],undefined]});
  shuffle(b,"right");pivot(b,-.4,{say:["Rest","Walk slowly and breathe out long. If form slips, slow down."]});b.wait(1.2);
  return b.done(fight(false,{title:"Shadow rounds from the menu",trail:true}));
 }},
 "c5-rounds-tempo":{speed:0,make(){
  const b=script(stance());
  b.say("Slow","Slow and precise.").wait(.5);combo(b,C12H,{k:2,gap:.4});
  shuffle(b,"back",{k:1.5,say:["Exit","A step back, guard up."]});b.wait(.8);
  b.say("Smooth","Uppercut-hook, no pauses inside.");combo(b,["rearUpper","leadHook"],{k:1.4});
  pivot(b,.5,{k:1.2,say:["Exit","Or a pivot out."]});b.wait(.8);
  b.say("Crisp","1-2: fast out, faster back.");combo(b,["jab","cross"]);pivot(b,.4,{say:["Exit","Change the speed, keep the shape."]});b.wait(.8);
  b.say("Slow again","To finish the round.");combo(b,["parryRear","jab","cross"],{k:2,gap:.4});b.wait(.8);
  pivot(b,-.9,{say:["Reset","Face your point; back to your mark."]});shuffle(b,"forward");b.wait(.5);
  return b.done(fight(false,{title:"Rounds with tempo changes",trail:true}));
 }},
 "c5-mobility":{make(){
  const b=script({...STAND});
  calfStretch(b,["Round 1 · calves","Calf stretch against the wall…"]);
  ankles(b,2,["Ankle circles","…then slow ankle circles."]);
  hipCircles(b,1,{say:["Round 2 · hips","Hip circles…"]});
  flexor(b,"rear",["Hip flexor","…and a gentle standing stretch in a split stance."]);
  shoulderCircles(b,2,{say:["Round 3 · shoulders","Shoulder circles…"]});
  chestStretch(b,["Chest stretch","…and a light doorway stretch. Easy and pain-free."]);
  b.say("Rest","Rest between rounds.").breathe(1);
  return b.done(exercise({title:"Calves, hips and shoulders",props:{wall:.5}}));
 }},
 "c5-strength":{make(){
  const b=script({...STAND});
  b.say("Lateral shuffle","Slightly lowered stance. Small quiet steps sideways, two each way, no hop.").to({drop:.07},.6);
  sidestep(b,-.1);sidestep(b,-.1);sidestep(b,.1);sidestep(b,.1);b.to({drop:STAND.drop},.5);
  b.to({chair:1},.6);calfRaise(b,2,{say:["Calf raise","Holding the chair, slow raises."]});
  b.say("Hold","The last few with a 2-second hold at the top.").to({leadHeel:.075,rearHeel:.075},.9).wait(2).to({leadHeel:0,rearHeel:0},1);
  b.to({chair:0},.5);
  cut(b,{...STAND,...KNEELING});
  birdDog(b,2,{say:["Bird dog hold","Opposite arm and leg; hold without letting the hips turn. Switch."],hold:2.5});
  cut(b,{...STAND,...SIDE});
  sidePlank(b,4,{say:["Side plank","Knees bent or legs long, 15–20 seconds each side."]});
  b.say("Stop early","End every exercise 2–3 reps before it gets hard.").wait(1);
  cut(b,{...STAND});
  return b.done(exercise({title:"Feet and core for rounds",props:{chair:CHAIR}}));
 }},
 "c5-selfcheck":{speed:1,make(){
  const b=script(stance());
  b.say("Usual lead","This week's combination three times, slowly. Watch its two checks.").wait(.6);
  combo(b,C12H,{k:1.8,gap:.4});still(b);
  b.say("Round 3","The side or the part that needed the most help.").wait(.4);hit(b,"leadHook",{k:1.8});b.wait(.8);
  b.say("Review","One combination that is yours, one correction for next week.").wait(1.4);
  return b.done(fight(false,{title:"Combinations self-check",trail:true}));
 }},
 "c5-trial-set":{speed:0,make(){
  const b=script(stance());
  b.say("Slowly","The set sequence on your usual lead.").wait(.8);
  setSeq(b,1.6);
  b.say("Mark it honestly","'Not yet' means repeat a week; it never blocks the story.").wait(1.4);
  return b.done(fight(false,{title:"Trial · the set sequence",trail:true}));
 }},
 "c5-trial-rounds":{speed:0,make(){
  const b=script(stance());
  b.say("Round 1","Hands and defense: menu combinations, a step or pivot after each.").wait(.6);
  combo(b,["jab","cross"]);pivot(b,.4);combo(b,["slipRight","cross"]);pivot(b,-.4);b.wait(.6);
  b.say("Round 2","Add the kicks: punch-kick links and checks.");combo(b,["jab","cross"]);kick(b,"round");
  b.say("Balance","Balance after every kick.").wait(.6);kick(b,"check");hit(b,"cross");b.wait(.6);
  b.say("Round 3","Everything, your choice. Effort stays at short sentences.");combo(b,["rearUpper","leadHook"]);b.wait(.6);
  b.say("Rests","Walk and breathe out long.").wait(1.2);
  return b.done(fight(false,{title:"Trial · three structured rounds",trail:true}));
 }},
};
