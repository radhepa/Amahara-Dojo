import {lines,reply,type StoryScene} from "./types";
function personal(member:string,n:number,title:string,script:string):StoryScene{return {id:`c1-${member}-${n}`,kind:"personal",episode:Math.ceil([4,12,24,36][n-1]/6),beat:n,location:"hall",member,threshold:[18,50,90,140][n-1],practiceGate:[4,12,24,36][n-1],title,lines:lines(script)};}
export const PERSONAL:StoryScene[]=[
personal("akari",1,"A small patterned patch",`
Akari is mending a wrap by the window. She holds the fabric close to inspect a seam, then puts it down when you enter as though she has been caught doing something less useful than paperwork.

akari|It's a repair. Ren keeps catching this edge on the strap.

There is a tiny green pattern on the patch. You ask whether she chose it. She says it was available, then admits a plain one was available too.

akari|My aunt taught me to mend. She said an invisible repair was the ideal. I liked the part where something could be repaired and still look changed.

She offers to show you the stitching if you want. It is not a drill, and knowing how to do it will not improve your striking. She seems to enjoy explaining it anyway.

You sit beside her. After a while, she forgets to justify the pattern. She asks which color you would choose for a second patch.
`),
personal("akari",2,"The second inspection",`
Akari checks a cupboard Ren already organized. He is not there to notice. You are.

akari|I told him where everything goes. If I have to explain it again later, it will take longer than checking now.

You ask whether he knows she plans to check. She stops holding the cupboard door.

akari|No. That sounds less sensible when I answer it directly.

She tells you that keeping things reliable used to mean doing them herself after someone promised. It worked often enough to become a habit and cost enough to become exhausting.

You do not need to disclose a similar experience. You can listen to hers. She asks if you would remind her to name her worry instead of silently repeating a job.

akari|Not supervise me. One reminder if you notice. I should be responsible for the rest.

She closes the cupboard without rearranging it. Tomorrow she will have to ask Ren where he put the spare cloths. She writes that question down rather than moving them tonight.
`),
personal("akari",3,"A job she cannot keep",`
Akari gives you the visitor sheet, then keeps one finger on it while explaining three exceptions. You ask which decisions are actually yours.

She takes her finger away.

akari|Appointments within capacity, and finding the responsible founder for other questions. If I keep inventing exceptions, I haven't delegated anything.

You ask how she would like a mistake reported. She says immediately, then corrects herself: promptly enough to help, without interrupting a private appointment for a harmless typo.

akari|I don't want you learning that asking me a question is a failure. Apparently I need to stop acting as though an unexplained decision is a danger.

She gives you the sheet and goes to her own practice. When a visitor needs an answer beyond your role, you fetch her. She comes, answers, and leaves you the sheet afterward.

The trust is not a compliment she says once. It is the paper that stays in your hands.
`),
personal("akari",4,"The cup she leaves crooked",`
Akari brings two cups to the welcome corner and sets one slightly off the woven coaster. Her hand starts toward it, then rests on the table.

akari|A dramatic achievement. The cup survived my absence from its management.

She says Ren kept the welcome plan this week. Sora shared an uncertain finding. Daichi sent a letter. Yuzu named a return date. None happened because Akari knew exactly what everyone should do.

akari|I still want things clear. I don't have to make every clear thing originate with me.

She asks what part of the hall you would change. You can answer without wrapping criticism in reassurance. She writes the practical suggestion down and asks a follow-up rather than defending her original choice.

When you finish, she leaves the notebook open where the others can add to it. It contains a page in your words. The cup stays crooked. You both drink while the tea is warm.
`),
personal("ren",1,"A careful pair of hands",`
Ren is weighing dough. His voice slows as he explains why he lets it rest rather than working it again.

ren|Doing more can spoil something that needed time. A deeply inconvenient lesson for my general character.

You notice a small scar near his thumb. He says it came from a kitchen accident, not an impressive fight. Haru bandaged it and ruined a whole batch by trying to finish the recipe himself.

ren|He was terrible at it. He was also very kind. I keep remembering one of those facts louder than the other.

Ren lets you shape a piece if you want, with clear instructions and no competition. He fixes his own piece first to show that it is still adjustable.

The result will be bread, not a relationship test. He thanks you for the company before he knows whether your piece will look good.
`),
personal("ren",2,"After someone says his name",`
Someone compared Ren with Haru again. He made a joke, finished the job, and waited until the room was empty to put down the tray a little too hard.

ren|The irritating part is that Haru hasn't done anything wrong today. I can still lose an argument with the version of him living in my head.

He says his brother was praised for calm judgment while he was praised for spirit. It sounded balanced. It taught him to become entertaining whenever he wanted to be included.

You ask whether Haru knows. Ren says probably not in those words. He has only ever delivered the complaint as something people could laugh at.

ren|I don't need you to tell me I'm secretly better. I'd like to try being specific instead of making everything a contest.

He writes one sentence to say to his brother. It has no punchline. He reads it, makes a face, and keeps it anyway.
`),
personal("ren",3,"The joke he doesn't make",`
Ren asks you to listen while he rehearses a conversation. His first attempt includes two jokes before reaching the point.

ren|If I make him laugh first, maybe he won't think I'm accusing him.

You ask whether laughing will help Haru hear the point or help Ren avoid saying it. Ren considers the difference.

He starts again. He wants Haru to visit the hall as his brother, not as someone evaluating whether Ren chose an adequate school. He also wants to ask about Haru's actual life rather than treating him as a collection of accomplishments.

ren|That second part makes the first one less comfortable. It's annoyingly fair.

Later you see the brothers talking by the doorway. You do not listen to the private words. Haru puts the travel case down. Ren lets the silence continue without rescuing either of them with humor.

When Ren returns, he only says they will meet for breakfast. It is a modest report. He looks proud of it.
`),
personal("ren",4,"An answer with a time",`
Ren has been asked for three favors. He agrees to one, names when it will be done, and tells the other two people what he cannot manage. You watch him survive their perfectly ordinary responses.

ren|The sky remains up. I had expected at least a small crack.

He says one person was disappointed. That part was unpleasant. It was still better than promising and making them discover his limits later.

He asks if you want to share bread after practice. When you are not available, he names another day rather than saying whenever and hoping you will guess.

ren|I still like being the first person to say yes. I'm trying to become someone whose yes is worth arranging an afternoon around.

He puts one delivery on the calendar. Beside it is breakfast with Haru, written in the same ordinary size. Both commitments get a time. Neither needs an audience.
`),
personal("sora",1,"The towel before the rain",`
Sora leaves a towel by the entrance. Ten minutes later, rain begins. You ask whether she predicts everything.

sora|No. The roof changed sound. It's more useful than intuition and considerably less flattering.

She shows you where she can hear the first drops against the loose section. Then she asks what you have noticed about the room. She is not testing whether your observation matches hers.

You point out something small. She looks, considers it, and adds it to a note. It is strange to see an experienced person change their attention because of yours.

sora|People sometimes imagine being observant means having a hidden answer. Usually it means noticing which answer is missing.

She brings a second towel. When Ren rushes in wet, both are useful. Sora lets him thank the roof for its informative noise.
`),
personal("sora",2,"A fact with the corner missing",`
Sora has two versions of a note. One contains a question she has not answered; the other omits it. She asks which you would expect to receive if you were responsible for the next decision.

You say the question matters even if its answer is unfinished. She taps the longer note.

sora|I know. I wanted to hear whether the reasoning changed outside my own head. It hasn't.

She tells you she used to work as a courier. Reliable delivery was praised. Asking whether something should be delivered rarely was. Later, she treated withholding uncertain information as a correction to that old obedience.

sora|A different way to decide for other people without telling them I had decided.

She sends the longer note with the uncertain part labeled. You are not asked to promise secrecy. She thanks you for reading, then says she will explain the relevant courier history to the group herself.
`),
personal("sora",3,"The question she asks aloud",`
Sora has an archive appointment and wants someone to go with her. She starts explaining why a second witness would improve the record. Then she stops.

sora|That is true. I also don't want to have the conversation alone. I should not need to turn that into a procedural advantage before asking.

Your answer can be no. She says so before you ask. If you cannot go, she will ask another founder rather than treat your schedule as something to solve through persistence.

You help her prepare the questions. One concerns the missing page. Another asks who ordered the restriction. She leaves a blank line for a question she might only discover there.

sora|I can't prepare every uncertain moment out of a meeting. Apparently other people are allowed to exist in it too.

She smiles at her own sentence. You leave the last question open. The preparation feels stronger because it admits where it ends.
`),
personal("sora",4,"A recipe she has changed",`
Sora offers you soup and announces that she has changed the recipe. You ask if this is an emergency.

sora|A controlled departure from documentation. The onion was unexpectedly persuasive.

She tells you the archive meeting did not resolve everything. She shared what happened anyway, including a question she failed to ask and remembered afterward. Akari did not mistake that omission for dishonesty. Ren suggested a follow-up. The information improved because other people had it.

sora|I used to think closeness meant someone would understand the explanation I eventually gave. It may also mean letting them see why the explanation is not finished.

She asks whether the soup needs salt. When you answer, she tastes it again rather than defending the recipe.

There is still something serious she owes the hall about the courier records. She names that responsibility, not the private details before she is ready. Then she returns to the soup, allowing an ordinary afternoon to contain an unfinished truth.
`),
personal("daichi",1,"The kettle repair",`
Daichi is testing the kettle handle over a towel. He asks you to watch for movement in the pin while he applies gentle pressure.

daichi|No bravery required. If it shifts, we stop and ask Riku. An excellent partnership with a metal pin.

You say when it moves. He stops immediately and sets the kettle down. It is satisfying to give a simple observation and have someone act on it.

He says he likes making useful things last. He also likes keeping familiar things longer than they can safely serve a purpose. The two habits look similar until someone has to carry the consequences.

daichi|The towel is here because I am trying to tell them apart before filling it.

Riku replaces the pin later. Daichi uses a different pot that evening without treating the substitution as defeat. He asks what tea you prefer and remembers the answer.
`),
personal("daichi",2,"The word after yes",`
Daichi offers to host an extra appointment. You point to his existing schedule. He laughs gently, then becomes serious.

daichi|I heard myself say yes before I looked. I like the feeling in the first second. The hours afterward are where other people discover what I meant.

He phones Mika and revises the offer while it can still be changed without inconveniencing her. She accepts the new time and thanks him for checking.

Afterward he tells you that being warm can become a way to avoid a disagreement. He worries that saying no will make someone feel unwanted. Yet a late absence can make them feel far less wanted than an honest limit.

You are not asked to fix his habit. He asks if the hall's invitations ever make you feel obliged to stay beyond your hour. He is ready to hear yes.

He writes leave whenever you need beside the meal invitation. Then he asks whether the words match what the room actually does.
`),
personal("daichi",3,"The letter he hasn't sent",`
Daichi has a sheet folded into quarters. He tells you it is a letter, then says it is a draft of a draft. The second description makes it sound safer.

daichi|There is a friend I owe an answer. I keep trying to send the version of myself who has understood everything. That person is taking an unreasonable time to arrive.

He does not hand you the private page. He asks whether an apology can contain what is still uncertain. You say it would have to, if it came from a real person.

He looks at the page again.

daichi|I can say what I did. I can ask how he is. I cannot choose what he remembers or what he owes me in return.

You sit while he crosses out a paragraph that explained too much. He asks for another envelope. You bring one, then leave the rest of the writing to him. The help is small enough that the letter remains his.
`),
personal("daichi",4,"Tea before another task",`
Daichi has sat down before everyone else's cups are ready. Mika sees him do it and says nothing, which seems like a considerable act of restraint.

daichi|If I wait until nothing needs doing, I will become a very thirsty monument to service.

He says he used to imagine a welcoming hall as a place whose caretaker never disappointed anyone. Now he is trying to imagine a place where people can name a need and hear an honest answer.

He asks if you want tea. You choose whether to stay. His expression remains warm either way. It is an invitation with an exit, which makes accepting it feel easier.

The kettle needs another careful check tomorrow. The river visit has a date. The letter has been sent. Not every task is finished, but the unfinished tasks have stopped being evidence that he must remain standing.

He takes a sip while it is hot and asks about something in your life that has nothing to do with training. You can answer or keep it private. The afternoon has room for either.
`),
personal("yuzu",1,"A game with an exit",`
Yuzu has arranged paper moths along a tabletop and asks you to choose a route between them with your finger. It is a puzzle, not a physical drill.

yuzu|The rule is that you can stop whenever it gets annoying. A highly controversial innovation in games people invent for other people.

You find a route she did not plan. She checks it, laughs, and changes one moth rather than declaring your answer invalid.

She says she likes games because a rule can make a movement interesting. She dislikes when people forget the other person agreed to the rule and may decide they are done.

yuzu|If I tease you and it lands badly, tell me. You don't have to become more entertaining to keep up with my mouth.

The puzzle ends before your patience does. She offers you a moth to keep, then asks whether you want one rather than pressing it into your hand. Even play can leave a choice intact.
`),
personal("yuzu",2,"The bag by the wall",`
Yuzu keeps a travel bag packed behind the coat stand. You ask whether she is leaving soon. She says not today, then admits that not today has become a way to avoid answering the real question.

yuzu|If the bag is ready, nobody can surprise me by needing me somewhere else. If I never name the day, nobody can prepare to miss me. A clever arrangement with several obvious victims.

She tells you about river work with her family and music she wants to hear in another town. Those wishes do not sound like escape from the hall. They sound like parts of her life the room cannot contain.

You ask what she can promise instead of staying forever. She takes out a calendar.

yuzu|A date. A way to keep helping. An actual goodbye, not a note someone discovers after I'm gone.

She writes a possible return day and leaves room to confirm it. For once the bag looks like luggage rather than an argument she can avoid having.
`),
personal("yuzu",3,"When the joke stops",`
Yuzu begins making fun of her own travel conversation. Halfway through, she notices that you are listening seriously and stops.

yuzu|I do that when I want to get through the part where someone could ask me to mean what I said.

She asks whether you think the hall will resent her leaving. You cannot know everyone's answer. You say she should ask them rather than make their imagined resentment do the talking.

yuzu|Fair. I was about to argue with five fictional versions of my friends. Sora would have been extremely concise.

The joke helps without replacing the point. Yuzu writes down which tasks she will hand over. She asks if you can remind her of the visitor sheet when the conversation happens. Your answer can be no; she will put a note beside the bag too.

She folds a moth for the calendar and leaves it there, not in the bag. A piece of her can stay without requiring every piece of her to do so.
`),
personal("yuzu",4,"A date she keeps",`
Yuzu's message arrives with an ordinary date at the top. It describes the river work, a song she learned badly, and the exact day she plans to return. It also asks whether the hall needs revised signs before the review.

You read the part addressed to you: she is glad you listened without asking her to make leaving proof of a problem. The next line says you are allowed to miss her anyway. She misses the room too.

When she returns, she does not ask whether everything was worse without her. She asks what changed and who did the work. Then she listens while people tell her.

yuzu|I want a place that can continue without me and still be pleased when I arrive. It appears we have conducted a moderately successful experiment.

She offers a paper moth made from a travel receipt. This time one wing carries the return date. It is no longer a warning that she might disappear. It records something she said and did.
`),
];

