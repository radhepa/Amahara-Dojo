"use client";
import {useRef,useState} from "react";
import {BookOpen,Clock3,Flame,Hammer,Package,RotateCcw,TriangleAlert,Users} from "lucide-react";
import {Dialog,DialogContent,DialogDescription,DialogTitle} from "@/components/ui/dialog";
import {progressStats} from "@/lib/settings";
import type {RecordEntry} from "@/lib/training";
import type {DojoGameApi} from "./use-dojo-game";

export default function DojoSettings({api,records,loaded,progressSaving,onRestart,stage}:{api:DojoGameApi;records:RecordEntry[];loaded:boolean;progressSaving:boolean;onRestart:()=>void;stage:string}){
 const [confirmOpen,setConfirmOpen]=useState(false),[confirmation,setConfirmation]=useState(""),[restarting,setRestarting]=useState(false),[resetError,setResetError]=useState("");
 const request=useRef<{token:string;previousResetToken:string}|null>(null),cancel=useRef<HTMLButtonElement>(null),inFlight=useRef(false);
 const game=api.game;
 if(!game)return <section className="panel" aria-live="polite"><h2>Loading your settings…</h2>{api.error&&<><p role="alert">{api.error}</p><button className="secondary" onClick={()=>void api.load()}>Retry</button></>}</section>;
 const stats=progressStats(game,records),busy=api.saving||progressSaving||restarting;
 const cards=[{label:"Practices completed",value:loaded?stats.practices:"—",icon:Flame},{label:"Minutes of practice",value:loaded?stats.minutes:"—",icon:Clock3},{label:"Story episodes read",value:`${stats.episodes} / 48`,icon:BookOpen},{label:"Companions available",value:`${stats.companions} / 5`,icon:Users},{label:"Supplies available",value:stats.supplies,icon:Package},{label:"Hall projects built",value:`${stats.projects} / 5`,icon:Hammer}];
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
 return <div className="settings-screen">
  <section className="card" aria-labelledby="settings-stats-title"><div className="card-head"><h2 id="settings-stats-title">Your progress</h2><span>{stage}</span></div><div className="settings-stats">{cards.map(({label,value,icon:Icon})=><div className="settings-stat" key={label}><Icon size={21} aria-hidden="true"/><strong>{value}</strong><span>{label}</span></div>)}</div><p className="card-note">Practice time includes saved partial sessions and rests within practice. Story progress is separate from martial arts skill. Episode replays are in the Story tab.</p></section>
  <section className="card settings-restart" aria-labelledby="settings-restart-title"><div><span className="eyebrow">A FRESH BEGINNING</span><h2 id="settings-restart-title">Restart from scratch</h2><p>Delete all story and training progress for this account and return to the welcome prologue. This cannot be undone.</p></div><button className="secondary settings-danger" disabled={busy} onClick={openConfirmation}><RotateCcw size={17}/>Restart from scratch</button></section>
  {api.error&&!confirmOpen&&<div className="game-error" role="alert">{api.error}<button className="text-button" onClick={()=>void api.load()}>Reload settings</button></div>}
  <Dialog open={confirmOpen} onOpenChange={open=>{if(!inFlight.current&&!restarting)setConfirmOpen(open);}}><DialogContent className="dojo-dialog restart-dialog" showCloseButton={false} onOpenAutoFocus={e=>{e.preventDefault();cancel.current?.focus();}} onEscapeKeyDown={e=>{if(inFlight.current)e.preventDefault();}} onInteractOutside={e=>{if(inFlight.current)e.preventDefault();}}>
   <span className="restart-symbol" aria-hidden="true"><TriangleAlert size={26}/></span><DialogTitle>Delete all progress and restart?</DialogTitle><DialogDescription>This permanently deletes your saved progress for this account. There is no undo.</DialogDescription>
   <ul className="restart-deletions"><li>Story episodes, choices, companion bonds and introductions</li><li>Supplies, hall projects, jobs and active practice</li><li>Training journal, private notes, mobility assessment and beginner week checks</li></ul><p className="settings-note">Your sign-in stays the same. You’ll begin again at Lantern Hall, with solo practice until you meet the companions.</p>
   <form onSubmit={e=>{e.preventDefault();void restart();}}><label htmlFor="restart-confirmation">Type <strong>RESTART</strong> to confirm</label><input id="restart-confirmation" autoComplete="off" spellCheck={false} value={confirmation} disabled={restarting} onChange={e=>setConfirmation(e.target.value)} aria-describedby="restart-warning"/><p id="restart-warning" className="settings-note">All progress will be deleted.</p>{resetError&&<div className="game-error" role="alert">{resetError}{api.error&&<p>{api.error}</p>}</div>}<div className="restart-actions"><button type="button" ref={cancel} className="secondary" disabled={restarting} onClick={()=>setConfirmOpen(false)}>Keep my progress</button><button type="submit" className="primary settings-danger" disabled={confirmation!=="RESTART"||busy}>{restarting?"Restarting…":"Delete progress & restart"}</button></div></form>
  </DialogContent></Dialog>
 </div>;
}
