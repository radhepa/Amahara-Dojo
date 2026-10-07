"use client";
import {useState,useEffect,useRef,useCallback} from "react";
import {Flame,Leaf,BookOpen,Target,Play,Pause,Clock3,ShieldCheck,Check,ChevronRight,Heart,Info,CheckCircle2} from "lucide-react";
import {Tabs,TabsContent} from "@/components/ui/tabs";
import {Dialog,DialogContent,DialogTitle,DialogDescription} from "@/components/ui/dialog";
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {Progress} from "@/components/ui/progress";
import {Toaster} from "@/components/ui/sonner";
import {toast} from "sonner";
import BeginnerJourney from "./beginner-journey";
import DojoHub,{type WeekDay} from "./dojo-hub";
import DojoStory from "./dojo-story";
import DojoSettings from "./dojo-settings";
import {DojoTopbar,ScreenHead,inkStyle} from "./dojo-hud";
import DojoRoadmap from "./dojo-roadmap";
import {useDojoGame} from "./use-dojo-game";
import {GuidedPractice} from "./guided-practice";
import {DrillInstructions} from "./drill-instructions";
import {PhaseRing,BlockTrack,clock} from "./practice-focus";
import {CHAPTERS,programmeLibrary} from "@/lib/curriculum";
import {MILESTONE_NOTE,stageLabel} from "@/lib/levels";
import {usePracticeBell,useCountOffset,countFor} from "./use-practice-bell";
import {PracticeBellControls} from "./practice-bell-controls";
import {companionsUnlocked,companionAvailable,availableScenes,requiredOpening,bondLabel,type PracticeCompanion} from "@/lib/game";
import {StoryReader} from "./story-reader";
import {CompanionRoster,MemberProfile} from "./dojo-members";
import {type DojoMember} from "@/lib/dojo-members";
import {beginnerProgress,type WeekCheck} from "@/lib/beginner";
import {DAYS,scheduleForWeek,DRILLS,dayIndex,dateKey,weekDates,makePlan,DEFAULT_ASSESSMENT,type RecordEntry,type Assessment} from "@/lib/training";

