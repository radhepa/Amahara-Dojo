import {GameError} from "./game-error";
import {REFLECTIONS,award,type GameState,type SavedSession} from "./game";
import {dateKey,dayIndex,makePlan,type RecordEntry} from "./training";
import {DOJO_MEMBERS,type DojoMemberId} from "./dojo-members";
export function activeSession(g:GameState){return Object.values(g.sessions).find(s=>s.status==="active"||s.status==="summary");}
export function sessionRemaining(s:SavedSession,now:number){const max=s.plan[s.index]?.seconds??0;return Math.max(0,max-s.elapsed-(s.runningSince===null?0:Math.floor(Math.max(0,now-s.runningSince)/1000)));}
function settle(s:SavedSession,now:number){const max=s.plan[s.index]?.seconds??0;s.elapsed=max-sessionRemaining(s,now);s.runningSince=null;}
export function sessionAction(g:GameState,b:Record<string,unknown>,now:number,week:number,completedDates:Set<string>){
 if(b.action==="start"){
  const active=activeSession(g);if(active)return {result:{sessionId:active.id}};
  const date=dateKey(new Date(now)),day=dayIndex(new Date(now));if(day===2||b.readiness==="pain")throw new GameError("Today calls for rest. No practice is assigned.");
  if(completedDates.has(date)||g.rewards[`practice:${date}`])throw new GameError("Today's completed practice is already recorded.");
  if(!["ready","tired"].includes(String(b.readiness))||!DOJO_MEMBERS.some(m=>m.id===b.companion))throw new GameError("Choose a valid practice and companion.");
  const plan=makePlan(day,String(b.readiness),week);const id=crypto.randomUUID();g.sessions[id]={id,date,day,readiness:String(b.readiness),companion:b.companion as DojoMemberId,week,plan:plan.blocks,index:0,elapsed:0,runningSince:now,checks:plan.blocks.map(()=>false),skipped:false,status:"active",note:""};return {result:{sessionId:id}};
 }
 const s=g.sessions[String(b.id)];if(!s)throw new GameError("This practice could not be found. Reload your dojo.",404);
 if(s.status==="training"||s.status==="partial")return {result:{sessionId:s.id}};
 if(b.action==="pause"){settle(s,now);return;}
 if(b.action==="resume"){if(s.status!=="active")return;if(dayIndex(new Date(now))===2)throw new GameError("Wednesday is full rest. Resume this saved practice on your next training day.");if(s.runningSince===null&&sessionRemaining(s,now)>0)s.runningSince=now;return;}
 if(b.action==="next"){
  if(s.status!=="active")return;if(b.index!==s.index)return;
  if(sessionRemaining(s,now)>0||b.confirm!==true)throw new GameError("Finish the timed block, then confirm the agreed practice or rest breaks.");
  settle(s,now);s.checks[s.index]=true;if(s.index<s.plan.length-1){s.index++;s.elapsed=0;s.runningSince=dayIndex(new Date(now))===2?null:now;}else{s.status="summary";}return;
 }
 if(b.action==="stop"){if(s.status==="active"){settle(s,now);s.skipped=true;s.status="summary";}return;}
 if(b.action==="draft"){
  if(s.status!=="summary")throw new GameError("Reflection is available after your blocks end.");
  if(typeof b.note!=="string"||b.note.length>1000||(b.reflection!=null&&!REFLECTIONS.some(r=>r.id===b.reflection)))throw new GameError("Choose a valid reflection and a note within 1,000 characters.");
  s.note=b.note;s.reflection=typeof b.reflection==="string"?b.reflection:undefined;return;
 }
 if(b.action==="finalize"){
  if(s.status!=="summary")throw new GameError("Finish or stop your practice before saving.");
  if(typeof b.note!=="string"||b.note.length>1000)throw new GameError("Keep your private note within 1,000 characters.");
  if(b.reflection!==undefined&&!REFLECTIONS.some(r=>r.id===b.reflection))throw new GameError("Choose a valid reflection or skip it.");
  const full=!s.skipped&&s.checks.every(Boolean);const seconds=s.plan.reduce((total,p,i)=>total+(s.checks[i]?p.seconds:i===s.index?s.elapsed:0),0);
  s.note=b.note;s.reflection=typeof b.reflection==="string"?b.reflection:undefined;s.status=full?"training":"partial";s.runningSince=null;
  if(full)award(g,`practice:${s.date}`,()=>{g.practices++;g.supplies+=20;g.bonds[s.companion]+=10;if(s.reflection)g.bonds[s.companion]+=2;});
  const record:RecordEntry={date:s.date,day:s.day,kind:full?"training":"partial",minutes:Math.round(seconds/60*100)/100,readiness:s.readiness,note:s.note};
  return seconds>0?{record,result:{sessionId:s.id}}:{result:{sessionId:s.id}};
 }
 throw new GameError("Unknown practice action.");
}
