// The shadow fighter: a small 3D rig (metres, y up, x toward the point, the lead side is -z) posed from a
// Spec of body settings, with two-bone IK for arms and legs, drawn on a 2D canvas as a shaded silhouette
// with a rim light and a cast floor shadow. Moves (lib/shadow-moves.ts) animate the Spec over time.
// Everything is authored for a left lead; a right lead is the mirror image.
export type V=[number,number,number];
const add=(a:V,b:V):V=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const sub=(a:V,b:V):V=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const mul=(a:V,k:number):V=>[a[0]*k,a[1]*k,a[2]*k];
const dot=(a:V,b:V)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=(a:V)=>Math.hypot(a[0],a[1],a[2]);
const unit=(a:V):V=>mul(a,1/(len(a)||1));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const mixV=(a:V,b:V,t:number):V=>[mix(a[0],b[0],t),mix(a[1],b[1],t),mix(a[2],b[2],t)];
const rotY=(v:V,a:number):V=>[v[0]*Math.cos(a)+v[2]*Math.sin(a),v[1],-v[0]*Math.sin(a)+v[2]*Math.cos(a)];
const rotZ=(v:V,a:number):V=>[v[0]*Math.cos(a)-v[1]*Math.sin(a),v[0]*Math.sin(a)+v[1]*Math.cos(a),v[2]];
export const clamp01=(x:number)=>Math.max(0,Math.min(1,x));
export const smooth=(x:number)=>{const t=clamp01(x);return t*t*(3-2*t);};

// ── Body settings ──────────────────────────────────────────────────────
// Feet are placed by the ball of the foot on the floor. Weight 0 sits over the rear foot, 1 over the lead
// foot; sx/sz shift the hips further. Up 0 lets a hand hang, 1 brings it to guard (fight 0: relaxed hands
// beside the cheeks, fight 1: the boxing guard). Jab sends the lead hand along its rail; the palm turns by itself.
export type Spec={
 leadX:number;leadZ:number;leadYaw:number;leadLift:number;leadHeel:number;
 rearX:number;rearZ:number;rearYaw:number;rearLift:number;rearHeel:number;
 weight:number;sx:number;sz:number;drop:number;
 hipYaw:number;chestYaw:number;lean:number;headYaw:number;tuck:number;inhale:number;
 leadUp:number;rearUp:number;fight:number;jab:number;grip:number;swing:number;shrug:number;shFwd:number;
 wall:number;chair:number;
};
export type Props={chair?:{x:number;z:number};wall?:number};

const UPPER_ARM=.29,FOREARM=.26,HAND=.05,THIGH=.44,SHIN=.44,STAND_HEIGHT=.995;
const REACH=UPPER_ARM+FOREARM+HAND;
export const JAB_POINT:V=[2.6,1.5,0];   // the mark on the wall the jab aims at, at chin height

type Shape={circles:[V,number][];all?:boolean}|{hull:V[]};
export type Part={depth:number;tone:"body"|"wrap"|"prop";accent?:number;legs?:boolean;shapes:Shape[]};
export type Pose={parts:Part[];hand:V;pelvis:V;ankles:[V,V];feet:{shape:Shape;lift:number}[]};
const chain=(...circles:[V,number][]):Shape=>({circles});

