const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const clamp01=v=>clamp(v,0,1);
const WEAPON_NAMES={sword:'KIẾM',spear:'THƯƠNG',chain:'XÍCH'};
const COLORS={sword:'#ff6688',spear:'#75eaff',chain:'#c890ff'};
const PHASE_HP=[1,.72,.38];

export function initMnemosyne(e){
 e.w=132;e.h=184;e.hp=e.maxHP=9000;
 e.ai={type:'mnemosyne',phase:1,round:1,state:'transition',t:1.4,turn:0,dir:-1,target:e.x,move:'memory',hit:false,open:0,
  expected:'sword',colorIndex:0,correct:0,prisms:3,rain:0,rainClean:true,
  lateDodges:0,weaponHits:0,lastWeapon:null,voiceReads:0,trueZone:1,zones:[],dualReady:false,
  emotion:72,parries:0,anchors:3,anchorOpen:0,forceSaved:false,cracks:0,sequence:['sword','spear','chain'],
  fake:false,fakeShown:false,fakeBreak:0,erase:false,eraseProgress:0,ultimate:false,ultimateStep:0,ultimateFlash:0,completeTimer:0,fx:[]};
 return e;
}

function setHealth(e,fraction){e.hp=Math.max(1,Math.round(e.maxHP*fraction));}
function setRound(e,phase,round,api){
 const a=e.ai;a.phase=phase;a.round=round;a.state='transition';a.t=1.15;a.open=0;a.hit=false;a.fx=[];
 if(phase===1&&round===2){a.prisms=3;a.expected='spear';}
 if(phase===1&&round===3){a.rain=0;a.rainClean=true;}
 if(phase===2&&round===1){a.lateDodges=0;}
 if(phase===2&&round===2){a.weaponHits=0;a.lastWeapon=null;a.expected='sword';}
 if(phase===2&&round===3){a.voiceReads=0;a.trueZone=1;}
 if(phase===2&&round===4)a.dualReady=true;
 if(phase===3&&round===1){a.emotion=Math.max(a.emotion,58);a.parries=0;}
 if(phase===3&&round===2){a.anchors=3;a.anchorOpen=0;}
 if(phase===3&&round===3){a.forceSaved=false;a.t=2.2;}
 if(phase===3&&round===4){a.cracks=0;a.expected='sword';if(!a.fakeShown)a.emotion=0;}
 setHealth(e,PHASE_HP[phase-1]-(round-1)*(phase===1?.07:phase===2?.055:.045));
 api.roundChange?.(phase,round);
}

export function mnemosyneDamage(e,amount,type){
 const a=e.ai;if(!a||a.fake||a.erase||a.ultimate||a.state==='transition')return 0;
 if(a.phase===1&&a.round===1){
  if(a.open<=0||type!==a.expected)return 0;
  a.correct++;a.colorIndex=(a.colorIndex+1)%3;a.expected=['sword','spear','chain'][a.colorIndex];a.open=0;
  if(a.correct>=3)a.pending=[1,2];
  return 0;
 }
 if(a.phase===1&&a.round===2){
  if(type!==a.expected||a.open<=0)return 0;
  a.prisms--;a.expected=['spear','chain','sword'][3-a.prisms];a.open=0;
  if(a.prisms<=0)a.pending=[1,3];
  return 0;
 }
 if(a.phase===1)return 0;
 if(a.phase===2&&a.round===2){
  if(type!==a.expected||type===a.lastWeapon)return 0;
  a.lastWeapon=type;a.weaponHits++;a.expected=['sword','spear','chain'][a.weaponHits%3];
  if(a.weaponHits>=4)a.pending=[2,3];
  return 0;
 }
 if(a.phase===2)return 0;
 a.emotion=Math.min(100,a.emotion+(type==='dual'?18:3));
 if(a.phase===3&&a.round===2){
  if(type!=='chain'||a.anchorOpen<=0)return 0;
  a.anchors--;a.anchorOpen=0;if(a.anchors<=0)a.pending=[3,3];return 0;
 }
 if(a.phase===3&&a.round===4){
  if(type!==a.expected)return 0;
  a.cracks++;a.expected=a.sequence[a.cracks]||'dual';
  if(a.cracks>=3){a.erase=true;a.eraseProgress=0;a.state='special';}
  return 0;
 }
 return 0;
}

