const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const clamp01=v=>clamp(v,0,1);
const ease=v=>{v=clamp01(v);return v*v*(3-2*v);};
const MOVE_NAMES={storm:'THIÊN LÔI',blades:'VẠN KIẾM',fire:'ĐỊA HỎA',cross:'GIAO KIẾM'};
const WEAPON_NAMES={sword:'KIẾM',spear:'THƯƠNG',chain:'XÍCH'};
const ORDERS=[['sword','spear','chain'],['chain','sword','spear'],['spear','chain','sword']];

export function initJizo(e){
 e.w=112;e.h=164;e.hp=e.maxHP=4800;
 e.ai={type:'jizo',round:1,state:'rest',t:.8,turn:0,move:'storm',target:e.x,dir:-1,hit:false,moveHit:false,moveResolved:false,open:0,pendingRound:0,
  reads:{storm:0,blades:0,fire:0},evades:0,illusionArmor:3,
  rods:3,rodIndex:0,rodCharged:false,rodPositions:[],
  cores:3,coreOpen:0,
  cycle:1,maxCycles:3,order:[...ORDERS[0]],sequenceStep:0,sequenceReady:false,assistHit:false,windowDamage:0,quota:1600,pendingCycle:false,
  fx:[],summonSerial:0};
 return e;
}

function startRound(a,round,api){
 a.round=round;a.state='transition';a.t=1.45;a.turn=0;a.hit=false;a.moveHit=false;a.moveResolved=false;a.open=0;a.fx=[];a.pendingRound=0;
 if(round===2){a.rods=3;a.rodIndex=0;a.rodCharged=false;api.summon?.(['flyer','knight'],'lightning-guard');}
 if(round===3){a.cores=3;a.coreOpen=0;api.summon?.(['elite','flyer'],'memory-core');}
 if(round===4){a.cycle=1;a.order=[...ORDERS[0]];a.illusionArmor=3;a.sequenceStep=0;a.sequenceReady=false;a.assistHit=false;a.windowDamage=0;a.open=0;api.summon?.(['knight','flyer'],'illusion-cycle-1');}
 api.roundChange?.(round);
}

function startCycle(a,api){
 a.pendingCycle=false;a.cycle++;a.order=[...ORDERS[a.cycle-1]];a.illusionArmor=3;a.sequenceStep=0;a.sequenceReady=false;a.assistHit=false;a.windowDamage=0;a.open=0;a.state='transition';a.t=1.25;a.fx=[];a.hit=false;
 api.summon?.(a.cycle===2?['knight','flyer']:['elite','machine'],`illusion-cycle-${a.cycle}`);
 api.cycleChange?.(a.cycle,a.order);
}

export function jizoDamage(e,amount,type){
 const a=e.ai;if(!a||a.state==='transition')return 0;
 if(a.round<3)return 0;
 if(a.round===3){
  if(type==='chain'&&a.coreOpen>0&&a.cores>0){a.cores--;a.coreOpen=0;if(a.cores<=0)a.pendingRound=4;}
  return 0;
 }
 if(a.round!==4)return 0;
 if(a.open<=0){
  if(!['sword','spear','chain'].includes(type)||a.sequenceReady)return 0;
  const expected=a.order[a.sequenceStep];
  if(type===expected){a.sequenceStep++;a.illusionArmor=Math.max(0,3-a.sequenceStep);if(a.sequenceStep>=3)a.sequenceReady=true;}
  else{a.sequenceStep=0;a.illusionArmor=3;a.sequenceReady=false;a.assistHit=false;}
  return 0;
 }
 if(!a.assistHit||a.pendingCycle)return 0;
 const remaining=Math.max(0,a.quota-a.windowDamage),applied=Math.min(amount,remaining);
 a.windowDamage+=applied;
 if(a.windowDamage>=a.quota&&a.cycle<a.maxCycles)a.pendingCycle=true;
 return applied;
}

