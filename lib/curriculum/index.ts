import type {Drill,BlockFormat} from "../training";
import {FOUNDATION_DRILLS,FOUNDATION_SCHEDULES,type PracticeDay} from "../foundations";
import {blockMinutes} from "../blocks";
import type {ChapterSpec,WeekSpec} from "./build";
import {CHAPTER_2} from "./chapter-02";
import {CHAPTER_3} from "./chapter-03";
import {CHAPTER_4} from "./chapter-04";
import {CHAPTER_5} from "./chapter-05";
import {CHAPTER_6} from "./chapter-06";
import {CHAPTER_7} from "./chapter-07";
import {CHAPTER_8} from "./chapter-08";
import {CHAPTER_9} from "./chapter-09";
import {CHAPTER_10} from "./chapter-10";

// The whole solo programme: docs/training-architecture.md. Chapter 1 is the published
// foundation (f2-*); Chapters 2–10 use versioned c{n}- IDs.
//
// A chapter's curriculum unlocks together with its story. Raise this when the next
// chapter's story is ready to play (tests check it never runs ahead of the story).
export const STORY_READY_CHAPTERS = 1;

export type Feel = "Calm"|"Build"|"Peak"|"Trial"|"Recovery"|"Recovery + Trial"|"Taper";
export type ChapterInfo = {chapter:number;milestone:string;phase:string;weeks:number;firstWeek:number;goal:string;effort:string;feels:readonly Feel[];trial:{title:string;checks:readonly string[]}};
const info = (chapter:number,milestone:string,phase:string,weeks:number,goal:string,effort:string,feels:Feel[],trial:string,checks:string[]) => ({chapter,milestone,phase,weeks,goal,effort,feels,trial:{title:trial,checks}});
const RAW = [
 info(1,"Foundations","Foundations",8,"A repeatable stance and guard, balance, four-direction footwork, distance and calm coordination.","Easy · 2–3 out of 10",["Build","Build","Build","Build","Build","Build","Build","Trial"],"Foundation self-check",["Stance and guard rebuilt three times with easy breathing","Foot order named and shown in all four directions","Stops in balance after every step pair","One improvement and the support you actually used, described honestly"]),
 info(2,"Hands","Hands",6,"Controlled straight strikes in the air from stance, returning to guard every time, on both leads.","Easy · 3 out of 10 · talk easily",["Build","Calm","Build","Build","Peak","Trial"],"Clean 1-2 with guard return, both leads",["Guard returns to the same place after every strike","Elbows never snap straight","Feet stay apart, no lean past the front knee","The same on both leads"]),
 info(3,"Guard","Guard and defense",6,"Solo defensive movements that always return to stance, then compact curved strikes.","Easy · 3 out of 10 · talk easily",["Build","Peak","Calm","Peak","Build","Trial"],"Defense into counter at slow tempo",["Slips return to centre over the stance","Rolls bend the knees with a long back","Curved strikes stay compact with the guard returning","A defense-counter pair flows at slow tempo without crossing feet"]),
 info(4,"Kicks","Kicks and balance",6,"Low, controlled kicks with a stable chamber and return, both sides, support always available.","Easy · 3 out of 10 · talk easily",["Build","Calm","Build","Peak","Peak","Trial"],"Low controlled kicks with chamber and return, both sides",["Chamber held for two counts (support allowed) with a soft standing knee","Every kick returns to chamber, then stance, without hopping","No kick above hip height","Both sides"]),
 info(5,"Combinations","Combinations and rounds",8,"Hands, defense, kicks and footwork linked into combinations; the first timed shadow rounds.","Easy to moderate · 3–4 out of 10 · short sentences",["Calm","Build","Build","Peak","Peak","Peak","Build","Trial"],"Three structured rounds plus the set sequence",["Guard home between combinations","Balance after every kick","Breathing steady","Feet never cross"]),
 info(6,"Anywhere","Practice anywhere + Form One",6,"Train in small, quiet or unfamiliar spaces, build basic bodyweight strength and learn Form One.","Easy to moderate · 3–4 out of 10 · short sentences",["Calm","Build","Peak","Peak","Calm","Trial"],"Form One from memory plus a small-space session",["Form One from memory at slow and count tempo","Stance rebuilt between sections","Balance through the kick","The strength block completed with consistent form"]),
 info(7,"Form","The Lantern Form + timing",8,"A longer four-section solo form and sharper timing through audio cues.","Easy to moderate · 3–4 out of 10 · short sentences",["Build","Calm","Build","Build","Build","Peak","Build","Trial"],"The full form at two tempos plus a cue-reaction set",["Sections connect without pausing to remember","Stance rebuilt at section ends","Turns without crossing feet","Elbows compact"]),
 info(8,"Endurance","Endurance and composure",6,"Clean technique over longer work periods; calm breathing when tired.","Moderate · 4–5 out of 10 · short sentences, never gasping",["Build","Peak","Peak","Peak","Peak","Recovery + Trial"],"A steady composure session with form intact",["Rounds completed with form intact","Breath settles within each rest","Effort never past 'short sentences'","You slowed down when form slipped"]),
 info(9,"Steady Count","Integration: steady count",8,"Every family together in long, steady, rhythmic practice; stance and form held with calm breathing.","Moderate · 4–5 out of 10 · short sentences, never gasping",["Build","Build","Build","Build","Peak","Taper","Peak","Recovery + Trial"],"A long steady-count session, the full form and two rounds",["The count held without losing rhythm (rests allowed)","The form from memory when mildly tired","Steady breathing","Self-chosen rounds stay controlled"]),
 info(10,"Lifelong","Practice for life",6,"Consolidate, build your own sessions and leave with a plan you can keep.","Your choice, up to 4–5 out of 10",["Recovery","Calm","Build","Calm","Calm","Trial"],"Your own designed session plus the full form",["Your session follows the guardrails: preparation, 4–6 blocks, cool-down, 30–40 minutes","Each block was chosen for a reason","The full form from memory","A reflection written or skipped by choice; both count equally"]),
];
export const CHAPTERS:readonly ChapterInfo[] = RAW.reduce<ChapterInfo[]>((list,c)=>[...list,{...c,firstWeek:list.reduce((n,x)=>n+x.weeks,0)+1}],[]);
export const PROGRAMME_WEEKS = CHAPTERS.reduce((n,c)=>n+c.weeks,0);

