// A shadow fighter throwing a jab. A small 3D rig (metres, y up, x toward the point, the lead side is -z)
// posed with two-bone IK so the fist really travels a straight rail, drawn on a 2D canvas as a shaded
// silhouette with a rim light and a cast floor shadow. Orthodox only; a right lead is the mirror image.
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
const clamp01=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(x:number)=>{const t=clamp01(x);return t*t*(3-2*t);};

// ── Timing ─────────────────────────────────────────────────────────────
export type Phase="guard"|"rail"|"turn"|"stop"|"home"|"ready";
export const PHASE_TEXT:Record<Phase,{title:string;body:string}>={
 guard:{title:"Guard",body:"Eyes on your point. Rear hand by the cheek."},
 rail:{title:"Rail",body:"The fist moves first, with no hitch or dip."},
 turn:{title:"Turn",body:"Palm down in the last third. Breathe out: tss."},
 stop:{title:"Soft elbow",body:"Stop just short of straight."},
 home:{title:"Home",body:"Same line back, at least as fast."},
 ready:{title:"Guard",body:"The rear hand never left the cheek."},
};
// Holds stay in real seconds so slow motion slows the punch, not the waiting.
export function timeline(speed:number){
 const pre=1.1,out=.2/speed,stop=.06/speed,home=.21/speed,post=1.3;
 return {pre,out,stop,home,post,motion:out+stop+home,total:pre+out+stop+home+post};
}
export type Timeline=ReturnType<typeof timeline>;
// f = how far along the rail the fist is (0 guard, 1 extended); roll = palm turn (0 vertical, 1 palm down).
export function sample(t:number,tl:Timeline){
 let f=0,phase:Phase="guard";
 const a=t-tl.pre;
 if(a<0)phase="guard";
 else if(a<tl.out){f=Math.pow(Math.sin(a/tl.out*Math.PI/2),1.25);phase=f<.66?"rail":"turn";}
 else if(a<tl.out+tl.stop){f=1;phase="stop";}
 else if(a<tl.motion){f=1-smooth((a-tl.out-tl.stop)/tl.home);phase="home";}
 else phase="ready";
 return {f,roll:smooth((f-.62)/.34),phase,progress:clamp01(a/tl.motion)};
}

// ── Pose ───────────────────────────────────────────────────────────────
type Body={px:number;py:number;pz:number;hipYaw:number;chestYaw:number;lean:number;shrug:number;reach:number;headYaw:number;tuck:number;heel:number};
const GUARD:Body={px:0,py:.905,pz:.02,hipYaw:-.62,chestYaw:-.72,lean:.07,shrug:0,reach:0,headYaw:-.25,tuck:0,heel:.035};
const EXTEND:Body={px:.035,py:.895,pz:.005,hipYaw:-.78,chestYaw:-.98,lean:.1,shrug:.03,reach:.035,headYaw:-.32,tuck:.018,heel:.05};
const blend=(t:number):Body=>Object.fromEntries(Object.keys(GUARD).map(k=>[k,mix(GUARD[k as keyof Body],EXTEND[k as keyof Body],t)])) as Body;

const UPPER_ARM=.29,FOREARM=.26,FIST=.05,THIGH=.44,SHIN=.44;
export const POINT:V=[2.6,1.5,0];          // the mark on the wall, at chin height
export const GUARD_FIST:V=[.43,1.49,-.04];   // the lead fist in guard, in front of the chin

function frame(b:Body,yaw:number){const p:V=[b.px,b.py,b.pz];return (l:V)=>add(p,rotZ(rotY(l,yaw),-b.lean));}
// Two-bone IK: the middle joint bends toward the pole.
function ik(root:V,target:V,a:number,b:number,pole:V){
 const d=sub(target,root),dist=Math.min(Math.max(len(d),Math.abs(a-b)+1e-3),(a+b)*.995),u=unit(d);
 const v=unit(sub(pole,mul(u,dot(pole,u)))),x=(a*a-b*b+dist*dist)/(2*dist);
 return add(add(root,mul(u,x)),mul(v,Math.sqrt(Math.max(0,a*a-x*x))));
}
function shoulder(b:Body){return frame(b,b.chestYaw)([b.reach,.515+b.shrug,-.18]);}
let extendCache:V|null=null;
// Where the rail ends: soft elbow, about 94% of full reach, aimed at the point.
export function railEnd():V{
 if(extendCache)return extendCache;
 const s=shoulder(EXTEND);
 return extendCache=add(s,mul(unit(sub(POINT,s)),(UPPER_ARM+FOREARM+FIST)*.94));
}

