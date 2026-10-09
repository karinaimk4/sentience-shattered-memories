const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const ASSET = 'assets/event-demo';
const ingredientArt = {
  chicken: 'taixuan-chicken', pork: 'neon-pork', tuna: 'frozen-tuna', crab: 'dead-sea-crab',
  tomato: 'glitch-tomato', mushroom: 'memory-mushroom', bamboo: 'bamboo-shoot', seaweed: 'honkai-seaweed',
  tea: 'thousand-year-tea', ice: 'parvati-ice', spice: 'industrial-spice', core: 'heimdall-core'
};

const ingredients = [
  ['chicken', 'Gà Thái Hư'], ['pork', 'Thịt Lợn Neon'], ['tuna', 'Cá Ngừ Đóng Băng'], ['crab', 'Cua Biển Chết'],
  ['tomato', 'Cà Chua Nhiễu Sóng'], ['mushroom', 'Nấm Ký Ức'], ['bamboo', 'Măng Rừng'], ['seaweed', 'Rong Biển Honkai'],
  ['tea', 'Lá Trà Ngàn Năm'], ['ice', 'Đá Bào Parvati'], ['spice', 'Gia Vị Công Nghiệp'], ['core', 'Lõi Heimdall']
];

const recipes = [
  {id:'burnt-congee',name:'Bát Cháo Khê',stars:1,system:'YATTA',price:5,ingredients:['chicken'],desc:'Món thất bại làm khách khóc thét và rời bàn cực nhanh.'},
  {id:'pure-water',name:'Nước Lọc Trắng Sạch',stars:1,system:'ZEN',price:10,ingredients:['ice'],desc:'Khách kiên nhẫn cao, ăn uống từ tốn.'},
  {id:'arc-city-bao',name:'Bánh Bao Mưa Arc City',stars:1,system:'Cân bằng',price:15,ingredients:['pork','mushroom'],desc:'Món cứu đói bán chạy cho dân văn phòng.'},
  {id:'quantum-waste',name:'Chất Thải Lượng Tử',stars:1,system:'Khủng bố',price:0,ingredients:['tomato','ice','core'],desc:'Sai công thức hoàn toàn; Bronya phải hốt khách ra ngoài.'},
  {id:'eternal-shaved-ice',name:'Đá Bào Vĩnh Cửu',stars:2,system:'YATTA',price:45,ingredients:['ice','spice'],desc:'Buốt óc; khách nhí cực thích.'},
  {id:'glitch-salad',name:'Salad Nhiễu Sóng',stars:2,system:'ZEN',price:50,ingredients:['tomato','bamboo'],desc:'Healthy nhưng khách có thể bị lag khi ra cửa.'},
  {id:'honkai-seaweed-soup',name:'Canh Rong Biển Honkai',stars:2,system:'ZEN',price:60,ingredients:['seaweed','ice'],desc:'Tăng ZEN và xoa dịu Fu Hua.'},
  {id:'chrysanthemum-tea',name:'Trà Cúc Bát Gỗ',stars:2,system:'ZEN',price:75,ingredients:['tea','ice'],desc:'Khách ngồi lâu nhưng để lại Tip x2.'},
  {id:'yatta-roast-chicken',name:'Gà Quay YATTA',stars:3,system:'YATTA',price:150,ingredients:['chicken','spice'],desc:'Khách đứng lên ghế hô YATTA, lây hưng phấn toàn sảnh.'},
  {id:'apocalypse-pizza',name:'Pizza Khải Huyền',stars:3,system:'YATTA',price:180,ingredients:['pork','tomato'],desc:'Pizza cháy neon đặc sản của Kiana.'},
  {id:'dead-sea-fried-rice',name:'Cơm Chiên Biển Chết',stars:3,system:'Cân bằng',price:200,ingredients:['crab','mushroom'],desc:'No lâu, khách tip hào phóng.'},
  {id:'frozen-tuna-rolls',name:'Cá Ngừ Cuộn Rong Biển',stars:3,system:'ZEN',price:220,ingredients:['tuna','seaweed'],desc:'Yae Sakura làm món này đạt sản lượng x3.'},
  {id:'tea-smoked-bacon',name:'Thịt Xông Khói Vị Trà',stars:4,system:'Cân bằng',price:450,ingredients:['pork','tea'],desc:'Tẩy mọi debuff muộn phiền.'},
  {id:'memory-chicken-soup',name:'Súp Nấm Ký Ức Hầm Gà',stars:4,system:'ZEN',price:500,ingredients:['chicken','mushroom'],desc:'Khách nhớ nhà và khóc tu tu.'},
  {id:'frozen-noodles',name:'Mì Gói Băng Giá',stars:4,system:'YATTA',price:550,ingredients:['tuna','ice'],desc:'Mì bốc khói lạnh, Kevin rất thích.'},
  {id:'machine-core-skewers',name:'Xiên Nướng Lõi Máy',stars:4,system:'YATTA',price:600,ingredients:['core','tomato','spice'],desc:'Món đặc trị Chariot và Jizo.'},
  {id:'quantum-sichuan-hotpot',name:'Lẩu Tứ Xuyên Lượng Tử',stars:5,system:'YATTA MAX',price:2000,ingredients:['crab','pork','spice'],desc:'Lợi nhuận khổng lồ, Kalpas ăn xong dễ đốt quán.'},
  {id:'sunken-soup',name:'Canh Trầm Luân',stars:5,system:'ZEN MAX',price:2500,ingredients:['chicken','bamboo','mushroom','tea'],desc:'Điểm ZEN của quán lập tức max.'},
  {id:'thirteen-feast',name:'Đại Tiệc Mười Ba Anh Kiệt',stars:5,system:'Cân bằng',price:4000,ingredients:['crab','pork','mushroom','tea'],desc:'Mười ba món dọn bằng portal của Sirin.'},
  {id:'kiana-truth-dessert',name:'Tráng Miệng Chân Lý Kiana',stars:5,system:'???',price:5000,ingredients:['tuna','tea','tomato'],desc:'Ai cũng sợ, riêng Kiana sẵn sàng vét túi trả tiền.'}
].map(recipe => ({...recipe,img:`${ASSET}/food/${recipe.id}.png`}));

const staff = [
  {id:'rozaliya',name:'Rozaliya',role:'reception',rank:'A',skill:'+5% kiên nhẫn',flaw:'Hát mic trừ ZEN',icon:'🎤'},
  {id:'susannah',name:'Susannah',role:'reception',rank:'S',skill:'Đón khách cực nhiệt tình',flaw:'Có thể xếp nhầm bàn bẩn',icon:'🌻',sceneImage:`${ASSET}/characters/susannah-25d.png`},
  {id:'mobius',name:'Mobius',role:'reception',rank:'SR',skill:'Khóa thanh kiên nhẫn',flaw:'10% khách sợ bỏ chạy',icon:'🐍'},
  {id:'elysia',name:'Elysia',role:'reception',rank:'SSR',skill:'Khách auto u mê',flaw:'Combo Eden có thể bỏ việc',icon:'💗'},
  {id:'eden',name:'Eden',role:'reception',rank:'SSR',skill:'Tip rơi từ cửa',flaw:'Rủ Elysia uống rượu',icon:'🎼'},
  {id:'liliya',name:'Liliya',role:'server',rank:'A',skill:'Lướt ván kiếm siêu nhanh',flaw:'Ngủ rũ giữa đường',icon:'💤'},
  {id:'carole',name:'Carole',role:'server',rank:'S',skill:'Bưng cùng lúc 8 đĩa',flaw:'Đi chậm và có thể lủng sàn',icon:'🥊',sceneImage:`${ASSET}/characters/carole-25d.png`},
  {id:'seele',name:'Seele / Veliona',role:'server',rank:'SSR',skill:'Tip x3 hoặc xoay bàn x4',flaw:'Thể lực thấp thì mất Tip',icon:'🦋'},
  {id:'sirin',name:'Sirin',role:'server',rank:'SSR',skill:'Portal giao món tức thì',flaw:'Có thể úp đĩa lên đầu khách',icon:'🌀'},
  {id:'klein',name:'Klein',role:'cleaner',rank:'A',skill:'Dọn rác cực nhanh',flaw:'Dọn 3 bàn là ngất',icon:'🧽'},
  {id:'griseo',name:'Griseo',role:'cleaner',rank:'S',skill:'Biến rác thành +50 ZEN',flaw:'Tranh có thể chắn lối',icon:'🎨',sceneImage:`${ASSET}/characters/griseo-25d.png`},
  {id:'senti-clone',name:'Senti phân thân',role:'cleaner',rank:'SR',skill:'Ván trượt gom rác',flaw:'Tạt nước vào khách',icon:'🛹'},
  {id:'bronya',name:'Bronya',role:'cleaner',rank:'SSR',skill:'Project Bunny hút rác toàn map',flaw:'Thua Switch sẽ dỗi',icon:'🎮'},
  {id:'kiana',name:'Kiana Bạch Luyện',role:'chef',rank:'A',skill:'Nấu siêu tốc',flaw:'80% tỷ lệ khét',icon:'🍕',image:`${ASSET}/characters/kiana.png`},
  {id:'yae',name:'Yae Sakura',role:'chef',rank:'S',skill:'Sơ chế nhanh x3',flaw:'Không có tật xấu lớn',icon:'🌸',sceneImage:`${ASSET}/characters/yae-25d.png`},
  {id:'mei',name:'Raiden Mei',role:'chef',rank:'SSR',skill:'100% món hoàn hảo',flaw:'Không có',icon:'⚡'},
  {id:'villv',name:'Vill-V',role:'chef',rank:'SSR',skill:'Nấu 5 món cùng lúc',flaw:'10% nổ bếp gây Stun',icon:'🎩'},
  {id:'kira',name:'Shigure Kira',role:'buyer',rank:'A',skill:'Hát ru quái để lấy đồ rẻ',flaw:'Có thể hát nát nguyên liệu',icon:'🎙'},
  {id:'sushang',name:'Li Sushang',role:'buyer',rank:'S',skill:'Phi kiếm thu thập cực nhanh',flaw:'Mù đường hay về trễ',icon:'🗡',image:`${ASSET}/characters/li-sushang.png`},
  {id:'pardo',name:'Pardofelis',role:'buyer',rank:'SSR',skill:'Chợ đen giảm giá 30%',flaw:'Can tha đồ trang trí đi giấu',icon:'🐈',image:`${ASSET}/characters/pardofelis.png`},
  {id:'durandal',name:'Durandal',role:'buyer',rank:'SSR',skill:'Gom nguyên liệu x5',flaw:'Quăng quái sống vào quán',icon:'🐎'},
  {id:'amber',name:'Amber',role:'manager',rank:'A',skill:'Giảm 50% tật xấu hạng A',flaw:'Báo cáo che màn hình',icon:'📋'},
  {id:'theresa',name:'Theresa',role:'manager',rank:'S',skill:'Giảm 20% hao mòn',flaw:'Ngủ quầy để khách quỵt bill',icon:'✝'},
  {id:'himeko',name:'Himeko',role:'manager',rank:'SR',skill:'Hồi 30% stamina toàn quán',flaw:'Moi két mua bia cuối ca',icon:'🍺'},
  {id:'aponia',name:'Aponia',role:'manager',rank:'SSR',skill:'Ăn nhanh, Tip x3, không rác',flaw:'Stamina tụt nhanh gấp đôi',icon:'🦋'}
];

