import {DOJO_MEMBERS,type DojoMemberId} from "./dojo-members";
import {ALL_SCENES,MAIN,PERSONAL,PROLOGUE,PILOT_MAIN,PILOT_PROLOGUE,PILOT_OPENINGS,PILOT_REVISION} from "./story";
import type {StoryScene} from "./story/types";
export type SceneSave={position:number;choice?:string;done:boolean;flags?:Record<string,string>;revision?:string;passageId?:string;choices?:Record<string,string>};
export type PracticeCompanion=DojoMemberId|"solo";
export type Assignment={id:string;member:DojoMemberId;job:string;started:number;hours:12|24;claimed:number};
export type SavedSession={id:string;date:string;day:number;readiness:string;companion:PracticeCompanion;week:number;plan:{id:string;seconds:number}[];index:number;elapsed:number;runningSince:number|null;checks:boolean[];skipped:boolean;status:"active"|"summary"|"training"|"partial";note:string;reflection?:string};
export type GameState={version:1;storyRevision?:string;resetToken?:string;practices:number;supplies:number;bonds:Record<string,number>;flags:Record<string,string>;scenes:Record<string,SceneSave>;facilities:string[];assignments:Assignment[];sessions:Record<string,SavedSession>;rewards:Record<string,true>;lastVisit:number};
export const PROJECTS=[
 {id:"floor",name:"Practice stations",cost:100,episode:1,description:"Add mats, marked stations, and equipment storage to the practice space. Opens mat-care jobs."},
 {id:"kitchen",name:"Shared kitchen",cost:180,episode:2,description:"Equip the kitchen for Ren's bread and regular community meals. Opens meal-preparation jobs."},
 {id:"reading",name:"Map archive",cost:240,episode:3,description:"Shelves, a work desk, and sleeves for Sora's records. Opens map-copying jobs."},
 {id:"courtyard",name:"Courtyard seating",cost:300,episode:5,description:"Add benches and a sheltered gathering corner beside the clear path. Opens grounds-care jobs."},
 {id:"guest",name:"Guest room",cost:400,episode:7,description:"Furnish a room for overnight visitors. Opens guest-preparation jobs."},
];
export const JOBS=[{id:"stock",name:"Sort donated supplies",requires:null},{id:"mats",name:"Care for the practice space",requires:"floor"},{id:"meals",name:"Prepare community meals",requires:"kitchen"},{id:"maps",name:"Copy records and maps",requires:"reading"},{id:"grounds",name:"Maintain the welcome route",requires:"courtyard"},{id:"guests",name:"Prepare for overnight visitors",requires:"guest"}];
export function freshGame(now:number):GameState{return {version:1,storyRevision:PILOT_REVISION,practices:0,supplies:0,bonds:Object.fromEntries(DOJO_MEMBERS.map(m=>[m.id,0])),flags:{romance:"none","npc-akari-ren":"yes","npc-daichi-mika":"yes"},scenes:{},facilities:[],assignments:[],sessions:{},rewards:{},lastVisit:now};}
export function campaignMain(g:GameState){return g.storyRevision===PILOT_REVISION?[...PILOT_MAIN,...MAIN.slice(6)]:MAIN;}
export function campaignPrologue(g:GameState){return g.storyRevision===PILOT_REVISION?PILOT_PROLOGUE:PROLOGUE;}
export function companionsUnlocked(g:GameState){return DOJO_MEMBERS.filter(m=>g.storyRevision===PILOT_REVISION?g.flags[`introduced:${m.id}`]==="yes":true);}
export function companionAvailable(g:GameState,id:string){return id==="solo"||companionsUnlocked(g).some(m=>m.id===id);}
export function requiredOpening(g:GameState){return g.storyRevision===PILOT_REVISION?PILOT_OPENINGS.find(s=>!s.optional&&g.practices>=s.beat-1&&!g.scenes[s.id]?.done):undefined;}
export function mainCompleted(g:GameState){let n=0;for(const s of campaignMain(g)){if(!g.scenes[s.id]?.done)break;n++;}return n;}
export function earnedEpisodes(g:GameState){return Math.floor(mainCompleted(g)/6);}
export function bondLabel(g:GameState,id:string){const value=g.bonds[id]??0;const personal=PERSONAL.filter(s=>s.member===id&&g.scenes[s.id]?.done).length;return value>=300&&personal>=4?"Close":value>=160&&personal>=3?"Trusted":value>=60?"Familiar":"New acquaintance";}
export function sceneAvailable(g:GameState,s:StoryScene){
 const pilot=g.storyRevision===PILOT_REVISION;
 if(s.revision&&!pilot)return false;
 if(pilot&&((s.kind==="main"&&!campaignMain(g).some(m=>m.id===s.id))||(s.kind==="prologue"&&s.id!==PILOT_PROLOGUE.id)))return false;
 if(g.scenes[s.id]?.done)return true;
 if(s.kind==="prologue")return true;
 if(!g.scenes[campaignPrologue(g).id]?.done)return false;
 if(s.kind==="opening"){const index=s.beat-1;return mainCompleted(g)===index;}
 if(s.kind==="main"){const index=campaignMain(g).findIndex(m=>m.id===s.id);const opening=pilot?PILOT_OPENINGS.find(o=>!o.optional&&o.beat===index+1):undefined;return index===mainCompleted(g)&&index<Math.min(48,g.practices)&&(!opening||!!g.scenes[opening.id]?.done);}
 if(s.member&&DOJO_MEMBERS.some(m=>m.id===s.member)&&!companionAvailable(g,s.member))return false;
 if(mainCompleted(g)<(s.practiceGate??0)||g.practices<(s.practiceGate??0)||(s.member&&(g.bonds[s.member]??0)<(s.threshold??0)))return false;
 if(s.kind==="personal"){const preceding=PERSONAL.filter(p=>p.member===s.member&&p.beat<s.beat);return preceding.every(p=>g.scenes[p.id]?.done);}
 if(s.kind==="relationship")return PERSONAL.filter(p=>p.member===s.member).every(p=>g.scenes[p.id]?.done);
 return true;
}
export function availableScenes(g:GameState){const scenes=g.storyRevision===PILOT_REVISION?[campaignPrologue(g),...campaignMain(g),...PILOT_OPENINGS,...ALL_SCENES.filter(s=>!["main","prologue"].includes(s.kind))]:ALL_SCENES;return scenes.filter(s=>sceneAvailable(g,s)&&!g.scenes[s.id]?.done);}
export function award(g:GameState,key:string,apply:()=>void){if(g.rewards[key])return false;apply();g.rewards[key]=true;return true;}
export function completeScene(g:GameState,s:StoryScene){award(g,`scene:${s.id}`,()=>{if(s.kind==="main")for(const id of Object.keys(g.bonds))g.bonds[id]+=2;if(s.kind==="personal"&&s.member)g.bonds[s.member]+=5;});}
export function claimable(a:Assignment,now:number){const cycle=a.hours*3600000;const total=Math.floor(Math.max(0,now-a.started)/cycle);const pending=Math.max(0,total-a.claimed);return Math.min(Math.floor(48/a.hours),pending)*(a.hours===12?8:16);}
export const REFLECTIONS=[{id:"comfortable",label:"Comfortable — no particular difficulty"},{id:"balance",label:"Balance needed attention"},{id:"patience",label:"I wanted to rush"},{id:"energy",label:"I needed the gentler option"},{id:"private",label:"Keep my reflection private"}];
export const REACTIONS:Record<string,Record<string,string>>={
 akari:{comfortable:"Then keep the parts that worked. Practice doesn't need a crisis to be worth recording.",balance:"Make the range smaller and keep support nearby. We can return to the same question without forcing an answer.",patience:"Noticing the rush gives you a place to pause. One calm reset is useful.",energy:"The gentle plan was the right available plan. Give yourself time to recover before the next session.",private:"Your note can stay yours. I'll be here for the next ordinary practice."},
 ren:{comfortable:"An ordinary good session. I'll resist adding fireworks to it.",balance:"Settling before the next move is work too. Keep it small enough to repeat comfortably.",patience:"I recognize the temptation. We can leave the exciting version for a day when it's actually the right task.",energy:"You kept the gentle promise. There isn't a secret harder version you were supposed to do.",private:"Understood. You don't owe me the story behind showing up."},
 sora:{comfortable:"A clear observation. Nothing difficult happened, and the practice still happened.",balance:"Notice the point before balance changes. Support and a smaller movement can make that point easier to find.",patience:"You identified something specific. That is more useful than deciding the whole session was impatient.",energy:"The adjustment belongs in the plan, not in a list of failures.",private:"Private is a complete answer. I won't infer anything from it."},
 daichi:{comfortable:"Good. You can let an easy session remain an easy session.",balance:"The chair has time to help. Use it and give each reset room.",patience:"The kettle takes the time it takes too. We can stop asking one minute to contain three.",energy:"Then let the gentler work be enough today. There is no extra practice to make up.",private:"Of course. We can share tea without sharing every thought."},
 yuzu:{comfortable:"Excellent. A day without a dramatic obstacle is allowed into the story.",balance:"Small route, clear landing. You don't need a spectacular step to learn where it ends.",patience:"The fast version will remain available to imagine. The careful version is today's job.",energy:"A smaller movement still has a shape worth noticing. Let the rest breaks do their work.",private:"Secret notebook privileges respected. No detective performance from me."},
};
export const PARTIAL_REMARKS:Record<string,string>={akari:"You stopped where you needed to. The next full practice can open the next scene; no one here loses trust today.",ren:"Some practice happened. Let it be that size. There's no extra workout to pay for the rest of the story.",sora:"A partial record can be accurate without being a judgment. The unanswered scene can wait.",daichi:"The door will still be here. Recover, and return when the next practice fits.",yuzu:"An unfinished route is still something you tried. No dramatic catch-up montage required."};