export function interruptMnemosyne(e){
 const a=e.ai;if(!a||e.hp<=0||a.fake||a.erase||a.ultimate)return false;
 a.emotion=Math.min(100,a.emotion+16);
 if(a.phase===2&&a.round===4&&a.dualReady){a.dualReady=false;a.pending=[3,1];return true;}
 return false;
}

function addFx(a,kind,x,delay=0,life=.7,extra={}){a.fx.push({kind,x,delay,life,max:life,hit:false,...extra});}
function schedule(a,e,g){
 const p=g.p,ground=g.chapterGround??486;a.hit=false;a.target=p.x;a.fx=[];
 if(a.phase===1&&a.round===1){a.move='memory';addFx(a,'orb',e.x+(a.dir<0?-115:115),0,.9,{weapon:a.expected});}
 else if(a.phase===1&&a.round===2){a.move='prism';for(let i=0;i<3;i++)addFx(a,'beam',g.arena.x+120+i*255,i*.12,.75);a.open=1.4;}
 else if(a.phase===1&&a.round===3){a.move='rain';const safe=(a.turn++%4);for(let i=0;i<5;i++)if(i!==safe)addFx(a,'rain',g.arena.x+55+i*170,i*.07,.82);}
 else if(a.phase===2&&a.round===1){a.move='clock';addFx(a,'clock',p.x,0,.7);}
 else if(a.phase===2&&a.round===2){a.move='armor';addFx(a,'blade',p.x,0,.72);}
 else if(a.phase===2&&a.round===3){a.move='voice';a.trueZone=(a.turn++*2+1)%3;a.zones=[g.arena.x+95,g.arena.x+365,g.arena.x+635];for(let i=0;i<3;i++)addFx(a,'voice',a.zones[i],0,.95,{trueVoice:i===a.trueZone});}
 else if(a.phase===2&&a.round===4){a.move='copy';addFx(a,'blade',p.x,0,.8);}
 else if(a.phase===3&&a.round===1){a.move='fist';addFx(a,'fist',p.x,0,.62);}
 else if(a.phase===3&&a.round===2){a.move='thread';addFx(a,'thread',p.x,0,.78);a.anchorOpen=1.5;}
 else if(a.phase===3&&a.round===3){a.move='finish';addFx(a,'finish',p.x,0,.9);}
 else if(a.phase===3&&a.round===4){a.move='seam';for(let i=0;i<4;i++)addFx(a,'seam',g.arena.x+90+i*205,i*.08,.72);}
 a.ground=ground;
}

function updateFx(a,g,dt,api){
 const p=g.p;
 for(const f of a.fx){f.delay-=dt;if(f.delay>0)continue;f.life-=dt;const u=1-clamp01(f.life/f.max);
  if(f.hit)continue;
  if(f.kind==='orb'&&u>.52){f.hit=true;if(Math.abs(p.x-f.x)<150&&g.dash<=0)api.damage(300,f.x);else{a.open=1.35;api.prompt?.(`${WEAPON_NAMES[f.weapon]} PHẢN MẢNH ${WEAPON_NAMES[f.weapon]}`);}}
  if(f.kind==='thread'&&u>.48){f.hit=true;const chainSwing=p.attack?.baseWeapon==='chain';if(chainSwing&&a.anchorOpen>0){a.anchors--;a.anchorOpen=0;a.emotion=Math.min(100,a.emotion+10);api.anchorBreak?.(a.anchors);if(a.anchors<=0)a.pending=[3,3];}else if(a.anchorOpen>0&&Math.abs(p.x-f.x)<78&&g.dash<=0)api.damage(360,f.x);}
  if(['beam','rain','blade','seam'].includes(f.kind)&&u>.48){f.hit=true;if(Math.abs(p.x-f.x)<(f.kind==='beam'?58:68)&&g.dash<=0){if(a.phase===1&&a.round===3)a.rainClean=false;api.damage(315,f.x);}}
  if(f.kind==='clock'&&u>.58){f.hit=true;const recentlyDashed=g.dash>0||g.dashCD>.72;const late=recentlyDashed&&u<.86;if(late){a.lateDodges++;a.emotion=Math.min(100,a.emotion+8);api.lateDodge?.(a.lateDodges);if(a.lateDodges>=3)a.pending=[2,2];}else api.damage(345,f.x);}
  if(f.kind==='voice'&&u>.58){f.hit=true;if(f.trueVoice&&Math.abs(p.x-f.x)<145){a.voiceReads++;api.voiceRead?.(a.voiceReads);if(a.voiceReads>=3)a.pending=[2,4];}else if(Math.abs(p.x-f.x)<90||f.trueVoice)api.damage(270,f.x);}
  if(f.kind==='fist'&&u>.55){f.hit=true;const recentParry=g.parry>0||g.parryCD>.22;if(Math.abs(p.x-f.x)<112&&recentParry){g.parry=0;a.parries++;a.emotion=Math.min(100,a.emotion+15);api.parry?.(a.parries);if(a.parries>=3)a.pending=[3,2];}else if(Math.abs(p.x-f.x)<115)api.damage(340,f.x);}
  if(f.kind==='finish'&&u>.58){f.hit=true;if(!a.forceSaved){a.forceSaved=true;api.forceSave?.();a.pending=[3,4];}}
 }
 a.fx=a.fx.filter(f=>f.delay>0||f.life>0);
}

