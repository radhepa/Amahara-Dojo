// Chapter 7 demonstrations: elbows, quarter-turn pivots, the Lantern Form and the bell-cued answers, keyed by drill ID.
// The Lantern Form is written once, count by count, and every form drill runs a slice of it. Captions follow each drill's steps.
import {FIGHT,READY,STAND,act,bow,combo,doubleJab,exercise,fight,hipCircles,hit,kick,lift,march,pivot,ready,script,shuffle,stance,stepKick,
 trunkTurns,unready,bigBreaths,type ActionId,type Builder,type KickId,type MoveTable,type Spec} from "../shadow-kit";

type Say=[string,string];
type Go=(b:Builder,k:number)=>void;
const Q=Math.PI/2;   // a quarter turn; + turns toward the lead side ({l})
const OPEN:Spec={...FIGHT,...READY};   // feet together, hands at the sides: where the form begins and ends
const h=(id:ActionId):Go=>(b,k)=>{hit(b,id,{k});};
const st=(dir:"forward"|"back"|"left"|"right"):Go=>(b,k)=>{shuffle(b,dir,{k});};
const kk=(id:KickId):Go=>(b,k)=>{kick(b,id,{k});};
const pause=(s:number):Go=>(b,k)=>{b.wait(s*k);};
// A form pivot: the quarter turn on the front ball, then a beat to find the point on that wall.
const pv=(a:number):Go=>(b,k)=>{pivot(b,a,{k:k*1.2});b.wait(.2*k);};
const bw:Go=(b,k)=>{b.to({lean:.42,tuck:.03},.8*k).wait(.5*k).to({lean:.02,tuck:0},.8*k);};
// Count 2: the lead foot steps out to hip width; open hands rise to chest height and close.
const handsRise:Go=(b,k)=>{lift(b,"lead",0,-.04,.4*k,.025);b.to({lReach:1,rReach:1,lX:.24,lY:.4,lZ:-.08,rX:.24,rY:.4,rZ:.08,grip:0},.6*k).to({grip:1},.25*k);};
// Count 3: the rear foot steps back into the stance, as ready() does it.
const stanceIn:Go=(b,k)=>{b.to({leadZ:FIGHT.leadZ,leadX:FIGHT.leadX*.5,rearX:FIGHT.rearX*.3},.5*k);
 lift(b,"rear",FIGHT.rearX-b.value("rearX"),FIGHT.rearZ-b.value("rearZ"),.5*k,.03,{rearYaw:FIGHT.rearYaw,leadX:FIGHT.leadX,leadYaw:FIGHT.leadYaw});};
// Count 4: the closed hands come up into the guard on one sharp breath out.
const guardUp:Go=(b,k)=>{b.to({hipYaw:FIGHT.hipYaw,chestYaw:FIGHT.chestYaw,headYaw:FIGHT.headYaw,drop:FIGHT.drop,sz:FIGHT.sz,lean:FIGHT.lean,rearHeel:FIGHT.rearHeel,leadHeel:FIGHT.leadHeel,
 fight:1,leadUp:1,rearUp:1,grip:1,lReach:0,rReach:0},.45*k,"out");};
// Count 79: the front foot steps back to hip width beside the rear foot; fists come to the belt.
const close:Go=(b,k)=>{lift(b,"lead",-b.value("leadX"),-.11-b.value("leadZ"),.5*k,.03,{leadYaw:READY.leadYaw!,leadHeel:0,rearYaw:-.3,rearHeel:0,hipYaw:-.2,chestYaw:-.2,headYaw:0,sz:.02});
 b.to({fight:0,leadUp:0,rearUp:0,lReach:1,rReach:1,lX:.08,lY:.05,lZ:-.15,rX:.08,rY:.05,rZ:.15,grip:1},.4*k);};
// Count 80: the rear foot steps in beside the front foot, hands to the sides, and the bow.
const together:Go=(b,k)=>{lift(b,"rear",READY.rearX!-b.value("rearX"),READY.rearZ!-b.value("rearZ"),.5*k,.03,
 {rearYaw:READY.rearYaw!,leadZ:READY.leadZ!,hipYaw:0,chestYaw:0,drop:READY.drop!,sz:0,lean:READY.lean!,lReach:0,rReach:0,grip:READY.grip!});bw(b,k);};
