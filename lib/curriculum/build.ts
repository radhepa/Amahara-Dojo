import type {BlockFormat,CueCall,Drill} from "../training";

// Every drill names a standing version (its steps), a supported (chair, wall or doorframe)
// version and a seated version. Gentle and supported practice earn the same rewards.
export type DrillSpec = {
 name:string;family:string;cue:string;steps:[string,string,string,string];checks:[string,string];
 supported:string;seated:string;avoid:string;
 format?:BlockFormat;timing?:"warmup"|"cooldown";dose?:string;minutes?:5|10;sources?:string[];
 exercises?:string[];cues?:CueCall[];cueGap?:readonly [number,number];tempo?:number;countCycle?:number;hold?:20|30;
};

const DOSE:Record<BlockFormat,string> = {
 A:"30 sec practice / 30 sec rest · 3 rounds in 5 min",
 B:"40 sec build / 20 sec rest · 4 rounds in 5 min",
 H:"3 supported holds with equal rests · 5 min",
 E:"Slow run, review, then a run on the count",
 C:"3 × 2-min rounds with 1-min rests · 10 min",
 F:"4 × 40-sec cued rounds / 20 sec rest · 5 min",
 D:"2 × 3-min rounds with 1-min rests · 10 min",
 G:"6 min on the count, then 3 min breathing · 10 min",
 S:"40 sec per exercise / 20 sec to switch · 5 min",
};

// "Seated: Seated marches…" reads twice; drop the repeated word.
const tidy = (label:string,text:string) => {const t=text.replace(new RegExp(`^${label}\\s+`,"i"),"");return t.charAt(0).toUpperCase()+t.slice(1);};

export function makeDrills(chapter:number,specs:Record<string,DrillSpec>):Record<string,Drill>{
 return Object.fromEntries(Object.entries(specs).map(([id,s])=>{
  const timed=!s.timing;
  const format=s.timing?undefined:(s.format??"A");
  const drill:Drill={
   name:s.name,category:`Chapter ${chapter} · ${s.family}`,cue:s.cue,steps:[...s.steps],checkpoints:[...s.checks],
   easier:`Supported: ${tidy("Supported",s.supported)} Seated: ${tidy("Seated",s.seated)}`,avoid:s.avoid,
   dose:s.dose??(s.timing==="warmup"?"5 min gradual warm-up · rests welcome":s.timing==="cooldown"?"5 min cool-down and review":DOSE[format!]+(format==="E"&&s.minutes===10?" · 10 min":format==="E"?" · 5 min":"")),
   ...(timed?{format,timedRounds:format==="A"}:{timing:s.timing,timedRounds:false}),
   ...(s.minutes?{minutes:s.minutes}:{}),...(s.sources?{sources:s.sources}:{}),...(s.exercises?{exercises:s.exercises}:{}),
   ...(s.cues?{cues:s.cues}:{}),...(s.cueGap?{cueGap:s.cueGap}:{}),...(s.tempo?{tempo:s.tempo}:{}),...(s.countCycle?{countCycle:s.countCycle}:{}),...(s.hold?{hold:s.hold}:{}),
  };
  return [id,drill];
 }));
}

// A practice day without its warm-up and cool-down: [title, focus, technique blocks, reason?]
export type DaySpec = readonly [title:string,focus:string,blocks:readonly string[],reason?:string];
export type WeekSpec = {name:string;focus:string;goals:readonly [string,string,string];days:readonly [DaySpec,DaySpec,DaySpec,DaySpec,DaySpec,DaySpec]};
export type ChapterSpec = {chapter:number;warm:string;cool:string;drills:Record<string,Drill>;weeks:readonly WeekSpec[]};
