const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 seed.chapter=3;seed.chapters=[1,2,3];seed.cleared=[2000,2200,2560,2850,3200];seed.checkpoint={m:3200,hp:1800};seed.weapons=['sword','spear'];seed.weapon='spear';seed.weaponLevels={sword:4,spear:4,chain:0};seed.level=12;seed.storyEvents=[...(seed.storyEvents||[]),'ch2-opening'];seed.memories=[...(seed.memories||[]),'main-1','main-2'];seed.cores={cas_ii_namiko:{level:35,cap:35}};seed.equippedCore='cas_ii_namiko';seed.stigmaInventory={'marco_polo:T':{level:50},'marco_polo:M':{level:50},'marco_polo:B':{level:50}};seed.slots={T:'marco_polo:T',M:'marco_polo:M',B:'marco_polo:B'};
 const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const message=e.stack||e.message;if(message.includes('widget.sndcdn.com'))return;errors.push(message);console.error('PAGE ERROR',message)});
 page.on('console',msg=>{if(msg.type()==='error')console.error('BROWSER',msg.text())});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),['sentience-gameplay-v4-save-20260926',seed]);
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.manual();__qa.start('story')});await page.evaluate(require('./bot.cjs'));
 let s,scene='',captures=[];
 for(let i=0;i<220;i++){
  s=await page.evaluate(()=>drive(600));
  if(s.scene!==scene&&s.scene){scene=s.scene;captures.push(scene);await page.screenshot({path:path.join(__dirname,`../qa/ch3-${scene}.png`)});}
  if(i%5===0||s.stalled||s.phase==='finished')console.log(JSON.stringify({i,m:Math.round(s.p.x/64),phase:s.phase,scene:s.scene,hp:s.hp,arena:s.arena?.m,wave:s.wave,weapon:s.save.weapon,nodes:s.nodes.map(n=>n.destroyed),assist:s.save.assistUnlocked,boss:s.enemies.find(e=>e.ai)?.ai,errors:errors.length}));
  if(s.phase==='dying'&&s.metrics.respawns<8){await page.evaluate(()=>__qa.step([],80));continue;}
  if(s.phase==='finished'||s.stalled||s.phase==='dying')break;
 }
 const result={phase:s.phase,m:s.p.x/64,captures,clear:s.clear,memories:s.memories,sideStories:s.sideStories,storyEvents:s.storyEvents,assist:s.save.assistUnlocked,chapter:s.save.chapter,checkpoint:s.save.checkpoint.m,record:s.heimdallRecord,metrics:s.metrics,errors};
 fs.writeFileSync(path.join(__dirname,'../qa/ch3-route.json'),JSON.stringify(result,null,2));await browser.close();console.log(JSON.stringify(result));
 assert.deepEqual(errors,[]);assert.equal(s.phase,'finished');assert(s.clear.includes(4300));assert(s.memories.includes('main-3'));assert(s.save.assistUnlocked);assert.equal(s.save.chapter,4);assert.equal(s.metrics.yattas,4);
 for(const id of ['ch3-arrival','ch3-vault','ch3-pipe','ch3-assist','ch3-airfield'])assert(s.storyEvents.includes(id),'Missing story scene '+id);
 for(const id of ['ch3-side-erased:done','ch3-side-technician:done'])assert(s.storyEvents.includes(id),'Missing side story '+id);
})().catch(e=>{console.error(e);process.exit(1)});
