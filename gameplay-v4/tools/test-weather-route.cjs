const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const details=e.stack||e.message;if(!details.includes('widget.sndcdn.com'))errors.push(details)});
 await page.goto('http://127.0.0.1:4181/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.manual();__qa.start()});
 await page.evaluate(require('./bot.cjs'));
 let s;const captured=new Set();
 for(let i=0;i<850;i++){
  s=await page.evaluate(()=>drive(60,1980));
  const phase=s.environment?.clock%6;let name;
  if(s.environment?.hail?.some(h=>h.warning>0))name='hail';
  else if(s.environment?.weather?.kind==='snow'&&phase>1.6&&phase<3.1)name='snow';
  else if(s.gaps.some(g=>g.hazard==='lava'&&g.x-s.p.x>0&&g.x-s.p.x<500))name='lava';
  else if(s.vents.some(v=>v.x-s.p.x>0&&v.x-s.p.x<600))name='vent';
  else if(s.pickups.some(h=>h.x-s.p.x>0&&h.x-s.p.x<600))name='healing';
  if(name&&!captured.has(name)&&s.phase==='explore'){
   await page.screenshot({path:path.join(__dirname,`../qa/environment-${name}.png`)});
   captured.add(name);
  }
  if(s.p.x/64>=1980||s.phase==='dying'||s.stalled)break;
 }
 await browser.close();
 assert(s.p.x/64>=1980,'The Story route must reach the final checkpoint');
 assert.equal(captured.size,5);assert(s.metrics.heals>0);assert.equal(errors.length,0);
 const result={captured:[...captured],heals:s.metrics.heals,hailHits:s.metrics.environmentHits,coinRepairs:s.coinRepairs,errors};
 fs.writeFileSync(path.join(__dirname,'../qa/environment-route.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
})().catch(e=>{console.error(e);process.exit(1)});
