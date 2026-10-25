export const ALLOWED_ZIP_PREFIXES = new Set(['110','115','117','118','119']);
export function validateQuery(raw) {
 const name=String(raw.name??'').trim().replace(/\s+/g,' '),zip=String(raw.zip??'').trim();
 if(name.length<2||name.length>100)return {error:'Enter a provider or organization name (2–100 characters).'};
 if(!/^\d{5}$/.test(zip)||!ALLOWED_ZIP_PREFIXES.has(zip.slice(0,3)))return {error:'Enter a Nassau or Suffolk area ZIP (110xx, 115xx, 117xx, 118xx, or 119xx).'};
 return {name,zip};
}
function location(r){return r.addresses?.find(a=>a.address_purpose==='LOCATION')??r.addresses?.[0]??{}}
export function normalizeResults(results=[],zip=''){
 return results.filter(r=>{const a=location(r);return a.state==='NY'&&String(a.postal_code??'').slice(0,5)===zip}).map(r=>{
 const a=location(r),b=r.basic??{};
 return {npi:String(r.number??''),name:b.organization_name||[b.first_name,b.last_name].filter(Boolean).join(' ')||'Unnamed provider',type:r.enumeration_type==='NPI-2'?'Organization':'Individual',address:[a.address_1,a.address_2,a.city,a.state,String(a.postal_code??'').slice(0,5)].filter(Boolean).join(', '),taxonomy:r.taxonomies?.find(t=>t.primary)?.desc??r.taxonomies?.[0]?.desc??'Not specified',source:'NPPES NPI Registry',sourceUrl:'https://npiregistry.cms.hhs.gov/provider-view/'+r.number,feeStatus:'unknown'};
 }).filter(r=>/^\d{10}$/.test(r.npi));
}
export async function lookupNppes({name,zip},fetcher=fetch){
 const base=new URLSearchParams({version:'2.1',limit:'50',postal_code:zip,state:'NY'});
 const q1=new URLSearchParams(base),q2=new URLSearchParams(base);
 q1.set('organization_name',name+'*');q2.set('last_name',name.split(' ').at(-1)+'*');
 const responses=await Promise.all([q1,q2].map(async q=>{const response=await fetcher('https://npiregistry.cms.hhs.gov/api/?'+q,{headers:{accept:'application/json'},signal:AbortSignal.timeout(9000)});if(!response.ok)throw Error('Upstream failed');return response.json()}));
 const map=new Map();for(const r of responses.flatMap(x=>x.results??[]))map.set(String(r.number),r);
 return normalizeResults([...map.values()],zip).slice(0,50);
}