const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const BOWL_ORDER=[0,7,1,6,2,5,3,4];
const BOWLS=[
 {name:'Triều Vũ',mark:'LÁ GẠCH',ink:'#b9d0a4',pattern:['0001000','0011100','0111110','1111111','0111110','0011100','1001001']},
 {name:'Uyển Hề',mark:'ỚT NHẠT',ink:'#d9a486',pattern:['0000110','0001100','0011000','0111000','0011100','0001110','0000110']},
 {name:'Lăng Sương',mark:'NÉT KIẾM',ink:'#b8c8d5',pattern:['1000001','0100010','0010100','0001000','0010100','0100010','1000001']},
 {name:'Tố Y',mark:'GIỌT MỰC',ink:'#aac3d2',pattern:['0001000','0011100','0011100','0111110','0111110','0011100','0001000']},
 {name:'Phù Hoa',mark:'BÁT TRƠN',ink:'#d1c7b9',pattern:null},
 {name:'Ngạn Khanh',mark:'HAI VẠCH',ink:'#d5ba96',pattern:['1100011','1100011','0000000','1100011','1100011','0000000','1100011']},
 {name:'Uyển Như',mark:'ĐÔI CÁNH',ink:'#a6c9c5',pattern:['1000001','1100011','1110111','0111110','0011100','0001000','0001000']},
 {name:'Tô My',mark:'VÒNG ẤN',ink:'#c5b4cd',pattern:['0011100','0100010','1000001','1001001','1000001','0100010','0011100']}
];

export function createMemoryTrial(quest){
 const type=quest.trial||'testimony';
 return {quest,type,title:quest.title,time:0,cursor:0,step:0,score:0,hold:0,target:type==='hide'?5:0,done:false,message:'',pulse:0,sequence:[],choice:0,attempts:0,feedback:'',feedbackTime:0};
}

export function memoryTrialObjective(s){
 if(s.type==='salvage')return `BỮA CƠM KHÉT LẸT · Thu hồi vật chứng ${s.step}/3 · ← → chọn, E lấy`;
 if(s.type==='temptation')return s.step===0?`BÁT NƯỚC ĐÃ ĐỔ · Giữ → bước tới ảo ảnh ${Math.min(100,Math.round(s.hold/2.2*100))}%`:s.step===1?`SENTI PHÁ KỊCH BẢN · Nhấn J đập khóa UI ${s.score}/5`:`LỜI XIN LỖI DỐI TRÁ · Chọn mảnh thật ${s.score}/3 · ← →, E`;
 if(s.type==='graffiti')return `KẺ VẼ BẬY LÊN LỊCH SỬ · Canh nhịp xịt sơn E · Tường nứt ${s.score}/4`;
 if(s.type==='bowls')return `BÁT GỖ THỨ TÁM · ${s.step+1}/8: tìm bát ${BOWLS[BOWL_ORDER[Math.min(s.step,7)]].name} · ← → chọn, E đặt`;
 if(s.type==='hide')return `TRỐN TÌM KHÔNG DẤU CHÂN · ${s.message||'Nghe tiếng cười · ← → tìm, E kiểm tra'}`;
 if(s.type==='painting')return `BỨC TRANH THIẾU MỘT GƯƠNG MẶT · Canh vệt sáng và nhấn E · ${s.score}/3 nét`;
 if(s.type==='moon'){
  if(s.step===0)return 'KIẾM DƯỚI TRĂNG · Nhấn E khi nhịp sáng vào tâm để đặt tay lên chuôi';
  if(s.step===1)return `KIẾM DƯỚI TRĂNG · Buông mọi phím và đứng yên ${Math.min(1.8,s.hold).toFixed(1)}/1.8 giây`;
  return `KIẾM DƯỚI TRĂNG · Giữ E ${Math.min(3,s.hold).toFixed(1)}/3.0 giây để tra kiếm`;
 }
 if(s.type==='testimony')return `LỜI KHAI THỨ ${s.step+1}/3 · ← → chọn mảnh thật · E xác nhận`;
 if(s.type==='rescue')return `SÁT SƯ TRONG LỬa · K phản nhịp đỏ · ${s.score}/3`;
 return `${s.title} · E tiếp tục`;
}

