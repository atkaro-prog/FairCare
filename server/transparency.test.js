import test from 'node:test';import assert from 'node:assert/strict';import{parseCmsHpt,indexSystem,buildIndex}from './transparency.js';import{createApp}from './app.js';
const sample=`location-name: Example Hospital
source-page-url: https://www.example.org/price-transparency
mrf-url: https://www.example.org/files/123456789_example-hospital_standardcharges.json
contact-name: Jane Doe
contact-email: prices@example.org

location-name: Example Hospital East
source-page-url: https://www.example.org/price-transparency
mrf-url: https://cdn.example.org/987654321_example-east_standardcharges.csv
contact-name: Jane Doe
contact-email: prices@example.org
`;
function mockFetch(routes){return async(url,opts={})=>{const r=routes(url,opts);if(r instanceof Error)throw r;return {ok:r.status<400,status:r.status,url,text:async()=>r.body||'',headers:new Headers(r.headers||{})}}}
test('parses CMS cms-hpt.txt blocks',()=>{const r=parseCmsHpt(sample);assert.equal(r.length,2);assert.equal(r[1].locationName,'Example Hospital East');assert.match(r[1].mrfUrl,/\.csv$/);assert.equal(r[0].contactEmail,'prices@example.org')});
test('parses CRLF, BOM and blocks without blank separators',()=>{const r=parseCmsHpt('﻿location-name: A\r\nmrf-url: https://a.org/a.json\r\nlocation-name: B\r\nmrf-url: https://b.org/b.json\r\n');assert.deepEqual(r.map(x=>x.locationName),['A','B'])});
test('drops unsafe or missing file URLs',()=>{const r=parseCmsHpt('location-name: Bad\nmrf-url: javascript:alert(1)\n\nlocation-name: None\n\nlocation-name: Ok\nmrf-url: https://ok.org/f.json\nsource-page-url: javascript:alert(1)');assert.equal(r.length,1);assert.equal(r[0].sourcePageUrl,null)});
test('indexes a system and records file metadata',async()=>{const f=mockFetch((url,o)=>o.method==='HEAD'?{status:200,headers:{'last-modified':'Wed, 01 Jan 2025 00:00:00 GMT','content-length':'2048'}}:{status:200,body:sample});const r=await indexSystem({id:'x',name:'X',domain:'example.org'},f);assert.equal(r.status,'ok');assert.equal(r.txtUrl,'https://www.example.org/cms-hpt.txt');assert.equal(r.locations[0].sizeBytes,2048);assert.ok(r.checkedAt)});
test('falls back from www host to the bare domain',async()=>{const f=mockFetch(url=>url.startsWith('https://www.')?{status:404}:{status:200,body:sample});const r=await indexSystem({id:'x',name:'X',domain:'example.org'},f);assert.equal(r.status,'ok');assert.equal(r.txtUrl,'https://example.org/cms-hpt.txt')});
test('reports a missing file honestly',async()=>{const r=await indexSystem({id:'x',name:'X',domain:'example.org'},mockFetch(()=>({status:404})));assert.equal(r.status,'unavailable');assert.equal(r.error,'cms-hpt.txt not found');assert.equal(r.locations.length,0)});
test('one unreachable system does not hide the others',async()=>{const f=mockFetch(url=>url.includes('down.org')?Error('offline'):{status:200,body:sample});const r=await buildIndex(f,[{id:'a',name:'A',domain:'up.org'},{id:'b',name:'B',domain:'down.org'}]);assert.deepEqual(r.systems.map(s=>s.status),['ok','unavailable']);assert.match(r.note,/not a personalized/)});
test('price file endpoint shares one refresh across requests',async()=>{let calls=0;const server=createApp({dist:'/nonexistent',priceIndex:async()=>{calls++;return {systems:[{status:'ok',locations:[]}]}}}).listen(0);await new Promise(r=>server.once('listening',r));try{const url='http://127.0.0.1:'+server.address().port+'/api/hospital-price-files';await Promise.all([fetch(url),fetch(url)]);const third=await(await fetch(url)).json();assert.equal(calls,1);assert.equal(third.cached,true)}finally{server.close()}});
