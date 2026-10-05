export type Expression = "neutral" | "amused" | "concerned" | "angry" | "determined" | "soft";
export type StoryLine = {speaker:string;text:string;expression?:Expression;when?:{flag:string;value:string};id?:string;location?:string;heading?:string;illustration?:string;introduces?:string;decision?:StoryChoice;performance?:{speaker:string;expression:Expression}};
export type StoryOption = {id:string;label:string;reply:StoryLine[];memory?:string};
export type StoryChoice = {flag:string;prompt:string;options:StoryOption[]};
export type StoryScene = {id:string;title:string;episode:number;beat:number;location:string;illustration?:string;lines:StoryLine[];choice?:StoryChoice;member?:string;threshold?:number;practiceGate?:number;revision?:string;readingMinutes?:string;optional?:boolean;kind:"main"|"personal"|"relationship"|"quest"|"prologue"|"opening"};
export function lines(script:string):StoryLine[]{return script.trim().split(/\n\s*\n/).map(p=>{const split=p.indexOf("|");return split<0?{speaker:"narrator",text:p.trim()}:{speaker:p.slice(0,split).trim(),text:p.slice(split+1).trim()};});}
export function scene(episode:number,beat:number,title:string,location:string,script:string,choice?:StoryChoice):StoryScene{return {id:`c1-e${episode}-b${beat}`,episode,beat,title,location,lines:lines(script),choice,kind:"main"};}
export function reply(speaker:string,text:string,expression:Expression="neutral"):StoryLine[]{return [{speaker,text,expression}];}
