const DATA={
 'branch-a':{name:'BÓNG TỐI PHẢN BỘI',subtitle:'LÂM TRIỀU VŨ × MÃ NGẠN KHANH',hp:1480,sprites:[0,5],color:'#efb27d'},
 'branch-b':{name:'SỰ IM LẶNG CỦA CĂN BỆNH',subtitle:'GIANG UYỂN HỀ × GIANG UYỂN NHƯ',hp:1520,sprites:[2,3],color:'#9fdcf0'},
 'branch-c':{name:'TUYỆT ĐỐI HỌC HỎI',subtitle:'TÔ MY × TRÌNH LĂNG SƯƠNG',hp:1680,sprites:[1,4],color:'#d9a5e8'},
 formation:{name:'THẤT KIẾM TRẬN',subtitle:'THỬ THÁCH PHÁ TRẬN',hp:1000,sprites:[0,1,2,3,4,5,6],color:'#d68eaa'}
};
const clamp01=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp01(v);return v*v*(3-2*v);};

export function initSevenSwords(e,encounter='formation'){
 const cfg=DATA[encounter]||DATA.formation;e.w=104;e.h=150;e.hp=e.maxHP=cfg.hp;
 e.ai={type:'seven-swords',encounter,cfg,state:'rest',t:.85,turn:0,move:'slash',target:0,dir:-1,hit:false,open:0,
  light:encounter==='branch-a'?.18:1,reveal:0,armor:encounter==='branch-a'?3:0,bell:encounter==='branch-b'?3:0,silent:encounter==='branch-b'?99:0,
  lastWeapon:null,rotation:new Set(),repeatPunish:0,inputLock:null,sheathePrompt:false,sheathed:false,
  formationRound:encounter==='formation'?1:0,formationEvades:0,formationAnchors:3,memorySeals:3,
  breakGauge:0,pendingRound:0,assistReady:false,assistHit:false,handDir:1,attackIndex:0};
 return e;
}

function stagger(a,time=2.6){a.open=Math.max(a.open,time);a.state='stagger';a.t=Math.max(a.t,1.05);}
function punish(a){a.repeatPunish=Math.max(a.repeatPunish,1);}

export function sevenSwordsDamage(e,amount,type){
 const a=e.ai;if(a.state==='transition'||a.state==='sheathe')return 0;
 if(a.encounter==='branch-a'){
  if(a.armor>0){
   if(type==='spear'&&a.reveal>0&&a.light>=.72){a.armor--;a.reveal=Math.max(a.reveal,.8);if(a.armor===0)stagger(a,4);}
   else if(!['assist','dual'].includes(type))punish(a);
   return 0;
  }
  if(a.open<=0)return 0;
 }
 if(a.encounter==='branch-b'){
  if(a.bell>0){if(type==='chain'){a.bell--;if(a.bell===0)stagger(a,99);}else if(!['assist','dual'].includes(type))punish(a);return 0;}
 }
 if(a.encounter==='branch-c'){
  if(!['sword','spear','chain'].includes(type))return 0;
  if(type===a.lastWeapon){punish(a);a.rotation.clear();return 0;}
  a.lastWeapon=type;a.rotation.add(type);
  if(a.open<=0){if(a.rotation.size===3){a.rotation.clear();stagger(a,3.3);}return 0;}
  const floor=e.maxHP*.3;if(e.hp-amount<=floor)return Math.max(0,e.hp-floor);
 }
 if(a.encounter==='formation'){
  if(a.formationRound===1)return 0;
  if(a.formationRound===2){if(type==='spear'&&a.formationAnchors>0){a.formationAnchors--;a.breakGauge=.34+(3-a.formationAnchors)*.11;if(a.formationAnchors===0)a.pendingRound=3;}return 0;}
  if(a.formationRound===3){
   if(type==='chain'&&a.memorySeals>0){a.memorySeals--;a.breakGauge=.67+(3-a.memorySeals)*.1;if(a.memorySeals===0)a.assistReady=true;}
   if(!a.assistHit||type!=='dual')return 0;
   return e.hp;
  }
 }
 return amount;
}

export function interruptSevenSwords(e){
 const a=e.ai;if(!a||e.hp<=0||a.encounter!=='formation'||a.formationRound!==3||!a.assistReady)return false;
 a.assistHit=true;a.breakGauge=1;stagger(a,5);return true;
}