export const fistAt=(f:number)=>mixV(GUARD_FIST,railEnd(),f);
type Shape={circles:[V,number][];all?:boolean}|{hull:V[]};
export type Part={depth:number;tone:"body"|"wrap";legs?:boolean;shapes:Shape[]};
export type Pose={parts:Part[];fist:V;focus:V};
const chain=(...circles:[V,number][]):Shape=>({circles});

function foot(ball:V,yaw:number,lift:number){
 const th=Math.asin(Math.min(.9,lift/.17)),c=Math.cos(th),s=Math.sin(th);
 const at=(f:number,y:number):V=>add(ball,rotY([f*c+y*s,-f*s+y*c,0],yaw));
 return {ankle:at(-.12,.085),shape:chain([at(-.175,.042),.042],[at(-.12,.085),.046],[at(-.02,.036),.036],[at(.07,.024),.024])};
}
function ellipsoid(c:V,r:V,to:(l:V)=>V,lat=7,lon=12){
 const out:V[]=[];
 for(let i=1;i<lat;i++){const th=Math.PI*i/lat;for(let j=0;j<lon;j++){const ph=2*Math.PI*j/lon;
  out.push(to([c[0]+r[0]*Math.sin(th)*Math.cos(ph),c[1]+r[1]*Math.cos(th),c[2]+r[2]*Math.sin(th)*Math.sin(ph)]));}}
 out.push(to([c[0],c[1]+r[1],c[2]]),to([c[0],c[1]-r[1],c[2]]));
 return out;
}

