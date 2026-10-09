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
    await page.waitForFunction(()=>window.__TAIXUAN_WORLD__&&window.__TAIXUAN_QA__);
    const result=await page.evaluate(async()=>{
      const world=window.__TAIXUAN_WORLD__;
      world.speed=0;
      world.tables.find(table=>table.id==='t1').state='DIRTY';
      const image=new Image();
      image.src='assets/event-v3/lv1/dirty-dishes-v1.png';
      await image.decode();
      return {width:image.naturalWidth,height:image.naturalHeight,dirty:world.tables.find(table=>table.id==='t1').state};
    });
    await page.waitForTimeout(100);
    const qaDir=path.join(__dirname,'..','qa','event-v3-dirty-dishes');
    fs.mkdirSync(qaDir,{recursive:true});
    const screenshot=path.join(qaDir,'dirty-table-in-game.png');
    await page.locator('#rush-canvas').screenshot({path:screenshot});
    assert.deepEqual(result,{width:64,height:32,dirty:'DIRTY'});
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({result:'PASS',screenshot}));
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