function nextRound(a,round,api){
 a.pendingRound=0;a.formationRound=round;a.state='transition';a.t=1.35;a.hit=false;a.open=0;a.attackIndex=0;
 if(round===2){a.formationAnchors=3;a.handDir=1;}if(round===3){a.memorySeals=3;a.assistReady=false;a.assistHit=false;}api.roundChange(round);
}

export function updateSevenSwords(e,g,dt,api){
 const a=e.ai,p=g.p,record=g.sevenSwordsRecord??={branches:[],maxRound:0,parries:0,formationEvades:0,sheathed:false};
 a.t-=dt;a.open=Math.max(0,a.open-dt);a.reveal=Math.max(0,a.reveal-dt);e.telegraph=0;e.attackTimer=0;e.knock=0;
 if(a.encounter==='branch-b')a.silent=99;
 if(a.repeatPunish>0){a.repeatPunish=0;api.damage(a.encounter==='branch-c'?310:245,e.x);api.punish?.(a.encounter);}
 if(a.encounter==='branch-c'){
  const lockCycle=Math.floor(g.time/3)%3;a.inputLock=lockCycle===0?'dash':lockCycle===1?'weapon':null;api.lock?.(a.inputLock);
  if(e.hp<=e.maxHP*.3&&!a.sheathePrompt){a.sheathePrompt=true;a.state='sheathe';a.t=999;api.sheathePrompt?.();}
  if(a.state==='sheathe'){
   if(api.sheatheRequested?.()){a.sheathed=true;record.sheathed=true;record.branches=[...new Set([...record.branches,'branch-c'])];e.hp=0;e.dead=.85;api.sheatheComplete?.();}
   return;
  }
 }
 if(a.encounter==='formation'&&a.pendingRound){nextRound(a,a.pendingRound,api);record.maxRound=Math.max(record.maxRound,a.formationRound);return;}
 if(a.state==='transition'){if(a.t<=0){a.state='rest';a.t=.45;}return;}
 if(a.state==='stagger'){if(a.t<=0){a.state='rest';a.t=.55;}return;}
 if(a.state==='tell'){
  e.telegraph=Math.max(.01,a.t);
  if(a.encounter==='branch-c'&&a.inputLock==='weapon'&&a.move==='copy')a.move='qi';
  if(a.t<=0){a.state='attack';a.t=a.encounter==='formation'?1.02:.72;a.hit=false;a.target=p.x;a.dir=p.x<e.x?-1:1;}return;
 }
 if(a.state==='attack'){
  e.attackTimer=Math.max(.01,a.t);const near=Math.abs(p.x-e.x)<185;
  if(!a.hit&&a.t<(a.encounter==='formation'?.42:.28)){
   a.hit=true;
   if(a.encounter==='branch-a'){
    if(a.move==='triều-vũ'&&near&&g.parry>0&&api.weapon()==='sword'){
     g.parry=0;a.light=Math.min(1,a.light+.29);a.reveal=2.8;if(a.armor===0)stagger(a,4);record.parries++;api.parry(e.x,a.light);
    }else if(a.move==='ngạn-khanh'&&a.light<.72&&Math.abs(p.x-a.target)<145&&g.dash<=0)api.damage(270,a.target);
    else if(near&&g.dash<=0)api.damage(235,e.x);
   }else if(a.encounter==='branch-b'){
    if(a.move==='arrow'){const avoided=Math.abs(p.x-a.target)>92||g.dash>0;if(!avoided)api.damage(265,a.target);else api.evade?.('arrow');}
    else if(near&&g.dash<=0)api.damage(230,e.x);
   }else if(a.encounter==='branch-c'){
    if(a.move==='qi'){if(Math.abs(p.x-a.target)<150&&g.dash<=0)api.damage(285,a.target);}
    else if(near&&g.dash<=0)api.damage(260,e.x);
   }else{
    const round=a.formationRound;
    if(round===1){
     const seventh=a.attackIndex===7;
     if(seventh){
      if(near&&g.parry>0&&api.weapon()==='sword'){g.parry=0;a.breakGauge=.34;a.pendingRound=2;record.parries++;api.parry(e.x,a.breakGauge);}
      else{a.attackIndex=0;a.formationEvades=0;api.damage(315,e.x);api.resetFormation?.();}
     }else{
      const avoided=a.move==='wave'?p.y<440||g.dash>0:Math.abs(p.x-a.target)>105||g.dash>0;
      if(avoided){a.formationEvades++;record.formationEvades=Math.max(record.formationEvades,a.formationEvades);api.evade(a.formationEvades,a.move);}
      else{a.attackIndex=0;a.formationEvades=0;api.damage(285,p.x);api.resetFormation?.();}
     }
    }else if(round===2){if(Math.abs(p.x-a.target)<125&&g.dash<=0)api.damage(275,a.target);}
    else if(near||Math.abs(p.x-a.target)<135)api.damage(295,p.x);
   }
   api.impact(p.x,g.chapterGround,a.encounter==='formation'?'#c58fab':a.cfg.color,26);
  }
  if(a.t<=0){a.state='rest';a.t=.38;}return;
 }
 if(a.t<=0){
  a.state='tell';a.target=p.x;
  if(a.encounter==='branch-a'){a.move=a.turn++%3===2?'ngạn-khanh':'triều-vũ';a.t=.76;}
  else if(a.encounter==='branch-b'){a.move=a.turn++%3?'arrow':'bell';a.t=.86;}
  else if(a.encounter==='branch-c'){a.move=a.turn++%3===2?'qi':'copy';a.t=.72;}
  else if(a.formationRound===1){a.attackIndex++;a.move=a.attackIndex===7?'seventh':a.attackIndex%2?'dash':'wave';a.t=a.attackIndex===7?.92:.66;}
  else if(a.formationRound===2){a.handDir*=-1;e.x=g.arena.x+(a.handDir>0?670:40);a.move='blind-spear';a.t=.78;}
  else{a.move=a.assistReady?'release':'chain-core';a.t=.72;}
 }
 const chase=a.encounter==='branch-b'?22:a.encounter==='formation'?18:34;e.x=Math.max(g.arena.x-60,Math.min(g.arena.x+720,e.x+(p.x<e.x?-1:1)*dt*chase));
}