// The push kick sets down forward: the kick, then a step in.
const pushKick:Go=(b,k)=>{kick(b,"teep",{k});shuffle(b,"forward",{k});};

// ── The Lantern Form, counts 1–80 (lib/curriculum/chapter-07.ts LANTERN_FORM) ──
type Count={n:[number,number];name:string;go:Go;kiai?:boolean};
const c=(n:number,name:string,go:Go,to=n):Count=>({n:[n,to],name,go});
const FORM:Count[]=[
 c(1,"bow",bw),c(2,"hands rise",handsRise),c(3,"stance",stanceIn),c(4,"guard",guardUp),
 c(5,"jab",h("jab")),c(6,"cross",h("cross")),c(7,"lead hook",h("leadHook")),c(8,"guard reset",pause(.4)),
 c(9,"step forward",st("forward")),c(10,"rear elbow",h("rearElbow")),c(11,"upward elbow",h("leadUpElbow")),c(12,"rear uppercut",h("rearUpper")),
 c(13,"high cover",(b,k)=>{hit(b,"cover",{k,hold:1.1});},14),
 c(15,"step back",st("back")),c(16,"jab",h("jab")),c(17,"cross",h("cross")),c(18,"parry",h("parryRear")),c(19,"jab",h("jab")),c(20,"zanshin",pause(.9)),
 c(21,"pivot {l}",pv(Q)),c(22,"jab",h("jab")),c(23,"cross",h("cross")),c(24,"slip {r}",h("slipRight")),c(25,"cross",h("cross")),c(26,"pivot front",pv(-Q)),
 c(27,"pivot {r}",pv(-Q)),c(28,"jab",h("jab")),c(29,"cross",h("cross")),c(30,"lead hook",h("leadHook")),c(31,"pivot front",pv(Q)),
 c(32,"step back",st("back")),c(33,"roll",h("roll"),34),c(35,"lead hook",h("leadHook")),c(36,"cross",h("cross")),
 c(37,"step {l}",st("left")),c(38,"step {r}",st("right")),c(39,"high cover",h("cover")),c(40,"zanshin",pause(.9)),
 c(41,"check",kk("check"),42),c(43,"cross",h("cross")),c(44,"round kick",kk("round"),47),c(48,"guard reset",pause(.4)),
 c(49,"side kick",(b,k)=>{stepKick(b,{k});},53),
 c(54,"jab",h("jab")),c(55,"cross",h("cross")),c(56,"slip {r}",h("slipRight")),c(57,"cross",h("cross")),c(58,"lead hook",h("leadHook")),c(59,"step back",st("back")),c(60,"zanshin",pause(.9)),
 c(61,"push kick",pushKick,64),c(65,"jab",h("jab")),c(66,"cross",h("cross")),c(67,"lead hook",h("leadHook")),c(68,"rear elbow",h("rearElbow")),
 c(69,"rear knee",kk("rearKnee"),70),c(71,"high cover",h("cover")),c(72,"step back",st("back")),c(73,"jab",h("jab")),c(74,"cross",h("cross")),
 {...c(75,"round kick · kiai",kk("round"),77),kiai:true},c(78,"zanshin",pause(.9)),c(79,"close",close),c(80,"bow",together),
];
// Each part of the drill text, by its first count.
const PARTS:[number,string][]=[
 [1,"Opening: bow, hands rise and close, rear foot back, guard up."],[5,"Hands: jab, cross, lead hook, guard reset."],
 [9,"Step forward; rear elbow, upward elbow, rear uppercut, cover held."],[15,"Return: step back, jab, cross, rear-hand parry, jab, zanshin."],
 [21,"{L} turn: pivot, find that wall's point, jab, cross, slip, cross, pivot back."],[27,"{R} turn: pivot, find the point, jab, cross, lead hook, pivot back."],
 [32,"Roll and return: step back, roll, hook, cross, step {l}, step {r}, cover."],
 [41,"Lead check, set down, cross; round kick back to chamber, then stance."],[49,"Rear foot steps up behind; knee across, low side kick, re-chamber, set down."],
 [54,"Hands and exit: jab, cross, slip, cross, hook, step back, zanshin."],
 [61,"Knee up, low push kick, re-chamber, set down forward; jab, cross, hook, elbow."],[69,"Rear knee with hands pulling down, set down, cover, step back, jab, cross."],
 [75,"Round kick with a kiai: a short shout or a silent sharp breath."],[78,"Zanshin; front foot back, fists at the belt; feet together, bow."],
];
const SECTIONS:Say[]=[["Section 1","Opening and hands, counts 1–20."],["Section 2","Turns, counts 21–40."],["Section 3","The low line, counts 41–60."],["Section 4","The return, counts 61–80."]];
const part=(n:number)=>PARTS.filter(p=>p[0]<=n).pop()![1];
type Run={k:number;gap:number;mode:"count"|"section"|"none";after?:Go;sections?:readonly (Say|undefined)[]};
// Counts from..to of the form. count: a caption per count; section: one per section (and the kiai).
function form(b:Builder,from:number,to:number,o:Run){
 for(const s of FORM){const [a,z]=s.n;if(a<from||z>to)continue;
  if(o.mode==="count")b.say(`${a}${z>a?"–"+z:""} · ${s.name}`,part(a));
  if(o.mode==="section"&&(a-1)%20===0)b.say(...(o.sections?.[(a-1)/20]??SECTIONS[(a-1)/20]));
  if(o.mode==="section"&&s.kiai)b.say("76 · kiai","Round kick with a short shout or a silent sharp breath.");
  s.go(b,o.k);o.after?.(b,o.k);if(o.gap)b.wait(o.gap*o.k);
 }
 return b;
}
// Back to the start mark: the form steps back once in sections 2 and 3 (both feet move together).
function toMark(b:Builder,k=1){const d=FIGHT.leadX-b.value("leadX");if(Math.abs(d)>.005)shuffle(b,d>0?"forward":"back",{k,d:Math.abs(d)});return b;}
// Sections 1..last back to back, onto the start mark after each; rebuild captions the stance rebuild between sections.
function sections(b:Builder,last:number,o:Run,rebuild=false){
 for(let i=0;i<last;i++){form(b,i*20+1,i*20+20,o);if(rebuild&&i<last-1)b.say("Rebuild",`Rebuild your stance at count ${i*20+20}.`).wait(.7);if(i<3)toMark(b,o.k);}
 return b;
}
const SLOW:Run={k:1.3,gap:.35,mode:"count"},COUNT:Run={k:.7,gap:.05,mode:"section"};
const formMeta=(title:string)=>fight(false,{title});

