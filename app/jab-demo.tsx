"use client";
import {useEffect,useRef,useState} from "react";
import {Pause,Play,Route} from "lucide-react";
import {draw,fistAt,PHASE_TEXT,pose,sample,timeline,type Paint,type Phase} from "@/lib/shadow-fighter";

const PAINT:Paint={backdrop:"#1e1b27",glow:"rgba(232,184,101,.3)",floor:"rgba(244,236,221,.1)",far:"#0b0a0f",near:"#3a3346",wrapFar:"#6e2418",wrapNear:"#cf4a35",rim:"#e8b865",rail:"#e8b865",seam:"#07060a"};
const SPEEDS={real:{label:"Real speed",value:1},slow:{label:"Slow",value:.35},study:{label:"Study",value:.12}} as const;
export type DemoSpeed=keyof typeof SPEEDS;
const VIEWS=[{label:"Side",yaw:0},{label:"Angle",yaw:.6},{label:"Front",yaw:1.3},{label:"Behind",yaw:-2.3}];

// The jab demonstrated by a shadow fighter: drag to turn the camera, scrub to study any moment.
export function JabDemo({speed:initial="slow"}:{speed?:DemoSpeed}){
 const wrap=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),scrub=useRef<HTMLInputElement>(null);
 const [playing,setPlaying]=useState(true),[speed,setSpeed]=useState<DemoSpeed>(initial),[view,setView]=useState<number|null>(1);
 const [right,setRight]=useState(false),[rail,setRail]=useState(true),[phase,setPhase]=useState<Phase>("guard");
 // The loop reads live settings from one ref so it never restarts.
 const live=useRef({playing,speed,rail,right,t:0,breath:0,yaw:VIEWS[1].yaw,goal:VIEWS[1].yaw,phase:"guard" as Phase,visible:true});
 useEffect(()=>{Object.assign(live.current,{playing,speed,rail,right});},[playing,speed,rail,right]);

 useEffect(()=>{
  const c=canvas.current!,box=wrap.current!,ctx=c.getContext("2d")!;
  let w=0,h=0,dpr=1,raf=0,last=performance.now();
  const size=()=>{dpr=Math.min(2,devicePixelRatio||1);w=box.clientWidth;h=box.clientHeight;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);};
  const ro=new ResizeObserver(size),io=new IntersectionObserver(([e])=>{live.current.visible=e.isIntersecting;});
  ro.observe(box);io.observe(box);size();
  const frame=(now:number)=>{
   const s=live.current,dt=Math.min(.05,(now-last)/1000),tl=timeline(SPEEDS[s.speed].value);last=now;
   if(s.playing){s.t=(s.t+dt)%tl.total;s.breath+=dt;}
   s.yaw+=(s.goal-s.yaw)*Math.min(1,dt*7);
   if(s.visible&&w&&h){
    const at=sample(s.t,tl),gap=.024/SPEEDS[s.speed].value;
    const trail=at.f>0?Array.from({length:9},(_,i)=>fistAt(sample(Math.max(0,s.t-(8-i)*gap),tl).f)):[];
    draw(ctx,w,h,dpr,pose(at.f,at.roll,Math.sin(s.breath*1.8)),{yaw:s.yaw,pitch:.2,mirror:s.right},PAINT,{rail:s.rail,trail});
    if(scrub.current&&s.playing)scrub.current.value=String(Math.round(at.progress*1000));
    if(at.phase!==s.phase){s.phase=at.phase;setPhase(at.phase);}
   }
   raf=requestAnimationFrame(frame);
  };
  // With reduced motion the fighter waits in guard until play is pressed.
  raf=requestAnimationFrame(now=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches){live.current.playing=false;setPlaying(false);}frame(now);});
  return ()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();};
 },[]);

 const look=(i:number)=>{setView(i);live.current.goal=VIEWS[i].yaw;};
 const changeSpeed=(k:DemoSpeed)=>{setSpeed(k);live.current.t=0;};
 const seek=(v:number)=>{const s=live.current,tl=timeline(SPEEDS[s.speed].value);setPlaying(false);s.t=tl.pre+v/1000*tl.motion;};
 // Dragging sideways orbits the camera around the fighter.
 const drag=useRef<{x:number;yaw:number}|null>(null);
 const down=(e:React.PointerEvent)=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,yaw:live.current.goal};};
 const move=(e:React.PointerEvent)=>{if(!drag.current)return;const s=live.current;s.goal=s.yaw=drag.current.yaw+(e.clientX-drag.current.x)*.009*(s.right?-1:1);setView(null);};
 const text=PHASE_TEXT[phase];

 return <figure className="jab-demo">
  <div className="jab-stage" ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
   <canvas ref={canvas} role="img" aria-label={`A shadow fighter in a ${right?"right":"left"} lead throws a jab: the lead fist travels straight to the point, the palm turns down in the last third, the elbow stays soft, and the fist returns on the same line while the rear hand stays by the cheek.`}/>
   <div className={`jab-phase is-${phase}`}><strong>{text.title}</strong><span>{text.body}</span></div>
   <span className="jab-hint" aria-hidden="true">Drag to turn</span>
  </div>
  <div className="jab-bar">
   <button type="button" className="jab-play" onClick={()=>setPlaying(p=>!p)} aria-label={playing?"Pause the demonstration":"Play the demonstration"}>{playing?<Pause size={18}/>:<Play size={18}/>}</button>
   <input ref={scrub} type="range" className="jab-scrub" min={0} max={1000} defaultValue={0} aria-label="Step through the jab" onChange={e=>seek(Number(e.target.value))}/>
   <div className="segmented" role="group" aria-label="Speed">{(Object.keys(SPEEDS) as DemoSpeed[]).map(k=><button key={k} type="button" aria-pressed={speed===k} onClick={()=>changeSpeed(k)}>{SPEEDS[k].label}</button>)}</div>
  </div>
  <div className="jab-bar">
   <div className="segmented" role="group" aria-label="Camera">{VIEWS.map((v,i)=><button key={v.label} type="button" aria-pressed={view===i} onClick={()=>look(i)}>{v.label}</button>)}</div>
   <div className="segmented" role="group" aria-label="Lead">{[false,true].map(r=><button key={String(r)} type="button" aria-pressed={right===r} onClick={()=>setRight(r)}>{r?"Right lead":"Left lead"}</button>)}</div>
   <button type="button" className="jab-rail" aria-pressed={rail} onClick={()=>setRail(r=>!r)}><Route size={15}/>Rail</button>
  </div>
 </figure>;
}
