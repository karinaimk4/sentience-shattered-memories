const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('./playwright-runtime.cjs');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1600,height:1000}});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:4181/event-v3.html');
    await page.waitForFunction(()=>window.__TAIXUAN_QA__&&window.__TAIXUAN_WORLD__);
    const result=await page.evaluate(async()=>{
      const qa=window.__TAIXUAN_QA__;
      window.__TAIXUAN_WORLD__.speed=0;
      qa.moveTable('t1',[10,3]);
      const before=qa.tableState().tables.find(table=>table.id==='t1').tile;
      const lockedSwitch=await qa.switchRoom('room2');
      qa.setWallet(10000,50);
      const opened=await qa.upgradeRestaurant();
      const room2={snapshot:qa.snapshot(),rows:[...window.__TAIXUAN_WORLD__.map.rows]};
      const jobsBefore=room2.snapshot.metrics.completedJobs;
      for(let tick=0;tick<1800;tick++)window.__TAIXUAN_WORLD__.update(1/60);
      const room2Completed=window.__TAIXUAN_WORLD__.metrics.completedJobs;
      const back=await qa.switchRoom('room1');
      const room1={snapshot:qa.snapshot(),movedTile:qa.tableState().tables.find(table=>table.id==='t1').tile};
      return {before,lockedSwitch,opened,room2,room2Completed,jobsBefore,back,room1,rooms:qa.rooms()};
    });
    assert.equal(result.lockedSwitch,false);
    assert.equal(result.opened,true);
    assert.deepEqual(result.before,[10,3]);
    assert.equal(result.room2.snapshot.roomId,'room2');
    assert.equal(result.room2.snapshot.roomLevel,2);
    assert.equal(result.room2.snapshot.kitchenSlots,3);
    assert.deepEqual(result.room2.snapshot.staff.filter(staff=>staff.role==='chef').map(staff=>staff.id),['kiana','yae']);
    assert.equal(result.room2.snapshot.tables.length,6);
    assert.notDeepEqual(result.room2.rows,JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','restaurant-lv1.json'),'utf8')).rows);
    assert(result.room2Completed>result.jobsBefore,'Gian 2 chưa vận hành job độc lập');
    assert.equal(result.back,true);
    assert.equal(result.room1.snapshot.roomId,'room1');
    assert.equal(result.room1.snapshot.kitchenSlots,1);
    assert.equal(result.room1.snapshot.tables.length,3);
    assert.deepEqual(result.room1.movedTile,[10,3]);
    assert.deepEqual(result.rooms.unlocked,['room1','room2']);
    await page.locator('[data-room="room2"]').click();
    await page.waitForFunction(()=>window.__TAIXUAN_QA__.snapshot().roomId==='room2');
    await page.locator('[data-follow-staff="fuhua"]').click();
    assert.equal(await page.locator('#camera-target').textContent(),'Fu Hua');
    const qaDir=path.join(__dirname,'..','qa','event-v3-multiroom');fs.mkdirSync(qaDir,{recursive:true});
    const screenshot=path.join(qaDir,'room2-map-and-switcher.png');await page.screenshot({path:screenshot,fullPage:true});
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({result:'PASS',screenshot,room1Tables:3,room2Tables:6,room2Kitchens:3}));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
