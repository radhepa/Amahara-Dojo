import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=fileURLToPath(new URL('../',import.meta.url));
const plan=JSON.parse(await fs.readFile(path.join(root,'docs/saga/chapter-02-art-plan.json'),'utf8'));
assert.equal(plan.assets.length,18);
const portraitHashes=new Set();
for(const asset of plan.assets){
 const source=path.join(root,'artwork/source/chapter-02',asset.kind,asset.file);
 const info=await sharp(source).metadata();assert(info.width&&info.height,'Invalid source');
 if(asset.kind==='characters'){
  assert.equal(info.width,1024);assert.equal(info.height,1536);assert(info.hasAlpha,'Portrait needs genuine alpha');
  const {data,info:raw}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let transparent=0,visible=0;
  for(let i=3;i<data.length;i+=4){if(data[i]===0)transparent++;if(data[i]>230)visible++;}
  assert(transparent/(raw.width*raw.height)>.15,'Portrait background must be transparent');
  assert(visible/(raw.width*raw.height)>.15,'Figure must remain visible');
  const hash=createHash('sha256').update(await fs.readFile(source)).digest('hex');assert(!portraitHashes.has(hash),'Pose must be its own image');portraitHashes.add(hash);
 }else{
  assert(info.width/info.height>1.65&&info.width/info.height<1.9,'Scene must be landscape');
  if(info.hasAlpha){const stats=await sharp(source).stats();assert.equal(stats.channels.at(-1).min,255,'Scene must be opaque');}
 }
 // Unreleased chapter artwork must never be reachable through the app's public assets.
 for(const publicDir of ['characters','backgrounds','events'])await assert.rejects(fs.access(path.join(root,'public/story',publicDir,asset.file.replace('.png','.webp'))));
}
const gallery=path.join(root,'artwork/gallery');
const files=await fs.readdir(path.join(gallery,'assets'));
const images=files.filter(f=>f.endsWith('.webp'));assert.equal(images.length,74);
assert(images.every(f=>/^image-\d{3}\.webp$/.test(f)),'Gallery paths must be neutral');
for(let i=1;i<=74;i++)assert(images.includes(`image-${String(i).padStart(3,'0')}.webp`));
for(const file of images){const meta=await sharp(path.join(gallery,'assets',file)).metadata();assert(!meta.exif&&!meta.xmp&&!meta.iptc,'Gallery metadata must not expose source information');}
const html=await fs.readFile(path.join(gallery,'index.html'),'utf8');
const js=await fs.readFile(path.join(gallery,'gallery.js'),'utf8');
const css=await fs.readFile(path.join(gallery,'gallery.css'),'utf8');
for(const forbidden of ['avel','jalen','natsume','raking','gate-rain','cohort-count','chapter-02','saga/','specifications.json'])assert(![html,js,css,files.join(' ')].some(s=>s.toLowerCase().includes(forbidden)),'Unreleased identity or story detail in gallery');
for(const name of ['emi','haru','mika','riku','shigure','toma'])assert(![html,js,css,files.join(' ')].some(s=>new RegExp(`\\b${name}\\b`,'i').test(s)),'Only founders may be named');
const specifications=JSON.parse(await fs.readFile(path.join(root,'artwork/specifications.json'),'utf8'));
const set=specifications.sets.find(s=>s.set==='Chapter 2 production');assert(set);assert.equal(set.assets.length,18);
for(const asset of set.assets){assert(asset.prompt);await fs.access(path.join(root,asset.source));}
console.log('Passed: 18 chapter sources, 12 distinct transparent portraits, 6 opaque landscapes, 74 safe gallery images, and founder-only names.');