function motion(a,e,g){let shift=0,lift=Math.sin(g.time*3.2)*1.25,rot=0,sx=1,sy=1,p=0;
 if(a.state==='tell'){p=ease(clamp01(1-a.t/.82));shift=-a.dir*10*p;rot=-a.dir*.05*p;}
 else if(a.state==='attack'){p=clamp01(1-a.t/(a.encounter==='formation'?1.02:.72));const strike=ease(clamp01((p-.12)/.24)),recover=ease(clamp01((p-.58)/.42));shift=a.dir*58*strike*(1-recover);lift-=9*Math.sin(Math.PI*p);rot=a.dir*.11*strike*(1-recover);sx+=.06*strike;sy-=.04*strike;}
 else if(a.state==='stagger'||e.hitTime>0){shift=-a.dir*13;rot=-a.dir*.08;}
 return {shift,lift,rot,sx,sy,p};
}
function frameFor(a,e){if(e.hitTime>0||a.state==='stagger')return 4;if(a.state==='transition')return 5;if(a.state==='tell')return 1;if(a.state==='attack')return a.t>.42?2:a.t>.14?3:5;return 0;}
function drawFrame(ctx,img,frame,x,y,height,dir,m,alpha=1){if(!img)return;const cell=512,col=frame%3,row=Math.floor(frame/3),scale=height/cell,dw=cell*scale;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(Math.round(x+m.shift),Math.round(y+m.lift));ctx.rotate(m.rot);ctx.scale(m.sx*(dir>0?-1:1),m.sy);ctx.drawImage(img,col*cell,row*cell,cell,cell,-dw/2,-height,dw,height);ctx.restore();}
function arc(ctx,x,y,dir,p,color,size=.8){const reveal=clamp01((p-.17)/.2),fade=1-clamp01((p-.55)/.32);if(reveal<=0||fade<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(dir,1);ctx.globalCompositeOperation='lighter';ctx.lineCap='round';for(let i=0;i<3;i++){ctx.globalAlpha=fade*(.62-i*.15);ctx.strokeStyle=i?'#fff7e8':color;ctx.lineWidth=(11-i*3)*size;ctx.beginPath();ctx.arc(-12,-60,(78+i*7)*size,-1.46,-1.46+2.35*reveal);ctx.stroke();}ctx.restore();}

export function drawSevenSwords(ctx,e,g,label,art,combatArt){
 const a=e.ai,t=g.time,m=motion(a,e,g),frame=frameFor(a,e),sprites=Array.isArray(combatArt)?combatArt:[];ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 if(a.encounter==='branch-a'){
  ctx.fillStyle=`rgba(4,7,14,${.9-a.light*.58})`;ctx.fillRect(0,35,1152,455);
  const gx=e.x-g.camera,glow=ctx.createRadialGradient(gx,410,15,gx,410,100+250*a.light);glow.addColorStop(0,'#ffdca088');glow.addColorStop(1,'#ffdca000');ctx.fillStyle=glow;ctx.fillRect(0,35,1152,455);
 }
 if(a.encounter==='branch-b'){
  ctx.fillStyle='#07101abe';ctx.fillRect(0,35,1152,455);for(let i=0;i<34;i++){const x=(i*83+t*44)%1152,y=100+(i*47)%360;ctx.fillStyle='#d9f4ff99';ctx.fillRect(x,y,3,3);}
  if(a.state==='tell'&&a.move==='arrow'){ctx.strokeStyle='#dff8ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(a.target-g.camera,476,48+Math.sin(t*16)*7,0,Math.PI*2);ctx.stroke();}
 }
 const targetX=e.x-g.camera;
 if(a.encounter==='formation'){
  const pos=[[170,466],[306,438],[442,420],[576,410],[710,420],[846,438],[982,466]],active=a.turn%7;
  ctx.strokeStyle='#a85e7855';ctx.lineWidth=2;for(const [px,py] of pos){ctx.beginPath();ctx.moveTo(px,py-35);ctx.lineTo(576,392);ctx.stroke();}
  for(let i=0;i<7;i++){const [baseX,baseY]=pos[i],on=i===active,px=on?targetX:baseX,py=on?466:baseY,local={...m,shift:on?m.shift*.7:0,lift:on?m.lift:Math.sin(t*2.4+i)*1.2,rot:on?m.rot:0,sx:on?m.sx:1,sy:on?m.sy:1};drawFrame(ctx,sprites[i],on?frame:0,px,py,on?118:88,px<576?-1:1,local,on?1:.58);if(on&&a.state==='attack')arc(ctx,px+local.shift,py-3,a.dir,m.p,'#d786a5',.64);}
 }else{
  const ids=a.cfg.sprites,activeIndex=a.encounter==='branch-a'?(a.reveal>0||a.move==='ngạn-khanh'?1:0):a.encounter==='branch-b'?(a.bell>0?0:a.move==='arrow'?1:0):1;
  for(let i=0;i<2;i++){const active=i===activeIndex,px=active?targetX:Math.max(160,Math.min(1030,targetX+(targetX<580?165:-165))),local={...m,shift:active?m.shift:0,lift:active?m.lift:Math.sin(t*3+i)*1.5,rot:active?m.rot:0,sx:active?m.sx:1,sy:active?m.sy:1};drawFrame(ctx,sprites[ids[i]],active?frame:0,px,466,active?139:124,i?1:-1,local,active?1:.63);if(active&&a.state==='attack')arc(ctx,px+local.shift,460,a.dir,m.p,a.cfg.color,.72);}
 }
 ctx.strokeStyle=a.cfg.color;ctx.lineWidth=3;ctx.globalAlpha=.75+Math.sin(t*5)*.16;ctx.beginPath();ctx.ellipse(targetX,482,54,10,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
 label('MỤC TIÊU',targetX,319,'#e9fbf7',12);
 if(a.encounter==='branch-a'){for(let i=0;i<3;i++){const lit=a.light>(i+1)*.24;ctx.fillStyle=lit?'#ffd287':'#252937';ctx.fillRect(targetX-136+i*112,450,13,26);ctx.fillStyle=lit?'#ffe8b0':'#4a3541';ctx.beginPath();ctx.arc(targetX-130+i*112,447,lit?8:4,0,Math.PI*2);ctx.fill();}}
 if(a.encounter==='branch-b'){ctx.save();ctx.globalAlpha=a.bell>0?1:.2;ctx.strokeStyle='#bfeeff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(targetX,390,26,Math.PI,0);ctx.lineTo(targetX+30,430);ctx.lineTo(targetX-30,430);ctx.closePath();ctx.stroke();ctx.restore();}
 if(a.encounter==='branch-c'&&a.state==='sheathe'){ctx.fillStyle='#090b14d8';ctx.fillRect(0,35,1152,455);label('[ E ]  THU KIẾM',576,250,'#fff1c7',28);label('Dừng trận đấu. Tra kiếm vào vỏ.',576,283,'#d9cfe7',14);}
 if(a.encounter==='formation'&&a.formationRound===2){
  for(let i=0;i<3;i++){const alive=i<a.formationAnchors,x=targetX+(i-1)*29;ctx.save();ctx.globalAlpha=alive?.95:.18;ctx.translate(x,455);ctx.rotate(Math.PI/4);ctx.fillStyle=alive?'#a8dcff':'#39465b';ctx.strokeStyle='#eff9ff';ctx.lineWidth=2;ctx.fillRect(-11,-11,22,22);ctx.strokeRect(-11,-11,22,22);ctx.restore();}
  label(a.handDir>0?'FU HUA RA DẤU  →':'←  FU HUA RA DẤU',576,170,'#c9fff1',17);
 }
 if(a.encounter==='formation'&&a.formationRound===3)for(let i=0;i<3;i++){const alive=i<a.memorySeals,x=targetX+(i-1)*29;ctx.globalAlpha=alive?.92:.2;ctx.fillStyle=alive?'#d28bc9':'#3a3040';ctx.beginPath();ctx.arc(x,448,15,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffe5f8';ctx.stroke();ctx.globalAlpha=1;}
 ctx.restore();
 ctx.fillStyle='#111722';ctx.fillRect(257,54,638,29);ctx.strokeStyle=a.cfg.color;ctx.strokeRect(257,54,638,29);ctx.fillStyle=a.cfg.color;ctx.fillRect(263,60,626*(a.encounter==='formation'?a.breakGauge:Math.max(0,e.hp/e.maxHP)),17);
 label(a.cfg.name,576,45,'#eef1ea',14);label(a.cfg.subtitle,576,101,'#d7cbd8',11);
 const hint=a.encounter==='branch-a'?a.armor>0?`KIẾM + K THẮP SÁNG · THƯƠNG PHÁ GIÁP ${3-a.armor}/3`:'VÙNG SÁNG ĐÃ MỞ · TẤN CÔNG':a.encounter==='branch-b'?a.bell>0?`KHÔNG ÂM THANH · XÍCH KÉO CHUÔNG ${3-a.bell}/3`:'CHUÔNG ĐÃ VỠ · KHÔNG HẠ UYỂN NHƯ':a.encounter==='branch-c'?a.state==='sheathe'?'[ E ] THU KIẾM':a.inputLock==='dash'?'NÚT NÉ ĐÃ BỊ KHÓA · ĐỔI VŨ KHÍ':a.inputLock==='weapon'?'ĐỔI VŨ KHÍ ĐÃ BỊ KHÓA · ĐỌC KHÍ KIẾM':'KHÔNG LẶP COMBO · KIẾM → THƯƠNG → XÍCH':a.formationRound===1?`TURN 1 · NÉ 6 NHỊP ${a.formationEvades}/6 · PARRY NHỊP 7`:a.formationRound===2?`TURN 2 · NHÌN TAY FU HUA · THƯƠNG PHÁ NEO ${3-a.formationAnchors}/3`:a.assistReady?'TURN 3 · Q GỌI FU HUA CHÉM ĐỨT GÔNG CÙM':`TURN 3 · XÍCH KÉO LÕI ${3-a.memorySeals}/3`;
 label(hint,576,126,'#eaf0e7',12);
 if(a.state==='tell'){
  const tell=a.move==='seventh'?'NHỊP 7 · KIẾM + K PARRY':a.move==='wave'?'CUỒNG PHONG THẤP · SPACE':a.move==='dash'?'KIẾM LƯỚT · L NÉ':a.move==='arrow'?'TÊN KHÔNG VỆT · NHÌN BỤI TUYẾT':a.move==='ngạn-khanh'?'NGẠN KHANH TRONG BÓNG TỐI':a.move==='triều-vũ'?'TRIỀU VŨ · PHẢN NHÁT CHÉM VÒNG':a.move==='qi'?'KHÍ KIẾM PHỦ MÀN HÌNH':a.move==='copy'?'LĂNG SƯƠNG ĐANG HỌC COMBO':'TRẬN PHÁP ĐANG ĐỔI NHỊP';label(tell,576,151,'#ffd7e5',11);
 }
 if(a.encounter==='branch-b')label('PHONG THANH DƯƠNG · TOÀN BỘ ÂM THANH ĐÃ BỊ CẮT',576,24,'#d7edf4',12);
}
