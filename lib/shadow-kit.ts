// The shared toolkit for shadow-fighter moves: the keyframe script builder, the Chapter 1 bodies and
// footwork, and the boxing-stance vocabulary (strikes, defense, kicks, steps, turns) and exercise poses
// that the later chapters' scripts are built from (lib/moves/*). Everything is written for a left lead.
import {pose,REST,smooth,type Props,type Spec,type V} from "./shadow-fighter";
export {pose,type Spec,type V};

export type Ease="inOut"|"in"|"out"|"punch"|"linear";
export const EASE:Record<Ease,(u:number)=>number>={inOut:smooth,in:u=>u*u,out:u=>1-(1-u)*(1-u),punch:u=>Math.pow(Math.sin(u*Math.PI/2),1.25),linear:u=>u};
export type Key={t:number;v:number;ease:Ease};
export type Channel=keyof Spec;
export type Caption={t:number;title:string;body:string};
export type ViewName="side"|"angle"|"front"|"behind"|"above";
export type Speed={label:string;value:number};
export type Move={title:string;duration:number;tracks:Record<Channel,Key[]>;captions:Caption[];holds:[number,number][];view:ViewName;origin:V;props:Props;
 home?:Spec;rail?:[V,V];point?:V;trail:boolean;weight:boolean;speeds:Speed[];scrub?:[number,number];support:boolean};  // scrub: the script seconds the slider spans

export const VIEWS:Record<ViewName,{label:string;yaw:number;pitch:number}>={
 side:{label:"Side",yaw:0,pitch:.2},angle:{label:"Angle",yaw:.6,pitch:.25},front:{label:"Front",yaw:1.3,pitch:.2},
 behind:{label:"Behind",yaw:-2.3,pitch:.25},above:{label:"Above",yaw:.8,pitch:.62},
};
export const STEADY:Speed[]=[{label:"Normal",value:1},{label:"Slow",value:.5}];
export const PUNCH:Speed[]=[{label:"Real speed",value:1},{label:"Slow",value:.35},{label:"Study",value:.12}];

