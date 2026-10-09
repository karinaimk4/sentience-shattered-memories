const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const SAVE='sentience-gameplay-v4-save-20260926';
const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
Object.assign(seed,{chapter:4,chapters:[1,2,3,4],checkpoint:{m:4300,hp:4200},weapons:['sword','spear','chain'],weapon:'sword',weaponLevels:{sword:4,spear:4,chain:3},level:50,assistUnlocked:true,
 cleared:[100,450,900,1300,1700,2000,2200,2560,2850,3200,3420,3705,3990,4300,4560],
 storyEvents:[...(seed.storyEvents||[]),'ch4-opening','ch4-whiteout','ch4-incubators']});
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed]);
 const base=(process.env.HOS_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'');
 await page.goto(base+'/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready,{timeout:60000});
 await page.evaluate(()=>{__qa.manual();__qa.start('story')});
 for(let i=0;i<20;i++){const phase=await page.evaluate(()=>__qa.snapshot().phase);if(phase!=='dialogue')break;await page.evaluate(()=>__qa.advance());}
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',key:'d',repeat:true,bubbles:true})));
 assert((await page.evaluate(()=>__qa.snapshot().inputKeys)).includes('KeyD'),'repeat KeyD was ignored');
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',key:'d',bubbles:true})));
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyS',key:'s',repeat:true,bubbles:true})));
 assert((await page.evaluate(()=>__qa.snapshot().inputKeys)).includes('KeyS'),'repeat KeyS was ignored');
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyS',key:'s',bubbles:true})));
 await page.evaluate(()=>__qa.seek(4640));
 for(let i=0;i<20;i++){const phase=await page.evaluate(()=>__qa.snapshot().phase);if(phase!=='dialogue')break;await page.evaluate(()=>__qa.advance());}
 const before=await page.evaluate(()=>__qa.snapshot().p.x);
 const after=await page.evaluate(()=>__qa.step(['KeyD'],30).p.x);
 assert(after>before+10,'KeyD did not move the player');
 const slide=await page.evaluate(()=>__qa.step(['KeyS'],2).p.state);
 assert(['slide_start','slide'].includes(slide),'KeyS did not enter slide state');
 await page.evaluate(()=>{__qa.seek(4652);__qa.step([],1)});
 await page.screenshot({path:path.join(__dirname,'../qa/babylon-projector-v1.png')});
 const asset=await page.evaluate(async()=>{const im=new Image();im.src='assets/structures/memory-projector-babylon-v1.png';await im.decode();return {w:im.naturalWidth,h:im.naturalHeight};});
 assert(asset.w>1500&&asset.h>500,'memory projector sheet did not load at production resolution');
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log(JSON.stringify({ok:true,asset,before,after,slide,screenshot:'qa/babylon-projector-v1.png'}));
})().catch(e=>{console.error(e);process.exit(1)});
