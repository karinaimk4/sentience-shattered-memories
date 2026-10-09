const {chromium}=require('./playwright-runtime.cjs');
const {spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),SAVE='sentience-gameplay-v4-save-20260926';
const chapter=JSON.parse(fs.readFileSync(path.join(root,'level-chapter-5.json'),'utf8'));
const base=JSON.parse(fs.readFileSync(path.join(root,'qa','boss-checkpoint.json'),'utf8'));
const sideIds=['ch5-side-bowl','ch5-side-hide','ch5-side-painting','ch5-side-moon'];
const ffmpeg='C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0-full_build\\bin\\ffmpeg.exe';
const rawDir=path.join(root,'qa','ch5-side-demo-raw');fs.mkdirSync(rawDir,{recursive:true});

function seed(m=5605){
 const s=structuredClone(base);s.chapter=5;s.chapters=[1,2,3,4,5];s.level=30;s.checkpoint={m,hp:3000};s.introSeen=true;
 s.cleared=[2000,2200,2560,2850,3200,3420,3705,3990,4300,4560,4845,5130,5440,5700,5985,6270];
 s.weapons=['sword','spear','chain'];s.weapon='sword';s.weaponLevels={sword:4,spear:4,chain:4};s.assistUnlocked=true;s.dualUnlocked=true;
 s.nodes=(chapter.nodes||[]).map(x=>x.id);s.storyEvents=[...new Set([...(chapter.beats||[]).map(x=>x.id),...(chapter.cutscenes||[]).map(x=>x.id),'ch5-branch-a','ch5-branch-b','ch5-branch-c','ch5-testimonies','ch5-night-silent','ch5-dual'])];
 s.courtyard={tasks:{},secret:false,visited:false,teaTypes:[],tomorrow:false,decor:[]};s.album={unlocked:['5-01','5-02','5-03','5-04','5-05'],marks:{'5-01':['white'],'5-02':['white','green','red']},keepsakes:[],side:[]};return s;
}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1152,height:648},deviceScaleFactor:1,recordVideo:{dir:rawDir,size:{width:1152,height:648}}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed()]);
 await page.goto((process.env.HOS_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'')+'/?qa=1');await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:60000});
 await page.addStyleTag({content:'#battle-track{display:none!important}'});
 const snap=()=>page.evaluate(()=>__qa.snapshot());
 const step=(codes=[],n=1)=>page.evaluate(([codes,n])=>__qa.step(codes,n,true),[codes,n]);
 const tap=async code=>{await step([code],1);await step([],1)};
 async function card(title,sub='',ms=1050){await page.evaluate(([title,sub])=>{document.querySelector('#demo-card')?.remove();const d=document.createElement('div');d.id='demo-card';d.innerHTML=`<b>${title}</b><span>${sub}</span>`;d.style.cssText='position:fixed;z-index:99999;inset:0;background:#090d17f2;color:#eef7f2;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Segoe UI,sans-serif;letter-spacing:4px;text-align:center';d.querySelector('b').style.cssText='font-size:32px;color:#bce8dc';d.querySelector('span').style.cssText='font-size:13px;margin-top:16px;letter-spacing:2px;color:#a7b8b8';document.body.append(d)},[title,sub]);await page.waitForTimeout(ms);await page.evaluate(()=>document.querySelector('#demo-card')?.remove());}
 async function label(text){await page.evaluate(text=>{document.querySelector('#demo-label')?.remove();const d=document.createElement('div');d.id='demo-label';d.textContent=text;d.style.cssText='position:fixed;z-index:99998;right:24px;top:22px;padding:10px 16px;background:#101a22e8;border:1px solid #91c8ba;color:#dff5ee;font:700 13px Segoe UI;letter-spacing:1px';document.body.append(d)},text)}
 async function drain(ms=260,limit=30){for(let i=0;i<limit&&(await snap()).phase==='dialogue';i++){await page.evaluate(()=>__qa.advance());await step([],2);await page.waitForTimeout(ms);await page.evaluate(()=>__qa.advance());await step([],2);}}
 async function loadSave(s){await page.evaluate(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,s]);await page.reload();await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:60000});await page.addStyleTag({content:'#battle-track{display:none!important}'});}

 await card('CHƯƠNG 5 · SIDE STORY','SÂN SAU THÁI HƯ VÀ BỐN KÝ ỨC PHỤ',1400);
 await page.evaluate(()=>{__qa.start('story');__qa.manual()});await drain(80);await page.evaluate(()=>__qa.enterCourtyard());await step([],2);
 await label('BẢNG VIỆC VẶT · 10 NHIỆM VỤ');await step(['KeyA'],22);await step([],1);await tap('KeyE');await page.waitForTimeout(1800);
 await tap('KeyE');await page.waitForTimeout(350);for(const x of [340,610,840]){for(let i=0;i<90;i++){const s=await snap();if(Math.abs(s.courtyard.x-x)<55)break;await step([s.courtyard.x<x?'KeyD':'KeyA'],3);}for(let i=0;i<180;i++){const s=await snap();if(s.courtyard.wind>-.05){await tap('KeyE');break;}await step([],1);}await page.waitForTimeout(420);}await drain(110);

 for(const id of sideIds){
  const q=chapter.sideStories.find(x=>x.id===id),checkpoint={"ch5-side-bowl":5765,"ch5-side-hide":5920,"ch5-side-painting":6205,"ch5-side-moon":6340}[id];await loadSave(seed(checkpoint));await page.evaluate(()=>{__qa.start('story');__qa.manual()});await drain(50);await page.evaluate(m=>__qa.seek(m),q.m);await step([],3);await label('KÝ ỨC PHỤ · '+q.title);await page.waitForTimeout(700);let s=await snap();for(let attempt=0;attempt<4&&s.phase!=='memory-trial';attempt++){await tap('KeyE');await drain(230);s=await snap();}assert.equal(s.phase,'memory-trial',id+' did not open');
  if(q.trial==='bowls'){
   for(let n=0;n<5;n++){s=await snap();const expected=[0,7,1,6,2,5,3,4][s.memoryTrial.step],cur=s.memoryTrial.cursor;if(cur===expected)await tap('KeyE');else await tap(((expected-cur+8)%8)<=4?'ArrowRight':'ArrowLeft');await page.waitForTimeout(250);n--;
    if((await snap()).memoryTrial.step>=4)break;}
  }else if(q.trial==='hide'){
   for(let i=0;i<5;i++){await tap('ArrowRight');await page.waitForTimeout(220);}await tap('KeyE');
  }else if(q.trial==='painting'){
   for(let n=0;n<3;n++){for(let i=0;i<120;i++){s=await snap();if(Math.abs(s.memoryTrial.pulse-.5)<.075)break;await step([],1);}await tap('KeyE');await page.waitForTimeout(320);}
  }else if(q.trial==='moon'){
   for(let i=0;i<120;i++){s=await snap();if(Math.abs(s.memoryTrial.pulse-.5)<.075)break;await step([],1);}await tap('KeyE');await page.waitForTimeout(450);await step([],112);await page.waitForTimeout(550);await step(['KeyE'],185);await step([],1);
  }
  await page.waitForTimeout(700);s=await snap();if(s.memoryTrial?.done){await tap('KeyE');await page.evaluate(()=>__qa.advance());await step([],2);await page.waitForTimeout(520);}await page.evaluate(()=>document.querySelector('#demo-label')?.remove());
 }

 const album=seed(5605);album.album={unlocked:['5-01','5-02','5-03','5-04','5-05'],marks:{'5-01':['white'],'5-02':['white','green','red'],'5-03':['white'],'5-04':['white','green','red'],'5-05':['white']},keepsakes:['Bát Gỗ Thứ Tám','Khăn Bịt Mắt','Bức Tranh Tám Người','Vỏ Kiếm Dưới Trăng','Hai Chén Trà'],side:['v-side-bowl','v-side-hide','v-side-painting','v-side-moon']};
 await loadSave(album);await page.click('#album');await page.click('[data-album-chapter="5"]');await label('ALBUM · KỶ VẬT ĐÃ LƯU');await page.waitForTimeout(2600);await card('SIDE STORY CHƯƠNG 5','HOÀN THÀNH',1100);
 const video=page.video();await context.close();const raw=await video.path();await browser.close();assert.deepEqual(errors,[]);
 const silent=path.join(root,'qa','demo-ch5-side-story-silent.mp4'),final=path.join(root,'demo-ch5-side-story-courtyard.mp4'),music=path.join(root,'assets','audio','official-site-bgm.mp3');
 let r=spawnSync(ffmpeg,['-y','-i',raw,'-vf','scale=1152:648:flags=lanczos,fps=30','-an','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p',silent],{stdio:'inherit'});if(r.status!==0)throw Error('ffmpeg video failed');
 r=spawnSync(ffmpeg,['-y','-i',silent,'-stream_loop','-1','-i',music,'-filter_complex','[1:a]volume=0.15,afade=t=in:st=0:d=0.8[a]','-map','0:v:0','-map','[a]','-shortest','-c:v','copy','-c:a','aac','-b:a','128k','-movflags','+faststart',final],{stdio:'inherit'});if(r.status!==0)throw Error('ffmpeg audio failed');
 console.log(JSON.stringify({final,bytes:fs.statSync(final).size,errors}));
})().catch(e=>{console.error(e);process.exit(1)});
