const MOVES={
 palm:['THÁI HƯ QUYỀN KÌNH','Kiếm + K phản đúng nhịp',.82],
 wave:['SÓNG TAIXUAN','Space nhảy qua hai nhịp',.98],
 sword:['KIẾM GIẢ · PHẢN QUYỀN','Dùng Thương phá thế Kiếm',.78],
 spear:['THƯƠNG GIẢ · XUYÊN ẢNH','Dùng Xích kéo lệch mũi Thương',.8],
 chain:['XÍCH GIẢ · KHÓA BÓNG','Dùng Kiếm chém mắt xích',.88],
 falseFinish:['KẾT THÚC GIẢ','Đừng né sớm · chờ nửa phách',1.24]
};
const COUNTER={sword:'spear',spear:'chain',chain:'sword'};
const NAME={sword:'KIẾM',spear:'THƯƠNG',chain:'XÍCH'};
const clamp01=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp01(v);return v*v*(3-2*v);};

export function initPhantom(e){
 e.hp=e.maxHP=1950;e.w=112;e.h=172;
 e.ai={type:'phantom',phase:1,state:'rest',t:.9,turn:0,move:'palm',stance:3,stanceCD:0,open:0,target:0,dir:-1,hit:false,
  transitioned:false,announced:false,punish:0,punishCD:0,parries:0,copyIndex:0,copyWeapon:'sword',broken:[],dualReady:false,dualWindow:0,
  earlyDodge:false,colorRestore:0,burstPulse:0};
 return e;
}

export function phantomDamage(e,amount,type){
 const a=e.ai;if(a.state==='transition')return 0;
 if(a.phase===1){
  if(a.stance>0){
   if(type==='spear'&&a.stanceCD<=0){a.stance--;a.stanceCD=.3;}
   else if(!['assist','dual'].includes(type)&&a.punishCD<=0){a.punish=1;a.punishCD=.7;}
   return 0;
  }
  if(a.open<=0||['tell','attack'].includes(a.state))return 0;
  if(!['sword','spear','assist','dual','weapon-skill'].includes(type))return 0;
  if(amount>=e.hp){
   a.phase=2;a.transitioned=true;a.state='transition';a.t=3.1;a.turn=0;a.open=0;a.stance=0;a.copyIndex=0;a.copyWeapon='sword';a.broken=[];a.dualReady=false;a.dualWindow=0;a.announced=false;a.burstPulse=3.1;e.hp=e.maxHP=2700;return 0;
  }
  return amount;
 }
 if(a.dualReady){if(type==='dual'&&a.dualWindow>0)return e.hp;return 0;}
 if(!['sword','spear','chain'].includes(type))return 0;
 const expected=COUNTER[a.copyWeapon];
 if(type===expected){
  if(!a.broken.includes(a.copyWeapon))a.broken.push(a.copyWeapon);
  a.colorRestore=.34;a.copyIndex=a.broken.length;a.copyWeapon=['sword','spear','chain'][Math.min(2,a.copyIndex)];a.state='stagger';a.t=1.05;a.open=0;
  if(a.broken.length>=3)a.dualReady=true;
 }else if(a.punishCD<=0){a.punish=1;a.punishCD=.65;}
 return 0;
}

export function interruptPhantom(e){
 const a=e.ai;if(!a||e.hp<=0||a.phase!==2||!a.dualReady)return false;
 a.open=6;a.dualWindow=6;a.state='stagger';a.t=3;return true;
}

function hitPlayer(a,e,api,amount){api.damage(amount,e.x);api.colorDrain?.(a.phase===2?.2:.11);}