export function updateMemoryTrial(s,dt,input,api){
 s.time+=dt;s.pulse=(s.pulse+dt*.62)%1;s.feedbackTime=Math.max(0,(s.feedbackTime||0)-dt);if(!s.feedbackTime)s.feedback='';const {keys,pressed}=input;
 const confirm=pressed.has('KeyE')||pressed.has('Enter')||pressed.has('Space');
 if(s.done){if(confirm)api.finish(s.quest);return;}
 if(s.type==='salvage'){
  if(pressed.has('ArrowLeft')||pressed.has('KeyA'))s.cursor=(s.cursor+2)%3;
  if(pressed.has('ArrowRight')||pressed.has('KeyD'))s.cursor=(s.cursor+1)%3;
  if(pressed.has('KeyE')){const expected=[2,0,1][s.step];if(s.cursor===expected){s.step++;s.message=['Đã kéo chiếc nồi khỏi máy nghiền.','Đôi đũa cháy vẫn còn nguyên.','Bát mì đen sì đã được giữ lại.'][s.step-1];api.tone(650+s.step*80);}else{s.message='Data-bot sắp nghiền vật chứng này. Chọn theo vệt khói thật.';api.tone(150);}if(s.step>=3)s.done=true;}
 }else if(s.type==='temptation'){
  if(s.step===0){if(keys.has('ArrowRight')||keys.has('KeyD'))s.hold+=dt;else s.hold=Math.max(0,s.hold-dt*.4);s.message='Nút đổi nhân vật đã bị khóa. Bảy người đang gọi “Sư phụ”.';if(s.hold>=2.2){s.step=1;s.hold=0;s.score=0;s.message='CHOẢNG! Senti tự phá khóa và lao vào màn hình.';api.tone(980);}}
  else if(s.step===1){if(pressed.has('KeyJ')){s.score++;s.message=`Khóa UI vỡ ${s.score}/5.`;api.tone(680+s.score*55);if(s.score>=5){s.step=2;s.score=0;s.choice=0;s.message='Ảo ảnh hợp thành Lời Xin Lỗi Dối Trá.';}}}
  else {if(pressed.has('ArrowLeft')||pressed.has('KeyA'))s.choice=(s.choice+2)%3;if(pressed.has('ArrowRight')||pressed.has('KeyD'))s.choice=(s.choice+1)%3;if(pressed.has('KeyE')){const answers=[2,0,1];if(s.choice===answers[s.score]){s.score++;s.message='Senti kéo một gương mặt giả khỏi lõi.';api.tone(760+s.score*60);}else{s.message='Giọng xin lỗi này quá hoàn hảo. Nó là giả.';api.tone(140);}if(s.score>=3)s.done=true;}}
 }else if(s.type==='graffiti'){
  if(pressed.has('KeyE')){const q=Math.abs(s.pulse-.5);if(q<.12){s.score++;s.message=['Mặt cười xấc xược làm tường báo lỗi.','Chibi Fu Hua cau có mở một rương ẩn.','Dòng “YATTA” xé đường tắt.','Old Timer giả tan thành sơn đỏ.'][s.score-1];api.tone(740+s.score*70);}else{s.score=Math.max(0,s.score-1);s.message='Sơn bị hệ thống tẩy. Canh lúc đường trắng rung lên.';api.tone(150);}s.pulse=0;if(s.score>=4)s.done=true;}
 }else if(s.type==='bowls'){
  if(pressed.has('ArrowLeft')||pressed.has('KeyA'))s.cursor=(s.cursor+7)%8;
  if(pressed.has('ArrowRight')||pressed.has('KeyD'))s.cursor=(s.cursor+1)%8;
  if(confirm){const expected=BOWL_ORDER[s.step],bowl=BOWLS[s.cursor];if(s.sequence.includes(s.cursor)){s.message=`Bát ${bowl.name} đã được đặt rồi. Chọn chiếc khác.`;s.feedback='wrong';s.feedbackTime=.8;api.tone(150);}else if(s.cursor===expected){s.sequence.push(s.cursor);s.step++;s.message=s.step===8?'ĐÚNG · Bát trơn đã có chỗ. Phù Hoa ngồi xuống cùng mọi người.':`ĐÚNG · Bát ${bowl.name} đã về đúng chỗ.`;s.feedback='correct';s.feedbackTime=.8;api.tone(620+s.step*35);}else{s.message=`SAI · Lượt này cần bát ${BOWLS[expected].name}. Bát đang chọn là của ${bowl.name}.`;s.feedback='wrong';s.feedbackTime=.8;api.tone(150);}if(s.step===8)s.done=true;}
 }else if(s.type==='hide'){
  if(pressed.has('ArrowLeft')||pressed.has('KeyA'))s.cursor=clamp(s.cursor-1,0,9);
  if(pressed.has('ArrowRight')||pressed.has('KeyD'))s.cursor=clamp(s.cursor+1,0,9);
  const d=Math.abs(s.cursor-s.target);s.message=d===0?'Tiếng cười ngay sau bức bình phong.':d<2?'Chuông gió rung rất gần.':d<4?'Có tiếng bước chân nhẹ.':'Chỉ có tiếng gió.';
  if(pressed.has('KeyE')){s.attempts++;if(d===0){s.done=true;s.message='Hai chị em cùng bật cười sau bức bình phong.';api.tone(880);}else api.tone(190);}
 }else if(s.type==='painting'){
  if(pressed.has('KeyE')){const q=Math.abs(s.pulse-.5);if(q<.105){s.score++;s.message='Nét mực đã bắt đúng thần sắc.';api.tone(720+s.score*80);}else{s.score=Math.max(0,s.score-1);s.message='Mực loang. Chờ hơi thở ổn định.';api.tone(170);}s.pulse=0;if(s.score>=3)s.done=true;}
 }else if(s.type==='moon'){
  if(s.step===0){
   if(pressed.has('KeyE')){const q=Math.abs(s.pulse-.5);if(q<.11){s.step=1;s.hold=0;s.message='Bàn tay đã đặt lên chuôi. Bây giờ buông nó ra.';api.tone(620);}else{s.message='Vội quá. Nghe hết nhịp kiếm trước khi chạm vào.';s.pulse=0;api.tone(150);}}
  }else if(s.step===1){
   if(keys.size===0)s.hold+=dt;else s.hold=Math.max(0,s.hold-dt*1.6);
   if(s.hold>=1.8){s.step=2;s.hold=0;s.message='Không có đòn đánh nào đến. Hãy tra điều chưa rút vào vỏ.';api.tone(700);}
  }else{
   s.hold=keys.has('KeyE')?s.hold+dt:Math.max(0,s.hold-dt*.35);if(s.hold>=3){s.done=true;s.message='Lưỡi kiếm chưa từng rời vỏ. Đêm nay không có người thắng.';api.tone(760);}
  }
 }else if(s.type==='testimony'){
  if(pressed.has('ArrowLeft')||pressed.has('KeyA'))s.choice=(s.choice+2)%3;
  if(pressed.has('ArrowRight')||pressed.has('KeyD'))s.choice=(s.choice+1)%3;
  if(confirm){const answers=[1,2,0];if(s.choice===answers[s.step]){s.step++;s.feedback='correct';s.feedbackTime=.8;s.message=s.step===3?'ĐÚNG · Ba lời khai đã khớp với vật chứng.':'ĐÚNG · Mảnh này có vết mực thật. Chọn lời khai kế tiếp.';api.tone(680+s.step*50);}else{s.feedback='wrong';s.feedbackTime=.8;s.message='SAI · Lời này do Mnemosyne chèn vào. Hãy đổi mảnh rồi xác nhận lại.';api.tone(145);}if(s.step===3)s.done=true;}
 }else if(s.type==='rescue'){
  const hot=s.pulse>.43&&s.pulse<.57;if(pressed.has('KeyK')){if(hot){s.score++;s.message='Quyền kình bị bẻ lệch. Phù Hoa còn thở.';api.tone(900);}else{s.score=Math.max(0,s.score-1);s.message='Quá sớm. Nhìn ánh đỏ trên lưỡi kiếm.';api.tone(130);}s.pulse=0;if(s.score>=3)s.done=true;}
 }else if(pressed.has('KeyE')){s.step++;if(s.step>=3)s.done=true;}
}

