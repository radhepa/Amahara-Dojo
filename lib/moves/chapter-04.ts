// Chapter 4 demonstrations: kicks, knees and balance, keyed by drill ID. Captions follow each drill's steps.
// The supported versions park the rear hand on the chair, so they show the lead leg working beside it.
import {CHAIR,KNEELING,READY,STAND,bow,calfRaise,chamber,combo,cut,exercise,fight,hipCircles,hit,kick,lift,march,ready,script,snap,stance,stepKick,unready,
 type Builder,type KickId,type MoveTable,type Spec} from "../shadow-kit";

type Say=[string,string];
// Forward of the rear hand, so the hand still reaches it while the weight is over the lead foot for a rear-leg kick.
const REAR_CHAIR={x:.12,z:.45};
const standing=(s:boolean):Spec=>({...STAND,chair:s?1:0});
const ex=(s:boolean,title:string,wall?:number)=>exercise({title,support:s,props:{...(wall?{wall}:{}),...(s?{chair:CHAIR}:{})}});
const walk=(b:Builder,n:number,swing=.35)=>march(b,n,.62,.025,swing);
// The kit's kick, with captions for its last two parts: back to chamber, then set down.
const kick4=(b:Builder,id:KickId,s:(Say|undefined)[],k=1)=>{kick(b,id,{k,chamberSay:s[0],say:s[1]});const t=b.t;if(s[2])b.say(s[2][0],s[2][1],t-.97*k);if(s[3])b.say(s[3][0],s[3][1],t-.7*k);return b;};
// Weight onto the rear leg; the lead foot circles at the ankle just off the floor.
const ankles=(b:Builder,n:number)=>{b.to({weight:0},.6).to({leadLift:.06,leadX:.06},.5);
 for(let i=0;i<n;i++)b.to({leadYaw:.45,leadHeel:.04},.4).to({leadYaw:0,leadHeel:-.03},.4).to({leadYaw:-.4,leadHeel:.04},.4).to({leadYaw:STAND.leadYaw,leadHeel:0},.4);
 return b.to({leadLift:0,leadX:STAND.leadX},.5).to({weight:.5},.5);};
// Small lead-leg swings from the rear leg, front to back or out to the side, well below hip height.
const swings=(b:Builder,n:number,side=false)=>{b.to({weight:0},.6).to({leadLift:.06},.4);
 for(let i=0;i<n;i++)if(side)b.to({leadZ:-.34,leadLift:.1},.5).to({leadZ:-.04,leadLift:.06},.5);else b.to({leadX:.24,leadLift:.14},.5).to({leadX:-.18,leadLift:.1},.6);
 return b.to({leadX:STAND.leadX,leadZ:STAND.leadZ,leadLift:0},.5).to({weight:.5},.5);};
// Standing split stance, rear heel up, pelvis tucked: the hips settle a little forward and hold; then the foot returns.
const hipFlexor=(b:Builder)=>{b.to({weight:.65},.3);lift(b,"rear",-.4,0,.8,.03,{rearYaw:0});b.to({rearHeel:.1,drop:.12,sx:.05,lean:-.03,weight:.6},1).breathe(1);
 b.to({rearHeel:0,drop:STAND.drop,sx:0,lean:.02,weight:.35},.8);lift(b,"rear",.4,0,.8,.03,{rearYaw:STAND.rearYaw});return b.to({weight:.5},.4);};
// Calf stretch at the wall: one foot steps back, heel down, a lean toward the wall; then the foot returns.
const calfStretch=(b:Builder)=>{b.to({wall:1,grip:.1},.9).to({weight:.65},.3);lift(b,"rear",-.36,0,.8,.03,{rearYaw:0});b.to({drop:.075,lean:.17,weight:.66},.9).breathe(1);
 b.to({drop:STAND.drop,lean:.02,weight:.4},.6);lift(b,"rear",.36,0,.8,.03,{rearYaw:STAND.rearYaw});return b.to({weight:.5,wall:0,grip:.3},.6);};
