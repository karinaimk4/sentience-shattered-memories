export const COURTYARD_TASKS=[
 {id:'leaves',name:'QUÉT LÁ THEO GIÓ',tier:1,weapon:null,mark:'Chiếu đã trải ở hiên'},
 {id:'water',name:'GÁNH NƯỚC',tier:1,weapon:'chain',mark:'Chum đã đầy nước'},
 {id:'post',name:'SỬA CỌC TẬP',tier:1,weapon:'chain',mark:'Hàng cọc đã thẳng'},
 {id:'wood',name:'CHẺ CỦI',tier:1,weapon:'spear',mark:'Đống củi đã xếp cạnh bếp'},
 {id:'blanket',name:'PHƠI CHĂN',tier:2,weapon:'chain',mark:'Chăn trắng đang bay trên sào'},
 {id:'garden',name:'VƯỜN RAU VÀ TRÀ',tier:2,weapon:'sword',mark:'Vườn đã xanh lại'},
 {id:'cat',name:'DỤ MÈO HOANG',tier:2,weapon:null,mark:'Mèo đang nằm ở hiên'},
 {id:'bell',name:'ĐÁNH CHUÔNG CHIỀU',tier:3,weapon:'spear',mark:'Chim đã quay về mái'},
 {id:'roof',name:'VÁ MÁI HIÊN',tier:3,weapon:'chain',mark:'Mái hiên đã liền lại'},
 {id:'tea',name:'PHA TRÀ · 5 BƯỚC',tier:3,weapon:null,mark:'Hai chén trà ở bậc hiên'}
];
const TASK_INDEX=Object.fromEntries(COURTYARD_TASKS.map((t,i)=>[t.id,i]));
const DIALOGUE={
 leaves:[['Phù Hoa','Cành cây sẽ rung trước khi gió tới. Quét xuôi theo gió.'],['Senti','Ta có thể quét nhanh hơn cả gió.']],
 water:[['Senti','Đổ có một nửa thôi. Nửa còn lại là tính toán chiến thuật.'],['Phù Hoa','Chum nước không đồng ý với tính toán đó.']],
 post:[['Phù Hoa','Cọc tập không cần bị đánh bại.'],['Senti','Nó có thái độ trước.']],
 wood:[['Senti','Thớt này yếu quá.'],['Phù Hoa','Nó đã ở đây ba mươi năm.'],['Senti','Thì nó nghỉ hưu được rồi.']],
 blanket:[['Phù Hoa','…Gió hướng đông.'],['Senti','Ta biết. Ta chỉ thử độ phủ của chăn.']],
 garden:[['Senti','Triều Vũ không ăn hành mà.'],['Phù Hoa','Đó không phải lý do để cắt cả luống.']],
 cat:[['Senti','Đứng yên là kỹ năng khó nhất ở Thái Hư.'],['Phù Hoa','Ta biết.']],
 bell:[['Phù Hoa','Chậm. Nhanh. Chậm. Đó là nhịp của sân sau.'],['Senti','Một cái chuông biết cãi lời. Ta thích nó.']],
 roof:[['Senti','Ta cố ý rơi vào đống lá.'],['Phù Hoa','Cậu vừa phải quét lại lần thứ ba.']],
 tea:[['Phù Hoa','Sân này… hình như không còn yên tĩnh như trước.'],['Senti','Cô nói như thể đó là chuyện xấu.'],['Phù Hoa','…Không. Không phải chuyện xấu.']]
};

