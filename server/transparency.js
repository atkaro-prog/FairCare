// Hospital price transparency index. Since 2024 CMS requires each hospital to publish /cms-hpt.txt at its website root,
// pointing to its machine-readable standard-charge file(s). We index those pointers only; we never parse or interpret prices here.
export const SYSTEMS=[
 {id:'northwell',name:'Northwell Health',domain:'northwell.edu'},
 {id:'stonybrook',name:'Stony Brook Medicine',domain:'stonybrookmedicine.edu'},
 {id:'catholic-health',name:'Catholic Health (Long Island)',domain:'chsli.org'},
 {id:'nyu-langone',name:'NYU Langone Health',domain:'nyulangone.org'},
 {id:'mount-sinai',name:'Mount Sinai Health System',domain:'mountsinai.org'},
 {id:'numc',name:'Nassau University Medical Center',domain:'numc.edu'}
];
const MAX_TXT_BYTES=2_000_000,MAX_HEADS=60;
function safeUrl(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)?u.href:null}catch{return null}}
export function parseCmsHpt(text){
 const entries=[];let current={};
 const flush=()=>{if(current['location-name']||current['mrf-url'])entries.push(current);current={}};
 for(const raw of String(text).replace(/^﻿/,'').split(/\r?\n/)){
  const line=raw.trim();if(!line){flush();continue}
  const i=line.indexOf(':');if(i<1)continue;
  const key=line.slice(0,i).trim().toLowerCase(),value=line.slice(i+1).trim();
  if(key==='location-name'&&current['location-name'])flush();
  current[key]=value;
 }
 flush();
 return entries.map(e=>({locationName:e['location-name']||'Unnamed location',sourcePageUrl:safeUrl(e['source-page-url']),mrfUrl:safeUrl(e['mrf-url']),contactName:e['contact-name']||'',contactEmail:/^[^\s@]+@[^\s@]+$/.test(e['contact-email']||'')?e['contact-email']:''})).filter(e=>e.mrfUrl);
}
async function fetchTxt(domain,fetcher){
 let lastError='not reachable';
 for(const host of['www.'+domain,domain]){
  const url=`https://${host}/cms-hpt.txt`;
  try{
   const response=await fetcher(url,{headers:{accept:'text/plain'},redirect:'follow',signal:AbortSignal.timeout(10000)});
   if(response.status===404){lastError='cms-hpt.txt not found';continue}
   if(!response.ok){lastError='HTTP '+response.status;continue}
   const text=await response.text();if(text.length>MAX_TXT_BYTES){lastError='cms-hpt.txt too large';continue}
   return {url:response.url||url,text};
  }catch{lastError='not reachable'}
 }
 throw Error(lastError);
}
async function fileDetails(mrfUrl,fetcher){
 try{const r=await fetcher(mrfUrl,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(8000)});if(!r.ok)return {};const size=Number(r.headers.get('content-length'));return {lastModified:r.headers.get('last-modified')||null,sizeBytes:Number.isFinite(size)&&size>0?size:null}}
 catch{return {}}
}
export async function indexSystem(system,fetcher=fetch){
 const checkedAt=new Date().toISOString();
 try{
  const {url,text}=await fetchTxt(system.domain,fetcher),locations=parseCmsHpt(text);
  if(!locations.length)return {...system,status:'empty',error:'cms-hpt.txt lists no valid machine-readable file URLs',txtUrl:url,checkedAt,locations:[]};
  const details=await Promise.all(locations.slice(0,MAX_HEADS).map(l=>fileDetails(l.mrfUrl,fetcher)));
  return {...system,status:'ok',txtUrl:url,checkedAt,locations:locations.map((l,i)=>({...l,...(details[i]||{})}))};
 }catch(e){return {...system,status:'unavailable',error:e.message,checkedAt,locations:[]}}
}
export async function buildIndex(fetcher=fetch,systems=SYSTEMS){
 return {systems:await Promise.all(systems.map(s=>indexSystem(s,fetcher))),retrievedAt:new Date().toISOString(),source:'Hospital-published cms-hpt.txt files (45 CFR Part 180)',note:'These files list hospital-published standard charges, which may include gross, cash and payer-negotiated rates. They are not a personalized out-of-pocket estimate and do not prove whether a facility fee will be charged.'};
}
