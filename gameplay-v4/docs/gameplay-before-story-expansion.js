import {ensureGear,stats,grantGear,addXP} from './gear-system.js';
import {renderLoadout} from './loadout.js';
import {sanitizeSave} from './save-validation.js';
import {SAVE_KEY,newSave,readSave,clamp,overlap,jumpRange,makeWorld,addPattern,solidPlatforms,movePlayer,body,WEAPONS,ENEMIES} from './engine.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],canvas=$('#game'),ctx=canvas.getContext('2d');
const W=1152,H=648,DT=1/60,QA=new URLSearchParams(location.search).has('qa');
let manifest,animations,chapter,patterns,atlas,swordCrystalArt,sceneAtlas,enemyAtlas,enemyManifest,terrainAtlas,terrainManifest,backgrounds=[],sceneSources=[],terrain=[],frames={},save=sanitizeSave(readSave(localStorage))||ensureGear(newSave()),committed=structuredClone(save),g=null,screen='home',keys=new Set(),pressed=new Set(),muted=false,audio=null,last=0,acc=0,manual=false;
const metrics={jumps:0,landings:0,slides:0,gatePasses:0,gapsCleared:0,falls:0,respawns:0,swings:0,hits:0,kills:0,checkpoints:[],arenas:[],states:[],damageTaken:0};
const metric=(name)=>{if(!metrics.states.includes(name))metrics.states.push(name)};
function tone(freq=440,duration=.08,type='sine',volume=.035){if(muted||!audio)return;try{const o=audio.createOscillator(),v=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(40,freq*.62),audio.currentTime+duration);v.gain.setValueAtTime(volume,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(v).connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch{}}
function enableAudio(){try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume()}catch{}}
function persist(){try{if(g?.mode==='endless'&&g.phase!=='finished')return;const old=localStorage.getItem(SAVE_KEY);if(old)localStorage.setItem(SAVE_KEY+'-backup',old);localStorage.setItem(SAVE_KEY,JSON.stringify(save));committed=structuredClone(save);syncHome()}catch{toast('Không lưu được trên thiết bị này')}}
function maxHP(){return stats(save).hp}
function toast(text,duration=2.8){$('#toast').textContent=text;$('#toast').classList.add('show');if(g)g.toastTime=duration;}
function switchScreen(s){screen=s;$('#world-gallery').hidden=s!=='home';for(const id of ['home','play','loadout'])$('#'+id).hidden=id!==s;keys.clear();pressed.clear();}
function syncHome(){
 $('#story').textContent=save.cleared.includes(2000)?'CHƯƠNG 1 · XEM KẾT QUẢ →':save.started?'TIẾP TỤC KÝ ỨC →':'BẮT ĐẦU HÀNH TRÌNH →';$('#story').disabled=!atlas;
 $('#endless').disabled=!atlas;$('#endless').textContent='ENDLESS · THỬ THÁCH ĐỘC LẬP →';$('#endless-record').textContent=`KỶ LỤC ${save.endlessBest||0} ĐIỂM · TRANG BỊ STORY ĐƯỢC GIỮ RIÊNG`;
 $('#save-summary').textContent=`LEVEL ${save.level} · ${save.gold} VÀNG · ${save.crystals} CRYSTAL · CHECKPOINT ${save.checkpoint.m} M`;
 $('#chapter-two').textContent=save.chapters.includes(2)?'TIẾP THEO: CHƯƠNG 02 · ARC CITY (CHƯA CÓ TRONG BẢN NÀY)':'CHƯƠNG 02 · ĐANG KHÓA';
}
function gear(){switchScreen('loadout');renderGear()}
function renderGear(){renderLoadout({save,changed(value){if(value){const clean=sanitizeSave(value);if(!clean)return false;try{localStorage.setItem(SAVE_KEY+'-archive-'+Date.now(),JSON.stringify(committed));save=clean;persist();renderGear();return true}catch{return false}}persist();},resume:()=>start('story'),draw(c,companion){const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);drawSprite('idle.5',companion?145:185,270,1.8,1,1,x);if(companion)drawSprite('hua.0',270,265,1.35,-1,1,x)}})}
function createPlayer(x){return {x,y:chapter.physics.groundY,vx:0,vy:0,w:32,h:88,grounded:true,face:1,state:'idle',stateTime:0,attack:null,comboStep:0,comboTime:0,invuln:0,coyote:.1,jumpBuffer:0,slide:false,slideTime:0,landTime:0,hurtTime:0,support:null}}
function start(mode='story'){
 enableAudio();save=sanitizeSave(readSave(localStorage))||ensureGear(newSave());committed=structuredClone(save);if(mode==='endless'){save=structuredClone(save);save.weapons=['sword','spear','chain'];save.weapon='sword';save.weaponLevels={sword:1,spear:1,chain:1};}
 const world=mode==='story'?makeWorld(chapter,patterns):{gaps:[],platforms:[],coins:[],enemies:[],patterns:[],nextId:0,end:1e10};
 g={mode,world,p:createPlayer((mode==='story'?save.checkpoint.m:0)*64+60),hp:mode==='story'?Math.max(45,save.checkpoint.hp):maxHP(),phase:'explore',time:0,elapsed:mode==='story'?save.elapsed:0,camera:0,combo:0,comboTimer:0,particles:[],enemies:[],clear:new Set(mode==='story'?save.cleared:[]),collected:new Set(mode==='story'?save.collected:[]),visited:new Set(mode==='story'?save.visited:[0]),fieldSpawned:new Set(mode==='story'?save.defeated:[]),defeated:new Set(mode==='story'?save.defeated:[]),journal:structuredClone(save.journal||[]),sceneId:null,sceneTimer:0,nodes:(mode==='story'?chapter.nodes:[]).map(n=>({...n,x:n.m*64,y:430,w:44,h:82,destroyed:(save.nodes||[]).includes(n.id)})),memories:new Set(save.memories||[]),seenScenes:new Set(save.seenScenes||[]),speechTime:0,speechQueue:[],storyEvents:new Set(save.storyEvents),presentationTime:0,dialogueClock:0,projectiles:[],dash:0,dashCD:0,runBuff:1,nextUpgrade:30,upgrades:0,parry:0,parryCD:0,empowered:false,collapseX:1600*64-1100,loopCount:0,passedGates:new Set(),passedGaps:new Set(),assistCD:0,assistTime:0,hitstop:0,shake:0,swingId:0,toastTime:0,arena:null,wave:0,arenaDoneWait:0,deathTime:0,generated:0,seed:patterns.seed,runGold:0,score:0,endlessBoss:1000,endlessElite:250,checkToast:'',dialogue:[],dialogueIndex:0};
 if(mode==='endless')extendEndless();else {g.world.platforms.push({id:'memory-sign',x:865*64-420,y:390,w:130,h:30,kind:'floating'},{id:'memory-step',x:865*64-245,y:330,w:120,h:30,kind:'floating'},{id:'memory-balcony',x:865*64-120,y:295,w:260,h:32,kind:'floating'});}switchScreen('play');$('#complete').hidden=true;$('#pause-panel').hidden=true;$('#upgrade-panel').hidden=true;$('#interaction-prompt').hidden=true;$('#journal-panel').hidden=true;$('#dialogue').hidden=true;
 if(mode==='story'&&save.cleared.includes(2000)){g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER COMPLETE';$('#complete h2').innerHTML='Ký ức đầu tiên<br>đã trở về.';$('#complete-stats').textContent=`${Math.floor(save.elapsed/60)}:${String(Math.floor(save.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · 6 arena hoàn thành`;$('#complete p:nth-of-type(2)').textContent='Đã cứu ký ức #1 · Arc City sẽ tiếp nối ở Chương 2. Nội dung Chương 2 chưa có trong bản này.';$('#complete').hidden=false;}
 else if(mode==='story'&&(!save.introSeen&&save.checkpoint.m===0)){dialogue(chapter.opening,()=>{save.started=true;save.introSeen=true;save.journal=g.journal;persist();g.phase='explore';toast('D / → DI CHUYỂN · SPACE NHẢY',3)})}
 else toast(mode==='story'?`TRỞ LẠI CHECKPOINT ${save.checkpoint.m} M`:'ENDLESS · THEO ĐƯỜNG VÀNG');
 updateHUD();render();
}
function dialogue(lines,done){g.phase='dialogue';g.dialogue=lines;g.dialogueIndex=0;g.dialogueDone=done;g.dialogueClock=0;const id=JSON.stringify(lines);if(!g.journal.some(e=>e.id===id))g.journal.push({id,m:Math.floor(g.p.x/64),title:g.arena?.name||currentScene().name,lines:structuredClone(lines)});keys.clear();pressed.clear();$('#dialogue').hidden=false;$('#dialogue .eyebrow').textContent=`${g.arena?.name||'ĐOẠN MỞ ĐẦU'} · 1 / ${lines.length}`;showDialogue()}
function showDialogue(){g.dialogueClock=0;g.dialogueReveal=0;const line=g.dialogue[g.dialogueIndex];$('#speaker').textContent=line[0];g.dialogueFullText=line[1];$('#dialogue-text').textContent='';$('#dialogue .eyebrow').textContent=`${g.arena?.name||(!save.introSeen?'KHÔNG AI NHỚ TA':currentScene().name)} · ${g.dialogueIndex+1} / ${g.dialogue.length}`;const c=$('#portrait'),x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.imageSmoothingEnabled=false;drawSprite(line[0]==='Fu Hua'?'hua.0':'idle.7',90,155,1.5,1,1,x)}
function nextDialogue(){if(!g||g.phase!=='dialogue')return;if(g.dialogueReveal<(g.dialogueFullText?.length||0)){g.dialogueReveal=g.dialogueFullText.length;$('#dialogue-text').textContent=g.dialogueFullText;return;}tone(500,.04);g.dialogueIndex++;if(g.dialogueIndex<g.dialogue.length)showDialogue();else{$('#dialogue').hidden=true;keys.clear();pressed.clear();g.dialogueDone?.();}}
function setAnim(state){const p=g.p;if(p.state!==state){p.state=state;p.stateTime=0;metric(state)}}
function selectWeapon(id){if(save.weapons.includes(id)&&!g?.p.attack){save.weapon=id;tone(550,.05);updateHUD()}}
function beginAttack(){const p=g.p,w=WEAPONS[save.weapon];if(!w||p.attack||p.slide)return;p.comboStep=p.comboTime>0?(p.comboStep%(g.dodgeCombo>0?5:3))+1:1;p.comboTime=1.15;const mult=p.comboStep===3?1.2:1;p.attack={weapon:save.weapon,t:0,total:(w.startup+w.active+w.recovery)*mult,hit:new Set(),id:++g.swingId,step:p.comboStep};metrics.swings++;setAnim(`${save.weapon}_attack_${Math.min(3,p.comboStep)}`);tone(save.weapon==='spear'?160:210,.09,'triangle')}
function assist(){if(!save.assistUnlocked||g.assistCD>0||!['explore','arena'].includes(g.phase))return;g.assistCD=18;g.assistTime=.75;g.hp=Math.min(maxHP(),g.hp+12);metric('fu_hua_assist');for(const e of g.enemies)if(e.hp>0&&Math.abs(e.x-g.p.x)<310)hitEnemy(e,85,'assist');tone(860,.25);toast('FU HUA · PALM OF TAIXUAN',1.5)}
function hitEnemy(e,damage,type='weapon'){
 if(e.hp<=0)return;e.hp-=damage;e.hurt=.25;e.knock=type==='chain'?(g.p.x+g.p.face*90-e.x)*2:g.p.face*110;e.hitTime=.14;g.combo++;g.comboTimer=3;g.hitstop=.035;g.shake=4;metrics.hits++;pop(e.x,e.y-85,String(damage),'#ffe4ad');spark(e.x,e.y-45,'#f2b994',9);tone(120,.05,'square',.018);
 if(e.hp<=0){if(g.mode==='story')addXP(save,e.kind==='boss'?180:e.kind==='elite'?35:18);e.dead=.65;g.defeated.add(e.id);metrics.kills++;const amount=Math.floor(e.reward*(1+Math.min(g.combo,40)*.015));reward(amount,e.x,e.y-100);spark(e.x,e.y-50,'#b1a4f4',15);if(e.kind==='elite'||e.kind==='mini'||e.kind==='boss')save.materials+=e.kind==='elite'?1:3;}
}
function reward(amount,x,y){if(g.mode==='story')save.gold+=amount;else g.runGold+=amount;pop(x,y,`+${amount} ◈`,'#f5d58a');tone(900,.06)}
function damage(amount,sourceX){const p=g.p;if(g.dash>0){metric('perfect_dodge');}if(p.invuln>0||g.phase==='dying')return;const sv=stats(save,{combo:g.combo});amount=Math.round(amount*100/(100+sv.def)*(1-sv.reduction)*((save.deaths?.[save.checkpoint.m]||0)>=3?.8:1));g.hp-=amount;metrics.damageTaken+=amount;p.invuln=1.0;p.hurtTime=.22;g.combo=0;p.vx=sourceX>p.x?-90:90;g.shake=8;spark(p.x,p.y-50,'#ed86a7',12);pop(p.x,p.y-95,`−${amount}`,'#ff9bb2');tone(90,.15,'sawtooth',.025);if(g.hp<=0)die(false)}
function die(fall){if(g.phase==='dying')return;g.phase='dying';g.deathTime=1.15;g.p.attack=null;setAnim('defeat');if(fall)metrics.falls++;toast(fall?'KÝ ỨC RƠI VỠ…':'KÝ ỨC CHƯA KẾT THÚC…',1.5);tone(75,.35,'triangle')}
function respawn(){
 metrics.respawns++;
 if(g.mode==='endless'){const result=`${Math.floor(g.p.x/64)} m · ${Math.floor(g.score)} điểm · ${g.runGold} vàng`;g.phase='finished';save=structuredClone(committed);save.endlessBest=Math.max(save.endlessBest||0,Math.floor(g.score));persist();$('#complete-stats').textContent=result;$('#complete .eyebrow').textContent='ENDLESS COMPLETE';$('#complete h2').textContent='Một ký ức mới.';$('#complete p:nth-of-type(2)').textContent='Kỷ lục Endless đã lưu. Vàng và nâng cấp trong lượt này không thay đổi Story.';$('#complete').hidden=false;return;}
 const elapsed=g.elapsed;save=structuredClone(committed);save.deaths??={};save.deaths[save.checkpoint.m]=(save.deaths[save.checkpoint.m]||0)+1;persist();const mode=g.mode;start(mode);g.elapsed=elapsed;g.hp=maxHP();g.p.invuln=2;toast(`HỒI SINH · CHECKPOINT ${save.checkpoint.m} M`,2);
}
function checkpoint(m){if(g.visited.has(m)||g.mode!=='story')return;g.visited.add(m);g.hp=Math.min(maxHP(),g.hp+maxHP()*.12);save.checkpoint={m,hp:g.hp};save.cleared=[...g.clear];save.collected=[...g.collected];save.visited=[...g.visited];save.defeated=[...g.defeated];save.journal=g.journal;save.nodes=g.nodes.filter(n=>n.destroyed).map(n=>n.id);save.memories=[...g.memories];save.seenScenes=[...g.seenScenes];save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];g.p.invuln=Math.max(g.p.invuln,2);persist();metrics.checkpoints.push(m);toast('KÝ ỨC ĐÃ NEO · ESC ĐỂ MỞ TRANG BỊ',3);tone(660,.14);setTimeout(()=>tone(990,.2),120);spark(m*64,chapter.physics.groundY-65,'#95f2f0',26)}
function enterArena(event){
 g.arena={...event,x:event.m*64};g.wave=0;g.enemies=[];g.phase='dialogue';g.speechQueue=[];g.speechTime=0;g.p.vx=0;g.camera=g.arena.x-230;
 if(event.unlock&&!save.weapons.includes(event.unlock)){save.weapons.push(event.unlock);save.weapon=event.unlock;save.weaponLevels[event.unlock]=1;toast(`ĐÃ MỞ ${WEAPONS[event.unlock].name.toUpperCase()} · ${['sword','spear','chain'].indexOf(event.unlock)+1}`,3)}
 if(g.mode==='endless'){g.phase='arena';spawnWave();return;}
 dialogue(event.before||[['Fu Hua','Một ký ức mạnh đang xuất hiện. Hãy cẩn thận.']],()=>{g.phase='arena';spawnWave()});
}
function spawnEnemy(kind,x,id){const def=ENEMIES[kind];return {kind,id,x,y:chapter.physics.groundY,w:kind==='boss'||kind==='mini'?90:48,h:kind==='boss'||kind==='mini'?130:74,...def,maxHP:def.hp,attackTimer:0,cooldown:1.2,telegraph:0,hurt:0,hitTime:0,knock:0,dead:0,face:-1,age:0}}
function spawnWave(){g.wave++;g.arenaDoneWait=0;const wave=g.arena.waves[g.wave-1];wave.forEach((kind,i)=>g.enemies.push(spawnEnemy(kind,g.arena.x+570+i*98,`a${g.arena.m}w${g.wave}e${i}`)));toast(`WAVE ${g.wave} / ${g.arena.waves.length}`,1.6);}
function clearArena(){
 const a=g.arena;g.clear.add(a.m);metrics.arenas.push(a.m);g.combo=0;g.hp=Math.min(maxHP(),g.hp+maxHP()*.08);
 if(g.mode==='story'){for(const id of chapter.gearRewards?.[a.m]||[])grantGear(save,id);save.equipmentUnlocked=true;save.crystals+=3;}
 if(a.m===2000&&g.mode==='story'){save.equipmentUnlocked=true;g.memories.add('main-1');g.speechQueue=[];g.speechTime=0;}
 const finish=()=>{g.phase='explore';g.arena=null;toast('LỐI ĐI ĐÃ MỞ · ĐẾN CỔNG CHECKPOINT',2.4);
  if(a.m===2000&&g.mode==='story'){save.chapters=[1,2];save.stigmata=['training-top','training-middle','training-bottom'];save.crystals+=20;save.materials+=5;save.cleared=[...g.clear];save.collected=[...g.collected];save.journal=g.journal;save.memories=[...g.memories];save.nodes=g.nodes.filter(n=>n.destroyed).map(n=>n.id);save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];save.checkpoint={m:2000,hp:g.hp};persist();g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER COMPLETE';$('#complete h2').innerHTML='Ký ức đầu tiên<br>đã trở về.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · 6 arena hoàn thành`;$('#complete p:nth-of-type(2)').textContent='Đã cứu ký ức #1 · Arc City sẽ tiếp nối ở Chương 2. Nội dung Chương 2 chưa có trong bản này.';$('#complete').hidden=false;}
 };
 if(g.mode==='story')dialogue(a.after,finish);else finish();
}
function random(){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296}
function speed(){return g.mode==='story'?chapter.physics.speed*(1+stats(save,{combo:g.combo}).move):Math.min(patterns.maxSpeed,300+g.time*.23)}
function extendEndless(){
 const target=g.p.x+7000;
 while(g.generated<target){const start=g.generated,sp=Math.min(patterns.maxSpeed,300+start/300*.23),phys={...chapter.physics,speed:sp};
  const meter=start/64,length=1900,near=Math.floor(start/16000);
  if([near,near+1].some(n=>n>0&&start<n*16000+1400&&start+length>n*16000-850)){g.generated+=length;continue;}
  let options=patterns.patterns.filter(p=>p.id!=='tutorial-gap');if(meter<200)options=options.filter(p=>p.difficulty!=='hard');
  const template=structuredClone(options[Math.floor(random()*options.length)]);if(template.gap)template.gap.offset=Math.max(template.gap.offset,Math.ceil(sp*1.8));if(template.offset)template.offset=Math.max(template.offset,Math.ceil(sp*1.8));
  addPattern(g.world,template,start,phys);g.generated+=length;
 }
}
function updateInput(dt){
 const p=g.p;if(pressed.has('KeyL')&&g.dashCD<=0&&save.weapon){g.dash=.19;g.dashCD=Math.max(.65,1.5-(save.skills.dodge||0)*.12);p.invuln=Math.max(p.invuln,.25);g.dodgeCombo=2;metric('dodge');spark(p.x,p.y-40,'#c2c0ff',7);}
 const right=keys.has('KeyD')||keys.has('ArrowRight'),left=keys.has('KeyA')||keys.has('ArrowLeft'),down=keys.has('KeyS')||keys.has('ArrowDown');
 const lowRoof=g.world.platforms.some(s=>s.kind==='gate'&&!s.destroyed&&p.x+p.w/2>s.x&&p.x-p.w/2<s.x+s.w&&p.y>s.y+s.h&&p.y-88<s.y+s.h);
 const wasSlide=p.slide;p.slide=p.grounded&&(down||lowRoof);p.h=p.slide?56:88;if(p.slide){p.slideTime+=dt;if(!wasSlide){metrics.slides++;setAnim('slide_start')}}else if(wasSlide){p.slideTime=0;setAnim('slide_end')}
 let vx=right?speed():left?-chapter.physics.backSpeed:0;
 if(g.mode==='endless'&&!g.arena&&!left)vx=speed();if(g.arena&&g.mode==='endless'&&!right&&!left)vx=0;
 if(g.dash>0)vx=p.face*760;else if(p.attack&&p.grounded)vx*=.38;if(p.hurtTime>0)vx*=.5;
 if(g.mode==='endless'&&Math.floor(p.x/64/500)%5===2&&p.grounded)p.vx+=(vx-p.vx)*Math.min(1,dt*3);else p.vx=vx;
 if(Math.abs(vx)>1)p.face=Math.sign(vx);
 if(p.grounded)p.airJumps=1;if(pressed.has('Space')&&!p.grounded&&p.coyote<=0&&(p.airJumps||0)>0){p.vy=-chapter.physics.jumpVelocity*.85;p.airJumps--;metrics.jumps++;tone(480,.08);}if(pressed.has('Space'))p.jumpBuffer=.12;else p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);
 p.coyote=p.grounded?.1:Math.max(0,p.coyote-dt);
 if(p.jumpBuffer>0&&p.coyote>0&&!p.slide){p.vy=-chapter.physics.jumpVelocity;p.grounded=false;p.jumpBuffer=0;p.coyote=0;p.landTime=0;metrics.jumps++;setAnim('jump_start');tone(360,.08,'triangle')}
 for(const [code,id]of [['Digit1','sword'],['Digit2','spear'],['Digit3','chain']])if(pressed.has(code))selectWeapon(id);
 if(pressed.has('KeyR'))weaponSkill();if(pressed.has('KeyQ'))assist();if(pressed.has('KeyK')&&save.weapon==='sword'&&g.parryCD<=0){g.parry=.25;g.parryCD=.65;metric('parry');}
 if(keys.has('KeyJ')&&!p.attack)beginAttack();
}
function updateCombat(dt){
 const p=g.p;
 if(p.attack){const a=p.attack,w=WEAPONS[a.weapon];a.t+=dt;const active=a.t>=w.startup&&a.t<w.startup+w.active;
  if(active){const hit={x:p.face>0?p.x:p.x-w.range,y:p.y-90,w:w.range,h:82};
   for(const e of g.enemies){if(e.hp<=0||a.hit.has(e.id))continue;if(overlap(hit,{x:e.x-e.w/2,y:e.y-e.h,w:e.w,h:e.h})){a.hit.add(e.id);const armor=a.weapon==='spear'?0:e.armor||0;const v=stats(save,{combo:g.combo}),dmg=Math.round(v.atk*(a.weapon==='sword'?.75:a.weapon==='spear'?1.1:.55*2)*(1+v.physical)*(1+v.total+v.normal)*(1+(save.skills.sword||0)*.05)*(a.step>=3?1.4:1)*(1-armor)*100/120*(1+Math.min(.2,g.combo*.002))*(random()<v.crit?v.critDamage:1)*(g.mode==='endless'?g.runBuff:1));hitEnemy(e,Math.round(dmg*(g.empowered?2:1)),a.weapon);if(v.sets.marco_polo>=2&&g.combo>25&&a.step>=3&&(g.marcoHitCD||0)<=0){g.marcoHitCD=5;hitEnemy(e,Math.round(v.atk*2.5),'echo');}g.empowered=false}}
   for(const n of g.nodes)if(!n.destroyed&&!a.hit.has(n.id)&&Math.abs(p.x-n.x)<w.range+20&&p.y>340){if(n.order===0&&g.loopCount<1)continue;const previous=g.nodes.filter(v=>v.order<n.order);if(previous.some(v=>!v.destroyed))continue;a.hit.add(n.id);n.hp-=w.damage+save.weaponLevels[a.weapon]*4;spark(n.x,430,'#e2a7ff',14);if(n.hp<=0){n.destroyed=true;g.storyEvents.add('node:'+n.id);g.speechQueue=[];g.speechTime=0;if(n.order===0){g.rescueState='freed';say('Fu Hua','...Tuổi trẻ? Cậu... ở đó sao?');}g.shake=12;reward(25,n.x,370);say('Senti',n.order===0?'Vòng lặp đã đứt!':n.order===3?'Bà cụ, ra khỏi đó mau!':`Còn ${3-n.order} nút nữa!`);}}
   for(const b of g.world.platforms)if(b.kind==='breakable'&&!b.destroyed&&!a.hit.has(b.id)&&overlap(hit,b)){a.hit.add(b.id);b.hp-=w.damage+save.weaponLevels[a.weapon]*4;spark(b.x+b.w/2,b.y+30,'#c6b79c',12);if(b.hp<=0){b.destroyed=true;reward(8,b.x,b.y)}}
  }
  if(a.t>=a.total){p.attack=null;p.comboTime=.7;}
 }
 for(const e of g.enemies){e.age+=dt;e.hurt=Math.max(0,e.hurt-dt);e.hitTime=Math.max(0,e.hitTime-dt);
  if(e.hp<=0){e.dead-=dt;continue;}e.x+=e.knock*dt;e.knock*=Math.exp(-8*dt);e.cooldown-=dt;e.face=p.x<e.x?-1:1;
  if(e.stun>0){e.stun-=dt;continue;}if(e.hurt>0&&!['boss','elite','mini'].includes(e.kind))continue;
  if(e.charge>0){e.charge-=dt;e.x+=e.face*410*dt;if(Math.abs(p.x-e.x)<e.reach&&p.y>430&&!e.chargeHit){e.chargeHit=true;if(g.parry>0){e.stun=2.2;e.charge=0;g.empowered=true;g.parry=0;metric('perfect_parry');spark(e.x,e.y-65,'#fff1ad',24);say('Senti','Ha! Lộ sơ hở rồi!');}else damage(e.damage,e.x);}if(g.arena)e.x=clamp(e.x,g.arena.x-130,g.arena.x+780);continue;}
  if(e.telegraph>0){e.telegraph-=dt;if(e.telegraph<=0){e.attackTimer=.24;const special=e.kind==='boss';if(e.move==='charge'){e.charge=.7;e.chargeHit=false;}else if(e.move==='arrow'){g.projectiles.push({x:e.x,y:e.y-62,vx:e.face*400,life:3,damage:e.damage});}else if(Math.abs(p.x-e.x)<e.reach+18&&(special?p.y>chapter.physics.groundY-60:p.y>chapter.physics.groundY-100)){if(g.parry>0){e.stun=1.5;g.empowered=true;g.parry=0;metric('perfect_parry');spark(e.x,e.y-60,'#fff1ad',20);}else damage(e.damage,e.x);}e.cooldown=e.kind==='boss'?.95:1.6;}continue;}
  e.attackTimer=Math.max(0,e.attackTimer-dt);
  const distance=Math.abs(p.x-e.x);if(distance>(e.kind==='enemy'?280:e.reach*.78)&&e.attackTimer<=0){const nx=e.x+e.face*e.speed*dt;if(!g.world.gaps.some(h=>nx>h.x-260&&nx<h.x+h.w+260)&&!g.world.platforms.some(b=>!b.destroyed&&b.y+b.h>=480&&nx+e.w/2>b.x&&nx-e.w/2<b.x+b.w))e.x=nx;}
  if(distance<(e.kind==='enemy'?540:e.reach+12)&&e.cooldown<=0&&e.attackTimer<=0){e.move=e.kind==='enemy'?'arrow':e.kind==='elite'||(e.kind==='boss'&&((e.moves||0)%2===1))?'charge':'slam';e.moves=(e.moves||0)+1;e.telegraph=e.kind==='enemy'?.9:e.kind==='boss'?(e.move==='charge'?1:1.2):e.kind==='elite'?1:.65;}
  if(g.arena)e.x=clamp(e.x,g.arena.x-135,g.arena.x+790);
 }
 g.enemies=g.enemies.filter(e=>e.hp>0||e.dead>0);
 if(g.phase==='arena'&&!g.enemies.length){g.arenaDoneWait+=dt;if(g.arenaDoneWait>.8){if(g.wave<g.arena.waves.length)spawnWave();else if(g.arena.loop&&!g.nodes[0].destroyed){g.loopCount++;g.rescueState='failed';g.wave=0;dialogue([['Senti','Xong rồi! Bà cụ, đưa tay cho ta—'],['Fu Hua','...Còn một đợt nữa.'],['Senti','Không. Ta vừa hạ hết chúng rồi mà.'],['Senti','Bàn tay lại xuyên qua... Bà ấy bị kéo trở lại đúng chỗ cũ.'],['Senti','Mỗi lần đèn chớp, mọi thứ bắt đầu lại. Phải phá thứ đang giữ bà ấy ở đây!']],()=>{g.phase='arena';spawnWave();});}else clearArena()}}
}
function tick(dt){
 if(!g||screen!=='play')return;if(!['paused','finished','upgrade'].includes(g.phase)){g.presentationTime+=dt;g.dialogueClock+=dt;if(g.phase==='dialogue'){g.dialogueReveal=Math.min(g.dialogueFullText.length,(g.dialogueReveal||0)+dt*42);$('#dialogue-text').textContent=g.dialogueFullText.slice(0,Math.floor(g.dialogueReveal));}}if(['paused','finished','dialogue','upgrade'].includes(g.phase))return;
 g.time+=dt;g.elapsed+=dt;if(stats(save).sets.marco_polo>=3&&g.combo>25&&(g.marcoHealCD||0)<=0){g.marcoHealCD=5;g.hp=Math.min(maxHP(),g.hp+200);}for(const k of ['dash','dashCD','dodgeCombo','marcoHitCD','marcoHealCD','weaponSkillCD'])g[k]=Math.max(0,(g[k]||0)-dt);const p=g.p;g.parry=Math.max(0,g.parry-dt);g.parryCD=Math.max(0,g.parryCD-dt);g.speechTime=Math.max(0,g.speechTime-dt);g.sceneTimer=Math.max(0,g.sceneTimer-dt);
 g.toastTime-=dt;if(g.toastTime<=0)$('#toast').classList.remove('show');
 g.particles.forEach(a=>{a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=a.text?0:360*dt;a.life-=dt});g.particles=g.particles.filter(a=>a.life>0);
 g.shake=Math.max(0,g.shake-dt*25);g.assistCD=Math.max(0,g.assistCD-dt);g.assistTime=Math.max(0,g.assistTime-dt);
 if(g.phase==='dying'){g.deathTime-=dt;p.stateTime+=dt;if(p.y>chapter.physics.groundY||p.vy>0){p.vy+=700*dt;p.y+=p.vy*dt;}if(g.deathTime<=0)respawn();pressed.clear();return;}
 if(g.hitstop>0){g.hitstop-=dt;return;}
 p.stateTime+=dt;p.invuln=Math.max(0,p.invuln-dt);p.hurtTime=Math.max(0,p.hurtTime-dt);p.comboTime=Math.max(0,p.comboTime-dt);p.landTime=Math.max(0,p.landTime-dt);g.comboTimer-=dt;if(g.comboTimer<=0)g.combo=0;
 updateInput(dt);const oldX=p.x,wasGrounded=p.grounded;const solids=solidPlatforms(g.world,g.time);movePlayer(p,dt,g.world,chapter.physics,solids);
 p.x=Math.max(g.mode==='story'?save.checkpoint.m*64-20:0,p.x);
 if(g.arena)p.x=clamp(p.x,g.arena.x-140,g.arena.x+790);
 if(p.grounded&&!wasGrounded){p.landTime=.13;metrics.landings++;spark(p.x,p.y,'#c5b6c0',5)}
 if(p.y>chapter.physics.groundY+64){die(true);pressed.clear();return;}
 updateCombat(dt);for(const bolt of g.projectiles){bolt.x+=bolt.vx*dt;bolt.life-=dt;if(Math.abs(bolt.x-p.x)<24&&Math.abs(bolt.y-(p.y-p.h/2))<p.h/2){if(g.parry>0){bolt.life=0;g.empowered=true;metric('perfect_parry');}else {damage(bolt.damage,bolt.x);bolt.life=0;}}}g.projectiles=g.projectiles.filter(b=>b.life>0);if(g.mode==='story')updateStory(dt);else if(g.phase==='explore'&&g.time>=g.nextUpgrade){showUpgrade();pressed.clear();return;}
 if(['dying','dialogue'].includes(g.phase)){pressed.clear();return;}
 if(p.hurtTime>0)setAnim('hurt');else if(p.attack)setAnim(`${p.attack.weapon}_attack_${Math.min(3,p.attack.step)}`);else if(p.slide)setAnim(p.slideTime<.12?'slide_start':'slide_loop');else if(!p.grounded)setAnim(p.vy< -440?'jump_start':'jump_air');else if(p.landTime>0)setAnim('land');else if(p.state==='slide_end'&&p.stateTime<.12){}else setAnim(Math.abs(p.vx)>5?'run':'idle');
 for(const c of g.world.coins)if(!g.collected.has(c.id)&&Math.abs(c.x-p.x)<32&&c.y>p.y-p.h-12&&c.y<p.y+12){g.collected.add(c.id);reward(c.value,c.x,c.y-15);spark(c.x,c.y,'#ffe8ad',5)}
 for(const gate of g.world.platforms)if(gate.kind==='gate'&&oldX<gate.x+gate.w&&p.x>=gate.x+gate.w&&!g.passedGates.has(gate.id)){g.passedGates.add(gate.id);metrics.gatePasses++;toast('TRƯỢT THÀNH CÔNG',1.3)}
 for(const gap of g.world.gaps)if(oldX<gap.x+gap.w&&p.x>=gap.x+gap.w&&p.y<=chapter.physics.groundY+8&&!g.passedGaps.has(gap.id)){g.passedGaps.add(gap.id);metrics.gapsCleared++;}
 if(g.phase==='explore'){
  for(const e of g.world.enemies)if(Math.abs(e.x-p.x)<850&&!g.fieldSpawned.has(e.id)){g.fieldSpawned.add(e.id);g.enemies.push(spawnEnemy(e.kind,e.x,e.id))}
  if(g.mode==='story'){
   for(const a of chapter.arenas)if(!g.clear.has(a.m)&&p.x>=a.m*64&&(a.m!==2000||g.nodes.every(n=>n.destroyed))){enterArena(a);break;}
   if(g.phase==='explore')for(const cp of chapter.checkpoints)if(p.x>=cp*64&&p.x<cp*64+180)checkpoint(cp);
  }else{
   extendEndless();const distance=p.x/64;
   if(distance>=g.endlessBoss){const m=g.endlessBoss;g.endlessBoss+=1000;g.endlessElite=Math.max(g.endlessElite,m+250);enterArena({m,name:'Endless · Người gác ký ức',waves:[['mini']],before:[['Fu Hua','Người gác ký ức. Hạ nó để tiếp tục.']]});}
   else if(distance>=g.endlessElite){const m=g.endlessElite;g.endlessElite+=250;enterArena({m,name:'Elite wave',waves:[['elite','knight']],before:[['HoS','Một chốt chặn nữa. Tới đây nào!']]});}
   g.score=(distance*10+g.runGold*4)*(1+Math.min(g.combo,50)*.025);
  }
 }
 g.camera=g.arena?g.arena.x-230:Math.max(0,p.x-270);
 pressed.clear();
}
function pop(x,y,text,color){g.particles.push({x,y,text,color,vx:0,vy:-35,life:1.1,max:1.1})}
function spark(x,y,color,count){for(let i=0;i<count;i++)g.particles.push({x,y,color,vx:(Math.random()-.5)*150,vy:-40-Math.random()*120,life:.3+Math.random()*.4,max:.7})}
function drawSprite(id,x,y,scale=1,face=1,alpha=1,target=ctx){const f=frames[id]||frames['idle.5'];if(!atlas||!f)return;target.save();target.imageSmoothingEnabled=false;target.globalAlpha=alpha;target.translate(Math.round(x),Math.round(y));target.scale(face*scale,scale);target.drawImage(atlas,...f.atlasRect,-112,-156,256,176);target.restore()}
function drawState(state,x,y,time,face=1,alpha=1,target=ctx){const a=animations.states[state]||animations.states.idle;const index=a.loop?Math.floor(time*a.fps)%a.frames.length:Math.min(a.frames.length-1,Math.floor(time*a.fps));drawSprite(a.frames[index],x,y,1,face,alpha,target)}
function biome(){return g.mode==='endless'?Math.floor(g.p.x/64/500)%5:0}
function label(text,x,y,color='#e8d7bc',size=11){ctx.fillStyle=color;ctx.font=`600 ${size}px Segoe UI`;ctx.textAlign='center';ctx.fillText(text,x,y)}
function terrainSprite(id,x,y,w,h){
 const rect=terrainManifest.terrainArt?.sprites[id];if(!terrainAtlas||!rect)return false;
 ctx.drawImage(terrainAtlas,...rect,x,y,w,h);return true;
}
function terrainBlock(id,x,y,w,h){
 // Preserve the cap, side borders and base; only the masonry center stretches.
 const [sx,sy,sw,sh]=terrainManifest.terrainArt.sprites[id],edge=16,cap=18,base=12;
 const dx=[x,x+8,x+w-8,x+w],dy=[y,y+Math.min(7,h/3),y+h-Math.min(6,h/3),y+h];
 const xs=[sx,sx+edge,sx+sw-edge,sx+sw],ys=[sy,sy+cap,sy+sh-base,sy+sh];
 for(let row=0;row<3;row++)for(let col=0;col<3;col++)ctx.drawImage(terrainAtlas,xs[col],ys[row],xs[col+1]-xs[col],ys[row+1]-ys[row],dx[col],dy[row],dx[col+1]-dx[col],dy[row+1]-dy[row]);
}
function terrainPiece(x,y,w,h,bi=biome(),kind='ground'){
 const im=terrain[bi];if(!im)return;if(terrainAtlas&&kind!=='ground'){if(kind==='block'||kind==='breakable')terrainBlock(kind,x,y,w,h);else terrainSprite(kind==='pulse'?'floating':kind,x,y,w,h);return;}ctx.save();ctx.beginPath();ctx.moveTo(x+5,y);ctx.lineTo(x+w-5,y);ctx.lineTo(x+w,y+6);ctx.lineTo(x+w,y+h-8);ctx.lineTo(x+w-8,y+h);ctx.lineTo(x+7,y+h);ctx.lineTo(x,y+h-6);ctx.lineTo(x,y+6);ctx.closePath();ctx.clip();
 for(let dx=0;dx<w;dx+=220){const dw=Math.min(220,w-dx);ctx.drawImage(im,Math.floor((x+dx+g.camera)*.2)%500+100,0,dw,80,x+dx,y,dw,h)}
 if(kind==='gate'){ctx.fillStyle='#101f3280';ctx.fillRect(x,y,w,h)}ctx.restore();ctx.fillStyle=bi===1?'#91c7e090':bi===2?'#e4f5ffd0':bi===4?'#b494ffc0':'#cfbbc280';ctx.fillRect(x+5,y,w-10,2);
 if(kind!=='ground'){ctx.fillStyle='#171a2a';for(const dx of [9,w-13]){ctx.fillRect(x+dx,y+8,4,4);ctx.fillStyle='#bfc5d1';ctx.fillRect(x+dx,y+8,2,2);ctx.fillStyle='#171a2a'}}
}
function drawGround(){
 const left=g.camera-50,right=g.camera+W+50,floor=chapter.physics.groundY;let cursor=left;
 for(const gap of g.world.gaps){if(gap.x+gap.w<left||gap.x>right)continue;if(gap.x>cursor)terrainPiece(cursor-g.camera,floor,gap.x-cursor,110);cursor=Math.max(cursor,gap.x+gap.w);
  const x=gap.x-g.camera;ctx.fillStyle='#a99adb12';for(let i=0;i<5;i++){ctx.fillRect(x+12+i*gap.w/5,floor+30+Math.sin(g.time*2+i)*18,3,18)}
  if(x>-60&&x<W){label('▼',x-26,floor-6,'#f3c476',16);label('▼',x+gap.w+23,floor-6,'#f3c476',16)}
 }
 if(cursor<right)terrainPiece(cursor-g.camera,floor,right-cursor,110);
 // Render banks after the ground strips so later strips cannot cover a bank.
 if(terrainAtlas&&biome()<2)for(const gap of g.world.gaps){
  const x=gap.x-g.camera;if(x+gap.w<0||x>W)continue;
  ctx.save();ctx.beginPath();ctx.rect(x,floor,gap.w,H-floor);ctx.clip();
  ctx.fillStyle='#070b1c';ctx.fillRect(x,floor,gap.w,H-floor);
  terrainSprite('pitInterior',x,floor,gap.w,Math.max(150,H-floor));ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x-100,floor,100,H-floor);ctx.clip();terrainSprite('pitLeft',x-100,floor,100,120);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x+gap.w,floor,100,H-floor);ctx.clip();terrainSprite('pitRight',x+gap.w,floor,100,120);ctx.restore();
  ctx.fillStyle='#f6d599';ctx.fillRect(x-19,floor,19,3);ctx.fillRect(x+gap.w,floor,19,3);
 }
}
function drawGate(cp){const x=cp*64-g.camera;if(x< -130||x>W+130)return;const y=chapter.physics.groundY,done=g.visited.has(cp);ctx.save();ctx.shadowBlur=18;ctx.shadowColor=done?'#7dedd1':'#7bd5fc';const pulse=.6+Math.sin(g.time*3)*.2;ctx.strokeStyle=`rgba(143,226,242,${pulse})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-68,42,78,0,Math.PI,Math.PI*2);ctx.moveTo(x-42,y-68);ctx.lineTo(x-42,y);ctx.moveTo(x+42,y-68);ctx.lineTo(x+42,y);ctx.stroke();ctx.shadowBlur=0;terrainPiece(x-49,y-71,12,71,1);terrainPiece(x+37,y-71,12,71,1);ctx.fillStyle='#a3eae5';ctx.fillRect(x-44,y-2,88,3);for(let i=0;i<6;i++){ctx.globalAlpha=(i+1)/8;ctx.fillRect(x-30+i*12,y-((g.time*40+i*23)%130),2,6)}ctx.globalAlpha=1;label(done?'MEMORY SAVED':`CHECKPOINT · ${cp} M`,x,y-166,'#b2ebef',9);ctx.restore()}
function render(){
 if(!g||screen!=='play'||!atlas)return;ctx.imageSmoothingEnabled=false;ctx.fillStyle='#080e21';ctx.fillRect(0,0,W,H);const bi=biome(),im=backgrounds[bi],offset=(g.camera*.18)%W;
 ctx.save();if(g.shake>0&&!matchMedia('(prefers-reduced-motion: reduce)').matches)ctx.translate(Math.sin(g.time*91)*g.shake,Math.cos(g.time*107)*g.shake*.5);
 if(g.mode==='story')drawScene();else for(let x=-offset;x<W;x+=W)ctx.drawImage(im,0,0,im.width,Math.floor(im.height*.73),x,0,W,490);
 const shade=ctx.createLinearGradient(0,0,0,490);shade.addColorStop(0,'#0711265a');shade.addColorStop(.6,'#050b1510');shade.addColorStop(1,'#050b1540');ctx.fillStyle=shade;ctx.fillRect(0,0,W,490);
 for(let i=0;i<20;i++){const x=(i*123.5-g.camera*.3+W*100)%W,y=(i*83+g.time*(6+i%4))%490;ctx.fillStyle=i%3?'#b7a8e340':'#e8cdb866';ctx.fillRect(x,y,2,2)}
 drawGround();drawStoryObjects();
 for(const b of g.world.platforms){const x=b.x-g.camera;if(b.destroyed||x>W+100||x+b.w<-100)continue;ctx.save();if(b.kind==='pulse'){const active=Math.sin(g.time*1.5+(b.phase||0))>-.4;ctx.globalAlpha=active?.9:.18;}terrainPiece(x,b.y,b.w,b.h,bi,b.kind);
  if(b.kind==='gate'){for(let i=12;i<b.w-10;i+=22){ctx.fillStyle=i%44===12?'#f1c77b':'#c67986';ctx.fillRect(x+i,b.y+b.h-6,10,4)}label('S / ↓  TRƯỢT',x+b.w/2,b.y-14,'#f6d49c',11);}
  if(b.kind==='breakable'){label('J · PHÁ',x+b.w/2,b.y-12,'#ffd79d',10)}
  if(b.kind==='moving')label('↔',x+b.w/2,b.y-8,'#9ae3ff',18);ctx.restore();
 }
 for(const c of g.world.coins)if(!g.collected.has(c.id)){const x=c.x-g.camera;if(x< -40||x>W+40)continue;const bob=Math.sin(g.time*4+c.x)*3,spin=.35+Math.abs(Math.cos(g.time*4+c.x))*.65;ctx.save();ctx.translate(x,c.y+bob+12);ctx.scale(spin,1);drawSprite(c.rare?'loot.4':'loot.0',0,0,c.rare?.7:.6);ctx.restore();if(c.rare){ctx.strokeStyle='#f4d19a77';ctx.strokeRect(x-16,c.y-16,32,32)}}
 if(g.mode==='story')for(const cp of chapter.checkpoints)drawGate(cp);
 if(g.arena){const l=g.arena.x-155-g.camera,r=g.arena.x+815-g.camera;for(const x of [l,r]){const grad=ctx.createLinearGradient(x-10,0,x+10,0);grad.addColorStop(0,'#ed83c100');grad.addColorStop(.5,'#ed83c1bb');grad.addColorStop(1,'#ed83c100');ctx.fillStyle=grad;ctx.fillRect(x-10,280,20,210);for(let i=0;i<6;i++){ctx.fillStyle='#ffb2d5';ctx.fillRect(x-2,300+(g.time*50+i*37)%185,4,14)}}label(g.arena.name,W/2,48,'#f5dbaa',16);}
 for(const e of g.enemies){const x=e.x-g.camera;if(x<-180||x>W+180)continue;let f=e.hp<=0?5:e.hurt>0?4:e.telegraph>0?2:e.attackTimer>0?3:Math.floor(e.age*5)%2;
  if(e.telegraph>0){ctx.fillStyle='#ee6c8740';ctx.fillRect(x-e.reach,482,e.reach*2,8);label('!',x,e.y-e.h-32,'#ffaaa4',22)}
  if(['enemy','knight','boss'].includes(e.kind)&&g.mode==='story')drawStoryEnemy(e,x);else drawSprite(`${e.art}.${f}`,x,e.y,e.scale||1,e.face===1?-1:1,e.hp<=0?Math.max(0,e.dead/.65):e.hitTime>0?.55:1);
  if(e.hp>0){const width=e.kind==='boss'?125:70;ctx.fillStyle='#141727';ctx.fillRect(x-width/2,e.y-e.h-15,width,5);ctx.fillStyle=e.kind==='boss'?'#e588b2':'#ddae85';ctx.fillRect(x-width/2,e.y-e.h-15,width*e.hp/e.maxHP,5);if(e.kind==='boss'||e.kind==='mini')label(e.kind==='boss'?'NAGAZORA HUSK':'NGƯỜI GÁC CẦU',x,e.y-e.h-23,'#e8cccb',9)}
 }
 const p=g.p,x=p.x-g.camera;if(p.grounded){ctx.fillStyle='#02040b60';ctx.beginPath();ctx.ellipse(x,p.y-1,p.slide?37:24,5,0,0,Math.PI*2);ctx.fill()}
 let a=p.invuln>0&&Math.floor(g.time*14)%2?.5:1;
 if(p.attack){const anim=animations.states[`${p.attack.weapon}_attack_${Math.min(3,p.attack.step)}`];const f=Math.min(anim.frames.length-1,Math.floor(p.attack.t/p.attack.total*anim.frames.length));drawSprite(anim.frames[f],x,p.y,1,p.face,a)}else drawState(p.state,x,p.y,p.stateTime,p.face,a);
 if(g.assistTime>0)drawState('fu_hua_assist',x-p.face*80,p.y,.75-g.assistTime,p.face,.9);
 for(const a of g.particles){ctx.globalAlpha=clamp(a.life/a.max,0,1);if(a.text)label(a.text,a.x-g.camera,a.y,a.color,17);else{ctx.fillStyle=a.color;ctx.fillRect(a.x-g.camera,a.y,3,3)}}ctx.globalAlpha=1;
 const gap=g.world.gaps.find(h=>h.x>p.x&&h.x-p.x<Math.max(speed()*1.8,560));
 if(gap&&!g.arena){const seconds=(gap.x-p.x)/Math.max(1,speed());label(`⚠ VỰC PHÍA TRƯỚC · SPACE · ${Math.max(1,Math.ceil((gap.x-p.x)/64))} M`,W/2,147,'#ffe1a6',14);if(seconds<.55)label('NHẢY!',x+65,p.y-125,'#ffdf91',17)}
 drawStoryOverlay();drawNarrative();ctx.restore();updateHUD();
}
function updateHUD(){if(!g)return;$('#play').classList.toggle('cinematic',g.phase==='dialogue');$('#sector-title').textContent=g.mode==='story'&&g.sceneTimer>0?currentScene().name:'';const alive=g.enemies.filter(e=>e.hp>0).length;$('#encounter-meter').textContent=alive?`${alive} QUÁI ĐANG GIAO CHIẾN`:'';$('#health-fill').style.width=clamp(g.hp/maxHP()*100,0,100)+'%';$('#health-text').textContent=`${Math.max(0,Math.ceil(g.hp))} / ${maxHP()}`;$('#level').textContent=`LV. ${save.level}`;$('#gold').textContent=`◈ ${g.mode==='story'?save.gold:g.runGold}`;$('#distance').innerHTML=g.mode==='story'?`<small>${g.memories.size} / 3 KÝ ỨC</small>`:`${String(Math.floor(g.p.x/64)).padStart(4,'0')} <small>M</small>`;
 const next=chapter.checkpoints.find(x=>x*64>g.p.x);$('#checkpoint-distance').textContent=g.mode==='story'?(next!==undefined?`CHECKPOINT CÒN ${Math.ceil(next-g.p.x/64)} M`:'CHECKPOINT CUỐI'): `${Math.round(speed())} PX/S · ĐIỂM ${Math.floor(g.score)}`;
 $('#location').textContent=`${g.mode==='story'?'CHƯƠNG 01':'ENDLESS'} / ${['NAGAZORA','ARC CITY','BABYLON','TAIXUAN','SEA OF QUANTA'][biome()]}`;
 $('#combo').innerHTML=g.combo>1?`${g.combo}<small> COMBO</small>`:'';
 $('#objective').textContent=narrativeObjective();
 $$('[data-weapon]').forEach(b=>{const id=b.dataset.weapon,own=save.weapons.includes(id);b.disabled=!own;b.classList.toggle('active',save.weapon===id);b.querySelector('small').textContent=own?'LV. '+save.weaponLevels[id]:'KHÓA'});$('#assist').disabled=!save.assistUnlocked||g.assistCD>0;$('#assist small').textContent=!save.assistUnlocked?'KHÓA':g.assistCD>0?`${Math.ceil(g.assistCD)} GIÂY`:'SẴN SÀNG';}
function pause(){if(g&&!$('#journal-panel').hidden){journal();return;}if(!g||['dialogue','dying','finished','upgrade'].includes(g.phase))return;if(g.phase==='paused'){g.phase=g.resumePhase;$('#pause-panel').hidden=true}else{g.resumePhase=g.phase;g.phase='paused';$('#pause-panel').hidden=false;keys.clear()}pressed.clear()}
function keyDown(code){if(!keys.has(code))pressed.add(code);keys.add(code)}
window.addEventListener('keydown',e=>{if(['Space','ArrowLeft','ArrowRight','ArrowDown','ArrowUp'].includes(e.code)&&screen==='play')e.preventDefault();if(e.repeat)return;if(e.code==='Tab'&&screen==='play'){e.preventDefault();journal();return;}if(e.code==='Enter'&&g?.phase==='dialogue'){nextDialogue();return;}if((e.code==='Escape'||e.code==='KeyP')&&screen==='play'){pause();return;}keyDown(e.code)});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();pressed.clear();if(screen==='play'&&g&&['explore','arena'].includes(g.phase))pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&g&&['explore','arena'].includes(g.phase))pause()});
$$('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keyDown(b.dataset.key)};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key)});
$('#story').onclick=()=>start('story');$('#endless').onclick=()=>start('endless');$('#gear').onclick=gear;$('#gear-back').onclick=()=>{switchScreen('home');syncHome()};$('#next-dialogue').onclick=nextDialogue;$('#pause-button').onclick=pause;$('#resume').onclick=pause;$('#assist').onclick=assist;
$$('[data-weapon]').forEach(b=>b.onclick=()=>selectWeapon(b.dataset.weapon));$('#return-home').onclick=()=>{switchScreen('home');save=structuredClone(committed);g=null;syncHome()};$('#complete-home').onclick=()=>{save=structuredClone(committed);g=null;gear()};
$('#sound').onclick=()=>{enableAudio();muted=!muted;$('#sound').textContent='ÂM THANH · '+(muted?'TẮT':'BẬT')};
function loop(now){updateAmbience();const delta=Math.min(.1,(now-last)/1000||0);last=now;if(!manual){acc+=delta;while(acc>=DT){tick(DT);acc-=DT;}render()}requestAnimationFrame(loop)}
async function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Không tải được '+src));i.src=src})}
async function init(){try{
 [manifest,animations,chapter,patterns]=await Promise.all(['assets-manifest.json','animation-manifest.json','level-chapter-1.json','endless-patterns.json'].map(async file=>{const r=await fetch(file);if(!r.ok)throw Error(`Không tải được ${file}`);return r.json()}));
 const imgs=await Promise.all([loadImage(manifest.atlas),...Array.from({length:5},(_,i)=>loadImage(`assets/biome-${i}.jpg`)),...Array.from({length:5},(_,i)=>loadImage(`assets/terrain-${i}.png`))]);
 [enemyAtlas,enemyManifest,terrainAtlas,terrainManifest,sceneSources[0],sceneAtlas,swordCrystalArt]=await Promise.all([loadImage('assets/nagazora-enemies-wiki.png'),fetch('enemy-story-manifest.json').then(r=>r.json()),loadImage('assets/terrain-nagazora-alpha-v1.png'),fetch('terrain-story-manifest.json').then(r=>r.json()),loadImage('assets/original-library/map-00-nagazora-ruins-v1.png'),loadImage('assets/nagazora-districts.png'),loadImage('assets/sword-crystal.png')]);atlas=imgs[0];backgrounds=imgs.slice(1,6);terrain=imgs.slice(6);frames=Object.fromEntries(manifest.frames.map(f=>[f.id,f]));syncHome();requestAnimationFrame(loop);
 if(QA)window.__qa={ready:true,manual(value=true){manual=value;acc=0;},start,advance:nextDialogue,step(codes=[],n=1,paint=true){manual=true;const next=new Set(codes);for(const code of next)if(!keys.has(code))pressed.add(code);keys=next;for(let i=0;i<n;i++)tick(DT);if(paint)render();return this.snapshot()},snapshot(){return {phase:g?.phase,mode:g?.mode,p:g?{...g.p,attack:g.p.attack?{...g.p.attack,hit:[...g.p.attack.hit]}:null}:null,hp:g?.hp,time:g?.time,elapsed:g?.elapsed,arena:g?.arena,wave:g?.wave,enemies:g?.enemies.map(e=>({...e})),nodes:g?.nodes,memories:g?[...g.memories]:[],scene:g?currentScene().id:null,storyEvents:g?[...g.storyEvents]:[],interaction:g?.interaction,projectiles:g?.projectiles,rescueState:g?.rescueState,upgrades:g?.upgrades,dialogueIndex:g?.dialogueIndex,loopCount:g?.loopCount,parry:g?.parry,gaps:g?.world.gaps.filter(x=>x.x>(g.p.x-300)&&x.x<g.p.x+1200),platforms:g?.world.platforms.filter(x=>!x.destroyed&&x.x>g.p.x-300&&x.x<g.p.x+1200),clear:g?[...g.clear]:[],visited:g?[...g.visited]:[],save:structuredClone(save),metrics:structuredClone(metrics),range:jumpRange(speedSafe(),chapter.physics.gravity,chapter.physics.jumpVelocity),score:g?.score,generated:g?.world.patterns.length,anim:g?.p.state,dom:screen}},manifest};
 }catch(e){$('#error').hidden=false;$('#error').textContent=`Không thể tải ký ức: ${e.message}. Hãy mở qua máy chủ HTTP và giữ nguyên thư mục assets.`;$('#story').textContent='TẢI ASSET THẤT BẠI';console.error(e)}}
function speedSafe(){return g?speed():chapter.physics.speed}
init();


// Chapter 1 staging, sourced from the user's story scripts. See story/IMPLEMENTATION.md.
function currentScene(){return chapter.scenes.filter(s=>s.from<=(g?.p.x||0)/64).at(-1)||chapter.scenes[0]}
function say(speaker,text){if(g.speechTime>0)g.speechQueue.push({speaker,text});else {g.speech={speaker,text};g.speechTime=5;} const id=speaker+text;if(!g.journal.some(e=>e.id===id))g.journal.push({id,m:Math.floor(g.p.x/64),title:currentScene().name,lines:[[speaker,text]]})}
function updateStory(dt){
 const p=g.p,scene=currentScene();if(g.speechTime<=0&&g.speechQueue.length){g.speech=g.speechQueue.shift();g.speechTime=5;}updateNarrative(dt);
 if(g.sceneId!==scene.id){g.sceneId=scene.id;g.sceneTimer=4;if(!g.seenScenes.has(scene.id)){g.seenScenes.add(scene.id);if(scene.line)say('Senti',scene.line);}}
 if(!save.weapons.length){
  // Crystal remains reachable by walking as well as jumping: first-time players cannot get stuck.
  if(Math.abs(p.x-chapter.swordCrystal.m*64)<80&&pressed.has('KeyE')){save.weapons=['sword'];save.weapon='sword';save.weaponLevels.sword=1;g.shake=15;g.hp=maxHP();spark(p.x,p.y-90,'#ffdc8c',35);dialogue([['Senti','...Chạm được rồi.'],['Senti','Nghe thấy ta chưa? Ta ở ngay đây!']],()=>{g.phase='explore';g.storyEvents.add('sword-awake');g.enemies.push(spawnEnemy('enemy',p.x+420,'first-witness'));say('Senti','Giờ thì chúng quay lại nhìn ta rồi. Tốt. Thử xem!');});toast('ĐÃ NHẬN KIẾM · J CHÉM · K PHẢN ĐÒN',5);checkpoint(8);}
 }
 for(const m of chapter.memories){if(g.memories.has(m.id))continue;if(Math.abs(p.x-m.m*64)<60&&Math.abs((p.y-p.h*.5)-m.y)<64&&(!m.slide||p.slide)){g.memories.add(m.id);grantGear(save,m.id==='hidden-1'?'marco_polo:T':'marco_polo:B');g.memoryVision=m.id;dialogue(m.lines,()=>{g.phase='explore';g.memoryVision=null;say('Ký ức',m.title+' · Đã ghi vào nhật ký');});break;}}
 // Nodes are real melee targets and gates, not distance-triggered story flags.
 for(const n of g.nodes){if(n.destroyed)continue;if(n.order>0&&p.x>n.x+105)p.x=n.x+105;}
 if(p.x>2000*64-40&&g.nodes.some(n=>!n.destroyed)){p.x=2000*64-40;say('Senti','Vẫn còn nút ký ức chưa bị phá.');}
 if(scene.id==='fracture'){
  const zone=g.world.platforms.find(b=>b.kind==='pulse'&&Math.abs(p.x-(b.x+b.w/2))<45);
  if(zone&&Math.sin(g.time*1.5+(zone.phase||0))<-.65&&p.grounded&&p.y>450)damage(155,zone.x);
 }
 // Falling debris is clearly warned and never changes a previously safe jump envelope.
 if(['roofs','escape'].includes(scene.id)&&g.phase==='explore'){
  g.debrisClock=(g.debrisClock||0)+dt;
  if(!g.debris&&g.debrisClock>4.5){g.debris={x:p.x+210,t:1.4,y:-30};g.debrisClock=0;}
  if(g.debris){const d=g.debris;d.t-=dt;if(d.t<=0){d.y+=520*dt;if(d.y>420&&Math.abs(p.x-d.x)<42)damage(195,d.x);if(d.y>520){spark(d.x,485,'#b6b0c7',10);g.debris=null;}}}
 }else g.debris=null;
 if(scene.id==='escape'&&g.phase==='explore'){g.collapseX=Math.max(g.collapseX,p.x-900);g.collapseX+=250*dt;if(p.x-g.collapseX<45){damage(240,g.collapseX);g.collapseX=p.x-300;}}
}
function drawScene(){
 const scene=currentScene(),im=sceneSources[0],progress=clamp((g.p.x/64-scene.from)/(scene.to-scene.from),0,1);
 const cropW=im.width/scene.zoom,cropH=Math.min(im.height*.74,cropW*490/W),sx=clamp((im.width-cropW)*(scene.focus+progress*.16),0,im.width-cropW),sy=scene.id==='roofs'?0:Math.min(65,im.height-cropH);
 if(scene.id==='street')ctx.drawImage(im,sx,sy,cropW,cropH,0,0,W,490);else {const cell={roofs:0,fracture:1,loop:2,escape:3,husk:3}[scene.id],cw=sceneAtlas.width/2,ch=sceneAtlas.height/2,pan=progress*28;ctx.drawImage(sceneAtlas,(cell%2)*cw+pan,Math.floor(cell/2)*ch+3,cw-32,ch-8,0,0,W,490);}
 if(scene.id==='roofs'){
  ctx.fillStyle='#15182b99';for(let i=0;i<5;i++){const x=(i*287-g.camera*.09+W*200)% (W+300)-150;ctx.fillRect(x,250+(i%3)*45,120,250);ctx.fillStyle='#dabd9e55';for(let y=275+(i%3)*45;y<465;y+=32)ctx.fillRect(x+15,y,58,5);ctx.fillStyle='#15182b99';}
 }
 if(scene.id==='fracture'){
  ctx.fillStyle='#8b4ed222';ctx.fillRect(0,0,W,490);for(let i=0;i<7;i++){const x=(i*191-g.camera*.15+W*100)%W,y=100+(i*61)%280;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(g.time+i)*.4);ctx.strokeStyle='#d3afff';ctx.strokeRect(-13,-26,26,52);ctx.restore();}if(Math.floor(g.time*3)%9===0){ctx.fillStyle='#d2a8f722';ctx.fillRect(0,190,W,8);ctx.fillRect(0,330,W,5);}
 }
 if(scene.id==='loop'){
  // Intentional repeating junction only in the memory-loop sequence.
  for(let i=0;i<3;i++){const x=(i*440-g.camera*.22+W*200)%1320-80;ctx.fillStyle='#262432';ctx.fillRect(x,220,7,270);ctx.fillRect(x-16,205,38,91);for(let j=0;j<3;j++){ctx.fillStyle=g.nodes[0]?.destroyed?(j===2?'#98dace':'#445853'):(j===Math.floor(g.time)%3?'#f8b897':'#665472');ctx.beginPath();ctx.arc(x+3,220+j*28,8,0,Math.PI*2);ctx.fill();}}
  drawFuHuaLoop();
 }
 if(['escape','husk'].includes(scene.id)){ctx.fillStyle='#25112855';ctx.fillRect(0,0,W,490);ctx.strokeStyle='#f3c5e1aa';ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(i*215,0);ctx.lineTo(i*215+38,110);ctx.lineTo(i*215-17,220);ctx.lineTo(i*215+60,370);ctx.stroke();}}
}
function drawStoryEnemy(e,x){
 const kind=e.kind==='boss'?'husk':'zombie',pose=e.charge>0||e.attackTimer>0?2:e.telegraph>0?1:0;
 const f=enemyManifest.frames.find(f=>f.kind===kind&&f.pose===pose),r=f.rect,scale=kind==='husk'?.36:.225;
 ctx.save();ctx.translate(x,e.y);ctx.scale(e.face===1?-1:1,1);ctx.globalAlpha=e.hp<=0?Math.max(0,e.dead/.65):e.hitTime>0?.6:1;
 ctx.drawImage(enemyAtlas,...r,-r[2]*scale/2,-r[3]*scale,r[2]*scale,r[3]*scale);ctx.restore();
 if(e.kind==='boss'&&e.telegraph>0)label(e.move==='charge'?'LAO TỚI · K PHẢN ĐÒN':'QUÉT THẤP · SPACE NHẢY',x,e.y-e.h-45,'#ffd3af',12);
}
function drawCrystal(x,y,size,color){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(g.time*2)*.08);ctx.fillStyle=color;ctx.shadowBlur=16;ctx.shadowColor=color;ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(size*.52,0);ctx.lineTo(0,size);ctx.lineTo(-size*.52,0);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff3ed';ctx.stroke();ctx.restore()}
function drawStoryObjects(){
 if(g.mode!=='story')return;
 if(!save.weapons.length){
  const x=chapter.swordCrystal.m*64-g.camera;drawCrystal(x,400,62,'#9885d699');ctx.drawImage(swordCrystalArt,x-25,337,50,120);label('E · CHẠM VÀO KÝ ỨC',x,318,'#ffe4b4',12);
  for(let i=0;i<3;i++){const e={kind:'enemy',x:370+i*280,y:490,face:-1,hp:1,hitTime:0};ctx.save();drawStoryEnemy(e,(e.x+Math.sin(g.time*.7+i)*35)-g.camera);ctx.restore();}
 }
 for(const n of g.nodes){const x=n.x-g.camera;if(x< -100||x>W+100)continue;if(n.destroyed){ctx.strokeStyle='#9ccecc';ctx.beginPath();ctx.moveTo(x-15,460);ctx.lineTo(x+15,485);ctx.stroke();continue;}ctx.fillStyle='#443a58';ctx.fillRect(x-5,395,10,95);drawCrystal(x,421,32,'#d899f1');label(n.order?`NÚT ${n.order} / 3 · J`:(g.loopCount?'NÚT GIỮ FU HUA · J CHÉM':'MỘT NHỊP SÁNG KHÁC THƯỜNG'),x,363,'#ffe2ac',13);}
 for(const m of chapter.memories){if(g.memories.has(m.id))continue;const x=m.m*64-g.camera;if(x< -60||x>W+60)continue;drawCrystal(x,m.y,15,'#ffe0a3');label(m.slide?'S · TRƯỢT SÁT MÉP':'SPACE ×2 · BAN CÔNG',x,m.y-27,'#ffe5a8',11);}
 if(g.debris){const d=g.debris,x=d.x-g.camera;if(d.t>0){ctx.fillStyle='#ffbc9b66';ctx.fillRect(x-35,486,70,4);label('ĐỔ NÁT ↓',x,320,'#ffcea5',13);}else terrainPiece(x-25,d.y,50,42,0,'breakable');}
 if(currentScene().id==='escape'&&g.phase!=='finished'){const x=g.collapseX-g.camera;if(x>0){ctx.fillStyle='#2b123a99';ctx.fillRect(0,0,x,600);label('NAGAZORA ĐANG SỤP',Math.max(130,x),200,'#f2b3cf',13)}}
 if(g.phase==='dialogue'&&(g.arena?.m===2000||g.memories.has('main-1')))drawSprite('hua.0',g.p.x-g.camera+100,490,1,-1);
}
function drawStoryOverlay(){
 if(g.parry>0){ctx.strokeStyle='#fff0b0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(g.p.x-g.camera+g.p.face*25,g.p.y-50,53,-1.5,1.5);ctx.stroke();}
 if(false&&g.speechTime>0&&g.speech&&g.phase!=='dialogue'){ctx.fillStyle='#10121ee8';ctx.fillRect(185,555,780,61);ctx.strokeStyle='#ba9c8066';ctx.strokeRect(185,555,780,61);label(g.speech.speaker,575,573,'#e7bf8b',11);label(g.speech.text,575,599,'#f4e9e1',14);}
 if(false&&g.phase==='dialogue'&&!save.introSeen){ctx.fillStyle='#13121b55';ctx.fillRect(0,0,W,490);label('KHÔNG AI NHỚ TA',W/2,190,'#ffe7ca',30);}
 if(g.phase==='dialogue'&&g.arena?.m===2000&&g.memories.has('main-1')&&g.dialogueIndex>=11){ctx.drawImage(backgrounds[1],0,0,backgrounds[1].width,backgrounds[1].height*.8,0,0,W,490);ctx.fillStyle='#24243766';ctx.fillRect(0,0,W,490);ctx.strokeStyle='#e6c4f4';for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(W/2,270);ctx.lineTo(i*120,0);ctx.stroke();}label('ARC CITY · PHÍA BÊN KIA KÝ ỨC',W/2,235,'#e8d3ef',21);}
}
function journal(){
 if(!g||['dying','finished'].includes(g.phase))return;
 const panel=$('#journal-panel');if(!panel.hidden){panel.hidden=true;g.phase=g.journalPhase;return;}
 g.journalPhase=g.phase;g.phase='paused';keys.clear();pressed.clear();const content=$('#journal-content');content.replaceChildren();
 const count=document.createElement('p');count.textContent=`Mảnh chính: ${g.memories.has('main-1')?1:0}/1 · Mảnh ẩn: ${[...g.memories].filter(x=>x.startsWith('hidden')).length}/2`;content.append(count);
 for(const item of g.journal){const h=document.createElement('h3');h.textContent=`${item.title} · ${item.m} m`;content.append(h);for(const line of item.lines){const p=document.createElement('p');p.textContent=line[0]+': '+line[1];content.append(p)}}panel.hidden=false;
}
$('#journal-button').onclick=journal;$('#journal-close').onclick=journal;
$('#new-story').onclick=()=>{try{if(save.started)localStorage.setItem(SAVE_KEY+'-archive-'+Date.now(),JSON.stringify(save));g=null;save=ensureGear(newSave());persist();start('story')}catch{toast('Không đủ chỗ lưu bản sao. Bản lưu hiện tại được giữ nguyên.')}};


// Narrative state follows player actions; this is not a distance-only dialogue track.
function narrativeObjective(){
 if(g.mode==='endless')return `ENDLESS · ${g.upgrades} nâng cấp · L né / K phản đòn · Chọn khả năng sau ${Math.max(0,Math.ceil(g.nextUpgrade-g.time))} giây`;
 if(!save.weapons.length)return 'Tìm thứ còn chạm được · Đến khối ký ức và nhấn E';
 if(g.arena?.loop&&!g.nodes[0].destroyed)return g.loopCount?'Đèn sáng đúng lúc Fu Hua bị kéo trở lại · Phá nút trên cột đèn':'Fu Hua bị vây · Đánh lui quái để đến chỗ bà ấy';
 if(g.arena?.loop)return 'Vòng lặp đã đứt · Dọn đường cho Fu Hua thoát ra';
 if(g.arena?.m===2000)return g.phase==='dialogue'?'Một câu hỏi chưa bao giờ nghĩ sẽ nghe': 'Giữ lối ra · Nagazora Husk đang chặn đường Fu Hua';
 if(g.arena?.m===1700)return 'Bảo vệ đường thoát · Không để Fu Hua bị kéo trở lại';
 if(g.arena)return `${g.arena.m===100?'Buộc chúng phải nhìn thấy mình':'Tiến về phía giọng nói'} · Đợt ${g.wave}/${g.arena.waves.length}`;
 return currentScene().objective;
}
function updateNarrative(dt){
 const p=g.p,m=p.x/64;g.interaction=null;
 if(!save.weapons.length){
  if(p.x>chapter.swordCrystal.m*64+95)p.x=chapter.swordCrystal.m*64+95;
  if(Math.abs(p.x-chapter.swordCrystal.m*64)<80)g.interaction={id:'sword',label:'E · Chạm vào thanh kiếm'};
 }
 for(const beat of chapter.beats||[]){if(m<beat.m||g.storyEvents.has(beat.id)||beat.requiresMemory&&!g.memories.has(beat.requiresMemory))continue;g.storyEvents.add(beat.id);say(beat.speaker,beat.text);}
 for(const clue of chapter.investigations||[]){if(g.storyEvents.has(clue.id)||Math.abs(p.x-clue.m*64)>105)continue;g.interaction={id:clue.id,label:'E · '+clue.title};if(pressed.has('KeyE')&&g.phase==='explore'){g.storyEvents.add(clue.id);dialogue(clue.lines,()=>{g.phase='explore'});}}
 const prompt=$('#interaction-prompt');prompt.hidden=!g.interaction||g.phase==='dialogue';prompt.textContent=g.interaction?.label||'';
 for(const roof of g.world.platforms){if(!roof.crumble||roof.destroyed)continue;if(p.support===roof.id&&!roof.crack)roof.crack=1.25;if(roof.crack){roof.crack-=dt;if(roof.crack<=0){roof.destroyed=true;spark(roof.x+roof.w/2,roof.y,'#d7b798',12);}}}
 if(g.arena?.loop&&g.rescueState!=='freed')g.rescueState=g.loopCount?'failed':'trapped';
}
function wrapNarrative(text,x,y,width,lineHeight=23,color='#ede4de',size=15){
 ctx.font=`500 ${size}px Segoe UI`;ctx.textAlign='left';ctx.fillStyle=color;let line='',row=0;
 for(const word of text.split(' ')){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){ctx.fillText(line,x,y+row*lineHeight);line=word;row++;}else line=next;}if(line)ctx.fillText(line,x,y+row*lineHeight);
}
function drawFuHuaLoop(){
 const freed=g.nodes[0]?.destroyed,t=g.presentationTime%7,x=g.arena?.loop?g.arena.x+430-g.camera:730;
 const alpha=freed?1:t>5.9?.25+.5*Math.abs(Math.sin(t*19)):.75;
 ctx.save();
 if(!freed){ctx.strokeStyle='#d989ef88';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x,425);ctx.quadraticCurveTo(x+100,230+i*35,x+220,415);ctx.stroke();}}
 if(t<3.8&&!freed)drawSprite('hua.'+(1+Math.floor(t*3)%4),x,490,1,1,alpha);
 else if(t<5.5&&!freed){ctx.translate(x,490);ctx.rotate(-.55);drawSprite('hua.0',0,0,.95,1,alpha);}
 else drawSprite('hua.0',x,490,1,1,alpha);
 if(!freed){drawStoryEnemy({kind:'enemy',y:490,hp:100,face:-1,attackTimer:t>3.5&&t<5?1:0},x+150);label(t>5.9?'LAI LỊCH ĐANG BỊ VIẾT ĐÈ…':t>3.8?'...CÒN MỘT ĐỢT NỮA.':'FU HUA',x,340,t>5.9?'#eda6d5':'#ded3c9',11);}
 else label('BÀ ẤY ĐÃ NGHE THẤY BẠN',x,355,'#b5ded4',11);
 ctx.restore();
}
function drawNarrative(){
 const t=g.presentationTime,p=g.p;
 for(const bolt of g.projectiles){const x=bolt.x-g.camera;drawSprite('loot.4',x,bolt.y+10,.33,bolt.vx>0?1:-1);ctx.strokeStyle='#ed9edb';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,bolt.y);ctx.lineTo(x-Math.sign(bolt.vx)*28,bolt.y);ctx.stroke();}
 for(const roof of g.world.platforms){if(roof.crack>0&&!roof.destroyed){const x=roof.x-g.camera;ctx.strokeStyle='#ffb991';ctx.beginPath();ctx.moveTo(x+10,roof.y);ctx.lineTo(x+roof.w*.5,roof.y+15);ctx.lineTo(x+roof.w-5,roof.y+3);ctx.stroke();label('MÁI ĐANG VỠ',x+roof.w/2,roof.y-18,'#ffc9a5',10);}}
 if(g.mode!=='story')return;
 if(currentScene().id==='roofs'&&g.p.x/64>705&&g.p.x/64<745){const ex=850-(g.p.x/64-705)*10;drawSprite('hua.0',ex,300,1.05,1,.5+Math.sin(t*8)*.15);}
 if(['escape','husk'].includes(currentScene().id)&&g.nodes[0]?.destroyed&&g.phase!=='dialogue'){drawSprite('hua.0',g.p.x-g.camera-110,490,1,1,.55+.1*g.nodes.filter(n=>n.destroyed).length);}
 for(const clue of chapter.investigations||[]){const x=clue.m*64-g.camera;if(x<-60||x>W+60)continue;drawCrystal(x,405,12,g.storyEvents.has(clue.id)?'#9ebcb988':'#e3c5a9');label(clue.title,x,370,'#d6c6b7',10);}
 // Unbroken forward movement changes the foreground composition throughout each district.
 if(g.phase!=='dialogue'&&g.speechTime>0&&g.speech){ctx.fillStyle='#11121ce8';ctx.fillRect(195,540,760,86);ctx.fillStyle='#bd9d7e';ctx.fillRect(195,540,2,86);wrapNarrative(g.speech.speaker,213,560,720,20,'#edc08f',12);wrapNarrative(g.speech.text,213,586,720,21);}
 if(g.phase!=='dialogue')return;
 ctx.fillStyle='#080912';ctx.fillRect(0,0,W,35);ctx.fillRect(0,470,W,178);
 const opening=!save.introSeen,stage=g.dialogueIndex;
 if(opening){
  // Camera and actors change with each line: the monster crosses Senti's translucent body.
  const im=sceneSources[0];ctx.drawImage(im,im.width*.12,im.height*.08,im.width*.72,im.height*.72,0,35,W,435);ctx.fillStyle='#0c142047';ctx.fillRect(0,35,W,435);
  const ghost=stage>=2&&stage<=5,px=430;
  if(stage===0){drawSprite('idle.5',px,476,1.7,1,.65);label('NAGAZORA / SAU MỘT KHOẢNG TRỐNG',W/2,105,'#c4b9bf',13);}
  else drawSprite(stage===4?'sword.0':'idle.5',px,465,1.65,1,ghost?.4+Math.abs(Math.sin(t*9))*.2:1);
  if(stage>=2){const ex=stage===3?650-(g.dialogueClock*90)%530:700;drawStoryEnemy({kind:'enemy',y:465,hp:100,face:-1},ex);}
  if(stage===3){for(let i=0;i<8;i++){ctx.fillStyle='#c1b7ff33';ctx.fillRect(px-50+Math.sin(t*7+i)*15,290+i*18,90,3);}label('KHÔNG MỘT ÁNH NHÌN QUAY LẠI',W/2,138,'#d4c3d7',15);}
  if(stage===4){drawCrystal(px+90,365,35,'#c2a6f144');label('...',px+90,290,'#dac6e4',24);}
  if(stage===5){ctx.fillStyle='#c0a6f64f';for(let i=0;i<6;i++)ctx.fillRect(px+35+Math.sin(t*11+i)*25,330+i*9,22,3);}
  if(stage===6){drawCrystal(800,340,80,'#bca0ef99');ctx.drawImage(swordCrystalArt,769,275,62,150);label('MỘT THỨ VẪN CÒN CHẠM ĐƯỢC',790,215,'#e6d7b6',13);}
 }else if(g.memoryVision){
  ctx.fillStyle='#392b28da';ctx.fillRect(0,35,W,435);drawSprite('hua.0',690,435,1.7,-1);drawSprite('idle.5',420,435,1.7,1);label(g.memoryVision==='hidden-1'?'MÙI CƠM CHÁY. MỘT GIỌNG NÓI QUEN.':'LẦN ĐẦU BIẾT MƯA LẠNH.',W/2,130,'#f0d0aa',18);for(let i=0;i<30;i++){ctx.fillStyle='#e5c09933';ctx.fillRect((i*47+t*8)%W,80+(i*59)%320,2,2);}
 }else if(g.arena?.loop&&g.rescueState==='failed'){
  cinematicBackdrop(2);ctx.fillStyle='#24152e88';ctx.fillRect(0,35,W,435);drawSprite('idle.5',520,455,1.6,1,.75);drawSprite('hua.0',650+(stage>=2?Math.sin(t*20)*5:0),455,1.6,-1,stage>=2?.35:1);if(stage>=2){for(let i=0;i<5;i++){ctx.fillStyle='#ecc5ff55';ctx.fillRect(585,300+i*24,150,3);}label('LAI LỊCH ĐANG BỊ VIẾT ĐÈ',W/2,120,'#dfa5de',17);}
 }else if(g.arena?.m===2000&&g.memories.has('main-1')&&stage<11){
  cinematicBackdrop(3);ctx.fillStyle=stage>=2?'#10121a99':'#10121a55';ctx.fillRect(0,35,W,435);drawSprite('idle.5',450,455,1.65,1);drawSprite('hua.0',725,455,1.65,-1);if(stage===2||stage===3){ctx.fillStyle='#08091288';ctx.fillRect(0,35,W,100);label('...',W/2,195,'#d7cfca',30);}
  if(stage>=5&&stage<=7){ctx.fillStyle='#d9c7b52a';ctx.fillRect(300,150,560,260);label('MỘT BÀN TAY ĐƯA RA GIỮA ĐỔ NÁT',W/2,155,'#e2c9a6',15);}
 }
}
function showUpgrade(){g.phase='upgrade';keys.clear();$('#upgrade-panel').hidden=false;}
$$('[data-run-upgrade]').forEach(b=>b.onclick=()=>{if(!g||g.mode!=='endless'||g.phase!=='upgrade')return;const type=b.dataset.runUpgrade;if(type==='power')g.runBuff+=.15;if(type==='heal')g.hp=Math.min(maxHP(),g.hp+maxHP()*.35);if(type==='guard')g.p.invuln=8;g.upgrades++;g.nextUpgrade+=30;g.phase='explore';$('#upgrade-panel').hidden=true;keys.clear();pressed.clear();});
$('#checkpoint-gear').onclick=()=>{if(!g||g.mode!=='story')return;save=structuredClone(committed);gear()};


let ambience;
function updateAmbience(){
 if(!audio)return;
 if(!ambience){const bus=audio.createGain();bus.gain.value=0;bus.connect(audio.destination);const voices=[0,1,2,3].map(()=>{const o=audio.createOscillator(),v=audio.createGain();o.type='sine';v.gain.value=.045;o.connect(v).connect(bus);o.start();return o});ambience={bus,voices,key:''};}
 const active=!muted&&screen==='play'&&g&&!['paused','finished'].includes(g.phase),silence=g?.phase==='dialogue'&&g.arena?.m===2000&&g.memories.has('main-1')&&g.dialogueIndex>=2&&g.dialogueIndex<=4;
 ambience.bus.gain.setTargetAtTime(active&&!silence?.3:0,audio.currentTime,.5);
 if(!active)return;const scene=g.mode==='endless'?'endless':currentScene().id,key=g.phase==='arena'?'battle':scene;
 if(ambience.key!==key){ambience.key=key;const chord=key==='battle'?[98,130.81,146.83,196]:key==='loop'?[110,130.81,164.81,220]:key==='escape'?[103.83,138.59,155.56,207.65]:[130.81,155.56,196,261.63];ambience.voices.forEach((o,i)=>o.frequency.setTargetAtTime(chord[i],audio.currentTime,1.2));}
}

function cinematicBackdrop(cell){const cw=sceneAtlas.width/2,ch=sceneAtlas.height/2;ctx.drawImage(sceneAtlas,(cell%2)*cw,Math.floor(cell/2)*ch,cw,ch,0,35,W,435);}

function weaponSkill(){if(!g||save.equippedCore!=='cas_ii_namiko'||(g.weaponSkillCD||0)>0||!['explore','arena'].includes(g.phase))return;g.weaponSkillCD=10;const p=g.p;for(const e of g.enemies)if(e.hp>0&&(e.x-p.x)*p.face>0&&Math.abs(e.x-p.x)<550)hitEnemy(e,Math.round(stats(save).atk*4.5),'weapon-skill');spark(p.x+p.face*120,p.y-45,'#b9d7ff',30);tone(145,.3,'triangle');toast('WANDER · SÓNG XUNG KÍCH',1.5);}
