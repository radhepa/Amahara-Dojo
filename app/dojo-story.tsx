"use client";
import {BookOpen,ChevronRight,Lock,RotateCcw,Leaf} from "lucide-react";
import {DOJO_MEMBERS} from "@/lib/dojo-members";
import {availableScenes,mainCompleted,campaignMain,requiredOpening} from "@/lib/game";
import {completedReplays} from "@/lib/settings";
import {hallImage} from "@/lib/story/cast";
import type {StoryScene} from "@/lib/story/types";
import type {DojoGameApi} from "./use-dojo-game";
import {ScreenHead,inkStyle} from "./dojo-hud";
import {sceneLabel} from "./dojo-hub";

export default function DojoStory({api,onRead,onPractice,isDone}:{api:DojoGameApi;onRead:(id:string)=>void;onPractice:()=>void;isDone:boolean}){
 const g=api.game;
 if(!g)return <section className="hall-loading" aria-live="polite"><Leaf size={30}/><h2>Opening the story…</h2>{api.error&&<><p role="alert">{api.error}</p><button className="secondary" onClick={()=>void api.load()}>Retry</button></>}</section>;
 const available=availableScenes(g),primary=available.find(s=>s.kind==="prologue")??available.find(s=>s.id===requiredOpening(g)?.id)??available.find(s=>s.kind==="main");
 const visits=available.filter(s=>!["prologue","main","opening"].includes(s.kind));
 const count=mainCompleted(g),episode=Math.min(8,Math.floor(count/6)+1),nextEpisode=campaignMain(g)[count];
 const replays=completedReplays(g),busy=api.saving;
 const minutes=(s:StoryScene)=>s.readingMinutes??"3–5";
 function replayRow(scene:StoryScene){return <button className="replay-row" key={scene.id} onClick={()=>onRead(scene.id)} disabled={busy}><BookOpen aria-hidden="true"/><span><small>{scene.kind==="main"?`EPISODE ${scene.beat} / 6`:scene.kind==="opening"?"BEFORE PRACTICE":scene.kind==="prologue"?"WELCOME":"A MOMENT AT THE HALL"}</small><strong>{scene.title}</strong></span><span className="replay-action">Replay<RotateCcw aria-hidden="true"/></span></button>;}
 return <div className="screen">
  <ScreenHead eyebrow="CHAPTER 1 · LANTERN HALL" title="Story" lede="Each saved practice opens the next episode. Visits are optional, and replays keep your original choices."/>
  <section className="story-feature" aria-labelledby="story-next-title">
   <img src={hallImage(count,g.facilities.includes("floor"))} alt=""/>
   <div className="story-feature-copy">
    {primary?<><span className="eyebrow">{primary.kind==="main"&&primary.revision?`WEEK ${primary.episode} · ${sceneLabel(primary).toUpperCase()} OF 6`:sceneLabel(primary).toUpperCase()} · READY</span><h2 id="story-next-title">{primary.title}</h2><p>{g.scenes[primary.id]?"Your place is saved. Pick up where you left off.":`About ${minutes(primary)} minutes to read.`}</p><button className="primary" onClick={()=>onRead(primary.id)}><BookOpen/>{g.scenes[primary.id]?"Continue story":"Start reading"}</button></>
    :count===48?<><span className="eyebrow">CHAPTER 1 · COMPLETE</span><h2 id="story-next-title">The door stays open.</h2><p>Keep practising. New stories will meet you here.</p></>
    :<><span className="eyebrow"><Lock aria-hidden="true"/>{nextEpisode?.revision?`WEEK ${nextEpisode.episode} · EPISODE ${nextEpisode.beat} OF 6`:`STORY WEEK ${episode} OF 8`}</span><h2 id="story-next-title">{isDone?"The next episode follows your next practice.":"Your next episode opens after today’s practice."}</h2><p>Practice and story move together. Rest days never cost you progress.</p>{!isDone&&<button className="primary" onClick={onPractice}>Go to today’s practice<ChevronRight/></button>}</>}
   </div>
  </section>
  <section className="card" aria-labelledby="chapter-title">
   <div className="card-head"><h2 id="chapter-title">Chapter 1</h2><span>{count} of 48 episodes</span></div>
   <div className="chapter-track is-large" role="progressbar" aria-label="Chapter 1 story progress" aria-valuemin={0} aria-valuemax={48} aria-valuenow={count}>{Array.from({length:8},(_,i)=><span key={i} className={i===episode-1&&count<48?"current":""}><b><i style={{width:`${Math.max(0,Math.min(1,(count-i*6)/6))*100}%`}}/></b><small>Week {i+1}</small></span>)}</div>
  </section>
  <div className="split">
   <section className="card split-main" aria-labelledby="visits-title">
    <div className="card-head"><h2 id="visits-title">Visits</h2><span>{visits.length} waiting</span></div>
    {visits.length?<div className="visit-list">{visits.map(s=>{const m=DOJO_MEMBERS.find(x=>x.id===s.member);return <button className="visit-row" key={s.id} onClick={()=>onRead(s.id)} style={inkStyle(s.member)}>{m?<img src={m.portrait} alt=""/>:<span className="visit-icon"><BookOpen/></span>}<span><small>{s.kind==="personal"?"PERSONAL CONVERSATION":s.kind==="relationship"?"AN INVITATION":"AROUND THE HALL"}</small><strong>{s.title}</strong>{m&&<span>{m.name}</span>}</span><ChevronRight aria-hidden="true"/></button>;})}</div>
    :<p className="card-empty">No visits waiting. Conversations open as you practise together and the season moves on. Taking time away never removes trust or supplies.</p>}
   </section>
   <section className="card split-side replays" aria-labelledby="replays-title">
    <div className="card-head"><h2 id="replays-title">Replays</h2><span>{replays.episodes.length} read</span></div>
    <p className="card-note">Replays give no extra rewards and keep your current reading place.</p>
    {!replays.episodes.length&&!replays.extras.length&&<p className="card-empty">Finish an episode to replay it here.</p>}
    {Array.from({length:8},(_,i)=>{const episodes=replays.episodes.filter(s=>s.episode===i+1);return episodes.length>0&&<div className="replay-week" key={i}><h3>Story week {i+1}</h3>{episodes.map(replayRow)}</div>;})}
    {replays.extras.length>0&&<details className="replay-extras"><summary>Openings and other conversations <span>{replays.extras.length} read</span></summary>{replays.extras.map(replayRow)}</details>}
   </section>
  </div>
 </div>;
}
