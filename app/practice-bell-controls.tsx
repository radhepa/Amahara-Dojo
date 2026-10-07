"use client";
import {Bell,BellOff,Minus,Plus} from "lucide-react";
import type {usePracticeBell,useCountOffset} from "./use-practice-bell";

export function PracticeBellControls({bell,count,cued=false}:{bell:ReturnType<typeof usePracticeBell>;count?:{bpm:number;tempo:ReturnType<typeof useCountOffset>};cued?:boolean}){
 return <div className="practice-bell"><div className="bell-buttons"><button className="secondary" type="button" aria-pressed={bell.enabled} onClick={bell.toggle}>{bell.enabled?<Bell size={17}/>:<BellOff size={17}/>}Bell {bell.enabled?"on":"off"}</button><button className="text-button" type="button" onClick={()=>void bell.test()}>Test bell</button></div>
  {count&&count.bpm>0&&<div className="count-tempo" role="group" aria-label="Steady count tempo"><span>Count <strong>{count.bpm}</strong> per minute</span><button type="button" className="icon-button" aria-label="Slower count" onClick={count.tempo.slower}><Minus size={15}/></button><button type="button" className="icon-button" aria-label="Faster count" onClick={count.tempo.faster}><Plus size={15}/></button>{count.tempo.offset!==0&&<button type="button" className="text-button" onClick={count.tempo.reset}>Reset</button>}</div>}
  <p className="small-note">One ring: change phase. Two rings: block finished; stop and confirm.{cued?" Cue calls: a high ping, a low knock or a double ping, also shown on screen.":""}{count&&count.bpm>0?" Soft ticks keep the steady count; the louder tick is count one.":""} Keep this page open and your device awake. {bell.enabled&&!bell.unlocked?"Test the bell to enable sound for a resumed session.":""}</p>{bell.message&&<p role="status" className="small-note">{bell.message}</p>}</div>;
}
