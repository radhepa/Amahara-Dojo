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
 'artwork/source/backgrounds/courtyard.png'];
const dest=path.join(root,'artwork/gallery/assets');await fs.mkdir(dest,{recursive:true});
for(let i=0;i<approved.length;i++)await sharp(path.join(root,approved[i])).webp({quality:92,effort:6}).toFile(path.join(dest,`image-${String(i+1).padStart(3,'0')}.webp`));
await fs.copyFile(path.join(root,'public/fonts/ShipporiMinchoB1-700-latin.woff2'),path.join(dest,'display.woff2'));
await fs.copyFile(path.join(root,'public/fonts/ZenKakuGothicNew-400-latin.woff2'),path.join(dest,'interface.woff2'));
await fs.copyFile(path.join(root,'public/fonts/ShipporiMinchoB1-OFL.txt'),path.join(dest,'display-license.txt'));
await fs.copyFile(path.join(root,'public/fonts/ZenKakuGothicNew-OFL.txt'),path.join(dest,'interface-license.txt'));
console.log(`Prepared ${approved.length} spoiler-reviewed gallery images with neutral filenames.`);
