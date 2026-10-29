// Chapter 6 demonstrations: quiet small-space work, Form One count by count, strength, mobility flows and travel, keyed by drill ID.
import {CHAIR,FIGHT,FIGHT_CHAIR,KNEELING,PLANK,READY,STAND,SUPINE,armSwings,bow,bridge,calfRaise,chamber,combo,cut,exercise,fight,hipCircles,hit,kick,
 lift,march,pivot,plank,ready,script,shoulderCircles,shuffle,sidePlank,splitSquat,stance,trunkTurns,unready,wallPushup,wristCircles,type Builder,type MoveTable,type Spec} from "../shadow-kit";
import {C12H,SIDE,ankles,calfStretch,flexor,still,walk} from "./chapter-05";

// ── Form One ───────────────────────────────────────────────────────────
type Say=(n:number,title:string,body:string,at?:number)=>void;
// For a run of the whole form, one caption per stretch of counts instead of one per count.
const GROUPS:Record<number,[string,string]>={
 1:["1–4 · Opening","Bow, step out, step back into stance, guard up."],5:["5–13 · The straight line","Jab, cross, step in, jab, jab, cross, parry, jab, step back."],
 14:["14–17 · Sideways","Step {l}, jab, cross, step {r} back to centre."],18:["18 · Zanshin","Rebuild your stance: guard up, eyes forward, one breath."],
 19:["19–25 · Curve and knee","Slip, cross, hook, reset; rear knee to chamber, hold, set down."],26:["26–29 · The kick","Lead knee up, low push kick, re-chamber, set down."],
 30:["30–32 · Finish","High cover, jab, cross with a kiai."],33:["33 · Zanshin","Rebuild your stance. One breath."],34:["34–36 · Close","Draw back, feet together, bow."],
};
const counter=(b:Builder,full:boolean):Say=>(n,title,body,at)=>{if(full)b.say(`${n} · ${title}`,body,at);else if(GROUPS[n])b.say(...GROUPS[n],at);};
const FORM_START=stance(false,READY,{grip:.3});
const BELT:Partial<Spec>={lReach:1,lX:.14,lY:.02,lZ:-.14,rReach:1,rX:.14,rY:.02,rZ:.14,grip:.75};
const RISE:Partial<Spec>={hipYaw:FIGHT.hipYaw,chestYaw:FIGHT.chestYaw,headYaw:FIGHT.headYaw,drop:FIGHT.drop,sz:FIGHT.sz,lean:FIGHT.lean,rearHeel:FIGHT.rearHeel,leadHeel:FIGHT.leadHeel,fight:1,leadUp:1,rearUp:1,grip:1,lReach:0,rReach:0};
const LOWER:Partial<Spec>={fight:0,leadUp:0,rearUp:0,hipYaw:0,chestYaw:0,headYaw:0,drop:READY.drop!,sz:0,lean:READY.lean!,leadHeel:0,rearHeel:0};
// Count 3: the rear foot steps back into stance while the lead foot settles forward (as ready() does).
const stepBack=(b:Builder)=>{b.to({leadX:FIGHT.leadX*.5,leadZ:FIGHT.leadZ,rearX:FIGHT.rearX*.3},.35);lift(b,"rear",FIGHT.rearX-b.value("rearX"),FIGHT.rearZ-b.value("rearZ"),.5,.03,{rearYaw:FIGHT.rearYaw,leadX:FIGHT.leadX,leadYaw:FIGHT.leadYaw});};
// Count 34: the guard lowers to fists at the belt and the front foot draws back to hip width.
const drawBack=(b:Builder)=>{b.to({...LOWER,...BELT},.45);lift(b,"lead",READY.leadX!-b.value("leadX"),FIGHT.leadZ-b.value("leadZ"),.5,.03,{leadYaw:READY.leadYaw!});};
// Count 35: the rear foot steps up beside the lead, hands by the sides.
const together=(b:Builder)=>{lift(b,"rear",READY.rearX!-b.value("rearX"),READY.rearZ!-b.value("rearZ"),.45,.03,{rearYaw:READY.rearYaw!,leadZ:READY.leadZ!,lReach:0,rReach:0,grip:.3});};
// Section A, counts 1–18, from feet together; p is the pause after each count.
function formA(b:Builder,say:Say,p:number){
 const one=(n:number,title:string,body:string,act:()=>unknown)=>{say(n,title,body);act();b.wait(p);};
 one(1,"Bow","Feet together, hands by your sides, eyes forward.",()=>bow(b));
 one(2,"Step out","{L} foot steps out to hip width; loose fists at the belt.",()=>lift(b,"lead",0,FIGHT.leadZ-b.value("leadZ"),.45,.03,BELT));
 one(3,"Stance","Rear foot steps back into stance.",()=>stepBack(b));
 one(4,"Guard","The guard rises with one sharp breath out.",()=>cut(b.to(RISE,.45,"out"),{lX:0,lY:0,lZ:0,rX:0,rY:0,rZ:0}));
 one(5,"Jab","Lead hand out and home.",()=>hit(b,"jab"));
 one(6,"Cross","Rear heel turns; straight out and home.",()=>hit(b,"cross"));
 one(7,"Step forward","Front foot first; the rear foot follows.",()=>shuffle(b,"forward"));
 one(8,"Jab","",()=>hit(b,"jab"));
 one(9,"Jab","",()=>hit(b,"jab"));
 one(10,"Cross","",()=>hit(b,"cross"));
 one(11,"Parry","Rear-hand parry.",()=>hit(b,"parryRear"));
 one(12,"Jab","",()=>hit(b,"jab"));
 one(13,"Step back","Rear foot first; the front foot follows.",()=>shuffle(b,"back"));
 one(14,"Step {l}","{L} foot first.",()=>shuffle(b,"left"));
 one(15,"Jab","",()=>hit(b,"jab"));
 one(16,"Cross","",()=>hit(b,"cross"));
 one(17,"Step {r}","Back to centre.",()=>shuffle(b,"right"));
 say(18,"Zanshin","Guard up, eyes forward, one breath.");b.breathe(1);
}
// Section B, counts 19–36, from stance; ends feet together after the bow.
function formB(b:Builder,say:Say,p:number){
 const one=(n:number,title:string,body:string,act:()=>unknown)=>{say(n,title,body);act();b.wait(p);};
 one(19,"Slip","Slip {r}.",()=>hit(b,"slipRight"));
 one(20,"Cross","",()=>hit(b,"cross"));
 one(21,"Lead hook","",()=>hit(b,"leadHook"));
 one(22,"Guard reset","Hands home, stance set.",()=>b.wait(.4));
 say(23,"Rear knee","Rises to chamber.");const down=chamber(b,"rear",{k:1.2});b.wait(p);
 say(24,"Hold","Hold the chamber.");b.wait(.8);
 one(25,"Set down","Back down in stance.",()=>down());
 const k=1.3,t0=b.t;kick(b,"teep",{k});
 say(26,"Lead knee","To chamber.",t0);say(27,"Push kick","Low front push kick.",t0+.75*k);say(28,"Re-chamber","Knee back to chamber.",t0+1.07*k);say(29,"Set down","Back down in stance.",t0+1.312*k);b.wait(p);
 one(30,"High cover","Cover, then hold.",()=>hit(b,"cover"));
 one(31,"Jab","",()=>hit(b,"jab"));
 one(32,"Cross · kiai","A short shout, or a silent sharp breath.",()=>hit(b,"cross"));
 say(33,"Zanshin","Guard up, eyes forward, one breath.");b.breathe(1);
 one(34,"Draw back","Front foot draws back to hip width, fists at the belt.",()=>drawBack(b));
 one(35,"Feet together","Hands by your sides.",()=>together(b));
 say(36,"Bow","");bow(b);
}
const closeForm=(b:Builder,say:[string,string])=>{b.say(...say);drawBack(b);b.wait(.3);together(b);return b.wait(.5);};
const form=(o:{title:string;chair?:boolean})=>fight(false,{title:o.title,props:o.chair?{chair:FIGHT_CHAIR}:{}});