export function interruptJizo(e){
 const a=e.ai;if(!a||e.hp<=0)return false;
 if(a.round===2&&a.rodCharged&&a.rods>0){a.rods--;a.rodIndex++;a.rodCharged=false;a.state='stagger';a.t=.9;if(a.rods<=0)a.pendingRound=3;return true;}
 if(a.round===4&&a.sequenceReady&&!a.assistHit&&a.open<=0){a.assistHit=true;a.open=5;a.state='stagger';a.t=.65;return true;}
 return false;
}

function setupAttack(a,g){
 const p=g.p,ground=g.chapterGround??486;a.hit=false;a.moveHit=false;a.moveResolved=false;a.fx=[];a.target=p.x;
 if(a.move==='blades'){
  for(const [i,x] of (a.hazardXs||[]).entries())a.fx.push({kind:'blade',x,delay:i*.09,life:.62,hit:false});
 }
 if(a.move==='fire'){
  for(const [i,x] of (a.hazardXs||[]).entries())a.fx.push({kind:'fire',x,delay:i*.13,life:.72,hit:false});
 }
 if(a.move==='storm')a.fx.push({kind:'lightning',x:a.target,delay:.23,life:.5,hit:false,ground});
}

function prepareMove(a,g){
 const p=g.p;a.hazardXs=[];a.safeX=p.x;
 if(a.move==='blades'){
  const spacing=116,start=clamp(p.x-2*spacing,g.arena.x-70,g.arena.x+730-4*spacing),gap=(a.turn+a.round+a.cycle)%5;
  a.safeX=start+gap*spacing;
  for(let i=0;i<5;i++)if(i!==gap)a.hazardXs.push(start+i*spacing);
 }
 if(a.move==='fire'){
  a.hazardXs=[-150,-50,50,150].map(v=>clamp(p.x+v,g.arena.x-80,g.arena.x+760));
  const candidates=[-290,-245,245,290].map(v=>clamp(p.x+v,g.arena.x-55,g.arena.x+755)).filter(x=>a.hazardXs.every(h=>Math.abs(h-x)>80));
  a.safeX=(candidates.length?candidates:[g.arena.x-55,g.arena.x+755]).sort((x,y)=>Math.abs(x-p.x)-Math.abs(y-p.x))[0];
 }
}

function resolveEvade(a,api){
 if(a.moveResolved)return;a.moveResolved=true;
 if(a.moveHit)return;
 if(a.round===1){
  const before=a.reads[a.move]||0;a.reads[a.move]=Math.min(2,before+1);
  if(a.reads[a.move]>before){a.evades++;a.illusionArmor=Math.max(0,3-Object.values(a.reads).filter(v=>v>=2).length);api.evade?.(a.evades,a.move,a.reads[a.move],a.illusionArmor);}
  if(a.reads.storm>=2&&a.reads.blades>=2&&a.reads.fire>=2)a.pendingRound=2;
 }
}

function updateFx(a,g,dt,api){
 const p=g.p,ground=g.chapterGround??486;
 for(const f of a.fx){
  f.delay-=dt;if(f.delay>0)continue;f.life-=dt;
  const active=f.kind==='blade'?f.life<.34&&f.life>.05:f.kind==='fire'?f.life<.39&&f.life>.05:f.life<.28&&f.life>.03;
  if(active&&!f.hit){
   const radius=f.kind==='blade'?35:f.kind==='fire'?48:76;
   if(Math.abs(p.x-f.x)<radius&&p.y>ground-105&&g.dash<=0){f.hit=true;a.moveHit=true;api.damage(f.kind==='lightning'?330:f.kind==='blade'?265:285,f.x);}
  }
 }
 a.fx=a.fx.filter(f=>f.delay>0||f.life>0);
}

