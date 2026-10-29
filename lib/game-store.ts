import {database} from "./store";
import {freshGame,type GameState} from "./game";
import type {RecordEntry} from "./training";
import {GameError} from "./game-error";
export {GameError} from "./game-error";
export async function readGame(user:string,now=Date.now()){
 const db=database();const select=()=>db.prepare("SELECT state,revision FROM dojo_accounts WHERE user_id=?").bind(user).first<{state:string;revision:number}>();
 // Reads stay reads: the fresh account row is only written the first time.
 let row=await select();if(!row){await db.prepare("INSERT OR IGNORE INTO dojo_accounts (user_id,state,revision,mutation_id) VALUES (?,?,0,'')").bind(user,JSON.stringify(freshGame(now))).run();row=await select();}
 if(!row)throw new GameError("Your dojo could not be loaded.",503);return {game:JSON.parse(row.state) as GameState,revision:row.revision};
}
// One compare-and-swap controls the account, reward ledger, and journal in the same D1 transaction.
// A losing writer's dependent statements see a different mutation_id and perform no writes.
export async function mutateGame(user:string,apply:(g:GameState,now:number)=>{record?:RecordEntry;result?:unknown;reset?:boolean}|void){
 const db=database();for(let retry=0;retry<5;retry++){
  const {game,revision}=await readGame(user);const previous=new Set(Object.keys(game.rewards));const now=Date.now();const output=apply(game,now);game.lastVisit=now;
  const mutation=crypto.randomUUID();const statements=[db.prepare("UPDATE dojo_accounts SET state=?,revision=revision+1,mutation_id=? WHERE user_id=? AND revision=?").bind(JSON.stringify(game),mutation,user,revision)];
  if(output?.reset)for(const table of ["dojo_reward_events","training_records","training_profiles","beginner_week_checks"])statements.push(db.prepare(`DELETE FROM ${table} WHERE user_id=? AND EXISTS (SELECT 1 FROM dojo_accounts WHERE user_id=? AND mutation_id=?)`).bind(user,user,mutation));
  for(const key of Object.keys(game.rewards).filter(k=>!previous.has(k)))statements.push(db.prepare("INSERT OR IGNORE INTO dojo_reward_events (user_id,source_id,awarded_at) SELECT ?,?,? WHERE EXISTS (SELECT 1 FROM dojo_accounts WHERE user_id=? AND mutation_id=?)").bind(user,key,now,user,mutation));
  // A later session on the same date adds its minutes and keeps earlier notes in the journal.
  const record=output?.record;if(record)statements.push(db.prepare("INSERT INTO training_records (user_id,date,kind,minutes,day,readiness,note) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM dojo_accounts WHERE user_id=? AND mutation_id=?) ON CONFLICT(user_id,date) DO UPDATE SET kind=excluded.kind,minutes=round(training_records.minutes+excluded.minutes,2),readiness=excluded.readiness,note=CASE WHEN excluded.note='' THEN training_records.note WHEN training_records.note='' OR training_records.note=excluded.note THEN excluded.note ELSE substr(training_records.note||char(10)||excluded.note,1,4000) END WHERE training_records.kind!='training'").bind(user,record.date,record.kind,record.minutes,record.day,record.readiness,record.note,user,mutation));
  const results=await db.batch(statements);if(results[0].meta.changes===1)return {game,revision:revision+1,serverTime:now,result:output?.result};
 }
 throw new GameError("Another visit updated your dojo. Please retry.",409);
}
