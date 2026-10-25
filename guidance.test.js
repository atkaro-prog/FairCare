import test from 'node:test';import assert from 'node:assert/strict';import{COVERAGE,guidanceFor,scriptAsk}from'./guidance.js';
test('every coverage option has guidance with steps',()=>{for(const c of COVERAGE){const g=guidanceFor(c.value);assert.ok(g.title&&g.lead);assert.ok(g.steps.length>=2)}});
test('unknown coverage falls back to the general guide',()=>assert.equal(guidanceFor('bogus'),guidanceFor('unsure')));
test('all links are https on official or named sources',()=>{for(const c of COVERAGE)for(const s of guidanceFor(c.value).steps)if(s.link)assert.match(s.link.url,/^https:\/\/www\.(cms\.gov|medicare\.gov|fairhealthconsumer\.org)\//)});
test('self-pay guidance names the Good Faith Estimate and dispute threshold',()=>{const text=guidanceFor('self').steps.map(s=>s.text).join(' ');assert.match(guidanceFor('self').title,/Good Faith Estimate/);assert.match(text,/\$400/);assert.match(text,/120 days/)});
test('call script asks the right final question for each coverage',()=>{assert.match(scriptAsk('self'),/Good Faith Estimate/);assert.match(scriptAsk('medicaid'),/Medicaid/);assert.match(scriptAsk('private'),/in-network/)});
test('no guide promises a guaranteed price',()=>{for(const c of COVERAGE){const g=guidanceFor(c.value);assert.doesNotMatch(JSON.stringify(g),/guarantee/i)}});
