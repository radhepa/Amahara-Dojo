import {getChatGPTUser} from "@/app/chatgpt-auth";
import {mutateGame,GameError} from "@/lib/game-store";
import {sessionAction} from "@/lib/session-actions";
import {database} from "@/lib/store";
import {beginnerProgress,type WeekCheck} from "@/lib/beginner";
import {dateKey,type RecordEntry} from "@/lib/training";
export const dynamic="force-dynamic";
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request){const user=await getChatGPTUser();if(!user)return response({error:"Sign in to save your practice."},401);if(request.headers.get("Origin")&&request.headers.get("Origin")!==new URL(request.url).origin)return response({error:"Invalid request origin."},403);try{
 const b=await request.json();if(!b||typeof b!=="object"||Array.isArray(b))return response({error:"Invalid practice action."},400);const db=database();const [rows,checkRows]=await Promise.all([db.prepare("SELECT date,kind,minutes,day,readiness,note FROM training_records WHERE user_id=?").bind(user.userId).all<RecordEntry>(),db.prepare("SELECT week,goals FROM beginner_week_checks WHERE user_id=?").bind(user.userId).all<{week:number;goals:string}>()]);
 const checks:WeekCheck[]=checkRows.results.map(c=>({week:c.week,goals:JSON.parse(c.goals)}));const week=beginnerProgress(rows.results,checks,dateKey()).week;const completed=new Set(rows.results.filter(r=>r.kind!=="partial").map(r=>r.date));
 return response(await mutateGame(user.userId,(g,now)=>sessionAction(g,b as Record<string,unknown>,now,week,completed)));
 }catch(e){if(e instanceof GameError)return response({error:e.message},e.status);if(e instanceof SyntaxError)return response({error:"Invalid practice action."},400);console.error("Save practice",e);return response({error:"Could not save. Your practice remains available; please retry."},503);}}