// Minutes Monday–Sunday (Wednesday is rest) for each week feel. Every day includes a 5-minute
// preparation and a 5-minute cool-down, leaving headroom under the 45-minute ceiling.
export const FEEL_MINUTES:Record<Feel,readonly number[]> = {
 Calm:[30,30,0,35,30,35,30],Taper:[30,30,0,35,30,35,30],Build:[35,30,0,35,35,35,30],Peak:[35,30,0,40,35,40,30],
 Trial:[30,30,0,30,30,40,30],"Recovery + Trial":[30,30,0,30,30,40,30],Recovery:[30,30,0,30,30,30,30],
};
// The first programme week each block format may appear in (architecture table "From").
export const FORMAT_FROM:Record<BlockFormat,number> = {A:1,S:9,B:12,H:21,C:32,E:35,F:43,D:49,G:55};

const SPECS:readonly ChapterSpec[] = [CHAPTER_2,CHAPTER_3,CHAPTER_4,CHAPTER_5,CHAPTER_6,CHAPTER_7,CHAPTER_8,CHAPTER_9,CHAPTER_10];
export const CURRICULUM_DRILLS:Record<string,Drill> = Object.assign({},...SPECS.map(s=>s.drills));
const ALL:Record<string,Drill> = {...FOUNDATION_DRILLS,...CURRICULUM_DRILLS};

const DAY_LABELS = ["New skill","Easy review","Rest","Long","Skill + conditioning","Test-style","Easy flow"];
const DEFAULT_REASONS = [
 "New skill day. Learn it slowly; quality before repetitions, and the supported or seated version is always fine.",
 "Easy review: familiar drills at low effort. Choose the supported or seated version freely; there is nothing to make up.",
 "",
 "Long day: the week's main volume at an easy, talkable effort. Rest inside any interval you need.",
 "Skill blocks first, then one conditioning block. Stop each exercise two or three repetitions before it gets hard.",
 "Test-style day: rounds, sequences or a self-check. Record what you see honestly.",
 "Easy flow: gentle review and mobility. Finish feeling better than you started.",
];
const REST:PracticeDay = {load:"Full rest",title:"Rest is your mission",focus:"Full rest",minutes:0,reason:"Wednesday has no practice or required check-in. Missed days never need making up.",blocks:[]};

