import type {Drill} from "./training";
import {practicePhase} from "./week-one";
import {timelinePhase} from "./blocks";

export type DrillPhase = {kind:string;label:string;remaining:number;round:number;rounds?:number;count?:boolean;cued?:boolean;exercise?:string};
export function drillPhase(drill:Drill,seconds:number,elapsed:number):DrillPhase{
 const used=Math.min(seconds,Math.max(0,Math.floor(elapsed)));
 if(drill.format&&drill.format!=="A")return timelinePhase(drill,seconds,used);
 if(drill.timedRounds)return practicePhase(seconds,used);
 if(used>=seconds)return {kind:"complete",label:"Block complete · stop and confirm",remaining:0,round:0};
 if(drill.timing==="warmup"){
  if(used<30)return {kind:"setup",label:"Clear your space · get comfortable",remaining:30-used,round:0};
  return {kind:"work",label:"Warm up gently · rest whenever needed",remaining:seconds-used,round:0};
 }
 return {kind:"review",label:drill.timing==="cooldown"?"Slow down · relax · review":"Move gently · rest as needed",remaining:seconds-used,round:0};
}

export type BellCue = {at:number;finish:boolean};
export function bellCues(drill:Drill,seconds:number):BellCue[]{
 const cues:BellCue[]=[];
 let previous=drillPhase(drill,seconds,0);
 for(let at=1;at<=seconds;at++){
  const next=drillPhase(drill,seconds,at);
  if(next.kind!==previous.kind||next.round!==previous.round)cues.push({at,finish:at===seconds});
  previous=next;
 }
 return cues;
}
