const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const SAVE='sentience-gameplay-v4-save-20260926';
function seedFor(chapter){
 const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 seed.chapter=chapter;seed.chapters=chapter===4?[1,2,3,4]:[1,2,3,4,5];
 seed.cleared=chapter===4?[2000,2200,2560,2850,3200,3420,3705,3990,4300]:[2000,2200,2560,2850,3200,3420,3705,3990,4300,4560,4845,5130,5440];
 seed.checkpoint={m:chapter===4?4300:5440,hp:4200};seed.weapons=chapter===4?['sword','spear']:['sword','spear','chain'];seed.weapon='spear';seed.weaponLevels={sword:4,spear:4,chain:chapter===4?0:3};seed.level=50;seed.assistUnlocked=true;seed.dualUnlocked=false;seed.storyEvents=seed.storyEvents||[];seed.memories=[...new Set([...(seed.memories||[]),'main-1','main-2','main-3',...(chapter===5?['main-4']:[])])];seed.cores={cas_ii_namiko:{level:35,cap:35}};seed.equippedCore='cas_ii_namiko';seed.stigmaInventory={'marco_polo:T':{level:50},'marco_polo:M':{level:50},'marco_polo:B':{level:50}};seed.slots={T:'marco_polo:T',M:'marco_polo:M',B:'marco_polo:B'};return seed;
}
async function run(browser,chapter){
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];page.on('pageerror',e=>{const message=e.stack||e.message;if(message.includes('widget.sndcdn.com'))return;errors.push(message);console.error('PAGE ERROR',message)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seedFor(chapter)]);
 const base=process.env.HOS_BASE_URL||'http://127.0.0.1:4181';
 await page.goto(base.replace(/\/$/,'')+'/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);await page.evaluate(()=>{__qa.manual();__qa.start('story')});await page.evaluate(require('./bot.cjs'));
 let s;for(let i=0;i<300;i++){s=await page.evaluate(()=>drive(600));if(i%10===0||s.phase==='finished'||s.stalled)console.log(JSON.stringify({chapter,i,m:Math.round(s.p.x/64),phase:s.phase,hp:s.hp,arena:s.arena?.m,wave:s.wave,boss:s.enemies.find(e=>e.ai)?.ai,respawns:s.metrics.respawns,errors:errors.length}));if(s.phase==='dying'&&s.metrics.respawns<12){await page.evaluate(()=>__qa.step([],80));continue;}if(s.phase==='finished'||s.stalled||s.phase==='dying')break;}
 await page.screenshot({path:path.join(__dirname,`../qa/ch${chapter}-final.png`)});const result={chapter,phase:s.phase,m:s.p.x/64,clear:s.clear,events:s.storyEvents,memories:s.memories,sideStories:s.sideStories,dual:s.save.dualUnlocked,record:chapter===4?s.parvatiRecord:s.phantomRecord,metrics:s.metrics,errors};fs.writeFileSync(path.join(__dirname,`../qa/ch${chapter}-route.json`),JSON.stringify(result,null,2));await page.close();
 assert.deepEqual(errors,[]);assert.equal(s.phase,'finished');assert(s.clear.includes(chapter===4?5440:6580));assert(s.memories.includes(chapter===4?'main-4':'main-5'));assert((result.record?.phase||0)>=2);assert.equal(s.metrics.yattas,4);assert(s.sideStories.every(q=>q.state==='done'));if(chapter===4){assert(s.save.weapons.includes('chain'));assert(result.record.armorBroken>=1);assert(result.record.chainStops>=1);}else {assert(s.save.dualUnlocked);assert(result.record.parries>=1);assert(result.record.dualBreaks>=1);}return result;
}
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const results=[],requested=process.argv[2]?[Number(process.argv[2])]:[4,5];for(const chapter of requested)results.push(await run(browser,chapter));await browser.close();console.log(JSON.stringify(results.map(r=>({chapter:r.chapter,phase:r.phase,record:r.record,respawns:r.metrics.respawns,sideStories:r.sideStories}))));})().catch(e=>{console.error(e);process.exit(1)});
