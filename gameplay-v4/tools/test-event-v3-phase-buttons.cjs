const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
  const base=(process.env.HOS_BASE_URL||'http://127.0.0.1:4192/build-assets-v4').replace(/\/$/,'');
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1536,height:1000}});
  const errors=[],missing=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&response.url().startsWith('http://127.0.0.1:'))missing.push(`${response.status()} ${response.url()}`);});
  await page.goto(`${base}/event-v3.html`);
  await page.waitForFunction(()=>window.__TAIXUAN_QA__?.phase());
  await page.locator('[data-phase="morning"]').click();
  for(const [index,map] of ['nagazora','arc','babylon','taixuan'].entries()){
    const stockBefore=await page.evaluate(()=>__TAIXUAN_QA__.phase().stock);
    await page.locator(`[data-supply-map="${map}"]`).click();
    assert.equal((await page.evaluate(()=>__TAIXUAN_QA__.phase())).selectedMap,map);
    const started=await page.evaluate(()=>__TAIXUAN_QA__.phase());
    assert(started.run,'Chọn khu phải mở event run');
    assert.equal(started.trips,0,'Chưa chạy xong không được tính chuyến');
    assert.deepEqual(started.stock,stockBefore,'Chưa nhặt không được cộng nguyên liệu');
    if(index===0){
      await page.locator('[data-run-leave]').click();
      const cancelled=await page.evaluate(()=>__TAIXUAN_QA__.phase());
      assert.equal(cancelled.run,null);
      assert.equal(cancelled.trips,0);
      assert.deepEqual(cancelled.stock,stockBefore);
      await page.locator(`[data-supply-map="${map}"]`).click();
    }
    if(map==='arc')await page.screenshot({path:path.join(__dirname,'../qa/event-v3-expedition-run.png'),fullPage:true});
    await page.keyboard.down('d');
    await page.waitForFunction(()=>__TAIXUAN_QA__.phase().trips===1,null,{timeout:15000});
    await page.keyboard.up('d');
    const phase=await page.evaluate(()=>__TAIXUAN_QA__.phase());
    assert.equal(phase.trips,1);
    assert(Object.values(phase.stock).some(count=>count>0));
    if(map==='arc')await page.screenshot({path:path.join(__dirname,'../qa/event-v3-morning-fixed.png'),fullPage:true});
    if(index===0){
      await page.locator('[data-phase-next="afternoon"]').click();
      for(const step of [0,1,2])await page.locator(`[data-cook-step="${step}"]`).click();
      assert.equal((await page.evaluate(()=>__TAIXUAN_QA__.phase())).prepared,3);
      await page.locator('[data-phase-next="evening"]').click();
    }
    await page.locator('[data-phase="night"]').click();
    await page.locator('[data-night-action="wash"]').click();
    assert.equal((await page.evaluate(()=>__TAIXUAN_QA__.phase())).washes,1);
    if(index===0)await page.screenshot({path:path.join(__dirname,'../qa/event-v3-phase-buttons.png'),fullPage:true});
    await page.locator('[data-next-day]').click();
    assert.equal((await page.evaluate(()=>__TAIXUAN_QA__.phase())).day,index+2);
  }
  assert.equal((await page.evaluate(()=>__TAIXUAN_QA__.wallet())).arcIron,5);
  assert.deepEqual(missing,[]);
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log(JSON.stringify({ok:true,maps:4,expedition:true,cooking:true,night:true,newDay:true,missing,errors}));
})().catch(error=>{console.error(error);process.exit(1)});
