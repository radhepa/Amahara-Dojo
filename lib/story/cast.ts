import {DOJO_MEMBERS} from "../dojo-members";
export const CAST:Record<string,{name:string;portrait?:string;accent:string;age?:number}>={
 narrator:{name:"",accent:"#d6d8cb"},you:{name:"You",accent:"#e7d5a9"},
 ...Object.fromEntries(DOJO_MEMBERS.map((m,i)=>[m.id,{name:m.name,portrait:m.portrait,accent:m.accent,age:[28,26,25,43,24][i]}])),
 riku:{name:"Riku",portrait:"/story/characters/riku-neutral.webp",accent:"#d1a675",age:24},
 mika:{name:"Mika",portrait:"/story/characters/mika-neutral.webp",accent:"#8acdbb",age:42},
 haru:{name:"Haru",portrait:"/story/characters/haru-neutral.webp",accent:"#df9993",age:27},
 toma:{name:"Toma",portrait:"/story/characters/toma-neutral.webp",accent:"#e6c767",age:14},
 emi:{name:"Emi",portrait:"/story/characters/emi-neutral.webp",accent:"#e1c887",age:20},
 natsume:{name:"Natsume",portrait:"/story/characters/natsume-neutral.webp",accent:"#c8add4",age:46},
 shigure:{name:"Shigure",portrait:"/story/characters/shigure-neutral.webp",accent:"#b4c6cd",age:39},
};
export const LOCATIONS:Record<string,{name:string;image:string}>={hall:{name:"Lantern Hall",image:"/story/backgrounds/hall-worn.webp"},courtyard:{name:"The courtyard",image:"/story/backgrounds/courtyard.webp"},town:{name:"Amahara",image:"/story/backgrounds/town-day.webp"},"town-evening":{name:"Amahara · evening",image:"/story/backgrounds/town-evening.webp"}};
export function hallImage(completed:number,floorRestored=false){return `/story/backgrounds/${completed>=33?"hall-restored":completed>=12||floorRestored?"hall-improved":"hall-worn"}.webp`;}
export function characterPortrait(speaker:string,expression="neutral"){
 const c=CAST[speaker];if(!c?.portrait)return undefined;if(expression==="neutral")return c.portrait;
 const mood=c.portrait.startsWith("/members/")?expression:expression==="soft"?"amused":expression==="angry"?"determined":expression;
 return `/story/characters/${speaker}-${mood}.webp`;
}
