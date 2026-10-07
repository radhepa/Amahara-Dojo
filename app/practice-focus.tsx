"use client";
import {useMemo} from "react";
import {DRILLS,type Drill} from "@/lib/training";
import {drillPhase,type DrillPhase} from "@/lib/practice-timing";
import {currentBeat,currentCue} from "@/lib/blocks";

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

function detailFor(drill:Drill,phase:DrillPhase,rounds:number){
 if(phase.kind==="complete")return "Stop and confirm";
 // The newer block formats name their own phases (exercise, run, hold, count).
 if(drill.format&&drill.format!=="A")return phase.label;
 return phase.kind==="work"||phase.kind==="rest"?`Round ${phase.round} of ${rounds}`:phase.kind==="setup"?"Read the steps · find your space":"Relax · notice what felt steady";
}

export function PhaseRing({drill,seconds,elapsed,running,limitReached=false,seed="",bpm=0,exact}:{drill:Drill;seconds:number;elapsed:number;running:boolean;limitReached?:boolean;seed?:string;bpm?:number;exact?:number}){
 const segments=useMemo(()=>segmentsFor(drill,seconds),[drill,seconds]);
 const used=Math.min(seconds,Math.max(0,elapsed));
 const phase=drillPhase(drill,seconds,used);
 const currentIndex=phase.kind==="complete"?segments.length:segments.findIndex(s=>used>=s.start&&used<s.start+s.length);
 const current=segments[currentIndex];
 const fraction=current?Math.max(0,Math.min(1,phase.remaining/current.length)):0;
 const radius=150,circumference=2*Math.PI*radius;
 const kind=limitReached?"complete":phase.kind;
 const label=limitReached?"Workout limit":phase.kind==="complete"?"Block complete":running?PHASE_NAME[phase.kind]??"Practice":"Paused";
 const rounds=Math.max(0,...segments.map(s=>s.round));
 // Cue calls and count pulses use the fractional time the bell is scheduled from.
 const at=exact??elapsed;
 const cue=running&&phase.cued?currentCue(drill,seconds,seed,at):undefined;
 const beat=running&&phase.count&&bpm?currentBeat(drill,seconds,bpm,at):undefined;
 return <div className={`phase-ring is-${kind} ${running?"is-running":"is-paused"}`}>
  <div className="dial">
   <svg viewBox="0 0 340 340" aria-hidden="true"><circle className="dial-track" cx="170" cy="170" r={radius}/><circle className="dial-arc" cx="170" cy="170" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference*(1-fraction)}/></svg>
   {beat&&<span key={beat.at} className={`count-pulse ${beat.accent?"is-accent":""}`} aria-hidden="true"/>}
   <div className="dial-face">
    {cue?<div className="cue-call" key={cue.at} role="status" aria-live="assertive"><strong>{cue.call}</strong><span>{cue.answer}</span></div>
    :<><span className="dial-phase">{label}</span><strong>{clock(phase.remaining)}</strong><span className="dial-detail">{detailFor(drill,phase,rounds)}</span>{beat?<span className="dial-count">Count {beat.beat} of {drill.countCycle??4} · {bpm}/min</span>:<span className="dial-block">{clock(seconds-used)} left in this block</span>}</>}
   </div>
  </div>
  {segments.length>1&&<div className="phase-strip" aria-hidden="true">{segments.map((s,i)=><span key={i} style={{flexGrow:s.length}} className={`seg seg-${s.kind} ${i<currentIndex?"done":i===currentIndex?"now":""}`}/>)}</div>}
 </div>;
}

export function BlockTrack({plan,index,elapsed}:{plan:{id:string;seconds:number}[];index:number;elapsed:number}){
 return <ol className="block-track" aria-label="Practice blocks">{plan.map((b,i)=>{
  const fill=i<index?100:i===index?Math.min(100,Math.max(0,elapsed/b.seconds*100)):0;
  const name=DRILLS[b.id]?.category.replace(/^(Week|Chapter) \d+ · /,"").replace(/^Foundation · /,"")??"Block";
  return <li key={`${i}:${b.id}`} style={{flexGrow:b.seconds}} aria-current={i===index?"step":undefined} className={i<index?"done":i===index?"now":""}><span className="track-bar"><i style={{width:`${fill}%`}}/></span><span className="track-label">{name}</span></li>;
 })}</ol>;
}
