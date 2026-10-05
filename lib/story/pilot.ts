import {lines,reply,type StoryScene,type StoryLine,type StoryChoice} from "./types";
import {EPISODE_1} from "./episode-1";

export const PILOT_REVISION="week-one-v2";
function section(heading:string,location:string,script:string):StoryLine[]{return lines(script).map((l,i)=>({...l,location,...(i===0?{heading}:{}),...(l.speaker!=="narrator"&&l.speaker!=="you"?{expression:"neutral" as const}:{})}));}
function decision(flag:string,prompt:string,options:[string,string,string,string,string?][]):StoryLine{return {speaker:"narrator",text:prompt,decision:{flag,prompt,options:options.map(([id,label,speaker,text,memory])=>({id,label,reply:reply(speaker,text,"soft"),memory}))}};}
function introduction(member:string,text:string):StoryLine{return {speaker:member,text,introduces:member,expression:"soft"};}
function original(beat:number):StoryLine[]{return EPISODE_1[beat-1].lines.map(l=>({...l}));}
function episode(beat:number,title:string,parts:StoryLine[]):StoryScene{let location="hall";return {id:`c1-pilot-${beat}`,revision:PILOT_REVISION,kind:"main",episode:1,beat,title,location:"hall",readingMinutes:"15–20",lines:parts.map((l,i)=>{location=l.location??location;return {...l,location,id:`c1-pilot-${beat}-p${String(i+1).padStart(3,"0")}`};})};}
function opening(beat:number,title:string,parts:StoryLine[]):StoryScene{let location="courtyard";return {id:`c1-pilot-opening-${beat}`,revision:PILOT_REVISION,kind:"opening",episode:1,beat,title,location:"courtyard",readingMinutes:"5–10",lines:parts.map((l,i)=>{location=l.location??location;return {...l,location,id:`c1-pilot-opening-${beat}-p${i+1}`};})};}
export const PILOT_PROLOGUE:StoryScene={id:"c1-pilot-prologue",revision:PILOT_REVISION,title:"Before the gate",kind:"prologue",episode:1,beat:0,location:"town",lines:lines(`The road to Lantern Hall turns uphill after the market. A paper moth hangs from the gate. Someone has written OPEN beneath it, then added LIFT THE LATCH.\n\nYour first week begins here. On selected days, a story opening comes before practice. Read it first, then begin your workout. Days without an opening go straight to practice.\n\nA completed normal or gentle practice opens the next episode. Each week-one episode is written for about fifteen to twenty minutes of reading; pause whenever you like. Wednesday is full rest.\n\nYou begin with solo practice. As you meet the founders in the story, they become available as companions.\n\nThe gate is unlocked. Beyond it, something scrapes across a wooden floor.`)};

