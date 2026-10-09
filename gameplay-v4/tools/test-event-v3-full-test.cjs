const { chromium } = require('./playwright-runtime.cjs');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const QA = path.join(__dirname,'..','qa','event-v3-full-test');

(async()=>{
  fs.mkdirSync(QA,{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1536,height:1040},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4181/event-v3.html?test=full');
  await page.waitForFunction(()=>window.__TAIXUAN_QA__?.rooms().active==='room2');
  const result=await page.evaluate(()=>({wallet:window.__TAIXUAN_QA__.wallet(),rooms:window.__TAIXUAN_QA__.rooms(),gacha:window.__TAIXUAN_QA__.gacha(),decor:window.__TAIXUAN_QA__.decorState(),tables:window.__TAIXUAN_QA__.tableState(),snapshot:window.__TAIXUAN_QA__.snapshot()}));
  assert.equal(result.wallet.coins,999999);
  assert.equal(result.wallet.arcIron,999);
  assert.equal(result.wallet.unlockedLv2,true);
  assert(result.rooms.unlocked.includes('room2'));
  assert.equal(result.snapshot.roomId,'room2');
  assert.equal(result.snapshot.kitchenSlots,3);
  assert.deepEqual(result.snapshot.staff.filter(staff=>staff.role==='chef').map(staff=>staff.id),['kiana','yae']);
  assert.equal(result.snapshot.tables.filter(table=>table.placed).length,6);
  assert.equal(result.gacha.owned.length,14);
  assert.equal(result.decor.owned.length,19);
  assert.equal(result.tables.owned.basic,6);
  assert.equal(result.tables.owned.polished,6);
  assert.deepEqual(errors,[]);
  const screenshot=path.join(QA,'room2-full-resources.png');
  await page.screenshot({path:screenshot,fullPage:true});
  console.log(JSON.stringify({result:'PASS',screenshot,wallet:result.wallet,staffOwned:result.gacha.owned.length,decorOwned:result.decor.owned.length}));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
