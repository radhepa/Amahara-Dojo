"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import type {CueTone,Drill} from "@/lib/training";
import {bellCues} from "@/lib/practice-timing";
import {COUNT_TEMPO_RANGE,countBeats,countTempo,cueSchedule} from "@/lib/blocks";

type Tone = {node:OscillatorNode;when:number};
function tone(context:AudioContext,start:number,hz:number,volume:number,decay:number,type:OscillatorType="sine"):Tone{
 const oscillator=context.createOscillator(),gain=context.createGain();
 oscillator.type=type;oscillator.frequency.value=hz;
 gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.006);gain.gain.exponentialRampToValueAtTime(.0001,start+decay);
 oscillator.connect(gain);gain.connect(context.destination);oscillator.start(start);oscillator.stop(start+decay+.02);
 oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
 return {node:oscillator,when:start};
}

// A locally synthesized bell: no network request or media permission needed.
export function soundBell(context:AudioContext,when:number,finish=false){
 const tones:Tone[]=[];
 for(let strike=0;strike<(finish?2:1);strike++){
  const start=when+strike*.38;
  for(const [hz,volume,decay] of [[880,.15,1.1],[1760,.055,.75],[2354,.025,.45]])tones.push({...tone(context,start,hz,volume,decay),when});
 }
 return tones;
}
// Cue calls: three short sounds that are easy to tell apart from the phase bell.
export function soundCue(context:AudioContext,when:number,kind:CueTone){
 if(kind==="low")return [tone(context,when,330,.2,.28,"triangle"),tone(context,when,165,.08,.22,"triangle")];
 if(kind==="double")return [tone(context,when,1046,.13,.14),tone(context,when+.16,1046,.13,.14)];
 return [tone(context,when,1318,.14,.2)];
}
// The steady count: a soft woodblock-like tick, louder on the accent.
export function soundTick(context:AudioContext,when:number,accent:boolean){
 return [tone(context,when,accent?1568:1175,accent?.11:.06,.07,"triangle")];
}

export function useCountOffset(){
 const [offset,setOffset]=useState(0);
 useEffect(()=>{try{const value=Number(localStorage.getItem("dojo.count-offset")??0);if(Number.isFinite(value))setOffset(Math.max(-24,Math.min(24,value)));}catch{}},[]);
 const change=useCallback((delta:number)=>setOffset(previous=>{const next=Math.max(-24,Math.min(24,previous+delta));try{localStorage.setItem("dojo.count-offset",String(next));}catch{}return next;}),[]);
 return {offset,slower:()=>change(-4),faster:()=>change(4),reset:()=>change(-offset)};
}
export function countFor(drill:Drill|undefined,offset:number){return drill?.tempo?countTempo(drill,offset):0;}
export const COUNT_LIMITS = COUNT_TEMPO_RANGE;

export function usePracticeBell({blockKey,drill,seconds,elapsed,running,limitRemaining=null,seed="",bpm=0}:{blockKey:string;drill:Drill|undefined;seconds:number;elapsed:number;running:boolean;limitRemaining?:number|null;seed?:string;bpm?:number}){
 const [enabled,setEnabled]=useState(true),[unlocked,setUnlocked]=useState(false),[message,setMessage]=useState("");
 const context=useRef<AudioContext|null>(null),used=useRef(elapsed),limit=useRef(limitRemaining),pending=useRef<Tone[]>([]);
 used.current=elapsed;limit.current=limitRemaining;
 const limitActive=limitRemaining!==null;
 useEffect(()=>{try{setEnabled(localStorage.getItem("dojo.timer-bell")!=="off");}catch{}},[]);
 const cancel=useCallback((all=false)=>{const now=context.current?.currentTime??0;for(const tone of pending.current){if(all||tone.when>now){try{tone.node.stop();}catch{}}}pending.current=[];},[]);
 const arm=useCallback(async()=>{
  try{
   const Audio=window.AudioContext??(window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext;
   if(!context.current||context.current.state==="closed")context.current=new Audio();
   await context.current.resume();
   if(context.current.state!=="running")throw new Error("Audio suspended");
   setUnlocked(true);setMessage("");return context.current;
  }catch{setMessage("Sound could not start. Use Test bell again and check your device volume. The visual timer still works.");return null;}
 },[]);
 const test=useCallback(async()=>{const audio=await arm();if(audio)soundBell(audio,audio.currentTime+.02,true);},[arm]);
 const toggle=useCallback(()=>{
  const next=!enabled;setEnabled(next);try{localStorage.setItem("dojo.timer-bell",next?"on":"off");}catch{}
  if(next)void arm();else cancel(true);
 },[enabled,arm,cancel]);
 useEffect(()=>{
  cancel();
  const audio=context.current;
  if(!enabled||!unlocked||!drill||!audio)return;
  // Schedule on the audio clock, so a background tab's slow UI ticks don't delay the bell,
  // the cue calls or the steady count.
  const from=used.current;
  const ceiling=limit.current??Infinity;
  const at=(t:number)=>audio.currentTime+t-from;
  const ahead=(t:number)=>t>from&&t-from<ceiling;
  if(running){
   for(const cue of bellCues(drill,seconds))if(ahead(cue.at))pending.current.push(...soundBell(audio,at(cue.at),cue.finish));
   if(drill.cues?.length)for(const cue of cueSchedule(drill,seconds,seed))if(ahead(cue.at))pending.current.push(...soundCue(audio,at(cue.at),drill.cues[cue.cue].tone));
   if(bpm)for(const beat of countBeats(drill,seconds,bpm))if(ahead(beat.at))pending.current.push(...soundTick(audio,at(beat.at),beat.accent));
  }
  if(ceiling>0&&Number.isFinite(ceiling))pending.current.push(...soundBell(audio,audio.currentTime+ceiling,true));
  return()=>cancel();
 },[blockKey,drill,seconds,running,enabled,unlocked,limitActive,cancel,seed,bpm]);
 useEffect(()=>()=>{cancel(true);void context.current?.close();},[cancel]);
 return {enabled,unlocked,message,arm,test,toggle};
}