const roleNames = {reception:'Lễ tân',server:'Phục vụ',cleaner:'Dọn dẹp',chef:'Đầu bếp',buyer:'Thu mua',manager:'Quản lý'};
const roleIcons = {reception:'🪧',server:'🏃',cleaner:'🧹',chef:'🍳',buyer:'🛒',manager:'📊'};

const maps = [
  {id:'nagazora',name:'Phố Nagazora',symbol:'🌧',image:'nagazora.png',drops:['tomato','seaweed'],desc:'Cà chua nhiễu sóng · Rong biển Honkai'},
  {id:'arc',name:'Arc City',symbol:'🌃',image:'arc-city.png',drops:['pork','spice'],desc:'Thịt lợn neon · Gia vị công nghiệp'},
  {id:'babylon',name:'Babylon',symbol:'❄',image:'babylon.png',drops:['tuna','ice'],desc:'Cá ngừ đóng băng · Đá bào Parvati'},
  {id:'taixuan',name:'Thái Hư Sơn',symbol:'⛰',image:'taixuan.png',drops:['bamboo','chicken'],desc:'Măng rừng · Gà chạy bộ · Có tổ ong'}
];

const vips = [
  {id:'seven',name:'Thất Kiếm Ảo Ảnh',icon:'⚔',request:'Trà Cúc phải đắng',summary:'Quỵt tiền nhưng rớt vật liệu nâng cấp.',actions:[['tea','DỌN TRÀ CÚC ĐẮNG'],['kick','DÙNG XÍCH ĐUỔI RA']]},
  {id:'mnemosyne',name:'Thanh Tra Mnemosyne',icon:'◈',request:'Đĩa ăn chuẩn 100%',summary:'QTE ẩn cho phép hất đĩa vào mặt thanh tra.',actions:[['perfect','PHỤC VỤ PERFECT'],['throw','HẤT ĐĨA · BỐ ĐỜI']]},
  {id:'chariot',name:'Glitch Chariot',icon:'🛞',request:'Ăn sạch nguyên liệu sống',summary:'Bắn bánh bao chặn mồm trước khi nó ủi sập quán.',actions:[['bao','BẮN BÁNH BAO 0/3'],['raw','CHO ĂN NGUYÊN LIỆU SỐNG']]},
  {id:'kevin',name:'Kevin',icon:'❄',request:'Mì Băng Giá cay nhất',summary:'Phá băng quanh bàn để nhân viên mang mì vào.',actions:[['ice','ĐẬP BĂNG 0/3'],['noodle','BƯNG MÌ NGAY']]},
  {id:'hov',name:'Nữ Vương Hư Không',icon:'🌀',request:'Cupcake ngọt nhất',summary:'Ném cupcake vào ba hố đen đang hút đồ đạc.',actions:[['cupcake','NÉM CUPCAKE 0/3'],['submit','CÚI MÌNH PHỤC TÙNG']]},
  {id:'kalpas',name:'Kalpas',icon:'🔥',request:'Món YATTA cực đại',summary:'Ăn ngon sẽ đập bàn nhưng để lại 5.000 Xu.',actions:[['yatta','DỌN LẨU YATTA MAX'],['zen','DỌN CANH ZEN']]},
  {id:'jizo',name:'Jizo Mitama',icon:'👹',request:'Đòi lại Lõi Ký Ức #0',summary:'Menu ẩn Xiên Nướng Lõi Máy khiến nó quên đòi nợ.',actions:[['skewer','MỞ MENU ẨN · XIÊN LÕI'],['fight','TỪ CHỐI · CHIẾN ĐẤU']]}
];

const decor = [
  {id:'wood-table',name:'Bàn Trà Gỗ Trầm',style:'ZEN',score:20,cost:350,image:'taixuan-table',effect:'Khách không xả rác.'},
  {id:'quantum-stove',name:'Chảo Lửa Lượng Tử',style:'YATTA',score:30,cost:500,image:'quantum-stove',effect:'Nấu nhanh nhưng dễ nổ.'},
  {id:'service-counter',name:'Quầy Men Ngọc',style:'ZEN',score:15,cost:420,image:'service-counter',effect:'Giảm tỷ lệ nấu khét.'},
  {id:'peach-lantern',name:'Đèn Đỏ Mực',style:'YATTA',score:20,cost:260,image:'peach-lantern',effect:'Khách gọi thêm món.'},
  {id:'vip-table',name:'Bàn Tiệc Hội Cung',style:'ZEN',score:45,cost:1200,image:'vip-table',effect:'Tip VIP x3.'},
  {id:'bamboo-pot',name:'Chậu Trúc Tĩnh Tâm',style:'ZEN',score:12,cost:180,image:'bamboo-pot',effect:'Fu Hua tăng stress chậm.'},
  {id:'speaker',name:'Máy Loa Kéo',style:'YATTA',score:35,cost:580,image:'service-counter',effect:'Khách ăn nhanh hơn.'},
  {id:'inferno-oven',name:'Lò Nướng Hỏa Ngục',style:'YATTA',score:100,cost:0,image:'quantum-stove',effect:'Quà Kalpas · nấu 1 giây.'}
].map(item => ({...item,img:`${ASSET}/decor/${item.image}.png`}));

const phases = {
  morning:{kicker:'01 · BUỔI SÁNG',title:'Đi chợ & săn bắt',copy:'Phái nhân viên qua Cổng Lượng Tử lấy nguyên liệu hoặc mua nhanh ở Chợ Đen.',location:'CỔNG LƯỢNG TỬ · KHU THU MUA',objectives:['Chọn một khu thám hiểm','Phái nhân viên thu mua','Tích nguyên liệu cho menu tối']},
  afternoon:{kicker:'02 · BUỔI CHIỀU',title:'Nghiên cứu & chế biến',copy:'Thử công thức và trực tiếp hoàn thành chuỗi QTE Thái · Xào · Hầm.',location:'BẾP CHÍNH · KHU NGHIÊN CỨU',objectives:['Chọn công thức','Hoàn thành ba QTE','Chốt vị ZEN hoặc YATTA']},
  evening:{kicker:'03 · BUỔI TỐI',title:'Rush hour mở quán',copy:'Đón khách, nấu, bưng, thu tiền và dọn bàn trước khi thanh kiên nhẫn cạn.',location:'SẢNH CHÍNH · RUSH HOUR',objectives:['Mở cửa đón khách','Hoàn thành chuỗi phục vụ','Giữ Fu Hua không bốc hỏa']},
  night:{kicker:'04 · KHUYA',title:'Dọn dẹp & nâng cấp',copy:'Tổng kết Xu, quay Gacha, ghép bản vẽ, nâng bàn và mở rộng quán.',location:'PHÒNG QUẢN LÝ · SAU GIỜ ĐÓNG CỬA',objectives:['Rửa bát lấy bản vẽ','Quay Nồi Áp Suất Gacha','Nâng cấp bàn hoặc nhà hàng']}
};

const trends = [
  {title:'Trời lạnh · Súp x2 giá',boost:'memory-chicken-soup'},
  {title:'Trend ăn cay · Nấu YATTA nhanh 50%',boost:'quantum-sichuan-hotpot'},
  {title:'Ngày thanh tịnh · Tip món ZEN x2',boost:'chrysanthemum-tea'},
  {title:'Lễ hội Arc City · Pizza bán chạy',boost:'apocalypse-pizza'}
];

