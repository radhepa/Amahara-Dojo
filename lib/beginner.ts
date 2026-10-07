import type {RecordEntry} from "./training";
import {CHAPTERS,PROGRAMME_WEEKS,STORY_READY_CHAPTERS,chapterForWeek,playableWeeks,programmeWeek} from "./curriculum";
// Self-reports describe the preparation actually used, not graded technique.
export const WEEKS=[
 {name:"Find your martial arts base",focus:"Learn stance, guard, balance, and the order of small steps. All practices are 30 minutes including rests.",goals:["I can rebuild my stance and reset my guard 3 times with easy breathing, or explain my supported/seated preparation.","I can name which foot moves first forward, backward, left, and right, and rehearse it at my own level.","I used 30-second practice/rest rounds without forcing repetitions, and chose rest when movement hurt."]},
 {name:"Stop in a steady base",focus:"Keep the same spacing and pause in balance after each movement. Repeat week one whenever useful.",goals:["I can repeat 3 small shifts and stop in the middle, using support or seated preparation as needed.","I can finish a tiny step pair and pause for two counts, or do the supported shift-and-stop version.","I can identify and correct one issue such as feet together, leaning, or tense shoulders."]},
 {name:"Move in four directions",focus:"Practise forward, backward, left, and right with the same lead and a full stop after each pair.",goals:["I can say the first foot for all four directions before moving.","I can complete one slow four-direction cycle without crossing my feet, or rehearse the order seated with taps.","I restore my starting spacing after each pair, or describe the support I still need."]},
 {name:"Keep your guard while moving",focus:"Coordinate relaxed hands with short steps. No longer holds or speed targets.",goals:["I can reset my guard 3 times without shrugging or blocking my view.","I can combine one step pair with an easy guard, or use a supported shift/seated heel tap with a guard reset.","I lower tired arms and repeat separate hand and foot practice if coordination breaks down."]},
 {name:"Control a little distance",focus:"Move out and return without leaning or stretching your stance. Use single steps until repeatable.",goals:["I can take one forward and backward pair while staying upright, or rehearse them with support/seated taps.","I can describe how footwork changes distance and how leaning differs from moving my base.","I can return to my starting space with small steps, or explain which part needs a simpler version."]},
 {name:"Change direction calmly",focus:"Connect a backward step and a side step with a full stop between them. Keep facing ahead.",goals:["I can name the first foot in a back-left-right-forward sequence and its right-side version.","I can rehearse one sequence with a pause between directions, using supported shifts or seated taps when needed.","I keep knees comfortable and return to separate directions when a corner feels rushed."]},
 {name:"Choose and connect",focus:"Choose a direction, move, and settle. Practise recall and control rather than reaction speed.",goals:["I can choose a direction and name the correct first foot before moving.","I can make 2–3 calm choices in a practice round, using standing, supported, or seated rehearsal.","I can check one form point and use it to improve the next round, with full rests between rounds."]},
 {name:"Review your foundations",focus:"Revisit stance, guard, foot order, and coordination. Identify what is repeatable and what needs more practice.",goals:["I reviewed stance, guard, and four-direction movement at my actual level, with the support I need.","I can name one improvement and one specific skill to keep repeating.","I understand that self-checks and story rewards record practice; they do not certify fighting skill."]},
];
export type WeekCheck={week:number;goals:boolean[]};
export type WeekInfo={name:string;focus:string;goals:readonly string[]};
const CONTINUING_GOALS=["I completed this week's practices at my level: standing, supported or seated.","I kept every session within 30–40 minutes and at 'short sentences' effort.","I took a lighter week or a rest whenever my body asked for one."];
export function weekInfo(week:number):WeekInfo{
 const w=Math.max(1,Math.floor(week));
 if(w<=WEEKS.length)return WEEKS[w-1];
 const later=programmeWeek(w)!;
 return w>PROGRAMME_WEEKS?{name:later.name,focus:"Continuing practice: a rotation of weeks from every chapter, with a lighter review week every seventh week.",goals:CONTINUING_GOALS}:later;
}
// Weeks advance after six completed practices, seven days and an honest check-in, and never
// past the last chapter whose story is playable. After Chapter 10, continuing practice has no end.
export function lastPlayableWeek(){return STORY_READY_CHAPTERS>=CHAPTERS.length?Infinity:playableWeeks();}
export function beginnerProgress(records:RecordEntry[],checks:WeekCheck[],today:string){
 const completed=records.filter(r=>r.kind==="training");const first=completed.map(r=>r.date).sort()[0];
 const days=first&&today?Math.max(0,Math.floor((Date.parse(today+"T12:00:00Z")-Date.parse(first+"T12:00:00Z"))/86400000)):0;
 const last=lastPlayableWeek();let week=1;
 while(week<last&&completed.length>=week*6&&days>=week*7&&checks.some(c=>c.week===week&&c.goals.length===3&&c.goals.every(Boolean)))week++;
 const complete=Number.isFinite(last)?week===last&&completed.length>=last*6&&days>=last*7&&checks.some(c=>c.week===last&&c.goals.every(Boolean)):week>PROGRAMME_WEEKS;
 const chapter=chapterForWeek(Math.min(week,PROGRAMME_WEEKS));
 return {week,days,sessions:completed.length,complete,chapter:chapter.chapter,weekInChapter:week>PROGRAMME_WEEKS?week-PROGRAMME_WEEKS:week-chapter.firstWeek+1,chapterWeeks:chapter.weeks,continuing:week>PROGRAMME_WEEKS};
}
