// Moves for the shadow fighter: each is a script of body settings over time, with captions taken from
// the drill's own steps. Scripts are written for a left lead; captions mark sides as {L}/{R} so a mirrored
// (right-lead) demo can swap the words. Holds are pauses that stay in real seconds when the demo is slowed.
import {pose,smooth,type Props,type Spec,type V} from "./shadow-fighter";

export type Ease="inOut"|"in"|"out"|"punch"|"linear";
const EASE:Record<Ease,(u:number)=>number>={inOut:smooth,in:u=>u*u,out:u=>1-(1-u)*(1-u),punch:u=>Math.pow(Math.sin(u*Math.PI/2),1.25),linear:u=>u};
type Key={t:number;v:number;ease:Ease};
type Channel=keyof Spec;
export type Caption={t:number;title:string;body:string};
export type ViewName="side"|"angle"|"front"|"behind"|"above";
export type Speed={label:string;value:number};
export type Move={title:string;duration:number;tracks:Record<Channel,Key[]>;captions:Caption[];holds:[number,number][];view:ViewName;origin:V;props:Props;
 home?:Spec;rail?:[V,V];point?:V;trail:boolean;weight:boolean;speeds:Speed[];scrub?:[number,number];support:boolean};  // scrub: the script seconds the slider spans

export const VIEWS:Record<ViewName,{label:string;yaw:number;pitch:number}>={
 side:{label:"Side",yaw:0,pitch:.2},angle:{label:"Angle",yaw:.6,pitch:.25},front:{label:"Front",yaw:1.3,pitch:.2},
 behind:{label:"Behind",yaw:-2.3,pitch:.25},above:{label:"Above",yaw:.8,pitch:.62},
};
const STEADY:Speed[]=[{label:"Normal",value:1},{label:"Slow",value:.5}];
const PUNCH:Speed[]=[{label:"Real speed",value:1},{label:"Slow",value:.35},{label:"Study",value:.12}];

// ── Script builder ─────────────────────────────────────────────────────
function script(start:Spec){
 const tracks=Object.fromEntries((Object.keys(start) as Channel[]).map(k=>[k,[{t:0,v:start[k],ease:"linear" as Ease}]])) as Record<Channel,Key[]>;
 const captions:Caption[]=[],holds:[number,number][]=[];
 let t=0;
 const value=(k:Channel)=>tracks[k][tracks[k].length-1].v;
 // A key from t0 to t1; the channel holds its last value until t0.
 const key=(k:Channel,t0:number,t1:number,v:number,ease:Ease="inOut")=>{const tr=tracks[k],last=tr[tr.length-1];
  if(last.t<t0-1e-6)tr.push({t:t0,v:last.v,ease:"linear"});tr.push({t:t1,v,ease});};
 const b={
  get t(){return t;},value,key,
  to(p:Partial<Spec>,dur:number,ease:Ease="inOut"){for(const k of Object.keys(p) as Channel[])key(k,t,t+dur,p[k]!,ease);t+=dur;return b;},
  wait(dur:number,hold=true){if(hold)holds.push([t,t+dur]);t+=dur;return b;},
  // Keys placed inside a span by the callback; the span then advances time.
  span(dur:number,fn:(t0:number,t1:number)=>void){fn(t,t+dur);t+=dur;return b;},
  say(title:string,body:string,at=t){captions.push({t:at,title,body});return b;},
  // Breaths are slow and visible: the chest rises and settles.
  breathe(n:number){for(let i=0;i<n;i++)b.to({inhale:1},1.1).to({inhale:0},1.3);return b;},
  // Every loop ends where it began, so the replay is seamless.
  done(meta:Meta):Move{
   const back:Partial<Spec>={};for(const k of Object.keys(start) as Channel[])if(Math.abs(value(k)-start[k])>1e-4)back[k]=start[k];
   if(Object.keys(back).length)b.to(back,.8);
   b.wait(.4);
   return {...meta,duration:t,tracks,captions,holds};
  },
 };
 return b;
}
type Builder=ReturnType<typeof script>;

