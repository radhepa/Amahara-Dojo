import type {StoryScene} from "./types";
import {PILOT_MAIN,PILOT_OPENINGS,PILOT_SCENES} from "./pilot";
import {expandWeek} from "./month-authoring";
import {WEEK_TWO,WEEK_TWO_OPENINGS} from "./month-week-2";
import {WEEK_THREE,WEEK_THREE_OPENINGS} from "./month-week-3";
import {WEEK_FOUR,WEEK_FOUR_OPENINGS} from "./month-week-4";

export function buildMonth(originals:StoryScene[]){
 const revised=[...expandWeek(2,originals,WEEK_TWO),...expandWeek(3,originals,WEEK_THREE),...expandWeek(4,originals,WEEK_FOUR)];
 const replace=(week:number,beat:number,anchor:string,text:string)=>{
  const line=revised.find(s=>s.episode===week&&s.beat===beat)!.lines.find(l=>l.text.startsWith(anchor));
  if(!line)throw new Error(`Missing month continuity anchor: ${anchor}`);
  line.text=text;
 };
 // Let the added scenes finish departures instead of bringing people back
 // through doors they have just left. Published originals are never modified.
 replace(2,3,"On your way out, he hands","During a quiet moment at the counter, he hands you a warm heel of bread. He does not ask you to say how brilliant he is. He asks whether the citrus is too strong. You answer honestly. He makes a note.");
 replace(3,3,"You bring the map back","You put the map in a paper sleeve while Sora checks the remaining source notes. She mentions that she once carried route records as a courier. She does not say whose. She offers to show Akari the map together.");
 replace(3,3,"At the hall's door she hesitates","The offer costs her more than finding the paper did. You wait instead of filling the silence for her, while the shopkeeper looks for the other index.");
 replace(4,1,"On leaving, Emi writes","Emi writes a possible date in her notebook but leaves the activity blank. It is a beginning she chose, not an application she submitted.");
 replace(4,3,"Before leaving, she asks","While the ink dries, she asks where the spare pen goes. You point to its place. She returns it, keeping her own notebook beside her. The hall has not claimed either her time or her questions.");
 replace(4,6,"When the room empties, Yuzu","As the afternoon slows, Yuzu sits beside you on the step.");
 const timedScene=revised.find(s=>s.episode===4&&s.beat===2)!;
 const timer=timedScene.lines.find(l=>l.text.startsWith("Your timer sounds."));
 if(!timer)throw new Error("Missing rehearsal signal anchor");
 timedScene.lines.splice(timedScene.lines.indexOf(timer),1,
  {...timer,text:"You lift the card at the agreed point. For once everyone stops at it. Ren bows to the clock.",when:{flag:"month:timer",value:"card"}},
  {...timer,id:`${timer.id}-spoken`,text:"You say 'last sentence' at the agreed point. For once everyone stops when that sentence ends. Ren bows to the clock.",when:{flag:"month:timer",value:"word"}}
 );
 const tinScene=revised.find(s=>s.episode===4&&s.beat===6)!;
 const tin=tinScene.lines.find(l=>l.text.startsWith("Toma operates the tin once at the end"));
 if(!tin)throw new Error("Missing tin announcement anchor");
 const tinIndex=tinScene.lines.indexOf(tin);
 tinScene.lines.splice(tinIndex,1,
  {...tin,text:"Toma operates the tin once at the presentation's end, with extravagant solemnity. Ren hands him a piece of bread. Nobody calls him a future prodigy.",when:{flag:"month:tin",value:"end"}},
  {...tin,id:`${tin.id}-tea`,text:"Toma operates the tin once to announce the ready tea table, with extravagant solemnity. Ren hands him a piece of bread. Nobody calls him a future prodigy.",when:{flag:"month:tin",value:"tea"}}
 );
 // The old short version finished this arrow at once; this longer version lets
 // Akari practice leaving the agreed work for Ren's next visit.
 const secondFinale=revised.find(s=>s.episode===2&&s.beat===6)!;
 const arrow=secondFinale.lines.find(l=>l.text.startsWith("They repaint the arrow together."));
 if(!arrow)throw new Error("Missing arrow continuity anchor");
 arrow.text="They test colors on a spare piece of wood. Ren complains that her straight lines make his tiny bread look irresponsible. Akari paints a second loaf beside it, equally crooked. The arrow itself can wait until tomorrow, at the time they agreed. He looks at her, surprised, and decides against making the joke that has reached his mouth.";
 return {
  main:[...PILOT_MAIN,...revised],
  openings:[...PILOT_OPENINGS,...WEEK_TWO_OPENINGS,...WEEK_THREE_OPENINGS,...WEEK_FOUR_OPENINGS],
  scenes:[...PILOT_SCENES,...revised,...WEEK_TWO_OPENINGS,...WEEK_THREE_OPENINGS,...WEEK_FOUR_OPENINGS]
 };
}