const defaultState = {
  day:7,phase:'morning',panel:'operate',coins:12800,rep:82,zen:46,yatta:54,stress:28,rage:62,
  level:2,shiftRevenue:0,served:0,trash:0,blueprints:4,trendIndex:0,selectedMap:'taixuan',
  inventory:{chicken:4,pork:3,tuna:2,crab:2,tomato:5,mushroom:4,bamboo:3,seaweed:4,tea:3,ice:4,spice:3,core:1},
  unlocked:recipes.filter(r=>r.stars<=3).map(r=>r.id).concat(['tea-smoked-bacon','memory-chicken-soup','frozen-noodles','machine-core-skewers']),
  selectedMenu:['arc-city-bao','chrysanthemum-tea','yatta-roast-chicken','dead-sea-fried-rice','frozen-tuna-rolls','memory-chicken-soup'],
  owned:['rozaliya','susannah','liliya','carole','klein','griseo','kiana','yae','kira','sushang','amber','theresa'],
  assigned:{reception:'susannah',server:'carole',cleaner:'griseo',chef:'yae',buyer:'sushang',manager:'theresa'},
  stamina:{},fragments:{},placedDecor:['wood-table','peach-lantern'],tableLevels:[2,2,1,3],achievements:[],
  lastCooked:'arc-city-bao',prepared:2,rushActive:false,rushTime:60,tables:[],calmBuff:false,gachaCount:0,
  tutorialSeen:false,aestheticDisaster:true
};

function loadState(){
  let saved={};
  try{saved=JSON.parse(localStorage.getItem('taixuan-event-demo-v1')||'{}')}catch{}
  return {
    ...structuredClone(defaultState),...saved,
    inventory:{...defaultState.inventory,...(saved.inventory||{})},
    stamina:{...defaultState.stamina,...(saved.stamina||{})},
    fragments:{...defaultState.fragments,...(saved.fragments||{})},
    assigned:{...defaultState.assigned,...(saved.assigned||{})},
    tables:[] ,rushActive:false,rushTime:60
  };
}

let state=loadState();
let rushInterval=null;
let qteInterval=null;
let toastTimer=null;
let selectedRole='all';
let activeVip=null;
let vipProgress=0;
let cooking=null;

for(const person of staff){if(state.stamina[person.id]==null)state.stamina[person.id]=100}

function save(){
  const transient={...state,rushActive:false,tables:[],rushTime:60};
  localStorage.setItem('taixuan-event-demo-v1',JSON.stringify(transient));
  const saveEl=$('#autosave-state');
  if(saveEl){saveEl.textContent='● ĐÃ LƯU TỰ ĐỘNG';saveEl.style.color='#68a34c'}
}

const fmt=n=>Math.round(n).toLocaleString('vi-VN');
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const getRecipe=id=>recipes.find(r=>r.id===id)||recipes[0];
const getStaff=id=>staff.find(s=>s.id===id);
const img=(path,alt='')=>`<img src="${path}" alt="${alt}">`;

function staffAvatar(person){
  const source=person?.image||person?.sceneImage;
  return source?img(source,person.name):`<span>${person?.icon||'?'}</span>`;
}

function toast(message){
  const el=$('#toast');
  el.textContent=message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('show'),2600);
}

function ticker(message){$('#event-ticker span').textContent=message}

function flash(message,angry=false){
  const el=document.createElement('div');
  el.className=`stage-flash${angry?' fu-hua-rage':''}`;
  el.textContent=message;
  $('#restaurant-stage').append(el);
  setTimeout(()=>el.remove(),760);
}

function updateStats(){
  $('#day-value').textContent=String(state.day).padStart(2,'0');
  $('#trend-title').textContent=trends[state.trendIndex%trends.length].title;
  $('#coins-value').textContent=fmt(state.coins);
  $('#rep-value').textContent=Math.round(state.rep);
  $('#zen-value').textContent=Math.round(state.zen);
  $('#yatta-value').textContent=Math.round(state.yatta);
  $('#balance-fill').style.width=`${clamp(state.zen/(state.zen+state.yatta||1)*100)}%`;
  $('#stress-value').textContent=`${Math.round(state.stress)}%`;
  $('#stress-fill').style.width=`${clamp(state.stress)}%`;
  $('#rage-value').textContent=`${Math.round(state.rage)}%`;
  $('#rage-fill').style.width=`${clamp(state.rage)}%`;
  $('#shift-revenue').textContent=fmt(state.shiftRevenue);
  $('#served-count').textContent=state.served;
  $('#trash-count').textContent=state.trash;
  $('#blueprint-count').textContent=`${state.blueprints} / 5`;
  $('#restaurant-level').textContent=`LV.${state.level} · ${state.level===1?'QUẦY XE ĐẨY':state.level===2?'QUÁN CƠM HELIOPOLIS':'TỬU LẦU ĐỈNH THÁI HƯ'}`;
  $('#rush-timer').textContent=state.rushActive?`CÒN ${state.rushTime}s`:(state.phase==='evening'?'CHỜ MỞ CỬA':'CHƯA MỞ QUÁN');
}

function renderPhaseBrief(){
  const phase=phases[state.phase];
  $('#phase-kicker').textContent=phase.kicker;
  $('#phase-title').textContent=phase.title;
  $('#phase-copy').textContent=phase.copy;
  $('#location-label').textContent=phase.location;
  const doneCount={morning:state.lastExpedition?2:0,afternoon:state.lastCooked?1:0,evening:state.served?2:0,night:state.gachaCount?2:0}[state.phase];
  $('#phase-objectives').innerHTML=phase.objectives.map((text,i)=>`<div class="objective-row ${i<doneCount?'done':''}"><i>${i<doneCount?'✓':i+1}</i><span>${text}</span></div>`).join('');
  $$('.phase-tabs button').forEach(btn=>btn.classList.toggle('active',btn.dataset.phase===state.phase));
}

function renderInventoryMini(){
  const show=['chicken','pork','tuna','tomato','mushroom','tea','ice','core'];
  $('#inventory-mini').innerHTML=show.map(id=>`<div class="ingredient-mini" title="${ingredients.find(x=>x[0]===id)?.[1]||id}">${img(`${ASSET}/ingredients/${ingredientArt[id]}.png`,id)}<b>${state.inventory[id]||0}</b></div>`).join('');
}

function renderAll(){
  updateStats();renderPhaseBrief();renderInventoryMini();renderStage();renderControl();
}

function setPhase(phase){
  if(!phases[phase])return;
  if(state.phase==='evening'&&phase!=='evening')stopRush(false);
  state.phase=phase;state.panel='operate';
  $$('.control-tabs button').forEach(btn=>btn.classList.toggle('active',btn.dataset.panel==='operate'));
  renderAll();save();
  ticker({morning:'Cổng đã ổn định. Chọn map và đội thu mua.',afternoon:'Bếp đã nóng. Chọn món để bắt đầu chuỗi QTE.',evening:'Sắp xếp nhân viên rồi bấm MỞ CỬA.',night:'Tổng kết ca, dọn bếp và đầu tư cho ngày mai.'}[phase]);
}

function mapCard(map){
  return `<button class="map-card ${map.id} ${state.selectedMap===map.id?'selected':''}" data-select-map="${map.id}" style="--map-image:url('${ASSET}/maps/${map.image}')"><span class="map-symbol">${map.symbol}</span><b>${map.name}</b><small>${map.desc}</small></button>`;
}

function renderMorningStage(){
  const buyer=getStaff(state.assigned.buyer);
  return `<div class="stage-scene morning-scene">
    <div class="scene-banner"><div><h2>☀ Cổng thám hiểm đã mở</h2><p>${buyer?`${buyer.name} đang trực thu mua · ${buyer.skill}`:'Chưa bố trí nhân viên thu mua'}</p></div><span class="scene-icon">🌀</span></div>
    ${maps.map(mapCard).join('')}
  </div>`;
}

function staffToken(id){
  const person=getStaff(id);if(!person)return '';
  const stamina=state.stamina[id]??100;
  return `<div class="staff-token"><div class="avatar">${staffAvatar(person)}</div><div><b>${person.name}</b><small>${roleNames[person.role]} · ${person.rank}</small><div class="stamina"><i style="width:${stamina}%"></i></div></div></div>`;
}

function renderAfternoonStage(){
  const chef=getStaff(state.assigned.chef);
  const last=getRecipe(state.lastCooked);
  const prep=['chicken','tomato','mushroom'].map(id=>`<div class="prep-row">${img(`${ASSET}/ingredients/${ingredientArt[id]}.png`,id)}<div><b>${ingredients.find(x=>x[0]===id)[1]}</b><small>Trong kho: ${state.inventory[id]}</small></div></div>`).join('');
  return `<div class="stage-scene afternoon-scene">
    <div class="scene-banner"><div><h2>◐ Bếp thử nghiệm</h2><p>Thái → Xào → Giữ nhiệt. Sai nhịp biến thành Bát Cháo Khê.</p></div><span class="scene-icon">🍳</span></div>
    <div class="kitchen-counter">
      <div class="stove-unit">${img(last.img,last.name)}<div><b>${last.name}</b><small>Món gần nhất · ${last.system}</small></div></div>
      <div>${staffToken(chef?.id)}<button class="game-button wide" data-cook="${last.id}" style="margin-top:10px">NẤU LẠI MÓN NÀY</button></div>
    </div>
    <div class="prep-wall"><div class="zone-title"><b>BÀN SƠ CHẾ</b><small>${chef?.skill||'Senti tự làm'}</small></div>${prep}</div>
  </div>`;
}

const tableStatus={empty:'Bàn trống',ordering:'Đang gọi món',cooking:'Bếp đang nấu',ready:'Chờ phục vụ',eating:'Đang ăn',dirty:'Cần dọn gấp'};
const statusIcon={empty:'＋',ordering:'💬',cooking:'🍳',ready:'🔔',eating:'😋',dirty:'🗑'};

