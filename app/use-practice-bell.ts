"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import type {Drill} from "@/lib/training";
import {bellCues} from "@/lib/practice-timing";

// A locally synthesized bell: no network request or media permission needed.
export function soundBell(context:AudioContext,when:number,finish=false){
 const tones: {node:OscillatorNode;when:number}[]=[];
 for(let strike=0;strike<(finish?2:1);strike++){
  const start=when+strike*.38;
  for(const [hz,volume,decay] of [[880,.15,1.1],[1760,.055,.75],[2354,.025,.45]]){
   const oscillator=context.createOscillator(),gain=context.createGain();
   oscillator.type="sine";oscillator.frequency.value=hz;
   gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+decay);
   oscillator.connect(gain);gain.connect(context.destination);oscillator.start(start);oscillator.stop(start+decay+.02);
   oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};tones.push({node:oscillator,when});
  }
 }
 return tones;
}

export function usePracticeBell({blockKey,drill,seconds,elapsed,running,limitRemaining=null}:{blockKey:string;drill:Drill|undefined;seconds:number;elapsed:number;running:boolean;limitRemaining?:number|null}){
 const [enabled,setEnabled]=useState(true),[unlocked,setUnlocked]=useState(false),[message,setMessage]=useState("");
 const context=useRef<AudioContext|null>(null),used=useRef(elapsed),limit=useRef(limitRemaining),pending=useRef<ReturnType<typeof soundBell>>([]);
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
  // Schedule on the audio clock, so a background tab's slow UI ticks don't delay the bell.
  const from=used.current;
  const ceiling=limit.current??Infinity;
  if(running)for(const cue of bellCues(drill,seconds))if(cue.at>from&&cue.at-from<ceiling)pending.current.push(...soundBell(audio,audio.currentTime+cue.at-from,cue.finish));
  if(ceiling>0&&Number.isFinite(ceiling))pending.current.push(...soundBell(audio,audio.currentTime+ceiling,true));
  return()=>cancel();
 },[blockKey,drill,seconds,running,enabled,unlocked,limitActive,cancel]);
 useEffect(()=>()=>{cancel(true);void context.current?.close();},[cancel]);
 return {enabled,unlocked,message,arm,test,toggle};
}
