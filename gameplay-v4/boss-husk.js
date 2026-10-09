// Boss encounter is a readable state machine: tell -> attack -> punish window.
const LIFE_HP={1:4200,2:5400};
export function initHusk(e){e.hp=e.maxHP=LIFE_HP[1];e.armor=0;e.ai={life:1,phase:1,state:'rest',t:1.15,turn:0,open:0,fx:[],barrier:false,skills:[],guardCall:false,huaTimer:7,charge:0};return e;}
export function huskDamage(e,amount){const a=e.ai;if(!a)return amount;if(a.barrier||a.state==='rage')return 0;return Math.max(0,Math.min(e.hp-(a.life===1?1:0),Math.round(amount*(a.open>0?1.25:.3))));}
const MOVES={wave:{name:'CHẤN ĐỘNG MẶT ĐẤT',hint:'SPACE · Nhảy qua sóng',tell:1.1},rush:{name:'LAO XUYÊN KÝ ỨC',hint:'L né đúng nhịp · K phản đòn',tell:1},rain:{name:'MƯA MẢNH KÝ ỨC',hint:'Rời khỏi vùng sáng',tell:1.15},beam:{name:'QUÉT HỒI ỨC',hint:'Giữ S cúi thấp · K phản tia',tell:1.2},double:{name:'DƯ CHẤN KÉP',hint:'Hai sóng liên tiếp · Nhảy hai lần',tell:1.2}};
export function updateHusk(e,g,dt,api){
 const a=e.ai,p=g.p,left=g.arena.x-130,right=g.arena.x+780;
 const record=g.bossRecord??={phases:[1],lives:[1],skills:[],parries:0,guards:0,huaStrikes:0,rage:false};
 a.open=Math.max(0,a.open-dt);a.t-=dt;e.knock=0;e.telegraph=0;e.attackTimer=0;
 if(a.life===1&&e.hp<=1){
  a.life=a.phase=2;a.turn=0;record.phases.push(2);record.lives.push(2);record.rage=true;a.state='rage';a.t=3.4;a.charge=0;a.open=0;a.fx=[];a.barrier=true;e.hp=e.maxHP=LIFE_HP[2];api.rage();api.cue('boss-rage');
 }
 if(a.life===1&&!a.guardCall&&e.hp<=LIFE_HP[1]*.53){a.guardCall=true;record.guards+=2;api.summon(['knight','enemy'],1);api.say('Senti','Nó lấy lính làm khiên. Dọn đường trước!');}
 a.barrier=a.state==='rage'||g.enemies.some(n=>n.hp>0&&n.bossGuard);
 for(const fx of a.fx){fx.life-=dt;fx.delay=Math.max(0,(fx.delay||0)-dt);if(fx.delay>0)continue;
  if(fx.kind==='wave'){fx.x+=fx.vx*dt;if(!fx.hit&&Math.abs(p.x-fx.x)<38&&p.y>445){fx.hit=true;api.damage(a.life===2?305:250,fx.x);}}
  else if(fx.kind==='rain'){fx.y+=(a.life===2?1120:990)*dt;if(!fx.hit&&Math.abs(p.x-fx.x)<47&&fx.y>p.y-p.h&&fx.y<p.y+20){fx.hit=true;api.damage(a.life===2?300:255,fx.x);}}
  else if(fx.kind==='beam'&&!fx.hit&&p.y>407&&p.y-p.h<434){fx.hit=true;if(g.parry>0){g.parry=0;g.empowered=true;a.open=2.6;fx.life=0;record.parries++;api.parry('beam');}else api.damage(a.life===2?325:275,e.x);}
 }
 a.fx=a.fx.filter(f=>f.life>0&&(f.kind!=='rain'||f.y<580));
 if(a.state==='rage'){a.charge=Math.min(1,1-a.t/3.4);if(a.t<=0){a.state='rest';a.t=.75;record.guards+=2;api.summon(['knight','knight'],2);}return;}
 if(a.life===2){a.huaTimer-=dt;if(a.huaTimer<=0&&a.state==='rest'){a.huaTimer=8;record.huaStrikes++;api.huaAssist(e);}}
 if(a.state==='tell'){
  e.telegraph=Math.max(.001,a.t);e.move=a.move;
  if(a.t<=0){a.state='attack';a.t=a.move==='rush'?.74:a.move==='beam'?.9:.8;e.attackTimer=a.t;api.cue('boss-attack');
   if(a.move==='wave'||a.move==='double'){for(const direction of [-1,1]){a.fx.push({kind:'wave',x:e.x,vx:direction*(a.life===2?490:435),life:3.3,delay:0});if(a.move==='double')a.fx.push({kind:'wave',x:e.x,vx:direction*490,life:4,delay:.48});}}
   if(a.move==='rain')for(const [i,x] of a.targets.entries())a.fx.push({kind:'rain',x,y:-30,life:2,delay:i*(a.life===2?.13:.08)});
   if(a.move==='beam')a.fx.push({kind:'beam',life:.82});
   if(a.move==='rush'){a.rushHit=false;a.rushFace=p.x<e.x?-1:1;}
  }return;
 }
 if(a.state==='attack'){
  e.attackTimer=Math.max(.001,a.t);
  if(a.move==='rush'){e.x=Math.max(left,Math.min(right,e.x+a.rushFace*(a.life===2?820:700)*dt));e.face=a.rushFace;if(!a.rushHit&&Math.abs(p.x-e.x)<88&&p.y>407){a.rushHit=true;if(g.parry>0){a.t=0;a.open=3;g.parry=0;g.empowered=true;record.parries++;api.parry('rush');}else api.damage(a.life===2?335:280,e.x);}}
  if(a.t<=0){a.state='rest';a.t=a.life===2?1.55:2.05;a.open=Math.max(a.open,a.t);}
  return;
 }
 if(a.t<=0){const list=a.life===1?['wave','rush','rain','beam']:['double','beam','rush','rain','wave','rush'];a.move=list[a.turn++%list.length];a.skills.push(a.move);record.skills.push(a.move);const move=MOVES[a.move];a.state='tell';a.t=move.tell*(a.life===2?.82:1);a.open=0;a.targets=(a.life===2?[-210,-70,70,210]:[-150,0,150]).map(dx=>Math.max(left+45,Math.min(right-45,p.x+dx)));}
}
function polygon(ctx,points){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(const [x,y] of points.slice(1))ctx.lineTo(x,y);ctx.closePath();ctx.fill();}
function drawBeam(ctx,left,right,origin,t){
 const y=420,w=right-left;ctx.save();
 ctx.globalAlpha=.72+.28*Math.sin(t*38)**2;const halo=ctx.createLinearGradient(0,y-39,0,y+39);halo.addColorStop(0,'#9a35bd00');halo.addColorStop(.35,'#a43dd899');halo.addColorStop(.5,'#f9b0f5cc');halo.addColorStop(.65,'#a43dd899');halo.addColorStop(1,'#9a35bd00');ctx.fillStyle=halo;ctx.fillRect(left,y-39,w,78);
 ctx.shadowColor='#f9b7ff';ctx.shadowBlur=25;ctx.fillStyle='#e879ff';ctx.fillRect(left,y-8,w,16);ctx.fillStyle='#fff9ed';ctx.fillRect(left,y-2,w,4);ctx.shadowBlur=0;
 ctx.strokeStyle='#ffdbfa';ctx.lineWidth=2;
 for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(left,y+side*17);for(let i=0;i<=24;i++){const px=left+i*w/24,noise=Math.sin(i*3.8+t*42+side)*5+Math.sin(i*7.1-t*65)*3;ctx.lineTo(px,y+side*(18+noise));}ctx.stroke();}
 for(let i=0;i<24;i++){const px=left+((i*79+t*(i%2?260:-330))%w+w)%w,py=y+Math.sin(i*8.4+t*23)*17;ctx.fillStyle=i%3?'#ffe7f4':'#ff8acb';ctx.fillRect(px,py,2+(i%3)*2,2);}
 for(let i=0;i<8;i++){const px=left+((i*153+t*390)%w+w)%w,span=14+i%3*8;ctx.fillStyle=i%2?'#ffb7e9':'#f5e9ff';polygon(ctx,[[px-span,y-9],[px+span*.3,y-19-i%3*4],[px+span,y-10],[px+span*.2,y+1]]);polygon(ctx,[[px-span*.6,y+10],[px+span*.2,y+21+i%3*4],[px+span,y+8],[px,y-1]]);}
 for(let i=0;i<5;i++){const px=left+((i*227+t*350)%w+w)%w,r=13+i%3*5;ctx.strokeStyle='#ffe7f5aa';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(px,y,r,r*1.8,0,0,Math.PI*2);ctx.stroke();}
 ctx.strokeStyle='#ffe1fa';ctx.lineWidth=4;for(const edge of [left,right]){ctx.beginPath();ctx.arc(edge,y,17+Math.sin(t*25)*4,0,Math.PI*2);ctx.stroke();}
 ctx.fillStyle='#fdf0ff';ctx.shadowColor='#ffd5fb';ctx.shadowBlur=28;polygon(ctx,[[origin-45,y],[origin-11,y-24],[origin,y-48],[origin+10,y-24],[origin+46,y],[origin+11,y+24],[origin,y+48],[origin-12,y+24]]);ctx.shadowBlur=0;ctx.fillStyle='#b347ca';ctx.beginPath();ctx.arc(origin,y,19,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(origin,y,9,0,Math.PI*2);ctx.fill();
 ctx.translate(origin,y);ctx.rotate(t*9);for(let i=0;i<8;i++){const angle=i*Math.PI/4,r=28+Math.sin(t*20+i)*5;ctx.fillStyle=i%2?'#ffe0f4':'#dc70ff';polygon(ctx,[[Math.cos(angle)*r,Math.sin(angle)*r],[Math.cos(angle+.12)*(r+12),Math.sin(angle+.12)*(r+12)],[Math.cos(angle+.25)*r,Math.sin(angle+.25)*r]]);}
 ctx.restore();
}
export function drawHusk(ctx,e,g,label,image){
 const a=e.ai,x=e.x-g.camera,left=g.arena.x-145-g.camera,right=g.arena.x+805-g.camera,t=g.time;
 ctx.save();ctx.fillStyle='#11101e';ctx.fillRect(318,63,514,22);ctx.strokeStyle=a.life===2?'#f19a78':'#b78bc7';ctx.lineWidth=2;ctx.strokeRect(318,63,514,22);
 const fill=ctx.createLinearGradient(322,0,828,0);fill.addColorStop(0,a.life===2?'#f7a75a':'#e6a0bc');fill.addColorStop(1,a.life===2?'#e54d76':'#b785ed');ctx.fillStyle=fill;ctx.fillRect(323,68,504*e.hp/e.maxHP,12);
 label(`NAGAZORA HUSK · MẠNG ${a.life} / 2${a.life===2?' · BẠO NỘ':''}`,575,55,a.life===2?'#ffd0aa':'#f0cbbe',13);
 if(image){let frame=0;if(a.state==='rage'||a.life===2&&a.state==='rest')frame=4;else if(a.life===2&&a.state==='attack'&&a.move==='beam')frame=5;else if(a.open>0||a.state==='stagger')frame=3;else if(a.state==='attack'&&a.move==='rush')frame=2;else if(a.state==='tell'||a.state==='attack')frame=1;const sw=image.width/3,sh=image.height/2,sx=frame%3*sw,sy=Math.floor(frame/3)*sh,dh=204,dw=dh*sw/sh,flip=e.face===1?-1:1,bob=a.state==='rest'?Math.sin(t*3.4)*2:0;ctx.save();ctx.translate(x,e.y-dh/2+bob);ctx.scale(flip,1);ctx.imageSmoothingEnabled=true;ctx.drawImage(image,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);ctx.restore();}
 if(a.life===2&&a.state!=='rage'){ctx.save();ctx.translate(x,e.y-70);ctx.strokeStyle='#ff996d99';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,76+Math.sin(t*8)*4,95,0,0,Math.PI*2);ctx.stroke();for(let i=0;i<10;i++){const angle=i*Math.PI/5+t*.8,r=72+Math.sin(t*5+i)*8;ctx.fillStyle=i%2?'#ffb97b':'#e879c2';polygon(ctx,[[Math.cos(angle)*r,Math.sin(angle)*r],[Math.cos(angle+.08)*(r+15),Math.sin(angle+.08)*(r+15)],[Math.cos(angle+.17)*r,Math.sin(angle+.17)*r]]);}ctx.restore();}
 if(a.state==='rage'){
  ctx.fillStyle='#180b26a0';ctx.fillRect(0,0,1152,490);const charge=a.charge;
  ctx.save();ctx.translate(x,e.y-77);for(let i=0;i<3;i++){ctx.strokeStyle=i===0?'#ff9c66':'#ef6bc4';ctx.globalAlpha=.35+.2*i;ctx.lineWidth=2+i;ctx.beginPath();ctx.arc(0,0,52+charge*(90+i*35),t*(i+1),t*(i+1)+Math.PI*1.45);ctx.stroke();}ctx.globalAlpha=1;for(let i=0;i<18;i++){const ang=i*2.4+t*(i%2?2:-1.5),r=35+charge*150;ctx.fillStyle=i%2?'#ffb77b':'#efa5fa';ctx.fillRect(Math.cos(ang)*r,Math.sin(ang)*r,4,4);}ctx.restore();
  label('KÝ ỨC VỠ RA · NỘ ĐANG TÍCH TỤ',575,132,'#ffbe9a',18);ctx.fillStyle='#2a162b';ctx.fillRect(380,151,390,8);ctx.fillStyle='#ff9b74';ctx.fillRect(380,151,390*charge,8);
 }else if(a.barrier){ctx.strokeStyle='#ba9fff';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(x,e.y-70,78,100,0,0,Math.PI*2);ctx.stroke();label('PHÁ LÍNH GIỮ KHIÊN',575,106,'#dfc4ff',14);}
 else if(a.state==='tell')label(MOVES[a.move].name+' · '+MOVES[a.move].hint,575,106,'#ffe1af',14);
 else if(a.open>0)label('LỘ LÕI · PHẢN CÔNG!',575,106,'#b8f5dc',14);
 if(a.state==='tell'){
  if(a.move==='beam'){
   ctx.fillStyle=`rgba(255,131,190,${.32+.2*Math.sin(t*22)**2})`;ctx.fillRect(left,410,right-left,21);ctx.fillStyle='#fff2d9';ctx.fillRect(left,419,right-left,2);
   ctx.strokeStyle='#f0b2ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,e.y-76,29+Math.sin(t*18)*5,0,Math.PI*2);ctx.stroke();for(let i=0;i<5;i++){const px=x+Math.cos(t*5+i*1.25)*46,py=e.y-76+Math.sin(t*5+i*1.25)*46;ctx.fillStyle='#ffb1f1';ctx.fillRect(px,py,5,5);}
  }else if(a.move==='rain')for(const px of a.targets){ctx.fillStyle='#f5b4e977';ctx.fillRect(px-g.camera-45,480,90,10);ctx.strokeStyle='#ffe0fb';ctx.strokeRect(px-g.camera-45,480,90,10);}
  else {ctx.fillStyle='#f3b88555';ctx.fillRect(left,482,right-left,8);}
 }
 for(const fx of a.fx){if(fx.delay>0)continue;const sx=fx.x-g.camera;
  if(fx.kind==='wave'){ctx.fillStyle='#f8d2aa';polygon(ctx,[[sx-29,490],[sx,435],[sx+29,490]]);ctx.fillStyle='#d792d4';ctx.fillRect(sx-7,454,14,35);}
  else if(fx.kind==='rain'){ctx.fillStyle='#ddaaff';polygon(ctx,[[sx,fx.y-38],[sx+23,fx.y],[sx,fx.y+30],[sx-22,fx.y]]);ctx.fillStyle='#fff3fd';polygon(ctx,[[sx,fx.y-25],[sx+8,fx.y],[sx,fx.y+15],[sx-8,fx.y]]);}
  else if(fx.kind==='beam')drawBeam(ctx,left,right,x,t);
 }
 ctx.restore();
}

