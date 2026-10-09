const {chromium}=require('./playwright-runtime.cjs'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);await page.evaluate(()=>{__qa.manual();__qa.start();__qa.step([],120)});
 assert((await page.locator('#dialogue-text').textContent()).includes('Chỗ này'));await page.screenshot({path:path.join(__dirname,'../qa/cinematic-opening.png')});
 await page.evaluate(()=>{while(__qa.snapshot().dialogueIndex<3)__qa.advance();__qa.step([],220)});await page.screenshot({path:path.join(__dirname,'../qa/cinematic-ignored.png')});
 await page.evaluate(require('./bot.cjs'));await page.evaluate(()=>{bot.seekMemories=true;bot.stopRescue=true;bot.stopEnding=true});let s,captures=[];
 for(let i=0;i<160;i++){
  s=await page.evaluate(()=>drive(600));
  if(s.capture){await page.evaluate(()=>__qa.step([],180));await page.screenshot({path:path.join(__dirname,`../qa/cinematic-${s.capture}.png`)});captures.push(s.capture);await page.evaluate(id=>{if(id==='rescue')bot.stopRescue=false;else bot.stopEnding=false},s.capture);}
  if(s.phase==='dying'&&s.metrics.respawns<4){await page.evaluate(()=>__qa.step([],80));continue;}if(s.phase==='finished'||s.stalled||s.phase==='dying')break;
 }
 fs.writeFileSync(path.join(__dirname,'../qa/narrative-run.json'),JSON.stringify({s,captures,errors},null,2));console.log(JSON.stringify({phase:s.phase,memories:s.memories,captures,errors}));
 await browser.close();assert.equal(s.phase,'finished');assert.deepEqual(s.memories.sort(),['hidden-1','hidden-2','main-1']);assert.deepEqual(captures,['rescue','ending']);assert.equal(errors.length,0);
})().catch(e=>{console.error(e);process.exitCode=1});
