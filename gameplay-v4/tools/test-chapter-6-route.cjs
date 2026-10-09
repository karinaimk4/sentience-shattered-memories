const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const SAVE='sentience-gameplay-v4-save-20260926';

function seed(){
 const s=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 Object.assign(s,{chapter:6,chapters:[1,2,3,4,5,6],cleared:[2000,3200,4300,5440,6580],checkpoint:{m:6580,hp:2715},level:50,gold:9000,materials:100,weapons:['sword','spear','chain'],weapon:'sword',weaponLevels:{sword:5,spear:5,chain:5},assistUnlocked:true,dualUnlocked:true,storyEvents:[],memories:['main-1','main-2','main-3','main-4','main-5'],collected:[],visited:[0,2000,3200,4300,5440,6580],defeated:[],seenScenes:[]});
 s.forgeParts={...(s.forgeParts||{}),oblivion_inscription:0};
 s.cores={cas_ii_namiko:{level:35,cap:35}};s.equippedCore='cas_ii_namiko';
 s.stigmaInventory={'marco_polo:T':{level:50},'marco_polo:M':{level:50},'marco_polo:B':{level:50}};s.slots={T:'marco_polo:T',M:'marco_polo:M',B:'marco_polo:B'};
 return s;
}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const msg=e.stack||e.message;if(!msg.includes('widget.sndcdn.com'))errors.push(msg)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed()]);
 const base=(process.env.HOS_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'');
 await page.goto(base+'/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.manual();__qa.start('story')});await page.evaluate(require('./bot.cjs'));
 let s;
 for(let i=0;i<420;i++){
  s=await page.evaluate(()=>drive(600));
  if(i%12===0||s.phase==='finished'||s.stalled)console.log(JSON.stringify({i,m:Math.round(s.p.x/64),phase:s.phase,scene:s.scene,arena:s.arena?.m,wave:s.wave,boss:s.enemies.find(e=>e.ai)?.ai,jizo:s.jizoRecord,parts:s.save.forgeParts?.oblivion_inscription,side:s.sideStories?.map(q=>q.state),respawns:s.metrics.respawns}));
  if(s.phase==='dying'&&s.metrics.respawns<18){await page.evaluate(()=>__qa.step([],80));continue;}
  if(s.phase==='finished'||s.stalled||s.phase==='dying')break;
 }
 await page.screenshot({path:path.join(__dirname,'../qa/ch6-final.png'),fullPage:true});
 const result={phase:s.phase,m:s.p.x/64,clear:s.clear,events:s.storyEvents,memories:s.memories,sideStories:s.sideStories,record:s.jizoRecord,parts:s.save.forgeParts?.oblivion_inscription,album:s.album,metrics:s.metrics,errors};
 fs.writeFileSync(path.join(__dirname,'../qa/ch6-route.json'),JSON.stringify(result,null,2));
 assert.deepEqual(errors,[]);assert.equal(s.phase,'finished');assert(s.clear.includes(7720));assert(s.memories.includes('main-6'));assert.equal(s.jizoRecord.maxRound,4);assert.equal(s.jizoRecord.maxCycle,3);assert.equal(s.jizoRecord.evades,6);assert.equal(s.jizoRecord.armorBreaks,3);assert.equal(s.jizoRecord.rodsBroken,3);assert.equal(s.jizoRecord.coresBroken,3);assert.equal(s.jizoRecord.dualBreaks,3);assert(s.sideStories.every(q=>q.state==='done'));assert.equal(s.save.forgeParts.oblivion_inscription,8);assert(s.storyEvents.includes('forge-keys-oblivion'));assert.equal(s.metrics.yattas,4);
 console.log(JSON.stringify({chapter:6,phase:s.phase,record:s.jizoRecord,parts:s.save.forgeParts.oblivion_inscription,sideStories:s.sideStories.map(q=>q.id),respawns:s.metrics.respawns,errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