// ── Drill helpers ──
const walk=(b:Builder,n:number,swing=.35,extra?:(i:number,t0:number,t1:number)=>void)=>march(b,n,.62,.025,swing,extra);
// Ankle circles: weight onto the rear foot, the lead foot lifts a touch and the ankle circles.
function ankleCircles(b:Builder,n:number){b.to({sz:.03},.3).to({leadLift:.05},.3);for(let i=0;i<n;i++)b.to({leadYaw:.45,leadHeel:.03},.35).to({leadYaw:-.35,leadHeel:-.02},.35);
 return b.to({leadYaw:STAND.leadYaw,leadHeel:0,leadLift:0},.35).to({sz:0},.3);}
// Ankle rocks: the knees travel forward over the toes, heels down, and back.
function ankleRocks(b:Builder,n:number){for(let i=0;i<n;i++)b.to({drop:.08,lean:.06},.8).to({drop:STAND.drop,lean:.02},.8);return b;}
// A half-range straight from each hand: the warm-up's easy jabs.
const halfJabs=(b:Builder,n:number)=>{for(let i=0;i<n;i++){act(b,[[{jab:.5,hipYaw:-.7,chestYaw:-.85},.3,"inOut"]],{back:.3});act(b,[[{cross:.5,hipYaw:-.35,chestYaw:-.35,rearHeel:.07},.3,"inOut"]],{back:.3});}};
// Standing open book: arms forward together, the rear arm opens wide behind and the chest turns after it.
function openBook(b:Builder,n:number){b.to({lReach:1,rReach:1,lX:.45,lY:.42,lZ:-.03,rX:.45,rY:.42,rZ:.03},.8);
 for(let i=0;i<n;i++)b.to({rX:-.15,rZ:.5,chestYaw:.7,headYaw:.5},1.6).wait(.4).to({rX:.45,rZ:.03,chestYaw:0,headYaw:0},1.4);
 return b.to({lReach:0,rReach:0},.7);}
