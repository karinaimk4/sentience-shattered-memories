const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const SAVE='sentience-gameplay-v4-save-20260926',root=path.resolve(__dirname,'..');
const base=JSON.parse(fs.readFileSync(path.join(root,'qa','boss-checkpoint.json'),'utf8'));
Object.assign(base,{chapter:3,chapters:[1,2,3],cleared:[2000,2200,2560,2850,3200,3420,3705,3990],checkpoint:{m:4265,hp:2600},weapons:['sword','spear'],weapon:'spear',weaponLevels:{sword:4,spear:4,chain:0},level:12,assistUnlocked:true,dualUnlocked:false,nodes:['glass-wall','coolant-pipe','quarantine-wall'],storyEvents:['ch3-opening','ch3-arrival','ch3-vault','ch3-pipe','ch3-assist','ch3-airfield'],memories:['main-1','main-2','main-3'],cores:{cas_ii_namiko:{level:35,cap:35}},equippedCore:'cas_ii_namiko',stigmaInventory:{'marco_polo:T':{level:50},'marco_polo:M':{level:50},'marco_polo:B':{level:50}},slots:{T:'marco_polo:T',M:'marco_polo:M',B:'marco_polo:B'}});
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,base]);
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:60000});await page.evaluate(()=>{__qa.start('story');__qa.manual()});
 const parryProbe=await page.evaluate(()=>__qa.step(['KeyK'],1));assert.equal(parryProbe.save.weapon,'sword','K must auto-switch from spear to sword');assert(parryProbe.parry>.4,'K parry window must be visible and forgiving');await page.evaluate(()=>__qa.step([],1));await page.evaluate(require('./bot.cjs'));
 let s;for(let i=0;i<1800;i++){s=await page.evaluate(()=>drive(3));if(s.phase==='dialogue'){await page.evaluate(()=>__qa.step([],90));await page.evaluate(()=>__qa.advance());continue;}if(s.enemies.some(e=>e.ai?.type==='heimdall'&&e.hp>0))break;}
 const boss=s.enemies.find(e=>e.ai?.type==='heimdall'&&e.hp>0);assert(boss,'Heimdall did not spawn');await page.screenshot({path:path.join(root,'qa','heimdall-art-phase1.png')});
 for(let i=0;i<2600;i++){s=await page.evaluate(()=>drive(3));if(s.phase==='dialogue'){await page.evaluate(()=>__qa.step([],90));await page.evaluate(()=>__qa.advance());continue;}const h=s.enemies.find(e=>e.ai?.type==='heimdall'&&e.hp>0);if(h?.ai.phase===2){await page.screenshot({path:path.join(root,'qa','heimdall-art-phase2.png')});break;}}
 assert.equal(errors.length,0,errors.join('\n'));console.log(JSON.stringify({phase1:true,phase2:!!s.enemies.find(e=>e.ai?.type==='heimdall'&&e.ai.phase===2),asset:'assets/boss/heimdall-combat-v1.png',errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