const invitations:Record<string,[string,string,string]>={
 akari:["A walk without a task","I would like to walk with you after the hall closes. No repair list, no practice notes. We could let a conversation take its own time.","I value the way you can disagree with me without asking me to become someone else. I would like to find out what that means beyond the hall, if you would too."],
 ren:["Breakfast with a time","I have a free morning, good bread, and a proposal considerably less vague than sometime. Would you like breakfast together?","I'd like it to be a date, if that is something you want. You can say friends. I won't make a joke that forces you to rescue my dignity."],
 sora:["The question before the invitation","There is a bookshop I think you would enjoy. I'd like to go with you, partly for the bookshop and partly for the company.","I mean this as an invitation to explore something romantic, if we both want it. Being clear seems kinder than leaving you to infer it from an annotated map."],
 daichi:["A seat he chooses","I have made time for an evening out. Mika is handling her own plans, and the hall can survive without my kettle for several hours.","I'd like to spend it with you as a date. Only if that feels right to you. Your place here has never depended on this answer."],
 yuzu:["A destination for two","I found a small music gathering near the bridge. It has seats, a sensible end time, and an excellent chance of one song I can hum correctly.","I would like to invite you as a date. Friendship is also a good answer. Either way, please don't let me claim I knew all the songs."],
};
export const RELATIONSHIPS:StoryScene[]=Object.entries(invitations).map(([member,[title,invite,romance]])=>({id:`c1-${member}-invitation`,title,kind:"relationship",member,threshold:140,practiceGate:42,episode:7,beat:1,location:"courtyard",lines:lines(`The conversation happens privately, after the ordinary work is done. There is time to answer without an audience.\n\n${member}|${invite}\n\nThe invitation does not ask you to earn access with a confession or a gift. This person has a life you have begun to know, and a question only both of you can answer.\n\n${member}|${romance}\n\nYou can choose friendship with the same care. If you have already chosen another romantic invitation, this one remains a conversation between friends. Nobody loses trust because an invitation was not the answer you wanted.`),choice:{flag:`interest:${member}`,prompt:"How would you like to answer?",options:[{id:"friend",label:"I'd like to go as friends. This connection matters to me.",reply:reply(member,"Then friends it is. I'm glad we can be clear with each other. Let's choose a time we can actually keep.","soft")},{id:"romance",label:"I'd like it to be a date. Let's take it slowly.",reply:reply(member,"I'd like that too. One date, no promise to skip the part where we get to know each other. Your training and your place here remain yours.","soft")}]} }));
