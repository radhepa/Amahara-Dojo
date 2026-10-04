const CHAPTERS=[
 ["Beginner","Belonging and rebuilding","Eight episodes at Lantern Hall; authored conversations, relationships, and small projects."],
 ["Movement foundations","Responsibility beyond the hall","New apprentices and community errands, with improved movement checks."],
 ["Coached fundamentals","Teachers and expectations","Instructor feedback, supervised goals, and different approaches to learning."],
 ["Controlled striking","Rivalry and public pressure","Qualified striking instruction, partner boundaries, and visiting practitioners."],
 ["Connected movement","Promises across different lives","Group relationships, shared projects, and consequences from earlier choices."],
 ["Intermediate","Travel and competing loyalties","Visiting halls and communities with their own needs and traditions."],
 ["Reliable intermediate","Reputation and accountability","Player-led projects, sustained coached practice, and outside review."],
 ["Skilled practitioner","Revelations and lasting costs","Deeper campaign consequences and advanced assessments."],
 ["Advanced candidate","Confrontation and sacrifice","Final preparation and decisions whose consequences persist."],
 ["Advanced practitioner","Resolution and legacy","Instructor-confirmed competence, campaign closure, and continued practice."],
];
export default function DojoRoadmap(){return <section className="panel dojo-roadmap"><span className="eyebrow">THE LONGER JOURNEY</span><h2>A chapter for each stage</h2><p>Chapter 1 is playable now. Later chapters need new writing, curriculum, and assessment features. Finishing a story does not advance your real training level.</p><div className="roadmap-table"><table><thead><tr><th>Chapter</th><th>Training</th><th>Story & future features</th></tr></thead><tbody>{CHAPTERS.map(([training,theme,features],i)=><tr key={training}><td>{i+1}<small>{i===0?"Playable":"Planned"}</small></td><td>{training}</td><td><strong>{theme}</strong><span>{features}</span></td></tr>)}</tbody></table></div><p>High levels require sustained instruction and demonstrated control. Logged time and game rewards cannot certify punches, kicks, or performance against another practitioner.</p></section>;}
