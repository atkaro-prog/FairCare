import express from 'express';
import {existsSync} from 'node:fs';import {resolve} from 'node:path';
import {lookupNppes,validateQuery} from './lookup.js';
export function createApp({lookup=lookupNppes,dist=resolve('dist'),perMinute=30}={}){
 const app=express();app.disable('x-powered-by');
 // Replit and similar hosts sit behind one reverse proxy; without this every visitor shares the proxy's IP and rate limit.
 app.set('trust proxy',1);
 app.use((_req,res,next)=>{res.set('X-Content-Type-Options','nosniff');res.set('Referrer-Policy','no-referrer');res.set('X-Frame-Options','DENY');next()});
 const cache=new Map(),limits=new Map();
 app.get('/api/health',(_req,res)=>res.json({status:'ok',dataSource:'NPPES',livePrices:false}));
 app.get('/api/providers',async(req,res)=>{
  const now=Date.now(),ip=req.ip||'unknown',history=(limits.get(ip)||[]).filter(t=>now-t<60000);
  if(history.length>=perMinute)return res.status(429).json({error:'Too many requests. Please try again in a minute.'});
  history.push(now);if(limits.size>5000)limits.clear();limits.set(ip,history);
  const query=validateQuery(req.query);if(query.error)return res.status(400).json({error:query.error});
  const key=JSON.stringify(query),cached=cache.get(key);
  if(cached&&now-cached.at<1800000)return res.json({...cached.payload,cached:true});
  try{const results=await lookup(query);const payload={results,source:'NPPES NPI Registry',retrievedAt:new Date().toISOString(),note:'NPI identity data does not establish hospital ownership, facility-fee billing, insurance network participation, or patient price.'};if(cache.size>300)cache.clear();cache.set(key,{at:now,payload});res.json(payload)}
  catch{res.status(502).json({error:'The federal NPI Registry is temporarily unavailable. Please try again later.'})}
 });
 app.use('/api',(_req,res)=>res.status(404).json({error:'Not found'}));
 if(existsSync(dist)){app.use(express.static(dist,{index:false}));app.get('*',(_req,res)=>res.sendFile(resolve(dist,'index.html')))}
 return app;
}
