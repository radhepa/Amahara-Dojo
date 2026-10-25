"use client";
import {Leaf,ShieldCheck,Check,BookOpen} from "lucide-react";
import {DRILLS} from "@/lib/training";
import {roundTiming} from "@/lib/week-one";
import {drillPhase} from "@/lib/practice-timing";
import {formatSummary} from "@/lib/blocks";
import {SOURCES} from "@/lib/curriculum/sources";
import type {MoveId} from "@/lib/shadow-moves";
import {MoveDemo} from "./move-demo";

const TONE_NAME={high:"High ping",low:"Low knock",double:"Double ping"} as const;
// Drills demonstrated by the shadow fighter; speed picks the move's starting pace (0 = full speed).
const DEMOS:Record<string,{move:MoveId;speed?:number}>={
 "f2-warm":{move:"warm"},"f2-stance":{move:"stance"},"f2-guard":{move:"guard"},"f2-shift":{move:"shift"},
 "f2-forward":{move:"forward"},"f2-side":{move:"side"},"f2-flow":{move:"flow"},"f2-stop":{move:"stop"},"f2-four":{move:"four"},
 "f2-moving-guard":{move:"movingGuard"},"f2-distance":{move:"distance"},"f2-corner":{move:"corner"},"f2-choice":{move:"choice"},
 "f2-review":{move:"review"},"f2-cool":{move:"cool"},
 "c2-fist":{move:"jab",speed:2},"c2-jab":{move:"jab",speed:1},"c2-still":{move:"jab"},
};

export function DrillInstructions({id,seconds,elapsed,gentle=false,rhythm=true}:{id:string;seconds?:number;elapsed?:number;gentle?:boolean;rhythm?:boolean}){
 const d=DRILLS[id];const timing=d.timedRounds&&seconds?roundTiming(seconds):null;const phase=seconds&&elapsed!==undefined?drillPhase(d,seconds,elapsed):null;
 const summary=seconds?formatSummary(d,seconds):null;
 return <div className="drill-detail">
  <p className="cue">{d.cue}</p>
  {DEMOS[id]&&<MoveDemo key={id} move={DEMOS[id].move} speed={DEMOS[id].speed} support={gentle}/>}
  {gentle&&<div className="tip"><Leaf size={17}/><div><strong>Gentle version · same rewards</strong><p>{d.easier} Use any practice interval for extra rest; do not add rounds later.</p></div></div>}
  {rhythm&&(timing||phase||summary)&&<div className={`practice-rhythm ${phase?.kind??""}`}>
   {phase&&<div className="round-now"><strong role="status">{phase.label}</strong><span aria-live="off">{phase.remaining}s</span></div>}
   {timing&&<><strong>{timing.rounds} rounds · {timing.work}s practice / {timing.rest}s rest</strong>
   <p>First minute: read and set up. Practise slowly until the rest cue; you do not need to fill the interval with repetitions. Then use the final {timing.review/60} minute to relax and check one form point. Take extra rest inside an interval whenever needed.</p></>}
   {!timing&&summary&&<><strong>{summary.title}</strong><p>{summary.body}</p></>}
  </div>}
  {d.cues&&<div className="cue-key"><strong>The calls</strong>{d.cues.map(c=><p key={c.call}><span className={`tone tone-${c.tone}`}>{TONE_NAME[c.tone]}</span><b>{c.call}</b> · {c.answer}</p>)}</div>}
  {d.exercises&&<div className="cue-key"><strong>Exercises in order</strong><p>{d.exercises.join(" · ")}</p></div>}
  {d.tempo&&<p className="small-note">Steady count: {d.tempo} per minute by default{d.countCycle?`, accent every ${d.countCycle}`:""}. Change it with the count control beside the timer.</p>}
  <ol className="drill-steps">{d.steps.map(s=><li key={s}>{s}</li>)}</ol>
  {d.checkpoints&&<div className="form-checks"><strong>Check your form</strong>{d.checkpoints.map(c=><p key={c}><Check size={15}/>{c}</p>)}</div>}
  {(d.timedRounds||d.format)&&<p className="small-note">If a check feels difficult, make the movement smaller or use the easier version next round. Repeat the same lesson until it feels controlled; never add speed to compensate.</p>}
  <div className="drill-options"><div className="tip"><Leaf size={17}/><div><strong>Make it easier</strong><p>{d.easier}</p></div></div>
  <div className="safety-tip"><ShieldCheck size={17}/><div><strong>Avoid</strong><p>{d.avoid}</p></div></div></div>
  {d.sources?.length?<div className="drill-sources"><BookOpen size={15}/><div><strong>Sources</strong>{d.sources.map(key=>{const s=SOURCES[key];return s?<p key={key}>{s.url?<a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>:s.label}</p>:null;})}<p className="small-note">They support general technique and safety points, not this exact dose.</p></div></div>:null}
 </div>;
}
