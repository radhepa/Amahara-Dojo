import type {Drill} from "./training";

// Separate IDs keep already-saved sessions on their original instructions.
export const WEEK_ONE_DRILLS: Record<string, Drill> = {
 "w1-warm": {
  name:"Prepare to move",category:"Week 1 · Preparation",cue:"Easy feet, loose shoulders, eyes ahead.",timedRounds:true,
  steps:["Clear enough non-slip floor for one small step in each direction. Place a stable, non-wheeled chair nearby if useful.","Walk gently in place, then make small shoulder circles and open and close your hands.","Return to hip-width feet, soften your knees, and shift a little weight without lifting either foot.","Follow the short practice and rest rounds below. You should be able to speak a full sentence comfortably."],
  easier:"Sit upright with feet supported. Use small shoulder circles, open and close your hands, and gently lift one heel at a time if comfortable.",avoid:"Keep it easy. Stop with sharp or joint pain, dizziness, or unusual breathlessness.",dose:"30 sec easy movement / 30 sec rest",
  checkpoints:["Breathing stays comfortable.","The floor and space around you are clear."]
 },
 "w1-stance": {
  name:"Build your stance",category:"Week 1 · Stance",cue:"Two tracks under your feet. A tall, steady base.",timedRounds:true,
  steps:["Start with feet about hip-width apart. Choose a comfortable lead foot; keep that lead for the round.","Move the other foot a short step back. Keep space between your feet, as if each stands on its own railway track.","Soften both knees, stay upright, and look ahead. You should be able to breathe and move without straining.","Hold briefly, relax, and rebuild the stance. Try the other lead in another round only if comfortable."],
  easier:"Keep the stance shorter and rest fingertips on a stable chair. Seated preparation: sit tall with feet comfortably apart and rehearse the upright posture; this prepares for standing stance.",avoid:"Do not force a low stance, twist a planted knee, or put both feet on one narrow line.",dose:"30 sec build and reset / 30 sec rest",
  checkpoints:["Feet stay on separate tracks.","Knees are soft and breathing stays easy."]
 },
 "w1-guard": {
  name:"Find and reset your guard",category:"Week 1 · Guard",cue:"Hands return home. Shoulders stay loose.",timedRounds:true,
  steps:["Start in your comfortable stance, eyes ahead. Keep your shoulders down and elbows near your ribs.","Bring relaxed hands beside your cheeks without squeezing your neck or blocking your view.","Stay for two easy breaths, lower your hands, and bring them back to the same place.","Repeat slowly during each practice interval. This drill teaches hand position and reset; it is not a punch or a tested defense."],
  easier:"Keep hands nearer chest height, use one hand for chair support, or rehearse the same raise-and-reset pattern while seated.",avoid:"Avoid shrugging, holding your breath, or keeping tired arms raised through discomfort.",dose:"30 sec guard resets / 30 sec rest",
  checkpoints:["Eyes still have a clear view.","Hands return to the same comfortable position."]
 },
 "w1-shift": {
  name:"Balance without stepping",category:"Week 1 · Balance",cue:"Move a little. Keep your base.",timedRounds:true,
  steps:["Start in a short stance with fingertips on a chair if needed. Keep both feet grounded.","Shift a small amount of weight toward the front foot, then return to the middle.","Shift a little toward the back foot, then return again. Keep your head above your base rather than leaning far.","Use slow, small movements for the practice interval. Reset your feet and relax during each rest."],
  easier:"Use both hands for support and reduce the shift. Seated preparation: with feet supported, make a very small forward-and-back torso shift, staying within the chair seat.",avoid:"No one-leg holds, deep knee bends, or leaning beyond your feet or chair seat.",dose:"30 sec small shifts / 30 sec rest",
  checkpoints:["Both feet stay grounded.","You can stop at the middle without wobbling."]
 },
 "w1-forward": {
  name:"Step forward, step back",category:"Week 1 · Footwork",cue:"Front foot forward. Back foot backward.",timedRounds:true,
  steps:["Start in a short stance with each foot on its own track. Use steps only a few centimetres long.","Forward: move the front foot first, then the back foot by the same small distance. Pause with your stance restored.","Backward: move the back foot first, then the front foot. Pause again; do not bring your feet together or cross them.","Repeat one forward-and-back cycle slowly. Lower your hands if needed. Use supported weight shifts instead if stepping feels unsteady."],
  easier:"Use chair-supported weight shifts with both feet planted. Seated preparation: gently tap one foot forward and return, then the other, to learn the order without practicing standing balance.",avoid:"Do not shuffle quickly, hop, pivot sharply, cross your feet, or slide on socks.",dose:"30 sec small step cycles / 30 sec rest",
  checkpoints:["The foot nearest the direction moves first.","The following foot restores the original spacing."]
 },
 "w1-side": {
  name:"Step to either side",category:"Week 1 · Footwork",cue:"Nearest foot first. Restore your space.",timedRounds:true,
  steps:["Start in your short, comfortable stance. Keep your torso facing ahead and make the steps very small.","Left: move the left foot a few centimetres left, then move the right foot the same distance. Pause.","Right: move the right foot first, then the left foot. Keep the same stagger and width as your starting stance.","Repeat slowly with a pause after each pair of steps. Choose supported weight shifts if you cannot keep your balance."],
  easier:"Use small chair-supported side-to-side weight shifts with both feet planted. Seated preparation: gently tap one foot to its own side and return, without crossing your legs.",avoid:"Never cross the following foot over the leading foot or take a wide lunge.",dose:"30 sec side steps / 30 sec rest",
  checkpoints:["Feet stay apart and never cross.","Your torso stays facing ahead."]
 },
 "w1-flow": {
  name:"Guard, move, reset",category:"Week 1 · Review",cue:"One movement, then a full reset.",timedRounds:true,
  steps:["Build your short stance and relaxed guard. Check your balance before moving.","Take one tiny forward step pair, stop, and restore your guard. Then take one backward pair and stop.","If both feel controlled, add one left step pair and one right step pair, pausing after each. Otherwise repeat just the comfortable direction.","Reset between cycles. This is a slow review of the week's skills, not a speed or endurance test."],
  easier:"Keep feet planted, use chair support, and alternate a small weight shift with a guard reset. Seated preparation: alternate an easy guard reset with one comfortable foot tap.",avoid:"Do not add punches, kicks, rapid direction changes, or partner contact to this review.",dose:"30 sec slow review / 30 sec rest",
  checkpoints:["You pause in balance after each movement.","Your hands return without shoulder tension."]
 },
 "w1-cool": {
  name:"Release and review",category:"Week 1 · Finish",cue:"Let your hands drop. Let your breathing settle.",timedRounds:true,
  steps:["Lower your hands and stand comfortably or sit with feet supported.","Walk very slowly or stay seated until breathing feels settled. Gently open and close your hands.","If comfortable, make small shoulder circles and ankle movements. No forced stretch or range target is needed.","Use the final minute to notice which stance, guard, or step was repeatable. A private note is optional; there is no extra reward for harder work."],
  easier:"Stay seated, rest your hands, and let your breathing return to its normal rhythm. Skip any movement that is uncomfortable.",avoid:"Do not force a stretch or hold your breath. Stop if symptoms do not settle normally.",dose:"30 sec gentle reset / 30 sec rest",
  checkpoints:["Breathing settles comfortably.","You can name one skill to repeat next time."]
 }
};

