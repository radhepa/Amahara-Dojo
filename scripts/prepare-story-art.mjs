import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const root=fileURLToPath(new URL('../',import.meta.url));
const founders=new Set(['akari-neutral.png','ren-neutral.png','sora-neutral.png','daichi-neutral.png','yuzu-neutral.png']);
let total=0;
for(const directory of ['characters','backgrounds']){
 const source=path.join(root,'artwork/source',directory),destination=path.join(root,'public/story',directory);await fs.mkdir(destination,{recursive:true});
 for(const file of await fs.readdir(source)){
  if(!file.endsWith('.png')||(directory==='characters'&&founders.has(file)))continue;
  const input=path.join(source,file),output=path.join(destination,file.replace(/\.png$/,'.webp'));
  const [a,b]=await Promise.all([fs.stat(input),fs.stat(output).catch(()=>null)]);
  if(!b||b.mtimeMs<a.mtimeMs)await sharp(input).webp({quality:92,effort:6}).toFile(output);
  const [original,encoded]=await Promise.all([sharp(input).metadata(),sharp(output).metadata()]);
  if(original.width!==encoded.width||original.height!==encoded.height||original.hasAlpha!==encoded.hasAlpha)throw new Error('Image encoding changed dimensions or alpha: '+file);
  total++;
 }
}
console.log(`Prepared ${total} delivery images; source PNGs preserved.`);
