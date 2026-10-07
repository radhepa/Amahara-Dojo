"use client";

import {Check, Leaf, Lock} from "lucide-react";
import {Dialog, DialogContent, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {type DojoMember} from "@/lib/dojo-members";
import {inkStyle} from "./dojo-hud";

export const memberStyle = (member: DojoMember) => inkStyle(member.id);
const BOND_TIERS = ["New acquaintance", "Familiar", "Trusted", "Close"];

export function CompanionRoster({unlocked, companion, onChoose, onProfile, bondOf}: {unlocked: DojoMember[]; companion: string; onChoose: (id: string) => void; onProfile: (member: DojoMember) => void; bondOf: (id: string) => string}) {
  const waiting = Math.max(0, 5 - unlocked.length);
  return <div className="roster">
    <button className={`roster-solo ${companion === "solo" ? "is-selected" : ""}`} aria-pressed={companion === "solo"} onClick={() => onChoose("solo")}><Leaf aria-hidden="true"/>Practise solo{companion === "solo" && <Check aria-hidden="true"/>}</button>
    <div className="roster-grid">
      {unlocked.map(member => {
        const bond = bondOf(member.id), level = Math.max(1, BOND_TIERS.indexOf(bond) + 1), selected = companion === member.id;
        return <article className={`roster-card ${selected ? "is-selected" : ""}`} key={member.id} style={memberStyle(member)}>
          <button className="roster-art" onClick={() => onProfile(member)} aria-label={`Read ${member.name}'s profile`}><img src={member.portrait} alt="" loading="lazy"/></button>
          <div className="roster-copy">
            <h2>{member.name}</h2>
            <span className="roster-role">{member.role} · {member.focus}</span>
            <p>{member.personality}</p>
            <div className="bond"><span>Bond</span><strong>{bond}</strong></div>
            <div className="bond-pips" aria-hidden="true">{BOND_TIERS.map((tier, i) => <i key={tier} className={i < level ? "on" : ""}/>)}</div>
            <button className={selected ? "primary roster-choose" : "secondary roster-choose"} aria-pressed={selected} onClick={() => onChoose(member.id)}>{selected ? <><Check aria-hidden="true"/>Practising together</> : `Practise with ${member.name}`}</button>
          </div>
        </article>;
      })}
      {Array.from({length: waiting}, (_, i) => <div className="roster-card is-locked" key={`waiting-${i}`}><div className="roster-art"><Lock aria-hidden="true"/></div><div className="roster-copy"><h2>Not yet met</h2><p>Keep reading. You will meet them in the story.</p></div></div>)}
    </div>
  </div>;
}

export function MemberProfile({member, onClose}: {member: DojoMember | null; onClose: () => void}) {
  return <Dialog open={!!member} onOpenChange={open => {if (!open) onClose();}}>
    <DialogContent className="dojo-dialog member-dialog" style={member ? memberStyle(member) : undefined}>
      <DialogTitle>{member?.name ?? "Dojo member"}</DialogTitle>
      <DialogDescription>{member?.role}</DialogDescription>
      {member && <div className="member-profile">
        <div className="profile-portrait"><img src={member.portrait} alt={`${member.name} in their martial arts training outfit`}/></div>
        <div className="profile-copy"><blockquote>“{member.introduction}”</blockquote><p className="member-personality">{member.personality}</p><p>{member.biography}</p><div className="profile-focus"><span>TRAINING FOCUS</span><strong>{member.focus}</strong></div></div>
      </div>}
    </DialogContent>
  </Dialog>;
}
