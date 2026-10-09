const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 seed.chapter=3;seed.chapters=[1,2,3];seed.cleared=[2000,2200,2560,2850,3200,3420];seed.checkpoint={m:3485,hp:1800};
 seed.weapons=['sword','spear'];seed.weapon='spear';seed.weaponLevels={sword:4,spear:4,chain:0};seed.level=12;
 seed.memories=['main-1','main-2'];seed.storyEvents=['ch2-opening','ch3-opening','ch3-arrival','ch3-beat-0','ch3-clue-0','ch3-vault'];
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),['sentience-gameplay-v4-save-20260926',seed]);
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.manual();__qa.start('story')});await page.evaluate(require('./bot.cjs'));
 await page.evaluate(()=>{bot.ignoreInteractions=true;drive(1800,3509)});await page.screenshot({path:path.join(__dirname,'../qa/side-item-world.png')});
 await page.evaluate(()=>{bot.ignoreInteractions=false;bot.pauseDialogues=true;drive(30)});await page.evaluate(()=>__qa.step([],20));
 const state=await page.evaluate(()=>__qa.snapshot());await page.screenshot({path:path.join(__dirname,'../qa/side-item-dialogue.png')});
 assert.equal(state.phase,'dialogue');assert.equal(state.sideStories[0].item,'mnemosyne_record');assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: distinct side-story item renders in the world and dialogue.');
})().catch(e=>{console.error(e);process.exit(1)});
