const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const base=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/story-run.json'),'utf8')).s.save;
 const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const detail=e.stack||e.message;if(!detail.includes('widget.sndcdn.com'))errors.push(detail)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),['sentience-gameplay-v4-save-20260926',base]);
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.manual();__qa.start('story')});
 let s=await page.evaluate(()=>__qa.snapshot());assert.equal(s.scene,'arc-roofs');assert.equal(s.phase,'dialogue');
 await page.screenshot({path:path.join(__dirname,'../qa/ch2-opening.png')});
 for(let i=0;i<30&&s.phase==='dialogue';i++){await page.evaluate(()=>__qa.advance());s=await page.evaluate(()=>__qa.snapshot());}
 assert.equal(s.phase,'explore');assert.equal(s.save.chapter,2);assert(s.generated>15,'Chapter 2 has authored terrain');
 await page.evaluate(()=>__qa.step([],0));await page.screenshot({path:path.join(__dirname,'../qa/ch2-roofs.png')});
 await browser.close();assert.deepEqual(errors,[]);console.log(JSON.stringify({phase:s.phase,scene:s.scene,patterns:s.generated,checkpoint:s.save.checkpoint.m,errors}));
})().catch(e=>{console.error(e);process.exit(1)});