// A wider stance and an easy lean toward the lead side for the inner thighs; then the feet come back.
const sideLean=(b:Builder)=>{b.to({sz:.03},.3);lift(b,"lead",0,-.2,.6,.03);b.to({sz:-.08,drop:.1},1.1).breathe(1);b.to({sz:.03,drop:STAND.drop},.9);lift(b,"lead",0,.2,.6,.03);return b.to({sz:0},.3);};
// One knee drawn toward the chest; the rear hand stays on the chair when it is there.
const kneeHug=(b:Builder,s:boolean)=>b.to({weight:0},.6).to({leadLift:.36,leadX:.18,lReach:1,lX:.32,lY:-.02,lZ:-.12,...(s?{}:{rReach:1,rX:.32,rY:-.02,rZ:-.04})},1).wait(1.6)
 .to({leadLift:0,leadX:STAND.leadX,lReach:0,rReach:0},.9).to({weight:.5},.5);
// The rear knee drives up and forward from chamber; with reach, the lead hand pulls down to the hip.
const knee=(b:Builder,reach:boolean,say?:Say)=>{const down=chamber(b,"rear",{say}),out:Partial<Spec>={rearLift:.42,rearX:.36,rearZ:.06,sx:.08,lean:-.05,hipYaw:-.15,chestYaw:-.2,...(reach?{lX:.1,lY:.02,lZ:-.14}:{})},back=snap(b,out);
 b.to(out,.22,"punch").wait(.12,false).to(back,.24);return down();};

