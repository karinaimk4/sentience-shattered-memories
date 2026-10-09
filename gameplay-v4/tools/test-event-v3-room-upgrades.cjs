const { chromium } = require('./playwright-runtime.cjs');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const QA = path.join(__dirname,'..','qa','event-v3-room-upgrades');

(async()=>{
  fs.mkdirSync(QA,{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1536,height:1040},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4181/event-v3.html?test=full');
  await page.waitForFunction(()=>window.__TAIXUAN_QA__?.rooms().active==='room2');
  await page.locator('[data-panel="decor"]').click();
  assert.match(await page.locator('#room-upgrade-title').textContent(),/Gian 2/);
  await page.locator('[data-room-upgrade="floor"]').click();
  assert.equal((await page.evaluate(()=>window.__TAIXUAN_QA__.upgrades())).room2.floor,1);
  assert.equal((await page.evaluate(()=>window.__TAIXUAN_QA__.upgrades())).room1.floor,0);
  await page.locator('[data-room="room1"]').click();
  await page.waitForFunction(()=>window.__TAIXUAN_QA__.rooms().active==='room1');
  assert.match(await page.locator('#room-upgrade-title').textContent(),/Gian 1/);
  await page.locator('[data-room-upgrade="kitchen"]').click();
  const state=await page.evaluate(()=>window.__TAIXUAN_QA__.upgrades());
  assert.deepEqual(state.room1,{floor:0,kitchen:1,waiting:0});
  assert.deepEqual(state.room2,{floor:1,kitchen:0,waiting:0});
  await page.locator('[data-room="room2"]').click();
  await page.waitForFunction(()=>window.__TAIXUAN_QA__.rooms().active==='room2');
  assert.equal(await page.locator('[data-room-upgrade="floor"]').isDisabled(),true);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(QA,'room2-separate-upgrades.png'),fullPage:true});
  console.log(JSON.stringify({result:'PASS',state}));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