const upElbow=(b:Builder,k=1)=>{b.to({drop:.11},.25*k);hit(b,"leadUpElbow",{k});return b.to({drop:FIGHT.drop},.25*k);};
// A bell cue: stillness in the stance, the call on screen, then one answer and the guard home.
function cue(b:Builder,still:Say,wait:number,call:Say,answer:(b:Builder)=>void){b.say(...still).wait(wait);b.say(...call);answer(b);return b.wait(.9);}
const ONETWO=(b:Builder)=>{combo(b,["jab","cross"]);};
const WAIT:Say=["Wait","Relaxed and still in your stance, eyes on your point."];

export const CHAPTER_07:MoveTable={
 "c7-warm":{make(){
  const b=script({...STAND});
  b.say("March","Clear your space; march gently. Breathing rises a little.");walk(b,4);
  b.say("Ankles","Ankle circles, then slow ankle rocks over the toes.");ankleCircles(b,3);ankleRocks(b,2);
  hipCircles(b,1,{say:["Hips","Slow hip circles…"]});trunkTurns(b,1,{say:["Trunk turns","…then trunk turns."]});
  b.say("Pivots","Four slow quarter turns on the front foot: {l}, back, {r}, back.");ready(b);
  for(const a of [Q,-Q,-Q,Q])pivot(b,a,{k:1.6});
  b.say("Half-range jabs","Five easy jabs per hand.");halfJabs(b,2);
  unready(b);bow(b,{say:["Bow","Feet together, a small bow to the front."]});
  ready(b,{say:["Guard up","Step into stance; guard up with one sharp breath out."]});
  b.say("Stillness","One breath of stillness. Practice begins.").breathe(1);
  unready(b);
  return b.done(exercise({title:"Turns and pivots warm-up"}));
 }},
 "c7-cool":{make(){
  const b=script({...STAND});
  b.say("Walk it out","Slowly in a small circle one way, then the other. Shake out the arms.");
  walk(b,4,.5,(i,t0,t1)=>b.key("turn",t0,t1,(i+1)*.3));walk(b,4,.5,(i,t0,t1)=>b.key("turn",t0,t1,1.2-(i+1)*.3));
  b.say("Calf stretch","Hands on the wall; one foot steps back, heel down.").to({wall:1,grip:.1},.9);
  b.to({weight:.65},.3);lift(b,"rear",-.36,0,.8,.03,{rearYaw:0});b.to({drop:.075,lean:.17,weight:.66},.9).breathe(1);
  b.to({drop:.01,lean:.02,weight:.4},.6);lift(b,"rear",.36,0,.8,.03,{rearYaw:STAND.rearYaw});b.to({weight:.5,wall:0,grip:.3},.6);
  b.say("Hip flexor","Rear foot back, heel up; sink gently into the stretch.");
  b.to({weight:.65},.3);lift(b,"rear",-.4,0,.8,.03,{rearYaw:0});b.to({rearHeel:.1,drop:.12,lean:-.02,weight:.6},1).breathe(1);
  b.to({rearHeel:0,drop:STAND.drop,lean:.02,weight:.4},.8);lift(b,"rear",.4,0,.8,.03,{rearYaw:STAND.rearYaw});b.to({weight:.5},.3);
  trunkTurns(b,1,{say:["Trunk rotation","Slow standing turns, side to side."]});
  bigBreaths(b,2,{say:["Breathe","In 4, out 6. Name one section that flowed, one count to revisit."]});
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, a small bow. Practice ends."]});
  return b.done(exercise({title:"Ankles, hips and breath",view:"side",props:{wall:.5}}));
 }},
 "c7-elbows":{speed:1,make(){
  const b=script(stance());
  b.say("Guard","Close range. Short path, sharp end.").wait(1);
  hit(b,"rearElbow",{say:["Rear elbow","Heel and hip turn; elbow sweeps across at shoulder height, to your centre line."]});b.wait(.8);hit(b,"rearElbow");
  b.say("Guard home","Both hands back in guard. Breathe out sharply on each.").wait(1.2);
  b.say("Upward elbow","Soften the knees, then drive the lead elbow up; forearm vertical.");upElbow(b);b.wait(.8);upElbow(b);
  b.say("Guard home","Compact, with no wind-up.").wait(1.2);
  b.say("Alternate","Rear horizontal, then lead upward, in turn.");hit(b,"rearElbow");b.wait(.3,false);upElbow(b);
  b.say("Hold","Guard and eyes for one count.").wait(1.2);
  return b.done(fight(false,{title:"Elbows: horizontal and upward",trail:true}));
 }},
 "c7-pivots":{make(){
  const b=script(stance());
  b.wait(.6);pivot(b,Q,{k:1.6,say:["Pivot {L}","Turn on the front ball; the rear foot swings a quarter-circle behind."]});
  b.say("Settle","Guard up, eyes on the point of that wall. One breath.").breathe(1);
  pivot(b,-Q,{k:1.6,say:["Back","Pivot back to the front. The feet never cross."]});b.wait(.8);
  pivot(b,-Q,{k:1.6,say:["Pivot {R}","The same front-foot pivot; the rear foot swings the other way."]});
  b.say("Settle","Guard up, eyes on that wall's point. One breath.").breathe(1);
  pivot(b,Q,{k:1.6,say:["Back","Pivot back to the front."]});b.wait(.8);
  b.say("Round 3","{L}, back, {R}, back, with a jab at each new direction.");
  for(const a of [Q,-Q,-Q,Q]){pivot(b,a,{k:1.3});b.wait(.3);hit(b,"jab");b.wait(.5);}
  return b.done(fight(false,{title:"Quarter-turn pivots",view:"above"}));
 }},
 "c7-sec1":{make(){
  const b=script(OPEN);form(b,1,20,SLOW);
  b.say("Rounds","Slowly, saying the counts; then stop to recall; then smoothly.").wait(1);unready(b);
  return b.done(formMeta("Lantern Form · section 1"));
 }},
 "c7-sec2":{make(){
  const b=script(stance());b.wait(.6);form(b,21,40,SLOW);
  b.say("Rounds","As in section 1. Pivots stay a quarter turn; feet never cross.").wait(.6);toMark(b);
  return b.done(formMeta("Lantern Form · section 2"));
 }},
 "c7-sec3":{make(){
  const b=script(stance());b.wait(.6);form(b,41,60,SLOW);
  b.say("Rounds","Support beside you for counts 41–53. Kicks stay at or below hip height.").wait(.6);toMark(b);
  return b.done(formMeta("Lantern Form · section 3"));
 }},
 "c7-sec4":{make(){
  const b=script(stance());b.wait(.6);form(b,61,80,SLOW);
  b.say("Rounds","As before, support beside you for the kicks and the knee.").wait(.6);ready(b);
  return b.done(formMeta("Lantern Form · section 4"));
 }},
 "c7-count-12":{make(){
  const b=script(OPEN);
  b.say("Count tempo","Counts 1–40, one move per count. Lost it? Hold guard, rejoin next section.").wait(1.2);
  sections(b,2,COUNT);b.say("Review","Rebuild your stance and note where you paused.").wait(.8);unready(b);
  return b.done(formMeta("Sections 1–2 on the count"));
 }},
 "c7-count-123":{make(){
  const b=script(OPEN);
  b.say("Count tempo","Counts 1–60 on the bell's count.").wait(1);
  sections(b,3,{...COUNT,sections:[undefined,undefined,["Section 3","Counts 41–60. Keep your support near for the kicks."]]},true);
  b.wait(.6);unready(b);
  return b.done(formMeta("Sections 1–3 on the count"));
 }},
 "c7-tempo":{make(){
  const b=script(stance());
  b.say("Slow","Very slowly, almost a moving meditation; each move held for a breath.").wait(.8);
  form(b,5,8,{k:2,gap:0,mode:"count",after:b=>{b.to({inhale:1},.8).to({inhale:0},1);}});
  b.say("Review","Shake out and rebuild your stance.").to({shrug:.03},.4).to({shrug:0},.4).wait(.6);
  b.say("Count tempo","A slightly slower count than usual. Same shapes: compact elbows.").wait(.4);
  form(b,5,15,{k:1.1,gap:.2,mode:"none"});b.wait(1);
  return b.done(formMeta("Tempo ladder for the form"));
 }},
 "c7-smooth":{make(){
  const b=script(OPEN);b.wait(.6);
  sections(b,4,{k:.75,gap:0,mode:"section",sections:[["Round 1","Section 1, flowing, with no stops except the zanshin counts."],
   ["Round 2","Section 2. Stall? Go back to the start of that section."],["Round 3","Section 3. Every kick still returns to chamber."],["Round 4","Section 4. Smooth is not fast."]]});
  return b.done(formMeta("Smooth: the form without stops"));
 }},
 "c7-form":{make(){
  const b=script(OPEN);
  b.say("Count-tempo run","The whole form on the bell's count, counts 1–80.").wait(1);sections(b,4,COUNT);
  return b.done(formMeta("The Lantern Form · whole"));
 }},
 "c7-cue-intro":{make(){
  const b=script(stance());
  cue(b,["Wait","Relaxed and still, eyes on your point. Do not guess."],2.4,["Bell · high ping","Throw a 1-2. Guard home."],ONETWO);
  cue(b,["Wait","Calls come every 4–7 seconds."],2.6,["Bell · low knock","Step back out, guard up."],b=>{shuffle(b,"back");});
  b.say("Guard home","Every answer ends with your guard home. Then wait again.");toMark(b);b.wait(1.6);
  return b.done(fight(false,{title:"Answer the bell"}));
 }},
 "c7-cue-defense":{make(){
  const b=script(stance());
  cue(b,["Wait","Relaxed in stance. Picture the strike each call represents."],2.2,["Bell · high ping","Parry, then jab."],b=>{combo(b,["parryRear","jab"]);});
  cue(b,WAIT,2.6,["Bell · low knock","Slip, then cross."],b=>{combo(b,["slipRight","cross"]);});
  cue(b,["Wait","Every answer returns to centre and guard."],2.2,["Bell · double ping","Roll under, rise in guard. Slow and small."],b=>{hit(b,"roll",{k:1.3});});
  return b.done(fight(false,{title:"Defensive answers"}));
 }},
 "c7-cue-intercept":{make(){
  const b=script(stance());
  cue(b,["Wait","Stillness between calls makes the answer fast."],2.4,["Bell · high ping","Stop-hit: a jab from complete stillness, no wind-up."],b=>{hit(b,"jab");});
  cue(b,WAIT,2.4,["Bell · double ping","Stop-kick: a low side step-kick at knee height."],b=>{stepKick(b);});
  cue(b,["Wait","Relaxation, not force."],2.2,["Bell · low knock","They got there first: cover, then 1-2."],b=>{hit(b,"cover");combo(b,["jab","cross"]);});
  return b.done(fight(false,{title:"Intercept"}));
 }},
 "c7-cue-mixed":{make(){
  const b=script(stance());
  cue(b,WAIT,2.2,["Bell · high ping","1-2."],ONETWO);
  cue(b,WAIT,2.4,["Bell · low knock","Check, land, cross."],b=>{kick(b,"check");hit(b,"cross");});
  cue(b,WAIT,2.4,["Bell · double ping","1-2 into a low round kick."],b=>{combo(b,["jab","cross"]);kick(b,"round");});
  b.say("Rebuild","After a kick, rebuild your stance before the next call.").wait(1.2);
  return b.done(fight(false,{title:"Strike and kick answers"}));
 }},
 "c7-cue-menu":{make(){
  const b=script(stance());
  cue(b,WAIT,2.2,["Bell · high ping","Any hand combination: here, 1-2-hook."],b=>{combo(b,["jab","cross","leadHook"]);});
  cue(b,WAIT,2.4,["Bell · low knock","Any defense-counter pair: here, slip and lead hook."],b=>{combo(b,["slipLeft","leadHook"]);});
  cue(b,WAIT,2.4,["Bell · double ping","Any punch-kick link: here, jab into a push kick."],b=>{hit(b,"jab");kick(b,"rearTeep");});
  cue(b,["Wait","Calls come every 5–8 seconds."],2.4,["Bell · high ping","Vary it: this time 1-1-2."],b=>{doubleJab(b);hit(b,"cross");});
  return b.done(fight(false,{title:"Cues with the combination menu"}));
 }},
 "c7-mobility":{make(){
  const b=script({...STAND});
  b.say("Round 1","Ankle rocks over the toes, then slow ankle circles.");ankleRocks(b,2);ankleCircles(b,3);
  b.say("Rest","Rest between rounds. Recovery, not a workout.").breathe(1);
  trunkTurns(b,2,{say:["Round 2","Slow trunk rotations…"]});
  b.say("Open book","…then the open book: one arm opens wide and the chest turns after it.");openBook(b,1);
  b.say("Rest","Hands down; breathe.").breathe(1);
  b.say("Round 3","Slow pivots, an eighth of a turn each way. Feel the ball of the foot turn.");
  for(const a of [Q/2,-Q/2,-Q/2,Q/2]){pivot(b,a,{k:2});b.wait(.5);}
  return b.done(exercise({title:"Mobility for turns"}));
 }},
 "c7-selfcheck":{make(){
  const b=script(stance());
  b.say("Round 1","This week's section, slowly. Note where you paused to remember.").wait(.6);form(b,5,15,{k:1.3,gap:.25,mode:"none"});b.wait(.6);
  b.say("Round 2","That part, three times.");form(b,10,12,{k:1.2,gap:.2,mode:"none"});b.wait(.4);form(b,10,12,{k:1.2,gap:.2,mode:"none"});b.wait(.8);
  b.say("Round 3","This week's elbow drill, checking its form points.");hit(b,"rearElbow",{k:1.3});b.wait(.4);upElbow(b,1.3);b.wait(.8);
  b.say("Review","One part that is yours, one to repeat.").wait(1.6);
  return b.done(fight(false,{title:"Form and timing self-check"}));
 }},
 "c7-trial-turns":{make(){
  const b=script(stance());
  b.say("Round 1","Section 2 at smooth tempo. Watch your feet on every pivot.").wait(.6);form(b,21,31,{k:.9,gap:.05,mode:"none"});b.wait(.8);
  b.say("Round 2","Section 1 at smooth tempo. Watch your elbows.");form(b,5,15,{k:.9,gap:.05,mode:"none"});b.wait(.8);
  b.say("Round 3","Four quarter-turn pivots with a 1-2 at each wall.");
  for(const a of [Q,-Q,-Q,Q]){pivot(b,a,{k:1.2});b.wait(.2);combo(b,["jab","cross"]);b.wait(.3);}
  b.say("Round 4","Elbows, slowly.");hit(b,"rearElbow",{k:1.6});b.wait(.4);upElbow(b,1.6);b.wait(.6);
  b.say("Mark it","Mark the checks honestly. A 'not yet' never blocks the story.").wait(1.4);
  return b.done(fight(false,{title:"Trial · turns and elbows"}));
 }},
 "c7-trial-form":{make(){
  const b=script(OPEN);
  b.say("Count-tempo run","The whole form from memory, on the bell's count.").wait(1);sections(b,4,COUNT);
  b.say("Mark it","Mark the checks honestly.").wait(1);
  return b.done(formMeta("Trial · the Lantern Form, two tempos"));
 }},
 "c7-trial-cues":{make(){
  const b=script(stance());
  cue(b,WAIT,2.2,["Bell · high ping","1-2."],ONETWO);
  cue(b,WAIT,2.4,["Bell · low knock","Slip, then cross."],b=>{combo(b,["slipRight","cross"]);});
  cue(b,WAIT,2.4,["Bell · double ping","Low side step-kick."],b=>{stepKick(b);});
  b.say("Count","Answer once, back to guard. Count clean answers in round 4: a record.").wait(1.4);
  return b.done(fight(false,{title:"Trial · cue-reaction set"}));
 }},
};
