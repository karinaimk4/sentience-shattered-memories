const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path');
const SAVE='sentience-gameplay-v4-save-20260926';
(async()=>{
 const s=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 Object.assign(s,{chapter:6,chapters:[1,2,3,4,5,6],cleared:[2000,3200,4300,5440,6580,6840,7125,7410],checkpoint:{m:7685,hp:9000},level:50,gold:9000,materials:100,weapons:['sword','spear','chain'],weapon:'sword',weaponLevels:{sword:5,spear:5,chain:5},assistUnlocked:true,dualUnlocked:true,storyEvents:['ch6-reunion'],memories:['main-1','main-2','main-3','main-4','main-5'],collected:[],visited:[0,2000,3200,4300,5440,6580,7685],defeated:[],seenScenes:[]});
 s.cores={cas_ii_namiko:{level:35,cap:35}};s.equippedCore='cas_ii_namiko';
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1080}});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,s]);
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);await page.evaluate(()=>{__qa.manual();__qa.start('story')});await page.evaluate(require('./bot.cjs'));
 for(let i=0;i<360;i++){const x=await page.evaluate(()=>drive(60));const b=x.enemies.find(e=>e.ai);if(i%5===0||b?.ai.round>=3)console.log(JSON.stringify({i,phase:x.phase,m:x.p.x/64,weapon:x.save.weapon,attack:x.p.attack&&{weapon:x.p.attack.weapon,t:x.p.attack.t,hit:x.p.attack.hit},boss:b&&{x:b.x,d:b.x-x.p.x,hp:b.hp,ai:b.ai},record:x.jizoRecord}));if(x.phase==='finished'||x.phase==='dying')break;}
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