function chibiWalker(person,role,extra=''){
  if(!person)return '';
  if(person.sceneImage)return `<div class="npc-sprite staff-sprite ${role}-walker ${extra}" title="${person.name} · ${roleNames[person.role]}">${img(person.sceneImage,person.name)}<b>${person.name.split(' ')[0]}</b></div>`;
  const face=person.image?img(person.image,person.name):`<span>${person.icon}</span>`;
  return `<div class="chibi-walker ${role}-walker ${extra}" title="${person.name} · ${roleNames[person.role]}">
    <i class="walker-shadow"></i><div class="walker-head">${face}</div><div class="walker-body"><i></i><i></i></div><b>${person.name.split(' ')[0]}</b>
  </div>`;
}

const guestSpriteIds=['arc-office','nagazora-vendor','stfreya-cadet','schicksal-tech','babylon-researcher','taixuan-disciple','world-serpent-logistics','neighborhood-granny'];

function guestWalker(table,index){
  if(!table||['empty','dirty'].includes(table.status))return '';
  const sprite=table.sprite||guestSpriteIds[index];
  return `<div class="npc-sprite guest-walker guest-${index+1} ${table.status}">
    ${img(`${ASSET}/guests/${sprite}-25d.png`,table.guest||'Khách')}
    <em>${statusIcon[table.status]}</em>
  </div>`;
}

function renderEveningStage(){
  const receptionist=getStaff(state.assigned.reception),server=getStaff(state.assigned.server),cleaner=getStaff(state.assigned.cleaner),chef=getStaff(state.assigned.chef);
  const tables=(state.tables.length?state.tables:createTables()).map((table,i)=>{
    const recipe=table.order?getRecipe(table.order):null;
    return `<div class="table-spot table-${i+1} ${table.status} ${i===3?'vip-table':''}">
      <span class="table-number">BÀN ${i+1}${i===3?' · VIP':''}</span>
      ${img(`${ASSET}/decor/${i===3?'vip-table':'taixuan-table'}.png`,`Bàn ${i+1}`)}
      <div class="table-state"><b>${table.guest||tableStatus[table.status]}</b><small>${recipe?recipe.name:tableStatus[table.status]}</small>${table.status!=='empty'&&table.status!=='dirty'?`<div class="patience"><i style="width:${clamp(table.patience)}%"></i></div>`:''}</div>
    </div>`;
  }).join('');
  return `<div class="stage-scene evening-scene">
    <div class="scene-banner"><div><h2>★ ${state.rushActive?'ĐANG MỞ CỬA · RUSH HOUR':'SẴN SÀNG MỞ QUÁN'}</h2><p>${state.aestheticDisaster?'⚠ Thẩm mỹ thảm họa: khách mất thêm 3 giây gọi món.':'Không gian hài hòa, khách đang vui.'}</p></div><span class="scene-icon">${state.rushActive?'🔥':'🏮'}</span></div>
    <div class="restaurant-world world-25d ${state.rushActive?'is-open':'is-closed'}">
      <div class="room-label kitchen-label">BẾP · ${state.prepared} MÓN CHỜ</div>
      <div class="kitchen-room">${img(`${ASSET}/decor/quantum-stove.png`,'Bếp lượng tử')}${img(`${ASSET}/decor/service-counter.png`,'Quầy ra món')}</div>
      <div class="cashier-desk">${img(`${ASSET}/decor/service-counter.png`,'Quầy lễ tân')}<span>LỄ TÂN</span></div>
      <div class="route-line route-a"></div><div class="route-line route-b"></div>
      <div class="gate"><i></i><div><b>CỔNG VÀO</b><small>${state.rushActive?'OPEN · Khách đang xếp hàng':'CLOSED · Bấm MỞ CỬA'}</small></div><i></i></div>
      <div class="waiting-mark w1">1</div><div class="waiting-mark w2">2</div><div class="waiting-mark w3">3</div>
      ${tables}
      ${guestWalker(state.tables[0],0)}${guestWalker(state.tables[1],1)}${guestWalker(state.tables[2],2)}${guestWalker(state.tables[3],3)}
      ${chibiWalker(receptionist,'reception')}${chibiWalker(chef,'chef')}${chibiWalker(server,'server')}${chibiWalker(cleaner,'cleaner')}
      ${state.rushActive?`<div class="npc-sprite incoming-guest">${img(`${ASSET}/guests/taixuan-disciple-25d.png`,'Khách mới')}<b>Khách mới</b></div>`:''}
      <div class="service-legend"><span>🚪 Vào quán</span><span>💬 Gọi món</span><span>🍳 Bếp nấu</span><span>🏃 Bưng món</span><span>💰 Thanh toán</span></div>
    </div>
  </div>`;
}

function renderNightStage(){
  return `<div class="stage-scene night-scene">
    <div class="scene-banner"><div><h2>☾ Đóng cửa · Đếm Xu thôi!</h2><p>Dọn bát, hồi stamina, nâng cấp và chuẩn bị trend ngày mới.</p></div><span class="scene-icon">🌙</span></div>
    <div class="summary-board"><h2>Tổng kết ngày ${state.day}</h2><div class="summary-grid">
      <div class="summary-tile"><span>DOANH THU CA</span><b>${fmt(state.shiftRevenue)} Xu</b></div>
      <div class="summary-tile"><span>KHÁCH PHỤC VỤ</span><b>${state.served}</b></div>
      <div class="summary-tile"><span>UY TÍN QUÁN</span><b>${Math.round(state.rep)}</b></div>
      <div class="summary-tile"><span>RÁC CÒN LẠI</span><b>${state.trash}</b></div>
    </div></div>
    <div class="upgrade-yard"><h2>Khu nâng cấp</h2>
      <div class="upgrade-line">${img(`${ASSET}/decor/vip-table.png`,'Bàn VIP')}<div><b>Bàn cấp cao nhất: Lv.${Math.max(...state.tableLevels)}</b><small>Nâng sức chứa, Tip và yêu cầu nhân sự.</small></div></div>
      <div class="upgrade-line">${img(`${ASSET}/decor/service-counter.png`,'Quán')}<div><b>Quy mô nhà hàng: Lv.${state.level}</b><small>${state.level<3?'Mở thêm bàn, bếp và phòng nghỉ.':'Đã mở sân khấu và sảnh chờ.'}</small></div></div>
    </div>
  </div>`;
}

function renderStage(){
  const stage=$('#restaurant-stage');
  stage.className=`restaurant-stage phase-${state.phase}`;
  stage.innerHTML={morning:renderMorningStage,afternoon:renderAfternoonStage,evening:renderEveningStage,night:renderNightStage}[state.phase]();
}

function renderControl(){
  $$('.control-tabs button').forEach(btn=>btn.classList.toggle('active',btn.dataset.panel===state.panel));
  const content={operate:renderOperatePanel,staff:renderStaffPanel,menu:renderMenuPanel,decor:renderDecorPanel,vip:renderVipPanel}[state.panel]();
  $('#control-panel').innerHTML=content;
}

function renderOperatePanel(){
  if(state.phase==='morning'){
    const map=maps.find(m=>m.id===state.selectedMap);
    const buyer=getStaff(state.assigned.buyer);
    return `<div class="panel-head"><div><h2>Thám hiểm</h2><p>Chiến đấu rút gọn từ Story để khai thác nguyên liệu.</p></div><span class="count-pill">${map.symbol} ${map.name}</span></div>
      <div class="action-card selected"><h3>${buyer?buyer.name:'Senti tự đi'} · ${buyer?.rank||'FREE'}</h3><p>${buyer?.skill||'Không có buff thu mua.'}</p><footer><span>Stamina ${Math.round(state.stamina[buyer?.id]??100)}%</span><button class="game-button" data-dispatch>PHÁI ĐI</button></footer></div>
      <div class="map-actions"><button class="game-button alt" data-black-market>CHỢ ĐEN</button><button class="game-button blue" data-reroll-trend>ĐỔI BẢN TIN</button></div>
      <div class="action-card"><h3>Điểm rơi đặc biệt</h3><p>Boss có thể rớt mảnh công thức, bản vẽ và vật liệu nâng quán. Durandal nhân năm sản lượng; Pardo giảm 30% giá chợ.</p></div>`;
  }
  if(state.phase==='afternoon'){
    const shortlist=state.selectedMenu.slice(0,5).map(id=>getRecipe(id));
    return `<div class="panel-head"><div><h2>Bếp thử nghiệm</h2><p>Ba QTE quyết định chất lượng và hệ vị của món.</p></div><span class="count-pill">${state.prepared} MÓN CHỜ</span></div>
      ${shortlist.map(r=>`<div class="action-card"><h3>${'★'.repeat(r.stars)} ${r.name}</h3><p>${r.desc}</p><footer><span>${r.system} · ${fmt(r.price)} Xu</span><button class="game-button" data-cook="${r.id}">NẤU QTE</button></footer></div>`).join('')}
      <button class="game-button wide alt" data-open-panel="menu">MỞ TOÀN BỘ 20 CÔNG THỨC</button>`;
  }
  if(state.phase==='evening'){
    const tableActions=(state.tables.length?state.tables:createTables()).map((t,i)=>`<div class="action-card ${t.status==='ready'?'selected':''}"><h3>Bàn ${i+1} · ${tableStatus[t.status]}</h3><p>${t.order?getRecipe(t.order).name:'Chưa có yêu cầu'}</p><footer><span>${Math.round(t.patience||100)}% kiên nhẫn</span><button class="game-button tiny" data-table-action="${i}" ${t.status==='empty'?'disabled':''}>XỬ LÝ</button></footer></div>`).join('');
    return `<div class="panel-head"><div><h2>Điều phối sảnh</h2><p>Nhân viên tự xử lý theo vai trò; chị có thể can thiệp từng bàn.</p></div><span class="count-pill">${state.rushActive?state.rushTime+' GIÂY':'ĐÃ ĐÓNG'}</span></div>
      <button class="game-button wide ${state.rushActive?'red':'green'}" data-toggle-rush>${state.rushActive?'ĐÓNG CỬA & TỔNG KẾT':'MỞ CỬA · BẮT ĐẦU RUSH'}</button>
      <div style="height:8px"></div>${tableActions}
      <div class="map-actions"><button class="game-button alt" data-clean-all>DỌN TOÀN BỘ</button><button class="game-button purple" data-open-vip>GỌI VIP</button></div>`;
  }
  return `<div class="panel-head"><div><h2>Sau giờ đóng cửa</h2><p>Đây là lớp meta-progression của Event Mode.</p></div><span class="count-pill">KHUYA</span></div>
    <div class="night-actions">
      <button class="game-button wide" data-gacha>🥘 QUAY NỒI ÁP SUẤT · 500 XU</button>
      <button class="game-button wide blue" data-wash>🫧 RỬA BÁT QTE · LẤY BẢN VẼ</button>
      <button class="game-button wide green" data-upgrade-table>⬆ NÂNG BÀN THẤP NHẤT · 800 XU</button>
      <button class="game-button wide purple" data-upgrade-restaurant>🏯 NÂNG QUY MÔ NHÀ HÀNG</button>
      <button class="game-button wide alt" data-next-day>☀ SANG NGÀY MỚI</button>
    </div>
    <div style="height:10px"></div>
    <div class="achievement"><span>🏆</span><div><b>${state.achievements.length} thành tựu đã mở</b><small>${state.achievements.at(-1)||'Chưa có danh hiệu ẩn.'}</small></div></div>`;
}

