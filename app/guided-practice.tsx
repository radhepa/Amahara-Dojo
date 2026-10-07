"use client";
import {useEffect,useRef,useState} from "react";
import {Play,Pause,Leaf,Clock3,ShieldCheck,ChevronRight} from "lucide-react";
import {Dialog,DialogContent,DialogTitle,DialogDescription} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {DRILLS,DAYS,makePlan,dayIndex} from "@/lib/training";
import {DOJO_MEMBERS} from "@/lib/dojo-members";
import {REFLECTIONS,REACTIONS,PARTIAL_REMARKS,availableScenes,type PracticeCompanion} from "@/lib/game";
import {activeSession,sessionRemaining,sessionLimitRemaining} from "@/lib/session-actions";
import type {DojoGameApi} from "./use-dojo-game";
import {characterPortrait} from "@/lib/story/cast";
import {DrillInstructions} from "./drill-instructions";
import {usePracticeBell,useCountOffset,countFor} from "./use-practice-bell";
import {PracticeBellControls} from "./practice-bell-controls";
import {PhaseRing,BlockTrack,clock} from "./practice-focus";
import {inkStyle} from "./dojo-hud";
const reflectionPose:Record<string,string>={comfortable:"amused",balance:"concerned",patience:"determined",energy:"soft",private:"soft"};
const time=(s:number)=>`${Math.floor(s/60).toString().padStart(2,"0")}:${Math.floor(s%60).toString().padStart(2,"0")}`;
export function GuidedPractice({open,onClose,api,companion,readiness,week,onSaved,onEpisode}:{open:boolean;onClose:()=>void;api:DojoGameApi;companion:PracticeCompanion;readiness:string;week:number;onSaved:()=>void;onEpisode:(id:string)=>void}){
 const [ready,setReady]=useState(false),[confirmed,setConfirmed]=useState(false),[note,setNote]=useState(""),[reflection,setReflection]=useState<string|undefined>(),[outcome,setOutcome]=useState<{member:string;full:boolean;reflection?:string}|null>(null),[,tick]=useState(0);
 const s=api.game?activeSession(api.game):undefined;const day=dayIndex(),plan=makePlan(day,readiness,week);const host=DOJO_MEMBERS.find(m=>m.id===(s?.companion??companion));
 const episode=api.game?availableScenes(api.game).find(scene=>scene.kind==="main"):undefined;
 useEffect(()=>{if(!open)return;setReady(false);setConfirmed(false);setOutcome(null);setNote(s?.note??"");setReflection(s?.reflection);},[open]);
 useEffect(()=>{setConfirmed(false);},[s?.id,s?.index]);
 useEffect(()=>{if(!s||s.status!=="active")return;const interval=setInterval(()=>tick(n=>n+1),250);return()=>clearInterval(interval);},[s?.id,s?.status]);
 const remaining=s?sessionRemaining(s,api.now()):0;const block=s?.plan[s.index];const drill=block?DRILLS[block.id]:null;const full=s?!s.skipped&&s.checks.every(Boolean):false;const total=s?s.plan.reduce((n,p,i)=>n+(s.checks[i]?p.seconds:i===s.index?s.elapsed:0),0):0;
 const limitRemaining=s?.status==="active"?sessionLimitRemaining(s,api.now()):null;
 const limitStop=useRef<string|null>(null);
 useEffect(()=>{if(limitRemaining===0&&s?.status==="active"&&limitStop.current!==s.id){limitStop.current=s.id;void api.act({action:"stop",id:s.id},"/api/sessions");}},[limitRemaining,s?.id,s?.status,api.act]);
 const tempo=useCountOffset(),bpm=countFor(drill??undefined,tempo.offset),seed=s?`${s.id}:${s.index}`:"";
 const exact=s&&block?Math.min(block.seconds,s.elapsed+(s.runningSince===null?0:Math.max(0,(api.now()-s.runningSince)/1000))):0;
 const bell=usePracticeBell({blockKey:s?`${s.id}:${s.index}:${s.runningSince}`:"",drill:drill??undefined,seconds:block?.seconds??0,elapsed:exact,seed,bpm,running:s?.status==="active"&&s.runningSince!==null&&remaining>0&&limitRemaining!==0,limitRemaining:s?.status==="active"&&s.deadline!==undefined?Math.max(0,(s.deadline-api.now())/1000):null});
 function draft(value:string|undefined){setReflection(value);if(s)void api.act({action:"draft",id:s.id,note,reflection:value??null},"/api/sessions");}
 async function finish(){if(!s)return;const ok=await api.act({action:"finalize",id:s.id,note,...(reflection?{reflection}:{})},"/api/sessions");if(ok){setOutcome({member:s.companion,full,reflection});onSaved();}}
 const focus=!outcome&&s?.status==="active"&&!!drill&&!!block;
 const paused=s?.runningSince===null;
 return <Dialog open={open} onOpenChange={v=>{if(!v)onClose();}}><DialogContent className={`dojo-dialog durable-practice ${focus?"is-focus":""}`} onInteractOutside={e=>e.preventDefault()}>
 {focus&&s&&drill&&block?<div className="focus">
  <div className="focus-bar"><BlockTrack plan={s.plan} index={s.index} elapsed={block.seconds-remaining}/>{limitRemaining!==null&&<span className="focus-limit" role="status">{limitRemaining===0?"Workout limit reached":`${clock(limitRemaining)} left of the 45-min limit`}</span>}</div>
  {day===2&&<div className="tip"><Leaf/><p>Wednesday is full rest. You can save the partial session here, or leave it for your next training day. No new movement is assigned today.</p></div>}
  {api.error&&<div className="game-error" role="alert">{api.error} Retry the action when you’re ready.</div>}
  <div className="focus-stage">
   <section className="focus-timer" aria-label="Timer">
    <div role="timer" aria-label={`${Math.floor(remaining/60)} minutes ${remaining%60} seconds remaining in this block`}><PhaseRing drill={drill} seconds={block.seconds} elapsed={block.seconds-remaining} exact={exact} seed={seed} bpm={bpm} running={!paused&&remaining>0} limitReached={limitRemaining===0}/></div>
    {remaining===0&&<label className="checkbox-line focus-confirm"><Checkbox checked={confirmed} onCheckedChange={v=>setConfirmed(v===true)}/>I completed this gentle block, including its rest breaks, using the easier option when needed.</label>}
    <div className="focus-controls">
     <button className="text-button" disabled={api.saving} onClick={()=>void api.act({action:"stop",id:s.id},"/api/sessions")}>Stop &amp; save partial</button>
     <button className="round-button" aria-label={paused?"Resume":"Pause"} disabled={limitRemaining===0||remaining===0||api.saving||(day===2&&paused)} onClick={()=>{if(paused)void bell.arm();void api.act({action:paused?"resume":"pause",id:s.id},"/api/sessions");}}>{paused?<Play/>:<Pause/>}</button>
     <button className="primary" disabled={limitRemaining===0||!confirmed||remaining>0||api.saving} onClick={()=>void api.act({action:"next",id:s.id,index:s.index,confirm:true},"/api/sessions")}>{s.index===s.plan.length-1?"Finish blocks":"Next block"}<ChevronRight/></button>
    </div>
    <PracticeBellControls bell={bell} count={drill.tempo?{bpm,tempo}:undefined} cued={!!drill.cues?.length}/>
    {host&&<div className="focus-companion" style={inkStyle(host.id)}><img src={host.portrait} alt=""/><p><strong>{host.name}</strong> · {host.practiceCue}</p></div>}
    <p className="small-note">Closing this window keeps your timer and place. Pause stops timing and bells.</p>
   </section>
   <section className="focus-drill">
    <span className="eyebrow">BLOCK {s.index+1} OF {s.plan.length} · {drill.category.toUpperCase()}</span>
    <DialogTitle>{drill.name}</DialogTitle>
    <DialogDescription className="sr-only">{DAYS[s.day]} · {s.date} · {host?.name??"Solo practice"} · Saved session</DialogDescription>
    <DrillInstructions key={`${s.index}:${block.id}`} id={block.id} seconds={block.seconds} elapsed={block.seconds-remaining} gentle={s.readiness==="tired"} rhythm={false}/>
   </section>
  </div>
 </div>:<>
 <DialogTitle>{outcome?"Practice saved":s?.status==="summary"?"A moment before you leave":"Your agreed practice"}</DialogTitle><DialogDescription>{outcome?"Your journal and dojo rewards are saved.":s?`${DAYS[s.day]} · ${s.date} · ${host?.name??"Solo practice"} · Saved session`:`${DAYS[day]} · ${plan.minutes} minutes · ${host?.name??"Solo practice"}`}</DialogDescription>
 {day===2&&s?.status==="active"&&<div className="tip"><Leaf/><p>Wednesday is full rest. You can save the partial session here, or leave it for your next training day. No new movement is assigned today.</p></div>}
 {api.error&&<div className="game-error" role="alert">{api.error} Retry the action when you’re ready.</div>}
 {outcome?<><div className="practice-companion" style={inkStyle(outcome.member)}>{outcome.member!=="solo"&&<img src={characterPortrait(outcome.member,outcome.full?(reflectionPose[outcome.reflection??"comfortable"]??"amused"):"soft")} alt=""/>}<div><strong>{DOJO_MEMBERS.find(m=>m.id===outcome.member)?.name??"Solo practice"}</strong><p>{outcome.member==="solo"?(outcome.full?"Your practice is saved. An episode is waiting whenever you want to read it.":"Your partial practice is saved. Return when you are ready."):outcome.full?(outcome.reflection?REACTIONS[outcome.member][outcome.reflection]:"Your full practice is recorded. The next story can wait until you want to read it."):PARTIAL_REMARKS[outcome.member]}</p></div></div><p className="reward-line">{outcome.full?"20 supplies"+(outcome.member!=="solo"?" · 10 companion bond":"")+(outcome.reflection&&outcome.member!=="solo"?" · 2 reflection bond":"")+" · One episode unlocked":"Partial practice kept in your journal. No story, supply, or bond penalty."}</p><div className="dialog-actions">{outcome.full&&episode&&<button className="primary" onClick={()=>onEpisode(episode.id)}>Start today’s episode{episode.readingMinutes?` · ${episode.readingMinutes} min`:""}</button>}<button className="secondary" onClick={onClose}>Return to the hall</button></div></>
 :!s?<><div className="setup-facts"><span><Clock3/>{plan.minutes} min</span><span><Leaf/>Easy effort</span><span><ShieldCheck/>Support welcome</span></div><p>Clear a non-slip space, set out a stable chair, and keep water nearby. New plans take 30–40 minutes and include preparation, rest rounds, and cool-down. Keep the whole workout within 45 minutes, including extra pauses: the timer ends the workout at that limit, ready to save any partial practice. Story reading is separate; take it up later.</p><p className="small-note">The app records time and your confirmation. It cannot see repetitions or assess technique.</p><PracticeBellControls bell={bell}/><label className="checkbox-line"><Checkbox checked={ready} onCheckedChange={v=>setReady(v===true)}/>I feel ready for comfortable movement and will stop if it hurts.</label><div className="dialog-actions"><button className="primary" disabled={!ready||api.saving||!api.game||plan.minutes===0} onClick={()=>{void bell.arm();void api.act({action:"start",readiness,companion},"/api/sessions");}}><Play/>Start {readiness==="tired"?"gentle recovery":"guided practice"}</button></div></>
 :s.status==="summary"?<><div className="summary-score"><Leaf/><strong>{time(total)}</strong><span>{full?"Every agreed block complete.":"Stopped here. Your effort remains part of the journal."}</span></div>{s.deadline!==undefined&&api.now()>=s.deadline&&!full&&<p role="status">The 45-minute workout limit has been reached. Finish here; there is no need to make up unfinished blocks.</p>}<fieldset className="reflection-options"><legend>How did it feel? <span>Optional · all answers count equally</span></legend>{REFLECTIONS.map(r=><label key={r.id}><input type="radio" name="reflection" checked={reflection===r.id} onChange={()=>draft(r.id)}/>{r.label}</label>)}<button className="text-button" onClick={()=>draft(undefined)}>Skip reflection</button></fieldset><label className="note-label" htmlFor="durable-note">A private note <span>Optional</span></label><textarea id="durable-note" value={note} maxLength={1000} onChange={e=>setNote(e.target.value)} onBlur={()=>void api.act({action:"draft",id:s.id,note,reflection:reflection??null},"/api/sessions")} placeholder="This note stays in your journal. Characters don't analyze it."/><div className="dialog-actions"><button className="primary" disabled={api.saving} onClick={()=>void finish()}>{api.saving?"Saving…":"Save practice & return"}</button></div></>:null}
 </>}
 </DialogContent></Dialog>;
}