export function pose(f:number,roll:number,breath=0):Pose{
 const b=blend(f);b.py+=breath*.003;
 const hips=frame(b,b.hipYaw),chest=frame(b,b.chestYaw),parts:Part[]=[];
 const body=(...shapes:Shape[])=>parts.push({depth:0,tone:"body",shapes}),wrap=(...shapes:Shape[])=>parts.push({depth:0,tone:"wrap",shapes});
 // Torso: elliptical rings from the hips to the neck, twisting from the hip turn to the chest turn.
 const RINGS:[number,number,number,number,number][]=[[-.1,.1,.15,-.012,0],[0,.106,.162,0,0],[.19,.09,.132,.012,.45],[.34,.112,.162,.024,.85],[.455,.116,.178,.022,1],[.525,.09,.198,0,1],[.585,.054,.07,.012,1]];
 const rings=RINGS.map(([y,dx,dz,ox,w])=>{const to=frame(b,mix(b.hipYaw,b.chestYaw,w)),pts:V[]=[];
  for(let i=0;i<18;i++){const a=2*Math.PI*i/18;pts.push(to([ox+dx*Math.cos(a),y+(y>.4?breath*.004:0),dz*Math.sin(a)]));}return pts;});
 body(...rings.slice(1).map((r,i)=>({hull:[...rings[i],...r]})));
 // Head and neck. The chin stays slightly down, and tucks behind the lead shoulder on the jab.
 const neck=chest([.012,.58,0]),head=add(neck,rotY([.03+b.tuck*.5,.128-b.tuck,0],b.headYaw));
 const pitch=.12+b.tuck*3,toHead=(l:V)=>add(head,rotY(rotZ(l,-pitch),b.headYaw));
 body(chain([neck,.056],[add(head,[0,-.07,0]),.052]),{hull:[...ellipsoid([-.008,.012,0],[.102,.12,.086],toHead),...ellipsoid([.035,-.064,0],[.068,.052,.064],toHead,5,10),...ellipsoid([.102,-.01,0],[.022,.024,.016],toHead,4,8)]});
 // Legs: feet planted, knees follow the toes. The rear heel stays light.
 const lead=foot([.35,0,-.13],-.25,.004),rear=foot([-.15,0,.19],-.75,b.heel);
 for(const [hip,ft,yaw,out] of [[hips([0,-.06,-.095]),lead,-.25,-.35],[hips([0,-.06,.095]),rear,-.75,.25]] as [V,ReturnType<typeof foot>,number,number][]){
  const knee=ik(hip,ft.ankle,THIGH,SHIN,rotY([1,0,out],yaw));
  parts.push({depth:0,tone:"body",legs:true,shapes:[chain([hip,.09],[mixV(hip,knee,.45),.078],[knee,.054]),chain([knee,.052],[mixV(knee,ft.ankle,.3),.058],[mixV(knee,ft.ankle,.75),.041],[ft.ankle,.037]),ft.shape]});
 }
 // Arms. The lead fist rides the rail; the rear fist is pinned beside the jaw and moves with the head.
 const railFist=fistAt(f);
 const rearFist=add(head,rotY([.03,-.085,.105],b.headYaw));
 const arm=(sh:V,fist:V,pole:V,side:-1|1,palmIn:V,turn:number)=>{
  const elbow=ik(sh,fist,UPPER_ARM,FOREARM+FIST,pole),d=unit(sub(fist,elbow)),wrist=add(elbow,mul(sub(fist,elbow),FOREARM/(FOREARM+FIST)));
  body(chain([sh,.062]),chain([sh,.058],[mixV(sh,elbow,.45),.052],[elbow,.04]),chain([elbow,.041],[mixV(elbow,wrist,.3),.045],[mixV(elbow,wrist,.72),.034]));
  // Fist frame: palm turns from facing the centre line to facing the floor.
  const pin=unit(sub(palmIn,mul(d,dot(palmIn,d)))),down=unit(sub([0,-1,0],mul(d,-d[1]))),a=turn*Math.PI/2;
  const palm=unit(add(mul(pin,Math.cos(a)),mul(down,Math.sin(a)))),thumb=side<0?cross(palm,d):cross(d,palm);
  const at=(along:number,th:number,pa:number)=>add(add(add(wrist,mul(d,along)),mul(thumb,th)),mul(palm,pa));
  wrap(chain([mixV(elbow,wrist,.72),.035],[wrist,.033]),{circles:[[at(.032,.022,0),.034],[at(.032,-.022,0),.034],[at(.068,.02,-.004),.031],[at(.068,-.02,-.004),.031]],all:true},chain([at(.032,.035,.02),.015],[at(.064,.03,.027),.013]));
 };
 arm(shoulder(b),railFist,unit(mixV([0,-1,-.35],[-.1,-.6,-.8],f)),-1,[0,0,1],roll);
 arm(chest([-.01,.515,.18]),rearFist,[.25,-1,.15],1,[0,0,-1],0);
 return {parts,fist:railFist,focus:add(shoulder(EXTEND),mul(unit(sub(POINT,shoulder(EXTEND))),.95))};
}

// ── Drawing ────────────────────────────────────────────────────────────
export type View={yaw:number;pitch:number;mirror:boolean};
export type Paint={backdrop:string;glow:string;floor:string;far:string;near:string;wrapFar:string;wrapNear:string;rim:string;rail:string;seam:string};
const LIGHT=unit([-.45,-1,-.35]);  // fixed in the room, so the floor shadow stays put as the camera turns
const ORIGIN:V=[.25,.95,0];

