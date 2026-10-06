import {section as part,pick,recall,opening,type Expansion} from "./month-authoring";

export const WEEK_THREE:Expansion[]=[
 {before:[...part("Scene one · a case from home","courtyard",`
Ren is halfway through painting the arrow when a man carrying a travel case appears at the gate. The visitor stops outside the wet paint's reach, checks whether the courtyard is in use, and waits to be waved in. Ren looks up with his brush still held against the sign.

ren~amused|You brought the case. I thought Mother would finally turn it into a planter.

haru~amused|She considered it. Your socks discouraged agriculture.

Ren puts the brush down before going to meet him. They embrace, step back, and each begin a different sentence at the same time. Both stop. Ren waves him through the gate and tries again.

ren|This is Haru. My brother. Twenty-seven. Excellent at packing things so you cannot find anything until the entire case is empty.

haru|Everything you asked for is on top.

ren|A recent improvement. Welcome to Lantern Hall.

Haru asks your name, then waits for the answer instead of looking over your shoulder at the training space. His case has a repair on one corner, sewn with a different color of thread. Ren notices it immediately. Their mother did it. Haru tried first, and his contribution is now hidden underneath hers.

you|Do you need help carrying it in?

haru|Thank you. I'll take it. Where should it go?

He asks that of Ren. Ren tells him, and Haru puts the case where he is asked, clear of the practice boundary. A small thing, but it lets the visitor enter somebody else's place without beginning by rearranging it.
`),pick("month:haru","What would you ask Haru while Ren washes the paint from his hands?",[
 {id:"case",label:"Ask about the repaired travel case.",speaker:"haru",text:"Mother kept it because Ren liked the pockets. I thought he had forgotten it. Then he listed every pocket in his note.",expression:"amused",memory:"Haru hears you ask about something Ren chose."},
 {id:"visit",label:"Ask what brought him here today.",speaker:"haru",text:"The case was the convenient reason. I wanted to see the place he talks about. I could have said that first.",expression:"concerned",memory:"Haru admits he wanted to see Ren's hall."}
 ])],after:[...part("Scene three · the thing in the side pocket","hall",`
After the exchange, Haru sits with the case open on his knees. He has put a folded cloth beside the bread knife. Ren recognizes the cloth too. It used to cover the dough bowl when they were young enough to be told not to lift it every few minutes.

ren~amused|You lifted it as well.

haru~amused|I lifted it once to check whether you had lifted it.

ren|An extraordinary distinction.

Haru laughs, then asks where the knife should go. Ren takes it to the kitchen shelf. For a moment the conversation has an easy route. It becomes harder when Haru looks at the demonstration list and begins to suggest a way Ren could make the sequence more impressive.

ren~concerned|We agreed on a short one people could see clearly.

haru|I meant the same length. Just a different entry.

ren|You don't know the audience route yet.

Haru looks toward the chairs. He has been here less than an hour. He closes his mouth, studies the clear path, and asks Ren to show him the actual plan. Ren puts the list on the table between them, rather than handing it over like a paper submitted for correction.
`),pick("month:brothers","The brothers pause over the plan. How do you join the conversation?",[
 {id:"ask",label:"Ask Ren to explain the stopping signal to you too.",speaker:"ren",text:"Yes. That's the part the audience will see first. Haru can watch from the visitor side with us, if he wants.",expression:"determined"},
 {id:"space",label:"Give them room and take the empty cups away.",speaker:"haru",text:"Thank you. Ren, can I look at it from the chairs? I think I've been imagining a different room.",expression:"concerned"}
 ]),...part("Scene four · a visitor's place","courtyard",`
Haru watches from the chairs. He asks one question about where the audience will stop and another about the end of the exchange. Ren answers both. Akari supplies a detail Ren has missed. He accepts it without pretending the question was unfair.

The paint is dry enough for the arrow to be moved. Haru offers to hold it while Ren attaches the pin. This time he does not choose the height. Ren asks him to lower it slightly, and he does.

haru~soft|I like what you've made here.

ren~concerned|You don't have to say it because you're visiting.

haru|I know. I would like you to believe I can say it for another reason.

Ren looks at the sign instead of answering immediately. The pin takes two attempts. You can see Haru waiting without making another sentence to fill the first one's space.
`),recall("month:haru","case","haru","The apprentice asked about your pockets. I told them you remembered all of them.","amused"),recall("month:haru","visit","haru","I told the apprentice the case wasn't the only reason I came. I wanted to see this. I should tell you as well.","soft"),...part("Scene five · not finished","hall",`
Ren asks whether Haru can stay for bread. Haru checks his return time and says he can stay for that, but not supper. Ren offers the actual bread instead of persuading him to change the train.

The case is empty now, except for an old list in the bottom pocket. Ren folds it and puts it back. There may be more to say between them. Today they have said enough to make another ordinary visit possible.
`)]},
 {before:[...part("Scene one · the useful arrival","hall",`
Shigure comes at the time written on his card. He leaves room for a neighbor to pass through the gate before entering and asks Daichi whether the visit still fits. Daichi says it does. The table has been cleared of bread, maps, and a half-painted sign so the papers can lie flat.

shigure|Thank you for making the time. I'm Shigure. I organize the town's training network and some of its transport work.

He is thirty-nine, with a practiced way of making an explanation short without making it sound impatient. He knows Mika has another village visit this month and offers to check whether a supply cart could take part of her load. She asks him to send the actual route first. He writes that down.

Ren carries over a chair. Shigure thanks him and checks whether taking it leaves the visitor corner short. It does. He chooses a stool instead.

shigure~amused|The comfortable chair has more important work. I can tolerate a stool while discussing furniture.

You have expected an offer to feel like a stranger walking into the room and telling it what it lacks. This stranger already knows several things the hall needs. That makes you pay attention before the papers have even been unfolded.
`),pick("month:proposal-question","Shigure asks what you would like clarified as a beginner here.",[
 {id:"room",label:"Ask whether visitors could still come without joining.",speaker:"shigure",text:"That should be possible. I can mark it as an explicit condition, rather than rely on everyone remembering that I said it.",memory:"The written questions include ordinary visitor access."},
 {id:"practice",label:"Ask who could change your beginner practice plan.",speaker:"shigure",text:"The network would set minimum requirements. Who can adapt them, and how, needs a clearer answer in the terms. It's a fair question.",memory:"The written questions include authority over beginner plans."}
 ])],after:[...part("Scene three · the chair and the clause","hall",`
After Shigure leaves, his stool remains tucked beneath the table. The chair with arms is still by the entrance. You look from one to the other while Akari numbers the pages of his proposal.

you|He noticed the chair before taking it.

akari|Yes. He understands the room. That doesn't answer who should have authority over it.

ren~concerned|It should count for something, though.

akari~concerned|It does. So do the clauses. I don't want to dismiss the useful parts just to make refusing easier.

Sora places a blank sheet beside the proposal and writes 'questions' at the top. Daichi reads the funding figure twice. He tells Riku that regular payment would make a real difference. Riku agrees, then points to the part that assigns review of repairs to a central office.

riku|I want payment. I also want to know who can approve a change when a measurement on the paper is wrong.

Nobody accuses him of being difficult for caring about both. Ren starts listing the things they could finish with funded timber. Akari lets him finish before turning to the limits on public demonstrations.

Haru has left for his return journey. The hall has to have this conversation without borrowing his confidence about Cedar School. You place the signed estimate beside the funding page so that the actual cost remains visible.
`),pick("month:proposal-notes","How would you help make the questions readable?",[
 {id:"columns",label:"Make columns for what is offered and what is required.",speaker:"sora",text:"Good. Put a question mark where we don't know yet. A column should not turn a guess into a fact.",memory:"Sora uses your offer-and-requirement columns."},
 {id:"pages",label:"Mark each question with the page it refers to.",speaker:"akari",text:"Useful. We can ask for the actual wording without spending the first half of the reply finding it.",memory:"Akari uses your page references."}
 ]),...part("Scene four · work that remains","courtyard",`
Daichi carries two cups outside. He offers one to you and sits on the low wall. From here the hall is the same room you left, with a price on its unfinished work and a proposal that would cover much of it.

daichi~concerned|I understand why people accept an arrangement like this. Running short of things is not an interesting moral achievement.

you|Do you think they should accept?

daichi|I think we should ask the questions we've written. Then we'll have a decision about an actual arrangement, instead of a feeling about the word independent.

He looks toward the red scarf beneath the beam. You do not ask him to explain everything he has not yet explained. The visible question on today's table is large enough.

Inside, Ren is counting the chairs Shigure could provide. Akari is underlining the authority clause. Sora keeps both pages open. They have received something materially useful, and the work of understanding it has only begun.
`)]},
 {before:[...part("Scene one · a map under calendars","town",`
Sora asks if you would like to accompany her to the record shop after practice. She is looking for an ordinary town map that might clarify a line on the proposal. The errand does not require touching any ward equipment, and she says so before you agree.

The shopkeeper remembers the map's general location with a confidence that survives three wrong cupboards. In the fourth are old calendars, all for the same year. Sora turns one over, reads its unhelpful title, and puts it in the pile you are moving.

sora~amused|We have enough copies of that year to revisit it several times.

you|Would it explain why the map isn't here?

sora|Probably not. It might sell us a very dated festival invitation.

You clear a space for the folded map. One corner has stuck to its paper sleeve. Sora asks the shopkeeper before lifting it free. The sleeve tears a little. The map does not. She writes down the damage so it cannot later be mistaken for something the page already had.

The lines on the map are thinner than you expected. The hall is a rectangle beside a junction, not a grand building in the center. One line continues toward the river and runs off the edge. Sora looks at the index rather than deciding what the missing length must mean.
`),pick("month:map-method","How would you help keep track of the search?",[
 {id:"list",label:"List the cupboards already checked.",speaker:"sora",text:"Please. Then we won't turn my confidence into a fifth inspection of the first shelf.",expression:"amused",memory:"You keep a short search list."},
 {id:"sleeve",label:"Label the sleeve with where this map came from.",speaker:"sora",text:"Yes. Include the shopkeeper's shelf description. 'Found at the shop' is less useful than it sounds.",memory:"You label the map's source."}
 ])],after:[...part("Scene three · what a blank means","town",`
The shopkeeper brings a second index. It lists the same missing page. Sora checks the printing date and discovers both indices came from the same batch. Two copies have repeated the claim. They have not provided two independent accounts.

you|I thought finding it twice would settle that part.

sora|It settles what that batch of copies says. We can keep that without asking it to settle anything else.

She writes three headings: found, reported, unanswered. Under the last, she puts the page number. Under reported, she puts the shopkeeper's memory of the third bell note and the uncertainty about when it became difficult to hear.

Toma stops outside with a parcel. He repeats a complaint he heard from the lower river and then, when Sora asks, admits he does not know the speakers' names. She thanks him for the distinction. He seems relieved that correcting his own story has not made it useless.

toma~concerned|I wasn't trying to make it sound more official.

sora|I know. We can ask about it without saying it has been proved.

The old bell sounds while you are packing the map. Two notes. You have heard them before. Today you also have a written account of what three used to mean, and an adult who is willing to say that the account needs checking.
`),pick("month:uncertain","What would you like written beside the missing page number?",[
 {id:"unknown",label:"'Not found in this copy.'",speaker:"sora",text:"Accurate. It doesn't claim there is no copy anywhere else.",memory:"The note records exactly what this copy lacks."},
 {id:"next",label:"'Ask the archive which copy to check next.'",speaker:"sora",text:"A useful next step. I'll put it under unanswered, with a date to request it.",memory:"The note includes a specific archive request."}
 ]),...part("Scene four · carrying an unfinished thing","courtyard",`
On the way back, Sora holds the map sleeve under her arm where rain cannot reach it. She tells you she used to carry route records as a courier. You ask whether carrying something meant understanding it.

sora~concerned|Sometimes it meant understanding only the address. I used to find that easier than I do now.

She slows before the hall. Through the door, you can hear Ren asking Akari about the funding clause. Sora adjusts the sleeve and begins to say that the map could wait until she has another answer. Then she stops.

sora|It is unfinished. That may be a reason to label it. It may also be a reason I use to keep it with me.

you|What would help?

sora|A specific question, to someone who can help answer it. I don't have to decide every part on the step.

She opens the door. The map stays in its sleeve. Nothing about noticing a missing page has made you qualified to examine the bell, and nothing about the uncertainty makes the missing page less worth discussing.
`)]},
 {before:[recall("month:proposal-question","room","ren","Your question about ordinary visitors is still on the terms sheet. I want that condition in writing too."),recall("month:proposal-question","practice","akari","Your question about who can change beginner plans is beside the demonstration clause. We still need that authority stated clearly."),...part("Scene one · before the room gets sharp","hall",`
The proposal is still on the table when you arrive. Akari has made notes in the margin. Ren has copied the funding figures onto a separate page. Sora puts the map beside them, clearly marked as incomplete. Haru has returned for a second short visit, this time without a case to use as his reason.

Daichi begins to set out tea. He watches the expressions around the table and offers to move the discussion until after everyone has had a cup. Akari says she would prefer to begin. Ren agrees. Daichi sets the cups within reach and sits down rather than finding another way to delay.

You sit at the end, where you can see the proposal without leaning over somebody's shoulder. There is no expectation that you adjudicate a disagreement among people who know far more about running a hall. Akari asks if you can keep the question sheet open. You agree to that actual task.
`),recall("month:proposal-notes","columns","sora","The two columns will help. We can put Ren's cost question beside Akari's authority question without pretending one cancels the other."),recall("month:proposal-notes","pages","akari","Keep the page references visible. I want to answer the clause Ren is pointing to, not a summary I made of it."),...part("Scene one · continued","hall",`
Ren rubs his thumb along a flour mark on his cuff. Akari straightens the pile of pages. Their familiar habits look different when they are preparing to disagree.

ren~concerned|Can we say at the start that paying Riku is part of this? I don't want the practical thing to disappear under the important thing.

akari~determined|Yes. It is important too. Can we also say that refusing an unsuitable demonstration has to remain possible?

He nods. The first agreement takes less time than either seemed prepared for. It does not settle the rest of the conversation.
`)],after:[...part("Scene three · what gets written down","hall",`
The room is quiet after Akari asks to pause. Ren gets up and takes the empty tray to the kitchen. Akari starts collecting his pages, then asks whether he wants them left where he put them. He says yes. She leaves them.

Haru has gone back to his lodging; the memory of what he said about Cedar School stays on the question sheet. Standards can clarify work. They can also make some questions harder to ask. Ren had looked surprised by that second sentence. Now he writes it beneath the clause he wants clarified.

Yuzu sits on the floor with the paper moth she has been folding. Its wings are uneven. She unfolds one instead of pulling the other harder.

yuzu~concerned|I might have made that sharper than it needed to be.

you|Asking them to say the difficult part?

yuzu|Yes. It helped. I still didn't have to enjoy being the person who asked.

She sets the moth down and asks Ren whether he wants help with the tray. He declines. She leaves it there, without turning his answer into another insight the whole room must hear.
`),pick("month:argument-note","Which question would you put at the top for the next discussion?",[
 {id:"cost",label:"What funding could the hall accept without transferring every decision?",speaker:"akari",text:"Keep that one. We need an alternative with costs, not just a refusal we admire.",memory:"The next discussion starts with a concrete funding alternative."},
 {id:"refusal",label:"Who would decide whether a demonstration can be refused?",speaker:"ren",text:"Keep that one. I don't want the funding to depend on a promise none of us can safely make.",expression:"determined",memory:"The next discussion starts with authority over refusal."}
 ]),...part("Scene four · the thing at the end of the table","hall",`
Sora touches the map sleeve and asks you to read the three headings. Found. Reported. Unanswered. Everything you brought back from the shop is still under the heading where it belongs.

sora~concerned|I can show it to Akari now. Or check the next copy with you before the fuller discussion, with a date to report what we find. I want to ask instead of deciding that for everyone.

She is not offering a permanent secret. You ask what a short verification would involve. She names the archive copy, the question about its pagination, and the point when Akari would hear the result even if no new answer had been found.

Across the room, Akari is rereading Ren's funding figure. Ren returns from the kitchen and looks at the clause Akari circled. The disagreement has not vanished. They have stopped long enough to make the next conversation about the things they actually fear losing.

You leave the top question visible and the map in its sleeve. Next time, somebody will have to hear an unfinished finding. The remaining choice is how to begin that conversation honestly.
`)]},
 {before:[recall("month:argument-note","cost","ren","We opened today's proposal discussion with your funding question. I've asked for an alternative that pays for the work without handing every decision over."),recall("month:argument-note","refusal","akari","We started today's proposal discussion with your question about refusal. I've requested the exact process, including who decides an objection."),...part("Scene one · the question with a date","hall",`
Sora has brought two blank note cards. One is for an open conversation with Akari. The other is for a short verification with a date attached. She puts them side by side, without a mark showing which one she prefers.

sora|If we speak now, we can say exactly what we don't know. If we check first, we need to agree when checking stops being a reason to wait.

you|Can the first conversation be small?

sora|Yes. The room does not have to become a public meeting to hear one uncertain thing.

Akari is outside speaking to Riku about the measurements. She can join when they finish. The archive request can also be made today. There is time to take either route without pretending that the choice has solved what the map means.

Ren puts the funding pages away so the table belongs to this question for a while. He does not stay to overhear. Daichi asks if you want tea. Sora says after the first part. He accepts that and takes the empty tray back out.

The bell sounds through the window. Nobody looks at you for an answer. You are a beginner helping an adult decide how to share a finding, not the person assigned to repair a town's signal.
`)],after:[recall("consult","open","sora","I'll ask Akari to join us. First the missing page, then the possible explanations. She can help decide what to check.","determined"),recall("consult","verify","sora","The verification ends before the next bell inspection discussion. I'll report even if the next copy gives us no new answer.","determined"),...part("Scene three · the first record","hall",`
Sora writes the agreed route on the card and puts her name beside the follow-up. She asks you to check that it matches what you understood. A written record cannot remember the conversation correctly if it begins by describing a different one.

You read it. The missing page is not yet called a deliberate removal. The shopkeeper's memory is still a reported memory. Toma's overheard complaint is still a lead to ask about.
`),recall("month:uncertain","unknown","sora","Your wording is still here: not found in this copy. We'll keep it until we have a reason to say more."),recall("month:uncertain","next","sora","Your archive question has its date now. That next step will stay visible whether we speak first or check first."),...part("Scene three · continued","hall",`
Akari comes in after Riku has finished. Sora tells her which route you chose. Even the verification version begins with the existence of a question and an agreed reporting point, rather than making Akari discover afterward that everybody else knew something she did not.

akari~concerned|All right. Say when you don't have an answer. I can plan around uncertainty if I know where it is.

Sora nods. You see her grip loosen around the pen. Being questioned does not seem to have pleased her. Having the question exist somewhere outside her own notebook seems to have made it easier to hold.
`),pick("month:archive","How should the follow-up be kept where people can find it?",[
 {id:"card",label:"Leave the dated card with the map sleeve.",speaker:"akari",text:"Then the question and the promise to return to it stay together. I'll leave room beside them for the reply.",memory:"The map has a dated follow-up card."},
 {id:"board",label:"Put a simple reminder on the shared task board.",speaker:"sora",text:"Just the task and date, without an alarming summary. Whoever reads it can ask me for the actual notes.",memory:"Sora puts the follow-up on the shared board."}
 ]),...part("Scene four · not the whole answer","courtyard",`
Outside, Yuzu is collecting the cups Daichi left on the wall. She asks whether the map now has somewhere to go besides Sora's arm. You say it does. She does not ask which route was the better one.

yuzu~soft|Good. Paper is easier to share when it stops being part of a person's posture.

Sora comes out with her hands empty. She looks toward the bell and says the keeper has agreed to a controlled listening check. You ask whether you should come. She says you can watch from the visitor side, if you want. The trained people will set the space and handle the equipment.

There is no invitation to practice on the signal, imitate the check, or earn a title by noticing its fault. The next useful task may be recording what somebody actually hears. That is something you can do without being made into the solution to everything the map has raised.

You finish the tea before it goes cold. The follow-up has a place. The question has a date. The missing page is still missing.
`)]},
 {before:[...part("Scene one · the visitor side of the check","courtyard",`
The bell keeper has marked a listening point in the courtyard. Akari checks that the visitor route remains outside the equipment space. Riku has brought a notebook, not a box of tools he intends to use before the inspection is understood.

Sora asks whether you would like to note the order of the sounds. You can decline and simply watch. You choose the notebook, and she shows you what to write: time, number of notes, anything you actually heard. No explanation has to be invented to make the line look complete.

Ren stands beside Akari. He asks her to repeat the stopping signal before they begin. She does. Their short exchange belongs to trained adults checking a fictional piece of town infrastructure. Your own beginner practice has already ended and asks for no extra work here.
`),pick("month:bell-note","What would make the listening note easiest to read afterward?",[
 {id:"count",label:"Number each check and leave room for the notes heard.",speaker:"sora",text:"Yes. A blank field can stay blank. We'll know which check it belongs to.",memory:"Your record numbers each listening check."},
 {id:"time",label:"Put the time first, then the exact sound count.",speaker:"riku",text:"Useful. I can match it to the keeper's record without guessing which attempt we're discussing.",memory:"Your record ties each sound count to a time."}
 ])],after:[...part("Scene three · after stopping","courtyard",`
When the check stops, Ren stays where he is until Akari has confirmed the space is clear. Then he walks toward the cups. His hand trembles a little when he picks one up. He puts it back, waits, and tries again with both hands.

you|Do you want me to carry it?

ren~concerned|Yes. To the bench, please.

It is a direct request. You carry one cup. You do not become his substitute partner, or receive a secret technique for noticing that he is tired. Akari sits at the other end of the bench and lets the keeper finish the first equipment note before asking a question.

Riku reads your record aloud. You correct a time you copied into the wrong line. He draws one line through it and writes the correction beside it. The original error remains readable.

riku|Now I know what changed. Erasing it would only make the notebook look prettier.

Sora checks the number of sounds against her own hearing. She agrees with your count and marks that the two observations happened at the same check. That is useful corroboration, she says. It still does not tell you what caused the missing note.
`),recall("consult","open","akari","I'm glad we had the map question before this check. Keep the uncertainties visible in the report.","determined"),recall("consult","verify","sora","The second copy did not resolve the missing page. I've reported that as promised. Today's check gives us another observation, not a reason to postpone the first one.","determined"),...part("Scene four · an inconvenient result","hall",`
The keeper confirms that the civic signal remains distinct from any hall announcement. Nobody should borrow even the outer signal handle for a performance while the fault is under investigation. Akari asks for that instruction in writing and pins it beside the visitor plan.

Ren reads it. Yuzu reads it too. She says a spoon on a tin would probably make a better announcement anyway. At the moment it is an idle suggestion. You will remember later that a useful answer was already in the room.

Daichi asks the keeper what the hall can do now. The answer is limited: preserve the closed area, record further observations, request the next source, leave the mechanism to the appropriate trained people. He accepts the limit without calling it a disappointing lack of action.
`),pick("month:after-check","The discussion is finished. What small thing would you do before leaving?",[
 {id:"cups",label:"Take the used cups inside.",speaker:"ren",text:"Thank you. I'll wash them once my hands have settled. I am choosing one job that doesn't involve an impressive ending.",expression:"soft"},
 {id:"notebook",label:"Put your finished note beside the keeper's report.",speaker:"sora",text:"Good. Leave your name on what you observed. You don't need to sign the explanation someone else will investigate.",expression:"soft"}
 ]),...part("Scene five · more than one kind of progress","courtyard",`
By the gate, Akari checks tomorrow's list. She moves one unnecessary task to another day. Ren asks whether that means they are falling behind. She says it means the check took work and somebody has to be allowed to recover from doing it.

akari|The town review happens when the preparations reach it. We don't improve this result by treating every quiet hour as a failure.

The arrow Ren painted points inward. The old bell has still given two notes. One ordinary sign works better than it did. One older signal needs attention. Both facts can exist on the same visit.

You go downhill with no equipment, no new rank, and the knowledge that a finding can be worth sharing before it has become a complete story. Behind you, Sora leaves the notebook open beside the map so the next person can see where the questions begin.
`)]}
];

