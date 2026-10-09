import {weatherAt,safeGround,snowPhase,ventPhase,canCollect} from './story-environment.js';
export function updateEnvironment(g,dt,api){
 if(g.mode!=='story'||g.phase!=='explore')return;
 const p=g.p,e=g.environment??={weather:null,clock:0,hail:[],hailClock:0,snowHit:0,lightning:[],lightningClock:0,entered:[]};
 const zone=(g.world.weather||[]).find(z=>p.x/64>=z.from&&p.x/64<z.to)||weatherAt(p.x,g.chapter);
 if(zone?.id!==e.weather?.id){e.weather=zone;e.clock=0;e.hail=[];e.hailClock=.55;e.lightning=[];e.lightningClock=.28;if(zone&&!e.entered.includes(zone.id)){e.entered.push(zone.id);api.notify(zone.title+' · '+zone.hint);}}
 e.clock+=dt;e.snowHit=Math.max(0,e.snowHit-dt);
 if(zone?.kind==='hail'){
  e.hailClock+=dt;
  if(e.hailClock>1.55){e.hailClock=0;const lead=p.x+p.vx*1.22;for(const [i,offset] of [-105,115].entries()){const x=lead+offset;if(safeGround(g.world,x,100))e.hail.push({x,y:-30,warning:.92+i*.15,size:i?1.15:1,spin:i});}}
  for(const stone of e.hail){if(stone.warning>0)stone.warning-=dt;else {stone.y+=1020*dt;if(Math.abs(stone.x-p.x)<40*stone.size&&stone.y>p.y-p.h&&stone.y<p.y+18){api.damage(155,stone.x,'hail');stone.y=700;}if(stone.y>=480&&stone.y<700){api.impact(stone.x,485,'#a8e6fc',17);stone.y=700;}}}e.hail=e.hail.filter(s=>s.y<650);
 }
 if(zone?.kind==='snow'&&snowPhase(e.clock)==='gust'&&!p.slide&&e.snowHit<=0&&safeGround(g.world,p.x,320)){api.damage(90,p.x+120,'snow');e.snowHit=1.4;}
 if(zone?.kind==='lightning'){
  e.lightningClock-=dt;
  if(e.lightningClock<=0){
   e.lightningClock=.82+((Math.floor(e.clock*10)%4)*.11);
   const lead=p.x+p.vx*.42,offset=[-150,95,210,-70][Math.floor(e.clock*7)%4],x=lead+offset;
   if(safeGround(g.world,x,90))e.lightning.push({x,warning:.72,life:.18,hit:false});
  }
  for(const bolt of e.lightning){
   if(bolt.warning>0)bolt.warning-=dt;
   else{
    bolt.life-=dt;
    if(!bolt.hit&&Math.abs(p.x-bolt.x)<58&&p.y>400){bolt.hit=true;api.damage(185,bolt.x,'lightning');}
    if(!bolt.hit&&bolt.life<=0)api.evade?.('lightning',bolt.x);
   }
  }
  e.lightning=e.lightning.filter(b=>b.warning>0||b.life>0);
 }
 for(const vent of g.world.vents||[]){if(Math.abs(vent.x-p.x)>850)continue;vent.t+=dt;const phase=ventPhase(vent.t+vent.phase);if(phase==='active'&&Math.abs(vent.x-p.x)<vent.w/2+p.w/2&&p.y>410)api.damage(155,vent.x,'vent');}
 for(const h of g.world.chapterHazards||[]){if(Math.abs(h.x-p.x)>250)continue;const phase=(g.time+h.offset)%(h.kind==='falling-sign'?6:5),active=h.kind==='falling-sign'?phase>=1.35&&phase<2.12:phase>=1.8&&phase<2.7;
  if(!active||h.hitUntil>g.time)continue;const x=h.kind==='cargo'?h.x+Math.sin(g.time*1.7+h.offset)*42:h.x;
  const radius=h.kind==='falling-sign'?55:h.kind==='ice-spike'?62:h.kind==='palm-wave'?88:42;
  if(Math.abs(p.x-x)<radius&&p.y>(h.kind==='palm-wave'?445:408)&&(h.kind!=='neon-laser'||!p.slide)){h.hitUntil=g.time+1.3;api.damage(h.kind==='cargo'?170:h.kind==='lab-drip'?145:h.kind==='ice-spike'?175:190,x,h.kind);}
 }
 if(g.phase!=='explore')return;
 for(const pickup of g.world.pickups||[])if(!g.collected.has(pickup.id)&&canCollect(pickup,p,48)&&api.needsHeal()){g.collected.add(pickup.id);api.heal(pickup.amount,pickup.x,pickup.y);}
}
function drawLava(ctx,g,gap,floor,label){
 const x=gap.x-g.camera,w=gap.w,t=g.time;if(x>1152||x+w<0)return;
 ctx.save();ctx.beginPath();ctx.rect(x,floor-22,w,170);ctx.clip();
 const glow=ctx.createLinearGradient(0,floor,0,floor+150);glow.addColorStop(0,'#fff2a1');glow.addColorStop(.12,'#ffad47');glow.addColorStop(.45,'#ed4c35');glow.addColorStop(1,'#36112b');ctx.fillStyle=glow;ctx.fillRect(x,floor+12,w,145);
 ctx.fillStyle='#551d2d';for(let i=0;i<Math.ceil(w/36);i++){const px=x+i*36,shift=Math.sin(i*7.1)*7;ctx.beginPath();ctx.moveTo(px,floor+16+shift);ctx.lineTo(px+13,floor+10+shift);ctx.lineTo(px+32,floor+19+shift);ctx.lineTo(px+36,floor+37+shift);ctx.lineTo(px,floor+32+shift);ctx.fill();}
 ctx.strokeStyle='#ffce6c';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=w;i+=6){const y=floor+18+Math.sin(i*.075+t*4)*4+Math.sin(i*.16-t*2)*2;if(i===0)ctx.moveTo(x+i,y);else ctx.lineTo(x+i,y);}ctx.stroke();
 for(let i=0;i<Math.ceil(w/22);i++){const px=x+7+i*22,py=floor+11+Math.sin(i*3+t*5)*5,r=5+i%3*2;ctx.fillStyle=i%2?'#ffc36d':'#ffe5a1';ctx.beginPath();ctx.arc(px,py,r,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#f2643d';ctx.fillRect(px-r/2,py-2,r,3);}
 for(let i=0;i<Math.ceil(w/43);i++){const bx=x+20+i*43,cycle=(t*1.5+i*.71)%2.2,by=floor+7-cycle*24;ctx.globalAlpha=Math.max(0,1-cycle/2.2);ctx.strokeStyle=i%2?'#ffd07c':'#ff8f60';ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,by,3+cycle*3,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#fff0bb';ctx.fillRect(bx+4,by-5,2,3);}
 ctx.globalAlpha=1;
 for(let i=0;i<Math.ceil(w/27);i++){const px=x+((i*41+t*(i%2?17:-10))%w+w)%w,base=floor+35+(i*29)%95,r=3+(i*7)%10,phase=t*(1.5+i%3*.4)+i*2.3;ctx.fillStyle=i%3?'#ffbd65':'#ffe6a3';ctx.globalAlpha=.45+.4*Math.sin(phase)**2;ctx.beginPath();ctx.arc(px,base+Math.sin(phase)*7,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#9c2941';ctx.globalAlpha=.65;ctx.beginPath();ctx.arc(px+r*.28,base+Math.sin(phase)*7+r*.15,Math.max(2,r*.45),0,Math.PI*2);ctx.fill();}
 ctx.globalAlpha=1;for(let i=0;i<5;i++){const bx=x+((i*73)%w),burst=(t*1.4+i*.8)%3;if(burst<.45){const r=4+burst*18;ctx.strokeStyle='#ffe7a5';ctx.lineWidth=3-burst*3;ctx.beginPath();ctx.ellipse(bx,floor+14,r,r*.35,0,0,Math.PI*2);ctx.stroke();for(let k=0;k<3;k++){ctx.fillStyle='#ffca70';ctx.fillRect(bx+(k-1)*r, floor+8-burst*(30+k*11),3,5);}}}
 ctx.restore();
 ctx.fillStyle='#221929';for(const edge of [x-10,x+w]){ctx.fillRect(edge,floor-8,12,19);ctx.fillStyle='#d15d43';ctx.fillRect(edge+2,floor+3,8,3);ctx.fillStyle='#221929';}
 if(g.phase==='explore')label('DUNG NHAM SÔI · SPACE',x+w/2,floor-165,'#ffc694',11);
}
function drawChapterHazards(ctx,g,label){const t=g.time;
 for(const h of g.world.chapterHazards||[]){const x=h.x-g.camera;if(x<-130||x>1282)continue;const phase=(t+h.offset)%(h.kind==='falling-sign'?6:5),active=h.kind==='falling-sign'?phase>=1.35&&phase<2.12:phase>=1.8&&phase<2.7,warn=phase<1.8;
  if(h.kind==='falling-sign'){const drop=active?Math.min(1,(phase-1.35)/.77):0;ctx.fillStyle=warn?'#ff93db55':'#ed7fc877';ctx.fillRect(x-58,478,116,10);ctx.save();ctx.translate(x,active?220+drop*210:245);ctx.rotate(active?drop*.23:Math.sin(t*3)*.04);ctx.fillStyle='#241539';ctx.fillRect(-58,-25,116,50);ctx.strokeStyle='#f28bdd';ctx.lineWidth=3;ctx.strokeRect(-58,-25,116,50);ctx.fillStyle='#ffd2f2';ctx.font='bold 18px Segoe UI';ctx.textAlign='center';ctx.fillText('NEON',0,7);ctx.restore();if(warn)label('BIỂN HIỆU SẮP RƠI ↓',x,390,'#ffbce8',11);}
  if(h.kind==='neon-laser'){ctx.fillStyle='#303747';ctx.fillRect(x-11,290,22,200);ctx.fillStyle=active?'#ffe3ad':'#8e9caa';ctx.fillRect(x-8,340,16,16);if(active){ctx.fillStyle='#ff97d099';ctx.fillRect(x-4,402,8,87);ctx.shadowColor='#f9a1ec';ctx.shadowBlur=18;ctx.fillStyle='#fff5ed';ctx.fillRect(x-2,402,4,87);ctx.shadowBlur=0;}else if(warn)label('LASER SẮP QUÉT · GIỮ S',x,380,'#ffc3e6',10);}
  if(h.kind==='cargo'){const cx=x+Math.sin(t*1.7+h.offset)*42;ctx.fillStyle='#252a3a';ctx.fillRect(cx-34,432,68,58);ctx.strokeStyle='#d7a35c';ctx.lineWidth=4;ctx.strokeRect(cx-34,432,68,58);ctx.fillStyle='#f1c982';ctx.fillRect(cx-5,432,10,58);ctx.fillRect(cx-34,457,68,5);label('SPACE · THÙNG TRƯỢT',cx,418,'#f9d7a2',10);}
  if(h.kind==='lab-drip'){ctx.fillStyle=active?'#a4f3e593':'#8ee7de45';ctx.fillRect(x-44,482,88,8);ctx.strokeStyle=active?'#c2fff0':'#61c9c1';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-28,0);ctx.lineTo(x-28,190);ctx.lineTo(x,190);ctx.lineTo(x,active?470:285);ctx.stroke();if(active){ctx.shadowColor='#84f4d7';ctx.shadowBlur=17;for(let i=0;i<8;i++){const dy=(i*63+t*520)%380;ctx.fillStyle=i%2?'#9fffe6':'#53c8c1';ctx.fillRect(x-12+(i%3)*8,95+dy,5,17);}ctx.shadowBlur=0;}else if(warn)label('DUNG DỊCH SẮP PHUN ↓',x,358,'#b8f6e5',10);}
  if(h.kind==='ice-spike'){ctx.fillStyle=active?'#c9f7ffd9':'#8cc8dc45';ctx.beginPath();ctx.moveTo(x-58,490);ctx.lineTo(x-31,active?390:475);ctx.lineTo(x-8,490);ctx.lineTo(x+17,active?370:478);ctx.lineTo(x+58,490);ctx.fill();ctx.strokeStyle='#efffff';ctx.stroke();if(warn)label('BĂNG NHỌN SẮP TRỒI · L NÉ',x,408,'#dffaff',10);}
  if(h.kind==='palm-wave'){const reach=active?105:24;ctx.strokeStyle=active?'#ffb6df':'#d68fbd55';ctx.lineWidth=active?8:3;ctx.beginPath();ctx.arc(x,475,reach,Math.PI,Math.PI*2);ctx.stroke();for(let i=0;i<5;i++){ctx.fillStyle='#f8c4df88';ctx.fillRect(x-reach+i*reach*.5,474-i%2*9,9,4);}if(warn)label('QUYỀN KÌNH THẤP · SPACE',x,418,'#ffd0e7',10);}
 }
}
export function drawEnvironment(ctx,g,{label,width:W,floor=490,materialArt,storyCollectibleArt,ch7Artifacts,quantaProps}){
 if(g.mode!=='story')return;
 const e=g.environment,p=g.p,t=g.time;
 ctx.save();
 for(const gap of g.world.gaps)if(gap.hazard==='lava')drawLava(ctx,g,gap,floor,label);
 for(const v of g.world.vents||[]){const x=v.x-g.camera;if(x<-120||x>W+120)continue;const phase=ventPhase(v.t+v.phase),active=phase==='active',warning=phase==='warning';ctx.fillStyle='#111322';ctx.fillRect(x-v.w/2,484,v.w,9);for(let dx=-44;dx<50;dx+=14){ctx.fillStyle=active?'#ffe3ac':warning?'#ea9c78':'#746874';ctx.fillRect(x+dx,485,8,3);}if(active){for(let i=0;i<8;i++){const h=35+Math.sin(t*15+i*3)*15+i%3*14;ctx.fillStyle=i%2?'#ffd3a5b0':'#f9787790';ctx.fillRect(x-48+i*12,485-h,9,h);}label('NHẢY QUA!',x,380,'#ffcba2',12);}else if(warning){ctx.fillStyle='#ffaf8555';ctx.fillRect(x-60,480,120,5);label('HƠI NÓNG SẮP PHUN ↑',x,397,'#ffcf9a',11);}}
 for(const h of g.world.pickups||[]){if(g.collected.has(h.id))continue;const x=h.x-g.camera,y=h.y+Math.sin(t*3)*3;if(x<-60||x>W+60)continue;ctx.shadowBlur=18;ctx.shadowColor='#7bf5ce';ctx.fillStyle='#172e36';ctx.fillRect(x-14,y-20,28,38);ctx.shadowBlur=0;ctx.fillStyle='#8bddbf';ctx.fillRect(x-12,y-18,24,34);ctx.fillStyle='#eefce4';ctx.fillRect(x-5,y-25,10,7);ctx.fillStyle='#234847';ctx.fillRect(x-2,y-10,4,19);ctx.fillRect(x-8,y-3,16,5);label('+25% HP',x,y-38,'#b1f4d4',10);}
 for(const cache of g.world.salvage||[]){if(g.collected.has(cache.id))continue;const x=cache.x-g.camera;if(x<-80||x>W+80)continue;const cell={1:2,2:6,3:7,4:8,5:9}[g.chapter];ctx.save();ctx.shadowBlur=14;ctx.shadowColor=g.chapter===7?'#ffe1a8':g.chapter===6?'#bc78ff':g.chapter===4?'#b9efff':g.chapter===5?'#efa8ce':'#69e7db';if(g.chapter===6&&quantaProps){const sw=quantaProps.width/3;ctx.imageSmoothingEnabled=false;ctx.drawImage(quantaProps,sw,0,sw,quantaProps.height,x-38,414,76,76);}else if(g.chapter===7&&ch7Artifacts){const sw=ch7Artifacts.width/4,sh=ch7Artifacts.height/2;ctx.imageSmoothingEnabled=true;ctx.drawImage(ch7Artifacts,2*sw,sh,sw,sh,x-42,406,84,84);}else if(storyCollectibleArt&&cell!==undefined){const sw=storyCollectibleArt.width/5,sh=storyCollectibleArt.height/2;ctx.imageSmoothingEnabled=true;ctx.drawImage(storyCollectibleArt,(cell%5)*sw,Math.floor(cell/5)*sh,sw,sh,x-42,406,84,84);}else if(materialArt){const sw=materialArt.width/5,sh=materialArt.height/3,mi=g.chapter===7?5:g.chapter>=2?0:2;ctx.imageSmoothingEnabled=true;ctx.drawImage(materialArt,(mi%5)*sw,Math.floor(mi/5)*sh,sw,sh,x-38,414,76,76);}ctx.shadowBlur=0;ctx.restore();label(g.chapter===7?'E · LÕI Ý THỨC':g.chapter===6?'E · BẢN KHẮC LÃNG QUÊN':g.chapter===5?'E · HỘP ẤN QUYẾT TAIXUAN':g.chapter===4?'E · RƯƠNG LÕI BĂNG BABYLON':g.chapter===3?'E · HỘP LÕI HELHEIM':g.chapter===2?'E · RƯƠNG PHỤ TÙNG ARC CITY':'E · CUỘN MẠCH NAMIKO',x,414,'#a8eee7',10);}
 if(e?.weather&&['explore','paused'].includes(g.phase)){
  const z=e.weather,snow=z.kind==='snow',phase=snowPhase(e.clock),gust=snow&&phase==='gust';
  if(snow){ctx.fillStyle=gust?'#c4e4f529':'#b3d6ef10';ctx.fillRect(0,70,W,420);for(let i=0;i<(gust?85:36);i++){const x=((i*73.3-t*(gust?390:105))%W+W)%W,y=80+(i*47+t*46)%405;ctx.fillStyle=gust?'#e4f7ffc0':'#d9efff80';ctx.fillRect(x,y,gust?13:3,2);}}
  if(z.kind==='neon'||z.kind==='wind'||z.kind==='slip'){for(let i=0;i<(z.kind==='wind'?75:105);i++){const x=((i*93-t*(z.kind==='wind'?420:145))%W+W)%W,y=(i*47+t*80)%475;ctx.strokeStyle=z.kind==='wind'?'#d6eaff88':z.kind==='slip'?'#81efdf99':i%3?'#91c5ff77':'#e093eb77';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-(z.kind==='wind'?28:7),y+16);ctx.stroke();}}
  if(z.kind==='petals'){for(let i=0;i<58;i++){const x=((i*97-t*74)%W+W)%W,y=55+(i*61+t*22)%420;ctx.fillStyle=i%3?'#f4afd0a8':'#ffe0b79a';ctx.fillRect(x,y,6,3);ctx.fillRect(x+2,y-2,3,7);}}
  if(z.kind==='quanta'){ctx.fillStyle='#55318b16';ctx.fillRect(0,55,W,435);for(let i=0;i<28;i++){const x=((i*121-t*(24+i%3*7))%W+W)%W,y=78+(i*73+Math.sin(t+i)*25)%385,r=3+i%4*2;ctx.fillStyle=i%2?'#83eaff99':'#c887ff88';ctx.fillRect(x-r,y-r,r*2,r*2);}}
  const hint=snow?(gust?'GIỮ S · CHỐNG GIÓ':phase==='warning'?'GIÓ SẮP TỚI · CHUẨN BỊ GIỮ S':'GIÓ LẶNG · TIẾN LÊN'):z.hint;
  ctx.fillStyle='#101b2bdd';ctx.fillRect(W/2-255,80,510,43);label(z.title+' · '+hint,W/2,106,gust?'#e5f7ff':'#b9e2f7',12);
 }
 for(const bolt of e?.lightning||[]){const x=bolt.x-g.camera;if(x<-100||x>W+100)continue;if(bolt.warning>0){const pulse=.28+.45*Math.sin(t*25)**2;ctx.fillStyle=`rgba(122,220,255,${pulse})`;ctx.fillRect(x-58,479,116,10);ctx.strokeStyle='#cbf7ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,484,59,10,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#baf0ff88';ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,470);ctx.stroke();ctx.setLineDash([]);label('SÉT ĐÁNH · L NÉ',x,365,'#dffaff',11);}else{ctx.shadowColor='#87ddff';ctx.shadowBlur=24;ctx.strokeStyle='#e8fbff';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,0);for(let y=0;y<480;y+=42)ctx.lineTo(x+Math.sin(y*.31+t*30)*18,y);ctx.stroke();ctx.strokeStyle='#68c8ff';ctx.lineWidth=3;ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#b9edff88';ctx.beginPath();ctx.ellipse(x,485,76,16,0,0,Math.PI*2);ctx.fill();}}
 drawChapterHazards(ctx,g,label);
 for(const h of e?.hail||[]){const x=h.x-g.camera;if(h.warning>0){const pulse=.4+.35*Math.sin(t*17+h.x)**2;ctx.fillStyle=`rgba(132,216,255,${pulse})`;ctx.fillRect(x-40,481,80,9);ctx.strokeStyle='#ddf8ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,485,42,10,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#b9eaff99';ctx.beginPath();ctx.moveTo(x,-5);ctx.lineTo(x,465);ctx.stroke();label('BĂNG RƠI ↓',x,328,'#d8f5ff',11);}else {ctx.save();ctx.translate(x,h.y);ctx.scale(h.size||1,h.size||1);ctx.fillStyle='#9be3ff44';ctx.beginPath();ctx.moveTo(0,-58);ctx.lineTo(19,-13);ctx.lineTo(-19,-13);ctx.fill();ctx.fillStyle='#6fb6dd';ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(21,-7);ctx.lineTo(9,21);ctx.lineTo(-19,7);ctx.lineTo(-22,-11);ctx.closePath();ctx.fill();ctx.fillStyle='#e8faff';ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(12,-3);ctx.lineTo(0,19);ctx.lineTo(-18,6);ctx.closePath();ctx.fill();ctx.fillStyle='#ffffff';ctx.fillRect(-4,-20,5,20);ctx.fillRect(2,-9,9,4);ctx.restore();}}
 ctx.restore();
}
