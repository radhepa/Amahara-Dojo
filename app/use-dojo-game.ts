"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import type {GameState} from "@/lib/game";
export function useDojoGame(){
 const [game,setGame]=useState<GameState|null>(null),[saving,setSaving]=useState(false),[error,setError]=useState("");const clockOffset=useRef(0),revision=useRef(-1),queue=useRef<Promise<unknown>>(Promise.resolve()),pending=useRef(0);
 const accept=useCallback((b:{game:GameState;serverTime:number;revision:number})=>{clockOffset.current=b.serverTime-Date.now();if(b.revision>=revision.current){revision.current=b.revision;setGame(b.game);}},[]);
 const load=useCallback(async()=>{try{const r=await fetch("/api/game",{cache:"no-store"});const b=await r.json() as {game:GameState;serverTime:number;revision:number;error?:string};if(!r.ok)throw new Error(b.error);accept(b);setError("");}catch(e){setError(e instanceof Error?e.message:"Could not load your dojo.");}},[accept]);
 useEffect(()=>{void load();const focus=()=>void load();window.addEventListener("focus",focus);const t=setInterval(focus,60000);return()=>{clearInterval(t);window.removeEventListener("focus",focus);};},[load]);
 const act=useCallback((body:object,endpoint="/api/game")=>{pending.current++;setSaving(true);const operation=queue.current.catch(()=>{}).then(async()=>{try{const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const b=await r.json() as {game:GameState;serverTime:number;revision:number;error?:string};if(!r.ok)throw new Error(b.error);accept(b);setError("");return true;}catch(e){setError(e instanceof Error?e.message:"Could not save. Please retry.");return false;}finally{pending.current--;if(pending.current===0)setSaving(false);}});queue.current=operation;return operation;},[accept]);
 return {game,saving,error,load,act,now:()=>Date.now()+clockOffset.current};
}
export type DojoGameApi=ReturnType<typeof useDojoGame>;