export function ensureCourtyard(save){
 if(!save.courtyard||typeof save.courtyard!=='object')save.courtyard={tasks:{},secret:false,visited:false,teaTypes:[],tomorrow:false,decor:[]};
 save.courtyard.tasks=save.courtyard.tasks&&typeof save.courtyard.tasks==='object'?save.courtyard.tasks:{};
 save.courtyard.teaTypes=Array.isArray(save.courtyard.teaTypes)?save.courtyard.teaTypes:[];
 save.courtyard.decor=Array.isArray(save.courtyard.decor)?save.courtyard.decor:[];
 return save.courtyard;
}
export function courtyardTier(save){const events=new Set(save.storyEvents||[]),branches=['ch5-branch-a','ch5-branch-b','ch5-branch-c'].filter(x=>events.has(x)).length;return events.has('ch5-night-silent')?3:branches>=2?2:1;}
export function createCourtyardState(save){ensureCourtyard(save).visited=true;return {x:210,task:null,taskState:null,board:false,selected:0,time:0,wind:0,message:'E · MỞ BẢNG VIỆC VẶT',messageTime:0,exitHold:0};}
export function courtyardComplete(save){const c=ensureCourtyard(save);return COURTYARD_TASKS.filter(t=>c.tasks[t.id]==='done').length;}
function beginTask(state,task,api){state.board=false;state.task=task.id;state.taskState={t:0,progress:0,fails:0,stage:0,meter:0,water:100,targets:[],hits:0,choice:0,left:0,right:0,hold:0,sequence:[],idle:0,balance:0};api.selectWeapon?.(task.weapon);api.toast(`VIỆC VẶT ${TASK_INDEX[task.id]+1}/10 · ${task.name}`,2.4);}
function fail(state,text,api){state.taskState.fails++;state.message=text;state.messageTime=2.6;api.toast(text,2.2);}
function teaDialogue(kind){
 if(kind==='trà cúc')return [['Phù Hoa','Uyển Như thích trà cúc. Con bé bảo nó có mùi nắng.'],['Senti','Thì giờ cô uống phần của con bé.'],['Phù Hoa','Ừ. Và ta sẽ nhớ đã có người ngồi đối diện.']];
 if(kind==='trà lá rụng')return [['Phù Hoa','…Có vị gì đó rất lạ.'],['Senti','Vị của việc có người làm phiền cô.'],['Phù Hoa','Ừ. Không tệ.']];
 return DIALOGUE.tea;
}
function finish(state,save,task,api){const c=ensureCourtyard(save),taskState=state.taskState,brewedTea=taskState?.tea||'trà xanh';c.tasks[task.id]='done';if(!c.decor.includes(task.id))c.decor.push(task.id);if(task.id==='garden'&&!c.teaTypes.includes('cúc'))c.teaTypes.push('cúc');if(task.id==='leaves'&&taskState?.fails>0&&!c.teaTypes.includes('lá rụng'))c.teaTypes.push('lá rụng');api.addEvent?.('ch5-courtyard-task-'+task.id);state.task=null;state.taskState=null;state.message=`HOÀN THÀNH · ${task.name}`;state.messageTime=3;api.unlock?.('5-02','white',task.id==='tea'?'Hai Chén Trà':null);if(task.id==='tea'){api.unlock?.('5-02','green','Hai Chén Trà');api.addEvent?.('ch5-courtyard-tea');}
 if(courtyardComplete(save)===10){c.tomorrow=true;api.unlock?.('5-02','red','Hai Chén Trà');api.addEvent?.('ch5-courtyard-all');api.dialogue?.([...(task.id==='tea'?teaDialogue(brewedTea):[]),['Bảng Việc Vặt','Phù Hoa cầm bút, tự viết thêm một dòng dưới danh sách.'],['Bảng Việc Vặt','“Ngày mai: uống trà với Senti.”']],()=>{});}else api.dialogue?.(task.id==='tea'?teaDialogue(brewedTea):DIALOGUE[task.id]||[],()=>{});api.persist?.();}
function taskAvailable(save,task){if(task.tier>courtyardTier(save))return false;if(task.id==='tea')return COURTYARD_TASKS.slice(0,9).every(t=>ensureCourtyard(save).tasks[t.id]==='done');return true;}