// ── Script builder ─────────────────────────────────────────────────────
export function script(start:Spec){
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
export type Builder=ReturnType<typeof script>;
// A table of moves keyed by drill ID: make builds the script (support: the chair version, when offered).
export type MoveEntry={make:(support:boolean)=>Move;support?:boolean;speed?:number};
export type MoveTable=Record<string,MoveEntry>;

// ── Bodies ─────────────────────────────────────────────────────────────
export const BASE:Spec={...REST,leadX:0,leadZ:-.1,leadYaw:.06,leadLift:0,leadHeel:0,rearX:0,rearZ:.1,rearYaw:-.06,rearLift:0,rearHeel:0,
 weight:.5,sx:0,sz:0,drop:.01,hipYaw:0,chestYaw:0,lean:.02,headYaw:0,tuck:0,inhale:0,
 leadUp:0,rearUp:0,fight:0,jab:0,grip:.3,swing:0,shrug:0,shFwd:0,wall:0,chair:0};
// The Chapter 1 short stance: rear foot half a foot length back, each foot on its own track, knees soft.
export const SHORT:Partial<Spec>={rearX:-.13,rearYaw:-.2,drop:.045,hipYaw:-.12,chestYaw:-.1};
export const GUARD:Partial<Spec>={leadUp:1,rearUp:1,grip:.45};
export const HANDS_DOWN:Partial<Spec>={leadUp:0,rearUp:0,grip:.3};
export const CHAIR={x:-.3,z:.5};   // beside and a little behind the rear hand, clear of the feet
export const CH1_ORIGIN:V=[-.08,.9,0];
export const STEP=.13;   // "a few centimetres", a touch longer so the demo reads

export function lift(b:Builder,foot:"lead"|"rear",dx:number,dz:number,dur:number,height=.03,extra:Partial<Spec>={}){
 const X=`${foot}X` as Channel,Z=`${foot}Z` as Channel,L=`${foot}Lift` as Channel,x=b.value(X),z=b.value(Z);
 b.span(dur,(t0,t1)=>{
  b.key(X,t0,t1,x+dx);b.key(Z,t0,t1,z+dz);b.key(L,t0,t0+dur*.45,height,"out");b.key(L,t0+dur*.45,t1,0,"in");
  for(const k of Object.keys(extra) as Channel[])b.key(k,t0,t1,extra[k]!);
 });
}
export type Dir="forward"|"back"|"left"|"right";
export const DIR_TEXT:Record<Dir,{title:string;first:string;follow:string;shift:string}>={
 forward:{title:"Forward",first:"Front foot first.",follow:"Rear foot follows the same distance.",shift:"Shift a little toward the front foot; feet stay planted."},
 back:{title:"Back",first:"Rear foot first.",follow:"Front foot follows the same distance.",shift:"Shift a little toward the back foot; feet stay planted."},
 left:{title:"{L}",first:"{L} foot first.",follow:"{R} foot follows.",shift:"Shift a little to the {l}; feet stay planted."},
 right:{title:"{R}",first:"{R} foot first.",follow:"{L} foot follows.",shift:"Shift a little to the {r}; feet stay planted."},
};
export type PairText={title?:string;first?:string;follow?:string;stop?:[string,string];stopFor?:number};
// One step pair: the nearest foot moves first, the other restores the spacing, then a full stop.
// Supported, the same direction becomes a small planted shift with a hand on the chair.
export function pair(b:Builder,dir:Dir,support:boolean,o:PairText={}){
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
export function march(b:Builder,steps:number,dur:number,height:number,swing:number,extra?:(i:number,t0:number,t1:number)=>void){
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
export function startFrom(support:boolean,...parts:Partial<Spec>[]):Spec{return Object.assign({...BASE},...parts,support?{chair:1}:{});}
export type Meta=Omit<Move,"duration"|"tracks"|"captions"|"holds">;
export const ch1=(support:boolean,o:Partial<Meta>&{title:string}):Meta=>({view:"angle",origin:CH1_ORIGIN,props:support?{chair:CHAIR}:{},trail:false,weight:false,speeds:STEADY,support,...o});
export const footwork=(start:Spec,support:boolean,o:Partial<Meta>&{title:string}):Meta=>ch1(support,{view:"above",home:start,weight:true,...o});

// ── Boxing stance (Chapters 2–10) ──────────────────────────────────────
// A long half-step between the feet, rear heel light, hips and chest turned, chin down, fists closed.
export const FIGHT:Spec={...BASE,leadX:.35,leadZ:-.13,leadYaw:-.25,leadHeel:.004,rearX:-.15,rearZ:.19,rearYaw:-.75,rearHeel:.035,
 sz:.04,drop:.08,hipYaw:-.62,chestYaw:-.72,lean:.07,headYaw:-.25,fight:1,leadUp:1,rearUp:1,grip:1};
export const FIGHT_ORIGIN:V=[.08,.92,0];
export const FIGHT_CHAIR={x:-.45,z:.55};
export const EYES:V=[2.2,1.55,0];   // the point on the wall the eyes rest on
export function stance(support=false,...parts:Partial<Spec>[]):Spec{return Object.assign({...FIGHT},...parts,support?{chair:1}:{});}
export const fight=(support:boolean,o:Partial<Meta>&{title:string}):Meta=>({view:"angle",origin:FIGHT_ORIGIN,props:support?{chair:FIGHT_CHAIR}:{},trail:false,weight:false,speeds:PUNCH,point:EYES,support,...o});

export type Phase=[Partial<Spec>,number,Ease?];
export type Tempo={k?:number;say?:[string,string];hold?:number;back?:number};
export const snap=(b:Builder,p:Partial<Spec>)=>Object.fromEntries(Object.keys(p).map(k=>[k,b.value(k as Channel)])) as Partial<Spec>;
// Out along the path, a moment at the end, then home on the same line at least as fast.
// k slows the whole action (2 = half speed); hold is the pause at the end of the path.
export function act(b:Builder,phases:readonly Phase[],o:Tempo={}){
 const k=o.k??1,home=snap(b,Object.assign({},...phases.map(p=>p[0])));
 if(o.say)b.say(...o.say);
 for(const [p,d,e] of phases)b.to(p,d*k,e??"punch");
 if(o.hold)b.wait(o.hold*k,false);
 return b.to(home,(o.back??.22)*k);
}
// Each strike and defense: its phases and the default pause at the end of the path.
export const ACTIONS={
 jab:{hold:.06,back:.21,p:[[{jab:1,hipYaw:-.78,chestYaw:-.98,lean:.1,headYaw:-.32,tuck:.018,rearHeel:.05,sx:.035,sz:.025,drop:.09},.2]]},
 cross:{hold:.06,back:.24,p:[[{cross:1,hipYaw:-.1,chestYaw:-.05,lean:.11,headYaw:-.1,tuck:.018,rearHeel:.12,rearYaw:-.3,weight:.6,sx:.03,drop:.09},.24]]},
 leadHook:{hold:.05,back:.24,p:[[{lReach:1,lX:.3,lY:.63,lZ:-.1,lEl:1,lPalm:.6},.09,"inOut"],[{lX:.37,lZ:.14,hipYaw:-1,chestYaw:-1.25,leadYaw:-.7,leadHeel:.05,weight:.45,headYaw:-.2,tuck:.018},.17]]},
 rearHook:{hold:.05,back:.26,p:[[{rReach:1,rX:.2,rY:.63,rZ:.22,rEl:1,rPalm:.6},.09,"inOut"],[{rX:.38,rZ:-.06,hipYaw:-.1,chestYaw:.05,rearYaw:-.25,rearHeel:.12,weight:.58,tuck:.018},.2]]},
 leadUpper:{hold:.05,back:.24,p:[[{lReach:1,lX:.3,lY:.47,lZ:-.02,lPalm:-1,drop:.11,hipYaw:-.5,chestYaw:-.55},.14,"inOut"],[{lX:.34,lY:.68,lZ:.03,drop:.07,hipYaw:-.85,chestYaw:-.95,leadHeel:.03},.16]]},
 rearUpper:{hold:.05,back:.26,p:[[{rReach:1,rX:.17,rY:.46,rZ:.12,rPalm:-1,drop:.11},.14,"inOut"],[{rX:.34,rY:.68,rZ:.02,hipYaw:-.2,chestYaw:-.15,rearHeel:.1,rearYaw:-.35,weight:.58,drop:.08},.18]]},
 leadElbow:{hold:.06,back:.24,p:[[{lReach:1,lX:.27,lY:.67,lZ:-.14,lEl:1,lPalm:1},.1,"inOut"],[{lX:.2,lZ:.12,hipYaw:-1.05,chestYaw:-1.35,leadYaw:-.7,leadHeel:.05,weight:.45,tuck:.02},.18]]},
 rearElbow:{hold:.06,back:.26,p:[[{rReach:1,rX:.14,rY:.67,rZ:.24,rEl:1,rPalm:1},.1,"inOut"],[{rX:.27,rZ:-.04,hipYaw:-.05,chestYaw:.15,rearYaw:-.25,rearHeel:.12,weight:.58,tuck:.02},.2]]},
 leadUpElbow:{hold:.06,back:.24,p:[[{lReach:1,lX:.2,lY:.7,lZ:-.06,lEl:-1,lPalm:-1},.1,"inOut"],[{lX:.13,lY:.9,lZ:0,hipYaw:-.88,chestYaw:-1.02,leadHeel:.04,drop:.06},.18]]},
 rearUpElbow:{hold:.06,back:.26,p:[[{rReach:1,rX:.13,rY:.68,rZ:.12,rEl:-1,rPalm:-1},.1,"inOut"],[{rX:.12,rY:.9,rZ:.03,hipYaw:-.2,chestYaw:-.15,rearHeel:.1,rearYaw:-.35,weight:.58,drop:.06},.2]]},
 parryRear:{hold:.12,back:.2,p:[[{rReach:1,rX:.27,rY:.62,rZ:.02,rPalm:-.4},.13]]},
 parryLead:{hold:.12,back:.2,p:[[{lReach:1,lX:.37,lY:.56,lZ:.16},.13]]},
 cover:{hold:.5,back:.3,p:[[{lReach:1,lX:.2,lY:.77,lZ:-.07,rReach:1,rX:.16,rY:.79,rZ:.1,tuck:.025,drop:.11,lPalm:-.6,rPalm:-.6},.18,"inOut"]]},
 slipRight:{hold:.3,back:.3,p:[[{tilt:.2,sz:.09,drop:.12,chestYaw:-.85,headYaw:-.15},.22,"inOut"]]},
 slipLeft:{hold:.3,back:.3,p:[[{tilt:-.18,sz:-.02,drop:.12,chestYaw:-.5,hipYaw:-.5,headYaw:-.35},.22,"inOut"]]},
 roll:{hold:.2,back:.32,p:[[{tilt:-.12,drop:.13,sz:.01},.18,"inOut"],[{tilt:0,drop:.22,lean:.24,sz:.05},.22,"in"],[{tilt:.16,drop:.12,lean:.1,sz:.09},.22,"out"]]},
} satisfies Record<string,{hold:number;back:number;p:Phase[]}>;
export type ActionId=keyof typeof ACTIONS;
export function hit(b:Builder,id:ActionId,o:Tempo={}){const a=ACTIONS[id];return act(b,a.p,{hold:a.hold,back:a.back,...o});}

// Stepping in the stance: the foot nearest the direction moves first, the other restores the spacing.
const SHUFFLE:Record<Dir,["lead"|"rear","lead"|"rear",number,number]>={forward:["lead","rear",1,0],back:["rear","lead",-1,0],left:["lead","rear",0,-1],right:["rear","lead",0,1]};
export function shuffle(b:Builder,dir:Dir,o:{k?:number;say?:[string,string];d?:number}={}){
 const k=o.k??1,d=o.d??.16,[a,c,x,z]=SHUFFLE[dir];
 if(o.say)b.say(...o.say);
 lift(b,a,x*d,z*d,.3*k,.025);lift(b,c,x*d,z*d,.28*k,.02);
 return b;
}
// A pivot on the ball of the lead foot: the whole stance swings round it and the rear foot skims the floor.
export function pivot(b:Builder,angle:number,o:{k?:number;say?:[string,string]}={}){
 const k=o.k??1,dur=.5*k;
 if(Math.abs(b.value("turn"))<1e-4)b.to({turnX:b.value("leadX")-.1,turnZ:b.value("leadZ")},.001);
 if(o.say)b.say(...o.say);
 const to=b.value("turn")+angle;
 return b.span(dur,(t0,t1)=>{b.key("turn",t0,t1,to);b.key("rearLift",t0,t0+dur*.4,.02,"out");b.key("rearLift",t0+dur*.4,t1,0,"in");});
}
// Kicks. Weight settles over the standing foot first; every kick returns to chamber, then to the stance.
export const KICKS={
 lead:{weight:0,sx:.05,sz:.05,leadLift:.34,leadX:.3,leadZ:-.11,leadHeel:.11,leadYaw:0,lean:.02,drop:.06},
 rear:{weight:1,sx:-.02,sz:-.03,rearLift:.34,rearX:.12,rearZ:.12,rearHeel:.11,rearYaw:-.2,hipYaw:-.35,chestYaw:-.45,lean:.02,drop:.06},
} satisfies Record<"lead"|"rear",Partial<Spec>>;
// Knee up to chamber. Returns the way back down: to chamber shape, foot down, weight centred.
export function chamber(b:Builder,leg:"lead"|"rear",o:{k?:number;say?:[string,string];hold?:number}={}){
 const k=o.k??1,c=KICKS[leg],home=snap(b,c),shift:Partial<Spec>={weight:c.weight,sx:c.sx,sz:c.sz};
 if(o.say)b.say(...o.say);
 b.to(shift,.35*k).to(c,.4*k,"out");
 if(o.hold)b.wait(o.hold);
 return ()=>{b.to({...home,...shift},.4*k).to({weight:home.weight,sx:home.sx,sz:home.sz},.3*k);return b;};
}
export type KickId="knee"|"rearKnee"|"teep"|"rearTeep"|"round"|"side"|"check";
const KICK_OUT:Record<KickId,[leg:"lead"|"rear",out:Partial<Spec>,dur:number,hold:number]>={
 knee:["lead",{leadLift:.42,leadX:.42,sx:.1,lean:-.05,lReach:1,lX:.42,lY:.5,lZ:-.04,rReach:1,rX:.42,rY:.5,rZ:.12},.22,.12],
 rearKnee:["rear",{rearLift:.42,rearX:.36,rearZ:.06,sx:.08,lean:-.05,hipYaw:-.15,chestYaw:-.2,lReach:1,lX:.42,lY:.5,lZ:-.1,rReach:1,rX:.42,rY:.5,rZ:.06},.22,.12],
 teep:["lead",{leadX:.72,leadLift:.4,leadHeel:-.1,lean:-.1,sx:.02},.22,.1],
 rearTeep:["rear",{rearX:.66,rearZ:.02,rearLift:.4,rearHeel:-.1,lean:-.1,hipYaw:-.25,chestYaw:-.35},.24,.1],
 round:["rear",{rearX:.78,rearZ:-.26,rearLift:.46,rearYaw:1.1,rearHeel:.15,rearSplay:.4,hipYaw:.45,chestYaw:.05,leadYaw:.9,leadHeel:.03,lean:-.12,sz:-.02},.26,.08],
 side:["lead",{leadX:.82,leadZ:-.1,leadLift:.2,leadYaw:-1.4,leadHeel:.02,hipYaw:-1.45,chestYaw:-1.3,lean:-.24,headYaw:-.3,sx:-.03},.26,.1],
 check:["lead",{leadLift:.36,leadX:.24,leadSplay:.7,leadHeel:.12,leadYaw:.5},.2,.4],
};
export function kick(b:Builder,id:KickId,o:{k?:number;say?:[string,string];chamberSay?:[string,string];hold?:number}={}){
 const k=o.k??1,[leg,out,dur,hold]=KICK_OUT[id];
 if(o.chamberSay)b.say(...o.chamberSay);
 const down=chamber(b,leg,{k});
 if(o.say)b.say(...o.say);
 const back=snap(b,out);
 b.to(out,dur*k,"punch").wait((o.hold??hold)*k,false).to(back,dur*1.1*k);
 return down();
}
// The low side kick sets up with the rear foot stepping up behind the lead foot.
export function stepKick(b:Builder,o:{k?:number;say?:[string,string];kickSay?:[string,string]}={}){
 const k=o.k??1,rx=b.value("rearX"),rz=b.value("rearZ"),turn={hipYaw:b.value("hipYaw"),chestYaw:b.value("chestYaw")};
 if(o.say)b.say(...o.say);
 b.to({hipYaw:-1.2,chestYaw:-1.15},.2*k);lift(b,"rear",.3,-.04,.3*k,.03,{rearYaw:-1.3});
 kick(b,"side",{k,say:o.kickSay});
 lift(b,"rear",rx-b.value("rearX"),rz-b.value("rearZ"),.3*k,.03,{rearYaw:FIGHT.rearYaw});
 return b.to(turn,.25*k);
}
// The bow that opens and closes a session: feet together, hands at the sides, a small bow from the hips.
export const READY:Partial<Spec>={leadX:0,leadZ:-.085,leadYaw:.05,rearX:0,rearZ:.085,rearYaw:-.05,leadHeel:0,rearHeel:0,sx:0,sz:0,drop:.01,hipYaw:0,chestYaw:0,lean:.02,headYaw:0,tuck:0,fight:0,leadUp:0,rearUp:0,grip:.6,weight:.5};
export function bow(b:Builder,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 return b.to({lean:.42,tuck:.03},.8).wait(.5).to({lean:.02,tuck:0},.8);
}
// From feet together: the rear foot steps back into the stance and the guard rises with one breath out.
export function ready(b:Builder,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 b.to({leadZ:FIGHT.leadZ,leadX:FIGHT.leadX*.5,rearX:FIGHT.rearX*.3},.5);
 lift(b,"rear",FIGHT.rearX-b.value("rearX"),FIGHT.rearZ-b.value("rearZ"),.5,.03,{rearYaw:FIGHT.rearYaw,leadX:FIGHT.leadX,leadYaw:FIGHT.leadYaw});
 return b.to({hipYaw:FIGHT.hipYaw,chestYaw:FIGHT.chestYaw,headYaw:FIGHT.headYaw,drop:FIGHT.drop,sz:FIGHT.sz,lean:FIGHT.lean,rearHeel:FIGHT.rearHeel,leadHeel:FIGHT.leadHeel,fight:1,leadUp:1,rearUp:1,grip:1},.45,"out");
}

// ── Exercise poses ─────────────────────────────────────────────────────
// Standing work starts from feet under the hips. Floor work pins the hips in place (pin 1) and lays the body
// down with lean: about -1.57 on the back (head toward -x), +1.2–1.5 face down (head toward +x).
export const STAND:Spec={...BASE,leadZ:-.12,rearZ:.12,drop:.015};
export const EX_ORIGIN:V=[-.05,.9,0];
export const FLOOR_ORIGIN:V=[0,.4,0];
export const exercise=(o:Partial<Meta>&{title:string}):Meta=>({view:"angle",origin:EX_ORIGIN,props:{},trail:false,weight:false,speeds:STEADY,support:false,...o});
const ARMS_REST:Partial<Spec>={lReach:0,rReach:0,lEl:0,rEl:0,lPalm:0,rPalm:0,leadUp:0,rearUp:0,wall:0};
// A cut: jump straight to a new position (between exercises that start in a different place).
export function cut(b:Builder,p:Partial<Spec>){return b.to(p,.001,"linear");}
export const reset=(p:Partial<Spec>={})=>({...REST,...STAND,...p});
export const SUPINE:Partial<Spec>={pin:1,sx:0,sz:0,drop:.885,lean:-1.53,hipYaw:0,chestYaw:0,headYaw:0,tuck:.02,leadX:.42,rearX:.42,leadZ:-.11,rearZ:.11,leadYaw:0,rearYaw:0,leadHeel:0,rearHeel:0,leadLift:0,rearLift:0,leadKnee:1,rearKnee:1,
 lReach:1,lX:.08,lY:-.05,lZ:-.27,rReach:1,rX:.08,rY:-.05,rZ:.27,leadUp:0,rearUp:0,fight:0,grip:.3,weight:.5};
export const KNEELING:Partial<Spec>={pin:1,sx:0,sz:0,drop:.5,lean:1.48,hipYaw:0,chestYaw:0,headYaw:0,tuck:.03,leadX:-.38,rearX:-.38,leadZ:-.11,rearZ:.11,leadYaw:0,rearYaw:0,leadHeel:.16,rearHeel:.16,leadLift:0,rearLift:0,leadKnee:0,rearKnee:0,
 ...ARMS_REST,fight:0,grip:.15,weight:.5};
export const PLANK:Partial<Spec>={pin:1,sx:0,sz:0,drop:.575,lean:1.22,hipYaw:0,chestYaw:0,headYaw:0,tuck:.03,leadX:-.68,rearX:-.68,leadZ:-.1,rearZ:.1,leadYaw:0,rearYaw:0,leadHeel:.15,rearHeel:.15,leadLift:0,rearLift:0,leadKnee:0,rearKnee:0,
 ...ARMS_REST,fight:0,grip:.15,weight:.5};
// On the left side, propped on the forearm, feet stacked: the side plank's start.
export const SIDE_LYING:Partial<Spec>={pin:1,sx:0,sz:0,drop:.78,lean:1.2,hipYaw:-1.5,chestYaw:-1.5,headYaw:0,tuck:0,leadX:-.7,rearX:-.7,leadZ:0,rearZ:0,leadYaw:1.5,rearYaw:1.5,leadHeel:0,rearHeel:0,leadLift:0,rearLift:.1,leadKnee:0,rearKnee:0,
 ...ARMS_REST,lReach:1,lX:.42,lY:.02,lZ:-.25,rReach:1,rX:.05,rY:.42,rZ:0,fight:0,grip:.2,weight:.5};
export function deadBug(b:Builder,reps:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 const legsUp:Partial<Spec>={leadLift:.46,rearLift:.46,leadX:.56,rearX:.56},armsUp:Partial<Spec>={lX:-.5,lY:.6,lZ:-.2,rX:-.5,rY:.6,rZ:.2};
 b.to({...legsUp,...armsUp},.9).wait(.4);
 for(let i=0;i<reps;i++){
  const lead=i%2===0,arm:Partial<Spec>=lead?{lX:-1.02,lY:.1}:{rX:-1.02,rY:.1},leg:Partial<Spec>=lead?{rearX:.98,rearLift:.1,rearKnee:.2}:{leadX:.98,leadLift:.1,leadKnee:.2};
  b.to({...arm,...leg},1.4).wait(.4).to(lead?{lX:-.5,lY:.6,rearX:.56,rearLift:.46,rearKnee:1}:{rX:-.5,rY:.6,leadX:.56,leadLift:.46,leadKnee:1},1.2).wait(.2);
 }
 return b;
}
export function birdDog(b:Builder,reps:number,o:{say?:[string,string];hold?:number}={}){
 if(o.say)b.say(...o.say);
 for(let i=0;i<reps;i++){
  const lead=i%2===0,arm:Partial<Spec>=lead?{lReach:1,lX:1.02,lY:.02,lZ:-.16}:{rReach:1,rX:1.02,rY:.02,rZ:.16},leg:Partial<Spec>=lead?{rearX:-1.02,rearLift:.38,rearHeel:.1}:{leadX:-1.02,leadLift:.38,leadHeel:.1};
  const home:Partial<Spec>=lead?{lReach:0,rearX:-.38,rearLift:0,rearHeel:.16}:{rReach:0,leadX:-.38,leadLift:0,leadHeel:.16};
  b.to({...arm,...leg},1.3).wait(o.hold??1.2).to(home,1.1).wait(.3);
 }
 return b;
}
export function bridge(b:Builder,reps:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 // The arms lie long on the floor while the hips rise; the hand targets are measured from the moving hips.
 const hands=snap(b,{lX:0,lY:0,rX:0,rY:0}),up={lX:.18,lY:-.34,rX:.18,rY:-.34};
 for(let i=0;i<reps;i++)b.to({drop:.6,lean:-2.05,sx:.12,tuck:.12,...up},1.2).wait(.6).to({drop:.885,lean:-1.53,sx:0,tuck:.02,...hands},1.4).wait(.3);
 return b;
}
export function plank(b:Builder,hold:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 return b.breathe(Math.max(1,Math.round(hold/2.4)));
}
export function sidePlank(b:Builder,hold:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 b.to({drop:.6,lean:1.3},1.1);b.breathe(Math.max(1,Math.round(hold/2.4)));
 return b.to({drop:.78,lean:1.2},1);
}
// Standing work.
export function shoulderCircles(b:Builder,n:number,o:{say?:[string,string];back?:boolean}={}){
 if(o.say)b.say(...o.say);
 const f=o.back?-1:1;
 for(let i=0;i<n;i++)b.to({shFwd:.04*f,shrug:.02},.4).to({shrug:.05,shFwd:0},.4).to({shFwd:-.04*f,shrug:.02},.4).to({shrug:0,shFwd:0},.4);
 return b;
}
export function armSwings(b:Builder,n:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 b.to({lReach:1,rReach:1,lX:.2,lY:.42,lZ:-.5,rX:.2,rY:.42,rZ:.5,grip:.15},.6);
 for(let i=0;i<n;i++)b.to({lX:.32,lZ:.16,rX:.3,rZ:-.12,rY:.46},.55).to({lX:.2,lZ:-.5,rX:.2,rZ:.5,rY:.42},.55);
 return b.to({lReach:0,rReach:0,grip:.3},.6);
}
export function wristCircles(b:Builder,n:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 b.to({lReach:1,rReach:1,lX:.36,lY:.42,lZ:-.17,rX:.36,rY:.42,rZ:.17,lPalm:0,rPalm:0},.6);
 for(let i=0;i<n;i++)b.to({lPalm:1,rPalm:1,grip:.9},.4).to({lPalm:-.6,rPalm:-.6,grip:.05},.4);
 return b.to({lReach:0,rReach:0,lPalm:0,rPalm:0,grip:.3},.6);
}
export function goalposts(b:Builder,n:number,o:{say?:[string,string];slide?:boolean}={}){
 if(o.say)b.say(...o.say);
 b.to({lReach:1,rReach:1,lX:.02,lY:.75,lZ:-.5,rX:.02,rY:.75,rZ:.5,lEl:1,rEl:1,grip:.2},.8);
 for(let i=0;i<n;i++){
  if(o.slide)b.to({lY:1.02,lZ:-.36,rY:1.02,rZ:.36},1.1).to({lY:.75,lZ:-.5,rY:.75,rZ:.5},1.1);
  else b.to({lX:.3,lY:.5,rX:.3,rY:.5},1.1).to({lX:.02,lY:.75,rX:.02,rY:.75},1.1);
 }
 return b.to({lReach:0,rReach:0,lEl:0,rEl:0,grip:.3},.8);
}
export function squat(b:Builder,reps:number,o:{say?:[string,string];depth?:number}={}){
 if(o.say)b.say(...o.say);
 const d=o.depth??.42;
 for(let i=0;i<reps;i++)b.to({drop:d,lean:.42,lReach:1,rReach:1,lX:.45,lY:.42,lZ:-.15,rX:.45,rY:.42,rZ:.15},1.4).wait(.3).to({drop:STAND.drop,lean:.02,lReach:0,rReach:0},1.3).wait(.2);
 return b;
}
export function calfRaise(b:Builder,reps:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 for(let i=0;i<reps;i++)b.to({leadHeel:.075,rearHeel:.075},.9).wait(.3).to({leadHeel:0,rearHeel:0},1).wait(.2);
 return b;
}
export function wallPushup(b:Builder,reps:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 for(let i=0;i<reps;i++)b.to({lean:.78,sx:.16,drop:.03},1.4).wait(.2).to({lean:.5,sx:0,drop:.015},1.2).wait(.2);
 return b;
}
// Feet split, rear heel up: the split squat lowers the back knee toward the floor and rises.
export const SPLIT:Partial<Spec>={leadX:.36,rearX:-.38,leadZ:-.11,rearZ:.11,rearHeel:.11,rearYaw:0,leadYaw:0};
export function splitSquat(b:Builder,reps:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 for(let i=0;i<reps;i++)b.to({drop:.3,lean:.06},1.4).wait(.2).to({drop:.03,lean:.02},1.2).wait(.2);
 return b;
}
export function neckTurns(b:Builder,n:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 for(let i=0;i<n;i++)b.to({headYaw:.55},1).wait(.3).to({headYaw:-.55},1.6).wait(.3).to({headYaw:0},1);
 return b.to({tuck:.05},.9).wait(.4).to({tuck:0},.9);
}
export function trunkTurns(b:Builder,n:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 for(let i=0;i<n;i++)b.to({chestYaw:.55,hipYaw:.2,headYaw:.3,swing:.4},1).to({chestYaw:-.55,hipYaw:-.2,headYaw:-.3,swing:-.4},1.4);
 return b.to({chestYaw:0,hipYaw:0,headYaw:0,swing:0},.9);
}
export function hipCircles(b:Builder,n:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 b.to({lReach:1,rReach:1,lX:.02,lY:.08,lZ:-.2,rX:.02,rY:.08,rZ:.2},.6);
 for(let i=0;i<n;i++)b.to({sx:.05,sz:0},.45).to({sx:0,sz:.05},.45).to({sx:-.05,sz:0},.45).to({sx:0,sz:-.05},.45);
 return b.to({sx:0,sz:0,lReach:0,rReach:0},.6);
}
export function bigBreaths(b:Builder,n:number,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 for(let i=0;i<n;i++)b.to({inhale:1},1.6).to({inhale:0},2.4);
 return b;
}

// ── Combinations ───────────────────────────────────────────────────────
// A string of strikes or defenses: each goes out as the one before comes home; gap pauses between them.
export function combo(b:Builder,ids:readonly ActionId[],o:{k?:number;gap?:number;says?:readonly ([string,string]|undefined)[]}={}){
 ids.forEach((id,i)=>{hit(b,id,{k:o.k,say:o.says?.[i]});if(o.gap&&i<ids.length-1)b.wait(o.gap*(o.k??1),false);});
 return b;
}
// The jab that comes only halfway home before the next one goes out.
export function doubleJab(b:Builder,o:{k?:number;say?:[string,string];second?:[string,string]}={}){
 const k=o.k??1,out=ACTIONS.jab.p[0][0] as Partial<Spec>,home=snap(b,out),half=Object.fromEntries(Object.keys(out).map(c=>[c,(out[c as Channel]!+home[c as Channel]!)/2])) as Partial<Spec>;
 if(o.say)b.say(...o.say);
 b.to(out,.2*k,"punch").to(half,.12*k);
 if(o.second)b.say(...o.second);
 return b.to(out,.18*k,"punch").wait(.06*k,false).to(home,.21*k);
}
// The jab that lands with the lead foot; the rear foot follows as the hand comes home.
export function stepJab(b:Builder,o:{k?:number;say?:[string,string];follow?:[string,string];d?:number}={}){
 const k=o.k??1,d=o.d??.16,out=ACTIONS.jab.p[0][0] as Partial<Spec>,home=snap(b,out);
 if(o.say)b.say(...o.say);
 lift(b,"lead",d,0,.28*k,.02,out);
 if(o.follow)b.say(...o.follow);
 lift(b,"rear",d,0,.3*k,.02,home);
 return b;
}
// The rear heel turns out and the hip follows, without the hand: the engine of the cross.
export function heelTurn(b:Builder,o:{k?:number;say?:[string,string]}={}){
 const k=o.k??1,p:Partial<Spec>={rearHeel:.12,rearYaw:-.3,hipYaw:-.15,chestYaw:-.25,weight:.56},home=snap(b,p);
 if(o.say)b.say(...o.say);
 return b.to(p,.45*k).wait(.3*k).to(home,.45*k);
}
// The reverse of ready: the guard lowers and the rear foot steps up beside the lead.
export function unready(b:Builder,o:{say?:[string,string]}={}){
 if(o.say)b.say(...o.say);
 b.to({fight:0,leadUp:0,rearUp:0,grip:.6,hipYaw:0,chestYaw:0,headYaw:0,drop:.01,sz:0,lean:.02,leadHeel:0,rearHeel:0},.5);
 lift(b,"rear",READY.rearX!-b.value("rearX"),READY.rearZ!-b.value("rearZ"),.5,.03,{rearYaw:READY.rearYaw!,leadX:READY.leadX!,leadZ:READY.leadZ!,leadYaw:READY.leadYaw!});
 return b;
}
