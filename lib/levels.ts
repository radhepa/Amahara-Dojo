import {CHAPTERS,PROGRAMME_WEEKS,STORY_READY_CHAPTERS,chapterForWeek} from "./curriculum";

// Solo milestones replace the old instructor-led Levels 2–10. Each is earned by completing a
// chapter's practices and its trial-week self-check. They record practice, never rank.
export const MILESTONE_NOTE = "This records your practice and self-review. It is not a rank or a measure of fighting ability.";
export type Milestone = {number:number;name:string;phase:string;weeks:number;firstWeek:number;lastWeek:number;practices:number;totalPractices:number;focus:string;trial:string;checks:readonly string[];playable:boolean};
export const MILESTONES:readonly Milestone[] = CHAPTERS.map(c=>({
 number:c.chapter,name:c.milestone,phase:c.phase,weeks:c.weeks,firstWeek:c.firstWeek,lastWeek:c.firstWeek+c.weeks-1,
 practices:c.weeks*6,totalPractices:(c.firstWeek+c.weeks-1)*6,focus:c.goal,trial:c.trial.title,checks:c.trial.checks,playable:c.chapter<=STORY_READY_CHAPTERS,
}));

export function earnedMilestones(progress:{week:number;complete:boolean}){
 return MILESTONES.filter(m=>progress.week>m.lastWeek||(progress.complete&&progress.week===m.lastWeek)).map(m=>m.number);
}
export function stageLabel(week:number){
 if(week>PROGRAMME_WEEKS)return "Continuing practice";
 const c=chapterForWeek(week);return `Chapter ${c.chapter} · ${c.milestone}`;
}
