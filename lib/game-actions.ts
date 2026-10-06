import {GameError} from "./game-error";
import {PROJECTS,JOBS,award,claimable,completeScene,earnedEpisodes,sceneAvailable,companionAvailable,freshGame,type GameState} from "./game";
import {SCENE_BY_ID,visibleLines,pilotLines,PILOT_REVISION} from "./story";
import {DOJO_MEMBERS,type DojoMemberId} from "./dojo-members";
export function gameAction(g:GameState,b:Record<string,unknown>,now:number){
 const action=b.action;
 if(action==="reset-pilot"||action==="reset-progress"){
  if(typeof b.token!=="string"||!/^[-a-zA-Z0-9]{16,80}$/.test(b.token))throw new GameError("Invalid reset request.");
  if(action==="reset-progress"&&(b.confirmation!=="RESTART"||typeof b.previousResetToken!=="string"))throw new GameError("Confirm the restart before deleting progress.");
  if(g.resetToken===b.token)return;
  if(action==="reset-progress"&&b.previousResetToken!==(g.resetToken??""))throw new GameError("Another restart changed your progress. Close this confirmation and open it again.",409);
  if(action==="reset-pilot"&&g.storyRevision===PILOT_REVISION)throw new GameError("Your first-month story has already begun.");
  const fresh=freshGame(now);for(const key of Object.keys(g))delete (g as unknown as Record<string,unknown>)[key];Object.assign(g,fresh,{resetToken:b.token});return {reset:true};
 }
 if(action==="scene"){
  const s=SCENE_BY_ID[String(b.id)];if(!s||!sceneAvailable(g,s))throw new GameError("That scene is not available yet.");
  const save=g.scenes[s.id]??{position:0,done:false,flags:{...g.flags}};g.scenes[s.id]=save;if(save.done)return;
  if(s.revision){
   save.revision=s.revision;save.choices??={};const passages=pilotLines(s,save.flags??g.flags,save.choices);
   const index=save.passageId?passages.findIndex(l=>l.id===save.passageId):0;if(index<0)throw new GameError("Your reading place could not be found.",409);
   const line=passages[index];save.passageId=line.id;save.position=index;
   if(b.passageId!==line.id)return;
   if(b.operation==="choose"){
    if(!line.decision||b.decision!==line.decision.flag)throw new GameError("This passage has no matching choice.");
    if(save.choices[line.decision.flag])return;
    const option=line.decision.options.find(o=>o.id===b.option);if(!option)throw new GameError("Choose a valid response.");
    save.choices[line.decision.flag]=option.id;g.flags[line.decision.flag]=option.id;
    if(option.reply.length){save.passageId=`${line.id}-reply-${option.id}-0`;save.position=index+1;}return;
   }
   if(b.operation!=="advance")throw new GameError("Unknown scene action.");
   if(line.decision&&!save.choices[line.decision.flag])throw new GameError("Choose a response before continuing.");
   if(line.introduces)g.flags[`introduced:${line.introduces}`]="yes";
   if(index<passages.length-1){save.passageId=passages[index+1].id;save.position=index+1;return;}
   save.done=true;if(s.kind!=="opening")completeScene(g,s);return;
  }
  const count=visibleLines(s,save.flags??g.flags).length;
  if(b.operation==="advance"){
   if(b.position!==save.position)return;
   if(save.position<count-1){save.position++;return;}
   if(s.choice&&!save.choice)throw new GameError("Choose a response before finishing this scene.");
   const response=s.choice?.options.find(o=>o.id===save.choice)?.reply??[];
   if(save.position<count+response.length-1){save.position++;return;}
   save.done=true;completeScene(g,s);return;
  }
  if(b.operation==="choose"){
   if(!s.choice||save.position<count-1)throw new GameError("Read the scene before choosing.");
   if(save.choice)return;
   const option=s.choice.options.find(o=>o.id===b.option);if(!option)throw new GameError("Choose a valid response.");
   if(s.kind==="relationship"&&option.id==="romance"){
    if(g.flags.romance!=="none"&&g.flags.romance!==s.member)throw new GameError("You've chosen another date. This invitation can continue as friendship.");
    g.flags.romance=s.member!;g.flags["npc-akari-ren"]=["akari","ren"].includes(s.member!)?"no":"yes";g.flags["npc-daichi-mika"]=s.member==="daichi"?"no":"yes";
   }
   save.choice=option.id;g.flags[s.choice.flag]=option.id;save.position=count;return;
  }
  throw new GameError("Unknown scene action.");
 }
 if(action==="upgrade"){
  const project=PROJECTS.find(p=>p.id===b.id);if(!project)throw new GameError("Unknown project.");if(g.facilities.includes(project.id))return;
  if(earnedEpisodes(g)<project.episode)throw new GameError("Finish the required episode before starting this project.");if(g.supplies<project.cost)throw new GameError("Save more supplies for this project.");
  g.supplies-=project.cost;g.facilities.push(project.id);return;
 }
 if(action==="assign"){
  if(earnedEpisodes(g)<1)throw new GameError("The first project jobs open after Episode 1.");
  if(!DOJO_MEMBERS.some(m=>m.id===b.member)||![12,24].includes(Number(b.hours)))throw new GameError("Choose a companion and a 12- or 24-hour job.");
  if(!companionAvailable(g,String(b.member)))throw new GameError("Meet this companion in the story first.");
  const job=JOBS.find(j=>j.id===(b.job??"stock"));if(!job||(job.requires&&!g.facilities.includes(job.requires)))throw new GameError("Restore the required place before choosing that job.");
  if(g.assignments.some(a=>a.member===b.member))throw new GameError("That companion already has a job.");
  const slots=earnedEpisodes(g)>=3?2:1;if(g.assignments.length>=slots)throw new GameError("Your assignment slots are full.");
  g.assignments.push({id:crypto.randomUUID(),member:b.member as DojoMemberId,job:job.id,hours:Number(b.hours) as 12|24,started:now,claimed:0});return;
 }
 if(action==="claim"||action==="release"){
  const a=g.assignments.find(a=>a.id===b.id);if(!a)return;
  const amount=claimable(a,now);if(amount>0){const cycle=a.hours*3600000;const total=Math.floor(Math.max(0,now-a.started)/cycle);award(g,`job:${a.id}:${total}`,()=>{g.supplies+=amount;});a.claimed=total;}
  if(action==="release")g.assignments=g.assignments.filter(x=>x.id!==a.id);return;
 }
 throw new GameError("Unknown dojo action.");
}
