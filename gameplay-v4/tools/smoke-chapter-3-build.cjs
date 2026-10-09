const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const seed=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 seed.chapter=3;seed.chapters=[1,2,3];seed.cleared=[2000,2200,2560,2850,3200];seed.checkpoint={m:3200,hp:1200};seed.weapons=['sword','spear'];seed.weapon='spear';seed.weaponLevels={sword:2,spear:2,chain:0};seed.storyEvents=[...(seed.storyEvents||[]),'ch2-opening'];seed.memories=[...(seed.memories||[]),'main-1','main-2'];
 const browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),['sentience-gameplay-v4-save-20260926',seed]);
 await page.goto('http://127.0.0.1:4181/build/');await page.waitForSelector('#story:not([disabled])');
 assert.equal(await page.evaluate(()=>typeof window.__qa),'undefined');
 await page.click('#story');
 for(let i=0;i<12;i++){const visible=await page.locator('#dialogue').isVisible();if(!visible)break;await page.click('#next-dialogue');await page.click('#next-dialogue');}
 await page.waitForFunction(()=>document.querySelector('#location')?.textContent.includes('CHƯƠNG 03'));
 const state=await page.evaluate(()=>({location:document.querySelector('#location').textContent,objective:document.querySelector('#objective').textContent,chapter:JSON.parse(localStorage.getItem('sentience-gameplay-v4-save-20260926')).chapter}));
 await page.screenshot({path:path.join(__dirname,'../qa/build-chapter-3.png')});await browser.close();
 assert.deepEqual(errors,[]);assert.equal(state.chapter,3);assert.match(state.location,/CHƯƠNG 03/);console.log('Production Chapter 3 PASS:',state);
})().catch(e=>{console.error(e);process.exit(1)});