export function updateJizo(e,g,dt,api){
 const a=e.ai,p=g.p,record=g.jizoRecord??={maxRound:1,evades:0,armorBreaks:0,rodsBroken:0,coresBroken:0,sequenceHits:0,dualBreaks:0,maxCycle:1};
 record.maxRound=Math.max(record.maxRound||1,a.round);record.maxCycle=Math.max(record.maxCycle||1,a.cycle||1);record.rodsBroken=Math.max(record.rodsBroken||0,3-a.rods);record.coresBroken=Math.max(record.coresBroken||0,3-a.cores);record.sequenceHits=Math.max(record.sequenceHits||0,a.sequenceStep||0);
 a.t-=dt;a.open=Math.max(0,a.open-dt);a.coreOpen=Math.max(0,a.coreOpen-dt);e.telegraph=0;e.attackTimer=0;e.knock=0;
 if(!a.rodPositions.length&&g.arena)a.rodPositions=[g.arena.x+145,g.arena.x+380,g.arena.x+615];
 updateFx(a,g,dt,api);
 if(a.pendingRound){startRound(a,a.pendingRound,api);return;}
 if(a.pendingCycle){startCycle(a,api);record.maxCycle=Math.max(record.maxCycle||1,a.cycle);return;}
 if(a.round===4&&a.assistHit&&a.open<=0&&a.windowDamage<a.quota){a.assistHit=false;a.sequenceReady=false;a.sequenceStep=0;a.illusionArmor=3;a.state='transition';a.t=.9;api.windowClosed?.(a.cycle);}
 if(a.state==='transition'){if(a.t<=0){a.state='rest';a.t=.55;}return;}
 if(a.state==='stagger'){if(a.t<=0){a.state='rest';a.t=.45;}return;}
 if(a.state==='tell'){
  e.telegraph=Math.max(.01,a.t);
  if(a.round===2&&a.move==='storm')a.target=p.x;
  if(a.t<=0){a.state='attack';a.t=a.move==='blades'?1.18:a.move==='fire'?1.12:.92;a.dir=p.x<e.x?-1:1;setupAttack(a,g);}
  return;
 }
 if(a.state==='attack'){
  e.attackTimer=Math.max(.01,a.t);
  if(a.round===2&&a.move==='storm'&&!a.hit&&a.t<.42){
   a.hit=true;const rod=a.rodPositions[a.rodIndex],lockedOnRod=Math.abs(a.target-rod)<92,avoided=Math.abs(p.x-a.target)>88||g.dash>0;
   if(lockedOnRod&&avoided){a.rodCharged=true;api.rodPrimed?.(a.rodIndex);}
  }
  if(a.round===3&&a.move==='cross'&&!a.hit&&a.t<.43){
   a.hit=true;const near=Math.abs(p.x-e.x)<205;
   if(near&&g.parry>0){g.parry=0;a.coreOpen=2.5;api.coreExposed?.(3-a.cores);}else if(near&&g.dash<=0){a.moveHit=true;api.damage(315,e.x);}
  }
  if(a.t<.07){resolveEvade(a,api);a.state='rest';a.t=a.round===4?.32:.46;}
  return;
 }
 if(a.t<=0){
  a.state='tell';a.t=a.round===1?.88:a.round===2?.92:a.round===3?.82:.74;
  if(a.round===1)a.move=['storm','blades','fire'][a.turn++%3];
  else if(a.round===2)a.move=a.rodCharged?'blades':['storm','blades','fire'][a.turn++%3];
  else if(a.round===3)a.move=['cross','fire','blades'][a.turn++%3];
  else a.move=['storm','blades','fire','cross'][a.turn++%4];
  a.target=p.x;
  prepareMove(a,g);
 }
 const speed=a.round===4?54:38;e.x=clamp(e.x+(p.x<e.x?-1:1)*dt*speed,g.arena.x-65,g.arena.x+735);
}

