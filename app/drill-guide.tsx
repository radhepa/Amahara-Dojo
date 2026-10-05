"use client";
import {useEffect,useId,useState} from "react";
import {Play,Pause,Leaf,ShieldCheck,Check} from "lucide-react";
import {DRILLS} from "@/lib/training";
import {practicePhase,roundTiming,type PracticeMode} from "@/lib/week-one";

// Coaching diagrams: each frame illustrates one position, rather than implying
// that a rapid looping animation is the speed at which someone should practice.
const FRAMES:Record<string,{title:string;text:string}[]>={
 warm:[{title:"Loosen your shoulders",text:"Small shoulder circles; let your hands relax."},{title:"Move gently",text:"Walk in place without bouncing. Seated: lift one heel at a time."},{title:"Find the middle",text:"Feet comfortably apart, knees soft, eyes ahead."}],
 stance:[{title:"Start with space",text:"Feet about hip-width apart, each on its own track."},{title:"Make a short stagger",text:"Move one foot a small step back. Keep the gap between the tracks."},{title:"Settle upright",text:"Soften your knees and look ahead. No deep bend is needed."}],
 guard:[{title:"Relax first",text:"Eyes ahead, shoulders down, elbows close to your ribs."},{title:"Bring hands home",text:"Relaxed hands beside your cheeks, without covering your view."},{title:"Lower and reset",text:"Lower your hands, then return to that same comfortable position."}],
 shift:[{title:"Find the middle",text:"Both feet grounded. Keep your head above your base."},{title:"A little forward",text:"Shift a little toward the front foot; keep the rear foot grounded."},{title:"A little backward",text:"Return through the middle, then shift gently toward the rear foot."}],
 forward:[{title:"Start on two tracks",text:"Top view: the front foot is ahead of the back foot."},{title:"Front foot first",text:"Move the front foot a few centimetres forward."},{title:"Back foot follows",text:"Move the back foot the same distance. Restore your original spacing."},{title:"Back foot first",text:"To return, move the back foot backward first."},{title:"Front foot follows",text:"Bring the front foot back the same distance. Pause in balance."}],
 side:[{title:"Keep your stance",text:"Top view: keep a short stagger and a gap between the feet."},{title:"Left foot first",text:"To go left, move the left foot first by a few centimetres."},{title:"Right foot follows",text:"Move the right foot the same distance. Keep the stagger."},{title:"Right foot first",text:"To return right, move the right foot first."},{title:"Left foot follows",text:"Move the left foot the same distance; never cross your feet."}],
 flow:[{title:"Stance and guard",text:"Start balanced. Bring relaxed hands to a comfortable guard."},{title:"One small step pair",text:"Move the foot nearest the direction first, then let the other follow."},{title:"Pause and reset",text:"Restore your spacing and guard. Pause before choosing another direction."}],
 cool:[{title:"Lower your hands",text:"Let your shoulders soften. Stand comfortably or sit."},{title:"Let breathing settle",text:"Walk very slowly or stay seated. No breath holds."},{title:"Notice one skill",text:"Choose one comfortable stance, guard, or step to revisit next time."}]
};

function Chair({x=300}:{x?:number}){return <g stroke="currentColor" strokeWidth="5" fill="none" strokeLinejoin="round"><path d={`M${x} 128v74h57v-74M${x} 202v51m57-51v51M${x} 170h57`}/></g>;}
function BodyDiagram({visual,frame,mode}:{visual:string;frame:number;mode:PracticeMode}){
 const seated=mode==="seated",support=mode==="supported",guard=visual==="guard"?frame===1:visual==="flow",shift=visual==="shift"?(frame===1?-8:frame===2?8:0):0;
 const movingFoot=visual==="warm"&&frame===1?8:visual==="flow"&&frame===1?10:0;
 const torsoX=210+shift,hipY=seated?188:160,shoulderY=seated?105:96;
 return <svg viewBox="0 0 480 290" aria-hidden="true" className="body-diagram">
  <path d="M60 262H420" className="guide-floor"/>
  {seated?<g className="diagram-support"><path d="M180 112v87h85m-85 0v59m72-59v59" stroke="currentColor" strokeWidth="5" fill="none"/></g>:support?<g className="diagram-support"><Chair x={300}/></g>:null}
  <g strokeLinecap="round" strokeLinejoin="round" fill="none">
   <circle cx={torsoX} cy={shoulderY-36} r="19" className="diagram-body"/>
   <path d={`M${torsoX-8} ${shoulderY-35}h16`} className="diagram-eyes"/>
   <path d={`M${torsoX} ${shoulderY-15}v15m-23 4h46M${torsoX} ${shoulderY}L${210} ${hipY}`} className="diagram-body"/>
   {seated?<path d={`M210 ${hipY}l-40 12 1 50m39-62 39 12 16 ${50-movingFoot}`} className="diagram-body"/>:<path d={`M210 ${hipY}l-28 44 -14 ${46-movingFoot}m42-90 25 46 18 44`} className="diagram-body"/>}
   <path d={seated?`M158 256h27m69 ${-movingFoot+256}h28`:`M154 ${256-movingFoot}h29m59 0h28`} className="diagram-feet"/>
   <path d={guard?`M${torsoX-23} ${shoulderY+4}l-12 35 12 -52`:`M${torsoX-23} ${shoulderY+4}l-8 26 -5 30`} className="diagram-body"/>
   <path d={support?`M${torsoX+23} ${shoulderY+4}l35 40 38 -9`:guard?`M${torsoX+23} ${shoulderY+4}l12 35 -12 -52`:`M${torsoX+23} ${shoulderY+4}l8 26 5 30`} className="diagram-body"/>
  </g>
  {guard&&<><circle cx={torsoX-23} cy={shoulderY-13} r="8" className="diagram-highlight"/>{!support&&<circle cx={torsoX+23} cy={shoulderY-13} r="8" className="diagram-highlight"/>}</>}
  {visual==="warm"&&frame===0&&<g className="diagram-arrow"><path d="M160 78c-22 7-22 33 0 40m-4-13 4 13-13-2M262 78c22 7 22 33 0 40m4-13-4 13 13-2"/></g>}
  {visual==="shift"&&frame>0&&<g className="diagram-arrow"><path d={frame===1?"M294 147H260m9-7-9 7 9 7":"M260 147h34m-9-7 9 7-9 7"}/></g>}
  <text x="75" y="30" className="diagram-label">{seated?"SEATED PREPARATION":support?"WITH STABLE SUPPORT":"FRONT VIEW"}</text>
  <text x="210" y="282" textAnchor="middle" className="diagram-label">{seated?"Feet supported · sit tall":"Soft knees · comfortable breathing"}</text>
 </svg>;
}