function renderStaffPanel(){
  const filtered=selectedRole==='all'?staff:staff.filter(s=>s.role===selectedRole);
  return `<div class="panel-head"><div><h2>Nhân sự Gacha</h2><p>Mỗi vị trí chỉ bố trí một người trong bản demo.</p></div><span class="count-pill">${state.owned.length} / ${staff.length}</span></div>
    <div class="role-filter"><button class="${selectedRole==='all'?'active':''}" data-role="all">TẤT CẢ</button>${Object.entries(roleNames).map(([id,name])=>`<button class="${selectedRole===id?'active':''}" data-role="${id}">${roleIcons[id]} ${name}</button>`).join('')}</div>
    <div class="staff-list">${filtered.map(renderStaffCard).join('')}</div>`;
}

function renderStaffCard(person){
  const owned=state.owned.includes(person.id),assigned=state.assigned[person.role]===person.id,stamina=state.stamina[person.id]??100;
  return `<div class="staff-card ${assigned?'assigned':''}"><div class="staff-portrait">${staffAvatar(person)}</div><div class="staff-info"><b>${person.name}</b><small><span class="rank">${person.rank}</span> ${roleNames[person.role]} · Stamina ${Math.round(stamina)}%</small><div class="stamina"><i style="width:${stamina}%"></i></div></div><button class="game-button ${assigned?'green':'alt'}" data-assign="${person.id}" ${!owned?'disabled':''}>${!owned?'KHÓA':assigned?'ĐANG LÀM':'BỐ TRÍ'}</button><div class="staff-detail"><b>Skill:</b> ${person.skill}<br><em>Tật xấu: ${person.flaw}</em></div></div>`;
}

function renderMenuPanel(){
  return `<div class="panel-head"><div><h2>Bí kíp 20 món</h2><p>Chọn tối đa 8 món bán tối nay. Món khóa có thể nghiên cứu mù.</p></div><span class="count-pill">${state.selectedMenu.length} / 8</span></div>
    <div class="menu-grid">${recipes.map(r=>{
      const unlocked=state.unlocked.includes(r.id),selected=state.selectedMenu.includes(r.id),cls=r.system.includes('ZEN')?'zen':r.system.includes('YATTA')?'':'balance';
      return `<article class="recipe-card ${selected?'selected':''} ${unlocked?'':'locked'}">${img(r.img,r.name)}<span class="stars">${'★'.repeat(r.stars)}</span><div class="recipe-copy"><b>${r.name}</b><small><span class="system-tag ${cls}">${r.system}</span> · ${fmt(r.price)} Xu</small></div><button class="game-button tiny ${unlocked?'':'purple'}" data-menu-recipe="${r.id}">${unlocked?(selected?'BỎ MENU':'THÊM MENU'):'NGHIÊN CỨU'}</button></article>`;
    }).join('')}</div>`;
}

function computeDecorBalance(){
  let z=0,y=0;
  for(const id of state.placedDecor){const item=decor.find(d=>d.id===id);if(!item)continue;if(item.style==='ZEN')z+=item.score;else y+=item.score}
  state.aestheticDisaster=z>0&&y>0&&Math.abs(z-y)<30;
  return {z,y};
}

function renderDecorPanel(){
  const score=computeDecorBalance();
  const total=score.z+score.y||1;
  return `<div class="panel-head"><div><h2>ZEN vs. YATTA</h2><p>Nội thất điều hướng khách, BGM, tốc độ ăn và tật xấu.</p></div><span class="count-pill">${state.placedDecor.length} ĐÃ ĐẶT</span></div>
    <div class="aesthetic-meter"><span>ZEN ${score.z}</span><div class="line"><i style="width:${score.z/total*100}%"></i></div><span>${score.y} YATTA</span></div>
    ${state.aestheticDisaster?'<div class="warning-card">⚠ THẨM MỸ THẢM HỌA · Khách bối rối, gọi món chậm và Fu Hua tăng stress.</div>':''}
    <div class="decor-grid">${decor.map(item=>`<article class="decor-card ${state.placedDecor.includes(item.id)?'placed':''}">${img(item.img,item.name)}<div><b>${item.name}</b><small>${item.style} +${item.score} · ${item.effect}</small><button class="game-button tiny ${state.placedDecor.includes(item.id)?'green':'alt'}" data-place-decor="${item.id}">${state.placedDecor.includes(item.id)?'ĐANG ĐẶT':item.cost?fmt(item.cost)+' XU':'QUÀ VIP'}</button></div></article>`).join('')}</div>
    <button class="game-button wide purple" data-craft-blueprint style="margin-top:9px">GHÉP 5 MẢNH BẢN VẼ · ${state.blueprints}/5</button>`;
}

function renderVipPanel(){
  return `<div class="panel-head"><div><h2>Khách VIP đặc biệt</h2><p>Gọi trực tiếp từng kịch bản để duyệt cơ chế.</p></div><span class="count-pill">7 SỰ KIỆN</span></div><div class="vip-list">${vips.map(v=>`<article class="vip-card"><div class="vip-icon">${v.icon}</div><div><b>${v.name}</b><small>${v.request}</small></div><button class="game-button purple" data-vip="${v.id}">GỌI</button></article>`).join('')}</div>`;
}

function createTables(){
  state.tables=[
    {status:'ordering',guest:'Khách văn phòng',sprite:'arc-office',order:'arc-city-bao',patience:88,age:0},
    {status:'cooking',guest:'Học giả Babylon',sprite:'babylon-researcher',order:'chrysanthemum-tea',patience:76,age:0},
    {status:'ready',guest:'Học viên St. Freya',sprite:'stfreya-cadet',order:'yatta-roast-chicken',patience:65,age:0},
    {status:'empty',guest:'',sprite:'',order:null,patience:100,age:0}
  ];
  return state.tables;
}

function dispatchExpedition(){
  const map=maps.find(m=>m.id===state.selectedMap);const buyer=getStaff(state.assigned.buyer);
  if(buyer&&(state.stamina[buyer.id]??0)<15){toast(`${buyer.name} quá mệt. Hãy cho nghỉ hoặc dùng Cổ Vũ YATTA.`);return}
  const mult=buyer?.id==='durandal'?5:buyer?.id==='pardo'?2:1;
  for(const drop of map.drops)state.inventory[drop]+=2*mult;
  if(buyer)state.stamina[buyer.id]=clamp(state.stamina[buyer.id]-18);
  state.blueprints+=Math.random()<.45?1:0;state.lastExpedition=map.id;
  state.rage=clamp(state.rage+6);ticker(`${buyer?.name||'Senti'} trở về từ ${map.name}: +${2*mult} ${map.drops.map(id=>ingredients.find(x=>x[0]===id)[1]).join(', +'+2*mult+' ')}.`);
  flash(`THU HOẠCH ×${mult}`);renderAll();save();
}

function buyBlackMarket(){
  const pardo=state.assigned.buyer==='pardo';const cost=pardo?210:300;
  if(state.coins<cost){toast('Không đủ Xu Yatta.');return}
  state.coins-=cost;state.inventory.core++;state.inventory.crab+=2;toast(`Pardo ${pardo?'mặc cả thành công':'không trực ca'} · mua Lõi và Cua với ${cost} Xu.`);renderAll();save();
}

function toggleAssign(id){
  const person=getStaff(id);if(!person||!state.owned.includes(id))return;
  state.assigned[person.role]=id;toast(`${person.name} nhận vị trí ${roleNames[person.role]}.`);renderAll();save();
}

function toggleMenuRecipe(id){
  const recipe=getRecipe(id);
  if(!state.unlocked.includes(id)){
    const enough=recipe.ingredients.every(key=>(state.inventory[key]||0)>0);
    if(!enough){toast('Thiếu nguyên liệu để thử nghiệm mù công thức này.');return}
    recipe.ingredients.forEach(key=>state.inventory[key]--);state.unlocked.push(id);toast(`Nghiên cứu thành công: ${recipe.name}!`);flash('MỞ CÔNG THỨC');
  }else if(state.selectedMenu.includes(id))state.selectedMenu=state.selectedMenu.filter(x=>x!==id);
  else if(state.selectedMenu.length<8)state.selectedMenu.push(id);else{toast('Menu đã đủ 8 món. Khóa bớt một món trước.');return}
  renderAll();save();
}

