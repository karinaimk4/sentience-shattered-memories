const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>errors.push(e.stack||e.message));
 await page.goto('http://127.0.0.1:4181/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.manual();__qa.start()});
 await page.evaluate(require('./bot.cjs'));
 let s,trackVisible=false,celebrated=false,trackStatus='';
 for(let i=0;i<1400;i++){
  s=await page.evaluate(()=>drive(10));
  if(s.phase==='arena'&&s.arena?.m===100&&!trackVisible){
   trackVisible=await page.locator('#battle-track').isVisible();
   const src=await page.locator('#battle-soundcloud').getAttribute('src');
   assert(src.includes('soundcloud.com%2Falbedo_simp%2Fhonkai-impact-3rd-hos-trailer'));
   await page.waitForTimeout(4000);trackStatus=await page.locator('#battle-track-status').textContent();
   await page.screenshot({path:path.join(__dirname,'../qa/battle-music.png')});
  }
  if(s.phase==='celebrate'&&s.metrics.yattas===1){
   celebrated=true;await page.evaluate(()=>__qa.step([],45));await page.screenshot({path:path.join(__dirname,'../qa/yatta-first-boss.png')});break;
  }
  if(s.phase==='dying'||s.stalled)break;
 }
 console.log(JSON.stringify({trackVisible,trackStatus,celebrated,source:s.audioStatus.battle.source,yattas:s.metrics.yattas,errors}));
 await browser.close();
 assert(trackVisible);assert(celebrated);assert.equal(errors.length,0);
})().catch(e=>{console.error(e);process.exit(1)});
