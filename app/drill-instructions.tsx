"use client";
import {Leaf,ShieldCheck,Check} from "lucide-react";
import {DRILLS} from "@/lib/training";
import {roundTiming} from "@/lib/week-one";
import {drillPhase} from "@/lib/practice-timing";

export function DrillInstructions({id,seconds,elapsed,gentle=false}:{id:string;seconds?:number;elapsed?:number;gentle?:boolean}){
 const d=DRILLS[id];const timing=d.timedRounds&&seconds?roundTiming(seconds):null;const phase=seconds&&elapsed!==undefined?drillPhase(d,seconds,elapsed):null;
 return <div className="drill-detail">
  <p className="cue">{d.cue}</p>
  {gentle&&<div className="tip"><Leaf size={17}/><div><strong>Gentle version · same rewards</strong><p>{d.easier} Use any practice interval for extra rest; do not add rounds later.</p></div></div>}
  {(timing||phase)&&<div className={`practice-rhythm ${phase?.kind??""}`}>
   {phase&&<div className="round-now"><strong role="status">{phase.label}</strong><span aria-live="off">{phase.remaining}s</span></div>}
   {timing&&<><strong>{timing.rounds} rounds · {timing.work}s practice / {timing.rest}s rest</strong>
   <p>First minute: read and set up. Practise slowly until the rest cue; you do not need to fill the interval with repetitions. Then use the final {timing.review/60} minute to relax and check one form point. Take extra rest inside an interval whenever needed.</p></>}
  </div>}
  <ol>{d.steps.map(s=><li key={s}>{s}</li>)}</ol>
  {d.checkpoints&&<div className="form-checks"><strong>Check your form</strong>{d.checkpoints.map(c=><p key={c}><Check size={15}/>{c}</p>)}</div>}
  {d.timedRounds&&<p className="small-note">If a check feels difficult, make the movement smaller or use the easier version next round. Repeat the same lesson until it feels controlled; never add speed to compensate.</p>}
  <div className="tip"><Leaf size={17}/><div><strong>Make it easier</strong><p>{d.easier}</p></div></div>
  <div className="safety-tip"><ShieldCheck size={17}/><p>{d.avoid}</p></div>
 </div>;
}
