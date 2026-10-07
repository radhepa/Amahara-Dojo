"use client";
import {useState,useEffect} from "react";
import {BookOpen,Play,Leaf,Hammer,Check,Lock,ChevronRight,Clock3} from "lucide-react";
import {DOJO_MEMBERS,type DojoMemberId} from "@/lib/dojo-members";
import {PROJECTS,JOBS,availableScenes,claimable,mainCompleted,campaignMain,earnedEpisodes,companionsUnlocked,requiredOpening,type PracticeCompanion} from "@/lib/game";
import {EPISODE_TITLES} from "@/lib/story";
import type {StoryScene} from "@/lib/story/types";
import {activeSession} from "@/lib/session-actions";
import {hallImage} from "@/lib/story/cast";
import type {DojoGameApi} from "./use-dojo-game";
import {inkStyle} from "./dojo-hud";

export type WeekDay={label:string;state:"done"|"partial"|"today"|"rest"|"upcoming"|"open";minutes:number};
type Step={id:string;title:string;sub:string;state:"done"|"now"|"next"|"locked"|"rest";cta?:string;icon?:"read"|"play";action?:()=>void};

export function sceneLabel(s:StoryScene){return s.kind==="prologue"?"Prologue":s.kind==="opening"?"Story opening":s.kind==="main"?(s.revision?`Episode ${s.beat}`:"Next scene"):"A visit";}

