import {section as part,pick,recall,opening,type Expansion} from "./month-authoring";

export const WEEK_TWO:Expansion[]=[
 {before:[...part("Scene one · a place for wet things","courtyard",`
The rain has stopped, but the courtyard has not received the news. Drops keep falling from the eaves into a bucket Daichi has moved three times. Beside it is a row of shoes with newspaper tucked into their toes. Your arrival adds one more pair to an arrangement that looks almost deliberate.

daichi~amused|Welcome to the advanced study of where a puddle goes after you stop watching it.

you|Does the bucket pass?

daichi~amused|The bucket is qualified. Its supervisor is under review.

He shifts it a finger's width. A drop lands inside. He accepts this small victory without asking the sky for a second.

Inside, Ren has drawn arrows on scraps of paper. One points toward the towel shelf. Another points toward the first arrow. Akari has taken the second down and is studying it as if it submitted an application.

akari~amused|This one directs people to the information that would have helped them find this one.

ren~amused|An educational journey.

akari|A circle.

Ren turns the scrap over and makes it a laundry label instead. There is no argument about whose idea it used to be. A useful thing has emerged from a less useful thing, and the morning can continue.

You recognize the chair near the entrance, the repaired kettle, the bird cloth folded under a tray. The hall does not feel finished. It feels recognizable. That difference is pleasant enough that you pause with your coat half off.

yuzu~amused|You've reached the difficult stage. You can now tell when someone moves the spoon.

you|Has someone moved the spoon?

yuzu|An ongoing investigation. I am keeping several important details to myself, including my involvement.

Akari hands her a basket of towels. Yuzu accepts it with both hands, and the investigation is postponed in favor of something that needs drying.
`),pick("month:towel","Where would you put the clean towels?",[
 {id:"door",label:"Near the door, where a visitor can find one.",speaker:"akari",text:"Then a small basket there and the rest on the shelf. We can try it without reorganizing the whole hall.",memory:"Akari leaves a visitor basket by the door."},
 {id:"shelf",label:"Keep the shelf clear and put a direction beside it.",speaker:"ren",text:"One arrow. A single arrow, with a destination. I am prepared to accept this artistic restriction.",expression:"amused",memory:"Ren makes one useful towel sign."}
 ])],after:[...part("Scene three · official folding business","hall",`
Toma examines the towel he folded. Its corners point in four unrelated directions. He starts again before anyone has offered advice.

you|You can leave that one if you want.

toma~determined|No. It looks like a badly sealed parcel.

yuzu~amused|A deeply serious accusation in your profession.

He tells you that he is fourteen, that his aunt runs the fish shop, and that the delivery whistle is for getting attention in the street. He demonstrates it against his palm rather than blowing it inside. The official expression relaxes when you ask whether the parcel came from uphill. It did. There were seventy steps. He counted them because the previous delivery had seventy-two and he wants to know which two have disappeared.

sora~amused|Different gate?

toma|Different gate. That is considerably less interesting.

The parcel contains a pack of appointment cards. Each has a space for a time and a name, and too little space for Ren's preferred welcome message. Akari gives Ren one to test. He uses both sides. She slides him a second and points to the blank time field.

ren|The front is for arriving. The back is for my ambitious literary career. I understand.

Toma asks who signs his receipt. You point to Akari rather than pretending a place at the hall means you can accept a delivery on its behalf. She signs, checks the number of cards, and gives him the copy. He folds the receipt more precisely than the towel.

You help him with a second towel. When you align the corners, he tells you that the right way to pack a parcel leaves a place to grip it. You each know something useful about a different small task. Neither of you needs a title for the exchange.
`),pick("month:receipt","Toma leaves his pencil on the table. How do you get it back to him?",[
 {id:"call",label:"Call him back before he reaches the gate.",speaker:"toma",text:"Good catch. My aunt counts pencils as business equipment. I would have had to submit a report about its mysterious disappearance.",expression:"amused"},
 {id:"carry",label:"Walk it out; you're going that way anyway.",speaker:"toma",text:"Thank you. That whistle is loud outdoors. You can keep speaking at ordinary volume. I like that better, actually."}
 ]),recall("month:towel","door","toma","I used one from the little basket. Shall I put the damp one in the laundry?"),recall("month:towel","shelf","toma","The arrow worked. It would work better if Ren stopped standing in front of it.","amused"),...part("Scene four · the ordinary return","courtyard",`
When he leaves, the towel remains lopsided. Yuzu places it on top of the stack rather than hiding it underneath.

yuzu|It will dry hands with remarkable indifference to its shape.

Akari agrees. Then she folds the next one neatly, because she likes doing that. The room contains both preferences without needing to settle them.

Outside, Daichi's bucket catches another drop. He has gone inside to make tea. The arrangement keeps working without its maker standing beside it, and you find yourself looking at the towel basket, the arrow, and the appointment cards in the same way.
`)]},
 {before:[...part("Scene one · which bag","courtyard",`
Mika reaches the gate while you are sorting the appointment cards. She is walking at a pace that belongs to someone who knows exactly how long this visit can take. Daichi opens the door and begins to reach for both her bags. She lifts one elbow, changing the offer before it becomes a small wrestling match.

mika~amused|This one is heavy. This one has things I want to find myself.

Daichi waits for her to hand him the heavy one. You move a chair from the turning space. Mika nods at the cleared route, then puts her own bag down on the chair she actually wanted.

mika|I'm Mika. Community appointments, home visits, a great deal of explaining where I've put my glasses. Today, room planning.

you|Have you worked here before?

mika|With Daichi, yes. In a room containing this much labeled furniture, no. I am looking forward to seeing which labels survive use.

She is forty-two, and her laugh makes Daichi's unfinished offer turn into a laugh too. Nothing about the familiarity makes her timetable less real. She takes out a folded calendar with two villages marked in the margins. The hall is one part of her week, beside other places that also expect her to arrive.

You lift the appointment cards so she can see their size. She tests whether the time is readable from the opposite side of the table. Ren offers his best large handwriting. Sora offers a ruler. Mika takes the ruler and asks Ren to write an ordinary number.
`),pick("month:privacy","What would help you understand the appointment room before entering?",[
 {id:"sign",label:"A clear 'please wait' sign on the curtain.",speaker:"mika",text:"Good. It can tell someone what to do without telling them who is inside.",memory:"The curtain gets a clear waiting sign."},
 {id:"chair",label:"A waiting chair outside the private space.",speaker:"mika",text:"Useful. Let's place it where somebody can sit without blocking the exit or hearing the whole conversation.",memory:"Mika chooses a quieter waiting spot."}
 ])],after:[...part("Scene three · a schedule with edges","hall",`
When the curtain is hung, Mika sits on both sides of it and asks Daichi to speak at a normal volume. On the second side, she raises a hand.

mika|I heard the important part. We need more distance between the waiting place and this table.

Riku moves the rail again. He checks the path with the chair occupied, not merely with it pushed underneath the table. You hold the curtain clear while he measures. There is no ingenious shortcut. Each person trying the room discovers something the empty room concealed.

Ren arrives with a tray of bread ends. Mika points him toward the common table. He asks whether he should make a special sign for the tray.

mika~amused|You can label the ingredients. The existence of bread will probably announce itself.

Daichi opens the calendar at next month and begins to pencil in another hall morning. Mika puts her finger over the empty square before the pencil reaches it.

mika|That morning belongs to the west village. I could come here later in the week, if that would be useful.

daichi~concerned|I remembered the visit. I didn't remember which week it was.

mika|Then ask. I prefer an ordinary question to finding out I have been imagined into two rooms.

He erases the tentative mark completely. They choose a time neither already owes elsewhere. You hear Daichi ask whether she would want tea before the work starts or afterward. She chooses afterward, provided the last appointment has actually ended. The answer pleases him. It does not lengthen her visit.
`),pick("month:tea","Mika asks which tea you've tried here.",[
 {id:"roasted",label:"The roasted one. It smells like the kitchen.",speaker:"mika",text:"Daichi found that after three pots of something that tasted like a wet cupboard. I am pleased the research reached a useful result.",expression:"amused"},
 {id:"plain",label:"Mostly hot water. I'm still deciding.",speaker:"daichi",text:"Then hot water is an excellent entry on the menu. No one has to develop a sophisticated opinion to use a cup.",expression:"soft"},
 {id:"ask",label:"Ask what she usually chooses.",speaker:"mika",text:"Roasted, if I have time. Whatever is ready, if I don't. I am a deeply inconsistent critic.",expression:"amused"}
 ]),recall("month:privacy","sign","mika","The waiting sign says enough. Leave the patient's name off it; the appointment card can stay with them."),recall("month:privacy","chair","mika","This seat works. Someone can see when the room opens without having to sit facing the curtain."),...part("Scene four · after the last appointment","courtyard",`
Daichi walks Mika to the gate with the heavy bag. He stops there rather than choosing the rest of her route for her. She takes the handle, adjusts its strap, and reminds him of the actual tea time they agreed on.

Back at the table, there are five used cups and one clean one. Daichi puts the clean one away. He has done it before you can offer to help.

daichi|I keep preparing for more people than we expect.

you|Is that a problem?

daichi~soft|Sometimes. Today it is a cup that needs putting back.

He leaves the blue bowl on its shelf. The two objects do not become the same question simply because you noticed both. You take the tray to the kitchen while he folds the calendar to the week that actually comes next.
`)]},
 {before:[...part("Scene one · a professional loaf","town",`
Ren has invited you to the bakery to help choose which of two samples should go to the hall. You arrive expecting the beginning of a performance. Instead, he is checking a row of loaves with a fingertip and has not noticed you yet.

The counter is clean except for a dusting of flour on one corner. His sleeves are secured above his wrists. He moves a hot tray with cloths, places it where nobody passing the counter can bump it, and writes a time beside the next batch.

ren|Give me a moment. This is the part that doesn't become better when I do it enthusiastically.

you|I can wait.

He finishes the row. Then the welcome arrives, smaller than usual, because there is another customer coming through the door and a bell ringing from the back room.

ren~amused|Two samples. One contains citrus. One contains my fear of offering citrus to people who wanted ordinary bread.

you|Those look exactly the same.

ren|They are. I forgot which end I put on which plate. My professional reputation depends on your discretion.

He checks his penciled marks underneath the plates. The problem is resolved without your being entrusted with anyone's entire future. You try the pieces while he listens for the oven timer.
`),pick("month:bread","Which loaf would you choose for the hall?",[
 {id:"citrus",label:"Citrus. Keep the small surprise.",speaker:"ren",text:"Citrus, then. I'll write the ingredients down and save plain pieces too. A surprise can still come with information.",expression:"amused",memory:"Ren reserves a citrus loaf for the next visit."},
 {id:"plain",label:"Plain. It's good just as it is.",speaker:"ren",text:"Plain it is. I'm fond of that one too. I sometimes forget to let a familiar thing be the one I choose.",expression:"soft",memory:"Ren reserves a plain loaf for the next visit."}
 ])],after:[...part("Scene three · the message he writes","town",`
You wait at the end of the counter while Ren writes to Akari. He begins with an account of the bakery owner's appointment, the oven, and the customer who came at the wrong moment. He draws a line through the whole first sentence.

ren~concerned|None of them agreed to keep my second promise for me.

you|You don't have to put every detail in the note.

ren|If I leave out the details, all that's left is what I did.

He sets the pen down. The oven timer rings. He takes the next tray out and lets you move away from the heat before returning to the note. There are practical reasons to interrupt the conversation, and he does not ask you to finish it while he is carrying something hot.

ren|There. 'I'm late because I agreed to too much. I can reach the hall after the last tray cools, at four.' That sounds disappointingly understandable.

He folds it once. You ask whether four is a guess. He looks at the trays, adds the time for clearing the counter, and changes it to a quarter past. The pencil makes the promise slightly less pleasing and much more useful.
`),pick("month:message","How do you want to carry the message?",[
 {id:"exact",label:"Give Akari the note exactly as it is.",speaker:"ren",text:"Please. I wrote the part I meant. You don't need to turn it into a kinder story on the walk.",memory:"You carry Ren's own words."},
 {id:"question",label:"Ask if there's anything else Akari needs to know.",speaker:"ren",text:"Tell her the pads are still by the washroom. That's useful. You can leave my tragic battle with the clock out of it.",expression:"amused",memory:"You carry the note and the location of the pads."}
 ]),...part("Scene four · a smaller basket","town",`
The basket by the door is too full for one easy trip. Ren removes two loaves and writes a second delivery time. He asks the bakery owner whether that fits before returning to you.

ren|I keep trying to make the size of my arms into a scheduling method.

you|The paper seems easier to adjust.

ren~amused|And much less likely to hit a gatepost.

The customer who mentioned Haru has gone. Ren glances at the torn piece of dough resting beside the bowl. He starts to throw it away, then asks the owner whether it can join the staff supper. She agrees. He puts it with the appropriate batch.

you|You didn't ruin the whole loaf.

ren~concerned|No. I ruined one fold. I am working on the difference.

He returns to the scale. On the way uphill, you keep the note flat in your pocket. You have not become responsible for his promises. You are doing the one thing you agreed to do, and he is staying to finish his.
`)]},
 {before:[...part("Scene one · a note without decorations","hall",`
Akari is checking the visitor route with a borrowed chair when you return. She asks you to put Ren's note on the table until she has finished the turn at the door. She does not try to read while moving the chair sideways through the narrowest point.

When she sits, she reads the note once, then looks at the clock.

akari|A quarter past. We can use the first part differently.
`),recall("month:message","exact","akari","Thank you for bringing what he actually wrote. I can plan from that."),recall("month:message","question","akari","The pads are by the washroom? That saves a search. Thank you for asking."),...part("Scene one · continued","hall",`
She puts the folded note beside the practice list. There is no place where you have to perform Ren's apology. You had half prepared a face for that, and are pleased to discover it is not required.

Sora joins Akari by the table. They discuss a short set with enough space to stop and return. Akari had prepared a different pace. Sora asks for a slower one today. Akari changes the plan instead of asking her to justify it.

Across the room, Daichi is trying to make the appointment sheet hold the names everyone has supplied. Toma has put a star beside one name and two beside another. When you ask why, he says he added the second after the person repeated the request louder.

daichi~amused|That explains the volume. It does not create a second chair.

Yuzu puts a loose chair behind him. It would be funny if the room were larger. In this room, the chair blocks the cupboard. She moves it back. Daichi smiles and rubs out the imaginary appointment he had put in the last empty square.
`)],after:[...part("Scene three · counting the actual room","hall",`
Akari asks you to walk the visitor route with her. You begin at the gate, follow the signs, and stop at the damaged floor boundary. From here, one chair is hidden behind the curtain and another looks as if it belongs only to Mika's work.

you|I'd think there were fewer places than there are.

akari|Then the count is not enough. We need to make the route readable too.

She gives you a piece of paper and asks where a visitor would look first. The hall knows what every object means. A person arriving does not. Yuzu turns the tea tray slightly so its handles are reachable from the clear side. Daichi takes his coat off the chair with arms.

Ren arrives while you are still moving things. He looks at Akari, ready to explain. She points to the note and thanks him for the time. He says he is sorry anyway. She accepts it. Both parts fit in the same exchange.
`),pick("month:capacity","How should the seat count appear at the entrance?",[
 {id:"number",label:"A plain number, with the next available time below it.",speaker:"akari",text:"Clear. When we're full, we can point to something useful instead of apologizing vaguely.",memory:"The entrance shows the seat count and next time."},
 {id:"cards",label:"Move a small card for each available seat.",speaker:"sora",text:"That will show the change. I'll write the number as well, so no one has to understand our little system before coming in.",memory:"Sora makes a seat board with movable cards."}
 ]),...part("Scene four · one assigned job","hall",`
Ren chooses refreshments and looks at the demonstration list for long enough that Yuzu pulls the bread tally underneath his gaze.

yuzu~amused|Your kingdom, with loaf boundaries clearly marked.

ren|I'm looking because I like it. I can like something without being assigned to it.

She lifts her hands. The teasing stops at the place where he asked it to stop. Ren takes the pencil and checks the supply list with Mika. He asks who will clean the table after the last tray rather than treating cleanup as an event that occurs naturally when his exciting part ends.

Daichi offers to cover that part. Akari begins to say she will check it too, then closes her mouth. She writes Daichi's name once.

you|Should I put another name on the other shift?

akari|Yes. A different person. I was about to make two names mean one exhausted pair of hands.

She hands the list back to you. You write Sora after asking her. Sora agrees to that shift and declines an earlier one. The list becomes less symmetrical and more accurate.
`),recall("month:bread","citrus","ren","Citrus is on the tally, as requested. It's finally been promoted from my secret opinion to an actual loaf.","amused"),recall("month:bread","plain","ren","The plain loaf is on the tally. I have resisted giving it an unnecessarily elaborate name.","amused"),...part("Scene five · a square left clear","hall",`
At the end, Yuzu shows you the empty Wednesday square. She has drawn a tiny sleeping moth in its corner, outside the space where an appointment might go.

yuzu|Decoration only. No official resting achievement to collect.

You leave the pen beside the list. The names on it are promises people have actually made, not a measure of how much they like the hall. That makes the empty squares easier to leave alone.
`)]},
 {before:[...part("Scene one · the blank invitation","hall",`
There is one blank sheet in the middle of the table. Around it are the capacity count, Mika's private times, the visitor route, and Ren's refreshment tally. You have seen each of those things made. Together they look less like a great plan and more like the edges a plan has to fit inside.

Toma sits by the door with his parcel bag closed. He has another delivery after this, and has said how long he can wait. Daichi puts the clock where everyone can see it. The gesture seems to make the conversation clearer before it has begun.

ren|I want the person who has never walked in here to be able to do that without preparing a question first.

sora|I want the person who has a question to be able to ask it without four people turning to look.

yuzu|Could the four people practice turning away?

mika~amused|A promising curriculum addition. Still, one room has one curtain.

You look at the empty invitation. It could describe a small open afternoon or a series of quieter appointments. Nobody has asked you to decide who deserves the space. They are asking how the first version should work, knowing that each version makes some things easier and others harder.

Akari says the plan can be reviewed after it has been used. She draws a small box at the bottom of the sheet for the next review date. The choice will have consequences. It does not have to become an oath everyone keeps forever.
`)],after:[recall("access","open","toma","A small open afternoon. I'll say the capacity out loud too. People sometimes read only the word 'open'.","determined"),recall("access","quiet","toma","Quieter appointments. Who do they ask? Put that on the top line. I don't want to become the booking office by accident.","determined"),...part("Scene three · words someone can use","hall",`
Toma reads the first draft as if he has found it pinned at the fish shop. He points to 'inquiries welcome' and asks whether that means he should return here with everybody's questions.

akari|No. That means we chose a phrase instead of naming the person to ask.

She changes it to the actual contact and the times someone will be at the table. Daichi adds directions from the lower gate. Ren starts to add an inviting sentence. This time he asks whether there is space first.

You put the sheet on the wall and step back. The small print is still too small. It is obvious from three paces away, and nobody had noticed from around the table. Mika laughs quietly at the entire group, herself included.

mika|We have designed excellent information for people who are already seated inside the building.

Ren brings a larger sheet. Akari rewrites the practical lines. He writes the welcome beneath them, in a size someone standing outside can read. Neither kind of information pushes the other off the page.
`),pick("month:invite","What should the last line of the invitation say?",[
 {id:"look",label:"'You're welcome to look around before deciding.'",speaker:"sora",text:"Good. Visiting is an action people can finish without committing to another one.",memory:"The invitation explicitly welcomes a first look."},
 {id:"ask",label:"'You can ask an ordinary question.'",speaker:"ren",text:"I like that. We should be prepared for one about the washroom. Much more likely than a question about our glorious history.",expression:"amused",memory:"The invitation explicitly welcomes ordinary questions."}
 ]),...part("Scene four · the first copy","town",`
You accompany Toma as far as the stationery shop with the first copy. He stops to compare the uphill and downhill gates, confirms Sora's explanation about the missing two steps, and adds the result to a private tally in his parcel book.

toma~amused|I have solved one municipal mystery today. Without using a whistle.

At the shop, someone behind the counter asks when the hall is quietest. You point to the relevant time and explain that Mika's appointments are private. The question is about visiting the room, not seeing her. The clerk thanks you and copies the contact information onto a small scrap.

You do not collect a name or ask why the person wants a quiet time. Toma pins the invitation where the shopkeeper indicates. On your way out, he asks if every invitation becomes an argument first.

you|This one became several drafts.

toma|That seems less fun. It probably makes the deliveries better.

Back at the hall, Ren is keeping one copy for himself. He marks the opening time on his bakery calendar. Sora writes the review date in hers. The first month now has a version somebody outside the room can use.
`)]},
 {before:[...part("Scene one · the welcome in use","courtyard",`
You arrive early enough to see the room before its first visitors come. It contains the same chairs as yesterday. Today the chair with arms is where someone can actually reach it, and the signs face the people who will need them.
`),recall("access","open","ren","Small open afternoon. When the seats are full, I'll offer the next time. No borrowing imaginary space from the cupboard.","determined"),recall("access","quiet","sora","The first appointments are spaced. If someone arrives early, they can wait without being pushed into the private area.","determined"),recall("month:capacity","number","akari","The number is readable from the gate. Leave the next time uncovered when we change it."),recall("month:capacity","cards","sora","I've moved the first seat card. The written count matches. Two explanations, fortunately about the same room."),...part("Scene one · continued","hall",`
Akari is carrying a stack of cards. She asks Ren to check the lettering while she checks the route. He reads the first one and says the arrow points toward the cupboard. She turns it around without pretending that was her intention.

ren~amused|I recognize this phase of sign design.

akari~amused|You had an entire circle. I have achieved a corner.

Their hands meet briefly over the card. Neither turns it into a joke for the room. Ren holds the sign steady while she adjusts the pin. When it is done, they each continue the job they were already doing.

Yuzu has a paper moth in her pocket. She puts it on the side of the notice board, clear of the information. It moves whenever the door opens. You watch it mark the first visitor's arrival without needing to be a signal anyone must interpret.
`)],after:[...part("Scene three · a promise small enough to keep","hall",`
When the last visitor leaves, Ren counts the trays and puts the remaining bread into a covered container. He does not ask whether everybody enjoyed him. He asks whether they ran out when the tally said they would.

sora|Approximately. One person took two pieces. Another took none. Your calculations have survived the public.

ren~amused|I shall commission a certificate. Very small, to fit beside the bread knife.

Akari takes the last tray from him. She asks whether he wants to finish repainting the arrow after cleanup. He says yes, then looks at the bakery time and changes his answer.

ren|Tomorrow. I have to get the tins back today. If tomorrow still works.

akari~soft|It does. I can leave the paint closed until then.

She does. You see the lid go back onto the pot instead of the job quietly continuing without him.
`),pick("month:lost-scarf","A visitor has left a scarf. What goes on the found-item note?",[
 {id:"where",label:"Where it was found, with a small description.",speaker:"sora",text:"Blue scarf, chair beside the door. That will help someone identify it without inventing their afternoon.",memory:"The scarf gets a precise found-item note."},
 {id:"drawing",label:"A quick sketch alongside the description.",speaker:"yuzu",text:"I'll draw the fringe. You draw the words. My drawing must be prevented from becoming an insect.",expression:"amused",memory:"You and Yuzu make a scarf notice together."}
 ]),...part("Scene four · useful leftovers","hall",`
Daichi asks you to put the visitor comments into the right box. There are three. One asks for the chair with arms to remain near the door. One wants to know whether it is possible to visit without joining practice. The last says the bread was good.

you|That one belongs to Ren.

daichi~amused|Let him see it, then keep it with the others. Food was one of the things the hall actually offered.

He takes the wet cloths to the laundry. The left-behind scarf stays dry on the found-item shelf. Not everything soft belongs in the same basket. You move a cloth away from it and write the sign a little more clearly.
`),recall("month:privacy","sign","mika","The curtain sign saved me three interruptions. A modest piece of paper has had a productive afternoon.","amused"),recall("month:privacy","chair","mika","Someone used the waiting chair without being told where to sit. Keep that placement for the next visit."),...part("Scene five · paint left closed","courtyard",`
Ren takes the bakery tins downhill. Akari leaves the unopened paint on a shelf. She notices you looking and shrugs one shoulder.

akari|He said tomorrow. I agreed to tomorrow. It is astonishing how often I turn that into doing it tonight.

you|Will you leave it?

akari~amused|I have told a witness. That should help.

Yuzu calls from the washroom about the soap. The room fills with a familiar argument about labels, much smaller than the one that decided its visiting hours. Outside, the paper moth turns once in the closing door's air.

The hall has not become easy to run. It has become a place where more people can understand what is being offered, and where a few promises can wait until the time they were given. You leave the arrow unpainted. Tomorrow has a task of its own.
`)]}
];

