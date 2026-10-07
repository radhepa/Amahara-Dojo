import {CHAPTERS,STORY_READY_CHAPTERS} from "@/lib/curriculum";
// Story column stays spoiler-light: the same chapter themes as docs/roadmap.md.
const STORY:readonly (readonly [string,string])[]=[
 ["Belonging and rebuilding","Authored scenes, bonds and small projects."],
 ["Responsibility beyond the hall","New apprentices; strike drills with guard-return checks."],
 ["Teachers and inherited expectations","Defensive drills and defense-into-counter pairs."],
 ["Rivalry and public pressure","Supported balance and low, controlled kicks."],
 ["Promises across different lives","Timed shadow rounds and combination menus."],
 ["Travel and competing loyalties","Small-space sessions, bodyweight strength, the first solo form."],
 ["Reputation and accountability","A longer solo form and bell-cued reaction drills."],
 ["Revelations and lasting costs","Longer rounds, breathing and composure work."],
 ["Confrontation and sacrifice","A steady-count mode and integrated sessions."],
 ["Resolution and legacy","Build-your-own sessions, maintenance plans, continuing practice."],
];
export default function DojoRoadmap(){return <section className="panel dojo-roadmap"><span className="eyebrow">THE LONGER JOURNEY</span><h2>A chapter for each stage</h2><p>Every chapter is solo: no partner, instructor or sparring is ever required. A chapter's training opens together with its story. Finishing a story never certifies technique.</p><div className="roadmap-table"><table><thead><tr><th>Chapter</th><th>Training</th><th>Story & future features</th></tr></thead><tbody>{CHAPTERS.map((c,i)=><tr key={c.chapter}><td>{c.chapter}<small>{c.chapter<=STORY_READY_CHAPTERS?"Playable":"Planned"}</small></td><td>{c.phase}<small>{c.weeks} weeks</small></td><td><strong>{STORY[i][0]}</strong><span>{STORY[i][1]}</span></td></tr>)}</tbody></table></div><p>Sixty-eight weeks and 408 practices in all, at your own pace. Milestones record practice and self-review; logged time and game rewards cannot certify punches, kicks or performance against another person.</p></section>;}
