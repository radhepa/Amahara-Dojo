"use client";
import {Leaf,ShieldCheck,Check} from "lucide-react";
import {DRILLS} from "@/lib/training";
import {practicePhase,roundTiming} from "@/lib/week-one";

export function DrillInstructions({id,seconds,elapsed}:{id:string;seconds?:number;elapsed?:number}){
 const d=DRILLS[id];const timing=d.timedRounds&&seconds?roundTiming(seconds):null;const phase=timing&&elapsed!==undefined?practicePhase(seconds!,elapsed):null;
 return <div className="drill-detail">
  <p className="cue">{d.cue}</p>
  {timing&&<div className={`practice-rhythm ${phase?.kind??""}`}>
   {phase&&<div className="round-now"><strong role="status">{phase.label}</strong><span aria-live="off">{phase.remaining}s</span></div>}
   <strong>{timing.rounds} rounds · {timing.work}s practice / {timing.rest}s rest</strong>
   <p>First minute: read the instructions and set up. Follow the rounds, then use the final {timing.review/60} minute to rest and check your form. More rest or a smaller movement is always welcome.</p>
  </div>}
  <ol>{d.steps.map(s=><li key={s}>{s}</li>)}</ol>
  {d.checkpoints&&<div className="form-checks"><strong>Check your form</strong>{d.checkpoints.map(c=><p key={c}><Check size={15}/>{c}</p>)}</div>}
  <div className="tip"><Leaf size={17}/><div><strong>Make it easier</strong><p>{d.easier}</p></div></div>
  <div className="safety-tip"><ShieldCheck size={17}/><p>{d.avoid}</p></div>
 </div>;
}
