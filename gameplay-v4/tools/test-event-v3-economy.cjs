const assert=require('node:assert/strict');
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
      const topRow=window.__TAIXUAN_WORLD__.map.rows[3];
      const tablePlacedUpstairs=qa.moveTable('t1',[10,3]);
      const lv1=window.__TAIXUAN_WORLD__;
      for(let tick=0;tick<1800;tick++)lv1.update(1/60);
      const upperTableServed=lv1.metrics.served>0&&lv1.tables.find(table=>table.id==='t1').tile.join(',')==='10,3';
      qa.setWallet(0,0);
      const zero=await qa.upgradeRestaurant();
      qa.setWallet(9999,50);
      const shortXu=await qa.upgradeRestaurant();
      qa.setWallet(10000,49);
      const shortIron=await qa.upgradeRestaurant();
      qa.setWallet(10000,50);
      const success=await qa.upgradeRestaurant();
      const afterPurchase={...qa.wallet(),level:qa.snapshot().level};
      await qa.reset('lv1',0);
      const persistent=qa.wallet();
      const reenter=await qa.upgradeRestaurant();
      return {topRow,tablePlacedUpstairs,upperTableServed,zero,shortXu,shortIron,success,afterPurchase,persistent,reenter,finalLevel:qa.snapshot().level};
    });
    assert.equal(result.topRow.slice(7,17),'..........');
    assert.equal(result.tablePlacedUpstairs,true);
    assert.equal(result.upperTableServed,true);
    assert.equal(result.zero,false);
    assert.equal(result.shortXu,false);
    assert.equal(result.shortIron,false);
    assert.equal(result.success,true);
    assert.deepEqual(result.afterPurchase,{coins:0,arcIron:0,unlockedLv2:true,level:'lv2'});
    assert.equal(result.persistent.unlockedLv2,true);
    assert.equal(result.reenter,true);
    assert.equal(result.finalLevel,'lv2');
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({result:'PASS',details:result}));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
