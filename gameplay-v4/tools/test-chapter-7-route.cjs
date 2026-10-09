const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const SAVE='sentience-gameplay-v4-save-20260926';
function seed(){
 const s=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 Object.assign(s,{chapter:7,chapters:[1,2,3,4,5,6,7],cleared:[2000,3200,4300,5440,6580,7720],checkpoint:{m:7720,hp:4200},level:50,gold:16000,crystals:300,materials:200,weapons:['sword','spear','chain'],weapon:'sword',weaponLevels:{sword:50,spear:50,chain:50},assistUnlocked:true,dualUnlocked:true,endlessUnlocked:false,storyEvents:[],memories:['main-1','main-2','main-3','main-4','main-5','main-6',...Array.from({length:12},(_,i)=>`hidden-${i+1}`)],collected:[],visited:[0,2000,3200,4300,5440,6580,7720],defeated:[],seenScenes:[]});
 s.cores={cas_ii_namiko:{level:35,cap:35},keys_oblivion:{level:50,cap:50}};s.equippedCore='keys_oblivion';
 s.stigmaInventory={'sirin_ascendant:T':{level:50},'sirin_ascendant:M':{level:50},'sirin_ascendant:B':{level:50}};s.slots={T:'sirin_ascendant:T',M:'sirin_ascendant:M',B:'sirin_ascendant:B'};s.forgeParts={};
 if(process.env.HOS_BOSS_ONLY==='1'){
  s.checkpoint={m:8860,hp:4200};
  s.storyEvents=[...Array.from({length:6},(_,i)=>`ch7-altar-${i+1}`),'ch7-burnt-meal:done','ch7-false-apology:done','ch7-reverse-temptation:done'];
  s.memories.push('hidden-13');
 }
 if(process.env.HOS_SECRET_TEST==='1'&&!s.memories.includes('hidden-14'))s.memories.push('hidden-14');
 return s;
}
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),[SAVE,seed()]);const base=(process.env.HOS_BASE_URL||'http://127.0.0.1:4192').replace(/\/$/,'');
 await page.goto(base+'/?qa=1');await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:60000});await page.evaluate(()=>{__qa.start('story');__qa.manual()});await page.evaluate(require('./bot.cjs'));
 let s;for(let i=0;i<650;i++){s=await page.evaluate(()=>drive(600));if(i%15===0||s.phase==='finished'||s.stalled)console.log(JSON.stringify({i,m:Math.round(s.p.x/64),phase:s.phase,arena:s.arena?.m,wave:s.wave,boss:s.enemies.find(e=>e.ai)?.ai,altars:s.ch7Altars?.length,side:s.sideStories?.map(q=>q.state),record:s.mnemosyneRecord,respawns:s.metrics.respawns}));if(s.phase==='dying'&&s.metrics.respawns<24){await page.evaluate(()=>__qa.step([],90));continue;}if(s.phase==='finished'||s.stalled||s.phase==='dying')break;}
 await page.screenshot({path:path.join(__dirname,'../qa/ch7-final.png'),fullPage:true});const result={phase:s.phase,m:s.p.x/64,clear:s.clear,events:s.storyEvents,memories:s.memories,sideStories:s.sideStories,altars:s.ch7Altars,record:s.mnemosyneRecord,album:s.album,save:s.save,metrics:s.metrics,errors};fs.writeFileSync(path.join(__dirname,'../qa/ch7-route.json'),JSON.stringify(result,null,2));
 assert.deepEqual(errors,[]);assert.equal(s.phase,'finished');assert(s.clear.includes(8900));assert(s.memories.includes('main-7'));assert.equal(s.ch7Altars.length,6);assert(s.sideStories.every(q=>q.state==='done'));assert.equal(s.mnemosyneRecord.maxPhase,3);assert.equal(s.mnemosyneRecord.maxRound,4);assert(s.mnemosyneRecord.fakeBreaks>=1);assert.equal(s.mnemosyneRecord.qteSteps,5);assert(s.storyEvents.includes('ch7-ending-main'));assert(s.storyEvents.includes('forge-domain'));assert.equal(s.save.endlessUnlocked,true);assert(s.album.unlocked.includes('7-09'));
 console.log(JSON.stringify({chapter:7,phase:s.phase,record:s.mnemosyneRecord,side:s.sideStories.map(q=>q.id),altars:s.ch7Altars.length,secret:s.storyEvents.includes('ch7-ending-secret'),respawns:s.metrics.respawns,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