const formatTime=(s:number)=>`${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;
function streakOf(entries:RecordEntry[],today:string){
 const kept=new Set(entries.filter(r=>r.kind!=="partial").map(r=>r.date));if(!kept.size)return 0;
 const earliest=[...kept].sort()[0];let d=new Date(today+"T12:00:00Z");if(!kept.has(today)&&d.getUTCDay()!==3)d.setUTCDate(d.getUTCDate()-1);
 let count=0;for(let i=0;i<366;i++){const key=d.toISOString().slice(0,10);if(key<earliest)break;if(!kept.has(key)&&d.getUTCDay()!==3)break;count++;d.setUTCDate(d.getUTCDate()-1);}return count;
}
function Choice({value,onChange,label,options}:{value:string;onChange:(v:string)=>void;label:string;options:[string,string][]}){return <div className="field"><label>{label}</label><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label} className="choice-trigger"><SelectValue/></SelectTrigger><SelectContent>{options.map(([v,l])=><SelectItem value={v} key={v}>{l}</SelectItem>)}</SelectContent></Select></div>;}


// The style in six lines: anime in spirit, real in mechanics (docs/curriculum-review.md).
const STYLE_PRINCIPLES:readonly (readonly [string,string])[]=[
 ["Still, then sudden","Wait relaxed. The strike leaves with no wind-up, so nothing announces it."],
 ["Home faster than you left","Every strike returns along its own line to guard, quicker than it went out."],
 ["The body throws, the hand delivers","Feet, hips and shoulders turn first; the arm or shin rides on the turn."],
 ["Low line, high spirit","Kicks stay at or below the hip, where they work; the spirit shows in posture, eyes and breath."],
 ["Zanshin","After every combination: guard home, eyes forward, one breath of stillness."],
 ["Breath is the engine","A sharp breath out on each strike, a long one in every rest."],
];
export default function Dojo(){
 const gameApi=useDojoGame();
 const [readingScene,setReadingScene]=useState<string|null>(null);
 const [companion,setCompanion]=useState<PracticeCompanion>("solo"),[durableOpen,setDurableOpen]=useState(false);
 const [selectedMember,setSelectedMember]=useState<DojoMember|null>(null);
 const [today,setToday]=useState(""),[current,setCurrent]=useState(5),[day,setDay]=useState(5),[tab,setTab]=useState("hall");
 const [readiness,setReadiness]=useState("ready"),[records,setRecords]=useState<RecordEntry[]>([]),[assessment,setAssessment]=useState<Assessment>(DEFAULT_ASSESSMENT),[savedAssessment,setSavedAssessment]=useState<Assessment>(DEFAULT_ASSESSMENT);
 const [checks,setChecks]=useState<WeekCheck[]>([]);
 const [loaded,setLoaded]=useState(false),[error,setError]=useState(""),[saving,setSaving]=useState(false),[detail,setDetail]=useState<string|null>(null);
 const [session,setSession]=useState(false),[screen,setScreen]=useState<"setup"|"practice"|"summary">("setup"),[confirmed,setConfirmed]=useState(false),[index,setIndex]=useState(0),[remaining,setRemaining]=useState(0),[running,setRunning]=useState(false),[finishedSeconds,setFinishedSeconds]=useState(0),[skipped,setSkipped]=useState(false),[note,setNote]=useState(""),[recordKind,setRecordKind]=useState<RecordEntry["kind"]>("training"),[restOpen,setRestOpen]=useState(false);
 const [practiceEndsAt,setPracticeEndsAt]=useState<number|null>(null),[wallNow,setWallNow]=useState(0);
 const limitRemaining=practiceEndsAt===null?null:Math.max(0,Math.ceil((practiceEndsAt-wallNow)/1000));
 const deadline=useRef(0);const nowDay=day===current;const beginner=beginnerProgress(records,checks,today);const plan=makePlan(day,readiness,beginner.week);const schedule=scheduleForWeek(beginner.week);const block=plan.blocks[index];const existing=records.find(r=>r.date===today);const isDone=!!existing&&existing.kind!=="partial";
 const countTempo=useCountOffset(),previewDrill=block?DRILLS[block.id]:undefined,previewBpm=countFor(previewDrill,countTempo.offset),previewSeed=`preview:${day}:${index}:${practiceEndsAt}`;
 const previewExact=block?Math.min(block.seconds,Math.max(0,block.seconds-(running?(deadline.current-Date.now())/1000:remaining))):0;
 const previewBell=usePracticeBell({blockKey:`${day}:${index}:${practiceEndsAt}`,drill:previewDrill,seconds:block?.seconds??0,elapsed:previewExact,seed:previewSeed,bpm:previewBpm,running:session&&screen==="practice"&&running&&limitRemaining!==0,limitRemaining:session&&screen==="practice"&&practiceEndsAt!==null?Math.max(0,(practiceEndsAt-Date.now())/1000):null});
 const sessions=records.filter(r=>r.kind==="training").length;const minutes=Math.round(records.reduce((s,r)=>s+r.minutes,0));const stage=stageLabel(beginner.week),chapterInfo=CHAPTERS[beginner.chapter-1];const dates=today?weekDates(today):[];const weekCount=records.filter(r=>dates.includes(r.date)&&r.kind==="training").length;
 const chapterSessions=Math.max(0,Math.min(chapterInfo.weeks*6,sessions-(chapterInfo.firstWeek-1)*6)),library=programmeLibrary(beginner.week);
 const progressRequest=useRef(0),seenReset=useRef<{token:string}|null>(null);
 const load=useCallback(async()=>{const request=++progressRequest.current;try{const r=await fetch("/api/progress",{cache:"no-store"});const b=await r.json() as {error?:string;records:RecordEntry[];assessment:Assessment;checks:WeekCheck[]};if(request!==progressRequest.current)return false;if(!r.ok)throw new Error(b.error);setRecords(b.records);setChecks(b.checks??[]);setAssessment(b.assessment);setSavedAssessment(b.assessment);setLoaded(true);setError("");return true;}catch(e){if(request===progressRequest.current)setError(e instanceof Error?e.message:"Could not load progress. Please retry.");return false;}},[]);
 useEffect(()=>{
  if(!gameApi.game)return;const token=gameApi.game.resetToken??"";
  if(!seenReset.current){seenReset.current={token};return;}
  if(seenReset.current.token===token)return;seenReset.current={token};progressRequest.current++;
  setLoaded(false);setRecords([]);setChecks([]);setAssessment(DEFAULT_ASSESSMENT);setSavedAssessment(DEFAULT_ASSESSMENT);setError("");
  setReadingScene(null);setDurableOpen(false);setSelectedMember(null);setCompanion("solo");setSession(false);setRunning(false);setRestOpen(false);setDetail(null);setNote("");setReadiness("ready");setDay(dayIndex());setTab("hall");void load();
 },[gameApi.game,load]);
 useEffect(()=>{const update=()=>{const t=dateKey(),d=dayIndex();setToday(t);setCurrent(d);};update();setDay(dayIndex());void load();const interval=setInterval(update,30000);return()=>clearInterval(interval);},[load]);
 useEffect(()=>{if(!running)return;const tick=()=>{const left=Math.max(0,Math.ceil((deadline.current-Date.now())/1000));setRemaining(left);if(left===0)setRunning(false);};const timer=setInterval(tick,250);tick();return()=>clearInterval(timer);},[running]);
 useEffect(()=>{if(!session)setRunning(false);},[session]);
 useEffect(()=>{if(!session||screen!=="practice")return;const tick=()=>setWallNow(Date.now());tick();const timer=setInterval(tick,250);return()=>clearInterval(timer);},[session,screen]);
 useEffect(()=>{if(session&&screen==="practice"&&limitRemaining===0)finishEarly();},[session,screen,limitRemaining]);
 useEffect(()=>{
  type Context={registerTool:(t:unknown,o:{signal:AbortSignal})=>unknown};const context=(document as Document&{modelContext?:Context}).modelContext;if(!context?.registerTool)return;const controller=new AbortController();
  try{Promise.resolve(context.registerTool({name:"read_training_plan",title:"Read your weekly training plan",description:"Read the beginner martial arts schedule. Does not start or record practice.",inputSchema:{type:"object",properties:{day:{type:"integer",minimum:0,maximum:6}},required:["day"],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input:unknown){const x=input as {day?:number};if(!x||!Number.isInteger(x.day)||x.day!<0||x.day!>6)throw new Error("Day must be 0 (Monday) through 6 (Sunday).");return makePlan(x.day!,"ready",beginner.week);}},{signal:controller.signal})).catch(()=>{});}catch{}return()=>controller.abort();
 },[beginner.week]);
 async function persist(body:object){if(saving)return false;setSaving(true);try{const r=await fetch("/api/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const b=await r.json() as {error?:string};if(!r.ok)throw new Error(b.error);await load();toast.success("Your progress is saved.");return true;}catch(e){const message=e instanceof Error?e.message:"Could not save. Please retry.";setError(message);toast.error(message);return false;}finally{setSaving(false);}}
 function selectDay(d:number){setDay(d);setReadiness("ready");}
 function start(){if(nowDay&&day!==2&&readiness!=="pain"&&!isDone){if(gameApi.game){const needed=requiredOpening(gameApi.game);if(needed){const next=availableScenes(gameApi.game).find(s=>s.kind==="prologue")??availableScenes(gameApi.game).find(s=>s.id===needed.id)??availableScenes(gameApi.game).find(s=>s.kind==="main");if(next){setReadingScene(next.id);return;}}}setDurableOpen(true);return;}if(isDone&&nowDay){setTab("journey");return;}if(nowDay&&(day===2||readiness==="pain")){setNote("");setRestOpen(true);return;}setConfirmed(false);setIndex(0);setRemaining(plan.blocks[0]?.seconds??0);setFinishedSeconds(0);setSkipped(false);setNote("");setScreen("setup");setPracticeEndsAt(null);setRunning(false);setSession(true);}
 function toggleTimer(){if(!running)void previewBell.arm();if(running){setRemaining(Math.max(0,Math.ceil((deadline.current-Date.now())/1000)));setRunning(false);}else{deadline.current=Date.now()+remaining*1000;setRunning(true);}}
 function nextBlock(){setRunning(false);const used=block.seconds-remaining;const elapsed=finishedSeconds+used;const skip=skipped||remaining>0;setSkipped(skip);setFinishedSeconds(elapsed);if(index+1<plan.blocks.length){setIndex(index+1);setRemaining(plan.blocks[index+1].seconds);}else{setRecordKind(skip?"partial":"training");setScreen("summary");}}
 function finishEarly(){setRunning(false);setFinishedSeconds(finishedSeconds+(block?block.seconds-remaining:0));setRecordKind("partial");setScreen("summary");}
 async function saveSession(){if(!nowDay){setSession(false);return;}const elapsed=Math.round(finishedSeconds/60*100)/100;if(elapsed<=0){setSession(false);return;}if(await persist({type:"record",date:today,day:current,kind:recordKind,minutes:elapsed,readiness,note})){setSession(false);}}
 async function saveRest(){if(await persist({type:"record",date:today,day:current,kind:"rest",minutes:0,readiness,note})){setRestOpen(false);}}
 const unlocked=gameApi.game?companionsUnlocked(gameApi.game):[];
 const host=unlocked.find(m=>m.id===companion);
 const opening=gameApi.game?availableScenes(gameApi.game).find(s=>s.kind==="opening"):undefined;
 useEffect(()=>{if(gameApi.game&&!companionAvailable(gameApi.game,companion))setCompanion("solo");},[gameApi.game,companion]);
 const cta=nowDay?(isDone?"View your progress":day===2?"Honor today’s rest":readiness==="pain"?"Choose recovery today":gameApi.game&&requiredOpening(gameApi.game)?"Read story before practice":"Begin today’s practice"):`Preview ${DAYS[day]} practice`;
 const [trainView,setTrainView]=useState<"today"|"week"|"techniques">("today");
 const goTrain=(view:"today"|"week"|"techniques"="today")=>{setTrainView(view);setTab("train");};
 const weekDays:WeekDay[]=schedule.map((s,i)=>{const rec=records.find(r=>r.date===dates[i]);const state:WeekDay["state"]=rec?.kind==="training"?"done":rec?.kind==="partial"?"partial":rec?.kind==="rest"||i===2?"rest":i===current?"today":i<current?"open":"upcoming";return {label:DAYS[i].slice(0,3).toUpperCase(),state,minutes:s.minutes};});
 const pain=readiness==="pain"&&day!==2,gentle=readiness==="tired"&&day!==2;
 const trainHead=trainView==="today"?{eyebrow:nowDay?`${beginner.continuing?"CONTINUING":`CHAPTER ${beginner.chapter}`} · WEEK ${beginner.weekInChapter} · ${DAYS[day].toUpperCase()}`:`${DAYS[day].toUpperCase()} · PLAN PREVIEW`,title:pain?"Recovery is training, too.":plan.title,lede:pain?"Skip practice when you have joint or sharp pain. Rest today; seek professional advice if it persists or limits movement.":gentle?"A gentler version with more seated movement and recovery breaks. Same timer, same rewards.":plan.reason}
  :trainView==="week"?{eyebrow:beginner.continuing?`CONTINUING PRACTICE · ${weekCount} OF 6 PRACTICES`:`CHAPTER ${beginner.chapter} · WEEK ${beginner.weekInChapter} OF ${beginner.chapterWeeks} · ${weekCount} OF 6 PRACTICES`,title:"Your week, in balance.",lede:"Martial arts practice, including setup and rest. Choose the version that fits your starting point."}
  :{eyebrow:`TECHNIQUE LIBRARY · ${stage.toUpperCase()}`,title:beginner.chapter===1?"Begin with the basics.":"Everything you have learned.",lede:beginner.chapter===1?"Beginner movement drills. Build control before adding strikes.":`${chapterInfo.goal} Earlier chapters stay below, ready to review.`};
 return <><a className="hud-skip" href="#dojo-content">Skip to current screen</a><Toaster theme="dark" position="bottom-right"/><Tabs value={tab} onValueChange={setTab} className={`dojo-shell is-${tab}`}>
 <DojoTopbar practices={loaded?sessions:null} supplies={gameApi.game?.supplies??null} stage={stage}/>
 <main className="main" id="dojo-content" tabIndex={-1}>
 {error&&<div className="error-banner" role="alert"><Info size={18}/><span>{error}</span><button className="text-button" onClick={()=>void load()}>Retry loading</button></div>}
 <TabsContent value="hall"><DojoHub api={gameApi} companion={companion} today={today} isRest={current===2} isDone={isDone} plan={{title:makePlan(current,"ready",beginner.week).title,minutes:makePlan(current,"ready",beginner.week).minutes}} week={weekDays} practicesThisWeek={weekCount} onPractice={()=>{setDay(current);goTrain("today");}} onResume={()=>setDurableOpen(true)} onSettings={()=>setTab("settings")} onRead={setReadingScene} onStory={()=>setTab("story")} onCompanions={()=>setTab("members")}/></TabsContent>

 <TabsContent value="train"><div className="screen">
 <ScreenHead eyebrow={trainHead.eyebrow} title={trainHead.title} lede={trainHead.lede}><div className="segmented" role="group" aria-label="Training views">{([["today","Today"],["week","This week"],["techniques","Techniques"]] as const).map(([v,l])=><button key={v} aria-pressed={trainView===v} onClick={()=>setTrainView(v)}>{l}</button>)}</div></ScreenHead>
 {trainView==="today"&&<div className="split">
  <div className="split-main">
   {!nowDay&&<div className="notice"><Info aria-hidden="true"/><span>You are previewing {DAYS[day]}. A preview never saves to your journal.</span><button className="text-button" onClick={()=>selectDay(current)}>Back to today</button></div>}
   {opening&&nowDay&&day!==2&&<div className="notice"><BookOpen aria-hidden="true"/><span>Before practice, read the story opening.</span><button className="text-button" onClick={()=>setReadingScene(opening.id)}>{opening.title} · {opening.readingMinutes??"3–5"} min</button></div>}
   {nowDay&&isDone&&<div className="success-banner"><CheckCircle2 size={18}/>Today’s promise is kept. There is no bonus for doing more.</div>}
   {day!==2&&<section className="card" aria-labelledby="feel-title"><div className="card-head"><h2 id="feel-title">How does your body feel today?</h2></div><div className="readiness" role="group" aria-labelledby="feel-title">{([["ready","Ready","Easy practice"],["tired","Sore or tired","Gentle, seated options"],["pain","Joint or sharp pain","Rest today"]] as const).map(([v,l,sub])=><button key={v} className={`readiness-option is-${v}`} aria-pressed={readiness===v} onClick={()=>setReadiness(v)}><strong>{l}</strong><span>{sub}</span></button>)}</div><p className="card-note">Every option earns the same reward. There is no bonus for pushing.</p></section>}
   {plan.blocks.length?<section className="card session-card" aria-labelledby="session-title">
    <div className="card-head"><h2 id="session-title">{nowDay?"Your session":`${DAYS[day]} session`}</h2><span>{plan.blocks.length} blocks · {plan.minutes} min · {chapterInfo.effort.toLowerCase()}</span></div>
    <div className="session-bar" aria-hidden="true">{plan.blocks.map((b,i)=><span key={i} style={{flexGrow:b.seconds}} className={DRILLS[b.id].timing?"calm":"work"}/>)}</div>
    <ol className="drill-list">{plan.blocks.map((b,i)=><li key={`${i}:${b.id}`}><button className="drill-row" onClick={()=>setDetail(b.id)}><span className="drill-number">{String(i+1).padStart(2,"0")}</span><span className="drill-copy"><strong>{DRILLS[b.id].name}</strong><span>{DRILLS[b.id].category} · {DRILLS[b.id].dose}</span></span><span className="drill-time">{formatTime(b.seconds)}</span><ChevronRight aria-hidden="true"/></button></li>)}</ol>
    <div className="session-actions"><button className="primary" onClick={start} disabled={!today||(nowDay&&!loaded)}>{isDone&&nowDay?<CheckCircle2/>:<Play/>}{cta}</button><span className="card-note">Stops automatically at 45 minutes, pauses included.</span></div>
   </section>
   :<section className="card rest-card"><Leaf aria-hidden="true"/><h2>{day===2?"You have permission to do nothing.":"Rest today. That counts."}</h2><p>{day===2?"Wednesday is a full rest day. No drill, stretch, or workout is assigned. Rest days preserve your discipline streak automatically.":"Rest when movement hurts. You can return to gentle practice when it feels comfortable."}</p>{nowDay&&<div className="session-actions"><button className="primary is-rest" onClick={start} disabled={!today||!loaded}>{isDone?<CheckCircle2/>:<Leaf/>}{cta}</button><span className="card-note">Optional. Your streak is safe either way.</span></div>}</section>}
  </div>
  <aside className="split-side">
   {host?<section className="card companion-card" style={inkStyle(host.id)}><button className="companion-art" onClick={()=>setSelectedMember(host)} aria-label={`Read ${host.name}'s profile`}><img src={host.portrait} alt=""/></button><div className="companion-copy"><span className="label">PRACTISING WITH</span><strong>{host.name}</strong><p>“{host.practiceCue}”</p><button className="text-button" onClick={()=>setTab("members")}>Change companion<ChevronRight/></button></div></section>
   :<section className="card companion-card is-solo"><div className="companion-copy"><span className="label">SOLO PRACTICE</span><strong>Your own pace</strong><p>{unlocked.length?"Choose a companion to practise together.":"Companions join after you meet them in the story."}</p>{unlocked.length>0&&<button className="text-button" onClick={()=>setTab("members")}>Choose a companion<ChevronRight/></button>}</div></section>}
   <section className="card" aria-labelledby="ready-title"><div className="card-head"><h2 id="ready-title">Before you start</h2></div><ul className="check-list"><li><Check aria-hidden="true"/>A clear, non-slip space</li><li><Check aria-hidden="true"/>A stable chair within reach</li><li><Check aria-hidden="true"/>Water nearby</li><li><Check aria-hidden="true"/>No deep squats or toe-touch test</li></ul><p className="card-note">Stop if anything causes sharp or joint pain. Keep effort easy and save partial practice whenever you need to.</p></section>
   <section className="card stat-card" aria-label="Your practice so far"><div><Flame aria-hidden="true"/><strong>{loaded?streakOf(records,today):"—"}</strong><span>day streak</span></div><div><Target aria-hidden="true"/><strong>{loaded?sessions:"—"}</strong><span>practices</span></div><div><Clock3 aria-hidden="true"/><strong>{loaded?minutes:"—"}</strong><span>minutes</span></div></section>
  </aside>
 </div>}
 {trainView==="week"&&<><div className="schedule">{schedule.map((s,i)=><article className={`schedule-row ${i===2?"is-rest":""} ${i===current?"is-today":""}`} key={i}><div className="schedule-day"><strong>{DAYS[i].slice(0,3).toUpperCase()}</strong>{i===current&&<small>TODAY</small>}</div><div className="schedule-copy"><span className="tag">{s.load}</span><h3>{s.title}</h3><p>{s.reason}</p></div><div className="schedule-action"><strong>{s.minutes}<small> min</small></strong><button className="text-button" onClick={()=>{selectDay(i);setTrainView("today");}}>View plan<ChevronRight/></button></div></article>)}</div>
  <div className="notice"><Heart aria-hidden="true"/><span><strong>Control before more work.</strong> This week has {schedule.reduce((n,s)=>n+s.minutes,0)} minutes including setup and rest breaks. If fatigue carries over, choose the gentler option or rest. Never make up missed sessions by doubling up.</span></div></>}
 {trainView==="techniques"&&<>{library.map((group,g)=>{const grid=<div className="library-grid">{Object.entries(group.drills).map(([id,d],i)=><button className="library-card" key={id} onClick={()=>setDetail(id)}><span className="library-top"><span className="drill-number">{String(i+1).padStart(2,"0")}</span><span>{d.category.replace(/^Chapter \d+ · /,"")}</span></span><strong>{d.name}</strong><span className="library-cue">{d.cue}</span><span className="library-link">Learn the drill<ChevronRight/></span></button>)}</div>;return g===0?<section key={group.chapter.chapter} className="library-group"><h2 className="library-heading">Chapter {group.chapter.chapter} · {group.chapter.phase}</h2>{grid}</section>:<details key={group.chapter.chapter} className="library-group earlier"><summary>Chapter {group.chapter.chapter} · {group.chapter.phase} <span>{Object.keys(group.drills).length} techniques</span></summary>{grid}</details>;})}
  <section className="card coaching"><ShieldCheck aria-hidden="true"/><div><h2>Anime spirit. Real-world technique.</h2><p>Dojo is a solo programme: no partner, instructor, sparring or contact is ever required. Its striking follows Bruce Lee&apos;s Jeet Kune Do and modern boxing and kickboxing: a lead straight with no wind-up, hands that come home faster than they leave, low stop-kicks and round kicks at or below hip height, defense that always returns to stance, and stillness after every combination. Every drill has standing, supported and seated versions that earn the same rewards.</p><ol className="style-principles">{STYLE_PRINCIPLES.map(([name,line])=><li key={name}><strong>{name}</strong><span>{line}</span></li>)}</ol><p>The app cannot see you, so it cannot assess your form or certify skill; its checks are honest self-review. No contact, high, spinning or jumping kicks, breakfalls, ankle weights, extreme stretches or maximal tests are assigned. Stop for pain, dizziness, chest discomfort or unusual breathlessness.</p><div className="source-links"><a href="https://boxingcanada.org/wp-content/uploads/2025/01/Instruction-Beginners-Reference-Manual-EN.pdf" target="_blank" rel="noreferrer">Boxing Canada · Beginner technique</a><a href="https://www.orthoinfo.org/staying-healthy/martial-arts-injury-prevention" target="_blank" rel="noreferrer">AAOS · Safe martial arts practice</a><a href="https://www.nhs.uk/live-well/exercise/balance-exercises/" target="_blank" rel="noreferrer">NHS · Balance exercises</a></div><p className="card-note">Each technique lists the sources behind it. They inform technique and safety points; the plan itself has not been clinically validated.</p></div></section></>}
 </div></TabsContent>

 <TabsContent value="story"><DojoStory api={gameApi} onRead={setReadingScene} onPractice={()=>{setDay(current);goTrain("today");}} isDone={isDone}/></TabsContent>

 <TabsContent value="members"><div className="screen"><ScreenHead eyebrow="FIVE FOUNDERS · ONE HALL" title="Companions" lede="Choose who practises with you. A saved practice keeps its companion and adds bond, and conversations open as you grow closer."/><CompanionRoster unlocked={unlocked} companion={companion} onChoose={id=>setCompanion(id as PracticeCompanion)} onProfile={setSelectedMember} bondOf={id=>gameApi.game?bondLabel(gameApi.game,id):"New acquaintance"}/></div></TabsContent>

 <TabsContent value="journey"><div className="screen"><ScreenHead eyebrow={`YOUR SOLO JOURNEY · ${stage.toUpperCase()}`} title="Journey" lede="Zero is a valid starting point. Consistency first; range of motion follows at its own pace."/>
 <BeginnerJourney records={records} checks={checks} today={today} loaded={loaded} saving={saving} persist={persist}/>
 <div className="journey-grid"><section className="card"><span className="eyebrow">{beginner.continuing?"CONTINUING PRACTICE":`CHAPTER ${beginner.chapter} · ${chapterInfo.phase.toUpperCase()}`}</span><h2>{beginner.continuing?"Practice for life.":`${chapterInfo.weeks} weeks · ${chapterInfo.milestone}`}</h2><p className="card-note">{chapterSessions} / {chapterInfo.weeks*6} completed practices in this chapter. Each week requires six completed practices, seven elapsed days, and an honest check-in. Repeat a week whenever needed.</p><Progress value={Math.min(100,chapterSessions/(chapterInfo.weeks*6)*100)} aria-label="Completed practices in this chapter" className="goal-progress"/><div className="goal-list"><p><CheckCircle2/> {chapterInfo.goal}</p><p><CheckCircle2/> Effort: {chapterInfo.effort.toLowerCase()}.</p><p><CheckCircle2/> Protect Wednesday and listen to soreness.</p></div><p className="card-note">{MILESTONE_NOTE}</p></section><section className="card"><span className="eyebrow">A CHECK-IN, NOT A TEST</span><h2>Your mobility baseline</h2><p className="card-note">Only record ranges you already know feel comfortable. Do not push deeper to earn a label.</p><Choice label="Comfortable supported squat range" value={assessment.squat} onChange={v=>setAssessment({...assessment,squat:v})} options={[["shallow","A shallow bend"],["quarter","About a quarter squat"],["half","About halfway"],["comfortable","A comfortable deeper squat"]]}/><Choice label="Easy forward reach, knees soft" value={assessment.reach} onChange={v=>setAssessment({...assessment,reach:v})} options={[["knees","Around my knees"],["shins","Around my shins"],["toes","Near my toes"]]}/><label className="checkbox-line"><Checkbox checked={assessment.comfort} onCheckedChange={v=>setAssessment({...assessment,comfort:v===true})}/>Basic stance and steps feel comfortable.</label><div className="dialog-actions"><button className="primary" disabled={saving||!loaded} onClick={()=>void persist({type:"assessment",...assessment})}>{saving?"Saving…":"Save mobility check-in"}</button>{JSON.stringify(assessment)!==JSON.stringify(savedAssessment)&&<span className="unsaved">Unsaved changes</span>}</div></section></div>
 <DojoRoadmap/>
 <section className="card history"><div className="card-head"><h2>Your practice journal</h2><span>Most recent 30 entries</span></div>{!records.length?<div className="empty"><BookOpen size={29}/><p>Your story is still unwritten.</p><span>Your first saved practice or rest check-in will appear here.</span></div>:records.slice(0,30).map(r=><div className="journal-row" key={r.date}>{r.kind==="rest"?<Leaf size={19}/>:<CheckCircle2 size={19}/>}<div><h3>{r.kind==="rest"?"Recovery honored":r.kind==="partial"?"Partial practice":"Practice completed"}</h3><p>{DAYS[r.day]} · {new Date(r.date+"T12:00:00Z").toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"UTC"})}{r.note&&` · ${r.note}`}</p></div><span>{r.minutes.toFixed(r.minutes%1?1:0)} min</span></div>)}</section>
 </div></TabsContent>

 <TabsContent value="settings"><div className="screen"><ScreenHead eyebrow="YOUR STORY, YOUR PACE" title="Settings"/><DojoSettings api={gameApi} stage={stage} records={records} loaded={loaded} progressSaving={saving} onRestart={()=>{setTab("hall");toast.success("Your progress has been deleted. A fresh story is ready.");}}/></div></TabsContent>
 </main></Tabs>
 <StoryReader sceneId={readingScene} api={gameApi} onClose={()=>setReadingScene(null)}/>
 <GuidedPractice open={durableOpen} onClose={()=>{setDurableOpen(false);void load();}} api={gameApi} companion={companion} readiness={readiness} week={beginner.week} onEpisode={id=>{setDurableOpen(false);setReadingScene(id);}} onSaved={()=>void load()}/>
 <MemberProfile member={selectedMember} onClose={()=>setSelectedMember(null)}/>
 <Dialog open={!!detail} onOpenChange={v=>{if(!v)setDetail(null)}}><DialogContent className="dojo-dialog drill-dialog"><DialogTitle>{detail?DRILLS[detail].name:"Drill"}</DialogTitle><DialogDescription>{detail?DRILLS[detail].category:""} · Work within a comfortable range.</DialogDescription>{detail&&<DrillInstructions key={detail} id={detail} seconds={plan.blocks.find(b=>b.id===detail)?.seconds??300} gentle={readiness==="tired"}/>}</DialogContent></Dialog>
 <Dialog open={session} onOpenChange={setSession}><DialogContent className={`dojo-dialog session-dialog ${screen==="practice"&&block?"is-focus":""}`} onInteractOutside={e=>e.preventDefault()}>
 {screen==="practice"&&block?<div className="focus">
  <div className="focus-bar"><BlockTrack plan={plan.blocks} index={index} elapsed={block.seconds-remaining}/>{limitRemaining!==null&&<span className="focus-limit" role="status">{clock(limitRemaining)} left of the 45-min limit</span>}</div>
  <div className="notice"><Info aria-hidden="true"/><span>Plan preview. This practice will not save to your journal.</span></div>
  <div className="focus-stage">
   <section className="focus-timer" aria-label="Timer">
    <div role="timer" aria-label={`${Math.floor(remaining/60)} minutes ${remaining%60} seconds remaining in this block`}><PhaseRing drill={DRILLS[block.id]} seconds={block.seconds} elapsed={block.seconds-remaining} exact={previewExact} seed={previewSeed} bpm={previewBpm} running={running} limitReached={limitRemaining===0}/></div>
    <div className="focus-controls"><button className="text-button" onClick={finishEarly}>Stop &amp; reflect</button><button className="round-button" aria-label={running?"Pause":"Resume"} disabled={remaining===0} onClick={toggleTimer}>{running?<Pause/>:<Play/>}</button><button className="primary" onClick={nextBlock}>{remaining===0?(index===plan.blocks.length-1?"Finish practice":"Next block"):"Skip block"}<ChevronRight/></button></div>
    {remaining>0&&<p className="small-note">Skipping saves this as partial practice. Only timed, completed blocks count toward a full session.</p>}
    <PracticeBellControls bell={previewBell} count={previewDrill?.tempo?{bpm:previewBpm,tempo:countTempo}:undefined} cued={!!previewDrill?.cues?.length}/>
   </section>
   <section className="focus-drill"><span className="eyebrow">BLOCK {index+1} OF {plan.blocks.length} · {DRILLS[block.id].category.toUpperCase()}</span><DialogTitle>{DRILLS[block.id].name}</DialogTitle><DialogDescription className="sr-only">Plan preview. This practice will not save to your journal.</DialogDescription><DrillInstructions key={`${index}:${block.id}`} id={block.id} seconds={block.seconds} elapsed={block.seconds-remaining} gentle={readiness==="tired"} rhythm={false}/></section>
  </div>
 </div>:<>
 <DialogTitle>{screen==="setup"?"A small promise to yourself.":"You showed up."}</DialogTitle><DialogDescription>{!nowDay?"Plan preview — this practice will not save to your journal.":screen==="setup"?`${DAYS[day]} · ${plan.minutes} minutes · ${plan.focus}`:"Reflect, then let your body recover."}</DialogDescription>
 {screen==="setup"&&<><div className="setup-facts"><span><Clock3/>{plan.minutes} minutes</span><span><Leaf/>Easy effort</span><span><ShieldCheck/>Chair support welcome</span></div><p>Clear a non-slip space, set out a stable chair, and keep water nearby. Start gently. Stop if movement causes sharp or joint pain.</p><PracticeBellControls bell={previewBell}/><label className="checkbox-line"><Checkbox checked={confirmed} onCheckedChange={v=>setConfirmed(v===true)}/>I feel ready for comfortable, gentle movement.</label><div className="dialog-actions"><button className="primary" disabled={!confirmed||!plan.blocks.length} onClick={()=>{void previewBell.arm();setWallNow(Date.now());setPracticeEndsAt(Date.now()+45*60_000);setScreen("practice");deadline.current=Date.now()+remaining*1000;setRunning(true);}}><Play/>Start guided practice</button></div></>}
 {screen==="summary"&&<><div className="summary-score"><Leaf size={30}/><strong>{Math.floor(finishedSeconds/60)}m {finishedSeconds%60}s</strong><span>{recordKind==="partial"?"Partial practice — your effort still matters.":"Every block complete. Promise kept."}</span></div><label className="note-label" htmlFor="session-note">How did practice feel? <span>Optional</span></label><textarea id="session-note" value={note} onChange={e=>setNote(e.target.value)} maxLength={1000} placeholder="What felt easier? What needs a gentler option?"/><p className="small-note">Keep the next session easy if soreness carries over. Do not make up missed time.</p><div className="dialog-actions"><button className="primary" disabled={saving||(nowDay&&!loaded)} onClick={()=>void saveSession()}>{saving?"Saving…":!nowDay?"Close preview":finishedSeconds===0?"Close without recording":"Save practice"}</button></div></>}
 </>}
 </DialogContent></Dialog>
 <Dialog open={restOpen} onOpenChange={setRestOpen}><DialogContent className="dojo-dialog"><DialogTitle>Recovery is a promise, too.</DialogTitle><DialogDescription>{day===2?"Wednesday is your full rest day. No training is assigned.":"Listen to pain and let your body recover."}</DialogDescription><div className="rest-message"><Leaf size={36}/><p>{day===2?"Your streak already protects Wednesday. This optional check-in simply adds a rest entry to your journal.":"Skip today’s practice. If pain persists or affects normal movement, speak with a clinician before returning."}</p></div><label htmlFor="rest-note" className="note-label">A note to yourself <span>Optional</span></label><textarea id="rest-note" value={note} onChange={e=>setNote(e.target.value)} maxLength={1000} placeholder="Resting today. Returning when ready."/><div className="dialog-actions"><button className="primary is-rest" disabled={saving} onClick={()=>void saveRest()}>{saving?"Saving…":"Save rest check-in"}</button></div></DialogContent></Dialog>
 </>;
}
