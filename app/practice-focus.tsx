"use client";
import {useMemo} from "react";
import {DRILLS,type Drill} from "@/lib/training";
import {drillPhase} from "@/lib/practice-timing";

type Phase = ReturnType<typeof drillPhase>;
type Segment = {kind:string;round:number;start:number;length:number};

export const clock=(s:number)=>`${Math.floor(Math.max(0,s)/60)}:${Math.floor(Math.max(0,s)%60).toString().padStart(2,"0")}`;
const PHASE_NAME:Record<string,string>={setup:"Set up",work:"Practice",rest:"Rest",review:"Review",complete:"Done"};

// Groups each second of a block into its setup, practice, rest and review phases.
function segmentsFor(drill:Drill,seconds:number):Segment[]{
 const out:Segment[]=[];
 for(let at=0;at<seconds;at++){
  const p=drillPhase(drill,seconds,at),last=out[out.length-1];
  if(last&&last.kind===p.kind&&last.round===p.round)last.length++;
  else out.push({kind:p.kind,round:p.round,start:at,length:1});
 }
 return out;
}

export function PhaseRing({drill,seconds,elapsed,running,limitReached=false}:{drill:Drill;seconds:number;elapsed:number;running:boolean;limitReached?:boolean}){
 const segments=useMemo(()=>segmentsFor(drill,seconds),[drill,seconds]);
 const used=Math.min(seconds,Math.max(0,elapsed));
 const phase:Phase=drillPhase(drill,seconds,used);
 const currentIndex=phase.kind==="complete"?segments.length:segments.findIndex(s=>used>=s.start&&used<s.start+s.length);
 const current=segments[currentIndex];
 const fraction=current?Math.max(0,Math.min(1,phase.remaining/current.length)):0;
 const radius=150,circumference=2*Math.PI*radius;
 const kind=limitReached?"complete":phase.kind;
 const label=limitReached?"Workout limit":phase.kind==="complete"?"Block complete":running?PHASE_NAME[phase.kind]??"Practice":"Paused";
 const rounds=Math.max(0,...segments.map(s=>s.round));
 const detail=phase.kind==="complete"?"Stop and confirm":phase.kind==="work"||phase.kind==="rest"?`Round ${phase.round} of ${rounds}`:phase.kind==="setup"?"Read the steps · find your space":"Relax · notice what felt steady";
 return <div className={`phase-ring is-${kind} ${running?"is-running":"is-paused"}`}>
  <div className="dial">
   <svg viewBox="0 0 340 340" aria-hidden="true"><circle className="dial-track" cx="170" cy="170" r={radius}/><circle className="dial-arc" cx="170" cy="170" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference*(1-fraction)}/></svg>
   <div className="dial-face"><span className="dial-phase">{label}</span><strong>{clock(phase.remaining)}</strong><span className="dial-detail">{detail}</span><span className="dial-block">{clock(seconds-used)} left in this block</span></div>
  </div>
  {segments.length>1&&<div className="phase-strip" aria-hidden="true">{segments.map((s,i)=><span key={i} style={{flexGrow:s.length}} className={`seg seg-${s.kind} ${i<currentIndex?"done":i===currentIndex?"now":""}`}/>)}</div>}
 </div>;
}

export function BlockTrack({plan,index,elapsed}:{plan:{id:string;seconds:number}[];index:number;elapsed:number}){
 return <ol className="block-track" aria-label="Practice blocks">{plan.map((b,i)=>{
  const fill=i<index?100:i===index?Math.min(100,Math.max(0,elapsed/b.seconds*100)):0;
  const name=DRILLS[b.id]?.category.replace(/^Week \d+ · /,"").replace(/^Foundation · /,"")??"Block";
  return <li key={`${i}:${b.id}`} style={{flexGrow:b.seconds}} aria-current={i===index?"step":undefined} className={i<index?"done":i===index?"now":""}><span className="track-bar"><i style={{width:`${fill}%`}}/></span><span className="track-label">{name}</span></li>;
 })}</ol>;
}
