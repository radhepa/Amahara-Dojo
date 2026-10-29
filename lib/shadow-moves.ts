// Moves for the shadow fighter: each is a script of body settings over time, with captions taken from
// the drill's own steps. Scripts are written for a left lead; captions mark sides as {L}/{R} so a mirrored
// (right-lead) demo can swap the words. Holds are pauses that stay in real seconds when the demo is slowed.
// The builder and shared vocabulary live in lib/shadow-kit.ts; Chapters 2–10 are in lib/moves/, keyed by drill.
import {CHAIR,FIGHT,GUARD,HANDS_DOWN,PUNCH,SHORT,ch1,footwork,lift,march,pair,pose,script,startFrom,type Channel,type Dir,type Move,type Spec,type V} from "./shadow-kit";
import {EASE} from "./shadow-kit";
import {CHAPTER_MOVES,type MoveTable} from "./moves";
export {VIEWS,type Move,type ViewName} from "./shadow-kit";

// ── Chapter 1 ──────────────────────────────────────────────────────────
const MOVES={
 warm(support:boolean){
  const start=startFrom(support),b=script(start);
  b.say("Walk in place","Start slowly. Easy steps, loose shoulders.");
  march(b,6,.62,.1,.7);
  b.say("Hands and shoulders","Keep walking. Open and close the hands; small shoulder circles.");
  march(b,8,.62,.08,.35,(i,t0,t1)=>{
   const m=(t0+t1)/2;b.key("grip",t0,m,i%2?.05:.95,"inOut");
   b.key("shrug",t0,m,i%2?0:.045);b.key("shFwd",t0,m,i%4<2?.035:-.035);b.key("shrug",m,t1,i%2?.045:0);
  });
  b.to({grip:.3,shrug:0,shFwd:0},.4);
  b.say("Shift and ankles","Small weight shifts and gentle heel lifts.");
  b.to({sz:.04},.8).to({sz:-.04},1.1).to({sz:0},.7);
  b.to({leadHeel:.045,rearHeel:.045},.7).wait(.3,false).to({leadHeel:0,rearHeel:0},.7).to({leadHeel:.045,rearHeel:.045},.7).wait(.3,false).to({leadHeel:0,rearHeel:0},.7);
  b.say("Talk test","You should still speak in full sentences.").wait(1.2);
  return b.done(ch1(support,{title:"Prepare to move"}));
 },
 stance(support:boolean){
  const start=startFrom(support),b=script(start);
  b.say("Feet hip-width","Stand tall, feet under your hips.").wait(1);
  b.say("Rear foot back","A small step back, about half a foot length. Each foot keeps its own track.");
  b.to({weight:.62},.35);lift(b,"rear",-.13,0,.8,.025,{rearYaw:-.2});b.to({weight:.5},.35);
  b.say("Soften the knees","Knees follow the toes. Head over hips, eyes ahead.").to({drop:.045,hipYaw:-.12,chestYaw:-.1},.9);
  b.say("Two easy breaths","Weight comfortable across both feet.").breathe(2);
  b.say("Relax, then rebuild","Back to hip-width feet. Build it again, about three times a round.").to({drop:.01,hipYaw:0,chestYaw:0},.7);
  b.to({weight:.62},.3);lift(b,"rear",.13,0,.75,.025,{rearYaw:-.06});b.to({weight:.5},.3);
  return b.done(footwork(start,support,{title:"Build your stance",view:"angle"}));
 },
 guard(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Stance first","Shoulders down, elbows near your ribs.").wait(1);
  b.say("Hands home","Relaxed hands beside the cheeks, not squeezing the neck. Eyes clear.").to(GUARD,1);
  b.say("Two easy breaths","Fingers relaxed, wrists straight.").breathe(1).wait(.4);
  b.say("Lower","Let the hands come down.").to(HANDS_DOWN,.9).wait(.8);
  b.say("Same place again","Bring them back to exactly the same spot.").to(GUARD,1).wait(1.4);
  b.say("Lower","Rest with the hands down.").to(HANDS_DOWN,.9).wait(.8);
  return b.done(ch1(support,{title:"Find and reset your guard",view:"front"}));
 },
 shift(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Short stance","Both feet grounded.").wait(.9);
  b.say("Toward the front foot","A small shift. Your head stays over your base.").to({weight:.78},1.1).wait(.5);
  b.say("Back to the middle","Pause in the middle.").to({weight:.5},.9).wait(.8);
  b.say("Toward the back foot","Heels stay down; no leaning back.").to({weight:.22},1.1).wait(.5);
  b.say("Back to the middle","Pause, then repeat.").to({weight:.5},.9).wait(.8);
  return b.done(footwork(start,support,{title:"Balance without stepping",view:"side"}));
 },
 forward(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Short stance","Each foot on its own track.").wait(.9);
  pair(b,"forward",support);pair(b,"back",support);
  return b.done(footwork(start,support,{title:"Step forward, step back"}));
 },
 side(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Short stance","Torso faces ahead. Very small steps.").wait(.9);
  pair(b,"left",support);pair(b,"right",support,{stop:["Stop","Same stagger and width as you started."]});
  return b.done(footwork(start,support,{title:"Step to either side"}));
 },
 stop(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Short stance","Choose forward or back for this round.").wait(.9);
  const stop:[string,string]=["Stop completely","Count one, two. Feet apart, knees soft."];
  pair(b,"forward",support,{stop,stopFor:1.8});pair(b,"back",support,{title:"Return",stop,stopFor:1.8});
  return b.done(footwork(start,support,{title:"Step, stop, check"}));
 },
 four(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Short stance","Face one point. Say the direction, then move.").wait(.9);
  for(const d of ["forward","back","left","right"] as Dir[])pair(b,d,support);
  return b.done(footwork(start,support,{title:"Choose one of four directions"}));
 },
 flow(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Guard","Short stance, relaxed guard. Check your balance.").to(GUARD,1).wait(.6);
  for(const d of ["forward","back","left","right"] as Dir[])pair(b,d,support,{stop:["Full stop","Restore your guard before the next direction."]});
  b.say("Rest","Lower your hands for the rest.").to(HANDS_DOWN,.9).wait(.8);
  return b.done(footwork(start,support,{title:"Guard, move, reset"}));
 },
 movingGuard(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Guard","Relaxed hands beside the cheeks, elbows near the ribs.").to(GUARD,1).wait(.6);
  pair(b,"forward",support,{first:"Front foot first. Hands stay home.",follow:"Rear foot follows. Hands still home.",stop:["Stop","Two counts, breathe."]});
  pair(b,"back",support,{first:"Rear foot first. Hands stay home.",follow:"Front foot follows.",stop:["Stop","Then lower the hands."]});
  b.to(HANDS_DOWN,.9).wait(.6);
  return b.done(footwork(start,support,{title:"Keep your guard as you step",view:"angle"}));
 },
 distance(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Your point","Well beyond arm's reach. Nothing to hit.").to(GUARD,1).wait(.5);
  const stop:[string,string]=["Pause","Two counts. Upright, not leaning toward the point."];
  pair(b,"forward",support,{stop});pair(b,"back",support,{stop});
  pair(b,"back",support,{title:"Back · 1 of 2",stop});pair(b,"back",support,{title:"Back · 2 of 2",stop});
  pair(b,"forward",support,{title:"Forward · 1 of 2",stop});pair(b,"forward",support,{title:"Forward · 2 of 2",stop:["Home","Same small step every time."]});
  b.to(HANDS_DOWN,.9).wait(.5);
  return b.done(footwork(start,support,{title:"Take space, return to your base",view:"angle",point:[1.6,1.5,0]}));
 },
 corner(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Guard","Clear space behind and beside you. Face one point.").to(GUARD,1).wait(.5);
  pair(b,"back",support,{stop:["Stop","Breathe. Feet still apart?"]});
  pair(b,"left",support,{stop:["Stop","Keep facing ahead."]});
  pair(b,"right",support,{title:"Return {r}",stop:["Stop","Then forward to where you began."]});
  pair(b,"forward",support,{title:"Return forward",stop:["Home","Next round: use the other side."]});
  b.to(HANDS_DOWN,.9).wait(.5);
  return b.done(footwork(start,support,{title:"Back, then sideways"}));
 },
 choice(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.to(GUARD,1);
  b.say("Choose: {L}","Say it before you move. Not a race.").wait(1.2);
  pair(b,"left",support);pair(b,"right",support,{title:"Return",stop:["Settle","Choose a different direction next."]});
  b.say("Choose: back","Say it, then move.").wait(1.2);
  pair(b,"back",support);pair(b,"forward",support,{title:"Return",stop:["Settle","Check one thing: order, spacing or relaxed hands."]});
  b.to(HANDS_DOWN,.9).wait(.5);
  return b.done(footwork(start,support,{title:"Choose, move, settle"}));
 },
 review(support:boolean){
  const start=startFrom(support,SHORT),b=script(start);
  b.say("Round 1 · rebuild","Relax to hip-width, then rebuild the short stance.").to({drop:.01,hipYaw:0,chestYaw:0},.7);
  b.to({weight:.62},.3);lift(b,"rear",.13,0,.7,.025,{rearYaw:-.06});b.to({weight:.5},.3).wait(.5);
  b.to({weight:.62},.3);lift(b,"rear",-.13,0,.7,.025,{rearYaw:-.2});b.to({weight:.5,drop:.045,hipYaw:-.12,chestYaw:-.1},.6).wait(.4);
  b.say("Round 1 · guard","Raise and lower, same place each time.").to(GUARD,1).wait(.8).to(HANDS_DOWN,.9).wait(.4);
  b.say("Round 2","One forward-and-back cycle, then left-and-right.").wait(.6);
  for(const d of ["forward","back","left","right"] as Dir[])pair(b,d,support);
  b.say("Review","Name one repeatable skill and one thing to keep practising.").wait(1.6);
  return b.done(footwork(start,support,{title:"Your foundation self-check",view:"angle"}));
 },
 cool(){
  const start=startFrom(false),b=script(start);
  b.say("Walk it down","Very slow steps. Let the movement get smaller.");
  march(b,4,.9,.05,.3);
  b.say("Calf stretch","Hands on the wall. One foot steps back, heel down.").to({wall:1,grip:.1},.9);
  b.to({weight:.65},.3);lift(b,"rear",-.36,0,.8,.03,{rearYaw:0});
  b.to({drop:.075,lean:.17,weight:.66},.9);
  b.say("Hold and breathe","15–20 seconds each side. Gentle, no bouncing.").breathe(1).wait(.6);
  b.to({drop:.01,lean:.02,weight:.4},.6);lift(b,"rear",.36,0,.8,.03,{rearYaw:-.06});b.to({weight:.5},.3);
  b.say("Other side","Now the other foot steps back.");
  b.to({weight:.35},.3);lift(b,"lead",-.36,0,.8,.03,{leadYaw:0});
  b.to({drop:.075,lean:.17,weight:.34},.9);
  b.say("Hold and breathe","Skip any stretch that causes discomfort.").breathe(1).wait(.6);
  b.to({drop:.01,lean:.02,weight:.6},.6);lift(b,"lead",.36,0,.8,.03,{leadYaw:.06});b.to({weight:.5},.3);
  b.say("Settle","Hands down. Let your breathing settle.").to({wall:0,grip:.3},.9).breathe(1);
  return b.done(ch1(false,{title:"Release and review",view:"side",props:{wall:.5}}));
 },
};export type MoveId=keyof typeof MOVES;
// Moves whose drills offer a chair-supported version.
const SUPPORTED:ReadonlySet<string>=new Set(["warm","stance","guard","shift","forward","side","stop","four","flow","movingGuard","distance","corner","choice","review"]);
// Chapter 1 drills share named moves; later chapters are keyed by their drill IDs.
const TABLE:MoveTable={
 ...Object.fromEntries(Object.entries(MOVES).map(([id,make])=>[id,{make,support:SUPPORTED.has(id)}])),
 ...CHAPTER_MOVES,
};
const CH1_DEMOS:Record<string,MoveId>={
 "f2-warm":"warm","f2-stance":"stance","f2-guard":"guard","f2-shift":"shift","f2-forward":"forward","f2-side":"side","f2-flow":"flow",
 "f2-stop":"stop","f2-four":"four","f2-moving-guard":"movingGuard","f2-distance":"distance","f2-corner":"corner","f2-choice":"choice",
 "f2-review":"review","f2-cool":"cool",
};
// The demonstration for a drill, if it has one: the move and the speed it opens at.
export function demoFor(drill:string):{move:string;speed?:number}|undefined{
 if(CH1_DEMOS[drill])return {move:CH1_DEMOS[drill]};
 const e=CHAPTER_MOVES[drill];return e?{move:drill,speed:e.speed}:undefined;
}
export const canSupport=(id:string)=>!!TABLE[id]?.support;
export const moveIds=()=>Object.keys(TABLE);
const cache=new Map<string,Move>();
export function getMove(id:string,support=false):Move{
 const e=TABLE[id],s=support&&!!e.support,k=`${id}:${s}`;
 if(!cache.has(k))cache.set(k,e.make(s));
 return cache.get(k)!;
}

