const {chromium}=require('./playwright-runtime.cjs');
const {spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'qa','chapter-5-boss-video');
const rawDir=path.join(out,'raw');
const SAVE='sentience-gameplay-v4-save-20260926';
const baseUrl=process.env.HOS_BASE_URL||'http://127.0.0.1:4190';
const preview=process.env.HOS_PREVIEW==='1';
const huaOnly=process.env.HOS_HUA_ONLY==='1';
const ffmpeg='C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0-full_build\\bin\\ffmpeg.exe';
fs.mkdirSync(rawDir,{recursive:true});

function seed(){
 const s=JSON.parse(fs.readFileSync(path.join(root,'qa','boss-checkpoint.json'),'utf8'));
 s.chapter=5;s.chapters=[1,2,3,4,5];s.level=50;s.checkpoint={m:6340,hp:4200};
 s.cleared=[2000,2200,2560,2850,3200,3420,3705,3990,4300,4560,4845,5130,5440,5700,5985,6270];
 s.visited=[...(s.visited||[]),5480,5590,5765,5920,6050,6205,6340,6465,6545];
 s.weapons=['sword','spear','chain'];s.weapon='sword';s.weaponLevels={sword:4,spear:4,chain:4};
 s.assistUnlocked=true;s.dualUnlocked=true;s.nodes=['ink-gate','silent-anchor','distant-anchor'];
 s.storyEvents=['ch5-opening','ch5-perfect','ch5-warning','ch5-branch-a','ch5-branch-b','ch5-branch-c','branch-a:cleared','branch-b:cleared','branch-c:cleared','ch5-testimonies','ch5-night-silent','ch5-side-bowl','ch5-side-hide','ch5-side-painting','ch5-side-moon','ch5-courtyard-tea','ch5-courtyard-all','ch5-combat-v3-migrated'];
 s.courtyard={tasks:Object.fromEntries(['leaves','water','post','wood','blanket','garden','cat','bell','roof','tea'].map(id=>[id,'done'])),secret:true,visited:true,teaTypes:['cúc','trà xanh'],tomorrow:true,decor:['leaves','water','post','wood','blanket','garden','cat','bell','roof','tea']};
 s.memories=['main-1','main-2','main-3','main-4'];
 s.cores={cas_ii_namiko:{level:35,cap:35}};s.equippedCore='cas_ii_namiko';
 s.stigmaInventory={'marco_polo:T':{level:50},'marco_polo:M':{level:50},'marco_polo:B':{level:50}};s.slots={T:'marco_polo:T',M:'marco_polo:M',B:'marco_polo:B'};
 return s;
}
function ff(args){const r=spawnSync(ffmpeg,args,{stdio:'inherit'});if(r.status!==0)throw Error('ffmpeg failed');}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,recordVideo:{dir:rawDir,size:{width:1440,height:900}}});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed()]);
 await page.goto(baseUrl.replace(/\/$/,'')+'/?qa=1');await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:60000});
 await page.addStyleTag({content:'#battle-track{display:none!important}'});
 await page.evaluate(()=>{__qa.start('story');__qa.manual()});await page.evaluate(require('./bot.cjs'));
 const epoch=Date.now();let s,started=false,loops=0,lastStage=-1,lastBoss='',stageFrames=0;
 while(loops++<7000){
  s=await page.evaluate(()=>__qa.snapshot());
  if(s.arena?.m===6580)started=true;
  if(s.phase==='dialogue'){
   const showingHua=s.enemies.some(e=>e.ai?.type==='phantom');await page.evaluate(()=>__qa.step([],70));await page.waitForTimeout(huaOnly&&!showingHua?2:started?(preview?420:820):760);await page.evaluate(()=>__qa.advance());continue;
  }
  const boss=s.enemies.find(e=>e.ai&&e.hp>0),bossName=boss?.ai?.type||'';
  const stage=bossName==='seven-swords'?(boss.ai.formationRound||0):bossName==='phantom'?boss.ai.phase*10+(boss.ai.broken?.length||0):-1;
  if(bossName!==lastBoss||stage!==lastStage){lastBoss=bossName;lastStage=stage;stageFrames=0;if(started)await page.waitForTimeout(320);}else stageFrames++;
  if(s.phase==='finished')break;
  if(s.phase==='dying')throw Error('Boss demo died before completion');
  const showcase=huaOnly?bossName==='phantom'&&stageFrames<(boss.ai.phase===1?520:360):!preview||bossName==='seven-swords'&&stageFrames<105||bossName==='phantom'&&stageFrames<185;
  await page.evaluate(n=>drive(n),showcase?1:12);await page.waitForTimeout(started?(showcase?17:1):2);
 }
 assert.equal(s.phase,'finished','Chapter 5 boss sequence did not finish');
 assert.deepEqual(errors,[]);assert.equal(s.metrics.respawns,0);assert((s.sevenSwordsRecord?.maxRound||0)>=3);assert((s.sevenSwordsRecord?.formationEvades||0)>=6);assert((s.phantomRecord?.phase||0)>=2);assert((s.phantomRecord?.weaponBreaks?.length||0)>=3);assert((s.phantomRecord?.dualBreaks||0)>=1);
 await page.waitForTimeout(1600);const video=page.video();await context.close();const raw=await video.path();await browser.close();
 const silent=path.join(out,'chapter-5-bosses-silent.mp4');
 ff(['-y','-i',raw,'-vf','scale=1280:800:flags=lanczos,fps=30','-an','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p',silent]);
 const final=path.join(root,huaOnly?'demo-hua-animation-smooth-v5.mp4':preview?'demo-ch5-multi-turn-story-v4.mp4':'demo-ch5-that-kiem-hu-anh-phu-hoa.mp4');const music=path.join(root,'assets','audio','official-site-bgm.mp3');
 ff(['-y','-i',silent,'-stream_loop','-1','-i',music,'-filter_complex','[1:a]volume=0.2,afade=t=in:st=0:d=1.2[a]','-map','0:v:0','-map','[a]','-shortest','-c:v','copy','-c:a','aac','-b:a','160k','-movflags','+faststart',final]);
 const meta={final,bytes:fs.statSync(final).size,durationSeconds:(Date.now()-epoch)/1000,sevenSwordsRecord:s.sevenSwordsRecord,phantomRecord:s.phantomRecord,metrics:s.metrics,errors};
 fs.writeFileSync(path.join(out,'meta.json'),JSON.stringify(meta,null,2));console.log(JSON.stringify(meta));
})().catch(e=>{console.error(e);process.exit(1)});
