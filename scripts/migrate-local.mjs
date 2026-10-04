import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
let built;try{built=JSON.parse(await fs.readFile(path.join(root,'dist/server/wrangler.json'),'utf8'));}catch{throw new Error('Run npm run build before npm run db:local.');}
const databases=(built.d1_databases??[]).map(database=>({...database,migrations_dir:path.join(root,'drizzle')}));
if(databases.length!==1)throw new Error('Expected this project\'s single local D1 binding.');
const runtime=path.join(root,'.sites-runtime');await fs.mkdir(runtime,{recursive:true});
const config=path.join(runtime,'d1-local.json');await fs.writeFile(config,JSON.stringify({name:built.name,compatibility_date:built.compatibility_date,d1_databases:databases},null,2));
const result=spawnSync(process.execPath,['--import',pathToFileURL(path.join(root,'scripts/sites-env.mjs')).href,path.join(root,'node_modules/wrangler/bin/wrangler.js'),'d1','migrations','apply',databases[0].binding,'--local','--config',config,'--persist-to',path.join(root,'.wrangler/state')],{cwd:root,stdio:'inherit',windowsHide:true,env:{...process.env,CI:'true',WRANGLER_SEND_METRICS:'false'}});
if(result.error)throw result.error;process.exit(result.status??1);
