import './typescript-loader.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const {ALL_SCENES}=await import('../lib/story/index.ts');
const {CAST,LOCATIONS,characterPortrait,hallImage}=await import('../lib/story/cast.ts');
const founders=['akari','ren','sora','daichi','yuzu'],support=['haru','mika','emi','riku','natsume','toma','shigure'];
const images=new Set(Object.values(CAST).map(c=>c.portrait).filter(Boolean));
for(const id of founders)for(const mood of ['amused','concerned','angry','determined','soft'])images.add(characterPortrait(id,mood));
for(const id of support)for(const mood of ['amused','concerned','determined'])images.add(characterPortrait(id,mood));
for(const location of Object.values(LOCATIONS))images.add(location.image);
for(const count of [0,12,48])images.add(hallImage(count));
for(const scene of ALL_SCENES){
 if(scene.illustration)images.add(scene.illustration);
 for(const line of [...scene.lines,...(scene.choice?.options.flatMap(o=>o.reply)??[])]){
  assert(CAST[line.speaker],'Unknown speaker '+line.speaker);
  const image=characterPortrait(line.speaker,line.expression);if(image)images.add(image);
 }
}
for(const image of images){
 const file=path.join(root,'public',image);await fs.access(file);const info=await sharp(file).metadata();assert(info.width&&info.height,'Invalid image '+image);
 if(image.includes('/characters/')||image.startsWith('/members/'))assert(info.hasAlpha,'Missing portrait alpha '+image);
}
for(const [directory,count] of [['characters',58],['backgrounds',9]]){
 const dir=path.join(root,'artwork/source',directory),files=(await fs.readdir(dir)).filter(file=>file.endsWith('.png'));assert.equal(files.length,count);
 for(const file of files){const info=await sharp(path.join(dir,file)).metadata();assert(info.width&&info.height);if(directory==='characters')assert(info.hasAlpha);}
}
assert.equal(images.size,67);assert.equal(ALL_SCENES.filter(s=>s.illustration).length,3);
console.log('Passed: 67 delivery references, 67 source images, portrait alpha, whole-pose sets, and 3 event illustrations.');
