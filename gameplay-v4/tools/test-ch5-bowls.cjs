const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1152,height:760}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=(process.env.HOS_BASE_URL||'http://127.0.0.1:4192/build-assets-v4').replace(/\/$/,'');
 await page.goto(base+'/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.start('story');__qa.manual();__qaStartChapterFiveBowl()});
 const state=()=>page.evaluate(()=>__qa.snapshot().memoryTrial);
 const tap=async code=>{await page.evaluate(key=>__qa.step([key],1),code);await page.evaluate(()=>__qa.step([],1));};
 const order=[0,7,1,6,2,5,3,4];
 assert.equal((await state()).step,0);
 await page.locator('#game').screenshot({path:path.join(__dirname,'../qa/ch5-bowls-distinct.png')});
 await tap('KeyE');
 assert.equal((await state()).step,1);
 await tap('KeyE');
 assert.equal((await state()).step,1,'placed bowl cannot be placed twice');
 for(let step=1;step<8;step++){
  const target=order[step];
  while((await state()).cursor!==target)await tap('ArrowRight');
  await tap('KeyE');
  const trial=await state();
  assert.equal(trial.step,step+1);
  assert.deepEqual(trial.sequence,order.slice(0,step+1));
  if(step===6)await page.locator('#game').screenshot({path:path.join(__dirname,'../qa/ch5-bowls-seventh.png')});
 }
 assert.equal((await state()).done,true);
 await page.locator('#game').screenshot({path:path.join(__dirname,'../qa/ch5-bowls-complete.png')});
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log(JSON.stringify({ok:true,placed:order.length,sequence:order,errors}));
})().catch(error=>{console.error(error);process.exit(1)});
