import { getChatGPTUser } from "@/app/chatgpt-auth";
import { database } from "@/lib/store";
import { dateKey, dayIndex, DEFAULT_ASSESSMENT } from "@/lib/training";
import {beginnerProgress,type WeekCheck} from "@/lib/beginner";
import type {RecordEntry} from "@/lib/training";
export const dynamic="force-dynamic";
const response=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export async function GET(){
 const user=await getChatGPTUser();if(!user)return response({error:"Sign in to load your progress."},401);
 try {const db=database();const [rs,p,checks]=await Promise.all([db.prepare("SELECT date, kind, minutes, day, readiness, note FROM training_records WHERE user_id = ? ORDER BY date DESC").bind(user.userId).all(),db.prepare("SELECT squat, reach, comfort FROM training_profiles WHERE user_id = ?").bind(user.userId).first<{squat:string;reach:string;comfort:number}>(),db.prepare("SELECT week,goals FROM beginner_week_checks WHERE user_id=? ORDER BY week").bind(user.userId).all()]);return response({records:rs.results,checks:checks.results.map(c=>({week:c.week,goals:JSON.parse(String(c.goals))})),assessment:p?{...p,comfort:!!p.comfort}:DEFAULT_ASSESSMENT});}
 catch(e){console.error("Load progress",e);return response({error:"Your progress could not be loaded. Please retry."},503);}
}
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return response({error:"Sign in to save your progress."},401);
 if(request.headers.get("Origin")&&request.headers.get("Origin")!==new URL(request.url).origin)return response({error:"Invalid request origin."},403);
 try {
  const input=await request.json();if(!input||typeof input!=="object"||Array.isArray(input))return response({error:"Invalid entry."},400);const b=input as Record<string,unknown>;const db=database();
  if(b.type==="weekcheck"){
   const rs=await db.prepare("SELECT date,kind,minutes,day,readiness,note FROM training_records WHERE user_id=?").bind(user.userId).all<RecordEntry>();
   const rows=await db.prepare("SELECT week,goals FROM beginner_week_checks WHERE user_id=?").bind(user.userId).all<{week:number;goals:string}>();const checks:WeekCheck[]=rows.results.map(c=>({week:c.week,goals:JSON.parse(c.goals)}));
   const progress=beginnerProgress(rs.results,checks,dateKey());if(b.week!==progress.week||!Array.isArray(b.goals)||b.goals.length!==3||!b.goals.every(g=>typeof g==="boolean"))return response({error:"Check in on your current beginner week."},400);
   await db.prepare("INSERT INTO beginner_week_checks (user_id,week,goals) VALUES (?,?,?) ON CONFLICT(user_id,week) DO UPDATE SET goals=excluded.goals").bind(user.userId,b.week,JSON.stringify(b.goals)).run();return response({ok:true});
  }
  if(b.type==="assessment"){
   if(!["shallow","quarter","half","comfortable"].includes(String(b.squat))||!["knees","shins","toes"].includes(String(b.reach))||typeof b.comfort!=="boolean")return response({error:"Choose valid mobility options."},400);
   await db.prepare("INSERT INTO training_profiles (user_id,squat,reach,comfort) VALUES (?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET squat=excluded.squat,reach=excluded.reach,comfort=excluded.comfort").bind(user.userId,b.squat,b.reach,b.comfort?1:0).run();return response({ok:true});
  }
  if(b.type!=="record"||b.date!==dateKey()||b.day!==dayIndex()||!["training","rest","partial"].includes(String(b.kind))||!["ready","tired","pain"].includes(String(b.readiness))||typeof b.minutes!=="number"||!Number.isFinite(b.minutes)||b.minutes<0||b.minutes>60||typeof b.note!=="string"||b.note.length>1000)return response({error:"This entry is invalid. You can only record today’s practice."},400);
  if(b.kind!=="rest")return response({error:"Complete the saved guided session to record practice."},400);
  if(b.kind==="rest"&&b.minutes!==0)return response({error:"Rest entries have zero practice minutes."},400);
  await db.prepare("INSERT INTO training_records (user_id,date,kind,minutes,day,readiness,note) VALUES (?,?,?,?,?,?,?) ON CONFLICT(user_id,date) DO UPDATE SET readiness=excluded.readiness,note=excluded.note WHERE training_records.kind='rest'").bind(user.userId,b.date,b.kind,b.minutes,b.day,b.readiness,b.note).run();return response({ok:true});
 }catch(e){if(e instanceof SyntaxError)return response({error:"Invalid entry."},400);console.error("Save progress",e);return response({error:"Could not save. Your entry is still here; please retry."},503);}
}