export function updatePhantom(e,g,dt,api){
 const a=e.ai,p=g.p,record=g.phantomRecord??={moves:[],phase:1,parries:0,dualBreaks:0,guards:0,weaponBreaks:[],earlyDodges:0};
 record.phase=Math.max(record.phase,a.phase);record.parries=a.parries;
 a.t-=dt;a.open=Math.max(0,a.open-dt);a.dualWindow=Math.max(0,a.dualWindow-dt);a.stanceCD=Math.max(0,a.stanceCD-dt);a.punishCD=Math.max(0,a.punishCD-dt);e.knock=0;e.attackTimer=0;e.telegraph=0;
 if(a.colorRestore>0){api.restoreColor?.(a.colorRestore);a.colorRestore=0;if(a.phase===2){const weapon=a.broken.at(-1);if(weapon&&!record.weaponBreaks.includes(weapon))record.weaponBreaks.push(weapon);api.weaponBreak?.(weapon,a.broken.length);}}
 if(a.punish>0){a.punish=0;hitPlayer(a,e,api,a.phase===2?335:285);api.punish?.(a.phase===2?a.copyWeapon:'discipline');}
 if(a.state==='transition'){
  if(!a.announced){a.announced=true;record.guards++;api.phaseTwo();}
  if(a.t<=0){a.state='rest';a.t=.55;}return;
 }
 if(a.phase===1&&a.stance===0&&!a.stanceAnnounced){a.stanceAnnounced=true;api.say('Phù Hoa','Ba thế thủ đã vỡ. Phản quyền kình để mở sơ hở!');}
 if(a.phase===2&&a.dualReady&&!a.dualAnnounced){a.dualAnnounced=true;api.dualReady?.();}
 if(a.state==='stagger'){if(a.t<=0){a.state='rest';a.t=.48;}return;}
 if(a.state==='tell'){
  e.telegraph=Math.max(.001,a.t);e.move=a.move;
  if(a.move==='falseFinish'&&g.dash>0&&a.t>.28){a.earlyDodge=true;record.earlyDodges++;}
  if(a.t<=0){a.state='attack';a.t={palm:.52,wave:.74,sword:.58,spear:.62,chain:.68,falseFinish:.62}[a.move];a.hit=false;a.dir=p.x<e.x?-1:1;a.target=p.x;e.attackTimer=a.t;}return;
 }
 if(a.state==='attack'){
  e.attackTimer=Math.max(.001,a.t);
  if(a.move==='palm'&&!a.hit&&a.t<.28){
   a.hit=true;if(Math.abs(p.x-e.x)<185&&p.y>390){if(g.parry>0&&api.weapon()==='sword'){g.parry=0;a.parries++;api.parry(e.x);a.open=4;a.state='stagger';a.t=2.2;}else hitPlayer(a,e,api,a.phase===2?285:230);}
  }else if(a.move==='wave'&&!a.hit&&a.t<.3){a.hit=true;if(p.y>405)hitPlayer(a,e,api,a.phase===2?260:205);api.impact(e.x,g.chapterGround,'#efb8ff',24);}
  else if(a.move==='sword'&&!a.hit&&a.t<.27){a.hit=true;if(Math.abs(p.x-e.x)<200&&g.dash<=0)hitPlayer(a,e,api,285);}
  else if(a.move==='spear'){e.x+=a.dir*520*dt;if(!a.hit&&Math.abs(p.x-e.x)<95){a.hit=true;if(g.dash<=0)hitPlayer(a,e,api,295);}}
  else if(a.move==='chain'&&!a.hit&&a.t<.3){a.hit=true;if(Math.abs(p.x-a.target)<155&&!p.slide&&g.dash<=0)hitPlayer(a,e,api,300);}
  else if(a.move==='falseFinish'&&!a.hit&&a.t<.32){
   a.hit=true;if(a.earlyDodge||g.dash<=0)hitPlayer(a,e,api,a.earlyDodge?370:315);else{a.colorRestore=.12;api.lateDodge?.();}a.earlyDodge=false;
  }
  if(a.t<=0){a.state='rest';a.t=a.phase===2?.44:.7;}return;
 }
 if(a.t<=0){
  const list=a.phase===1?['palm','wave','palm','wave']:a.dualReady?['falseFinish','chain','palm']:a.turn%3===2?['falseFinish']: [a.copyWeapon,'wave'];
  a.move=list[a.turn++%list.length];record.moves.push(a.move);a.state='tell';a.t=(MOVES[a.move]?.[2]||.8)*(a.phase===2?.9:1);a.target=p.x;a.earlyDodge=false;
 }
 e.x=Math.max(g.arena.x-80,Math.min(g.arena.x+740,e.x));
}

function motion(a,e,g){let shift=0,lift=Math.sin(g.time*3.1)*1.35,rot=0,sx=1+Math.sin(g.time*2.3)*.006,sy=1-Math.sin(g.time*2.3)*.006,p=0;
 if(a.state==='tell'){const duration=(MOVES[a.move]?.[2]||.82)*(a.phase===2?.9:1);p=clamp01(1-a.t/duration);const q=ease(p);shift=-a.dir*(a.phase===2?15:12)*q;lift+=4*Math.sin(Math.PI*p);rot=-a.dir*.055*q;sx-=.025*q;sy+=.032*q;}
 else if(a.state==='attack'){const duration={palm:.52,wave:.74,sword:.58,spear:.62,chain:.68,falseFinish:.62}[a.move]||.62;p=clamp01(1-a.t/duration);const anticipate=ease(clamp01(p/.16)),release=ease(clamp01((p-.12)/.24)),settle=ease(clamp01((p-.58)/.42));const reach={palm:50,wave:28,sword:58,spear:76,chain:38,falseFinish:88}[a.move]||46,forward=release*(1-.82*settle);shift=a.dir*(-10*anticipate+reach*forward-5*settle);lift-=Math.sin(Math.PI*clamp01((p-.05)/.84))*(a.move==='spear'?12:7);rot=a.dir*(-.04*anticipate+.105*forward-.035*settle);sx+=.052*forward;sy-=.038*forward;}
 else if(a.state==='stagger'||e.hitTime>0){shift=-a.dir*15;rot=-a.dir*.08;lift+=4;}
 else if(a.state==='transition'){const pulse=Math.sin(g.time*11);sx+=.03*pulse;sy-=.022*pulse;lift-=7*Math.sin(g.time*5);}
 return {shift,lift,rot,sx,sy,p};
}
function pose(a,e){if(e.hitTime>0||a.state==='stagger')return {from:0,to:5,mix:1};if(a.state==='transition')return {from:0,to:4,mix:.8};if(a.state==='tell')return {from:0,to:a.move==='chain'?3:a.move==='wave'?4:1,mix:ease(clamp01(1-a.t/(MOVES[a.move]?.[2]||.8)))};if(a.state==='attack')return {from:1,to:a.move==='spear'?2:a.move==='chain'?3:a.move==='wave'?4:1,mix:.95};return {from:0,to:0,mix:0};}
function drawFrame(ctx,img,index,x,y,height,dir,m,alpha=1){if(!img)return;const cell=512,col=index%3,row=Math.floor(index/3),scale=height/cell,dw=cell*scale;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(Math.round(x+m.shift),Math.round(y+m.lift));ctx.rotate(m.rot);ctx.scale(m.sx*(dir>0?-1:1),m.sy);ctx.drawImage(img,col*cell,row*cell,cell,cell,-dw/2,-height,dw,height);ctx.restore();}