PILOT_PROLOGUE.lines.forEach((line,index)=>line.id=`c1-pilot-prologue-p${index+1}`);
export const PILOT_MAIN:StoryScene[]=[
episode(1,"The Door That Sticks",[
...section("Cold open · The wrong entrance","town",`
The mountain road has three signs for Lantern Hall. One points uphill, one points toward a bakery, and the third lies beside the wall where you moved it away from the path. You turn it over. It points at your shoes.

A woman carrying folded laundry stops beside you. She looks at the sign, then at the uphill road.

The hall, she tells you, is the building with the lantern that never lights before dusk. The bakery is where you should go if someone has promised the hall will have bread. Those are often separate promises.

She takes the fallen sign from you and props it against a wall. There is no grand gate at the top of the hill, only a low fence and a narrow courtyard with weeds growing around a remarkably clean path. A paper moth turns on a string above the latch.

Behind the fence, a young man in training clothes is attempting to carry a bench through a doorway sideways. A woman stands on the inside holding a pencil. Neither is moving.

ren|I measured it.

akari|You measured the bench. This is the door.

ren|I believed they would cooperate.

He backs out and finds you on the path. For an instant he looks as if he might pretend this was part of a demonstration. Then he puts his end of the bench down.

ren|You haven't seen a third person with the other half of my common sense?

The woman lays the pencil across her notebook and comes to the threshold. She lifts the door slightly, pushes it back, and points to the strip of clear floor beyond it.

akari|Come around the bench. The yellow cord is a boundary, not a decoration.

There is enough room to enter if everyone shifts something. The man takes the bench back into the courtyard. The woman moves a crate. No one moves the yellow cord.
`),
introduction("akari","I'm Akari. I keep the practice plans and the hall's appointments. You were expected; the furniture was not."),
introduction("ren","Ren. Occasional furniture negotiator. Usually better company than this."),
decision("pilot:arrival","Akari asks what brought you up the hill.",[
["curious","I wanted to see what learning here actually looks like.","akari","Then look around before deciding what you expect from us. There are useful things here, and unfinished things."],
["playful","The sign suggested either martial arts or excellent bread.","ren","Both is an ambitious promise. I can currently defend the bread."],
["direct","I want to start from the basics and build something consistent.","akari","We can start there. Tell me when an instruction isn't clear; I won't learn that from a polite nod."],
["reserved","I'd rather find my feet before explaining everything.","akari","All right. I'll show you where things are. Questions can come later."]]),
...section("Scene one · A room with edges","hall",`
The hall smells of timber, tea, and a damp cloth left too near an open window. Sunlight crosses the floor in long rectangles. One rectangle ends at the cord; beyond it, a board bows slightly between two dark beams.

Akari notices where you are looking. She gives you the short version: damaged joists, a carpenter coming tomorrow, no practice across that line. Ren supplies a much longer version involving a storm, an unhelpful bucket, and a floorboard that had apparently been making threats for years.

akari|The bucket is still useful. Your account is becoming less so.

Ren takes the hint and picks it up. There is a pale ring beneath it. He looks at the ceiling, frowns, and puts it down a few inches to the left.

The hall is not arranged like a classroom. There are mats stacked beside a cupboard, five hooks by the door, a low shelf of cups, and a notice board with more crossed-out appointments than appointments. A sixth hook holds a red scarf wrapped around the beam above it.

Akari gives you a place for your things. Ren points out the water jug, then remembers it is empty and carries it outside. For a minute the room has only the quiet noises of somebody else's routine: pencil against paper, door against frame, the scrape of your bag settling under a chair.

akari|Have you used a timed practice plan before?

She waits for your answer instead of completing the question for you. When she explains today's basics, she puts the sheet on the table between you. There is a standing preparation and an alternative using a stable chair. Neither is written in smaller letters.

You try placing your feet without stiffening your knees. It is an ordinary movement made unfamiliar by paying attention. Akari watches once, then asks whether you want a correction or a moment to try again.

Ren returns with the water. He starts describing how the stance leads into a step, turns to demonstrate, and nearly puts his heel in the bucket.

ren|That is our advanced awareness exercise. Avoid the bucket.

akari|You haven't passed it.

His laugh is quick. Hers comes a moment later. You notice that she has not removed the bucket to make his joke easier.

He dries the small spill before continuing. This time he makes the movement slowly. His hands are less extravagant when they have something real to do. The step stops where he intended; the rest of him arrives with it.

ren|I like the part where everything starts to connect. Akari likes the part before that.

akari|I like the part where people know what they are connecting.

They have clearly had this conversation before. Neither seems entirely tired of it, which may be more dangerous.

The door knocks against its frame. A voice from the courtyard asks which of them has borrowed the wide brush. Ren looks at Akari. Akari looks at the wet floor. He goes to find the brush.
`),
...section("Scene two · The fifth chair","courtyard",`
Outside, the bench has become an informal worktable. One leg is wrapped in cloth to protect the stone. There are two estimates under a jar, a coil of twine, and a plate covered by another plate. Ren uncovers it and offers you bread.

akari|Those are for the repair visit.

ren|There are six.

akari|There were six.

He looks at the half-roll in his hand. For once he does not produce a defense. He breaks it and leaves half on the plate.

Akari sits down with the estimates. Ren remains standing until she asks him to bring a fifth chair. He brings a fourth, realizes she has counted the bench, then goes back inside. You are left opposite the neatly squared papers.

The two estimates describe different first jobs. One repairs the practice floor; the other repairs the entrance and welcome corner. Both include dates. The space beside the name of the person responsible is blank.

akari|It's not your first-day homework. I left them here because we keep postponing the conversation.

She turns the papers over before you can begin studying them. On the back of one is a small sketch of the front door. On the back of the other, in a different hand, the door has enormous teeth.

Ren returns with the chair. He sees the sketch, stops, and asks whether the teeth are proportionate. Akari says the door's hinges are the only part she can inspect accurately. She does not put the sketch away.

You sit while they discuss tomorrow's visit. Ren wants to tell the neighbors the hall is taking beginners. Akari wants the floor checked before sending an invitation. He says the cord already keeps people out of danger. She says an invitation creates expectations she will have to answer.

ren|We can't keep explaining the hall as a list of things that aren't ready.

akari|We can't explain it as a list of things you hope will be ready.

The words land harder than their earlier jokes. Ren stops touching the edge of the plate. Akari looks at her pencil as if it has supplied a sentence she did not request.

Neither asks you to choose a side. A cart passes on the road below. Its wheels make four distinct knocks over a broken patch of paving. The small silence in the courtyard lasts through all four.

Ren says he will write an invitation and bring it to her before posting it. Akari agrees, then begins naming three things it must include. He asks her to let him write it first.

She stops at the second item. He retrieves a sheet. You have watched a disagreement become a task without becoming an agreement. The bench does not suddenly feel less crowded.
`),
decision("pilot:threshold","Ren leaves a space at the bottom of his draft. “What did we forget to tell someone arriving for the first time?”",[
["ask","Tell them what happens after they walk through the door.","ren","Yes. That should probably come before my description of the view."],
["joke","Warn them that the door wins most of its arguments.","ren","I'll give it a respectable opponent in the drawing. Me, presumably."],
["clear","Say exactly which space is open and who answers questions.","akari","That I can put on the board today. Ren can still make it sound like an invitation."],
["quiet","Can I read the draft before offering anything?","ren","Please. The first version has usually mistaken enthusiasm for punctuation."]]),
...section("Scene three · What a room promises","hall",`
Before you go, Akari asks you to choose where the next written plan should wait. She suggests the board, then realizes she has called it a choice while already reaching for the pin. She puts the pin down.

You settle on the table beside the chair. It is easier to read there than standing in the doorway. Ren asks whether the first invitation should say that. Akari says the invitation is for the hall's actual arrangements, and he can add the place without making it sound like a ceremony.

He starts writing WELCOME TABLE, then crosses out WELCOME and writes PLAN TABLE. He looks at you, uncertain whether the change has made it clearer or simply less friendly. Akari says it can be a table with more than one use. Ren looks offended on behalf of all their labels.

They have spent five minutes on a surface nobody outside the room would think to describe. Yet you know where to go next time. The knowledge is more useful than a promise that everything here will feel familiar immediately.

Ren clears the tools from half the table. Akari notices him making two piles, one of which consists entirely of things he intends to put away later. She asks when later is. He puts them away before answering.

You put the plan beside your cup. For a moment the room has a place where your next visit already fits.

The afternoon light has shifted when you go back inside. The chair you used is still in the same place. Your things are still underneath it. You expected someone to have put the room back in order around your absence; instead it has retained one small trace of you.

Akari fixes the invitation to the board with a single pin. She reads it standing back, moves the pin half an inch, and catches Ren watching. He raises his hands in surrender without saying anything. She leaves it where it is.

ren|Tomorrow's bread will be less theoretical.

akari|You have the bakery shift tomorrow.

ren|I can bake before it.

Her expression changes. He sees it this time. The new promise hangs between them beside the old blank space on the repair estimates.

He takes a breath, checks the time, and changes the promise to bringing one loaf from the bakery after asking its owner. Akari nods. It is not as impressive a sentence. It sounds more likely to happen.

You put your cup on the low shelf. A blue bowl stands upside down at the far end. Ren moves a cloth around it rather than picking it up. When you glance at him, he is already looking toward the back room.

Somewhere outside, a bell rings. Two notes, clean and close together. Ren waits with the cloth in his hand. Akari counts under her breath, as if the next sound might arrive if she names its place.

Nothing follows. A bird answers from the roof.

akari|They used to ring three.

ren|Maybe the keeper was interrupted.

He says it lightly, then sets the cloth down folded. Akari does not answer. She writes something at the bottom of her list, below the invitation and the two estimates. It is a question mark rather than a task.

At the door, you have to lift the handle before pulling. This time you know where it catches. Ren holds the other side until you are through.

ren|You coming back?

The question arrives without the cheerful introduction he might have given it earlier. He does not explain how easy it will be to say yes. Akari stands behind him, tired enough now that the pencil has gone into her sleeve instead of her notebook.

You tell them you intend to return. Ren's smile is small. Akari says she will leave the next plan where you can find it.

The courtyard is cooler than the hall. The paper moth turns once above you, showing its plain underside. Below the hill, the three signs still disagree. You can find the right road without consulting any of them.

Behind you, Ren asks whether the invitation should mention the bell. Akari says they should first find out what it means.

The door closes badly. This time, you hear someone inside lift it back into place.
`)]),
episode(2,"Two Kinds of Balance",[
...section("Cold open · One more round","hall",`
Ren is already wearing wraps when you arrive. Akari holds a pad at shoulder height, then lowers it. He lowers his hand with it. The change is so small that you might have mistaken it for hesitation yesterday.

akari|Same pace. Three touches, then reset.

ren|No finish?

akari|The reset is the finish.

He makes three controlled touches. The third sounds louder, though it does not look larger. His front foot settles before his back foot does. Akari raises a finger and he stops.

The hall is quiet enough to hear his breath. He looks at his feet, looks at her, then grins toward the doorway when he sees you.

ren|Perfect timing. You missed all the convincing ones.

akari|You missed the first two. Those were convincing.

He takes the praise as if she has slipped a stone into a pocket he was keeping empty. His shoulders loosen. The next attempt is better until he notices you watching and adds a fourth touch.

Akari steps aside before it reaches the pad. He follows its old position for a fraction of a second, catches himself, and puts his hands down.

akari|We agreed three.

ren|I know.

akari|Knowing isn't the same as stopping.

Ren's jaw tightens. The half-second after the movement feels longer than the movement itself.
`),
...section("Scene one · A witness arrives","hall",`
A woman at the side table closes a notebook. You did not notice her because she had made herself smaller than the window's shadow. A folded towel is balanced on the chair beside her. She brings it to Ren without comment.

Ren says he was trying a change in rhythm. The woman asks whether Akari had agreed to that change. He wipes his forehead rather than answering immediately.

sora|Then try it in the next round. It might be interesting. It doesn't have to happen secretly to be interesting.

Akari puts the pad down. Ren studies the floor as if his stance has suddenly become a difficult document. The woman leaves the towel within reach, not in his hand.
`),
introduction("sora","I'm Sora. I keep the maps over there, where they are currently losing a dispute with the window. I heard you found the entrance without using Ren's latest sign."),
...section("Scene two · What the argument is about","hall",`
Ren objects to latest. He says the arrows were corrected last month. Sora points toward the courtyard, where the bakery arrow still wears a tiny painted loaf. He laughs once, too abruptly, and turns back to Akari.

ren|You could have let me finish and told me afterward.

akari|I could have let you finish something I hadn't agreed to hold.

ren|It was one extra touch.

akari|It was my shoulder.

That stops him more effectively than the raised finger. He looks at the pad, then at the height she had chosen. Yesterday's little adjustment has acquired an explanation. He apologizes, quietly enough that you are not sure the apology was meant to have an audience.

Akari accepts it. She does not immediately pick the pad up again. Ren asks if she wants to change partners. She says she wants a minute to decide whether she wants another round at all.

Sora returns to the table. There is room beside her notebook. She asks you to hold the corner of a map while she weighs the opposite edge with an empty cup. The window keeps lifting it. Ink marks tiny stairs, paths, and retaining walls you have only just walked past.

sora|The hall looks straightforward from the road. The routes behind it are less considerate.

You ask whether she is mapping footpaths. She says some are footpaths and some are paths for things people no longer move by hand. She points to a dotted line that stops short of the hall. Before you can ask about it, Ren comes over carrying both pads.

He puts them down carefully. He says the apology sounded like a performance in front of you, even though he meant it. Sora says wanting the apology to be believed does not make it false. Then she asks whether he is seeking a witness or an answer.

Ren looks at you.

ren|What did it look like from the doorway?

He has asked a real question and now appears to regret making it difficult to escape. Akari is within hearing. She remains beside the water jug, giving him the choice of whether to turn toward her.
`),
decision("pilot:ren-stop","What do you tell Ren about the stopped round?",[
["plain","You changed the agreement. I think she was right to stop.","ren","Right. I asked what you saw. I don't get to complain because you saw it clearly.","Ren will remember your direct answer."],
["private","I think you should talk to Akari without an audience.","ren","Yes. I was about to make you explain me to her. That isn't your job.","Ren will remember that you gave him room."],
["question","What were you trying to prove with the fourth touch?","ren","That I could make it look easy. I hadn't realized how much I wanted someone to see that.","Ren will remember your question."]]),
...section("Scene three · The small version","courtyard",`
Sora takes the map outside so Ren and Akari can speak. She does not invent an errand for you. She asks if you would like to help stop the paper blowing away. You carry two clean stones from the edge of the path.

The courtyard table has an uneven leg. Sora places the stones diagonally, tests the paper, and moves the cup instead. She appears to know which inconveniences are worth solving completely and which can be accommodated until evening.

Your own preparation is much quieter than the pad exchange. There is a chair, a clear path, and an instruction to shift your weight without trying to finish in a perfect shape. Sora asks which part feels uncertain. When you begin to say everything, she waits long enough for you to choose one part.

You describe the moment before a step. Your body seems to believe that moving quickly will get it past the uncertainty. Sora puts a leaf on the ground where your next foot might land. It is an observation point, not a target you must reach.

sora|Look for the moment you still have a choice. If you have to chase the leaf, move it closer.

She does not stand over you while you try. She works on the map. After a few small shifts, the leaf is no longer the most interesting part; the pause before it is. You try the supported preparation and notice a different thing about your balance. Neither experiment announces a breakthrough.

Ren comes out without wraps. He asks whether you want to see the difference between his first step and his return. Sora raises her eyebrows. He says he has asked Akari and they have agreed to demonstrate without contact.

He shows the reach first, exaggerated just enough that you can see why it is hard to return. Then he shows the smaller version. It does not travel as far. His second movement arrives without needing to rescue the first.

ren|I knew that before breakfast. Apparently breakfast wasn't the difficult part.

Sora asks whether he can make the same movement without explaining it. He gives her a wounded look, then does it. The quiet version is better.

Akari joins them at the end. She watches his feet and asks for one more reset. He asks whether she wants the pad. She says no. He accepts the answer without making the moment into another apology.

For a few minutes the three of them work on a distance so small it would look unimportant from the gate. It is not a lesson you are asked to copy. You can nevertheless see what they mean by return: room left for the next decision.

There is a knock at the fence. A neighbor wants the hall tomorrow for an appointment. Akari checks her list. Ren starts to offer the entire afternoon, sees the leaf near your foot, and stops long enough to ask which hour is actually needed.
`),
decision("pilot:balance","Sora asks what you noticed while watching the smaller step.",[
["curious","The return changed more than the reach did.","sora","Good observation. Most demonstrations advertise the part going toward something."],
["playful","The leaf is a much less forgiving audience than I am.","ren","Mine keeps blowing away during the explanation. Terrible commitment."],
["direct","I need to repeat the small version before adding anything.","akari","Then that is a useful plan for your own practice. Not a promise to impress us."],
["reserved","I noticed something, but I don't have words for it yet.","sora","Keep the observation. A label can arrive after it."]]),
...section("Scene four · The map at the edge","hall",`
Before packing the map away, Sora asks whether you want to see how the hill looks from above. She turns the paper toward you. The bakery is a square beside three tiny stair marks. The road you took is a crooked line that looks much shorter than it felt.

Ren says every map of Amahara ought to include an apology for the hills. Sora says contours already perform that function for people who read them. He asks whether hers can include a written apology for people who do not. She writes STEEP beside the bakery and slides the paper toward him.

He points out where the fallen sign used to stand. Sora adds the post location in pencil. He asks why it is not ink. She says she has seen him borrow the post once already and does not consider its position permanent. He opens his mouth, looks toward the courtyard, and decides the evidence is difficult to challenge.

You point to the bend where the market noise faded. On the paper it is a narrow space between two walls. Sora says sound changes there because the retaining wall cuts across the direct route. She asks what you heard after it. You tell her about the loose sign and the voices from the hall.

She adds no special symbol for your arrival. Instead she turns the map back toward you and lets you trace the road with a finger held above the paper. It is the first time you can imagine the hall as part of a town rather than the end of a set of directions.

Ren says he likes that version of it better. Akari asks which version. He says a place people can find, leave, and find again. She looks at the road and does not immediately turn the answer into an item on her list.

The map goes back inside with four damp corners. Sora lays towels under it rather than stacking it with the other sheets. Ren offers to copy the damaged section. She thanks him, then asks whether he has ever copied a survey line.

ren|I've drawn excellent bread.

sora|Then we have established the first limitation.

He fetches tracing paper anyway. She shows him how to copy the marks without improving them. He finds this harder than the movement drill. Akari watches over his shoulder for one minute, catches herself, and goes to update the appointment board.

The dotted line you noticed outside has a number written beside it. Ren asks why that route seems to pass under the hall instead of around it. Sora says the sheet is a copy of a copy. She will not assume a broken line is a reliable route.

akari|Can we ask the keeper?

sora|We can ask for the record. Those may become two different conversations.

Ren reaches for the original. Sora puts a hand on its corner. He withdraws his hand. The little movement feels familiar after the pad exchange, but she notices it too and explains: the ink is still damp, and she would rather not lose the number.

Akari asks whether there are other reasons. Sora looks up. She says not reasons she can establish yet. Akari says she would prefer a doubtful fact to a confident silence. Neither woman smiles.

Ren continues tracing. His line stops at the same break as the original. He has resisted repairing it. Sora checks the copy and tells him it is accurate. The compliment is precise enough that he cannot turn it into a claim about the whole map.

There is ink on his thumb. He notices only when he leaves a faint print on the water jug. Akari makes him clean the jug. Sora keeps the spoiled scrap because his thumbprint has not crossed the number.

The bell rings while he is scrubbing. Two notes again. This time you are looking at the map when it happens. Sora's pencil stops above the dotted line. Akari goes to the window. Ren does not make the joke he seems to have prepared.

After a long moment, Sora writes the time in the margin. She asks whether you heard the same sound yesterday. The question has no clever phrasing. You say that you did.

sora|Then I will write two observations, not an explanation.

She shows you the note before turning the page. Ren reads it too. Akari puts her list beside the map and writes ASK beside the question mark she added yesterday.

At the door, Ren hands you the leaf. It has dried enough to curl at the edge. He says it belongs to your distinguished audience. When you look back, he is asking Akari if tomorrow's practice can begin with returns.

She asks him to say how many. He says three. Sora, without lifting her head, says she will keep count.

Ren rolls his eyes. This time, the smile underneath is not hiding the whole conversation.
`)]),
episode(3,"The Person With the Tools",[
...section("Cold open · A measurement","courtyard",`
Someone has written DO NOT HELP WITH THIS on the board leaning against the gate. Underneath, another hand has added WITHOUT ASKING. The addition is neatly boxed. A tape measure runs across the courtyard between a stack of timber and a man in dusty work clothes.

You stop short of stepping over it. The man looks up, follows your glance to the notice, and thanks you for not testing whether the sentence has exceptions.

riku|It has two. Neither is useful to people carrying hot tea.

Ren appears from the hall with hot tea, reads the board, and retreats three steps. The man takes his cup only after winding the tape away. He drinks with one hand and keeps the pencil in the other.

Ren introduces Riku as the person who will save the hall. Riku asks him to reduce the estimate to replacing joists. Ren says he was trying to express confidence. Riku says confidence cannot fit through the sticking door either.

The timber smells sharp and fresh. Beside it, the old board removed from the floor has a dark crack along its underside. The top looks almost ordinary. Riku turns it over so you can see the difference.

riku|People trust the side they can look at. That's understandable. It's why I inspect both.

He is not addressing a class. He is answering the question he saw in your face. Then he returns to measuring, and the courtyard becomes a workshop rather than a stage.
`),
...original(3).filter(l=>!["daichi","yuzu"].includes(l.speaker)&&!l.text.includes("Yuzu")&&!l.text.includes("Daichi")),
...section("Scene two · An end to hold","courtyard",`
Riku needs someone to hold the tape at a marked point while he checks a diagonal. Ren offers, but Riku asks him to carry the cleared boards to the stack instead. He asks you whether you can hold the end steady. He shows you the mark and waits until you repeat which edge he means.

The tape pulls harder than you expect. You shift your stance instead of bracing your arm. Riku tells you the number, asks for a second reading, and writes both. They match. He does not announce that you have discovered a hidden aptitude. He asks whether you can keep holding it for the next measurement.

Akari brings the estimates, now pinned together. She wants to know whether the floor can remain closed while the entrance is repaired. Riku says it can, provided nobody treats the cord as movable furniture. Ren asks what a usable floor would let them offer. Riku tells him to ask the people teaching on it.

ren|I am one of the people teaching on it.

riku|Then give an answer with a person and a date in it.

Ren looks toward Akari. She keeps reading rather than rescuing his proposal. After a minute he names an established partner session he could help host. Akari asks who else has agreed. He changes could to would ask.

Riku marks the figure on the estimate. On the other sheet he marks the cost of a door that opens without needing a practiced wrist. The welcome corner includes lower shelves, a clear route, and a window repair. The amounts are close enough that money will not settle the argument for them.

You keep the tape steady while they talk. Your task is becoming less comfortable. Before you decide whether mentioning that would interrupt, Riku asks if you need to put it down. You do. He puts a stone at the mark and finishes the note.

The number stays accurate after you stop holding it. This strikes you as a useful property for a job to have.
`),
decision("pilot:riku-task","Riku asks which part of the measurement was unclear.",[
["ask","Why check the diagonal as well as the straight edges?","riku","A rectangle can lie politely. The diagonal catches it. Come look at the drawing."],
["joke","How long before the tape stops fighting me?","riku","When it's back in the case. I prefer tools with consistent intentions."],
["direct","I needed to put it down sooner than I said.","riku","Next time tell me sooner. We can mark the point; we don't need to wear out the person."],
["quiet","I'd like to watch the next one before taking a turn.","riku","Stand beside the clear path. I'll say what I'm checking as I do it."]]),
...section("Scene three · A chair on the path","courtyard",`
A young woman comes around the fence carrying two cushions and a chair backwards. The cushions hide her face. Riku asks her to stop. She stops so promptly that the chair legs continue forward without her for a moment.

yuzu|If this is about the notice, I have a very strong interpretation of asking.

riku|It is about the tape beside your left foot.

She lowers the cushions, sees you, and changes the chair's direction. Its legs slide past the tape without touching it. She places the cushions on the workbench and folds the notice into a shape that will stand up on its own.
`),
introduction("yuzu","Yuzu. I arrange useful things where people can trip over them, then learn to arrange them better. You're the new person who helped Ren edit the invitation."),
...section("Scene four · The road people use","town",`
Yuzu asks you to walk the entrance route with her while Riku checks the floor. She takes the chair. You take the cushions. At the gate she stops and looks down the hill rather than back toward the hall.

yuzu|People say the hall is hard to find. It isn't. It's hard to arrive at without feeling you've arrived in the middle of something.

She puts the chair where a person might pause before the last incline. It is not on the path. She sits, tests the view, and moves it so the gate can be seen without turning sharply. Then she asks you to try it.

From the chair, the moth looks like a scrap someone forgot to remove. Yuzu asks whether a sign would help. You say which of the three road signs you found first. She puts her face in her hands and asks if it was the shoe one.

She made that sign two months ago, then borrowed its post for an event. She intended to return it. Riku intended to replace the hinge. Ren intended to bring back a clamp. The hall, she says, has many excellent intentions with no place to stand.

The joke ends before you expect it to. She looks at the empty hole where the signpost used to be. Then she takes a folded sheet from her pocket and begins writing the route from the market.

A shopkeeper passing uphill asks whether the hall will be open next week. Yuzu says they are arranging the first community appointments. He asks what that means. She opens her mouth, closes it, and walks back to fetch Akari's draft rather than invent a date.

You hold the chair until she returns. It is the same small job as the tape, though no number comes from it. The shopkeeper waits. When he has the actual hours, he says he can bring his mother if there is a chair with arms. Yuzu writes that down separately from the sign repair.

yuzu|There. A person before a decorative solution. Unfashionable of us.

She takes the chair back up the hill. At the gate she stops to read the notice she folded. She has put WITHOUT ASKING on the inside, where nobody approaching can see it.

This time she laughs at herself before anyone needs to help. She unfolds it and turns it around.
`),
decision("pilot:yuzu-sign","Yuzu holds the sign up for you. “Better?”",[
["curious","Could the invitation show where to pause or sit?","yuzu","Yes. The route matters before anyone reaches the interesting part. I'll draw the chair without giving it a heroic title."],
["playful","At least the sign is no longer withholding information.","yuzu","It learned that from the rest of us. A terrible educational environment."],
["direct","The person responsible needs to be named too.","yuzu","Mine, for this. If I borrow the post again, you may ask exactly when it's coming back."],
["reserved","Let me walk past it once more and check.","yuzu","A field test. I'll attempt not to explain what you ought to notice."]]),
...section("Scene five · The cost beneath the drawing","hall",`
Inside, the removed board lies on a cloth. Riku has marked the cracked underside with chalk. Akari studies it without touching. Ren stands farther back than you expected. His drawing of the welcome corner is tucked under the floor estimate as if he no longer wants its bread roll to be visible.

Riku explains what has changed and what has not. The corded area is closed. The rest of the inspected room can be used according to the current plan. Repairing the entrance first remains possible. Repairing the floor first does not repair the roof or create money for next month.

akari|I know that.

riku|I know you know. I need it on the sheet other people will read.

She gives him the sheet. Ren asks if the old timber can be saved for something else. Riku says some can; not the cracked pieces. Yuzu asks whether the discarded board can become a sign. He says only if the sign says this board was discarded.

Sora comes in with a copy of the route map. She lays it beside the chalk marks and asks where the old bell line enters the building. Riku says he has found an access point under the damaged floor, but he is not a route keeper and will not open it.

Ren leans in. Akari puts a finger on the cord, not on him. He straightens. Yuzu turns her folded notice so it faces the room too.

sora|The map shows a break here. It might be a copying error.

riku|It might. My measurement won't tell you which.

Sora copies his marked distance into the margin. It is the number you helped produce. In another context it would have been a forgettable number. Now it has become a boundary around what they know.

Ren asks whether the review will consider the route fault. Akari says the review will consider how they manage the hall, including things they cannot yet answer. Yuzu says that sounds like an alarming number of topics. Riku says it sounds like a building used by people.

The conversation settles into tasks. Sora will request the record. Riku will write both repair sequences with dates. Ren will ask about the partner session rather than announce it. Yuzu will restore the signpost before she decorates it. Akari begins assigning herself the remaining work and stops when Riku asks how many hands she expects to have.

She leaves two lines blank. Not abandoned: available. It is a difference you can see on paper before anyone learns to live by it.

Riku packs the tape measure. He asks you to check that the path is clear before he carries the old board outside. You do. He waits for your answer, then moves.

 At the gate, Yuzu has already put the post back. The new arrow points uphill. Beneath it is a drawing of a chair, plain enough to recognize at a glance.

She asks you to walk down to the bend and look back once. From there, the arrow is easy to see; the chair is smaller than she expected. You call that up to her. She makes the chair larger without making the arrow decorative. When you return, she has written a date on the back of the post so she can remember when she last checked it. The practical mark is hidden from visitors. They need the route, not a history of the people who forgot to maintain it.

You look back at the hall. A room with a damaged floor has acquired a carpenter's report, an actual route to its door, and two possible futures. Tomorrow someone will have to choose which future gets the first morning's work.

The bell does not ring before you leave. You find yourself listening anyway.
`)]),
episode(4,"A Place for the Kettle",[
...section("Cold open · The handle","hall",`
The kettle comes apart in a man's hands before it has any water in it. He looks at the handle, then at the kettle, then at the folded towel protecting the table beneath them.

daichi|I hoped checking it would improve the answer.

Ren arrives from the kitchen with an expression of profound betrayal. He says tea was supposed to be the reliable part of the morning. The man says it still can be; they simply need a vessel that wishes to remain one object.

Akari brings the repair list. There is a date beside the kettle that has been crossed out twice. She does not read either date aloud. The man looks at them anyway.

daichi|I kept finding a more urgent thing. That was true each time. Apparently it wasn't a plan.

He places the broken handle beside the kettle without disguising the failure under the towel. You can hear Riku outside, setting a case down on stone.
`),
introduction("daichi","Daichi. Tea, usually. The kettle is offering an incomplete demonstration. You can help me choose somewhere less inconvenient for the cups while Riku tells me what this needs."),
...original(4),
...section("Scene two · Everything has a place","hall",`
Akari has brought labels. Yuzu has brought a cloth with a pattern of small birds. Ren has brought a tray of bread and then, after being reminded, a tray for the cups. Sora has brought nothing and is therefore immediately asked to carry three things.

Daichi proposes putting the shelf by the window. Akari says the appointment table goes there. Ren proposes putting the bread beside the shelf. Yuzu asks whether he is planning a room or protecting his own shortest route to a snack.

Sora puts a cup on the shelf and tries reaching it while sitting. She can reach the first row but not the second without shifting the chair. Daichi apologizes and starts moving everything down. Akari asks him to wait until they have measured the lower space.

He stops. The cup stays in Sora's hand. For a moment six people are waiting for a kettle repair by rearranging a room nobody has finished describing.

yuzu|We could make a very convincing plan for where a room should be.

akari|Or we could finish this one.

Yuzu's smile thins. The joke was an attempt to help, but it has become another thing Akari wants to manage. Ren begins a joke of his own, sees both their faces, and eats a small piece of bread instead.

Daichi asks everyone to put down what they are holding. This is harder than it sounds. Sora has to ask for space on the table. Ren has taken the space with the bread. Akari has taken the rest with labels. Yuzu lays the cloth on the floor, then picks it up because the floor is dusty.

At last there is an empty corner of the bench. They look at it with unreasonable relief.

daichi|What does a visitor need to do here?

Not what can we fit. Not what can we buy. Sora lists reaching a cup, sitting without blocking the path, and asking a question without having to cross the practice space. Ren adds knowing whether the bread is for everyone. Yuzu adds knowing where to return things. Akari adds knowing who is responsible for washing them.

Daichi writes the list on the back of a label. It is longer than the label. He turns over another and keeps writing.
`),
decision("pilot:corner","Daichi offers you the pencil. “What did we miss?”",[
["curious","A place to sit without having to join the conversation.","daichi","Yes. Near enough to be included, with room to leave it quiet. Let's try the chair facing the window."],
["playful","A sign explaining which bread Ren hasn't already reserved.","ren","I'll label it PUBLIC BREAD. A devastating change to my private economy."],
["direct","A clear route from the door. The trays keep ending up in it.","akari","They do. We'll mark the route before deciding what goes beside it."],
["reserved","I'd rather try sitting here and see what feels awkward.","sora","Then sit. We can stop hovering over the chair and ask after you've used it."]]),
...section("Scene three · An ordinary inconvenience","courtyard",`
Riku needs the table clear to repair the kettle. They carry the cups outside, where the welcome corner briefly becomes a welcome courtyard. A gust lifts three labels into the weeds. Akari goes after them. Yuzu catches one against the fence with her palm.

The label says SHARED ITEMS. Yuzu looks at it, looks at the five people carrying things as if each owns a separate plan, and begins laughing. Akari asks what is funny. Yuzu shows her the label rather than explaining the accusation she could have made from it.

Akari laughs despite wanting not to. Then she asks if Yuzu would prefer writing the labels herself. Yuzu says she would prefer deciding what the labels need to do before anyone writes more of them.

It sounds sharper than her usual sideways answer. She does not add a joke to round it off. Akari looks at the handful of rescued paper and says that is reasonable. The two words take effort. Yuzu hears the effort and lets them stand.

Ren discovers that the bread tray is too large for the cleared corner. He suggests a second table. Sora suggests a smaller tray. He looks at the remaining rolls, sighs theatrically, and finds a bowl.

Daichi watches him use the chipped bowl from the low shelf. The blue one is still upside down inside. His expression does not invite a question. For once nobody supplies one simply because they noticed a silence.

You help Sora fold the bird cloth over a narrow bench. One edge is frayed. Akari takes a needle from her notebook cover and repairs it while standing, then denies she habitually carries sewing supplies. Yuzu points at the needle. Akari says habitually is an imprecise word.

The cloth stays visible after the repair. Ren asks whether she likes the birds. She says the cloth was available. Daichi says there were three plain cloths in the cupboard. Akari pricks her thumb, looks at all of them, and finally says she likes the birds.

Nobody applauds. Yuzu turns the cloth so one bird faces the path. It seems a considerate place to end that conversation.

Riku calls from inside. The kettle handle has a new pin. He asks them to test it empty before filling it. Daichi does. When it holds, he smiles in a way that makes the minor repair look briefly like good news from a much longer journey.
`),
decision("pilot:cloth","Yuzu nudges the patterned cloth toward you. “A bird facing the door, or the window?”",[
["door","The door. Let it greet people.","yuzu","A small welcoming committee. Much easier to schedule than the human one."],
["window","The window. Give someone quiet company.","yuzu","A bird with excellent manners. It won't ask why you're sitting alone."],
["try","Try both before we decide.","akari","A reversible decision. I should recognize those more often."]]),
...section("Scene four · The bowl left alone","hall",`
The cups move down a shelf. The tray moves out of the route. The appointment chair faces partly toward the window, leaving a visitor free to turn toward the room or away from it. Ren begins to put a label on the bread bowl, then decides people may be able to recognize bread without his intervention.

Daichi washes the repaired kettle. The water makes an ordinary soft sound against metal. He seems content with the work until Yuzu asks whether the blue bowl is taking up space they need.

His hands stop. He says he would prefer to leave it. Yuzu says all right, then asks whether it belongs to someone who might want it returned.

daichi|It does belong to someone.

He does not answer the rest. Yuzu's hands become still too. She has encountered the edge of something and has to decide whether to touch it again.

akari|We have enough room without moving it.

daichi|I know. That isn't quite the question she asked.

For a moment you think he will say more. Instead he wipes the kettle twice in the same place and sets it down. Sora takes the wet cloth when he finishes, giving him a task that has an end.

He thanks Yuzu for asking rather than moving the bowl. She says she can ask again another day, if he wants. He says perhaps. Neither treats perhaps as a date.

Ren starts the water heating. He does not tell a joke about the damaged handle. Akari opens the appointment sheet, realizes she is using it to fill the silence, and shuts it again.

The room has space for the unresolved thing. That does not make it comfortable. You sit while the kettle heats. Yuzu repairs the crease in her paper moth. Sora draws a line on the map that you cannot interpret from here. Ren watches the steam without performing patience for anyone.

Daichi pours the first cup for himself. It surprises Akari enough that she smiles. He notices and asks whether she is making a record of it. She says she has no label prepared. He says she may borrow SHARED ITEMS if necessary.

The laughter arrives softly. It does not explain the bowl. It makes the space around it easier to occupy.
`),
...section("Scene five · A visitor's chair","hall",`
Later, a neighbor stops at the open door to ask about tomorrow's appointments. She carries a parcel in both arms and says she cannot stay. Ren begins to fetch the appointment sheet. Daichi asks whether she would like to put the parcel down while she asks.

She does. Then she sits. Then she takes a cup of water, with no ceremony. The arrangement they argued over for most of the afternoon becomes useful in less than a minute.

Akari answers the question. Sora moves the parcel so the clear path remains clear. Yuzu keeps folding paper without making the visitor feel watched. Ren offers bread, says yes when she asks if it is for everyone, and neglects to describe the heroic sacrifice involved.

The visitor stays long enough to ask a second question. She wants to know if her father can come to watch rather than practice. Akari says they can arrange a seat for him. She asks which time would suit, then writes his name instead of calling the appointment a general community opportunity.

After the visitor leaves, nobody needs to claim victory for the layout. The chair has been used. The cup needs washing. The parcel has left a small indentation in the cloth.

Ren points at the indentation and says the bird now appears to have a nest. Akari straightens the cloth, then stops before smoothing the last fold. Yuzu notices but does not announce it.

Riku comes in for his tools. He sees the cleared path and says he can bring the timber through without moving their afternoon's work. It is a compliment to the arrangement that nobody had thought to seek.

Daichi picks up the blue bowl. Only for a second: enough to wipe the shelf beneath it. You can see a chip on the side that faced the wall. It was not as untouched as it looked.

He places it back, this time with the chip visible. Then he asks whether everyone can stay for a meal after the repair decision tomorrow.

Ren says he can bring bread. Akari looks at him. He adds that he has already asked at the bakery, and the answer was yes.

Yuzu says she can bring a tune. Sora asks if it has more than two notes. The smile slips out of the room for an instant. Yuzu says it does, and begins humming the first three.

Nobody calls that a solution. They listen until the kettle starts cooling.
`)]),
episode(5,"What Gets Repaired First",[
...section("Cold open · Two estimates","courtyard",`
The workbench is empty except for two estimates and a roll of twine. No drawings, no bread, no extra labels. Riku has placed a stone on each sheet so the wind cannot turn the decision into a search through the weeds.

Ren arrives with a new drawing and sees the table. He keeps the drawing in his hand. Akari arrives with three notes and puts only one down. Yuzu moves a chair so there will be room for you without placing you at the head of anything.

Daichi asks Riku if the estimates have changed. Riku says the floor job now includes the brace inspection, and the welcome job now includes the lower shelf fix. Both can begin tomorrow. Only one can use the available money and volunteer time first.

sora|And the second?

riku|Needs a responsible person and a date. I will not write soon as a date.

Ren looks at Akari's note. She looks at his folded drawing. They have arrived with different versions of what the hall owes the people who come through its door.
`),
...section("Scene one · What each plan protects","hall",`
Before discussing figures, Akari asks everyone to walk the space again. She shows the inspected side and the closed side. Ren has heard this explanation enough to recite it, but he lets her finish. At the floor boundary, she describes an established partner session that could return after repair approval.

akari|They have another room available for now. They don't have this room. That matters to me.

Ren asks whether it matters more than the neighbor who cannot comfortably pull the door. The question is fair. His tone makes it harder to answer.

akari|Not more. Differently.

ren|The difference still leaves one person outside first.

Yuzu looks at him. Sora looks at Akari. Daichi keeps his hands around an empty cup, then puts it down so he cannot continue looking busy instead of joining the conversation.

daichi|The welcome corner was part of the hall before it was a repair proposal. We let it become an inconvenience people had to adapt to. I helped do that.

Akari says she is not arguing against the corner. Ren says that is what it keeps feeling like. She says his invitations keep arriving before the work needed to support them. He says her lists make people wonder whether they must be approved before they can help.

The room goes quiet. That sentence has gone beyond the estimates. Ren hears it too. He rubs one thumb against the edge of the folded drawing.

akari|You think I want them to feel that?

ren|No. I think you're frightened of what happens if they don't.

She turns toward the damaged floor. There is no answer ready on her note. Riku waits, then says he can report on the building when they are ready to ask building questions. It is a boundary around his own role, and it lets everyone breathe without pretending the disagreement has disappeared.

Yuzu asks to see the drawing. Ren opens it. The bread roll is still there, but beside it he has drawn the chair with arms and the clear path they tested yesterday. Akari studies it longer than she studied the first version.
`),
decision("pilot:argument","There is a pause before they return to the estimates. How do you enter the conversation?",[
["ask","What would make each of you trust the second job will happen?","sora","That is the missing question. Let's put the second person's name on the page before choosing the first page."],
["direct","You're arguing about each other as well as the repairs.","akari","Yes. I heard it. I don't know how to finish both conversations at once."],
["gentle","Can we look at Ren's new drawing before deciding?","ren","Please. I changed more than the bread. I should have started by showing you."],
["quiet","Give them a moment, then ask Riku to explain the two sequences.","riku","Both sequences keep the closed space closed until approval. Here are the actual steps."]]),
...section("Scene two · A sequence with names","courtyard",`
They go back outside. Ren puts his drawing beside the welcome estimate. Akari puts her note beside the floor estimate. Riku reads the steps of each job in the same even voice. Neither receives a dramatic title.

The floor-first sequence opens inspected space for experienced partner work sooner. The entrance still needs an interim plan and a fixed date for repair. The welcome-first sequence lets visitors enter and sit more easily sooner. The floor stays closed and its repair still needs a person accountable for the next date.

Sora writes the interim arrangements on separate sheets. Yuzu objects when one sheet says keep visitors informed without naming who does it. She has had enough of sentences that somehow ask her to do things without asking her.

Ren says he will take the entrance arrangements either way. Akari asks about the bakery. He answers with the hours he has actually agreed, not the hours he wishes existed. She checks them once and leaves the paper in his hands.

Akari takes the floor checks either way. Sora asks who takes over if she is occupied with an appointment. Akari starts saying she will make time, stops, and names Daichi for the nontechnical coordination. Riku keeps the inspection itself. The distinction takes a sentence to write and several minutes to agree.

Yuzu takes the sign and the clear approach. She names a morning she can give rather than offering whenever. Daichi looks surprised by the specific limit. She asks if he needs another morning. He says no, then admits he had imagined she would keep rearranging things until everyone was finished.

yuzu|I might. I'd rather it be something I choose after the morning, instead of something I failed to refuse before it.

He nods slowly. Sora writes the named morning. Ren sketches a moth in the margin and Yuzu crosses out its tiny carpenter's hammer. It is not responsible for the work either.

You read both sequences. The safe boundary appears on each. So do the people who will have to live with the order. The choice is no longer between a good hall and a careless hall. It is between two ways of beginning work that will still be unfinished tomorrow.
`),
...original(5),
{speaker:"narrator",text:EPISODE_1[4].choice!.prompt,decision:{...EPISODE_1[4].choice!,options:EPISODE_1[4].choice!.options.map(o=>({...o,memory:"The hall will remember your repair priority."}))}},
...section("Scene three · After the answer","courtyard",`
Riku moves the chosen estimate to the top. No one cheers. Akari reads the names and dates aloud. Ren checks the invitation against the interim plan, crossing out a line he now cannot honestly promise.

 The work has become more definite. The discomfort has not vanished along with it. Yuzu collects the unused estimate and pins it above the bench instead of putting it away. It will remain visible after the first job begins.

She checks whether it can be read from the path. The wind presses the lower corner against the timber, hiding the second date. Ren finds another pin and asks before adding it. Akari steps back to let him reach the board. It is a tiny arrangement of bodies around a small task, and it works without one person directing every hand. Sora notices, but keeps writing rather than naming the moment for them.

Sora asks you whether you want a copy of the plan. She is not asking you to supervise it. She says people who are consulted should be able to see what happened to their answer. You take the copy.

Ren folds his drawing. Akari asks him to leave it with the estimates. He hesitates as if expecting another correction. She says it shows the clear route better than her note. He puts it down unfolded.

For a moment they stand beside each other looking at the same arrangement. Neither has won enough to be smug. Both have been asked to trust work that will happen outside their immediate control.

Riku asks for his clamp. Ren closes his eyes. Yuzu says the hall is observing a sacred moment. Ren goes to fetch it, and everyone hears him open three cupboards before finding the right one.

Akari laughs while he is out of the room. It is not a laugh he has manufactured. When he returns, she tells him where she would like the spare clamps stored. He asks her to write the place on the shared sheet rather than trusting him to interpret the intention.

She does. Riku checks that the clamp is undamaged, thanks Ren, and closes the case. A smaller unfinished job has ended without becoming another argument about his character.
`),
decision("pilot:after-repair","Akari asks whether you want to say anything before the plan goes on the board.",[
["ask","When will we check whether the interim arrangement is working?","akari","After the first visitors use it. I'll put that beside the date, so noticing a problem doesn't sound like changing sides."],
["playful","I'd like the structural bread roll to stay in the drawing.","ren","Finally, recognition for its contribution. I'll keep it outside the load-bearing section."],
["direct","Keep the second job visible, even while the first is going well.","yuzu","It can stay right here. A pleasant beginning is very good at hiding unfinished endings."],
["quiet","The plan says what I wanted to say.","akari","Then I'll post it as it is. You don't need to give it a speech."]]),
...section("Scene four · Something still missing","hall",`
Sora brings the requested record copy to the table after Riku leaves. It is shorter than she expected. The page numbers jump at the same place the dotted route becomes difficult to follow. She counts them again before saying so.

Akari asks whether the archive made a copying error. Sora says it might have. Ren asks whether someone removed a page. Sora says that is also possible, then refuses to choose between them without another record.

Yuzu says the bell has not become less peculiar because the floor estimate is settled. Daichi looks toward the beam. He says the keeper should be asked before anyone assumes the sound belongs to a mystery they are entitled to investigate themselves.

Sora writes a request naming the missing page number. Akari asks her to copy everyone on the reply. Sora agrees too quickly. Akari notices, but does not turn it into an interrogation in front of you.

Ren asks whether the review will penalize the unanswered question. Akari says the review is about what the hall knows, what it does not know, and how it acts on both. She says it sounds reassuring and will probably feel much less reassuring while they are doing it.

Daichi smiles at that. It is the kind of admission he seems to prefer to a sentence polished smooth enough that nobody can hold it.

You put your copy of the repair sequence under your cup to keep it flat. The page has two dates, four names, and a crossed-out promise. It is not a souvenir of winning an argument. It is a record of an argument that can now become work.

Ren starts preparing tomorrow's meal. He asks Daichi how many bowls they need. Daichi says six, then pauses long enough that you look toward the shelf. He corrects himself: enough for the people who say they can come.

Yuzu gives him her answer. Sora gives hers. Akari checks the appointment board, then closes it and says yes. You give yours too. Each answer is written down separately. The meal has acquired people rather than an ideal attendance count.

Outside, the repaired sign faces the road. Inside, the second estimate stays beside the first. Tomorrow will not make all of it simple. For the first time, you can imagine noticing the difference between a promise being kept and a promise being quietly replaced.

The bell rings twice while Ren washes the mixing bowl. He counts both notes with his hands still in the water. Then he calls Sora over to tell her the time.
`)]),
episode(6,"The First Meal",[
...section("Cold open · Flour on the plan","hall",`
The repair board has a thumbprint of flour on it. Ren sees you looking and says it is evidence of multidisciplinary effort. Akari says it is evidence he read the plan while carrying dough. He says those interpretations can coexist.

Riku has left a short note beneath the chosen estimate. Work begun. Next check named. The second estimate still has its own date. You recognize the names because you heard the conversation that put them there.

The hall smells of warm bread. Daichi has taken the cups down before anyone needs to reach for them. Yuzu has placed the bird cloth so one bird looks toward the window and one toward the door, achieving a compromise the pattern itself never requested.

Sora arrives with a copy of her archive request. There is no reply yet. She puts it on the board instead of keeping it in her notebook. Akari reads it, then leaves it visible.

Ren takes the loaf out. It is not burnt. It is not miraculous. He taps its base, listens, and gives it a few more minutes to cool while everybody discovers how difficult it is to wait politely for bread.
`),
...original(6).filter(l=>!l.text.startsWith("Ren asks about your other training")),
...section("Scene two · What changed first","courtyard",`
Before sitting down, Riku asks the group to look at the first morning's work. Ren groans because the bread has reached the precise temperature at which he wants witnesses. Riku says witnesses can return after seeing the thing their plan bought.

Akari takes the sheet. She names what is finished and what is still closed. Yuzu points out the interim route. Daichi asks one question about tomorrow, receives a concrete answer, and writes it down without turning it into an invitation for Riku to remain all evening.

You can see the priority you chose beginning to take shape.
`),
{speaker:"akari",expression:"determined",when:{flag:"repair",value:"floor"},text:"The practice floor came first. Riku has begun the approved repair, and the closed section remains closed until the check. Ren's welcome arrangements are on the other sheet, with their own date."},
{speaker:"ren",expression:"determined",when:{flag:"repair",value:"welcome"},text:"The welcome area came first. The doorway work has begun, and the lower shelves are ready to use. The closed floor keeps its cord, its repair date, and Akari's name beside the check."},
...section("Scene three · The person beside the plan","courtyard",`
Ren stands beside the board after the others start carrying cups inside. He asks if you will help him take the loaf out to the courtyard table. There is a reason beyond the shorter route: he wants a moment without everybody listening.

He sets the loaf down, takes the cloth away, and keeps one hand beside it rather than cutting immediately. The pause resembles the one after Akari stopped the extra touch. This time he has made it himself.
`),
{speaker:"ren",expression:"concerned",when:{flag:"pilot:ren-stop",value:"plain"},text:"You told me I'd changed the agreement. I was annoyed with you for about ten seconds. Then I noticed I was asking you to make that less true. Today I asked Akari for the extra touch before putting the wraps on."},
{speaker:"ren",expression:"soft",when:{flag:"pilot:ren-stop",value:"private"},text:"You gave me room to talk to her. I used it. We disagreed again, but it was our conversation instead of a performance for someone arriving at the door. Today we agreed the whole round before starting."},
{speaker:"ren",expression:"concerned",when:{flag:"pilot:ren-stop",value:"question"},text:"You asked what I was trying to prove. I thought about it while baking. Bread doesn't become better because somebody admires how quickly I work it. Today I asked Akari for the round I actually wanted, instead of hoping she would notice it happening."},
...section("Scene four · A loaf without an audience","courtyard",`
Ren picks up the knife. His hands are steady, practical, unhurried. He asks whether you want the end piece or a middle piece. This small question feels less like an escape from the previous one than a way to remain beside it.

You answer. He cuts the piece you asked for. Then he says Akari was still irritated today, and that he was disappointed not to be instantly forgiven into a better version of himself. He smiles at how unreasonable it sounds once spoken.

ren|I told Haru about the extra touch. He said I used to do it when we were children too. I found that profoundly unhelpful for about another ten seconds.

He says his brother remembered a different detail: Ren always looked toward the doorway after doing it. Someone might have arrived. Someone might have seen the part that looked convincing.

For a minute you only hear the knife against the board. Ren makes the pieces roughly equal, then gives the smallest to himself. When he notices your glance, he says there is another loaf inside. He is not practicing noble deprivation.

Akari comes to fetch the cups left on the bench. She sees the bread and asks whether they should wait for Riku before beginning. Ren says Riku has a home to go to, and a piece is wrapped for him already. She looks at the wrapped piece. He has remembered to ask whether Riku wants it.

She smiles. Neither makes it into a conclusion about Ren's entire future. She takes two cups and leaves him the rest.
`),
decision("pilot:meal-ren","Ren offers you the bread basket. “Ready to bring the witnesses back?”",[
["playful","Only if the bread gets one sentence in the introduction.","ren","A cruel restriction. I'll choose its strongest sentence."],
["curious","Can we just eat and let them notice it?","ren","An alarming artistic experiment. Yes. Let's try."],
["direct","I'll carry the basket. You carry the conversation you started.","ren","Fair. It can come inside without being finished."],
["reserved","Take a quiet minute first. The bread will keep.","ren","It will. I keep forgetting I'm allowed to know that about other things too."]]),
...section("Scene five · The table learns a shape","hall",`
The table wobbles. Riku puts a folded scrap beneath its leg, tests it, and sits down. Yuzu says this is his shortest repair estimate yet. He says it is a temporary measure and would appreciate not being quoted at the town review.

Daichi starts handing out bowls. There are enough. The blue bowl stays on the shelf. You see Akari notice it, then turn toward the person holding out an ordinary chipped one. She asks for more soup rather than asking why this is the evening nobody has chosen to explain it.

Sora puts her notebook under the bench. Ren asks whether that means they are allowed to forget the map until tomorrow. She says no; it means she can eat without keeping her finger on the unresolved place.

Yuzu begins the tune she promised. Ren joins at the wrong interval, decides this is deliberate harmony, and receives an expression from Sora so exact that he stops before defending the theory. Riku listens without joining. Daichi knows the second half but has forgotten the first.

They try again. The result is worse and much funnier. Yuzu puts her spoon down because laughing while holding it has become a hazard to her own soup. Akari's shoulders loosen. You had not realized how long she had been holding them at the same height.

When the conversation returns to repairs, she starts reaching for the list. Ren asks whether the list needs dinner too. She leaves it folded. Then she asks him a question about the drawing rather than about the date: why did he put the chair facing the window?

He says you helped them think about someone who might want to sit without talking. Yuzu says the chair has already hosted a highly successful quiet appointment. Sora says it was not an appointment. Yuzu says that is the most successful kind.

Daichi asks Riku whether he can come next week. Riku says he can come one afternoon, not all of them. Daichi starts explaining how welcome he would be whenever, hears his own sentence, and asks which afternoon. Riku gives him one.

The table does not become a picture of perfect people. Ren interrupts Sora once and apologizes. Akari moves a bowl without asking, then moves her own instead. Yuzu makes a joke Riku does not like and lets it end. Daichi offers someone seconds before remembering he has not finished his first helping.

You can recognize them better because the meal has room for these minor failures. Nobody has to turn each one into a story lesson before continuing.
`),
decision("pilot:meal-place","Daichi asks what part of the week you want to return to. You can answer in your own way.",[
["curious","The map. I still want to know why the route stops there.","sora","So do I. The request is on the board. When we have another fact, you can look with us."],
["playful","The bread. I'm developing a rigorous interest in the bread.","ren","At last, someone respects the curriculum I'm qualified to offer."],
["direct","Making a decision and seeing the work actually start.","akari","Then keep the copy. If the work changes, we'll put the change beside the promise."],
["reserved","Just another ordinary afternoon here.","daichi","We have those. They don't always look ordinary until afterward."]]),
...section("Final scene · The missing third","town-evening",`
The meal ends unevenly. Riku leaves first with the bread he agreed to take. Yuzu goes out to check the sign because the wind has risen. Ren washes bowls. Akari dries them until Sora reminds her of the letter she intended to send before the post closes.

Daichi takes over the cloth. Akari hesitates, names the bowl she worries is cracked, and leaves without inspecting every other bowl first. Ren watches her go, then asks Daichi where that bowl belongs.

You help clear the table. The scrap under its leg has held. The cloth has soup on one bird and no soup on the other. Yuzu says the pattern now documents the evening. Akari, halfway through the doorway, says it will wash. There is affection in the practical sentence even without anyone translating it.

At the shelf, Daichi pauses beside the blue bowl. He tells you it belonged to someone who used to eat here. He uses belonged and then corrects it to belongs. The person is alive. That matters enough to him that he says it plainly.

You have not been invited to solve the distance between that person and the table. Daichi thanks you for leaving the bowl earlier. He says there is a story he needs to tell, but he has to decide which parts are his to tell before making an evening of it.

From outside, the bell gives two clear notes. This time nobody speaks until they are certain there is no third.

Sora goes to the doorway. Yuzu is already there, looking toward the road behind the hall rather than downhill toward town. Akari comes back with the unsent letter in her hand. Ren leaves the last bowl in the wash water.

sora|It happened at the same time yesterday.

akari|Did the keeper answer?

sora|Not yet. I'll ask in person tomorrow.

Daichi steps beside them. He says he will come. Sora says she would like that, and her relief arrives before she can make the answer more economical.

For a moment the five founders stand together without a performance arranged for anyone. They are not looking at you. They are looking at an unanswered question beyond the gate. You belong to the room enough now that watching them does not feel like eavesdropping.

Ren finishes washing the bowl before he leaves it. Akari posts the archive request where everyone can read it. Yuzu brings the sign indoors so the wind cannot undo the work. Daichi turns out the lamp nearest the closed floor.

On the way down the hill, you pass the repaired arrow. It points toward the hall even in the fading light. The bakery arrow points another way. Both can be true.

You stop at the bend and look back. The lantern has been lit. Through the window you can see Sora and Daichi bent over the map, Ren putting the bread away, Yuzu folding the damp cloth, and Akari leaving one chair exactly where someone used it.

The bell remains silent. The missing note seems larger now that you know the people waiting to hear it.

Next week, the hall will have visitors. It will also have a question it can no longer treat as background noise.
`)]),
];

