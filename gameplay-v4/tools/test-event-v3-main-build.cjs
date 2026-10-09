const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
 const base=(process.env.HOS_BASE_URL||'http://127.0.0.1:4192/build-assets-v4').replace(/\/$/,'');
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1536,height:1040}});
 const errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:'))missing.push(`${r.status()} ${r.url()}`)});

 await page.goto(base+'/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready);
 assert.equal(await page.locator('#event-mode').getAttribute('href'),'event-v3.html');
 assert(await page.locator('#story').isEnabled());
 assert(await page.locator('#endless').isEnabled());
 await page.locator('#story').click();
 assert.equal((await page.evaluate(()=>__qa.snapshot())).mode,'story');
 assert(await page.locator('#game').isVisible());
 await page.reload();await page.waitForFunction(()=>window.__qa?.ready);
 const storySave=await page.evaluate(()=>localStorage.getItem('sentience-gameplay-v4-save-20260926'));
 await page.locator('#endless').click();
 assert.equal((await page.evaluate(()=>__qa.snapshot())).mode,'endless');
 await page.evaluate(()=>{__qa.manual();__qa.step(['KeyD'],120,false)});
 assert.equal(await page.evaluate(()=>localStorage.getItem('sentience-gameplay-v4-save-20260926')),storySave,'Endless must not overwrite Story save');

 await page.goto(base+'/index.html');
 await page.waitForFunction(()=>document.querySelector('#event-mode')?.getAttribute('href')==='event-v3.html');
 await page.locator('#event-mode').click();
 await page.waitForURL('**/event-v3.html');
 await page.waitForFunction(()=>window.__TAIXUAN_QA__?.snapshot().assets.length>=20,null,{timeout:60000});
 assert(await page.locator('#rush-canvas').isVisible());
 assert.equal((await page.evaluate(()=>window.__TAIXUAN_QA__.snapshot().assets)).length,20);
 await page.screenshot({path:path.join(__dirname,'../qa/event-v3-main-build.png'),fullPage:true});
 await page.locator('.back-link').click();
 await page.waitForURL('**/index.html');
 await page.waitForFunction(()=>document.querySelector('#story')&&!document.querySelector('#story').disabled);
 assert.equal(await page.locator('#event-mode').getAttribute('href'),'event-v3.html');

 await page.goto(base+'/event-v3.html?test=full');
 await page.waitForFunction(()=>window.__TAIXUAN_QA__?.rooms().active==='room2',null,{timeout:60000});
 const full=await page.evaluate(()=>({wallet:__TAIXUAN_QA__.wallet(),rooms:__TAIXUAN_QA__.rooms(),staff:__TAIXUAN_QA__.gacha().owned.length,decor:__TAIXUAN_QA__.decorState().owned.length}));
 assert.equal(full.wallet.coins,999999);
 assert.equal(full.rooms.active,'room2');
 assert.equal(full.staff,14);
 assert.equal(full.decor,19);
 assert.deepEqual(missing,[]);
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log(JSON.stringify({ok:true,story:true,endless:true,event:true,returnToMenu:true,fullTest:true,assets:20,staff:full.staff,decor:full.decor,missing,errors}));
})().catch(e=>{console.error(e);process.exit(1)});