// Two-bone IK: the middle joint bends toward the pole.
function ik(root:V,target:V,a:number,b:number,pole:V){
 const d=sub(target,root),dist=Math.min(Math.max(len(d),Math.abs(a-b)+1e-3),(a+b)*.995),u=unit(d);
 const v=unit(sub(pole,mul(u,dot(pole,u)))),x=(a*a-b*b+dist*dist)/(2*dist);
 return add(add(root,mul(u,x)),mul(v,Math.sqrt(Math.max(0,a*a-x*x))));
}
function foot(ball:V,yaw:number,heel:number,lift:number){
 const th=Math.asin(Math.min(.9,heel/.17)),c=Math.cos(th),s=Math.sin(th);
 const at=(f:number,y:number):V=>add([ball[0],lift,ball[2]],rotY([f*c+y*s,-f*s+y*c,0],yaw));
 return {ankle:at(-.12,.085),shape:chain([at(-.175,.042),.042],[at(-.12,.085),.046],[at(-.02,.036),.036],[at(.07,.024),.024])};
}
function ellipsoid(c:V,r:V,to:(l:V)=>V,lat=7,lon=12){
 const out:V[]=[];
 for(let i=1;i<lat;i++){const th=Math.PI*i/lat;for(let j=0;j<lon;j++){const ph=2*Math.PI*j/lon;
  out.push(to([c[0]+r[0]*Math.sin(th)*Math.cos(ph),c[1]+r[1]*Math.cos(th),c[2]+r[2]*Math.sin(th)*Math.sin(ph)]));}}
 out.push(to([c[0],c[1]+r[1],c[2]]),to([c[0],c[1]-r[1],c[2]]));
 return out;
}
// A hand that closes from relaxed (grip 0) to a fist (grip 1); fingers curl toward the palm.
function hand(wrist:V,along:V,palm:V,thumb:V,grip:number):Shape[]{
 const at=(a:number,th:number,pa:number)=>add(add(add(wrist,mul(along,a)),mul(thumb,th)),mul(palm,pa));
 const r=mix(.024,.034,grip),g=grip;
 const out:Shape[]=[{circles:[[at(.03,.022,0),r],[at(.03,-.022,0),r],[at(.072,.02,-.004*g),r*.94],[at(.072,-.02,-.004*g),r*.94]],all:true}];
 for(const th of [.012,-.014])out.push(chain([at(.085,th,0),mix(.017,.02,g)],[at(mix(.125,.098,g),th,mix(.008,.03,g)),mix(.015,.019,g)],[at(mix(.16,.066,g),th,mix(.02,.038,g)),mix(.013,.017,g)]));
 out.push(chain([at(.03,.034,mix(.012,.02,g)),.016],[at(mix(.075,.064,g),mix(.052,.03,g),.028),.014]));
 return out;
}

