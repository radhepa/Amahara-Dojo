"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {Armchair,Pause,Play,Route} from "lucide-react";
import {draw,pose,type Paint} from "@/lib/shadow-fighter";
import {canSupport as supports,captionAt,clock,getMove,specAt,VIEWS,type ViewName} from "@/lib/shadow-moves";

const PAINT:Paint={backdrop:"#1e1b27",glow:"rgba(232,184,101,.3)",floor:"rgba(244,236,221,.1)",far:"#0b0a0f",near:"#3a3346",wrapFar:"#6e2418",wrapNear:"#cf4a35",prop:"#6b5644",rim:"#e8b865",guide:"#e8b865",seam:"#07060a"};
const VIEW_ORDER:ViewName[]=["side","angle","front","behind","above"];

// A shadow fighter demonstrating one move: drag to turn or tilt the camera, scrub to study any moment.
export function MoveDemo({move:id,speed:initialSpeed=0,support:initialSupport=false}:{move:string;speed?:number;support?:boolean}){
 const wrap=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null),scrub=useRef<HTMLInputElement>(null);
 const canSupport=supports(id);
 const [support,setSupport]=useState(initialSupport&&canSupport),move=useMemo(()=>getMove(id,support),[id,support]);
 const [playing,setPlaying]=useState(true),[speed,setSpeed]=useState(Math.min(initialSpeed,move.speeds.length-1));
 const [view,setView]=useState<ViewName|null>(move.view),[right,setRight]=useState(false),[guides,setGuides]=useState(true);
 const [caption,setCaption]=useState(()=>captionAt(move,0,false));
 // The loop reads live settings from one ref so it never restarts.
 const live=useRef({move,clk:clock(move,move.speeds[speed].value),speedValue:move.speeds[speed].value,playing,guides,right,t:0,breath:0,
  yaw:VIEWS[move.view].yaw,pitch:VIEWS[move.view].pitch,goalYaw:VIEWS[move.view].yaw,goalPitch:VIEWS[move.view].pitch,caption:-1,visible:true});
 useEffect(()=>{const s=live.current,value=move.speeds[speed].value;
  // A new move or speed restarts the loop; caption -1 makes the next frame refresh the caption.
  if(s.move!==move||s.speedValue!==value){s.t=0;s.caption=-1;}
  Object.assign(s,{move,clk:clock(move,value),speedValue:value,playing,guides,right});
 },[move,speed,playing,guides,right]);

 useEffect(()=>{
  const c=canvas.current!,box=wrap.current!,ctx=c.getContext("2d")!;
  let w=0,h=0,dpr=1,raf=0,last=performance.now();
  const size=()=>{dpr=Math.min(2,devicePixelRatio||1);w=box.clientWidth;h=box.clientHeight;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);};
  const ro=new ResizeObserver(size),io=new IntersectionObserver(([e])=>{live.current.visible=e.isIntersecting;});
  ro.observe(box);io.observe(box);size();
  const frame=(now:number)=>{
   const s=live.current,m=s.move,dt=Math.min(.05,(now-last)/1000);last=now;
   if(s.playing){s.t=(s.t+dt)%s.clk.total;s.breath+=dt;}
   s.yaw+=(s.goalYaw-s.yaw)*Math.min(1,dt*7);s.pitch+=(s.goalPitch-s.pitch)*Math.min(1,dt*7);
   if(s.visible&&w&&h){
    const st=s.clk.script(s.t),spec=specAt(m,st),gap=.024/s.speedValue;
    const rear=spec.cross>spec.jab,trail=m.trail&&(spec.jab>0||spec.cross>0)?Array.from({length:9},(_,i)=>{const p=pose(specAt(m,s.clk.script(Math.max(0,s.t-(8-i)*gap))));return rear?p.rearHand:p.hand;}):[];
    draw(ctx,w,h,dpr,pose(spec,m.props,Math.sin(s.breath*1.8)),{yaw:s.yaw,pitch:s.pitch,mirror:s.right},PAINT,m.origin,m.props,
     {rail:s.guides?m.rail:undefined,home:s.guides?m.home:undefined,point:m.point,trail,weight:s.guides&&m.weight});
    const [a,b]=m.scrub??[0,m.duration];
    if(scrub.current&&s.playing)scrub.current.value=String(Math.round(Math.max(0,Math.min(1,(st-a)/(b-a)))*1000));
    const cap=captionAt(m,st,s.right);
    if(cap.index!==s.caption){s.caption=cap.index;setCaption(cap);}
   }
   raf=requestAnimationFrame(frame);
  };
  // With reduced motion the fighter waits at the start until play is pressed.
  raf=requestAnimationFrame(now=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches){live.current.playing=false;setPlaying(false);}frame(now);});
  return ()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();};
 },[]);

 const look=(v:ViewName)=>{setView(v);Object.assign(live.current,{goalYaw:VIEWS[v].yaw,goalPitch:VIEWS[v].pitch});};
 const seek=(v:number)=>{const s=live.current,[a,b]=s.move.scrub??[0,s.move.duration];setPlaying(false);s.playing=false;s.t=s.clk.real(a+v/1000*(b-a));};
 // Dragging orbits the camera sideways and tilts it up and down.
 const drag=useRef<{x:number;y:number;yaw:number;pitch:number}|null>(null);
 const down=(e:React.PointerEvent)=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,yaw:live.current.goalYaw,pitch:live.current.goalPitch};};
 const move_=(e:React.PointerEvent)=>{if(!drag.current)return;const s=live.current,d=drag.current;
  s.goalYaw=s.yaw=d.yaw+(e.clientX-d.x)*.009*(s.right?-1:1);s.goalPitch=s.pitch=Math.max(.05,Math.min(1.3,d.pitch+(e.clientY-d.y)*.006));setView(null);};
 const end=()=>{drag.current=null;};

 return <figure className="move-demo">
  <div className="move-stage" ref={wrap} onPointerDown={down} onPointerMove={move_} onPointerUp={end} onPointerCancel={end}>
   <canvas ref={canvas} role="img" aria-label={`A shadow fighter in a ${right?"right":"left"} lead demonstrates: ${move.title}${support?", with one hand on a chair":""}. The caption names each step as it happens.`}/>
   <div className="move-caption"><strong>{caption.title}</strong><span>{caption.body}</span></div>
   <span className="move-hint" aria-hidden="true">Drag to turn</span>
  </div>
  <div className="move-bar">
   <button type="button" className="move-play" onClick={()=>setPlaying(p=>!p)} aria-label={playing?"Pause the demonstration":"Play the demonstration"}>{playing?<Pause size={18}/>:<Play size={18}/>}</button>
   <input ref={scrub} type="range" className="move-scrub" min={0} max={1000} defaultValue={0} aria-label="Step through the move" onChange={e=>seek(Number(e.target.value))}/>
   <div className="segmented" role="group" aria-label="Speed">{move.speeds.map((sp,i)=><button key={sp.label} type="button" aria-pressed={speed===i} onClick={()=>setSpeed(i)}>{sp.label}</button>)}</div>
  </div>
  <div className="move-bar">
   <div className="segmented" role="group" aria-label="Camera">{VIEW_ORDER.map(v=><button key={v} type="button" aria-pressed={view===v} onClick={()=>look(v)}>{VIEWS[v].label}</button>)}</div>
   <div className="segmented" role="group" aria-label="Lead">{[false,true].map(r=><button key={String(r)} type="button" aria-pressed={right===r} onClick={()=>setRight(r)}>{r?"Right lead":"Left lead"}</button>)}</div>
   <button type="button" className="move-toggle" aria-pressed={guides} onClick={()=>setGuides(g=>!g)}><Route size={15}/>Guides</button>
   {canSupport&&<button type="button" className="move-toggle" aria-pressed={support} onClick={()=>setSupport(v=>!v)}><Armchair size={15}/>Chair support</button>}
  </div>
 </figure>;
}
