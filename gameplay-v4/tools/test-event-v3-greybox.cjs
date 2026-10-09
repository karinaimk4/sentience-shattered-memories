const { chromium } = require('./playwright-runtime.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname,'..');
const SOURCE = path.join(ROOT,'event-v3-greybox.js');
const QA = path.join(ROOT,'qa','event-v3-greybox');

(async()=>{
  const source=fs.readFileSync(SOURCE,'utf8');
  assert(!source.includes('setInterval'), 'Rush V3 không được dùng setInterval');
  assert(source.includes('requestAnimationFrame'), 'Thiếu requestAnimationFrame');
  assert(source.includes('aStar('), 'Thiếu A*');
  fs.mkdirSync(QA,{recursive:true});

  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1536,height:1040},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:4181/event-v3-greybox.html');
  await page.waitForFunction(()=>window.__TAIXUAN_QA__&&window.__TAIXUAN_WORLD__);

  const runShift=async level=>{
    await page.evaluate(async lvl=>window.__TAIXUAN_QA__.reset(lvl,10),level);
    await page.waitForFunction(()=>window.__TAIXUAN_WORLD__.timeLeft===0,null,{timeout:20000});
    return page.evaluate(()=>window.__TAIXUAN_QA__.snapshot());
  };

  const lv1=await runShift('lv1');
  assert.equal(lv1.metrics.slideViolations,0);
  assert.equal(lv1.metrics.jobStarvationViolations,0);
  assert(lv1.metrics.maxGuestState<60,`Lv1 guest kẹt ${lv1.metrics.maxGuestState}s`);
  assert(Object.values(lv1.metrics.overlapPairs).every(seconds=>seconds<=1),`Lv1 có cặp đứng chồng quá 1s: ${JSON.stringify(lv1.metrics.overlapPairs)}`);
  assert(lv1.metrics.completedJobs>2,'Lv1 không chạy đủ job');

  const lv2=await runShift('lv2');
  assert.equal(lv2.metrics.slideViolations,0);
  assert.equal(lv2.metrics.jobStarvationViolations,0);
  assert(lv2.metrics.maxGuestState<60,`Lv2 guest kẹt ${lv2.metrics.maxGuestState}s`);
  assert(Object.values(lv2.metrics.overlapPairs).every(seconds=>seconds<=1),`Lv2 có cặp đứng chồng quá 1s: ${JSON.stringify(lv2.metrics.overlapPairs)}`);

  await page.evaluate(async()=>window.__TAIXUAN_QA__.setReception('elysia'));
  const assigned=await page.evaluate(()=>window.__TAIXUAN_QA__.snapshot());
  assert(assigned.staff.some(s=>s.id==='elysia'&&s.role==='reception'),'Đổi lễ tân không cập nhật đúng nhân vật');

  await page.evaluate(async()=>{
    await window.__TAIXUAN_QA__.reset('lv1',1);
    const w=window.__TAIXUAN_WORLD__,l=w.staff('liliya'),h=w.staff('fuhua');
    h.tile=[l.tile[0]+1,l.tile[1]];h.px=h.tile[0]*32+16;h.py=h.tile[1]*32+28;h.path=[];
    window.__TAIXUAN_QA__.forceDoze();
  });
  await page.waitForTimeout(2500);
  const wake=await page.evaluate(()=>window.__TAIXUAN_QA__.snapshot());
  assert.notEqual(wake.staff.find(s=>s.id==='liliya').state,'DOZE','Fu Hua chưa đánh thức Liliya');

  await page.evaluate(()=>{window.__TAIXUAN_QA__.toggleConflict();window.__TAIXUAN_QA__.spawn();window.__TAIXUAN_QA__.toggleDebug();});
  const conflict=await page.evaluate(()=>window.__TAIXUAN_QA__.snapshot());
  assert(conflict.conflict,'Cặp ZEN/YATTA chưa bật');
  assert(conflict.guests.some(g=>g.state==='CONFUSED'),'Khách mới không vào CONFUSED');

  await page.locator('[data-scale="2"]').click();
  await page.screenshot({path:path.join(QA,'lv1-scale-2.png'),fullPage:true});
  await page.locator('[data-scale="3"]').click();
  await page.screenshot({path:path.join(QA,'lv1-scale-3.png'),fullPage:true});
  const smoothing=await page.evaluate(()=>document.querySelector('#rush-canvas').getContext('2d').imageSmoothingEnabled);
  assert.equal(smoothing,false,'Canvas đang bật smoothing');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({result:'PASS',lv1:lv1.metrics,lv2:lv2.metrics,screenshots:['qa/event-v3-greybox/lv1-scale-2.png','qa/event-v3-greybox/lv1-scale-3.png']},null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