export const WEEK_THREE_OPENINGS=[
 opening(3,1,"An Arrow Worth Finishing",part("Opening · paint and visitors","courtyard",`
The paint pot is open at last. Ren has come at the time he agreed with Akari, and she has left the arrow unfinished for him. You find them comparing two shades that look identical until one of them tilts the sign toward the daylight.

ren~amused|This one is welcoming. That one is bureaucratic.

akari~amused|They are the same pot. The brush is wetter on the left.

He studies the wet edge, accepts the explanation, and finishes the stroke. She holds the sign instead of painting the other half herself. It takes slightly longer than either could have done alone. Neither seems to mind that part.

Someone has asked whether the hall can host another visit. Someone else has sent a proposal with a useful funding figure and terms still to be discussed. The room is being noticed by people who have different reasons to want it open.

Ren's brother is expected with an old travel case. Ren says this while checking the paint on his hands. He has a joke ready about the case and no very clear answer about how long his brother might stay.

you|Do you want the courtyard clear when he comes?

ren|We'll ask whether he wants to practice before moving everything for the version of his visit I invented. Akari has had a regrettable influence on me.

akari~amused|You are welcome.

She puts the sign aside to dry. Your own practice has its usual place and its usual rests. The visitors can wait until it is finished. You are not required to impress Ren's brother, endorse a proposal, or solve the bell before beginning your ordinary movement work.

On the shelf is the repaired case's empty space. By the door is the arrow somebody kept a promise to finish. You put your bag beside it, leaving room for whoever arrives next.
`)),
 opening(3,4,"The Page We Have",part("Opening · keeping the question visible","hall",`
The map sleeve lies beside Shigure's proposal. Neither covers the other. Sora has marked the map as incomplete, and Akari has kept the repair estimate in sight of the funding terms.

You recognize the page number that has no page. You also recognize the price Riku quoted for actual timber and work. One problem has become interesting. The other has not become less real.

Daichi sets down a tray and asks if anybody wants to finish the discussion before practice. Ren looks at the proposal, then at the clear room.

ren~concerned|After. I want to read that clause without trying to hold today's whole plan in my head.

Akari agrees. She begins to straighten the proposal and stops with Ren's note still slightly crooked beside it. You wonder if leaving it that way took more effort than moving it would have.

sora|I can request the next copy. That won't decide how we respond to the offer.

akari|No. And responding to the offer won't make the missing page go away.

They say those things calmly. Later there will be a conversation that is harder to keep calm. For now, the room has named the separate tasks instead of making one feel like the answer to all of them.

You leave the map covered while the floor is in use. The keeper will handle the signal check. The adults will discuss the terms. You can help keep a question readable without being made responsible for every answer.

Ren checks the stopping signal with Akari. Your practice begins with something much smaller: the space you have, the support you want, and the next movement you can repeat comfortably.
`))
];
