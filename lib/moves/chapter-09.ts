// Chapter 9 demonstrations: The Line count drills, stance holds, the form after rounds and rounds with intent,
// keyed by drill ID. Captions follow each drill's steps.
import {READY,STAND,exercise,fight,hipCircles,hit,kick,lift,ready,script,shoulderCircles,shuffle,stance,unready,type Builder,type MoveTable} from "../shadow-kit";
import {EASY,UP,ankleCircles,beat,bowIn,bowOut,countBreath,formPiece,guardReset,longOut,pivotOut,run,stanceCheck,stretches,walk} from "./chapter-08";

const C=.75;   // one count of the bell's steady count
// The base count, eight counts: step in (1, 2), guard (3), breathe (4), step back (5, 6), guard (7), breathe (8).
// Supported, the steps become weight shifts beside the support. say false runs it without captions.
export function line(b:Builder,c:number,support:boolean,say=true){
 const cap=(t:string,body:string)=>{if(say)b.say(t,body);};
 cap(support?"1, 2 · shift in":"1, 2 · step in",support?"Weight forward beside your support.":"Front foot, then rear foot.");
 if(support)beat(b,2*c,()=>b.to({weight:.72},c*1.3));else{beat(b,c,()=>lift(b,"lead",.16,0,c*.7,.025));beat(b,c,()=>lift(b,"rear",.16,0,c*.7,.02));}
 cap("3 · guard","Reset the guard.");beat(b,c,()=>guardReset(b,c,support));
 cap("4 · breathe","One breath.");beat(b,c,()=>countBreath(b,c));
 cap(support?"5, 6 · shift back":"5, 6 · step back",support?"Weight back to the middle.":"Rear foot, then front foot.");
 if(support)beat(b,2*c,()=>b.to({weight:.5},c*1.3));else{beat(b,c,()=>lift(b,"rear",-.16,0,c*.7,.025));beat(b,c,()=>lift(b,"lead",-.16,0,c*.7,.02));}
 cap("7 · guard","Reset the guard.");beat(b,c,()=>guardReset(b,c,support));
 cap("8 · breathe","One breath. The accent brings count 1.");beat(b,c,()=>countBreath(b,c));
 return b;
}
// The hands count, four counts: jab (1), cross (2), guard (3), breathe (4).
function hands(b:Builder,c:number,say=true){
 const cap=(t:string,body:string)=>{if(say)b.say(t,body);};
 cap("1 · jab","Relaxed, a breath out.");beat(b,c,()=>hit(b,"jab"));
 cap("2 · cross","Elbow short of straight.");beat(b,c,()=>hit(b,"cross"));
 cap("3 · guard","Reset the guard.");beat(b,c,()=>guardReset(b,c));
 cap("4 · breathe","One breath.");beat(b,c,()=>countBreath(b,c));
 return b;
}
// Intents, each shown with a combination that serves it.
const jabFirst=(b:Builder,k=1.2)=>{run(b,["jab","cross"],["Intent · jab first","Every combination starts with the jab."],k);shuffle(b,"back",{k});run(b,["jab","cross","leadHook"],undefined,k);shuffle(b,"forward",{k});};
const defendAnswer=(b:Builder,k=1.2)=>{run(b,["slipRight","cross"],["Intent · defend, then answer","Defense first, then the answer. Guard home."],k);b.wait(.3,false);run(b,["cover","jab","cross"],undefined,k);};
const finishLow=(b:Builder,k=1.2)=>{run(b,["jab","cross"],["Intent · finish low","End the combination with a low kick or a check."],k);kick(b,"round",{k});};
const angles=(b:Builder,k=1.2)=>{run(b,["jab","cross"],["Intent · angles after everything","Every combination ends with an angle."],k);pivotOut(b,{k});run(b,["parryRear","jab","cross"],undefined,k);pivotOut(b,{k});};

