import test from 'node:test';import assert from 'node:assert/strict';import{validateQuery,normalizeResults,lookupNppes}from './lookup.js';
test('rejects invalid input',()=>{assert.ok(validateQuery({name:'X',zip:'11782'}).error);assert.ok(validateQuery({name:'Clinic',zip:'10001'}).error);assert.equal(validateQuery({name:'Clinic',zip:'11782'}).zip,'11782')});
test('NPI never implies verified fees',()=>{const r=normalizeResults([{number:1234567890,basic:{organization_name:'Example'},addresses:[{state:'NY',postal_code:'11782'}]}],'11782');assert.equal(r[0].feeStatus,'unknown')});
test('rejects other ZIPs',()=>assert.equal(normalizeResults([{number:1234567890,addresses:[{state:'NY',postal_code:'10001'}]}],'11782').length,0));
test('deduplicates results',async()=>{const mock=async()=>({ok:true,json:async()=>({results:[{number:1234567890,addresses:[{state:'NY',postal_code:'11782'}]}]})});assert.equal((await lookupNppes({name:'Example',zip:'11782'},mock)).length,1)});
