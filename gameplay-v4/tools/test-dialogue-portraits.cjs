const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),SAVE='sentience-gameplay-v4-save-20260926';

function seed(){
 const s=JSON.parse(fs.readFileSync(path.join(root,'qa','boss-checkpoint.json'),'utf8'));
 s.chapter=5;s.chapters=[1,2,3,4,5];s.level=50;s.checkpoint={m:5697,hp:4200};
 s.cleared=[2000,2200,2560,2850,3200,3420,3705,3990,4300,4560,4845,5130,5440];
 s.weapons=['sword','spear','chain'];s.weapon='sword';s.weaponLevels={sword:4,spear:4,chain:4};
 s.assistUnlocked=true;s.dualUnlocked=false;s.memories=['main-1','main-2','main-3','main-4'];
 s.storyEvents=['ch5-opening','ch5-perfect','ch5-branch-a','ch5-combat-v3-migrated'];
 return s;
}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed()]);
 const base=process.env.HOS_BASE_URL||'http://127.0.0.1:4181/build-assets-v4/';
 await page.goto(base.replace(/\/?$/,'/')+'?qa=1&portrait-test='+Date.now());
 await page.waitForFunction(()=>window.__qa?.ready&&window.__qaPortrait);
 const characters=['Senti','HoS','Phù Hoa','Fu Hua','Fu Hua · Vọng ảnh','Lâm Triều Vũ','Tô My','Giang Uyển Hề','Giang Uyển Như','Trình Lăng Sương','Mã Ngạn Khanh','Tần Tố Y','Nagazora Husk','Mnemosyne','Giọng nói lạ','Hư Ảnh Phù Hoa'];
 const portraits=await page.evaluate(names=>names.map(name=>window.__qaPortrait(name)),characters);
 for(const p of portraits){assert(!p.kind.startsWith('evidence-'),`${p.speaker} vẫn dùng ảnh vật chứng`);assert(p.painted>900,`${p.speaker} không vẽ được chân dung`);}
 await page.evaluate(()=>{window.__qa.start('story');window.__qa.manual();window.__qa.seek(5701);window.__qa.step([],1)});
 for(let i=0;i<80;i++){
  const phase=await page.evaluate(()=>window.__qa.snapshot().phase),speaker=await page.locator('#speaker').textContent();
  if(phase==='dialogue'&&speaker==='Lâm Triều Vũ')break;
  if(phase==='dialogue')await page.evaluate(()=>{window.__qa.advance();window.__qa.advance()});
  else await page.evaluate(()=>window.__qa.step(['KeyD'],2));
 }
 assert.equal(await page.locator('#speaker').textContent(),'Lâm Triều Vũ');
 assert.equal(await page.locator('#portrait').getAttribute('data-portrait'),'seven-sword-1');
 await page.screenshot({path:path.join(root,'qa','dialogue-portrait-lam-trieu-vu.png')});
 console.log(JSON.stringify({portraits,shown:await page.locator('#speaker').textContent(),asset:await page.locator('#portrait').getAttribute('data-portrait'),errors},null,2));
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
