import {openJourneys,journeyName,openAudioSettings} from './story-panels.js';
import {updateEnvironment,drawEnvironment} from './environment-runtime.js';
import {safeGround,snowPhase,canCollect} from './story-environment.js';
import {initHusk,huskDamage,updateHusk,drawHusk} from './boss-husk.js?v=20261004a';
import {initChariot,chariotDamage,hitChariotPylons,dashChariotPylons,updateChariot,drawChariot} from './boss-chariot.js';
import {initHeimdall,heimdallDamage,interruptHeimdall,updateHeimdall,drawHeimdall} from './boss-heimdall.js?v=20261004a';
import {initParvati,parvatiDamage,interruptParvati,updateParvati,drawParvati} from './boss-parvati.js?v=20261004a';
import {initPhantom,phantomDamage,interruptPhantom,updatePhantom,drawPhantom} from './boss-phantom.js';
import {initSevenSwords,sevenSwordsDamage,interruptSevenSwords,updateSevenSwords,drawSevenSwords} from './boss-seven-swords.js';
import {initJizo,jizoDamage,interruptJizo,updateJizo,drawJizo} from './boss-jizo.js';
import {initMnemosyne,mnemosyneDamage,interruptMnemosyne,updateMnemosyne,drawMnemosyne,mnemosyneGate} from './boss-mnemosyne.js?v=20261004a';
import {GameAudio} from './audio-system.js';
import {initializeSessions,writeSession,listSessions,createSession,selectSession,renameSession} from './story-sessions.js';
import {ensureGear,stats,grantGear,addXP} from './gear-system.js';
import {renderLoadout} from './loadout.js';
import {sanitizeSave} from './save-validation.js';
import {createAlbumUI,ensureAlbum,unlockAlbum,unlockSideAlbum} from './memory-album.js';
import {createCourtyardState,updateCourtyard,drawCourtyard,courtyardObjective,ensureCourtyard} from './taixuan-courtyard.js';
import {createMemoryTrial,updateMemoryTrial,drawMemoryTrial,memoryTrialObjective} from './taixuan-side-memories.js?v=20261005a';
import {addForgePart} from './story-crafting.js';
import {SAVE_KEY,newSave,readSave,clamp,overlap,jumpRange,makeWorld,addPattern,solidPlatforms,movePlayer,body,WEAPONS,ENEMIES} from './engine.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],canvas=$('#game'),ctx=canvas.getContext('2d');
const W=1152,H=648,DT=1/60,QA=new URLSearchParams(location.search).has('qa');
initializeSessions(localStorage);
const gameAudio=new GameAudio();
let manifest,animations,chapter,chapterOne,chapterTwo,chapterThree,chapterFour,chapterFive,chapterSix,chapterSeven,patterns,atlas,swordCrystalArt,forgeMaterialArt,sideItemArt,taixuanEvidenceArt,storyStructureArt,memoryProjectorArt,storyInteractableArt,storyCollectibleArt,nagazoraClueArt,huskArt,parvatiArt,perfectTimelineStatuesArt,sceneAtlas,enemyAtlas,enemyManifest,terrainAtlas,terrainManifest,chariotArt,chariotPylonSword,chariotPylonDash,chariotPylonSpear,heimdallArt,flyerArt,machineArt,courtyardArt,courtyardProps,courtyardBoard,courtyardPost,courtyardFirewood,courtyardBlanket,courtyardGarden,courtyardCat,courtyardRoof,courtyardWaterYoke,courtyardLeaves,courtyardBell,courtyardTeaSet,sevenSwordsArt,sevenSwordsCombatArt,bossConceptArt,phantomCombatArt,jizoCombatArt,quantaProps,ch6Keepsakes,mnemosyneArt,ch7Artifacts,backgrounds=[],sceneSources=[],terrain=[],frames={},save=sanitizeSave(readSave(localStorage))||ensureGear(newSave()),committed=structuredClone(save),g=null,screen='home',keys=new Set(),pressed=new Set(),muted=false,audio=null,last=0,acc=0,manual=false,albumUI=null;
ensureAlbum(save);ensureCourtyard(save);
const metrics={jumps:0,landings:0,slides:0,gatePasses:0,gapsCleared:0,falls:0,respawns:0,swings:0,hits:0,kills:0,checkpoints:[],arenas:[],states:[],damageTaken:0};
const metric=(name)=>{if(!metrics.states.includes(name))metrics.states.push(name)};
function tone(freq=440,duration=.08,type='sine',volume=.035){if(muted||!audio)return;try{const o=audio.createOscillator(),v=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(40,freq*.62),audio.currentTime+duration);v.gain.setValueAtTime(volume*gameAudio.settings.sfx,audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(v).connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch{}}
function enableAudio(){try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();gameAudio.unlock(audio)}catch{}}
function persist(){try{if(g?.demo||g?.mode==='endless'&&g.phase!=='finished')return;const old=localStorage.getItem(SAVE_KEY);if(old)localStorage.setItem(SAVE_KEY+'-backup',old);localStorage.setItem(SAVE_KEY,JSON.stringify(save));writeSession(localStorage,save);committed=structuredClone(save);syncHome()}catch{toast('Không lưu được trên thiết bị này')}}
function maxHP(){return stats(save).hp}
function toast(text,duration=2.8){$('#toast').textContent=text;$('#toast').classList.add('show');if(g)g.toastTime=duration;}
function switchScreen(s){screen=s;$('#world-gallery').hidden=s!=='home';for(const id of ['home','play','loadout'])$('#'+id).hidden=id!==s;$('#album-screen').hidden=s!=='album';keys.clear();pressed.clear();if(s==='play')requestAnimationFrame(()=>$('#game').focus({preventScroll:true}));}
function syncHome(){
 $('#journey-name').textContent=journeyName(localStorage);
 const arc=save.cleared.includes(2000)||save.chapter===2;
 $('#home').classList.toggle('arc-active',arc);
 $('#story').textContent=save.cleared.includes(8900)?'STORY HOÀN THÀNH · XEM KẾT QUẢ →':save.cleared.includes(7720)?'TIẾP TỤC CHƯƠNG 07 →':save.cleared.includes(6580)?'TIẾP TỤC CHƯƠNG 06 →':save.cleared.includes(5440)?'TIẾP TỤC CHƯƠNG 05 →':save.cleared.includes(4300)?'TIẾP TỤC CHƯƠNG 04 →':save.cleared.includes(3200)?'TIẾP TỤC CHƯƠNG 03 →':arc?'TIẾP TỤC CHƯƠNG 02 →':save.started?'TIẾP TỤC KÝ ỨC →':'BẮT ĐẦU HÀNH TRÌNH →';$('#story').disabled=!atlas;
 $('#endless').disabled=!atlas;$('#endless').textContent='ENDLESS · THỬ THÁCH ĐỘC LẬP →';$('#endless-record').textContent=`KỶ LỤC ${save.endlessBest||0} ĐIỂM · TRANG BỊ STORY ĐƯỢC GIỮ RIÊNG`;
 $('#save-summary').textContent=`LEVEL ${save.level} · ${save.gold} VÀNG · ${save.crystals} CRYSTAL · CHECKPOINT ${save.checkpoint.m} M`;
 $('#chapter-two').textContent=save.cleared.includes(8900)?'STORY · 7 CHƯƠNG ĐÃ HOÀN THÀNH':save.cleared.includes(7720)?'CHƯƠNG 07 · IMAGINARY TREE ĐÃ MỞ':save.cleared.includes(6580)?'CHƯƠNG 06 · BIỂN LƯỢNG TỬ ĐÃ MỞ':save.cleared.includes(5440)?'CHƯƠNG 05 · THÁI HƯ SƠN ĐÃ MỞ':save.cleared.includes(4300)?'CHƯƠNG 04 · BABYLON ĐÃ MỞ':save.cleared.includes(3200)?'CHƯƠNG 03 · HELHEIM LABS ĐÃ MỞ':arc?'CHƯƠNG 02 · ARC CITY ĐÃ MỞ':'CHƯƠNG 02 · HOÀN THÀNH CHƯƠNG 1 ĐỂ MỞ';
 if(save.cleared.includes(8900)){$('.hero-copy .eyebrow').textContent='07 / KÝ ỨC KHÔNG ĐỊNH NGHĨA TA';$('.hero-copy > p').innerHTML='Mnemosyne đã ngừng hiệu đính.<br>Senti và Phù Hoa tự chọn con đường kế tiếp.';$('.chapter-number').textContent='07';$('.chapter-card h2').textContent='Câu chuyện đã hoàn thành';$('.chapter-card p').textContent='ALBUM KÝ ỨC · ENDLESS · BÀN RÈN';$('.chapter-card .thin-line + span').textContent='Xem ending → Hoàn thiện Album → Rèn trang bị cuối';return;}
 if(save.cleared.includes(7720)){$('.hero-copy .eyebrow').textContent='07 / GỐC CÂY TƯỞNG TƯỢNG';$('.hero-copy > p').innerHTML='Một thiên đường hoàn hảo đang đóng băng mọi sự sống.<br>Senti và Phù Hoa phải tự chọn ký ức được giữ lại.';$('.chapter-number').textContent='07';$('.chapter-card h2').textContent='Gốc Cây Tưởng Tượng';$('.chapter-card p').textContent='IMAGINARY TREE → NGAI MNEMOSYNE';$('.chapter-card .thin-line + span').textContent='Phá hoàn hảo → Kéo Senti trở lại → Chém định mệnh';return;}
 if(save.cleared.includes(6580)){$('.hero-copy .eyebrow').textContent='06 / HAI ĐƯỜNG, MỘT ĐIỂM ĐẾN';$('.hero-copy > p').innerHTML='Senti rơi vào Biển Lượng Tử. Phù Hoa tỉnh dậy giữa bão Kolosten.<br>Cả hai phải tự tìm đường trở lại.';$('.chapter-number').textContent='06';$('.chapter-card h2').textContent='Hai đường, một điểm đến';$('.chapter-card p').textContent='SEA OF QUANTA ↔ KOLOSTEN';$('.chapter-card .thin-line + span').textContent='Đổi góc nhìn → Từ chối hy sinh → Hạ Jizo';return;}
 if(save.cleared.includes(5440)){$('.hero-copy .eyebrow').textContent='05 / NGƯỜI KHÔNG CÓ KHUYẾT ĐIỂM';$('.hero-copy > p').innerHTML='Thái Hư hoàn hảo không có gió, bụi hay dấu chân.<br>Một Hư Ảnh đang buộc Phù Hoa lựa chọn.';$('.chapter-number').textContent='05';$('.chapter-card h2').textContent='Người không có khuyết điểm';$('.chapter-card p').textContent='THÁI HƯ SƠN · ĐỈNH ẢO ẢNH';$('.chapter-card .thin-line + span').textContent='Tìm đường thật → Mở Dual Combo → Hạ Hư Ảnh';return;}
 if(save.cleared.includes(4300)){$('.hero-copy .eyebrow').textContent='04 / TUYẾT VÀ NHỮNG ĐIỀU KHÔNG NÊN NHỚ';$('.hero-copy > p').innerHTML='Bão tuyết Babylon kéo Phù Hoa về những ký ức cô từng chôn.<br>Senti bước lên trước.';$('.chapter-number').textContent='04';$('.chapter-card h2').textContent='Tuyết và những điều không nên nhớ';$('.chapter-card p').textContent='SIBERIA → BABYLON LABS';$('.chapter-card .thin-line + span').textContent='Phá máy chiếu → Nhận Xích → Hạ Parvati';return;}
 if(save.cleared.includes(3200)){$('.hero-copy .eyebrow').textContent='03 / PHÒNG THÍ NGHIỆM CỦA NGƯỜI CHẾT';$('.hero-copy > p').innerHTML='Trong Helheim, mỗi bể chứa một phần ký ức Phù Hoa.<br>Heimdall đứng gác cổng tới Babylon.';$('.chapter-number').textContent='03';$('.chapter-card h2').textContent='Phòng thí nghiệm của người chết';$('.chapter-card p').textContent='HELHEIM LABS → SÂN BAY SCHICKSAL';$('.chapter-card .thin-line + span').textContent='Phá bể ký ức → Mở Assist → Hạ Heimdall';return;}
 $('.hero-copy .eyebrow').textContent=arc?'02 / THÀNH PHỐ KHÔNG NGỦ':'01 / KHÔNG AI NHỚ TA';$('.hero-copy > p').innerHTML=arc?'Arc City sáng đèn trong cơn mưa.<br>Phù Hoa và Senti đuổi theo ký ức bị đánh cắp.':'Giữa tàn tích Nagazora, một giọng nói quen thuộc<br>đã quên mất bạn.';
 $('.chapter-number').textContent=arc?'02':'01';$('.chapter-card h2').textContent=arc?'Thành phố không ngủ':'Không ai nhớ ta';$('.chapter-card p').textContent=arc?'ARC CITY → HELIOPOLIS → TÀU SCHICKSAL':'NAGAZORA · ĐÔ THỊ BỊ LÃNG QUÊN';$('.chapter-card .thin-line + span').textContent=arc?'Theo tín hiệu → Nhận Thương → Chặn Glitch Chariot':'Tỉnh lại → Tìm giọng nói → Phá vòng lặp';
}
function gear(){switchScreen('loadout');renderGear()}
function openAlbum(){save=sanitizeSave(readSave(localStorage))||save;ensureAlbum(save);switchScreen('album');albumUI?.open()}
function replayAlbumCard(card){const dialog=document.createElement('dialog');dialog.className='album-replay-dialog';const img=card.art?`<img src="${card.art}" alt="">`:'';dialog.innerHTML=`<button class="album-replay-close" aria-label="Đóng">×</button>${img}<div><span class="eyebrow">MEMORY REPLAY</span><h2>${card.title}</h2><p>${card.description||'Ký ức được phát lại từ Album. Tiến độ và phần thưởng không thay đổi.'}</p></div>`;document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal()}
function renderGear(){renderLoadout({save,changed(value){if(value){const clean=sanitizeSave(value);if(!clean)return false;try{localStorage.setItem(SAVE_KEY+'-archive-'+Date.now(),JSON.stringify(committed));save=clean;persist();renderGear();return true}catch{return false}}persist();},resume:()=>start('story'),draw(c,companion){const x=c.getContext('2d');function paint(now){if(!c.isConnected||screen!=='loadout')return;const t=now/1000;x.clearRect(0,0,c.width,c.height);drawSprite(Math.floor(t*2)%6===0?'idle.7':'idle.5',companion?145:185,270+Math.sin(t*4)*2,1.8,1,1,x);if(companion)drawSprite(Math.floor(t*3)%7===0?'hua.7':'hua.0',270,265+Math.sin(t*5)*3,1.35,-1,1,x);requestAnimationFrame(paint)}paint(performance.now())}})}
function createPlayer(x){return {x,y:chapter.physics.groundY,vx:0,vy:0,w:32,h:88,grounded:true,face:1,state:'idle',stateTime:0,attack:null,comboStep:0,comboTime:0,invuln:0,coyote:.1,jumpBuffer:0,slide:false,slideTime:0,landTime:0,hurtTime:0,support:null}}
function start(mode='story'){
 const demo=mode==='demo';enableAudio();save=sanitizeSave(readSave(localStorage))||ensureGear(newSave());ensureAlbum(save);ensureCourtyard(save);committed=structuredClone(save);
 if(demo){save=ensureGear(newSave());save.chapter=2;save.chapters=[1,2];save.level=4;save.weapons=['sword','spear'];save.weapon='spear';save.weaponLevels={sword:2,spear:2,chain:0};save.started=true;save.introSeen=true;save.checkpoint={m:3170,hp:stats(save).hp};save.visited=[0,2000,2140,2230,2400,2480,2650,2870,3000,3170];save.cleared=[2000,2200,2560,2850];save.nodes=['neon-sign'];save.memories=['main-1'];save.storyEvents=['ch2-opening','ch2-spear',...chapterTwo.beats.map(b=>b.id),...chapterTwo.cutscenes.map(c=>c.id)];mode='story';}
 if(mode==='endless'){save=structuredClone(save);save.weapons=['sword','spear','chain'];save.weapon='sword';save.weaponLevels={sword:1,spear:1,chain:1};}
 chapter=mode==='story'&&save.cleared.includes(7720)?chapterSeven:mode==='story'&&save.cleared.includes(6580)?chapterSix:mode==='story'&&save.cleared.includes(5440)?chapterFive:mode==='story'&&save.cleared.includes(4300)?chapterFour:mode==='story'&&save.cleared.includes(3200)?chapterThree:mode==='story'&&(save.chapter===2||save.cleared.includes(2000))?chapterTwo:chapterOne;
 if(mode==='story'&&chapter.chapter===5&&!save.storyEvents.includes('ch5-combat-v3-migrated')){
  const revised=new Set([5700,5985,6270,6580]);save.cleared=(save.cleared||[]).filter(m=>!revised.has(m));save.defeated=(save.defeated||[]).filter(id=>!/^a(5700|5985|6270|6580)/.test(id));save.storyEvents=(save.storyEvents||[]).filter(id=>!/^branch-[abc]:cleared$/.test(id));save.storyEvents.push('ch5-combat-v3-migrated');if(save.checkpoint.m>5480)save.checkpoint={m:5480,hp:stats(save).hp};persist();committed=structuredClone(save);
 }
 if(mode==='story'&&chapter.chapter===3&&save.checkpoint.m<3200)save.checkpoint={m:3200,hp:stats(save).hp};
 if(mode==='story'&&chapter.chapter===4&&save.checkpoint.m<4340)save.checkpoint={m:4340,hp:stats(save).hp};
 if(mode==='story'&&chapter.chapter===5&&save.checkpoint.m<5480)save.checkpoint={m:5480,hp:stats(save).hp};
 if(mode==='story'&&chapter.chapter===6&&save.checkpoint.m<6620)save.checkpoint={m:6620,hp:stats(save).hp};
 if(mode==='story'&&chapter.chapter===7&&save.checkpoint.m<7760)save.checkpoint={m:7760,hp:stats(save).hp};
 const world=mode==='story'?makeWorld(chapter,patterns):{gaps:[],platforms:[],coins:[],enemies:[],patterns:[],nextId:0,end:1e10};
 g={chapter:chapter.chapter,chapterGround:chapter.physics.groundY,mode,demo,world,p:createPlayer((mode==='story'?save.checkpoint.m:0)*64+60),hp:mode==='story'?Math.max(45,save.checkpoint.hp):maxHP(),phase:'explore',time:0,elapsed:mode==='story'?save.elapsed:0,camera:0,combo:0,comboTimer:0,particles:[],enemies:[],clear:new Set(mode==='story'?save.cleared:[]),collected:new Set(mode==='story'?save.collected:[]),visited:new Set(mode==='story'?save.visited:[0]),fieldSpawned:new Set(mode==='story'?save.defeated:[]),defeated:new Set(mode==='story'?save.defeated:[]),journal:structuredClone(save.journal||[]),sceneId:null,sceneTimer:0,nodes:(mode==='story'?chapter.nodes:[]).map(n=>({...n,x:n.m*64,y:430,w:44,h:82,destroyed:(save.nodes||[]).includes(n.id)})),memories:new Set(save.memories||[]),seenScenes:new Set(save.seenScenes||[]),speechTime:0,speechQueue:[],storyEvents:new Set(save.storyEvents),presentationTime:0,dialogueClock:0,projectiles:[],dash:0,dashCD:0,runBuff:1,nextUpgrade:30,upgrades:0,parry:0,parryCD:0,empowered:false,collapseX:1600*64-1100,loopCount:0,passedGates:new Set(),passedGaps:new Set(),assistCD:0,assistTime:0,hitstop:0,shake:0,swingId:0,toastTime:0,arena:null,wave:0,arenaDoneWait:0,deathTime:0,generated:0,seed:patterns.seed,runGold:0,score:0,nextLootMeter:750,endlessLoot:{},endlessDrops:[],powerPenalty:1,powerRating:0,endlessBoss:1000,endlessElite:250,checkToast:'',dialogue:[],dialogueIndex:0,courtyard:null,memoryTrial:null,protagonist:chapter.chapter===6&&save.checkpoint.m>=6840&&save.checkpoint.m<7060?'hua':'senti',mnemosyneSpecial:null,ch7Altars:new Set((save.storyEvents||[]).filter(id=>id.startsWith('ch7-altar-')))};
 if(mode==='story'&&chapter.chapter===5)unlockAlbum(save,'5-01','white');
 if(mode==='story'&&chapter.chapter===6)unlockAlbum(save,'6-01','white');
 if(mode==='story'&&chapter.chapter===7)unlockAlbum(save,'7-01','white');
 if(chapter.chapter===3&&mode==='story')g.lab={vats:chapter.vats.map(v=>({...v,x:v.m*64,opened:g.collected.has(v.id)})),assistHint:false};
 if(chapter.chapter>=3&&mode==='story')g.sideStories=(chapter.sideStories||[]).map(q=>({...q,x:q.m*64,state:g.storyEvents.has(q.id+':done')?'done':'idle',revealed:g.storyEvents.has(q.id+':revealed')}));
 g.dualCount=[1,2,3].filter(n=>g.storyEvents.has('dual-use-'+n)).length;
 if(mode==='endless')extendEndless();else if(chapter.chapter===1){g.world.platforms.push({id:'memory-sign',x:865*64-420,y:390,w:130,h:30,kind:'floating'},{id:'memory-step',x:865*64-245,y:330,w:120,h:30,kind:'floating'},{id:'memory-balcony',x:865*64-120,y:295,w:260,h:32,kind:'floating'});}switchScreen('play');$('#complete').hidden=true;$('#complete-home').textContent=demo?'VỀ MÀN HÌNH CHÍNH':'TRỞ VỀ CHUẨN BỊ';$('#pause-panel').hidden=true;$('#upgrade-panel').hidden=true;$('#interaction-prompt').hidden=true;$('#journal-panel').hidden=true;$('#dialogue').hidden=true;
 if(demo){g.p.x=3200*64+170;enterArena({...chapter.arenas.find(a=>a.m===3200),waves:[['chariot']]});}
 else if(mode==='story'&&chapter.chapter===3&&save.cleared.includes(4300)){g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 03 COMPLETE';$('#complete h2').innerHTML='Helheim đã mở<br>đường tới Babylon.';$('#complete-stats').textContent=`${Math.floor(save.elapsed/60)}:${String(Math.floor(save.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #3`;$('#complete p:nth-of-type(2)').textContent='Chương 3 hoàn thành. Câu chuyện tiếp tục ở Babylon.';$('#complete').hidden=false;}
 else if(mode==='story'&&chapter.chapter===4&&save.cleared.includes(5440)){g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 04 COMPLETE';$('#complete h2').innerHTML='Tuyết tan thành<br>cánh hoa Thái Hư.';$('#complete-stats').textContent=`${Math.floor(save.elapsed/60)}:${String(Math.floor(save.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #4`;$('#complete p:nth-of-type(2)').textContent='Chương 4 hoàn thành. Hư Ảnh Phù Hoa đang đợi trên đỉnh Thái Hư.';$('#complete').hidden=false;}
 else if(mode==='story'&&chapter.chapter===5&&save.cleared.includes(6580)){g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 05 COMPLETE';$('#complete h2').innerHTML='Hai người bị xé khỏi<br>cùng một ký ức.';$('#complete-stats').textContent=`${Math.floor(save.elapsed/60)}:${String(Math.floor(save.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #5`;$('#complete p:nth-of-type(2)').textContent='Mnemosyne đã xé đôi không gian. Senti và Phù Hoa hẹn sẽ tìm lại nhau.';$('#complete').hidden=false;}
 else if(mode==='story'&&chapter.chapter===7&&save.cleared.includes(8900)){g.phase='finished';$('#complete .eyebrow').textContent='STORY COMPLETE';$('#complete h2').innerHTML='Ký ức không định nghĩa ta.<br>Lựa chọn mới định nghĩa ta.';$('#complete-stats').textContent=`Ký ức #0 · ${save.album?.unlocked?.includes('7-09')?'Kết thúc bí mật':'Kết thúc chính'} · Endless Mode đã mở`;$('#complete p:nth-of-type(2)').textContent='Mnemosyne đã ngừng hiệu đính. Album giữ lại mọi lựa chọn của Senti và Phù Hoa.';$('#complete').hidden=false;}
 else if(mode==='story'&&chapter.chapter===6&&save.cleared.includes(7720)){g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 06 COMPLETE';$('#complete h2').innerHTML='Hai nửa ký ức<br>đã tìm thấy nhau.';$('#complete-stats').textContent=`${Math.floor(save.elapsed/60)}:${String(Math.floor(save.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #6`;$('#complete p:nth-of-type(2)').textContent='Imaginary Tree đã hiện ra. Mnemosyne đang hiệu đính Ký ức #0 ở gốc cây.';$('#complete').hidden=false;}
 else if(mode==='story'&&chapter.chapter>=4&&!save.storyEvents.includes(`ch${chapter.chapter}-opening`)){dialogue(chapter.opening,()=>{g.storyEvents.add(`ch${chapter.chapter}-opening`);save.storyEvents=[...g.storyEvents];save.chapter=chapter.chapter;save.started=true;persist();g.phase='explore';toast(chapter.chapter===4?'BABYLON · GIỮ S CHỐNG BÃO TUYẾT':chapter.chapter===5?'TAIXUAN · ĐI THEO GIÓ VÀ BỤI':chapter.chapter===6?'BIỂN LƯỢNG TỬ · HAI GÓC NHÌN ĐANG TÁCH RỜI':'IMAGINARY TREE · HỆ THỐNG ĐANG SỬA TÊN CHƯƠNG',4)})}
 else if(mode==='story'&&chapter.chapter===3&&!save.storyEvents.includes('ch3-opening')){dialogue(chapter.opening,()=>{g.storyEvents.add('ch3-opening');save.storyEvents=[...g.storyEvents];save.chapter=3;save.started=true;persist();g.phase='explore';toast('HELHEIM LABS · ĐỌC NHÃN BỂ TRƯỚC KHI PHÁ',4)})}
 else if(mode==='story'&&chapter.chapter===2&&!save.storyEvents.includes('ch2-opening')){dialogue(chapter.opening,()=>{g.storyEvents.add('ch2-opening');save.storyEvents=[...g.storyEvents];save.chapter=2;save.started=true;persist();g.phase='explore';toast('ARC CITY · FU HUA ĐANG CHẠY CÙNG',4)})}
 else if(mode==='story'&&(!save.introSeen&&save.checkpoint.m===0)){dialogue(chapter.opening,()=>{save.started=true;save.introSeen=true;save.journal=g.journal;persist();g.phase='explore';toast('D / → DI CHUYỂN · SPACE NHẢY',3)})}
 else toast(mode==='story'?`TRỞ LẠI CHECKPOINT ${save.checkpoint.m} M`:'ENDLESS · THEO ĐƯỜNG VÀNG');
 updateHUD();render();
}
function dialogue(lines,done){g.phase='dialogue';g.dialogue=lines;g.dialogueIndex=0;g.dialogueDone=done;g.dialogueClock=0;const id=JSON.stringify(lines);if(!g.journal.some(e=>e.id===id))g.journal.push({id,m:Math.floor(g.p.x/64),title:g.arena?.name||currentScene().name,lines:structuredClone(lines)});keys.clear();pressed.clear();$('#dialogue').hidden=false;$('#dialogue .eyebrow').textContent=`${g.arena?.name||'ĐOẠN MỞ ĐẦU'} · 1 / ${lines.length}`;showDialogue()}
function showDialogue(){g.dialogueClock=0;g.dialogueReveal=0;const line=g.dialogue[g.dialogueIndex];$('#speaker').textContent=line[0];g.dialogueFullText=line[1];$('#dialogue-text').textContent='';$('#dialogue .eyebrow').textContent=`${g.arena?.name||(!save.introSeen?'KHÔNG AI NHỚ TA':currentScene().name)} · ${g.dialogueIndex+1} / ${g.dialogue.length}`;const c=$('#portrait'),x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.imageSmoothingEnabled=true;c.dataset.portrait=drawDialoguePortrait(line[0],x)}
function nextDialogue(){if(!g||g.phase!=='dialogue')return;if(g.dialogueReveal<(g.dialogueFullText?.length||0)){g.dialogueReveal=g.dialogueFullText.length;$('#dialogue-text').textContent=g.dialogueFullText;return;}tone(500,.04);g.dialogueIndex++;if(g.dialogueIndex<g.dialogue.length)showDialogue();else{$('#dialogue').hidden=true;keys.clear();pressed.clear();g.dialogueDone?.();}}
function setAnim(state){const p=g.p;if(p.state!==state){p.state=state;p.stateTime=0;metric(state)}}
const WEAPON_KEY={sword:'1 · KIẾM',spear:'2 · THƯƠNG',chain:'3 · XÍCH'};
function inputFeedback(message){if(!g||g.lastInputFeedback===message&&g.time<(g.inputFeedbackUntil||0))return;g.lastInputFeedback=message;g.inputFeedbackUntil=g.time+1.15;toast(message,1.65)}
function selectWeapon(id){
 if(!g)return;
 if(g.protagonist==='hua'){inputFeedback('Đang điều khiển Phù Hoa · J dùng quyền pháp');return;}
 if(!save.weapons.includes(id)){inputFeedback(`${WEAPON_KEY[id]} chưa mở`);return;}
 if(g.p.attack||g.inputLock==='weapon'){
  g.pendingWeapon=id;
  inputFeedback(g.inputLock==='weapon'?`${WEAPON_KEY[id]} đã ghi nhận · chờ ấn khóa mở`:`${WEAPON_KEY[id]} đã ghi nhận · đổi sau đòn này`);
  return;
 }
 g.pendingWeapon=null;save.weapon=id;tone(550,.05);updateHUD();
}
function enterCourtyard(){if(g?.chapter!==5||g.phase!=='explore')return;g.courtyardReturnX=g.p.x;g.courtyard=createCourtyardState(save);g.phase='courtyard';g.interaction=null;keys.clear();pressed.clear();unlockAlbum(save,'5-02','white');persist();toast('SIDE MAP · SÂN SAU THÁI HƯ',3)}
function exitCourtyard(){if(!g?.courtyard)return;g.courtyard=null;g.phase='explore';g.p.x=g.courtyardReturnX||g.p.x;g.camera=Math.max(0,g.p.x-270);keys.clear();pressed.clear();persist();toast('TRỞ LẠI THÁI HƯ HOÀN HẢO',2)}
function courtyardDialogue(lines,done){dialogue(lines,()=>{g.phase='courtyard';done?.()})}
function courtyardAPI(){return {toast,selectWeapon,exit:exitCourtyard,persist(){save.storyEvents=[...g.storyEvents];persist();},addEvent(id){g.storyEvents.add(id);save.storyEvents=[...g.storyEvents];},unlock(id,mark,keepsake){unlockAlbum(save,id,mark,keepsake);},dialogue:courtyardDialogue};}
function enterMemoryTrial(quest){g.memoryTrial=createMemoryTrial(quest);g.phase='memory-trial';g.interaction=null;keys.clear();pressed.clear();toast('KÝ ỨC PHỤ · '+quest.title,2.5)}
function finishMemoryTrial(quest){g.memoryTrial=null;quest.state='done';g.storyEvents.add(quest.id);g.storyEvents.add(quest.id+':done');g.storyEvents.delete(quest.id+':active');if(quest.albumSide)unlockSideAlbum(save,quest.albumSide,'green',quest.keepsake);if(quest.album)unlockAlbum(save,quest.album,quest.mark||'green',quest.keepsake);if(g.chapter===6)addForgePart(save,'oblivion_inscription',1);if(quest.rewardPart)addForgePart(save,quest.rewardPart,quest.rewardPartCount||1);if(quest.blueprint)g.storyEvents.add(quest.blueprint);save.storyEvents=[...g.storyEvents];if(quest.rewardCrystals!==false)save.crystals+=quest.rewardCrystals??5;persist();g.storyVision='side-item:'+quest.item;dialogue([...(quest.end||[['Ký ức','Mảnh ký ức đã trở về đúng vị trí.']]),...(g.chapter===6?[['Vật liệu','Ký ức phụ để lại 1 Bản khắc Lãng Quên.']]:quest.rewardPart?[['Vật liệu',`Nhận ${quest.rewardPartCount||1} mảnh nguyên liệu riêng. Bản thiết kế đã được lưu tại Bàn rèn.`]]:[]),['Album',quest.albumSide?'Side Story đã được lưu vào Album.':`Ký ức Chương ${g.chapter} đã được cập nhật.`]],()=>{g.storyVision=null;g.phase='explore';toast('ALBUM · KÝ ỨC MỚI',2.5)});}
function beginAttack(){const p=g.p,weapon=g.protagonist==='hua'?'sword':save.weapon,w=WEAPONS[weapon];if(!w||p.attack||p.slide)return false;p.comboStep=p.comboTime>0?(p.comboStep%(g.dodgeCombo>0?5:3))+1:1;p.comboTime=1.15;const mult=p.comboStep===3?1.2:1;p.attack={weapon:g.protagonist==='hua'?'hua':weapon,baseWeapon:weapon,t:0,total:(w.startup+w.active+w.recovery)*mult,hit:new Set(),id:++g.swingId,step:p.comboStep};metrics.swings++;if(g.mode==='story')gameAudio.cue(p.comboStep%2?'slash-1':'slash-2');setAnim(`${weapon}_attack_${Math.min(3,p.comboStep)}`);tone(g.protagonist==='hua'?290:weapon==='spear'?160:210,.09,'triangle');return true}
function assist(){
 if(g?.chapter===6&&(g.protagonist==='hua'||!['reunion','jizo'].includes(currentScene().id))){toast('HAI NGƯỜI VẪN ĐANG BỊ TÁCH RỜI',1.4);return;}
 if(!save.assistUnlocked||g.assistCD>0||!['explore','arena'].includes(g.phase))return;
 const jizo=g.enemies.find(e=>e.hp>0&&e.ai?.type==='jizo');
 if(jizo?.ai.round===2&&!jizo.ai.rodCharged){toast('DỤ THIÊN LÔI ĐÁNH TRÚNG CỘT ĐANG SÁNG TRƯỚC',1.8);return;}
 const dual=!!save.dualUnlocked;g.assistCD=dual?14:18;g.assistTime=.75;g.hp=Math.min(maxHP(),g.hp+(dual?35:12));metric(dual?'dual_combo':'fu_hua_assist');
 if(dual){g.dualCount=(g.dualCount||0)+1;g.storyEvents.add('dual-use-'+Math.min(3,g.dualCount));}
 for(const e of g.enemies)if(e.hp>0&&Math.abs(e.x-g.p.x)<(dual?480:310)){
  if(e.ai?.type==='heimdall'){interruptHeimdall(e);spark(e.x,e.y-95,'#a9f5e8',28);say('Phù Hoa','Chuỗi kiếm đã bị ngắt! Đánh vào lõi ngay!');}
  if(e.ai?.type==='parvati'&&interruptParvati(e))say('Phù Hoa','Băng dưới chân nó đã vỡ. Bây giờ!');
  if(e.ai?.type==='phantom'&&dual&&interruptPhantom(e)){g.phantomDesaturation=0;g.phantomColorBurst=1;say('Senti','Hai người, một nhịp. Đồ giả, nhìn cho kỹ!');g.phantomRecord&&(g.phantomRecord.dualBreaks=(g.phantomRecord.dualBreaks||0)+1);}
  if(e.ai?.type==='seven-swords'&&interruptSevenSwords(e)){spark(e.x,e.y-95,'#b8f7e7',36);say('Phù Hoa','Bảy nhịp đã đủ. Senti, ngay bây giờ!');}
  if(e.ai?.type==='jizo'){
   if(!interruptJizo(e))continue;
   g.assistCD=e.ai.round===2?1.2:14;spark(e.x,e.y-95,'#a8f4ff',34);
   if(e.ai.round===2){g.jizoRecord&&(g.jizoRecord.rodsBroken=3-e.ai.rods);say('Phù Hoa','Cột dẫn đã vỡ. Dụ thiên lôi vào cột kế tiếp!');}
   else{g.jizoRecord&&(g.jizoRecord.dualBreaks=(g.jizoRecord.dualBreaks||0)+1);say('Phù Hoa','Giáp ảo đã vỡ. Senti, cùng đánh vào bản thể!');}
  }
  if(e.ai?.type==='mnemosyne'){
   if(!interruptMnemosyne(e))continue;
   spark(e.x,e.y-95,'#ffd9f2',44);g.mnemosyneRecord&&(g.mnemosyneRecord.dualBreaks=(g.mnemosyneRecord.dualBreaks||0)+1);say('Phù Hoa','Bản sao chỉ có một nhịp. Chúng ta có hai.');
  }
  hitEnemy(e,dual?260:85,dual?'dual':'assist');
 }
 tone(dual?1040:860,.25);toast(dual?'DUAL COMBO · SENTI × PHÙ HOA':'PHÙ HOA · PALM OF TAIXUAN',1.5);
}
function sevenGate(a){
 if(a.encounter==='branch-a')return a.armor?`THẮP SÁNG RỒI THƯƠNG PHÁ GIÁP ${3-a.armor}/3`:'SƠ HỞ ĐANG MỞ';
 if(a.encounter==='branch-b')return a.bell?`XÍCH KÉO CHUÔNG ${3-a.bell}/3`:'CHUÔNG ĐÃ VỠ';
 if(a.encounter==='branch-c')return a.state==='sheathe'?'E · THU KIẾM':a.inputLock==='dash'?'NÚT NÉ ĐÃ KHÓA':a.inputLock==='weapon'?'ĐỔI VŨ KHÍ ĐÃ KHÓA':'ĐỔI KIẾM → THƯƠNG → XÍCH';
 return a.formationRound===1?`NÉ 6 NHỊP ${a.formationEvades}/6 · PARRY NHỊP 7`:a.formationRound===2?`THƯƠNG PHÁ NEO ${3-a.formationAnchors}/3`:a.assistReady?'Q GỌI FU HUA':'XÍCH KÉO LÕI '+(3-a.memorySeals)+'/3';
}
function phantomGate(a){if(a.phase===1)return a.stance?`THƯƠNG PHÁ THẾ THỦ ${3-a.stance}/3`:a.open>0?'SƠ HỞ ĐANG MỞ':'KIẾM + K PHẢN QUYỀN';if(a.dualReady)return a.dualWindow>0?'CỬA SỔ DUAL ĐANG MỞ':'Q DUAL COMBO';const counter={sword:'THƯƠNG',spear:'XÍCH',chain:'KIẾM'}[a.copyWeapon];return `${counter} PHÁ THẾ ${a.copyWeapon==='sword'?'KIẾM':a.copyWeapon==='spear'?'THƯƠNG':'XÍCH'}`;}
function combatGuide(){
 if(!g||g.chapter!==5||g.phase==='dialogue'||g.phase==='memory-trial'||g.phase==='courtyard')return '';
 const enemy=g.enemies.find(e=>e.hp>0&&['seven-swords','phantom'].includes(e.ai?.type));
 if(enemy){
  const a=enemy.ai;
  if(a.type==='phantom'){
   if(a.phase===1)return a.stance>0?`Bước sát Hư Ảnh → nhấn 2 chọn THƯƠNG, J đánh ${3-a.stance}/3 lớp thủ.`:a.open>0?'Hư Ảnh đang hở: đứng sát, nhấn J đánh trước khi nó khép thế.':'Chờ đòn QUYỀN KÌNH → nhấn K đúng lúc để phản; K tự chọn Kiếm.';
   if(a.dualReady)return 'Ba vũ khí giả đã vỡ → đứng gần Hư Ảnh và nhấn Q cùng Phù Hoa kết liễu.';
   const counter={sword:'2 THƯƠNG',spear:'3 XÍCH',chain:'1 KIẾM'}[a.copyWeapon];return `Hư Ảnh đang cầm ${WEAPON_KEY[a.copyWeapon]}: đứng sát → ${counter} → J đánh để phá thế. Né kết thúc giả thật muộn.`;
  }
  if(a.encounter==='branch-a')return a.armor>0?(a.light<.72?'Đứng gần Triều Vũ (nhân vật có vòng sáng). Chờ cô ấy chém → K phản đòn 2 lần để thắp đèn.':`Ngạn Khanh đã lộ: đứng gần vòng sáng → 2 THƯƠNG → J đánh ${3-a.armor}/3 lớp giáp trước khi tắt đèn.`):'Giáp đã vỡ: K phản nhát Triều Vũ để mở sơ hở, rồi đứng gần và nhấn J đánh.';
  if(a.encounter==='branch-b')return a.bell>0?`Né tên bằng L. Đứng gần nhân vật có vòng sáng → 3 XÍCH → J đánh ${3-a.bell}/3 lần để phá chuông.`:'Chuông đã vỡ: đứng gần nhân vật có vòng sáng và nhấn J đánh. Không cần đánh Uyển Như riêng.';
  if(a.encounter==='branch-c')return a.state==='sheathe'?'Dừng đánh và nhấn E để THU KIẾM; đây là cách kết thúc trận.':a.inputLock==='weapon'?'Đổi vũ khí đang bị khóa tạm thời; phím 1/2/3 vẫn được ghi nhớ. L né rồi tiếp tục đổi.':'Đứng gần Lăng Sương → 1 KIẾM + J, 2 THƯƠNG + J, 3 XÍCH + J. Đừng đánh hai lần liền cùng một món.';
  if(a.formationRound===1)return `L né 6 đòn đầu (${a.formationEvades}/6); đòn thứ 7 có chữ NHỊP 7 thì đứng gần vòng sáng và nhấn K.`;
  if(a.formationRound===2)return `Đứng gần vòng sáng ở trung tâm → 2 THƯƠNG → J đánh ${3-a.formationAnchors}/3 neo. Fu Hua chỉ hướng đòn tới.`;
  return a.assistReady?'Ba lõi đã được kéo về → nhấn Q gọi Fu Hua phá trận.':`Đứng gần vòng sáng ở trung tâm → 3 XÍCH → J đánh ${3-a.memorySeals}/3 lõi.`;
 }
 const node=g.nodes.find(n=>!n.destroyed&&Math.abs(g.p.x-n.x)<500);
 if(node)return `Đứng sát phong ấn đang sáng → ${WEAPON_KEY[node.requiredWeapon]||'1 KIẾM'} → J đánh. Phá từ trái sang phải; nếu không nứt hãy đổi đúng vũ khí.`;
 return '';
}
function bossGate(e){const a=e.ai;if(a.type==='mnemosyne')return mnemosyneGate(a);if(a.type==='seven-swords')return sevenGate(a);if(a.type==='phantom')return phantomGate(a);if(a.type==='jizo')return a.round===1?`GIÁP ẢO ${a.illusionArmor}/3 · ĐỌC ĐỦ SÉT/KIẾM/LỬA`:a.round===2?a.rodCharged?`CỘT ĐÃ TÍCH ĐIỆN · Q PHÁ ${3-a.rods}/3`:'DỤ SÉT VÀO CỘT':a.round===3?a.coreOpen>0?`XÍCH KÉO LÕI ${3-a.cores}/3`:'K PHẢN GIAO KIẾM':a.open>0?`CỬA SỔ SÁT THƯƠNG ${Math.round(a.windowDamage)}/${a.quota}`:a.sequenceReady?'Q DUAL COMBO':`GIÁP ẢO · ${{sword:'KIẾM',spear:'THƯƠNG',chain:'XÍCH'}[a.order?.[a.sequenceStep]]||'VŨ KHÍ'} TIẾP THEO`;if(a.type==='parvati')return a.armor?`GIÁP BĂNG ${a.armor} · THƯƠNG`:a.open>0?'ĐANG GỤC':'XÍCH CHẶN CÚ LĂN';if(a.type==='heimdall')return a.shield?`KHIÊN ${a.shield} · THƯƠNG`:a.open>0?'LÕI ĐANG MỞ':'Q NGẮT KIẾM / K PHẢN ĐÂM';if(a.type==='chariot')return a.pylons.some(p=>!p.down)?'KHIÊN NỐI 3 TRỤ':a.plates?`GIÁP ẢO ${a.plates}`:a.open>0?'LÕI ĐANG MỞ':'K PHẢN LAO';return 'KHIÊN KÝ ỨC';}
function hitEnemy(e,damage,type='weapon'){
 if(e.hp<=0)return;
 if(e.iceArmor>0){if(type==='spear'){e.iceArmor--;spark(e.x,e.y-70,'#c9f5ff',18);pop(e.x,e.y-110,e.iceArmor?`GIÁP BĂNG ${e.iceArmor}`:'GIÁP BĂNG VỠ','#d8f8ff');}else if((e.blockPop||0)<g.time){pop(e.x,e.y-110,'THƯƠNG PHÁ GIÁP BĂNG','#d8f8ff');e.blockPop=g.time+.5;}return;}
 if(e.ai){
  const before=e.ai.plates??e.ai.shield??e.ai.armor??e.ai.stance??e.ai.bell??e.ai.rods??e.ai.cores;
  damage=e.ai.type==='mnemosyne'?mnemosyneDamage(e,damage,type):e.ai.type==='jizo'?jizoDamage(e,damage,type):e.ai.type==='chariot'?chariotDamage(e,damage,type):e.ai.type==='heimdall'?heimdallDamage(e,damage,type):e.ai.type==='parvati'?parvatiDamage(e,damage,type):e.ai.type==='phantom'?phantomDamage(e,damage,type):e.ai.type==='seven-swords'?sevenSwordsDamage(e,damage,type):huskDamage(e,damage);
  if(!damage){if((e.blockPop||0)<g.time){pop(e.x,e.y-120,bossGate(e),e.ai.type==='husk'?'#c9a5f5':'#9ee9ff');e.blockPop=g.time+.45;}const after=e.ai.plates??e.ai.shield??e.ai.armor??e.ai.stance??e.ai.bell??e.ai.rods??e.ai.cores;if(before>0&&after===0){spark(e.x,e.y-80,'#b5ecff',35);say('Senti',e.ai.type==='phantom'?'Thế thủ vỡ! Chờ quyền kình rồi phản lại!':e.ai.type==='seven-swords'?'Cơ chế phòng thủ đã vỡ. Đổi nhịp!':'Giáp vỡ! Đánh vào lõi!');}return;}
 }
 if(e.ai&&g.mode==='story'&&(g.powerPenalty||1)>1)damage=Math.max(1,Math.round(damage/(g.powerPenalty||1)));
 e.hp-=damage;e.hurt=.25;e.knock=type==='chain'?(g.p.x+g.p.face*90-e.x)*2:g.p.face*110;e.hitTime=.14;g.combo++;g.comboTimer=3;g.hitstop=.035;g.shake=4;metrics.hits++;if(g.mode==='story')gameAudio.cue('impact');pop(e.x,e.y-85,String(damage),'#ffe4ad');spark(e.x,e.y-45,'#f2b994',9);tone(120,.05,'square',.018);
 if(e.hp<=0){if(g.mode==='story')addXP(save,e.kind==='boss'?180:e.kind==='elite'?35:18);e.dead=.65;if(g.chapter===3&&['enemy','elite'].includes(e.kind))e.explode=.38;g.defeated.add(e.id);metrics.kills++;const amount=Math.floor(e.reward*(1+Math.min(g.combo,40)*.015));reward(amount,e.x,e.y-100);spark(e.x,e.y-50,'#b1a4f4',15);if(e.kind==='elite'||e.kind==='mini'||e.kind==='boss')save.materials+=e.kind==='elite'?1:3;}
}
function reward(amount,x,y){if(g.mode==='story')save.gold+=amount;else g.runGold+=amount;pop(x,y,`+${amount} ◈`,'#f5d58a');tone(900,.06)}
function equipmentPower(s){const v=stats(s),weapon=(s.weapons||[]).reduce((sum,id)=>sum+(s.weaponLevels?.[id]||0)*18,0),stigma=Object.values(s.stigmaInventory||{}).reduce((sum,item)=>sum+(item.level||0)*2,0),core=Object.values(s.cores||{}).reduce((sum,item)=>sum+(item.level||0)*3,0);return Math.round(v.atk*3+v.def*2+v.hp*.1+weapon+stigma+core);}
function endlessMaterial(distance){
 const pool=[{id:'materials',name:'Hợp kim',art:0,count:()=>2+Math.floor(random()*4)},{id:'crystals',name:'Tinh thể ký ức',art:1,count:()=>1+Math.floor(random()*3)},{id:'namiko_coil',name:'Cuộn mạch Namiko',art:2,count:()=>1}];
 if(committed.chapters?.includes(5))pool.push({id:'taixuan_script',name:'Ấn quyết Taixuan',art:3,count:()=>1});
 if(committed.chapters?.includes(6))pool.push({id:'oblivion_inscription',name:'Bản khắc Lãng Quên',art:4,count:()=>1});
 if(committed.chapters?.includes(7)){pool.push({id:'sentience_prism',name:'Lõi Ý Thức',art:5,count:()=>1},{id:'brick_rune',name:'Dấu ấn Gạch',art:7,count:()=>1},{id:'crimson_stamp',name:'Huy hiệu Bất Tận',art:8,count:()=>1});}
 if(committed.cleared?.includes(4300))pool.push({id:'dirac_residue',name:'Dư ảnh Dirac',art:10,count:()=>1});
 if(committed.cleared?.includes(6580))pool.push({id:'shattered_sword_shard',name:'Mảnh Kiếm Vỡ',art:11,count:()=>1});
 if(committed.cleared?.includes(8900))pool.push({id:'pericles_laurel',name:'Nguyệt Quế Hoàng Kim',art:12,count:()=>1});
 if(distance>=2500)pool.push({id:'torus',name:'Torus',art:9,count:()=>1});
 const rare=Math.min(.55,.12+distance/9000),entry=random()<rare?pool[Math.max(2,Math.floor(random()*pool.length))]:pool[Math.floor(random()*Math.min(2,pool.length))],count=entry.count();
 return {...entry,count,rare:entry.art>=2};
}
function applyEndlessLoot(s,loot){for(const [id,count] of Object.entries(loot||{})){if(id==='materials'||id==='crystals'||id==='torus')s[id]=(s[id]||0)+count;else addForgePart(s,id,count);}}
function damage(amount,sourceX){const p=g.p;if(g.dash>0){metric('perfect_dodge');}if(p.invuln>0||g.phase==='dying')return;const sv=stats(save,{combo:g.combo}),pressure=g?.arena&&g.mode==='story'?Math.min(1.45,g.powerPenalty||1):1;amount=Math.round(amount*pressure*100/(100+sv.def)*(1-sv.reduction)*((save.deaths?.[save.checkpoint.m]||0)>=3?.8:1));g.hp-=amount;metrics.damageTaken+=amount;p.invuln=1.0;p.hurtTime=.22;g.combo=0;p.vx=sourceX>p.x?-90:90;g.shake=8;spark(p.x,p.y-50,'#ed86a7',12);pop(p.x,p.y-95,`−${amount}`,'#ff9bb2');tone(90,.15,'sawtooth',.025);if(g.hp<=0)die(false)}
function die(fall){if(g.phase==='dying')return;if(fall&&g.chapter===7&&!g.storyEvents.has('ch7-first-fall-rescue')){g.storyEvents.add('ch7-first-fall-rescue');g.p.x=Math.max(save.checkpoint.m*64+80,g.p.x-420);g.p.y=chapter.physics.groundY;g.p.vy=0;g.p.invuln=2;g.hp=Math.max(1,g.hp-Math.round(maxHP()*.1));g.shake=18;dialogue(g.protagonist==='hua'?[['Senti','Old Timer, già rồi mắt mũi kèm nhèm à? Nắm xích!'],['Phù Hoa','Ta nhìn thấy. Cành cây tự biến mất.'],['Senti','Ừ, cứ đổ cho Mnemosyne. Lần này ta tin cô.']]:[['Senti','Ê Mnemosyne! Cưa cành bẫy ta thì gọi gì là hoàn hảo?'],['Phù Hoa','Cậu còn đủ sức cãi nhau nghĩa là không sao. Đi tiếp.']],()=>{g.phase='explore';});return;}g.phase='dying';g.deathTime=1.15;g.p.attack=null;setAnim('defeat');if(fall)metrics.falls++;toast(fall?'KÝ ỨC RƠI VỠ…':'KÝ ỨC CHƯA KẾT THÚC…',1.5);tone(75,.35,'triangle')}
function respawn(){
 metrics.respawns++;
 if(g.demo){start('demo');toast('DEMO · THỬ LẠI TỪ ĐẦU TRẬN',3);return;}
 if(g.mode==='endless'){const lootNames={materials:'Hợp kim',crystals:'Tinh thể',torus:'Torus',namiko_coil:'Cuộn mạch Namiko',taixuan_script:'Ấn quyết Taixuan',oblivion_inscription:'Bản khắc Lãng Quên',sentience_prism:'Lăng kính Ý Thức',brick_rune:'Phù văn Cục Gạch',crimson_stamp:'Ấn Đỏ Mực',dirac_residue:'Dư ảnh Dirac',shattered_sword_shard:'Mảnh Kiếm Vỡ',pericles_laurel:'Nguyệt Quế Hoàng Kim'};const lootText=Object.entries(g.endlessLoot||{}).map(([id,count])=>`${count} ${lootNames[id]||id}`).join(' · ')||'Chưa đạt mốc nguyên liệu';const result=`${Math.floor(g.p.x/64)} m · ${Math.floor(g.score)} điểm · ${lootText}`;g.phase='finished';save=structuredClone(committed);applyEndlessLoot(save,g.endlessLoot);save.endlessBest=Math.max(save.endlessBest||0,Math.floor(g.score));persist();$('#complete-stats').textContent=result;$('#complete .eyebrow').textContent='ENDLESS COMPLETE';$('#complete h2').textContent='Nguyên liệu đã mang về.';$('#complete p:nth-of-type(2)').textContent='Nguyên liệu theo mốc quãng đường đã được chuyển vào kho Story. Nâng cấp tạm trong lượt chạy đã kết thúc.';$('#complete').hidden=false;return;}
 const elapsed=g.elapsed;save=structuredClone(committed);save.deaths??={};save.deaths[save.checkpoint.m]=(save.deaths[save.checkpoint.m]||0)+1;persist();const mode=g.mode;start(mode);g.elapsed=elapsed;g.hp=maxHP();g.p.invuln=2;toast(`HỒI SINH · CHECKPOINT ${save.checkpoint.m} M`,2);
}
function checkpoint(m){if(g.visited.has(m)||g.mode!=='story')return;g.visited.add(m);g.hp=Math.min(maxHP(),g.hp+maxHP()*.12);save.checkpoint={m,hp:g.hp};save.cleared=[...g.clear];save.collected=[...g.collected];save.visited=[...g.visited];save.defeated=[...g.defeated];save.journal=g.journal;save.nodes=g.nodes.filter(n=>n.destroyed).map(n=>n.id);save.memories=[...g.memories];save.seenScenes=[...g.seenScenes];save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];g.p.invuln=Math.max(g.p.invuln,2);persist();metrics.checkpoints.push(m);toast('KÝ ỨC ĐÃ NEO · ESC ĐỂ MỞ TRANG BỊ',3);tone(660,.14);setTimeout(()=>tone(990,.2),120);spark(m*64,chapter.physics.groundY-65,'#95f2f0',26)}
function enterArena(event){
 g.arena={...event,x:event.m*64};g.wave=0;g.enemies=[];g.phase='dialogue';g.speechQueue=[];g.speechTime=0;g.p.vx=0;g.camera=g.arena.x-230;
 g.powerRating=equipmentPower(save);g.powerPenalty=event.power?Math.max(1,event.power/Math.max(1,g.powerRating)):1;
 if(event.power&&g.powerRating<event.power)toast(`TRANG BỊ ${g.powerRating} / ĐỀ NGHỊ ${event.power} · BOSS ĐANG ÁP ĐẢO`,4);
 if(event.unlock&&!save.weapons.includes(event.unlock)){save.weapons.push(event.unlock);save.weapon=event.unlock;save.weaponLevels[event.unlock]=1;toast(`ĐÃ MỞ ${WEAPONS[event.unlock].name.toUpperCase()} · ${['sword','spear','chain'].indexOf(event.unlock)+1}`,3)}
 if(g.mode==='endless'){g.phase='arena';spawnWave();return;}
 dialogue(event.before||[['Phù Hoa','Một ký ức mạnh đang xuất hiện. Hãy cẩn thận.']],()=>{g.phase='arena';spawnWave()});
}
function spawnEnemy(kind,x,id){const def=ENEMIES[kind]||ENEMIES.machine,boss=['boss','mini','chariot','heimdall','parvati','phantom','seven-swords','jizo','mnemosyne'].includes(kind),scale=g?.mode==='story'&&g.chapter>=3&&!boss?1+(g.chapter-2)*.16:1;const enemy={kind,id,x,y:kind==='flyer'?chapter.physics.groundY-110:chapter.physics.groundY,w:boss?104:48,h:boss?140:kind==='flyer'?65:74,...def,maxHP:Math.round(def.hp*scale),attackTimer:0,cooldown:1.2,telegraph:0,hurt:0,hitTime:0,knock:0,dead:0,face:-1,age:0};enemy.hp=enemy.maxHP;enemy.damage=Math.round(enemy.damage*(g?.chapter>=3?1+(g.chapter-2)*.06:1));if(g?.chapter===4&&!boss)enemy.iceArmor=['elite','machine'].includes(kind)?2:1;if(g?.chapter>=5&&!boss)enemy.cooldown=Math.max(.68,enemy.cooldown-.2);return enemy;}
function spawnWave(){g.wave++;g.arenaDoneWait=0;const wave=g.arena.waves[g.wave-1];wave.forEach((kind,i)=>{const enemy=spawnEnemy(kind,g.arena.x+570+i*98,`a${g.arena.m}w${g.wave}e${i}`);if(kind==='boss'&&g.mode==='story')initHusk(enemy);if(kind==='chariot'&&g.mode==='story')initChariot(enemy);if(kind==='heimdall'&&g.mode==='story')initHeimdall(enemy);if(kind==='parvati'&&g.mode==='story')initParvati(enemy);if(kind==='phantom'&&g.mode==='story')initPhantom(enemy);if(kind==='seven-swords'&&g.mode==='story')initSevenSwords(enemy,g.arena.encounter||'formation');if(kind==='jizo'&&g.mode==='story'){initJizo(enemy);g.jizoRecord={maxRound:1,maxCycle:1,evades:0,armorBreaks:0,rodsBroken:0,coresBroken:0,sequenceHits:0,dualBreaks:0};}if(kind==='mnemosyne'&&g.mode==='story'){initMnemosyne(enemy);g.mnemosyneRecord={maxPhase:1,maxRound:1,fakeBreaks:0,dualBreaks:0,qteSteps:0};}g.enemies.push(enemy);});toast(g.arena.encounter?.startsWith('branch-')?'MINI-BOSS KÝ ỨC':`WAVE ${g.wave} / ${g.arena.waves.length}`,1.6);}
function clearArena(){
 const a=g.arena;g.clear.add(a.m);metrics.arenas.push(a.m);g.combo=0;g.hp=Math.min(maxHP(),g.hp+maxHP()*.08);if(g.mode==='story')metrics.yattas=(metrics.yattas||0)+1;
 if(a.encounter){g.storyEvents.add(a.encounter+':cleared');if(a.encounter.startsWith('branch-')){g.sevenSwordsRecord??={branches:[]};g.sevenSwordsRecord.branches=[...new Set([...(g.sevenSwordsRecord.branches||[]),a.encounter])];}}
 if(a.m===6580){g.phantomDesaturation=0;g.phantomColorBurst=1;}
 if(g.mode==='story'){for(const id of chapter.gearRewards?.[a.m]||[])grantGear(save,id);save.equipmentUnlocked=true;save.crystals+=3;for(const event of chapter.blueprintRewards?.[a.m]||[])g.storyEvents.add(event);}
 if(a.m===2000&&g.mode==='story'){save.equipmentUnlocked=true;g.memories.add('main-1');g.speechQueue=[];g.speechTime=0;}
 if(a.m===3200&&g.mode==='story'){g.memories.add('main-2');g.speechQueue=[];g.speechTime=0;}
 if(a.m===4300&&g.mode==='story'){g.memories.add('main-3');g.speechQueue=[];g.speechTime=0;}
 if(a.m===5440&&g.mode==='story'){g.memories.add('main-4');g.speechQueue=[];g.speechTime=0;}
  if(a.m===6580&&g.mode==='story'){g.memories.add('main-5');unlockAlbum(save,'5-08','red');unlockAlbum(save,'5-09','white');g.speechQueue=[];g.speechTime=0;}
 if(a.m===7720&&g.mode==='story'){g.memories.add('main-6');unlockAlbum(save,'6-08','red');unlockAlbum(save,'6-09','white');g.speechQueue=[];g.speechTime=0;}
 if(a.m===8900&&g.mode==='story'){g.memories.add('main-7');unlockAlbum(save,'7-08','red');g.speechQueue=[];g.speechTime=0;}
 const finish=()=>{g.phase='explore';g.arena=null;toast('LỐI ĐI ĐÃ MỞ · ĐẾN CỔNG CHECKPOINT',2.4);
  if(g.demo){g.phase='finished';$('#complete .eyebrow').textContent='BOSS DEMO CLEAR';$('#complete h2').innerHTML='Glitch Chariot<br>đã gục xuống.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · ${g.chariotRecord?.parries||0} lần phản lao · ${metrics.respawns} lần thử lại`;$('#complete p:nth-of-type(2)').textContent='Đây là lượt thử riêng. Tiến độ Story của bạn vẫn được giữ nguyên.';$('#complete').hidden=false;return;}
  if(a.m===2000&&g.mode==='story'){save.chapters=[1,2];save.chapter=2;save.crystals+=20;save.materials+=5;save.cleared=[...g.clear];save.collected=[...g.collected];save.journal=g.journal;save.memories=[...g.memories];save.nodes=g.nodes.filter(n=>n.destroyed).map(n=>n.id);save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];save.checkpoint={m:2000,hp:g.hp};persist();g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER COMPLETE';$('#complete h2').innerHTML='Ký ức đầu tiên<br>đã trở về.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · 6 arena hoàn thành`;$('#complete p:nth-of-type(2)').textContent='Đã cứu ký ức #1 · Chương 2 tại Arc City đã mở. Trở về Chuẩn bị rồi tiếp tục Story.';$('#complete').hidden=false;}
  if(a.m===3200&&g.mode==='story'){save.chapters=[1,2,3];save.chapter=3;save.crystals+=28;save.materials+=8;save.cleared=[...g.clear];save.collected=[...g.collected];save.journal=g.journal;save.memories=[...g.memories];save.nodes=g.nodes.filter(n=>n.destroyed).map(n=>n.id);save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];save.checkpoint={m:3200,hp:g.hp};persist();g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 02 COMPLETE';$('#complete h2').innerHTML='Tàu đang đến<br>Helheim Labs.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #2`;$('#complete p:nth-of-type(2)').textContent='Ký ức #2,891 đang bị hiệu đính. Helheim Labs đã mở ở Chương 3.';$('#complete').hidden=false;}
  if(a.m===4300&&g.mode==='story'){g.storyEvents.add('forge-dirac');save.chapters=[1,2,3,4];save.chapter=4;save.crystals+=32;save.materials+=10;save.cleared=[...g.clear];save.collected=[...g.collected];save.journal=g.journal;save.memories=[...g.memories];save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];save.checkpoint={m:4300,hp:g.hp};persist();g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 03 COMPLETE';$('#complete h2').innerHTML='Ký ức đã thoát<br>khỏi Helheim.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #3`;$('#complete p:nth-of-type(2)').textContent='Cổng tới Babylon đã mở. Bản thiết kế Vết Thánh Dirac đã được lưu tại Bàn rèn.';$('#complete').hidden=false;}
  if(a.m===5440&&g.mode==='story'){save.chapters=[1,2,3,4,5];save.chapter=5;save.crystals+=36;save.materials+=12;save.cleared=[...g.clear];save.collected=[...g.collected];save.journal=g.journal;save.memories=[...g.memories];save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];save.checkpoint={m:5440,hp:g.hp};persist();g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 04 COMPLETE';$('#complete h2').innerHTML='Tuyết tan thành<br>hoa Thái Hư.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #4`;$('#complete p:nth-of-type(2)').textContent='Hư Ảnh Phù Hoa đang chờ trên đỉnh một Thái Hư hoàn hảo đến đáng ngờ.';$('#complete').hidden=false;}
  if(a.m===6580&&g.mode==='story'){g.storyEvents.add('forge-shattered-swords');save.chapters=[1,2,3,4,5,6];save.chapter=6;save.crystals+=42;save.materials+=15;save.cleared=[...g.clear];save.collected=[...g.collected];save.journal=g.journal;save.memories=[...g.memories];save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];save.checkpoint={m:6580,hp:g.hp};persist();g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 05 COMPLETE';$('#complete h2').innerHTML='Thái Hư vỡ đôi<br>giữa hai người.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #5`;$('#complete p:nth-of-type(2)').textContent='Đã mở bản thiết kế Shattered Swords. Mảnh Kiếm Vỡ sẽ xuất hiện trong Endless.';$('#complete').hidden=false;}
  if(a.m===7720&&g.mode==='story'){g.storyEvents.add('forge-keys-oblivion');save.chapters=[1,2,3,4,5,6,7];save.chapter=7;save.crystals+=48;save.materials+=18;save.cleared=[...g.clear];save.collected=[...g.collected];save.journal=g.journal;save.memories=[...g.memories];save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];save.checkpoint={m:7720,hp:g.hp};persist();g.phase='finished';$('#complete .eyebrow').textContent='CHAPTER 06 COMPLETE';$('#complete h2').innerHTML='Hai nửa ký ức<br>đã tìm thấy nhau.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · ${save.gold} vàng · Ký ức #6`;$('#complete p:nth-of-type(2)').textContent='Jizo đã vỡ. Đã mở bản thiết kế Keys of Oblivion; đủ 8 Bản khắc để rèn. Chương 7 tại Imaginary Tree đã mở.';$('#complete').hidden=false;}
  if(a.m===8900&&g.mode==='story'){const secret=['main-1','main-2','main-3','main-4','main-5','main-6','main-7',...Array.from({length:14},(_,i)=>`hidden-${i+1}`)].every(id=>g.memories.has(id));g.storyEvents.add('forge-domain');g.storyEvents.add('forge-brick-pri');g.storyEvents.add('forge-pericles');g.storyEvents.add('ch7-ending-main');if(secret){g.storyEvents.add('ch7-ending-secret');unlockAlbum(save,'7-09','red','Ký Ức #0');}else unlockAlbum(save,'7-09','white');for(let i=0;i<6;i++)addForgePart(save,'sentience_prism',1);save.chapters=[1,2,3,4,5,6,7];save.chapter=7;save.endlessUnlocked=true;save.crystals+=60;save.materials+=24;save.cleared=[...g.clear];save.collected=[...g.collected];save.journal=g.journal;save.memories=[...g.memories];save.elapsed=g.elapsed;save.storyEvents=[...g.storyEvents];save.checkpoint={m:8900,hp:g.hp};persist();g.phase='finished';$('#complete .eyebrow').textContent=secret?'SECRET ENDING · KÝ ỨC #0':'CHAPTER 07 COMPLETE';$('#complete h2').innerHTML=secret?'Ta vốn là mảnh cảm xúc<br>cô từng đánh mất.':'Chạy tiếp thôi,<br>Old Timer.';$('#complete-stats').textContent=`${Math.floor(g.elapsed/60)}:${String(Math.floor(g.elapsed%60)).padStart(2,'0')} · 7 chương hoàn thành · Endless đã mở`;$('#complete p:nth-of-type(2)').textContent=secret?'Senti không còn cần quá khứ cấp phép cho sự tồn tại của mình. Trang phục Origin, Ký ức #0 và bản thiết kế Pericles đã mở.':'Màu sắc đã trở lại. Bản thiết kế Pericles đã được lưu tại Bàn rèn; thu đủ ký ức để mở toàn bộ Ký ức #0.';$('#complete').hidden=false;}
 };
 if(g.mode==='story'){g.phase='celebrate';g.yattaTime=2.35;g.yattaArena=a.m;g.yattaDone=()=>dialogue(a.m===2000?[...a.after,...(chapter.gearStories?.[a.m]||[])]:[...(chapter.gearStories?.[a.m]||[]),...a.after],finish);keys.clear();pressed.clear();tone(784,.12,'triangle',.06);setTimeout(()=>tone(1046,.18,'triangle',.06),135);}else finish();
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
 const p=g.p;if(g.mnemosyneSpecial){p.vx=0;p.attack=null;return;}if(pressed.has('KeyL')&&g.dashCD<=0&&save.weapon&&g.inputLock!=='dash'){g.dash=.19;g.dashCD=Math.max(.65,1.5-(save.skills.dodge||0)*.12);p.invuln=Math.max(p.invuln,.25);g.dodgeCombo=2;metric('dodge');if(g.mode==='story')gameAudio.cue('evade',{cooldown:.65});spark(p.x,p.y-40,'#c2c0ff',7);}
 if(pressed.has('KeyD')||pressed.has('ArrowRight')){g.moveTapDir=1;g.moveTapTime=.09;}
 if(pressed.has('KeyA')||pressed.has('ArrowLeft')){g.moveTapDir=-1;g.moveTapTime=.09;}
 if(pressed.has('KeyS')||pressed.has('ArrowDown'))g.slideTapTime=.14;
 const heldRight=keys.has('KeyD')||keys.has('ArrowRight'),heldLeft=keys.has('KeyA')||keys.has('ArrowLeft');
 const tapMove=!heldRight&&!heldLeft&&(g.moveTapTime||0)>0?g.moveTapDir:0;
 const right=heldRight||tapMove===1,left=heldLeft||tapMove===-1,down=keys.has('KeyS')||keys.has('ArrowDown')||(g.slideTapTime||0)>0;
 g.moveTapTime=Math.max(0,(g.moveTapTime||0)-dt);g.slideTapTime=Math.max(0,(g.slideTapTime||0)-dt);
 const lowRoof=g.world.platforms.some(s=>s.kind==='gate'&&!s.destroyed&&p.x+p.w/2>s.x&&p.x-p.w/2<s.x+s.w&&p.y>s.y+s.h&&p.y-88<s.y+s.h);
 const wasSlide=p.slide;p.slide=p.grounded&&(down||lowRoof);p.h=p.slide?56:88;if(p.slide){p.slideTime+=dt;if(!wasSlide){metrics.slides++;setAnim('slide_start')}}else if(wasSlide){p.slideTime=0;setAnim('slide_end')}
 let vx=right?speed():left?-chapter.physics.backSpeed:0;
 if(g.mode==='story'&&g.environment?.weather?.kind==='snow'&&snowPhase(g.environment.clock)==='gust'&&p.grounded&&safeGround(g.world,p.x,320))vx*=down?.52:.72;
 if(g.environment?.weather?.kind==='wind'&&g.dash<=0)vx*=right?.68:1;
 if(g.chapter===4&&currentScene().id==='babylon-hall'&&g.nodes.some(n=>n.id.startsWith('memory-projector')&&!n.destroyed))vx*=.72;
 if(g.mode==='endless'&&!g.arena&&!left)vx=speed();if(g.arena&&g.mode==='endless'&&!right&&!left)vx=0;
 if(g.dash>0)vx=p.face*760;else if(p.attack&&p.grounded)vx*=.38;if(p.hurtTime>0)vx*=.5;
 if((g.mode==='endless'&&Math.floor(p.x/64/500)%5===2||g.environment?.weather?.kind==='slip')&&p.grounded)p.vx+=(vx-p.vx)*Math.min(1,dt*3);else p.vx=vx;
 if(Math.abs(vx)>1)p.face=Math.sign(vx);
 if(p.grounded)p.airJumps=1;if(pressed.has('Space')&&!p.grounded&&p.coyote<=0&&(p.airJumps||0)>0){p.vy=-chapter.physics.jumpVelocity*.85;p.airJumps--;metrics.jumps++;tone(480,.08);}if(pressed.has('Space'))p.jumpBuffer=.12;else p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);
 p.coyote=p.grounded?.1:Math.max(0,p.coyote-dt);
 if(p.jumpBuffer>0&&p.coyote>0&&!p.slide){p.vy=-chapter.physics.jumpVelocity;p.grounded=false;p.jumpBuffer=0;p.coyote=0;p.landTime=0;metrics.jumps++;setAnim('jump_start');tone(360,.08,'triangle')}
 for(const [code,id]of [['Digit1','sword'],['Digit2','spear'],['Digit3','chain']])if(pressed.has(code))selectWeapon(id);
 if(g.pendingWeapon&&!p.attack&&g.inputLock!=='weapon')selectWeapon(g.pendingWeapon);
 if(pressed.has('KeyR'))weaponSkill();if(pressed.has('KeyQ'))assist();if(pressed.has('KeyK')&&g.parryCD<=0){
  const canParry=g.protagonist==='hua'||save.weapons.includes('sword');
  if(canParry){if(g.protagonist!=='hua'&&save.weapon!=='sword'){save.weapon='sword';updateHUD();}p.attack=null;g.parry=.48;g.parryCD=.5;p.invuln=Math.max(p.invuln,.12);metric('parry');spark(p.x,p.y-52,'#c7fff5',10);pop(p.x,p.y-116,'PHẢN ĐÒN','#d9fff8');tone(620,.07,'square');}
 }
 if(pressed.has('KeyJ'))g.attackBuffer=.24;
 g.attackBuffer=Math.max(0,(g.attackBuffer||0)-dt);
 if(!p.attack&&(keys.has('KeyJ')||g.attackBuffer>0)){
  if(beginAttack())g.attackBuffer=0;
  else if(p.slide&&pressed.has('KeyJ'))inputFeedback('Đang trượt · thả S rồi nhấn J để đánh');
 }
}
function updateCombat(dt){
 const p=g.p;
 if(p.attack){const a=p.attack,w=WEAPONS[a.baseWeapon||a.weapon];a.t+=dt;const active=a.t>=w.startup&&a.t<w.startup+w.active;
  if(active){const hit={x:p.face>0?p.x:p.x-w.range,y:p.y-(a.weapon==='spear'?156:90),w:w.range,h:a.weapon==='spear'?150:82};
   for(const e of g.enemies){if(e.hp<=0||a.hit.has(e.id))continue;if(overlap(hit,{x:e.x-e.w/2,y:e.y-e.h,w:e.w,h:e.h})){a.hit.add(e.id);const armor=a.weapon==='spear'?0:e.armor||0;const v=stats(save,{combo:g.combo}),dmg=Math.round(v.atk*(a.weapon==='sword'?.75:a.weapon==='spear'?1.1:.55*2)*(1+v.physical)*(1+v.total+v.normal)*(1+(save.skills.sword||0)*.05)*(a.step>=3?1.4:1)*(1-armor)*100/120*(1+Math.min(.2,g.combo*.002))*(random()<v.crit?v.critDamage:1)*(g.mode==='endless'?g.runBuff:1));hitEnemy(e,Math.round(dmg*(g.empowered?2:1)),a.weapon);if(v.sets.marco_polo>=2&&g.combo>25&&a.step>=3&&(g.marcoHitCD||0)<=0){g.marcoHitCD=5;hitEnemy(e,Math.round(v.atk*2.5),'echo');}g.empowered=false}}
   for(const boss of g.enemies)if(boss.hp>0&&boss.ai?.type==='chariot')hitChariotPylons(boss,a.weapon,hit,a.id,pylon=>{spark(pylon.x,405,pylon.color,20);pop(pylon.x,355,pylon.down?'TRỤ ĐÃ TẮT':`TRỤ CÒN ${pylon.hits} NHỊP`,pylon.color);g.shake=9;tone(260,.13,'square');});
   for(const n of g.nodes)if(!n.destroyed&&!a.hit.has(n.id)&&Math.abs(p.x-n.x)<w.range+20&&p.y>340){if(chapter.chapter===1&&n.order===0&&g.loopCount<1)continue;if(n.requiredWeapon&&n.requiredWeapon!==a.weapon){inputFeedback(`Phong ấn này cần ${WEAPON_KEY[n.requiredWeapon]} rồi nhấn J`);continue;}const previous=g.nodes.filter(v=>v.order<n.order);if(previous.some(v=>!v.destroyed)){inputFeedback('Phá phong ấn trước theo thứ tự từ trái sang phải');continue;}a.hit.add(n.id);n.hp-=w.damage+save.weaponLevels[a.weapon]*4;spark(n.x,430,'#e2a7ff',14);if(n.hp<=0){n.destroyed=true;g.storyEvents.add('node:'+n.id);g.speechQueue=[];g.speechTime=0;if(n.order===0&&chapter.chapter===1){g.rescueState='freed';say('Phù Hoa','...Tuổi trẻ? Cậu... ở đó sao?');}g.shake=12;reward(25,n.x,370);say('Senti',chapter.chapter===3?{ 'glass-wall':'Kính nứt rồi. Sau đó còn một ký ức giấu kín!', 'coolant-pipe':'Ống vỡ! Nước đổ xuống dập lửa dưới chân Old Timer.', 'quarantine-wall':'Tường mở rồi. Phù Hoa, vào đây!' }[n.id]:chapter.chapter===2?'Biển hiệu vỡ rồi! Lối ra khỏi vòng lặp mở lại.':n.order===0?'Vòng lặp đã đứt!':n.order===3?'Old Timer, ra khỏi đó mau!':`Còn ${3-n.order} nút nữa!`);}}
   if(g.chapter===3)for(const vat of g.lab.vats)if(!vat.opened&&!a.hit.has(vat.id)&&Math.abs(p.x-vat.x)<w.range+10&&p.y>340){if(a.weapon!=='sword')continue;a.hit.add(vat.id);vat.opened=true;g.collected.add(vat.id);spark(vat.x,410,vat.kind==='blue'?'#8cecf0':'#f07e9a',22);if(vat.kind==='blue'){save.crystals+=4;reward(16,vat.x,390);say('Phù Hoa','Một ký ức thật. Cảm ơn cậu đã trả lại nó.');}else{const bug=spawnEnemy('elite',vat.x+120,vat.id+'-guard');g.enemies.push(bug);say('Senti','Ối! Bể đỏ nhốt con sống. Đọc nhãn trước khi chém chứ!');}}
   for(const b of g.world.platforms)if(b.kind==='breakable'&&!b.destroyed&&!a.hit.has(b.id)&&overlap(hit,b)){a.hit.add(b.id);b.hp-=w.damage+save.weaponLevels[a.weapon]*4;spark(b.x+b.w/2,b.y+30,'#c6b79c',12);if(b.hp<=0){b.destroyed=true;reward(8,b.x,b.y)}}
  }
  if(a.t>=a.total){p.attack=null;p.comboTime=.7;}
 }
 for(const boss of g.enemies)if(boss.hp>0&&boss.ai?.type==='chariot')dashChariotPylons(boss,p,g.dash,pylon=>{spark(pylon.x,405,pylon.color,24);pop(pylon.x,355,pylon.down?'TRỤ ĐÃ TẮT':`TRỤ CÒN ${pylon.hits} NHỊP`,pylon.color);g.shake=10;tone(310,.15,'triangle');});
 g.inputLock=null;
 for(const e of g.enemies){e.age+=dt;e.hurt=Math.max(0,e.hurt-dt);e.hitTime=Math.max(0,e.hitTime-dt);
  if(e.hp<=0){e.dead-=dt;if(e.explode>0){e.explode-=dt;if(e.explode<=0&&!e.exploded){e.exploded=true;spark(e.x,e.y-45,'#83f5cf',28);if(Math.abs(p.x-e.x)<115)damage(165,e.x);}}continue;}e.x+=e.knock*dt;e.knock*=Math.exp(-8*dt);e.cooldown-=dt;e.face=p.x<e.x?-1:1;
  if(e.ai?.type==='mnemosyne'){
   updateMnemosyne(e,g,dt,{damage,say,impact:spark,
    attackHeld:()=>keys.has('KeyJ'),attackPressed:()=>pressed.has('KeyJ'),advanceHeld:()=>keys.has('KeyD')||keys.has('ArrowRight')||keys.has('KeyE'),advancePressed:()=>pressed.has('KeyE'),
    qtePressed(kind){return kind==='up'?(pressed.has('ArrowUp')||pressed.has('KeyW')):kind==='right'?(pressed.has('ArrowRight')||pressed.has('KeyD')):kind==='down'?(pressed.has('ArrowDown')||pressed.has('KeyS')):kind==='left'?(pressed.has('ArrowLeft')||pressed.has('KeyA')):pressed.has('KeyJ');},
    special(kind){g.mnemosyneSpecial=kind;g.inputLock='all';g.protagonist=kind==='erase'?'hua':'senti';p.vx=0;p.attack=null;},prompt(text){toast(text,1.2);},
    lateDodge(count){metric('mnemosyne_late_dodge');pop(p.x,p.y-116,`NÉ TRỄ ${count}/3`,'#d2fff0');},
    voiceRead(count){metric('mnemosyne_true_voice');spark(p.x,p.y-55,'#c8ffed',30);pop(p.x,p.y-116,`GIỌNG THẬT ${count}/3`,'#d7fff1');},
    parry(count){metric('perfect_parry');g.parryFlash={x:p.x,y:p.y-50,life:.5,kind:'rush',target:e.x};spark(p.x,p.y-55,'#ffe0ed',34);pop(p.x,p.y-118,`VẾT NỨT ${count}/3`,'#ffe8f2');},
    anchorBreak(left){metric('mnemosyne_anchor_break');g.shake=15;spark(p.x,p.y-76,'#e3c7ff',35);pop(p.x,p.y-126,`XÍCH CẮT NEO · CÒN ${left}`,'#f5ddff');if(left===0)say('Senti','Ba sợi neo đã đứt. Old Timer, trở về đây!');},
    forceSave(){g.hp=Math.max(1,Math.min(g.hp,Math.ceil(maxHP()*.01)));p.invuln=2.2;g.huaStrike={from:p.x-150,to:p.x+35,targetX:e.x,y:e.y-85,life:.9,max:.9};spark(p.x,p.y-70,'#d4fff1',55);dialogue([['Mnemosyne','Sai lệch còn một phần trăm. Tiến hành xóa.'],['Phù Hoa','Không được phép đụng vào cô ấy!'],['Senti','Old Timer... cô vừa phá cả luật hồi chiêu đấy.'],['Phù Hoa','Cậu dạy ta rằng có những lúc luật nên bị phá.']],()=>{g.phase='arena';});},
    fakeStart(){g.mnemosyneSpecial='fake';g.inputLock='all';g.mnemosyneRecord&&(g.mnemosyneRecord.fakeStarts=(g.mnemosyneRecord.fakeStarts||0)+1);toast('MISSION ACCOMPLISHED: HOÀN HẢO',2.2);},
    fakeBroken(){g.mnemosyneSpecial=null;g.inputLock=null;g.mnemosyneRecord&&(g.mnemosyneRecord.fakeBreaks++);g.shake=30;spark(p.x,p.y-80,'#ff658e',70);say('Senti','Kết thúc giả mà cũng đòi lừa ta? Vỡ đi!');},
    eraseComplete(){g.mnemosyneSpecial='ultimate';g.protagonist='senti';g.inputLock='all';g.hp=Math.max(g.hp,Math.round(maxHP()*.2));g.shake=34;dialogue([['Phù Hoa','Một bức tranh không có bóng tối là một bức tranh mù lòa.'],['Phù Hoa','Cậu không phải lỗi. Cậu là nét vẽ đẹp nhất ta vô tình có được.'],['Senti','Vậy thì nắm chắc vào, Old Timer. Chúng ta chém thẳng vào cái gọi là hoàn hảo!']],()=>{g.phase='arena';g.mnemosyneSpecial='ultimate';});},
    qteStep(step){g.mnemosyneRecord&&(g.mnemosyneRecord.qteSteps=Math.max(g.mnemosyneRecord.qteSteps,step));g.shake=14+step*4;spark(e.x,e.y-90,step%2?'#ff759a':'#fff0ba',28+step*7);},
    ultimateComplete(){g.mnemosyneSpecial=null;g.inputLock=null;g.shake=50;unlockAlbum(save,'7-08','red','Vết Chém Trên Sự Hoàn Hảo');dialogue([['Mnemosyne','Một cỗ máy... không thể hiểu tại sao các người lại thích chảy máu.'],['Phù Hoa','Chúng ta không thích đau.'],['Senti','Bọn ta chỉ không để ngươi dùng nỗi sợ đau để quyết định thay.'],['Mnemosyne','Vậy cứ ôm lấy cái lộn xộn đó đi. Chúc may mắn.']],()=>{g.phase='arena';});},
    defeated(){g.mnemosyneSpecial=null;g.inputLock=null;},
    memory14(){if(!g.memories.has('hidden-14')){g.memories.add('hidden-14');unlockAlbum(save,'7-02','green','Bình Minh Trên Núi');say('Senti','Old Timer... ký ức này là của chúng ta.');}},
    roundChange(phase,round){g.mnemosyneSpecial=null;g.inputLock=null;if(g.mnemosyneRecord){g.mnemosyneRecord.maxPhase=Math.max(g.mnemosyneRecord.maxPhase,phase);g.mnemosyneRecord.maxRound=Math.max(g.mnemosyneRecord.maxRound,round);}g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.14));p.invuln=Math.max(p.invuln,1.5);const lines={
     '1-2':[['Mnemosyne','Ba lăng kính đang rơi. Dữ liệu sửa lỗi sẽ dựng chúng lại nếu ngươi chậm.'],['Phù Hoa','Mở giáp bằng đúng vũ khí. Đập vỡ cả ba trước khi lính Dọn Dẹp tới.']],
     '1-3':[['Senti','Mưa dữ liệu à? Cuối cùng cũng chịu đánh nghiêm túc.'],['Phù Hoa','Đọc vùng trống. Tôi sẽ dựng nơi trú tạm nếu cậu bị ép góc.']],
     '2-1':[['Mnemosyne','Mẫu chiến đấu đã được ghi nhận. Sai số sẽ bị loại bỏ.'],['Senti','Vậy xem ngươi đoán được một kẻ cố tình đánh trễ không!']],
     '2-2':[['Phù Hoa','Nó dựng giáp theo vũ khí cậu đang cầm.'],['Senti','Ta đổi vũ khí ngay giữa combo. Cho nó đoán tiếp.']],
     '2-3':[['Mnemosyne','Sư phụ, người đã mệt rồi. Hãy nghỉ đi.'],['Senti','Các người không có quyền nhân danh họ! Old Timer đang ở hiện tại với ta!']],
     '2-4':[['Mnemosyne','Sao chép Ultimate. Loại bỏ biến số.'],['Phù Hoa','Nó chỉ sao chép được một người.'],['Senti','Q Dual Combo. Cho nó thấy thứ không thể học lỏm!']],
     '3-1':[['Mnemosyne','Kích hoạt hình thái Fu Hua Hoàn Hảo. Cảm xúc là sai số.'],['Senti','Vậy ta sẽ khiến cái hoàn hảo của ngươi nổi giận.']],
     '3-2':[['Mnemosyne','Tách nguồn sai số khỏi Hua.'],['Senti','Xích của ta không chỉ trói người. Nó kéo Old Timer về!']],
     '3-3':[['Mnemosyne','Senti sẽ tiếp tục khiến ngươi bị thương.'],['Phù Hoa','Đau đớn không cho ngươi quyền lựa chọn thay ta.']],
     '3-4':[['Phù Hoa','Ba vết nứt. Kiếm, Thương, Xích. Giữ Cảm Xúc trên ngưỡng.'],['Senti','Phá xong, ta sẽ tự trả lời lời đề nghị của nó.']]
    };dialogue(lines[`${phase}-${round}`]||[['Senti','Đổi nhịp. Chúng ta đi tiếp.']],()=>{g.phase='arena';});}
   });continue;
  }
  if(e.ai?.type==='jizo'){
   updateJizo(e,g,dt,{damage,say,impact:spark,
    summon(kinds,tag){for(const [i,kind] of kinds.entries()){const guard=spawnEnemy(kind,g.arena.x+(i?710:15),`jizo-guard-${tag}-${i}-${Math.floor(g.time)}`);guard.bossGuard=true;guard.hp=guard.maxHP=Math.round(guard.hp*1.25);g.enemies.push(guard);}},
    evade(count,move,moveCount,armor){metric('jizo_evade');if(g.jizoRecord){g.jizoRecord.evades=Math.max(g.jizoRecord.evades,count);g.jizoRecord.armorBreaks=Math.max(g.jizoRecord.armorBreaks||0,3-armor);}pop(p.x,p.y-112,`${move==='storm'?'SÉT':move==='blades'?'KIẾM':'LỬA'} ${moveCount}/2`,'#b9edff');spark(p.x,p.y-55,'#9ae8ff',18);if(count===1)say('Phù Hoa','Giáp ảo chỉ nứt khi cậu đọc trọn từng loại đòn. Mỗi loại hai lần.');if(count===6)say('Senti','Ba lớp giáp vỡ rồi. Old Timer, chuẩn bị phá nguồn sét!');},
    rodPrimed(index){metric('jizo_rod_primed');spark(e.ai.rodPositions[index],g.chapterGround-48,'#9cecff',34);pop(e.ai.rodPositions[index],g.chapterGround-112,'CỘT ĐÃ TÍCH ĐIỆN · Q','#dffbff');say('Senti','Dính bẫy rồi! Old Timer, phá cột ngay!');},
    coreExposed(index){metric('perfect_parry');g.parryFlash={x:p.x,y:p.y-50,life:.5,kind:'rush',target:e.x};spark(e.x,e.y-80,'#f6d8ff',36);pop(e.x,e.y-126,`LÕI ${index+1} LỘ RA · XÍCH`,'#ffe8ba');say('Phù Hoa','Giao kiếm đã bị phản. Dùng Xích kéo lõi ký ức ra!');},
    cycleChange(cycle,order){if(g.jizoRecord)g.jizoRecord.maxCycle=Math.max(g.jizoRecord.maxCycle||1,cycle);g.shake=24;p.invuln=Math.max(p.invuln,1.5);dialogue([['Mnemosyne',`Lớp giáp ảo thứ ${cycle} đang tái cấu trúc. Thứ tự cộng hưởng đã thay đổi.`],['Senti',`${order.map(x=>x==='sword'?'Kiếm':x==='spear'?'Thương':'Xích').join(' → ')}. Nhớ cho kỹ, đánh sai là nó dựng lại từ đầu!`],['Phù Hoa','Phá đủ ba lớp rồi gọi tôi. Chúng ta chỉ có một cửa sổ ngắn.']],()=>{g.phase='arena';});},
    windowClosed(){say('Mnemosyne','Cửa sổ sát thương đã đóng. Giáp ảo đang tái tạo.');toast('GIÁP ẢO TÁI TẠO · LÀM LẠI CHUỖI',2);},
    roundChange(round){if(g.jizoRecord)g.jizoRecord.maxRound=Math.max(g.jizoRecord.maxRound,round);g.shake=22;g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.15));p.invuln=Math.max(p.invuln,1.8);const lines={
     2:[['Ký ức · Kolosten','Ba cột dẫn giữ Jizo trong cơn bão. Quyền kình không thể phá chúng khi chưa tích đủ thiên lôi.'],['Senti','Ta đứng sát cột cho nó khóa mục tiêu, rồi lướt ra. Khi cột sáng lên, cô phá bằng Q.'],['Phù Hoa','Hiểu rồi. Nhưng những ký ức hộ vệ cũng đã thức dậy. Đừng để chúng khóa đường né.']],
     3:[['Mnemosyne','Nguồn sét đã mất. Ba lõi ký ức đang thay thế kết cấu đã vỡ.'],['Phù Hoa','Phản Giao Kiếm bằng K để ép lõi lộ ra. Cậu chỉ có một nhịp dùng Xích.'],['Senti','Vừa né kiếm rơi với lửa đất, vừa phản đòn rồi kéo lõi. Cuối cùng cũng giống một trận đánh!']],
     4:[['Ký ức của Senti','Nếu ký ức cứ dựng lại lớp vỏ mới... ta sẽ phá nó bao nhiêu lần?'],['Ký ức của Phù Hoa','Cho đến khi thứ còn lại là lựa chọn của chính chúng ta.'],['Mnemosyne','Ba chu kỳ giáp ảo. Sai thứ tự vũ khí sẽ phục hồi toàn bộ lớp chắn.'],['Senti','Vậy phá đúng thứ tự, gọi Q, rồi đánh đủ lực trước khi cửa sổ đóng. Làm ba lần.']]
    };dialogue(lines[round],()=>{g.phase='arena';});}
   });continue;
  }
  if(e.ai?.type==='seven-swords'){
   updateSevenSwords(e,g,dt,{damage,say,weapon:()=>save.weapon,impact:spark,lock(value){g.inputLock=value;},sheatheRequested:()=>pressed.has('KeyE'),
    parry(x,progress){metric('perfect_parry');g.parryFlash={x:p.x,y:p.y-50,life:.5,kind:'rush',target:x};spark(x,e.y-70,'#ffe2ad',34);pop(x,e.y-125,e.ai.encounter==='branch-a'?`ÁNH SÁNG ${Math.round(progress*100)}%`:'NHỊP THỨ BẢY ĐÃ LỆCH','#fff0bd');},
    evade(count,move){if(count==='arrow'){metric('silent_arrow_dodge');spark(p.x,p.y-55,'#d9f7ff',12);return;}metric('seven_formation_dodge');spark(p.x,p.y-55,'#c8f7ff',20);pop(p.x,p.y-112,`NÉ NHỊP ${Math.min(count,6)}/6`,'#c8f7ff');if(count===1)say('Phù Hoa',move==='wave'?'Nhảy qua cuồng phong. Sáu nhịp đầu chỉ né.':'Đừng phản công. Hãy đọc đủ sáu nhịp đầu.');if(count===6)say('Senti','Nhịp thứ bảy là của Triều Vũ. Ta sẽ phản lại!');},
    punish(kind){metric('taixuan_counter');pop(p.x,p.y-118,kind==='branch-c'?'LẶP COMBO · PHẢN ĐÒN CHÍ MẠNG':'SAI CƠ CHẾ · THẾ PHẢN KÍCH','#ff9db4');},
    resetFormation(){toast('TRẬN HÌNH KHÔI PHỤC · ĐỌC LẠI 6 NHỊP',1.8);},
    sheathePrompt(){g.shake=18;g.storyVision='choice';dialogue([['Trình Lăng Sương','Kiếm của con đã học hết cách người chiến đấu. Người còn gì để dạy?'],['Phù Hoa','Có một bài ta đã không dạy con khi con mười ba tuổi.'],['Senti','Được. Lần này không cần thắng bằng chém.']],()=>{g.storyVision=null;g.phase='arena';toast('[ E ] THU KIẾM · KẾT THÚC TRẬN ĐẤU',3);});},
    sheatheComplete(){g.inputLock=null;g.shake=12;dialogue([['Senti','Ta thu kiếm. Đánh tiếp cũng chẳng chứng minh được gì.'],['Trình Lăng Sương','...Tra kiếm vào vỏ. Hoá ra đó cũng là một lựa chọn.'],['Phù Hoa','Bây giờ con đã học được cách dừng lại.']],()=>{g.phase='arena';});},
    roundChange(round){g.shake=20;g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.12));p.invuln=Math.max(p.invuln,1.6);const memories={
     2:[['Giang Uyển Hề','Âm thanh đã mất. Chỉ còn chuyển động của bàn tay.'],['Phù Hoa','Nhìn ta. Ta sẽ chỉ hướng của ba neo trận pháp.'],['Senti','Cô ra dấu, ta ném Thương. Không cần nghe vẫn phối hợp được.']],
     3:[['Tô My','Lõi ký ức đã bị khóa. Chém nó cũng là chém chúng con lần nữa.'],['Senti','Vậy ta kéo chúng về tâm. Old Timer sẽ chém thứ đang trói các ngươi.'],['Phù Hoa','Edge of Taixuan lần này dùng để giải thoát, không phải kết tội.']]
    };dialogue(memories[round],()=>{g.phase='arena';});}
   });continue;
  }
  if(e.ai?.type==='parvati'){updateParvati(e,g,dt,{damage,say,impact:spark,summon(kinds){for(const [i,kind] of kinds.entries()){const guard=spawnEnemy(kind,g.arena.x+(i?700:10),`parvati-guard-${e.ai.phase}-${i}`);guard.bossGuard=true;g.enemies.push(guard);}},phaseTwo(){g.shake=24;g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.4));p.invuln=Math.max(p.invuln,2);g.storyVision='parvati-phase';dialogue([['Senti','Nó đóng băng toàn bộ mặt đất rồi!'],['Phù Hoa','Để ta giúp ngươi. Tôi sẽ phá lớp băng dưới chân nó!'],['Senti','Ta dùng Thương phá giáp, Xích chặn cú lăn. Kết thúc thôi!']],()=>{g.storyVision=null;g.phase='arena';});}});continue;}
  if(e.ai?.type==='phantom'){
   updatePhantom(e,g,dt,{damage,say,weapon:()=>save.weapon,impact:spark,
    phaseTwo(){g.shake=30;g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.35));p.invuln=Math.max(p.invuln,2.4);g.storyVision='phantom-phase';dialogue([['Senti','Cái gì? Nó vẫn còn đứng dậy được sao?'],['Phù Hoa','Để ta giúp ngươi. Mạng thứ hai đang sao chép cả ba vũ khí của cậu.'],['Hư Ảnh Fu Hua','Cảm xúc tạo ra sai số. Kỷ luật hoàn hảo không cần một người đứng cạnh.'],['Senti','Vậy ngươi thua chắc rồi. Old Timer, phá từng thế với ta!']],()=>{g.storyVision=null;g.phase='arena';});},
    parry(x){metric('perfect_parry');g.parryFlash={x:p.x,y:p.y-50,life:.5,kind:'rush',target:x};spark(x,e.y-70,'#f1c3ff',28);say('Senti','Quyền của Old Timer không phải thứ ngươi sao chép được!');},
    colorDrain(amount){g.phantomDesaturation=Math.min(1,(g.phantomDesaturation||0)+amount);if(g.phantomDesaturation>=.95)toast('MÀU SẮC VÀ ÂM THANH ĐÃ BỊ TẨY',1.8);},
    restoreColor(amount){g.phantomDesaturation=Math.max(0,(g.phantomDesaturation||0)-amount);g.phantomColorBurst=Math.max(g.phantomColorBurst||0,.22);},
    weaponBreak(weapon,count){metric('phantom_weapon_break');spark(e.x,e.y-82,'#fff1d1',38);pop(e.x,e.y-132,`${weapon==='sword'?'KIẾM':weapon==='spear'?'THƯƠNG':'XÍCH'} GIẢ ĐÃ VỠ · ${count}/3`,'#fff1d1');},
    dualReady(){g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.18));p.invuln=Math.max(p.invuln,1.8);dialogue([['Hư Ảnh Fu Hua','Không thể sao chép biến số thứ hai.'],['Phù Hoa','Vì nó chỉ biết chiến đấu một mình.'],['Senti','Q Dual Combo. Bơm hết màu sắc trở lại cho nó xem!']],()=>{g.phase='arena';});},
    lateDodge(){metric('phantom_delayed_dodge');pop(p.x,p.y-118,'TRÌ HOÃN NỬA PHÁCH · NÉ THÀNH CÔNG','#cffff0');},
    punish(kind){metric('phantom_counter');pop(p.x,p.y-118,kind==='discipline'?'SAI VŨ KHÍ · KỶ LUẬT PHẢN ĐÒN':'SAI KHẮC CHẾ · HƯ ẢNH PHẢN ĐÒN','#ff9db4');}
   });continue;
  }
  if(e.ai?.type==='heimdall'){updateHeimdall(e,g,dt,{damage,say,weapon:()=>save.weapon,impact:spark,summon(kinds){for(const [i,kind] of kinds.entries()){const guard=spawnEnemy(kind,g.arena.x+(i?695:15),`heimdall-guard-${e.ai.phase}-${i}`);guard.bossGuard=true;g.enemies.push(guard);}},phaseTwo(){g.shake=24;g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.45));p.invuln=Math.max(p.invuln,2.2);pop(p.x,p.y-120,'FU HUA · +45% HP','#b8f7e7');spark(e.x,e.y-100,'#f69aa9',40);g.storyVision='heimdall-phase';dialogue([['Senti','Cái gì? Nó còn bật dậy được sao?'],['Phù Hoa','Để ta giúp ngươi! Khiên đã tái tạo, tôi sẽ ngắt chuỗi kiếm.' ],['Senti','Thương phá khiên. Q gọi cô ngắt đòn. Rồi ta chém lõi!']],()=>{g.storyVision=null;g.phase='arena';});},parry(x){metric('perfect_parry');g.parryFlash={x:p.x,y:p.y-50,life:.5,kind:'rush',target:x};spark(x,e.y-70,'#baf6ed',28);say('Senti','Phản được rồi! Lõi hở ra!');}});continue;}
  if(e.ai?.type==='chariot'){updateChariot(e,g,dt,{damage,say,weapon:()=>save.weapon,impact:spark,cue:()=>gameAudio.cue('hos-battle',{voice:true,cooldown:8}),summon(kinds){for(const [i,kind] of kinds.entries()){const guard=spawnEnemy(kind,g.arena.x+[5,650,345][i],`chariot-guard-${e.ai.phase}-${i}`);guard.bossGuard=true;g.enemies.push(guard);}},phaseTwo(){g.shake=22;g.huaJoin=true;g.huaPos=p.x-150;g.huaEntry={from:p.x-210,to:e.x-85,targetX:e.x,life:.84,max:.84,impact:false};g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.32));p.invuln=Math.max(p.invuln,2);pop(p.x,p.y-122,'FU HUA · +32% HP','#b9f7e3');spark(e.x,e.y-100,'#ff8cbe',45);gameAudio.cue('hua-battle',{voice:true,cooldown:0});g.storyVision='chariot-phase';dialogue([['Senti','Cái gì? Nó vẫn còn đứng dậy được sao?'],['Phù Hoa','Để ta giúp ngươi!'],['Phù Hoa','Ba trụ cấp khiên đã dựng lại. Cậu phá chúng; tôi giữ chân đám lính.'],['Senti','Rồi Thương phá giáp, Kiếm phản cú lao mở lõi. Lần này sẽ không để nó viết lại nữa!']],()=>{g.storyVision=null;g.phase='arena';});},parry(x){metric('perfect_parry');g.hp=Math.min(maxHP(),g.hp+Math.round(maxHP()*.045));g.parryFlash={x:p.x,y:p.y-50,life:.5,kind:'rush',target:x};spark(x,e.y-65,'#c4faff',27);say('Senti','Bắt được nhịp rồi! Lõi đang mở!');},huaSave(boss){const from=g.huaPos??p.x-125;g.huaStrike={from,to:boss.x-55,targetX:boss.x,y:boss.y-78,life:.76,max:.76};g.huaPos=from;g.hp=Math.min(maxHP(),g.hp+120);g.shake=12;spark(boss.x,boss.y-70,'#b7fff0',30);pop(p.x,p.y-115,'FU HUA CHẮN ĐÒN','#b7fff0');say('Phù Hoa','Đằng sau!');gameAudio.cue('hua-battle',{voice:true,cooldown:2});}});continue;}
  if(e.ai){updateHusk(e,g,dt,{damage,say,cue:()=>gameAudio.cue('hos-battle',{voice:true,cooldown:18}),summon(kinds,phase){for(const [i,kind] of kinds.entries()){const guard=spawnEnemy(kind,g.arena.x+(i?660:10),`husk-guard-${phase}-${i}`);guard.bossGuard=true;guard.hp=guard.maxHP=Math.round(guard.hp*.9);g.enemies.push(guard);}},rage(){g.huaJoin=false;g.huaEntrance=1.35;g.shake=16;spark(e.x,e.y-80,'#ff9abd',36);g.speechQueue=[];g.speechTime=0;say('Senti','Cái gì? Nó vẫn còn đứng dậy được sao?');g.speechTime=1.35;},huaAssist(boss){const target=g.enemies.filter(n=>n.hp>0&&n!==boss).sort((u,v)=>Math.abs(u.x-boss.x)-Math.abs(v.x-boss.x))[0]||boss;const from=g.huaPos??p.x-100;g.huaStrike={from,to:target.x-54,targetX:target.x,y:target.y-70,life:.76,max:.76};spark(target.x,target.y-70,'#a8f4e7',23);hitEnemy(target,target.ai?150:340,'assist');say('Phù Hoa','Tôi mở đường. Bây giờ!');gameAudio.cue('hua-battle',{voice:true,cooldown:8});},parry(kind){metric('perfect_parry');g.parryFlash={x:p.x,y:p.y-50,life:.5,kind,target:e.x};g.shake=11;spark(p.x,p.y-50,'#e3ffeb',32);spark(e.x,e.y-65,'#fff1ad',24);gameAudio.cue('impact');}});continue;}
  if(e.stun>0){e.stun-=dt;continue;}if(e.hurt>0&&!['boss','elite','mini'].includes(e.kind))continue;
  if(e.charge>0){e.charge-=dt;e.x+=e.face*410*dt;if(Math.abs(p.x-e.x)<e.reach&&p.y>430&&!e.chargeHit){e.chargeHit=true;if(g.parry>0){e.stun=2.2;e.charge=0;g.empowered=true;g.parry=0;metric('perfect_parry');spark(e.x,e.y-65,'#fff1ad',24);say('Senti','Ha! Lộ sơ hở rồi!');}else damage(e.damage,e.x);}if(g.arena)e.x=clamp(e.x,g.arena.x-130,g.arena.x+780);continue;}
  if(e.telegraph>0){e.telegraph-=dt;if(e.telegraph<=0){e.attackTimer=.24;const special=e.kind==='boss';if(e.move==='charge'){e.charge=.7;e.chargeHit=false;}else if(e.move==='arrow'){g.projectiles.push({x:e.x,y:e.kind==='flyer'?e.y+56:e.y-62,vx:e.face*400,life:3,damage:e.damage});}else if(Math.abs(p.x-e.x)<e.reach+18&&(special?p.y>chapter.physics.groundY-60:p.y>chapter.physics.groundY-100)){if(g.parry>0){e.stun=1.5;g.empowered=true;g.parry=0;metric('perfect_parry');spark(e.x,e.y-60,'#fff1ad',20);}else damage(e.damage,e.x);}e.cooldown=e.kind==='boss'?.95:1.6;}continue;}
  e.attackTimer=Math.max(0,e.attackTimer-dt);
  const distance=Math.abs(p.x-e.x);if(distance>(e.kind==='enemy'?280:e.reach*.78)&&e.attackTimer<=0){const nx=e.x+e.face*e.speed*dt;if(!g.world.gaps.some(h=>nx>h.x-260&&nx<h.x+h.w+260)&&!g.world.platforms.some(b=>!b.destroyed&&b.y+b.h>=480&&nx+e.w/2>b.x&&nx-e.w/2<b.x+b.w))e.x=nx;}
  if(distance<(['enemy','flyer'].includes(e.kind)?540:e.reach+12)&&e.cooldown<=0&&e.attackTimer<=0){e.move=['enemy','flyer'].includes(e.kind)?'arrow':['elite','machine'].includes(e.kind)||(e.kind==='boss'&&((e.moves||0)%2===1))?'charge':'slam';e.moves=(e.moves||0)+1;e.telegraph=['enemy','flyer'].includes(e.kind)?.9:e.kind==='boss'?(e.move==='charge'?1:1.2):['elite','machine'].includes(e.kind)?1:.65;}
  if(g.arena)e.x=clamp(e.x,g.arena.x-135,g.arena.x+790);
 }
 g.enemies=g.enemies.filter(e=>e.hp>0||e.dead>0);
 if(g.phase==='arena'&&!g.enemies.length){g.arenaDoneWait+=dt;if(g.arenaDoneWait>.8){if(g.wave<g.arena.waves.length)spawnWave();else if(g.arena.loop&&!g.nodes[0].destroyed){g.loopCount++;g.rescueState='failed';if(g.mode==='story')gameAudio.cue('hua-battle',{voice:true,cooldown:20});g.wave=0;dialogue([['Senti','Xong rồi! Old Timer, đưa tay cho ta—'],['Phù Hoa','...Còn một đợt nữa.'],['Senti','Không. Ta vừa hạ hết chúng rồi mà.'],['Senti','Bàn tay lại xuyên qua... Cô ấy bị kéo trở lại đúng chỗ cũ.'],['Senti','Mỗi lần đèn chớp, mọi thứ bắt đầu lại. Phải phá thứ đang giữ cô ấy ở đây!']],()=>{g.phase='arena';spawnWave();});}else clearArena()}}
}
function tick(dt){
 if(!g||screen!=='play')return;if(!['paused','finished','upgrade'].includes(g.phase)){g.presentationTime+=dt;g.dialogueClock+=dt;if(g.phase==='dialogue'){g.dialogueReveal=Math.min(g.dialogueFullText.length,(g.dialogueReveal||0)+dt*42);$('#dialogue-text').textContent=g.dialogueFullText.slice(0,Math.floor(g.dialogueReveal));}}if(['paused','finished','dialogue','upgrade'].includes(g.phase))return;
 if(g.phase==='celebrate'){g.yattaTime-=dt;if(g.yattaTime<=0){const done=g.yattaDone;g.yattaDone=null;done?.();}return;}
 if(g.phase==='courtyard'){g.time+=dt;g.elapsed+=dt;updateCourtyard(g.courtyard,save,dt,{keys,pressed},courtyardAPI());g.toastTime-=dt;if(g.toastTime<=0)$('#toast').classList.remove('show');pressed.clear();return;}
 if(g.phase==='memory-trial'){g.time+=dt;g.elapsed+=dt;updateMemoryTrial(g.memoryTrial,dt,{keys,pressed},{finish:finishMemoryTrial,tone});pressed.clear();return;}
 g.time+=dt;g.elapsed+=dt;g.phantomColorBurst=Math.max(0,(g.phantomColorBurst||0)-dt*.38);if(stats(save).sets.marco_polo>=3&&g.combo>25&&(g.marcoHealCD||0)<=0){g.marcoHealCD=5;g.hp=Math.min(maxHP(),g.hp+200);}for(const k of ['dash','dashCD','dodgeCombo','marcoHitCD','marcoHealCD','weaponSkillCD'])g[k]=Math.max(0,(g[k]||0)-dt);const p=g.p;g.parry=Math.max(0,g.parry-dt);g.parryCD=Math.max(0,g.parryCD-dt);g.speechTime=Math.max(0,g.speechTime-dt);g.sceneTimer=Math.max(0,g.sceneTimer-dt);
 g.toastTime-=dt;if(g.toastTime<=0)$('#toast').classList.remove('show');
 g.particles.forEach(a=>{a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=a.text?0:360*dt;a.life-=dt});g.particles=g.particles.filter(a=>a.life>0);
 g.shake=Math.max(0,g.shake-dt*25);g.assistCD=Math.max(0,g.assistCD-dt);g.assistTime=Math.max(0,g.assistTime-dt);if(g.parryFlash)g.parryFlash.life-=dt;
 if(g.huaStrike?.life>0){g.huaStrike.life=Math.max(0,g.huaStrike.life-dt);if(g.huaStrike.life===0)g.huaPos=g.huaStrike.to;}
 if(g.huaEntry?.life>0){g.huaEntry.life=Math.max(0,g.huaEntry.life-dt);if(!g.huaEntry.impact&&g.huaEntry.life<g.huaEntry.max*.23){g.huaEntry.impact=true;spark(g.huaEntry.targetX,p.y-70,'#a8f4e7',28);}if(g.huaEntry.life===0)g.huaPos=g.huaEntry.to;}
 if(g.huaJoin&&g.arena?.m===2000&&!g.huaEntry?.life&&!g.huaStrike?.life){g.huaPos??=p.x-100;g.huaPos+=clamp(p.x-100-g.huaPos,-340*dt,340*dt);}
 if([2,3,4,5].includes(g.chapter)&&!g.huaStrike?.life){g.huaPos??=p.x-120;g.huaPos+=clamp(p.x-120-g.huaPos,-340*dt,340*dt);}
 if(g.huaEntrance>0){g.huaEntrance-=dt;if(g.huaEntrance<=0){const boss=g.enemies.find(e=>e.ai&&e.hp>0),from=p.x-160,to=(boss?.x||p.x+170)-60;g.huaJoin=true;g.huaPos=from;g.huaEntry={from,to,targetX:boss?.x||to+60,life:.84,max:.84,impact:false};say('Phù Hoa','Để ta giúp ngươi!');gameAudio.cue('hua-battle',{voice:true,cooldown:0});}}
 if(g.phase==='dying'){g.deathTime-=dt;p.stateTime+=dt;if(p.y>chapter.physics.groundY||p.vy>0){p.vy+=700*dt;p.y+=p.vy*dt;}if(g.deathTime<=0)respawn();pressed.clear();return;}
 if(g.hitstop>0){g.hitstop-=dt;return;}
 p.stateTime+=dt;p.invuln=Math.max(0,p.invuln-dt);p.hurtTime=Math.max(0,p.hurtTime-dt);p.comboTime=Math.max(0,p.comboTime-dt);p.landTime=Math.max(0,p.landTime-dt);g.comboTimer-=dt;if(g.comboTimer<=0)g.combo=0;
 updateInput(dt);const oldX=p.x,wasGrounded=p.grounded;const solids=solidPlatforms(g.world,g.time);movePlayer(p,dt,g.world,chapter.physics,solids);
 p.x=Math.max(g.mode==='story'?save.checkpoint.m*64-20:0,p.x);
 if(g.arena)p.x=clamp(p.x,g.arena.x-140,g.arena.x+790);
 if(p.grounded&&!wasGrounded){p.landTime=.13;metrics.landings++;spark(p.x,p.y,'#c5b6c0',5)}
 if(p.y>chapter.physics.groundY+64){die(true);pressed.clear();return;}
 updateEnvironment(g,dt,{notify:()=>{},damage(amount,x,kind){const before=g.hp;damage(amount,x);if(g.hp<before){metrics.environmentHits=(metrics.environmentHits||0)+1;metric('hazard:'+kind);}},evade(kind,x){metric('perfect_dodge');if(kind==='lightning'){pop(x,400,'NÉ SÉT','#dffaff');spark(x,480,'#9fe9ff',14);}},impact:spark,needsHeal:()=>g.hp<maxHP()-1,heal(amount,x,y){const gain=Math.min(maxHP()-g.hp,Math.round(maxHP()*amount));g.hp+=gain;metrics.heals=(metrics.heals||0)+1;pop(x,y-30,'+'+gain+' HP','#aaf3d1');spark(x,y,'#9af2d4',20);tone(740,.2,'sine');}});
 if(g.phase==='dying'){pressed.clear();return;}updateCombat(dt);for(const bolt of g.projectiles){bolt.x+=bolt.vx*dt;bolt.life-=dt;if(Math.abs(bolt.x-p.x)<24&&Math.abs(bolt.y-(p.y-p.h/2))<p.h/2){if(g.parry>0){bolt.life=0;g.empowered=true;metric('perfect_parry');}else {damage(bolt.damage,bolt.x);bolt.life=0;}}}g.projectiles=g.projectiles.filter(b=>b.life>0);if(g.mode==='story')updateStory(dt);else if(g.phase==='explore'&&g.time>=g.nextUpgrade){showUpgrade();pressed.clear();return;}
 if(['dying','dialogue'].includes(g.phase)){pressed.clear();return;}
 if(p.hurtTime>0)setAnim('hurt');else if(p.attack)setAnim(`${p.attack.weapon}_attack_${Math.min(3,p.attack.step)}`);else if(p.slide)setAnim(p.slideTime<.12?'slide_start':'slide_loop');else if(!p.grounded)setAnim(p.vy< -440?'jump_start':'jump_air');else if(p.landTime>0)setAnim('land');else if(p.state==='slide_end'&&p.stateTime<.12){}else setAnim(Math.abs(p.vx)>5?'run':'idle');
 for(const c of g.world.coins){if(c.support){const b=g.world.platforms.find(b=>b.id===c.support);if(b){c.x=b.x+c.dx;c.y=b.y+c.dy;}}}for(const c of g.world.coins)if(!g.collected.has(c.id)&&(g.mode==='story'?canCollect(c,p):Math.abs(c.x-p.x)<32&&c.y>p.y-p.h-12&&c.y<p.y+12)){g.collected.add(c.id);reward(c.value,c.x,c.y-15);spark(c.x,c.y,'#ffe8ad',5)}
 if(g.mode==='endless')for(const drop of g.endlessDrops)if(!drop.collected&&Math.abs(drop.x-p.x)<72&&Math.abs(drop.y-(p.y-38))<95){drop.collected=true;g.endlessLoot[drop.id]=(g.endlessLoot[drop.id]||0)+drop.count;pop(drop.x,drop.y-34,`+${drop.count} ${drop.name}`,'#ffe6a8');spark(drop.x,drop.y,'#ffe3a1',24);toast(`ĐÃ NHẶT · ${drop.count} ${drop.name.toUpperCase()}`,2.8);}
 if(g.mode==='endless')g.endlessDrops=g.endlessDrops.filter(drop=>!drop.collected&&drop.x>p.x-900);
 for(const gate of g.world.platforms)if(gate.kind==='gate'&&oldX<gate.x+gate.w&&p.x>=gate.x+gate.w&&!g.passedGates.has(gate.id)){g.passedGates.add(gate.id);metrics.gatePasses++;toast('TRƯỢT THÀNH CÔNG',1.3)}
 for(const gap of g.world.gaps)if(oldX<gap.x+gap.w&&p.x>=gap.x+gap.w&&p.y<=chapter.physics.groundY+8&&!g.passedGaps.has(gap.id)){g.passedGaps.add(gap.id);metrics.gapsCleared++;}
 if(g.phase==='explore'){
  for(const e of g.world.enemies)if(Math.abs(e.x-p.x)<850&&!g.fieldSpawned.has(e.id)){g.fieldSpawned.add(e.id);g.enemies.push(spawnEnemy(e.kind,e.x,e.id))}
  if(g.mode==='story'){
    for(const a of chapter.arenas)if(!g.clear.has(a.m)&&p.x>=a.m*64&&(a.m!==2000||g.nodes.every(n=>n.destroyed))){
     const missing=a.requiresEvents?.filter(id=>!g.storyEvents.has(id))||[];
     if(missing.length){p.x=a.m*64-28;p.vx=0;if((g.branchGateHint||0)<g.time){g.branchGateHint=g.time+3;toast(a.lockHint||'HOÀN THÀNH NHÁNH KÝ ỨC TRƯỚC',2.6);}break;}
     enterArena(a);break;
    }
   if(g.phase==='explore')for(const cp of chapter.checkpoints)if(p.x>=cp*64&&p.x<cp*64+180)checkpoint(cp);
  }else{
   extendEndless();const distance=p.x/64;
    while(distance>=g.nextLootMeter){const meter=g.nextLootMeter,drop=endlessMaterial(meter);g.endlessDrops.push({...drop,meter,x:p.x+135,y:chapter.physics.groundY-45,collected:false});toast(`ENDLESS ${meter} M · NGUYÊN LIỆU ĐÃ XUẤT HIỆN`,2.6);g.nextLootMeter+=500;}
   if(distance>=g.endlessBoss){const m=g.endlessBoss;g.endlessBoss+=1000;g.endlessElite=Math.max(g.endlessElite,m+250);enterArena({m,name:'Endless · Người gác ký ức',waves:[['mini']],before:[['Phù Hoa','Người gác ký ức. Hạ nó để tiếp tục.']]});}
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
 if(g.chapter===2&&g.mode==='story'){drawArcTerrain(x,y,w,h,kind);return;}
 if(g.chapter===3&&g.mode==='story'){drawLabTerrain(x,y,w,h,kind);return;}
 if(g.chapter>=4&&g.mode==='story'){drawLateTerrain(x,y,w,h,kind);return;}
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
 if(terrainAtlas&&biome()<2&&g.chapter===1)for(const gap of g.world.gaps){
  const x=gap.x-g.camera;if(x+gap.w<0||x>W)continue;
  ctx.save();ctx.beginPath();ctx.rect(x,floor,gap.w,H-floor);ctx.clip();
  ctx.fillStyle='#070b1c';ctx.fillRect(x,floor,gap.w,H-floor);
  terrainSprite('pitInterior',x,floor,gap.w,Math.max(150,H-floor));ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x-100,floor,100,H-floor);ctx.clip();terrainSprite('pitLeft',x-100,floor,100,120);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x+gap.w,floor,100,H-floor);ctx.clip();terrainSprite('pitRight',x+gap.w,floor,100,120);ctx.restore();
  ctx.fillStyle='#f6d599';ctx.fillRect(x-19,floor,19,3);ctx.fillRect(x+gap.w,floor,19,3);
 }
 if(g.chapter>=2)for(const gap of g.world.gaps){const x=gap.x-g.camera;if(x+gap.w<0||x>W)continue;ctx.fillStyle=g.chapter===3?'#071b27':'#050b1b';ctx.fillRect(x,floor,gap.w,H-floor);ctx.fillStyle=g.chapter===3?'#83f3dd':'#8fafff';ctx.fillRect(x-6,floor-4,7,5);ctx.fillRect(x+gap.w,floor-4,7,5);for(let i=0;i<5;i++){ctx.fillStyle='#425f9a66';ctx.fillRect(x+i*gap.w/5,floor+24+i%2*15,2,90);}}
}
function drawGate(cp){const x=cp*64-g.camera;if(x< -130||x>W+130)return;const y=chapter.physics.groundY,done=g.visited.has(cp);ctx.save();ctx.shadowBlur=18;ctx.shadowColor=done?'#7dedd1':'#7bd5fc';const pulse=.6+Math.sin(g.time*3)*.2;ctx.strokeStyle=`rgba(143,226,242,${pulse})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-68,42,78,0,Math.PI,Math.PI*2);ctx.moveTo(x-42,y-68);ctx.lineTo(x-42,y);ctx.moveTo(x+42,y-68);ctx.lineTo(x+42,y);ctx.stroke();ctx.shadowBlur=0;terrainPiece(x-49,y-71,12,71,1);terrainPiece(x+37,y-71,12,71,1);ctx.fillStyle='#a3eae5';ctx.fillRect(x-44,y-2,88,3);for(let i=0;i<6;i++){ctx.globalAlpha=(i+1)/8;ctx.fillRect(x-30+i*12,y-((g.time*40+i*23)%130),2,6)}ctx.globalAlpha=1;label(done?'MEMORY SAVED':`CHECKPOINT · ${cp} M`,x,y-166,'#b2ebef',9);ctx.restore()}
function render(){
 canvas.style.filter=g?.phantomDesaturation>0?`grayscale(${Math.round(clamp(g.phantomDesaturation,0,1)*100)}%) saturate(${Math.round(100+Math.max(0,(g.phantomColorBurst||0))*100)}%)`:g?.phantomColorBurst>0?`saturate(${Math.round(100+g.phantomColorBurst*100)}%)`:'none';
 if(!g||screen!=='play'||!atlas)return;ctx.imageSmoothingEnabled=false;ctx.fillStyle='#080e21';ctx.fillRect(0,0,W,H);const bi=biome(),im=backgrounds[bi],offset=(g.camera*.18)%W;
 if(g.phase==='courtyard'){drawCourtyard(ctx,g.courtyard,save,{background:courtyardArt,props:courtyardProps,board:courtyardBoard,post:courtyardPost,firewood:courtyardFirewood,blanket:courtyardBlanket,garden:courtyardGarden,cat:courtyardCat,roof:courtyardRoof,waterYoke:courtyardWaterYoke,leaves:courtyardLeaves,bell:courtyardBell,teaSet:courtyardTeaSet},drawSprite,label,W,H);updateHUD();return;}
 if(g.phase==='memory-trial'){drawMemoryTrial(ctx,g.memoryTrial,{background:g.chapter===7?sceneSources[9]:g.chapter===6?sceneSources[7]:courtyardArt,evidence:taixuanEvidenceArt,quanta:quantaProps,keepsakes:ch6Keepsakes,imaginary:ch7Artifacts},W,H);updateHUD();return;}
 ctx.save();if(g.shake>0&&!matchMedia('(prefers-reduced-motion: reduce)').matches)ctx.translate(Math.sin(g.time*91)*g.shake,Math.cos(g.time*107)*g.shake*.5);
 if(g.mode==='story')drawScene();else for(let x=-offset;x<W;x+=W)ctx.drawImage(im,0,0,im.width,Math.floor(im.height*.73),x,0,W,490);
 const shade=ctx.createLinearGradient(0,0,0,490);shade.addColorStop(0,'#0711265a');shade.addColorStop(.6,'#050b1510');shade.addColorStop(1,'#050b1540');ctx.fillStyle=shade;ctx.fillRect(0,0,W,490);
 for(let i=0;i<20;i++){const x=(i*123.5-g.camera*.3+W*100)%W,y=(i*83+g.time*(6+i%4))%490;ctx.fillStyle=i%3?'#b7a8e340':'#e8cdb866';ctx.fillRect(x,y,2,2)}
 drawGround();drawStoryObjects();drawEnvironment(ctx,g,{label,width:W,floor:chapter.physics.groundY,materialArt:forgeMaterialArt,storyCollectibleArt,ch7Artifacts,quantaProps});
 for(const b of g.world.platforms){const x=b.x-g.camera;if(b.destroyed||x>W+100||x+b.w<-100)continue;ctx.save();if(b.kind==='pulse'){const active=Math.sin(g.time*1.5+(b.phase||0))>-.4;ctx.globalAlpha=active?.9:.18;}terrainPiece(x,b.y,b.w,b.h,bi,b.kind);
  if(b.kind==='gate'){for(let i=12;i<b.w-10;i+=22){ctx.fillStyle=i%44===12?'#f1c77b':'#c67986';ctx.fillRect(x+i,b.y+b.h-6,10,4)}label('S / ↓  TRƯỢT',x+b.w/2,b.y-14,'#f6d49c',11);}
  if(b.kind==='breakable'){label('J · PHÁ',x+b.w/2,b.y-12,'#ffd79d',10)}
  if(b.kind==='moving')label('↔',x+b.w/2,b.y-8,'#9ae3ff',18);ctx.restore();
 }
 for(const c of g.world.coins)if(!g.collected.has(c.id)){const x=c.x-g.camera;if(x< -40||x>W+40)continue;const bob=Math.sin(g.time*4+c.x)*3,spin=.35+Math.abs(Math.cos(g.time*4+c.x))*.65;ctx.save();ctx.translate(x,c.y+bob+12);ctx.scale(spin,1);drawSprite(c.rare?'loot.4':'loot.0',0,0,c.rare?.7:.6);ctx.restore();if(c.rare){ctx.strokeStyle='#f4d19a77';ctx.strokeRect(x-16,c.y-16,32,32)}}
 if(g.mode==='endless')for(const drop of g.endlessDrops)if(!drop.collected){const x=drop.x-g.camera;if(x< -80||x>W+80)continue;const bob=Math.sin(g.time*5+drop.meter)*5,sw=forgeMaterialArt.width/5,sh=forgeMaterialArt.height/3,cell=Math.max(0,Math.min(12,drop.art));ctx.save();ctx.imageSmoothingEnabled=true;ctx.shadowBlur=drop.rare?22:13;ctx.shadowColor=drop.rare?'#ffe0a0':'#cfc5ff';ctx.drawImage(forgeMaterialArt,(cell%5)*sw,Math.floor(cell/5)*sh,sw,sh,x-34,drop.y-34+bob,68,68);ctx.restore();label(drop.name,x,drop.y-44+bob,drop.rare?'#ffe7ac':'#e6ddff',10);}
 if(g.mode==='story')for(const cp of chapter.checkpoints)drawGate(cp);
 if(g.arena){const l=g.arena.x-155-g.camera,r=g.arena.x+815-g.camera;for(const x of [l,r]){const grad=ctx.createLinearGradient(x-10,0,x+10,0);grad.addColorStop(0,'#ed83c100');grad.addColorStop(.5,'#ed83c1bb');grad.addColorStop(1,'#ed83c100');ctx.fillStyle=grad;ctx.fillRect(x-10,280,20,210);for(let i=0;i<6;i++){ctx.fillStyle='#ffb2d5';ctx.fillRect(x-2,300+(g.time*50+i*37)%185,4,14)}}if(!g.enemies.some(e=>e.ai))label(g.arena.name,W/2,48,'#f5dbaa',16);}
 for(const e of g.enemies){const x=e.x-g.camera;if(x<-180||x>W+180)continue;let f=e.hp<=0?5:e.hurt>0?4:e.telegraph>0?2:e.attackTimer>0?3:Math.floor(e.age*5)%2;
  if(['chariot','heimdall','parvati','phantom','seven-swords','jizo','mnemosyne'].includes(e.kind))continue;
  if(e.telegraph>0){ctx.fillStyle='#ee6c8740';ctx.fillRect(x-e.reach,482,e.reach*2,8);label('!',x,e.y-e.h-32,'#ffaaa4',22)}
  if(['flyer','machine'].includes(e.kind)&&g.mode==='story')drawArcEnemy(e,x,f);else if(['enemy','knight','boss'].includes(e.kind)&&g.mode==='story')drawStoryEnemy(e,x);else drawSprite(`${e.art}.${f}`,x,e.y,e.scale||1,e.face===1?-1:1,e.hp<=0?Math.max(0,e.dead/.65):e.hitTime>0?.55:1);
  if(e.hp>0&&!e.ai){const width=e.kind==='boss'?125:70;ctx.fillStyle='#141727';ctx.fillRect(x-width/2,e.y-e.h-15,width,5);ctx.fillStyle=e.kind==='boss'?'#e588b2':'#ddae85';ctx.fillRect(x-width/2,e.y-e.h-15,width*e.hp/e.maxHP,5);if(e.kind==='boss'||e.kind==='mini')label(e.kind==='boss'?'NAGAZORA HUSK':'NGƯỜI GÁC CẦU',x,e.y-e.h-23,'#e8cccb',9)}
 }
 const p=g.p,x=p.x-g.camera;if(p.grounded){ctx.fillStyle='#02040b60';ctx.beginPath();ctx.ellipse(x,p.y-1,p.slide?37:24,5,0,0,Math.PI*2);ctx.fill()}
 let a=p.invuln>0&&Math.floor(g.time*14)%2?.5:1;
 if(g.phase==='celebrate')drawYatta(x,p.y,2.35-g.yattaTime);else if(g.protagonist==='hua'){const frame=p.attack?(p.attack.t/p.attack.total<.32?'hua.1':p.attack.t/p.attack.total<.68?'hua.4':'hua.3'):Math.abs(p.vx)>45?(Math.floor(g.time*9)%2?'hua.8':'hua.1'):p.state==='jump_air'?'hua.2':'hua.0';drawSprite(frame,x,p.y,1.06,p.face,a);if(p.attack&&p.attack.t/p.attack.total>.26&&p.attack.t/p.attack.total<.7){ctx.strokeStyle='#b9fff0';ctx.lineWidth=5;ctx.beginPath();ctx.arc(x+p.face*18,p.y-56,46,-1.4,1.4);ctx.stroke();}}else if(p.attack){const anim=animations.states[`${p.attack.baseWeapon||p.attack.weapon}_attack_${Math.min(3,p.attack.step)}`];const f=Math.min(anim.frames.length-1,Math.floor(p.attack.t/p.attack.total*anim.frames.length));drawSprite(anim.frames[f],x,p.y,1,p.face,a)}else drawState(p.state,x,p.y,p.stateTime,p.face,a);
 if(g.assistTime>0&&g.protagonist!=='hua')drawState('fu_hua_assist',x-p.face*80,p.y,.75-g.assistTime,p.face,.9);
 if([2,3,4,5,7].includes(g.chapter)&&g.protagonist==='senti'&&g.phase!=='finished'||g.chapter===6&&g.protagonist==='senti'&&['reunion','jizo'].includes(currentScene().id)&&g.phase!=='finished')drawArcFuHua(p);else if(g.huaJoin&&g.arena?.m===2000&&g.phase==='arena')drawBossFuHua(p);
 for(const a of g.particles){ctx.globalAlpha=clamp(a.life/a.max,0,1);if(a.text)label(a.text,a.x-g.camera,a.y,a.color,17);else{ctx.fillStyle=a.color;ctx.fillRect(a.x-g.camera,a.y,3,3)}}ctx.globalAlpha=1;
 const gap=g.world.gaps.find(h=>h.x>p.x&&h.x-p.x<Math.max(speed()*1.8,560));
 if(gap&&!g.arena){const seconds=(gap.x-p.x)/Math.max(1,speed());label(`⚠ VỰC PHÍA TRƯỚC · SPACE · ${Math.max(1,Math.ceil((gap.x-p.x)/64))} M`,W/2,147,'#ffe1a6',14);if(seconds<.55)label('NHẢY!',x+65,p.y-125,'#ffdf91',17)}
 for(const boss of g.enemies)if(boss.ai&&g.phase==='arena'&&(boss.hp>0||['chariot','heimdall','parvati','phantom','seven-swords','jizo','mnemosyne'].includes(boss.ai.type)&&boss.dead>0)){ctx.save();if(boss.hp<=0)ctx.globalAlpha=Math.max(0,boss.dead/.65);if(boss.ai.type==='chariot')drawChariot(ctx,boss,g,label,chariotArt,{sword:chariotPylonSword,dash:chariotPylonDash,spear:chariotPylonSpear});else if(boss.ai.type==='heimdall')drawHeimdall(ctx,boss,g,label,heimdallArt);else if(boss.ai.type==='parvati')drawParvati(ctx,boss,g,label,parvatiArt);else if(boss.ai.type==='phantom')drawPhantom(ctx,boss,g,label,phantomCombatArt);else if(boss.ai.type==='seven-swords')drawSevenSwords(ctx,boss,g,label,sevenSwordsArt,sevenSwordsCombatArt);else if(boss.ai.type==='jizo')drawJizo(ctx,boss,g,label,jizoCombatArt,quantaProps);else if(boss.ai.type==='mnemosyne')drawMnemosyne(ctx,boss,g,label,mnemosyneArt);else drawHusk(ctx,boss,g,label,huskArt);ctx.restore();}drawStoryOverlay();drawNarrative();ctx.restore();updateHUD();
}
function updateHUD(){if(!g)return;$('#play').classList.toggle('cinematic',g.phase==='dialogue');$('#play').classList.toggle('memory-bowls',g.phase==='memory-trial'&&g.memoryTrial?.type==='bowls');$('#sector-title').textContent=g.phase!=='memory-trial'&&g.mode==='story'&&g.sceneTimer>0?currentScene().name:'';const alive=g.enemies.filter(e=>e.hp>0).length;$('#encounter-meter').textContent=alive?`${alive} QUÁI ĐANG GIAO CHIẾN`:'';$('#health-fill').style.width=clamp(g.hp/maxHP()*100,0,100)+'%';$('#health-text').textContent=`${Math.max(0,Math.ceil(g.hp))} / ${maxHP()}`;$('#level').textContent=`LV. ${save.level}`;$('#gold').textContent=`◈ ${g.mode==='story'?save.gold:g.runGold}`;const memoryTarget=({1:3,2:5,3:8,4:11,5:14,6:17,7:21})[g.chapter]||21;$('#distance').innerHTML=g.mode==='story'?`<small>${g.memories.size} / ${memoryTarget} KÝ ỨC</small>`:`${String(Math.floor(g.p.x/64)).padStart(4,'0')} <small>M</small>`;
 const next=chapter.checkpoints.find(x=>x*64>g.p.x);$('#checkpoint-distance').textContent=g.mode==='story'?(next!==undefined?`CHECKPOINT CÒN ${Math.ceil(next-g.p.x/64)} M`:'CHECKPOINT CUỐI'): `${Math.round(speed())} PX/S · ĐIỂM ${Math.floor(g.score)}`;
 $('#location').textContent=g.phase==='courtyard'?'CHƯƠNG 05 / SÂN SAU THÁI HƯ':g.mode==='story'?(g.chapter===7?'CHƯƠNG 07 / IMAGINARY TREE':g.chapter===6?`CHƯƠNG 06 / ${['kolosten-storm','kolosten-choice'].includes(currentScene().id)?'KOLOSTEN · PHÙ HOA':'SEA OF QUANTA · SENTI'}`:g.chapter===5?'CHƯƠNG 05 / THÁI HƯ SƠN':g.chapter===4?'CHƯƠNG 04 / BABYLON':g.chapter===3?`CHƯƠNG 03 / ${['schicksal-airfield','heimdall'].includes(currentScene().id)?'SÂN BAY SCHICKSAL':'HELHEIM LABS'}`:g.chapter===2?`CHƯƠNG 02 / ${['heliopolis','schicksal-train','chariot'].includes(currentScene().id)?'HELIOPOLIS · SCHICKSAL':'ARC CITY'}`:'CHƯƠNG 01 / NAGAZORA'):`ENDLESS / ${['NAGAZORA','ARC CITY','BABYLON','THÁI HƯ','LƯỢNG TỬ CHI HẢI'][biome()]}`;
 $('#combo').innerHTML=g.combo>1?`${g.combo}<small> COMBO</small>`:'';
 $('#objective').textContent=narrativeObjective();const guide=combatGuide();$('#combat-guide').hidden=!guide;$('#combat-guide').textContent=guide;
 $$('[data-weapon]').forEach(b=>{const id=b.dataset.weapon,own=save.weapons.includes(id),hua=g.protagonist==='hua';b.disabled=!own||hua;b.classList.toggle('active',!hua&&save.weapon===id);b.classList.toggle('queued',g.pendingWeapon===id);b.querySelector('small').textContent=hua?'QUYỀN PHÁP':!own?'KHÓA':g.pendingWeapon===id?'CHỜ ĐỔI':g.inputLock==='weapon'?'TẠM KHÓA':'LV. '+save.weaponLevels[id]});const separated=g.chapter===6&&(g.protagonist==='hua'||!['reunion','jizo'].includes(currentScene().id));$('#assist').disabled=!save.assistUnlocked||g.assistCD>0||separated;$('#assist small').textContent=separated?'MẤT KẾT NỐI':!save.assistUnlocked?'KHÓA':g.assistCD>0?`${Math.ceil(g.assistCD)} GIÂY`:save.dualUnlocked?'DUAL':'SẴN SÀNG';}
function pause(){if(g&&!$('#journal-panel').hidden){journal();return;}if(!g||['dialogue','dying','finished','upgrade'].includes(g.phase))return;if(g.phase==='paused'){g.phase=g.resumePhase;$('#pause-panel').hidden=true}else{g.resumePhase=g.phase;g.phase='paused';$('#pause-panel').hidden=false;keys.clear()}pressed.clear()}
function keyDown(code){if(!keys.has(code))pressed.add(code);keys.add(code)}
const GAMEPLAY_KEYS=new Set(['KeyA','KeyD','KeyS','KeyW','ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space','KeyJ','KeyK','KeyL','KeyE','KeyQ','KeyR','Digit1','Digit2','Digit3']);
const SCROLL_KEYS=new Set(['Space','ArrowLeft','ArrowRight','ArrowDown','ArrowUp']);
window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;const code=e.code||e.key;if(screen==='play'&&(SCROLL_KEYS.has(code)||GAMEPLAY_KEYS.has(code)||code==='Tab'))e.preventDefault();if(GAMEPLAY_KEYS.has(code)){keyDown(code);return;}if(e.repeat)return;if(code==='Tab'&&screen==='play'){journal();return;}if(code==='Enter'&&g?.phase==='dialogue'){enableAudio();nextDialogue();return;}if((code==='Escape'||code==='KeyP')&&screen==='play'&&g?.phase!=='courtyard'){pause();return;}keyDown(code)});
// One-frame actions must survive a quick key press and release between animation frames.
window.addEventListener('keyup',e=>{const code=e.code||e.key;keys.delete(code)});
window.addEventListener('blur',()=>{keys.clear();pressed.clear()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&g&&['explore','arena'].includes(g.phase))pause()});
const gameCanvas=$('#game');gameCanvas.addEventListener('pointerdown',()=>gameCanvas.focus({preventScroll:true}));window.addEventListener('focus',()=>{if(screen==='play')gameCanvas.focus({preventScroll:true})});
$$('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keyDown(b.dataset.key)};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key)});
$('#story').onclick=()=>start('story');$('#endless').onclick=()=>start('endless');$('#gear').onclick=gear;$('#album').onclick=openAlbum;$('#gear-back').onclick=()=>{switchScreen('home');syncHome()};$('#next-dialogue').onclick=()=>{enableAudio();nextDialogue()};$('#pause-button').onclick=pause;$('#resume').onclick=pause;$('#assist').onclick=assist;
$$('[data-weapon]').forEach(b=>b.onclick=()=>selectWeapon(b.dataset.weapon));$('#return-home').onclick=()=>{switchScreen('home');save=structuredClone(committed);g=null;syncHome()};$('#complete-home').onclick=()=>{const demo=g?.demo;save=structuredClone(committed);g=null;if(demo){switchScreen('home');syncHome();}else gear()};
$('#sound').onclick=()=>{enableAudio();muted=!muted;$('#sound').textContent='ÂM THANH · '+(muted?'TẮT':'BẬT')};
function loop(now){updateAmbience();const delta=Math.min(.1,(now-last)/1000||0);last=now;if(!manual){acc+=delta;while(acc>=DT){tick(DT);acc-=DT;}render()}requestAnimationFrame(loop)}
async function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Không tải được '+src));i.src=src})}
async function init(){try{
 [manifest,animations,chapterOne,chapterTwo,chapterThree,chapterFour,chapterFive,chapterSix,chapterSeven,patterns]=await Promise.all(['assets-manifest.json','animation-manifest.json','level-chapter-1.json','level-chapter-2.json','level-chapter-3.json','level-chapter-4.json','level-chapter-5.json','level-chapter-6.json','level-chapter-7.json','endless-patterns.json'].map(async file=>{const r=await fetch(file);if(!r.ok)throw Error(`Không tải được ${file}`);return r.json()}));chapter=chapterOne;
 const imgs=await Promise.all([loadImage(manifest.atlas),...Array.from({length:5},(_,i)=>loadImage(`assets/biome-${i}.jpg`)),...Array.from({length:5},(_,i)=>loadImage(`assets/terrain-${i}.png`))]);
 [enemyAtlas,enemyManifest,terrainAtlas,terrainManifest,sceneSources[0],sceneAtlas,swordCrystalArt,forgeMaterialArt,sideItemArt,taixuanEvidenceArt,storyStructureArt,memoryProjectorArt,storyInteractableArt,storyCollectibleArt,nagazoraClueArt,huskArt,parvatiArt,perfectTimelineStatuesArt,sceneSources[1],sceneSources[2],chariotArt,chariotPylonSword,chariotPylonDash,chariotPylonSpear,heimdallArt,flyerArt,machineArt,sceneSources[3],sceneSources[4],sceneSources[5],sceneSources[6],courtyardArt,courtyardProps,courtyardBoard,courtyardPost,courtyardFirewood,courtyardBlanket,courtyardGarden,courtyardCat,courtyardRoof,courtyardWaterYoke,courtyardLeaves,courtyardBell,courtyardTeaSet,sevenSwordsArt,sevenSwordsCombatArt,bossConceptArt,phantomCombatArt,sceneSources[7],sceneSources[8],jizoCombatArt,quantaProps,ch6Keepsakes,sceneSources[9],mnemosyneArt,ch7Artifacts]=await Promise.all([loadImage('assets/nagazora-enemies-wiki.png'),fetch('enemy-story-manifest.json').then(r=>r.json()),loadImage('assets/terrain-nagazora-alpha-v1.png'),fetch('terrain-story-manifest.json').then(r=>r.json()),loadImage('assets/original-library/map-00-nagazora-ruins-v1.png'),loadImage('assets/nagazora-districts.png'),loadImage('assets/sword-crystal.png'),loadImage('assets/forge-materials-v2.png?v=20261004a'),loadImage('assets/story-side-items.svg'),loadImage('assets/taixuan/evidence-artifacts-v1.png'),loadImage('assets/story-structures.svg'),loadImage('assets/structures/memory-projector-babylon-v1.png?v=20261004a'),loadImage('assets/structures/story-interactables-v2.png?v=20261004a'),loadImage('assets/collectibles/story-collectibles-v2.png?v=20261004a'),loadImage('assets/collectibles/nagazora-clues-v1.png?v=20261004a'),loadImage('assets/boss/nagazora-husk-combat-v1.png?v=20261004a'),loadImage('assets/boss/parvati-combat-v1.png?v=20261004a'),loadImage('assets/imaginary/perfect-timeline-statues-v1.png?v=20261004a'),loadImage('assets/original-library/map-01-arc-city-night-v1.png'),loadImage('assets/original-library/transition-01-arc-heliopolis-schicksal-v1.png'),loadImage('assets/original-library/enemy-chariot-alloy-v1.png'),loadImage('assets/boss/chariot-relay-sword.png'),loadImage('assets/boss/chariot-relay-dash.png'),loadImage('assets/boss/chariot-relay-spear.png'),loadImage('assets/boss/heimdall-combat-v1.png?v=20261004a'),loadImage('assets/original-library/enemy-archangel-base-v1.png'),loadImage('assets/original-library/enemy-templar-base-v1.png'),loadImage('assets/original-library/map-07-helheim-labs-v1.png'),loadImage('assets/original-library/map-02-schicksal-airport-v1.png'),loadImage('assets/original-library/map-03-babylon-snowfield-v1.png'),loadImage('assets/original-library/map-04-taixuan-steps-v1.png'),loadImage('assets/taixuan/courtyard-map.png'),loadImage('assets/taixuan/props-items.png'),loadImage('assets/taixuan/courtyard-board.png'),loadImage('assets/taixuan/courtyard-post.png'),loadImage('assets/taixuan/courtyard-firewood.png'),loadImage('assets/taixuan/courtyard-blanket.png'),loadImage('assets/taixuan/courtyard-garden.png'),loadImage('assets/taixuan/courtyard-cat.png'),loadImage('assets/taixuan/courtyard-roof.png'),loadImage('assets/taixuan/courtyard-water-yoke.png'),loadImage('assets/taixuan/courtyard-leaves.png'),loadImage('assets/taixuan/courtyard-bell.png'),loadImage('assets/taixuan/courtyard-tea-set.png'),loadImage('assets/taixuan/seven-swords-lineup.png'),Promise.all(Array.from({length:7},(_,i)=>loadImage(`assets/taixuan/combat-v2/seven-sword-${i+1}-packed.png`))),loadImage('assets/taixuan/boss-concepts.png'),Promise.all([loadImage('assets/taixuan/combat-v2/phantom-hua-1-packed.png'),loadImage('assets/taixuan/combat-v2/phantom-hua-2-packed.png')]),loadImage('assets/original-library/map-06-sea-of-quanta-v1.png'),loadImage('assets/original-library/map-05-kolosten-storm-v1.png'),loadImage('assets/quanta/jizo-combat-sheet-v2.png'),loadImage('assets/quanta/quanta-props-v1.png'),loadImage('assets/quanta/ch6-side-keepsakes-v1.png'),loadImage('assets/original-library/map-08-imaginary-tree-boss-arena-v1.png'),loadImage('assets/imaginary/mnemosyne-combat-v2.png?v=20261004a'),loadImage('assets/imaginary/ch7-artifacts-v2.png?v=20261004a')]);atlas=imgs[0];backgrounds=imgs.slice(1,6);terrain=imgs.slice(6);frames=Object.fromEntries(manifest.frames.map(f=>[f.id,f]));albumUI=createAlbumUI({save,getSave:()=>save,onBack(){switchScreen('home');syncHome()},onReplay:replayAlbumCard});syncHome();requestAnimationFrame(loop);
 if(QA)window.__qa={ready:true,manual(value=true){manual=value;acc=0;},seek(m){if(!g)return null;g.p.x=Number(m)*64;g.p.y=chapter.physics.groundY;g.p.vx=g.p.vy=0;g.camera=Math.max(0,g.p.x-270);render();return this.snapshot();},start,advance:nextDialogue,enterCourtyard(){enterCourtyard();render();return this.snapshot();},startMemoryTrial(type='testimony'){$('#dialogue').hidden=true;enterMemoryTrial({id:'qa-memory-trial',title:'Nhánh A · Đèn tắt',trial:type,item:'red_shadow_fragment',keepsake:'Mảnh Xích Tuyết Ánh',end:[['Ký ức','Đã xác minh.']]});render();return this.snapshot();},step(codes=[],n=1,paint=true){manual=true;const next=new Set(codes);for(const code of next)if(!keys.has(code))pressed.add(code);keys=next;for(let i=0;i<n;i++)tick(DT);if(paint)render();return this.snapshot()},snapshot(){return {inputKeys:[...keys],phase:g?.phase,mode:g?.mode,p:g?{...g.p,attack:g.p.attack?{...g.p.attack,hit:[...g.p.attack.hit]}:null}:null,hp:g?.hp,time:g?.time,elapsed:g?.elapsed,arena:g?.arena,wave:g?.wave,enemies:g?.enemies.map(e=>({...e})),nodes:g?.nodes,lab:g?.lab,sideStories:g?.sideStories,ch7Altars:g?[...g.ch7Altars||[]]:[],mnemosyneSpecial:g?.mnemosyneSpecial,dualCount:g?.dualCount,memories:g?[...g.memories]:[],scene:g?currentScene().id:null,storyEvents:g?[...g.storyEvents]:[],interaction:g?.interaction,projectiles:g?.projectiles,rescueState:g?.rescueState,upgrades:g?.upgrades,dialogueIndex:g?.dialogueIndex,environment:g?.environment,vents:g?.world.vents,pickups:g?.world.pickups,audioStatus:gameAudio.status,coinRepairs:g?.world.coinRepairs,bossRecord:g?.bossRecord,chariotRecord:g?.chariotRecord,heimdallRecord:g?.heimdallRecord,parvatiRecord:g?.parvatiRecord,phantomRecord:g?.phantomRecord,sevenSwordsRecord:g?.sevenSwordsRecord,jizoRecord:g?.jizoRecord,mnemosyneRecord:g?.mnemosyneRecord,courtyard:g?.courtyard,memoryTrial:g?.memoryTrial,album:structuredClone(save.album),loopCount:g?.loopCount,parry:g?.parry,gaps:g?.world.gaps.filter(x=>x.x>(g.p.x-300)&&x.x<g.p.x+1200),platforms:g?.world.platforms.filter(x=>!x.destroyed&&x.x>g.p.x-300&&x.x<g.p.x+1200),clear:g?[...g.clear]:[],visited:g?[...g.visited]:[],save:structuredClone(save),metrics:structuredClone(metrics),range:jumpRange(speedSafe(),chapter.physics.gravity,chapter.physics.jumpVelocity),score:g?.score,endlessLoot:g?.endlessLoot,endlessDrops:g?.endlessDrops,generated:g?.world.patterns.length,anim:g?.p.state,dom:screen}},manifest};
 }catch(e){$('#error').hidden=false;$('#error').textContent=`Không thể tải ký ức: ${e.message}. Hãy mở qua máy chủ HTTP và giữ nguyên thư mục assets.`;$('#story').textContent='TẢI ASSET THẤT BẠI';console.error(e)}}
function speedSafe(){return g?speed():chapter.physics.speed}
init();


// Chapter 1 staging, sourced from the user's story scripts. See story/IMPLEMENTATION.md.
function currentScene(){return chapter.scenes.filter(s=>s.from<=(g?.p.x||0)/64).at(-1)||chapter.scenes[0]}
function say(speaker,text){if(g.speechTime>0)g.speechQueue.push({speaker,text});else {g.speech={speaker,text};g.speechTime=5;} const id=speaker+text;if(!g.journal.some(e=>e.id===id))g.journal.push({id,m:Math.floor(g.p.x/64),title:currentScene().name,lines:[[speaker,text]]})}
function updateStory(dt){
 if(g.chapter>=4){updateLateStory(dt);return;}
 if(g.chapter===3){updateLabStory(dt);return;}
 if(g.chapter===2){updateArcStory(dt);return;}
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
 if(g.chapter>=4){drawLateScene();return;}
 if(g.chapter===3){drawLabScene();return;}
 if(g.chapter===2){drawArcScene();return;}
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
 if(e.kind==='boss'&&!e.ai&&e.telegraph>0)label(e.move==='charge'?'LAO TỚI · K PHẢN ĐÒN':'QUÉT THẤP · SPACE NHẢY',x,e.y-e.h-45,'#ffd3af',12);
}
function drawCrystal(x,y,size,color){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(g.time*2)*.08);ctx.fillStyle=color;ctx.shadowBlur=16;ctx.shadowColor=color;ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(size*.52,0);ctx.lineTo(0,size);ctx.lineTo(-size*.52,0);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff3ed';ctx.stroke();ctx.restore()}
function drawStoryObjects(){
 if(g.mode!=='story')return;
 if(g.chapter>=4){drawLateObjects();return;}
 if(g.chapter===3){drawLabObjects();return;}
 if(g.chapter===2){drawArcObjects();return;}
 if(!save.weapons.length){
  const x=chapter.swordCrystal.m*64-g.camera;drawCrystal(x,400,62,'#9885d699');ctx.drawImage(swordCrystalArt,x-25,337,50,120);label('E · CHẠM VÀO KÝ ỨC',x,318,'#ffe4b4',12);
  for(let i=0;i<3;i++){const e={kind:'enemy',x:370+i*280,y:490,face:-1,hp:1,hitTime:0};ctx.save();drawStoryEnemy(e,(e.x+Math.sin(g.time*.7+i)*35)-g.camera);ctx.restore();}
 }
 for(const n of g.nodes){const x=n.x-g.camera;if(x< -120||x>W+120)continue;ctx.save();ctx.shadowColor=n.destroyed?'transparent':'#d899f1';ctx.shadowBlur=18;drawStructure(n,x);ctx.restore();if(!n.destroyed)label(n.order?`NÚT ${n.order} / 3 · J`:(g.loopCount?'NÚT GIỮ FU HUA · J CHÉM':'MỘT NHỊP SÁNG KHÁC THƯỜNG'),x,300,'#ffe2ac',13);}
 for(const m of chapter.memories){if(g.memories.has(m.id))continue;const x=m.m*64-g.camera;if(x< -60||x>W+60)continue;drawCrystal(x,m.y,15,'#ffe0a3');label(m.slide?'S · TRƯỢT SÁT MÉP':'SPACE ×2 · BAN CÔNG',x,m.y-27,'#ffe5a8',11);}
 for(const clue of chapter.investigations||[]){if(g.storyEvents.has(clue.id))continue;const x=clue.m*64-g.camera;if(x<-90||x>W+90)continue;drawNagazoraClue(clue.id,x,88);label('E · '+clue.title,x,340,'#f4dfc6',10);}
 if(g.debris){const d=g.debris,x=d.x-g.camera;if(d.t>0){ctx.fillStyle='#ffbc9b66';ctx.fillRect(x-35,486,70,4);label('ĐỔ NÁT ↓',x,320,'#ffcea5',13);}else terrainPiece(x-25,d.y,50,42,0,'breakable');}
 if(currentScene().id==='escape'&&g.phase!=='finished'){const x=g.collapseX-g.camera;if(x>0){ctx.fillStyle='#2b123a99';ctx.fillRect(0,0,x,600);label('NAGAZORA ĐANG SỤP',Math.max(130,x),200,'#f2b3cf',13)}}
 if(g.phase==='dialogue'&&(g.arena?.m===2000||g.memories.has('main-1')))drawSprite(Math.floor(g.presentationTime*2)%5===0?'hua.7':'hua.0',g.p.x-g.camera+100,490+Math.sin(g.presentationTime*4)*2,1,-1);
}
function drawYatta(x,y,t){
 const hop=Math.abs(Math.sin(t*9))*32,center=clamp(x,170,W-170),pop=Math.min(1,t*5);
 ctx.save();ctx.fillStyle='#110b2866';ctx.fillRect(0,0,W,490);
 if(g.yattaArena===6580){const burst=clamp((t-.3)/1.25,0,1);ctx.strokeStyle='#fff4dc';ctx.lineWidth=3;ctx.shadowColor='#ff8fc8';ctx.shadowBlur=18;for(let i=0;i<13;i++){const angle=-2.9+i*.24,len=80+burst*(170+(i%4)*55);ctx.beginPath();ctx.moveTo(W/2,195);ctx.lineTo(W/2+Math.cos(angle)*len,195+Math.sin(angle)*len);ctx.stroke();}ctx.shadowBlur=0;for(let i=0;i<26;i++){const angle=i*2.17,rad=burst*(45+(i%7)*36);ctx.save();ctx.translate(W/2+Math.cos(angle)*rad,195+Math.sin(angle)*rad*.65);ctx.rotate(angle+t*2);ctx.fillStyle=i%2?'#ffb5d4':'#fff2c4';ctx.fillRect(-5,-2,10,4);ctx.restore();}label('SÓNG ÂM ĐẬP VỠ THÁI HƯ HOÀN HẢO',W/2,116,'#fff1c8',16);}
 const light=ctx.createRadialGradient(x,y-95,10,x,y-95,210);light.addColorStop(0,'#ffcfad44');light.addColorStop(1,'#ffcfad00');ctx.fillStyle=light;ctx.fillRect(x-220,y-310,440,360);
 for(let i=0;i<32;i++){const angle=i*2.399,burst=Math.min(1,t/1.2),radius=30+burst*(75+i%7*20),px=x+Math.cos(angle)*radius,py=y-105-hop*.25+Math.sin(angle)*radius*.7+Math.max(0,t-1.2)*35;ctx.save();ctx.translate(px,py);ctx.rotate(angle+t*3);ctx.fillStyle=['#ffe5aa','#f4a7ce','#a8f0ec','#ffffff'][i%4];ctx.fillRect(-3,-5,6,10);ctx.restore();}
 ctx.translate(x,y-hop);ctx.scale(1.35+Math.sin(t*18)*.025,1.35-Math.sin(t*18)*.025);
 // Build the raised-arm pose from one sprite. The original arm pixels are left out
 // of the clipped torso band, so the victory pose can never show four arms.
 for(const side of [-1,1]){
  ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(side*15,-48);ctx.lineTo(side*40,-64);ctx.lineTo(side*34,-80);ctx.strokeStyle='#15121d';ctx.lineWidth=9;ctx.stroke();
  ctx.strokeStyle='#3b3444';ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle='#c89d56';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(side*17,-49);ctx.lineTo(side*39,-64);ctx.stroke();
  ctx.fillStyle='#ffe0cd';ctx.fillRect(side*34-4,-88,8,8);
 }
 ctx.fillStyle='#171421';ctx.fillRect(-19,-51,38,24);ctx.fillStyle='#d6a656';ctx.fillRect(-17,-50,34,3);
 ctx.fillStyle='#332130';ctx.fillRect(-14,-49,28,19);ctx.fillStyle='#dfb761';ctx.fillRect(-5,-51,10,6);
 ctx.fillStyle='#f0c975';ctx.beginPath();ctx.moveTo(-16,-43);ctx.lineTo(0,-32);ctx.lineTo(16,-43);ctx.lineTo(16,-39);ctx.lineTo(0,-28);ctx.lineTo(-16,-39);ctx.fill();
 ctx.fillStyle='#1d1927';ctx.fillRect(-10,-40,20,8);ctx.fillStyle='#c69d58';ctx.fillRect(-4,-42,8,8);ctx.fillRect(-2,-31,4,5);
 const spritePart=(px,py,pw,ph)=>{ctx.save();ctx.beginPath();ctx.rect(px,py,pw,ph);ctx.clip();drawSprite('idle.4',0,0,1,1);ctx.restore()};
 spritePart(-112,-156,256,105);spritePart(-17,-51,34,7);spritePart(-112,-51,85,24);spritePart(27,-51,117,24);spritePart(-112,-27,256,47);
 ctx.fillStyle='#f5a7ac';ctx.fillRect(-15,-78,5,3);ctx.fillRect(10,-78,5,3);ctx.fillStyle='#6b3553';ctx.fillRect(-2,-75,5,2);ctx.restore();
 ctx.save();ctx.globalAlpha=pop;ctx.shadowColor='#ffadc8';ctx.shadowBlur=20;label('YATTA!',center,y-185-hop*.25,'#fff1c5',39);ctx.restore();
}
const SIDE_ITEM_CELLS={mnemosyne_record:0,helheim_message:1,incubator_tags:2,warm_teapot:3,taixuan_letter:4,taixuan_tablet:5,arc_supply_crate:6,helheim_core_crate:7,babylon_ice_core:8,taixuan_script_chest:9,red_shadow_fragment:10,wanru_bandage:11,silent_bell:12,wooden_bowl:13,blindfold:14,wind_chime:14,unfinished_portrait:15,moon_sheath:16};
const TAIXUAN_EVIDENCE_CELLS={red_shadow_fragment:0,wanru_bandage:1,silent_bell:2,wooden_bowl:3,blindfold:4,wind_chime:4,unfinished_portrait:5,moon_sheath:6};
const STRUCTURE_CELLS={'loop-light':0,'escape-1':0,'escape-2':0,'escape-3':0,'neon-sign':1,'glass-wall':2,'coolant-pipe':3,'quarantine-wall':4,'memory-crate':5,'ink-gate':7,'silent-anchor':7,'distant-anchor':7,'false-wall':7,'shadow-seal':7};
const STRUCTURE_SIZES={'loop-light':[126,168],'escape-1':[126,168],'escape-2':[126,168],'escape-3':[126,168],'neon-sign':[112,164],'glass-wall':[142,174],'coolant-pipe':[154,170],'quarantine-wall':[124,168],'memory-crate':[164,114],'ink-gate':[136,170],'silent-anchor':[136,170],'distant-anchor':[136,170],'false-wall':[136,170],'shadow-seal':[136,170]};
function drawInteractableCell(cell,x,bottom,w,h,alpha=1){if(!storyInteractableArt)return false;const sw=storyInteractableArt.width/4,sh=storyInteractableArt.height/2;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;ctx.drawImage(storyInteractableArt,(cell%4)*sw,Math.floor(cell/4)*sh,sw,sh,Math.round(x-w/2),Math.round(bottom-h),w,h);ctx.restore();return true;}
function drawSideItem(kind,x,y,size=64,alpha=1){const evidence=TAIXUAN_EVIDENCE_CELLS[kind];if(evidence!==undefined&&taixuanEvidenceArt){const sw=taixuanEvidenceArt.width/4,sh=taixuanEvidenceArt.height/2,sx=evidence%4*sw,sy=Math.floor(evidence/4)*sh;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;ctx.drawImage(taixuanEvidenceArt,sx,sy,sw,sh,Math.round(x-size*.62),Math.round(y-size*1.18),Math.round(size*1.24),Math.round(size*1.24));ctx.restore();return true;}const cell=SIDE_ITEM_CELLS[kind];if(cell===undefined)return false;if(cell<10&&storyCollectibleArt){const sw=storyCollectibleArt.width/5,sh=storyCollectibleArt.height/2;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;ctx.drawImage(storyCollectibleArt,(cell%5)*sw,Math.floor(cell/5)*sh,sw,sh,Math.round(x-size*.62),Math.round(y-size*1.18),Math.round(size*1.24),Math.round(size*1.24));ctx.restore();return true;}if(!sideItemArt)return false;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(sideItemArt,cell*64,0,64,64,Math.round(x-size/2),Math.round(y-size),size,size);ctx.restore();return true;}
function drawStructure(node,x,bottom=490){
 if(node.id.startsWith('memory-projector')&&memoryProjectorArt){
  const frame=node.destroyed?2:(Math.floor(g.presentationTime*5)%13===0?1:0),sw=memoryProjectorArt.width/3,sh=memoryProjectorArt.height,dw=142,dh=157;
  ctx.save();ctx.globalAlpha=node.destroyed?.72:1;ctx.imageSmoothingEnabled=true;
  if(!node.destroyed){ctx.shadowColor=frame===1?'#ef68dd':'#78edff';ctx.shadowBlur=frame===1?25:17;}
  ctx.drawImage(memoryProjectorArt,frame*sw,0,sw,sh,Math.round(x-dw/2),Math.round(bottom-dh+5),dw,dh);ctx.shadowBlur=0;ctx.restore();return true;
 }
 const cell=STRUCTURE_CELLS[node.id],size=STRUCTURE_SIZES[node.id];if(cell!==undefined&&size&&storyInteractableArt)return drawInteractableCell(cell,x,bottom,size[0],size[1],node.destroyed?.3:1);
 const legacy={'neon-sign':0,'glass-wall':1,'coolant-pipe':2,'quarantine-wall':3,'memory-crate':5,'false-wall':6,'shadow-seal':7}[node.id];if(legacy===undefined||!storyStructureArt)return false;ctx.save();ctx.globalAlpha=node.destroyed?.24:1;ctx.imageSmoothingEnabled=false;ctx.drawImage(storyStructureArt,legacy*96,0,96,128,Math.round(x-48),bottom-128,96,128);ctx.restore();return true;
}
function drawSideQuestItem(quest,x){const active=quest.state==='active',bob=Math.sin(g.presentationTime*4+quest.x*.01)*3;ctx.save();ctx.shadowColor=active?'#ff8fc4':'#89f3df';ctx.shadowBlur=active?23:13;drawSideItem(quest.item,x,425+bob,active?72:62,active?.72:1);ctx.shadowBlur=0;ctx.restore();}
const CLUE_ITEM_BY_ID={'ch2-roof-signal':'mnemosyne_record','ch2-hangar-log':'arc_supply_crate','ch2-train-console':'helheim_message','ch3-clue-0':'helheim_message','ch3-clue-1':'helheim_core_crate','ch3-clue-2':'babylon_ice_core','ch4-clue-0':'incubator_tags','ch4-clue-1':'taixuan_tablet'};
function drawClueItem(clue,x,size=64){return drawSideItem(clue.item||CLUE_ITEM_BY_ID[clue.id]||'mnemosyne_record',x,428,size);}
function drawNagazoraClue(id,x,size=84){if(!nagazoraClueArt)return false;const cell={"broken-sign":0,"white-feather":1,clock:2}[id];if(cell===undefined)return false;const sw=nagazoraClueArt.width/3,sh=nagazoraClueArt.height;ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(nagazoraClueArt,cell*sw,0,sw,sh,x-size*.66,490-size*1.35,size*1.32,size*1.35);ctx.restore();return true;}
function drawArcObjects(){const t=g.presentationTime;
 for(const n of g.nodes){const x=n.x-g.camera;if(x<-130||x>W+130)continue;if(n.destroyed){drawStructure(n,x);ctx.fillStyle='#9ee4f0';for(let i=0;i<7;i++)ctx.fillRect(x-42+i*13,442+i%3*12,7,5);continue;}ctx.save();ctx.translate(0,Math.sin(t*4)*2);ctx.shadowColor='#eb7bd2';ctx.shadowBlur=20;drawStructure(n,x);ctx.shadowBlur=0;ctx.restore();label('J · CHÉM CỘT NHIỄU ĐỂ PHÁ VÒNG LẶP',x,326,'#ffe5b9',11);}
 if(!save.weapons.includes('spear')){const x=chapter.spearMemory.m*64-g.camera;if(x>-90&&x<W+90){drawCrystal(x,318+Math.sin(t*3)*8,50,'#f476ac99');ctx.save();ctx.translate(x,337+Math.sin(t*3)*8);ctx.rotate(-.55);ctx.shadowColor='#ff7caa';ctx.shadowBlur=19;ctx.fillStyle='#3c243e';ctx.fillRect(-5,-82,10,150);ctx.fillStyle='#dc4569';ctx.beginPath();ctx.moveTo(0,-125);ctx.lineTo(17,-75);ctx.lineTo(0,-85);ctx.lineTo(-17,-75);ctx.closePath();ctx.fill();ctx.fillStyle='#ffe3cd';ctx.fillRect(-2,-85,4,118);ctx.restore();label('E · BẮT LẤY THƯƠNG',x,230,'#ffdbd1',13);}}
 for(const m of chapter.memories){if(g.memories.has(m.id)||m.requiresNode&&!g.nodes.find(n=>n.id===m.requiresNode)?.destroyed)continue;const x=m.m*64-g.camera;if(x<-70||x>W+70)continue;drawCrystal(x,m.y,18,'#ffd4a2');label(m.requiresDash?'L · DASH LÙI VỀ ĐUÔI TÀU':'MẢNH ẨN · SAU BIỂN HIỆU',x,m.y-34,'#ffe8c0',10);}
 for(const clue of chapter.investigations||[]){if(g.storyEvents.has(clue.id))continue;const x=clue.m*64-g.camera;if(x<-70||x>W+70)continue;drawClueItem(clue,x,68);label('E · '+clue.title,x,352,'#d5f2f4',10);}
}
function drawArcScene(){const id=currentScene().id,t=g.presentationTime,city=sceneSources[1],trans=sceneSources[2],meters=g.p.x/64;
 if(id==='arc-roofs')ctx.drawImage(city,0,0,1672,755,0,0,W,490);
 else if(id==='neon-loop')ctx.drawImage(trans,0,0,1120,750,0,0,W,490);
 else if(id==='spear-sky')ctx.drawImage(city,460,0,1212,740,0,0,W,490);
 else if(id==='heliopolis')ctx.drawImage(trans,470,0,1040,750,0,0,W,490);
 else if(id==='schicksal-train')ctx.drawImage(city,320,0,1352,720,0,0,W,490);
 else ctx.drawImage(trans,800,0,872,750,0,0,W,490);
 if(id==='arc-roofs'){for(let i=0;i<5;i++){const x=((i*325-g.camera*.12)%1500+1500)%1500-180,h=45+i%3*24;ctx.fillStyle='#0e1731af';ctx.fillRect(x,455-h,150,h);ctx.fillStyle='#a77bd788';ctx.fillRect(x+28,455-h+14,23,3);ctx.fillRect(x+83,455-h+33,23,3);ctx.strokeStyle='#9bbce5aa';ctx.beginPath();ctx.moveTo(x+75,455-h);ctx.lineTo(x+75,455-h-31);ctx.stroke();}}
 if(id==='neon-loop'){for(let i=0;i<4;i++){const x=((i*350-g.camera*.16)%1400+1400)%1400-120;ctx.fillStyle='#10152dc9';ctx.fillRect(x,240,90,230);ctx.shadowColor=i%2?'#fb7bce':'#7cdbff';ctx.shadowBlur=18;ctx.strokeStyle=i%2?'#e876c5':'#8de2ff';ctx.lineWidth=3;ctx.strokeRect(x+13,271,63,90);ctx.shadowBlur=0;label(i===1?'BÁNH BAO':i===2?'ARC':'夜',x+45,313,i%2?'#ffd6ea':'#b8eeff',13);if(!g.nodes[0]?.destroyed&&i===1&&Math.floor(t*8)%3===0){ctx.fillStyle='#d984f777';ctx.fillRect(x-12,267,118,4);ctx.fillRect(x+9,332,87,3);}}}
 if(id==='spear-sky'){const r=60+Math.sin(t*3)*12;ctx.strokeStyle='#98e5ff99';ctx.lineWidth=4;ctx.beginPath();ctx.arc(885,145,r,0,Math.PI*2);ctx.stroke();for(let i=0;i<9;i++){ctx.fillStyle='#bef8ff99';ctx.fillRect((i*159+t*45)%W,95+(i*73)%210,3,18);}}
 if(id==='heliopolis'){ctx.fillStyle='#0a18278c';ctx.fillRect(0,0,W,78);for(let i=0;i<9;i++){const x=((i*175-g.camera*.28)%1400+1400)%1400-80;ctx.fillStyle='#172b39bb';ctx.fillRect(x,68,22,410);ctx.fillStyle=Math.floor(t*3+i)%4===0?'#ff9a68':'#f4cd83';ctx.fillRect(x+30,71,42,8);ctx.fillStyle='#81e8ed99';ctx.fillRect(x+5,202,4,112);}}
 if(['schicksal-train','chariot'].includes(id)){ctx.fillStyle='#132036a3';ctx.fillRect(0,408,W,82);for(let i=0;i<12;i++){const x=((i*120-t*155)%1440+1440)%1440-80;ctx.fillStyle='#3a5068';ctx.fillRect(x,414,5,76);ctx.fillStyle='#ddbc7e';ctx.fillRect(x+9,421,51,3);}for(let i=0;i<20;i++){const x=((i*83-t*340)%W+W)%W;ctx.strokeStyle='#b7ddff5c';ctx.beginPath();ctx.moveTo(x,98+i%5*53);ctx.lineTo(x-31,98+i%5*53);ctx.stroke();}}
 if(id==='chariot'){ctx.fillStyle='#50132c55';ctx.fillRect(0,0,W,490);ctx.strokeStyle='#ff9ad8aa';ctx.lineWidth=3;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(i*240,0);ctx.lineTo(i*240+48,350);ctx.stroke();}}
 if(meters>2890&&meters<3200&&g.phase==='explore')label('SCHICKSAL · TÀU VẬN CHUYỂN',W-180,52,'#d5e4f5',10);
}
function drawArcTerrain(x,y,w,h,kind){const id=currentScene().id,train=['schicksal-train','chariot'].includes(id),tunnel=id==='heliopolis',edge=train?'#d4a05e':tunnel?'#7bb7c3':'#af88d5';
 ctx.save();ctx.fillStyle=train?'#1c263b':tunnel?'#293340':'#111b36';ctx.fillRect(x,y,w,h);ctx.fillStyle=edge;ctx.fillRect(x,y,w,4);ctx.fillStyle='#0a1229';ctx.fillRect(x,y+9,w,3);
 for(let i=Math.floor(x/54)*54;i<x+w;i+=54){ctx.fillStyle=train?'#3a445b':tunnel?'#3f4e5a':'#263659';ctx.fillRect(i,y+16,4,Math.max(4,h-18));ctx.fillStyle=train?'#d8a267':tunnel?'#edce8c':'#9b9cdb';ctx.fillRect(i+18,y+8,13,3);if(h>55){ctx.fillStyle='#0d1729';ctx.fillRect(i+8,y+38,36,14);ctx.fillStyle=edge+'99';ctx.fillRect(i+9,y+39,34,2);}}
 if(kind!=='ground'){ctx.strokeStyle=edge;ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,w-2,h-2);if(kind==='gate'){ctx.fillStyle='#ffcf84';for(let i=0;i<5;i++)ctx.fillRect(x+14+i*29,y+h-9,12,4);}if(kind==='moving'){ctx.fillStyle='#b1e8ec';ctx.fillRect(x+8,y+8,w-16,4);}}
 ctx.restore();}
function updateArcStory(dt){const p=g.p,scene=currentScene();if(g.speechTime<=0&&g.speechQueue.length){g.speech=g.speechQueue.shift();g.speechTime=5;}
 if(g.sceneId!==scene.id){g.sceneId=scene.id;g.sceneTimer=4;if(!g.seenScenes.has(scene.id)){g.seenScenes.add(scene.id);if(scene.line)say('Senti',scene.line);}}
 updateArcNarrative(dt);
 const sign=g.nodes.find(n=>n.id==='neon-sign');if(sign&&!sign.destroyed&&p.x>sign.x+125){p.x=sign.x+125;if((g.signHint||0)<g.time){say('Phù Hoa','Chém bảng đèn nhiễu kia. Nó đang giữ cả con phố trong một vòng lặp.');g.signHint=g.time+8;}}
 const spear=chapter.spearMemory;if(!save.weapons.includes('spear')&&p.x>spear.m*64+96)p.x=spear.m*64+96;
}
function updateArcNarrative(dt){const p=g.p,m=p.x/64;g.interaction=null;
 for(const beat of chapter.beats||[]){if(m<beat.m||g.storyEvents.has(beat.id))continue;g.storyEvents.add(beat.id);say(beat.speaker,beat.text);}
 if(g.phase==='explore')for(const scene of chapter.cutscenes||[]){if(m<scene.m||g.storyEvents.has(scene.id)||scene.requiresNode&&!g.nodes.find(n=>n.id===scene.requiresNode)?.destroyed||scene.requiresSpear&&!save.weapons.includes('spear'))continue;g.storyEvents.add(scene.id);g.storyVision=scene.visual;dialogue(scene.lines,()=>{g.storyVision=null;g.phase='explore';say('Senti',scene.title+' · Ta nhớ chuyện này.');});return;}
 for(const clue of chapter.investigations||[]){if(g.storyEvents.has(clue.id)||Math.abs(p.x-clue.m*64)>105||g.phase!=='explore')continue;g.interaction={id:clue.id,label:'E · '+clue.title};if(pressed.has('KeyE')){g.storyEvents.add(clue.id);dialogue(clue.lines,()=>{g.phase='explore'});break;}}
 if(g.phase==='explore'&&!save.weapons.includes('spear')&&Math.abs(p.x-chapter.spearMemory.m*64)<105){g.interaction={id:'ch2-spear',label:'E · BẮT LẤY THƯƠNG KÝ ỨC'};if(pressed.has('KeyE')){save.weapons.push('spear');save.weapon='spear';save.weaponLevels.spear=1;g.storyEvents.add('ch2-spear');g.shake=15;spark(p.x,p.y-110,'#ffabcf',38);dialogue([['Mảnh ký ức trên cao','Một cây Thương xuyên qua đám cánh bay, rơi xuống từ vết nứt trên trời. Bàn tay Senti bắt trúng cán ngay trước khi nó tan biến.'],['Senti','Đồ chơi mới! Giờ thì đừng hòng chạy.'],['Phù Hoa','Tầm đâm dài hơn Kiếm. Ba đòn vào lớp giáp ảo sẽ làm nó vỡ; đừng quên đổi vũ khí đúng lúc.']],()=>{g.phase='explore';say('Senti','Phím 2 chọn Thương. Lên nào!')});toast('ĐÃ MỞ THƯƠNG · PHÍM 2 · ĐÁNH QUÁI BAY',5);}}
 for(const memory of chapter.memories){if(g.memories.has(memory.id)||g.phase!=='explore')continue;if(memory.requiresNode&&!g.nodes.find(n=>n.id===memory.requiresNode)?.destroyed)continue;if(memory.requiresDash&&g.dash<=0)continue;if(Math.abs(p.x-memory.m*64)<68&&Math.abs((p.y-p.h*.5)-memory.y)<72){g.memories.add(memory.id);save.crystals+=5;g.memoryVision=memory.id;dialogue(memory.lines,()=>{g.phase='explore';g.memoryVision=null;say('Ký ức',memory.title+' · Đã ghi vào nhật ký')});break;}}
 for(const cache of g.world.salvage||[]){if(g.collected.has(cache.id)||Math.abs(p.x-cache.x)>85||g.phase!=='explore')continue;g.interaction={id:cache.id,label:'E · THU GOM PHỤ TÙNG ARC CITY'};if(pressed.has('KeyE')){g.collected.add(cache.id);save.materials+=5;save.crystals+=2;dialogue([['Thùng phụ tùng','Lõi kim loại và dây dẫn Schicksal còn nguyên. Chưa có bản vẽ nào khớp với chúng, nhưng Hợp kim này đủ để sửa trang bị hiện tại.'],['Phù Hoa','Giữ lại. Khi tới Helheim, ta có thể cần rèn lại vũ khí.'],['Vật liệu','Nhận 5 Hợp kim và 2 Tinh thể.']],()=>{g.phase='explore'});break;}}
 const prompt=$('#interaction-prompt');prompt.hidden=!g.interaction||g.phase==='dialogue';prompt.textContent=g.interaction?.label||'';
 for(const roof of g.world.platforms){if(!roof.crumble||roof.destroyed)continue;if(p.support===roof.id&&!roof.crack)roof.crack=1.4;if(roof.crack){roof.crack-=dt;if(roof.crack<=0){roof.destroyed=true;spark(roof.x+roof.w/2,roof.y,'#90b8dc',12);}}}
}
function updateLabStory(dt){const p=g.p,m=p.x/64,scene=currentScene();
 if(g.speechTime<=0&&g.speechQueue.length){g.speech=g.speechQueue.shift();g.speechTime=5;}
 if(g.sceneId!==scene.id){g.sceneId=scene.id;g.sceneTimer=4;if(!g.seenScenes.has(scene.id)){g.seenScenes.add(scene.id);if(scene.line)say('Senti',scene.line);}}
 g.interaction=null;
 for(const beat of chapter.beats||[])if(m>=beat.m&&!g.storyEvents.has(beat.id)){g.storyEvents.add(beat.id);say(beat.speaker,beat.text);}
 if(g.phase==='explore')for(const cut of chapter.cutscenes||[]){if(m<cut.m||g.storyEvents.has(cut.id)||cut.requiresNode&&!g.nodes.find(n=>n.id===cut.requiresNode)?.destroyed)continue;g.storyEvents.add(cut.id);g.storyVision=cut.visual;dialogue(cut.lines,()=>{g.storyVision=null;g.phase='explore';if(cut.id==='ch3-assist'){save.assistUnlocked=true;g.assistCD=0;toast('FU HUA ASSIST ĐÃ MỞ · Q GỌI HỖ TRỢ',5);}});return;}
 for(const node of g.nodes)if(!node.destroyed&&p.x>node.x+115){p.x=node.x+115;if((g.lab.nodeHint||0)<g.time){say('Phù Hoa',node.requiredWeapon==='spear'?'Dùng Thương vào vết nứt. Đừng phá bể đỏ bên cạnh.':'Kiếm chém đúng khớp ống nước kia.');g.lab.nodeHint=g.time+8;}}
 for(const clue of chapter.investigations||[])if(g.phase==='explore'&&!g.storyEvents.has(clue.id)&&Math.abs(p.x-clue.m*64)<105){g.interaction={id:clue.id,label:'E · '+clue.title};if(pressed.has('KeyE')){g.storyEvents.add(clue.id);dialogue(clue.lines,()=>{g.phase='explore'});break;}}
 for(const memory of chapter.memories){if(g.phase!=='explore'||g.memories.has(memory.id)||memory.requiresNode&&!g.nodes.find(n=>n.id===memory.requiresNode)?.destroyed||memory.requiresAssist&&!save.assistUnlocked)continue;if(Math.abs(p.x-memory.m*64)<95&&Math.abs((p.y-p.h*.5)-memory.y)<85){g.memories.add(memory.id);save.crystals+=6;g.memoryVision=memory.id;dialogue(memory.lines,()=>{g.phase='explore';g.memoryVision=null;});break;}}
 updateSideStories();
 for(const cache of g.world.salvage||[])if(g.phase==='explore'&&!g.collected.has(cache.id)&&Math.abs(p.x-cache.x)<80){g.interaction={id:cache.id,label:'E · THU LINH KIỆN HELHEIM'};if(pressed.has('KeyE')){g.collected.add(cache.id);save.materials+=6;save.crystals+=2;dialogue([['Hộp kỹ thuật','Một hộp linh kiện mecha có dấu Schicksal; mỗi lõi được khắc mã riêng.'],['Senti','Giữ lại. Ta sẽ cần chúng khi rèn lại vũ khí.' ],['Vật liệu','Nhận 6 Hợp kim và 2 Tinh thể.']],()=>{g.phase='explore'});break;}}
 const prompt=$('#interaction-prompt');prompt.hidden=!g.interaction||g.phase==='dialogue';prompt.textContent=g.interaction?.label||'';
}
function drawLabScene(){const id=currentScene().id,t=g.presentationTime,lab=sceneSources[3],air=sceneSources[4],progress=clamp((g.p.x/64-currentScene().from)/(currentScene().to-currentScene().from),0,1);
 if(['schicksal-airfield','heimdall'].includes(id))ctx.drawImage(air,air.width*.05+progress*air.width*.16,0,air.width*.76,air.height*.8,0,0,W,490);
 else {const sx={ 'lab-corridor':0,'memory-vault':.18,'split-pipes':.37,'assist-break':.55 }[id]??0;ctx.drawImage(lab,lab.width*sx,0,lab.width*.42,lab.height*.83,0,0,W,490);}
 if(id==='lab-corridor'){ctx.fillStyle='#0a253275';for(let i=0;i<5;i++){const x=((i*300-g.camera*.13)%1500+1500)%1500-150;ctx.fillRect(x,100,50,390);ctx.fillStyle='#75d8ce66';ctx.fillRect(x+14,125,6,260);ctx.fillStyle='#0a253275';}}
 if(id==='memory-vault'){for(let i=0;i<6;i++){const x=((i*215-g.camera*.17)%1500+1500)%1500-120;ctx.fillStyle='#061d2ca6';ctx.fillRect(x,158,78,300);ctx.strokeStyle=i%3===1?'#dc688c99':'#67d7d799';ctx.lineWidth=3;ctx.strokeRect(x,158,78,300);ctx.fillStyle=i%3===1?'#e2759266':'#69dbdd44';ctx.fillRect(x+8,170,62,270);}}
 if(id==='split-pipes'){ctx.strokeStyle='#8fbbc6';ctx.lineWidth=14;for(let i=0;i<3;i++){const y=143+i*52;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.fillStyle='#19425088';ctx.fillRect(0,443,W,47);drawSprite('hua.8',((g.huaPos??g.p.x-110)-g.camera),482,.9,1,.75);}
 if(id==='assist-break'){ctx.fillStyle='#83d9d321';ctx.fillRect(0,0,W,490);for(let i=0;i<20;i++){const x=((i*79-t*46)%W+W)%W;ctx.fillStyle='#adf2e875';ctx.fillRect(x,100+i*17%320,2,9);}}
 if(['schicksal-airfield','heimdall'].includes(id))for(let i=0;i<34;i++){const x=((i*107-t*260)%W+W)%W,y=60+i*47%380;ctx.strokeStyle='#d5f1ff83';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-21,y+5);ctx.stroke();}
}
function drawLabTerrain(x,y,w,h,kind){const outside=['schicksal-airfield','heimdall'].includes(currentScene().id);ctx.fillStyle=outside?'#24394c':'#17313e';ctx.fillRect(x,y,w,h);ctx.fillStyle=outside?'#b7cad4':'#6fd7d0';ctx.fillRect(x,y,w,5);ctx.fillStyle=outside?'#658497':'#316f79';for(let dx=8;dx<w;dx+=47)ctx.fillRect(x+dx,y+9,26,3);if(kind!=='ground'){ctx.strokeStyle=outside?'#accbd9':'#73ded6';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,w-2,h-2);}}
function drawLateTerrain(x,y,w,h,kind){const ice=g.chapter===4;ctx.fillStyle=ice?'#183244':'#352737';ctx.fillRect(x,y,w,h);ctx.fillStyle=ice?'#bceffc':'#e5a9c9';ctx.fillRect(x,y,w,5);ctx.fillStyle=ice?'#4b7183':'#745268';for(let dx=7;dx<w;dx+=44){ctx.fillRect(x+dx,y+11,25,3);if(ice&&kind==='ground'){ctx.fillStyle='#dff9ff55';ctx.fillRect(x+dx+6,y+3,2,15);ctx.fillStyle='#4b7183';}}if(kind!=='ground'){ctx.strokeStyle=ice?'#9edce9':'#dfa1c4';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,w-2,h-2);}}
function drawLabObjects(){const t=g.presentationTime;
 for(const vat of g.lab.vats){const x=vat.x-g.camera;if(x<-100||x>W+100)continue;ctx.save();ctx.globalAlpha=vat.opened?.3:1;ctx.fillStyle='#102532';ctx.fillRect(x-32,313,64,177);ctx.strokeStyle=vat.kind==='blue'?'#70e0e3':'#ed7792';ctx.lineWidth=4;ctx.strokeRect(x-32,313,64,177);ctx.fillStyle=vat.kind==='blue'?'#70e0e34d':'#ed77924d';ctx.fillRect(x-24,324,48,145);ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=15;drawCrystal(x,390,15,vat.kind==='blue'?'#93eff0':'#f4a1b2');ctx.shadowBlur=0;label(vat.kind==='blue'?'XANH · KÝ ỨC':'ĐỎ · SINH VẬT',x,292,vat.kind==='blue'?'#c1fcf7':'#ffc0cb',10);ctx.restore();}
 for(const n of g.nodes){const x=n.x-g.camera;if(x<-100||x>W+100)continue;ctx.save();ctx.shadowColor=n.destroyed?'transparent':'#71e5d9';ctx.shadowBlur=14;drawStructure(n,x);ctx.shadowBlur=0;ctx.restore();if(!n.destroyed)label((n.requiredWeapon==='spear'?'THƯƠNG':'KIẾM')+' · '+(n.id==='glass-wall'?'KÍNH NỨT':n.id==='coolant-pipe'?'ỐNG NƯỚC':'TƯỜNG CÁCH LY'),x,340,'#e0fbf3',10);}
 for(const memory of chapter.memories){if(g.memories.has(memory.id)||memory.requiresNode&&!g.nodes.find(n=>n.id===memory.requiresNode)?.destroyed||memory.requiresAssist&&!save.assistUnlocked)continue;const x=memory.m*64-g.camera;if(x<-60||x>W+60)continue;drawCrystal(x,memory.y,17,'#ffdc9f');label('MẢNH KÝ ỨC ẨN',x,memory.y-29,'#ffe9be',10);}
 for(const quest of g.sideStories||[]){if(quest.state==='done'||quest.requiresEvent&&!g.storyEvents.has(quest.requiresEvent))continue;const x=quest.x-g.camera;if(x<-100||x>W+100)continue;drawSideQuestItem(quest,x);label(quest.storyOnly?'E · KÝ ỨC PHỤ · '+quest.title:quest.state==='active'?'SIDE STORY · HẠ ĐỘI BẢO VỆ':'E · SIDE STORY · '+quest.title,x,350,quest.state==='active'?'#ffc8e3':'#c9ffec',10);}
 for(const clue of chapter.investigations||[]){if(g.storyEvents.has(clue.id))continue;const x=clue.m*64-g.camera;if(x<-60||x>W+60)continue;drawClueItem(clue,x,70);label('E · '+clue.title,x,350,'#cef6ef',10);}
}
function drawLabNarrative(){const t=g.presentationTime;if(g.phase!=='dialogue'&&g.speechTime>0&&g.speech){ctx.fillStyle='#0d2228ed';ctx.fillRect(195,540,760,86);ctx.fillStyle='#79e1d4';ctx.fillRect(195,540,3,86);wrapNarrative(g.speech.speaker,213,560,720,20,'#a8f1df',12);wrapNarrative(g.speech.text,213,586,720,21);}if(g.phase!=='dialogue')return;
 ctx.fillStyle='#08161dcf';ctx.fillRect(0,35,W,435);ctx.fillStyle='#060d15';ctx.fillRect(0,0,W,35);ctx.fillRect(0,470,W,178);
 const vision=g.storyVision,stage=g.dialogueIndex;for(let i=0;i<7;i++){const x=60+i*170;ctx.fillStyle=vision==='airfield'?'#bed8e733':'#6fe4dc2b';ctx.fillRect(x,100,80,335);ctx.strokeStyle=i%3===1?'#e1869f77':'#89e6db88';ctx.strokeRect(x,100,80,335);}
 if(vision==='pipe'){ctx.strokeStyle='#a9e3e1';ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(0,195);ctx.lineTo(W,195);ctx.stroke();for(let i=0;i<12;i++){ctx.fillStyle='#a6edee9c';ctx.fillRect(490+i*14,210+i*12,4,20);}}
 if(vision?.startsWith('side-item:')){ctx.fillStyle='#06141cbb';ctx.fillRect(448,135,256,250);ctx.strokeStyle='#88eee0';ctx.lineWidth=3;ctx.strokeRect(448,135,256,250);drawSideItem(vision.slice(10),576,350,170);label('VẬT CHỨNG SIDE STORY',576,178,'#d9fff7',14);}
 if(vision==='assist'||vision==='heimdall-phase'){ctx.shadowColor='#a4f8e8';ctx.shadowBlur=25;drawSprite(stage%2?'hua.4':'hua.8',760,455,1.45,-1);ctx.shadowBlur=0;}
 else drawSprite('hua.0',760,455,1.35,-1);
 drawSprite(stage%3===0?'idle.7':'idle.5',365,455,1.45,1);label((chapter.cutscenes||[]).find(c=>c.visual===vision)?.title||g.arena?.name||chapter.title,W/2,90,'#ddf7ed',18);
}
function updateSideStories(){if(!g.sideStories?.length)return;const p=g.p;
 for(const quest of g.sideStories){
  if(quest.storyOnly&&quest.state==='idle'&&quest.requiresEvent&&g.storyEvents.has(quest.requiresEvent)&&!quest.revealed){quest.revealed=true;g.storyEvents.add(quest.id+':revealed');save.storyEvents=[...g.storyEvents];persist();toast('KÝ ỨC PHỤ ĐÃ MỞ · '+quest.title,3.2);}
  if(quest.storyOnly&&quest.state==='idle'&&Math.abs(p.x-quest.x)<=190&&g.phase==='explore'&&(!quest.requiresEvent||g.storyEvents.has(quest.requiresEvent))){g.interaction={id:quest.id,label:'E · KÝ ỨC PHỤ · '+quest.title};if(pressed.has('KeyE')){quest.state='active';g.storyEvents.add(quest.id+':active');g.storyVision='side-item:'+quest.item;dialogue(quest.start||[['Ký ức','Một mảnh cảnh cũ đang chờ được hoàn thành.']],()=>{g.storyVision=null;enterMemoryTrial(quest)});return;}continue;}
  if(quest.storyOnly)continue;
  if(quest.state==='active'&&g.enemies.some(e=>e.hp>0&&e.sideQuest===quest.id)&&p.x>quest.x+360){p.x=quest.x+360;if((quest.hintAt||0)<g.time){say('Phù Hoa','Đội bảo vệ ký ức vẫn còn phía sau. Kết thúc thử thách này trước.');quest.hintAt=g.time+6;}}
  if(quest.state==='active'&&!g.enemies.some(e=>e.hp>0&&e.sideQuest===quest.id)&&g.phase==='explore'){quest.state='done';g.storyEvents.add(quest.id+':done');g.storyEvents.delete(quest.id+':active');save.crystals+=8;save.materials+=6;if(quest.reward==='taixuan_script'){addForgePart(save,'taixuan_script',4);g.storyEvents.add('forge-tai-xuan');}g.storyVision='side-item:'+quest.item;dialogue([...quest.end,['Phần thưởng',quest.reward==='taixuan_script'?'Nhận bản thiết kế Grips of Tai Xuan, 4 Ấn quyết Thái Hư, 6 Hợp kim và 8 Tinh thể.':'Nhận vật chứng cốt truyện, 6 Hợp kim và 8 Tinh thể.']],()=>{g.storyVision=null;g.phase='explore'});return;}
  if(quest.state!=='idle'||Math.abs(p.x-quest.x)>190||g.phase!=='explore'||quest.requiresDual&&!save.dualUnlocked)continue;
  g.interaction={id:quest.id,label:'E · SIDE STORY · '+quest.title};if(pressed.has('KeyE')){quest.state='active';g.storyEvents.add(quest.id+':active');const offsets=[120,210,300];for(const [i,kind] of quest.enemies.entries()){const foe=spawnEnemy(kind,p.x+offsets[i%3],`${quest.id}-${i}`);foe.sideQuest=quest.id;foe.hp=foe.maxHP=Math.round(foe.maxHP*1.25);foe.damage=Math.round(foe.damage*1.15);g.enemies.push(foe);}g.storyVision='side-item:'+quest.item;dialogue(quest.start,()=>{g.storyVision=null;g.phase='explore';toast('SIDE STORY · HẠ ĐỘI BẢO VỆ KÝ ỨC',3)});return;}
 }
}
function updateLateStory(dt){const p=g.p,m=p.x/64,scene=currentScene();if(g.chapter===6){const next=['kolosten-storm','kolosten-choice'].includes(scene.id)?'hua':'senti';if(g.protagonist!==next){g.protagonist=next;p.attack=null;g.combo=0;toast(next==='hua'?'GÓC NHÌN · PHÙ HOA · QUYỀN PHÁP TAIXUAN':'GÓC NHÌN · SENTI',2.4);}}if(g.speechTime<=0&&g.speechQueue.length){g.speech=g.speechQueue.shift();g.speechTime=5;}if(g.sceneId!==scene.id){g.sceneId=scene.id;g.sceneTimer=4;if(!g.seenScenes.has(scene.id)){g.seenScenes.add(scene.id);if(scene.line)say(g.protagonist==='hua'?'Phù Hoa':'Senti',scene.line);}}g.interaction=null;
 if(g.chapter===5&&g.phase==='explore'&&Math.abs(m-5605)<2.2){g.interaction={id:'taixuan-courtyard',label:'E · VÀO SÂN SAU THÁI HƯ'};if(pressed.has('KeyE')){enterCourtyard();return;}}
 if(g.chapter===5&&m>6265&&!['ch5-branch-a','ch5-branch-b','ch5-branch-c'].every(id=>g.storyEvents.has(id))){p.x=6265*64;g.interaction={id:'ch5-branches-gate',label:'HOÀN THÀNH ĐỦ 3 NHÁNH KÝ ỨC ĐỂ MỞ SÂN CHÍNH'};if((g.branchHint||0)<g.time){say('Phù Hoa','Ba lời khai chưa được nghe hết. Ta không thể bước vào đêm ấy khi vẫn bỏ lại họ.');g.branchHint=g.time+7;}}
 if(g.chapter===7){
  if(m>8195&&(g.ch7Altars?.size||0)<3){p.x=8195*64;p.vx=0;g.interaction={id:'ch7-altar-gate',label:`MỞ 3 BÀN KÝ ỨC · HIỆN CÓ ${g.ch7Altars?.size||0}/3`};if((g.altarHint||0)<g.time){say('Mnemosyne','Không đủ dữ liệu cảm xúc để đi vào Dòng Thời Gian Hoàn Hảo.');g.altarHint=g.time+6;}}
  for(const altar of chapter.memoryAltars||[])if(!g.storyEvents.has(altar.id)&&Math.abs(p.x-altar.m*64)<100&&g.phase==='explore'){
   g.interaction={id:altar.id,label:`E · BÀN KÝ ỨC ${altar.chapter} · ĐỔI ĐAU LẤY SỨC MẠNH`};if(pressed.has('KeyE')){g.storyEvents.add(altar.id);g.ch7Altars.add(altar.id);g.hp=Math.max(1,g.hp-Math.round(maxHP()*.08));g.runBuff*=1.035;unlockAlbum(save,'7-03','green','Mảnh Bàn Ký Ức');dialogue([['Bàn Ký Ức',altar.memory],['Mnemosyne','Đau đớn đã được phân loại. Đề xuất xóa.'],['Senti','Không. Bọn ta mang nó đi cùng, rồi tự chọn xem nó có nghĩa gì.'],['Phù Hoa',`Đã mở ${g.ch7Altars.size}/6 bàn. Sức mạnh tăng, nhưng ký ức sẽ để lại vết đau.`]],()=>{g.phase='explore';});return;}
  }
 }
 for(const beat of chapter.beats||[])if(m>=beat.m&&!g.storyEvents.has(beat.id)){g.storyEvents.add(beat.id);say(beat.speaker,beat.text);}
 if(g.phase==='explore')for(const cut of chapter.cutscenes||[]){if(m<cut.m||g.storyEvents.has(cut.id)||cut.requiresNode&&!g.nodes.find(n=>n.id===cut.requiresNode)?.destroyed||cut.requiresWeapon&&!save.weapons.includes(cut.requiresWeapon)||cut.requiresEvents?.some(id=>!g.storyEvents.has(id)))continue;g.storyEvents.add(cut.id);if(cut.album)unlockAlbum(save,cut.album,cut.mark||'white');g.storyVision=cut.visual;dialogue(cut.lines,()=>{g.storyVision=null;g.phase='explore';if(cut.id==='ch5-dual'){save.dualUnlocked=true;g.assistCD=0;toast('DUAL COMBO ĐÃ MỞ · Q KẾT HỢP SENTI × PHÙ HOA',5);}if(cut.id==='ch6-reunion'){g.protagonist='senti';g.assistCD=0;toast('ASSIST ĐÃ TRỞ LẠI · Q NHỊP BA',5);}});return;}
 if(g.chapter===4&&!save.weapons.includes('chain')&&Math.abs(m-chapter.chainMemory.m)<1.65&&g.phase==='explore'){g.interaction={id:'ch4-chain',label:'E · NẮM LẤY XÍCH NHẬN'};if(pressed.has('KeyE')){save.weapons.push('chain');save.weapon='chain';save.weaponLevels.chain=1;g.storyEvents.add('ch4-chain');g.storyVision='chain';dialogue([['Mảnh ký ức','Sợi xích từng giam giữ một người nay quấn quanh cổ tay Senti, nhẹ như thể đã chờ cô từ lâu.'],['Senti','Thứ từng trói người khác giờ sẽ kéo Old Timer ra khỏi vực.'],['Phù Hoa','Chỉ cần cậu đừng kéo quá mạnh.']],()=>{g.storyVision=null;g.phase='explore';toast('ĐÃ MỞ XÍCH NHẬN · PHÍM 3',5)});}}
 for(const node of g.nodes)if(!node.destroyed&&p.x>node.x+115){p.x=node.x+115;if((g.lateHint||0)<g.time){say('Phù Hoa',node.requiredWeapon==='chain'?'Dùng Xích kéo vật cản xuống.':node.requiredWeapon==='spear'?'Thương xuyên lớp phong ấn.':'Kiếm phá đúng điểm nứt.');g.lateHint=g.time+7;}}
 for(const clue of chapter.investigations||[])if(g.phase==='explore'&&!g.storyEvents.has(clue.id)&&Math.abs(p.x-clue.m*64)<105){g.interaction={id:clue.id,label:'E · '+clue.title};if(pressed.has('KeyE')){g.storyEvents.add(clue.id);dialogue(clue.lines,()=>{g.phase='explore'});break;}}
 for(const memory of chapter.memories){if(g.phase!=='explore'||g.memories.has(memory.id)||memory.requiresNode&&!g.nodes.find(n=>n.id===memory.requiresNode)?.destroyed||memory.requiresDual&&(g.dualCount||0)<memory.requiresDual)continue;if(Math.abs(p.x-memory.m*64)<95&&Math.abs((p.y-p.h*.5)-memory.y)<90){g.memories.add(memory.id);save.crystals+=7;g.memoryVision=memory.id;dialogue(memory.lines,()=>{g.memoryVision=null;g.phase='explore'});break;}}
 updateSideStories();
 for(const cache of g.world.salvage||[])if(g.phase==='explore'&&!g.collected.has(cache.id)&&Math.abs(p.x-cache.x)<80){const labelText=g.chapter===7?'E · THU LÕI Ý THỨC':g.chapter===6?'E · THU MẢNH LƯỢNG TỬ':g.chapter===5?'E · THU ẤN QUYẾT TAIXUAN':'E · THU LÕI BĂNG BABYLON';g.interaction={id:cache.id,label:labelText};if(pressed.has('KeyE')){g.collected.add(cache.id);save.materials+=7;save.crystals+=2;if(g.chapter===5)addForgePart(save,'taixuan_script',1);if(g.chapter===6)addForgePart(save,'oblivion_inscription',1);if(g.chapter===7)addForgePart(save,'sentience_prism',1);const found=g.chapter===7?'Một lăng kính giữ lại ý chí phản kháng trước sự hoàn hảo. Đây là vật liệu riêng để nâng Keys of Oblivion.':g.chapter===6?'Một mảnh lượng tử có hai mặt: nửa phản chiếu Senti, nửa phản chiếu Phù Hoa.':g.chapter===5?'Một ấn quyết còn nguyên nét khắc nằm trong bụi thật.':'Một lõi băng chứa dữ liệu lồng ấp chưa bị xóa.';dialogue([['Vật liệu',found],[g.protagonist==='hua'?'Phù Hoa':'Senti','Giữ lại. Nó có thể rèn thành thứ giúp chúng ta chống Mnemosyne.']],()=>{g.phase='explore'});break;}}
 const prompt=$('#interaction-prompt');prompt.hidden=!g.interaction||g.phase==='dialogue';prompt.textContent=g.interaction?.label||'';
}
function drawLateScene(){const id=currentScene().id,t=g.presentationTime,kolosten=['kolosten-storm','kolosten-choice'].includes(id),im=g.chapter===7?sceneSources[9]:g.chapter===4?sceneSources[5]:g.chapter===5?sceneSources[6]:kolosten?sceneSources[8]:sceneSources[7],progress=clamp((g.p.x/64-currentScene().from)/(currentScene().to-currentScene().from),0,1),cropW=im.width*.63,sx=clamp((im.width-cropW)*(progress*.7+({4:.05,5:.15,6:.08,7:.12}[g.chapter]||0)),0,im.width-cropW);ctx.drawImage(im,sx,0,cropW,im.height*.82,0,0,W,490);
 if(g.chapter===4){if(id==='siberia-snow'){ctx.fillStyle='#dcefff22';ctx.fillRect(0,0,W,490);}if(id==='babylon-hall'){ctx.fillStyle='#102a3b88';ctx.fillRect(0,0,W,490);for(let i=0;i<7;i++){const x=((i*190-g.camera*.12)%1400+1400)%1400-90;ctx.fillStyle='#9adcec33';ctx.fillRect(x,95,70,330);ctx.strokeStyle='#bdefff77';ctx.strokeRect(x,95,70,330);}}if(id==='abyss-chain'){ctx.fillStyle='#06102088';ctx.fillRect(0,285,W,205);ctx.strokeStyle='#a7c7df';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(0,120);ctx.quadraticCurveTo(W/2,260,W,105);ctx.stroke();}if(['babylon-core','parvati-lair','parvati'].includes(id)){ctx.fillStyle='#9ee8ff18';ctx.fillRect(0,0,W,490);for(let i=0;i<10;i++){ctx.strokeStyle='#c8f4ff66';ctx.beginPath();ctx.moveTo(i*130,490);ctx.lineTo(i*130+Math.sin(t+i)*25,330);ctx.stroke();}}}
 else if(g.chapter===5){for(let i=0;i<40;i++){const x=((i*89-t*(id==='seven-testimonies'?45:15))%W+W)%W,y=60+(i*57)%400;ctx.fillStyle=i%2?'#d7dde088':'#b6c7bf77';ctx.fillRect(x,y,4,3);}if(id==='seven-testimonies'){ctx.fillStyle='#d9e1de18';ctx.fillRect(0,0,W,245);ctx.fillStyle='#151b2070';ctx.fillRect(0,245,W,245);ctx.strokeStyle='#a9bbb688';for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(i*150,245);ctx.lineTo(i*150+60,490);ctx.stroke();}}if(['silent-night','blade-happened'].includes(id)){ctx.fillStyle='#21182362';ctx.fillRect(0,0,W,490);}if(['taixuan-peak','phantom'].includes(id)){ctx.fillStyle='#b99cac22';ctx.fillRect(0,0,W,490);}ctx.fillStyle='#10171bdd';for(let i=0;i<18;i++){const x=i<9?i*18:W-(i-8)*18,h=34+((i*47)%83)+(id==='blade-happened'?Math.sin(t*2+i)*28:0);ctx.fillRect(x,0,12,h);ctx.beginPath();ctx.arc(x+6,h,6,0,Math.PI*2);ctx.fill();}ctx.strokeStyle='#1a2224aa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,36);for(let x=0;x<=W;x+=72)ctx.lineTo(x,24+Math.sin(x*.021+t*.16)*12);ctx.stroke();}
 else if(g.chapter===7){const perfect=id==='perfect-timeline';ctx.fillStyle=perfect?'#fffdf080':'#3a23543b';ctx.fillRect(0,0,W,490);for(let i=0;i<18;i++){const x=((i*149-t*(perfect?0:24+i%3*8))%1350+1350)%1350-80,y=55+(i*79)%390;ctx.fillStyle=perfect?'#fff7d877':i%2?'#f3b1df88':'#9de9ff77';ctx.fillRect(x,y,perfect?5:3,perfect?18:8);}if(perfect){if(perfectTimelineStatuesArt){ctx.save();ctx.globalAlpha=.88;ctx.imageSmoothingEnabled=true;ctx.drawImage(perfectTimelineStatuesArt,0,0,perfectTimelineStatuesArt.width,perfectTimelineStatuesArt.height,24,132,W-48,335);ctx.restore();}label('ĐÂY KHÔNG PHẢI THIÊN ĐƯỜNG · ĐÂY LÀ MỘT LĂNG MỘ',W/2,118,'#6d5268',13);}if(id==='mnemosyne-throne'||id==='mnemosyne'){ctx.fillStyle='#fff8ea22';ctx.fillRect(0,0,W,490);for(let i=0;i<9;i++){ctx.strokeStyle=i%2?'#fff5c688':'#e688c988';ctx.beginPath();ctx.moveTo(i*145,0);ctx.lineTo(W-i*90,490);ctx.stroke();}}}
 else {const quanta=!kolosten;ctx.fillStyle=quanta?'#28175d45':'#0e1d3d55';ctx.fillRect(0,0,W,490);if(quanta){for(let i=0;i<12;i++){const x=((i*173-t*(18+i%3*7))%1300+1300)%1300-70,y=80+(i*83)%340,r=18+(i%4)*8;ctx.strokeStyle=i%2?'#7ee8ff88':'#c185ff77';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}}else{for(let i=0;i<7;i++){const x=90+i*175+Math.sin(t*1.7+i)*38;ctx.strokeStyle='#94ddff88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-16,85);ctx.lineTo(x+12,138);ctx.lineTo(x-8,220);ctx.stroke();}}if(id==='quanta-collision'){ctx.globalAlpha=.28;ctx.drawImage(sceneSources[6],0,0,sceneSources[6].width,sceneSources[6].height*.82,560,90,610,345);ctx.globalAlpha=1;}if(id==='reunion'||id==='jizo'){const grad=ctx.createLinearGradient(0,0,W,0);grad.addColorStop(0,'#7a43db30');grad.addColorStop(.5,'#d8f5ff12');grad.addColorStop(1,'#63c8ed35');ctx.fillStyle=grad;ctx.fillRect(0,0,W,490);}}
}
function drawCh7Prop(kind,x,y,size=90,alpha=1){const cell={hairpin:0,burnt_notebook:1,burnt_apron:2,sounding_bell:3,illusion_spray:4,error_log:5,memory_zero:6,burnt_noodles:7}[kind];if(cell===undefined||!ch7Artifacts)return false;const sw=ch7Artifacts.width/4,sh=ch7Artifacts.height/2;ctx.save();ctx.globalAlpha*=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(ch7Artifacts,(cell%4)*sw,Math.floor(cell/4)*sh,sw,sh,x-size/2,y-size/2,size,size);ctx.restore();return true;}
function drawCh6Prop(kind,x,y,size=90,alpha=1){const props={lightning_rod:[quantaProps,0,3],memory_core:[quantaProps,1,3],reality_bubble:[quantaProps,2,3],claw_plush:[ch6Keepsakes,0,2],memory_flower:[ch6Keepsakes,1,2]},entry=props[kind];if(!entry||!entry[0])return false;const [im,cell,count]=entry,sw=im.width/count,sh=im.height;ctx.save();ctx.globalAlpha*=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,cell*sw,0,sw,sh,x-size/2,y-size/2,size,size);ctx.restore();return true;}
function drawLateObjects(){if(g.chapter===5){const doorX=5605*64-g.camera;if(doorX>-160&&doorX<W+160){ctx.save();ctx.shadowColor='#d7b58d';ctx.shadowBlur=12;drawInteractableCell(6,doorX,490,168,194,1);ctx.restore();label('SÂN SAU',doorX,278,'#d4ddd7',11);label('E · BẢNG VIỆC VẶT',doorX,306,'#a9cfc5',10);}}
 if(g.chapter===6&&!['kolosten-storm','kolosten-choice'].includes(currentScene().id)){for(let i=0;i<4;i++){const x=((i*340-g.camera*.08)%1450+1450)%1450-90;drawCh6Prop('reality_bubble',x,150+(i%2)*115,86+i%2*28,.46);}}
 if(g.chapter===7)for(const altar of chapter.memoryAltars||[]){if(g.storyEvents.has(altar.id))continue;const x=altar.m*64-g.camera;if(x<-90||x>W+90)continue;drawCh7Prop('memory_zero',x,406,74,.92);label('E · BÀN KÝ ỨC '+altar.chapter,x,353,'#fff0bd',10);}
 for(const n of g.nodes){const x=n.x-g.camera;if(x<-100||x>W+100)continue;ctx.save();ctx.shadowColor=n.destroyed?'transparent':g.chapter===4?'#a8eafb':'#ef9eca';ctx.shadowBlur=14;drawStructure(n,x);ctx.shadowBlur=0;ctx.restore();if(!n.destroyed)label(`${n.requiredWeapon==='chain'?'XÍCH':n.requiredWeapon==='spear'?'THƯƠNG':'KIẾM'} · ${n.id.includes('projector')?'MÁY CHIẾU':n.id==='memory-crate'?'THÙNG KÝ ỨC':'PHONG ẤN'}`,x,340,'#fff0d7',10);}
 if(g.chapter===4&&!save.weapons.includes('chain')){const x=chapter.chainMemory.m*64-g.camera;if(x>-100&&x<W+100){drawCrystal(x,330+Math.sin(g.time*3)*7,48,'#9edcff99');ctx.strokeStyle='#e1f7ff';ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<6;i++)ctx.lineTo(x-65+i*25,300+i%2*42);ctx.stroke();label('E · XÍCH NHẬN',x,245,'#e8fbff',13);}}
 for(const memory of chapter.memories){if(g.memories.has(memory.id)||memory.requiresNode&&!g.nodes.find(n=>n.id===memory.requiresNode)?.destroyed||memory.requiresDual&&(g.dualCount||0)<memory.requiresDual)continue;const x=memory.m*64-g.camera;if(x<-70||x>W+70)continue;drawCrystal(x,memory.y,18,'#ffe0a7');label(memory.requiresDual?'DUAL COMBO ×3 · MẢNH ẨN':'MẢNH KÝ ỨC ẨN',x,memory.y-31,'#fff0bf',10);}
 for(const quest of g.sideStories||[]){if(quest.state==='done'||quest.requiresEvent&&!g.storyEvents.has(quest.requiresEvent))continue;const x=quest.x-g.camera;if(x<-100||x>W+100)continue;if(g.chapter===7)drawCh7Prop(quest.item,x,410,82);else if(g.chapter===6)drawCh6Prop(quest.item,x,410,82);else drawSideQuestItem(quest,x);label(quest.storyOnly?'E · KÝ ỨC PHỤ · '+quest.title:quest.state==='active'?'SIDE STORY · HẠ ĐỘI BẢO VỆ':'E · SIDE STORY · '+quest.title,x,350,quest.state==='active'?'#ffc8e3':'#c9ffec',10);}
 for(const clue of chapter.investigations||[]){if(g.storyEvents.has(clue.id))continue;const x=clue.m*64-g.camera;if(x<-70||x>W+70)continue;if(g.chapter===7)drawCh7Prop(clue.item||'error_log',x,410,58);else drawClueItem(clue,x,68);label('E · '+clue.title,x,350,'#f3e8dc',10);}
}
function drawLateNarrative(){const t=g.presentationTime,ch6=g.chapter===6;if(g.phase!=='dialogue'&&g.speechTime>0&&g.speech){ctx.fillStyle=g.chapter===4?'#102431ed':ch6?'#121b3aed':'#261529ed';ctx.fillRect(195,540,760,86);ctx.fillStyle=g.chapter===4?'#a8e8f5':ch6?'#8acdf4':'#ef9fca';ctx.fillRect(195,540,3,86);wrapNarrative(g.speech.speaker,213,560,720,20,g.chapter===4?'#c9f5ff':ch6?'#ccecff':'#ffc9e4',12);wrapNarrative(g.speech.text,213,586,720,21);}if(g.phase!=='dialogue')return;
 ctx.fillStyle=g.chapter===4?'#091823d9':'#231426d9';ctx.fillRect(0,35,W,435);ctx.fillStyle='#070a12';ctx.fillRect(0,0,W,35);ctx.fillRect(0,470,W,178);const vision=g.storyVision,stage=g.dialogueIndex;
 if(g.chapter===4){for(let i=0;i<55;i++){const x=((i*83-t*110)%W+W)%W,y=55+(i*47)%390;ctx.fillStyle='#e5f7ff9a';ctx.fillRect(x,y,5,2);}if(['incubator','ice','parvati-phase'].includes(vision)){for(let i=0;i<6;i++){ctx.fillStyle='#8edbea33';ctx.fillRect(100+i*180,120,75,290);ctx.strokeStyle='#c9f5ff88';ctx.strokeRect(100+i*180,120,75,290);}}}
 else {for(let i=0;i<35;i++){const x=(i*97+t*(ch6?28:9))%W,y=70+(i*61)%360;ctx.fillStyle=ch6?(i%2?'#8fdcff88':'#c99aff77'):'#f0b1d388';ctx.fillRect(x,y,5,4);}if(['choice','dual','phantom-phase','quanta-alone','memory-collision','nihilius-cameo','reunion'].includes(vision)){ctx.strokeStyle=ch6?'#8fddff77':'#e6a3da88';for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(W/2,100);ctx.lineTo(i*190,450);ctx.stroke();}}}
 if(vision?.startsWith('side-item:')){ctx.fillStyle=g.chapter===4?'#0c2531cc':ch6?'#111d3acc':'#29172dcc';ctx.fillRect(448,135,256,250);ctx.strokeStyle=g.chapter===4?'#b9eff9':ch6?'#9ce8ff':'#f1a9d0';ctx.lineWidth=3;ctx.strokeRect(448,135,256,250);if(g.chapter===7)drawCh7Prop(vision.slice(10),576,275,165);else if(ch6)drawCh6Prop(vision.slice(10),576,275,165);else drawSideItem(vision.slice(10),576,350,170);label('VẬT CHỨNG SIDE STORY',576,178,ch6?'#d9f5ff':g.chapter===4?'#e5fbff':'#ffe4f1',14);}
 if(ch6){if(g.protagonist==='hua'){drawSprite(stage%3===0?'hua.7':'hua.0',555,455,1.55,1);}else{drawSprite(stage%3===0?'idle.7':'idle.5',vision==='reunion'?380:555,455,1.55,1);if(vision==='reunion')drawSprite('hua.0',735,455,1.5,-1);}if(vision==='nihilius-cameo'){ctx.fillStyle='#05060bdc';ctx.beginPath();ctx.moveTo(760,435);ctx.lineTo(810,210);ctx.lineTo(860,435);ctx.closePath();ctx.fill();ctx.strokeStyle='#7663a8';ctx.stroke();}}
 else{drawSprite(stage%3===0?'idle.7':'idle.5',350,455,1.45,1);drawSprite(['assist','dual','parvati-phase'].includes(vision)?'hua.4':'hua.0',760,455,1.4,-1);}
 label((chapter.cutscenes||[]).find(c=>c.visual===vision)?.title||g.arena?.name||chapter.title,W/2,90,g.chapter===4?'#e8fbff':ch6?'#def3ff':'#ffe0f0',18);
}
function drawArcEnemy(e,x,frame){const image=e.kind==='flyer'?flyerArt:machineArt,cell=Math.floor(image.width/6),height=e.kind==='flyer'?98:120,width=e.kind==='flyer'?63:74,y=e.kind==='flyer'?e.y+Math.sin(g.time*7+e.x)*7:e.y;
 ctx.save();ctx.globalAlpha=e.hp<=0?Math.max(0,e.dead/.65):e.hitTime>0?.55:1;ctx.translate(x,y);ctx.scale(e.face===1?-1:1,1);ctx.drawImage(image,frame*cell,0,cell,image.height,-width/2,-height,width,height);ctx.restore();
 if(e.kind==='flyer'&&e.telegraph>0)label('ĐẠN TRÊN KHÔNG',x,e.y-125,'#ffc4e8',10);
}
function drawArcFuHua(player){if(g.huaStrike?.life>0){drawBossFuHua(player);return;}
 const hx=(g.huaPos??player.x-120)-g.camera,face=player.face,step=Math.floor(g.time*9)%4,frame=step===1?'hua.1':step===3?'hua.8':'hua.0';
 if(Math.abs(player.vx)>60)drawSprite('hua.8',hx-face*17,player.y+3,1,face,.12);
 drawSprite(frame,hx,player.y+Math.sin(g.time*13)*3,1,face,.87);
}
function drawBossFuHua(player){
 const action=g.huaEntry?.life>0?g.huaEntry:g.huaStrike?.life>0?g.huaStrike:null;
 if(!action){const hx=(g.huaPos??player.x-100)-g.camera,boss=g.enemies.find(e=>e.ai&&e.hp>0),face=(boss?.x??player.x)>g.huaPos?1:-1;drawSprite(Math.floor(g.time*2)%6===0?'hua.7':'hua.0',hx,player.y+Math.sin(g.time*5)*2,1,face,.9);return;}
 const u=clamp(1-action.life/action.max,0,1),travel=Math.min(1,u/.78),ease=1-(1-travel)**3,worldX=action.from+(action.to-action.from)*ease;
 const hx=worldX-g.camera,hy=player.y-Math.sin(Math.PI*travel)*37,face=action.to>=action.from?1:-1;
 ctx.save();
 if(u<.72)for(let i=3;i>=1;i--)drawSprite('hua.8',hx-face*i*22,hy+i*5,1,face,.09+i*.045);
 const frame=u<.18?'hua.8':u<.39?'hua.1':u<.62?'hua.3':u<.82?'hua.4':'hua.9';
 drawSprite(frame,hx,hy,1.05,face,.98);
 if(u>.48){const tx=action.targetX-g.camera,ty=action.y??player.y-70,burst=Math.min(1,(u-.48)*2.4);ctx.shadowColor='#a8fff2';ctx.shadowBlur=22;ctx.strokeStyle=`rgba(174,255,240,${.8*(1-burst*.6)})`;ctx.lineWidth=5-burst*2;ctx.beginPath();ctx.arc(tx,ty,17+burst*48,-1.2,1.65);ctx.stroke();ctx.shadowBlur=0;for(let i=0;i<9;i++){const angle=i*2.4+g.time*3,r=15+burst*(18+i%3*11);ctx.fillStyle=i%2?'#ecfff5':'#77e9de';ctx.fillRect(tx+Math.cos(angle)*r,ty+Math.sin(angle)*r,5,5);}}
 ctx.restore();
}
function drawStoryOverlay(){
 if(g.parry>0){const x=g.p.x-g.camera+g.p.face*20,y=g.p.y-50,t=g.time;ctx.save();ctx.shadowColor='#b6fff0';ctx.shadowBlur=18;ctx.strokeStyle='#d7fff6';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,53,-1.5,1.5);ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#73d9e8';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x,y,38+i*7,-1.4+t%0.2,1.4+t%0.2);ctx.stroke();}ctx.fillStyle='#ffffff';for(let i=0;i<7;i++){const angle=-1.5+i*.48;ctx.fillRect(x+Math.cos(angle)*56,y+Math.sin(angle)*56,4,4);}ctx.restore();}
 if(g.parryFlash?.life>0){const f=g.parryFlash,x=f.x-g.camera,y=f.y,progress=1-f.life/.5;ctx.save();ctx.globalAlpha=f.life/.5;ctx.strokeStyle='#ddfff6';ctx.lineWidth=7*(1-progress)+1;ctx.shadowColor='#a6fff1';ctx.shadowBlur=24;ctx.beginPath();ctx.arc(x,y,25+progress*100,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#f7b9ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,8+progress*65,0,Math.PI*2);ctx.stroke();if(f.kind==='beam'){const tx=f.target-g.camera;ctx.strokeStyle='#e5fff7';ctx.lineWidth=8*(1-progress)+2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(tx,g.p.y-85);ctx.stroke();}ctx.restore();}
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
$('#new-story').onclick=()=>showJourneys();


// Narrative state follows player actions; this is not a distance-only dialogue track.
function narrativeObjective(){
 if(g.phase==='courtyard')return courtyardObjective(g.courtyard,save);
 if(g.phase==='memory-trial')return memoryTrialObjective(g.memoryTrial);
 if(g.mode==='endless')return `ENDLESS · MỐC NGUYÊN LIỆU ${Math.max(0,Math.ceil(g.nextLootMeter-g.p.x/64))} M · ${g.upgrades} nâng cấp · L né / K phản đòn`;
 const side=(g.sideStories||[]).find(q=>q.state==='active');if(side)return `SIDE STORY · ${side.title} · Hạ ${g.enemies.filter(e=>e.hp>0&&e.sideQuest===side.id).length} hộ vệ còn lại`;
 if(g.chapter===7){if(g.arena?.m===8860){const boss=g.enemies.find(e=>e.ai?.type==='mnemosyne');return boss?mnemosyneGate(boss.ai):'Dọn lính Dọn Dẹp trước khi Mnemosyne giáng xuống';}if(g.arena)return `${g.arena.name} · Đợt ${g.wave}/${g.arena.waves.length}`;if(g.p.x/64>8170&&(g.ch7Altars?.size||0)<3)return `MỞ ÍT NHẤT 3/6 BÀN KÝ ỨC · HIỆN CÓ ${g.ch7Altars?.size||0}`;return currentScene().objective;}
 if(g.chapter===6){if(g.arena?.m===7720){const boss=g.enemies.find(e=>e.ai?.type==='jizo');if(!boss)return 'Dọn hộ vệ ký ức trước khi Jizo xuất hiện';const a=boss.ai;return a.round===1?`JIZO · TURN 1/4 · Giáp ảo ${a.illusionArmor}/3 · Sét ${a.reads.storm}/2 · Kiếm ${a.reads.blades}/2 · Lửa ${a.reads.fire}/2`:a.round===2?a.rodCharged?`JIZO · TURN 2/4 · Cột đã tích điện · Q phá ${3-a.rods}/3`:`JIZO · TURN 2/4 · Dụ thiên lôi vào cột sáng · còn ${a.rods}`:a.round===3?a.coreOpen>0?`JIZO · TURN 3/4 · Xích kéo lõi ${3-a.cores}/3`:`JIZO · TURN 3/4 · K phản Giao Kiếm để mở lõi`:a.open>0?`JIZO · GIÁP ${a.cycle}/3 · Gây đủ ${Math.round(a.windowDamage)}/${a.quota} sát thương`:a.sequenceReady?`JIZO · GIÁP ${a.cycle}/3 · Q Dual Combo`:`JIZO · GIÁP ${a.cycle}/3 · ${{sword:'Kiếm',spear:'Thương',chain:'Xích'}[a.order[a.sequenceStep]]} tiếp theo`;}if(g.arena)return `${g.arena.name} · Đợt ${g.wave}/${g.arena.waves.length}`;if(g.protagonist==='hua')return `${currentScene().objective} · J quyền pháp · K phản · L né`;if(!['reunion','jizo'].includes(currentScene().id))return `${currentScene().objective} · Assist đang mất kết nối`;return currentScene().objective;}
 if(g.chapter===5){if(g.arena){const seven=g.enemies.find(e=>e.ai?.type==='seven-swords'),boss=g.enemies.find(e=>e.ai?.type==='phantom');if(seven)return sevenGate(seven.ai);if(boss)return phantomGate(boss.ai);return `${g.arena.name} · Đợt ${g.wave}/${g.arena.waves.length}`;}const node=g.nodes.find(n=>!n.destroyed&&Math.abs(g.p.x-n.x)<500);if(node)return `${node.requiredWeapon==='spear'?'Thương':node.requiredWeapon==='chain'?'Xích':'Kiếm'} phá phong ấn giả · J tấn công`;if(!save.dualUnlocked&&g.p.x/64>6320)return 'Đến đỉnh Thái Hư · Mở Dual Combo của Senti và Phù Hoa';return currentScene().objective;}
 if(g.chapter===4){if(g.arena?.m===5440){const boss=g.enemies.find(e=>e.ai?.type==='parvati');return boss?`MẠNG ${boss.ai.phase}/2 · ${boss.ai.armor?'Thương phá giáp băng':boss.ai.open>0?'Chém khi nó gục':'Xích chặn cú lăn · né cột băng'}`:'Dọn hộ vệ của lõi Babylon';}if(g.arena)return `${g.arena.name} · Đợt ${g.wave}/${g.arena.waves.length}`;const node=g.nodes.find(n=>!n.destroyed&&Math.abs(g.p.x-n.x)<500);if(node)return `${node.requiredWeapon==='chain'?'Xích':node.requiredWeapon==='spear'?'Thương':'Kiếm'} phá ${node.id.includes('projector')?'máy chiếu ký ức':'vật cản'} · J tấn công`;if(!save.weapons.includes('chain')&&g.p.x/64>4840)return 'Tới vực sâu · Nhận Xích Nhận bằng E';return currentScene().objective;}
 if(g.chapter===3){if(g.arena?.m===4300){const boss=g.enemies.find(e=>e.ai?.type==='heimdall');return boss?`MẠNG ${boss.ai.phase}/2 · ${boss.ai.shield?'Thương phá khiên':boss.ai.open>0?'J chém lõi đang mở':'K tự chuyển Kiếm để phản cú đâm · Q ngắt liên hoàn'} · Space/S/L né đòn`:'Dọn hộ vệ trước Heimdall';}if(g.arena)return `${g.arena.name} · Đợt ${g.wave}/${g.arena.waves.length}`;const node=g.nodes.find(n=>!n.destroyed&&Math.abs(g.p.x-n.x)<500);if(node)return `${node.requiredWeapon==='spear'?'Thương':'Kiếm'} phá ${node.id==='glass-wall'?'kính nứt':node.id==='coolant-pipe'?'ống nước':'tường cách ly'} · J tấn công`;return currentScene().objective;}
 if(g.chapter===2){if(g.arena?.m===3200){const boss=g.enemies.find(e=>e.ai?.type==='chariot');return boss?`MẠNG ${boss.ai.phase}/2 · ${boss.ai.pylons.some(p=>!p.down)?'Tắt 3 trụ: Kiếm đỏ · L tím · Thương xanh':boss.ai.plates?'Thương phá giáp':'Kiếm K phản cú lao để mở lõi'} · S trượt dưới tia`:'Dọn lính phụ trước khi đối mặt Chariot';}if(g.arena)return `${g.arena.name} · Đợt ${g.wave}/${g.arena.waves.length}`;if(!g.nodes.find(n=>n.id==='neon-sign')?.destroyed&&g.p.x/64>2350&&g.p.x/64<2420)return 'Chém bảng hiệu bánh bao bị nhiễu để thoát vòng lặp';if(!save.weapons.includes('spear')&&g.p.x/64>2460)return 'Bắt lấy Thương ký ức · E tương tác';return currentScene().objective;}
 if(!save.weapons.length)return 'Tìm thứ còn chạm được · Đến khối ký ức và nhấn E';
 if(g.arena?.loop&&!g.nodes[0].destroyed)return g.loopCount?'Đèn sáng đúng lúc Phù Hoa bị kéo trở lại · Phá nút trên cột đèn':'Phù Hoa bị vây · Đánh lui quái để đến chỗ cô ấy';
 if(g.arena?.loop)return 'Vòng lặp đã đứt · Dọn đường cho Phù Hoa thoát ra';
 if(g.arena?.m===2000)return g.phase==='dialogue'?'Một câu hỏi chưa bao giờ nghĩ sẽ nghe': 'Giữ lối ra · Nagazora Husk đang chặn đường Phù Hoa';
 if(g.arena?.m===1700)return 'Bảo vệ đường thoát · Không để Phù Hoa bị kéo trở lại';
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
 for(const cache of g.world.salvage||[]){if(g.collected.has(cache.id)||Math.abs(p.x-cache.x)>85||g.phase!=='explore')continue;g.interaction={id:cache.id,label:'E · THU GOM CUỘN MẠCH NAMIKO'};if(pressed.has('KeyE')){g.collected.add(cache.id);save.materials+=4;save.crystals+=3;addForgePart(save,'namiko_coil',2);dialogue([['Dấu vết cũ','Trong thùng có hai cuộn mạch xanh khắc mã CAS-II. Chúng không phải Tinh thể ký ức thường; chỉ bộ phát xung Namiko dùng đúng lõi này.'],['Senti','Thứ này hợp với bản thiết kế ở trạm cứu hộ. Gom đủ rồi ta lắp lại.'],['Vật liệu','Nhận 2 Cuộn mạch Namiko, 4 Hợp kim và 3 Tinh thể. Cần 4 cuộn mạch để rèn CAS-II Namiko.']],()=>{g.phase='explore'});}}
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
 else label('CÔ ẤY ĐÃ NGHE THẤY BẠN',x,355,'#b5ded4',11);
 ctx.restore();
}
function drawNarrative(){
 const t=g.presentationTime,p=g.p;
 if(g.chapter>=4){drawLateNarrative();return;}
 if(g.chapter===3){drawLabNarrative();return;}
 if(g.chapter===2){drawArcNarrative();return;}
 for(const bolt of g.projectiles){const x=bolt.x-g.camera;drawSprite('loot.4',x,bolt.y+10,.33,bolt.vx>0?1:-1);ctx.strokeStyle='#ed9edb';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,bolt.y);ctx.lineTo(x-Math.sign(bolt.vx)*28,bolt.y);ctx.stroke();}
 for(const roof of g.world.platforms){if(roof.crack>0&&!roof.destroyed){const x=roof.x-g.camera;ctx.strokeStyle='#ffb991';ctx.beginPath();ctx.moveTo(x+10,roof.y);ctx.lineTo(x+roof.w*.5,roof.y+15);ctx.lineTo(x+roof.w-5,roof.y+3);ctx.stroke();label('MÁI ĐANG VỠ',x+roof.w/2,roof.y-18,'#ffc9a5',10);}}
 if(g.mode!=='story')return;
 if(currentScene().id==='roofs'&&g.p.x/64>705&&g.p.x/64<745){const ex=850-(g.p.x/64-705)*10;drawSprite('hua.0',ex,300,1.05,1,.5+Math.sin(t*8)*.15);}
 if(['escape','husk'].includes(currentScene().id)&&g.nodes[0]?.destroyed&&g.phase!=='dialogue'&&!(g.arena?.m===2000&&g.huaJoin)){drawSprite(Math.floor(t*3)%7===0?'hua.8':'hua.0',g.p.x-g.camera-110,490+Math.sin(t*5)*2,1,1,.55+.1*g.nodes.filter(n=>n.destroyed).length);}
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
 }else if(g.arena?.m===2000&&!g.memories.has('main-1')){
  cinematicBackdrop(3);ctx.fillStyle='#19112688';ctx.fillRect(0,35,W,435);drawSprite('idle.5',345,460,1.45,1);drawSprite(stage>=3?'hua.7':Math.floor(t*2)%5===0?'hua.2':'hua.0',185,460+Math.sin(t*4)*2,1.2,1,.75);for(let i=0;i<12;i++){const angle=i*Math.PI/6+t*.25,r=stage<3?130+Math.sin(t+i)*25:85;drawCrystal(825+Math.cos(angle)*r,270+Math.sin(angle)*r,9,'#dba2f5aa');}ctx.save();ctx.translate(805,467);ctx.scale(1.4,1.4);drawStoryEnemy({kind:'boss',y:0,hp:1,face:-1,telegraph:stage>=3?1:0},0);ctx.restore();label(stage<3?'NHỮNG MẢNH KÝ ỨC ĐANG HỘI TỤ':'NAGAZORA HUSK · NGƯỜI CANH VÒNG LẶP',W/2,112,'#e6b2cf',19);
 }else if(g.arena?.loop&&g.rescueState==='failed'){
  cinematicBackdrop(2);ctx.fillStyle='#24152e88';ctx.fillRect(0,35,W,435);drawSprite('idle.5',520,455,1.6,1,.75);drawSprite('hua.0',650+(stage>=2?Math.sin(t*20)*5:0),455,1.6,-1,stage>=2?.35:1);if(stage>=2){for(let i=0;i<5;i++){ctx.fillStyle='#ecc5ff55';ctx.fillRect(585,300+i*24,150,3);}label('LAI LỊCH ĐANG BỊ VIẾT ĐÈ',W/2,120,'#dfa5de',17);}
 }else if(g.arena?.m===2000&&g.memories.has('main-1')&&stage<11){
  cinematicBackdrop(3);ctx.fillStyle=stage>=2?'#10121a99':'#10121a55';ctx.fillRect(0,35,W,435);drawSprite('idle.5',450,455,1.65,1);drawSprite(stage>=5?'hua.2':Math.floor(t*2)%5===0?'hua.1':'hua.0',725,455+Math.sin(t*4)*2,1.65,-1);if(stage===2||stage===3){ctx.fillStyle='#08091288';ctx.fillRect(0,35,W,100);label('...',W/2,195,'#d7cfca',30);}
  if(stage>=5&&stage<=7){ctx.fillStyle='#d9c7b52a';ctx.fillRect(300,150,560,260);label('MỘT BÀN TAY ĐƯA RA GIỮA ĐỔ NÁT',W/2,155,'#e2c9a6',15);}
 }
}
function drawArcNarrative(){const t=g.presentationTime,p=g.p;
 if(g.phase!=='dialogue'&&g.speechTime>0&&g.speech){ctx.fillStyle='#111425e8';ctx.fillRect(195,540,760,86);ctx.fillStyle='#94c5da';ctx.fillRect(195,540,2,86);wrapNarrative(g.speech.speaker,213,560,720,20,'#b9e4f2',12);wrapNarrative(g.speech.text,213,586,720,21);}
 if(g.phase!=='dialogue')return;ctx.fillStyle='#090d1acc';ctx.fillRect(0,0,W,35);ctx.fillRect(0,470,W,178);
 if(g.storyVision){
  const vision=g.storyVision,stage=g.dialogueIndex;ctx.fillStyle=vision==='archive'?'#071d2bd8':vision==='loop'?'#1e1029d9':'#10172bd2';ctx.fillRect(0,35,W,435);
  if(vision==='rooftop'||vision==='train')for(let i=0;i<65;i++){const x=(i*87-t*(vision==='train'?350:115))%W,y=54+i*47%385;ctx.strokeStyle=vision==='train'?'#b4d7f87d':'#a0c5ef83';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-13,y+27);ctx.stroke();}
  if(vision==='loop'){for(let i=0;i<4;i++){ctx.strokeStyle=i%2?'#f39ad6':'#87daee';ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=18;ctx.strokeRect(115+i*240,120,145,165);ctx.shadowBlur=0;label(i%2?'BÁNH BAO':'F.H.',185+i*240,205,'#edcef0',14);}ctx.fillStyle='#efa4d450';ctx.fillRect(420,266,305,24);label('NGƯỜI ĐI CÙNG: [KHÔNG XÁC ĐỊNH]',W/2,304,'#ffdbe9',15);}
  if(vision==='spear'){ctx.strokeStyle='#e7bdc6';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(569,163);ctx.lineTo(633,440);ctx.stroke();ctx.fillStyle='#e36b91';ctx.beginPath();ctx.moveTo(569,135);ctx.lineTo(552,187);ctx.lineTo(584,180);ctx.closePath();ctx.fill();for(let i=0;i<13;i++){ctx.fillStyle='#eea5c456';ctx.fillRect(550+Math.sin(t*2+i)*85,110+i*23,4,8);}}
  if(vision==='archive'||vision==='train'){ctx.fillStyle='#101b30';ctx.fillRect(355,122,438,224);ctx.strokeStyle=vision==='archive'?'#79d4d5':'#f39bbb';ctx.lineWidth=4;ctx.strokeRect(355,122,438,224);for(let i=0;i<9;i++){ctx.fillStyle=i===4?'#e799b1':'#80cbd1';ctx.fillRect(388,154+i*19,240+i%3*38,4);}label(vision==='archive'?'MẪU F.H. · MNEMOSYNE':'ĐÍCH ĐẾN: HELHEIM LABS',W/2,291,vision==='archive'?'#b7f2ec':'#ffd4e6',15);}
  if(vision==='chariot-phase'){ctx.fillStyle='#57214488';ctx.fillRect(0,35,W,435);ctx.save();ctx.globalAlpha=.82;ctx.drawImage(chariotArt,3,95,354,605,493,172,166,282);ctx.restore();for(let i=0;i<7;i++){ctx.strokeStyle=i%2?'#ff8cc8':'#b9f4fa';ctx.beginPath();ctx.arc(576,304,95+i*12,1.8,5.6);ctx.stroke();}label('DỮ LIỆU ĐANG TÁI CẤU TRÚC',W/2,135,'#ffd9e9',19);}
  drawSprite(stage%4===0?'idle.7':'idle.5',vision==='archive'?280:340,459,1.38,1);drawSprite(stage%3===0?'hua.7':'hua.0',vision==='archive'?875:805,459+Math.sin(t*3)*2,1.38,-1);label((chapter.cutscenes||[]).find(s=>s.visual===vision)?.title||'CHẶNG CUỐI ARC CITY',W/2,91,'#f3dcce',18);
 }
 else if(g.memoryVision){ctx.fillStyle='#19162aa9';ctx.fillRect(0,35,W,435);drawSprite('idle.5',390,456,1.55,1);drawSprite(Math.floor(t*3)%5===0?'hua.1':'hua.0',745,456+Math.sin(t*4)*3,1.55,-1);label(g.memoryVision==='hidden-3'?'MỘT NỤ CƯỜI KHÔNG AI THẤY':'BUỔI TẬP TRÊN TÀU',W/2,133,'#f2d5bd',17);}
 else if(g.arena?.m===3200&&g.memories.has('main-2')){ctx.fillStyle='#101528d6';ctx.fillRect(0,35,W,435);for(let i=0;i<12;i++){ctx.fillStyle='#8fa9c61c';ctx.fillRect(i*103,100,2,330);}drawSprite('hua.0',650,457,1.45,-1,.85);ctx.fillStyle='#dce7f3';label('...TA ĐÃ SỐNG BAO LÂU RỒI?',W/2,165,'#d9e8f5',19);}
 else {ctx.fillStyle='#10182778';ctx.fillRect(0,35,W,435);drawSprite('idle.5',395,458,1.45,1);drawSprite(Math.floor(t*3)%6===0?'hua.7':'hua.0',730,458+Math.sin(t*5)*3,1.4,-1);if(g.arena?.m===3200)label('GIÁP ẢO · KÝ ỨC BỊ VIẾT LẠI',W/2,140,'#ffccdf',17);}
}
function showUpgrade(){g.phase='upgrade';keys.clear();$('#upgrade-panel').hidden=false;}
$$('[data-run-upgrade]').forEach(b=>b.onclick=()=>{if(!g||g.mode!=='endless'||g.phase!=='upgrade')return;const type=b.dataset.runUpgrade;if(type==='power')g.runBuff+=.15;if(type==='heal')g.hp=Math.min(maxHP(),g.hp+maxHP()*.35);if(type==='guard')g.p.invuln=8;g.upgrades++;g.nextUpgrade+=30;g.phase='explore';$('#upgrade-panel').hidden=true;keys.clear();pressed.clear();});
$('#checkpoint-gear').onclick=()=>{if(!g||g.mode!=='story')return;save=structuredClone(committed);gear()};


let ambience;
function updateAmbience(){
 const active=screen==='play'&&g&&!['paused','finished','dying'].includes(g.phase),taixuanSilence=g?.enemies?.some(e=>e.hp>0&&e.ai?.type==='seven-swords'&&e.ai.encounter==='branch-b'),phantomSilence=(g?.phantomDesaturation||0)>=.95,silence=g?.phase==='dialogue'&&g.arena?.m===2000&&g.memories.has('main-1')&&g.dialogueIndex>=2&&g.dialogueIndex<=4||taixuanSilence||phantomSilence;
 gameAudio.update({enabled:!!active&&g.mode==='story',muted,silence,dialogue:g?.phase==='dialogue',battle:g?.mode==='story'&&g?.phase==='arena'});
 if(active&&phantomSilence&&(g.systemBeepAt||0)<g.time){g.systemBeepAt=g.time+.82;tone(560,.055,'square',.025);}
 if(!audio)return;if(!gameAudio.music&&gameAudio.manifest)gameAudio.unlock(audio);if(g?.mode==='story'){if(ambience)ambience.bus.gain.setTargetAtTime(0,audio.currentTime,.3);return;}
 if(!ambience){const bus=audio.createGain();bus.gain.value=0;bus.connect(audio.destination);const voices=[0,1,2,3].map(()=>{const o=audio.createOscillator(),v=audio.createGain();o.type='sine';v.gain.value=.045;o.connect(v).connect(bus);o.start();return o});ambience={bus,voices,key:''};}
 const synthActive=!muted&&screen==='play'&&g&&!['paused','finished'].includes(g.phase);
 ambience.bus.gain.setTargetAtTime(synthActive&&!silence?.3:0,audio.currentTime,.5);
 if(!synthActive)return;const scene=g.mode==='endless'?'endless':currentScene().id,key=g.phase==='arena'?'battle':scene;
 if(ambience.key!==key){ambience.key=key;const chord=key==='battle'?[98,130.81,146.83,196]:key==='loop'?[110,130.81,164.81,220]:key==='escape'?[103.83,138.59,155.56,207.65]:[130.81,155.56,196,261.63];ambience.voices.forEach((o,i)=>o.frequency.setTargetAtTime(chord[i],audio.currentTime,1.2));}
}

function cinematicBackdrop(cell){const cw=sceneAtlas.width/2,ch=sceneAtlas.height/2;ctx.drawImage(sceneAtlas,(cell%2)*cw,Math.floor(cell/2)*ch,cw,ch,0,35,W,435);}

function weaponSkill(){if(!g||g.protagonist==='hua'||save.equippedCore!=='cas_ii_namiko'||(g.weaponSkillCD||0)>0||!['explore','arena'].includes(g.phase))return;g.weaponSkillCD=10;const p=g.p;for(const e of g.enemies)if(e.hp>0&&(e.x-p.x)*p.face>0&&Math.abs(e.x-p.x)<550)hitEnemy(e,Math.round(stats(save).atk*4.5),'weapon-skill');spark(p.x+p.face*120,p.y-45,'#b9d7ff',30);tone(145,.3,'triangle');toast('WANDER · SÓNG XUNG KÍCH',1.5);}

function showJourneys(){openJourneys(()=>{g=null;save=sanitizeSave(readSave(localStorage))||ensureGear(newSave());committed=structuredClone(save);switchScreen('home');syncHome()});}
$('#audio-settings').onclick=()=>{const resume=screen==='play'&&g&&['explore','arena'].includes(g.phase);if(resume)pause();const dialog=openAudioSettings(gameAudio);dialog.addEventListener('close',()=>{if(resume&&g?.phase==='paused')pause();},{once:true});};


const DIALOGUE_SWORD_PORTRAITS=new Map([
 ['Lâm Triều Vũ',0],['Tô My',1],['Giang Uyển Hề',2],['Giang Uyển Như',3],
 ['Trình Lăng Sương',4],['Mã Ngạn Khanh',5],['Tần Tố Y',6]
]);
function portraitBackdrop(target,color='#d8b889'){
 const glow=target.createRadialGradient(90,82,12,90,82,88);glow.addColorStop(0,color+'50');glow.addColorStop(1,'#080b1700');target.fillStyle=glow;target.fillRect(0,0,180,170);
 target.strokeStyle=color+'55';target.lineWidth=1;target.beginPath();target.arc(90,88,65,0,Math.PI*2);target.stroke();
}
function drawPortraitCell(target,image,frame=0,{cols=3,rows=2,padX=.06,padTop=.01,padBottom=.01,alpha=1}={}){
 if(!image?.width)return false;const cellW=image.width/cols,cellH=image.height/rows,col=frame%cols,row=Math.floor(frame/cols),sx=col*cellW+cellW*padX,sy=row*cellH+cellH*padTop,sw=cellW*(1-padX*2),sh=cellH*(1-padTop-padBottom),scale=Math.min(168/sw,164/sh),dw=sw*scale,dh=sh*scale;
 target.save();target.globalAlpha=alpha;target.imageSmoothingEnabled=true;target.imageSmoothingQuality='high';target.drawImage(image,sx,sy,sw,sh,90-dw/2,168-dh,dw,dh);target.restore();return true;
}
function drawEvidencePortrait(target,speaker){
 const text=(speaker||'').toLowerCase();let frame=0;if(text.includes('giấy')||text.includes('nhật ký'))frame=4;else if(text.includes('bia'))frame=5;else if(text.includes('ký ức'))frame=8;else if(text.includes('vật liệu'))frame=6;else if(text.includes('album'))frame=9;else if(text.includes('dấu vết'))frame=1;portraitBackdrop(target,'#77dce6');drawPortraitCell(target,storyCollectibleArt,frame,{cols:5,rows:2,padX:.03});return `evidence-${frame}`;
}
function drawDialoguePortrait(speaker,target){
 const sword=DIALOGUE_SWORD_PORTRAITS.get(speaker);
 if(sword!==undefined){portraitBackdrop(target,'#e0bc84');drawPortraitCell(target,sevenSwordsCombatArt?.[sword],0,{padX:.055,padTop:.01});return `seven-sword-${sword+1}`;}
 if(['Phù Hoa','Fu Hua','Fu Hua · Vọng ảnh'].includes(speaker)){portraitBackdrop(target,'#8de2df');drawSprite('hua.0',90,155,1.5,1,speaker==='Fu Hua · Vọng ảnh'?.78:1,target);return 'fu-hua';}
 if(['Senti','HoS','Herrscher of Sentience'].includes(speaker)){portraitBackdrop(target,'#e7a36f');drawSprite('idle.7',90,155,1.5,1,1,target);return 'senti';}
 if(speaker==='Nagazora Husk'){portraitBackdrop(target,'#d36ce3');drawPortraitCell(target,huskArt,0,{padX:.015});return 'nagazora-husk';}
 if(['Mnemosyne','Giọng nói lạ'].includes(speaker)){portraitBackdrop(target,'#d8b6ff');drawPortraitCell(target,mnemosyneArt,0,{padX:.015,alpha:speaker==='Giọng nói lạ'?.7:1});return 'mnemosyne';}
 if(['Hư Ảnh Phù Hoa','Hư Ảnh Fu Hua','Kẻ Sư Phụ Hoàn Hảo'].includes(speaker)){portraitBackdrop(target,'#d5dbe7');drawPortraitCell(target,phantomCombatArt?.[0],0,{padX:.04});return 'phantom-hua';}
 return drawEvidencePortrait(target,speaker);
}
if(QA)window.__qaPortrait=speaker=>{const canvas=document.createElement('canvas');canvas.width=180;canvas.height=170;const target=canvas.getContext('2d');const kind=drawDialoguePortrait(speaker,target);const pixels=target.getImageData(0,0,180,170).data;let painted=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>8)painted++;return {speaker,kind,painted};};
if(QA)window.__qaStartChapterFiveBowl=()=>{const quest=chapterFive.sideStories.find(side=>side.trial==='bowls');$('#dialogue').hidden=true;enterMemoryTrial(quest);render();return window.__qa.snapshot()};
if(QA)window.__qaStartArena=(m,wave=1)=>{const event=chapter.arenas.find(a=>a.m===m);if(!event)throw Error('Unknown arena '+m);g.arena={...event,x:event.m*64};g.wave=wave-1;g.enemies=[];g.phase='arena';g.p.x=g.arena.x+210;g.p.y=chapter.physics.groundY;g.p.vx=g.p.vy=0;g.camera=g.arena.x-230;$('#dialogue').hidden=true;spawnWave();render();return window.__qa.snapshot()};