function buildWeek(spec:ChapterSpec,week:WeekSpec,feel:Feel):PracticeDay[]{
 const trial=feel==="Trial"||feel==="Recovery + Trial";
 const days=week.days.map(([title,focus,ids,reason],i)=>{
  const index=i<2?i:i+1;
  const blocks:PracticeDay["blocks"] = [[spec.warm,5],...ids.map(id=>{const d=ALL[id];if(!d)throw new Error(`Unknown drill ${id}`);return [id,blockMinutes(d)] as const;}),[spec.cool,5]];
  const load=trial?(index===5?"Chapter trial":index===6?"Easy flow":"Light review"):feel==="Recovery"?"Recovery":DAY_LABELS[index];
  const fallback=trial&&index<5?"Trial week: lighter review before Saturday. Keep it crisp and easy; no extra rounds.":trial&&index===6?"The trial is done. Easy flow and mobility only.":feel==="Recovery"?"Recovery week: everything light and familiar. Rest is part of the plan.":DEFAULT_REASONS[index];
  return {load,title,focus,reason:reason??fallback,blocks,minutes:blocks.reduce((n,[,m])=>n+m,0)} satisfies PracticeDay;
 });
 return [days[0],days[1],REST,days[2],days[3],days[4],days[5]];
}

export type ProgrammeWeek = {week:number;chapter:number;weekInChapter:number;feel:Feel;name:string;focus:string;goals:readonly string[];days:readonly PracticeDay[]};
const LATER:ProgrammeWeek[] = SPECS.flatMap(spec=>{
 const c=CHAPTERS[spec.chapter-1];
 if(spec.weeks.length!==c.weeks)throw new Error(`Chapter ${spec.chapter} needs ${c.weeks} weeks`);
 return spec.weeks.map((w,i)=>({week:c.firstWeek+i,chapter:c.chapter,weekInChapter:i+1,feel:c.feels[i],name:w.name,focus:w.focus,goals:w.goals,days:buildWeek(spec,w,c.feels[i])}));
});

export function chapterForWeek(week:number):ChapterInfo{
 const w=Math.max(1,Math.floor(week));
 return CHAPTERS.find(c=>w>=c.firstWeek&&w<c.firstWeek+c.weeks)??CHAPTERS[CHAPTERS.length-1];
}
export function weekInChapter(week:number){return Math.max(1,Math.floor(week))-chapterForWeek(week).firstWeek+1;}
export function playableWeeks(){return CHAPTERS.slice(0,STORY_READY_CHAPTERS).reduce((n,c)=>n+c.weeks,0);}

// After Chapter 10: a seven-week rotation drawn from every chapter, the seventh week lighter.
export const CONTINUING_ROTATION = [13,18,25,33,47,58,63] as const;
export function continuingSource(week:number){return CONTINUING_ROTATION[(Math.floor(week)-PROGRAMME_WEEKS-1)%CONTINUING_ROTATION.length];}

export function programmeWeek(week:number):ProgrammeWeek|undefined{
 const w=Math.max(1,Math.floor(week));
 if(w>PROGRAMME_WEEKS){const source=programmeWeek(continuingSource(w));return source&&{...source,week:w,name:`Continuing practice · ${source.name}`};}
 return LATER.find(x=>x.week===w);
}
export function programmeSchedule(week:number):readonly PracticeDay[]{
 const w=Math.max(1,Math.floor(week));
 if(w<=8)return FOUNDATION_SCHEDULES[w-1];
 return programmeWeek(w)!.days;
}

// Techniques introduced up to and including this week, grouped by the chapter that introduced them.
export function programmeLibrary(week:number){
 const groups=new Map<number,Record<string,Drill>>();const seen=new Set<string>();
 for(let w=1;w<=Math.min(Math.max(1,Math.floor(week)),PROGRAMME_WEEKS);w++){
  const chapter=chapterForWeek(w).chapter;
  for(const day of programmeSchedule(w))for(const [id] of day.blocks){
   if(seen.has(id))continue;seen.add(id);
   const home=id.startsWith("f2-")?1:chapter;
   groups.set(home,{...groups.get(home),[id]:ALL[id]});
  }
 }
 return [...groups.entries()].sort(([a],[b])=>b-a).map(([chapter,drills])=>({chapter:CHAPTERS[chapter-1],drills}));
}
