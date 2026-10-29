// Explicit allowlist: never copy a directory of unreleased story art into a preview.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const root=fileURLToPath(new URL('../',import.meta.url));
const moods=['neutral','amused','concerned','angry','determined','soft'];
const approved=[...['akari','ren','sora','daichi','yuzu'].map(id=>`artwork/source/characters/${id}-neutral.png`),...['avel','jalen'].flatMap(id=>moods.map(m=>`artwork/source/chapter-02/characters/${id}-${m}.png`)),
 'artwork/source/chapter-02/backgrounds/hall-dawn-lantern.png',
 'artwork/source/chapter-02/backgrounds/river-market.png',
 'artwork/source/chapter-02/events/dawn-count.png',
 'artwork/source/backgrounds/courtyard.png',
 ...['emi','haru','mika','natsume','riku','shigure','toma'].flatMap(id=>['neutral','amused','concerned','determined'].map(mood=>`artwork/source/characters/${id}-${mood}.png`)),
 ...['akari','ren','sora','daichi','yuzu'].flatMap(id=>['amused','concerned','angry','determined','soft'].map(mood=>`artwork/source/characters/${id}-${mood}.png`)),
 ...moods.map(mood=>`artwork/source/chapter-03/characters/seiran-${mood}.png`),
 'artwork/source/chapter-03/characters/academy-junior-neutral.png',
 'artwork/source/chapter-03/backgrounds/whiteash-courtyard.png',
 'artwork/source/chapter-03/backgrounds/whiteash-dorm.png',
 'artwork/source/chapter-03/backgrounds/whiteash-forum.png',
 'artwork/source/chapter-03/events/academy-dawn-count.png',
 ...['amused','concerned','angry','determined','soft'].map(mood=>`artwork/source/chapter-03/characters/academy-junior-${mood}.png`)];
const dest=path.join(root,'artwork/gallery/assets');await fs.mkdir(dest,{recursive:true});
for(let i=0;i<approved.length;i++){
 const input=path.join(root,approved[i]),output=path.join(dest,`image-${String(i+1).padStart(3,'0')}.webp`);
 const [source,encoded]=await Promise.all([fs.stat(input),fs.stat(output).catch(()=>null)]);
 if(!encoded||encoded.mtimeMs<source.mtimeMs){
  const released=approved[i].startsWith('artwork/source/characters/')?path.join(root,'public/story/characters',path.basename(input,'.png')+'.webp'):null;
  const delivery=released?await fs.stat(released).catch(()=>null):null;
  if(delivery&&delivery.mtimeMs>=source.mtimeMs){
   const [original,ready]=await Promise.all([sharp(input).metadata(),sharp(released).metadata()]);
   if(original.width!==ready.width||original.height!==ready.height||original.hasAlpha!==ready.hasAlpha)throw new Error('Released portrait differs from its source');
   await fs.copyFile(released,output);
  }else await sharp(input).webp({quality:92,effort:6}).toFile(output);
 }
}
await fs.copyFile(path.join(root,'public/fonts/ShipporiMinchoB1-700-latin.woff2'),path.join(dest,'display.woff2'));
await fs.copyFile(path.join(root,'public/fonts/ZenKakuGothicNew-400-latin.woff2'),path.join(dest,'interface.woff2'));
await fs.copyFile(path.join(root,'public/fonts/ShipporiMinchoB1-OFL.txt'),path.join(dest,'display-license.txt'));
await fs.copyFile(path.join(root,'public/fonts/ZenKakuGothicNew-OFL.txt'),path.join(dest,'interface-license.txt'));
console.log(`Prepared ${approved.length} spoiler-reviewed gallery images with neutral filenames.`);
