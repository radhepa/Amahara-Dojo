// Chapter 10 demonstrations: reviews, self-reviews, designed sessions, maintenance and the final trials, keyed by drill ID.
// Review and design drills show a short sample of what is practised. Captions follow each drill's steps.
import {READY,STAND,SUPINE,bow,calfRaise,chamber,cut,deadBug,doubleJab,exercise,fight,goalposts,heelTurn,hipCircles,hit,kick,ready,script,
 shoulderCircles,shuffle,squat,stance,stepKick,unready,type Builder,type MoveTable} from "../shadow-kit";
import {EASY,UP,bowIn,bowOut,formPiece,longOut,pivotOut,run,stanceCheck,stretches,walk} from "./chapter-08";
import {line} from "./chapter-09";

// Between the set's combinations: guard home, eyes on the point, one breath.
const still=(b:Builder)=>b.wait(.3,false).to({inhale:1},.7).to({inhale:0},.9);
// The set sequence's four combinations, in order.
function setSequence(b:Builder,k=1.3){
 run(b,["jab","cross","leadHook"],["1 · 1-2-hook","Then step back."],k);shuffle(b,"back",{k});
 b.say("Still, breathe","Guard home, eyes on your point.");still(b);
 run(b,["slipRight","cross","leadHook"],["2 · slip-2-hook","Strike, still, breathe, next."],k);still(b);
 run(b,["parryRear","jab","cross"],["3 · parry-1-2","Then pivot out."],k);pivotOut(b,{k});still(b);
 run(b,["jab","cross"],["4 · 1-2-low round kick","Set it down; guard."],k);kick(b,"round",{k});
 return shuffle(b,"forward",{k});
}