// ── Bodies ─────────────────────────────────────────────────────────────
const BASE:Spec={leadX:0,leadZ:-.1,leadYaw:.06,leadLift:0,leadHeel:0,rearX:0,rearZ:.1,rearYaw:-.06,rearLift:0,rearHeel:0,
 weight:.5,sx:0,sz:0,drop:.01,hipYaw:0,chestYaw:0,lean:.02,headYaw:0,tuck:0,inhale:0,
 leadUp:0,rearUp:0,fight:0,jab:0,grip:.3,swing:0,shrug:0,shFwd:0,wall:0,chair:0};
// The Chapter 1 short stance: rear foot half a foot length back, each foot on its own track, knees soft.
const SHORT:Partial<Spec>={rearX:-.13,rearYaw:-.2,drop:.045,hipYaw:-.12,chestYaw:-.1};
const GUARD:Partial<Spec>={leadUp:1,rearUp:1,grip:.45};
const HANDS_DOWN:Partial<Spec>={leadUp:0,rearUp:0,grip:.3};
const CHAIR={x:-.3,z:.5};   // beside and a little behind the rear hand, clear of the feet
const CH1_ORIGIN:V=[-.08,.9,0];
const STEP=.13;   // "a few centimetres", a touch longer so the demo reads

function lift(b:Builder,foot:"lead"|"rear",dx:number,dz:number,dur:number,height=.03,extra:Partial<Spec>={}){
 const X=`${foot}X` as Channel,Z=`${foot}Z` as Channel,L=`${foot}Lift` as Channel,x=b.value(X),z=b.value(Z);
 b.span(dur,(t0,t1)=>{
  b.key(X,t0,t1,x+dx);b.key(Z,t0,t1,z+dz);b.key(L,t0,t0+dur*.45,height,"out");b.key(L,t0+dur*.45,t1,0,"in");
  for(const k of Object.keys(extra) as Channel[])b.key(k,t0,t1,extra[k]!);
 });
}
type Dir="forward"|"back"|"left"|"right";
const DIR_TEXT:Record<Dir,{title:string;first:string;follow:string;shift:string}>={
 forward:{title:"Forward",first:"Front foot first.",follow:"Rear foot follows the same distance.",shift:"Shift a little toward the front foot; feet stay planted."},
 back:{title:"Back",first:"Rear foot first.",follow:"Front foot follows the same distance.",shift:"Shift a little toward the back foot; feet stay planted."},
 left:{title:"{L}",first:"{L} foot first.",follow:"{R} foot follows.",shift:"Shift a little to the {l}; feet stay planted."},
 right:{title:"{R}",first:"{R} foot first.",follow:"{L} foot follows.",shift:"Shift a little to the {r}; feet stay planted."},
};
type PairText={title?:string;first?:string;follow?:string;stop?:[string,string];stopFor?:number};
// One step pair: the nearest foot moves first, the other restores the spacing, then a full stop.
// Supported, the same direction becomes a small planted shift with a hand on the chair.
function pair(b:Builder,dir:Dir,support:boolean,o:PairText={}){
 const text=DIR_TEXT[dir],title=o.title??text.title;
 if(support){
  b.say(title,text.shift);
  const shift:Partial<Spec>=dir==="forward"?{weight:.7}:dir==="back"?{weight:.3}:dir==="left"?{sz:-.045}:{sz:.045};
  b.to(shift,.9).wait(.5).to(dir==="forward"||dir==="back"?{weight:.5}:{sz:0},.8);
 }else{
  b.say(title,o.first??text.first);
  if(dir==="forward"){b.to({weight:.4},.25);lift(b,"lead",STEP,0,.55);b.say(title,o.follow??text.follow).to({weight:.6},.3);lift(b,"rear",STEP,0,.5);b.to({weight:.5},.25);}
  if(dir==="back"){b.to({weight:.6},.25);lift(b,"rear",-STEP,0,.55);b.say(title,o.follow??text.follow).to({weight:.4},.3);lift(b,"lead",-STEP,0,.5);b.to({weight:.5},.25);}
  if(dir==="left"){b.to({sz:.025},.25);lift(b,"lead",0,-STEP,.55);b.say(title,o.follow??text.follow).to({sz:-.025},.3);lift(b,"rear",0,-STEP,.5);b.to({sz:0},.25);}
  if(dir==="right"){b.to({sz:-.025},.25);lift(b,"rear",0,STEP,.55);b.say(title,o.follow??text.follow).to({sz:.025},.3);lift(b,"lead",0,STEP,.5);b.to({sz:0},.25);}
 }
 const [stop,body]=o.stop??["Stop","Stance restored. Count one, two."];
 b.say(stop,body).wait(o.stopFor??1.2);
}
// Marching in place: knees rise in turn, the hips settle over the standing foot, arms swing opposite.
function march(b:Builder,steps:number,dur:number,height:number,swing:number,extra?:(i:number,t0:number,t1:number)=>void){
 for(let i=0;i<steps;i++){
  const foot=i%2?"rear":"lead",L=`${foot}Lift` as Channel,side=foot==="lead"?1:-1;
  b.span(dur,(t0,t1)=>{
   b.key(L,t0,t0+dur*.5,height,"out");b.key(L,t0+dur*.5,t1,0,"in");
   b.key("sz",t0,t0+dur*.4,side*.028);b.key("swing",t0,t0+dur*.5,-side*swing);
   extra?.(i,t0,t1);
  });
 }
 b.to({sz:0,swing:0},.35);
}
function startFrom(support:boolean,...parts:Partial<Spec>[]):Spec{return Object.assign({...BASE},...parts,support?{chair:1}:{});}
type Meta=Omit<Move,"duration"|"tracks"|"captions"|"holds">;
const ch1=(support:boolean,o:Partial<Meta>&{title:string}):Meta=>({view:"angle",origin:CH1_ORIGIN,props:support?{chair:CHAIR}:{},trail:false,weight:false,speeds:STEADY,support,...o});
const footwork=(start:Spec,support:boolean,o:Partial<Meta>&{title:string}):Meta=>ch1(support,{view:"above",home:start,weight:true,...o});

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
 // ── Chapter 2: the jab, from the boxing stance ───────────────────────
 jab(){
  const start:Spec={...BASE,leadX:.35,leadZ:-.13,leadYaw:-.25,leadHeel:.004,rearX:-.15,rearZ:.19,rearYaw:-.75,rearHeel:.035,
   sz:.04,drop:.08,hipYaw:-.62,chestYaw:-.72,lean:.07,headYaw:-.25,fight:1,leadUp:1,rearUp:1,grip:1};
  const out:Partial<Spec>={jab:1,hipYaw:-.78,chestYaw:-.98,lean:.1,headYaw:-.32,tuck:.018,rearHeel:.05,sx:.035,sz:.025,drop:.09};
  const home=Object.fromEntries(Object.keys(out).map(k=>[k,start[k as Channel]])) as Partial<Spec>;
  const b=script(start);
  b.say("Guard","Eyes on your point. Rear hand by the cheek.").wait(1.1);
  const t0=b.t;b.say("Rail","The fist moves first, with no hitch or dip.").to(out,.2,"punch");
  b.say("Turn","Palm down in the last third. Breathe out: tss.",t0+.2*.51);
  b.say("Soft elbow","Stop just short of straight.").wait(.06,false);
  b.say("Home","Same line back, at least as fast.").to(home,.21);
  b.say("Guard","The rear hand never left the cheek.").wait(1.3);
  const rail:[V,V]=[pose(start).hand,pose({...start,...out}).hand],end=rail[1];
  return b.done({title:"The jab",view:"angle",origin:[.25,.95,0],props:{},rail,point:[end[0]+.38,end[1],end[2]+.01],trail:true,weight:false,speeds:PUNCH,scrub:[1.1,1.57],support:false});
 },
};
export type MoveId=keyof typeof MOVES;
// Moves whose drills offer a chair-supported version.
export const SUPPORTED:ReadonlySet<MoveId>=new Set(["warm","stance","guard","shift","forward","side","stop","four","flow","movingGuard","distance","corner","choice","review"]);
const cache=new Map<string,Move>();
export function getMove(id:MoveId,support=false):Move{
 const k=`${id}:${support&&SUPPORTED.has(id)}`;
 if(!cache.has(k))cache.set(k,MOVES[id](support&&SUPPORTED.has(id)));
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