function panel(ctx,x,y,w,h,fill='#16212aee'){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);ctx.strokeStyle='#7e9298';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);}
function txt(ctx,text,x,y,size=15,color='#e7ede9',align='center'){ctx.fillStyle=color;ctx.font=`600 ${size}px Segoe UI`;ctx.textAlign=align;ctx.fillText(text,x,y);}
function wrap(ctx,text,x,y,maxWidth,lineHeight,maxLines=2){const words=String(text).split(/\s+/);let line='',lines=[];for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);lines.slice(0,maxLines).forEach((value,i)=>ctx.fillText(value,x,y+i*lineHeight));}
const EVIDENCE_CELLS={red_shadow_fragment:0,wanru_bandage:1,silent_bell:2,wooden_bowl:3,blindfold:4,wind_chime:4,unfinished_portrait:5,moon_sheath:6};
function drawEvidence(ctx,art,kind,x,y,size=120,alpha=1,filter='none'){const cell=EVIDENCE_CELLS[kind];if(!art||cell===undefined)return false;const sw=art.width/4,sh=art.height/2;ctx.save();ctx.globalAlpha=alpha;ctx.filter=filter;ctx.imageSmoothingEnabled=true;ctx.drawImage(art,cell%4*sw,Math.floor(cell/4)*sh,sw,sh,x-size/2,y-size/2,size,size);ctx.restore();return true;}
function drawBowlMark(ctx,bowl,x,y,placed){if(!bowl.pattern)return;ctx.save();ctx.globalAlpha=placed?.54:.98;ctx.fillStyle='#1d1b1a';const pixel=3,ox=x-10.5,oy=y-13.5;for(let row=0;row<7;row++)for(let col=0;col<7;col++)if(bowl.pattern[row][col]==='1')ctx.fillRect(ox+col*pixel+1,oy+row*pixel+1,pixel,pixel);ctx.fillStyle=bowl.ink;for(let row=0;row<7;row++)for(let col=0;col<7;col++)if(bowl.pattern[row][col]==='1')ctx.fillRect(ox+col*pixel,oy+row*pixel,pixel-1,pixel-1);ctx.restore();}
function drawChapterSixEvidence(ctx,assets,kind,x,y,size=120){const map={lightning_rod:[assets?.quanta,0,3],memory_core:[assets?.quanta,1,3],reality_bubble:[assets?.quanta,2,3],claw_plush:[assets?.keepsakes,0,2],memory_flower:[assets?.keepsakes,1,2]},entry=map[kind];if(!entry||!entry[0])return false;const [art,cell,count]=entry,sw=art.width/count,sh=art.height;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(art,cell*sw,0,sw,sh,x-size/2,y-size/2,size,size);ctx.restore();return true;}
function drawChapterSevenEvidence(ctx,assets,kind,x,y,size=120){const cell={hairpin:0,burnt_notebook:1,burnt_apron:2,sounding_bell:3,illusion_spray:4,error_log:5,memory_zero:6,burnt_noodles:7}[kind];if(cell===undefined||!assets?.imaginary)return false;const art=assets.imaginary,sw=art.width/4,sh=art.height/2;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(art,(cell%4)*sw,Math.floor(cell/4)*sh,sw,sh,x-size/2,y-size/2,size,size);ctx.restore();return true;}
function drawScreen(ctx,x,y,h,selected=false){ctx.save();if(selected){ctx.shadowColor='#b8e7d8';ctx.shadowBlur=18;}const g=ctx.createLinearGradient(x,y,x+58,y+h);g.addColorStop(0,selected?'#667d78':'#52615e');g.addColorStop(.55,'#273337');g.addColorStop(1,'#182328');ctx.fillStyle=g;ctx.fillRect(x,y,58,h);ctx.strokeStyle=selected?'#c2e9dd':'#778581';ctx.lineWidth=selected?3:2;ctx.strokeRect(x,y,58,h);ctx.shadowBlur=0;ctx.strokeStyle='#8b6f58';ctx.lineWidth=2;ctx.strokeRect(x+6,y+7,46,h-14);ctx.strokeStyle='#65736f';for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(x+8,y+30+k*38);ctx.lineTo(x+50,y+30+k*38);ctx.stroke();}ctx.fillStyle='#91725c';ctx.fillRect(x-3,y-7,64,8);ctx.fillStyle='#303c3d';ctx.beginPath();ctx.moveTo(x+8,y+h-12);ctx.lineTo(x+29,y+25);ctx.lineTo(x+50,y+h-12);ctx.stroke();ctx.restore();}
function narrativeIndex(s){const count=s.quest?.panels?.length||0;if(!count)return -1;if(s.done)return count-1;if(s.type==='bowls')return clamp(Math.floor(s.step/2),0,count-1);if(s.type==='hide')return clamp(Math.floor(s.attempts/2),0,count-1);if(['painting','graffiti'].includes(s.type))return clamp(s.score,0,count-1);if(s.type==='moon')return clamp(s.step+(s.step===2&&s.hold>1.4?1:0),0,count-1);return clamp(s.step,0,count-1);}
function drawNarrative(ctx,s){const i=narrativeIndex(s),entry=i>=0?s.quest.panels[i]:null;if(!entry)return;const speaker=Array.isArray(entry)?entry[0]:entry.speaker,text=Array.isArray(entry)?entry[1]:entry.text;panel(ctx,154,105,844,82,'#101a20ef');txt(ctx,speaker,179,132,13,'#abd8ca','left');ctx.fillStyle='#e1e9e5';ctx.font='500 14px Segoe UI';ctx.textAlign='left';wrap(ctx,text,179,156,794,19,2);}
export function drawMemoryTrial(ctx,s,assets,W=1152,H=648){
 const bg=assets?.background;if(bg)ctx.drawImage(bg,0,0,bg.width,bg.height,0,0,W,H);else{ctx.fillStyle='#17242a';ctx.fillRect(0,0,W,H);}ctx.fillStyle='#08101466';ctx.fillRect(0,0,W,H);
 panel(ctx,76,48,1000,520);txt(ctx,'KÝ ỨC PHỤ · '+s.title.toUpperCase(),576,84,21,'#d7e3dd');
 drawNarrative(ctx,s);
 if(s.type==='salvage'){drawChapterSevenEvidence(ctx,assets,'burnt_apron',576,224,120);const items=['Chiếc nồi','Đôi đũa','Bát mì'];for(let i=0;i<3;i++){const x=310+i*265;panel(ctx,x-88,340,176,110,i===s.cursor?'#4d354dee':'#1a272dee');drawChapterSevenEvidence(ctx,assets,i===0?'burnt_noodles':i===1?'burnt_notebook':'burnt_apron',x,380,76);txt(ctx,items[i],x,430,13,i===s.cursor?'#ffe0ef':'#9aaba8');}}
 else if(s.type==='temptation'){if(s.step===0){for(let i=0;i<7;i++){const x=190+i*128;ctx.fillStyle='#f4ead8bb';ctx.beginPath();ctx.arc(x,282,20,0,Math.PI*2);ctx.fill();ctx.fillRect(x-23,304,46,105);}ctx.fillStyle='#e3c96d';ctx.fillRect(210,445,730*clamp(s.hold/2.2,0,1),12);}else if(s.step===1){ctx.strokeStyle='#e35f91';ctx.lineWidth=6;for(let i=0;i<5;i++){ctx.strokeRect(300+i*115,260,78,126);if(i<s.score){ctx.beginPath();ctx.moveTo(300+i*115,260);ctx.lineTo(378+i*115,386);ctx.stroke();}}}else{drawChapterSevenEvidence(ctx,assets,'sounding_bell',576,235,130);for(let i=0;i<3;i++){const x=315+i*260;panel(ctx,x-100,340,200,100,i===s.choice?'#4b3a55ee':'#1a272dee');txt(ctx,['Lời xin lỗi','Ký ức thật','Bát nước'][i],x,398,15,i===s.choice?'#ffe1ee':'#9aaba8');}}}
 else if(s.type==='graffiti'){drawChapterSevenEvidence(ctx,assets,'illusion_spray',576,220,130);for(let i=0;i<4;i++){const x=260+i*205;ctx.fillStyle=i<s.score?'#d94f7c':'#eee9e2';ctx.fillRect(x-70,330,140,120);ctx.strokeStyle='#5d4d65';ctx.strokeRect(x-70,330,140,120);if(i<s.score){ctx.fillStyle='#241d32';ctx.font='bold 26px Segoe UI';ctx.textAlign='center';ctx.fillText(i===2?'YATTA':'×‿×',x,400);}}ctx.fillStyle='#273039';ctx.fillRect(256,480,640,12);ctx.fillStyle='#e66493';ctx.fillRect(256+s.pulse*640-8,466,16,40);}
 else if(s.type==='bowls'){
  const owner=BOWLS[BOWL_ORDER[Math.min(s.step,7)]];
  txt(ctx,`LƯỢT ${Math.min(s.step+1,8)}/8 · TÌM BÁT CỦA ${owner.name.toUpperCase()}`,576,225,18,'#d9e9e1');
  txt(ctx,s.step===7?'Chiếc bát trơn để dành cho người thầy.':'Đọc tên và dấu khắc dưới từng bát rồi đặt đúng người.',576,253,13,'#a9beb5');
  const cardW=106,gap=12,start=(W-(cardW*8+gap*7))/2;
  for(let i=0;i<8;i++){
   const bowl=BOWLS[i],x=start+i*(cardW+gap),cx=x+cardW/2,placed=s.sequence.includes(i),selected=s.cursor===i;
   panel(ctx,x,286,cardW,169,selected?'#304842ee':placed?'#1c2d2bee':'#17252aee');
   ctx.strokeStyle=selected?(s.feedback==='wrong'?'#ec8d91':'#c3ead9'):placed?'#65887b':'#657b7c';ctx.lineWidth=selected?3:1.5;ctx.strokeRect(x+2,288,cardW-4,165);
   txt(ctx,String(i+1).padStart(2,'0'),x+11,305,10,selected?'#cfe9de':'#79908d','left');
   ctx.save();ctx.globalAlpha=placed?.5:1;drawEvidence(ctx,assets?.evidence,'wooden_bowl',cx,357,84,1);drawBowlMark(ctx,bowl,cx,357,false);ctx.restore();
   if(placed)txt(ctx,'✓',x+cardW-14,307,15,'#a2ddbd');
   txt(ctx,bowl.name,cx,414,13,selected?'#f3fff8':placed?'#93b8a5':'#d2ded7');
   txt(ctx,bowl.mark,cx,438,10,selected?bowl.ink:'#a2b5af');
  }
  if(s.feedback==='wrong')txt(ctx,'✕',start+s.cursor*(cardW+gap)+cardW/2,356,28,'#f4a5a8');
 }
 else if(s.type==='hide'){drawEvidence(ctx,assets?.evidence,s.quest.item,576,242,112,.95);txt(ctx,'VẬT CHỨNG · '+(s.quest.keepsake||s.title),576,292,11,'#c6ded6');for(let i=0;i<10;i++){const x=144+i*88,y=318-(i%2)*18;drawScreen(ctx,x,y,135+(i%2)*18,i===s.cursor);}const rings=4-Math.min(3,Math.abs(s.cursor-s.target));for(let r=0;r<rings;r++){ctx.strokeStyle=`rgba(185,230,218,${.2+r*.13})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(173+s.cursor*88,304,30+r*18,0,Math.PI*2);ctx.stroke();}}
 else if(s.type==='painting'){drawEvidence(ctx,assets?.evidence,'unfinished_portrait',576,310,210,1);ctx.fillStyle='#26353b';ctx.fillRect(256,430,640,18);ctx.fillStyle='#aacdc2';ctx.fillRect(256+s.pulse*640-10,416,20,46);ctx.fillStyle='#d8b9a8aa';ctx.fillRect(256+640*.43,422,640*.14,34);txt(ctx,'Canh vệt sáng vào vùng mực.',576,404,14,'#cbdad4');}
 else if(s.type==='rescue'){ctx.fillStyle='#33434a';ctx.fillRect(236,330,680,24);ctx.fillStyle='#aacdc2';ctx.fillRect(236+s.pulse*680-12,314,24,56);ctx.fillStyle='#d8b9a8';ctx.fillRect(236+680*.43,320,680*.14,44);txt(ctx,'Bẻ nhịp kiếm khi vệt đỏ vào trung tâm.',576,275,17,'#cbdad4');}
 else if(s.type==='moon'){ctx.fillStyle='#dce8dcdd';ctx.beginPath();ctx.arc(576,300,68,0,Math.PI*2);ctx.fill();drawEvidence(ctx,assets?.evidence,'moon_sheath',576,325,245,1);ctx.fillStyle='#1d2a32';ctx.fillRect(394,445,365,13);const amount=s.step===0?1-Math.min(1,Math.abs(s.pulse-.5)*2):s.step===1?clamp(s.hold/1.8,0,1):clamp(s.hold/3,0,1);ctx.fillStyle=s.step===0?'#d6bea0':'#a8cbc1';ctx.fillRect(394,445,365*amount,13);txt(ctx,s.step===0?'CHẠM ĐÚNG NHỊP':s.step===1?'BUÔNG TAY · ĐỨNG YÊN':'TRA KIẾM · KHÔNG RÚT RA',576,420,15,'#cbdad4');}
 else{if(!drawEvidence(ctx,assets?.evidence,s.quest.item,576,244,124,1)&&!drawChapterSixEvidence(ctx,assets,s.quest.item,576,244,134))drawChapterSevenEvidence(ctx,assets,s.quest.item,576,244,134);txt(ctx,'VẬT CHỨNG · '+(s.quest.keepsake||s.title),576,302,11,'#c6ded6');const choiceW=216,choiceGap=28,total=choiceW*3+choiceGap*2,start=(W-total)/2,choiceY=330;for(let i=0;i<3;i++){const selected=i===s.choice,wrong=selected&&s.feedback==='wrong',correct=selected&&s.feedback==='correct',shake=wrong?Math.sin(s.time*72)*7*(s.feedbackTime/.8):0,x=start+i*(choiceW+choiceGap)+shake;panel(ctx,x,choiceY,choiceW,118,selected?(wrong?'#4a292fee':correct?'#244c43ee':'#344b50ee'):'#1a272dee');ctx.strokeStyle=wrong?'#ff7f87':correct?'#79e0b7':selected?'#c5efe1':'#63777a';ctx.lineWidth=selected?4:2;ctx.strokeRect(x+2,choiceY+2,choiceW-4,114);txt(ctx,s.type==='keepsake'?['Dấu vết thật','Ký ức chen','Lời của Mnemosyne'][(i+s.step)%3]:['Vết tro','Nét mực','Tiếng kiếm'][(i+s.step)%3],x+choiceW/2,382,16,selected?'#e5f7f0':'#9aaba8');if(selected){txt(ctx,wrong?'SAI · ĐỔI MẢNH':correct?'ĐÚNG':'E · XÁC NHẬN',x+choiceW/2,425,11,wrong?'#ff9aa0':correct?'#9ff0cf':'#bce8db');}}}
 const messageColor=s.feedback==='wrong'?'#ff9aa0':s.feedback==='correct'?'#9ff0cf':'#d7dfd9';txt(ctx,s.message||memoryTrialObjective(s),576,492,15,messageColor);
 if(!s.done&&['testimony','bowls'].includes(s.type))txt(ctx,'A / D hoặc ← / → để chọn · E / ENTER để xác nhận',576,535,12,'#91aaa5');
 if(s.done){ctx.fillStyle='#0c1519';ctx.fillRect(250,180,652,230);ctx.strokeStyle='#adc9bf';ctx.lineWidth=2;ctx.strokeRect(250,180,652,230);txt(ctx,'KÝ ỨC ĐÃ ĐƯỢC GIỮ LẠI',576,260,23,'#dcebe5');txt(ctx,'E / ENTER · TRỞ VỀ HÀNH TRÌNH',576,337,14,'#a9c8be');}
}
