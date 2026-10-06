"use client";
import {Bell,BellOff} from "lucide-react";
import type {usePracticeBell} from "./use-practice-bell";

export function PracticeBellControls({bell}:{bell:ReturnType<typeof usePracticeBell>}){
 return <div className="practice-bell"><div className="bell-buttons"><button className="secondary" type="button" aria-pressed={bell.enabled} onClick={bell.toggle}>{bell.enabled?<Bell size={17}/>:<BellOff size={17}/>}Bell {bell.enabled?"on":"off"}</button><button className="text-button" type="button" onClick={()=>void bell.test()}>Test bell</button></div><p className="small-note">One ring: change phase. Two rings: block finished; stop and confirm. Keep this page open and your device awake. {bell.enabled&&!bell.unlocked?"Test the bell to enable sound for a resumed session.":""}</p>{bell.message&&<p role="status" className="small-note">{bell.message}</p>}</div>;
}