export const WEEK_ONE_SCHEDULE = [
 {load:"Stance",title:"Find your base",focus:"Stance & guard",minutes:30,reason:"Learn a comfortable stance and where your hands return. No prior fitness routine or equipment is needed beyond optional stable support.",blocks:[["w1-warm",5],["w1-stance",10],["w1-guard",10],["w1-cool",5]]},
 {load:"Balance",title:"Keep your balance",focus:"Weight shifts & guard",minutes:30,reason:"Revisit your stance, then explore small weight shifts. Keep both feet grounded and choose support whenever useful.",blocks:[["w1-warm",5],["w1-stance",5],["w1-shift",10],["w1-guard",5],["w1-cool",5]]},
 {load:"Full rest",title:"Rest is your mission",focus:"Recovery",minutes:0,reason:"No martial arts practice or check-in is required. Return when ready; there is no absence penalty.",blocks:[]},
 {load:"Footwork",title:"Take your first steps",focus:"Forward & backward",minutes:30,reason:"Learn which foot moves first and how to rebuild your stance. Small, slow steps are enough.",blocks:[["w1-warm",5],["w1-stance",5],["w1-guard",5],["w1-forward",10],["w1-cool",5]]},
 {load:"Footwork",title:"Make room to move",focus:"Left & right",minutes:30,reason:"Add small side steps without crossing your feet. Use weight shifts as the supported alternative.",blocks:[["w1-warm",5],["w1-stance",5],["w1-shift",5],["w1-side",10],["w1-cool",5]]},
 {load:"Combine",title:"Return to your guard",focus:"Movement & reset",minutes:30,reason:"Review forward, backward, and side steps, then connect one comfortable movement with your guard.",blocks:[["w1-warm",5],["w1-forward",5],["w1-side",5],["w1-flow",10],["w1-cool",5]]},
 {load:"Review",title:"Repeat what you learned",focus:"Calm skill review",minutes:30,reason:"Repeat your stance, guard, and controlled movement. Choose the supported or seated preparation when needed; control is the goal.",blocks:[["w1-warm",5],["w1-stance",5],["w1-guard",5],["w1-flow",10],["w1-cool",5]]}
] as const;

export function roundTiming(seconds:number) {
 const setup=60,work=30,rest=30;
 const rounds=Math.max(0,Math.floor((seconds-setup-60)/(work+rest)));
 return {setup,work,rest,rounds,review:seconds-setup-rounds*(work+rest)};
}
export function practicePhase(seconds:number,elapsed:number) {
 const timing=roundTiming(seconds),used=Math.min(seconds,Math.max(0,Math.floor(elapsed)));
 if(used>=seconds)return {kind:"complete",label:"Block complete",remaining:0,round:timing.rounds};
 if(used<timing.setup)return {kind:"setup",label:"Read the instructions · get comfortable",remaining:timing.setup-used,round:0};
 const active=used-timing.setup;
 if(active>=timing.rounds*(timing.work+timing.rest))return {kind:"review",label:"Relax · check what felt repeatable",remaining:seconds-used,round:timing.rounds};
 const round=Math.floor(active/(timing.work+timing.rest))+1,position=active%(timing.work+timing.rest);
 return position<timing.work?{kind:"work",label:`Practice · round ${round} of ${timing.rounds}`,remaining:timing.work-position,round}:{kind:"rest",label:`Rest · round ${round} of ${timing.rounds}`,remaining:timing.work+timing.rest-position,round};
}