function camera(w:number,h:number,v:View){
 const s=h/2.3,cx=w/2,cy=h*.54,cf=Math.cos(v.yaw),sf=Math.sin(v.yaw),cp=Math.cos(v.pitch),sp=Math.sin(v.pitch);
 const project=(p:V):[number,number,number]=>{const x=p[0]-ORIGIN[0],y=p[1]-ORIGIN[1],z=p[2]-ORIGIN[2],n=x*sf+z*cf;
  return [cx+s*(x*cf-z*sf),cy-s*(y*cp-n*sp),n*cp+y*sp];};
 // The floor plane (x, z) maps to the screen by one affine transform in an orthographic view.
 const floor:[number,number,number,number,number,number]=[s*cf,s*sp*sf,-s*sf,s*sp*cf,cx-s*(ORIGIN[0]*cf-ORIGIN[2]*sf),cy+s*ORIGIN[1]*cp-s*sp*(ORIGIN[0]*sf+ORIGIN[2]*cf)];
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
const tint=(a:string,b:string,t:number)=>{const x=hex(a),y=hex(b);return `rgb(${x.map((v,i)=>Math.round(mix(v,y[i],t))).join(",")})`;};

let shadowCanvas:HTMLCanvasElement|null=null;
export function draw(ctx:CanvasRenderingContext2D,w:number,h:number,dpr:number,pz:Pose,v:View,paint:Paint,opts:{rail:boolean;trail:V[]}){
 const cam=camera(w,h,v);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.clearRect(0,0,w,h);
 // Room: a lantern glow behind the fighter and a lit circle of floor with mat seams.
 ctx.fillStyle=paint.backdrop;ctx.fillRect(0,0,w,h);
 const g=ctx.createRadialGradient(w/2,h*.38,0,w/2,h*.38,h*.75);g.addColorStop(0,paint.glow);g.addColorStop(1,"rgba(0,0,0,0)");
 ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 if(v.mirror){ctx.translate(w,0);ctx.scale(-1,1);}
 const base=ctx.getTransform();
 ctx.transform(...cam.floor);
 const fg=ctx.createRadialGradient(.1,0,0,.1,0,1.7);fg.addColorStop(0,paint.floor);fg.addColorStop(1,"rgba(0,0,0,0)");
 ctx.fillStyle=fg;ctx.beginPath();ctx.arc(.1,0,1.7,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.clip();ctx.strokeStyle=paint.floor;ctx.lineWidth=.006;
 for(let z=-1.6;z<=1.8;z+=.45){ctx.beginPath();ctx.moveTo(-1.8,z);ctx.lineTo(1.9,z);ctx.stroke();}
 ctx.restore();
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
 // The point on the wall, and the rail the fist should follow.
 const map=(p:V):[number,number]=>{const q=cam.project(p);return [q[0],q[1]];};
 const P=map(pz.focus);
 if(opts.rail){
  const a=map(GUARD_FIST),b=map(railEnd());
  ctx.strokeStyle=paint.rail;ctx.globalAlpha=.55;ctx.lineWidth=1.5;ctx.setLineDash([5,6]);
  ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
 }
 ctx.strokeStyle=paint.rail;ctx.lineWidth=2;ctx.beginPath();ctx.arc(P[0],P[1],7,0,Math.PI*2);ctx.stroke();
 ctx.fillStyle=paint.rail;ctx.beginPath();ctx.arc(P[0],P[1],2.2,0,Math.PI*2);ctx.fill();
 // Figure: back to front. A gold copy nudged toward the light shows as a rim on the lit edges.
 for(const p of pz.parts){const c=points(p);let n=0;for(const q of c)n+=cam.project(q)[2];p.depth=n/c.length;}
 // Legs always go first so the hips cover the tops of the thighs; everything else sorts by depth.
 const sorted=[...pz.parts].sort((a,b)=>Number(!a.legs)-Number(!b.legs)||a.depth-b.depth);
 ctx.save();ctx.translate(v.mirror?2.4:-2.4,-2);ctx.fillStyle=paint.rim;for(const p of sorted)fillPart(ctx,p,map,cam.s);ctx.restore();
 for(const p of sorted){
  const t=clamp01((p.depth+.32)/.64);
  ctx.fillStyle=ctx.strokeStyle=paint.seam;fillPart(ctx,p,map,cam.s,.9);
  ctx.fillStyle=p.tone==="wrap"?tint(paint.wrapFar,paint.wrapNear,t):tint(paint.far,paint.near,t);
  fillPart(ctx,p,map,cam.s);
 }
 // A fading trace of the fist's path over the last moment.
 if(opts.trail.length>1){
  ctx.lineCap="round";
  for(let i=1;i<opts.trail.length;i++){const a=map(opts.trail[i-1]),b=map(opts.trail[i]);
   ctx.strokeStyle=paint.rail;ctx.globalAlpha=.5*i/opts.trail.length;ctx.lineWidth=cam.s*.05*i/opts.trail.length;
   ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  ctx.globalAlpha=1;
 }
}