export function updateMnemosyne(e,g,dt,api){
 const a=e.ai,p=g.p;e.telegraph=0;e.attackTimer=0;e.knock=0;a.open=Math.max(0,a.open-dt);a.anchorOpen=Math.max(0,a.anchorOpen-dt);a.ultimateFlash=Math.max(0,a.ultimateFlash-dt);
 if(a.fake){api.special?.('fake');a.fakeBreak+=api.attackHeld?.()?dt*10:0;if(api.attackPressed?.())a.fakeBreak+=1;if(a.fakeBreak>=12){a.fake=false;a.fakeBreak=0;a.emotion=48;a.state='transition';a.t=1;api.fakeBroken?.();}return;}
 if(a.erase){api.special?.('erase');if(api.advanceHeld?.())a.eraseProgress+=dt*11;if(api.advancePressed?.())a.eraseProgress+=.7;if(a.eraseProgress>=24){a.erase=false;a.ultimate=true;a.ultimateStep=0;a.state='special';api.eraseComplete?.();}return;}
 if(a.ultimate){api.special?.('ultimate');const expected=['up','right','down','left','attack'][a.ultimateStep];if(api.qtePressed?.(expected)){a.ultimateStep++;a.ultimateFlash=.35;api.qteStep?.(a.ultimateStep);if(a.ultimateStep>=5){a.ultimate=false;a.completeTimer=2.1;api.ultimateComplete?.();}}return;}
 if(a.completeTimer>0){a.completeTimer-=dt;if(a.completeTimer<=0){e.hp=0;api.defeated?.();}return;}
 if(a.phase===3){a.emotion=Math.max(0,a.emotion-dt*(a.state==='rest'?2.2:.85));if(a.emotion<=0&&!a.fake){a.fake=true;a.fakeShown=true;a.fakeBreak=0;api.fakeStart?.();return;}}
 updateFx(a,g,dt,api);
 if(a.pending){const [ph,ro]=a.pending;a.pending=null;setRound(e,ph,ro,api);return;}
 if(a.phase===1&&a.round===3){a.rain+=dt;if(a.rain>=10){if(a.rainClean)api.memory14?.();setRound(e,2,1,api);return;}}
 a.t-=dt;
 if(a.state==='transition'){if(a.t<=0){a.state='rest';a.t=.45;}return;}
 if(a.state==='tell'){e.telegraph=Math.max(.01,a.t);if(a.t<=0){a.state='attack';a.t=.88;schedule(a,e,g);}return;}
 if(a.state==='attack'){e.attackTimer=Math.max(.01,a.t);if(a.t<=0){a.state='rest';a.t=a.phase===3?.28:.4;}return;}
 if(a.t<=0&&!(a.phase===2&&a.round===4)){a.state='tell';a.t=a.phase===1?.8:a.phase===2&&a.round===3?1.35:a.phase===2?.72:.64;a.dir=p.x<e.x?-1:1;a.target=p.x;}
 const speed=a.phase===3?70:45;e.x=clamp(e.x+(p.x<e.x?-1:1)*dt*speed,g.arena.x-55,g.arena.x+750);
}

