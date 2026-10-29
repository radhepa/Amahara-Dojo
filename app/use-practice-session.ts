"use client";
import {useEffect,useRef,useState} from "react";

// Keeps the display on while a practice block is timing. Browsers drop the lock when the page is
// hidden, so it is requested again each time the page becomes visible.
export function useWakeLock(active:boolean){
 const [held,setHeld]=useState(false);
 useEffect(()=>{
  const wakeLock=(navigator as Navigator&{wakeLock?:WakeLock}).wakeLock;
  if(!active||!wakeLock)return;
  let lock:WakeLockSentinel|null=null,stopped=false;
  const request=async()=>{
   if(stopped||document.hidden||lock)return;
   try{const next=await wakeLock.request("screen");if(stopped){void next.release();return;}lock=next;setHeld(true);next.addEventListener("release",()=>{if(lock===next){lock=null;setHeld(false);}});}
   catch{setHeld(false);}
  };
  const visible=()=>{if(!document.hidden)void request();};
  void request();document.addEventListener("visibilitychange",visible);
  return()=>{stopped=true;document.removeEventListener("visibilitychange",visible);void lock?.release().catch(()=>{});lock=null;setHeld(false);};
 },[active]);
 return held;
}

// Practice shortcuts: Space, N, C and B. Keys pressed on a focused button, field or link keep their
// normal meaning, so a shortcut never fires twice or replaces the control the player chose.
export const PRACTICE_KEYS="Space pause or resume · N next block · C confirm the block · B bell on or off";
export function usePracticeKeys(active:boolean,keys:{space?:()=>void;next?:()=>void;confirm?:()=>void;bell?:()=>void}){
 const latest=useRef(keys);
 useEffect(()=>{latest.current=keys;});
 useEffect(()=>{
  if(!active)return;
  const onKey=(event:KeyboardEvent)=>{
   if(event.repeat||event.altKey||event.ctrlKey||event.metaKey)return;
   const target=event.target as HTMLElement|null;
   if(target?.closest("input,textarea,select,button,a,[role=checkbox],[role=radio],[contenteditable=true]"))return;
   const key=event.key.toLowerCase();
   const run=key===" "?latest.current.space:key==="n"||key==="arrowright"?latest.current.next:key==="c"?latest.current.confirm:key==="b"?latest.current.bell:undefined;
   if(run){event.preventDefault();run();}
  };
  window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);
 },[active]);
}
