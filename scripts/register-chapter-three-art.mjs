import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root=fileURLToPath(new URL('../',import.meta.url));
const plan=JSON.parse(await fs.readFile(path.join(root,'docs/saga/chapter-03-art-plan.json'),'utf8'));
const specificationPath=path.join(root,'artwork/specifications.json');
const specifications=JSON.parse(await fs.readFile(specificationPath,'utf8'));
const assets=[];
for(const asset of plan.assets){
 const source=`artwork/source/chapter-03/${asset.kind}/${asset.file}`;
 const fullPath=path.join(root,source);
 const metadata=await sharp(fullPath).metadata();
 assets.push({key:asset.key,file:asset.file,source,kind:asset.kind,prompt:asset.prompt,references:asset.referenced_image_paths.map(p=>path.relative(root,p).split(path.sep).join('/')),...(asset.initialPrompt?{initialPrompt:asset.initialPrompt,initialReferences:asset.initialReferences.map(p=>path.relative(root,p).split(path.sep).join('/'))}:{}),transparent_background:asset.transparent_background,gallerySafe:asset.gallerySafe,width:metadata.width,height:metadata.height,hasAlpha:metadata.hasAlpha,sha256:createHash('sha256').update(await fs.readFile(fullPath)).digest('hex'),tool:'built-in imagegen'});
}
const set={set:'Chapter 3 production',canonRevision:3,status:'Staged contributor sources; chapter remains closed until story integration.',assets};
const index=specifications.sets.findIndex(s=>s.set===set.set);
if(index<0)specifications.sets.push(set);else specifications.sets[index]=set;
await fs.writeFile(specificationPath,JSON.stringify(specifications,null,2)+'\n');
console.log(`Registered ${assets.length} generated sources with complete prompts, reference locks and checksums.`);