export const CHAPTER_04:MoveTable={
 "c4-warm":{support:true,make(s){
  const b=script(standing(s));
  b.say("March","March in place; let the knees rise a little higher, within comfort.");march(b,4,.62,.03,.3);march(b,4,.7,.08,.3);
  b.say("Ankle circles",s?"Each foot, holding the chair.":"Each foot in turn.");ankles(b,1);
  b.say("Leg swings","Small front-to-back swings, knee soft, well below hip height.");swings(b,3);
  b.say("Side swings","Small swings out to the side.");swings(b,2,true);
  calfRaise(b,2,{say:["Calf raises","Slow raises."]});
  hipCircles(b,1,{say:["Hip circles","Easy circles."]});
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, eyes on your point, a small bow."]});
  ready(b,{say:["Guard up","Step into stance; guard up on one sharp breath out."]});
  b.say("Stillness","One breath of stillness. Practice begins.").breathe(1);
  unready(b);
  return b.done(ex(s,"Hips, knees and ankles"));
 }},
 "c4-cool":{support:true,make(s){
  const b=script(standing(s));
  b.say("Walk it down","Hands down. Walk slowly; legs heavy and easy.");walk(b,6,.4);
  b.say("Hip flexor",s?"Holding the chair: split stance, pelvis tucked. 20 seconds each side.":"Split stance, pelvis tucked. 20 seconds each side.");hipFlexor(b);
  b.say("Calf stretch","Against the wall.");calfStretch(b);
  b.say("Side lean","An easy side lean for the inner thighs.");sideLean(b);
  b.say("Breathe","In for 4, out for 6. One kick that returned cleanly, one to repeat.").to({inhale:1},1.6).to({inhale:0},2.4);
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, a small bow. Practice ends."]});
  return b.done(ex(s,"Release the hips",.55));
 }},
 "c4-balance":{support:true,make(s){
  const b=script(standing(s));
  b.say("Shift",s?"Side-on to the chair, a hand on its back. Weight onto a soft standing knee.":"Soften the standing knee and shift your weight onto it.").to({weight:0},.9);
  b.say("Hold","Foot just off the floor. Tall and still, eyes on your point.").to({leadLift:.04},.6,"out").breathe(2);
  b.say("Rest","About 20 seconds, then set the foot down and rest.").to({leadLift:0},.6,"in").to({weight:.5},.7).wait(1);
  if(s)b.say("Other leg","Hold 2 on the other leg; hold 3 on the one that wobbled more.").wait(1.6);
  else b.say("Other leg","Hold 2 on the other leg.").to({weight:1},.9).to({rearLift:.04},.6,"out").breathe(2).to({rearLift:0},.6,"in").to({weight:.5},.7).wait(.8);
  b.say("Progress",s?"Only when steady: lighter fingertips first, then the knee a little higher.":"Only when steady: the knee lifted a little toward chamber height.")
   .to({weight:0},.8).to({leadLift:.14,leadX:.08},.8,"out").wait(1.4).to({leadLift:0,leadX:STAND.leadX},.7,"in").to({weight:.5},.7);
  return b.done(ex(s,"Supported single-leg balance"));
 }},
 "c4-chamber":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.say("Ready",s?"Side-on to the chair, a hand on it; guard with the free hand.":"Stance and guard, eyes on your point.").wait(.9);
  const down=chamber(b,"lead",{say:["Chamber","Lead knee up toward hip height or lower. Breathe out."],hold:1.6});
  b.say("Two counts","Standing knee soft, back tall, hips level.",b.t-1.6);
  b.say("Set down","Exactly where it came from, back in stance.");down();b.wait(1);
  if(s)b.say("Rear leg","Round 2: the rear leg. Turn so the chair stays on your free-hand side.").wait(1.8);
  else{const d=chamber(b,"rear",{say:["Rear leg","Round 2: the rear leg travels further."],hold:1.2});d();b.wait(1);}
  return b.done(fight(s,{title:"Knee raise to chamber"}));
 }},
 "c4-knee":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.wait(.8);
  if(!s)b.say("Reach","Lead hand forward at chest height, as if holding a shoulder.").to({lReach:1,lX:.5,lY:.42,lZ:-.06,lPalm:.6},.6).wait(.5);
  knee(b,!s,["Knee",s?"Rear knee up and forward, hip height or lower. Breathe out.":"Rear knee drives up as the hand pulls down. Hips forward. Breathe out."]);
  b.say("Set down","Foot back down in stance; guard home.");if(!s)b.to({lReach:0,lPalm:0},.4);
  b.wait(1.2);
  b.say("Rounds","4–5 knees per round. Round 2 with the other leg.").wait(1.4);
  return b.done(fight(s,{title:"Knee strike in the air",props:s?{chair:REAR_CHAIR}:{}}));
 }},
 "c4-teep":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.say("Ready",s?"Hand on the chair, stance and guard.":"Stance and guard.").wait(.9);
  const down=chamber(b,"lead",{say:["Chamber","Lead knee up; hold for two counts."],hold:1.2});
  kick4(b,"teep",[undefined,["Extend","Push through the heel, no higher than your hip. Breathe out."],["Re-chamber","Just short of a straight knee, then back to chamber."]]);
  b.say("Set down","Chamber, extend, re-chamber, set down.");down();
  b.wait(1);
  if(s)b.say("Rounds","Round 2: the rear leg. Round 3: the weaker leg.").wait(1.6);
  else{kick(b,"rearTeep",{chamberSay:["Rear leg","Round 2: the same four parts with the rear leg."]});b.wait(1);}
  return b.done(fight(s,{title:"Low front push kick",view:"side"}));
 }},
 "c4-round":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.say("Ready",s?"Hand on the chair, stance.":"Stance and guard.").wait(.9);
  kick4(b,"round",[["Chamber","Rear knee toward chamber, slightly out to the side."],["Swing","Standing heel turns toward your point; the shin swings low. Breathe out."],
   ["Back","Along the same path to chamber."],["Set down","Foot down in stance; the standing foot turns back."]],1.3);
  b.wait(1.2);
  b.say("Rounds","4 per round: rear leg, then lead leg with a smaller swing.").wait(1.4);
  return b.done(fight(s,{title:"Low round kick",props:s?{chair:REAR_CHAIR}:{}}));
 }},
 "c4-side":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.wait(.8);
  if(s)kick4(b,"side",[["Chamber","Skip the step: chamber the lead knee across the body."],["Press","Heel out sideways at shin height; lean slightly away."],["Re-chamber","Back to chamber…"],["Set down","…and down in your stance."]]);
  else{stepKick(b,{say:["Step up","Rear foot steps up behind the front heel. The feet never cross."],kickSay:["Press","Chamber across the body; press the heel out low, leaning slightly away."]});
   b.say("Back","Re-chamber, set the foot down, back in your stance.",b.t-1.52);}
  b.wait(1.2);
  b.say("Stop-kick","Short, direct, aimed at the knee line.").wait(1.4);
  return b.done(fight(s,{title:"Low side step-kick",view:"side"}));
 }},
 "c4-check":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.say("Picture","A low round kick coming at your lead leg.").wait(1);
  kick(b,"check",{chamberSay:["Check","Lead knee up and slightly out, shin turned out. Guard up."],say:["Hold","One count, then set the foot down in stance. Breathe."],hold:.8});
  b.wait(1);
  kick(b,"check",{chamberSay:["Round 3","Check…"]});hit(b,"jab",{say:["Round 3","…then a jab as the foot lands."]});
  b.wait(1.2);
  return b.done(fight(s,{title:"The check"}));
 }},
 "c4-chamber-hold":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.wait(.8);
  const down=chamber(b,"lead",{say:["Chamber","Lead knee to your chamber height: hip height or lower."]});
  b.say("Hold",s?"About 20 seconds: knee soft, back tall, guard with the free hand.":"About 20 seconds: standing knee soft, back tall, slow breaths.").breathe(3);
  b.say("Set down","Early, whenever form changes.");down();b.wait(.8);
  if(!s){const d=chamber(b,"rear",{say:["Other leg","Hold 2 on the other leg."]});b.breathe(2);d();b.wait(.8);}
  b.say("Progress",s?"Lighter fingertips, never a knee higher than the hip.":"Hold 3 on the weaker leg. Never lift the knee above the hip.").wait(1.4);
  return b.done(fight(s,{title:"Chamber holds"}));
 }},
 "c4-kick-build":{speed:1,make(){
  const b=script(stance());
  b.wait(.8);
  kick(b,"teep",{chamberSay:["Round 1","Lead front push kick: full chamber and return."]});
  b.say("Stance","Rebuild your stance before the next kick.").wait(1.1);
  kick(b,"round",{chamberSay:["Round 2","Rear low round kick. Breathe out on the kick."]});
  b.say("Stance","Round 3: the same two kicks on the other side.").wait(1.3);
  b.say("Round 4","Alternate them, with a stance check after each.").wait(1.3);
  return b.done(fight(false,{title:"Kick, chamber, return"}));
 }},
 "c4-links":{speed:1,make(){
  const b=script(stance());
  b.wait(.8);
  combo(b,["jab","cross"],{says:[["1-2, low kick","Jab, cross…"],undefined]});kick(b,"round",{chamberSay:["1-2, low kick","…and as the cross returns, the rear leg swings low."]});
  b.say("Pause","Check your balance.").wait(1.2);
  hit(b,"jab",{say:["Jab, push kick","Jab…"]});kick(b,"teep",{chamberSay:["Jab, push kick","…chamber, push, re-chamber, set down."]});
  b.say("Pause","Check your balance.").wait(1.2);
  kick(b,"check",{chamberSay:["Check and answer","Lift the check…"]});hit(b,"cross",{say:["Check and answer","…land, cross."]});
  b.wait(1.3);
  return b.done(fight(false,{title:"Hands into kicks",trail:true}));
 }},
 "c4-mobility":{support:true,make(s){
  const b=script(standing(s));
  hipCircles(b,1,{say:["Hip circles","Slow circles."]});
  b.say("Knee hug",s?"One knee gently toward the chest, holding the chair.":"One knee gently toward the chest.");kneeHug(b,s);
  b.say("Ankles","Circles and alphabet tracing with each foot.");ankles(b,2);
  b.say("Hip flexor","Split stance, 15–20 seconds each side.");hipFlexor(b);
  b.say("Rest","Recovery, not a workout.").breathe(1);
  return b.done(ex(s,"Hip and ankle care"));
 }},
 "c4-strength":{make(){
  const b=script({...STAND});
  b.say("Hip flexor stretch","Standing split stance: tuck the pelvis, shift gently forward. Switch sides halfway.");hipFlexor(b);
  cut(b,{...STAND,...KNEELING});
  b.say("Adductor rock-back","Hands and knees, one leg out to the side…");lift(b,"lead",.33,-.61,1,.06,{leadHeel:0});
  b.say("Adductor rock-back","…rock the hips slowly back, within comfort.");
  for(let i=0;i<2;i++)b.to({sx:-.14,drop:.56,lean:1.3},1.4).wait(.3).to({sx:0,drop:KNEELING.drop!,lean:KNEELING.lean!},1.2);
  cut(b,{...STAND});
  b.say("Side leg raise","Standing version: lift the leg out to the side, slightly behind, toes forward.").to({weight:0},.7);
  for(let i=0;i<2;i++)b.to({leadLift:.12,leadZ:-.34,leadX:-.05},1.1).wait(.3).to({leadLift:0,leadZ:STAND.leadZ,leadX:STAND.leadX},1.1);
  b.to({weight:.5},.6);
  calfRaise(b,3,{say:["Calf raise","Rise onto the toes and lower slowly."]});
  b.say("Stop early","End each exercise 2–3 reps before it gets hard.").wait(1);
  return b.done(exercise({title:"Hips and legs for kicking"}));
 }},
 "c4-selfcheck":{speed:1,support:true,make(s){
  const b=script(stance(s));
  b.say("One leg","Three kicks or holds, slowly. Watch the form checks.").wait(.6);
  chamber(b,"lead",{hold:1})();b.wait(.6);kick(b,"teep",{k:1.3});b.wait(.6);kick(b,"check");b.wait(.6);
  b.say("Other leg","The same. Which side is steadier?").wait(1.6);
  b.say("Round 3","Repeat the weaker side, slowly, with support.").wait(1.4);
  b.say("Review","One repeatable kick, one correction for next week.").wait(1.4);
  return b.done(fight(s,{title:"Kicks self-check"}));
 }},
 "c4-trial-1":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);
  chamber(b,"lead",{say:["Round 1","Chamber holds of two counts on the lead leg…"],hold:1.4})();
  kick(b,"teep",{chamberSay:["Round 1","…then front push kicks."]});b.wait(.8);
  b.say("Round 2","The same on the rear leg.");kick(b,"rearTeep");b.wait(.8);
  kick(b,"round",{chamberSay:["Round 3","Low round kicks, both legs."]});b.wait(.8);
  stepKick(b,{say:["Round 4","Low side step-kicks, both sides."]});b.wait(.8);
  b.say("Mark it honestly","Support counts fully; this trial measures control.").wait(1.6);
  return b.done(fight(false,{title:"Trial · chamber and height"}));
 }},
 "c4-trial-2":{speed:1,make(){
  const b=script(stance());
  b.wait(.6);
  combo(b,["jab","cross"],{says:[["Round 1","1-2 into a rear low round kick."],undefined]});kick(b,"round");b.wait(1);
  hit(b,"jab",{say:["Round 2","Jab into a lead front push kick."]});kick(b,"teep");b.wait(1);
  kick(b,"check",{chamberSay:["Round 3","Check and answer…"]});hit(b,"cross",{say:["Round 3","…land, cross."]});b.wait(1);
  b.say("Review","Compare the two sides honestly. The week can be repeated.").wait(1.6);
  return b.done(fight(false,{title:"Trial · kicks that come home",trail:true}));
 }},
};