function bossFrame(ctx,art,frame,x,y,dir,alpha=1){
 if(!art)return false;const sw=art.width/3,sh=art.height/2,sx=frame%3*sw,sy=Math.floor(frame/3)*sh,dh=244,dw=dh*sw/sh;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;ctx.translate(Math.round(x),Math.round(y));ctx.scale(dir>0?-1:1,1);ctx.drawImage(art,sx,sy,sw,sh,-dw/2,-dh,dw,dh);ctx.restore();return true;
}
function crystal(ctx,x,y,r,color,rot=0){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.shadowColor=color;ctx.shadowBlur=16;ctx.fillStyle='#13172b';ctx.strokeStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-r);ctx.lineTo(r*.62,0);ctx.lineTo(0,r);ctx.lineTo(-r*.62,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
function drawFx(ctx,a,g){const ground=g.chapterGround??486;for(const f of a.fx){const x=f.x-g.camera,u=1-clamp01((Math.max(0,f.life))/f.max),alpha=f.delay>0?.25:1;ctx.save();ctx.globalAlpha=alpha;
  if(f.kind==='orb'){crystal(ctx,x,220+Math.sin(g.time*7)*12,24,COLORS[f.weapon],g.time*2);ctx.strokeStyle=COLORS[f.weapon]+'88';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,244);ctx.lineTo(x,ground);ctx.stroke();}
  else if(['beam','rain','blade','thread','seam'].includes(f.kind)){const active=u>.45;ctx.fillStyle=active?'#fff8d6':'#d9b8ff55';ctx.shadowColor=f.kind==='thread'?'#ffffff':'#c77cff';ctx.shadowBlur=active?24:8;ctx.fillRect(x-(f.kind==='thread'?7:18),active?90:ground-9,f.kind==='thread'?14:36,active?ground-90:10);}
  else if(f.kind==='clock'||f.kind==='fist'||f.kind==='finish'){ctx.strokeStyle=f.kind==='finish'?'#fff':'#ff8db9';ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,ground-38,48+u*48,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#ff729044';ctx.fillRect(x-65,ground-8,130,8);}
  else if(f.kind==='voice'){ctx.strokeStyle=f.trueVoice?'#bdfbe8':'#f0b2ff77';ctx.lineWidth=f.trueVoice?5:2;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x,ground-45,32+i*24+Math.sin(g.time*5+i)*5,Math.PI,Math.PI*2);ctx.stroke();}}
  ctx.restore();}}
function centerText(ctx,text,x,y,color='#fff',size=18){ctx.fillStyle=color;ctx.font=`700 ${size}px Segoe UI`;ctx.textAlign='center';ctx.fillText(text,x,y);}

