import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {spawn} from 'node:child_process';
import vm from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const plan=JSON.parse(await fs.readFile(path.join(root,'docs/saga/chapter-03-art-plan.json'),'utf8'));
assert.equal(plan.assets.length,21);
assert.equal(plan.assets.filter(a=>a.kind==='characters').length,12);
assert.equal(plan.assets.filter(a=>a.kind==='backgrounds').length,3);
assert.equal(plan.assets.filter(a=>a.kind==='events').length,6);
const specifications=JSON.parse(await fs.readFile(path.join(root,'artwork/specifications.json'),'utf8'));
const set=specifications.sets.find(s=>s.set==='Chapter 3 production');
assert.equal(set?.assets.length,21);
const hashes=new Set();
for(const asset of plan.assets){
 const source=`artwork/source/chapter-03/${asset.kind}/${asset.file}`;
 const file=path.join(root,source),info=await sharp(file).metadata();
 const hash=createHash('sha256').update(await fs.readFile(file)).digest('hex');
 assert(!hashes.has(hash),'Each requested asset must be a distinct generated image');hashes.add(hash);
 const record=set.assets.find(a=>a.key===asset.key);
 assert.equal(record?.sha256,hash);assert.equal(record?.prompt,asset.prompt);
 assert.equal(record?.source,source);assert.equal(record?.gallerySafe,asset.gallerySafe);
 for(const reference of record.references)await fs.access(path.join(root,reference));
 if(asset.kind==='characters'){
  assert.equal(info.width,1024);assert.equal(info.height,1536);assert(info.hasAlpha);
  const {data,info:raw}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let clear=0,solid=0;
  for(let i=3;i<data.length;i+=4){if(data[i]===0)clear++;if(data[i]>230)solid++;}
  assert(clear/(raw.width*raw.height)>.15,'Portrait must have a genuinely transparent background');
  assert(solid/(raw.width*raw.height)>.15,'Portrait figure must remain visible');
 }else{
  assert(info.width/info.height>1.65&&info.width/info.height<1.9,'Scene must be wide landscape');
  if(info.hasAlpha)assert.equal((await sharp(file).stats()).channels.at(-1).min,255);
 }
 for(const dir of ['characters','backgrounds','events'])for(const ext of ['png','webp'])await assert.rejects(fs.access(path.join(root,'public/story',dir,asset.file.replace('.png',`.${ext}`))));
}
const gallery=path.join(root,'artwork/gallery'),files=await fs.readdir(path.join(gallery,'assets'));
const images=files.filter(f=>f.endsWith('.webp'));assert.equal(images.length,90);
assert(images.every(f=>/^image-\d{3}\.webp$/.test(f)));
for(const file of images){const metadata=await sharp(path.join(gallery,'assets',file)).metadata();assert(!metadata.exif&&!metadata.xmp&&!metadata.iptc);}
const js=await fs.readFile(path.join(gallery,'gallery.js'),'utf8');
const ownerText=(await Promise.all(['index.html','gallery.js','gallery.css','README.md'].map(file=>fs.readFile(path.join(gallery,file),'utf8')))).join('\n');
for(const forbidden of ['seiran','academy-junior','whiteash','witness-family','witness-residents','ren-stop-drill','locked-beat','scarf-basin','saga/','specifications.json'])assert(!ownerText.toLowerCase().includes(forbidden),'Private character or scene detail must not leak through gallery text');
const collection=vm.runInNewContext(js.slice(0,js.indexOf('const viewer='))+'\n({characters,settings})');
const shown=[...collection.characters,...collection.settings].flatMap(item=>Array.from(item.files));
assert.equal(new Set(shown).size,90);assert(images.every(file=>shown.includes(file)),'Every reviewed image must be reachable in the gallery');
assert.deepEqual(Array.from(collection.characters.find(c=>c.title==='Character study K').files),[81,86,87,88,89,90].map(n=>`image-${String(n).padStart(3,'0')}.webp`));
const safe=plan.assets.filter(a=>a.gallerySafe);assert.equal(safe.length,16);
for(let i=0;i<safe.length;i++){
 const asset=safe[i],original=path.join(root,'artwork/source/chapter-03',asset.kind,asset.file);
 const encoded=path.join(gallery,'assets',`image-${String(75+i).padStart(3,'0')}.webp`);
 const expected=await sharp(original).webp({quality:92,effort:6}).toBuffer();
 assert.equal(createHash('sha256').update(await fs.readFile(encoded)).digest('hex'),createHash('sha256').update(expected).digest('hex'),'Gallery asset must match the reviewed source at its neutral number');
}
const server=spawn(process.execPath,[path.join(root,'scripts/serve-art-gallery.mjs')],{cwd:root,env:{...process.env,DOJO_GALLERY_PORT:'0'},stdio:['ignore','pipe','pipe'],windowsHide:true});
try{
 const port=await new Promise((resolve,reject)=>{
  let output='';const timer=setTimeout(()=>reject(new Error('Gallery server did not start')),10000);
  server.once('error',error=>{clearTimeout(timer);reject(error);});
  server.stdout.on('data',data=>{output+=data;const match=output.match(/http:\/\/127\.0\.0\.1:(\d+)/);if(match){clearTimeout(timer);resolve(Number(match[1]));}});
  server.once('exit',code=>{clearTimeout(timer);reject(new Error(`Gallery server exited with ${code}`));});
 });
 const origin=`http://127.0.0.1:${port}`;
 for(const route of ['/','/gallery.js','/assets/image-090.webp']){
  const response=await fetch(origin+route,{signal:AbortSignal.timeout(5000)});assert.equal(response.status,200);
  assert(response.headers.get('content-security-policy').includes("connect-src 'none'"));await response.arrayBuffer();
 }
 for(const route of ['/docs/saga/chapter-03.md','/artwork/specifications.json','/artwork/source/chapter-03/events/witness-family.png','/assets/../../docs/saga/chapter-03.md','/%2e%2e%5csource%5cchapter-03%5cevents%5cwitness-family.png']){
  const response=await fetch(origin+route,{signal:AbortSignal.timeout(5000)});assert.equal(response.status,404,'Contributor sources must not be served');await response.arrayBuffer();
 }
}finally{server.kill();}
console.log('Passed: complete 21-image production set, both six-pose sets, transparent portraits, opaque scenes, provenance, neutral gallery exports and server isolation.');
