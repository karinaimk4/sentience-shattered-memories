const {chromium}=require('./playwright-runtime.cjs');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),SAVE='sentience-gameplay-v4-save-20260926';
const ids=['leaves','water','post','wood','blanket','garden','cat','bell','roof','tea'];

function seed(){
 const s=JSON.parse(fs.readFileSync(path.join(root,'qa','boss-checkpoint.json'),'utf8'));
 s.chapter=5;s.chapters=[1,2,3,4,5];s.checkpoint={m:5605,hp:3000};s.introSeen=true;
 s.cleared=[2000,3200,4300,5440];s.weapons=['sword','spear','chain'];s.weapon='sword';
 s.storyEvents=['ch5-opening','ch5-perfect','ch5-warning','ch5-branch-a','ch5-branch-b','ch5-branch-c','ch5-testimonies','ch5-night-silent','ch5-dual'];
 s.courtyard={tasks:{},secret:false,visited:false,teaTypes:[],tomorrow:false,decor:[]};
 return s;
}

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1152,height:648}}),errors=[];
 page.on('pageerror',e=>{const m=e.stack||e.message;if(!m.includes('widget.sndcdn.com'))errors.push(m)});
 await page.addInitScript(([key,value])=>localStorage.setItem(key,JSON.stringify(value)),[SAVE,seed()]);
 await page.goto((process.env.HOS_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'')+'/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:60000});
 await page.evaluate(()=>{__qa.manual();__qa.start('story')});

 const snap=()=>page.evaluate(()=>__qa.snapshot());
 const step=(codes=[],n=1)=>page.evaluate(([codes,n])=>__qa.step(codes,n,false),[codes,n]);
 const tap=async code=>{await step([code],1);await step([],1)};
 const drain=async()=>{const lines=[];for(let guard=0;guard<80&&(await snap()).phase==='dialogue';guard++){await page.evaluate(()=>__qa.advance());const speaker=await page.locator('#speaker').textContent(),text=await page.locator('#dialogue-text').textContent();if(text)lines.push([speaker,text]);await page.evaluate(()=>__qa.advance());}return lines;};
 await drain();await page.evaluate(()=>__qa.enterCourtyard());assert.equal((await snap()).phase,'courtyard');

 async function moveTo(x){for(let guard=0;guard<120;guard++){const c=(await snap()).courtyard;if(Math.abs(c.x-x)<42)return;await step([c.x<x?'KeyD':'KeyA'],Math.min(8,Math.max(1,Math.floor(Math.abs(c.x-x)/4))));}throw Error('Không tới được vị trí '+x);}
 async function openTask(index){let s=await snap();if(s.phase==='dialogue')await drain();await moveTo(155);await tap('KeyE');s=await snap();assert.equal(s.courtyard.board,true);for(let guard=0;guard<12&&s.courtyard.selected!==index;guard++){await tap('ArrowDown');s=await snap();}assert.equal(s.courtyard.selected,index);await tap('KeyE');s=await snap();assert.equal(s.courtyard.task,ids[index]);}
 async function waitFor(test,limit=800){for(let i=0;i<limit;i++){const s=await snap();if(test(s))return s;await step([],1);}throw Error('Hết thời gian chờ');}
 async function finishAndCheck(id){const before=await snap();assert.equal(before.save.courtyard.tasks[id],'done');return drain();}

 await openTask(0);await step([],1);
 let s=await snap(),target=s.courtyard.taskState.targets.find(x=>!x.done);await moveTo(target.x);await waitFor(x=>x.courtyard.wind<-.25);await tap('KeyE');
 for(let n=0;n<3;n++){s=await snap();target=s.courtyard.taskState.targets.find(x=>!x.done);await moveTo(target.x);await waitFor(x=>x.courtyard.wind>-.05);await tap('KeyE');}
 await finishAndCheck('leaves');

 await openTask(1);for(let n=0;n<3;n++){await waitFor(x=>{const q=x.courtyard.taskState;return q.meter>.4&&q.meter<.62});await tap('KeyE');}for(let guard=0;guard<160&&(await snap()).save.courtyard.tasks.water!=='done';guard++)await step(['KeyD'],4);await step([],1);await finishAndCheck('water');

 await openTask(2);await step(['KeyE'],55);await step([],1);await finishAndCheck('post');

 await openTask(3);for(let n=0;n<6;n++){await waitFor(x=>{const q=x.courtyard.taskState;return q.meter>.45&&q.meter<.57});await tap('KeyE');}await finishAndCheck('wood');

 await openTask(4);await waitFor(x=>Math.abs(x.courtyard.wind)<.18);await tap('KeyE');await finishAndCheck('blanket');

 await openTask(5);await step([],1);for(let n=0;n<6;n++){s=await snap();target=s.courtyard.taskState.targets.find(x=>!x.done);await moveTo(target.x);await tap(target.type==='weed'?'KeyJ':'KeyE');}await finishAndCheck('garden');

 await openTask(6);await tap('KeyE');await step([],310);await finishAndCheck('cat');

 await openTask(7);await tap('KeyE');await step([],70);await tap('KeyE');await step([],26);await tap('KeyE');await step([],70);await tap('KeyE');await finishAndCheck('bell');

 await openTask(8);for(let guard=0;guard<500;guard++){s=await snap();if(s.save.courtyard.tasks.roof==='done')break;const b=s.courtyard.taskState.balance;if(b>.13)await step(['KeyA'],1);else if(b<-.13)await step(['KeyD'],1);else await tap('KeyE');}await finishAndCheck('roof');

 await openTask(9);await tap('KeyE');
 for(let guard=0;guard<800;guard++){s=await snap();if(s.courtyard.taskState.stage>=2)break;const q=s.courtyard.taskState;if(q.meter<.44)await tap('KeyE');else await step([],3);}s=await snap();assert.equal(s.courtyard.taskState.stage,2);
 await tap('ArrowRight');await tap('KeyE');
 await waitFor(x=>{const q=x.courtyard.taskState;return q.stage===3&&q.meter>.5&&q.meter<.61});await tap('KeyE');
 s=await snap();assert.equal(s.courtyard.taskState.stage,4);await step(['KeyE'],165);await step([],1);await tap('ArrowRight');await step(['KeyE'],165);await step([],1);
 const finalLines=await finishAndCheck('tea');s=await snap();

 assert.equal(s.save.courtyard.tomorrow,true);assert.equal(Object.keys(s.save.courtyard.tasks).length,10);
 assert(s.save.courtyard.teaTypes.includes('cúc'));assert(s.save.courtyard.teaTypes.includes('lá rụng'));
 for(const id of ids)assert(s.storyEvents.includes('ch5-courtyard-task-'+id));
 assert(s.storyEvents.includes('ch5-courtyard-all'));assert(s.album.marks['5-02'].includes('red'));
 assert.deepEqual(finalLines.slice(-2),[['Bảng Việc Vặt','Phù Hoa cầm bút, tự viết thêm một dòng dưới danh sách.'],['Bảng Việc Vặt','“Ngày mai: uống trà với Senti.”']]);
 await moveTo(155);await tap('KeyE');await page.screenshot({path:path.join(root,'qa','ch5-courtyard-complete.png')});
 fs.writeFileSync(path.join(root,'qa','ch5-courtyard-test.json'),JSON.stringify({tasks:s.save.courtyard.tasks,teaTypes:s.save.courtyard.teaTypes,tomorrow:s.save.courtyard.tomorrow,finalLines,errors},null,2));
 await browser.close();assert.deepEqual(errors,[]);console.log('PASS: 10 việc sân sau, 3 loại trà, đủ sự kiện, Album đỏ và dòng “Ngày mai” không có lời đáp của Senti.');
})().catch(e=>{console.error(e);process.exit(1)});
