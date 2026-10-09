const { chromium } = require('./playwright-runtime.cjs');
const fs = require('node:fs');
const path = require('node:path');

(async()=>{
  const qaDir=path.join(__dirname,'..','qa','event-v3-greybox');
  fs.mkdirSync(qaDir,{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const context=await browser.newContext({
    viewport:{width:1536,height:1040},
    recordVideo:{dir:qaDir,size:{width:1280,height:720}}
  });
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4181/event-v3-greybox.html');
  await page.waitForFunction(()=>window.__TAIXUAN_QA__&&window.__TAIXUAN_WORLD__);
  await page.evaluate(()=>window.__TAIXUAN_QA__.reset('lv1',1));
  await page.waitForTimeout(30000);
  const video=page.video();
  await page.close();
  const source=await video.path();
  await context.close();
  await browser.close();
  const target=path.join(qaDir,'lv1-motion-30s.webm');
  fs.copyFileSync(source,target);
  console.log(JSON.stringify({result:'PASS',video:'qa/event-v3-greybox/lv1-motion-30s.webm'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
