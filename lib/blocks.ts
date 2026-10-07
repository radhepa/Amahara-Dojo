import type {BlockFormat,Drill} from "./training";

// Timelines for the block formats in docs/training-architecture.md (B, H, E, C, F, D, G, S).
// Format A keeps the original practicePhase in week-one.ts so saved plans are unchanged.
export type PhaseKind = "setup"|"work"|"rest"|"review";
export type Segment = {kind:PhaseKind;start:number;length:number;round:number;rounds:number;label:string;count?:boolean;cued?:boolean;exercise?:string};
type Part = Omit<Segment,"start"|"rounds">;

export const FORMAT_MINUTES:Record<BlockFormat,5|10> = {A:5,B:5,H:5,E:5,C:10,F:5,D:10,G:10,S:5};
export const FORMAT_NAMES:Record<BlockFormat,string> = {A:"Learn",B:"Build",H:"Hold",E:"Form",C:"Round",F:"Cue",D:"Long round",G:"Count",S:"Strength / mobility"};
export function blockMinutes(drill:Drill){return drill.format==="E"&&drill.minutes===10?10:drill.format?FORMAT_MINUTES[drill.format]:5;}

function rounds(count:number,work:number,rest:number,workLabel:(r:number)=>string,restLabel:(r:number)=>string,extra:Partial<Part>={}):Part[]{
 return Array.from({length:count},(_,i)=>[{kind:"work" as const,length:work,round:i+1,label:workLabel(i+1),...extra},{kind:"rest" as const,length:rest,round:i+1,label:restLabel(i+1)}]).flat();
}

function parts(drill:Drill):Part[]{
 switch(drill.format){
  case "B":return [{kind:"setup",length:30,round:0,label:"Read the steps · build your stance"},...rounds(4,40,20,r=>`Build · round ${r} of 4`,r=>`Rest · round ${r} of 4`),{kind:"review",length:30,round:4,label:"Relax · check one form point"}];
  case "F":return [{kind:"setup",length:30,round:0,label:"Learn the calls · build your stance"},...rounds(4,40,20,r=>`Answer the bell · round ${r} of 4`,r=>`Rest · round ${r} of 4`,{cued:true}),{kind:"review",length:30,round:4,label:"Relax · rate your answers"}];
  case "H":{const hold=drill.hold??30;return [{kind:"setup",length:60,round:0,label:"Set your support · find the hold"},...rounds(3,hold,hold,r=>`Hold · ${r} of 3`,r=>`Release · ${r} of 3`),{kind:"review",length:300-60-6*hold,round:3,label:"Shake out · check one form point"}];}
  case "E":return drill.minutes===10
   ?[{kind:"setup",length:60,round:0,label:"Stand at your mark · recall the order"},{kind:"work",length:210,round:1,label:"Slow run"},{kind:"review",length:60,round:1,label:"Review · rebuild your stance"},{kind:"work",length:180,round:2,label:"Count-tempo run",count:true},{kind:"review",length:90,round:2,label:"Review · one correction for next time"}]
   :[{kind:"setup",length:30,round:0,label:"Stand at your mark · recall the order"},{kind:"work",length:105,round:1,label:"Slow run"},{kind:"review",length:30,round:1,label:"Review · rebuild your stance"},{kind:"work",length:105,round:2,label:"Count-tempo run",count:true},{kind:"review",length:30,round:2,label:"Review · one correction"}];
  case "C":return [{kind:"setup",length:60,round:0,label:"Read the menu · see your opponent"},...rounds(3,120,60,r=>`Round ${r} of 3`,r=>r===3?"Rest · review the rounds":`Rest · round ${r} of 3`)];
  case "D":return [{kind:"setup",length:30,round:0,label:"Read the menu · settle your breath"},...rounds(2,180,60,r=>`Long round ${r} of 2`,r=>`Rest · round ${r} of 2`),{kind:"review",length:90,round:2,label:"Breathe out long · review"}];
  case "G":return [{kind:"setup",length:60,round:0,label:"Find the count · build your stance"},{kind:"work",length:360,round:1,label:"On the count · rest any time",count:true},{kind:"review",length:180,round:1,label:"Breathe · slow down · review"}];
  case "S":{
   const list=drill.exercises?.length?drill.exercises:["Exercise"];
   const items:Part[]=list.flatMap((exercise,i)=>[{kind:"work" as const,length:40,round:i+1,label:`${exercise} · ${i+1} of ${list.length}`,exercise},{kind:"rest" as const,length:20,round:i+1,label:i<list.length-1?`Switch · next: ${list[i+1]}`:"Switch · last exercise done"}]);
   return [{kind:"setup",length:30,round:0,label:"Set up · read the exercise list"},...items,{kind:"review",length:Math.max(0,270-60*list.length),round:list.length,label:"Relax · note how many clean reps"}];
  }
  default:return [];
 }
}

const cache=new Map<string,Segment[]>();
export function blockTimeline(drill:Drill,seconds:number):Segment[]{
 const key=`${drill.name}|${drill.format}|${drill.minutes}|${drill.hold}|${drill.exercises?.join(",")}|${seconds}`;
 const hit=cache.get(key);if(hit)return hit;
 const list=parts(drill).filter(p=>p.length>0);
 const total=Math.max(1,...list.map(p=>p.round));
 let start=0;const out:Segment[]=list.map(p=>{const s={...p,start,rounds:total};start+=p.length;return s;});
 // A different block length is absorbed by the final phase so the timer always ends on time.
 while(out.length>1&&out[out.length-1].start>=seconds)out.pop();
 const last=out[out.length-1];if(last)last.length=Math.max(1,seconds-last.start);
 cache.set(key,out);return out;
}

