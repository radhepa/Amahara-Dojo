"use client";

import type { CSSProperties } from "react";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DOJO_MEMBERS, type DojoMember } from "@/lib/dojo-members";

export const memberStyle = (member: DojoMember) => ({ "--member-accent": member.accent } as CSSProperties);

export function DojoRoster({ onSelect, compact = false }: { onSelect: (member: DojoMember) => void; compact?: boolean }) {
  return <section className={compact ? "dojo-roster compact-roster" : "dojo-roster"} aria-label="Dojo members">
    {!compact && <div className="members-intro"><span className="eyebrow"><Users size={16}/> FIVE DIFFERENT PATHS</span><h2>Meet your dojo.</h2><p>Different personalities. A shared place to practice.</p></div>}
    <div className="member-grid">
      {DOJO_MEMBERS.map(member => <button className="member-card" key={member.id} style={memberStyle(member)} onClick={() => onSelect(member)} aria-label={`Meet ${member.name}, ${member.role.toLowerCase()}`}>
        <div className="member-art"><img src={member.portrait} alt={`Anime portrait of ${member.name}`} loading="lazy"/></div>
        <div className="member-card-copy"><h3>{member.name}</h3><p>{member.role}</p>{!compact && <><span className="member-focus">{member.focus}</span><span className="member-profile-link">Meet {member.name}</span></>}</div>
      </button>)}
    </div>
  </section>;
}

export function MemberProfile({ member, onClose }: { member: DojoMember | null; onClose: () => void }) {
  return <Dialog open={!!member} onOpenChange={open => { if (!open) onClose(); }}>
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
