const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const SAVE='sentience-gameplay-v4-save-20260926';

function seed(){
 const s=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 Object.assign(s,{chapter:7,chapters:[1,2,3,4,5,6,7],cleared:[2000,3200,4300,5440,6580,7720],checkpoint:{m:7720,hp:2600},weapons:['sword','spear','chain'],weapon:'sword',assistUnlocked:true,dualUnlocked:true,storyEvents:[],memories:['main-1','main-2','main-3','main-4','main-5','main-6'],collected:[],visited:[0,2000,3200,4300,5440,6580,7720],defeated:[],seenScenes:[]});
 return s;
}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>{const detail=e.stack||e.message;if(!detail.includes('widget.sndcdn.com'))errors.push(detail)});
 page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:4181/'))errors.push(r.status()+' '+r.url())});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed()]);
 await page.goto('http://127.0.0.1:4181/build/');
 await page.waitForFunction(()=>!document.querySelector('#story').disabled);
 assert((await page.locator('#story').textContent()).includes('CHƯƠNG 07'));
 await page.locator('#story').click();
 assert((await page.locator('#location').textContent()).includes('CHƯƠNG 07'));
 assert(await page.locator('#dialogue').isVisible());
 await page.screenshot({path:path.join(__dirname,'../qa/build-chapter-7.png')});
 assert.deepEqual(errors,[]);
 assert.equal(await page.evaluate(()=>typeof window.__qa),'undefined');
 await browser.close();
 console.log('Production Chapter 7 PASS: completed Chapter 6 save opens Imaginary Tree without QA hooks');
})().catch(e=>{console.error(e);process.exit(1)});