export const CHAPTER_10:MoveTable={
 "c10-warm":{make(){
  const b=script({...STAND});
  b.say("Set up","Clear floor, support within reach, water near, a point to look at.").wait(1.4);
  shoulderCircles(b,2,{say:["Today's warm-up","Shoulders for a hands day…"]});
  hipCircles(b,2,{say:["Today's warm-up","…hips and ankles for a kick day."]});
  b.to({...READY,grip:.3},.6);ready(b);
  b.say("Main skill","30 seconds of today's main skill at half speed.");run(b,["jab","cross"],undefined,2);b.wait(.4,false);run(b,["jab","cross"],undefined,2);
  unready(b);bowIn(b);
  return b.done(exercise({title:"Your own warm-up"}));
 }},
 "c10-cool":{make(){
  const b=script({...STAND});
  b.say("Walk slowly","Let the breathing come down.");walk(b,4,.7);walk(b,3,.95,.25);
  stretches(b,{forearm:true,say:["Stretches","The ones your body asked for: calves, hips, chest, forearms."]});
  b.say("Breathe","In for 4, out for 6. One thing you did well, one to keep working on.");longOut(b,2,2.4);
  bowOut(b,"Feet together, a small bow. Practice ends.");
  return b.done(exercise({title:"Close the session"}));
 }},
 "c10-review-hands":{speed:1,make(){
  const b=script(stance());
  b.say("Round 1 · jab","From stillness, smooth tempo.").wait(1.2);hit(b,"jab");b.wait(.8);
  hit(b,"cross",{say:["Round 2 · cross","Heel and hip turn; balance checked after each."]});b.wait(1);
  b.say("Round 3 · 1-2 and 1-1-2","With a step-back exit.");run(b,["jab","cross"]);b.wait(.5);doubleJab(b);hit(b,"cross");
  shuffle(b,"back",{say:["Exit","Rear foot first, guard home."]});b.wait(.6);shuffle(b,"forward");
  b.say("Check","Guard home, soft elbows, feet apart, both leads alike.").wait(1.4);
  return b.done(fight(false,{title:"Review: hands",trail:true}));
 }},
 "c10-review-defense":{speed:1,make(){
  const b=script(stance());
  b.say("Round 1 · cover and parry","Slowly.").wait(.6);hit(b,"cover");b.wait(.3);hit(b,"parryRear");b.wait(.6);
  b.say("Round 2 · slips and rolls","Slowly, both directions.");hit(b,"slipRight");b.wait(.3);hit(b,"slipLeft");b.wait(.3);hit(b,"roll");b.wait(.6);
  b.say("Round 3 · slip-2, parry-1","Slow tempo.");run(b,["slipRight","cross"]);b.wait(.4);run(b,["parryRear","jab"]);b.wait(.6);
  b.say("Round 4 · hook and uppercut","The guard returns after each.");hit(b,"leadHook");b.wait(.4);hit(b,"rearUpper");
  b.say("Check","Defense that comes home, every time.").wait(1.4);
  return b.done(fight(false,{title:"Review: guard and defense"}));
 }},
 "c10-review-kicks":{speed:1,support:true,make(support){
  const b=script(stance(support));
  b.wait(.6);chamber(b,"lead",{hold:1.2,say:["Round 1 · chamber hold","A two-count chamber, lead leg."]})();b.wait(.4);
  kick(b,"teep",{say:["Front push kick","Low; return without hopping."]});b.wait(.6);
  kick(b,"round",{say:["Round 2 · low round kick","Rear leg, nothing above the hip."]});b.wait(.6);
  stepKick(b,{say:["Round 3 · side step-kick","Rear foot steps up, then the low side kick."]});b.wait(.5);
  kick(b,"check",{chamberSay:["The check","Knee up and out; set it down."]});
  b.say("Check","Round 4: the weaker side of everything.").wait(1.4);
  return b.done(fight(support,{title:"Review: kicks and balance"}));
 }},
 "c10-review-combos":{speed:0,make(){
  const b=script(stance());
  b.say("Round 1 · the set","The set sequence, in order.").wait(.8);setSequence(b);b.wait(.6);
  hit(b,"jab",{say:["Round 3 · punch-kick","Balance after each kick."]});kick(b,"teep");b.wait(.6);
  run(b,["jab","cross","leadHook"],["Round 4 · with an angle","A combination of your choice, then an angle."]);pivotOut(b);
  return b.done(fight(false,{title:"Review: combinations and the set"}));
 }},
 "c10-selfreview-1":{speed:0,make(){
  const b=script(stance());
  b.say("Round 1 · foundations","Rebuild your stance and guard.").wait(.6);unready(b);b.wait(.4);ready(b);b.wait(.6);
  b.say("Four directions","A step cycle with full stops.");
  for(const d of ["forward","back","left","right"] as const){shuffle(b,d,{k:1.3});b.wait(.7);}
  b.say("Round 2 · hands","Jab, cross, 1-2.");hit(b,"jab",{k:1.4});b.wait(.5);hit(b,"cross",{k:1.4});b.wait(.5);run(b,["jab","cross"],undefined,1.4);
  b.say("Review","For each family: one solid point, one to keep working on.").wait(1.8);
  return b.done(fight(false,{title:"Self-review: foundations and hands"}));
 }},
 "c10-selfreview-2":{speed:0,make(){
  const b=script(stance());
  b.say("Round 1 · defense","One cover, one parry, one slow slip-2, each back to guard.").wait(.6);
  hit(b,"cover");b.wait(.4);hit(b,"parryRear");b.wait(.4);run(b,["slipRight","cross"],undefined,1.6);b.wait(.6);
  b.say("Round 2 · kicks","Two slow chambers and one low front kick.");chamber(b,"lead",{k:1.4,hold:.6})();chamber(b,"lead",{k:1.4,hold:.6})();
  kick(b,"teep",{k:1.3});
  b.say("Review","One solid point and one to keep working on for each family.").wait(1.8);
  return b.done(fight(false,{title:"Self-review: defense and kicks"}));
 }},
 "c10-selfreview-3":{speed:0,make(){
  const b=script(stance()),k=1.5;
  b.say("Round 1 · combinations","The set's first two combinations, slowly, each ending with an angle.").wait(.6);
  run(b,["jab","cross","leadHook"],undefined,k);shuffle(b,"back",{k});pivotOut(b,{k});
  run(b,["slipRight","cross","leadHook"],undefined,k);pivotOut(b,{k});shuffle(b,"forward",{k});
  b.say("Round 2 · forms","A form section at your own pace.");formPiece(b,1.5);
  b.say("Round 3 · the count","The base count with your inner rhythm.");line(b,.8,false,false);
  b.say("Review","One solid point and one to keep working on for each.").wait(1.8);
  return b.done(fight(false,{title:"Self-review: combinations, forms and the count"}));
 }},
 "c10-design":{speed:0,make(){
  const b=script(stance());
  b.say("Guardrails","Preparation and cool-down as bookends, 4–6 blocks, 30–40 minutes.").wait(1.8);
  b.say("Round 1 · first block","The skill that needs you most goes first, while you're fresh.");run(b,["jab","cross"],undefined,1.8);b.wait(.6);
  b.say("Round 2 · the middle","A minute of rounds.");run(b,["jab","cross","leadHook"]);shuffle(b,"back");run(b,["slipRight","cross"]);shuffle(b,"forward");
  b.say("Round 3 · the end","The form section you'd end with.");formPiece(b,1.3);
  b.say("Review","Say your session aloud or jot it in your note.").wait(1.8);
  return b.done(fight(false,{title:"Design a session"}));
 }},
 "c10-choice-skill":{speed:0,make(){
  const b=script(stance());
  b.say("Choose","The technique that needs you most today.").wait(1);
  b.say("Round 1 · slow","Check its two form points.");hit(b,"jab",{k:2.4});b.wait(.9);
  b.say("Round 2 · smooth","The same two points.");hit(b,"jab",{k:1.4});b.wait(.9);
  b.say("Round 3 · crisp","Or the other lead. Round 4: the weaker side.");hit(b,"jab");b.wait(1.3);
  return b.done(fight(false,{title:"Your choice: skill block",trail:true}));
 }},
 "c10-choice-round":{speed:0,make(){
  const b=script(stance()),k=1.2;
  b.say("Choose an intent","Before each round: jab first, defend then answer, finish low, angles…").wait(1.4);
  run(b,["jab","cross","leadHook"],["Jab first","Combinations from the menu."],k);shuffle(b,"back",{k});
  run(b,["cover","jab","cross"],["Defend, then answer","Effort at 'short sentences'."],k);shuffle(b,"forward",{k});
  run(b,["jab","cross"],["Angles after everything","Then step off the line."],k);pivotOut(b,{k});
  b.say("Rest","Breathe out long.").to(EASY,.6);longOut(b,1,3);b.to(UP,.5);
  b.say("Last rest","Did the rounds do what you designed them to do?").wait(1.6);
  return b.done(fight(false,{title:"Your choice: rounds"}));
 }},
 "c10-choice-strength":{make(){
  const b=script({...STAND});
  squat(b,2,{say:["Lower body","Squat to chair, split squat or bridge: whichever you need."]});
  goalposts(b,2,{slide:true,say:["Upper body","Incline push-up or wall slides."]});
  cut(b,{...STAND,...SUPINE});deadBug(b,2,{say:["Core","Dead bug, bird dog or side plank."]});
  cut(b,{...STAND});calfRaise(b,3,{say:["Calves or balance","Calf raises or a supported single-leg hold."]});
  b.say("Stop early","End every exercise 2–3 reps before it gets hard.").wait(1.2);
  return b.done(exercise({title:"Your choice: conditioning"}));
 }},
 "c10-maintain":{speed:0,make(){
  const b=script(stance());
  b.say("Three plans","3, 4 or 6 days a week. Wednesday stays a full rest day.").wait(1.8);
  b.say("Same guardrails","A lighter week every 6–8 weeks; 30–40 minutes; rest when something hurts.").wait(2);
  b.say("A skill block","Practise one block from the plan you'll keep…");run(b,["jab","cross"],undefined,1.8);b.wait(.6);
  b.say("A short round","…a short round…");run(b,["jab","cross","leadHook"]);pivotOut(b);
  b.say("A form section","…or a form section.");formPiece(b,1.3);
  b.say("Choose","Your plan and its days. Change it any time; no penalty.").wait(1.6);
  return b.done(fight(false,{title:"Maintenance plans"}));
 }},
 "c10-teach":{speed:1,make(){
  const b=script(stance());
  b.say("Teach it back","Perform one technique very slowly, explaining it aloud as if to a beginner.").wait(1.4);
  b.say("How it starts","Say what it's for and how it starts.");heelTurn(b,{k:2});b.wait(.4);
  hit(b,"cross",{k:2.5,say:["Form checks","Name its two form checks as you go."]});b.wait(1);
  b.say("Supported version","Then explain its supported version.").wait(1.2);
  b.say("Optional","Practise silently if you'd rather. The app never hears it.").wait(1.4);
  return b.done(fight(false,{title:"Teach it back",trail:true}));
 }},
 "c10-polish":{speed:0,make(){
  const b=script(stance());
  b.say("Choose a section","One section of a form that you love.").wait(1);
  b.say("Round 1 · very slowly","Every move held for a breath.");formPiece(b,1.6,true);
  b.say("Round 3 · smooth","Round 2 runs on your inner count.");formPiece(b);
  b.say("One detail","The eyes, the breath, the stillness after a strike.").wait(1.6);
  return b.done(fight(false,{title:"Polish a favourite section"}));
 }},
 "c10-trial-design":{speed:0,make(){
  const b=script(stance());
  b.say("Your session","This block is its first skill block; the rounds and form follow.").wait(1.6);
  b.say("Round 1 · slow","The skill you chose.");run(b,["jab","cross"],undefined,2.2);b.wait(.8);
  b.say("Round 2 · smooth","Then the other lead, then the weaker side.");run(b,["jab","cross"],undefined,1.4);b.wait(.8);
  b.say("Guardrails","Bookends stay; 4–6 blocks; 30–40 minutes; never past 'short sentences'.").wait(1.8);
  b.say("Mark it honestly","A written reflection counts exactly the same as none.").wait(1.4);
  return b.done(fight(false,{title:"Final trial · your designed session"}));
 }},
 "c10-trial-form":{speed:0,make(){
  const b=script({...STAND,...READY,grip:.3});
  bow(b,{say:["First bow","Feet together, a small bow."]});ready(b);
  b.say("Slow run","Your form from memory, section by section.");formPiece(b,1.6);
  b.say("Review","Rebuild your stance; three long breaths.");stanceCheck(b,"Rebuild the stance, guard home.");longOut(b,3,2.4);
  b.say("Count-tempo run","On the bell's count.");formPiece(b,1.2);
  b.say("Forgot a count?","Hold your guard; continue from the next one you remember.").wait(1.4);
  unready(b);bow(b,{say:["Last bow","Mark the checks honestly."]});
  return b.done(fight(false,{title:"Final trial · the full form"}));
 }},
};