export function drawMnemosyne(ctx,e,g,label,art){
 const a=e.ai,x=e.x-g.camera,y=e.y,frame=a.phase===1?0:a.phase===2?2:a.phase===3?4:0;drawFx(ctx,a,g);
 for(let i=0;i<(a.phase===1?a.prisms:0);i++){const angle=g.time*.7+i*Math.PI*2/3;crystal(ctx,x+Math.cos(angle)*112,y-110+Math.sin(angle)*44,19,['#ff6d91','#75eaff','#c890ff'][i],angle);}
 const lift=Math.sin(g.time*3.1)*3-(a.state==='attack'?8:0);bossFrame(ctx,art,frame+(a.state==='attack'?1:0),x,y+lift,a.dir,e.hitTime>0?.62:1);
 if(!art){ctx.fillStyle='#f2edf8';ctx.beginPath();ctx.arc(x,y-150,30,0,Math.PI*2);ctx.fill();ctx.fillStyle='#39244f';ctx.beginPath();ctx.moveTo(x-66,y);ctx.lineTo(x,y-165);ctx.lineTo(x+66,y);ctx.closePath();ctx.fill();}
 if(a.phase===3){ctx.fillStyle='#17182a';ctx.fillRect(326,91,500,17);ctx.fillStyle=a.emotion<25?'#ff6688':'#e0a4ff';ctx.fillRect(329,94,494*a.emotion/100,11);label(`CẢM XÚC ${Math.round(a.emotion)}%`,576,85,a.emotion<25?'#ff9db3':'#f4dcff',11);}
 ctx.fillStyle='#101321';ctx.fillRect(247,51,658,30);ctx.strokeStyle='#e1c1ff';ctx.lineWidth=2;ctx.strokeRect(247,51,658,30);ctx.fillStyle=a.phase===1?'#75dbe7':a.phase===2?'#c784ed':'#f0dbe9';ctx.fillRect(253,57,646*Math.max(0,e.hp/e.maxHP),18);label(`MNEMOSYNE · PHASE ${a.phase}/3 · TURN ${a.round}/${a.phase===1?3:4}`,576,43,'#fff0fa',14);
 if(a.fake){ctx.fillStyle='#fffdf4f2';ctx.fillRect(0,0,1152,648);centerText(ctx,'MISSION ACCOMPLISHED: HOÀN HẢO',576,260,'#b59445',28);centerText(ctx,'GIỮ / NHẤP J ĐỂ CHÉM VỠ GIAO DIỆN',576,338,'#7b6070',16);ctx.strokeStyle='#c73868';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(170,150);ctx.lineTo(985,490);ctx.stroke();}
 if(a.erase){ctx.fillStyle=`rgba(248,248,255,${.72+clamp01(a.eraseProgress/24)*.2})`;ctx.fillRect(0,0,1152,648);centerText(ctx,'ĐANG XÓA SAI LỆCH',576,92,'#8a6b86',17);centerText(ctx,'TIẾN LÊN',576,500,'#2f3044',29);ctx.fillStyle='#d5c5d8';ctx.fillRect(326,530,500,16);ctx.fillStyle='#a64b72';ctx.fillRect(329,533,494*clamp01(a.eraseProgress/24),10);centerText(ctx,'GIỮ D / → HOẶC NHẤP E',576,570,'#5f5267',13);}
 if(a.ultimate){ctx.fillStyle='#f7f6f0e8';ctx.fillRect(0,0,1152,648);const steps=['↑  XÍCH TRÓI THỜI GIAN','→  EDGE OF TAIXUAN','↓  THƯƠNG XUYÊN ĐIỂM NEO','←  KIẾM CHÉM ĐƯỜNG HIỆU ĐÍNH','J  HAI NGƯỜI · KẾT LIỄU'];centerText(ctx,'KHÔNG ĐÁNH MNEMOSYNE',576,98,'#6b6172',16);centerText(ctx,'HÃY CHÉM ĐỨT SỰ HOÀN HẢO',576,132,'#c13f67',23);steps.forEach((s,i)=>centerText(ctx,s,576,230+i*55,i<a.ultimateStep?'#7aa98e':i===a.ultimateStep?'#bc315d':'#aaa3ad',i===a.ultimateStep?20:15));if(a.ultimateFlash>0){ctx.fillStyle=`rgba(255,70,130,${a.ultimateFlash})`;ctx.fillRect(0,0,1152,648);}}
}

export function mnemosyneGate(a){
 if(a.fake)return `FAKE ENDING · PHÁ UI ${Math.round(a.fakeBreak)}/12`;
 if(a.erase)return `TIẾN LÊN · ${Math.round(a.eraseProgress)}/24`;
 if(a.ultimate)return `ULTIMATE QTE ${a.ultimateStep}/5`;
 if(a.phase===1&&a.round===1)return `${WEAPON_NAMES[a.expected]} PHẢN ĐẠN MÀU · ${a.correct}/3`;
 if(a.phase===1&&a.round===2)return `${WEAPON_NAMES[a.expected]} PHÁ LĂNG KÍNH · ${3-a.prisms}/3`;
 if(a.phase===1)return `MƯA DỮ LIỆU · SỐNG SÓT ${Math.min(10,a.rain).toFixed(1)}/10 GIÂY`;
 if(a.phase===2&&a.round===1)return `NÉ TRỄ NỬA PHÁCH · ${a.lateDodges}/3`;
 if(a.phase===2&&a.round===2)return `ĐỔI SANG ${WEAPON_NAMES[a.expected]} · ${a.weaponHits}/4`;
 if(a.phase===2&&a.round===3)return `ĐỨNG TRONG VÙNG CÓ NHỊP THỞ · ${a.voiceReads}/3`;
 if(a.phase===2)return 'Q DUAL COMBO · PHÁ ULTIMATE GIẢ';
 if(a.round===1)return `KIẾM + K PHẢN QUYỀN · ${a.parries}/3`;
 if(a.round===2)return `XÍCH PHÁ NEO TREO PHÙ HOA · ${3-a.anchors}/3`;
 if(a.round===3)return 'GIỮ CẢM XÚC · SỐNG SÓT ĐÒN KẾT THÚC';
 return `${WEAPON_NAMES[a.expected]||'DUAL'} PHÁ VẾT NỨT · ${a.cracks}/3`;
}
