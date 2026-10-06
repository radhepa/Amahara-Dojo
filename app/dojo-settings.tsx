"use client";
import {useRef,useState} from "react";
import {BookOpen,Clock3,Flame,Hammer,Package,RotateCcw,TriangleAlert,Users} from "lucide-react";
import {Dialog,DialogContent,DialogDescription,DialogTitle} from "@/components/ui/dialog";
import {completedReplays,progressStats} from "@/lib/settings";
import type {RecordEntry} from "@/lib/training";
import type {StoryScene} from "@/lib/story/types";
import type {DojoGameApi} from "./use-dojo-game";

export default function DojoSettings({api,records,loaded,progressSaving,onReplay,onRestart}:{api:DojoGameApi;records:RecordEntry[];loaded:boolean;progressSaving:boolean;onReplay:(id:string)=>void;onRestart:()=>void}){
 const [confirmOpen,setConfirmOpen]=useState(false),[confirmation,setConfirmation]=useState(""),[restarting,setRestarting]=useState(false),[resetError,setResetError]=useState("");
 const request=useRef<{token:string;previousResetToken:string}|null>(null),cancel=useRef<HTMLButtonElement>(null),inFlight=useRef(false);
 const game=api.game;
 if(!game)return <section className="panel" aria-live="polite"><h2>Loading your settings…</h2>{api.error&&<><p role="alert">{api.error}</p><button className="secondary" onClick={()=>void api.load()}>Retry</button></>}</section>;
 const stats=progressStats(game,records),replays=completedReplays(game),busy=api.saving||progressSaving||restarting;
 const cards=[{label:"Practices completed",value:loaded?stats.practices:"—",icon:Flame},{label:"Minutes of practice",value:loaded?stats.minutes:"—",icon:Clock3},{label:"Story episodes read",value:`${stats.episodes} / 48`,icon:BookOpen},{label:"Companions met",value:`${stats.companions} / 5`,icon:Users},{label:"Supplies available",value:stats.supplies,icon:Package},{label:"Hall projects built",value:`${stats.projects} / 5`,icon:Hammer}];
 function openConfirmation(){request.current={token:crypto.randomUUID(),previousResetToken:game!.resetToken??""};setConfirmation("");setResetError("");setConfirmOpen(true);}
 async function restart(){
  if(confirmation!=="RESTART"||busy||inFlight.current||!request.current)return;
  inFlight.current=true;setRestarting(true);setResetError("");
  try{
   const ok=await api.act({action:"reset-progress",...request.current,confirmation});
   if(ok){setConfirmOpen(false);setConfirmation("");onRestart();}
   else setResetError("The restart could not be confirmed. You can retry this request, or close this window and reload your settings.");
  }finally{inFlight.current=false;setRestarting(false);}
 }
 function replayRow(scene:StoryScene){return <button className="settings-replay" key={scene.id} onClick={()=>onReplay(scene.id)} disabled={busy}><BookOpen size={19}/><span><small>{scene.kind==="main"?`EPISODE ${scene.beat} / 6`:scene.kind==="opening"?"BEFORE PRACTICE":scene.kind==="prologue"?"WELCOME":"A MOMENT AT THE HALL"}</small><strong>{scene.title}</strong></span><span className="settings-replay-action">Replay <RotateCcw size={15}/></span></button>;}
 return <div className="settings-screen">
  <section aria-labelledby="settings-stats-title"><div className="section-heading"><h2 id="settings-stats-title">Your progress</h2><span>Level 1 · Beginner</span></div><div className="settings-stats">{cards.map(({label,value,icon:Icon})=><div className="panel settings-stat" key={label}><Icon size={21} aria-hidden="true"/><strong>{value}</strong><span>{label}</span></div>)}</div><p className="small-note settings-note">Practice time includes saved partial sessions and rests within practice. Story progress is separate from martial arts skill.</p></section>
  <section className="panel settings-library" aria-labelledby="settings-replays-title"><div className="section-heading"><h2 id="settings-replays-title">Episode replays</h2><span>{replays.episodes.length} read</span></div><p>Revisit completed episodes with your original choices. Replays give no extra rewards and keep your current reading place.</p>{!replays.episodes.length&&<div className="settings-empty"><BookOpen size={26}/><p>Finish an episode to replay it here. Your story is waiting in Lantern Hall.</p></div>}{Array.from({length:8},(_,i)=>{const episodes=replays.episodes.filter(s=>s.episode===i+1);return episodes.length>0&&<div className="settings-replay-week" key={i}><h3>Story week {i+1}</h3>{episodes.map(replayRow)}</div>;})}{replays.extras.length>0&&<details className="settings-extra-replays"><summary>Openings &amp; other conversations <span>{replays.extras.length} read</span></summary>{replays.extras.map(replayRow)}</details>}</section>
  <section className="panel settings-restart" aria-labelledby="settings-restart-title"><div><span className="eyebrow">A FRESH BEGINNING</span><h2 id="settings-restart-title">Restart from scratch</h2><p>Delete all story and training progress for this account and return to the welcome prologue. This cannot be undone.</p></div><button className="secondary settings-danger" disabled={busy} onClick={openConfirmation}><RotateCcw size={17}/>Restart from scratch</button></section>
  {api.error&&!confirmOpen&&<div className="game-error" role="alert">{api.error}<button className="text-button" onClick={()=>void api.load()}>Reload settings</button></div>}
  <Dialog open={confirmOpen} onOpenChange={open=>{if(!inFlight.current&&!restarting)setConfirmOpen(open);}}><DialogContent className="dojo-dialog restart-dialog" showCloseButton={false} onOpenAutoFocus={e=>{e.preventDefault();cancel.current?.focus();}} onEscapeKeyDown={e=>{if(inFlight.current)e.preventDefault();}} onInteractOutside={e=>{if(inFlight.current)e.preventDefault();}}>
   <span className="restart-symbol" aria-hidden="true"><TriangleAlert size={26}/></span><DialogTitle>Delete all progress and restart?</DialogTitle><DialogDescription>This permanently deletes your saved progress for this account. There is no undo.</DialogDescription>
   <ul className="restart-deletions"><li>Story episodes, choices, companion bonds and introductions</li><li>Supplies, hall projects, jobs and active practice</li><li>Training journal, private notes, mobility assessment and beginner week checks</li></ul><p className="settings-note">Your sign-in stays the same. You’ll begin again at Lantern Hall, with solo practice until you meet the companions.</p>
   <form onSubmit={e=>{e.preventDefault();void restart();}}><label htmlFor="restart-confirmation">Type <strong>RESTART</strong> to confirm</label><input id="restart-confirmation" autoComplete="off" spellCheck={false} value={confirmation} disabled={restarting} onChange={e=>setConfirmation(e.target.value)} aria-describedby="restart-warning"/><p id="restart-warning" className="settings-note">All progress will be deleted.</p>{resetError&&<div className="game-error" role="alert">{resetError}{api.error&&<p>{api.error}</p>}</div>}<div className="restart-actions"><button type="button" ref={cancel} className="secondary" disabled={restarting} onClick={()=>setConfirmOpen(false)}>Keep my progress</button><button type="submit" className="primary settings-danger" disabled={confirmation!=="RESTART"||busy}>{restarting?"Restarting…":"Delete progress & restart"}</button></div></form>
  </DialogContent></Dialog>
 </div>;
}