function placeDecor(id){
  const item=decor.find(d=>d.id===id);if(!item)return;
  if(state.placedDecor.includes(id)){state.placedDecor=state.placedDecor.filter(x=>x!==id);toast(`Đã cất ${item.name}.`)}
  else{
    if(item.cost&&state.coins<item.cost){toast('Không đủ Xu Yatta để mua nội thất.');return}
    if(item.cost)state.coins-=item.cost;state.placedDecor.push(id);toast(`Đã đặt ${item.name}: ${item.effect}`)
  }
  const balance=computeDecorBalance();state.zen=clamp(35+balance.z);state.yatta=clamp(35+balance.y);if(state.aestheticDisaster)state.stress=clamp(state.stress+6);
  renderAll();save();
}

function craftBlueprint(){
  if(state.blueprints<5){toast(`Cần thêm ${5-state.blueprints} mảnh bản vẽ.`);return}
  state.blueprints-=5;if(!state.placedDecor.includes('inferno-oven'))state.placedDecor.push('inferno-oven');state.yatta=clamp(state.yatta+25);toast('Ghép thành công Lò Nướng Hỏa Ngục!');flash('BẢN VẼ HIẾM');renderAll();save();
}

function openModal(html){$('#modal-card').innerHTML=html;$('#modal').hidden=false}
function closeModal(){clearInterval(qteInterval);qteInterval=null;cooking=null;activeVip=null;$('#modal').hidden=true}

function cookingStepHtml(){
  const recipe=getRecipe(cooking.recipe);
  if(cooking.step===0)return `<div class="qte-board">${img(recipe.img,recipe.name)}<h3>QTE 1 · THÁI</h3><p>Bấm CHÉM đủ 5 nhịp. Đừng chém đá lượng tử!</p><div class="slice-count">${[0,1,2,3,4].map(i=>`<i class="${i<cooking.hits?'hit':''}"></i>`).join('')}</div><button class="game-button wide red" data-qte="slice">⚔ CHÉM KIẾM ĐỎ MỰC</button></div>`;
  if(cooking.step===1)return `<div class="qte-board">${img(recipe.img,recipe.name)}<h3>QTE 2 · XÀO</h3><p>Chốt khi kim nằm giữa vùng vàng. Quá tay là thức ăn dính trần.</p><div class="qte-progress"><i id="qte-marker" style="left:${cooking.value}%"></i></div><button class="game-button wide" data-qte="toss">🍳 LẮC & HẤT CHẢO</button></div>`;
  return `<div class="qte-board">${img(recipe.img,recipe.name)}<h3>QTE 3 · HẦM</h3><p>Vùng vàng cho vị ZEN. Vùng đỏ cho vị YATTA. Mép đen sẽ cháy khê.</p><div class="qte-progress"><i id="qte-marker" style="left:${cooking.value}%"></i></div><button class="game-button wide purple" data-qte="heat">🔥 KHÓA NHIỆT ĐỘ</button></div>`;
}

function openCooking(id){
  const recipe=getRecipe(id);if(!state.unlocked.includes(id)){toast('Công thức này chưa mở khóa.');return}
  const missing=recipe.ingredients.find(key=>(state.inventory[key]||0)<1);
  if(missing){toast(`Thiếu ${ingredients.find(x=>x[0]===missing)?.[1]||missing}.`);return}
  cooking={recipe:id,step:0,hits:0,score:0,value:8,direction:1};
  renderCookingModal();
}

function renderCookingModal(){
  const recipe=getRecipe(cooking.recipe);
  openModal(`<button class="modal-close" data-close-modal>×</button><span class="tiny-label">COOKING MAMA · ${'★'.repeat(recipe.stars)}</span><h2>${recipe.name}</h2><p>${recipe.ingredients.map(key=>ingredients.find(x=>x[0]===key)?.[1]).join(' + ')}</p>${cookingStepHtml()}`);
  if(cooking.step>0){clearInterval(qteInterval);qteInterval=setInterval(()=>{cooking.value+=cooking.direction*4;if(cooking.value>=96||cooking.value<=4)cooking.direction*=-1;const marker=$('#qte-marker');if(marker)marker.style.left=`${cooking.value}%`},70)}
}

function handleQte(type){
  if(!cooking)return;
  if(type==='slice'){
    cooking.hits++;cooking.score+=18;if(cooking.hits>=5){cooking.step=1;cooking.value=8}renderCookingModal();return;
  }
  clearInterval(qteInterval);qteInterval=null;
  if(type==='toss'){
    const accuracy=Math.max(0,30-Math.abs(53-cooking.value));cooking.score+=accuracy;cooking.step=2;cooking.value=8;renderCookingModal();return;
  }
  const recipe=getRecipe(cooking.recipe),heat=cooking.value,burnt=heat<12||heat>91,style=burnt?'FAIL':heat>=68?'YATTA':'ZEN';
  cooking.score+=burnt?0:Math.max(8,30-Math.abs((style==='YATTA'?77:52)-heat));
  recipe.ingredients.forEach(key=>state.inventory[key]=Math.max(0,state.inventory[key]-1));
  const quality=burnt?'KHÊ':cooking.score>=132?'HOÀN HẢO':cooking.score>=100?'NGON':'TẠM ỔN';
  const resultRecipe=burnt?getRecipe('burnt-congee'):recipe;
  state.lastCooked=resultRecipe.id;state.prepared++;
  if(style==='YATTA'){state.yatta=clamp(state.yatta+6);state.rage=clamp(state.rage+8)}
  if(style==='ZEN'){state.zen=clamp(state.zen+6);state.stress=clamp(state.stress-5)}
  if(burnt){state.stress=clamp(state.stress+14);state.rage=clamp(state.rage+12)}
  if(quality==='HOÀN HẢO'&&!state.achievements.includes('Vua Bếp Lượng Tử'))state.achievements.push('Vua Bếp Lượng Tử');
  const finalScore=Math.round(cooking.score);cooking=null;
  openModal(`<button class="modal-close" data-close-modal>×</button><span class="tiny-label">KẾT QUẢ NẤU ĂN</span><h2>${quality} · ${style}</h2><div class="qte-board">${img(resultRecipe.img,resultRecipe.name)}<h3>${resultRecipe.name}</h3><p>Điểm thao tác ${finalScore} · Đã thêm 1 món vào khay chờ.</p><button class="game-button wide green" data-close-modal>XONG · VỀ BẾP</button></div>`);
  renderAll();save();checkFuHua();
}

function startRush(){
  if(state.rushActive)return;
  state.rushActive=true;state.rushTime=60;createTables();
  rushInterval=setInterval(rushTick,1000);ticker('Rush Hour bắt đầu! Nhân viên sẽ tự xử lý; có thể can thiệp từng bàn.');flash('OPEN!');renderAll();
}

function stopRush(goNight=true){
  clearInterval(rushInterval);rushInterval=null;state.rushActive=false;
  if(goNight){state.phase='night';state.panel='operate';ticker(`Đóng ca: ${state.served} khách · ${fmt(state.shiftRevenue)} Xu doanh thu.`)}
  renderAll();save();
}

function rushTick(){
  if(!state.rushActive)return;
  state.rushTime--;let sceneChanged=false;
  for(const table of state.tables){
    if(!['empty','dirty'].includes(table.status)){table.patience=clamp(table.patience-(state.aestheticDisaster?2.1:1.1));if(table.patience<=0){state.rep=clamp(state.rep-3,0,100);table.status='dirty';table.guest='Khách bỏ đi';state.trash++;ticker('Một khách hết kiên nhẫn và bỏ đi!')}}
    table.age=(table.age||0)+1;
  }
  if(state.rushTime%4===0){autoAdvanceTables();sceneChanged=true}
  if(state.rushTime%7===0){spawnGuest();sceneChanged=true}
  if(state.rushTime%10===0)triggerStaffFlaw();
  for(const id of Object.values(state.assigned))state.stamina[id]=clamp((state.stamina[id]??100)-.7*(state.assigned.manager==='aponia'?2:1));
  state.stress=clamp(state.stress+state.trash*.18+Math.max(0,state.yatta-state.zen)*.018);
  updateStats();if(sceneChanged)renderStage();if(state.panel==='operate'&&sceneChanged)renderControl();checkFuHua();
  if(state.rushTime<=0)stopRush(true);
}

function roleWorking(role){const id=state.assigned[role];return id&&(state.stamina[id]??0)>3}
function autoAdvanceTables(){
  for(let i=0;i<state.tables.length;i++){
    const t=state.tables[i];
    if(t.status==='ordering'&&roleWorking('reception'))t.status='cooking';
    else if(t.status==='cooking'&&roleWorking('chef'))t.status='ready';
    else if(t.status==='ready'&&roleWorking('server'))t.status='eating';
    else if(t.status==='eating'){resolvePayment(t);}
    else if(t.status==='dirty'&&roleWorking('cleaner')){t.status='empty';t.guest='';t.order=null;t.patience=100;state.trash=Math.max(0,state.trash-1)}
  }
}

function advanceTable(index){
  const t=state.tables[index];if(!t)return;
  const next={ordering:'cooking',cooking:'ready',ready:'eating'};
  if(next[t.status]){t.status=next[t.status];t.age=0}
  else if(t.status==='eating')resolvePayment(t);
  else if(t.status==='dirty'){t.status='empty';t.guest='';t.order=null;t.patience=100;state.trash=Math.max(0,state.trash-1)}
  renderAll();save();
}

