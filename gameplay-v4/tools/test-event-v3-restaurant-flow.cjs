const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1600,height:1050}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4181/event-v3.html');
  await page.waitForFunction(()=>window.__TAIXUAN_QA__&&window.__TAIXUAN_WORLD__);
  await page.evaluate(()=>window.__TAIXUAN_WORLD__.speed=0);
  const initial=await page.evaluate(()=>({tables:window.__TAIXUAN_QA__.snapshot().tables,assets:window.__TAIXUAN_QA__.tableCatalog()}));
  assert.equal(initial.tables.filter(table=>table.placed&&table.styleId==='basic').length,3);
  assert(initial.assets.every(asset=>asset.loaded));

  await page.locator('[data-panel="decor"]').click();
  await page.locator('[data-table-style="basic"] [data-table-action="store"]').click();
  await page.locator('[data-table-style="polished"] [data-table-action="buy"]').click();
  await page.locator('[data-table-style="polished"] [data-table-action="place"]').click();
  const changed=await page.evaluate(()=>window.__TAIXUAN_QA__.tableState());
  assert.equal(changed.tables.filter(table=>table.placed).length,3);
  assert.equal(changed.tables.filter(table=>table.placed&&table.styleId==='polished').length,1);
  assert.equal(changed.owned.basic,3);
  assert.equal(await page.evaluate(()=>window.__TAIXUAN_QA__.moveTable('t1',[8,8])),true);
  assert.deepEqual((await page.evaluate(()=>window.__TAIXUAN_QA__.tableState())).tables.find(table=>table.id==='t1').tile,[8,8]);
  await page.locator('#table-edit-toggle').click();
  assert(await page.locator('#rush-canvas').evaluate(canvas=>canvas.classList.contains('decor-editing')));
  const canvas=await page.locator('#rush-canvas').boundingBox();
  const ratio=canvas.width/640;
  await page.mouse.move(canvas.x+(8*32+32)*ratio,canvas.y+(8*32+7)*ratio);
  await page.mouse.down();
  await page.mouse.move(canvas.x+(6*32+32)*ratio,canvas.y+(5*32+7)*ratio,{steps:12});
  await page.mouse.up();
  assert.deepEqual((await page.evaluate(()=>window.__TAIXUAN_QA__.tableState())).tables.find(table=>table.id==='t1').tile,[6,5]);
  await page.locator('#table-edit-toggle').click();
  await page.locator('[data-table-style="polished"] [data-table-action="store"]').click();
  await page.locator('[data-table-style="basic"] [data-table-action="place"]').click();
  assert.equal((await page.evaluate(()=>window.__TAIXUAN_QA__.tableState())).tables.filter(table=>table.placed&&table.styleId==='basic').length,3);

  const flow=await page.evaluate(()=>{
    const w=window.__TAIXUAN_WORLD__,guest=w.guests[0],states=[],positions=[];
    let previous='';
    for(let tick=0;tick<4800;tick++){
      w.update(1/60);
      if(guest.guestState!==previous){states.push(guest.guestState);positions.push({time:Number(w.time.toFixed(2)),state:guest.guestState,tile:[...guest.tile],reception:[...w.staff('rozaliya').tile]});previous=guest.guestState;}
      if(guest.guestState==='EATING')break;
    }
    return {states,positions,served:w.metrics.served,jobs:w.metrics.completedJobs};
  });
  assert(flow.states.includes('AT_FRONT'),JSON.stringify(flow));
  assert(flow.states.includes('FOLLOW_TO_SEAT'),JSON.stringify(flow));
  assert(flow.states.includes('SEATED_WAITING'),JSON.stringify(flow));
  assert(flow.states.includes('EATING'),JSON.stringify(flow));

  await page.evaluate(async()=>{await window.__TAIXUAN_QA__.reset('lv1',1);window.__TAIXUAN_WORLD__.speed=0;window.__TAIXUAN_QA__.forceDoze();});
  const scoldStarted=await page.evaluate(()=>{
    const w=window.__TAIXUAN_WORLD__,hua=w.staff('fuhua');
    for(let tick=0;tick<1200;tick++){w.update(1/60);if(hua.state==='SCOLD'&&hua.anim==='work_book')return true;}
    return false;
  });
  assert.equal(scoldStarted,true);
  const qaDir=path.join(__dirname,'..','qa','event-v3-integrated');fs.mkdirSync(qaDir,{recursive:true});
  await page.screenshot({path:path.join(qaDir,'event-v3-fuhua-scold.png'),fullPage:true});
  const scold=await page.evaluate(()=>{
    const w=window.__TAIXUAN_WORLD__,hua=w.staff('fuhua'),liliya=w.staff('liliya');
    for(let tick=0;tick<1200;tick++){w.update(1/60);if(liliya.lazyLeft===0)break;}
    return {seen:true,huaState:hua.state,liliyaState:liliya.state,liliyaLazy:liliya.lazyLeft};
  });
  assert.equal(scold.seen,true,JSON.stringify(scold));
  assert.equal(scold.liliyaLazy,0,JSON.stringify(scold));

  await page.locator('[data-panel="staff"]').click();
  await page.locator('[data-staff-slot="reception"]').click();
  await page.locator('[data-staff-slot="server"]').click();
  await page.locator('[data-staff-slot="chef"]').click();
  await page.locator('[data-staff-slot="cleaner"]').click();
  const slots=await page.evaluate(()=>window.__TAIXUAN_QA__.snapshot().staffSlots);
  assert.deepEqual(slots,{reception:2,server:2,chef:2,cleaner:2});
  const hired=await page.evaluate(async()=>{
    const qa=window.__TAIXUAN_QA__;
    await qa.reset('lv2',1);window.__TAIXUAN_WORLD__.speed=0;
    return qa.snapshot().staff.filter(staff=>staff.role==='chef').map(staff=>staff.id);
  });
  assert.deepEqual(hired,['kiana','yae']);
  await page.screenshot({path:path.join(qaDir,'event-v3-tables-and-staff-slots.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({result:'PASS',flow:flow.positions,scold,slots,hired}));
  await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});
