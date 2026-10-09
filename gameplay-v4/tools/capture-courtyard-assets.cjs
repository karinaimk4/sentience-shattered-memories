const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs');
const path=require('node:path');
const SAVE='sentience-gameplay-v4-save-20260926';
const TASKS=['leaves','water','post','wood','blanket','garden','cat','bell','roof','tea'];

function seed(completed=false){
 const base=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 base.chapter=5;
 base.chapters=[1,2,3,4,5];
 base.cleared=[2000,2200,2560,2850,3200,3420,3705,3990,4300,4560,4845,5130,5440];
 base.checkpoint={m:5590,hp:1800};
 base.weapons=['sword','spear','chain'];
 base.weapon='sword';
 base.weaponLevels={sword:4,spear:4,chain:4};
 base.storyEvents=['ch5-opening','ch5-branch-a','ch5-branch-b','ch5-branch-c','ch5-night-silent'];
 base.courtyard={tasks:completed?Object.fromEntries(TASKS.map(id=>[id,'done'])):{},secret:completed,visited:true,teaTypes:completed?['cúc','trà xanh']:[],tomorrow:completed,decor:completed?[...TASKS]:[]};
 return base;
}

async function openCourtyard(browser,completed,file){
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')console.error('BROWSER',m.text());});
 page.on('requestfailed',r=>console.error('REQUEST',r.url(),r.failure()?.errorText));
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed(completed)]);
 await page.goto((process.env.HOS_BASE_URL||'http://127.0.0.1:4190').replace(/\/$/,'')+'/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:60000});
 await page.evaluate(()=>{__qa.manual();__qa.start('story');__qa.enterCourtyard();__qa.step([],2);});
 if(completed){
  await page.evaluate(()=>{__qa.step(['KeyA'],22);__qa.step([],1);__qa.step(['KeyE'],1);__qa.step([],2);});
 }else{
  await page.evaluate(()=>{__qa.step(['KeyA'],22);__qa.step([],1);__qa.step(['KeyE'],1);__qa.step([],1);__qa.step(['KeyE'],1);__qa.step([],2);});
 }
 const snap=await page.evaluate(()=>__qa.snapshot());
 console.log(JSON.stringify({file,phase:snap.phase,courtyard:snap.courtyard,errors},null,2));
 await page.locator('#game').screenshot({path:path.join(__dirname,'../qa',file),timeout:60000});
 await page.close();
 if(errors.length)throw new Error(errors.join('\n'));
 if(snap.phase!=='courtyard')throw new Error(`Expected courtyard, got ${snap.phase}`);
}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 await openCourtyard(browser,true,'courtyard-assets-complete.png');
 await openCourtyard(browser,false,'courtyard-assets-leaves.png');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