export const WEEK_TWO_OPENINGS=[
 opening(2,1,"A Room That Remembers",part("Opening · the returning path","courtyard",`
The gate no longer asks you to guess whether it is the right gate. Someone has turned the sign toward the street. The paper moth beneath it is damp along one wing, but its little wire holds.

You know what waits inside: a closed section of floor, five people with different habits, a kettle whose handle has survived use. Knowing those things makes the road feel shorter even though the steps have not changed.

Akari is outside with a coat over one arm. She is reading a list of requests from people who have heard that the hall is open again.

akari|There are more questions than we expected. Mostly ordinary ones. When can someone visit? Where can someone sit? Does visiting mean agreeing to practice?

She turns the page. Someone has asked whether the hall can settle an argument about a fence. She has underlined that one once, without writing an answer yet.

you|Can it?

akari~amused|We have enough trouble deciding where our own chairs go.

Daichi joins you with an empty laundry basket. He has been counting towels and visitors, then discovering that one count does not reliably predict the other.

daichi|People may want a place to be for an hour. That is a real request. It still needs a real hour we can offer.

He holds the door while Akari brings the list inside. Nothing on it becomes your appointment simply because you have arrived. The practice you came for keeps its own time and its own rests.

This week, the hall will try to make its welcome predictable. There will be neighbors, a new pair of bags, and a messenger who expects a signature. For now, you put your coat beside the others and leave the wet things where they can dry.
`)),
 opening(2,4,"Before Anyone Says Yes",part("Opening · an honest calendar","hall",`
The table is covered in invitations, some handwritten and some copied neatly. Each describes a pleasant possibility. Together they describe an afternoon the room cannot hold.

Sora has put an empty sheet beside them. Akari has written the number of available chairs at the top. Daichi has written Mika's private appointment times underneath it. Yuzu has drawn a line through the washroom route so no one can mistake it for spare space.

yuzu~amused|Behold our least glamorous shared achievement. A path where somebody can actually walk.

Ren's note is tucked under the appointment list. You remember carrying it from the bakery: a time, a reason, and a promise small enough to finish. The room has to learn the same trick, even if it prefers writing generous invitations.

akari~concerned|We have all promised a version of this afternoon. That doesn't make Ren the only person who has to change one.

She puts her own invitation on the pile first. Nobody celebrates the admission. It makes the work easier to begin, which is enough.

Daichi suggests waiting until after practice to count the chairs together. The list does not need to consume the time you came here to use. He turns it face down so it can wait without pretending it has vanished.

you|Is there a version that fits?

sora|Several. We'll need to choose one and tell people what it actually is.

Yuzu leaves the Wednesday square clear on the calendar. It is not a reserve slot to spend when the room gets ambitious. You place the pen beside the paper and go to prepare for your own practice. Later, there will be time to decide what the hall can honestly invite someone to do.
`))
];
