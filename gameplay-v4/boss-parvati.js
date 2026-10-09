const MOVES={pillar:['CỘT BĂNG','Rời vùng sáng trước khi băng trồi',.95],roll:['CUỘN BĂNG','Xích chặn cú lăn hoặc nhảy qua',.82],breath:['HƠI THỞ BĂNG','S trượt dưới luồng băng',1.05],shatter:['VỠ SÀN','L né khỏi ba vùng nứt',.88]};
export function initParvati(e){e.hp=e.maxHP=1900;e.w=150;e.h=128;e.ai={type:'parvati',phase:1,state:'rest',t:1.05,turn:0,move:null,armor:4,armorCD:0,open:0,target:0,targets:[],dir:-1,hit:false,transitioned:false,guards:false,chainStops:0};return e;}
export function parvatiDamage(e,amount,type){const a=e.ai;
 if(a.state==='transition')return 0;
 if(a.state==='attack'&&a.move==='roll'&&type==='chain'){a.state='stagger';a.t=2.5;a.open=4;a.chainStops++;return 0;}
 if(a.armor>0){if(type==='spear'&&a.armorCD<=0){a.armor--;a.armorCD=.3;if(a.armor===0){a.state='stagger';a.t=2.2;a.open=3.8;}}return 0;}
 if(a.open<=0||['tell','attack'].includes(a.state))return 0;
 if(!['sword','chain','assist','dual','weapon-skill'].includes(type))return 0;
 if(a.phase===1&&amount>=e.hp){a.phase=2;a.transitioned=true;a.state='transition';a.t=2.55;a.turn=0;a.armor=5;a.armorCD=0;a.open=0;a.guards=false;e.hp=e.maxHP=2350;return 0;}
 return amount;
}
export function interruptParvati(e){if(!e.ai||e.hp<=0)return false;const a=e.ai;a.state='stagger';a.t=2.6;a.open=4.5;a.armor=Math.max(0,a.armor-1);return true;}
export function updateParvati(e,g,dt,api){const a=e.ai,p=g.p,record=g.parvatiRecord??={moves:[],phase:1,armorBroken:0,chainStops:0,guards:0};record.phase=Math.max(record.phase,a.phase);record.chainStops=a.chainStops;
 a.t-=dt;a.open=Math.max(0,a.open-dt);a.armorCD=Math.max(0,a.armorCD-dt);e.knock=0;e.attackTimer=0;e.telegraph=0;
 if(a.state==='transition'){if(!a.guards){a.guards=true;record.guards+=2;api.summon(['elite','flyer']);api.phaseTwo();}if(a.t<=0){a.state='rest';a.t=.6;}return;}
 if(a.armor===0&&!a.armorAnnounced){a.armorAnnounced=true;record.armorBroken++;api.say('Fu Hua','Giáp băng vỡ rồi. Dùng Xích chặn cú lăn để giữ nó nằm xuống!');}
 if(a.state==='tell'){e.telegraph=Math.max(.001,a.t);e.move=a.move;if(a.t<=0){a.state='attack';a.t={pillar:.68,roll:.92,breath:.72,shatter:.58}[a.move];a.hit=false;a.dir=p.x<e.x?-1:1;a.target=p.x;a.targets=[p.x-170,p.x,p.x+170];e.attackTimer=a.t;}return;}
 if(a.state==='attack'){
  e.attackTimer=Math.max(.001,a.t);
  if(a.move==='pillar'&&!a.hit&&a.t<.2){a.hit=true;if(Math.abs(p.x-a.target)<95&&p.y>405)api.damage(a.phase===2?250:205,a.target);api.impact(a.target,486,'#bfefff',28);}
  if(a.move==='roll'){e.x+=a.dir*(a.phase===2?720:590)*dt;if(!a.hit&&Math.abs(p.x-e.x)<112&&p.y>392){a.hit=true;api.damage(a.phase===2?275:225,e.x);}}
  if(a.move==='breath'&&!a.hit&&a.t<.34){a.hit=true;if(!p.slide&&p.y>388)api.damage(a.phase===2?250:205,e.x);}
  if(a.move==='shatter'&&!a.hit&&a.t<.18){a.hit=true;if(a.targets.some(x=>Math.abs(p.x-x)<73)&&g.dash<=0)api.damage(265,p.x);for(const x of a.targets)api.impact(x,486,'#d9f6ff',18);}
  if(a.t<=0){a.state='rest';a.t=a.phase===2?.55:.82;}
 }else if(a.t<=0){const list=a.phase===1?['pillar','roll','breath','roll']:['shatter','roll','pillar','breath','roll'];a.move=list[a.turn++%list.length];record.moves.push(a.move);a.state='tell';a.t=MOVES[a.move][2]*(a.phase===2?.87:1);a.target=p.x;}
 e.x=Math.max(g.arena.x-80,Math.min(g.arena.x+735,e.x));
}
export function drawParvati(ctx,e,g,label,image){const a=e.ai,x=e.x-g.camera,y=e.y,t=g.time;ctx.save();
 let frame=0;if(a.phase===2&&(a.state==='transition'||a.state==='rest'))frame=5;else if(a.state==='stagger'||a.open>0)frame=4;else if(a.state==='attack')frame=a.move==='roll'?3:a.move==='breath'?1:2;else if(a.state==='tell')frame=a.move==='breath'?1:a.move==='roll'?3:2;
 if(image){const sw=image.width/3,sh=image.height/2,sx=frame%3*sw,sy=Math.floor(frame/3)*sh,dh=204,dw=dh*sw/sh,flip=e.face===1?-1:1,bob=a.state==='rest'?Math.sin(t*3)*2:0;ctx.save();ctx.translate(x,y-dh/2+bob);ctx.scale(flip,1);ctx.imageSmoothingEnabled=true;ctx.drawImage(image,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);ctx.restore();}
 if(a.armor>0){ctx.strokeStyle='#d8f8ff';ctx.lineWidth=4;ctx.shadowColor='#8de8ff';ctx.shadowBlur=14;for(let i=0;i<a.armor;i++){ctx.beginPath();ctx.arc(x,y-87,82+i*8,-1.17,1.17);ctx.stroke();ctx.beginPath();ctx.arc(x,y-87,82+i*8,1.97,4.31);ctx.stroke();}ctx.shadowBlur=0;}
 ctx.fillStyle='#101929';ctx.fillRect(307,61,540,28);ctx.strokeStyle=a.phase===2?'#82dfff':'#b9ecff';ctx.strokeRect(307,61,540,28);ctx.fillStyle=a.phase===2?'#73cbe8':'#a9e9f1';ctx.fillRect(312,67,530*Math.max(0,e.hp/e.maxHP),16);label(`PARVATI · MẠNG ${a.phase}/2`,576,53,'#e8f8ff',13);
 label(a.armor?`GIÁP BĂNG ${a.armor} · THƯƠNG PHÁ GIÁP`:a.open>0?'ĐANG GỤC · KIẾM/XÍCH TẤN CÔNG':'XÍCH CHẶN CÚ LĂN ĐỂ MỞ LÕI',576,112,'#d5f6ff',13);
 if(a.state==='tell'){label(`${MOVES[a.move][0]} · ${MOVES[a.move][1]}`,576,139,'#fff0c7',12);ctx.fillStyle='#92ddff55';if(a.move==='pillar')ctx.fillRect(a.target-g.camera-95,478,190,12);else if(a.move==='shatter')for(const tx of a.targets)ctx.fillRect(tx-g.camera-68,478,136,12);else if(a.move==='breath')ctx.fillRect(0,386,1152,16);else ctx.fillRect(Math.min(x,a.target-g.camera),476,Math.abs(x-(a.target-g.camera)),14);}
 if(a.state==='attack'&&a.move==='breath'){ctx.fillStyle='#a8ecff66';ctx.fillRect(0,388,1152,28);ctx.fillStyle='#efffff';ctx.fillRect(0,399,1152,4);}if(a.state==='transition'){ctx.fillStyle='#b7eaff45';ctx.fillRect(0,240,1152,250);label('MẶT ĐẤT ĐÓNG BĂNG · FU HUA PHÁ SÀN',576,166,'#e5fbff',17);}
}
