import {section as part,pick,recall,opening,type Expansion} from "./month-authoring";

export const WEEK_FOUR:Expansion[]=[
 {before:[...part("Scene one · the person reading the sign","courtyard",`
There is someone at the gate reading the invitation twice. Ren recognizes her before she has decided whether to come in. He begins to cross the courtyard. Akari touches the empty chair beside the door and lets him discover the less imposing distance for himself.

ren~amused|Emi. We met at the stationery shop. I bought the paper that proved too small for everything I wanted to say.

emi~amused|You bought three sizes. The problem survived all of them.

She has a notebook tucked beneath her arm. She tells you she is twenty and works at the shop. Her fingers are stained with the same blue ink as the appointment cards. She asks whether she is early. Sora checks the actual time before saying no.
`),recall("access","open","emi","I came for the open time. My friend is looking at the street stalls; I said I'd meet her afterward. Is it all right if I just watch for now?","concerned"),recall("access","quiet","emi","I booked this time because I'd rather ask before the room fills. I brought several questions, and now they all seem slightly ridiculous.","concerned"),recall("month:invite","look","emi","The line about looking around helped. I wasn't ready to agree to anything when I read it."),recall("month:invite","ask","emi","You wrote that ordinary questions were welcome. I thought I should take the invitation literally."),...part("Scene one · continued","hall",`
You point out the washroom before she has to ask. The practical information seems to help more than Ren's first enthusiastic description of the hall. He notices, shortens the description, and asks whether she wants a seat by the door or one with a view of the practice space.

Emi chooses the view, then asks if the door seat will remain available. Daichi says it will. She puts her notebook down beside the chosen chair, keeping her own place without claiming the whole row.
`),pick("month:emi-welcome","Emi asks what helped you on your first visit.",[
 {id:"practical",label:"Knowing where things were and what I could decline.",speaker:"emi",text:"That sounds useful. Could you show me the boundary before the rest? I'd like to understand the room before being interesting in it.",memory:"You give Emi a practical first tour."},
 {id:"ordinary",label:"An ordinary conversation that didn't feel like an interview.",speaker:"emi",text:"Then perhaps you can tell me whether the tea is always that hot. I have already answered my own question, unfortunately.",expression:"amused",memory:"You start with ordinary conversation beside Emi."}
 ])],after:[...part("Scene three · a first visit can finish","hall",`
After the demonstration, Emi turns her notebook sideways and checks the date she wrote. You do not lean in to read the empty line underneath it.

emi~concerned|I sell these to people who seem so certain what a practice journal should contain. Perhaps they are pretending as well.

you|You can leave a line blank.

emi|I know. I wanted somebody to say that without immediately recommending what I could fill it with.

Ren is folding the demonstration wraps. She asks whether he minds being interrupted while demonstrating. He considers the question before giving her a cheerful answer that would be too quick.

ren|Sometimes I mind the interruption. I still need to stop. Those can happen in the same person.

Emi watches him fold a wrap twice because the first version trapped its loose end. He does not hide the restart. She writes something in her notebook and closes it again.
`),pick("month:emi-next","Emi asks how she should arrange another visit.",[
 {id:"contact",label:"Point to the actual contact and available times.",speaker:"emi",text:"Good. Then I can choose at home instead of saying yes because everybody is looking at me.",memory:"Emi takes the visit times home."},
 {id:"card",label:"Offer a blank request card she can take away.",speaker:"sora",text:"I'll leave the time empty until Emi chooses one. A card is a way to ask, not a booking made on her behalf.",memory:"Emi takes a blank request card."}
 ]),...part("Scene four · nobody grades the doorway","courtyard",`
Yuzu gives Emi a paper moth for the notebook. Emi asks if accepting it means anything. Yuzu says it means she is now responsible for keeping a very small moth reasonably flat. Emi accepts that precise obligation.

At the gate, she pauses over the sign once more. She asks whether the public afternoon will include people who only want to see the repair work. Riku says yes, and offers to answer their questions himself. She says she might help with lettering if there is something small that actually needs doing.

riku|The boundary sign needs to be readable. We can ask you about that. You don't have to redesign the whole hall.

She seems pleased by the size of the answer. You wave goodbye without asking for a commitment. Her first visit can be completed by leaving, and the next one can be something she chooses later.
`)]},
 {before:[...part("Scene one · the afternoon on paper","courtyard",`
Ren's introduction is sitting on a stool. It occupies three pages, two of which describe things that have not yet occurred. Yuzu has put a paper moth at the top of each, creating the appearance of an extremely well attended document.

ren~amused|The moths appreciate context.

sora~amused|The moths have not had to stand through it.

Akari brings the actual plan outside. Five short speaking turns, enough time for a restrained adult demonstration, and room for people to ask questions. Riku asks where the repair explanation belongs. Ren points to half a sentence on the second page. Riku puts his finger on the work estimate instead.

riku~determined|The door took three people and a measurement that changed twice. It should get more time than the metaphor about new beginnings.

Ren reads the metaphor. It is, even to him, an ambitious use of a hinge. He crosses it out. Riku does not gloat. He starts writing a sentence that someone who has never repaired a door could understand.

You are given the timer. Your task is to mark the allotted speaking time. Nobody asks you to demonstrate a technique or extend your workout to make the event more impressive.
`),pick("month:timer","How should you signal that a speaking turn is ending?",[
 {id:"card",label:"Lift a visible card before the limit.",speaker:"ren",text:"A card. Good. I can notice it before my sentence grows another branch.",expression:"amused",memory:"The rehearsal uses your raised card."},
 {id:"word",label:"Say 'last sentence' at the agreed point.",speaker:"akari",text:"Clear. We'll agree to stop without making you negotiate each person's final paragraph.",memory:"The rehearsal uses your spoken 'last sentence'."}
 ])],after:[...part("Scene three · the repair gets its sentence","courtyard",`
Riku tries his explanation again. This time he says what was wrong with the door, what changed, and what remains closed. You can follow all three parts. Ren asks if he can include the joke about the hinge now. Riku says after the explanation, if it still fits.

It does not fit. Ren leaves it out. The world suffers no apparent shortage of jokes about doors.

Yuzu asks whether she should put the moths on the final plan. Akari says one, away from the names. Yuzu uses the smallest. Sora asks whether that is commentary on the reduced introduction. Yuzu refuses to compromise her artistic neutrality.

The practice presentation has become clearer each time something is removed. Daichi also notices one thing that has not yet been added: who will answer a question that a beginner cannot answer. He writes his name in the appropriate space and leaves the technical equipment question with the keeper.

you|What should I say if someone asks me?

daichi~soft|Say what you actually know, including who you can ask. You don't have to make the room seamless by pretending every person can do every job.
`),pick("month:sign-style","Emi has offered to letter one sign. What would you suggest keeping clear?",[
 {id:"boundary",label:"The boundary and the route around it.",speaker:"riku",text:"Please. People can see the work without entering it. I'll mark the measurements she needs.",memory:"Emi's sign emphasizes the clear visitor route."},
 {id:"questions",label:"Where a visitor can ask for help.",speaker:"daichi",text:"Good. We'll include the boundary too, and make the contact readable. A question shouldn't need a tour to find its answer.",memory:"Emi's sign emphasizes where to ask for help."}
 ]),...part("Scene four · after rehearsal","hall",`
You take the timer back inside. Ren carries his shortened introduction with a single page folded behind it. You ask what the spare page is for. He says it contains material he might use another time, somewhere with chairs and nobody waiting to begin a demonstration.

akari~amused|The bread has survived the revision?

ren|One sentence. A modest sentence, with extremely good bread behind it.

She asks him to read it. It is funny. She laughs before he reaches the final word, and he looks briefly pleased enough to forget that he wanted two sentences.

By the notice board, Sora checks the keeper's written instruction about leaving civic signals separate. She does not remove it to make the display prettier. The public afternoon now has a plan that fits its room. Later it will need people to remember why the less decorative instruction is there.
`)]},
 {before:[...part("Scene one · a page turned toward its owner","hall",`
Emi has returned at the time she chose. She brings her own pen and asks where she can sit before anybody offers a task. You point to the same chair she used before. It is empty.
`),recall("month:emi-welcome","practical","emi","I remember the route. You showed me that first. Today I'd like to sit a while before deciding whether to help."),recall("month:emi-welcome","ordinary","emi","The tea is still very hot. I appear to have returned with one highly reliable observation.","amused"),recall("month:emi-next","contact","sora","Your chosen time is on the sheet. I left it unassigned until you contacted us."),recall("month:emi-next","card","sora","I have your request card. Just the time you wrote, with no extra job added in the margin."),...part("Scene one · continued","hall",`
Emi opens the notebook on her knees. Yuzu is folding paper on the opposite chair and keeps her eyes on her own work. Ren passes the table without asking what the new column means. The privacy happens through several small decisions, none important enough to announce.

You ask whether Emi wants company. She says yes, and adds that she does not need a useful suggestion yet. You pull the chair beside hers around rather than sitting directly across from the page.

emi~concerned|I have spent a ridiculous amount of time deciding whether to bring this notebook. Then I decided bringing it had to mean I would accomplish something.

you|You brought it here.

emi~amused|A dangerously literal interpretation. I may need that today.
`),pick("month:emi-company","How would you keep her company while she writes?",[
 {id:"quiet",label:"Sit quietly with your own cup.",speaker:"emi",text:"Thank you. I can think with somebody here. I don't always need the room to become empty.",memory:"Emi remembers comfortable quiet beside you."},
 {id:"paper",label:"Ask Yuzu for a scrap and try folding a moth.",speaker:"yuzu",text:"One scrap. If it becomes a lopsided beetle, you are allowed to revise its species.",expression:"amused",memory:"Your uneven paper moth stays beside Emi's notebook."}
 ])],after:[...part("Scene three · chosen lettering","hall",`
Emi asks Ren for the boundary sign dimensions. He brings the piece of wood rather than describing it with his hands. Riku writes the actual clear area on a scrap. She tests two sizes of letters and finds that the decorative one becomes harder to read at a distance.

emi|I like that version more. It isn't the version that works here.

akari~soft|You can keep liking it. Use it for something that doesn't have to be read from the gate.

She brings the patterned scrap from her mending basket. It is obviously chosen for its small blue flowers. Emi looks at it, then at Akari's newly frank expression, and laughs.

emi~amused|You had a materials emergency?

akari~amused|An extremely attractive one.

Yuzu lets the joke end there. She does not repeat it until the admission becomes something Akari regrets making.

Sora's archive reply arrives while the paint is drying. It says the records are temporarily unavailable pending review. Emi is not asked to analyze it. Sora tells Akari what it actually says and shows her the unanswered request for who can authorize access. The lettering job remains a lettering job beside the larger unresolved question.
`),recall("month:archive","card","sora","The dated card stays with the reply. I'll add the next request beside it rather than silently extending the old one."),recall("month:archive","board","sora","I've updated the task board with the reply and next request. The unanswered part won't disappear just because today's task is checked."),pick("month:patch","Akari offers a little patterned scrap for a bookmark. Which would you take?",[
 {id:"blue",label:"The blue flowers.",speaker:"akari",text:"Good choice. I will have to admit I kept enough of that fabric for more than repairs.",expression:"amused",memory:"Akari puts aside a blue-flowered bookmark."},
 {id:"stripe",label:"The striped piece.",speaker:"akari",text:"Here. The edge is already stitched. I liked how the lines changed when I folded it.",expression:"soft",memory:"Akari puts aside a striped bookmark."}
 ]),...part("Scene four · a notebook taken home","courtyard",`
Emi leaves the sign to dry and takes the notebook. One column has new writing. You know what she offered to tell you; the rest goes through the gate with its owner.

emi|I can bring string for the sign next time. Lettering and string. I am specifying this before Ren imagines a stationery department.

ren~amused|A wise precaution. My department already had an ambitious name.

She smiles and leaves before he supplies it. Akari folds the remaining patterned cloth without hiding the flowers inside. You pick up the cups and leave the notebook space empty. Company has been useful without becoming a claim on what Emi wrote.
`)]},
 {before:[...part("Scene one · everything except an ending","courtyard",`
The presentation has chairs, a readable sign, a clear boundary, and Ren's introduction reduced to a single page. Its ending is still under discussion. You leave your bag inside while the others carry cushions out.

Yuzu wants a sound everyone can hear. Ren says it should belong to the place rather than feel like an interruption. Toma mentions the bell while setting down a parcel. At first it is only a suggestion in an ordinary conversation.

You take the finished sign into the hall to put it where its paint cannot catch somebody's sleeve. There is enough practical work that you will not hear the rest of the conversation outside.

Nobody has asked you to approve it. Nobody has named the person who did. That gap will seem much more obvious in a few minutes than it does while the cushions are still being arranged.
`)],after:[...part("Scene three · the people who actually worried","courtyard",`
The neighbors have not accused the hall of causing the fault. They have asked whether the two-note sound means a route they use has changed. Akari answers the actual question and says the keeper is being contacted to confirm the correction.

Ren begins to say they were only rehearsing. He stops when one neighbor asks why a rehearsal would use a signal that already means something else.

ren~concerned|It shouldn't have. I helped turn the suggestion into a plan without checking it.

The neighbor asks who will tell her household. Daichi writes down the contact she wants used. He does not ask her to stay through a discussion about the hall's good intentions. She has an errand that this confusion has already delayed.

Toma stands beside the parcel he delivered. His official expression is gone. Yuzu crouches enough to meet his eyes without making him look up at a crowd of adults.

yuzu~concerned|You suggested a sound. I tied the cord. Checking a civic signal was my job before doing that.

toma~concerned|I knew you were doing it. I thought that meant you knew it was all right.

yuzu|Yes. That's the part I need to own.

She does not ask him to accept the apology immediately. He nods, looks away, and picks up his empty parcel bag. He may be relieved and annoyed for longer than the room finds convenient.
`),pick("month:mistake-help","What small task would help without turning you into the person responsible for the mistake?",[
 {id:"route",label:"Keep the clear visitor route open while the adults speak.",speaker:"akari",text:"Thank you. Just the ordinary route. I'll handle the correction and the keeper's confirmation.",memory:"You keep the visitor route clear."},
 {id:"gather",label:"Gather the cushions and unused presentation papers.",speaker:"riku",text:"Useful. I'll remove the cord myself. The loose papers can go inside where they won't be mistaken for current instructions.",memory:"You put the unused rehearsal materials away."}
 ]),...part("Scene four · an unmistakably small sound","hall",`
Riku coils the removed cord and labels it out of use. He has not opened the bell mechanism. He writes the same fact in the report, because the correction should say what happened as carefully as it says what did not.

Ren finds the empty tin Yuzu suggested earlier. He taps it with a spoon. The sound is thin, awkward, and completely separate from the bell. He listens again before calling it the new announcement.

ren~concerned|We already had a useful answer. I wanted the elegant one.

yuzu~concerned|So did I. We made a very attractive shortcut between two things we hadn't checked.

Akari places the keeper's instruction beside the shortened presentation. Nobody had failed to receive it. They had failed to apply it to an idea they liked. That is embarrassing in a way no dramatic hidden villain can tidy away.

Daichi puts the affected households on the contact list. They will hear a direct correction whichever version the hall chooses for the public afternoon. The tin goes on the shelf. Its unimportant sound is the right size for an announcement.
`)]},
 {before:[...part("Scene one · an account before a speech","hall",`
Akari has written the facts before anybody starts choosing a tone. The outer signal handle was borrowed for a rehearsal. The keeper's written instruction was not applied. Two households were worried by a signal they had reason to take seriously. No mechanism was opened and nobody was injured.

Ren reads the page and asks to have his part included beside Yuzu's. She agrees. Toma is named as a messenger who suggested a familiar sound, not as someone responsible for checking civic equipment.

Riku brings the new prop procedure. It names the approving adult, the check to be made, and the instruction to keep announcements separate from signals. He leaves a blank space for the keeper's confirmation rather than filling it with what he expects the keeper to say.

you|What if the neighbors are still annoyed after hearing this?

daichi~concerned|Then they are. An accurate apology gives them information. It doesn't purchase the response we'd prefer.

Yuzu folds a scrap and unfolds it immediately. She asks Ren whether he wants to read the correction first or speak without the page. He chooses the page. She says she will keep hers too. Remembering the wording is less important than getting it right.
`)],after:[recall("mistake","public","yuzu","The public account will name what we did and the check we missed. The affected households hear directly before the afternoon as well.","determined"),recall("mistake","direct","akari","We'll visit the affected households and leave the signed correction. The procedure stays visible here for everyone else.","determined"),...part("Scene three · the tin can wait","hall",`
Toma asks whether he can still come to the afternoon. Ren says yes. Then he asks if Toma would prefer a visitor's place or a small job with a clear end. Toma chooses the job, provided it does not involve anything somebody else calls harmless after the fact.

toma~determined|An ordinary tin. I want the tin on the paper.

yuzu~soft|An ordinary tin, approved by me, with a spoon. No civic meaning. We can put all of that on the paper.

She writes it without teasing him for being precise. He checks the line and leaves his name beside the task. This time the adults' names are beside the approval.

Sora rereads the correction and removes a sentence that describes how upset the hall feels. It is true, but it would ask the listener to take care of the people making the apology. She leaves the explanation of what will change.

Ren brings fresh bread to the common table. He says it is for the people working here, not something to take to the households as a substitute for speaking. Daichi puts the household contact sheet beside the door.
`),pick("month:tin","Toma asks which announcement the tin should make.",[
 {id:"end",label:"One tap when the presentation has finished.",speaker:"toma",text:"One tap. End of presentation. Not end of the town, and not an invitation to invent a second tap.",expression:"amused",memory:"Toma agrees to one finishing tap."},
 {id:"tea",label:"A small tap when the tea table is ready.",speaker:"toma",text:"Tea ready. That is an excellent amount of responsibility for this equipment.",expression:"amused",memory:"Toma agrees to announce the tea table."}
 ]),...part("Scene four · the record someone keeps","courtyard",`
Akari and Ren prepare to go to the households. Yuzu will answer the visitor questions at the hall. The correction route you chose changes where the fuller account will be heard, but it does not let anybody skip the people who were actually inconvenienced.

Before leaving, Ren asks Akari whether he can carry the signed copy. She gives it to him. She keeps the contact names, and they check the two addresses together. Neither person quietly takes both jobs because the other might get one wrong.

You look at the new procedure on the wall. It is small enough to read. You could have read the old instruction too. That does not make this version pointless; it makes using it the part that matters.

The tin stays on the shelf until its approved job begins. The afternoon can still happen. It will include a corrected plan and people who may need longer than the plan to trust it again.
`)]},
 {before:[...part("Scene one · the doors open anyway","courtyard",`
Emi's sign has dried. She brings better string and asks Riku to hold the board while she checks its height from the gate. It is readable from the path. She does not add another decorative line merely because there is room.
`),recall("month:sign-style","boundary","emi","The route around the boundary is clear on the sign. I tried it from the gate before fixing the string."),recall("month:sign-style","questions","emi","The help contact is readable from outside. Nobody should have to work out which table is the office."),recall("month:bread","citrus","ren","Citrus loaf on the tray, with ingredients beside it. Our earlier research has reached its public application.","amused"),recall("month:bread","plain","ren","Plain loaf on the tray. No dramatic name, no speech required before eating it.","amused"),...part("Scene one · continued","hall",`
The chair with arms remains near the door. The quiet place remains clear. Mika checks the curtain and then goes to the common table, where she is a visitor for this part of the afternoon rather than an appointment everybody can summon.

Toma reads the approved tin task again. Yuzu confirms it once, plainly. The spoon is lying beside the tin. The old bell has no cord running into the rehearsal space.

Ren unfolds his single-page introduction. Akari looks toward the visitor route before taking her demonstration position. There is more preparation than a pleasant afternoon appears to require. You have seen enough of it now to understand why appearing effortless is no longer the goal.
`),recall("mistake","public","yuzu","Before the presentation: I tied an announcement cord to a civic signal without checking the keeper's instruction. Ren and I made that decision. Toma was not responsible. The signed procedure here names how we will check props now.","determined"),recall("mistake","direct","akari","The affected households have received the correction and our contact names. The signed procedure is on this board. Questions about the hall's announcement can come to us directly.","determined")],after:[...part("Scene three · what you can offer","hall",`
Emi's conversation with Ren has finished when you come back with the tray. Akari has offered a quieter conversation before the next lesson, and Emi has chosen it. You heard only the parts spoken while you were nearby. She is not asked to repeat her earlier experience for everyone who wants to understand why she is sitting down.

Emi notices you leaving space beside the chair and asks if you will stay a moment. You sit where she points. Her notebook is closed. She puts the paper moth on top of it and flattens one wing with a fingertip.

emi~concerned|I liked the pause. Not because the plan went wrong. Because nobody made the visitor become the problem for being in the way.

you|Ren stopped before continuing.

emi|Yes. I keep replaying that part. I can see myself needing that kind of pause.

You ask whether she wants to talk about the next visit or leave it until the quieter conversation. She chooses the latter. You can stay without turning company into another lesson.
`),pick("month:emi-afternoon","What would you offer while the room settles?",[
 {id:"company",label:"Stay for tea without asking for another explanation.",speaker:"emi",text:"I'd like that. I have explained enough for today. We can have an ordinary opinion about the bread.",expression:"soft",memory:"Emi shares an ordinary cup of tea with you."},
 {id:"walk",label:"Offer to walk to the gate when she's ready.",speaker:"emi",text:"Thank you. After I return this cup. I'd like the visit to end at a pace I chose too.",expression:"soft",memory:"You walk with Emi at her chosen pace."}
 ]),recall("month:emi-company","quiet","emi","The quiet we tried last time helped. It made coming back feel possible even when I didn't know what to say.","soft"),recall("month:emi-company","paper","emi","I kept your uneven moth beside the page. I liked that you let it remain uneven.","amused"),...part("Scene four · the remaining work","hall",`
Riku puts the repair diagrams away after the carpentry visitor leaves. He tells Akari the visitor asked about his measurements, and not merely whether the door now opens. Akari asks if she can add his name to the repair explanation more clearly. He says yes.

Ren takes his unused introduction to the kitchen. He keeps the one sentence about bread. The rest goes into the paper scrap box. Yuzu removes the moth before the sheet is used for another note.

Toma has made his agreed tap, with more solemnity than the tin can support. Nobody interpreted it as news about a route. Now he returns the spoon and asks for bread. Ren gives him a piece and checks whether he has a delivery to finish. He does not. For once, Toma can stay until he wants to go.
`),recall("month:tin","end","toma","One tap. Presentation finished. I consider that an extremely successful announcement.","amused"),recall("month:tin","tea","toma","Tea ready. Nobody has asked whether the river is involved. Excellent equipment choice.","amused"),recall("month:patch","blue","akari","I finished the blue-flowered bookmark. It's on the table. That one was enjoyable from the start.","soft"),recall("month:patch","stripe","akari","The striped bookmark is on the table. I kept a piece for myself too.","soft"),...part("Scene five · one month, still beginning","courtyard",`
You help stack the chairs after Emi leaves. Daichi keeps the one with arms near the door. The room does not return to the arrangement it had before its visitors; it has learned reasons for where some things go.

Akari brings the next review questions outside. The timber costs remain. The proposal remains unanswered. The archive still owes a clearer explanation. There is an inspector's visit to prepare for after the hall has reviewed what it has actually done.

ren~concerned|Can we leave those until the next story day?

akari~soft|Yes. Today is complete.

She sets the papers down. Yuzu's repaired moth moves in the evening air. You have not saved the town or mastered a martial art in a month. You have met people, kept some small promises, and seen a good afternoon include something the hall had to correct.

The next question is waiting. It does not need your answer before you go home.
`)]}
];

