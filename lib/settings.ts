import {campaignMain,companionsUnlocked,type GameState} from "./game";
import {SCENE_BY_ID} from "./story";
import type {StoryScene} from "./story/types";
import type {RecordEntry} from "./training";

export function progressStats(game:GameState,records:RecordEntry[]){
 return {
  practices:records.filter(r=>r.kind==="training").length,
  minutes:Math.round(records.filter(r=>r.kind!=="rest").reduce((sum,r)=>sum+r.minutes,0)),
  episodes:campaignMain(game).filter(s=>game.scenes[s.id]?.done).length,
  companions:companionsUnlocked(game).length,
  supplies:game.supplies,
  projects:game.facilities.length,
 };
}

export function completedReplays(game:GameState){
 const episodes=campaignMain(game).filter(s=>game.scenes[s.id]?.done);
 const extras=Object.keys(game.scenes).map(id=>SCENE_BY_ID[id]).filter((s):s is StoryScene=>!!s&&s.kind!=="main"&&game.scenes[s.id].done);
 return {episodes,extras};
}
