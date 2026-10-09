const {chromium}=require('./playwright-runtime.cjs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}});
 page.on('pageerror',e=>console.error('PAGE',e.message));
 await page.goto('http://127.0.0.1:4181/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.manual();__qa.start()});
 await page.evaluate(require('./bot.cjs'));
 let s,last=0;
 for(let i=0;i<850;i++){
  s=await page.evaluate(()=>drive(60));
  if(Math.floor(s.p.x/64/100)!==last||s.phase==='dying'||s.phase==='finished'){
   last=Math.floor(s.p.x/64/100);
   console.log(JSON.stringify({i,m:Math.round(s.p.x/64),phase:s.phase,hp:s.hp,weather:s.environment?.weather?.id,hail:s.environment?.hail?.length,metrics:s.metrics.environmentHits,rescues:s.metrics.respawns}));
  }
  if(s.phase==='dying'||s.phase==='finished')break;
 }
 await page.screenshot({path:'qa/debug-route-end.png'});
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
