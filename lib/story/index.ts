import {lines,type StoryScene,type StoryLine,type Expression} from "./types";
import {EPISODE_1} from "./episode-1";
import {EPISODE_2} from "./episode-2";
import {EPISODE_3} from "./episode-3";
import {EPISODE_4} from "./episode-4";
import {EPISODE_5} from "./episode-5";
import {EPISODE_6} from "./episode-6";
import {EPISODE_7} from "./episode-7";
import {EPISODE_8} from "./episode-8";
import {PERSONAL,RELATIONSHIPS} from "./personal";
import {QUESTS} from "./quests";
import {deepenSeason} from "./season-depth";
import {buildMonth} from "./month";
export {PILOT_MAIN,PILOT_PROLOGUE,PILOT_OPENINGS,PILOT_REVISION,PILOT_SCENES,pilotLines} from "./pilot";
export {PERSONAL} from "./personal";
export const EPISODE_TITLES=["A Place on the Mats","The Things We Keep","Footprints Outside the Gate","An Ordinary Day, Almost","Promises Have Weight","The Shape of a Family","Before the Lanterns Rise","A Door Worth Keeping Open"];
export const MAIN=structuredClone([...EPISODE_1,...EPISODE_2,...EPISODE_3,...EPISODE_4,...EPISODE_5,...EPISODE_6,...EPISODE_7,...EPISODE_8]);
function replace(sceneId:string,needle:string,variants:StoryLine[]){const s=MAIN.find(s=>s.id===sceneId)!;const i=s.lines.findIndex(l=>l.text.includes(needle));if(i<0)throw new Error(`Missing story anchor ${sceneId}`);s.lines.splice(i,1,...variants);}
const v=(flag:string,value:string,speaker:string,text:string):StoryLine=>({speaker,text,when:{flag,value}});
replace("c1-e4-b1","Ren's invitation describes",[
 v("access","open","narrator","Emi has come to the open afternoon with a friend. The clear capacity sign made the invitation feel possible rather than vaguely intimidating. She asks where someone can sit quietly if the group becomes too much."),
 v("access","quiet","narrator","Emi has booked a quiet appointment. She brings questions she would not have wanted to ask in a group, and thanks Sora for making the request easy. The boundary notice lets her understand the room before entering it."),
]);
replace("c1-e5-b3","Neighbors return with different",[
 v("access","open","narrator","Neighbors arrive together for the open time. Ren checks the count while Sora keeps the quiet corner available. The capacity you put on the invitation makes it possible to welcome people without guessing how many will fit."),
 v("access","quiet","narrator","Neighbors bring written appointment times. Sora checks the list while Ren welcomes the next arrival. The quieter plan you chose lets someone ask a private question without needing to make it interesting to an audience."),
]);
replace("c1-e5-b3","If the floor was prioritized",[
 v("repair","floor","riku","The floor came first, as agreed. The supervised space is ready. Ren has a confirmed date for the welcome work, and I've written what remains beside what we've finished."),
 v("repair","welcome","riku","The welcome corner came first. People can enter without fighting the door. The closed floor still has its boundary and a confirmed repair date. We haven't used a pleasant entrance to hide unfinished work."),
]);
replace("c1-e7-b1","The correction you chose",[
 v("mistake","public","narrator","The earlier public correction has made the check procedure familiar. A neighbor asks where the responsible person's name will appear next time. Yuzu points to the signed sheet, accepting the question without a joke."),
 v("mistake","direct","narrator","The two neighbors Ren and Akari visited return for the rehearsal. One says the written correction made it easier to explain the signal to her household. The other asks a new question, knowing exactly whom to approach."),
]);
replace("c1-e7-b4","Neighbors bring help because",[
 v("access","open","narrator","The group from the open afternoons brings chairs and setup help. Ren limits the number working at once so the path stays clear. The invitation you wrote has become a practical network."),
 v("access","quiet","narrator","People from the quieter appointments arrive in staggered shifts. Sora's list lets each know when help is needed and when they can leave. The invitation you wrote has become a practical network."),
]);
replace("c1-e7-b4","If the hall chose one",[
 v("promise","specific","narrator","The river neighbors thank Daichi for one clear contact and a date they could rely on. They have a follow-up question, addressed to him by name. He opens his calendar before answering."),
 v("promise","shared","narrator","The river neighbors thank Daichi and Sora for dividing the work clearly. They did not have to discover which person believed the other had answered. Both founders read the follow-up before assigning the next part."),
]);
replace("c1-e8-b4","Natsume turns to the repair board",[
 {speaker:"narrator",text:"Natsume turns to the repair board. Your first choice is still written there, beside the names of the people who came to help. She looks from the board to the visitors. Riku has already uncapped his pencil."},
 v("repair","floor","natsume","The restored floor allowed a restrained supervised demonstration. The welcome work followed on its stated date. Your repair order is supported by a record of both responsibilities being met."),
 v("repair","welcome","natsume","The accessible welcome corner brought people into the hall while the damaged floor stayed closed. The later floor approval is documented. Your repair order is supported by a record of both responsibilities being met."),
 v("statement","founders","natsume","The founders gave a clear account of their duties. The written visitor accounts added criticism your statement did not avoid. Keep both in the review file."),
 v("statement","community","natsume","The shared statement allowed visitors to describe their own experience. The founders answered the technical questions without making the visitors' words sound like their own. Keep that distinction."),
]);
replace("c1-e6-b6","The blue bowl is used as",[
 v("place","remember","narrator","The blue bowl marks the place you chose to remember explicitly. Additional bowls hold dinner for people who arrived today. Daichi says Iori's name without making anyone guess why one place is empty."),
 v("place","welcome","narrator","A neighbor uses the blue bowl as you agreed. Daichi tells her where it came from, then asks whether she wants more soup. Remembering has become part of a useful conversation rather than a condition that the bowl remain empty."),
 {speaker:"narrator",text:"Daichi explains who Iori is in the present tense. Not a symbol, not the reason everyone should admire this hall. A stubborn friend who disliked a particular tea and once mended a door incorrectly because he was certain of a measurement."},
]);
replace("c1-e8-b6","If you chose open consultation",[
 v("consult","open","sora","You helped me bring an unfinished finding into the room. I will do the same now. I recognize this stamp from my courier work, and I should have explained more of that connection earlier."),
 v("consult","verify","sora","We agreed verification would have a disclosure date. I kept that first date; now I need another clear one for this page. I won't ask you to accept uncertainty as a reason to wait forever."),
]);
// Adult NPC connections progress independently when the player is not pursuing that person.
MAIN.find(s=>s.id==="c1-e8-b5")!.lines.splice(-2,0,
 {speaker:"ren",text:"Akari, would you like a walk after we close? No list. No task. Just the two of us.",when:{flag:"npc-akari-ren",value:"yes"},expression:"soft"},
 {speaker:"akari",text:"Yes. And I will leave the list here. We can find out what a walk is like without making it a rehearsal.",when:{flag:"npc-akari-ren",value:"yes"},expression:"soft"},
 {speaker:"mika",text:"Daichi, I'm free next evening. I'd like us to go somewhere neither of us is responsible for everyone's tea.",when:{flag:"npc-daichi-mika",value:"yes"},expression:"soft"},
 {speaker:"daichi",text:"I'd like that. I'll put the actual time down, and leave the kettle to someone else.",when:{flag:"npc-daichi-mika",value:"yes"},expression:"soft"},
);
PERSONAL.find(s=>s.id==="c1-yuzu-4")!.practiceGate=48;
deepenSeason(MAIN);
const illustrations:Record<string,string>={"c1-e1-b6":"first-meal","c1-e8-b3":"review-exchange","c1-e8-b5":"season-meal"};
for(const s of MAIN)if(illustrations[s.id])s.illustration=`/story/backgrounds/${illustrations[s.id]}.webp`;
const expressionDirection:Record<string,Partial<Record<string,"neutral"|"amused"|"concerned"|"angry"|"determined"|"soft">>>={
 "c1-e1-b1":{ren:"amused",sora:"amused",yuzu:"amused",daichi:"soft"},"c1-e1-b2":{akari:"determined",ren:"amused",sora:"amused",daichi:"soft"},"c1-e1-b3":{riku:"determined",akari:"concerned",yuzu:"amused"},"c1-e1-b4":{daichi:"concerned",sora:"amused",yuzu:"amused"},"c1-e1-b5":{akari:"determined",ren:"determined",riku:"determined"},"c1-e1-b6":{ren:"amused",daichi:"soft",sora:"soft",yuzu:"amused"},
 "c1-e2-b1":{ren:"amused",akari:"determined",toma:"determined"},"c1-e2-b2":{mika:"amused",daichi:"soft"},"c1-e2-b3":{ren:"concerned"},"c1-e2-b4":{akari:"concerned",ren:"amused"},"c1-e2-b5":{sora:"determined",ren:"determined",mika:"amused"},"c1-e2-b6":{daichi:"soft",sora:"soft",yuzu:"amused"},
 "c1-e3-b1":{haru:"determined",ren:"concerned",akari:"determined"},"c1-e3-b2":{shigure:"soft",akari:"determined",sora:"concerned"},"c1-e3-b3":{sora:"concerned"},"c1-e3-b4":{akari:"angry",ren:"angry",yuzu:"determined",haru:"concerned"},"c1-e3-b5":{sora:"concerned"},"c1-e3-b6":{akari:"determined",ren:"concerned",sora:"concerned"},
 "c1-e4-b1":{emi:"concerned",yuzu:"amused",daichi:"soft"},"c1-e4-b2":{ren:"amused",sora:"amused",riku:"determined"},"c1-e4-b3":{emi:"concerned",akari:"soft",yuzu:"amused"},"c1-e4-b4":{ren:"concerned",yuzu:"concerned",riku:"determined"},"c1-e4-b5":{akari:"determined",sora:"determined",daichi:"concerned"},"c1-e4-b6":{yuzu:"soft"},
 "c1-e5-b1":{natsume:"determined",mika:"determined",daichi:"concerned"},"c1-e5-b2":{natsume:"concerned",daichi:"determined",sora:"determined"},"c1-e5-b3":{riku:"determined",yuzu:"amused"},"c1-e5-b4":{mika:"determined",akari:"concerned",daichi:"concerned"},"c1-e5-b5":{daichi:"determined",mika:"soft"},"c1-e5-b6":{ren:"soft",akari:"soft"},
 "c1-e6-b1":{yuzu:"concerned"},"c1-e6-b2":{yuzu:"determined",daichi:"concerned"},"c1-e6-b3":{daichi:"concerned",sora:"concerned"},"c1-e6-b4":{mika:"amused",daichi:"soft",ren:"amused"},"c1-e6-b5":{daichi:"concerned",mika:"soft",yuzu:"soft"},"c1-e6-b6":{riku:"amused",daichi:"soft",yuzu:"amused"},
 "c1-e7-b1":{sora:"determined",akari:"soft"},"c1-e7-b2":{shigure:"determined",sora:"determined",akari:"determined",yuzu:"concerned"},"c1-e7-b3":{akari:"determined",ren:"concerned"},"c1-e7-b4":{daichi:"soft",riku:"soft"},"c1-e7-b5":{akari:"determined",ren:"soft"},"c1-e7-b6":{akari:"soft",ren:"soft"},
 "c1-e8-b1":{ren:"amused",akari:"amused"},"c1-e8-b2":{ren:"determined",natsume:"determined"},"c1-e8-b3":{akari:"determined",ren:"determined",natsume:"determined"},"c1-e8-b4":{natsume:"soft",shigure:"determined",akari:"determined"},"c1-e8-b5":{daichi:"soft",mika:"soft",ren:"soft",akari:"soft"},"c1-e8-b6":{akari:"determined",sora:"concerned"},
};
for(const s of MAIN)for(const l of s.lines)if(l.speaker!=="narrator"&&l.speaker!=="you")l.expression=expressionDirection[s.id]?.[l.speaker]??"neutral";
// Authored changes within an exchange: a character can soften, hesitate, or laugh.
// These cues select a whole pose, not a facial overlay or text sentiment score.
const performanceCues:Record<string,[string,string,Expression][]>= {
 "c1-e1-b1":[["akari","Good. It stays","soft"]],
 "c1-e1-b4":[["daichi","People have made progress","amused"],["daichi","Leave it there","concerned"]],
 "c1-e2-b6":[["ren","Haru used to win","concerned"],["ren","I painted that arrow","amused"],["akari","This part was accurate","amused"]],
 "c1-e3-b1":[["ren","Thank you. I wondered","angry"],["haru","I didn't mean it","concerned"],["ren","I know. That's the difficult","concerned"]],
 "c1-e4-b6":[["ren","I had a very convincing","amused"],["ren","I was. Then I saw","concerned"],["akari","It would be information","soft"]],
 "c1-e5-b6":[["ren","He makes it look","amused"],["sora","You've lost several","amused"],["daichi","That one was yours","amused"]],
 "c1-e6-b6":[["daichi","I'd like to. He hasn't","concerned"],["yuzu","I thought I'd feel less guilty","concerned"],["akari","It can read my lists","amused"]],
 "c1-e7-b3":[["sora","Dry doorway.","determined"],["daichi","Close ours.","determined"],["ren","Daichi. What did you mean","concerned"]],
 "c1-e8-b5":[["daichi","He's still angry","concerned"],["mika","I thought he might","concerned"],["daichi","Is this an official postal","amused"],["ren","Very reliable.","amused"]],
};
for(const [id,cues] of Object.entries(performanceCues))for(const [speaker,anchor,expression] of cues){const line=MAIN.find(s=>s.id===id)!.lines.find(l=>l.speaker===speaker&&l.text.startsWith(anchor));if(!line)throw new Error(`Missing performance cue ${id}: ${anchor}`);line.expression=expression;}
for(const s of PERSONAL)for(const l of s.lines)if(l.speaker===s.member)l.expression=s.beat===1?"amused":s.beat===2?"concerned":s.beat===3?"determined":"soft";
export const PROLOGUE:StoryScene={id:"c1-prologue",title:"Lantern Hall",episode:1,beat:0,location:"courtyard",kind:"prologue",lines:lines(`Amahara is a town of steep streets, river routes, and training halls whose signs promise more than a visitor can always understand.\n\nLantern Hall's sign promises very little. Its paint has faded. Someone has tied a paper moth to the gate. Beyond it, five voices are discussing a door.\n\nYou have come as yourself: a beginner with a demanding training week, limited flexibility, and a wish to learn to move well. Nobody here knows whether you will become an excellent martial artist. That will take time, qualified instruction, and practice someone can actually assess.\n\nToday, the first question is smaller. Is there a place where you can begin honestly?\n\nCompleted normal or gentle recovery practices open one new story beat. A partial practice waits for another day; it does not harm the people here. Wednesday has no assigned practice. Unread stories and optional visits can wait.\n\nThe gate is open. The door appears to require negotiation.`)};
export const ALL_SCENES=[PROLOGUE,...MAIN,...PERSONAL,...RELATIONSHIPS,...QUESTS];
const month=buildMonth(MAIN);
export const MONTH_MAIN=month.main,MONTH_OPENINGS=month.openings,MONTH_SCENES=month.scenes;
export const SCENE_BY_ID=Object.fromEntries([...ALL_SCENES,...MONTH_SCENES].map(s=>[s.id,s]));
export function visibleLines(s:StoryScene,flags:Record<string,string>){return s.lines.filter(l=>!l.when||flags[l.when.flag]===l.when.value);}