export function timelinePhase(drill:Drill,seconds:number,elapsed:number){
 const used=Math.min(seconds,Math.max(0,Math.floor(elapsed)));
 const segments=blockTimeline(drill,seconds);
 if(used>=seconds)return {kind:"complete",label:"Block complete · stop and confirm",remaining:0,round:segments.at(-1)?.round??0,rounds:segments[0]?.rounds??0};
 const seg=segments.find(s=>used>=s.start&&used<s.start+s.length)??segments[segments.length-1];
 return {kind:seg.kind,label:seg.label,remaining:Math.max(0,seg.start+seg.length-used),round:seg.round,rounds:seg.rounds,count:!!seg.count,cued:!!seg.cued,exercise:seg.exercise};
}

// Deterministic randomness: the same block in the same session always gets the same calls,
// so a reload, a resumed timer and the visual cue all agree with the audio.
function hash(text:string){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function random(seed:string){let a=hash(seed);return()=>{a=(a+0x6d2b79f5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}

export type CueEvent = {at:number;cue:number};
export function cueSchedule(drill:Drill,seconds:number,seed:string):CueEvent[]{
 const calls=drill.cues??[];if(!calls.length)return [];
 const [min,max]=drill.cueGap??[3,6];const next=random(`${seed}|${drill.name}`);const out:CueEvent[]=[];
 for(const seg of blockTimeline(drill,seconds)){
  if(!seg.cued)continue;
  let at=seg.start+2+next()*2;const end=seg.start+seg.length-2;
  while(at<=end){
   let cue=Math.floor(next()*calls.length);
   // Never the same call three times running: random practice, not a guessing game.
   const [a,b]=out.slice(-2);if(calls.length>1&&a&&b&&a.cue===cue&&b.cue===cue)cue=(cue+1)%calls.length;
   out.push({at:Math.round(at*100)/100,cue});at+=min+next()*(max-min);
  }
 }
 return out;
}

export const COUNT_TEMPO_RANGE = [32,96] as const;
export function countTempo(drill:Drill,offset=0){return drill.tempo?Math.max(COUNT_TEMPO_RANGE[0],Math.min(COUNT_TEMPO_RANGE[1],drill.tempo+offset)):0;}
export type Beat = {at:number;accent:boolean;beat:number};
export function countBeats(drill:Drill,seconds:number,bpm:number):Beat[]{
 if(!bpm)return [];const step=60/bpm,cycle=drill.countCycle??4,out:Beat[]=[];
 for(const seg of blockTimeline(drill,seconds)){
  if(!seg.count)continue;
  // The phase bell marks the start; the first count follows one beat later.
  for(let k=1;seg.start+k*step<seg.start+seg.length-.25;k++)out.push({at:Math.round((seg.start+k*step)*1000)/1000,accent:(k-1)%cycle===0,beat:(k-1)%cycle+1});
 }
 return out;
}
export function currentBeat(drill:Drill,seconds:number,bpm:number,elapsed:number){
 const beats=countBeats(drill,seconds,bpm);let found:Beat|undefined;
 for(const b of beats){if(b.at>elapsed)break;found=b;}
 return found&&elapsed-found.at<60/bpm?found:undefined;
}
export function currentCue(drill:Drill,seconds:number,seed:string,elapsed:number,showFor=1.8){
 let found:CueEvent|undefined;
 for(const c of cueSchedule(drill,seconds,seed)){if(c.at>elapsed)break;found=c;}
 return found&&elapsed-found.at<showFor&&drill.cues?{...found,...drill.cues[found.cue]}:undefined;
}

export function formatSummary(drill:Drill,seconds:number){
 switch(drill.format){
  case "B":return {title:"4 rounds · 40s build / 20s rest",body:"30 seconds to read and set up, four 40-second rounds with 20-second rests, then 30 seconds to review. Keep the quality of round one in round four; slow down rather than speed up when tired."};
  case "F":return {title:"4 cued rounds · 40s / 20s rest",body:"Each round, the bell calls cues at random moments. Answer each call once, return to guard, and wait. The call also appears on screen when sound is off. Accuracy before speed."};
  case "H":{const hold=drill.hold??30;return {title:`3 supported holds · ${hold}s / ${hold}s release`,body:"A minute to set your support, three holds with equal rests, then a short review. Support is always allowed. Stop a hold early whenever form or balance changes."};}
  case "E":return {title:seconds>=600?"Slow run · review · count-tempo run":"Slow run · count-tempo run",body:"Stand at your mark. First run slowly, pausing whenever you need to recall the next move. Review, rebuild your stance, then run it again on the bell's steady count. Use the gentle version freely."};
  case "C":return {title:"3 rounds · 2 min / 1 min rest",body:"A minute to read the menu and picture your opponent, then three 2-minute rounds with 1-minute rests. Keep effort at 'short sentences'. The final rest is your review."};
  case "D":return {title:"2 long rounds · 3 min / 1 min rest",body:"Two 3-minute rounds with 1-minute rests and a 90-second review. Breathe out long in every rest. If form breaks, slow down or stop; that is the skill."};
  case "G":return {title:"6 min on the count · 3 min breathing",body:"A minute to find the count, six minutes of a steady pattern on the bell's count, then three minutes of breathing and review. Step out to rest whenever you need and rejoin on the next accent."};
  case "S":return {title:`${drill.exercises?.length??4} exercises · 40s each / 20s switch`,body:"Work at a steady pace and stop each exercise 2–3 repetitions before it gets hard. The 20 seconds between exercises are for switching position, not for squeezing in more."};
  default:return null;
 }
}