// ── Exercise helpers ───────────────────────────────────────────────────
// Squat to chair: the hips sit back and down as if to touch a seat, then stand.
const sitBack=(b:Builder,n:number)=>{for(let i=0;i<n;i++)b.to({drop:.4,sx:-.14,lean:.5,lReach:1,rReach:1,lX:.5,lY:.4,lZ:-.15,rX:.5,rY:.4,rZ:.15},1.4).wait(.3).to({drop:STAND.drop,sx:0,lean:.02,lReach:0,rReach:0},1.3).wait(.2);return b;};
// Feet split for a split squat (lead or rear foot forward), and back to standing.
const split=(b:Builder,front:"lead"|"rear")=>{const back=front==="lead"?"rear":"lead";b.to({weight:front==="lead"?.4:.6},.25);lift(b,front,.36,0,.5,.03,{[`${front}Yaw`]:0} as Partial<Spec>);lift(b,back,-.38,0,.55,.03,{[`${back}Yaw`]:0,[`${back}Heel`]:.11} as Partial<Spec>);return b.to({weight:.5},.25);};
const unsplit=(b:Builder,front:"lead"|"rear")=>{const back=front==="lead"?"rear":"lead";lift(b,back,.38,0,.55,.03,{[`${back}Yaw`]:STAND[`${back}Yaw`],[`${back}Heel`]:0} as Partial<Spec>);lift(b,front,-.36,0,.5,.03,{[`${front}Yaw`]:STAND[`${front}Yaw`]} as Partial<Spec>);return b;};
// Knee hug: weight over the standing foot, the knee rises and a hand draws it in.
const kneeHug=(b:Builder,leg:"lead"|"rear")=>{const l=leg==="lead",up:Partial<Spec>=l?{leadLift:.38,leadX:.18}:{rearLift:.38,rearX:.18};
 b.to({weight:l?.1:.9,sz:l?.03:-.03},.4).to({...up,lReach:1,lX:.3,lY:-.02,lZ:l?-.1:.06,lean:.05},.7).wait(.6);
 return b.to(l?{leadLift:0,leadX:0}:{rearLift:0,rearX:0},.6).to({lReach:0,lean:.02,weight:.5,sz:0},.4);};