export const WEEK_FOUR_OPENINGS=[
 opening(4,1,"An Invitation Someone Kept",part("Opening · a sign on the street","town",`
The invitation is still pinned at the stationery shop. Its lower corner has curled. Someone has put another pin through it so the visiting times remain visible.

You remember helping choose those times and the last line. At the counter, a clerk is copying the information onto a scrap small enough to fit inside a notebook. She does not look up until the customer in front of you has finished paying.

emi|Do you go to Lantern Hall?

you|Yes.

emi|I read this twice, then asked about it once, then decided I should probably read it a third time before admitting I wanted to visit.

She smiles at the sequence rather than making it a complaint somebody else has to solve. She says she has arranged a time and will come later. You tell her where the gate is. You do not add an assignment, a technique to try, or a reason she should choose quickly.

At the hall, Ren recognizes the shop's stationery when you mention the conversation. Akari asks him to keep the first explanation short when the visitor arrives. He says he has been practicing concise welcomes. Sora asks how long his demonstration of that skill will take.

ren~amused|A cruel question, from a useful person.

Daichi checks the chair beside the door. Yuzu folds a new moth, then puts it away instead of planning a ceremony around an arrival that has not happened yet.

For now, it is your practice time. The room keeps its clear route, its available supports, and its rests. Somebody else's first visit will come after your own ordinary work. The hall can welcome a new person without turning every person already here into a reception committee.
`)),
 opening(4,4,"A Readable Afternoon",part("Opening · the sign drying by the door","hall",`
Emi's sign is drying beside the door. The letters are plain enough to read from outside. A little flourish survives in the corner, where it does not have to direct anyone toward the washroom.

Riku has written the boundary dimensions on the back. Akari has checked the visitor path. Ren's introduction occupies one page. Yuzu has reduced the population of paper moths on the plan to one.

yuzu~amused|A regrettable loss of committee members. The remaining representative has accepted the revised agenda.

You look at the room and can remember how each small piece was chosen. The chair belongs near the door because somebody asked for it. The privacy curtain hangs where it does because Mika tested the room while it was occupied. The introduction is shorter because Riku's actual work needed time to be seen.

There is still no agreed announcement for the end. Ren suggests they settle that after practice. Akari agrees and points to the keeper's instruction: civic signals remain separate from hall announcements. It stays visible on the board.

you|Even if the sound would be familiar?

akari|Especially then. Familiar sounds already mean something to people outside this room.

She turns toward the clear space and checks that nothing from the presentation is lying in today's practice route. The preparations can wait while you do the work you came for.

Later, somebody will want an elegant ending. For now, the instruction is there, legible and ordinary. A room does not become reliable simply by containing a good piece of paper. It has to remember to use it when an attractive idea arrives.
`))
];
