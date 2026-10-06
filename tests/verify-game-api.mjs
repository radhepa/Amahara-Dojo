import './typescript-loader.mjs';
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {DatabaseSync} from 'node:sqlite';import assert from 'node:assert/strict';
const {dateKey,dayIndex,makePlan}=await import('../lib/training.ts');
const root=fileURLToPath(new URL('../',import.meta.url)),testUrl=new URL(process.env.DOJO_TEST_ORIGIN??'http://127.0.0.1:5173');
assert(['127.0.0.1','localhost','[::1]'].includes(testUrl.hostname)&&testUrl.protocol==='http:','API checks only accept a local loopback preview.');
const origin=testUrl.origin,databaseDirectory=path.join(root,'.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
const desktopDatabase=process.env.DOJO_TEST_DESKTOP_DB;
const databases=desktopDatabase?[path.resolve(desktopDatabase)]:fs.readdirSync(databaseDirectory).filter(file=>file.endsWith('.sqlite')).filter(file=>{
 const candidate=new DatabaseSync(path.join(databaseDirectory,file),{readOnly:true});
 try{return !!candidate.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='dojo_accounts'").get();}finally{candidate.close();}
});assert.equal(databases.length,1,'Expected one local Dojo database. Run npm run db:local first.');
const db=new DatabaseSync(desktopDatabase?databases[0]:path.join(databaseDirectory,databases[0]));db.exec('PRAGMA busy_timeout=5000');
const jar=new Map();if(desktopDatabase&&process.env.DOJO_TEST_DESKTOP_COOKIE)jar.set('dojo_session',process.env.DOJO_TEST_DESKTOP_COOKIE);
let url=origin+'/';for(let n=0;n<8;n++){const r=await fetch(url,{redirect:'manual',headers:{Cookie:[...jar].map(([k,v])=>k+'='+v).join('; ')}});for(const item of r.headers.getSetCookie()){const part=item.split(';')[0],i=part.indexOf('=');jar.set(part.slice(0,i),part.slice(i+1));}if(r.status<300||r.status>=400){assert.equal(r.status,200);break;}url=new URL(r.headers.get('location'),origin).href;}
const cookie=[...jar].map(([k,v])=>k+'='+v).join('; ');
async function api(route,body,extra={}){const r=await fetch(origin+route,{method:body?'POST':'GET',headers:{Cookie:cookie,...(body?{'Content-Type':'application/json',Origin:origin}:{}),...extra},body:body?JSON.stringify(body):undefined});const text=await r.text();let parsed;try{parsed=JSON.parse(text);}catch{parsed={error:text.slice(0,100)};}return {status:r.status,body:parsed};}
assert.equal((await fetch(origin+'/api/game',{redirect:'manual'})).status,401);assert.equal((await fetch(origin+'/api/sessions',{method:'POST',body:'{}',headers:{'Content-Type':'application/json'}})).status,401);
const initial=await api('/api/game');assert.equal(initial.status,200);const row=db.prepare('SELECT * FROM dojo_accounts WHERE state=?').get(JSON.stringify(initial.body.game));assert(row,'local account identified');const user=row.user_id;
const today=dateKey(new Date(initial.body.serverTime)),todayDay=dayIndex(new Date(initial.body.serverTime));
const priorTime=Date.parse(today+'T12:00:00Z')-86400000,priorDate=dateKey(new Date(priorTime)),priorDay=dayIndex(new Date(priorTime));
const previousRewards=db.prepare('SELECT * FROM dojo_reward_events WHERE user_id=?').all(user);const previousRecords=db.prepare('SELECT * FROM training_records WHERE user_id=?').all(user);const previousProfile=db.prepare('SELECT * FROM training_profiles WHERE user_id=?').get(user),previousChecks=db.prepare('SELECT * FROM beginner_week_checks WHERE user_id=?').all(user);const otherUser='pilot-qa-'+crypto.randomUUID();let sequence=row.revision;
function seed(g){sequence+=20;db.prepare('UPDATE dojo_accounts SET state=?,revision=?,mutation_id=? WHERE user_id=?').run(JSON.stringify(g),sequence,'qa-seed',user);}
try{
 assert.equal((await api('/api/game',{action:'scene',id:'c1-prologue',operation:'advance',position:0},{Origin:'https://different.test'})).status,403);
 assert.equal((await api('/api/progress',{type:'record',date:today,day:todayDay,kind:'training',minutes:30,readiness:'ready',note:''})).status,400);
 assert.equal((await api('/api/progress',[])).status,400);
 db.prepare("INSERT INTO training_records(user_id,date,kind,minutes,day,readiness,note) VALUES(?,?,'partial',7,?,'tired','QA partial') ON CONFLICT(user_id,date) DO UPDATE SET kind='partial',minutes=7,day=excluded.day,readiness='tired',note='QA partial'").run(user,today,todayDay);
 assert.equal((await api('/api/progress',{type:'record',date:today,day:todayDay,kind:'rest',minutes:0,readiness:'pain',note:'QA rest'})).status,200);
 assert.deepEqual(db.prepare('SELECT kind,minutes,note FROM training_records WHERE user_id=? AND date=?').get(user,today),Object.assign(Object.create(null),{kind:'partial',minutes:7,note:'QA partial'}));
 const g=structuredClone(initial.body.game);delete g.storyRevision;g.scenes={};g.rewards={};g.practices=0;g.sessions={};seed(g);
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
 // The reset is authenticated, atomic, idempotent, and restricted to this account.
 const old=(await api('/api/game')).body.game;delete old.storyRevision;seed(old);
 db.prepare("INSERT INTO training_profiles(user_id,squat,reach,comfort) VALUES(?,'half','toes',1) ON CONFLICT(user_id) DO UPDATE SET squat='half',reach='toes',comfort=1").run(user);
 db.prepare("INSERT INTO beginner_week_checks(user_id,week,goals) VALUES(?,1,'[true,true,true]') ON CONFLICT(user_id,week) DO UPDATE SET goals=excluded.goals").run(user);
 db.prepare("INSERT INTO dojo_accounts(user_id,state,revision,mutation_id) VALUES(?,?,0,'other-fixture')").run(otherUser,JSON.stringify(old));
 db.prepare("INSERT INTO training_records(user_id,date,kind,minutes,day,readiness,note) VALUES(?,?,'training',30,0,'ready','other account')").run(otherUser,today);
 const resetBody={action:'reset-pilot',token:crypto.randomUUID()};
 assert.equal((await api('/api/game',resetBody,{Origin:'https://different.test'})).status,403);
 const resets=await Promise.all([api('/api/game',resetBody),api('/api/game',resetBody)]);assert(resets.every(r=>r.status===200));
 let pilot=(await api('/api/game')).body.game;assert.equal(pilot.practices,0);assert.equal(pilot.supplies,0);assert.equal(pilot.storyRevision,'week-one-v2');assert.deepEqual(pilot.scenes,{});
 for(const table of ['training_records','training_profiles','beginner_week_checks','dojo_reward_events'])assert.equal(db.prepare('SELECT COUNT(*) AS n FROM '+table+' WHERE user_id=?').get(user).n,0);
 assert.equal(db.prepare('SELECT state FROM dojo_accounts WHERE user_id=?').get(otherUser).state,JSON.stringify(old));assert.equal(db.prepare('SELECT COUNT(*) AS n FROM training_records WHERE user_id=?').get(otherUser).n,1);
 assert.equal((await api('/api/game',{...resetBody,token:crypto.randomUUID()})).status,400);
 assert.equal((await api('/api/sessions',{action:'pause',id:s.id})).status,404);
 const {PILOT_PROLOGUE,PILOT_OPENINGS,pilotLines}=await import('../lib/story/index.ts');
 async function readPilot(scene){let guard=0;while(!pilot.scenes[scene.id]?.done){assert(guard++<150);const save=pilot.scenes[scene.id],list=pilotLines(scene,save?.flags??pilot.flags,save?.choices),line=list.find(l=>l.id===save?.passageId)??list[0];const input={action:'scene',id:scene.id,passageId:line.id,operation:'advance'};if(line.decision&&!save?.choices?.[line.decision.flag])Object.assign(input,{operation:'choose',decision:line.decision.flag,option:line.decision.options[0].id});const result=await api('/api/game',input);assert.equal(result.status,200);pilot=result.body.game;}}
 await readPilot(PILOT_PROLOGUE);await readPilot(PILOT_OPENINGS[0]);
 if(todayDay!==2){assert.equal((await api('/api/sessions',{action:'start',readiness:'ready',companion:'ren'})).status,400);const solo=await api('/api/sessions',{action:'start',readiness:'ready',companion:'solo'});assert.equal(solo.status,200);assert.equal(Object.values(solo.body.game.sessions)[0].companion,'solo');}
 // A later inline choice uses the same atomic CAS and stable reply IDs.
 const {freshGame,openingIndex}=await import('../lib/game.ts');
 const {MONTH_MAIN,MONTH_OPENINGS}=await import('../lib/story/index.ts');
 const {gameAction}=await import('../lib/game-actions.ts');
 const month=freshGame(initial.body.serverTime);
 function localRead(scene,stopFlag){let guard=0;while(!month.scenes[scene.id]?.done){assert(guard++<300);const save=month.scenes[scene.id],list=pilotLines(scene,save?.flags??month.flags,save?.choices),line=list.find(l=>l.id===save?.passageId)??list[0];if(stopFlag&&line.decision?.flag===stopFlag)return line;const input={action:'scene',id:scene.id,passageId:line.id,operation:'advance'};if(line.decision&&!save?.choices?.[line.decision.flag])Object.assign(input,{operation:'choose',decision:line.decision.flag,option:line.decision.options[0].id});gameAction(month,input,initial.body.serverTime);}}
 localRead(PILOT_PROLOGUE);
 for(let i=0;i<22;i++){const opening=MONTH_OPENINGS.find(o=>openingIndex(o)===i);if(opening)localRead(opening);month.practices=i+1;localRead(MONTH_MAIN[i]);}
 month.practices=23;const hinge=MONTH_MAIN[22],decision=localRead(hinge,'mistake');seed(month);
 const choiceBody={action:'scene',id:hinge.id,passageId:decision.id,operation:'choose',decision:'mistake'};
 const racedChoices=await Promise.all([api('/api/game',{...choiceBody,option:'public'}),api('/api/game',{...choiceBody,option:'direct'})]);assert(racedChoices.every(r=>r.status===200));
 const selected=(await api('/api/game')).body.game,choice=selected.scenes[hinge.id].choices.mistake;assert(['public','direct'].includes(choice));assert.equal(selected.flags.mistake,choice);assert(selected.scenes[hinge.id].passageId.includes('-reply-'+choice));
 await api('/api/game',{...choiceBody,option:choice==='public'?'direct':'public'});assert.deepEqual({...((await api('/api/game')).body.game),lastVisit:0},{...selected,lastVisit:0});
 // Settings can restart an active campaign repeatedly. Retries cannot erase new progress.
 db.prepare("INSERT INTO training_records(user_id,date,kind,minutes,day,readiness,note) VALUES(?,?,'partial',7,?,'tired','private reset fixture') ON CONFLICT(user_id,date) DO UPDATE SET kind='partial',minutes=7,note=excluded.note").run(user,today,todayDay);
 db.prepare("INSERT INTO training_profiles(user_id,squat,reach,comfort) VALUES(?,'half','toes',1) ON CONFLICT(user_id) DO UPDATE SET squat='half',reach='toes',comfort=1").run(user);
 db.prepare("INSERT INTO beginner_week_checks(user_id,week,goals) VALUES(?,1,'[true,true,true]') ON CONFLICT(user_id,week) DO UPDATE SET goals=excluded.goals").run(user);
 const settingsReset={action:'reset-progress',token:crypto.randomUUID(),previousResetToken:selected.resetToken??'',confirmation:'RESTART'};
 assert.equal((await api('/api/game',{...settingsReset,confirmation:''})).status,400);
 assert.equal((await api('/api/game',settingsReset,{Origin:'https://different.test'})).status,403);
 assert.equal((await api('/api/game',{...settingsReset,previousResetToken:'stale-settings-token'})).status,409);
 assert.equal((await api('/api/progress')).body.records.length>0,true,'Rejected restarts preserve the journal.');
 const restarted=await Promise.all([api('/api/game',settingsReset),api('/api/game',settingsReset)]);assert(restarted.every(r=>r.status===200));
 const clean=(await api('/api/game')).body.game;assert.deepEqual(clean,{...freshGame(clean.lastVisit),resetToken:settingsReset.token});
 for(const table of ['training_records','training_profiles','beginner_week_checks','dojo_reward_events'])assert.equal(db.prepare('SELECT COUNT(*) AS n FROM '+table+' WHERE user_id=?').get(user).n,0);
 const {DEFAULT_ASSESSMENT}=await import('../lib/training.ts');assert.deepEqual((await api('/api/progress')).body,{records:[],checks:[],assessment:DEFAULT_ASSESSMENT});
 const firstLine=pilotLines(PILOT_PROLOGUE,clean.flags,{})[0];assert.equal((await api('/api/game',{action:'scene',id:PILOT_PROLOGUE.id,operation:'advance',passageId:firstLine.id})).status,200);
 assert.equal((await api('/api/progress',{type:'assessment',squat:'half',reach:'toes',comfort:true})).status,200);
 const beforeRetry=(await api('/api/game')).body.game;assert.equal((await api('/api/game',settingsReset)).status,200);
 assert.deepEqual({...((await api('/api/game')).body.game),lastVisit:0},{...beforeRetry,lastVisit:0});assert.equal((await api('/api/progress')).body.assessment.comfort,true);
 const nextReset={...settingsReset,token:crypto.randomUUID(),previousResetToken:settingsReset.token};assert.equal((await api('/api/game',nextReset)).status,200);
 assert.equal((await api('/api/game',settingsReset)).status,409,'An old retry must not erase a later campaign.');
 const competing=await Promise.all([api('/api/game',{...settingsReset,token:crypto.randomUUID(),previousResetToken:nextReset.token}),api('/api/game',{...settingsReset,token:crypto.randomUUID(),previousResetToken:nextReset.token})]);assert.deepEqual(competing.map(r=>r.status).sort(),[200,409]);
 assert.equal(db.prepare('SELECT state FROM dojo_accounts WHERE user_id=?').get(otherUser).state,JSON.stringify(old));assert.equal(db.prepare('SELECT COUNT(*) AS n FROM training_records WHERE user_id=?').get(otherUser).n,1);
 console.log('PASS: confirmed settings restart, all progress tables cleared atomically, retry preservation, repeat restart, competing resets and other-account isolation.');
 console.log('PASS: week-four choice races, one remembered route, stable immediate reply and stale-choice retry.');
 console.log('PASS: pilot reset races, stale sessions, companion locks, required opening reads, solo start, and other-account isolation.');
 console.log('PASS: authentication and origin guards, invalid body rejection, legacy completion rejection, partial journal preservation, saved locked practice, elapsed-time rejection, two-tab scene CAS, concurrent finalization, one reward event, concurrent rest-to-practice consistency, late-date journal preservation.');
}finally{
 db.exec('BEGIN IMMEDIATE');try{const latest=db.prepare('SELECT revision FROM dojo_accounts WHERE user_id=?').get(user).revision;db.prepare('UPDATE dojo_accounts SET state=?,revision=?,mutation_id=? WHERE user_id=?').run(row.state,latest+1,'qa-restored',user);db.prepare('DELETE FROM dojo_reward_events WHERE user_id=?').run(user);for(const r of previousRewards)db.prepare('INSERT INTO dojo_reward_events(user_id,source_id,awarded_at) VALUES(?,?,?)').run(r.user_id,r.source_id,r.awarded_at);db.prepare('DELETE FROM training_records WHERE user_id=?').run(user);for(const r of previousRecords)db.prepare('INSERT INTO training_records(user_id,date,kind,minutes,day,readiness,note) VALUES(?,?,?,?,?,?,?)').run(r.user_id,r.date,r.kind,r.minutes,r.day,r.readiness,r.note);db.prepare('DELETE FROM training_profiles WHERE user_id=?').run(user);if(previousProfile)db.prepare('INSERT INTO training_profiles(user_id,squat,reach,comfort) VALUES(?,?,?,?)').run(user,previousProfile.squat,previousProfile.reach,previousProfile.comfort);db.prepare('DELETE FROM beginner_week_checks WHERE user_id=?').run(user);for(const c of previousChecks)db.prepare('INSERT INTO beginner_week_checks(user_id,week,goals) VALUES(?,?,?)').run(user,c.week,c.goals);for(const table of ['dojo_accounts','training_records','training_profiles','beginner_week_checks','dojo_reward_events'])db.prepare('DELETE FROM '+table+' WHERE user_id=?').run(otherUser);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}db.close();console.log('Local QA changes restored.');
}