function drawBossFrame(ctx,img,frame,x,y,dir,m){
 if(!img)return;const cell=512,col=frame%3,row=Math.floor(frame/3),h=178,w=178;
 ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.translate(Math.round(x+m.shift),Math.round(y+m.lift));ctx.rotate(m.rot);ctx.scale(dir>0?-1:1,1);ctx.globalAlpha=m.alpha;ctx.drawImage(img,col*cell,row*cell,cell,cell,-w/2,-h,w,h);ctx.restore();
}
function motion(a,e,g){
 let shift=0,lift=Math.sin(g.time*3)*1.5,rot=0,alpha=e.hitTime>0?.78:1,frame=0;
 if(a.state==='tell'){const p=ease(1-a.t/.92);shift=-a.dir*8*p;lift-=4*p;rot=-a.dir*.04*p;frame=a.move==='storm'?3:1;}
 else if(a.state==='attack'){const duration=a.move==='blades'?1.18:a.move==='fire'?1.12:.92,p=clamp01(1-a.t/duration);shift=a.dir*52*Math.sin(Math.PI*p);lift-=10*Math.sin(Math.PI*p);rot=a.dir*.09*Math.sin(Math.PI*p);frame=p<.3?1:p<.72?2:4;}
 else if(a.state==='stagger'||a.state==='transition'){frame=a.state==='transition'?3:5;lift+=3;rot=-a.dir*.06;}
 return {shift,lift,rot,alpha,frame};
}
function drawLightning(ctx,x,ground,life){
 const p=clamp01(1-life/.5),flash=Math.sin(p*Math.PI);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#dffcff';ctx.lineWidth=8;ctx.shadowColor='#63d9ff';ctx.shadowBlur=22;ctx.beginPath();ctx.moveTo(x,-10);for(let y=25;y<ground;y+=48)ctx.lineTo(x+(Math.sin(y*1.73+p*8)*24),y);ctx.lineTo(x,ground);ctx.stroke();ctx.strokeStyle='#8f63ff';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle=`rgba(181,240,255,${.3+.45*flash})`;ctx.beginPath();ctx.ellipse(x,ground,65*flash+16,12,0,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawBlade(ctx,x,ground,delay,life){
 const y=delay>0?-80:ground-24-clamp01(life/.62)*420;ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI*.04);ctx.shadowColor='#f066ff';ctx.shadowBlur=14;ctx.lineJoin='round';ctx.fillStyle='#160f25';ctx.strokeStyle='#ffccff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,72);ctx.lineTo(-13,5);ctx.lineTo(-5,-66);ctx.lineTo(0,-86);ctx.lineTo(7,-66);ctx.lineTo(14,5);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#dc4cff';ctx.fillRect(-4,-63,8,70);ctx.fillStyle='#312244';ctx.fillRect(-24,5,48,10);ctx.restore();
}
function drawFire(ctx,x,ground,delay,life){
 const p=delay>0?0:1-clamp01(life/.72),h=Math.sin(clamp01(p/.65)*Math.PI)*150;ctx.save();ctx.translate(x,ground);ctx.globalCompositeOperation='lighter';for(let i=0;i<3;i++){ctx.fillStyle=['#ffebad','#ff7a48','#bb2b62'][i];ctx.beginPath();ctx.moveTo(-34+i*8,0);ctx.lineTo(-22+i*5,-h*.45);ctx.lineTo(-9+i*2,-h*(.82-i*.12));ctx.lineTo(2,-h);ctx.lineTo(15-i*3,-h*.42);ctx.lineTo(35-i*7,0);ctx.closePath();ctx.fill();}ctx.restore();
}
function drawArmor(ctx,x,y,layers,time){
 if(layers<=0)return;ctx.save();ctx.globalCompositeOperation='lighter';for(let i=layers-1;i>=0;i--){const r=78+i*9+Math.sin(time*3+i)*2;ctx.strokeStyle=['#8feaffaa','#c58aff99','#ff78dc88'][i];ctx.lineWidth=3;ctx.setLineDash([12+i*2,7]);ctx.lineDashOffset=-time*(22+i*7);ctx.beginPath();ctx.ellipse(x,y-83,r,r*.78,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
}
function drawProp(ctx,img,index,x,y,w,h,alpha=1){if(!img)return;const sw=img.width/3;ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(img,index*sw,0,sw,img.height,x-w/2,y-h,w,h);ctx.restore();}

export function drawJizo(ctx,e,g,label,art,props){
 const a=e.ai,x=e.x-g.camera,y=e.y,ground=g.chapterGround??486,m=motion(a,e,g);ctx.save();
 for(const f of a.fx){const px=f.x-g.camera;if(f.kind==='lightning'&&f.delay<=0)drawLightning(ctx,px,ground,f.life);else if(f.kind==='blade')drawBlade(ctx,px,ground,f.delay,f.life);else if(f.kind==='fire')drawFire(ctx,px,ground,f.delay,f.life);}
 if(a.round===2){for(let i=0;i<3;i++){const alive=i>=a.rodIndex,active=i===a.rodIndex&&!a.rodCharged,px=a.rodPositions[i]-g.camera;drawProp(ctx,props,0,px,ground+1,86,92,alive?1:.22);if(active){ctx.strokeStyle='#cbf8ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(px,ground-47,50+Math.sin(g.time*5)*4,0,Math.PI*2);ctx.stroke();label(a.rodCharged?'Q':'DỤ SÉT',px,ground-112,'#dffbff',11);}}}
 if(a.round===3){for(let i=0;i<3;i++){const alive=i<a.cores,px=x-150+i*150;drawProp(ctx,props,1,px,ground-8,64,64,alive?.95:.16);}if(a.coreOpen>0){ctx.strokeStyle='#fff3b5';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y-91,42+Math.sin(g.time*8)*5,0,Math.PI*2);ctx.stroke();}}
 drawArmor(ctx,x+m.shift,y+m.lift,a.illusionArmor,g.time);drawBossFrame(ctx,art,m.frame,x,y,a.dir,m);
 if(a.state==='tell'){
  if(['blades','fire'].includes(a.move)){ctx.fillStyle=a.move==='blades'?'#d879ff44':'#ff784c44';for(const hx of a.hazardXs||[])ctx.fillRect(hx-g.camera-38,ground-10,76,12);ctx.fillStyle='#9fffd555';ctx.fillRect(a.safeX-g.camera-36,ground-13,72,15);}
  else{const target=a.round===2&&a.move==='storm'?a.rodPositions[a.rodIndex]:a.target;ctx.fillStyle='#83e9ff55';ctx.fillRect(target-g.camera-72,ground-10,144,12);}
  label(`${MOVE_NAMES[a.move]||'ĐOẠN KIẾM'} · ${a.move==='storm'?'L NÉ KHỎI ĐIỂM KHÓA':a.move==='blades'?'CHẠY VÀO KHE TRỐNG':a.move==='fire'?'LƯỚT QUA NHỊP LỬA':'K PHẢN Ở NHỊP CHÉM'}`,576,141,'#f0d8ff',12);
 }
 ctx.restore();
 ctx.fillStyle='#111522';ctx.fillRect(247,51,658,32);ctx.strokeStyle='#b17bdd';ctx.lineWidth=2;ctx.strokeRect(247,51,658,32);ctx.fillStyle='#8b4db9';ctx.fillRect(254,58,644*Math.max(0,e.hp/e.maxHP),18);
 label(`JIZO MITAMA · TURN ${a.round}/4${a.round===4?` · GIÁP ${a.cycle}/3`:''}`,576,43,'#f4e9ff',14);
 let gate='';
 if(a.round===1)gate=`GIÁP ẢO ${a.illusionArmor}/3 · SÉT ${a.reads.storm}/2 · KIẾM ${a.reads.blades}/2 · LỬA ${a.reads.fire}/2`;
 else if(a.round===2)gate=a.rodCharged?`CỘT ĐÃ TÍCH ĐIỆN · Q PHÙ HOA PHÁ ${3-a.rods}/3`:`DỤ THIÊN LÔI VÀO CỘT SÁNG · CÒN ${a.rods}`;
 else if(a.round===3)gate=a.coreOpen>0?`LÕI LỘ RA · XÍCH KÉO ${3-a.cores}/3`:`K PHẢN GIAO KIẾM · MỞ LÕI ${3-a.cores}/3`;
 else if(a.open>0)gate=`CỬA SỔ SÁT THƯƠNG · ${Math.round(a.windowDamage)}/${a.quota}`;
 else if(a.sequenceReady)gate='GIÁP ẢO ĐÃ VỠ · Q DUAL COMBO';
 else gate=`GIÁP ẢO ${a.illusionArmor}/3 · ${WEAPON_NAMES[a.order[a.sequenceStep]]} TIẾP THEO`;
 label(gate,576,109,a.illusionArmor?'#bcecff':'#ffe9aa',12);
}