export const CHAPTER_09:MoveTable={
 "c9-warm":{make(){
  const b=script({...STAND});
  b.say("Set up","Clear space, water near, support within reach. Find your point.").wait(1.4);
  b.say("March","Match your steps to an easy inner count: 1, 2, 3, 4.");walk(b,8,.6,.3);
  ankleCircles(b,2,{say:["Mobility","Ankle circles…"]});hipCircles(b,2,{say:["Mobility","…hip circles…"]});shoulderCircles(b,2,{back:true,say:["Mobility","…and shoulder rolls."]});
  b.to({...READY,grip:.3},.6);ready(b);
  b.say("Base pattern","Half pace: step in, guard, breathe, step back.");line(b,1.1,false,false);
  unready(b);bowIn(b);
  return b.done(exercise({title:"Find the count"}));
 }},
 "c9-cool":{make(){
  const b=script({...STAND});
  b.say("Walk slowly","Each lap a little slower than the last.");walk(b,4,.7);walk(b,3,.95,.25);
  stretches(b,{say:["Calf","Calf, hip flexor and chest: mild tension."]});
  b.say("Slow the count","In for 4 counts, out for 8.");longOut(b,2,3.6);
  bowOut(b);
  return b.done(exercise({title:"Slow the count"}));
 }},
 "c9-count-base":{speed:0,support:true,make(support){
  const b=script(stance(support));
  b.say("The Line","Eight counts on the bell's steady count. The accent marks count 1.").wait(1);
  line(b,C,support);
  b.say("Stay on the count","One action per count, relaxed and exact.");line(b,C,support,false);
  b.say("Lost the count?","Stand in guard; rejoin on the next accent.").wait(1.3);
  return b.done(fight(support,{title:"The Line · base count",view:"side"}));
 }},
 "c9-count-hands":{speed:0,make(){
  const b=script(stance());
  b.say("Four counts","Jab, cross, guard, breathe. The accent marks count 1.").wait(.8);
  hands(b,C);
  b.say("Same quality","The last clean 1-2 looks like the first.");hands(b,C,false);hands(b,C,false);
  return b.done(fight(false,{title:"The Line · hands count"}));
 }},
 "c9-count-full":{speed:0,make(){
  const b=script(stance()),c=.8;
  b.say("Eight counts","Every family, one rhythm. The accent marks count 1.").wait(.8);
  b.say("1 · jab","A breath out on each strike.");beat(b,c,()=>hit(b,"jab"));
  b.say("2 · cross","Elbow short of straight.");beat(b,c,()=>hit(b,"cross"));
  b.say("3 · slip","Head off the line.");beat(b,c,()=>hit(b,"slipRight"));
  b.say("4 · cross","From where the slip leaves you.");beat(b,c,()=>hit(b,"cross"));
  b.say("5 · lead hook","Elbow up, hand comes home.");beat(b,c,()=>hit(b,"leadHook"));
  b.say("6 · guard","Reset the guard.");beat(b,c,()=>guardReset(b,c));
  b.say("7 · lead check","Support within reach.");const t7=b.t;kick(b,"check");
  b.say("8 · set down","Guard home; count 1 comes round.",b.t-.7).wait(Math.max(.2,2*c-(b.t-t7)),false);
  b.wait(.8);
  return b.done(fight(false,{title:"The Line · full count"}));
 }},
 "c9-hold":{speed:0,make(){
  const b=script(stance(true,{drop:.11}));
  b.say("Build","Hand on your support, stance a little lower, guard up, eyes on your point.").wait(1.4);
  b.say("Breathe","Hold still. In through the nose for 4, out for 6.");longOut(b,2,2.1);
  b.say("Soft","Shoulders down, face relaxed.");longOut(b,1,2.1);
  b.say("Rise early","Whenever form or comfort changes.").to({drop:.06},.9).wait(1);
  return b.done(fight(true,{title:"Stance hold with breathing"}));
 }},
 "c9-form-tired":{speed:0,make(){
  const b=script(stance());
  b.say("Slow run","Your form, section by section: slower than usual and precise.").wait(.4);formPiece(b,2);
  b.say("Review","Three long exhales; rebuild your stance.");longOut(b,3);stanceCheck(b,"Rebuild the stance, guard home.");
  b.say("Count-tempo run","On the bell's count, set a little slower than usual.");formPiece(b,1.3);
  b.say("Form breaks?","Slow down, or switch to one section at a time.").wait(1.4);
  return b.done(fight(false,{title:"The Lantern Form after rounds"}));
 }},
 "c9-intent":{speed:0,make(){
  const b=script(stance());
  b.say("Choose and say","Before each round, choose an intent and say it.").wait(1.2);
  jabFirst(b);b.wait(.6,false);defendAnswer(b);b.wait(.6,false);finishLow(b);
  b.say("Review","Did the intent change how you met your imagined opponent?").wait(1.6);
  return b.done(fight(false,{title:"Shadow rounds with intent"}));
 }},
 "c9-intent-d":{speed:0,make(){
  const b=script(stance());
  b.say("Say it aloud","Three minutes, one intent, chosen before the bell.").wait(1.2);
  angles(b);b.wait(.6,false);defendAnswer(b);
  b.say("Effort","Never past 'short sentences'. Form breaks? Slow down.").wait(1.6);
  return b.done(fight(false,{title:"Long rounds with intent"}));
 }},
 "c9-crisp":{speed:0,make(){
  const b=script(stance());
  b.say("Round 1 · 1-2","Only 3–4 repetitions, as crisp and exact as you can.").wait(.8);
  for(let i=0;i<3;i++){run(b,["jab","cross"]);b.say("Stillness","Stand still in guard and breathe.").breathe(1);}
  b.say("Crisp","Exact and quick, never maximal.").wait(1.2);
  return b.done(fight(false,{title:"Crisp, low volume",trail:true}));
 }},
 "c9-selfcheck":{speed:0,make(){
  const b=script(stance());
  b.say("Round 1","This week's count pattern at a comfortable tempo.").wait(.5);hands(b,.9,false);
  b.say("Round 2","One section of your form, slowly.");formPiece(b,1.8);
  b.say("Round 3","One combination from your intent rounds: guard, feet, elbows.");run(b,["jab","cross","leadHook"],undefined,1.8);b.wait(.6);
  b.say("Review","What holds up best when you're tired, and what slips first?").wait(1.8);
  return b.done(fight(false,{title:"Integration self-check"}));
 }},
 "c9-trial-count":{speed:0,support:true,make(support){
  const b=script(stance(support));
  b.say("The long count","Base or full count, your choice, at the tempo you trained.").wait(1);
  line(b,C,support);
  b.say("Unbroken","Lose the count? Rejoin on the accent.");line(b,C,support,false);
  b.say("Mark it honestly","'Not yet' means repeat a week; it never blocks the story.").wait(1.4);
  return b.done(fight(support,{title:"Trial · the long count",view:"side"}));
 }},
 "c9-trial-form":{speed:0,make(){
  const b=script(stance());
  b.say("Slow run","Your form from memory, section by section.").wait(.4);formPiece(b,2);
  b.say("Review","Three long exhales; rebuild your stance.");longOut(b,3);stanceCheck(b,"Rebuild the stance, guard home.");
  b.say("Count-tempo run","On a slightly slower count.");formPiece(b,1.3);
  b.say("Forgot a count?","Hold your guard; continue from the next one you remember.").wait(1.6);
  return b.done(fight(false,{title:"Trial · the form, mildly tired"}));
 }},
 "c9-trial-rounds":{speed:0,make(){
  const b=script(stance());
  b.say("Two rounds","Intents you choose and say before the bell.").wait(1);
  jabFirst(b);b.to(EASY,.6);
  b.say("Rest","Breathe out long.");longOut(b,1,3);b.to(UP,.5);
  finishLow(b);
  b.say("Then cool down","Slow the count until it stops.").wait(1.4);
  return b.done(fight(false,{title:"Trial · two rounds with intent"}));
 }},
};