export function updateCourtyard(state,save,dt,input,api){
 state.time+=dt;state.wind=Math.sin(state.time*1.45);state.messageTime=Math.max(0,state.messageTime-dt);const c=ensureCourtyard(save),tier=courtyardTier(save);
 if(state.board){if(input.pressed.has('Escape')){state.board=false;return;}if(input.pressed.has('ArrowUp')||input.pressed.has('KeyW'))state.selected=(state.selected+COURTYARD_TASKS.length-1)%COURTYARD_TASKS.length;if(input.pressed.has('ArrowDown')||input.pressed.has('KeyS'))state.selected=(state.selected+1)%COURTYARD_TASKS.length;if(input.pressed.has('Enter')||input.pressed.has('KeyE')){const task=COURTYARD_TASKS[state.selected];if(c.tasks[task.id]==='done')api.toast('VIỆC NÀY ĐÃ XONG',1.4);else if(!taskAvailable(save,task))api.toast(task.tier>tier?'TIẾP TỤC MẠCH CHÍNH ĐỂ MỞ':'HOÀN THÀNH 9 VIỆC TRƯỚC',2);else beginTask(state,task,api);}return;}
 const moving=input.keys.has('ArrowLeft')||input.keys.has('KeyA')||input.keys.has('ArrowRight')||input.keys.has('KeyD');let dir=(input.keys.has('ArrowRight')||input.keys.has('KeyD')?1:0)-(input.keys.has('ArrowLeft')||input.keys.has('KeyA')?1:0);state.x=Math.max(70,Math.min(1080,state.x+dir*230*dt));
 if(!state.task){if(state.x<210&&input.pressed.has('KeyE')){state.board=true;return;}if(state.x>1030&&input.pressed.has('KeyE')){api.exit?.();return;}if(Math.abs(state.x-510)<65&&input.pressed.has('KeyE')&&!c.secret){c.secret=true;api.unlock?.('5-02','green');api.dialogue?.([['Phù Hoa','Triều Vũ theo ta từ năm sáu tuổi. Năm nào con bé cũng bắt ta đo lại.'],['Senti','Cô đo chiều cao cho cả bảy người. Còn ai đo cho cô?'],['Phù Hoa','Ta không cao thêm nữa.'],['Senti','Ta không hỏi chuyện đó.']],()=>{});api.persist?.();}return;}
 const task=COURTYARD_TASKS[TASK_INDEX[state.task]],s=state.taskState;s.t+=dt;
 if(input.pressed.has('Escape')){state.task=null;state.taskState=null;api.toast('ĐÃ DỪNG VIỆC · CÓ THỂ LÀM LẠI',1.5);return;}
 if(task.id==='leaves'){
  if(!s.targets.length)s.targets=[{x:340,done:false},{x:610,done:false},{x:840,done:false}];const target=s.targets.find(q=>!q.done&&Math.abs(state.x-q.x)<75);if(target&&input.pressed.has('KeyE')){if(state.wind>-.15){target.done=true;s.progress++;api.toast(`GOM LÁ ${s.progress}/3`,1);}else{target.x=Math.max(270,Math.min(920,target.x-state.wind*160));fail(state,'GIÓ THỔI NGƯỢC · LÁ BAY VÀO ẤM TRÀ',api);}}if(s.progress>=3)finish(state,save,task,api);
 }else if(task.id==='water'){
  if(s.stage===0){s.meter=(s.meter+dt*.82)%1;if(input.pressed.has('KeyE')){if(s.meter>.38&&s.meter<.66){s.hits++;api.toast(`KÉO GÀU ${s.hits}/3`,.8);if(s.hits>=3){s.stage=1;state.x=220;}}else fail(state,'GIẬT QUÁ MẠNH · GÀU BAY LÊN MÁI',api);}}
  else{s.water=Math.max(0,s.water-(moving?dt*(Math.abs(dir)>0?4.4:0):0));if(input.pressed.has('Space'))s.water-=14;if(state.x>900){if(s.water>=45)finish(state,save,task,api);else{s.stage=0;s.hits=0;s.water=100;state.x=220;fail(state,'NƯỚC ĐỔ QUÁ NỬA · MÚC LẠI',api);}}}
 }else if(task.id==='post'){
  if(input.keys.has('KeyE')){s.hold=Math.min(1,s.hold+dt*.55);s.meter=s.hold;}else if(s.hold>0){if(s.hold>.42&&s.hold<.67)finish(state,save,task,api);else{s.hold=0;s.meter=0;fail(state,'CỌC XOAY MỘT VÒNG · ĐỔ NỬA CHUM NƯỚC',api);}}
 }else if(task.id==='wood'){
  s.meter=(Math.sin(s.t*3.1)+1)/2;if(input.pressed.has('KeyJ')||input.pressed.has('KeyE')){if(s.meter>.43&&s.meter<.59){s.hits++;api.toast(`CỦI ${s.hits}/6`,.7);if(s.hits>=6)finish(state,save,task,api);}else fail(state,s.fails===0?'KHÚC GỖ VĂNG ĐI':'SENTI CHẺ ĐÔI LUÔN CÁI THỚT',api);}
 }else if(task.id==='blanket'){
  s.meter=state.wind;if(input.pressed.has('KeyE')||input.pressed.has('KeyJ')){if(Math.abs(state.wind)<.28)finish(state,save,task,api);else fail(state,'CHĂN TRÙM KÍN ĐẦU PHÙ HOA · “…GIÓ HƯỚNG ĐÔNG.”',api);}
 }else if(task.id==='garden'){
  if(!s.targets.length)s.targets=[{x:280,type:'weed'},{x:390,type:'tea'},{x:500,type:'weed'},{x:620,type:'chrys'},{x:740,type:'weed'},{x:850,type:'tea'}].map(q=>({...q,done:false}));const target=s.targets.find(q=>!q.done&&Math.abs(state.x-q.x)<58);if(target&&(input.pressed.has('KeyJ')||input.pressed.has('KeyE'))){const cut=input.pressed.has('KeyJ');if(target.type==='weed'&&cut||target.type!=='weed'&&!cut){target.done=true;s.progress++;}else fail(state,target.type==='weed'?'CỎ CẦN DÙNG KIẾM CẮT':'SENTI CẮT GỌN CẢ LUỐNG HÀNH',api);}if(s.progress>=6)finish(state,save,task,api);
 }else if(task.id==='cat'){
  if(s.stage===0&&input.pressed.has('KeyE')){s.stage=1;s.idle=0;api.toast('ĐÃ ĐẶT BÁT CÁ · NHẢ HẾT NÚT 5 GIÂY',2);}else if(s.stage===1){if(moving||input.pressed.size){s.idle=0;if(moving)fail(state,'MÈO CHẠY MẤT · ĐỨNG YÊN KHÓ THẬT',api);}else s.idle+=dt;if(s.idle>=5)finish(state,save,task,api);}
 }else if(task.id==='bell'){
  if(input.pressed.has('KeyE')||input.pressed.has('KeyJ')){const now=s.t;if(!s.sequence.length){s.sequence=[now];api.toast('CHẬM…',.7);}else{const expected=[1.2,.46,1.2][s.sequence.length-1],gap=now-s.sequence.at(-1);if(Math.abs(gap-expected)<.28){s.sequence.push(now);api.toast(s.sequence.length===2?'NHANH!':s.sequence.length===3?'CHẬM…':'ĐÚNG NHỊP',.7);if(s.sequence.length===4)finish(state,save,task,api);}else{s.sequence=[];fail(state,'CHUÔNG QUÁ TO · CẢ ĐÀN CHIM BAY KHỎI MÁI',api);}}}
 }else if(task.id==='roof'){
  s.balance+=dir*dt*1.7+Math.sin(s.t*2.2)*dt*.35;s.balance=Math.max(-1.2,Math.min(1.2,s.balance));if(Math.abs(s.balance)>1){s.balance=0;s.hits=0;fail(state,'SENTI TRƯỢT XUỐNG ĐÚNG ĐỐNG LÁ',api);}if(input.pressed.has('KeyE')){if(Math.abs(s.balance)<.32){s.hits++;api.toast(`NGÓI ${s.hits}/4`,.7);if(s.hits>=4)finish(state,save,task,api);}else fail(state,'MẤT THĂNG BẰNG · GIỮ A/D CHO KIM Ở GIỮA',api);}
 }else if(task.id==='tea')updateTea(state,save,dt,input,api,task,s);
}

