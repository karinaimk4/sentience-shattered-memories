const { chromium } = require('./playwright-runtime.cjs');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const QA = path.join(__dirname,'..','qa','event-v3-expanded-staff');

(async()=>{
  fs.mkdirSync(QA,{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1536,height:1040},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4181/event-v3.html?test=full');
  await page.waitForFunction(()=>window.__TAIXUAN_QA__?.rooms().active==='room2');

  const result=await page.evaluate(async()=>{
    const qa=window.__TAIXUAN_QA__;
    const pool=qa.gachaPool();
    const onePull=await qa.pullGacha();
    await qa.setAssignments({reception:'susannah',server:'carole',chef:'kiana',cleaner:'griseo'});
    return {pool,onePull,snapshot:qa.snapshot(),gacha:qa.gacha()};
  });

  assert.equal(result.pool.length,14);
  assert.equal(result.onePull.length,1);
  assert(result.pool.find(card=>card.id==='susannah'&&card.rank==='S'&&card.loaded));
  assert(result.pool.find(card=>card.id==='carole'&&card.rank==='S'&&card.loaded));
  assert(result.snapshot.assets.includes('susannah'));
  assert(result.snapshot.assets.includes('carole'));
  assert(result.snapshot.staff.some(staff=>staff.id==='susannah'&&staff.role==='reception'));
  assert(result.snapshot.staff.some(staff=>staff.id==='carole'&&staff.role==='server'));
  assert.deepEqual(errors,[]);

  await page.evaluate(()=>window.__TAIXUAN_QA__.previewGacha(['susannah']));
  await page.screenshot({path:path.join(QA,'susannah-gacha.png'),fullPage:true});
  await page.evaluate(()=>window.__TAIXUAN_QA__.previewGacha(['carole']));
  await page.screenshot({path:path.join(QA,'carole-gacha.png'),fullPage:true});
  await page.click('#gacha-close');
  await page.screenshot({path:path.join(QA,'room2-susannah-carole.png'),fullPage:true});

  console.log(JSON.stringify({result:'PASS',pool:result.pool.length,onePull:result.onePull.length,staff:result.snapshot.staff.map(staff=>staff.id)}));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
