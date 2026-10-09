const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const base=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 base.chapter=2;base.chapters=[1,2];base.cleared=[...new Set([...base.cleared,2000])];base.checkpoint={m:2000,hp:1000};base.nodes=['loop-light','escape-1','escape-2','escape-3'];base.memories=[...new Set([...(base.memories||[]),'main-1'])];
 const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const detail=e.stack||e.message;if(!detail.includes('widget.sndcdn.com'))errors.push(detail)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),['sentience-gameplay-v4-save-20260926',base]);
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.manual();__qa.start('story')});await page.evaluate(require('./bot.cjs'));await page.evaluate(()=>{bot.seekMemories=true});
 let s,scene='',captures=[];
 for(let i=0;i<150;i++){
  s=await page.evaluate(()=>drive(600));
  if(s.scene!==scene&&s.scene){scene=s.scene;captures.push(scene);await page.screenshot({path:path.join(__dirname,`../qa/ch2-${scene}.png`)});}
  if(i%4===0||s.stalled||s.phase==='finished')console.log(JSON.stringify({i,m:Math.round(s.p.x/64),phase:s.phase,scene:s.scene,hp:s.hp,arena:s.arena?.m,wave:s.wave,weapon:s.save.weapon,nodes:s.nodes.map(n=>n.destroyed),memories:s.memories,errors:errors.length}));
  if(s.phase==='dying'&&s.metrics.respawns<5){await page.evaluate(()=>__qa.step([],80));continue;}
  if(s.phase==='finished'||s.stalled||s.phase==='dying')break;
 }
 const result={phase:s.phase,m:s.p.x/64,captures,clear:s.clear,memories:s.memories,weapons:s.save.weapons,chapter:s.save.chapter,checkpoint:s.save.checkpoint.m,metrics:s.metrics,errors};
 fs.writeFileSync(path.join(__dirname,'../qa/ch2-route.json'),JSON.stringify(result,null,2));if(s.phase==='finished'){await page.evaluate(()=>__qa.step([],0));await page.screenshot({path:path.join(__dirname,'../qa/ch2-complete.png')});}await browser.close();console.log(JSON.stringify(result));
 assert.deepEqual(errors,[]);assert.equal(s.phase,'finished');assert(s.clear.includes(3200));assert(s.memories.includes('main-2'));assert(s.memories.includes('hidden-3'));assert(s.memories.includes('hidden-4'));assert(s.save.weapons.includes('spear'));assert.equal(s.metrics.yattas,4);
 for(const id of ['ch2-roof-choice','ch2-loop-proof','ch2-spear-memory','ch2-cargo-truth','ch2-train-vow'])assert(s.storyEvents.includes(id),'Missing story scene '+id);
})().catch(e=>{console.error(e);process.exit(1)});