function FootDiagram({visual,frame}:{visual:string;frame:number}){
 const id=useId().replace(/:/g,"");const lateral=visual==="side",stance=visual==="stance";
 const lead={x:190,y:145},rear={x:290,y:205};
 if(stance){lead.y=175;rear.y=frame===0?175:213;}
 else if(lateral){if(frame===1)lead.x-=38;if(frame===2){lead.x-=38;rear.x-=38;}if(frame===3)lead.x-=38;}
 else {if(frame===1)lead.y-=38;if(frame===2){lead.y-=38;rear.y-=38;}if(frame===3)lead.y-=38;}
 const moving=stance?rear:frame===1||frame===4?lead:rear;const forward=stance?false:frame<=2;
 const arrowPath=lateral?`M${moving.x+(forward?38:-38)} ${moving.y-39}h${forward?-38:38}`:`M${moving.x+35} ${moving.y+(forward?38:-38)}v${forward?-38:38}`;
 return <svg viewBox="0 0 480 290" aria-hidden="true" className="foot-diagram">
  <defs><marker id={id} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7" fill="currentColor"/></marker></defs>
  <text x="240" y="30" textAnchor="middle" className="diagram-label">TOP VIEW · FACING THIS WAY</text>
  <path d="M240 74V49m-7 8 7-8 7 8" className="diagram-arrow"/>
  <path d="M190 88V271M290 88V271" className="diagram-track"/>
  <g opacity=".22"><rect x="177" y={stance?151:121} width="26" height="48" rx="11" className="diagram-lead"/><rect x="277" y={stance?151:181} width="26" height="48" rx="11" className="diagram-rear"/></g>
  <rect x={lead.x-13} y={lead.y-24} width="26" height="48" rx="11" className="diagram-lead"/>
  <rect x={rear.x-13} y={rear.y-24} width="26" height="48" rx="11" className="diagram-rear"/>
  <text x={lead.x} y={lead.y+5} textAnchor="middle" className="diagram-foot-letter">L</text><text x={rear.x} y={rear.y+5} textAnchor="middle" className="diagram-foot-letter">R</text>
  {frame>0&&<path d={arrowPath} className="diagram-arrow" markerEnd={`url(#${id})`}/>}
  <text x="64" y="133" className="diagram-label">LEFT</text><text x="64" y="155" className="diagram-label">FRONT</text><text x="325" y="204" className="diagram-label">RIGHT</text><text x="325" y="226" className="diagram-label">BACK</text>
  <text x="240" y="282" textAnchor="middle" className="diagram-label">Example: left foot leads · keep the gap</text>
 </svg>;
}

function SeatedFootDiagram({visual,frame}:{visual:string;frame:number}){
 const side=visual==="side",active=frame>0&&frame<4;
 return <svg viewBox="0 0 480 290" aria-hidden="true">
  <text x="240" y="30" textAnchor="middle" className="diagram-label">SEATED PREPARATION · FRONT VIEW</text>
  <g stroke="currentColor" strokeWidth="5" fill="none" className="diagram-support"><path d="M190 85v105h100V85M190 190v70m100-70v70"/></g>
  <g fill="none" strokeLinecap="round" className="diagram-body"><circle cx="240" cy="75" r="18"/><path d="M240 95v81m-20-59-9 35 18 15m31-50 9 35-18 15M240 176l-31 19 -6 55m37-74 31 19 6 55"/></g>
  <path d="M183 257h35m47 0h35M100 264h280" className="guide-floor"/>
  {active&&<path d={side?"M176 234h-35m8-7-8 7 8 7":"M169 227v-32m-7 9 7-9 7 9"} className="diagram-arrow"/>}
  <text x="240" y="282" textAnchor="middle" className="diagram-label">A small foot tap · return before the other foot</text>
 </svg>;
}