export const PILOT_OPENINGS=[
opening(1,"The Road Uphill",[
...section("Before practice · Amahara","town",`
The market is folding its awnings away when you reach the road to Lantern Hall. Somebody has hung paper decorations between two stalls. One string has slipped, leaving three moths close enough to brush the head of a person carrying apples.

The apple seller ducks without looking up. It has happened before. The woman beside him lifts the string with the handle of a broom. Neither thanks the other dramatically. The moths go back above head height; the market keeps closing.

You have the hall's address. The directions describe the slope by what used to stand there: an old dye shop, a repaired wall, a gate with a lantern. The dye shop has become a stationery shop. The wall looks like several walls repaired at different times.

You pause to check the directions. A person behind the stationery window lifts a notebook so you can see its cover, then realizes you are not shopping and points uphill instead. There is a small drawing of the hall's lantern pinned beside her till.

The road grows quieter after the last stall. You can hear water somewhere below the retaining wall and the loose metal clink of a sign moving in the breeze. The air is cooler than it was in the market.

You have time to arrive without inventing a better version of yourself first. That does not make the walk free of expectations. Training halls invite expectations simply by having mats and people who know what to do on them.

At the bend, a delivery cart has stopped beside a bakery. Its owner is trying to move a tray and hold a door with the same elbow. You offer the door, or wait until the path clears. Either way, the cart moves after a minute and the smell of bread remains.

The bakery window has a note saying ASK BEFORE TAKING THE STAFF LOAF. Somebody has added REN beneath it. The name means nothing to you yet. It is apparently important to the bread.

Farther uphill, the first sign points toward the hall. A second points back toward the bakery. The third is lying flat. You turn the third so nobody steps on its exposed nail and leave it beside the wall.

A paper moth hangs over the gate. It is folded from a used timetable. One wing still shows a departure hour. The other shows the word RETURN in small print.

Through the fence, you can see sunlight across a wooden floor, stacked mats, and a doorway partly blocked by a bench. A laugh comes from inside, followed by a much shorter reply. Then the bench moves and the laugh stops.

You wait long enough to let someone finish carrying it. The gate latch is cold under your fingers. It lifts more easily than you expected.
`),
decision("pilot:road","Before going in, what do you take a moment to notice?",[
["path","The route back down to the market.","narrator","The road is steep but clear. You remember the bend beside the bakery and the low wall where you can pause."],
["room","The room beyond the doorway.","narrator","There are chairs as well as mats. Someone has made a clear lane between the entrance and a low shelf of cups."],
["sound","The voices inside.","narrator","Two people are disagreeing about a measurement. Neither sounds ready to abandon the furniture or the conversation."]]),
...section("At the gate","courtyard",`
The courtyard is smaller than the map made it look. A clear strip runs along one side. Tools occupy the other. There is a bucket under the window and a broom resting where it can be reached without crossing the work area.

You move the fallen end of the paper string away from the latch. On its underside someone has drawn a very small face with a disappointed expression. The face disappears when the moth turns.

Inside, the argument about the bench becomes an argument about the doorway. You hear someone say they measured it. Someone else says they measured the wrong thing. It is an unexpectedly ordinary sound for a place you had been imagining from an address.

The rest of the visit continues after your practice. You have found the gate. You do not need to make arrival into a test of how impressive you can be before anyone learns your name.

When you return to this moment, the bench will still need moving. Somebody will have to put down their end before they can open the door for you.
`)]),
opening(4,"A Cloth With Birds",[
...section("Before practice · The welcome corner","courtyard",`
Yuzu is outside shaking dust from a folded cloth. She stops before you reach the gate so it will not drift toward you. The pattern is a flock of small birds, each heading in a different direction. One corner has been repaired with green thread.

She asks whether the birds look cheerful or urgently late. You say they look like birds on cloth. She says this is a useful baseline assessment and folds it with unnecessary seriousness.

The hall will rearrange the welcome corner after today's practice. It was going to do that last month. Then the window leaked, the appointments changed, and the list acquired a second sheet. The cloth has waited in the cupboard through all of it.

Yuzu wants to put it where a visitor can see something chosen for pleasure rather than necessity. Akari wants a surface that can be washed easily. Daichi wants room for the cups. Ren wants a position that permits bread. Sora has asked which person will sit there before discussing the cloth.

yuzu|Five entirely reasonable positions. We could form a council and never put a cup down again.

She shows you the back of the cloth. There is a stain near the repaired corner. Someone has washed it repeatedly without quite removing it. She says they could hide it under a tray, but then most of the birds would be hidden too.

You help hold the cloth while she checks whether it fits the narrow bench. It does, if the birds face sideways. She lays it there and steps back. From the gate, it looks like a scrap of summer caught in the shade.

Ren leans out of the doorway and asks whether she has seen the kettle towel. She says it is on the table. He asks which table. She looks at you, then at the cloth, then toward the room where the furniture has become a network of unfinished intentions.

She goes inside to find it. You stay with the birds. One has a wing made from the green repair thread. Whoever fixed the cloth allowed the repair to become part of the pattern.

From inside comes a short exchange about washing, shelves, and whether the cups need labels. Nobody has settled the question. The welcome corner is still a collection of objects people mean to arrange.
`),
decision("pilot:birds","Yuzu returns with the towel. “Where would you start?”",[
["sit","Try sitting there before deciding what belongs around it.","yuzu","Sora will approve. I may sit before she can turn it into a measured trial."],
["clear","Clear the route to it first.","yuzu","Yes. It shouldn't take confidence to reach a chair."],
["joy","Keep one thing there simply because someone likes it.","yuzu","The birds are campaigning vigorously for that position."]]),
...section("The work can wait","hall",`
You carry the folded cloth inside. Akari has placed the lower shelf beside the wall. Daichi is checking the kettle over a towel. The handle shifts in his hand; he frowns and sets it down without filling it.

Yuzu sees the movement. She asks whether he wants Riku to look at it. Daichi says he intended to do that before. Akari checks the list, finds the date, and does not announce how long it has waited.

Ren opens the cupboard for a different pot. Three cups fall sideways but remain on the shelf. He catches one, looks pleased, then notices the others are still balanced badly. He puts the caught cup down before rearranging them.

The bird cloth goes on the cleared bench. For a moment everyone looks at the same small thing. Akari runs a finger beside the green repair and says the stitching is holding well. Yuzu says the bird is flying with it. Akari tries not to smile and fails.

Daichi asks you to return after practice if you want to help them decide where things go. Yuzu tells him they have already recruited you into a conversation about birds, which should be enough work for the opening of one afternoon.

He laughs and agrees. The kettle can stay empty until it is checked. The shelf can stay where it is until someone tries reaching it. The cloth waits without becoming less bright.

Outside, a neighbor passes the gate and looks in. Nobody calls her over before learning whether she has time. She waves, keeps walking, and leaves the room with one more person it might eventually welcome.
`)]),
];
export const PILOT_SCENES=[PILOT_PROLOGUE,...PILOT_MAIN,...PILOT_OPENINGS];

