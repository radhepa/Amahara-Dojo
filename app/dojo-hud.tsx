"use client";

import type {CSSProperties} from "react";
import {Flame, Package, Settings2} from "lucide-react";
import {TabsList, TabsTrigger} from "@/components/ui/tabs";

const destinations = [
  {value: "hall", label: "Hall"},
  {value: "train", label: "Train"},
  {value: "story", label: "Story"},
  {value: "members", label: "Companions"},
  {value: "journey", label: "Journey"},
];

// Each founder's ink matches their outfit in the portrait art.
export const MEMBER_INK: Record<string, string> = {akari: "#8cc79a", ren: "#f08a64", sora: "#9db6ea", daichi: "#d9bf85", yuzu: "#d59bcb"};
export const memberInk = (id: string | undefined) => (id && MEMBER_INK[id]) || "#e8b865";
export const inkStyle = (id: string | undefined) => ({"--ink": memberInk(id)} as CSSProperties);

export function DojoTopbar({practices, supplies, stage}: {practices: number | null; supplies: number | null; stage: string}) {
  return <header className="hud-bar">
    <div className="hud-brand"><span className="hud-seal" aria-hidden="true">道</span><strong>Dojo</strong></div>
    <TabsList className="hud-tabs" aria-label="Dojo navigation">
      {destinations.map(({value, label}) => <TabsTrigger value={value} key={value}>{label}</TabsTrigger>)}
    </TabsList>
    <div className="hud-resources">
      <span className="hud-chip" title="Completed training practices"><Flame aria-hidden="true"/><strong key={`practices-${practices}`}>{practices ?? "—"}</strong><span>practices</span></span>
      <span className="hud-chip" title="Supplies for optional hall projects"><Package aria-hidden="true"/><strong key={`supplies-${supplies}`}>{supplies ?? "—"}</strong><span>supplies</span></span>
      <span className="hud-chip hud-rank" title="Your current chapter. It records practice, not rank.">{stage}</span>
      <TabsList className="hud-settings-list" aria-label="Settings"><TabsTrigger value="settings" className="hud-icon-button" aria-label="Settings" title="Settings"><Settings2 aria-hidden="true"/></TabsTrigger></TabsList>
    </div>
  </header>;
}

export function ScreenHead({eyebrow, title, lede, children}: {eyebrow: string; title: string; lede?: string; children?: React.ReactNode}) {
  return <div className="screen-head">
    <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{lede && <p className="lede">{lede}</p>}</div>
    {children}
  </div>;
}
