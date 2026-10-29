"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import type {GameState} from "@/lib/game";
type GameResponse={game:GameState;serverTime:number;revision:number;error?:string};
// A non-JSON failure (a proxy page or a crashed local server) still gets a readable message.
async function readJson(r:Response,fallback:string){try{return await r.json() as GameResponse;}catch{throw new Error(r.ok?fallback:`${fallback} (error ${r.status})`);}}
export function useDojoGame(){
 const [game,setGame]=useState<GameState|null>(null),[saving,setSaving]=useState(false),[error,setError]=useState("");const clockOffset=useRef(0),bestTrip=useRef({rtt:Infinity,at:0}),revision=useRef(-1),queue=useRef<Promise<unknown>>(Promise.resolve()),pending=useRef(0);
 // Timers follow the server clock. Keep the estimate from the quickest recent round trip, so a
 // slow save cannot shift on-screen time against the bells already scheduled.
 const accept=useCallback((b:GameResponse,sent:number,received:number)=>{const rtt=received-sent;if(rtt<=bestTrip.current.rtt||received-bestTrip.current.at>300_000){bestTrip.current={rtt,at:received};clockOffset.current=b.serverTime-(sent+received)/2;}if(b.revision>=revision.current){revision.current=b.revision;setGame(b.game);}},[]);
 const load=useCallback(async()=>{try{const sent=Date.now();const r=await fetch("/api/game",{cache:"no-store"});const b=await readJson(r,"Could not load your dojo.");if(!r.ok)throw new Error(b.error??"Could not load your dojo.");accept(b,sent,Date.now());setError("");}catch(e){setError(e instanceof Error?e.message:"Could not load your dojo.");}},[accept]);
 useEffect(()=>{void load();const focus=()=>void load();const poll=()=>{if(!document.hidden)void load();};window.addEventListener("focus",focus);const t=setInterval(poll,60000);return()=>{clearInterval(t);window.removeEventListener("focus",focus);};},[load]);
 const act=useCallback((body:object,endpoint="/api/game")=>{pending.current++;setSaving(true);const operation=queue.current.catch(()=>{}).then(async()=>{try{const sent=Date.now();const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const b=await readJson(r,"Could not save. Please retry.");if(!r.ok)throw new Error(b.error??"Could not save. Please retry.");accept(b,sent,Date.now());setError("");return true;}catch(e){setError(e instanceof Error?e.message:"Could not save. Please retry.");return false;}finally{pending.current--;if(pending.current===0)setSaving(false);}});queue.current=operation;return operation;},[accept]);
 const clearError=useCallback(()=>setError(""),[]);
 return {game,saving,error,load,act,clearError,now:()=>Date.now()+clockOffset.current};
}
export type DojoGameApi=ReturnType<typeof useDojoGame>;