export function pose(s:Spec,props:Props={},breath=0):Pose{
 const parts:Part[]=[];
 const body=(...shapes:Shape[])=>parts.push({depth:0,tone:"body",shapes});
 // Feet first: the hips sit between the ankles, by the weight, and never higher than the planted legs reach.
 const lead=foot([s.leadX,0,s.leadZ],s.leadYaw,s.leadHeel,s.leadLift),rear=foot([s.rearX,0,s.rearZ],s.rearYaw,s.rearHeel,s.rearLift);
 const px=mix(rear.ankle[0],lead.ankle[0],s.weight)+s.sx,pz=mix(rear.ankle[2],lead.ankle[2],s.weight)+s.sz;
 let py=STAND_HEIGHT-s.drop+s.inhale*.004+breath*.003;
 for(const [ft,lift,side] of [[lead,s.leadLift,-1],[rear,s.rearLift,1]] as const){
  if(lift>.005)continue;
  const hip=add([px,0,pz],rotY([0,0,side*.095],s.hipYaw)),dh=Math.hypot(hip[0]-ft.ankle[0],hip[2]-ft.ankle[2]),r=(THIGH+SHIN)*.985;
  py=Math.min(py,ft.ankle[1]+Math.sqrt(Math.max(0,r*r-dh*dh))+.06);
 }
 const pelvis:V=[px,py,pz],frame=(yaw:number)=>(l:V)=>add(pelvis,rotZ(rotY(l,yaw),-s.lean));
 const hips=frame(s.hipYaw),chest=frame(s.chestYaw);
 // Torso: elliptical rings from the hips to the neck, twisting from the hip turn to the chest turn.
 const RINGS:[number,number,number,number,number][]=[[-.1,.1,.15,-.012,0],[0,.106,.162,0,0],[.19,.09,.132,.012,.45],[.34,.112,.162,.024,.85],[.455,.116,.178,.022,1],[.525,.09,.198,0,1],[.585,.054,.07,.012,1]];
 const rings=RINGS.map(([y,dx,dz,ox,w])=>{const to=frame(mix(s.hipYaw,s.chestYaw,w)),pts:V[]=[],swell=y>.3?1+s.inhale*.03:1;
  for(let i=0;i<18;i++){const a=2*Math.PI*i/18;pts.push(to([ox+dx*swell*Math.cos(a),y,dz*Math.sin(a)]));}return pts;});
 body(...rings.slice(1).map((r,i)=>({hull:[...rings[i],...r]})));
 // Head and neck. The chin stays slightly down and tucks a little more on the jab.
 // The boxing guard carries the head a little forward with the chin down; the Chapter 1 posture stands tall.
 const neck=chest([.012,.58,0]),head=add(neck,rotY([.012+s.fight*.018+s.tuck*.5,.128-s.tuck,0],s.headYaw));
 const pitch=.05+s.fight*.07+s.tuck*3,toHead=(l:V)=>add(head,rotY(rotZ(l,-pitch),s.headYaw));
 body(chain([neck,.056],[add(head,[0,-.07,0]),.052]),{hull:[...ellipsoid([-.008,.012,0],[.102,.12,.086],toHead),...ellipsoid([.035,-.064,0],[.068,.052,.064],toHead,5,10),...ellipsoid([.102,-.01,0],[.022,.024,.016],toHead,4,8)]});
 // Legs: knees follow the toes. A lifted foot glows so the eye can follow which foot moves.
 for(const [hip,ft,yaw,out,lift] of [[hips([0,-.06,-.095]),lead,s.leadYaw,-.35,s.leadLift],[hips([0,-.06,.095]),rear,s.rearYaw,.25,s.rearLift]] as [V,ReturnType<typeof foot>,number,number,number][]){
  const knee=ik(hip,ft.ankle,THIGH,SHIN,rotY([1,.15,out],yaw));
  parts.push({depth:0,tone:"body",legs:true,shapes:[chain([hip,.09],[mixV(hip,knee,.45),.078],[knee,.054]),chain([knee,.052],[mixV(knee,ft.ankle,.3),.058],[mixV(knee,ft.ankle,.75),.041],[ft.ankle,.037])]});
  parts.push({depth:0,tone:"body",legs:true,accent:clamp01(lift/.015),shapes:[ft.shape]});
 }
 // Arms. Each hand's target blends hanging → guard → jab rail → wall → chair, and the elbow pole blends with it.
 const roll=smooth((s.jab-.62)/.34),guards={lead:mixV([.13,-.06,-.1],[.33,-.13,-.06],s.fight),rear:mixV([.1,-.07,.1],[.03,-.085,.105],s.fight)};
 let leadHand:V=[0,0,0];
 const arm=(side:-1|1)=>{
  const isLead=side<0,up=isLead?s.leadUp:s.rearUp,sw=isLead?s.swing:-s.swing,jab=isLead?s.jab:0,ch=isLead?0:s.chair;
  const sh=isLead?chest([s.jab*.035+s.shFwd,.515+s.shrug+s.jab*.03+s.inhale*.006,-.18]):chest([-.01+s.shFwd,.515+s.shrug+s.inhale*.006,.18]);
  const hang=add(sh,add(rotY([.03+sw*.14,0,side*.035],s.chestYaw),[0,-.575+Math.abs(sw)*.05,0]));
  let target=mixV(hang,add(head,rotY(isLead?guards.lead:guards.rear,s.headYaw)),up);
  if(jab)target=mixV(target,add(sh,mul(unit(sub(JAB_POINT,sh)),REACH*.94)),jab);
  if(s.wall&&props.wall!==undefined)target=mixV(target,[props.wall-.05,1.32,side*.2],s.wall);
  if(ch&&props.chair)target=mixV(target,[props.chair.x,.95,props.chair.z-.19],ch);
  let pole=mixV([-1,-.25,side*.12],[.15,-1,side*.35],up);
  pole=mixV(mixV(mixV(pole,[-.1,-.6,side*.8],jab),[0,-1,side*.7],s.wall),[-.3,-1,.4],ch);
  const elbow=ik(sh,target,UPPER_ARM,FOREARM+HAND,unit(pole)),d=unit(sub(target,elbow)),wrist=add(elbow,mul(sub(target,elbow),FOREARM/(FOREARM+HAND)));
  body(chain([sh,.062]),chain([sh,.058],[mixV(sh,elbow,.45),.052],[elbow,.04]),chain([elbow,.041],[mixV(elbow,wrist,.3),.045],[mixV(elbow,wrist,.72),.034]));
  // Hand frame: the palm faces the centre line, turning to the floor on the jab or the chair, forward on the wall.
  const along=unit(mixV(d,[0,1,0],s.wall*.85));
  const want=mixV(mixV([0,0,-side],[0,-1,0],isLead?roll:ch),[1,0,0],s.wall);
  const palm=unit(sub(want,mul(along,dot(want,along)))),thumb=isLead?cross(palm,along):cross(along,palm);
  parts.push({depth:0,tone:"wrap",shapes:[chain([mixV(elbow,wrist,.72),.035],[wrist,.033]),...hand(wrist,along,palm,thumb,s.grip)]});
  if(isLead)leadHand=target;
 };
 arm(-1);arm(1);
 // A plain chair beside the rear hand, back rail toward the fighter.
 if(props.chair){
  const {x,z}=props.chair,c=(dx:number,y:number,dz:number):V=>[x+dx,y,z+dz],prop=(...shapes:Shape[])=>parts.push({depth:0,tone:"prop",shapes});
  prop({hull:[c(-.2,.44,-.2),c(.2,.44,-.2),c(.2,.44,.2),c(-.2,.44,.2),c(-.2,.48,-.2),c(.2,.48,-.2),c(.2,.48,.2),c(-.2,.48,.2)]});
  for(const [dx,dz] of [[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]])prop(chain([c(dx,.44,dz),.018],[c(dx,0,dz),.016]));
  prop(chain([c(-.18,.46,-.19),.02],[c(-.18,.93,-.19),.02]),chain([c(.18,.46,-.19),.02],[c(.18,.93,-.19),.02]),chain([c(-.19,.93,-.19),.026],[c(.19,.93,-.19),.026]),chain([c(-.18,.72,-.19),.016],[c(.18,.72,-.19),.016]));
 }
 return {parts,hand:leadHand,pelvis,ankles:[lead.ankle,rear.ankle],feet:[{shape:lead.shape,lift:s.leadLift},{shape:rear.shape,lift:s.rearLift}]};
}