// ── Playback ───────────────────────────────────────────────────────────
// Real time ↔ script time for a speed: moving parts slow down, holds stay in real seconds.
export function clock(m:Move,speed:number){
 const segs:{a:number;b:number;real:number}[]=[];let cur=0;
 const push=(a:number,b:number,hold:boolean)=>{if(b>a)segs.push({a,b,real:hold?b-a:(b-a)/speed});};
 for(const [a,b] of m.holds){push(cur,a,false);push(a,b,true);cur=b;}
 push(cur,m.duration,false);
 const total=segs.reduce((n,s)=>n+s.real,0);
 return {total,
  script(real:number){let r=((real%total)+total)%total;for(const s of segs){if(r<=s.real)return s.a+(s.b-s.a)*(r/s.real);r-=s.real;}return m.duration;},
  real(script:number){let r=0;for(const s of segs){if(script<=s.b)return r+s.real*((script-s.a)/(s.b-s.a));r+=s.real;}return total;},
 };
}
export function specAt(m:Move,t:number):Spec{
 const out={} as Spec;
 for(const k of Object.keys(m.tracks) as Channel[]){
  const tr=m.tracks[k];let i=0;while(i<tr.length-1&&tr[i+1].t<=t)i++;
  const a=tr[i],b=tr[i+1];out[k]=!b?a.v:a.v+(b.v-a.v)*EASE[b.ease]((t-a.t)/(b.t-a.t));
 }
 return out;
}
const SIDES:Record<string,[string,string]>={"{L}":["Left","Right"],"{R}":["Right","Left"],"{l}":["left","right"],"{r}":["right","left"]};
export function captionAt(m:Move,t:number,mirror:boolean){
 let c=m.captions[0];for(const x of m.captions)if(x.t<=t+1e-6)c=x;
 const fix=(s:string)=>s.replace(/\{[LRlr]\}/g,k=>SIDES[k][mirror?1:0]);
 return {title:fix(c.title),body:fix(c.body),index:m.captions.indexOf(c)};
}
