"use client";

import {useEffect, useState, useRef} from "react";
import {X, History, Sun, Moon, Gauge, Volume2, VolumeX, Sparkles} from "lucide-react";
import {Dialog, DialogContent, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {CAST, LOCATIONS, characterPortrait, hallImage} from "@/lib/story/cast";
import {EPISODE_TITLES, visibleLines, SCENE_BY_ID,pilotLines} from "@/lib/story";
import {mainCompleted} from "@/lib/game";
import {DIALOGUE_SPEEDS, type DialogueSpeed} from "@/lib/dialogue";
import {useDialogueReveal, useDialogueSound} from "./use-dialogue-reveal";
import type {DojoGameApi} from "./use-dojo-game";

const speakerInk: Record<string, string> = {akari:"#efba8c",ren:"#fa9276",sora:"#bbc7fa",daichi:"#e9c690",yuzu:"#e4b8ef"};
const styles = (id:string) => ({"--speaker-accent":speakerInk[id]??"#efd6a3"}) as React.CSSProperties;

export function StoryReader({sceneId,api,onClose}:{sceneId:string|null;api:DojoGameApi;onClose:()=>void}) {
  const [replayPosition,setReplayPosition] = useState(0), [back,setBack] = useState<number|null>(null);
  const [history,setHistory] = useState(false), [readingMode,setReadingMode] = useState(false);
  const [speed,setSpeed] = useState<DialogueSpeed>("steady");
  const [memory,setMemory]=useState("");
  const lastScene = useRef<string|null>(null), actionPending = useRef(false), reader = useRef<HTMLDivElement>(null);
  if (sceneId) lastScene.current = sceneId;
  useEffect(() => {if (sceneId) {setReplayPosition(0);setBack(null);setHistory(false);setMemory("");}}, [sceneId]);
  useEffect(()=>{if(!memory)return;const timer=setTimeout(()=>setMemory(""),5000);return()=>clearTimeout(timer);},[memory]);
  useEffect(() => {
    try {const value = localStorage.getItem("dojo.dialogue.speed");if (DIALOGUE_SPEEDS.includes(value as DialogueSpeed)) setSpeed(value as DialogueSpeed);} catch {}
  }, []);

  const scene = lastScene.current ? SCENE_BY_ID[lastScene.current] : null;
  const g = api.game, saved = scene ? g?.scenes[scene.id] : undefined, replay = !!saved?.done;
  const script = scene && g ? scene.revision?pilotLines(scene,saved?.flags??g.flags,saved?.choices):visibleLines(scene,saved?.flags??g.flags) : [];
  const choiceReply = scene?.choice?.options.find(o=>o.id===saved?.choice)?.reply??[];
  const all = [...script,...choiceReply];
  const savedPosition=scene?.revision&&saved?.passageId?Math.max(0,script.findIndex(l=>l.id===saved.passageId)):saved?.position??0;
  const position = back??(replay?replayPosition:savedPosition), line = all[position];
  const currentChoice=scene?.revision?line?.decision:scene?.choice;
  const showChoice = !replay && back===null && !!currentChoice && (scene?.revision?!saved?.choices?.[currentChoice.flag]:!saved?.choice&&position===script.length-1);
  const reveal = useDialogueReveal(line?.text??"",`${scene?.id}-${position}`,!!sceneId,speed);
  const sound = useDialogueSound(!!sceneId);
  useEffect(() => {
    if (!history && !reveal.complete && !reveal.reducedMotion && /[\p{L}\p{N}]$/u.test(reveal.visible)) sound.tick(line?.speaker??"narrator");
  }, [reveal.count,reveal.complete,reveal.reducedMotion,reveal.visible,history,line?.speaker,sound.tick]);

  function changeSpeed() {
    const next = DIALOGUE_SPEEDS[(DIALOGUE_SPEEDS.indexOf(speed)+1)%DIALOGUE_SPEEDS.length];
    setSpeed(next);
    try {localStorage.setItem("dojo.dialogue.speed",next);} catch {}
  }
  async function next() {
    if (!scene || !g || api.saving || actionPending.current) return;
    if (!reveal.complete) {reveal.finish();return;}
    if (showChoice) return;
    if (back!==null) {const max=replay?replayPosition:savedPosition;setBack(position+1>=max?null:position+1);return;}
    if (replay) {if (position<all.length-1) setReplayPosition(position+1);else onClose();return;}
    actionPending.current = true;
    try {
      const ok = await api.act({action:"scene",id:scene.id,operation:"advance",position,...(scene.revision?{passageId:line?.id}:{})});
      if (ok && position===all.length-1 && (!scene.choice||saved?.choice)) onClose();
    } finally {actionPending.current = false;}
  }
  async function choose(option:string) {
    if (!scene || !reveal.complete || api.saving || actionPending.current) return;
    actionPending.current=true;
    try {const ok=await api.act({action:"scene",id:scene.id,operation:"choose",option,...(scene.revision?{passageId:line?.id,decision:currentChoice?.flag}:{})});if(ok){const cue=currentChoice?.options.find(o=>o.id===option)?.memory;if(cue)setMemory(cue);}}
    finally {actionPending.current=false;}
  }
  useEffect(() => {
    if (!sceneId) return;
    const key = (event:KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.repeat || history || target.closest("button,input,textarea,select,a,[contenteditable=true]")) return;
      if ([" ","Enter","ArrowRight"].includes(event.key) && (!showChoice||!reveal.complete)) {event.preventDefault();void next();}
    };
    window.addEventListener("keydown",key);
    return () => window.removeEventListener("keydown",key);
  });

  const locationId=line?.location??scene?.location;
  const location = locationId ? LOCATIONS[locationId] : null;
  const illustration=line?.illustration??scene?.illustration;
  const performer=line?.performance?.speaker??line?.speaker,expression=line?.performance?.expression??line?.expression;
  const portrait = performer && !illustration ? characterPortrait(performer,expression) : null;
  const backdrop = illustration??(locationId==="hall"&&g?hallImage(scene?.kind==="main"?(scene.episode>6||(scene.episode===6&&scene.beat>=4)?33:scene.episode>=3?12:0):mainCompleted(g),scene?.kind!=="main"&&g.facilities.includes("floor")):location?.image);
  return <Dialog open={!!sceneId} onOpenChange={value=>{if(!value)onClose();}}>
    <DialogContent ref={reader} tabIndex={-1} onOpenAutoFocus={event=>{event.preventDefault();reader.current?.focus();}} showCloseButton={false} className={`story-reader ${!illustration?"portrait-layout":""} ${readingMode?"reading-mode":""} ${reveal.complete?"line-ready":"line-speaking"}`}>
      <DialogTitle className="sr-only">{scene?.title??"Story"}</DialogTitle>
      <DialogDescription className="sr-only">Space or Enter reveals the current line, then continues. Progress saves when you continue. {replay?"Replay preserves your original decisions.":""}</DialogDescription>
      {scene&&g&&location&&<>
        <div key={backdrop} className={`story-backdrop ${illustration?"story-event":""}`} style={{backgroundImage:`url(${backdrop})`}}/>
        <div className="story-shade"/><div className="story-vignette" aria-hidden="true"/>
        <header className="story-header"><div><small>{scene.revision?scene.kind==="main"?`WEEK ONE · EPISODE ${scene.beat} / 6`:scene.kind==="opening"?scene.optional?"FILLER · OPTIONAL":"BEFORE PRACTICE":"WELCOME":scene.kind==="main"?g.storyRevision?`STORY WEEK ${scene.episode} · SCENE ${scene.beat} / 6`:`EPISODE ${scene.episode} · ${EPISODE_TITLES[scene.episode-1]}`:scene.kind.toUpperCase()}</small><strong>{scene.title}</strong><span>{location.name}{scene.readingMinutes?` · ${scene.readingMinutes} min`:""}{replay?" · Replay":""}</span></div>
          <div className="story-tools">
            <button className="story-speed" aria-label={`Text speed: ${speed}. Change text speed`} title="Cycle text speed" onClick={changeSpeed}><Gauge/><span>{speed}</span></button>
            <button aria-label={sound.enabled?"Mute dialogue sounds":"Enable dialogue sounds"} aria-pressed={sound.enabled} onClick={sound.toggle}>{sound.enabled?<Volume2/>:<VolumeX/>}</button>
            <button aria-label={readingMode?"Use illustrated reading view":"Use high contrast reading view"} aria-pressed={readingMode} onClick={()=>setReadingMode(!readingMode)}>{readingMode?<Sun/>:<Moon/>}</button>
            <button aria-label="Read scene transcript so far" aria-pressed={history} onClick={()=>setHistory(!history)}><History/></button>
            <button aria-label="Bookmark and close scene" onClick={onClose}><X/></button>
          </div>
        </header>
        {memory&&<div className="story-memory" role="status">{memory}</div>}
        {line?.heading&&!history&&<div className="story-scene-heading" key={line.id}>{line.heading}</div>}
        {portrait&&!history&&<div key={portrait} className="story-performer"><img className="story-character" src={portrait} alt={`${CAST[performer!]?.name??performer}${expression?`, ${expression}`:""}`} onError={event=>{const fallback=CAST[performer!]?.portrait;if(fallback&&event.currentTarget.src!==new URL(fallback,window.location.origin).href)event.currentTarget.src=fallback;}}/></div>}
        {history?<section className="story-transcript"><span className="eyebrow">YOUR READING JOURNAL</span><h2>Scene so far</h2>{all.slice(0,(replay?all.length:savedPosition)+1).map((item,i)=><p key={item.id??i}><strong>{CAST[item.speaker]?.name}</strong>{item.text}</p>)}<button className="secondary" onClick={()=>setHistory(false)}>Return to scene</button></section>:
          <section className="story-dialogue" style={styles(line?.speaker??"narrator")}>
            <div className="story-dialogue-top"><span className="story-speaker"><Sparkles size={16}/>{CAST[line?.speaker??""]?.name||"Lantern Hall"}</span><small>{String(position+1).padStart(2,"0")} / {String(all.length).padStart(2,"0")}{back!==null?" · Looking back":""}</small></div>
            <p className={`story-line ${line?.speaker==="narrator"?"narration":""} ${reveal.complete?"is-written":"is-writing"}`} onClick={()=>{if(!reveal.complete)reveal.finish();}}>
              <span className="sr-only" aria-live="polite" aria-atomic="true" key={`${scene.id}-${position}`}>{line?.text}</span>
              <span aria-hidden="true"><span className="written-text">{reveal.visible}</span><span className="unwritten-text">{reveal.hidden}</span></span>
            </p>
            {api.error&&<div className="game-error" role="alert">{api.error} Your place is kept; try the same action again.</div>}
            {showChoice&&reveal.complete?<div className="story-choices">{!scene.revision&&<strong>{currentChoice!.prompt}</strong>}{currentChoice!.options.map((option,i)=>{const unavailable=scene.kind==="relationship"&&option.id==="romance"&&g.flags.romance!=="none"&&g.flags.romance!==scene.member;return <button disabled={api.saving||unavailable} key={option.id} onClick={()=>void choose(option.id)}><span className="choice-number" aria-hidden="true">{String(i+1).padStart(2,"0")}</span><span>{option.label}{unavailable&&<small>Another romantic invitation is already chosen.</small>}</span></button>;})}</div>:
              <div className="story-controls"><button className="text-button" disabled={position===0||api.saving} onClick={()=>setBack(Math.max(0,position-1))}>Previous line</button><span className="dialogue-hint">{!reveal.complete?<><span className="writing-dots" aria-hidden="true"><i/><i/><i/></span>Click the text or press Space to reveal</>:replay?"Replay · your original choices":"Space to continue · your place is saved"}</span><button className="primary" disabled={api.saving} onClick={event=>{if(event.detail<2)void next();}}>{api.saving?"Saving…":!reveal.complete?"Reveal line":position===all.length-1?(replay?"Close replay":"Finish scene"):back!==null?"Continue reading":"Continue"}<span className={`advance-glyph ${reveal.complete?"ready":""}`} aria-hidden="true">◆</span></button></div>}
          </section>}
      </>}
    </DialogContent>
  </Dialog>;
}
