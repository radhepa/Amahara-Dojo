import './typescript-loader.mjs';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {DatabaseSync} from 'node:sqlite';import assert from 'node:assert/strict';
const {dateKey,dayIndex,makePlan}=await import('../lib/training.ts');
const root=fileURLToPath(new URL('../',import.meta.url)),testUrl=new URL(process.env.DOJO_TEST_ORIGIN??'http://127.0.0.1:5173');
assert(['127.0.0.1','localhost','[::1]'].includes(testUrl.hostname)&&testUrl.protocol==='http:','API checks only accept a local loopback preview.');
const origin=testUrl.origin,databaseDirectory=path.join(root,'.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
const databases=fs.readdirSync(databaseDirectory).filter(file=>file.endsWith('.sqlite')).filter(file=>{
 const candidate=new DatabaseSync(path.join(databaseDirectory,file),{readOnly:true});
 try{return !!candidate.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='dojo_accounts'").get();}finally{candidate.close();}
});assert.equal(databases.length,1,'Expected one local Dojo database. Run npm run db:local first.');
const db=new DatabaseSync(path.join(databaseDirectory,databases[0]));db.exec('PRAGMA busy_timeout=5000');
const jar=new Map();let url=origin+'/';for(let n=0;n<8;n++){const r=await fetch(url,{redirect:'manual',headers:{Cookie:[...jar].map(([k,v])=>k+'='+v).join('; ')}});for(const item of r.headers.getSetCookie()){const part=item.split(';')[0],i=part.indexOf('=');jar.set(part.slice(0,i),part.slice(i+1));}if(r.status<300||r.status>=400){assert.equal(r.status,200);break;}url=new URL(r.headers.get('location'),origin).href;}
const cookie=[...jar].map(([k,v])=>k+'='+v).join('; ');
async function api(route,body,extra={}){const r=await fetch(origin+route,{method:body?'POST':'GET',headers:{Cookie:cookie,...(body?{'Content-Type':'application/json',Origin:origin}:{}),...extra},body:body?JSON.stringify(body):undefined});const text=await r.text();let parsed;try{parsed=JSON.parse(text);}catch{parsed={error:text.slice(0,100)};}return {status:r.status,body:parsed};}
assert.equal((await fetch(origin+'/api/game',{redirect:'manual'})).status,401);assert.equal((await fetch(origin+'/api/sessions',{method:'POST',body:'{}',headers:{'Content-Type':'application/json'}})).status,401);
const initial=await api('/api/game');assert.equal(initial.status,200);const row=db.prepare('SELECT * FROM dojo_accounts WHERE state=?').get(JSON.stringify(initial.body.game));assert(row,'local account identified');const user=row.user_id;
const today=dateKey(new Date(initial.body.serverTime)),todayDay=dayIndex(new Date(initial.body.serverTime));
const priorTime=Date.parse(today+'T12:00:00Z')-86400000,priorDate=dateKey(new Date(priorTime)),priorDay=dayIndex(new Date(priorTime));
const previousRewards=db.prepare('SELECT * FROM dojo_reward_events WHERE user_id=?').all(user);const previousRecords=db.prepare('SELECT * FROM training_records WHERE user_id=?').all(user);let sequence=row.revision;
function seed(g){sequence+=20;db.prepare('UPDATE dojo_accounts SET state=?,revision=?,mutation_id=? WHERE user_id=?').run(JSON.stringify(g),sequence,'qa-seed',user);}
try{
 assert.equal((await api('/api/game',{action:'scene',id:'c1-prologue',operation:'advance',position:0},{Origin:'https://different.test'})).status,403);
 assert.equal((await api('/api/progress',{type:'record',date:today,day:todayDay,kind:'training',minutes:30,readiness:'ready',note:''})).status,400);
 assert.equal((await api('/api/progress',[])).status,400);
 db.prepare("INSERT INTO training_records(user_id,date,kind,minutes,day,readiness,note) VALUES(?,?,'partial',7,?,'tired','QA partial') ON CONFLICT(user_id,date) DO UPDATE SET kind='partial',minutes=7,day=excluded.day,readiness='tired',note='QA partial'").run(user,today,todayDay);
 assert.equal((await api('/api/progress',{type:'record',date:today,day:todayDay,kind:'rest',minutes:0,readiness:'pain',note:'QA rest'})).status,200);
 assert.deepEqual(db.prepare('SELECT kind,minutes,note FROM training_records WHERE user_id=? AND date=?').get(user,today),Object.assign(Object.create(null),{kind:'partial',minutes:7,note:'QA partial'}));
 const g=structuredClone(initial.body.game);g.scenes={};g.rewards={};g.practices=0;g.sessions={};seed(g);
 const first=await Promise.all([api('/api/game',{action:'scene',id:'c1-prologue',operation:'advance',position:0}),api('/api/game',{action:'scene',id:'c1-prologue',operation:'advance',position:0})]);assert(first.every(r=>r.status===200));assert.equal((await api('/api/game')).body.game.scenes['c1-prologue'].position,1);
 assert.equal((await api('/api/game',{action:'scene',id:'c1-e1-b1',operation:'advance',position:0})).status,400);
 assert.equal((await api('/api/sessions',{action:'start',readiness:'pain',companion:'akari'})).status,400);
 const start=await api('/api/sessions',{action:'start',readiness:'tired',companion:'ren'});let s;
 if(todayDay===2){
  assert.equal(start.status,400);const fixture=(await api('/api/game')).body.game;
  const plan=makePlan(priorDay,'tired',1).blocks;s={id:crypto.randomUUID(),date:priorDate,day:priorDay,readiness:'tired',companion:'ren',week:1,plan,index:0,elapsed:0,runningSince:initial.body.serverTime,checks:plan.map(()=>false),skipped:false,status:'active',note:''};fixture.sessions={[s.id]:s};seed(fixture);
 }else{assert.equal(start.status,200);s=Object.values(start.body.game.sessions).find(s=>s.status==='active');}
 const planMinutes=s.plan.reduce((n,b)=>n+b.seconds,0)/60;assert(planMinutes>=30&&planMinutes<=45);
 assert.equal((await api('/api/sessions',{action:'next',id:s.id,index:0,confirm:true,elapsed:999999})).status,400);
 assert.equal((await api('/api/sessions',{action:'finalize',id:s.id,note:''})).status,400);
 const paused=await api('/api/sessions',{action:'pause',id:s.id});assert.equal(paused.status,200);assert.equal(paused.body.game.sessions[s.id].runningSince,null);const reload=await api('/api/game');assert.deepEqual(reload.body.game.sessions[s.id].plan,s.plan);assert.equal(reload.body.game.sessions[s.id].companion,'ren');
 const completed=structuredClone(reload.body.game);const fake=completed.sessions[s.id];fake.status='summary';fake.checks=fake.plan.map(()=>true);fake.index=fake.plan.length-1;fake.elapsed=fake.plan.at(-1).seconds;fake.runningSince=null;fake.date=priorDate;fake.day=priorDay;seed(completed);
 db.prepare("INSERT INTO training_records(user_id,date,kind,minutes,day,readiness,note) VALUES(?,?,'rest',0,?,'ready','QA concurrent rest') ON CONFLICT(user_id,date) DO UPDATE SET kind='rest',minutes=0,day=excluded.day,note='QA concurrent rest'").run(user,priorDate,priorDay);
 const saved=await Promise.all([api('/api/sessions',{action:'finalize',id:s.id,note:'QA only',reflection:'private'}),api('/api/sessions',{action:'finalize',id:s.id,note:'QA retry',reflection:'comfortable'})]);assert(saved.every(r=>r.status===200));const result=(await api('/api/game')).body.game;assert.equal(result.practices,1);assert.equal(result.supplies,20);assert.equal(result.bonds.ren,12);
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM dojo_reward_events WHERE user_id=? AND source_id=?').get(user,'practice:'+priorDate).n,1);assert.equal(db.prepare('SELECT kind,minutes,date FROM training_records WHERE user_id=? AND date=?').get(user,priorDate).kind,'training');assert.equal(db.prepare('SELECT minutes FROM training_records WHERE user_id=? AND date=?').get(user,priorDate).minutes,planMinutes);
 assert.equal(result.sessions[s.id].date,priorDate);assert.equal(result.sessions[s.id].status,'training');
 console.log('PASS: authentication and origin guards, invalid body rejection, legacy completion rejection, partial journal preservation, saved locked practice, elapsed-time rejection, two-tab scene CAS, concurrent finalization, one reward event, concurrent rest-to-practice consistency, late-date journal preservation.');
}finally{
 db.exec('BEGIN IMMEDIATE');try{const latest=db.prepare('SELECT revision FROM dojo_accounts WHERE user_id=?').get(user).revision;db.prepare('UPDATE dojo_accounts SET state=?,revision=?,mutation_id=? WHERE user_id=?').run(row.state,latest+1,'qa-restored',user);db.prepare('DELETE FROM dojo_reward_events WHERE user_id=?').run(user);for(const r of previousRewards)db.prepare('INSERT INTO dojo_reward_events(user_id,source_id,awarded_at) VALUES(?,?,?)').run(r.user_id,r.source_id,r.awarded_at);db.prepare('DELETE FROM training_records WHERE user_id=?').run(user);for(const r of previousRecords)db.prepare('INSERT INTO training_records(user_id,date,kind,minutes,day,readiness,note) VALUES(?,?,?,?,?,?,?)').run(r.user_id,r.date,r.kind,r.minutes,r.day,r.readiness,r.note);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}db.close();console.log('Local QA changes restored.');
}