function resolvePayment(table){
  const recipe=getRecipe(table.order);let earned=recipe.price;
  if(trends[state.trendIndex].boost===recipe.id)earned*=2;
  if(state.calmBuff&&recipe.system.includes('ZEN'))earned*=2;
  if(state.assigned.manager==='aponia')earned*=3;
  const tip=Math.round(earned*(state.zen>state.yatta?0.35:0.18));earned+=tip;
  state.coins+=earned;state.shiftRevenue+=earned;state.served++;state.trash+=state.assigned.manager==='aponia'?0:1;
  table.status='dirty';table.guest=`+${fmt(earned)} Xu`;table.age=0;state.rep=clamp(state.rep+1,0,100);
}

function spawnGuest(){
  const empty=state.tables.find(t=>t.status==='empty');if(!empty)return;
  const id=state.selectedMenu[Math.floor(Math.random()*state.selectedMenu.length)]||'arc-city-bao';
  empty.status='ordering';empty.guest=['Dân Arc City','Hàng xóm Nagazora','Lính hậu cần','Học giả lượng tử','Môn sinh Thái Hư'][Math.floor(Math.random()*5)];empty.sprite=guestSpriteIds[Math.floor(Math.random()*guestSpriteIds.length)];empty.order=id;empty.patience=state.assigned.reception==='mobius'?100:88;empty.age=0;
}

function triggerStaffFlaw(){
  const active=Object.values(state.assigned).map(getStaff).filter(Boolean);const person=active[Math.floor(Math.random()*active.length)];if(!person)return;
  if(Math.random()>.45)return;
  ticker(`Tật xấu kích hoạt: ${person.name} · ${person.flaw}.`);state.stress=clamp(state.stress+5);
  if(person.id==='theresa')state.coins=Math.max(0,state.coins-50);
  if(person.id==='griseo')state.zen=clamp(state.zen+5);
}

function cleanAll(){
  const cleaner=getStaff(state.assigned.cleaner);if(!cleaner){toast('Chưa bố trí nhân viên dọn dẹp.');return}
  state.tables.forEach(t=>{if(t.status==='dirty'){t.status='empty';t.guest='';t.order=null;t.patience=100}});state.trash=0;state.stamina[cleaner.id]=clamp(state.stamina[cleaner.id]-18);if(cleaner.id==='griseo')state.zen=clamp(state.zen+12);toast(`${cleaner.name} đã làm sạch toàn bộ sảnh.`);renderAll();save();
}

function checkFuHua(){
  if(state.stress<100||state.fuRageCooldown)return;
  const penalty=Math.floor(state.shiftRevenue*.5);state.coins=Math.max(0,state.coins-penalty);state.shiftRevenue=Math.max(0,state.shiftRevenue-penalty);state.trash=0;state.stress=30;state.rage=0;state.fuRageCooldown=true;
  flash('EDGE OF TAIXUAN!',true);ticker(`Fu Hua bốc hỏa: dọn sạch quán nhưng tịch thu ${fmt(penalty)} Xu tiền phạt!`);toast('CƠN THỊNH NỘ CỦA QUẢN LÝ · Nộ YATTA bị khóa tạm thời.');
  setTimeout(()=>{state.fuRageCooldown=false;renderAll()},8000);renderAll();save();
}

function sentiAction(action){
  if(action==='horn'){
    if(state.fuRageCooldown){toast('Fu Hua đang khóa kèn YATTA!');return}
    Object.keys(state.stamina).forEach(id=>state.stamina[id]=100);state.stress=clamp(state.stress+18);state.rage=clamp(state.rage-35);toast('Cổ Vũ Cưỡng Chế: toàn bộ stamina hồi 100%, ai cũng mang bộ mặt cam chịu.');flash('YATTA!');
  }
  if(action==='tea'){
    if((state.inventory.tea||0)<1){toast('Hết Lá Trà Ngàn Năm.');return}
    state.inventory.tea--;state.stress=clamp(state.stress-38);state.zen=clamp(state.zen+10);state.calmBuff=true;toast('Fu Hua mỉm cười · Điềm Tĩnh: món ZEN trả tiền gấp đôi.');
  }
  if(action==='clean'){if(state.trash>0){state.trash--;state.rage=clamp(state.rage+10);toast('Senti cưỡi ván gom một bãi rác.')}else toast('Sàn đang sạch, chưa cần tự dọn.')}
  if(action==='kick'){
    const guest=state.tables?.find(t=>!['empty','dirty'].includes(t.status));if(!guest){toast('Không có khách nào để đuổi.');return}
    guest.status='empty';guest.guest='';guest.order=null;state.rep=clamp(state.rep-8);state.rage=clamp(state.rage+50);toast('Xích Nhận quăng khách ra cửa: −8 uy tín, +50 Nộ YATTA.');
  }
  renderAll();save();checkFuHua();
}

function openVipPicker(){
  openModal(`<button class="modal-close" data-close-modal>×</button><span class="tiny-label">BẢNG ĐIỀU KHIỂN KỊCH BẢN</span><h2>Chọn khách VIP</h2><p>Mỗi khách mở một tình huống và cách giải quyết khác nhau.</p><div class="vip-list">${vips.map(v=>`<article class="vip-card"><div class="vip-icon">${v.icon}</div><div><b>${v.name}</b><small>${v.request}</small></div><button class="game-button purple" data-vip="${v.id}">GỌI</button></article>`).join('')}</div>`);
}

function openVip(id){activeVip=vips.find(v=>v.id===id);vipProgress=0;if(!activeVip)return;renderVipModal()}

function renderVipModal(){
  openModal(`<button class="modal-close" data-close-modal>×</button><div class="vip-hero"><div class="vip-big">${activeVip.icon}</div><div><span class="tiny-label">VIP ĐẠP CỬA XÔNG VÀO</span><h2>${activeVip.name}</h2><div class="vip-requirement">YÊU CẦU · ${activeVip.request}</div><p>${activeVip.summary}</p></div></div><div class="modal-actions">${activeVip.actions.map(([id,label])=>`<button class="game-button ${id==='throw'||id==='fight'?'red':'purple'}" data-vip-action="${id}">${label.replace('0/3',`${vipProgress}/3`)}</button>`).join('')}</div>`);
}

function finishVip(message,{coins=0,rep=0,stress=0,rage=0,blueprints=0,achievement=null,trash=0}={}){
  state.coins=Math.max(0,state.coins+coins);state.shiftRevenue+=Math.max(0,coins);state.rep=clamp(state.rep+rep);state.stress=clamp(state.stress+stress);state.rage=clamp(state.rage+rage);state.blueprints+=blueprints;state.trash+=trash;if(achievement&&!state.achievements.includes(achievement))state.achievements.push(achievement);
  openModal(`<button class="modal-close" data-close-modal>×</button><span class="tiny-label">SỰ KIỆN VIP HOÀN TẤT</span><h2>${activeVip.icon} ${activeVip.name}</h2><div class="qte-board"><h3>${message}</h3><p>${coins?`Xu thay đổi: ${coins>0?'+':''}${fmt(coins)} · `:''}${rep?`Uy tín ${rep>0?'+':''}${rep}`:'Kịch bản đặc biệt đã được ghi nhận.'}</p><button class="game-button wide green" data-close-modal>TIẾP TỤC VẬN HÀNH</button></div>`);renderAll();save();checkFuHua();
}

function vipAction(action){
  const id=activeVip?.id;if(!id)return;
  if(id==='seven'){if(action==='tea')finishVip('Thất Kiếm quỵt bill nhưng để lại vật liệu quý.',{blueprints:2,rep:2});else finishVip('Senti đuổi cả bảy người ra ngoài.',{rep:-10,rage:50})}
  if(id==='mnemosyne'){if(action==='perfect')finishVip('Thanh tra chấm đĩa ăn 100/100.',{coins:800,rep:6});else finishVip('Đĩa bay thẳng vào mặt Mnemosyne!',{rep:-4,rage:35,achievement:'Bố Đời Lượng Tử'})}
  if(id==='chariot'){
    if(action==='bao'){vipProgress++;if(vipProgress<3){renderVipModal();return}finishVip('Ba bánh bao khóa mõm Chariot. Quán được cứu!',{coins:900,rep:4,blueprints:1})}
    else{for(const k of Object.keys(state.inventory))state.inventory[k]=Math.max(0,state.inventory[k]-1);finishVip('Chariot ăn sạch một lượt kho sống rồi lăn đi.',{rep:-2,stress:8})}
  }
  if(id==='kevin'){
    if(action==='ice'){vipProgress++;if(vipProgress<3){renderVipModal();return}finishVip('Băng vỡ, mì cay được giao. Kevin để lại Băng Lượng Tử.',{coins:2800,rep:5})}
    else finishVip('Nhân viên trượt ngã, cả tô mì bay lên trần.',{rep:-5,stress:12,trash:2})
  }
  if(id==='hov'){
    if(action==='cupcake'){vipProgress++;if(vipProgress<3){renderVipModal();return}finishVip('Ba hố đen no cupcake và đóng lại.',{coins:1800,rep:5,achievement:'Xạ Thủ Cupcake'})}
    else finishVip('Senti nổi giận vì bị bắt cúi mình.',{rep:-3,rage:45,stress:8})
  }
  if(id==='kalpas'){if(action==='yatta'){state.coins=Math.max(0,state.coins-50);finishVip('Kalpas đập nát bàn, trừ 50 phí sửa rồi quăng lại 5.000 Xu!',{coins:5000,rep:4,yatta:0,achievement:'Khách Hàng Là Thượng Đế Cuồng Nộ'});if(!state.placedDecor.includes('inferno-oven'))state.placedDecor.push('inferno-oven')}else finishVip('Canh ZEN bị hất tung. Kalpas gầm rú bỏ đi.',{rep:-9,stress:14,trash:2})}
  if(id==='jizo'){if(action==='skewer')finishVip('Jizo nhai Lõi Heimdall rộp rộp rồi quên luôn món nợ.',{coins:1200,rep:5});else finishVip('Jizo rút đại kiếm. Quán đóng cửa sửa chữa.',{coins:-500,rep:-8,stress:20,trash:3})}
}