function updateTea(state,save,dt,input,api,task,s){const c=ensureCourtyard(save);
 if(s.stage===0){if(input.pressed.has('KeyE')){s.stage=1;s.meter=.5;s.hold=0;api.toast('1/5 · ĐÃ MÚC NƯỚC TỪ CHUM',1.4);}}
 else if(s.stage===1){s.meter=Math.max(0,s.meter-dt*.2);if(input.pressed.has('KeyE'))s.meter=Math.min(1,s.meter+.17);if(s.meter>.38&&s.meter<.68)s.hold+=dt;else s.hold=Math.max(0,s.hold-dt*.8);if(s.meter>.86){s.meter=.45;fail(state,'QUẠT MẠNH QUÁ · TÀN TRO BAY KHẮP SÂN',api);}if(s.hold>=2.4){s.stage=2;s.choice=0;api.toast('2/5 · LỬA ĐÃ ỔN',1.2);}}
 else if(s.stage===2){const choices=['trà xanh',...(c.teaTypes.includes('cúc')?['trà cúc']:[]),...(c.teaTypes.includes('lá rụng')?['trà lá rụng']:[])];if(input.pressed.has('ArrowLeft')||input.pressed.has('KeyA'))s.choice=(s.choice+choices.length-1)%choices.length;if(input.pressed.has('ArrowRight')||input.pressed.has('KeyD'))s.choice=(s.choice+1)%choices.length;state.message=`3/5 · CHỌN ${choices[s.choice].toUpperCase()} · A/D + E`;if(input.pressed.has('KeyE')){s.tea=choices[s.choice];s.stage=3;s.meter=0;}}
 else if(s.stage===3){s.meter=(s.meter+dt*.24)%1;if(input.pressed.has('KeyE')){if(s.meter>.48&&s.meter<.64){s.stage=4;s.left=0;s.right=0;s.choice=0;api.toast('4/5 · NHIỆT VỪA',1.1);}else fail(state,s.meter<.48?'TRÀ CÒN NHẠT':'TRÀ SÔI TRÀO',api);}}
 else{if(input.pressed.has('ArrowLeft')||input.pressed.has('KeyA'))s.choice=0;if(input.pressed.has('ArrowRight')||input.pressed.has('KeyD'))s.choice=1;if(input.keys.has('KeyE')){if(s.choice===0)s.left=Math.min(1.2,s.left+dt*.28);else s.right=Math.min(1.2,s.right+dt*.28);}state.message=`5/5 · RÓT ĐỀU · CHÉN TRÁI ${Math.round(s.left*100)}% · PHẢI ${Math.round(s.right*100)}%`;if(s.left>.74&&s.right>.74&&s.left<1.05&&s.right<1.05&&Math.abs(s.left-s.right)<.09){if(!c.teaTypes.includes(s.tea))c.teaTypes.push(s.tea);finish(state,save,task,api);}else if(s.left>1.1||s.right>1.1){s.left=0;s.right=0;fail(state,'MỘT CHÉN BỊ TRÀN · RÓT LẠI CHO ĐỀU',api);}}
}

