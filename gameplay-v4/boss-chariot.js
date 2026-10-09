// Two bars with different openings: strip copied armor, then parry the committed charge.
const MOVES={leap:{name:'CÚ ĐÁP TỪ TRÊN',hint:'Rời vùng đỏ · nhảy hoặc dash',tell:1.02},dash:{name:'LAO XUYÊN ẢO ẢNH',hint:'Chọn Kiếm · K đúng lúc để phản',tell:.84},tail:{name:'ĐUÔI QUÉT NGƯỢC',hint:'L né khi vòng sáng khép lại',tell:.8},beam:{name:'TIA HIỆU ĐÍNH',hint:'Giữ S / ↓ để trượt dưới tia',tell:1.08},snare:{name:'XÍCH KÝ ỨC',hint:'L né khỏi tâm dấu xích',tell:.88}};
function makePylons(e,phase){const base=e.ai?.anchorX??e.x;return [
 {id:`chariot-${phase}-red`,x:base-430,weapon:'sword',label:'KIẾM',color:'#ff8f9f',hits:2,down:false,cooldown:0},
 {id:`chariot-${phase}-violet`,x:base-180,weapon:'dash',label:'LƯỚT',color:'#c29bff',hits:1,down:false,cooldown:0},
 {id:`chariot-${phase}-blue`,x:base+130,weapon:'spear',label:'THƯƠNG',color:'#88e5f8',hits:2,down:false,cooldown:0}
];}
export function initChariot(e){e.hp=e.maxHP=2650;e.w=104;e.h=140;e.ai={type:'chariot',anchorX:e.x,phase:1,state:'rest',t:1.25,turn:0,move:null,plates:3,pylons:makePylons(e,1),pylonsAnnounced:false,armorHits:0,open:0,jump:0,target:0,hit:false,guards:false,huaSaved:false,afterimages:[],parryCount:0,armorCooldown:0,transitioned:false};return e;}
export function hitChariotPylons(e,weapon,hitbox,swingId,feedback){
 const a=e.ai;let changed=false;
 for(const p of a.pylons){if(p.down||p.weapon!==weapon||p.cooldown>0||p.lastSwing===swingId)continue;
  if(hitbox.x>p.x+34||hitbox.x+hitbox.w<p.x-34||hitbox.y>490||hitbox.y+hitbox.h<382)continue;
  p.lastSwing=swingId;p.hits--;p.cooldown=.23;changed=true;if(p.hits<=0)p.down=true;feedback(p);
 }
 return changed;
}
export function dashChariotPylons(e,player,dash,feedback){
 if(dash<=0)return false;let changed=false;
 for(const p of e.ai.pylons){if(p.down||p.weapon!=='dash'||p.cooldown>0||Math.abs(player.x-p.x)>39)continue;p.hits--;p.cooldown=.48;changed=true;if(p.hits<=0)p.down=true;feedback(p);}
 return changed;
}
export function chariotDamage(e,amount,weapon){const a=e.ai;
 if(['transition','tell','attack'].includes(a.state))return 0;
 if(a.pylons.some(p=>!p.down))return 0;
 if(a.plates>0){if(weapon==='spear'&&a.armorCooldown<=0){a.plates--;a.armorHits++;a.armorCooldown=.32;if(a.plates===0){a.open=4;a.state='stagger';a.t=2.65;}}return 0;}
 if(a.open<=0)return 0;
 if(!['sword','weapon-skill','assist'].includes(weapon))return 0;
 const dealt=Math.round(amount*1.1);
 if(a.phase===1&&dealt>=e.hp){a.phase=2;a.transitioned=true;a.state='transition';a.t=2.45;a.turn=0;a.plates=2;a.pylons=makePylons(e,2);a.pylonsAnnounced=false;a.open=0;a.parryCount=0;a.guards=false;e.hp=e.maxHP=3050;e.hurt=0;return 0;}
 return dealt;
}
export function updateChariot(e,g,dt,api){
 const a=e.ai,p=g.p,left=g.arena.x-125,right=g.arena.x+770;
 const record=g.chariotRecord??={armorHits:0,moves:[],parries:0,huaSaves:0,guards:0,phases:1,pylonPhases:0};record.armorHits=a.armorHits;record.phases=Math.max(record.phases,a.phase);
 for(const pylon of a.pylons)pylon.cooldown=Math.max(0,pylon.cooldown-dt);
 if(!a.pylonsAnnounced&&a.pylons.every(pylon=>pylon.down)){a.pylonsAnnounced=true;record.pylonPhases++;api.say('Fu Hua','Ba trụ cấp khiên đã tắt! Giờ dùng Thương xuyên các lớp giáp.');}
 a.open=Math.max(0,a.open-dt);a.armorCooldown=Math.max(0,a.armorCooldown-dt);a.t-=dt;a.jump=Math.max(0,a.jump-dt*2.1);e.knock=0;e.attackTimer=0;e.telegraph=0;
 if(a.state==='transition'){if(!a.guards){a.guards=true;record.guards+=3;api.summon(['machine','flyer','knight']);api.phaseTwo?.();}if(a.t<=0){a.state='rest';a.t=.55;api.say('Fu Hua','Lõi nó chỉ mở khi phản đúng cú lao.');}return;}
 if(a.plates===0&&!a.guards){a.guards=true;record.guards+=2;api.summon(['machine','flyer']);api.say('Fu Hua','Giáp đã vỡ. Đợi cú lao rồi phản lại!');}
 if(a.state==='tell'){
  e.telegraph=Math.max(.001,a.t);e.move=a.move;
  if(a.t<=0){a.state='attack';a.t={leap:.9,dash:.72,tail:.65,beam:.7,snare:.55}[a.move];a.hit=false;e.attackTimer=a.t;a.target=p.x;a.dir=p.x<e.x?-1:1;a.afterimages=[];api.cue('boss-attack');}
  return;
 }
 if(a.state==='attack'){
  e.attackTimer=Math.max(.001,a.t);
  if(a.move==='leap'){
   a.jump=Math.sin(Math.PI*(1-Math.max(0,a.t)/.9));e.x+=(a.target-e.x)*Math.min(1,dt*3.1);
   if(a.t<=.12&&!a.hit){a.hit=true;api.impact(e.x,e.y-10,'#ffbcdb',35);if(Math.abs(p.x-e.x)<174&&p.y>402)api.damage(a.phase===2?350:295,e.x);}
  }else if(a.move==='dash'){
   a.afterimages.push({x:e.x,life:.23});e.x=Math.max(left,Math.min(right,e.x+a.dir*(a.phase===2?920:720)*dt));
   if(!a.hit&&Math.abs(p.x-e.x)<94&&p.y>383){a.hit=true;if(g.parry>0&&api.weapon()==='sword'){g.parry=0;g.empowered=true;a.open=3.8;a.state='stagger';a.t=2.55;a.parryCount++;record.parries++;api.parry(e.x);}else api.damage(a.phase===2?330:270,e.x);}
  }else if(a.move==='tail'&&!a.hit&&a.t<.36){a.hit=true;if(!a.huaSaved){a.huaSaved=true;record.huaSaves++;api.huaSave(e);}
   else if(Math.abs(p.x-e.x)<265&&p.y>405)api.damage(a.phase===2?280:245,e.x);
  }else if(a.move==='beam'&&!a.hit&&a.t<.33){a.hit=true;if(!p.slide&&p.y>395)api.damage(310,e.x);api.impact(e.x,e.y-110,'#ff8bbd',35);
  }else if(a.move==='snare'&&!a.hit&&a.t<.18){a.hit=true;if(Math.abs(p.x-a.target)<120&&g.dash<=0)api.damage(305,a.target);api.impact(a.target,486,'#bb8aff',23);}
  if(a.t<=0){a.state='rest';a.t=a.phase===2?.72:1.15;}
 }else if(a.t<=0){const list=a.phase===1?['leap','dash','tail','dash']:['beam','dash','snare','leap','dash','tail'];a.move=list[a.turn++%list.length];record.moves.push(a.move);a.state='tell';a.t=MOVES[a.move].tell*(a.phase===2?.86:1);a.target=p.x;}
 a.afterimages=a.afterimages.filter(v=>(v.life-=dt)>0);
}
export function drawChariot(ctx,e,g,label,image,pylonImages={}){const a=e.ai,x=e.x-g.camera,t=g.time,frame=a.state==='attack'?(a.move==='dash'?4:a.move==='leap'?3:2):a.state==='tell'?1:Math.floor(t*3)%2;
 const drawAt=(dx,alpha=1)=>{ctx.save();ctx.globalAlpha*=alpha;ctx.translate(dx,e.y-a.jump*100);ctx.scale(e.face===1?-1:1,1);ctx.drawImage(image,frame*362+3,95,354,605,-75,-170,150,180);ctx.restore();};
 for(const pylon of a.pylons){const px=pylon.x-g.camera;if(px<-90||px>1240)continue;ctx.save();const art=pylonImages[pylon.weapon];
  if(!pylon.down){ctx.strokeStyle=pylon.color+'80';ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(px,391);ctx.quadraticCurveTo((px+x)/2,260,x,e.y-112);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=18;ctx.shadowColor=pylon.color;}
  if(art){ctx.imageSmoothingEnabled=false;ctx.globalAlpha=pylon.down?.42:1;ctx.translate(px,pylon.down?487:484);if(pylon.down)ctx.rotate(pylon.weapon==='dash'?.12:-.09);const bob=pylon.down?0:Math.sin(t*3.6+(pylon.weapon==='dash'?1.5:0))*2;ctx.drawImage(art,-43,-126+bob,86,126);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;if(pylon.down){ctx.fillStyle='#18212bbb';ctx.fillRect(px-39,472,78,14);ctx.strokeStyle='#697783';ctx.beginPath();ctx.moveTo(px-29,475);ctx.lineTo(px+23,488);ctx.stroke();}}
  else{ctx.fillStyle=pylon.down?'#293645':pylon.color;ctx.fillRect(px-26,474,52,16);ctx.fillStyle='#192236';ctx.fillRect(px-19,385,38,88);ctx.strokeStyle=pylon.down?'#65707b':pylon.color;ctx.lineWidth=3;ctx.strokeRect(px-19,385,38,88);ctx.fillStyle=pylon.down?'#5e6c79':pylon.color;ctx.beginPath();ctx.moveTo(px,378);ctx.lineTo(px+15,406);ctx.lineTo(px,430);ctx.lineTo(px-15,406);ctx.closePath();ctx.fill();}
  ctx.shadowBlur=0;label(pylon.down?'TRỤ ĐÃ VỠ':pylon.label+' · '+pylon.hits,px,344,pylon.down?'#93a2ad':pylon.color,11);ctx.restore();}
 for(const ghost of a.afterimages)drawAt(ghost.x-g.camera,ghost.life*.9);drawAt(x);
 if(a.pylons.some(p=>!p.down)){ctx.save();ctx.strokeStyle='#a3e9f0';ctx.lineWidth=3;ctx.shadowBlur=16;ctx.shadowColor='#9ee5f8';for(let i=0;i<7;i++){const y=e.y-150+i*13;ctx.beginPath();ctx.moveTo(x-82-Math.sin(i+t*3)*4,y);ctx.lineTo(x-103,y+10);ctx.lineTo(x-79,y+23);ctx.moveTo(x+82+Math.sin(i+t*3)*4,y);ctx.lineTo(x+103,y+10);ctx.lineTo(x+79,y+23);ctx.stroke();}ctx.restore();}
 ctx.save();ctx.fillStyle='#111322';ctx.fillRect(307,61,540,28);ctx.strokeStyle=a.phase===2?'#ff7bab':'#7dd9ff';ctx.lineWidth=2;ctx.strokeRect(307,61,540,28);ctx.fillStyle=a.phase===2?'#f19ec5':'#81d8f9';ctx.fillRect(312,67,530*Math.max(0,e.hp/e.maxHP),16);
 label('GLITCH CHARIOT · MẠNG '+a.phase+'/2 · '+(a.plates?`GIÁP ẢO ${a.plates}`:'LÕI KÝ ỨC'),576,53,'#f5d5eb',13);
 if(a.state==='transition'){label('TÁI CẤU TRÚC · FU HUA XUẤT HIỆN',576,117,'#ffd6e5',16);ctx.fillStyle='#ed80ad42';ctx.fillRect(0,270,1152,220);}
 else if(a.pylons.some(p=>!p.down)){const left=a.pylons.filter(p=>!p.down).length;label(`KHIÊN 3 LỚP · CÒN ${left} TRỤ CẤP NĂNG LƯỢNG`,576,111,'#c8f3fb',14);label('KIẾM ĐỎ · L LƯỚT TÍM · THƯƠNG XANH',576,139,'#f7d6e9',12);}
 else if(a.plates){for(let i=0;i<3;i++){ctx.strokeStyle=i<a.plates?'#92e7ff':'#6a6473';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,e.y-85,73+i*11,-1.25,1.25);ctx.stroke();}label('THƯƠNG · PHÁ GIÁP TỪ NGOÀI NHỊP TẤN CÔNG',576,111,'#b7edff',13);}
 else label(a.open>0?'LÕI MỞ · KIẾM TẤN CÔNG NGAY!':'LÕI ĐÓNG · CHỜ LAO ĐỂ K PHẢN ĐÒN',576,111,a.open>0?'#ffe6af':'#c7e9f8',14);
 if(a.state==='tell'){
  label(MOVES[a.move].name+' · '+MOVES[a.move].hint,576,137,'#ffd5bd',12);
  ctx.fillStyle='#ff8aca66';if(a.move==='leap'||a.move==='snare')ctx.fillRect(a.target-g.camera-140,481,280,9);else if(a.move==='dash')ctx.fillRect(Math.min(x,g.p.x-g.camera),471,Math.abs(x-(g.p.x-g.camera)),10);else if(a.move==='tail')ctx.fillRect(x-245,479,490,9);else ctx.fillRect(0,394,1152,12);
  ctx.strokeStyle='#ffbfea';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,e.y-90,65+Math.sin(t*17)*4,82,0,0,Math.PI*2);ctx.stroke();
 }
 if(a.state==='attack'&&a.move==='beam'){ctx.save();ctx.shadowBlur=24;ctx.shadowColor='#ff7cb9';ctx.fillStyle='#ff7cb966';ctx.fillRect(0,390,1152,18);ctx.fillStyle='#fff3de';ctx.fillRect(0,397,1152,4);ctx.restore();}
 if(a.state==='attack'&&a.move==='leap'){ctx.fillStyle='#ffc0d27a';ctx.beginPath();ctx.ellipse(a.target-g.camera,485,50+Math.sin(t*25)*9,9,0,0,Math.PI*2);ctx.fill();}
 ctx.restore();}