// ── Drawing ────────────────────────────────────────────────────────────
export type View={yaw:number;pitch:number;mirror:boolean};
export type Paint={backdrop:string;glow:string;floor:string;far:string;near:string;wrapFar:string;wrapNear:string;prop:string;rim:string;guide:string;seam:string};
export type Guides={rail?:[V,V];home?:Spec;point?:V;trail:V[];weight:boolean};
const LIGHT=unit([-.45,-1,-.35]);  // fixed in the room, so the floor shadow stays put as the camera turns

function camera(w:number,h:number,v:View,origin:V){
 const s=h/2.3,cx=w/2,cy=h*.54,cf=Math.cos(v.yaw),sf=Math.sin(v.yaw),cp=Math.cos(v.pitch),sp=Math.sin(v.pitch);
 const project=(p:V):[number,number,number]=>{const x=p[0]-origin[0],y=p[1]-origin[1],z=p[2]-origin[2],n=x*sf+z*cf;
  return [cx+s*(x*cf-z*sf),cy-s*(y*cp-n*sp),n*cp+y*sp];};
 // The floor plane (x, z) maps to the screen by one affine transform in an orthographic view.
 const floor:[number,number,number,number,number,number]=[s*cf,s*sp*sf,-s*sf,s*sp*cf,cx-s*(origin[0]*cf-origin[2]*sf),cy+s*origin[1]*cp-s*sp*(origin[0]*sf+origin[2]*cf)];
 return {s,project,floor};
}
function hull(pts:[number,number][]){
 pts.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const turn=(o:[number,number],a:[number,number],b:[number,number])=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
 const lo:[number,number][]=[],hi:[number,number][]=[];
 for(const p of pts){while(lo.length>1&&turn(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
 for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(hi.length>1&&turn(hi[hi.length-2],hi[hi.length-1],p)<=0)hi.pop();hi.push(p);}
 return lo.slice(0,-1).concat(hi.slice(0,-1));
}
// The outline of two spheres joined by a cone: two circles and their outer tangents.
function capsule(ctx:CanvasRenderingContext2D,a:[number,number],ra:number,b:[number,number],rb:number){
 const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);
 ctx.beginPath();
 if(d<=Math.abs(ra-rb)){const [c,r]=ra>rb?[a,ra]:[b,rb];ctx.arc(c[0],c[1],r,0,Math.PI*2);ctx.fill();return;}
 const th=Math.atan2(dy,dx),al=Math.acos((ra-rb)/d);
 ctx.arc(a[0],a[1],ra,th+al,th-al+2*Math.PI);ctx.arc(b[0],b[1],rb,th-al,th+al);ctx.closePath();ctx.fill();
}
// grow > 0 fattens a shape by that many pixels, for the dark seam drawn behind each part.
function fillShape(ctx:CanvasRenderingContext2D,sh:Shape,map:(v:V)=>[number,number],k:number,grow=0){
 if("hull" in sh){
  const h=hull(sh.hull.map(map));ctx.beginPath();h.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();
  if(grow){ctx.lineWidth=grow*2;ctx.lineJoin="round";ctx.stroke();}
  return;
 }
 const c=sh.circles.map(([v,r])=>[map(v),r*k+grow] as [[number,number],number]);
 if(c.length===1){ctx.beginPath();ctx.arc(c[0][0][0],c[0][0][1],c[0][1],0,Math.PI*2);ctx.fill();return;}
 for(let i=0;i<c.length;i++)for(let j=i+1;j<c.length;j++)if(sh.all||j===i+1)capsule(ctx,c[i][0],c[i][1],c[j][0],c[j][1]);
}
const fillPart=(ctx:CanvasRenderingContext2D,p:Part,map:(v:V)=>[number,number],k:number,grow=0)=>{for(const sh of p.shapes)fillShape(ctx,sh,map,k,grow);};
const points=(p:Part)=>p.shapes.flatMap(sh=>"hull" in sh?sh.hull:sh.circles.map(c=>c[0]));
const hex=(c:string)=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const tint=(a:string,b:string,t:number)=>{const x=hex(a),y=hex(b);return "#"+x.map((v,i)=>Math.round(mix(v,y[i],t)).toString(16).padStart(2,"0")).join("");};

let shadowCanvas:HTMLCanvasElement|null=null;
export function draw(ctx:CanvasRenderingContext2D,w:number,h:number,dpr:number,pz:Pose,v:View,paint:Paint,origin:V,props:Props,guides:Guides){
 const cam=camera(w,h,v,origin);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.clearRect(0,0,w,h);
 // Room: a lantern glow behind the fighter and a lit circle of floor with mat seams.
 ctx.fillStyle=paint.backdrop;ctx.fillRect(0,0,w,h);
 const g=ctx.createRadialGradient(w/2,h*.38,0,w/2,h*.38,h*.75);g.addColorStop(0,paint.glow);g.addColorStop(1,"rgba(0,0,0,0)");
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 if(v.mirror){ctx.translate(w,0);ctx.scale(-1,1);}
 const base=ctx.getTransform();
 ctx.transform(...cam.floor);
 const fx=origin[0],fz=origin[2];
 const fg=ctx.createRadialGradient(fx,fz,0,fx,fz,1.7);fg.addColorStop(0,paint.floor);fg.addColorStop(1,"rgba(0,0,0,0)");
 ctx.fillStyle=fg;ctx.beginPath();ctx.arc(fx,fz,1.7,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.clip();ctx.strokeStyle=paint.floor;ctx.lineWidth=.006;
 for(let z=-1.8;z<=1.8;z+=.45){ctx.beginPath();ctx.moveTo(fx-1.8,fz+z);ctx.lineTo(fx+1.8,fz+z);ctx.stroke();}
 ctx.restore();
 // Floor guides: each foot's track, where the feet started, and where the weight sits between them.
 if(guides.home){
  const hm=guides.home;ctx.strokeStyle=paint.guide;ctx.lineWidth=.008;ctx.setLineDash([.04,.035]);ctx.globalAlpha=.4;
  for(const z of [hm.leadZ,hm.rearZ]){ctx.beginPath();ctx.moveTo(fx-1.3,z);ctx.lineTo(fx+1.3,z);ctx.stroke();}
  ctx.setLineDash([]);ctx.globalAlpha=.16;ctx.fillStyle=paint.guide;
  for(const [x,z,yaw] of [[hm.leadX,hm.leadZ,hm.leadYaw],[hm.rearX,hm.rearZ,hm.rearYaw]])fillShape(ctx,foot([x,0,z],yaw,0,0).shape,p=>[p[0],p[2]],1);
  ctx.globalAlpha=1;
 }
 if(guides.weight){
  const [a,b]=pz.ankles,p=pz.pelvis;ctx.strokeStyle=paint.guide;ctx.globalAlpha=.55;ctx.lineWidth=.01;
  ctx.beginPath();ctx.moveTo(a[0],a[2]);ctx.lineTo(b[0],b[2]);ctx.stroke();
  ctx.globalAlpha=.9;ctx.fillStyle=paint.guide;ctx.beginPath();ctx.arc(p[0],p[2],.028,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 }
 // Cast shadow: every shape flattened onto the floor along the light, softened.
 shadowCanvas??=document.createElement("canvas");
 if(shadowCanvas.width!==ctx.canvas.width||shadowCanvas.height!==ctx.canvas.height){shadowCanvas.width=ctx.canvas.width;shadowCanvas.height=ctx.canvas.height;}
 const sc=shadowCanvas.getContext("2d")!;
 sc.setTransform(1,0,0,1,0,0);sc.clearRect(0,0,shadowCanvas.width,shadowCanvas.height);
 sc.setTransform(ctx.getTransform());sc.fillStyle="#000";
 const flat=(p:V):[number,number]=>{const k=p[1]/LIGHT[1];return [p[0]-LIGHT[0]*k,p[2]-LIGHT[2]*k];};
 for(const p of pz.parts)fillPart(sc,p,flat,1);
 ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=.5;ctx.filter=`blur(${Math.round(4*dpr)}px)`;ctx.drawImage(shadowCanvas,0,0);ctx.filter="none";ctx.globalAlpha=1;
 ctx.setTransform(base);
 const map=(p:V):[number,number]=>{const q=cam.project(p);return [q[0],q[1]];};
 // The point the eyes rest on, and the jab's rail.
 if(guides.rail){
  const a=map(guides.rail[0]),b=map(guides.rail[1]);
  ctx.strokeStyle=paint.guide;ctx.globalAlpha=.55;ctx.lineWidth=1.5;ctx.setLineDash([5,6]);
  ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
 }
 if(guides.point){
  const P=map(guides.point);ctx.strokeStyle=ctx.fillStyle=paint.guide;ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(P[0],P[1],7,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(P[0],P[1],2.2,0,Math.PI*2);ctx.fill();
 }
 // A wall to lean on, drawn faintly so the fighter shows through it from any side.
 const wallQuad=props.wall===undefined?null:([[props.wall,0,-.75],[props.wall,1.9,-.75],[props.wall,1.9,.75],[props.wall,0,.75]] as V[]);
 const wallNear=wallQuad?cam.project([props.wall!,1,0])[2]>cam.project(pz.pelvis)[2]:false;
 const drawWall=()=>{if(!wallQuad)return;ctx.fillStyle=ctx.strokeStyle=paint.guide;ctx.globalAlpha=.08;ctx.beginPath();
  wallQuad.map(map).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.globalAlpha=.35;ctx.lineWidth=1.2;ctx.stroke();ctx.globalAlpha=1;};
 if(!wallNear)drawWall();
 // Figure: back to front. A gold copy nudged toward the light shows as a rim on the lit edges.
 for(const p of pz.parts){const c=points(p);let n=0;for(const q of c)n+=cam.project(q)[2];p.depth=n/c.length;}
 // Legs always go first so the hips cover the tops of the thighs; everything else sorts by depth.
 const sorted=[...pz.parts].sort((a,b)=>Number(!a.legs)-Number(!b.legs)||a.depth-b.depth);
 ctx.save();ctx.translate(v.mirror?2.4:-2.4,-2);ctx.fillStyle=paint.rim;for(const p of sorted)if(p.tone!=="prop")fillPart(ctx,p,map,cam.s);ctx.restore();
 for(const p of sorted){
  const t=clamp01((p.depth+.32)/.64);
  ctx.fillStyle=ctx.strokeStyle=paint.seam;fillPart(ctx,p,map,cam.s,.9);
  const fill=p.tone==="wrap"?tint(paint.wrapFar,paint.wrapNear,t):p.tone==="prop"?tint(paint.seam,paint.prop,.55+t*.45):tint(paint.far,paint.near,t);
  ctx.fillStyle=p.accent?tint(fill,paint.rim,p.accent*.55):fill;fillPart(ctx,p,map,cam.s);
 }
 if(wallNear)drawWall();
 // Foot map: the floor from straight above, facing up the screen, so foot order and spacing read at a glance.
 if(guides.home){
  const hm=guides.home,size=Math.min(118,h*.3),k=size/.8,ox=12+size/2,oy=h-12-size/2,hx=(hm.leadX+hm.rearX)/2,hz=(hm.leadZ+hm.rearZ)/2;
  ctx.save();ctx.setTransform(base);
  ctx.fillStyle="rgba(10,9,14,.55)";ctx.strokeStyle=paint.floor;ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(12,h-12-size,size,size,10);ctx.fill();ctx.stroke();ctx.clip();
  ctx.fillStyle=paint.guide;ctx.globalAlpha=.7;ctx.beginPath();ctx.moveTo(ox,h-size-6);ctx.lineTo(ox-5,h-size+2);ctx.lineTo(ox+5,h-size+2);ctx.closePath();ctx.fill();
  ctx.transform(0,-k,k,0,ox,oy);ctx.translate(-hx,-hz);
  ctx.strokeStyle=paint.guide;ctx.lineWidth=.006;ctx.setLineDash([.03,.025]);ctx.globalAlpha=.45;
  for(const z of [hm.leadZ,hm.rearZ]){ctx.beginPath();ctx.moveTo(hx-.5,z);ctx.lineTo(hx+.5,z);ctx.stroke();}
  ctx.setLineDash([]);ctx.globalAlpha=.18;
  for(const [x,z,yaw] of [[hm.leadX,hm.leadZ,hm.leadYaw],[hm.rearX,hm.rearZ,hm.rearYaw]])fillShape(ctx,foot([x,0,z],yaw,0,0).shape,p=>[p[0],p[2]],1);
  ctx.globalAlpha=1;
  for(const f of pz.feet){ctx.fillStyle=f.lift>.003?paint.rim:paint.near;fillShape(ctx,f.shape,p=>[p[0],p[2]],1);}
  ctx.fillStyle=paint.guide;ctx.beginPath();ctx.arc(pz.pelvis[0],pz.pelvis[2],.022,0,Math.PI*2);ctx.fill();
  ctx.restore();
 }
 // A fading trace of the lead hand over the last moment.
 if(guides.trail.length>1){
  ctx.lineCap="round";
  for(let i=1;i<guides.trail.length;i++){const a=map(guides.trail[i-1]),b=map(guides.trail[i]);
   ctx.strokeStyle=paint.guide;ctx.globalAlpha=.5*i/guides.trail.length;ctx.lineWidth=cam.s*.05*i/guides.trail.length;
   ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  ctx.globalAlpha=1;
 }
}