function openGacha(){
  openModal(`<button class="modal-close" data-close-modal>×</button><span class="tiny-label">TUYỂN DỤNG LƯỢNG TỬ</span><h2>Máy Nồi Áp Suất Khổng Lồ</h2><p>500 Xu mỗi lượt. Thẻ trùng biến thành Mảnh Đột Phá.</p><div class="gacha-pot">🥘</div><button class="game-button wide red" data-roll-gacha ${state.coins<500?'disabled':''}>ĐẬP NỒI · 500 XU</button>`);
}

function rollGacha(){
  if(state.coins<500){toast('Không đủ Xu Yatta.');return}state.coins-=500;state.gachaCount++;
  const guaranteed=state.gachaCount===1?getStaff('pardo'):staff[Math.floor(Math.random()*staff.length)];const duplicate=state.owned.includes(guaranteed.id);
  if(duplicate)state.fragments[guaranteed.id]=(state.fragments[guaranteed.id]||0)+1;else state.owned.push(guaranteed.id);
  openModal(`<button class="modal-close" data-close-modal>×</button><span class="tiny-label">KẾT QUẢ GACHA · ${guaranteed.rank}</span><h2>${duplicate?'Mảnh Đột Phá':'Nhân viên mới'} · ${guaranteed.name}</h2><div class="qte-board"><div class="staff-portrait" style="width:120px;height:120px;margin:auto;font-size:52px">${staffAvatar(guaranteed)}</div><h3>${guaranteed.skill}</h3><p>${duplicate?`Thẻ trùng chuyển thành 1 mảnh · Đang có ${state.fragments[guaranteed.id]}`:'Đã thêm vào danh sách bố trí nhân sự.'}</p><button class="game-button wide" data-gacha>QUAY TIẾP</button></div>`);renderAll();save();
}

function washDishes(){state.blueprints++;state.trash=Math.max(0,state.trash-2);toast('Perfect! +1 Mảnh Bản Vẽ, rác giảm 2.');flash('PERFECT WASH');renderAll();save()}
function upgradeTable(){const min=Math.min(...state.tableLevels),index=state.tableLevels.indexOf(min);if(min>=3){toast('Tất cả bàn đã Lv.3.');return}if(state.coins<800){toast('Cần 800 Xu.');return}state.coins-=800;state.tableLevels[index]++;toast(`Bàn ${index+1} đã lên Lv.${state.tableLevels[index]}.`);renderAll();save()}
function upgradeRestaurant(){if(state.level>=3){toast('Đã đạt Tửu Lầu Đỉnh Thái Hư.');return}const cost=state.level===1?3000:10000;if(state.coins<cost){toast(`Cần ${fmt(cost)} Xu.`);return}state.coins-=cost;state.level++;toast(`Mở rộng thành công: nhà hàng Lv.${state.level}!`);flash('EXPANSION!');renderAll();save()}
function nextDay(){state.day++;state.trendIndex=(state.trendIndex+1)%trends.length;state.shiftRevenue=0;state.served=0;state.trash=0;state.stress=clamp(state.stress-12);state.rage=clamp(state.rage+10);state.stamina=Object.fromEntries(staff.map(s=>[s.id,100]));setPhase('morning');toast(`Ngày ${state.day}: ${trends[state.trendIndex].title}.`)}

function showTour(){
  openModal(`<button class="modal-close" data-close-modal>×</button><span class="tiny-label">DEMO FEATURE TOUR</span><h2>Một ngày ở Bếp Lửa Thái Hư</h2><p>Chị có thể chơi tuần tự hoặc dùng thanh Test nhanh phía dưới để nhảy thẳng đến tình huống cần duyệt.</p><div class="tour-grid">
    <div class="tour-item"><b>☀ Sáng · Thám hiểm</b><small>Chọn map, phân công Thu mua, gom nguyên liệu và mua Chợ Đen.</small></div>
    <div class="tour-item"><b>◐ Chiều · Cooking Mama</b><small>Thái, xào, giữ nhiệt; chốt vị ZEN/YATTA hoặc nấu khê.</small></div>
    <div class="tour-item"><b>★ Tối · Quản lý nhà hàng</b><small>Khách đi từ cổng → lễ tân → bàn; nhân viên chạy giữa bếp, bàn, tính tiền và khu dọn.</small></div>
    <div class="tour-item"><b>☾ Khuya · Meta</b><small>Gacha, stamina, bản vẽ, nâng bàn, nâng quán và sang ngày mới.</small></div>
    <div class="tour-item"><b>🔴 Senti</b><small>Thao tác vật lý, cổ vũ cưỡng chế, tự dọn và đuổi khách.</small></div>
    <div class="tour-item"><b>🔵 Fu Hua</b><small>Stress tăng vì rác/YATTA/cháo khê; đầy thanh sẽ tịch thu 50% doanh thu.</small></div>
    <div class="tour-item"><b>🏮 ZEN vs. YATTA</b><small>Đồ trang trí đổi khách, tốc độ ăn và tạo Thẩm Mỹ Thảm Họa.</small></div>
    <div class="tour-item"><b>👑 7 khách VIP</b><small>Mỗi khách là một minigame hoặc lựa chọn đặc biệt riêng.</small></div>
  </div><div class="modal-actions"><button class="game-button wide green" data-close-modal>BẮT ĐẦU CHƠI DEMO</button></div>`);
}

function handleQuickDemo(type){
  if(type==='morning')setPhase('morning');
  if(type==='afternoon'){setPhase('afternoon');openCooking('yatta-roast-chicken')}
  if(type==='evening'){setPhase('evening');startRush()}
  if(type==='vip'){if(state.phase!=='evening')setPhase('evening');openVipPicker()}
  if(type==='stress'){state.stress=101;renderAll();checkFuHua()}
  if(type==='exhaust'){Object.values(state.assigned).forEach(id=>state.stamina[id]=4);toast('Toàn bộ nhân viên sắp ngất. Thử nút CỔ VŨ YATTA hoặc đổi người.');renderAll()}
  if(type==='night')setPhase('night');
  if(type==='money'){state.coins+=10000;toast('+10.000 Xu Yatta để test nâng cấp.');renderAll();save()}
}

document.addEventListener('click',event=>{
  const el=event.target.closest('button,a');if(!el)return;
  if(el.dataset.phase)setPhase(el.dataset.phase);
  if(el.dataset.panel){state.panel=el.dataset.panel;renderControl()}
  if(el.dataset.openPanel){state.panel=el.dataset.openPanel;renderControl()}
  if(el.dataset.selectMap){state.selectedMap=el.dataset.selectMap;renderAll()}
  if(el.hasAttribute('data-dispatch'))dispatchExpedition();
  if(el.hasAttribute('data-black-market'))buyBlackMarket();
  if(el.hasAttribute('data-reroll-trend')){state.trendIndex=(state.trendIndex+1)%trends.length;toast(trends[state.trendIndex].title);renderAll();save()}
  if(el.dataset.role){selectedRole=el.dataset.role;renderControl()}
  if(el.dataset.assign)toggleAssign(el.dataset.assign);
  if(el.dataset.menuRecipe)toggleMenuRecipe(el.dataset.menuRecipe);
  if(el.dataset.placeDecor)placeDecor(el.dataset.placeDecor);
  if(el.hasAttribute('data-craft-blueprint'))craftBlueprint();
  if(el.dataset.cook)openCooking(el.dataset.cook);
  if(el.dataset.qte)handleQte(el.dataset.qte);
  if(el.hasAttribute('data-toggle-rush'))state.rushActive?stopRush(true):startRush();
  if(el.dataset.tableAction!=null)advanceTable(Number(el.dataset.tableAction));
  if(el.hasAttribute('data-clean-all'))cleanAll();
  if(el.hasAttribute('data-open-vip'))openVipPicker();
  if(el.dataset.vip)openVip(el.dataset.vip);
  if(el.dataset.vipAction)vipAction(el.dataset.vipAction);
  if(el.dataset.sentiAction)sentiAction(el.dataset.sentiAction);
  if(el.hasAttribute('data-gacha'))openGacha();
  if(el.hasAttribute('data-roll-gacha'))rollGacha();
  if(el.hasAttribute('data-wash'))washDishes();
  if(el.hasAttribute('data-upgrade-table'))upgradeTable();
  if(el.hasAttribute('data-upgrade-restaurant'))upgradeRestaurant();
  if(el.hasAttribute('data-next-day'))nextDay();
  if(el.dataset.demo)handleQuickDemo(el.dataset.demo);
  if(el.hasAttribute('data-close-modal'))closeModal();
});

$('#modal').addEventListener('click',event=>{if(event.target.hasAttribute('data-close-modal'))closeModal()});
$('#feature-tour').addEventListener('click',showTour);
$('#reset-demo').addEventListener('click',()=>{localStorage.removeItem('taixuan-event-demo-v1');location.reload()});

renderAll();
if(!state.tutorialSeen){state.tutorialSeen=true;save();setTimeout(showTour,350)}
