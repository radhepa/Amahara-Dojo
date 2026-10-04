"use client";

import {BookOpen, CalendarDays, Flame, Home, Leaf, Package, ShieldCheck, Target, Users} from "lucide-react";
import {TabsList, TabsTrigger} from "@/components/ui/tabs";

const destinations = [
  {value: "hall", label: "Lantern Hall", icon: Home},
  {value: "today", label: "Today’s practice", icon: Flame},
  {value: "week", label: "Weekly rhythm", icon: CalendarDays},
  {value: "members", label: "Companions", icon: Users},
  {value: "library", label: "Techniques", icon: BookOpen},
  {value: "journey", label: "Your journey", icon: Target},
];

export const HUD_TITLES: Record<string, {title: string; subtitle: string}> = {
  today: {title: "A little stronger, gently.", subtitle: "TODAY’S PRACTICE"},
  week: {title: "Find your rhythm.", subtitle: "YOUR TRAINING WEEK"},
  members: {title: "A place among friends.", subtitle: "THE PEOPLE OF LANTERN HALL"},
  library: {title: "Begin with the basics.", subtitle: "THE TECHNIQUE LIBRARY"},
  journey: {title: "Every small step counts.", subtitle: "YOUR BEGINNER JOURNEY"},
};

export function DojoRail() {
  return <aside className="rail">
    <div className="brand"><span className="brand-mark" aria-hidden="true"><Leaf size={25}/></span><div><small>AMAHARA</small><strong>Dojo<span>.</span></strong></div></div>
    <div className="rail-label">A PLACE TO BEGIN</div>
    <TabsList className="rail-tabs" aria-label="Dojo navigation">
      {destinations.map(({value, label, icon: Icon}, i) => <TabsTrigger value={value} key={value}><Icon/><span>{label}</span><small aria-hidden="true">0{i + 1}</small></TabsTrigger>)}
    </TabsList>
    <div className="rail-bottom"><span className="rail-rule"/><Leaf size={23} aria-hidden="true"/><blockquote>Hard work<br/>is a skill.</blockquote><p>One small promise.<br/>Kept at your own pace.</p><span>LANTERN HALL · AMAHARA</span></div>
  </aside>;
}

export function DojoTopbar({tab, week, practices, supplies, today}: {tab: string; week: number; practices: number | null; supplies: number | null; today: string}) {
  const date = today ? new Date(`${today}T12:00:00Z`) : null;
  return <header className="topbar">
    <div className="hud-rank"><span className="rank-emblem"><ShieldCheck size={21}/></span><span><small>YOUR TRAINING RANK</small><strong>Level 1 <span>·</span> Beginner</strong></span></div>
    <div className="hud-resources"><span title="Completed training practices"><Flame size={17}/><strong>{practices ?? "—"}</strong><span>practices</span></span><span title="Supplies for optional hall projects"><Package size={17}/><strong>{supplies ?? "—"}</strong><span>supplies</span></span><span className="hud-season">Week {week} <span>/ 8</span></span></div>
    {tab !== "hall" && <time className="hud-date" dateTime={today || undefined}>{date?.toLocaleDateString("en-US", {month: "short", day: "numeric", timeZone: "UTC"}) ?? "Today"}</time>}
  </header>;
}
