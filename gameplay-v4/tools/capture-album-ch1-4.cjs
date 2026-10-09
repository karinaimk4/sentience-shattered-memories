const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const SAVE='sentience-gameplay-v4-save-20260926';

function seed(){
 const base=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json'),'utf8'));
 base.chapter=5;
 base.chapters=[1,2,3,4,5];
 base.cleared=[2000,2200,2560,2850,3200,3420,3705,3990,4300,4560,4845,5130,5440];
 base.checkpoint={m:5590,hp:1800};
 base.album={unlocked:[],marks:{},keepsakes:['Bảng hiệu bánh bao','Hồ sơ #28','Hai vật nhỏ trong tuyết'],side:[]};
 return base;
}

async function waitImages(page){
 await page.waitForFunction(()=>[...document.querySelectorAll('.memory-card img,#album-preview')].every(img=>img.complete&&img.naturalWidth>0),null,{timeout:60000});
 await page.waitForTimeout(250);
}

(async()=>{
 const albumDir=path.join(__dirname,'../assets/album');
 assert.equal(fs.readdirSync(albumDir).filter(x=>x.endsWith('.png')).length,36);
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed()]);
 await page.goto('http://127.0.0.1:4190/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:60000});
 await page.click('#album');
 await waitImages(page);
 assert.equal(await page.locator('.memory-card.unlocked').count(),9);
 await page.screenshot({path:path.join(__dirname,'../qa/album-ch1-final.png')});
 const counts={1:9};
 for(const chapter of [2,3,4]){
  await page.click(`[data-album-chapter="${chapter}"]`);
  await waitImages(page);
  counts[chapter]=await page.locator('.memory-card.unlocked').count();
  assert.equal(counts[chapter],9);
  assert.equal(await page.locator('.memory-card img').evaluateAll(imgs=>imgs.filter(img=>!img.complete||!img.naturalWidth).length),0);
 }
 await page.locator('.memory-card.unlocked').nth(7).click();
 await page.screenshot({path:path.join(__dirname,'../qa/album-ch4-final.png')});
 await page.click('#album-replay');
 await page.waitForSelector('.album-replay-dialog[open]');
 await page.waitForFunction(()=>document.querySelector('.album-replay-dialog img')?.complete);
 await page.screenshot({path:path.join(__dirname,'../qa/album-replay-final.png')});
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({artFiles:36,cardsByChapter:counts,replay:true,errors},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