// Cat-cow on hands and knees: the back rounds with the head down, then lengthens with the head up.
const catCow=(b:Builder,n:number)=>{for(let i=0;i<n;i++)b.to({lean:1.38,drop:.47,tuck:.09},1.1).wait(.3).to({lean:1.56,drop:.5,tuck:-.04},1.1).wait(.3);return b.to({lean:KNEELING.lean!,tuck:KNEELING.tuck!},.8);};
// Thread the needle: one arm slides under the body toward the other side and the upper back turns.
const thread=(b:Builder,arm:"l"|"r")=>{const s=arm==="l"?1:-1,p:Partial<Spec>=arm==="l"?{lReach:1,lX:.36,lY:-.38,lZ:.32}:{rReach:1,rX:.36,rY:-.38,rZ:-.32};
 b.to({...p,chestYaw:-.7*s,headYaw:-.5*s},1.3).wait(.8);return b.to({[`${arm}Reach`]:0,chestYaw:0,headYaw:0} as Partial<Spec>,1.1);};
// Wrist stretch on hands and knees: palms flat, the hips rock gently back over the hands and forward again.
const wristRock=(b:Builder)=>{b.to({lReach:1,rReach:1,lX:.54,lY:-.4,lZ:-.2,rX:.54,rY:-.4,rZ:.2,lPalm:1,rPalm:1},.6);for(let i=0;i<2;i++)b.to({sx:-.08,lX:.62,rX:.62},1).wait(.4).to({sx:0,lX:.54,rX:.54},.9);return b.to({lReach:0,rReach:0,lPalm:0,rPalm:0},.5);};
// Open book standing: both arms forward, then the rear arm opens back as the chest and eyes turn with it.
const openBook=(b:Builder)=>{b.to({lReach:1,rReach:1,lX:.45,lY:.45,lZ:-.06,rX:.45,rY:.45,rZ:.06,grip:.15},.8);
 b.to({rX:-.12,rY:.5,rZ:.52,chestYaw:-.6,headYaw:-.5},1.4).wait(.8).to({rX:.45,rY:.45,rZ:.06,chestYaw:0,headYaw:0},1.2);return b.to({lReach:0,rReach:0,grip:.3},.7);};