export function drawPhantom(ctx,e,g,label,combatArt){
 const a=e.ai,x=e.x-g.camera,y=e.y,sprites=Array.isArray(combatArt)?combatArt:[],m=motion(a,e,g),ps=pose(a,e),img=sprites[a.phase===2?1:0]||sprites[0];ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 if(a.phase===2){
  ctx.globalAlpha=.2+.08*Math.sin(g.time*6);for(let i=0;i<3;i++){const ox=Math.sin(g.time*1.7+i*2.1)*125,oy=-18-Math.cos(g.time*2+i)*15;drawFrame(ctx,img,0,x+ox,y+oy,143,ox>0?1:-1,{...m,shift:0,lift:0,rot:0,sx:1,sy:1},.32);}
  ctx.globalAlpha=1;
 }
 drawFrame(ctx,img,ps.mix>.52?ps.to:ps.from,x,y,a.phase===2?166:156,a.dir,m,e.hitTime>0?.82:1);
 if(a.state==='attack'){
  ctx.globalCompositeOperation='lighter';ctx.strokeStyle=a.phase===2?'#f4f4f5':'#d69bf2';ctx.lineWidth=9;ctx.globalAlpha=.55;ctx.beginPath();ctx.arc(x+m.shift,y-76,80,-1.5,-1.5+2.8*clamp01((m.p-.12)/.35));ctx.stroke();ctx.globalCompositeOperation='source-over';
 }
 if(a.phase===2){
  const weapons=['sword','spear','chain'];for(let i=0;i<3;i++){const broken=a.broken.includes(weapons[i]),px=482+i*94;ctx.globalAlpha=broken?.2:1;ctx.fillStyle=broken?'#333744':'#eef1f4';ctx.strokeStyle='#8c94a3';ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,180,25,0,Math.PI*2);ctx.fill();ctx.stroke();label(NAME[weapons[i]],px,184,broken?'#717784':'#20242b',10);}ctx.globalAlpha=1;
 }
 if(a.move==='falseFinish'&&['tell','attack'].includes(a.state)){ctx.fillStyle=a.state==='tell'?'#f7f7ff16':'#ffffff25';ctx.fillRect(0,35,1152,455);if(a.earlyDodge)label('NÉ SỚM · ĐƯỜNG ĐÁNH ĐÃ BỊ SỬA',576,175,'#ff9fb8',16);}
 ctx.restore();
 ctx.fillStyle='#11131a';ctx.fillRect(257,54,638,29);ctx.strokeStyle=a.phase===2?'#e7e8ed':'#9b72b3';ctx.strokeRect(257,54,638,29);ctx.fillStyle=a.phase===2?'#d8d9df':'#b47ac9';ctx.fillRect(263,60,626*Math.max(0,e.hp/e.maxHP),17);
 label(`HƯ ẢNH FU HUA · MẠNG ${a.phase}/2`,576,46,'#f2eaf6',14);
 const hint=a.phase===1?a.stance>0?`KỶ LUẬT THÉP · THƯƠNG PHÁ NEO ${3-a.stance}/3`:a.open>0?'SƠ HỞ MỞ · TẤN CÔNG':'KIẾM + K PHẢN QUYỀN KÌNH':a.dualReady?a.dualWindow>0?'Q DUAL COMBO · KẾT LIỄU':'BA THẾ ĐÃ VỠ · Q GỌI DUAL COMBO':`CÁI BÓNG VÔ HỒN · ${NAME[COUNTER[a.copyWeapon]]} KHẮC ${NAME[a.copyWeapon]}`;
 label(hint,576,112,a.dualReady?'#ffe9ab':'#f0d5ff',13);
 if(a.state==='tell')label(`${MOVES[a.move]?.[0]||''} · ${MOVES[a.move]?.[1]||''}`,576,140,a.move==='falseFinish'?'#ffb2c9':'#e7c5f3',12);
 if(a.phase===2)label('MỖI ĐÒN TRÚNG TẨY MÀU GIAO DIỆN',576,166,'#d8d9de',10);
}
