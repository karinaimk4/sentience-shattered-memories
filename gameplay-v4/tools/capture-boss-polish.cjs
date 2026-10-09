const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}});
 const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json')));
 const errors=[];page.on('pageerror',e=>{const details=e.stack||e.message;if(!details.includes('widget.sndcdn.com'))errors.push(details)});
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(save=>localStorage.setItem('sentience-gameplay-v4-save-20260926',JSON.stringify(save)),fixture);
 await page.reload();await page.waitForFunction(()=>window.__qa?.ready);
 await page.locator('#story').click();await page.evaluate(()=>__qa.manual());await page.evaluate(require('./bot.cjs'));
 const captured=new Set();let s;
 for(let i=0;i<1500;i++){
  s=await page.evaluate(()=>drive(10));
  const boss=s.enemies.find(e=>e.ai&&e.hp>0),a=boss?.ai;
  const name=a?.state==='rage'?'rage':a?.fx.some(f=>f.kind==='beam'&&f.life>0)?'beam-active':a?.life===2&&a?.state==='rest'?'mode-two':null;
  if(name&&!captured.has(name)){captured.add(name);await page.screenshot({path:path.join(__dirname,`../qa/boss-polish-${name}.png`)});if(name==='rage'){await page.evaluate(()=>drive(90));await page.screenshot({path:path.join(__dirname,'../qa/boss-polish-hua-entry.png')});await page.evaluate(()=>drive(20));await page.screenshot({path:path.join(__dirname,'../qa/boss-polish-hua-punch.png')});}}
  if(s.bossRecord?.huaStrikes>0&&!captured.has('hua-strike')){captured.add('hua-strike');await page.evaluate(()=>drive(17));await page.screenshot({path:path.join(__dirname,'../qa/boss-polish-hua-strike.png')});}
  if(s.phase==='finished'||s.phase==='dying')break;
 }
 console.log(JSON.stringify({phase:s.phase,lives:s.bossRecord?.lives,captured:[...captured],errors}));
 await browser.close();if(errors.length||s.phase!=='finished'||captured.size<3)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