export const CHAPTER_06:MoveTable={
 "c6-warm":{make(){
  const b=script({...STAND});
  b.say("Your square","About 1 × 1 metre of non-slip floor, support within reach. Find your point.").wait(1.4);
  b.say("Soft march","Roll through the foot so it makes no sound.");march(b,4,.7,.02,.3);
  armSwings(b,2,{say:["Arm swings","Easy swings. Breathing rises a little."]});
  shoulderCircles(b,2,{say:["Shoulder circles","Small and easy."]});
  ankles(b,1,["Ankles and hips","Ankle circles, hip circles…"]);hipCircles(b,1);
  trunkTurns(b,1,{say:["Trunk turns","…and slow trunk turns."]});
  b.say("Quarter-squats","A hand on your support.").to({chair:1},.5);
  for(let i=0;i<2;i++)b.to({drop:.14,lean:.15},.9).to({drop:STAND.drop,lean:.02},.8);
  b.to({chair:0},.5);
  b.say("Silent jabs","Half-range, each hand.").to({fight:1,leadUp:1,rearUp:1,grip:1},.5);
  for(let i=0;i<2;i++)b.to({jab:.55},.25,"punch").to({jab:0},.25).to({cross:.55},.28,"punch").to({cross:0},.28);
  b.to({fight:0,leadUp:0,rearUp:0,grip:.3},.5);
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, a small bow."]});
  ready(b,{say:["Guard up","Into stance; guard up on one silent breath out through the nose."]});
  b.say("Stillness","One breath of stillness. Practice begins.").breathe(1);
  unready(b);
  return b.done(exercise({title:"Small-space warm-up",props:{chair:CHAIR}}));
 }},
 "c6-cool":{make(){
  const b=script({...STAND});
  b.say("Walk down","Walk slowly or march softly; arms hang, breathing slows.");walk(b,4,.2);
  hipCircles(b,1,{say:["Flow","Hip circles…"]});
  flexor(b,"rear",["Hip flexor","…a gentle split-stance stretch each side…"]);flexor(b,"lead");
  calfStretch(b,["Calf stretch","…a calf stretch on the wall…"]);
  shoulderCircles(b,2,{back:true,say:["Shoulder rolls","…shoulder rolls…"]});
  wristCircles(b,2,{say:["Wrists","…and wrist circles."]});
  b.say("Breathe","In for 4, out for 6. One part that felt solid, one to repeat.").to({inhale:1},1.6).to({inhale:0},2.4);
  b.to({...READY,grip:.3},.6);bow(b,{say:["Bow","Feet together, a small bow. Nothing to make up."]});
  return b.done(exercise({title:"Mobility flow down",props:{wall:.5}}));
 }},
 "c6-quiet":{speed:1,make(){
  const b=script(stance());
  b.say("Your square","Stay inside 1 × 1 metre: weight shifts instead of long steps.").wait(.6);
  b.to({weight:.65},.5).to({weight:.35},.6).to({weight:.5},.4);pivot(b,.3,{say:["Pivot","Small pivots in place."]});pivot(b,-.3);
  combo(b,["jab","cross"],{says:[["Round 1","1-2s; breathe out silently through the nose."],undefined]});
  hit(b,"slipRight",{say:["Slip","Quiet feet: roll through the foot, never stamp."]});hit(b,"roll",{say:["Roll","Compact, inside the square."]});b.wait(.5);
  b.to({chair:1},.5);const down=chamber(b,"lead",{say:["Round 2","Knee raises with your support…"],hold:.5});down();
  kick(b,"teep",{say:["Low front kick","…landing silently."]});b.to({chair:0},.5);
  combo(b,C12H,{says:[["Round 3","One run of the set sequence, compact."],undefined,undefined]});shuffle(b,"back",{d:.08,say:["Short step","Small space: shorter steps, compact strikes."]});
  b.wait(.6);shuffle(b,"forward",{d:.08,say:["Edge?","If you touch the edge, reset to the centre."]});b.wait(.6);
  return b.done(fight(false,{title:"Quiet feet, small space",props:{chair:FIGHT_CHAIR},trail:true}));
 }},
 "c6-form-a":{speed:0,make(){
  const b=script(FORM_START);
  formA(b,counter(b,true),.5);
  closeForm(b,["Close","Front foot draws back, feet together. Rest."]);
  return b.done(form({title:"Form One · section A"}));
 }},
 "c6-form-b":{speed:0,make(){
  const b=script(FORM_START);
  b.say("From section A","Stance and guard, as count 18 ends.");stepBack(b);cut(b.to(RISE,.45,"out"),{lX:0,lY:0,lZ:0,rX:0,rY:0,rZ:0}).wait(.6);
  formB(b,counter(b,true),.5);
  return b.done(form({title:"Form One · section B",chair:true}));
 }},
 "c6-form":{speed:0,make(){
  const b=script(FORM_START);
  const say=counter(b,false);formA(b,say,.35);formB(b,say,.35);
  return b.done(form({title:"Form One · whole",chair:true}));
 }},
 "c6-form-mirror":{speed:0,make(){
  const b=script(FORM_START);
  b.say("Usual lead","Slow run; pause to recall whenever you need.").wait(1);
  formA(b,counter(b,false),.4);
  closeForm(b,["Other lead","After a breath, the same again, mirroring every left and right."]);
  return b.done(form({title:"Form One · both sides"}));
 }},
 "c6-small-rounds":{speed:0,make(){
  const b=script(stance());
  b.say("Your square","Picture your opponent just outside it.").wait(1.2);
  combo(b,C12H,{says:[["Round 1","Hands and defense. Quiet feet, silent exhales."],undefined,undefined]});
  pivot(b,.35,{say:["Pivot","Pivots and shifts instead of long steps."]});
  combo(b,["slipRight","cross"]);b.to({weight:.65},.4).to({weight:.5},.4);
  kick(b,"round",{say:["Round 2","Add low kicks, your support near."]});
  pivot(b,-.35);combo(b,["parryRear","jab","cross"],{says:[["Round 3","Your choice."],undefined,undefined]});
  b.say("Rest","Effort at short sentences. Walk the square in the rests.").wait(1.2);
  return b.done(fight(false,{title:"Small-space shadow rounds",props:{chair:FIGHT_CHAIR},trail:true}));
 }},
 "c6-strength-1":{make(){
  const b=script({...STAND});
  b.say("Squat to chair","Sit back toward the seat and stand; chest up, knees follow the toes.");sitBack(b,2);
  cut(b,{...STAND,wall:1,lean:.5});
  wallPushup(b,2,{say:["Incline push-up","Hands on the wall, body straight; lower the chest and press back."]});
  cut(b,{...STAND,...SUPINE});
  bridge(b,2,{say:["Glute bridge","Press up, squeeze at the top, lower slowly."]});
  cut(b,{...STAND,...PLANK});
  plank(b,5,{say:["Plank","Body in one straight line, 15–30 seconds."]});
  b.say("Stop early","2–3 reps before it gets hard. Progress by adding reps.").wait(1.2);
  cut(b,{...STAND});
  return b.done(exercise({title:"Strength I",view:"side",props:{wall:.9}}));
 }},
 "c6-strength-2":{make(){
  const b=script({...STAND});
  b.to({chair:1},.6);split(b,"lead");
  splitSquat(b,2,{say:["Split squat · {L} forward","Hand on the chair; lower the back knee a short way and rise."]});
  unsplit(b,"lead");split(b,"rear");
  splitSquat(b,2,{say:["Split squat · {R} forward","The same on the other side."]});
  unsplit(b,"rear");b.to({chair:0},.5);
  cut(b,{...STAND,...SIDE});
  sidePlank(b,4,{say:["Side plank","Knees bent or legs long, 15–25 seconds each side."]});
  cut(b,{...STAND});
  b.to({chair:1},.6);calfRaise(b,3,{say:["Calf raise","Slow raises, holding the chair."]});
  b.say("Stop early","2–3 reps before it gets hard.").to({chair:0},.6).wait(.6);
  return b.done(exercise({title:"Strength II",props:{chair:CHAIR}}));
 }},
 "c6-flow-hips":{make(){
  const b=script({...STAND});
  b.say("Ankle rocks","Knees ease forward over the toes and back. Slowly, without stopping.");
  for(let i=0;i<2;i++)b.to({drop:.07,sx:.04,lean:.05},.8).to({drop:STAND.drop,sx:0,lean:.02},.8);
  hipCircles(b,1,{say:["Hip circles","One movement melting into the next."]});
  b.say("Weight shift","Side to side in a wide stance.");lift(b,"lead",0,-.12,.5,.03);lift(b,"rear",0,.12,.5,.03);
  b.to({sz:-.07,drop:.06},.8).to({sz:.07},1.2).to({sz:0,drop:STAND.drop},.8);lift(b,"rear",0,-.12,.5,.03);lift(b,"lead",0,.12,.5,.03);
  b.to({chair:1},.5);flexor(b,"rear",["Hip flexor","Gently, each side, holding your support. Breathe out."]);flexor(b,"lead");
  b.say("Knee hugs","Two per leg.");kneeHug(b,"lead");kneeHug(b,"rear");b.to({chair:0},.5);
  b.say("Anywhere","A warm-up or cool-down: no mat, no equipment.").wait(1);
  return b.done(exercise({title:"Mobility flow: hips and ankles",props:{chair:CHAIR}}));
 }},
 "c6-flow-upper":{make(){
  const kneel={...STAND,...KNEELING},b=script(kneel);
  b.say("Cat-cow","On hands and knees: round the back, then lengthen it.");catCow(b,2);
  b.say("Thread the needle","One arm slides under the body; the upper back turns. Each side.");thread(b,"l");thread(b,"r");
  cut(b,{...STAND});wristCircles(b,2,{say:["Wrist circles","Slow circles."]});
  cut(b,kneel);b.say("Wrist stretch","Palms on the floor; ease the weight gently back.");wristRock(b);
  cut(b,{...STAND});shoulderCircles(b,2,{back:true,say:["Shoulder rolls","Loose shoulders."]});
  b.say("Open book","Standing at a wall: arms forward, then one opens as the chest turns.");openBook(b);
  cut(b,kneel);
  return b.done(exercise({title:"Mobility flow: spine and wrists"}));
 }},
 "c6-travel":{speed:0,make(){
  const side=stance(false,{turn:Math.PI/2,rReach:1,rX:0,rY:.45,rZ:.72}),b=script(side);
  b.say("Round 1","Side-on to the frame, fingertips on it. Chamber holds…");const down=chamber(b,"lead",{hold:1});down();
  kick(b,"teep",{say:["Low front kick","…and low front kicks."]});b.wait(.4);
  cut(b,{...STAND,wall:1,lean:.5});
  wallPushup(b,2,{say:["Round 2","Incline push-ups against the wall."]});
  cut(b,stance(false,{turn:Math.PI}));
  combo(b,["jab","cross"],{says:[["Round 3","Silent 1-2s, slips and rolls, facing away from the wall."],undefined]});hit(b,"slipRight");hit(b,"roll");b.wait(.4);
  combo(b,["jab","cross"],{says:[["Round 4","Form One section A in place, small steps."],undefined]});shuffle(b,"forward",{d:.08});shuffle(b,"back",{d:.08});
  b.say("A travel day","Warm-up, this block, a small-space round, Form One, cool-down.").wait(1.6);
  cut(b,side);
  return b.done(fight(false,{title:"Travel template: wall or doorframe",props:{wall:.8},point:undefined}));
 }},
 "c6-selfcheck":{speed:0,make(){
  const b=script(FORM_START);
  b.say("Round 1","Section A slowly. Note any count where you paused to remember.").wait(.8);
  formA(b,counter(b,false),.4);
  b.say("Round 2","Only the part around that count, three times: here 9–11.");combo(b,["jab","cross","parryRear"],{gap:.4});still(b);combo(b,["jab","cross","parryRear"],{gap:.4});
  closeForm(b,["Review","One part that is yours, one to repeat."]);
  return b.done(form({title:"Form self-check"}));
 }},
 "c6-trial-form":{speed:0,make(){
  const b=script(FORM_START);
  b.say("From memory","If you forget, hold your guard, breathe, continue from the next count.").wait(1.2);
  const say=counter(b,false);formA(b,say,.35);formB(b,say,.35);
  return b.done(form({title:"Trial · Form One from memory",chair:true}));
 }},
 "c6-trial-strength":{make(){
  const b=script({...STAND});
  b.say("Squat to chair","The same depth every rep.");sitBack(b,2);
  cut(b,{...STAND,wall:1,lean:.5});
  wallPushup(b,2,{say:["Incline push-up","At the incline you trained, body straight."]});
  cut(b,{...STAND,...SUPINE});
  bridge(b,2,{say:["Glute bridge","Squeeze at the top."]});
  cut(b,{...STAND,...PLANK});
  plank(b,5,{say:["Plank","15–30 seconds in one straight line."]});
  b.say("Consistent","Consistent form, never a maximum: stop 2–3 reps before it gets hard.").wait(1.4);
  cut(b,{...STAND});
  return b.done(exercise({title:"Trial · the strength block",view:"side",props:{wall:.9}}));
 }},
};