export default function DojoHub({api,companion,today,isRest,isDone,plan,week,practicesThisWeek,onPractice,onResume,onSettings,onRead,onStory,onCompanions}:{api:DojoGameApi;companion:PracticeCompanion;today:string;isRest:boolean;isDone:boolean;plan:{title:string;minutes:number};week:WeekDay[];practicesThisWeek:number;onPractice:()=>void;onResume:()=>void;onSettings:()=>void;onRead:(id:string)=>void;onStory:()=>void;onCompanions:()=>void}){
 const [showProjects,setShowProjects]=useState(false),[jobMember,setJobMember]=useState<DojoMemberId>("akari"),[jobHours,setJobHours]=useState<12|24>(12),[job,setJob]=useState("stock"),[,tick]=useState(0);
 useEffect(()=>{const t=setInterval(()=>tick(n=>n+1),30000);return()=>clearInterval(t);},[]);
 const g=api.game;if(!g)return <section className="hall-loading" aria-live="polite"><Leaf size={30}/><h2>Opening Lantern Hall…</h2>{api.error&&<><p role="alert">{api.error}</p><button className="secondary" onClick={()=>void api.load()}>Retry</button></>}</section>;
 const available=availableScenes(g),primary=available.find(s=>s.kind==="prologue")??available.find(s=>s.id===requiredOpening(g)?.id)??available.find(s=>s.kind==="main"),visits=available.filter(s=>!["prologue","main","opening"].includes(s.kind));
 const count=mainCompleted(g),episode=Math.min(8,Math.floor(count/6)+1),active=activeSession(g),nextEpisode=campaignMain(g)[count];
 const unlocked=companionsUnlocked(g),host=unlocked.find(m=>m.id===companion);
 const date=today?new Date(`${today}T12:00:00Z`):null;
 const minutes=(s:StoryScene)=>s.readingMinutes??"3–5";

 const steps:Step[]=[];
 if(primary&&primary.kind!=="main")steps.push({id:"read",title:sceneLabel(primary),sub:`${g.scenes[primary.id]?"Continue reading":"Read before practice"} · ${minutes(primary)} min`,state:"now",icon:"read",cta:g.scenes[primary.id]?"Continue story":primary.kind==="prologue"?"Begin your story":`Read opening · ${minutes(primary)} min`,action:()=>onRead(primary.id)});
 const waiting=steps.some(s=>s.state==="now");
 if(active)steps.push({id:"practice",title:"Practice in progress",sub:"Your timer and place are saved",state:waiting?"next":"now",icon:"play",cta:"Resume practice",action:onResume});
 else if(isDone)steps.push({id:"practice",title:"Practice saved",sub:"Today’s promise is kept",state:"done"});
 else if(isRest)steps.push({id:"practice",title:"Rest day",sub:"Wednesday is full rest. Nothing is assigned.",state:"rest"});
 else steps.push({id:"practice",title:`Practice · ${plan.title}`,sub:`${plan.minutes} min · ${host?`with ${host.name}`:"solo"} · rests included`,state:waiting?"next":"now",icon:"play",cta:"Start today’s practice",action:onPractice});
 if(primary?.kind==="main")steps.push({id:"episode",title:sceneLabel(primary),sub:`Unlocked · ${minutes(primary)} min to read`,state:steps.some(s=>s.state==="now")?"next":"now",icon:"read",cta:g.scenes[primary.id]?"Continue story":`Read ${sceneLabel(primary)} · ${minutes(primary)} min`,action:()=>onRead(primary.id)});
 else if(count<48&&!isRest&&nextEpisode)steps.push({id:"episode",title:nextEpisode.revision?`Episode ${nextEpisode.beat}`:"Next scene",sub:isDone?"Follows your next saved practice":"Unlocks when today’s practice is saved",state:"locked"});
 const lead=steps.find(s=>s.state==="now"&&s.action);
 const second=lead?.id==="practice"?null:steps.find(s=>s!==lead&&s.action);

 const nextProject=PROJECTS.find(p=>!g.facilities.includes(p.id));
 const projectOpen=nextProject?earnedEpisodes(g)>=nextProject.episode:false;
 const ready=g.assignments.reduce((n,a)=>n+claimable(a,api.now()),0);
 const slots=earnedEpisodes(g)>=3?2:1;

 return <div className="hall">
 {!g.storyRevision&&<section className="card pilot-start"><h2>A new first month</h2><p>Twenty-four visual novel episodes, story openings before selected workouts, and companions you meet along the way. Open Settings to review your progress and restart with the expanded story.</p><button className="primary" onClick={onSettings}>Open Settings</button></section>}
 <section className="hall-hero" aria-labelledby="hall-title">
  <img className="hall-art" src={hallImage(count,g.facilities.includes("floor"))} alt={count>=33?"Lantern Hall after its repairs":count>=12||g.facilities.includes("floor")?"Lantern Hall with repairs under way":"Lantern Hall, a worn timber dojo with warm daylight"}/>
  <div className="hall-scrim" aria-hidden="true"/>
  {host&&<img className="hall-portrait" key={host.id} src={host.portrait} alt=""/>}
  <div className="hall-copy">
   <div className="hall-title">
    <span className="eyebrow">{count===48?"CHAPTER 1 · SEASON COMPLETE":nextEpisode?.revision?`CHAPTER 1 · WEEK ${nextEpisode.episode} · EPISODE ${nextEpisode.beat} OF 6`:`CHAPTER 1 · STORY WEEK ${episode} OF 8`}</span>
    <h1 id="hall-title">{count===48?"The door stays open.":nextEpisode?.revision?nextEpisode.title:EPISODE_TITLES[episode-1]}</h1>
    <p className="lede">{count===48?"Keep your practice close. New training and new stories will meet you here.":primary?.kind==="prologue"?"An open door. Five unfamiliar faces. Your story at Lantern Hall begins here.":primary?.kind==="main"?"Your practice is saved. The next episode is ready when you are.":isRest?"Let the hall be quiet today. Wednesday is yours to rest.":"Take your place on the mats. Your next saved practice opens the next episode."}</p>
   </div>
   <div className="today-card">
    <div className="today-head"><span className="label">TODAY</span><span>{date?date.toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric",timeZone:"UTC"}):"Today"}{isRest?" · Rest day":""}</span></div>
    <ol className="steps">{steps.map(s=><li key={s.id} className={`step is-${s.state}`}>
     <span className="step-dot" aria-hidden="true">{s.state==="done"?<Check/>:s.state==="locked"?<Lock/>:s.state==="rest"?<Leaf/>:s.icon==="read"?<BookOpen/>:<Play/>}</span>
     <span className="step-copy"><strong>{s.title}</strong><span>{s.sub}</span></span>
     <span className="step-tag">{s.state==="now"?"NOW":s.state==="done"?"Done":s.state==="next"?"Next":""}</span>
    </li>)}</ol>
    <div className="today-actions">
     {lead?<button className="primary" onClick={lead.action}>{lead.icon==="read"?<BookOpen/>:<Play/>}{lead.cta}</button>:<button className="primary" onClick={onPractice}><Leaf/>{isRest?"See this week":"Review today’s practice"}</button>}
     {second?<button className="text-button" onClick={second.action}>{second.cta}</button>:<button className="text-button" onClick={onPractice}>See today’s plan</button>}
    </div>
   </div>
   <div className="chapter-progress">
    <div className="chapter-meta"><span className="label">CHAPTER 1</span><span>{count} of 48 episodes</span></div>
    <div className="chapter-track" role="progressbar" aria-label="Chapter 1 story progress" aria-valuemin={0} aria-valuemax={48} aria-valuenow={count}>{Array.from({length:8},(_,i)=><span key={i} className={i===episode-1&&count<48?"current":""}><b><i style={{width:`${Math.max(0,Math.min(1,(count-i*6)/6))*100}%`}}/></b><small>W{i+1}</small></span>)}</div>
   </div>
  </div>
  {host?<div className="hall-nameplate" style={inkStyle(host.id)}><span className="label">PRACTISING WITH</span><div><strong>{host.name}</strong><span>{host.role}</span></div><p>“{host.introduction}”</p><button className="text-button" onClick={onCompanions}>Change companion<ChevronRight/></button></div>
  :<div className="hall-nameplate is-solo"><span className="label">SOLO PRACTICE</span><div><strong>Your own pace</strong></div><p>{unlocked.length?"Choose a companion to practise together.":"Meet the founders through the story to practise together."}</p>{unlocked.length>0&&<button className="text-button" onClick={onCompanions}>Choose a companion<ChevronRight/></button>}</div>}
 </section>

 <div className="hall-cards">
  <section className="card" aria-labelledby="week-card-title">
   <div className="card-head"><h2 id="week-card-title">This week</h2><span>{practicesThisWeek} of 6 practices</span></div>
   <div className="week-dots">{week.map(d=><span key={d.label} className={`day is-${d.state}`}><small>{d.label}</small><i aria-hidden="true">{d.state==="done"?<Check/>:d.state==="rest"?<Leaf/>:d.state==="partial"?<Clock3/>:null}</i><span>{d.state==="done"?"Done":d.state==="partial"?"Partial":d.state==="today"?"Today":d.state==="rest"?"Rest":`${d.minutes}m`}</span></span>)}</div>
   <p className="card-note">Wednesday is full rest. A missed day never costs you anything.</p>
   <button className="text-button card-link" onClick={onPractice}>Open training plan<ChevronRight/></button>
  </section>
  <section className="card" aria-labelledby="visits-card-title">
   <div className="card-head"><h2 id="visits-card-title">Waiting at the hall</h2><span>{visits.length} {visits.length===1?"visit":"visits"}</span></div>
   {visits.length?<div className="visit-list">{visits.slice(0,3).map(s=>{const m=DOJO_MEMBERS.find(x=>x.id===s.member);return <button className="visit-row" key={s.id} onClick={()=>onRead(s.id)} style={inkStyle(s.member)}>{m?<img src={m.portrait} alt=""/>:<span className="visit-icon"><BookOpen/></span>}<span><small>{s.kind==="personal"?"PERSONAL CONVERSATION":s.kind==="relationship"?"AN INVITATION":"AROUND THE HALL"}</small><strong>{s.title}</strong>{m&&<span>{m.name}</span>}</span><ChevronRight aria-hidden="true"/></button>;})}</div>
   :<p className="card-empty">No visits waiting. Conversations open as you practise together and the season moves on.</p>}
   <button className="text-button card-link" onClick={onStory}>{visits.length>3?`All ${visits.length} visits`:"Open the story"}<ChevronRight/></button>
  </section>
  <section className="card" aria-labelledby="projects-card-title">
   <div className="card-head"><h2 id="projects-card-title">Hall projects</h2><span>{g.supplies} supplies</span></div>
   {nextProject?<div className="project-next"><div className="project-line"><strong>{nextProject.name}</strong><span>{projectOpen?`${Math.min(g.supplies,nextProject.cost)} / ${nextProject.cost}`:`After story week ${nextProject.episode}`}</span></div><div className="meter" role="progressbar" aria-label={`Supplies toward ${nextProject.name}`} aria-valuemin={0} aria-valuemax={nextProject.cost} aria-valuenow={Math.min(g.supplies,nextProject.cost)}><i style={{width:`${Math.min(100,g.supplies/nextProject.cost*100)}%`}}/></div><p className="card-note">{nextProject.description}</p></div>:<p className="card-note">Every hall project is built.</p>}
   <div className="jobs-line">{earnedEpisodes(g)<1?<><Lock aria-hidden="true"/><span>Companion jobs open after story week 1</span></>:<><Hammer aria-hidden="true"/><span>{g.assignments.length} of {slots} jobs running{ready>0?` · ${ready} supplies ready`:""}</span></>}</div>
   <button className="text-button card-link" aria-expanded={showProjects} aria-controls="hall-projects" onClick={()=>setShowProjects(!showProjects)}>{showProjects?"Hide projects and jobs":"Build and assign jobs"}<ChevronRight/></button>
  </section>
 </div>

 {api.error&&<div className="game-error" role="alert">{api.error}<button className="text-button" onClick={()=>void api.load()}>Reload dojo</button></div>}

 {showProjects&&<section className="card projects-panel" id="hall-projects" aria-labelledby="projects-panel-title">
  <div className="card-head"><h2 id="projects-panel-title">Projects and jobs</h2><span>Optional · never required for the story</span></div>
  <p className="card-note">Each saved practice adds 20 supplies. Normal and gentle recovery count equally. Projects open new companion jobs.</p>
  <div className="projects-grid">{PROJECTS.map(p=>{const owned=g.facilities.includes(p.id),open=earnedEpisodes(g)>=p.episode;return <article className={`project-card ${owned?"is-built":open?"":"is-locked"}`} key={p.id}><span className="project-icon">{owned?<Check/>:open?<Hammer/>:<Lock/>}</span><h3>{p.name}</h3><p>{p.description}</p><button className={owned?"secondary":"primary"} disabled={owned||!open||g.supplies<p.cost||api.saving} onClick={()=>void api.act({action:"upgrade",id:p.id})}>{owned?"Built":!open?`After story week ${p.episode}`:`Build · ${p.cost} supplies`}</button></article>;})}</div>
  <div className="assignments"><div className="card-head"><h3>Companion jobs</h3><span>{g.assignments.length} / {slots} slots</span></div><p className="card-note">Jobs continue between visits and keep up to 48 hours of finished work. They earn supplies, not affection or training skill.</p>
   {g.assignments.map(a=><div className="assignment-row" key={a.id}><div><strong>{DOJO_MEMBERS.find(m=>m.id===a.member)?.name} · {JOBS.find(j=>j.id===(a.job??"stock"))?.name}</strong><span><Clock3 size={15}/>{a.hours}h cycles · {claimable(a,api.now())} supplies ready</span></div><button className="secondary" disabled={api.saving||claimable(a,api.now())===0} onClick={()=>void api.act({action:"claim",id:a.id})}>Collect</button><button className="text-button" disabled={api.saving} onClick={()=>void api.act({action:"release",id:a.id})}>Collect & finish job</button></div>)}
   {earnedEpisodes(g)<1?<p className="card-note">Jobs open after story week 1. The second slot opens after story week 3.</p>:g.assignments.length<slots&&unlocked.some(m=>!g.assignments.some(a=>a.member===m.id))&&<div className="assignment-form"><label>Companion<select value={jobMember} onChange={e=>setJobMember(e.target.value as DojoMemberId)}>{unlocked.filter(m=>!g.assignments.some(a=>a.member===m.id)).map(m=><option value={m.id} key={m.id}>{m.name}</option>)}</select></label><label>Work<select value={job} onChange={e=>setJob(e.target.value)}>{JOBS.filter(j=>!j.requires||g.facilities.includes(j.requires)).map(j=><option key={j.id} value={j.id}>{j.name}</option>)}</select></label><label>Cycle<select value={jobHours} onChange={e=>setJobHours(Number(e.target.value) as 12|24)}><option value={12}>12 hours · 8 supplies</option><option value={24}>24 hours · 16 supplies</option></select></label><button className="primary" disabled={api.saving} onClick={()=>void api.act({action:"assign",member:unlocked.some(m=>m.id===jobMember&&!g.assignments.some(a=>a.member===m.id))?jobMember:unlocked.find(m=>!g.assignments.some(a=>a.member===m.id))!.id,hours:jobHours,job})}>Begin job</button></div>}
  </div>
 </section>}
 </div>;
}
