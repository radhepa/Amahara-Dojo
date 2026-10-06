import {lines,type Expression,type StoryLine,type StoryScene} from "./types";
import {PILOT_REVISION} from "./pilot";
import {MONTH_INTERLUDES} from "./month-interludes";

// Mood tags are explicit stage direction, never inferred from dialogue sentiment.
export function script(text:string):StoryLine[]{return lines(text).map(line=>{
 const [speaker,mood]=line.speaker.split("~");
 return {...line,speaker,...(mood?{expression:mood as Expression}:{})};
});}
export function section(heading:string,location:string,text:string):StoryLine[]{
 const result=script(text);result[0]={...result[0],heading,location};return result.map(l=>({...l,location}));
}
export function pick(flag:string,prompt:string,options:{id:string;label:string;speaker:string;text:string;expression?:Expression;memory?:string}[]):StoryLine{
 return {speaker:"you",text:prompt,decision:{flag,prompt,options:options.map(o=>({id:o.id,label:o.label,reply:[{speaker:o.speaker,text:o.text,expression:o.expression??"neutral"}],memory:o.memory}))}};
}
export function recall(flag:string,value:string,speaker:string,text:string,expression:Expression="neutral"):StoryLine{return {speaker,text,expression,when:{flag,value}};}
export type Expansion={before:StoryLine[];after:StoryLine[]};
export function expandWeek(week:number,originals:StoryScene[],expansions:Expansion[]):StoryScene[]{
 return expansions.map((expansion,i)=>{
  const original=originals.find(s=>s.episode===week&&s.beat===i+1)!;
  if(!original)throw new Error(`Missing week ${week} beat ${i+1}`);
  const id=`c1-month-w${week}-b${i+1}`;
  // Existing scenes remain untouched. Fresh month scenes have their own durable IDs.
  const core=structuredClone(original.lines);
  core[0]={...core[0],heading:"Scene two · the shared room",location:original.location};
  const choice:StoryLine[]=original.choice?[{speaker:"you",text:original.choice.prompt,decision:structuredClone(original.choice)}]:[];
  const interlude=section("Scene two · an ordinary detail",original.location,MONTH_INTERLUDES[`${week}-${i+1}`]);
  core[0].heading="Scene three · the shared room";
  const passages=[...expansion.before,...interlude,...core,...choice,...expansion.after];
  const words=passages.reduce((n,l)=>n+l.text.split(/\s+/).length,0);
  return {id,title:original.title,episode:week,beat:i+1,location:original.location,kind:"main",revision:PILOT_REVISION,
   readingMinutes:`${Math.max(6,Math.round(words/160))}–${Math.max(9,Math.round(words/110))}`,
   lines:passages.map((l,n)=>({...l,...(l.heading?{heading:l.heading.replace(/^Scene [^·]+ · /,"")}:{}),id:`${id}-p${String(n+1).padStart(3,"0")}`}))};
 });
}
export function opening(week:number,beat:number,title:string,passages:StoryLine[]):StoryScene{
 const id=`c1-month-opening-w${week}-b${beat}`;
 return {id,title,episode:week,beat,location:passages[0]?.location??"courtyard",kind:"opening",revision:PILOT_REVISION,readingMinutes:"3–5",lines:passages.map((l,n)=>({...l,id:`${id}-p${n+1}`}))};
}
