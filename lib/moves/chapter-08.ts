// Chapter 8 demonstrations: breath, rhythm, steady rounds and composure, keyed by drill ID. Captions follow each drill's steps.
// The breath, count and stand-in helpers below are shared with Chapters 9 and 10.
import {CHAIR,READY,STAND,SUPINE,armSwings,bow,calfRaise,combo,cut,doubleJab,exercise,fight,hipCircles,hit,kick,lift,march,pivot,ready,script,
 shoulderCircles,shuffle,stance,unready,type ActionId,type Builder,type MoveTable,type Spec} from "../shadow-kit";

// A short walk in place with loose arms: warm-ups, cool-downs and rests.
export const walk=(b:Builder,n:number,dur=.62,swing=.35)=>march(b,n,dur,.025,swing);
// Breath patterns: a long exhale (in 4, out 6–8), a box breath (in, pause, out, pause), a cyclic sigh (two sips in, one long out).
export const longOut=(b:Builder,n=1,out=2.8)=>{for(let i=0;i<n;i++)b.to({inhale:1},1.4).to({inhale:0},out);return b;};
export const boxBreath=(b:Builder)=>b.to({inhale:1},1.3).wait(.5).to({inhale:0},1.3).wait(.5);
export const sigh=(b:Builder,n=1)=>{for(let i=0;i<n;i++)b.to({inhale:.6},.8).to({inhale:1},.45).to({inhale:0},2.8);return b;};
// Hands eased down for a rest in the stance, and the guard back up.
export const EASY:Partial<Spec>={leadUp:.35,rearUp:.35,grip:.5},UP:Partial<Spec>={leadUp:1,rearUp:1,grip:1};
// One count of a counted drill: the action, then stillness to the end of the count.
export function beat(b:Builder,c:number,fn:()=>void){const t0=b.t;fn();const r=c-(b.t-t0);if(r>.001)b.wait(r,false);return b;}
// Guard reset on a count: the hands settle a touch and rise home (the lead hand only while the rear hand holds the support).
export function guardReset(b:Builder,c:number,support=false){
 return b.to(support?{leadUp:.85,shrug:.015}:{leadUp:.85,rearUp:.85,shrug:.015},c*.35).to(support?{leadUp:1,shrug:0}:{leadUp:1,rearUp:1,shrug:0},c*.45);
}
export const countBreath=(b:Builder,c:number)=>b.to({inhale:1},c*.4).to({inhale:0},c*.55);
// The stance check: settle into the knees and come back up, guard home.
export function stanceCheck(b:Builder,body="Feet apart, knees soft, guard home, eyes on your point."){
 return b.say("Stance check",body).to({drop:.1,...UP},.45).to({drop:.08},.45).wait(.8);
}
// A pivot out on the lead foot and back to face the point.
export function pivotOut(b:Builder,o:{k?:number;say?:[string,string]}={}){pivot(b,-.7,o);b.wait(.25*(o.k??1),false);return pivot(b,.7,{k:o.k});}
// A menu combination with a caption on its first strike.
export const run=(b:Builder,ids:readonly ActionId[],say?:[string,string],k=1)=>combo(b,ids,{k,says:say?[say]:[]});
// A stand-in for a form section (the forms themselves are taught count by count): strikes, a turn, a kick, a turn back.
// hold pauses after every move for a breath.
export function formPiece(b:Builder,k=1,hold=false){
 const still=()=>{if(hold)b.breathe(1);else b.wait(.2*k,false);};
 hit(b,"jab",{k});still();hit(b,"cross",{k});still();
 pivot(b,Math.PI/2,{k:k*1.4});still();kick(b,"teep",{k});still();
 pivot(b,-Math.PI/2,{k:k*1.4});still();hit(b,"leadHook",{k});still();
 return b;
}
// The bow-in that closes a warm-up: feet together, a small bow, into the stance with one sharp breath out, one still breath, back out.
export function bowIn(b:Builder){
 b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, a small bow."]});
 ready(b,{say:["Guard up","Step into stance; guard up on one sharp breath out."]});
 b.say("Stillness","One breath of stillness. Practice begins.").breathe(1);
 return unready(b);
}
export function bowOut(b:Builder,body="Feet together, a small bow."){b.to({...READY,grip:.3},.6);return bow(b,{say:["Bow",body]});}
// Calf, hip-flexor and chest stretches from standing (no wall): one side shown, mild tension.
const HIPS:Partial<Spec>={lReach:1,lX:.02,lY:.08,lZ:-.2,rReach:1,rX:.02,rY:.08,rZ:.2};
export function stretches(b:Builder,o:{forearm?:boolean;say?:[string,string]}={}){
 b.say(...(o.say??["Calf","One foot steps back, heel down, front knee bends. Mild tension."])).to(HIPS,.6);
 b.to({weight:.65},.3);lift(b,"rear",-.36,0,.8,.03,{rearYaw:0});b.to({drop:.075,lean:.12,weight:.62},.9).breathe(1);
 b.say("Hip flexor","Rear heel lifts; hips ease forward.").to({rearHeel:.11,drop:.15,lean:-.02,weight:.5},1).breathe(1);
 b.to({rearHeel:0,drop:.015,lean:.02,weight:.4},.7);lift(b,"rear",.36,0,.8,.03,{rearYaw:-.06});b.to({weight:.5},.3);
 b.say("Chest","Hands behind you; open the chest.").to({lX:-.2,lY:.02,lZ:-.07,rX:-.2,rY:.02,rZ:.07,shFwd:-.04},1).breathe(1);
 if(o.forearm)b.say("Forearms","Arm out, palm up; the other hand eases the fingers back.")
  .to({lX:.45,lY:.36,lZ:-.04,lPalm:-1,rX:.38,rY:.38,rZ:-.01,shFwd:0},1).breathe(1);
 return b.to({lReach:0,rReach:0,lPalm:0,shFwd:0},.8);
}
// Ankle circles: the weight settles on one foot and the other ankle circles, toes light.
export function ankleCircles(b:Builder,n:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 b.to({weight:.2,sz:.03},.4).to({leadLift:.05,leadHeel:.04},.4);
 for(let i=0;i<n;i++)b.to({leadYaw:.5},.35).to({leadYaw:-.3},.5).to({leadYaw:.06},.35);
 return b.to({leadLift:0,leadHeel:0,weight:.5,sz:0},.5);
}
// From feet together: one foot steps back into a shallow stance and returns.
function backStep(b:Builder,foot:"lead"|"rear"){
 const s=foot==="rear"?-1:1,Y=foot==="rear"?"rearYaw":"leadYaw",yaw=b.value(Y);
 lift(b,foot,-.3,0,.5,.03,{drop:.06,hipYaw:.5*s,chestYaw:.55*s,[Y]:yaw+.5*s});b.wait(.3,false);
 lift(b,foot,.3,0,.5,.03,{drop:.01,hipYaw:0,chestYaw:0,[Y]:yaw});
 return b.wait(.2,false);
}
// The composure reset: a 1-2, three long breaths, a stance check.
function reset(b:Builder){
 run(b,["jab","cross"],["Reset · 1-2","A 1-2 to start the reset."]);
 b.say("Three breaths","Slow, with a long exhale.");longOut(b,3);
 return stanceCheck(b);
}

