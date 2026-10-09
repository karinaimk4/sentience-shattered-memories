// Helheim's guardian is a two-bar encounter. Spear strips the shield;
// Fu Hua interrupts the sword chain; sword/parry attacks the exposed core.
const MOVES={shockwave:['SÓNG KIẾM','SPACE nhảy qua sóng',1.0],laser:['LASER SÂN BAY','S trượt dưới tia',1.12],combo:['LIÊN HOÀN KIẾM','Q gọi Fu Hua hoặc L né',.85],lunge:['ĐÂM XUYÊN','K phản khi cầm Kiếm',.78]};
export function initHeimdall(e){e.hp=e.maxHP=1700;e.w=120;e.h=178;e.ai={type:'heimdall',phase:1,state:'rest',t:1.1,turn:0,move:null,shield:3,open:0,shieldCooldown:0,hit:false,target:0,dir:-1,guards:false,transitioned:false,interrupted:0};return e;}
export function heimdallDamage(e,amount,type){const a=e.ai;
 if(a.state==='transition')return 0;
 if(a.shield>0){if(type==='spear'&&a.shieldCooldown<=0){a.shield--;a.shieldCooldown=.32;if(a.shield===0){a.open=2.7;a.state='stagger';a.t=2.0;}}return 0;}
 if(a.open<=0||a.state==='tell'||a.state==='attack')return 0;
 if(!['sword','assist','weapon-skill'].includes(type))return 0;
 if(a.phase===1&&amount>=e.hp){a.phase=2;a.transitioned=true;a.state='transition';a.t=2.5;a.turn=0;a.shield=4;a.shieldAnnounced=false;a.open=0;a.guards=false;e.hp=e.maxHP=2100;return 0;}
 return amount;
}
export function interruptHeimdall(e){const a=e.ai;if(!a||e.hp<=0)return false;if(a.shield>0){a.shield=Math.max(0,a.shield-1);a.shieldCooldown=.4;}a.state='stagger';a.t=2.5;a.open=4.2;a.interrupted++;return true;}
export function updateHeimdall(e,g,dt,api){const a=e.ai,p=g.p,record=g.heimdallRecord??={moves:[],phase:1,interrupts:0,guards:0,shieldsBroken:0};
 record.phase=Math.max(record.phase,a.phase);record.interrupts=a.interrupted;
 a.t-=dt;a.open=Math.max(0,a.open-dt);a.shieldCooldown=Math.max(0,a.shieldCooldown-dt);e.knock=0;e.attackTimer=0;e.telegraph=0;
 if(a.state==='transition'){if(!a.guards){a.guards=true;record.guards+=2;api.summon(['machine','flyer']);api.phaseTwo();}if(a.t<=0){a.state='rest';a.t=.65;}return;}
 if(a.shield===0&&!a.shieldAnnounced){a.shieldAnnounced=true;record.shieldsBroken++;api.say('Fu Hua','Khiên đã tắt! Chờ nó dứt đòn rồi áp sát lõi.');}
 if(a.state==='tell'){e.telegraph=Math.max(.001,a.t);e.move=a.move;if(a.t<=0){a.state='attack';a.t={shockwave:.62,laser:.72,combo:1.05,lunge:.62}[a.move];a.hit=false;a.dir=p.x<e.x?-1:1;a.target=p.x;e.attackTimer=a.t;}return;}
 if(a.state==='attack'){
  e.attackTimer=Math.max(.001,a.t);
  if(a.move==='shockwave'&&!a.hit&&a.t<.33){a.hit=true;if(p.y>g.chapterGround-60)api.damage(a.phase===2?225:180,e.x);api.impact(e.x,g.chapterGround,'#ed9eb1',25);}
  if(a.move==='laser'&&!a.hit&&a.t<.37){a.hit=true;if(!p.slide&&p.y>g.chapterGround-110)api.damage(a.phase===2?235:185,e.x);}
  if(a.move==='combo'&&!a.hit&&a.t<.65){a.hit=true;if(Math.abs(p.x-e.x)<290&&g.dash<=0)api.damage(a.phase===2?250:200,e.x);}
  if(a.move==='lunge'){e.x+=a.dir*(a.phase===2?600:500)*dt;if(!a.hit&&Math.abs(p.x-e.x)<132&&p.y>g.chapterGround-115){a.hit=true;if(g.parry>0&&api.weapon()==='sword'){g.parry=0;g.empowered=true;a.state='stagger';a.t=2.3;a.open=4;api.parry(e.x);}else api.damage(a.phase===2?240:190,e.x);}}
  if(a.t<=0){a.state='rest';a.t=a.phase===2?.55:.86;}
 }else if(a.t<=0){const list=a.phase===1?['shockwave','lunge','laser','combo']:['combo','shockwave','laser','lunge','combo'];a.move=list[a.turn++%list.length];record.moves.push(a.move);a.state='tell';a.t=MOVES[a.move][2]*(a.phase===2?.88:1);a.target=p.x;}
 e.x=Math.max(g.arena.x-90,Math.min(g.arena.x+740,e.x));
 e.face=a.state==='attack'&&a.move==='lunge'?a.dir:(p.x<e.x?-1:1);
}
export function drawHeimdall(ctx,e,g,label,image){const a=e.ai,x=e.x-g.camera,y=e.y,t=g.time;ctx.save();
 // Six authored poses on a strict 3x2 sheet. The collision box stays compact;
 // only the rendered mech is taller than Senti, so it never blocks the arena.
 let frame=0;
 if(a.state==='transition'||a.phase===2&&a.state==='rest')frame=5;
 else if(a.state==='stagger'||a.open>0)frame=4;
 else if(a.state==='attack')frame=a.move==='lunge'?3:a.move==='combo'?2:a.move==='laser'?1:2;
 else if(a.state==='tell')frame=a.move==='laser'?1:2;
 else if(a.shield>0)frame=1;
 const sw=image.width/3,sh=image.height/2,sx=frame%3*sw,sy=Math.floor(frame/3)*sh;
 const dh=198,dw=dh*sw/sh,bob=a.state==='rest'?Math.sin(t*3.4)*1.8:0;
 const flip=e.face===1?-1:1;
 const drawPose=(dx,alpha=1,scale=1)=>{ctx.save();ctx.globalAlpha*=alpha;ctx.translate(dx,y-dh/2+bob);ctx.scale(flip*scale,scale);ctx.drawImage(image,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);ctx.restore();};
 if(a.state==='attack'&&['lunge','combo'].includes(a.move)){drawPose(x-a.dir*18,.16,1.03);drawPose(x-a.dir*9,.28,1.015);}
 drawPose(x);
 if(a.shield>0){ctx.strokeStyle='#8ce5f1';ctx.lineWidth=3;ctx.shadowColor='#9defff';ctx.shadowBlur=13;for(let i=0;i<a.shield;i++){ctx.beginPath();ctx.arc(x,y-88,69+i*8,-1.22,1.22);ctx.stroke();ctx.beginPath();ctx.arc(x,y-88,69+i*8,1.92,4.36);ctx.stroke();}ctx.shadowBlur=0;}
 if(a.state==='attack'&&a.move==='combo'){ctx.save();ctx.strokeStyle='#ff715f';ctx.lineWidth=8;ctx.shadowColor='#ff563f';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(x,y-92,126,-2.75,.35);ctx.stroke();ctx.restore();}
 ctx.fillStyle='#101929';ctx.fillRect(307,61,540,28);ctx.strokeStyle=a.phase===2?'#f186ab':'#84dfe9';ctx.strokeRect(307,61,540,28);ctx.fillStyle=a.phase===2?'#ef91ac':'#84dfe9';ctx.fillRect(312,67,530*Math.max(0,e.hp/e.maxHP),16);
 label(`AESIR HEIMDALL · MẠNG ${a.phase}/2`,576,53,'#f5d7d6',13);
 label(a.shield>0?`KHIÊN NĂNG LƯỢNG ${a.shield} · THƯƠNG PHÁ KHIÊN`:a.open>0?'LÕI MỞ · KIẾM CHÉM NGAY':'LÕI ĐÓNG · Q NGẮT KIẾM / K PHẢN ĐÂM',576,112,a.shield>0?'#b2f3fa':'#ffdfba',13);
 if(a.state==='tell'){label(`${MOVES[a.move][0]} · ${MOVES[a.move][1]}`,576,139,'#ffd9b7',12);ctx.fillStyle='#ef6d7955';if(a.move==='laser')ctx.fillRect(0,386,1152,14);else if(a.move==='shockwave')ctx.fillRect(0,478,1152,12);else if(a.move==='combo')ctx.fillRect(x-280,477,560,13);else ctx.fillRect(Math.min(x,a.target-g.camera),478,Math.abs(x-(a.target-g.camera)),12);}
 if(a.state==='attack'&&a.move==='laser'){ctx.fillStyle='#f8879877';ctx.fillRect(0,390,1152,24);ctx.fillStyle='#ffe8dc';ctx.fillRect(0,399,1152,4);}
 if(a.state==='transition'){ctx.fillStyle='#e46b7c55';ctx.fillRect(0,250,1152,240);label('HEIMDALL TÁI KHỞI ĐỘNG · FU HUA VÀO TRẬN',576,166,'#ffd8d9',17);}
 ctx.restore();}
