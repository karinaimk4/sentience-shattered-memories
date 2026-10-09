const { chromium } = require('./playwright-runtime.cjs');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const QA = path.join(__dirname,'..','qa','event-v3-staff-dorm');

(async()=>{
  fs.mkdirSync(QA,{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1260,height:760},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4181/event-v3.html?test=full');
  await page.waitForFunction(()=>window.__TAIXUAN_QA__?.rooms().active==='room2');
  await page.locator('[data-panel="staff"]').click();

  const layout=await page.evaluate(()=>{
    const box=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};};
    return {head:box('.gacha-head'),vat:box('.gacha-vat'),rates:box('.gacha-rates'),actions:box('.gacha-actions'),banner:box('.staff-gacha-banner')};
  });
  assert.ok(layout.head.bottom<=layout.vat.top+1,'gacha title overlaps pot');
  assert.ok(layout.vat.bottom<=layout.rates.top+1,'gacha pot overlaps rates');
  assert.ok(layout.rates.bottom<=layout.actions.top+40,'gacha rate/action rows are unexpectedly stacked');
  await page.screenshot({path:path.join(QA,'gacha-layout-1260.png'),fullPage:true});

  await page.locator('[data-staff-mode="dorm"]').click();
  const poolSize=await page.evaluate(()=>window.__TAIXUAN_QA__.gachaPool().length);
  assert.equal(await page.locator('.staff-dorm-card').count(),poolSize);
  const before=await page.evaluate(()=>window.__TAIXUAN_QA__.dorm());
  await page.locator('[data-staff-train="kiana"]').click();
  const after=await page.evaluate(()=>window.__TAIXUAN_QA__.dorm());
  assert.equal(after.training.kiana,1);
  assert.equal(after.shards.kiana||0,before.shards.kiana||0,'test training must not spend undefined shard cost');
  assert.match(await page.locator('[data-dorm-id="kiana"]').textContent(),/Bậc thử 1/);
  assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(QA,'staff-dorm-full.png'),fullPage:true});
  console.log(JSON.stringify({result:'PASS',poolSize,layout,training:after.training.kiana}));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
