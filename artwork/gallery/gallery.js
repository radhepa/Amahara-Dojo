const moods=['Neutral','Amused','Concerned','Angry','Determined','Soft'];
// Only this explicit, spoiler-reviewed collection is shipped with the gallery.
const characters=[
 {title:'Akari',files:['image-001.webp']},
 {title:'Ren',files:['image-002.webp']},
 {title:'Sora',files:['image-003.webp']},
 {title:'Daichi',files:['image-004.webp']},
 {title:'Yuzu',files:['image-005.webp']},
 {title:'Character study A',files:[6,7,8,9,10,11].map(n=>`image-${String(n).padStart(3,'0')}.webp`)},
 {title:'Character study B',files:[12,13,14,15,16,17].map(n=>`image-${String(n).padStart(3,'0')}.webp`)}
];
const settings=[
 {title:'Morning light',files:['image-018.webp']},
 {title:'By the water',files:['image-019.webp']},
 {title:'Quiet practice',files:['image-020.webp']},
 {title:'The courtyard',files:['image-021.webp']}
];
const viewer=document.getElementById('viewer');
const fullImage=document.getElementById('full-image');
const controls=document.getElementById('pose-controls');
function show(item,pose=0){
 document.getElementById('viewer-title').textContent=item.title;
 fullImage.src=`assets/${item.files[pose]}`;
 fullImage.alt=item.files.length>1?`${item.title}, ${moods[pose].toLowerCase()} pose`:item.title;
 document.getElementById('selection').textContent=fullImage.alt;
 controls.replaceChildren();
 if(item.files.length>1)item.files.forEach((file,i)=>{
  const button=document.createElement('button');button.type='button';button.textContent=moods[i];button.setAttribute('aria-pressed',String(i===pose));
  button.addEventListener('click',()=>{show(item,i);controls.children[i].focus();});controls.append(button);
 });
 if(!viewer.open)viewer.showModal();
}
function card(item,portrait){
 const button=document.createElement('button');button.type='button';button.className='art-button';button.setAttribute('aria-label',`View ${item.title}`);
 const frame=document.createElement('div');frame.className=portrait?'portrait':'landscape';
 const img=document.createElement('img');img.src=`assets/${item.files[0]}`;img.alt=item.title;img.loading='lazy';img.decoding='async';frame.append(img);
 const title=document.createElement('span');title.className='art-title';title.textContent=item.title;button.append(frame,title);
 if(portrait){const meta=document.createElement('span');meta.className='art-meta';meta.textContent=item.files.length>1?'6 poses':'Founding reference';button.append(meta);}
 button.addEventListener('click',()=>show(item));return button;
}
characters.forEach(item=>document.getElementById('characters').append(card(item,true)));
settings.forEach(item=>document.getElementById('settings').append(card(item,false)));
document.getElementById('close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
