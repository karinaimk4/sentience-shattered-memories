const {chromium}=require('./playwright-runtime.cjs'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[],widgetErrors=[],warnings=[];
 page.on('pageerror',e=>{const details=e.stack||e.message;(details.includes('widget.sndcdn.com')?widgetErrors:errors).push(details)});page.on('console',m=>{if(m.type()==='warning')warnings.push(m.text())});
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);await page.evaluate(()=>{__qa.manual();__qa.start()});
 await page.evaluate(()=>__qa.step([],150));await page.screenshot({path:path.join(__dirname,'../qa/opening.png')});
 await page.evaluate(require('./bot.cjs'));
 let s,scene='';
 for(let i=0;i<200;i++){
  s=await page.evaluate(()=>drive(600));
  if(s.scene!==scene){scene=s.scene;await page.screenshot({path:path.join(__dirname,`../qa/scene-${scene}.png`)});}
  if(i%10===0||s.stalled||s.phase==='dying')console.log(JSON.stringify({i,m:Math.round(s.p.x/64),hp:s.hp,phase:s.phase,clear:s.clear,loop:s.loopCount,interaction:s.interaction}));
  if(s.phase==='dying'&&s.metrics.respawns<4){await page.evaluate(()=>__qa.step([],80));continue;}if(s.phase==='finished'||s.stalled||s.phase==='dying')break;
 }
 fs.writeFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),await page.evaluate(()=>localStorage.getItem('sentience-gameplay-v4-save-20260926-backup')));await page.screenshot({path:path.join(__dirname,'../qa/story-end.png')});fs.writeFileSync(path.join(__dirname,'../qa/story-run.json'),JSON.stringify({s,errors,widgetErrors,warnings},null,2));
 console.log(JSON.stringify({phase:s.phase,time:s.elapsed,events:s.storyEvents,gear:s.save.cores,clear:s.clear,metrics:s.metrics,errors,widgetErrors:widgetErrors.length,warnings}));
 await browser.close();assert.equal(errors.length,0);assert.equal(s.phase,'finished');assert.equal(s.metrics.yattas,6);assert(s.storyEvents.includes('node:loop-light'));assert.deepEqual(s.save.weapons,['sword']);assert(s.save.storyEvents.includes('forge-namiko'));assert.equal(s.save.forgeParts.namiko_coil,6,'Three Nagazora caches yield six named coils');assert(!s.save.forgeParts.brick_heart,'The special brick is reserved for a later chapter');assert(!s.save.cores.cas_ii_namiko,'Namiko requires forging');assert(s.nodes.every(n=>n.destroyed));
})().catch(e=>{console.error(e);process.exitCode=1});


