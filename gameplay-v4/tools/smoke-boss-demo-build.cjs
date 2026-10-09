const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

(async()=>{
 const key='sentience-gameplay-v4-save-20260926';
 const original=fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8');
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}});
 const errors=[];page.on('pageerror',e=>{if(!(e.stack||e.message).includes('widget.sndcdn.com'))errors.push(e.message)});
 await page.addInitScript(([k,raw])=>localStorage.setItem(k,raw),[key,original]);
 await page.goto('http://127.0.0.1:4181/build/?boss-demo=1');
 await page.locator('#dialogue').waitFor({state:'visible'});
 assert.equal(await page.evaluate(()=>typeof window.__qa),'undefined');
 assert.equal(await page.locator('#speaker').textContent(),'Fu Hua');
 for(let i=0;i<12&&await page.locator('#dialogue').isVisible();i++)await page.locator('#next-dialogue').click();
 await page.locator('#dialogue').waitFor({state:'hidden'});
 await page.waitForFunction(()=>document.querySelector('#objective').textContent.includes('MẠNG 1/2'));
 await page.screenshot({path:path.join(__dirname,'../qa/build-boss-demo.png')});
 assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),original);
 await page.keyboard.press('Escape');await page.locator('#return-home').click();
 assert(await page.locator('#home').isVisible());
 assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),original);
 assert.deepEqual(errors,[]);await browser.close();
 console.log('Production boss demo PASS: direct URL, live Chariot, save preserved, no QA hook');
})().catch(e=>{console.error(e);process.exit(1)});