export function DrillGuide({id,gentle=false}:{id:string;gentle?:boolean}){
 const visual=DRILLS[id]?.visual;const [frame,setFrame]=useState(0),[playing,setPlaying]=useState(false),[mode,setMode]=useState<PracticeMode>(gentle?"seated":"standing");
 const frames=FRAMES[visual??""];
 useEffect(()=>{setFrame(0);setPlaying(false);setMode(gentle?"seated":"standing");},[id,gentle]);
 useEffect(()=>{if(!playing||!frames)return;const interval=setInterval(()=>setFrame(n=>(n+1)%frames.length),2500);return()=>clearInterval(interval);},[playing,frames]);
 if(!visual||!frames)return null;
 const footwork=visual==="forward"||visual==="side",selected=frames[frame]??frames[0];
 const adapted=mode==="seated"?footwork?"Tap one foot gently forward or to its own side, then return. Alternate feet. This rehearses the order; it does not test standing balance.":visual==="stance"?"Sit upright with feet supported and comfortably apart. Rehearse the tall posture; no standing stagger is required.":visual==="shift"?"Sit tall, feet supported. Make a tiny forward-and-back torso shift, staying within the chair seat.":visual==="flow"?"Reset your guard, make one comfortable foot tap, then pause and reset again.":null:mode==="supported"&&footwork?"Use chair-supported weight shifts with both feet planted. Shift gently toward the direction, return to the middle, then rest.":null;
 return <section className="drill-guide" aria-label={`${DRILLS[id].name} picture guide`}>
  <div className="guide-heading"><span>PICTURE GUIDE</span><button type="button" className="guide-play" aria-pressed={playing} onClick={()=>setPlaying(v=>!v)}>{playing?<Pause size={15}/>:<Play size={15}/>} {playing?"Pause guide":"Play steps"}</button></div>
  <div className="guide-modes" role="group" aria-label="Movement version">{(["standing","supported","seated"] as const).map(m=><button key={m} type="button" aria-pressed={mode===m} onClick={()=>{setMode(m);setFrame(0);setPlaying(false);}}>{m==="standing"?"Standing":m==="supported"?"Supported":"Seated preparation"}</button>)}</div>
  <figure>
   {((footwork||visual==="stance"&&frame<2)&&mode==="standing")?<FootDiagram visual={visual} frame={frame}/>:footwork&&mode==="seated"?<SeatedFootDiagram visual={visual} frame={frame}/>:<BodyDiagram visual={footwork?"shift":visual} frame={footwork?Math.min(frame,2):frame} mode={mode}/>}
   <figcaption><span className="guide-step-count">{frame+1} / {frames.length}</span><div><strong>{adapted?mode==="seated"?"Rehearse from your chair":"Shift with support":selected.title}</strong><p>{adapted??selected.text}</p></div></figcaption>
  </figure>
  <div className="guide-steps" role="group" aria-label="Guide steps">{frames.map((f,i)=><button key={f.title} type="button" aria-label={`Show step ${i+1}: ${f.title}`} aria-pressed={frame===i} onClick={()=>{setFrame(i);setPlaying(false);}}>{i+1}</button>)}</div>
  <p className="guide-note">The pictures show positions, not a required pace. Move slowly and pause whenever needed.</p>
 </section>;
}

export function DrillInstructions({id,gentle=false,seconds,elapsed}:{id:string;gentle?:boolean;seconds?:number;elapsed?:number}){
 const d=DRILLS[id];const timing=d.visual&&seconds?roundTiming(seconds):null;const phase=timing&&elapsed!==undefined?practicePhase(seconds!,elapsed):null;
 return <div className={`drill-detail ${d.visual?"has-guide":""}`}>
  <DrillGuide id={id} gentle={gentle}/>
  <div className="drill-written"><p className="cue">{d.cue}</p>
  {timing&&<div className={`practice-rhythm ${phase?.kind??""}`}>
   {phase&&<div className="round-now"><strong role="status">{phase.label}</strong><span aria-live="off">{phase.remaining}s</span></div>}
   <strong>{timing.rounds} rounds · {timing.work}s practice / {timing.rest}s rest</strong>
   <p>First minute: look at the guide and set up. Follow the rounds, then use the final {timing.review/60} minute to rest and check your form. More rest or a smaller movement is always welcome.</p>
  </div>}
  <ol>{d.steps.map(s=><li key={s}>{s}</li>)}</ol>
  {d.checkpoints&&<div className="form-checks"><strong>Check your form</strong>{d.checkpoints.map(c=><p key={c}><Check size={15}/>{c}</p>)}</div>}
  <div className="tip"><Leaf size={17}/><div><strong>Make it easier</strong><p>{d.easier}</p></div></div><div className="safety-tip"><ShieldCheck size={17}/><p>{d.avoid}</p></div></div>
 </div>;
}