export function courtyardObjective(state,save){if(state.board)return 'BẢNG VIỆC VẶT · ↑↓ CHỌN · E BẮT ĐẦU · ESC ĐÓNG';if(!state.task)return state.x<250?'E · MỞ BẢNG VIỆC VẶT':state.x>980?'E · TRỞ LẠI ĐƯỜNG CHÍNH':Math.abs(state.x-510)<80&&!ensureCourtyard(save).secret?'E · XEM CỘT GỖ KHẮC VẠCH':'A/D DI CHUYỂN · BẢNG Ở BÊN TRÁI';const id=state.task,s=state.taskState;return ({leaves:'Đứng gần 3 đống lá · E quét khi gió xuôi',water:s.stage===0?'E khi kim ở vùng xanh để kéo gàu':'Mang nước sang chum bên phải · đừng chạy/nhảy',post:'Giữ E rồi thả khi lực ở vùng xanh',wood:'J/ E đúng thớ sáng · chẻ đủ 6 thanh',blanket:'E khi dải vải báo gió lặng',garden:'J cắt cỏ · E tưới rau/trà',cat:s.stage===0?'E đặt bát cá':'NHẢ HẾT NÚT · đứng yên 5 giây',bell:'Gõ E theo nhịp chậm – nhanh – chậm',roof:'A/D giữ thăng bằng · E đặt 4 viên ngói',tea:state.message||'E bắt đầu pha trà'})[id];}

function drawAsset(ctx,img,x,y,w,h,alpha=1,rotation=0){if(!img)return;const ratio=(img.naturalWidth||img.width)/(img.naturalHeight||img.height),box=w/h,dw=box>ratio?h*ratio:w,dh=box>ratio?h:w/ratio;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.translate(x+w/2,y+h/2);ctx.rotate(rotation);ctx.drawImage(img,-dw/2,-dh/2,dw,dh);ctx.restore();}

function drawCourtyardProps(ctx,state,done,assets){
 const active=state.task;
 if(done.has('roof')||active==='roof')drawAsset(ctx,assets.roof,790,48,300,118,done.has('roof')?1:.72);
 if(done.has('blanket')||active==='blanket')drawAsset(ctx,assets.blanket,655,136,245,178,done.has('blanket')?1:.72);
 if(done.has('bell')||active==='bell')drawAsset(ctx,assets.bell,505,213,132,174,done.has('bell')?1:.82);
 if(active==='post')drawAsset(ctx,assets.post,430,278,165,245,.9);
 if(done.has('garden')||active==='garden')drawAsset(ctx,assets.garden,735,431,220,92,done.has('garden')?1:.8);
 if(done.has('wood')||active==='wood')drawAsset(ctx,assets.firewood,956,421,162,112,done.has('wood')?1:.82);
 if(done.has('tea')||active==='tea')drawAsset(ctx,assets.teaSet,500,411,255,102,done.has('tea')?1:.8);
 if(done.has('water')||active==='water'){
  const carrying=active==='water'&&state.taskState?.stage===1;
  drawAsset(ctx,assets.waterYoke,carrying?state.x-82:245,carrying?350:399,carrying?165:145,carrying?108:95,done.has('water')||carrying?1:.68);
 }
 if(active==='leaves'&&state.taskState?.targets?.length){for(const pile of state.taskState.targets)drawAsset(ctx,assets.leaves,pile.x-47,438,94,63,pile.done?.22:1,Math.sin(state.time*2+pile.x)*.025);}
}