export const CHAPTER_08:MoveTable={
 "c8-warm":{make(){
  const b=script({...STAND});
  b.say("Set up","Clear space, water near. A warm room means an easier session.").wait(1.4);
  b.say("March","Gradually a little brisker.");walk(b,4,.66,.3);
  b.say("Breathe","If comfortable: in through the nose for 3 steps, out for 4.");march(b,7,.55,.04,.35,(i,t0,t1)=>b.key("inhale",t0,t1,i<3?(i+1)/3:(6-i)/4));
  armSwings(b,3,{say:["Arm swings","Easy swings across the chest."]});
  hipCircles(b,2,{say:["Hip circles","Slow and easy."]});
  b.to({...READY,grip:.3},.6);ready(b);
  b.say("Light shadow","Half pace, still breathing calmly.");run(b,["jab","cross"],undefined,2);b.wait(.4,false);run(b,["jab","cross"],undefined,2);
  unready(b);bowIn(b);
  return b.done(exercise({title:"Breath and rhythm warm-up"}));
 }},
 "c8-cool":{make(){
  const b=script({...STAND});
  b.say("Walk slowly","Each lap a little slower than the one before.");walk(b,4,.7);walk(b,3,.95,.25);
  stretches(b,{say:["Calf","15–20 seconds each, mild tension."]});
  b.say("Long exhale","In through the nose for 4, out through the mouth for 6–8.");longOut(b,2,3.2);
  b.say("Or cyclic sighs","Two gentle inhales through the nose, one long exhale.");sigh(b);
  bowOut(b);
  return b.done(exercise({title:"Long-exhale cool-down"}));
 }},
 "c8-breath":{speed:0,make(){
  const b=script(stance());
  b.say("Work","Easy shadow work: 1-2s and steps, breathing out on each strike.");
  run(b,["jab","cross"],undefined,1.3);shuffle(b,"forward");run(b,["jab","cross"],undefined,1.3);shuffle(b,"back");
  b.to(EASY,.6);
  b.say("Extended exhale","Rest: in through the nose for 4, out through the mouth for 6–8.");longOut(b,2,3);
  b.say("Box breath","In 4, an optional pause, out 4, an optional pause. Skip pauses if uncomfortable.");boxBreath(b);
  b.say("Notice","How quickly does your breathing slow? That's the skill.").to(UP,.6).wait(1.2);
  return b.done(fight(false,{title:"Breathing skills"}));
 }},
 "c8-rhythm":{speed:0,make(){
  const b=script(stance()),c=.62;
  // Breath out on each strike, in on the steps.
  const loop=()=>{beat(b,c,()=>{b.key("inhale",b.t,b.t+.25,0);hit(b,"jab");});beat(b,c,()=>hit(b,"cross"));
   beat(b,c+.1,()=>{b.key("inhale",b.t,b.t+.6,.7);shuffle(b,"back");});beat(b,c+.1,()=>shuffle(b,"forward"));};
  b.say("Loop","Jab, cross, step back, step in: a regular rhythm, like a drum.").wait(.6);loop();
  b.say("Breathe","Out on each strike, in on the steps.");loop();
  b.say("Steady","You could talk in short sentences.");loop();b.to({inhale:0},.3);
  b.say("Rhythm, not speed","Speeding up? Slow back down on purpose.").wait(1.2);
  return b.done(fight(false,{title:"Easy rhythmic shadow work",view:"side"}));
 }},
 "c8-steady":{speed:0,make(){
  const b=script(stance()),k=1.2;
  b.say("Keep moving","Strikes, defenses and steps at a pace you could keep up much longer.").wait(.6);
  run(b,["jab","cross"],undefined,k);shuffle(b,"forward",{k});
  run(b,["slipRight","cross"],["Slip-2","Every combination ends with your guard home."],k);shuffle(b,"back",{k});
  run(b,["jab","cross","leadHook"],["1-2-hook","Between combinations, small steps or pivots."],k);pivotOut(b,{k});
  run(b,["cover","jab","cross"],["Cover-1-2","Easy to moderate."],k);
  hit(b,"jab",{k,say:["Jab-front kick","Then the kick, and set it down."]});kick(b,"teep",{k});
  b.say("Effort","Round 1 about 3 out of 10, round 2 about 4. A short sentence is always possible.").wait(1.6);
  return b.done(fight(false,{title:"Steady continuous shadow"}));
 }},
 "c8-long":{speed:0,make(){
  const b=script(stance()),k=1.2;
  b.say("Minute 1","About 3 out of 10.").wait(.5);
  doubleJab(b,{k});hit(b,"cross",{k});shuffle(b,"back",{k});run(b,["parryRear","jab","cross"],undefined,k);shuffle(b,"forward",{k});
  b.say("Minute 2","About 4.");run(b,["cross","leadHook","cross"],undefined,k);run(b,["roll","leadHook"],undefined,k);pivotOut(b,{k});
  b.say("Minute 3","4–5, never past 'short sentences'.");run(b,["jab","cross"],undefined,k);kick(b,"round",{k});kick(b,"check",{k});hit(b,"cross",{k});
  b.say("Same quality","Minute three looks like minute one.").wait(1.4);
  return b.done(fight(false,{title:"Long rounds with an effort guide"}));
 }},
 "c8-composure":{speed:0,make(){
  const b=script(stance());
  b.wait(.6);reset(b);
  run(b,["slipRight","cross"],["Answer · slip-2","As precisely as you can."],1.3);
  b.say("Ragged?","Slow everything down. Calm and precise beats fast and messy.").wait(1.6);
  return b.done(fight(false,{title:"Composure reset"}));
 }},
 "c8-quality":{speed:0,make(){
  const b=script(stance()),ids:ActionId[]=["jab","cross","leadHook"];
  b.say("Crisp","Start crisp on one combination of your choice.").wait(.5);run(b,ids);b.wait(1.1);
  b.say("Smooth","The moment any part of the form slips, drop one tempo.");run(b,ids,undefined,1.5);b.wait(1.1);
  b.say("Slow","Finish the round at the tempo where form is clean.");run(b,ids,undefined,2.3);b.wait(1.1);
  b.say("Honest","Noticing the slip and slowing down is the skill.").wait(1.2);
  return b.done(fight(false,{title:"If form breaks, slow down",trail:true}));
 }},
 "c8-recovery":{make(){
  const b=script({...STAND});
  b.say("Round 1 · walk","Slow walking with long exhales.");march(b,6,.9,.03,.3,(i,t0,t1)=>b.key("inhale",t0,t1,i<2?(i+1)/2:(5-i)/4));
  ankleCircles(b,2,{say:["Round 2 · mobility","Ankle circles…"]});
  hipCircles(b,2,{say:["Round 2 · mobility","…hip circles…"]});
  shoulderCircles(b,2,{back:true,say:["Round 2 · mobility","…and shoulder rolls."]});
  cut(b,{...STAND,...SUPINE});
  b.say("Round 3 · cyclic sighs","Sit or lie comfortably: two gentle inhales through the nose, one long exhale.");sigh(b,2);
  b.say("Review","Think about tonight's sleep. Still tired? Practise lighter tomorrow.").wait(1.6);
  cut(b,{...STAND});
  return b.done(exercise({title:"Recovery skills"}));
 }},
 "c8-engine":{make(){
  const start:Spec={...STAND,...READY,fight:1,leadUp:1,rearUp:1,grip:1},b=script(start);
  b.say("Guard march","March in place, guard up, knees to a comfortable height.");march(b,6,.6,.07,0);
  b.say("Step-back to stance","From feet together, step back into stance and return.");backStep(b,"rear");
  b.say("Alternate legs","A shallow, controlled step, not a deep lunge.");backStep(b,"lead");
  ready(b);
  b.say("Shadow 1-2s","Continuous and relaxed, breathing out on each.");for(let i=0;i<3;i++)run(b,["jab","cross"],undefined,1.2);
  unready(b);b.to({chair:1},.6);
  calfRaise(b,3,{say:["Calf raise","Steady raises, holding your support."]});
  b.say("Effort","About 4 out of 10: short sentences possible.").to({chair:0},.5).wait(.6);
  return b.done(exercise({title:"Low-impact engine",props:{chair:CHAIR}}));
 }},
 "c8-selfcheck":{speed:0,make(){
  const b=script(stance());
  b.say("Round 1","A short burst of this week's work at its normal effort.").wait(.4);run(b,["jab","cross","leadHook"]);pivotOut(b);
  b.say("Round 2","One combination slowly: guard, feet, elbows.");run(b,["jab","cross"],undefined,2.2);b.wait(.6);
  b.say("Round 3","A composure reset.").wait(.6);reset(b);
  b.say("Review","Does your form change when tired? The first thing to slip is next week's focus.").wait(1.8);
  return b.done(fight(false,{title:"Composure self-check"}));
 }},
 "c8-trial-rounds":{speed:0,make(){
  const b=script(stance()),k=1.2;
  b.say("Two rounds","From the menu, at the easy-to-moderate effort you trained.").wait(.5);
  run(b,["jab","cross","leadHook"],undefined,k);shuffle(b,"back",{k});run(b,["rearUpper","leadHook"],undefined,k);shuffle(b,"forward",{k});
  run(b,["parryRear","jab","cross"],undefined,k);pivotOut(b,{k});
  b.say("Rest","Breathe out long.").to(EASY,.6);longOut(b,1,3);b.to(UP,.5);
  b.say("Mark it honestly","'Not yet' means repeat a week; it never blocks the story.").wait(1.4);
  return b.done(fight(false,{title:"Trial · steady rounds"}));
 }},
 "c8-trial-composure":{speed:0,make(){
  const b=script(stance());
  b.wait(.5);reset(b);
  run(b,["cover","jab","cross"],["Answer · cover-1-2","A defensive answer, precise."],1.3);b.wait(.8);
  b.say("Rounds 3–4 · crisp","One combination, starting crisp…");run(b,["jab","cross"]);b.wait(.8);
  b.say("Smooth","…dropping a tempo the moment form slips.");run(b,["jab","cross"],undefined,1.6);
  b.say("Review","Was your breath settled by the end of each rest?").wait(1.6);
  return b.done(fight(false,{title:"Trial · composure finish"}));
 }},
};
