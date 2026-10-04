"use client";
import {useEffect,useState,useRef} from "react";
import {BookOpen,ChevronLeft,X,History,Sun,Moon} from "lucide-react";
import {Dialog,DialogContent,DialogTitle,DialogDescription} from "@/components/ui/dialog";
import {CAST,LOCATIONS,characterPortrait,hallImage} from "@/lib/story/cast";
import {EPISODE_TITLES,visibleLines,SCENE_BY_ID} from "@/lib/story";
import {mainCompleted} from "@/lib/game";
import type {DojoGameApi} from "./use-dojo-game";
const styles=(id:string)=>({"--speaker-accent":CAST[id]?.accent??"#d6d8cb"}) as React.CSSProperties;
export function StoryReader({sceneId,api,onClose}:{sceneId:string|null;api:DojoGameApi;onClose:()=>void}){
 const [replayPosition,setReplayPosition]=useState(0),[back,setBack]=useState<number|null>(null),[history,setHistory]=useState(false),[readingMode,setReadingMode]=useState(false);
 const lastScene=useRef<string|null>(null);if(sceneId)lastScene.current=sceneId;
 useEffect(()=>{if(sceneId){setReplayPosition(0);setBack(null);setHistory(false);}},[sceneId]);
 const scene=lastScene.current?SCENE_BY_ID[lastScene.current]:null;const g=api.game;const saved=scene?g?.scenes[scene.id]:undefined;const replay=!!saved?.done;
 const script=scene&&g?visibleLines(scene,saved?.flags??g.flags):[];const choiceReply=scene?.choice?.options.find(o=>o.id===saved?.choice)?.reply??[];const all=[...script,...choiceReply];
 const position=back??(replay?replayPosition:saved?.position??0);const line=all[position];const showChoice=!replay&&back===null&&!!scene?.choice&&!saved?.choice&&position===script.length-1;
 async function next(){if(!scene||!g)return;if(back!==null){const max=replay?replayPosition:saved?.position??0;setBack(position+1>=max?null:position+1);return;}if(replay){if(position<all.length-1)setReplayPosition(position+1);else onClose();return;}const ok=await api.act({action:"scene",id:scene.id,operation:"advance",position});if(ok&&position===all.length-1&&(!scene.choice||saved?.choice))onClose();}
 useEffect(()=>{if(!sceneId)return;const key=(e:KeyboardEvent)=>{if((e.key===" "||e.key==="ArrowRight")&&!showChoice&&!api.saving&&!history&&!(e.target instanceof HTMLButtonElement)&&!(e.target instanceof HTMLInputElement)){e.preventDefault();void next();}};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);});
 const location=scene?LOCATIONS[scene.location]:null;const portrait=line&&!scene?.illustration?characterPortrait(line.speaker,line.expression):null;
 const backdrop=scene?.illustration??(scene?.location==="hall"&&g?hallImage(scene.kind==="main"?(scene.episode>6||(scene.episode===6&&scene.beat>=4)?33:scene.episode>=3?12:0):mainCompleted(g),scene.kind!=="main"&&g.facilities.includes("floor")):location?.image);
 return <Dialog open={!!sceneId} onOpenChange={v=>{if(!v)onClose();}}><DialogContent showCloseButton={false} className={`story-reader ${!scene?.illustration?"portrait-layout":""} ${readingMode?"reading-mode":""}`}>
 <DialogTitle className="sr-only">{scene?.title??"Story"}</DialogTitle><DialogDescription className="sr-only">An authored Dojo scene. Progress saves as you continue. {replay?"Replay preserves your original decisions.":""}</DialogDescription>
 {scene&&g&&location&&<><div className={`story-backdrop ${scene.illustration?"story-event":""}`} style={{backgroundImage:`url(${backdrop})`}}/><div className="story-shade"/>
 <header className="story-header"><div><small>{scene.kind==="main"?`EPISODE ${scene.episode} · ${EPISODE_TITLES[scene.episode-1]}`:scene.kind.toUpperCase()}</small><strong>{scene.title}</strong><span>{location.name}{replay?" · Replay":""}</span></div><div className="story-tools"><button aria-label={readingMode?"Use illustrated reading view":"Use high contrast reading view"} onClick={()=>setReadingMode(!readingMode)}>{readingMode?<Sun/>:<Moon/>}</button><button aria-label="Read scene transcript so far" onClick={()=>setHistory(!history)}><History/></button><button aria-label="Bookmark and close scene" onClick={onClose}><X/></button></div></header>
 {portrait&&!history&&<img key={portrait} className="story-character" src={portrait} alt={`${CAST[line.speaker]?.name??line.speaker}${line.expression?`, ${line.expression}`:""}`} onError={e=>{const fallback=CAST[line.speaker]?.portrait;if(fallback&&e.currentTarget.src!==new URL(fallback,locationOrigin()).href)e.currentTarget.src=fallback;}}/>}
 {history?<section className="story-transcript"><h2>Scene so far</h2>{all.slice(0,(replay?all.length: saved?.position??0)+1).map((l,i)=><p key={i}><strong>{CAST[l.speaker]?.name}</strong>{l.text}</p>)}<button className="secondary" onClick={()=>setHistory(false)}>Return to scene</button></section>:<section className="story-dialogue" style={styles(line?.speaker??"narrator")}>
 <div className="story-dialogue-top"><span className="story-speaker">{CAST[line?.speaker??""]?.name||"Lantern Hall"}</span><small>{position+1} / {all.length}{back!==null?" · Looking back":""}</small></div>
 <p key={`${scene.id}-${position}`} className={line?.speaker==="narrator"?"narration":""}>{line?.text}</p>
 {api.error&&<div className="game-error" role="alert">{api.error} Your place is kept; try the same action again.</div>}
 {showChoice?<div className="story-choices"><strong>{scene.choice!.prompt}</strong>{scene.choice!.options.map(o=>{const unavailable=scene.kind==="relationship"&&o.id==="romance"&&g.flags.romance!=="none"&&g.flags.romance!==scene.member;return <button disabled={api.saving||unavailable} key={o.id} onClick={()=>void api.act({action:"scene",id:scene.id,operation:"choose",option:o.id})}>{o.label}{unavailable&&<small>Another romantic invitation is already chosen.</small>}</button>;})}</div>:<div className="story-controls"><button className="text-button" disabled={position===0||api.saving} onClick={()=>setBack(Math.max(0,position-1))}><ChevronLeft size={16}/>Back</button><span>{replay?"Original choices · no additional rewards":"Your reading place saves automatically"}</span><button className="primary" disabled={api.saving} onClick={()=>void next()}>{api.saving?"Saving…":position===all.length-1?(replay?"Close replay":"Finish scene"):back!==null?"Continue reading":"Continue"}</button></div>}
 </section>}
 </>}
 </DialogContent></Dialog>;
}
function locationOrigin(){return typeof window==="undefined"?"http://localhost":window.location.origin;}
