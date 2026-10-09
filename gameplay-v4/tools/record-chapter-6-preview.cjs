const {chromium}=require('./playwright-runtime.cjs');
const {spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),rawDir=path.join(root,'qa','chapter-6-preview-raw');
const SAVE='sentience-gameplay-v4-save-20260926';
const ffmpeg='C:\\Users\\Admin\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0-full_build\\bin\\ffmpeg.exe';
fs.mkdirSync(rawDir,{recursive:true});
function seed(){const s=JSON.parse(fs.readFileSync(path.join(root,'qa','boss-checkpoint.json'),'utf8'));Object.assign(s,{chapter:6,chapters:[1,2,3,4,5,6],cleared:[2000,3200,4300,5440,6580,6840,7125,7410],checkpoint:{m:7685,hp:9000},level:50,gold:9000,materials:100,weapons:['sword','spear','chain'],weapon:'sword',weaponLevels:{sword:5,spear:5,chain:5},assistUnlocked:true,dualUnlocked:true,storyEvents:['ch6-senti-alone','ch6-hua-alone','ch6-overlap','ch6-refuse-sacrifice','ch6-nihilius-cameo','ch6-reunion'],memories:['main-1','main-2','main-3','main-4','main-5'],collected:[],visited:[0,2000,3200,4300,5440,6580,7685],defeated:[],seenScenes:[]});s.cores={cas_ii_namiko:{level:35,cap:35}};s.equippedCore='cas_ii_namiko';s.stigmaInventory={'marco_polo:T':{level:50},'marco_polo:M':{level:50},'marco_polo:B':{level:50}};s.slots={T:'marco_polo:T',M:'marco_polo:M',B:'marco_polo:B'};return s;}
function ff(args){const r=spawnSync(ffmpeg,args,{stdio:'inherit'});if(r.status!==0)throw Error('ffmpeg failed');}
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,recordVideo:{dir:rawDir,size:{width:1440,height:900}}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed()]);
 await page.goto((process.env.HOS_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'')+'/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);
 await page.addStyleTag({content:'#battle-track{display:none!important}'});await page.evaluate(()=>{__qa.start('story');__qa.manual()});await page.evaluate(require('./bot.cjs'));await page.evaluate(()=>bot.pauseDialogues=true);
 let state,loops=0,lastRound=0;
 while(loops++<5000){
  state=await page.evaluate(()=>__qa.snapshot());
  if(state.phase==='dialogue'){await page.evaluate(()=>__qa.step([],90));await page.waitForTimeout(560);await page.evaluate(()=>__qa.advance());continue;}
  if(state.phase==='finished')break;if(state.phase==='dying')throw Error('Jizo preview died');
  const boss=state.enemies.find(e=>e.ai?.type==='jizo'&&e.hp>0);if(boss&&boss.ai.round!==lastRound){lastRound=boss.ai.round;await page.screenshot({path:path.join(root,'qa',`ch6-jizo-turn-${lastRound}.png`)});await page.waitForTimeout(650);}
  await page.evaluate(()=>drive(4));await page.waitForTimeout(20);
 }
 assert.equal(state.phase,'finished');assert.deepEqual(errors,[]);assert.equal(state.jizoRecord.maxRound,4);assert.equal(state.jizoRecord.maxCycle,3);assert.equal(state.jizoRecord.evades,6);assert.equal(state.jizoRecord.rodsBroken,3);assert.equal(state.jizoRecord.coresBroken,3);assert(state.jizoRecord.dualBreaks>=3);assert.equal(state.metrics.respawns,0);
 await page.waitForTimeout(1300);const video=page.video();await context.close();const raw=await video.path();await browser.close();
 const silent=path.join(rawDir,'chapter-6-preview-silent-v3.mp4'),final=path.join(root,'demo-ch6-jizo-giap-ao-trieu-hoi-v3.mp4'),music=path.join(root,'assets','audio','official-site-bgm.mp3');
 ff(['-y','-i',raw,'-vf','scale=1280:800:flags=lanczos,fps=30','-an','-c:v','libx264','-preset','medium','-crf','20','-pix_fmt','yuv420p',silent]);
 ff(['-y','-i',silent,'-stream_loop','-1','-i',music,'-filter_complex','[1:a]volume=0.18,afade=t=in:st=0:d=1[a]','-map','0:v:0','-map','[a]','-shortest','-c:v','copy','-c:a','aac','-b:a','160k','-movflags','+faststart',final]);
 const meta={final,bytes:fs.statSync(final).size,record:state.jizoRecord,metrics:state.metrics,errors};fs.writeFileSync(path.join(rawDir,'meta.json'),JSON.stringify(meta,null,2));console.log(JSON.stringify(meta));
})().catch(e=>{console.error(e);process.exit(1)});