// Direction is authored per exchange and selects existing whole-body pose artwork.
const performances:[number,string,string,StoryLine["expression"]][]=[
 [1,"ren","I believed they would cooperate.","amused"],
 [1,"akari","You measured the bench.","determined"],
 [1,"ren","We can't keep explaining","determined"],
 [1,"akari","We can't explain it","angry"],
 [2,"akari","We agreed three.","determined"],
 [2,"ren","I know.","angry"],
 [2,"akari","It was my shoulder.","concerned"],
 [2,"sora","Then try it in the next round.","determined"],
 [2,"sora","Then I will write two observations","concerned"],
 [3,"riku","People trust the side","determined"],
 [3,"yuzu","If this is about the notice","amused"],
 [3,"ren","I am one of the people","concerned"],
 [4,"daichi","I hoped checking it","concerned"],
 [4,"yuzu","We could make a very convincing plan","amused"],
 [4,"akari","Or we could finish this one.","angry"],
 [4,"daichi","It does belong to someone.","concerned"],
 [5,"akari","You think I want them to feel that?","angry"],
 [5,"ren","No. I think you're frightened","concerned"],
 [5,"yuzu","I might. I'd rather it be something","determined"],
 [6,"ren","I told Haru about the extra touch.","concerned"],
 [6,"sora","It happened at the same time yesterday.","concerned"],
 [6,"akari","Did the keeper answer?","determined"],
];
for(const [beat,speaker,anchor,expression] of performances){const line=PILOT_MAIN[beat-1].lines.find(l=>l.speaker===speaker&&l.text.startsWith(anchor));if(!line)throw new Error(`Missing pilot performance: ${beat} ${anchor}`);line.expression=expression;}
const heldPerformances:[number,string,string,NonNullable<StoryLine["expression"]>][]=[
 [1,"The words land harder","ren","concerned"],
 [1,"His laugh is quick.","akari","amused"],
 [2,"Ren's jaw tightens.","ren","angry"],
 [2,"That stops him more effectively","ren","concerned"],
 [2,"What do you tell Ren","ren","concerned"],
 [3,"She lowers the cushions","yuzu","amused"],
 [4,"His hands stop.","daichi","concerned"],
 [4,"Yuzu's smile thins.","yuzu","angry"],
 [5,"The room goes quiet.","ren","concerned"],
 [5,"She turns toward the damaged floor.","akari","concerned"],
 [5,"What should Lantern Hall repair first?","akari","determined"],
 [6,"He sets the loaf down","ren","concerned"],
];
for(const [beat,anchor,speaker,expression] of heldPerformances){const line=PILOT_MAIN[beat-1].lines.find(l=>l.text.startsWith(anchor));if(!line)throw new Error(`Missing held performance: ${beat} ${anchor}`);line.performance={speaker,expression};}
const renChoice=PILOT_MAIN[1].lines.find(l=>l.decision?.flag==="pilot:ren-stop")!.decision!;
for(const option of renChoice.options)option.reply[0].expression=option.id==="plain"?"determined":"concerned";
PILOT_MAIN[5].lines.find(l=>l.heading==="Scene five · The table learns a shape")!.illustration="/story/backgrounds/first-meal.webp";

/** Entry flags are frozen; choices made inside this episode overlay only their own flags. */
export function pilotLines(s:StoryScene,entryFlags:Record<string,string>,choices:Record<string,string>={}){
 const flags={...entryFlags};for(const l of s.lines)if(l.decision&&choices[l.decision.flag])flags[l.decision.flag]=choices[l.decision.flag];
 return s.lines.filter(l=>!l.when||flags[l.when.flag]===l.when.value).flatMap(l=>{
  const option=l.decision?.options.find(o=>o.id===choices[l.decision!.flag]);
  return [l,...(option?.reply.map((r,i)=>({...r,id:`${l.id}-reply-${option.id}-${i}`,location:l.location}))??[])];
 });
}
