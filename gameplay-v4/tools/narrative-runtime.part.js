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
 for(const beat of chapter.beats||[]){if(m<beat.m||g.storyEvents.has(beat.id))continue;g.storyEvents.add(beat.id);say(beat.speaker,beat.text);}
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
  ctx.fillStyle='#24152e88';ctx.fillRect(0,35,W,435);drawSprite('idle.5',520,455,1.6,1,.75);drawSprite('hua.0',650+(stage>=2?Math.sin(t*20)*5:0),455,1.6,-1,stage>=2?.35:1);if(stage>=2){for(let i=0;i<5;i++){ctx.fillStyle='#ecc5ff55';ctx.fillRect(585,300+i*24,150,3);}label('LAI LỊCH ĐANG BỊ VIẾT ĐÈ',W/2,120,'#dfa5de',17);}
 }else if(g.arena?.m===2000&&g.memories.has('main-1')&&stage<11){
  ctx.fillStyle=stage>=2?'#10121a99':'#10121a55';ctx.fillRect(0,35,W,435);drawSprite('idle.5',450,455,1.65,1);drawSprite('hua.0',725,455,1.65,-1);if(stage===2||stage===3){ctx.fillStyle='#08091288';ctx.fillRect(0,35,W,100);label('...',W/2,195,'#d7cfca',30);}
  if(stage>=5&&stage<=7){ctx.fillStyle='#d9c7b52a';ctx.fillRect(300,150,560,260);label('MỘT BÀN TAY ĐƯA RA GIỮA ĐỔ NÁT',W/2,155,'#e2c9a6',15);}
 }
}
function showUpgrade(){g.phase='upgrade';keys.clear();$('#upgrade-panel').hidden=false;}
$$('[data-run-upgrade]').forEach(b=>b.onclick=()=>{if(!g||g.mode!=='endless'||g.phase!=='upgrade')return;const type=b.dataset.runUpgrade;if(type==='power')g.runBuff+=.15;if(type==='heal')g.hp=Math.min(maxHP(),g.hp+maxHP()*.35);if(type==='guard')g.p.invuln=8;g.upgrades++;g.nextUpgrade+=30;g.phase='explore';$('#upgrade-panel').hidden=true;keys.clear();pressed.clear();});
$('#checkpoint-gear').onclick=()=>{if(!g||g.mode!=='story')return;save=structuredClone(committed);gear()};