export function drawCourtyard(ctx,state,save,assets,drawSprite,label,W=1152,H=648){ctx.save();ctx.clearRect(0,0,W,H);ctx.drawImage(assets.background,0,0,W,H);ctx.fillStyle='#17202a2e';ctx.fillRect(0,0,W,H);const c=ensureCourtyard(save),done=new Set(Object.keys(c.tasks).filter(k=>c.tasks[k]==='done'));
 drawCourtyardProps(ctx,state,done,assets);
 // Bảng việc thật, cột khắc vạch và cửa ra.
 drawAsset(ctx,assets.board,30,204,176,264);label(`${courtyardComplete(save)} / 10`,118,297,'#d7e4de',12);label('E · XEM',118,458,'#dfe8e2',10);ctx.strokeStyle='#786b60';for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(493,280+i*18);ctx.lineTo(530,280+i*18);ctx.stroke();}label('CỘT KHẮC VẠCH',510,255,'#788b87',9);label('CỬA RA · E',1040,438,'#d8e3de',11);
 drawSprite(Math.floor(state.time*2)%6===0?'idle.7':'idle.5',state.x,510,1.25,state.x<875?1:-1,1,ctx);drawSprite('hua.0',900,510,1.1,-1,1,ctx);if(done.has('cat')||state.task==='cat')drawAsset(ctx,assets.cat,780,443,88,79,done.has('cat')?1:(state.taskState?.stage===1 ? .92 : .42));
 if(state.task)drawTaskHUD(ctx,state,label,W);if(state.board)drawBoard(ctx,state,save,label,W,H);if(state.messageTime>0){ctx.fillStyle='#111923dd';ctx.fillRect(270,520,612,46);label(state.message,576,549,'#f0f2ed',13);}ctx.restore();}
function drawTaskHUD(ctx,state,label,W){const s=state.taskState,task=COURTYARD_TASKS[TASK_INDEX[state.task]];ctx.fillStyle='#111923dc';ctx.fillRect(220,35,W-440,84);ctx.strokeStyle='#748a8a';ctx.strokeRect(220,35,W-440,84);label(`${TASK_INDEX[task.id]+1}/10 · ${task.name}`,W/2,64,'#eef2ed',16);let meter=s.meter;if(task.id==='roof')meter=(s.balance+1.2)/2.4;if(task.id==='water'&&s.stage===1)meter=s.water/100;if(task.id==='leaves')meter=s.progress/3;if(task.id==='wood')meter=s.hits/6;if(task.id==='garden')meter=s.progress/6;if(task.id==='cat')meter=s.idle/5;ctx.fillStyle='#33414a';ctx.fillRect(330,83,W-660,12);ctx.fillStyle='#9bcabe';ctx.fillRect(330,83,(W-660)*Math.max(0,Math.min(1,meter||0)),12);}
function drawBoard(ctx,state,save,label,W,H){ctx.fillStyle='#101720f2';ctx.fillRect(195,55,W-390,H-110);ctx.strokeStyle='#71818a';ctx.strokeRect(195,55,W-390,H-110);label('BẢNG VIỆC VẶT',W/2,88,'#edf1eb',20);const c=ensureCourtyard(save),tier=courtyardTier(save);COURTYARD_TASKS.forEach((task,i)=>{const y=126+i*38,done=c.tasks[task.id]==='done',available=taskAvailable(save,task);if(i===state.selected){ctx.fillStyle='#b6d6cc20';ctx.fillRect(235,y-23,W-470,32);ctx.strokeStyle='#9bcabe';ctx.strokeRect(235,y-23,W-470,32);}label(`${done?'✓':available?'○':'▣'} ${String(i+1).padStart(2,'0')} · ${task.name}`,265,y,done?'#9dc6aa':available?'#dde6e1':'#6f7b82',13,'left');label(task.tier===1?'ĐỢT 1':task.tier===2?'ĐỢT 2':'ĐỢT 3',850,y,task.tier<=tier?'#91aaa7':'#59636a',10);});if(c.tomorrow)label('Ngày mai: uống trà với Senti.',W/2,H-70,'#dce7e0',15);else label('↑↓ CHỌN · E BẮT ĐẦU · ESC ĐÓNG',W/2,H-70,'#94a5aa',11);}

