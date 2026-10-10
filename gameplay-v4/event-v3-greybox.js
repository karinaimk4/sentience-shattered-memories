import {startExpedition} from './event-v3-expedition.js';
import {startCookingMiniGame} from './event-v3-cooking.js?v=4';
import {startDishwashingMiniGame} from './event-v3-washing.js?v=1';
const TILE = 32;
const FIXED_STEP = 1 / 60;
const SEARCH_PARAMS = new URLSearchParams(location.search);
const TEST_MODE = SEARCH_PARAMS.get('test') === 'full';
const PREP_DEMO_MODE = SEARCH_PARAMS.get('demo') === 'prep';
const GACHA_COST = 500;
const GACHA_TEN_COST = 4500;
const DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
const ROLE_LABEL = {reception:'Lễ tân',server:'Phục vụ',chef:'Đầu bếp',cleaner:'Dọn dẹp',manager:'Quản lý',buyer:'Thu mua',senti:'Senti'};
const TYPE_LABEL = {SEAT:'Dẫn bàn',COOK:'Nấu món',SERVE:'Bưng món',CLEAN_TABLE:'Dọn bàn',PICK_TRASH:'Nhặt rác',REPAIR_TABLE:'Sửa bàn'};
const STAFF = {
  senti:{name:'Senti',role:'senti',color:'#ef5b68',speed:4.5,work:0.8,asset:'assets/event-v3/staff-animation/senti.png'},
  fuhua:{name:'Fu Hua',role:'manager',color:'#4dc4b7',speed:3.8,work:1,asset:'assets/event-v3/staff-animation/fuhua.png'},
  rozaliya:{name:'Rozaliya',role:'reception',color:'#f083bd',speed:4,work:1,asset:'assets/event-v3/staff-animation/rozaliya.png'},
  susannah:{name:'Susannah',role:'reception',color:'#b77b59',speed:4,work:1,asset:'assets/event-v3/staff-animation/susannah.png'},
  elysia:{name:'Elysia',role:'reception',color:'#eaa6d7',speed:4.5,work:0.8,asset:'assets/event-v3/staff-animation/elysia.png'},
  liliya:{name:'Liliya',role:'server',color:'#7aa7ef',speed:6,work:1,asset:'assets/event-v3/staff-animation/liliya.png'},
  carole:{name:'Carole',role:'server',color:'#d9783d',speed:3.5,work:1,asset:'assets/event-v3/staff-animation/carole.png'},
  seele:{name:'Seele',role:'server',color:'#6159b2',speed:4.5,work:1,asset:'assets/event-v3/staff-animation/seele.png'},
  veliona:{name:'Veliona',role:'server',color:'#9e264e',speed:6,work:1,asset:'assets/event-v3/staff-animation/veliona.png'},
  kiana:{name:'Kiana',role:'chef',color:'#e7e8f0',speed:4,work:0.6,asset:'assets/event-v3/staff-animation/kiana.png'},
  yae:{name:'Yae Sakura',role:'chef',color:'#e785a7',speed:4,work:1,asset:'assets/event-v3/staff-animation/yae.png'},
  mei:{name:'Raiden Mei',role:'chef',color:'#563e8e',speed:4,work:1,asset:'assets/event-v3/staff-animation/mei.png'},
  griseo:{name:'Griseo',role:'cleaner',color:'#8bd0d5',speed:3.5,work:1,asset:'assets/event-v3/staff-animation/griseo.png'},
  bronya:{name:'Bronya',role:'cleaner',color:'#99a8c3',speed:4,work:0.8,asset:'assets/event-v3/staff-animation/bronya.png'},
  himeko:{name:'Himeko',role:'manager',color:'#b9343f',speed:3.5,work:1,asset:'assets/event-v3/staff-animation/himeko.png'},
  pardofelis:{name:'Pardofelis',role:'buyer',color:'#c79d75',speed:4,work:1,asset:'assets/event-v3/staff-animation/pardofelis.png'},
  sushang:{name:'Li Sushang',role:'buyer',color:'#4f9e8f',speed:4,work:1,asset:'assets/event-v3/staff-animation/sushang.png'}
};
const ENVIRONMENT_ASSETS = {
  ground:'assets/event-v3/lv1/lv1-ground.png',
  front:'assets/event-v3/lv1/lv1-front.png',
  cart:'assets/event-v3/lv1/cart-kitchen.png',
  wash:'assets/event-v3/lv1/wash-basin.png',
  table:'assets/event-v3/lv1/barrel-table.png',
  stool:'assets/event-v3/lv1/barrel-stool.png',
  tableBasic:'assets/event-v3/lv1/simple-wood-table-v1.png',
  stoolBasic:'assets/event-v3/lv1/simple-wood-stool-v1.png',
  dirtyDishes:'assets/event-v3/lv1/dirty-dishes-v1.png',
  reception:'assets/event-v3/lv1/reception-counter.png',
  tea:'assets/event-v3/lv1/fuhua-tea-seat.png',
  cartUpgrade:'assets/event-v3/lv1/cart-kitchen-upgrade.png',
  waitingLobby:'assets/event-v3/lv1/waiting-lobby.png',
  room2Ground:'assets/event-v3/lv2/heliopolis-room-v2.png',
  decorBonsai:'assets/event-v3/decor/bonsai-zen-v1.png',
  decorWind:'assets/event-v3/decor/wind-chime-zen-v1.png',
  decorNeon:'assets/event-v3/decor/neon-yatta-v1.png',
  decorSpeaker:'assets/event-v3/decor/rock-speaker-yatta-v1.png',
  decorWoodTable:'assets/event-v3/decor/wood-table-zen-v1.png',
  decorInkPainting:'assets/event-v3/decor/ink-painting-zen-v1.png',
  decorCeladon:'assets/event-v3/decor/celadon-vase-zen-v1.png',
  decorLeopardSofa:'assets/event-v3/decor/leopard-sofa-yatta-v1.png',
  decorRedLamp:'assets/event-v3/decor/red-lamp-yatta-v1.png',
  decorFirePan:'assets/event-v3/decor/fire-pan-yatta-v1.png',
  decorChickenTable:'assets/event-v3/decor/chicken-table-balanced-v1.png',
  decorJudah:'assets/event-v3/decor/oath-judah-zen-v1.png',
  decorTeriDerp:'assets/event-v3/decor/teri-derp-yatta-v1.png',
  decorKaslanaFridge:'assets/event-v3/decor/kaslana-fridge-yatta-v1.png',
  decorCanBed:'assets/event-v3/decor/can-cat-bed-zen-v1.png',
  decorThirteenPainting:'assets/event-v3/decor/thirteen-painting-yatta-v1.png',
  decorCrystalFlower:'assets/event-v3/decor/crystal-flower-zen-v1.png',
  decorArahato:'assets/event-v3/decor/arahato-tech-v1.png',
  decorEdenBoard:'assets/event-v3/decor/eden-board-yatta-v1.png'
};
const GUEST_ARCHETYPES = [
  {assetKey:'guestMale',name:'Khách Arc City',color:'#4f7691',asset:'assets/event-v3/guest-sprites/guest-adult-male.png'},
  {assetKey:'guestFemale',name:'Học viên St. Freya',color:'#b66d6a',asset:'assets/event-v3/guest-sprites/guest-adult-female.png'},
  {assetKey:'guestChild',name:'Bé Nagazora',color:'#ed7147',asset:'assets/event-v3/guest-sprites/guest-child.png'}
];
const DISH_CATALOG = [
  {id:'burnt-congee',name:'Bát Cháo Khê',stars:1,system:'YATTA',price:5,effect:'hot',ingredients:[]},
  {id:'pure-water',name:'Nước Lọc Trắng Sạch',stars:1,system:'ZEN',price:10,effect:'cold',ingredients:['Đá Bào Parvati']},
  {id:'arc-city-bao',name:'Bánh Bao Mưa Arc City',stars:1,system:'Cân bằng',price:15,effect:'hot',ingredients:['Thịt Lợn Neon','Nấm Ký Ức']},
  {id:'quantum-waste',name:'Chất Thải Lượng Tử',stars:1,system:'—',price:0,effect:'quantum',ingredients:[]},
  {id:'eternal-shaved-ice',name:'Đá Bào Vĩnh Cửu',stars:2,system:'YATTA',price:45,effect:'cold',ingredients:['Đá Bào Parvati','Gia vị công nghiệp']},
  {id:'glitch-salad',name:'Salad Nhiễu Sóng',stars:2,system:'ZEN',price:50,effect:'fresh',ingredients:['Cà Chua Nhiễu Sóng','Măng rừng']},
  {id:'honkai-seaweed-soup',name:'Canh Rong Biển Honkai',stars:2,system:'ZEN',price:60,effect:'hot',ingredients:['Rong Biển Honkai','Đá Bào Parvati']},
  {id:'chrysanthemum-tea',name:'Trà Cúc Bát Gỗ',stars:2,system:'ZEN',price:75,effect:'hot',ingredients:['Lá trà']},
  {id:'yatta-roast-chicken',name:'Gà Quay YATTA',stars:3,system:'YATTA',price:150,effect:'hot',ingredients:['Gà chạy bộ','Gia vị công nghiệp']},
  {id:'apocalypse-pizza',name:'Pizza Khải Huyền',stars:3,system:'YATTA',price:180,effect:'hot',ingredients:['Thịt Lợn Neon','Cà Chua Nhiễu Sóng']},
  {id:'dead-sea-fried-rice',name:'Cơm Chiên Biển Chết',stars:3,system:'Cân bằng',price:200,effect:'hot',ingredients:['Cua Biển Chết','Nấm Ký Ức']},
  {id:'frozen-tuna-rolls',name:'Cá Ngừ Cuộn Rong Biển',stars:3,system:'ZEN',price:220,effect:'cold',ingredients:['Cá Ngừ đóng băng','Rong Biển Honkai']},
  {id:'tea-smoked-bacon',name:'Thịt Xông Khói Vị Trà',stars:4,system:'Cân bằng',price:450,effect:'hot',ingredients:['Thịt Lợn Neon','Lá trà']},
  {id:'memory-chicken-soup',name:'Súp Nấm Ký Ức Hầm Gà',stars:4,system:'ZEN',price:500,effect:'hot',ingredients:['Gà chạy bộ','Nấm Ký Ức']},
  {id:'frozen-noodles',name:'Mì Gói Băng Giá',stars:4,system:'YATTA',price:550,effect:'cold',ingredients:['Cá Ngừ đóng băng','Đá Bào Parvati','Gia vị công nghiệp']},
  {id:'machine-core-skewers',name:'Xiên Nướng Lõi Máy',stars:4,system:'YATTA',price:600,effect:'hot',ingredients:['Lõi Heimdall','Cà Chua Nhiễu Sóng','Gia vị công nghiệp']},
  {id:'quantum-sichuan-hotpot',name:'Lẩu Tứ Xuyên Lượng Tử',stars:5,system:'YATTA MAX',price:2000,effect:'fire',ingredients:['Cua Biển Chết','Thịt Lợn Neon','Gia vị công nghiệp','Gia vị công nghiệp','Gia vị công nghiệp']},
  {id:'sunken-soup',name:'Canh Trầm Luân',stars:5,system:'ZEN MAX',price:2500,effect:'zen',ingredients:['Gà chạy bộ','Măng rừng','Nấm Ký Ức','Lá trà']},
  {id:'thirteen-feast',name:'Đại Tiệc Mười Ba Anh Kiệt',stars:5,system:'Cân bằng',price:4000,effect:'quantum',ingredients:['Gà chạy bộ','Thịt Lợn Neon','Cá Ngừ đóng băng','Cua Biển Chết','Nấm Ký Ức','Lõi Heimdall']},
  {id:'kiana-truth-dessert',name:'Tráng Miệng Chân Lý Kiana',stars:5,system:'???',price:5000,effect:'quantum',ingredients:['Cá Ngừ đóng băng','Lá trà','Cà Chua Nhiễu Sóng']}
].map(dish=>({...dish,asset:`assets/event-demo/food/${dish.id}.png`}));
const STARTER_MENU = ['arc-city-bao','pure-water','eternal-shaved-ice','chrysanthemum-tea'];
const OUTCOME_ONLY_DISHES = new Set(['burnt-congee','quantum-waste']);
const RESEARCH_DISHES = DISH_CATALOG.filter(dish=>dish.stars<=3&&!STARTER_MENU.includes(dish.id)&&!OUTCOME_ONLY_DISHES.has(dish.id)).map(dish=>dish.id);
const FRAGMENT_DISHES = DISH_CATALOG.filter(dish=>dish.stars>=4).map(dish=>dish.id);
const RECIPE_INGREDIENTS = [...new Set(DISH_CATALOG.flatMap(dish=>dish.ingredients))];
const dishById=id=>DISH_CATALOG.find(dish=>dish.id===id)||DISH_CATALOG[2];
const DAILY_TRENDS = [
  {dishId:'arc-city-bao',title:'Ca tăng giờ Arc City',copy:'Dân văn phòng chuộng món gọn, nóng và no bụng.'},
  {dishId:'pure-water',title:'Ngày thanh tịnh',copy:'Khách ưu tiên món ZEN nhẹ nhàng, sạch vị.'},
  {dishId:'eternal-shaved-ice',title:'Khách nhí ghé quán',copy:'Đá bào và món mát có nhu cầu cao.'},
  {dishId:'chrysanthemum-tea',title:'Mưa lạnh Nagazora',copy:'Đồ uống nóng được gọi nhiều hơn.'}
];
const GACHA_POOL = [
  {id:'rozaliya',name:'Rozaliya',rank:'A',role:'Lễ tân',speed:4,work:'1,0×',skill:'Khách cô dẫn +10 Kiên nhẫn',quirk:'20% hát mic 4 giây',art:'assets/event-v3/gacha-portraits/rozaliya-v2.png'},
  {id:'susannah',name:'Susannah',rank:'S',role:'Lễ tân',speed:'Nhanh · chờ chốt số',work:'—',skill:'Đón khách nhanh, thân thiện',quirk:'Có thể xếp nhầm khách vào bàn bẩn',art:'assets/event-v3/gacha-portraits/susannah-v1.png'},
  {id:'liliya',name:'Liliya',rank:'A',role:'Phục vụ',speed:6,work:'1,0×',skill:'Lướt ván kiếm · tốc độ 6 ô/s',quirk:'15% ngủ rũ giữa đường',art:'assets/event-v3/gacha-portraits/liliya-v2.png'},
  {id:'carole',name:'Carole',rank:'S',role:'Phục vụ',speed:'Chậm · chờ chốt số',work:'—',skill:'Bưng tối đa 8 đĩa cùng lúc',quirk:'Đi chậm, có thể làm hỏng sàn',art:'assets/event-v3/gacha-portraits/carole-v1.png'},
  {id:'kiana',name:'Kiana Bạch Luyện',rank:'A',role:'Đầu bếp',speed:4,work:'0,6×',skill:'Pizza Khải Huyền không bao giờ khét',quirk:'Món khác có 80% bị khét',art:'assets/event-v3/gacha-portraits/kiana-v2.png'},
  {id:'griseo',name:'Griseo',rank:'S',role:'Dọn dẹp',speed:3.5,work:'1,0×',skill:'Mỗi rác nhặt được: ZEN +2',quirk:'15% dựng giá vẽ chặn đường',art:'assets/event-v3/gacha-portraits/griseo-v2.png'},
  {id:'yae',name:'Yae Sakura',rank:'S',role:'Đầu bếp',speed:4,work:'1,0×',skill:'Sơ chế ×3 · mẻ chiều +2 phần',quirk:'Không có tật xấu',art:'assets/event-v3/gacha-portraits/yae-sakura-v2.png'},
  {id:'sushang',name:'Li Sushang',rank:'S',role:'Thu mua',speed:'—',work:'—',skill:'Phi kiếm: +1 mỗi loại nguyên liệu',quirk:'20% mù đường · hàng về buổi Tối',art:'assets/event-v3/gacha-portraits/li-sushang-v2.png'},
  {id:'himeko',name:'Himeko',rank:'SR',role:'Quản lý',speed:3.5,work:'—',skill:'Mỗi 40 giây hồi 30 Stamina cả quán',quirk:'10% cuối ca lấy 5% két mua bia',art:'assets/event-v3/gacha-portraits/himeko-v1.png'},
  {id:'elysia',name:'Elysia',rank:'SSR',role:'Lễ tân',speed:4.5,work:'0,8×',skill:'Kiên nhẫn về 100 · bonus +20%',quirk:'10% tạo dáng chụp ảnh 3 giây',art:'assets/event-v3/gacha-portraits/elysia-v2.png'},
  {id:'seele',name:'Seele / Veliona',rank:'SSR',role:'Phục vụ',speed:'4,5 / 6',work:'1,0×',skill:'Seele Tip +100% · Veliona ăn ×4',quirk:'Đổi dạng khi Stamina <30',art:'assets/event-v3/gacha-portraits/seele-veliona-v1.png'},
  {id:'bronya',name:'Bronya',rank:'SSR',role:'Dọn dẹp',speed:4,work:'0,8×',skill:'Project Bunny hút rác toàn bản đồ',quirk:'10% ngồi chơi Switch 5 giây',art:'assets/event-v3/gacha-portraits/bronya-v1.png'},
  {id:'mei',name:'Raiden Mei',rank:'SSR',role:'Đầu bếp',speed:4,work:'1,0×',skill:'100% món Hoàn hảo · thêm 20 xu',quirk:'Không có tật xấu',art:'assets/event-v3/gacha-portraits/raiden-mei-v1.png'},
  {id:'pardofelis',name:'Pardofelis',rank:'SSR',role:'Thu mua',speed:'—',work:'—',skill:'Chợ Đen giảm 30% giá',quirk:'10% chôm đồ trang trí',art:'assets/event-v3/gacha-portraits/pardofelis-v2.png'}
];
const GACHA_RANKS = {A:50,S:30,SR:15,SSR:5};
const VIP_CATALOG=[
  {id:'elysia',name:'Elysia',title:'Tiệc Mười Ba Anh Kiệt',dish:'thirteen-feast',issue:'Muốn cả sảnh cùng nâng ly và chụp ảnh.',reward:'Mảnh Công Thức 5★ + 800 Xu',art:'assets/event-v3/gacha-portraits/elysia-v2.png',tone:'zen'},
  {id:'kalpas',name:'Kalpas',title:'Thử Lửa Tứ Xuyên',dish:'quantum-sichuan-hotpot',issue:'Nộ khí tăng nhanh; phục vụ chậm sẽ làm cháy nội thất.',reward:'1.200 Xu + YATTA 40',art:'assets/event-demo/characters/kalpas.png',tone:'yatta'},
  {id:'kevin',name:'Kevin',title:'Bữa Tối Băng Giá',dish:'frozen-noodles',issue:'Chỉ chấp nhận món lạnh và bàn sạch tuyệt đối.',reward:'900 Xu + ZEN 30',art:'assets/event-demo/guests/world-serpent-logistics-25d.png',tone:'ice'}
];
const ANIM_ROWS = {idle_down:0,walk_down:1,walk_up:2,walk_right:3,work_a:4,work_b:5,emote:6,rest_floor:7,rest:7,doze:8};
const STAFF_BY_ROLE={
  reception:['rozaliya','susannah','elysia'],
  server:['liliya','carole','seele','veliona'],
  chef:['kiana','yae','mei'],
  cleaner:['griseo','bronya']
};
const TABLE_CATALOG=[
  {id:'basic',name:'Bàn Gỗ Đơn Sơ',level:1,tableAssetKey:'tableBasic',stoolAssetKey:'stoolBasic',description:'Bàn khởi đầu · ván gỗ thô, không khăn phủ'},
  {id:'polished',name:'Bàn Gỗ Gia Cố',level:2,tableAssetKey:'table',stoolAssetKey:'stool',description:'Bàn cấp sau · chắc chắn và sạch đẹp hơn'}
];
const DECOR_CATALOG = [
  {id:'wood-table',name:'Bàn Gỗ Thiền',system:'ZEN',kind:'zen',tier:'basic',assetKey:'decorWoodTable',art:ENVIRONMENT_ASSETS.decorWoodTable,effect:'Nội thất ZEN · giá trị đang chờ chốt',footprint:[2,1],draw:[72,54]},
  {id:'bonsai',name:'Bonsai Thái Hư',system:'ZEN',kind:'zen',tier:'basic',assetKey:'decorBonsai',art:ENVIRONMENT_ASSETS.decorBonsai,effect:'Nội thất ZEN · giá trị đang chờ chốt',footprint:[1,1],draw:[42,42]},
  {id:'wind',name:'Chuông Gió Ngọc',system:'ZEN',kind:'zen',tier:'basic',assetKey:'decorWind',art:ENVIRONMENT_ASSETS.decorWind,effect:'Nội thất ZEN · giá trị đang chờ chốt',footprint:[1,1],draw:[34,58]},
  {id:'ink-painting',name:'Tranh Thủy Mặc',system:'ZEN',kind:'zen',tier:'basic',assetKey:'decorInkPainting',art:ENVIRONMENT_ASSETS.decorInkPainting,effect:'Nội thất ZEN · giá trị đang chờ chốt',footprint:[1,1],draw:[38,60]},
  {id:'celadon',name:'Gốm Men Ngọc',system:'ZEN',kind:'zen',tier:'basic',assetKey:'decorCeladon',art:ENVIRONMENT_ASSETS.decorCeladon,effect:'Nội thất ZEN · giá trị đang chờ chốt',footprint:[1,1],draw:[38,52]},
  {id:'neon',name:'Đèn Neon YATTA',system:'YATTA',kind:'yatta',tier:'basic',assetKey:'decorNeon',art:ENVIRONMENT_ASSETS.decorNeon,effect:'Nội thất YATTA · giá trị đang chờ chốt',footprint:[1,1],draw:[44,40]},
  {id:'leopard-sofa',name:'Sofa Da Báo',system:'YATTA',kind:'yatta',tier:'basic',assetKey:'decorLeopardSofa',art:ENVIRONMENT_ASSETS.decorLeopardSofa,effect:'Nội thất YATTA · giá trị đang chờ chốt',footprint:[2,1],draw:[72,54]},
  {id:'speaker',name:'Loa Rock Cháy Máy',system:'YATTA',kind:'yatta',tier:'basic',assetKey:'decorSpeaker',art:ENVIRONMENT_ASSETS.decorSpeaker,effect:'Nội thất YATTA · giá trị đang chờ chốt',footprint:[1,1],draw:[36,58]},
  {id:'red-lamp',name:'Đèn Đỏ Heliopolis',system:'YATTA',kind:'yatta',tier:'basic',assetKey:'decorRedLamp',art:ENVIRONMENT_ASSETS.decorRedLamp,effect:'Nội thất YATTA · giá trị đang chờ chốt',footprint:[1,1],draw:[34,60]},
  {id:'fire-pan',name:'Chảo Lửa',system:'YATTA',kind:'yatta',tier:'basic',assetKey:'decorFirePan',art:ENVIRONMENT_ASSETS.decorFirePan,effect:'Nội thất YATTA · giá trị đang chờ chốt',footprint:[1,1],draw:[46,44]},
  {id:'chicken-table',name:'Sa Bàn Gà Cãi Lộn',system:'CÂN BẰNG',kind:'balance',tier:'rare',assetKey:'decorChickenTable',art:ENVIRONMENT_ASSETS.decorChickenTable,effect:'Sinh Tip tự động · Senti/Fu Hua đổi điểm khi gõ gà',footprint:[2,1],draw:[76,56]},
  {id:'judah',name:'Oath of Judah',system:'ZEN MAX',kind:'zen',tier:'rare',assetKey:'decorJudah',art:ENVIRONMENT_ASSETS.decorJudah,effect:'Kiên nhẫn giảm chậm 30%',footprint:[1,1],draw:[42,62]},
  {id:'teri-derp',name:'Tượng Teri-Derp',system:'YATTA MAX',kind:'yatta',tier:'rare',assetKey:'decorTeriDerp',art:ENVIRONMENT_ASSETS.decorTeriDerp,effect:'Khách gọi thêm tráng miệng · đánh thức nhân viên',footprint:[1,1],draw:[44,58]},
  {id:'kaslana-fridge',name:'Tủ Lạnh Kaslana',system:'YATTA',kind:'yatta',tier:'rare',assetKey:'decorKaslanaFridge',art:ENVIRONMENT_ASSETS.decorKaslanaFridge,effect:'Bếp lấy đồ nhanh · Kiana có thể ăn vụng',footprint:[1,1],draw:[44,62]},
  {id:'can-bed',name:'Ổ Mèo Can',system:'ZEN',kind:'zen',tier:'rare',assetKey:'decorCanBed',art:ENVIRONMENT_ASSETS.decorCanBed,effect:'Khách chịu ghép bàn · Can có thể giấu đồ',footprint:[1,1],draw:[52,48]},
  {id:'thirteen-painting',name:'Tranh Mười Ba Anh Kiệt',system:'YATTA +100',kind:'yatta',tier:'rare',assetKey:'decorThirteenPainting',art:ENVIRONMENT_ASSETS.decorThirteenPainting,effect:'VIP Elysian Realm đứng xem trước khi gọi món',footprint:[2,1],draw:[78,48]},
  {id:'crystal-flower',name:'Bông Hoa Thủy Tinh',system:'ZEN',kind:'zen',tier:'rare',assetKey:'decorCrystalFlower',art:ENVIRONMENT_ASSETS.decorCrystalFlower,effect:'Đổi BGM · khách nữ trả thêm 20%',footprint:[1,1],draw:[42,58]},
  {id:'arahato',name:'Arahato Giới Hạn',system:'CÔNG NGHỆ',kind:'tech',tier:'rare',assetKey:'decorArahato',art:ENVIRONMENT_ASSETS.decorArahato,effect:'Giữ khách nhí không quậy',footprint:[1,1],draw:[44,58]},
  {id:'eden-board',name:'Bảng Eden Bao',system:'YATTA',kind:'yatta',tier:'rare',assetKey:'decorEdenBoard',art:ENVIRONMENT_ASSETS.decorEdenBoard,effect:'Giờ Vàng 2 phút · mọi món được trả ×5',footprint:[1,1],draw:[46,60]}
];
const gachaState={pulls:0,sinceS:0,sinceSSR:0,owned:new Set(['rozaliya','liliya','kiana','griseo']),shards:{},training:{},busy:false,lastResults:[]};
const dormState={decorByFloor:{1:new Set(['plant','rug']),2:new Set(),3:new Set()},activeFloor:1,theme:'warm'};
const vipState={active:null,stage:0,history:[]};
let selectedSkillId='rozaliya';
const roomUpgradeState={
  room1:{floor:0,kitchen:0,waiting:0},
  room2:{floor:0,kitchen:0,waiting:0}
};
const RESTAURANT_UPGRADE_COST={coins:10000,arcIron:50};
const FULL_TEST_RESOURCES={coins:999999,arcIron:999};
const PERFECT_DISH_BONUS=.2;
const economyState={coins:0,arcIron:0,unlockedLv2:false};
const ROOM_CONFIG={
  room1:{mapId:'lv1',level:1,name:'Gian 1 · Quầy Nagazora',location:'NAGAZORA · GIAN 1 NGOÀI TRỜI',tables:3,kitchens:1},
  room2:{mapId:'lv2',level:2,name:'Gian 2 · Quán Heliopolis',location:'ARC CITY · GIAN 2 BÊN PHẢI',tables:6,kitchens:3,chefs:2}
};
const roomState={active:'room1',unlocked:new Set(['room1']),worlds:{room1:null,room2:null},selectedCharacterId:'senti',followCharacter:true,followClock:0};
let restaurantUpgradeBusy=false;
const staffSlotState={reception:1,server:1,chef:1,cleaner:1};
const assignmentState={
  room1:{reception:['rozaliya'],server:['liliya'],chef:['kiana'],cleaner:['griseo']},
  room2:{reception:['rozaliya'],server:['liliya'],chef:['kiana','yae'],cleaner:['griseo']}
};
const decorStoreState={owned:new Set(),placed:[],tiles:{lv1:{},lv2:{}}};
const decorPlacementState={active:false,dragId:null,hoverTile:null,valid:false,grabOffset:[0,0]};
const tableStoreState={
  lv1:{owned:{basic:3,polished:0},layout:null},
  lv2:{owned:{basic:0,polished:6},layout:null}
};
const tablePlacementState={active:false,dragId:null,hoverTile:null,valid:false,grabOffset:[0,0]};
let decorFilter='all';

const canvas = document.querySelector('#rush-canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const ui = Object.fromEntries([...document.querySelectorAll('[id]')].map(el => [el.id, el]));
document.body.classList.toggle('test-mode',TEST_MODE);
if(TEST_MODE){
  document.querySelectorAll('[data-test-only]:not(#debug-drawer)').forEach(element=>{element.hidden=false;});
  ui['phase-objectives']?.insertAdjacentHTML('beforeend','<div>G · xem lưới đường đi</div>');
}
let world;
let activePhase = 'morning';
const phaseState={day:1,selectedMap:null,buyer:'senti',trips:0,stock:{},prepared:0,preparedByDish:{},preparedQualityByDish:{},plan:{},planLocked:false,planQueue:[],planIndex:0,batches:0,cookStep:0,cookResults:[],washes:0,blueprintParts:0,rushEnded:false};
const recipeState={unlocked:new Set(STARTER_MENU),fragments:new Set(),selected:new Set(),lastResult:'Chọn 1–3 nguyên liệu rồi thử nghiệm. Sai công thức sẽ tạo Chất Thải Lượng Tử.'};
let lastFrame = performance.now();
let accumulator = 0;
let toastClock = 0;
let rosterRenderKey = '';
const characterImages = {};
const environmentImages = {};
const dishImages = {};

async function loadCharacterAssets(){
  const sources=[...Object.entries(STAFF).filter(([,data])=>data.asset),...GUEST_ARCHETYPES.map(data=>[data.assetKey,data])];
  await Promise.all(sources.map(([id,data])=>new Promise(resolve=>{
    const image=new Image();
    image.onload=()=>{characterImages[id]=image;resolve();};
    image.onerror=resolve;
    image.src=data.asset;
  })));
}

async function loadEnvironmentAssets(){
  await Promise.all(Object.entries(ENVIRONMENT_ASSETS).map(([id,src])=>new Promise(resolve=>{
    const image=new Image();
    image.onload=()=>{environmentImages[id]=image;resolve();};
    image.onerror=resolve;
    image.src=src;
  })));
}

async function loadDishAssets(){
  await Promise.all(DISH_CATALOG.map(dish=>new Promise(resolve=>{
    const image=new Image();
    image.onload=()=>{dishImages[dish.id]=image;resolve();};
    image.onerror=resolve;
    image.src=dish.asset;
  })));
}

const keyOf = ([x,y]) => `${x},${y}`;
const sameTile = (a,b) => a && b && a[0] === b[0] && a[1] === b[1];
const manhattan = (a,b) => Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const seeded = (() => { let seed=0x51e17; return () => ((seed=Math.imul(seed,1664525)+1013904223|0)>>>0)/4294967296; })();
const roomIdForLevel=level=>level==='lv2'?'room2':'room1';
const cookStationsForMap=map=>map.stations.cooks||[map.stations.cook];
const dailyTrend=()=>DAILY_TRENDS[(phaseState.day-1)%DAILY_TRENDS.length];
const plannedBatchCount=()=>Object.values(phaseState.plan).reduce((sum,count)=>sum+count,0);
const ingredientCounts=dish=>dish.ingredients.reduce((counts,name)=>(counts[name]=(counts[name]||0)+1,counts),{});
const isRecipeUnlocked=id=>recipeState.unlocked.has(id);
const unlockedMenuIds=()=>DISH_CATALOG.filter(dish=>isRecipeUnlocked(dish.id)&&!OUTCOME_ONLY_DISHES.has(dish.id)&&dish.ingredients.length).map(dish=>dish.id);
const recipeSignature=ingredients=>[...ingredients].sort((a,b)=>a.localeCompare(b,'vi')).join('|');
function planRequirements(){
  const required={};
  for(const [dishId,batches] of Object.entries(phaseState.plan))for(const [name,count] of Object.entries(ingredientCounts(dishById(dishId))))required[name]=(required[name]||0)+count*2*batches;
  return required;
}
const missingPlanIngredients=()=>Object.fromEntries(Object.entries(planRequirements()).map(([name,count])=>[name,Math.max(0,count-(phaseState.stock[name]||0))]).filter(([,count])=>count>0));
const marketPrice=()=>gachaState.owned.has('pardofelis')?210:300;
function reserveGuestOrder(){
  const trend=dailyTrend(),candidates=Object.entries(phaseState.preparedByDish).filter(([,count])=>count>0).map(([id,count])=>({id,count,weight:id===trend.dishId?3:1}));
  if(!candidates.length)return null;
  let roll=seeded()*candidates.reduce((sum,item)=>sum+item.weight,0),selected=candidates[0];
  for(const item of candidates){roll-=item.weight;if(roll<=0){selected=item;break;}}
  phaseState.preparedByDish[selected.id]--;phaseState.prepared=Math.max(0,phaseState.prepared-1);
  const qualityQueue=phaseState.preparedQualityByDish[selected.id]||[];
  return {dishId:selected.id,quality:qualityQueue.shift()||'standard'};
}

async function loadMap(level){
  const response = await fetch(`data/restaurant-${level}.json`);
  if(!response.ok) throw new Error(`Không tải được map ${level}`);
  const map=await response.json();
  map.layoutRows=[...map.rows];
  map.rows=map.rows.map(row=>row.replace(/[Tb]/g,'.'));
  return map;
}

function isBaseTileWalkable(map,x,y){
  if(y<0||y>=map.rows.length||x<0||x>=map.rows[0].length) return false;
  return !'~#WSPLFcN'.includes(map.rows[y][x]);
}
function isTileWalkable(map,x,y){const key=`${x},${y}`;return isBaseTileWalkable(map,x,y)&&!map.decorBlocked?.has(key)&&!map.tableBlocked?.has(key);}

function updateTableGeometry(table,tile=table.tile){
  table.tile=[...tile];table.footprint=[tile[0],tile[1],2,1];
  table.seat=[tile[0]-1,tile[1]];table.service=[tile[0],tile[1]+1];
  table.stools=[[tile[0]-1,tile[1]],[tile[0]+2,tile[1]]];
  return table;
}
function tableCells(table,tile=table.tile){return [[tile[0],tile[1]],[tile[0]+1,tile[1]],[tile[0]-1,tile[1]],[tile[0]+2,tile[1]]];}
function syncTableCollision(map,tables){map.tableBlocked=new Set(tables.filter(table=>table.placed).flatMap(table=>tableCells(table).map(keyOf)));}
function initialTablesForMap(map){
  const state=tableStoreState[map.id],saved=state.layout;
  if(saved)return saved.map(item=>updateTableGeometry({...item,state:'CLEAN',guestId:null,reserved:false,meal:null},item.tile));
  const styleId=map.id==='lv1'?'basic':'polished';
  const layout=map.tables.map(template=>updateTableGeometry({id:template.id,styleId,placed:true,state:'CLEAN',guestId:null,reserved:false,meal:null},[template.footprint[0],template.footprint[1]]));
  state.layout=layout.map(table=>({id:table.id,styleId:table.styleId,placed:table.placed,tile:[...table.tile]}));
  return layout;
}
function saveTableLayout(w){
  tableStoreState[w.level].layout=w.tables.map(table=>({id:table.id,styleId:table.styleId,placed:table.placed,tile:[...table.tile]}));
}

function decorForMap(map){
  const saved=decorStoreState.tiles[map.id]||{};
  return decorStoreState.placed.slice(0,map.decorSlots.length).map((id,index)=>{const item=DECOR_CATALOG.find(entry=>entry.id===id),tile=saved[id]||map.decorSlots[index];return {...item,tile:[...tile]};});
}

function decorCells(item,tile=item.tile){const [fw,fh]=item.footprint||[1,1],cells=[];for(let y=0;y<fh;y++)for(let x=0;x<fw;x++)cells.push([tile[0]+x,tile[1]+y]);return cells;}
function syncDecorCollision(map,decor){map.decorBlocked=new Set(decor.flatMap(item=>decorCells(item).map(keyOf)));}
function reservedRestaurantTiles(w){
  const reserved=new Set();
  const add=value=>{if(Array.isArray(value)&&value.length===2&&value.every(Number.isFinite))reserved.add(keyOf(value));else if(Array.isArray(value))value.forEach(add);};
  Object.values(w.map.stations).forEach(add);w.tables.filter(table=>table.placed).forEach(table=>{add(tableCells(table));add(table.service);});
  return reserved;
}
function isValidDecorTile(w,tile,ignoreId=null,candidateItem=null){
  const item=candidateItem||w.decor.find(entry=>entry.id===ignoreId);if(!item)return false;
  const cells=decorCells(item,tile),reserved=reservedRestaurantTiles(w);
  const occupied=new Set(w.decor.filter(entry=>entry.id!==ignoreId).flatMap(entry=>decorCells(entry).map(keyOf)));
  return cells.every(cell=>isBaseTileWalkable(w.map,...cell)&&!reserved.has(keyOf(cell))&&!occupied.has(keyOf(cell))&&!w.characters.some(character=>!character.done&&sameTile(character.tile,cell)));
}
function firstValidDecorTile(w,item){for(let y=1;y<12;y++)for(let x=1;x<19;x++)if(isValidDecorTile(w,[x,y],null,item))return [x,y];return null;}
function preferredDecorTile(w,item){for(const tile of w.map.decorSlots)if(isValidDecorTile(w,tile,null,item))return [...tile];return firstValidDecorTile(w,item);}
function refreshWorldDecor(){if(!world)return;world.decor=decorForMap(world.map);syncDecorCollision(world.map,world.decor);world.conflict=world.decor.some(a=>world.decor.some(b=>a!==b&&a.kind!==b.kind&&['zen','yatta'].includes(a.kind)&&['zen','yatta'].includes(b.kind)&&Math.max(Math.abs(a.tile[0]-b.tile[0]),Math.abs(a.tile[1]-b.tile[1]))<=1));}

function isValidTableTile(w,tile,ignoreId=null){
  if(w.level==='lv1'&&tile[1]<3)return false;
  const probe=updateTableGeometry({tile:[...tile]},tile),cells=tableCells(probe),service=probe.service;
  const otherBlocked=new Set(w.tables.filter(table=>table.placed&&table.id!==ignoreId).flatMap(table=>tableCells(table).map(keyOf)));
  const decorBlocked=new Set(w.decor.flatMap(item=>decorCells(item).map(keyOf)));
  const fixed=new Set();
  const add=value=>{if(Array.isArray(value)&&value.length===2&&value.every(Number.isFinite))fixed.add(keyOf(value));else if(Array.isArray(value))value.forEach(add);};
  Object.values(w.map.stations).forEach(add);
  fixed.delete(keyOf(service));
  return cells.every(cell=>isBaseTileWalkable(w.map,...cell)&&!otherBlocked.has(keyOf(cell))&&!decorBlocked.has(keyOf(cell))&&!fixed.has(keyOf(cell)))
    &&isBaseTileWalkable(w.map,...service)&&!otherBlocked.has(keyOf(service))&&!decorBlocked.has(keyOf(service))
    &&!w.characters.some(character=>!character.done&&(cells.some(cell=>sameTile(cell,character.tile))||sameTile(service,character.tile)||character.path.some(step=>cells.some(cell=>sameTile(cell,step)))));
}
function firstValidTableTile(w,ignoreId=null){for(let y=2;y<11;y++)for(let x=4;x<16;x++)if(isValidTableTile(w,[x,y],ignoreId))return [x,y];return null;}

function aStar(map,start,goal,extraBlocked=new Set()){
  const startKey=keyOf(start), goalKey=keyOf(goal);
  if(startKey===goalKey) return [];
  const open=[{tile:start,g:0,f:manhattan(start,goal)}], came=new Map(), best=new Map([[startKey,0]]);
  while(open.length){
    open.sort((a,b)=>a.f-b.f||a.g-b.g);
    const cur=open.shift(), ck=keyOf(cur.tile);
    if(ck===goalKey){
      const result=[]; let k=goalKey;
      while(k!==startKey){ const [x,y]=k.split(',').map(Number); result.push([x,y]); k=came.get(k); }
      return result.reverse();
    }
    for(const [dx,dy] of DIRS){
      const next=[cur.tile[0]+dx,cur.tile[1]+dy], nk=keyOf(next);
      if((!isTileWalkable(map,...next)&&nk!==goalKey)||(extraBlocked.has(nk)&&nk!==goalKey)) continue;
      const ng=cur.g+1;
      if(ng >= (best.get(nk)??Infinity)) continue;
      best.set(nk,ng); came.set(nk,ck); open.push({tile:next,g:ng,f:ng+manhattan(next,goal)});
    }
  }
  return null;
}

class Character{
  constructor(id,data,tile,kind='staff'){
    Object.assign(this,data); this.id=id; this.kind=kind; this.tile=[...tile]; this.px=tile[0]*TILE+16; this.py=tile[1]*TILE+28;
    this.path=[]; this.facing='down'; this.anim='idle_down'; this.animTime=0; this.state='IDLE'; this.jobId=null; this.workLeft=0;
    this.stamina=100; this.station=[...tile]; this.carry=null; this.dozeLeft=0; this.idleTime=0; this.stationaryTime=0;
  }
  goTo(tile,map){
    const path=aStar(map,this.tile,tile);
    if(path===null) return false;
    this.path=path; this.state=path.length?'WALK':'ARRIVED'; this.idleTime=0; return true;
  }
  updateMove(dt){
    if(!this.path.length){ if(this.state==='WALK') this.state='ARRIVED'; return false; }
    const next=this.path[0], tx=next[0]*TILE+16, ty=next[1]*TILE+28, dx=tx-this.px, dy=ty-this.py;
    const dist=Math.hypot(dx,dy), step=this.speed*TILE*dt;
    if(Math.abs(dx)>Math.abs(dy)) this.facing=dx>0?'right':'left'; else this.facing=dy>0?'down':'up';
    this.anim=`walk_${this.facing==='left'?'right':this.facing}`;
    if(dist<=step){ this.px=tx; this.py=ty; this.tile=[...next]; this.path.shift(); }
    else { this.px+=dx/dist*step; this.py+=dy/dist*step; }
    if(!this.path.length) this.state='ARRIVED';
    return true;
  }
}

class World{
  constructor(map,options={}){
    this.map=map; this.level=map.id; this.roomId=options.roomId||roomIdForLevel(map.id);this.roomLevel=ROOM_CONFIG[this.roomId]?.level||1;this.time=0; this.timeLeft=map.rushDuration; this.speed=options.speed||1; this.running=options.running??false;
    if(this.level==='lv2'){staffSlotState.chef=Math.max(staffSlotState.chef,2);gachaState.owned.add('yae');}
    this.debug=false; this.coins=economyState.coins; this.rep=50; this.stress=0; this.rage=0; this.atmosphere=0; this.revenue=0;
    this.jobs=[]; this.characters=[]; this.guests=[]; this.floorItems=[]; this.decor=[]; this.plates=[]; this.nextId=1;
    this.spawnClock=0; this.windClock=0; this.patrolClock=0; this.huaPatrolIndex=0; this.dozeClock=0; this.conflict=false;
    this.metrics={maxJobWait:0,maxGuestState:0,overlapSeconds:0,overlapPairs:{},slideViolations:0,slideDetails:{},jobStarvationViolations:0,completedJobs:0,served:0,angry:0};
    this.tables=initialTablesForMap(map);syncTableCollision(this.map,this.tables);
    const defaults={reception:['rozaliya'],server:['liliya'],chef:['kiana'],cleaner:['griseo']},provided=options.assignments||{};
    this.assignments=Object.fromEntries(Object.keys(defaults).map(role=>{const value=provided[role]??defaults[role];return [role,(Array.isArray(value)?value:[value]).filter(Boolean)];}));
    this.receptionId=this.assignments.reception[0]||'rozaliya';
    this.addStaff('senti',map.stations.sentiSpawn);
    this.addStaff('fuhua',map.stations.fuHuaHome);
    for(const role of ['reception','server','chef','cleaner'])this.addRoleStaff(role);
    this.decor=decorForMap(map);syncDecorCollision(this.map,this.decor);
    if(this.running)this.spawnGuest(true);
  }
  addStaff(id,tile){ const c=new Character(id,STAFF[id],tile); this.characters.push(c); return c; }
  roleStation(role){return this.map.stations[`${role}Idle`]||({chef:cookStationsForMap(this.map)[0],cleaner:this.map.stations.wash}[role])||this.map.stations.sentiSpawn;}
  openSpawnNear(base,index=0){
    const offsets=[[0,0],[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[1,1],[-1,1]];
    for(let i=index;i<offsets.length;i++){const tile=[base[0]+offsets[i][0],base[1]+offsets[i][1]];if(isTileWalkable(this.map,...tile)&&!this.characters.some(c=>sameTile(c.tile,tile)))return tile;}
    return [...base];
  }
  addRoleStaff(role){
    if(this.level==='lv1'&&['chef','cleaner'].includes(role))return;
    const selected=this.assignments[role]||[],ids=[...new Set([...selected,...STAFF_BY_ROLE[role].filter(id=>!selected.includes(id)&&id!=='veliona'&&gachaState.owned.has(id))])].slice(0,staffSlotState[role]);
    const base=this.roleStation(role);ids.forEach((id,index)=>this.addStaff(id,role==='chef'&&this.level==='lv2'?(cookStationsForMap(this.map)[index]||this.openSpawnNear(base,index)):this.openSpawnNear(base,index)));
  }
  fillOpenStaffSlots(){
    for(const role of ['reception','server','chef','cleaner']){
      if(this.level==='lv1'&&['chef','cleaner'].includes(role))continue;
      const present=this.characters.filter(c=>c.kind==='staff'&&c.role===role);
      const candidates=STAFF_BY_ROLE[role].filter(id=>id!=='veliona'&&gachaState.owned.has(id)&&!present.some(c=>c.id===id));
      while(present.length<staffSlotState[role]&&candidates.length){const id=candidates.shift(),index=present.length,tile=role==='chef'&&this.level==='lv2'?(cookStationsForMap(this.map)[index]||this.openSpawnNear(this.roleStation(role),index)):this.openSpawnNear(this.roleStation(role),index),c=this.addStaff(id,tile);present.push(c);}
    }
  }
  staff(id){ return this.characters.find(c=>c.id===id); }
  addJob(type,role,standTile,facing,duration,priority,payload={}){
    if(this.jobs.some(j=>!j.done&&j.type===type&&j.payload.tableId&&j.payload.tableId===payload.tableId)) return null;
    const job={id:`j${this.nextId++}`,type,role,standTile:[...standTile],facing,duration,priority,claimedBy:null,createdAt:this.time,payload,phase:'OPEN',workLeft:duration,done:false};
    this.jobs.push(job); return job;
  }
  spawnGuest(force=false){
    const queue=this.map.stations.queue;
    const occupied=new Set();
    for(const g of this.guests.filter(g=>!g.done)){
      occupied.add(keyOf(g.tile));
      if(g.queueTarget&&['CONFUSED','WALK_IN','QUEUING','AT_FRONT'].includes(g.guestState)) occupied.add(keyOf(g.queueTarget));
    }
    let target=[...queue].reverse().find(t=>!occupied.has(keyOf(t)));
    if(!target&&!force) return false;
    const reservedOrder=reserveGuestOrder();
    if(!reservedOrder)return false;
    target=target||queue[queue.length-1];
    const id=`guest${this.nextId++}`;
    const archetype=GUEST_ARCHETYPES[Math.floor(seeded()*GUEST_ARCHETYPES.length)];
    const g=new Character(id,{...archetype,name:archetype.name,role:'guest',speed:3,work:1},this.map.stations.entrance,'guest');
    Object.assign(g,{guestState:this.conflict?'CONFUSED':'WALK_IN',stateAge:0,patience:100,queueTarget:target,order:reservedOrder.dishId,orderQuality:reservedOrder.quality,tableId:null,eatLeft:0,done:false});
    if(g.guestState==='CONFUSED') g.confusedLeft=3; else g.goTo(target,this.map);
    this.guests.push(g); this.characters.push(g); return true;
  }
  availableTable(){ return this.tables.find(t=>t.placed&&t.state==='CLEAN'&&!t.reserved); }
  jobForGuest(guest){ return this.jobs.find(j=>!j.done&&j.payload.guestId===guest.id); }
  availableCookStation(){
    const used=new Set(this.jobs.filter(job=>!job.done&&job.type==='COOK').map(job=>keyOf(job.standTile)));
    const hasChef=this.characters.some(character=>character.kind==='staff'&&character.role==='chef');
    const blockedByOtherRoles=new Set(hasChef?this.characters.filter(character=>character.kind==='staff'&&character.role!=='chef'&&!character.done).map(character=>keyOf(character.tile)):[]);
    return cookStationsForMap(this.map).find(tile=>!used.has(keyOf(tile))&&!blockedByOtherRoles.has(keyOf(tile)))||null;
  }
  update(dt){
    if(!this.running)return;
    this.time+=dt; this.timeLeft=Math.max(0,this.timeLeft-dt); if(this.timeLeft<=0) this.running=false;
    if(!this.running)return;
    this.spawnClock+=dt; this.windClock+=dt; this.patrolClock+=dt; this.dozeClock+=dt;
    if(this.dozeClock>=30){this.dozeClock=0;if(this.staff('liliya')&&seeded()<.15)this.forceDoze('liliya');if(this.staff('bronya')&&seeded()<.1)this.forceDoze('bronya');}
    const spawnGap=Math.max(3,7*(this.atmosphere>=30?.8:1)*(1-this.rep/400));
    if(this.running&&this.spawnClock>=spawnGap){ this.spawnClock=0; this.spawnGuest(); }
    if(this.level==='lv1'&&this.windClock>=20){ this.windClock=0; if(seeded()<.3) this.spawnTrash(); }
    this.updateGuests(dt); this.buildJobs(); this.updateStaff(dt); this.updateFuHua(dt); this.updateMeters(dt); this.updateDiagnostics(dt);
    this.jobs=this.jobs.filter(j=>!j.done&&this.time-j.createdAt<90);
  }
  spawnTrash(){
    const walk=[]; for(let y=0;y<13;y++)for(let x=0;x<20;x++)if(isTileWalkable(this.map,x,y))walk.push([x,y]);
    if(walk.length) this.floorItems.push({id:`trash${this.nextId++}`,type:'trash',tile:walk[Math.floor(seeded()*walk.length)]});
  }
  updateGuests(dt){
    const active=this.guests.filter(g=>!g.done);
    for(const g of active){
      g.stateAge+=dt; this.metrics.maxGuestState=Math.max(this.metrics.maxGuestState,g.stateAge);
      const waiting=['QUEUING','AT_FRONT','SEATED_WAITING'].includes(g.guestState);
      if(waiting){ const rate=g.guestState==='SEATED_WAITING'?1.5:2; g.patience-=rate*(this.atmosphere<=-30?1.3:this.atmosphere>=30?.7:1)*dt; }
      if(waiting&&g.patience<=0){ this.angryLeave(g); continue; }
      if(g.guestState==='CONFUSED'){
        g.confusedLeft-=dt; g.anim='idle_down'; if(g.confusedLeft<=0){ g.guestState='WALK_IN';g.stateAge=0;g.goTo(g.queueTarget,this.map); }
      }else if(g.guestState==='WALK_IN'||g.guestState==='QUEUING'){
        if(g.updateMove(dt)){ g.guestState='QUEUING'; }
        else if(sameTile(g.tile,this.map.stations.queue[0])){ g.guestState='AT_FRONT';g.queueTarget=null;g.stateAge=0; }
        else { this.advanceQueue(g); }
      }else if(g.guestState==='FOLLOW_TO_SEAT'){
        const moved=g.updateMove(dt);
        if(!moved&&!g.path.length&&g.arrivingSeat&&g.tableId){ g.guestState='SEATED_WAITING';g.stateAge=0;g.anim='idle_right';g.arrivingSeat=false; }
      }else if(g.guestState==='SEATED_WAITING'){ g.anim='idle_right'; }
      else if(g.guestState==='EATING'){
        g.eatLeft-=dt; g.anim='work_a'; if(g.eatLeft<=0) this.payAndLeave(g);
      }else if(g.guestState==='PAY_AND_LEAVE'||g.guestState==='ANGRY_LEAVE'){
        g.updateMove(dt); if(!g.path.length){g.done=true;this.characters=this.characters.filter(c=>c!==g);}
      }
    }
  }
  advanceQueue(g){
    const q=this.map.stations.queue, idx=q.findIndex(t=>sameTile(t,g.tile));
    if(idx>0){
      const next=q[idx-1];
      const blocked=this.guests.some(o=>o!==g&&!o.done&&(
        sameTile(o.tile,next)
        ||(['CONFUSED','WALK_IN','QUEUING','AT_FRONT'].includes(o.guestState)&&sameTile(o.queueTarget,next))
      ));
      if(!blocked&&g.goTo(next,this.map))g.queueTarget=[...next];
    }
    else if(idx===0){g.guestState='AT_FRONT';g.queueTarget=null;g.stateAge=0;}
  }
  buildJobs(){
    for(const g of this.guests.filter(x=>!x.done)){
      if(g.guestState==='AT_FRONT'&&!this.jobForGuest(g)){
        const table=this.availableTable();
        if(table){ table.reserved=true;table.guestId=g.id;g.tableId=table.id;this.addJob('SEAT','reception',this.map.stations.seatGreeting,'down',.6,2,{guestId:g.id,tableId:table.id}); }
      }
      if(g.guestState==='SEATED_WAITING'&&!this.jobForGuest(g)){
        const role=this.characters.some(c=>c.kind==='staff'&&c.role==='chef')?'chef':'senti';
        const cookStation=this.availableCookStation();
        if(cookStation)this.addJob('COOK',role,cookStation,'down',1.5,2,{guestId:g.id,tableId:g.tableId,dish:g.order,fromWarmer:true});
      }
    }
    for(const table of this.tables.filter(table=>table.placed)){
      if(table.state==='DIRTY'&&!this.jobs.some(j=>j.type==='CLEAN_TABLE'&&j.payload.tableId===table.id)){
        const role=this.characters.some(c=>c.kind==='staff'&&c.role==='cleaner')?'cleaner':'senti'; this.addJob('CLEAN_TABLE',role,table.service,'right',1.5,1,{tableId:table.id});
      }
    }
    for(const item of this.floorItems){
      if(item.type==='trash'&&!this.jobs.some(j=>j.type==='PICK_TRASH'&&j.payload.itemId===item.id)){
        this.addJob('PICK_TRASH',this.characters.some(c=>c.kind==='staff'&&c.role==='cleaner')?'cleaner':'senti',item.tile,'down',.8,1,{itemId:item.id});
      }
    }
  }
  updateStaff(dt){
    for(const c of this.characters.filter(x=>x.kind==='staff'&&x.id!=='fuhua')){
      c.animTime+=dt;
      if(c.id==='seele')c.speed=c.stamina<30?STAFF.veliona.speed:STAFF.seele.speed;
      if(c.lazyLeft>0||c.dozeLeft>0){
        if(!c.beingScolded){c.lazyLeft=Math.max(0,(c.lazyLeft||c.dozeLeft)-dt);c.dozeLeft=c.lazyLeft;}
        c.state=c.beingScolded?'CAUGHT_LAZY':'DOZE';c.anim=c.beingScolded?'emote':'doze';
        if(c.lazyLeft<=0&&!c.beingScolded)this.wake(c);continue;
      }
      if(c.stamina<=0){c.state='EXHAUSTED';c.anim='rest_floor';c.stamina=Math.min(50,c.stamina+3*dt);if(c.stamina>=50)c.state='IDLE';continue;}
      const job=this.jobs.find(j=>!j.done&&j.id===c.jobId);
      if(job){ this.runJob(c,job,dt); continue; }
      if(c.updateMove(dt)){continue;}
      c.state='IDLE';c.idleTime+=dt;c.anim=`idle_${c.facing==='left'?'right':c.facing}`;
      const available=this.jobs.filter(j=>!j.done&&!j.claimedBy&&(j.role===c.role||(c.id==='senti'&&j.role==='senti')));
      if(available.length){
        available.sort((a,b)=>b.priority-a.priority||(aStar(this.map,c.tile,a.standTile)?.length??999)-(aStar(this.map,c.tile,b.standTile)?.length??999)||a.createdAt-b.createdAt);
        this.claim(c,available[0]);
      }else if(!sameTile(c.tile,c.station)&&c.id!=='senti') c.goTo(c.station,this.map);
      if(c.id==='senti'&&this.atmosphere<=-30&&c.idleTime>6){c.idleTime=0;this.floorItems.push({id:`graffiti${this.nextId++}`,type:'graffiti',tile:[4,4]});this.rage=clamp(this.rage+5,0,100);}
    }
  }
  claim(c,job){ job.claimedBy=c.id;c.jobId=job.id;job.phase='TRAVEL';if(!c.goTo(job.standTile,this.map)){job.claimedBy=null;c.jobId=null;job.phase='OPEN';} }
  runJob(c,job,dt){
    if(job.phase==='TRAVEL'){
      if(c.updateMove(dt))return;
      job.phase='WORK';job.workLeft=job.duration*c.work;c.facing=job.facing;c.state='WORK';
    }
    if(job.phase==='WORK'){
      c.state='WORK';c.anim=`work_${job.type.toLowerCase()}`;job.workLeft-=dt;
      if(job.workLeft<=0)this.finishJob(c,job);
    }else if(job.phase==='ESCORT'){
      const guest=this.guests.find(g=>g.id===job.payload.guestId);
      const receptionistMoving=c.updateMove(dt);
      if(guest&&guest.guestState==='FOLLOW_TO_SEAT'&&!guest.path.length&&manhattan(guest.tile,c.tile)>1)guest.goTo([...c.tile],this.map);
      if(receptionistMoving||guest&&manhattan(guest.tile,c.tile)>1)return;
      if(guest){const table=this.tables.find(t=>t.id===job.payload.tableId);if(!table?.placed||!guest.goTo(table.seat,this.map)){this.cancelSeatJob(c,job,guest);return;}guest.arrivingSeat=true;job.phase='WAIT_SEAT';return;}
      this.complete(c,job,3);
    }else if(job.phase==='WAIT_SEAT'){
      const guest=this.guests.find(g=>g.id===job.payload.guestId);
      if(guest&&guest.guestState!=='SEATED_WAITING')return;
      this.complete(c,job,3);
    }else if(job.phase==='DELIVER'){
      if(c.updateMove(dt))return; job.phase='PLACE';job.workLeft=.3;
    }else if(job.phase==='PLACE'){
      c.anim='work_serve';job.workLeft-=dt;if(job.workLeft<=0){
        const g=this.guests.find(x=>x.id===job.payload.guestId),table=this.tables.find(t=>t.id===job.payload.tableId);
        if(g&&table){g.guestState='EATING';g.eatLeft=4;g.stateAge=0;table.guestId=g.id;table.meal={dish:job.payload.dish,servedAt:this.time};}
        c.carry=null;this.complete(c,job,3);
      }
    }
  }
  finishJob(c,job){
    const table=this.tables.find(t=>t.id===job.payload.tableId), guest=this.guests.find(g=>g.id===job.payload.guestId);
    if(job.type==='SEAT'&&table?.placed&&guest){
      job.phase='ESCORT';guest.guestState='FOLLOW_TO_SEAT';guest.queueTarget=null;guest.stateAge=0;
      const started=c.goTo(table.service,this.map);
      if(!started&& !sameTile(c.tile,table.service)){this.cancelSeatJob(c,job,guest);return;}
      guest.path=[];return;
    }
    if(job.type==='COOK'&&guest){this.plates.push({guestId:guest.id,tableId:guest.tableId,bornAt:this.time,dish:job.payload.dish});this.addJob('SERVE','server',this.map.stations.passPickup,'up',.3,2,{guestId:guest.id,tableId:guest.tableId,dish:job.payload.dish});this.complete(c,job,5);return;}
    if(job.type==='SERVE'&&table){this.plates=this.plates.filter(plate=>plate.guestId!==job.payload.guestId);c.carry={kind:'tray',dish:job.payload.dish};job.phase='DELIVER';c.goTo(table.service,this.map);return;}
    if(job.type==='CLEAN_TABLE'&&table){table.state='CLEAN';table.reserved=false;table.guestId=null;table.meal=null;this.complete(c,job,4);return;}
    if(job.type==='PICK_TRASH'){this.floorItems=this.floorItems.filter(i=>i.id!==job.payload.itemId);this.complete(c,job,2);return;}
    this.complete(c,job,3);
  }
  complete(c,job,stamina){job.done=true;c.jobId=null;c.state='IDLE';c.stamina=Math.max(0,c.stamina-stamina);this.metrics.completedJobs++;}
  cancelSeatJob(c,job,guest){job.done=true;c.jobId=null;c.state='IDLE';if(guest){guest.guestState='AT_FRONT';guest.stateAge=0;guest.tableId=null;}const table=this.tables.find(t=>t.id===job.payload.tableId);if(table){table.reserved=false;table.guestId=null;table.meal=null;}}
  payAndLeave(g){
    const table=this.tables.find(t=>t.id===g.tableId);if(table){table.state='DIRTY';table.reserved=false;table.guestId=null;table.meal=null;}
    const dish=dishById(g.order),trendBonus=dailyTrend().dishId===dish.id?.5:0,qualityBonus=g.orderQuality==='perfect'?PERFECT_DISH_BONUS:0,tipRate=this.atmosphere<=-30?.25:this.atmosphere>=30?.08:.15;
    const salePrice=Math.round(dish.price*(1+trendBonus+qualityBonus)),pay=salePrice+Math.round(salePrice*tipRate);this.coins+=pay;economyState.coins=this.coins;this.revenue+=pay;this.metrics.served++;
    if(qualityBonus)showToast(`✨ Món Hoàn hảo: ${dish.name} được thưởng +${Math.round(PERFECT_DISH_BONUS*100)}% giá bán!`);
    g.guestState='PAY_AND_LEAVE';g.stateAge=0;g.goTo(this.map.stations.entrance,this.map);
  }
  angryLeave(g){
    this.rep=Math.max(0,this.rep-3);this.stress=clamp(this.stress+5,0,100);this.metrics.angry++;
    const table=this.tables.find(t=>t.id===g.tableId);if(table){table.state='DIRTY';table.reserved=false;table.guestId=null;table.meal=null;if(seeded()<.5)this.spawnTrash();}
    const job=this.jobForGuest(g);if(job)job.done=true;g.guestState='ANGRY_LEAVE';g.stateAge=0;g.path=[];g.goTo(this.map.stations.entrance,this.map);
  }
  updateFuHua(dt){
    const hua=this.staff('fuhua'); if(!hua)return;
    hua.animTime+=dt;
    const sleeper=this.characters.find(c=>c.kind==='staff'&&c.id!=='fuhua'&&(c.lazyLeft>0||c.dozeLeft>0));
    if(hua.scoldLeft>0){
      hua.scoldLeft-=dt;hua.anim='work_book';hua.state='SCOLD';
      const target=this.staff(hua.wakeTargetId);if(target){target.beingScolded=true;target.state='CAUGHT_LAZY';target.anim='emote';}
      if(hua.scoldLeft<=0){if(target)this.wake(target);hua.wakeTargetId=null;hua.state='IDLE';hua.scoldCooldown=30;this.patrolClock=0;showToast('Fu Hua nhắc nhở xong — nhân viên quay lại làm việc.');}
      return;
    }
    hua.scoldCooldown=Math.max(0,(hua.scoldCooldown||0)-dt);
    if(sleeper&&hua.scoldCooldown<=0){
      if(hua.wakeTargetId!==sleeper.id){hua.wakeTargetId=sleeper.id;hua.goTo(this.adjacentWalkable(sleeper.tile,hua.tile),this.map);}
      if(hua.updateMove(dt))return;
      if(manhattan(hua.tile,sleeper.tile)<=1){hua.scoldLeft=.6;sleeper.beingScolded=true;hua.anim='work_book';hua.state='SCOLD';return;}
    }else if(hua.updateMove(dt)){}
    else if(this.atmosphere>=60){hua.anim='work_sigh';hua.state='SIGH';}
    else if(this.patrolClock>=12){
      this.patrolClock=0;const p=this.map.stations.patrol[this.huaPatrolIndex++%this.map.stations.patrol.length];
      if(!this.characters.some(c=>c!==hua&&!c.done&&sameTile(c.tile,p)))hua.goTo(p,this.map);
    }
    else{hua.anim='idle_down';hua.state='IDLE';}
  }
  adjacentWalkable(tile,from=tile){
    const options=DIRS.map(([dx,dy])=>[tile[0]+dx,tile[1]+dy]).filter(t=>isTileWalkable(this.map,...t)&&!this.characters.some(c=>!c.done&&sameTile(c.tile,t)))
      .map(t=>({tile:t,path:aStar(this.map,from,t)})).filter(entry=>entry.path!==null).sort((a,b)=>a.path.length-b.path.length);
    return options[0]?.tile||tile;
  }
  wake(c){c.dozeLeft=0;c.lazyLeft=0;c.beingScolded=false;c.state='IDLE';c.anim='idle_down';}
  updateMeters(dt){
    const mess=this.floorItems.filter(i=>i.type==='trash'||i.type==='graffiti').length;
    this.stress=clamp(this.stress+(mess*.4+(this.atmosphere>=30?.3:this.atmosphere<=-30?-.1:0)+(this.conflict?.1:0))*dt,0,100);
    if(this.stress>=100){this.floorItems=[];for(const t of this.tables)if(t.state==='DIRTY')t.state='CLEAN';this.coins-=Math.floor(this.revenue*.5);economyState.coins=this.coins;this.stress=30;this.rage=0;showToast('Edge of Taixuan! Fu Hua tịch thu 50% doanh thu ca.');}
  }
  updateDiagnostics(dt){
    for(const j of this.jobs){
      const wait=this.time-j.createdAt;this.metrics.maxJobWait=Math.max(this.metrics.maxJobWait,wait);
      const idleWorker=this.characters.some(c=>c.kind==='staff'&&c.stamina>0&&!c.jobId&&!c.path.length&&(c.role===j.role||(c.id==='senti'&&j.role==='senti')));
      if(!j.claimedBy&&wait>20&&idleWorker)this.metrics.jobStarvationViolations++;
    }
    for(const c of this.characters){
      if(c._diagPx!==undefined){
        const moved=Math.hypot(c.px-c._diagPx,c.py-c._diagPy)>.01;
        if(moved&&!c.anim.startsWith('walk_')){this.metrics.slideViolations++;const detail=`${c.id}:${c.anim}:${c.state}`;this.metrics.slideDetails[detail]=(this.metrics.slideDetails[detail]||0)+1;}
      }
      c._diagPx=c.px;c._diagPy=c.py;
    }
    const idle=this.characters.filter(c=>!c.path.length&&c.state!=='WALK'&&!c.done);
    for(let i=0;i<idle.length;i++)for(let k=i+1;k<idle.length;k++)if(sameTile(idle[i].tile,idle[k].tile)){
      this.metrics.overlapSeconds+=dt;
      const pair=[idle[i].id,idle[k].id].sort().join('+');
      this.metrics.overlapPairs[pair]=(this.metrics.overlapPairs[pair]||0)+dt;
    }
  }
  forceDoze(id='liliya'){const l=this.staff(id)||this.characters.find(c=>c.kind==='staff'&&!['senti','fuhua'].includes(c.id));if(l){l.lazyLeft=8;l.dozeLeft=8;l.beingScolded=false;l.state='DOZE';l.path=[];const j=this.jobs.find(x=>x.id===l.jobId);if(j){j.claimedBy=null;j.phase='OPEN';l.jobId=null;}showToast(`${l.name} làm biếng — Fu Hua đang tới nhắc nhở.`);}}
  toggleConflict(){this.conflict=!this.conflict;if(this.conflict){this.decor=[{...DECOR_CATALOG.find(item=>item.id==='bonsai'),tile:this.map.decorSlots[0]},{...DECOR_CATALOG.find(item=>item.id==='neon'),tile:this.map.decorSlots[1]}];syncDecorCollision(this.map,this.decor);}else refreshWorldDecor();showToast(this.conflict?'Đã đặt ZEN cạnh YATTA: khách mới sẽ “???”.':'Đã gỡ cặp xung đột.');}
  sentiActionAt(tile){
    const senti=this.staff('senti');
    const job=this.jobs.filter(j=>!j.done&&sameTile(j.standTile,tile)).sort((a,b)=>b.priority-a.priority)[0];
    if(job){if(job.claimedBy){const old=this.staff(job.claimedBy);if(old){old.jobId=null;old.state='IDLE';}}job.claimedBy=null;senti.jobId=null;this.claim(senti,job);this.rage=clamp(this.rage+(job.type==='PICK_TRASH'?5:5),0,100);return;}
    senti.jobId=null;senti.goTo(tile,this.map);
  }
}

function drawWorld(w){
  ctx.clearRect(0,0,640,416);drawGround(w);if(decorPlacementState.active)drawDecorPlacementGrid(w);if(tablePlacementState.active)drawTablePlacementGrid(w);const drawables=[];
  for(const f of furniture(w))drawables.push(f);
  // The seat and guest share a row. Draw the table set just before that row's
  // character baseline so stools stay behind seated and walking guests.
  for(const table of w.tables.filter(table=>table.placed))drawables.push({sortY:table.tile[1]*TILE+20,draw:()=>drawDiningTable(table,w)});
  for(const plate of w.plates)drawables.push({sortY:129,draw:()=>drawPassPlate(plate,w)});
  const upgrades=upgradesForRoom(w.roomId);
  if(upgrades.waiting&&environmentImages.waitingLobby){
    const placement=w.level==='lv1'?[480,192,96,64]:[448,288,120,80];
    drawables.push({sortY:placement[1]+placement[3],draw:()=>ctx.drawImage(environmentImages.waitingLobby,...placement)});
  }
  for(const item of w.floorItems)drawables.push({sortY:item.tile[1]*TILE+28,draw:()=>drawFloorItem(item)});
  for(const d of w.decor)drawables.push({sortY:(d.tile[1]+(d.footprint?.[1]||1))*TILE,draw:()=>drawDecor(d)});
  for(const c of w.characters)drawables.push({sortY:c.py,draw:()=>drawCharacter(c,w)});
  drawables.sort((a,b)=>a.sortY-b.sortY);for(const d of drawables)d.draw();drawRain(w);
  if(w.level==='lv1'&&environmentImages.front)ctx.drawImage(environmentImages.front,0,288,640,128);
  if(decorPlacementState.active&&decorPlacementState.hoverTile){const [hx,hy]=decorPlacementState.hoverTile;ctx.fillStyle=decorPlacementState.valid?'#55e6a755':'#ff526655';ctx.fillRect(hx*TILE,hy*TILE,TILE,TILE);ctx.strokeStyle=decorPlacementState.valid?'#8affc8':'#ff9aa5';ctx.lineWidth=2;ctx.strokeRect(hx*TILE+1,hy*TILE+1,TILE-2,TILE-2);}
  if(tablePlacementState.active&&tablePlacementState.hoverTile){const [hx,hy]=tablePlacementState.hoverTile,probe=updateTableGeometry({tile:[hx,hy]},[hx,hy]);ctx.fillStyle=tablePlacementState.valid?'#55e6a744':'#ff526644';ctx.strokeStyle=tablePlacementState.valid?'#8affc8':'#ff9aa5';for(const cell of tableCells(probe)){ctx.fillRect(cell[0]*TILE,cell[1]*TILE,TILE,TILE);ctx.strokeRect(cell[0]*TILE+1,cell[1]*TILE+1,TILE-2,TILE-2);}}
  if(w.debug)drawDebug(w);
}

function drawDecorPlacementGrid(w){ctx.save();ctx.lineWidth=1;for(let y=0;y<13;y++)for(let x=0;x<20;x++){if(!isValidDecorTile(w,[x,y],decorPlacementState.dragId))continue;ctx.fillStyle='#62d8c610';ctx.fillRect(x*TILE,y*TILE,TILE,TILE);ctx.strokeStyle='#b4fff22c';ctx.strokeRect(x*TILE+.5,y*TILE+.5,TILE-1,TILE-1);}ctx.restore();}
function drawTablePlacementGrid(w){ctx.save();ctx.lineWidth=1;for(let y=1;y<12;y++)for(let x=2;x<17;x++){if(!isValidTableTile(w,[x,y],tablePlacementState.dragId))continue;ctx.fillStyle='#f0ae6112';ctx.fillRect(x*TILE,y*TILE,TILE*2,TILE);ctx.strokeStyle='#ffe0a644';ctx.strokeRect(x*TILE+.5,y*TILE+.5,TILE*2-1,TILE-1);}ctx.restore();}

function drawGround(w){
  const lv1=w.level==='lv1';
  const upgrades=upgradesForRoom(w.roomId);
  if(lv1&&environmentImages.ground){ctx.drawImage(environmentImages.ground,0,0,640,416);if(upgrades.floor)drawFloorUpgrade(w);return;}
  if(!lv1&&environmentImages.room2Ground){ctx.drawImage(environmentImages.room2Ground,0,0,640,416);if(upgrades.floor)drawFloorUpgrade(w);return;}
  if(!lv1){drawArcCityGround(w);return;}
  ctx.fillStyle=lv1?'#183145':'#362947';ctx.fillRect(0,0,640,416);
  for(let y=0;y<13;y++)for(let x=0;x<20;x++){
    const ch=w.map.rows[y][x];
    if(ch==='~'){ctx.fillStyle=((x+y)&1)?'#24485a':'#284f63';}
    else if(ch==='#'){ctx.fillStyle='#2a1e35';}
    else{ctx.fillStyle=lv1?(((x+y)&1)?'#776b66':'#82746d'):(((x+y)&1)?'#684b54':'#72535b');}
    ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
    if(ch==='~'){ctx.strokeStyle='#6ba0ad55';ctx.beginPath();ctx.moveTo(x*TILE+6,y*TILE+18);ctx.lineTo(x*TILE+21,y*TILE+18);ctx.stroke();}
  }
}

function drawArcCityGround(w){
  // Gian 2 is a separate Heliopolis room, not a recolour of the outdoor stall.
  const wall=ctx.createLinearGradient(0,0,0,96);wall.addColorStop(0,'#111b32');wall.addColorStop(1,'#26334b');ctx.fillStyle=wall;ctx.fillRect(0,0,640,416);
  ctx.fillStyle='#16253b';ctx.fillRect(0,0,640,32);
  ctx.fillStyle='#79d9dd';ctx.fillRect(0,29,640,3);

  // Arc City skyline windows across the north wall.
  for(let x=18;x<622;x+=54){
    ctx.fillStyle='#0a1428';ctx.fillRect(x,5,42,20);
    ctx.fillStyle='#203c59';ctx.fillRect(x+2,7,38,16);
    ctx.fillStyle=(x/54&1)?'#ef77b7':'#5ccfe0';ctx.fillRect(x+7,17,4,4);
    ctx.fillStyle='#f6c762';ctx.fillRect(x+18,10,4,6);ctx.fillRect(x+30,14,4,7);
  }

  for(let y=1;y<13;y++)for(let x=0;x<20;x++){
    const ch=w.map.rows[y][x],px=x*TILE,py=y*TILE;
    if(ch==='#'){
      ctx.fillStyle='#142038';ctx.fillRect(px,py,TILE,TILE);
      ctx.fillStyle='#3e5470';ctx.fillRect(px,py,TILE,3);
      continue;
    }
    const kitchenZone=y<=2&&x<10;
    const serviceZone=y<=2&&x>=10;
    if(kitchenZone)ctx.fillStyle=((x+y)&1)?'#6b5158':'#745a61';
    else if(serviceZone)ctx.fillStyle=((x+y)&1)?'#496774':'#526f7b';
    else ctx.fillStyle=((x+y)&1)?'#365a68':'#3d6370';
    ctx.fillRect(px,py,TILE,TILE);
    ctx.strokeStyle=kitchenZone?'#9c778055':'#80bac055';ctx.lineWidth=1;ctx.strokeRect(px+.5,py+.5,TILE-1,TILE-1);
    if(!kitchenZone&&!serviceZone){ctx.fillStyle='#a6e9df18';ctx.fillRect(px+3,py+3,2,2);ctx.fillRect(px+24,py+23,3,3);}
  }

  // Fixed visual zoning; collision still comes entirely from the map grid.
  ctx.fillStyle='#211a32dd';ctx.fillRect(32,34,286,15);
  ctx.fillStyle='#f4ba61';ctx.fillRect(38,38,3,7);
  ctx.font='bold 9px ui-monospace';ctx.textAlign='left';ctx.fillStyle='#fff0d5';ctx.fillText('BẾP HELIOPOLIS · 3 TRẠM',48,44);
  ctx.fillStyle='#15283bcc';ctx.fillRect(322,34,286,15);
  ctx.fillStyle='#61d4da';ctx.fillRect(328,38,3,7);ctx.fillStyle='#d6fbfa';ctx.fillText('RỬA · PASS · KHO LẠNH',338,44);

  // Dining rug gives the second room its own spatial identity.
  ctx.fillStyle='#213e52aa';ctx.fillRect(48,144,544,144);
  ctx.strokeStyle='#e7bd6955';ctx.lineWidth=2;ctx.strokeRect(49,145,542,142);
  for(let x=64;x<592;x+=32){ctx.fillStyle='#e7bd6917';ctx.fillRect(x,151,2,130);}

  ctx.fillStyle='#102137';ctx.fillRect(0,384,640,32);
  ctx.fillStyle='#5fd8d9';ctx.fillRect(0,384,640,3);
  ctx.fillStyle='#ef74b7';ctx.fillRect(208,384,224,3);
  ctx.font='bold 10px ui-monospace';ctx.textAlign='right';ctx.fillStyle='#87e5e0';ctx.fillText('ARC CITY // GIAN 2',624,406);
}

function drawFloorUpgrade(w){
  ctx.save();ctx.globalAlpha=.3;
  for(let y=0;y<13;y++)for(let x=0;x<20;x++){
    if(!isTileWalkable(w.map,x,y))continue;
    ctx.fillStyle=((x+y)&1)?'#d7ded8':'#c8d5d0';ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
    ctx.strokeStyle='#789b9466';ctx.lineWidth=1;ctx.strokeRect(x*TILE+.5,y*TILE+.5,TILE-1,TILE-1);
  }
  ctx.restore();
}

function furniture(w){
  const out=[];
  for(let y=0;y<13;y++)for(let x=0;x<20;x++){
    const ch=w.map.rows[y][x];if(!'WSPLFcN'.includes(ch))continue;
    if(w.level==='lv2'&&environmentImages.room2Ground&&'WSPcN'.includes(ch))continue;
    if((ch==='L'&&w.map.rows[y][x-1]==='L')||(ch==='P'&&w.map.rows[y][x-1]==='P')||(ch==='W'&&w.map.rows[y][x-1]==='W'))continue;
    if(w.level==='lv1'&&ch==='P')continue;
    out.push({sortY:(y+1)*TILE,draw:()=>drawFurniture(w,x,y,ch)});
  }
  return out;
}

function drawDiningTable(table,w){
  const style=TABLE_CATALOG.find(item=>item.id===table.styleId)||TABLE_CATALOG[0],x=table.tile[0]*TILE,y=(table.tile[1]+1)*TILE;
  const tableArt=environmentImages[style.tableAssetKey],stoolArt=environmentImages[style.stoolAssetKey];
  ctx.save();if(tablePlacementState.dragId===table.id)ctx.globalAlpha=.58;
  if(stoolArt)for(const stool of table.stools)ctx.drawImage(stoolArt,stool[0]*TILE-1,(stool[1]+1)*TILE-34,34,34);
  if(tableArt)ctx.drawImage(tableArt,x-11,y-58,86,58);else{ctx.fillStyle='#98643f';ctx.fillRect(x-8,y-42,80,38);}
  if(table.meal)drawTableMeal(table,x,y,w);
  if(table.state==='DIRTY')drawDirtyDishes(x,y);
  ctx.restore();
}

function drawTableMeal(table,tableX,tableBottom,w){
  const age=Math.max(0,w.time-(table.meal?.servedAt||w.time)),dish=dishById(table.meal.dish),cx=tableX+32,cy=tableBottom-39;
  ctx.fillStyle='#21182e88';ctx.fillRect(cx-17,cy+12,34,4);
  drawDishThumbnail(dish.id,cx,cy,31);
  drawDishFx(dish,cx,cy,w.time);
  if(age<1){
    const blink=Math.floor(age*12)%2===0;ctx.fillStyle=blink?'#fff6a8':'#ffcf62';
    ctx.fillRect(cx-20,cy-12,3,3);ctx.fillRect(cx+18,cy-16,3,3);ctx.fillRect(cx+16,cy-4,2,2);
  }
}

function drawDishThumbnail(dishId,cx,cy,size){
  const image=dishImages[dishId];
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,size/2,0,Math.PI*2);ctx.clip();
  if(image)ctx.drawImage(image,cx-size/2,cy-size/2,size,size);
  else{ctx.fillStyle='#ffe0a2';ctx.fillRect(cx-size/2,cy-size/2,size,size);}
  ctx.restore();ctx.strokeStyle='#fff3d1';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,size/2,0,Math.PI*2);ctx.stroke();
}

function drawDishFx(dish,cx,cy,time){
  const shift=Math.floor((time*8)%10);ctx.save();
  if(['hot','fire','zen'].includes(dish.effect)){
    for(let i=0;i<3;i++){const sx=cx-8+i*8,sy=cy-17-((shift+i*3)%9);ctx.globalAlpha=.35+((i+shift)%3)*.18;ctx.fillStyle=dish.effect==='fire'?'#ffb34f':'#fff8df';ctx.fillRect(sx,sy,2,5);ctx.fillRect(sx+(i%2?1:-1),sy-3,2,3);}
  }else if(dish.effect==='cold'){
    ctx.globalAlpha=.8;ctx.fillStyle='#c8f7ff';ctx.fillRect(cx-18,cy-8-shift%4,3,3);ctx.fillRect(cx+16,cy-13+(shift%3),3,3);ctx.fillRect(cx+11,cy+10,2,2);
  }else{
    ctx.globalAlpha=.75;ctx.fillStyle=dish.effect==='quantum'?'#e99aff':'#b9ffad';ctx.fillRect(cx-18,cy-10,3,3);ctx.fillRect(cx+16,cy-14,3,3);
  }
  ctx.restore();
}

function drawDirtyDishes(tableX,tableBottom){
  const art=environmentImages.dirtyDishes;
  if(art){ctx.drawImage(art,tableX+13,tableBottom-45,42,21);return;}
  // Sprite-load fallback: a bowl with leftovers, never a plain white bar.
  ctx.fillStyle='#51302b';ctx.fillRect(tableX+19,tableBottom-39,29,13);
  ctx.fillStyle='#fff2d8';ctx.fillRect(tableX+21,tableBottom-39,25,9);
  ctx.fillStyle='#b45c31';ctx.fillRect(tableX+26,tableBottom-36,13,4);
  ctx.fillStyle='#76452d';ctx.fillRect(tableX+15,tableBottom-42,35,2);
}

function drawFurniture(w,x,y,ch){
  const px=x*TILE,py=y*TILE,upgrades=upgradesForRoom(w.roomId);ctx.lineWidth=2;ctx.strokeStyle='#21182e';
  if(w.level==='lv1'){
    const bottom=(y+1)*TILE;
    if(ch==='T'&&environmentImages.table){
      ctx.drawImage(environmentImages.table,px,bottom-40,64,40);
      const table=w.tables.find(t=>t.footprint[0]===x&&t.footprint[1]===y);
      if(table?.state==='DIRTY')drawDirtyDishes(px,bottom);
      return;
    }
    if(ch==='b'&&environmentImages.stool){ctx.drawImage(environmentImages.stool,px,bottom-28,32,28);return;}
    if(ch==='L'&&environmentImages.reception){ctx.drawImage(environmentImages.reception,px,bottom-48,96,48);return;}
    if(ch==='S'&&environmentImages.cart){const cart=upgrades.kitchen&&environmentImages.cartUpgrade?environmentImages.cartUpgrade:environmentImages.cart;ctx.drawImage(cart,px,bottom-72,96,72);return;}
    if(ch==='W'&&environmentImages.wash){ctx.drawImage(environmentImages.wash,px,bottom-40,32,40);return;}
    if(ch==='F'&&environmentImages.tea){ctx.drawImage(environmentImages.tea,px-24,bottom-72,80,72);return;}
  }
  if(w.level==='lv2'){
    const bottom=(y+1)*TILE;
    if(ch==='L'&&environmentImages.reception){ctx.drawImage(environmentImages.reception,px,bottom-48,96,48);return;}
    if(ch==='W'&&environmentImages.wash){ctx.drawImage(environmentImages.wash,px,bottom-40,32,40);return;}
    if(ch==='F'&&environmentImages.tea){ctx.drawImage(environmentImages.tea,px-24,bottom-72,80,72);return;}
    if(ch==='S'){
      ctx.fillStyle=upgrades.kitchen?'#315b5e':'#273544';ctx.fillRect(px+1,py-13,30,45);ctx.strokeStyle=upgrades.kitchen?'#f3c56c':'#111827';ctx.strokeRect(px+1,py-13,30,45);
      ctx.fillStyle=upgrades.kitchen?'#d4b66c':'#8ca4ad';ctx.fillRect(px+4,py-9,24,12);ctx.fillStyle='#182630';ctx.fillRect(px+7,py-6,18,6);
      ctx.fillStyle='#ffb347';ctx.fillRect(px+10,py-4,12,3);ctx.fillStyle='#cf6175';ctx.fillRect(px+6,py+9,20,3);
      ctx.fillStyle='#5dcbd0';ctx.fillRect(px+5,py+20,4,4);ctx.fillRect(px+12,py+20,4,4);return;
    }
    if(ch==='P'){
      ctx.fillStyle='#7f5261';ctx.fillRect(px,py-8,64,40);ctx.strokeStyle='#21182e';ctx.strokeRect(px,py-8,64,40);
      ctx.fillStyle='#f0c379';ctx.fillRect(px+5,py-3,54,4);ctx.fillStyle='#dcecf0';ctx.fillRect(px+12,py+6,16,10);ctx.fillRect(px+36,py+6,16,10);return;
    }
    if(ch==='N'){
      ctx.fillStyle='#293b51';ctx.fillRect(px,py-2,128,34);ctx.strokeStyle='#111827';ctx.strokeRect(px,py-2,128,34);
      for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#ef75b5':'#5ed7da';ctx.fillRect(px+9+i*29,py+5,19,13);ctx.fillStyle='#0d1b2d';ctx.fillRect(px+12+i*29,py+8,13,7);}return;
    }
  }
  if(ch==='T'){
    const table=w.tables.find(t=>t.footprint[0]===x&&t.footprint[1]===y);ctx.fillStyle=table?.state==='DIRTY'?'#81513d':'#a97346';ctx.fillRect(px,py-7,64,33);ctx.strokeRect(px,py-7,64,33);if(table?.state==='DIRTY')drawDirtyDishes(px,py+26);
  }else if(ch==='b'){ctx.fillStyle='#6e493a';ctx.fillRect(px+4,py+8,24,19);ctx.strokeRect(px+4,py+8,24,19);}
  else if(ch==='L'){ctx.fillStyle='#80523c';ctx.fillRect(px,py-16,96,48);ctx.strokeRect(px,py-16,96,48);ctx.fillStyle='#e2b457';ctx.fillRect(px+38,py-21,20,7);}
  else if(ch==='S'){ctx.fillStyle='#ae6146';ctx.fillRect(px,py-20,32,52);ctx.strokeRect(px,py-20,32,52);ctx.fillStyle='#ffb347';ctx.fillRect(px+10,py-9,12,9);}
  else if(ch==='P'){ctx.fillStyle='#b17a4b';ctx.fillRect(px,py-10,64,42);ctx.strokeRect(px,py-10,64,42);}
  else if(ch==='W'){ctx.fillStyle='#6691a0';const width=w.level==='lv2'?96:32;ctx.fillRect(px,py-5,width,37);ctx.strokeRect(px,py-5,width,37);ctx.fillStyle='#a5d5dd';ctx.fillRect(px+5,py+3,width-10,12);}
  else if(ch==='F'){ctx.fillStyle='#4f806f';ctx.fillRect(px+4,py,24,29);ctx.strokeRect(px+4,py,24,29);ctx.fillStyle='#d4c082';ctx.fillRect(px+10,py-7,12,10);}
  else if(ch==='c'){ctx.fillStyle='#96724e';ctx.fillRect(px,py,32,28);ctx.strokeRect(px,py,32,28);}
  else if(ch==='N'){ctx.fillStyle='#52727f';ctx.fillRect(px,py,128,29);ctx.strokeRect(px,py,128,29);}
}

function drawCharacter(c,w){
  const x=Math.round(c.px),y=Math.round(c.py),moving=c.anim.startsWith('walk_');
  const frame=Math.floor(c.animTime*8)%4;
  ctx.fillStyle='#0006';ctx.fillRect(x-10,y-2,20,4);
  const artKey=c.id==='seele'&&c.stamina<30?'veliona':(c.assetKey||c.id);
  const art=characterImages[artKey];
  if(art){
    const isAnimationSheet=art.naturalWidth>=192&&art.naturalHeight>=576;
    const bob=isAnimationSheet?0:(moving&&(frame===1||frame===3)?-1:0);
    const seated=c.kind==='guest'&&['SEATED_WAITING','EATING'].includes(c.guestState);
    const pose=seated?2:(c.facing==='up'?1:(c.facing==='right'||c.facing==='left'?2:0));
    if(c.carry&&c.facing==='up')drawCarry(c,x,y+bob,true);
    ctx.save();ctx.translate(x+(c.state==='CAUGHT_LAZY'?(frame%2?2:-2):0),y+bob);if(c.facing==='left')ctx.scale(-1,1);
    if(isAnimationSheet){
      let row=ANIM_ROWS[c.anim]??0;
      if(c.state==='DOZE')row=8;else if(c.state==='EXHAUSTED')row=7;
      else if(c.anim.startsWith('work_'))row=c.anim.includes('pick_trash')?5:4;
      else if(c.state==='SIGH')row=6;
      ctx.drawImage(art,frame*48,row*64,48,64,-24,-60,48,64);
    }else{
      if(c.state==='DOZE')ctx.rotate(frame%2?.05:-.03);if(c.state==='EXHAUSTED')ctx.rotate(-1.25);
      if(seated)ctx.drawImage(art,pose*48,0,48,64,-23,-50,46,56);else ctx.drawImage(art,pose*48,0,48,64,-24,-60,48,64);
    }
    ctx.restore();
    if(c.carry&&c.facing!=='up')drawCarry(c,x,y+bob,false);
    drawChefWorkFx(c,w,x,y+bob);
    drawFuHuaScoldFx(c,x,y+bob);
    if(c.state==='WORK'){ctx.fillStyle='#ffe47a';ctx.fillRect(x-16,y-64,32,3);ctx.fillStyle='#55d990';const job=w.jobs.find(j=>j.id===c.jobId);const ratio=job?clamp(1-job.workLeft/(job.duration*c.work),0,1):1;ctx.fillRect(x-16,y-64,32*ratio,3);}
      if(c.state==='DOZE'||c.state==='EXHAUSTED')drawBubble(c,'zzz');
      if(c.state==='SCOLD')drawBubble(c,'!');
      if(c.state==='CAUGHT_LAZY')drawBubble(c,'!');
      if(c.kind==='guest'&&c.guestState==='CONFUSED')drawBubble(c,'???');
      if(c.kind==='guest'&&c.guestState==='SEATED_WAITING')drawOrderBubble(c);
    ctx.font='bold 9px ui-monospace';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(c.name,x,y+11);return;
  }
  ctx.save();ctx.translate(x,y+bob);if(c.facing==='left')ctx.scale(-1,1);
  const col=c.color, dark='#20172d';
  if(c.state==='EXHAUSTED'){ctx.fillStyle=col;ctx.fillRect(-15,-15,30,13);ctx.strokeStyle=dark;ctx.strokeRect(-15,-15,30,13);ctx.restore();drawBubble(c,'zzz');return;}
  if(c.state==='DOZE'){ctx.rotate((frame%2?.05:-.03));}
  ctx.fillStyle=col;ctx.strokeStyle=dark;ctx.lineWidth=2;
  ctx.fillRect(-11,-31,22,25);ctx.strokeRect(-11,-31,22,25);
  ctx.fillStyle=c.kind==='guest'?'#f2d1b7':'#f0c7aa';ctx.fillRect(-13,-50,26,22);ctx.strokeRect(-13,-50,26,22);
  ctx.fillStyle=col;ctx.fillRect(-13,-52,26,8);
  ctx.fillStyle='#171421';
  if(c.facing!=='up'){ctx.fillRect(c.facing==='right'?4:-7,-41,3,3);ctx.fillRect(c.facing==='down'?4:4,-41,3,3);}
  const leg=frame%2===0?3:-3;ctx.fillStyle='#28233a';ctx.fillRect(-8+leg,-7,6,9);ctx.fillRect(2-leg,-7,6,9);
  if(c.state==='WORK'){ctx.fillStyle='#ffe47a';ctx.fillRect(-16,-58,32,3);ctx.fillStyle='#55d990';const job=w.jobs.find(j=>j.id===c.jobId);const ratio=job?clamp(1-job.workLeft/(job.duration*c.work),0,1):1;ctx.fillRect(-16,-58,32*ratio,3);}
  ctx.restore();
  if(c.carry)drawCarry(c,x,y+bob,c.facing==='up');
  drawChefWorkFx(c,w,x,y+bob);
  if(c.state==='DOZE')drawBubble(c,'zzz');
  if(c.kind==='guest'&&c.guestState==='CONFUSED')drawBubble(c,'???');
    if(c.kind==='guest'&&c.guestState==='SEATED_WAITING')drawOrderBubble(c);
  ctx.font='bold 9px ui-monospace';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(c.name,x,y+11);
}

function drawPassPlate(plate,w){
  const age=w.time-plate.bornAt,pop=age<.55?Math.sin(Math.PI*age/.55)*10:0;
  const index=Math.max(0,w.plates.indexOf(plate));const x=177+(index%2)*18,y=113-pop;
  ctx.save();ctx.lineWidth=2;ctx.strokeStyle='#30203a';ctx.fillStyle='#f7f0dc';ctx.beginPath();ctx.ellipse(x,y+5,12,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  drawDishThumbnail(plate.dish,x,y-2,18);
  if(age<.65){ctx.fillStyle='#ffe777';ctx.fillRect(x-15,y-12,3,3);ctx.fillRect(x+13,y-15,3,3);}
  drawDishFx(dishById(plate.dish),x,y-2,w.time);ctx.restore();
}

function drawCarry(c,x,y,behind){
  const side=c.facing==='right'?13:c.facing==='left'?-13:0;
  const trayY=y+(c.facing==='up'?-36:-25)+(Math.floor(c.animTime*8)%2?-1:0);
  const trayX=x+side;ctx.save();ctx.lineWidth=2;ctx.strokeStyle='#291c34';ctx.fillStyle='#70483f';ctx.fillRect(trayX-11,trayY,22,5);ctx.strokeRect(trayX-11,trayY,22,5);
  drawDishThumbnail(c.carry.dish,trayX,trayY-5,16);
  if(!behind)drawDishFx(dishById(c.carry.dish),trayX,trayY-5,c.animTime);
  ctx.restore();
}

function drawChefWorkFx(c,w,x,y){
  const job=w.jobs.find(j=>j.id===c.jobId);if(c.state!=='WORK'||job?.type!=='COOK')return;
  const flicker=Math.floor(w.time*12)%2;ctx.save();ctx.fillStyle=flicker?'#ffcf55':'#ff8b43';ctx.fillRect(x+13,y-31,8,9);ctx.fillStyle='#fff2a0';ctx.fillRect(x+16,y-29,3,5);
  ctx.strokeStyle='#f7f0dc';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+11,y-41);ctx.quadraticCurveTo(x+17,y-48,x+12,y-54);ctx.moveTo(x+19,y-41);ctx.quadraticCurveTo(x+25,y-48,x+21,y-55);ctx.stroke();ctx.restore();
}

function drawFuHuaScoldFx(c,x,y){
  if(c.id!=='fuhua'||c.state!=='SCOLD')return;
  const tap=Math.floor(c.animTime*10)%2,bookX=x+11,bookY=y-38+(tap?3:0);
  ctx.save();ctx.fillStyle='#1e3546';ctx.fillRect(bookX-7,bookY-7,15,18);ctx.fillStyle='#d8f0e7';ctx.fillRect(bookX-4,bookY-5,9,13);
  ctx.fillStyle='#e0b86d';ctx.fillRect(bookX-6,bookY-7,2,18);ctx.fillRect(bookX-2,bookY-1,6,1);ctx.fillRect(bookX-2,bookY+3,6,1);
  ctx.strokeStyle='#fff1b5';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bookX+10,bookY-11-(tap?0:3));ctx.lineTo(bookX+14,bookY-15-(tap?0:3));ctx.moveTo(bookX+12,bookY-5);ctx.lineTo(bookX+17,bookY-6);ctx.stroke();ctx.restore();
}

function drawBubble(c,text){const x=Math.round(c.px),y=Math.round(c.py)-68;ctx.font='bold 10px ui-monospace';const width=ctx.measureText(text).width+12;ctx.fillStyle='#fff';ctx.fillRect(x-width/2,y-11,width,17);ctx.fillStyle='#21182e';ctx.textAlign='center';ctx.fillText(text,x,y+2);}
function drawOrderBubble(c){const x=Math.round(c.px),y=Math.round(c.py)-76;ctx.save();ctx.fillStyle='#fff8e8';ctx.strokeStyle='#4b3046';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,16,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#fff8e8';ctx.fillRect(x-2,y+14,5,6);drawDishThumbnail(c.order,x,y,24);ctx.restore();}
function drawFloorItem(i){const x=i.tile[0]*TILE+16,y=i.tile[1]*TILE+24;ctx.fillStyle=i.type==='graffiti'?'#ef485f':'#c9b071';ctx.fillRect(x-7,y-7,14,10);ctx.strokeStyle='#21182e';ctx.strokeRect(x-7,y-7,14,10);}
function drawDecor(d){const [fw,fh]=d.footprint||[1,1],x=d.tile[0]*TILE+fw*TILE/2,y=(d.tile[1]+fh)*TILE-4,art=environmentImages[d.assetKey];if(art){const [w,h]=d.draw||[42,42];ctx.save();if(decorPlacementState.dragId===d.id)ctx.globalAlpha=.62;ctx.drawImage(art,x-w/2,y-h,w,h);ctx.restore();return;}ctx.fillStyle=d.kind==='zen'?'#62d8c6':'#f05a68';ctx.fillRect(x-10,y-22,20,22);ctx.strokeStyle='#21182e';ctx.strokeRect(x-10,y-22,20,22);}
function drawRain(w){if(w.level!=='lv1')return;ctx.strokeStyle='#a8d8e955';ctx.lineWidth=1;const offset=(w.time*80)%32;for(let x=10;x<640;x+=29)for(let y=-20;y<416;y+=64){ctx.beginPath();ctx.moveTo(x,y+offset);ctx.lineTo(x-4,y+offset+9);ctx.stroke();}}
function drawDebug(w){
  ctx.strokeStyle='#ffffff24';ctx.lineWidth=1;for(let x=0;x<=20;x++){ctx.beginPath();ctx.moveTo(x*TILE,0);ctx.lineTo(x*TILE,416);ctx.stroke();}for(let y=0;y<=13;y++){ctx.beginPath();ctx.moveTo(0,y*TILE);ctx.lineTo(640,y*TILE);ctx.stroke();}
  for(let y=0;y<13;y++)for(let x=0;x<20;x++)if(!isTileWalkable(w.map,x,y)){ctx.fillStyle='#ff365033';ctx.fillRect(x*TILE,y*TILE,32,32);}
  for(const c of w.characters){if(!c.path.length)continue;ctx.strokeStyle=c.color;ctx.beginPath();ctx.moveTo(c.px,c.py);for(const t of c.path)ctx.lineTo(t[0]*TILE+16,t[1]*TILE+28);ctx.stroke();}
  ctx.fillStyle='#000d';ctx.fillRect(4,4,230,Math.min(130,18+w.jobs.length*11));ctx.font='8px ui-monospace';ctx.textAlign='left';ctx.fillStyle='#fff';ctx.fillText('JOB BOARD DEBUG',10,15);w.jobs.slice(0,10).forEach((j,i)=>ctx.fillText(`${j.type} ${j.claimedBy||'-'} ${Math.max(0,j.workLeft).toFixed(1)}s`,10,27+i*10));
}

function renderRoomNavigation(){
  document.querySelectorAll('[data-room]').forEach(button=>{
    const id=button.dataset.room,unlocked=roomState.unlocked.has(id);
    button.classList.toggle('active',id===roomState.active);
    button.classList.toggle('locked',!unlocked);
    button.setAttribute('aria-disabled',String(!unlocked));
  });
  const room1Upgrades=Object.values(roomUpgradeState.room1).filter(Boolean).length,room2Upgrades=Object.values(roomUpgradeState.room2).filter(Boolean).length;
  if(ui['room1-status-label'])ui['room1-status-label'].textContent=`Lv.1 · 3 bàn · 1 bếp · nâng ${room1Upgrades}/3`;
  if(ui['room2-lock-label'])ui['room2-lock-label'].textContent=roomState.unlocked.has('room2')?`Lv.2 · 6 bàn · 2 đầu bếp · nâng ${room2Upgrades}/3`:'Khóa · cần nâng Lv.2';
  if(ui['room2-summary'])ui['room2-summary'].classList.toggle('locked',!roomState.unlocked.has('room2'));
  if(ui['camera-follow'])ui['camera-follow'].classList.toggle('follow-active',roomState.followCharacter);
  const selected=world?.staff(roomState.selectedCharacterId)||world?.staff('senti');
  if(ui['camera-target'])ui['camera-target'].textContent=selected?.name||'Senti';
}

function centerSelectedCharacter(force=false){
  if(!roomState.followCharacter||!world||!ui['canvas-wrap']||ui['canvas-wrap'].hidden)return;
  roomState.followClock+=FIXED_STEP;
  if(!force&&roomState.followClock<.12)return;
  roomState.followClock=0;
  const target=world.staff(roomState.selectedCharacterId)||world.staff('senti')||world.characters.find(c=>c.kind==='staff');
  if(!target)return;
  const wrap=ui['canvas-wrap'],scale=canvas.getBoundingClientRect().width/canvas.width||1;
  wrap.scrollLeft=clamp(target.px*scale-wrap.clientWidth/2,0,Math.max(0,wrap.scrollWidth-wrap.clientWidth));
  wrap.scrollTop=clamp(target.py*scale-wrap.clientHeight/2,0,Math.max(0,wrap.scrollHeight-wrap.clientHeight));
}

function renderUI(){
  if(!world)return;ui['time-value'].textContent=`${world.timeLeft.toFixed(1)}s`;ui['coin-value'].textContent=world.coins.toLocaleString('vi-VN');ui['rep-value'].textContent=world.rep;
  if(ui['upgrade-wallet-coins'])ui['upgrade-wallet-coins'].textContent=economyState.coins.toLocaleString('vi-VN');
  if(ui['upgrade-wallet-iron'])ui['upgrade-wallet-iron'].textContent=economyState.arcIron.toLocaleString('vi-VN');
  ui['atmos-value'].textContent=world.atmosphere;ui['atmos-fill'].style.width=`${Math.abs(world.atmosphere)/2}%`;ui['atmos-fill'].style.marginLeft=world.atmosphere<0?`${50-Math.abs(world.atmosphere)/2}%`:'50%';
  ui['stress-value'].textContent=Math.round(world.stress);ui['stress-fill'].style.width=`${world.stress}%`;ui['rage-value'].textContent=Math.round(world.rage);ui['rage-fill'].style.width=`${world.rage}%`;
  const config=ROOM_CONFIG[world.roomId]||ROOM_CONFIG.room1;
  ui['level-name'].textContent=config.name;ui['loop-status'].textContent=world.running?'ĐANG CHẠY':'ĐÃ ĐÓNG CỬA';
  if(ui['location-label'])ui['location-label'].textContent=config.location;
  ui['job-list'].innerHTML=world.jobs.length?world.jobs.map(j=>`<div class="job ${j.claimedBy?'claimed':''} ${world.time-j.createdAt>20?'overdue':''}"><b><span>${TYPE_LABEL[j.type]}</span><span>${j.claimedBy||'CHỜ'}</span></b><small>${ROLE_LABEL[j.role]} · ${(world.time-j.createdAt).toFixed(1)}s · (${j.standTile.join(',')})</small></div>`).join(''):'<div class="empty">Không có job đang chờ.</div>';
  ui['qa-stats'].textContent=`completed jobs: ${world.metrics.completedJobs}\nserved: ${world.metrics.served}\nmax job age: ${world.metrics.maxJobWait.toFixed(1)}s\nmax guest state: ${world.metrics.maxGuestState.toFixed(1)}s\noverlap total: ${world.metrics.overlapSeconds.toFixed(2)}s\nslide violations: ${world.metrics.slideViolations}\nconflict: ${world.conflict?'ON':'OFF'}\ndebug grid: ${world.debug?'ON':'OFF'}`;
  if(ui['served-value'])ui['served-value'].textContent=world.metrics.served;
  if(ui['completed-value'])ui['completed-value'].textContent=world.metrics.completedJobs;
  if(ui['trash-value'])ui['trash-value'].textContent=world.floorItems.filter(i=>i.type==='trash'||i.type==='graffiti').length;
  const visibleStaff=world.characters.filter(c=>c.kind==='staff'),nextRosterKey=visibleStaff.map(c=>`${c.id}:${Math.round(c.stamina)}:${c.id===roomState.selectedCharacterId}`).join('|');
  if(nextRosterKey!==rosterRenderKey){rosterRenderKey=nextRosterKey;ui.roster.innerHTML=visibleStaff.map(c=>{const id=c.id==='seele'&&c.stamina<30?'veliona':c.id;const data=STAFF[id]||c;return `<button class="staff-card ${data.asset?'has-art':''} ${c.id===roomState.selectedCharacterId?'selected':''}" data-follow-staff="${c.id}">${data.asset?`<span class="staff-avatar" style="background-image:url('${data.asset}')"></span>`:`<i style="--c:${c.color}"></i>`}<div><b>${id==='veliona'?'Veliona':c.name}</b><small>${ROLE_LABEL[c.role]||'Quản lý'}</small></div><em>${Math.round(c.stamina)}</em></button>`;}).join('');}
  renderRoomNavigation();
}

function frame(now){
  const raw=Math.min(.1,(now-lastFrame)/1000);lastFrame=now;accumulator+=raw*(world?.speed||1);
  while(world&&accumulator>=FIXED_STEP){if(activePhase==='evening')world.update(FIXED_STEP);accumulator-=FIXED_STEP;}
  if(world&&activePhase==='evening'&&!world.running&&!phaseState.rushEnded)showRushSummary();
  if(world){drawWorld(world);renderUI();centerSelectedCharacter();}requestAnimationFrame(frame);
}

function assignmentsForRoom(roomId=roomState.active){
  const state=assignmentState[roomId]||assignmentState.room1;
  for(const role of ['reception','server','chef','cleaner']){
    const available=STAFF_BY_ROLE[role].filter(id=>id!=='veliona'&&gachaState.owned.has(id));
    state[role]=Array.from({length:staffSlotState[role]},(_,index)=>state[role]?.[index]||available.find(id=>!state[role]?.includes(id))||'');
  }
  return state;
}
function currentAssignments(){const state=assignmentsForRoom();return Object.fromEntries(Object.entries(state).map(([role,ids])=>[role,ids.filter(Boolean)]));}
function renderAssignments(){
  if(!ui['assignment-grid'])return;
  const state=assignmentsForRoom(),roomName=ROOM_CONFIG[roomState.active]?.name||'Gian hiện tại';
  ui['assignment-grid'].innerHTML=['reception','server','chef','cleaner'].flatMap(role=>Array.from({length:staffSlotState[role]},(_,index)=>{
    const selected=state[role][index]||'',locked=world?.level==='lv1'&&['chef','cleaner'].includes(role);
    const candidates=[...new Set([...STAFF_BY_ROLE[role].filter(id=>id!=='veliona'&&gachaState.owned.has(id)),...state[role].filter(Boolean)])];
    const options=candidates.map(id=>`<option value="${id}" ${id===selected?'selected':''} ${state[role].some((chosen,slot)=>slot!==index&&chosen===id)?'disabled':''}>${GACHA_POOL.find(card=>card.id===id)?.name||STAFF[id]?.name||id}</option>`).join('');
    return `<label class="assignment ${locked?'is-locked':''}"><span>${ROLE_LABEL[role]} ${index+1}</span><small>${roomName}${locked?' · mở từ Lv.2':''}</small><select class="staff-assignment" data-assignment-role="${role}" data-assignment-slot="${index}" ${locked?'disabled':''}>${selected?'':'<option value="">Chưa có nhân viên</option>'}${options}</select></label>`;
  })).join('');
}
async function updateAssignment(role,index,id){
  const state=assignmentsForRoom();if(!state[role]||!STAFF_BY_ROLE[role]?.includes(id))return false;
  if(state[role].some((chosen,slot)=>slot!==index&&chosen===id)){showToast('Mỗi nhân viên chỉ đứng một vị trí trong cùng gian.');renderAssignments();return false;}
  state[role][index]=id;await start(world.level,{roomId:world.roomId,speed:world.speed,running:world.running});renderAssignments();showToast(`${ROLE_LABEL[role]} ${index+1}: ${STAFF[id]?.name||id}.`);return true;
}
async function start(level='lv1',options={}){
  const roomId=options.roomId||roomIdForLevel(level);
  world=new World(await loadMap(level),{...options,roomId,assignments:options.assignments||assignmentsForRoom(roomId)});
  roomState.active=roomId;roomState.worlds[roomId]=world;rosterRenderKey='';window.__TAIXUAN_WORLD__=world;
  renderDecorShop();renderTableShop();renderStaffSlots();renderAssignments();renderUpgradePanel();requestAnimationFrame(()=>centerSelectedCharacter(true));
}
async function switchRoom(roomId,{debug=false}={}){
  if(!ROOM_CONFIG[roomId])return false;
  if(!debug&&!roomState.unlocked.has(roomId)){showToast('Gian 2 đang khóa. Cần đủ 10.000 Xu và 50 Sắt Arc City để mở.');return false;}
  const cached=roomState.worlds[roomId];
  if(cached){world=cached;world.coins=economyState.coins;roomState.active=roomId;rosterRenderKey='';window.__TAIXUAN_WORLD__=world;renderDecorShop();renderTableShop();renderStaffSlots();renderAssignments();renderUpgradePanel();requestAnimationFrame(()=>centerSelectedCharacter(true));return true;}
  await start(ROOM_CONFIG[roomId].mapId,{roomId,speed:world?.speed||1});return true;
}
function showToast(message){ui.toast.textContent=message;ui.toast.classList.add('show');clearTimeout(toastClock);toastClock=setTimeout(()=>ui.toast.classList.remove('show'),1800);}

function rollGachaRank(){
  let rank;
  if(gachaState.sinceSSR>=49)rank='SSR';
  else if(gachaState.sinceS>=9){const roll=seeded()*50;rank=roll<30?'S':roll<45?'SR':'SSR';}
  else{const roll=seeded()*100;rank=roll<50?'A':roll<80?'S':roll<95?'SR':'SSR';}
  gachaState.pulls++;gachaState.sinceS++;gachaState.sinceSSR++;
  if(rank!=='A')gachaState.sinceS=0;
  if(rank==='SSR')gachaState.sinceSSR=0;
  return rank;
}

function pullGachaCard(){
  const rank=rollGachaRank();
  const candidates=GACHA_POOL.filter(card=>card.rank===rank);
  const card=candidates[Math.floor(seeded()*candidates.length)];
  const duplicate=gachaState.owned.has(card.id);
  if(duplicate)gachaState.shards[card.id]=(gachaState.shards[card.id]||0)+1;else{gachaState.owned.add(card.id);world?.fillOpenStaffSlots();renderStaffSlots();renderAssignments();}
  return {...card,duplicate};
}

function renderGachaStatus(){
  if(ui['pity-s'])ui['pity-s'].textContent=`${gachaState.sinceS}/10`;
  if(ui['pity-ssr'])ui['pity-ssr'].textContent=`${gachaState.sinceSSR}/50`;
  if(ui['gacha-collection']){
    const shards=Object.values(gachaState.shards).reduce((sum,value)=>sum+value,0);
    ui['gacha-collection'].innerHTML=`<span>Bộ sưu tập nhân sự</span><b>${gachaState.owned.size}/${GACHA_POOL.length}</b><span>✦ Mảnh ${shards}</span>`;
  }
  if(ui['staff-codex'])ui['staff-codex'].innerHTML=GACHA_POOL.map(card=>`<button class="staff-codex-card rank-${card.rank} ${card.id===selectedSkillId?'is-selected':''}" data-codex-id="${card.id}"><span style="background-image:url('${card.art}')"></span><b>${card.name}</b><small>${card.role}</small><strong>XEM SKILL</strong><em>${card.rank}</em></button>`).join('');
  renderStaffSkill(selectedSkillId);renderStaffDorm();
}

function renderStaffSkill(id){
  const card=GACHA_POOL.find(entry=>entry.id===id)||GACHA_POOL[0];selectedSkillId=card.id;
  if(!ui['staff-skill-panel'])return;
  const owned=gachaState.owned.has(card.id),training=gachaState.training[card.id]||0;
  ui['staff-skill-panel'].className=`staff-skill-panel rank-${card.rank}`;
  ui['staff-skill-panel'].innerHTML=`<div class="staff-skill-art" style="background-image:url('${card.art}')"><em>${card.rank}</em></div><div class="staff-skill-copy"><span>${card.role} · ${owned?'ĐÃ CHIÊU MỘ':'CHƯA SỞ HỮU'}</span><h3>${card.name}</h3><div class="staff-skill-stats"><b>Tốc độ ${card.speed}</b><b>Hiệu suất ${card.work}</b><b>Bậc ${training}</b></div><strong>KỸ NĂNG</strong><p>${card.skill}</p><strong>ĐẶC TÍNH / TẬT XẤU</strong><p>${card.quirk}</p></div>`;
  document.querySelectorAll('[data-codex-id]').forEach(el=>el.classList.toggle('is-selected',el.dataset.codexId===card.id));
}

function renderRecipeBook(){
  if(!ui['recipe-book-grid']||!ui['recipe-lab'])return;
  if(ui['recipe-progress'])ui['recipe-progress'].textContent=`${recipeState.unlocked.size}/${DISH_CATALOG.length}`;
  const selected=[...recipeState.selected];
  ui['recipe-lab'].innerHTML=`<div class="recipe-lab-title"><div><span>NGHIÊN CỨU MÙ · MÓN 1–3★</span><b>Bàn thử nguyên liệu</b></div><small>${selected.length}/3 nguyên liệu</small></div><div class="recipe-ingredient-grid">${RECIPE_INGREDIENTS.map(name=>`<button type="button" class="${recipeState.selected.has(name)?'is-selected':''}" data-recipe-ingredient="${encodeURIComponent(name)}"><span>${name}</span><b>Kho ×${phaseState.stock[name]||0}</b></button>`).join('')}</div><p>${recipeState.lastResult}</p><div class="recipe-lab-actions"><button type="button" data-recipe-reset ${selected.length?'':'disabled'}>BỎ NGUYÊN LIỆU</button><button type="button" data-recipe-research ${selected.length?'':'disabled'}>NẤU THỬ 1 BỘ</button>${TEST_MODE||PREP_DEMO_MODE?'<button type="button" class="recipe-test" data-test-recipe-fragment>TEST · NHẶT MẢNH BOSS</button>':''}</div>`;
  ui['recipe-book-grid'].innerHTML=DISH_CATALOG.map(dish=>{
    const unlocked=isRecipeUnlocked(dish.id),outcome=OUTCOME_ONLY_DISHES.has(dish.id),hasFragment=recipeState.fragments.has(dish.id),fragmentRoute=FRAGMENT_DISHES.includes(dish.id);
    const stateLabel=unlocked?'ĐÃ HỌC':outcome?'MÓN KẾT QUẢ':fragmentRoute?(hasFragment?'ĐÃ CÓ MẢNH':'CẦN MẢNH CÔNG THỨC'):'CHƯA NGHIÊN CỨU';
    const source=unlocked?`${dish.ingredients.join(' + ')||'Sinh ra từ kết quả nấu'}`:outcome?(dish.id==='burnt-congee'?'Nấu cháy để phát hiện':'Thử sai nguyên liệu để phát hiện'):fragmentRoute?'Boss · NPC ẩn · VIP · thành tựu':'Thử nghiệm mù đúng bộ nguyên liệu';
    const action=!unlocked&&fragmentRoute&&hasFragment?`<button type="button" data-unlock-recipe="${dish.id}">GIẢI MÃ MẢNH</button>`:'';
    const name=unlocked||fragmentRoute||outcome?dish.name:'Công thức chưa biết';
    return `<article class="recipe-card ${unlocked?'is-unlocked':'is-locked'} ${hasFragment?'has-fragment':''}"><div class="recipe-card-art"><img src="${dish.asset}" alt="${name}"><em>${'★'.repeat(dish.stars)}</em></div><div><span>${stateLabel}</span><b>${name}</b><small>${source}</small>${unlocked?`<strong>${dish.price.toLocaleString('vi-VN')} Xu · ${dish.system}</strong>`:''}${action}</div></article>`;
  }).join('');
}

function toggleRecipeIngredient(name){
  if(!RECIPE_INGREDIENTS.includes(name))return;
  if(recipeState.selected.has(name))recipeState.selected.delete(name);
  else if(recipeState.selected.size>=3){showToast('Bàn nghiên cứu chỉ nhận tối đa 3 nguyên liệu.');return;}
  else recipeState.selected.add(name);
  renderRecipeBook();
}

function researchRecipe(){
  const selected=[...recipeState.selected];
  if(!selected.length){showToast('Chọn nguyên liệu để thử nghiệm trước.');return false;}
  const missing=selected.filter(name=>(phaseState.stock[name]||0)<1);
  if(missing.length){showToast(`Kho thiếu: ${missing.join(', ')}.`);return false;}
  selected.forEach(name=>phaseState.stock[name]--);
  const signature=recipeSignature(selected);
  const match=RESEARCH_DISHES.map(dishById).find(dish=>!isRecipeUnlocked(dish.id)&&recipeSignature(dish.ingredients)===signature);
  recipeState.selected.clear();
  if(match){
    recipeState.unlocked.add(match.id);
    recipeState.lastResult=`✨ Thành công! Đã ghi ${match.name} vào Sổ Công Thức.`;
    showToast(`MỞ CÔNG THỨC: ${match.name}. Từ giờ có thể chọn món này vào kế hoạch nấu.`);
  }else{
    recipeState.unlocked.add('quantum-waste');
    recipeState.lastResult='Thử nghiệm sai: tạo Chất Thải Lượng Tử. Nguyên liệu đã dùng không hoàn lại.';
    showToast('Sai công thức · đã phát hiện Chất Thải Lượng Tử.');
  }
  renderRecipeBook();
  if(activePhase==='afternoon'&&!phaseState.planLocked)renderPhaseScreen();
  return Boolean(match);
}

function grantNextRecipeFragmentForTest(){
  if(!(TEST_MODE||PREP_DEMO_MODE))return false;
  const id=FRAGMENT_DISHES.find(recipeId=>!isRecipeUnlocked(recipeId)&&!recipeState.fragments.has(recipeId));
  if(!id){showToast('Đã có đủ Mảnh Công Thức 4–5★ để duyệt.');return false;}
  recipeState.fragments.add(id);recipeState.lastResult=`Boss thử nghiệm rơi Mảnh Công Thức: ${dishById(id).name}.`;
  renderRecipeBook();showToast(`Nhặt được Mảnh Công Thức: ${dishById(id).name}.`);return id;
}

function unlockRecipeByFragment(id){
  if(!FRAGMENT_DISHES.includes(id)||!recipeState.fragments.has(id)||isRecipeUnlocked(id))return false;
  recipeState.fragments.delete(id);recipeState.unlocked.add(id);recipeState.lastResult=`Đã giải mã và học ${dishById(id).name}.`;
  renderRecipeBook();showToast(`MỞ CÔNG THỨC: ${dishById(id).name}.`);
  if(activePhase==='afternoon'&&!phaseState.planLocked)renderPhaseScreen();
  return true;
}

function renderDormRoom(){
  if(!ui['dorm-room'])return;
  const coreResidents=['fuhua','senti'].map(id=>({id,name:STAFF[id].name,asset:STAFF[id].asset,special:true}));
  const regularResidents=GACHA_POOL.filter(card=>gachaState.owned.has(card.id)&&STAFF[card.id]).slice(0,8).map(card=>({id:card.id,name:card.name,asset:STAFF[card.id].asset,special:false}));
  const decorForFloor=floor=>`<div class="dorm-floor-decor" aria-label="Trang trí tầng ${floor}">${[...(dormState.decorByFloor[floor]||new Set())].map(id=>`<i class="dorm-item dorm-${id}" aria-label="${id}"></i>`).join('')}</div>`;
  const residentButton=(resident,index,shared=false)=>`<button class="dorm-pixel-resident ${shared?'is-roommate':''} ${resident.id==='fuhua'?'has-reversed-sheet':''} walk-${index%3}" data-dorm-skill="${resident.id}" style="--walk-delay:-${(index*.73).toFixed(2)}s" aria-label="${resident.name} đang đi trong phòng"><span class="dorm-pixel-sprite" style="background-image:url('${resident.asset}')"></span><b>${resident.name}</b></button>`;
  const regularRoom=(resident,index)=>`<article class="dorm-unit ${resident?'is-occupied':'is-empty'}"><span class="dorm-room-number">P.${String(index+1).padStart(2,'0')}</span><i class="dorm-unit-window"></i><i class="dorm-unit-bed"></i>${resident?residentButton(resident,index):'<em>PHÒNG TRỐNG</em>'}</article>`;
  const floors=[regularResidents.slice(0,4),regularResidents.slice(4,8)];
  ui['dorm-room'].dataset.theme=dormState.theme;
  ui['dorm-room'].innerHTML=`<div class="dorm-building-head"><div><b>KTX THÁI HƯ</b><span>3 TẦNG · TỐI ĐA 10 CƯ DÂN</span></div><strong>${regularResidents.length+2}/10</strong></div><section class="dorm-floor dorm-floor-special ${dormState.activeFloor===3?'is-editing':''}" data-dorm-floor-panel="3"><div class="dorm-floor-label"><b>TẦNG 3</b><span>PHÒNG ĐÔI HUA–SENTI</span></div><article class="dorm-unit dorm-unit-shared"><span class="dorm-room-number">P.HS</span><i class="dorm-unit-window"></i><i class="dorm-unit-bed dorm-unit-bed-left"></i><i class="dorm-unit-bed dorm-unit-bed-right"></i>${decorForFloor(3)}<div class="dorm-roommates">${coreResidents.map((resident,index)=>residentButton(resident,index,true)).join('')}</div></article></section>${floors.map((floor,floorIndex)=>{const floorNumber=2-floorIndex;return `<section class="dorm-floor ${dormState.activeFloor===floorNumber?'is-editing':''}" data-dorm-floor-panel="${floorNumber}"><div class="dorm-floor-label"><b>TẦNG ${floorNumber}</b><span>${floor.filter(Boolean).length}/4 PHÒNG ĐÃ DÙNG</span></div><div class="dorm-floor-rooms">${Array.from({length:4},(_,roomIndex)=>regularRoom(floor[roomIndex],floorIndex*4+roomIndex)).join('')}</div>${decorForFloor(floorNumber)}</section>`;}).join('')}<i class="dorm-elevator" aria-label="Thang máy">↕</i>`;
  document.querySelectorAll('[data-dorm-floor]').forEach(button=>{const active=Number(button.dataset.dormFloor)===dormState.activeFloor;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  const activeDecor=dormState.decorByFloor[dormState.activeFloor];
  document.querySelectorAll('[data-dorm-decor]').forEach(button=>{const active=activeDecor.has(button.dataset.dormDecor);button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  if(ui['dorm-decor-status'])ui['dorm-decor-status'].textContent=`Đang chỉnh Tầng ${dormState.activeFloor} · ${activeDecor.size} vật phẩm đã đặt`;
}
function toggleDormDecor(id){
  if(!['plant','lamp','rug','sofa'].includes(id))return;
  const floor=dormState.activeFloor,set=dormState.decorByFloor[floor];
  if(set.has(id))set.delete(id);else set.add(id);
  renderDormRoom();showToast(`${set.has(id)?'Đã đặt':'Đã cất'} ${id.toUpperCase()} ở Tầng ${floor}.`);
}
function selectDormFloor(floor){
  const next=Number(floor);if(![1,2,3].includes(next))return;
  dormState.activeFloor=next;renderDormRoom();
  ui['dorm-room']?.querySelector(`[data-dorm-floor-panel="${next}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});
  showToast(`Đang chỉnh nội thất Tầng ${next}.`);
}
function renderStaffDorm(){
  if(!ui['staff-dorm-list'])return;
  renderDormRoom();
  const owned=GACHA_POOL.filter(card=>gachaState.owned.has(card.id));
  if(!owned.length){ui['staff-dorm-list'].innerHTML='<div class="empty-state">Chưa có nhân viên để vào KTX.</div>';return;}
  ui['staff-dorm-list'].innerHTML=owned.map(card=>{
    const shards=gachaState.shards[card.id]||0,training=gachaState.training[card.id]||0;
    const rankLabel=TEST_MODE?`Bậc thử ${training}`:`Bậc ${training}`;
    const trainLabel=TEST_MODE?'NÂNG THỬ':'CHƯA CÓ ĐỊNH MỨC';
    return `<article class="staff-dorm-card rank-${card.rank}" data-dorm-id="${card.id}"><div class="staff-dorm-art" style="background-image:url('${card.art}')"><em>${card.rank}</em></div><div class="staff-dorm-copy"><span>${card.role}</span><b>${card.name}</b><small>${card.skill}</small><p><i>✦ Mảnh ${shards}</i><strong>${rankLabel}</strong></p>${training?'<small class="staff-dorm-bonus">Kỹ năng ↑ · Tật xấu ↓</small>':''}</div><button data-staff-train="${card.id}" ${TEST_MODE?'':'disabled'}>${trainLabel}</button></article>`;
  }).join('');
}

function previewTrainStaff(id){
  const card=GACHA_POOL.find(entry=>entry.id===id);
  if(!card||!gachaState.owned.has(id)){showToast('Cần chiêu mộ nhân viên trước khi vào KTX.');return false;}
  if(!TEST_MODE){showToast('Định mức Mảnh Đột Phá cho mỗi bậc đang chờ chốt.');return false;}
  gachaState.training[id]=(gachaState.training[id]||0)+1;
  renderStaffDorm();
  showToast(`${card.name}: Bậc thử +1 · chưa trừ Mảnh vì ngưỡng chưa chốt.`);
  return true;
}

function setStaffMode(mode){
  document.querySelectorAll('[data-staff-mode]').forEach(button=>{
    const active=button.dataset.staffMode===mode;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));
  });
  document.querySelectorAll('[data-staff-mode-view]').forEach(view=>{
    const active=view.dataset.staffModeView===mode;view.hidden=!active;view.classList.toggle('active',active);
  });
  if(mode==='dorm')renderStaffDorm();
}

function openDormScreen(){
  if(!ui['dorm-modal'])return;
  renderStaffDorm();
  ui['dorm-modal'].hidden=false;
  document.body.classList.add('dorm-open');
}
function closeDormScreen(){
  if(!ui['dorm-modal'])return;
  ui['dorm-modal'].hidden=true;
  document.body.classList.remove('dorm-open');
}

function renderVipSystem(){
  if(!ui['vip-list']||!ui['vip-event'])return;
  const unlocked=economyState.unlockedLv2||TEST_MODE;
  ui['vip-list'].innerHTML=VIP_CATALOG.map(vip=>`<article class="vip-card tone-${vip.tone} ${vipState.active===vip.id?'is-active':''}"><div class="vip-art" style="background-image:url('${vip.art}')"></div><div><span>${vip.title}</span><h3>${vip.name}</h3><small>Yêu cầu: ${dishById(vip.dish).name}</small><p>${vip.issue}</p><b>${vip.reward}</b></div><button data-vip-start="${vip.id}" ${!unlocked?'disabled':''}>${vipState.active===vip.id?'EVENT ĐANG CHẠY':'TEST EVENT'}</button></article>`).join('');
  if(ui['vip-status'])ui['vip-status'].textContent=unlocked?(vipState.active?'EVENT ĐANG CHẠY':'SẴN SÀNG TEST'):'CẦN MỞ GIAN 2';
  const vip=VIP_CATALOG.find(entry=>entry.id===vipState.active);
  if(!vip){ui['vip-event'].innerHTML=`<div class="vip-event-empty"><b>Chưa chọn VIP</b><p>Mở Gian 2 rồi chọn TEST EVENT để xem chuỗi tình huống, món yêu cầu và phần thưởng.</p></div>`;return;}
  if(vipState.stage===1)ui['vip-event'].innerHTML=`<div class="vip-event-scene"><span style="background-image:url('${vip.art}')"></span><div><small>BƯỚC 1/2 · VIP ĐẾN QUÁN</small><h3>${vip.name} đang đợi ở sảnh</h3><p>Lễ tân cần ưu tiên dẫn VIP vào bàn sạch.</p><button data-vip-action="seat">ĐÓN VIP VÀO BÀN →</button></div></div>`;
  else if(vipState.stage===2)ui['vip-event'].innerHTML=`<div class="vip-event-scene"><span style="background-image:url('${dishById(vip.dish).asset}')"></span><div><small>BƯỚC 2/2 · YÊU CẦU ĐẶC BIỆT</small><h3>${dishById(vip.dish).name}</h3><p>${vip.issue}</p><div class="vip-actions"><button data-vip-action="serve">PHỤC VỤ ĐÚNG MÓN</button><button data-vip-action="senti">CHO SENTI XỬ LÝ</button></div></div></div>`;
  else ui['vip-event'].innerHTML=`<div class="vip-event-complete"><b>★ EVENT HOÀN TẤT</b><h3>${vip.name} hài lòng</h3><p>Nhận ${vip.reward}. Event đã lưu vào lịch sử test.</p><button data-vip-action="reset">TEST VIP KHÁC</button></div>`;
}
function startVipEvent(id){
  if(!VIP_CATALOG.some(vip=>vip.id===id))return false;
  if(!economyState.unlockedLv2&&!TEST_MODE){showToast('Khách VIP mở sau khi khai trương Gian 2.');return false;}
  vipState.active=id;vipState.stage=1;renderVipSystem();showToast(`VIP ${VIP_CATALOG.find(vip=>vip.id===id).name} đã tới sảnh chờ.`);return true;
}
function handleVipAction(action){
  const vip=VIP_CATALOG.find(entry=>entry.id===vipState.active);if(!vip)return;
  if(action==='seat'){vipState.stage=2;renderVipSystem();showToast(`${vip.name} đã vào bàn VIP.`);return;}
  if(action==='serve'||action==='senti'){
    vipState.stage=3;vipState.history.push({id:vip.id,action,day:phaseState.day});economyState.coins+=action==='serve'?800:500;if(world){world.coins=economyState.coins;world.atmosphere=clamp(world.atmosphere+(vip.tone==='zen'?30:vip.tone==='yatta'?40:15),-100,100);}if(FRAGMENT_DISHES.includes(vip.dish)&&!isRecipeUnlocked(vip.dish))recipeState.fragments.add(vip.dish);renderVipSystem();renderRecipeBook();renderUI();showToast(`${vip.name}: event hoàn tất · đã nhận thưởng test.`);return;
  }
  if(action==='reset'){vipState.active=null;vipState.stage=0;renderVipSystem();}
}

function renderUpgradePanel(){
  if(ui['restaurant-upgrade'])ui['restaurant-upgrade'].textContent=restaurantUpgradeBusy?'ĐANG MỞ GIAN…':economyState.unlockedLv2?'VÀO GIAN 2':'MỞ GIAN 2';
  const roomId=world?.roomId||roomState.active,state=upgradesForRoom(roomId),config=ROOM_CONFIG[roomId]||ROOM_CONFIG.room1;
  const upgraded=Object.values(state).filter(Boolean).length;
  if(ui['room-upgrade-title'])ui['room-upgrade-title'].textContent=config.name;
  if(ui['room-upgrade-progress'])ui['room-upgrade-progress'].textContent=`${upgraded}/3`;
  if(ui['room-upgrade-summary'])ui['room-upgrade-summary'].textContent=`${config.tables} bàn · ${config.kitchens} trạm bếp · trạng thái nâng cấp độc lập`;
  if(ui['room-upgrade-list']){
    const items=[
      ['floor','▦','Sàn quán','Đổi lớp hoàn thiện sàn của riêng gian này'],
      ['kitchen','♨','Khu bếp',`Nâng hình bếp; số trạm vẫn theo cấp gian (${config.kitchens})`],
      ['waiting','♧','Sảnh chờ','Thêm khu ghế chờ riêng cho khách của gian này']
    ];
    ui['room-upgrade-list'].innerHTML=items.map(([id,icon,name,copy])=>{
      const disabled=state[id]||!TEST_MODE;
      const label=state[id]?'ĐÃ NÂNG':TEST_MODE?'NÂNG THỬ':'CHƯA CÓ GIÁ';
      return `<article class="room-upgrade-item ${state[id]?'is-upgraded':''}"><span>${icon}</span><div><b>${name}</b><small>${copy}</small></div><button data-room-upgrade="${id}" ${disabled?'disabled':''}>${label}</button></article>`;
    }).join('');
  }
  renderRoomNavigation();
}

function upgradesForRoom(roomId=roomState.active){return roomUpgradeState[roomId]||roomUpgradeState.room1;}

async function upgradeRestaurant(){
  if(!world||restaurantUpgradeBusy)return false;
  if(economyState.unlockedLv2)return switchRoom('room2');
  if(!economyState.unlockedLv2){
    const missingCoins=Math.max(0,RESTAURANT_UPGRADE_COST.coins-economyState.coins);
    const missingIron=Math.max(0,RESTAURANT_UPGRADE_COST.arcIron-economyState.arcIron);
    if(missingCoins||missingIron){showToast(`Chưa đủ tài nguyên: thiếu ${missingCoins.toLocaleString('vi-VN')} Xu và ${missingIron} Sắt Arc City.`);return false;}
  }
  restaurantUpgradeBusy=true;renderUpgradePanel();
  try{
    const speed=world.speed;
    await start('lv2',{roomId:'room2',speed});
    economyState.coins-=RESTAURANT_UPGRADE_COST.coins;economyState.arcIron-=RESTAURANT_UPGRADE_COST.arcIron;economyState.unlockedLv2=true;roomState.unlocked.add('room2');
    Object.values(roomState.worlds).filter(Boolean).forEach(roomWorld=>roomWorld.coins=economyState.coins);
    renderRoomNavigation();showToast('Đã mở Gian 2 Heliopolis — Gian 1 vẫn được giữ nguyên.');
    return true;
  }catch(error){showToast('Không tải được quán Lv.2; tài nguyên chưa bị trừ.');return false;}
  finally{restaurantUpgradeBusy=false;renderUpgradePanel();}
}

function grantRestaurantUpgradeTestPack(){
  economyState.coins+=RESTAURANT_UPGRADE_COST.coins;
  economyState.arcIron+=RESTAURANT_UPGRADE_COST.arcIron;
  Object.values(roomState.worlds).filter(Boolean).forEach(roomWorld=>roomWorld.coins=economyState.coins);
  showToast('Đã nhận gói QA để thử điều kiện nâng cấp.');
  return {...economyState};
}

async function enterFullResourceRoom2(){
  economyState.coins=FULL_TEST_RESOURCES.coins;
  economyState.arcIron=FULL_TEST_RESOURCES.arcIron;
  economyState.unlockedLv2=true;
  roomState.unlocked.add('room2');
  GACHA_POOL.forEach(card=>gachaState.owned.add(card.id));
  DECOR_CATALOG.forEach(item=>decorStoreState.owned.add(item.id));
  for(const [level,state] of Object.entries(tableStoreState)){
    const capacity=level==='lv2'?ROOM_CONFIG.room2.tables:ROOM_CONFIG.room1.tables;
    for(const style of TABLE_CATALOG)state.owned[style.id]=Math.max(state.owned[style.id]||0,capacity);
  }
  for(const dish of DISH_CATALOG)for(const ingredient of dish.ingredients)phaseState.stock[ingredient]=99;
  phaseState.plan={};phaseState.planLocked=false;phaseState.planQueue=[];phaseState.planIndex=0;phaseState.batches=0;phaseState.cookStep=0;phaseState.cookResults=[];phaseState.prepared=0;phaseState.preparedByDish={};phaseState.preparedQualityByDish={};phaseState.rushEnded=false;
  Object.values(roomState.worlds).filter(Boolean).forEach(roomWorld=>roomWorld.coins=economyState.coins);
  await start('lv2',{roomId:'room2',speed:world?.speed||1,running:false});
  roomState.selectedCharacterId='kiana';roomState.followCharacter=true;rosterRenderKey='';
  setPhase('afternoon');renderGachaStatus();renderRecipeBook();renderUpgradePanel();renderDecorShop();renderTableShop();renderStaffSlots();
  if(ui['full-test-room2']){ui['full-test-room2'].classList.add('active');ui['full-test-room2'].textContent='✓ GIAN 2 · FULL TÀI NGUYÊN';}
  showToast('Đã mở Gian 2 với kho đầy để thử chọn món, nấu và bấm MỞ QUÁN.');
  return {wallet:{...economyState},room:roomState.active,staff:[...gachaState.owned],decor:[...decorStoreState.owned]};
}

function renderStaffSlots(){
  if(!ui['staff-slot-list'])return;
  ui['staff-slot-list'].innerHTML=['reception','server','chef','cleaner'].map(role=>{
    const max=STAFF_BY_ROLE[role].filter(id=>id!=='veliona').length,capacity=staffSlotState[role];
    const active=world?.characters.filter(c=>c.kind==='staff'&&c.role===role).length||0;
    const locked=world?.level==='lv1'&&['chef','cleaner'].includes(role);
    const disabled=capacity>=max||!TEST_MODE;
    const label=capacity>=max?'ĐÃ ĐỦ':TEST_MODE?`MỞ Ô ${capacity+1}`:'CHƯA CÓ GIÁ';
    return `<article class="staff-slot-row"><div><b>${ROLE_LABEL[role]}</b><small>${locked?'Mở ở Lv.2':`${active}/${capacity} người đang làm`} · tối đa ${max} vị trí</small></div><button data-staff-slot="${role}" ${disabled?'disabled':''}>${label}</button></article>`;
  }).join('');
}

function upgradeStaffSlot(role){
  const max=STAFF_BY_ROLE[role]?.filter(id=>id!=='veliona').length||0;
  if(!TEST_MODE){showToast('Giá mở thêm vị trí nhân viên đang chờ chốt.');return;}
  if(!max||staffSlotState[role]>=max)return;
  staffSlotState[role]++;
  assignmentsForRoom(roomState.active);world.fillOpenStaffSlots();renderStaffSlots();renderAssignments();
  showToast(`Đã mở ${staffSlotState[role]} vị trí ${ROLE_LABEL[role]}. Nhân viên đã chiêu mộ sẽ vào ca.`);
}

function tablePlacedCount(styleId){return world.tables.filter(table=>table.placed&&table.styleId===styleId).length;}
function renderTableShop(){
  if(!ui['table-shop']||!world)return;
  const state=tableStoreState[world.level],capacity=world.map.tables.length;
  ui['table-capacity'].textContent=`${world.tables.filter(table=>table.placed).length}/${capacity} bàn đang đặt`;
  ui['table-shop'].innerHTML=TABLE_CATALOG.map(item=>{
    const owned=state.owned[item.id],placed=tablePlacedCount(item.id),stored=owned-placed;
    return `<article class="table-shop-card" data-table-style="${item.id}"><img src="${ENVIRONMENT_ASSETS[item.tableAssetKey]}" alt="${item.name}"><div class="table-shop-info"><strong>${item.name}</strong><small>CẤP ${item.level} · ${item.description}</small><span>Sở hữu ${owned} · Đang đặt ${placed} · Trong kho ${stored}</span></div><div class="table-shop-actions"><button data-table-action="buy" ${TEST_MODE?'':'disabled'}>${TEST_MODE?'MUA THỬ':'CHƯA CÓ GIÁ'}</button><button data-table-action="place" ${stored<=0?'disabled':''}>ĐẶT</button><button data-table-action="store" ${placed<=0?'disabled':''}>CẤT 1</button></div></article>`;
  }).join('');
  ui['table-edit-toggle'].classList.toggle('active',tablePlacementState.active);
  ui['table-edit-toggle'].textContent=tablePlacementState.active?'XONG DI CHUYỂN':'DI CHUYỂN BÀN';
}

function tableAction(styleId,action){
  const state=tableStoreState[world.level],style=TABLE_CATALOG.find(item=>item.id===styleId);if(!style)return false;
  if(action==='buy'){if(!TEST_MODE){showToast('Giá bàn đang chờ chốt.');return false;}state.owned[styleId]++;showToast(`Đã mua thử ${style.name}.`);renderTableShop();return true;}
  if(action==='store'){
    const table=world.tables.find(item=>item.placed&&item.styleId===styleId&&item.state==='CLEAN'&&!item.reserved&&!world.jobs.some(job=>!job.done&&job.payload.tableId===item.id));
    if(!table){showToast('Bàn đang có khách, bẩn hoặc đang được phục vụ.');return false;}
    table.placed=false;saveTableLayout(world);syncTableCollision(world.map,world.tables);renderTableShop();showToast(`Đã cất ${style.name} vào kho.`);return true;
  }
  if(action==='place'){
    if(state.owned[styleId]<=tablePlacedCount(styleId)){showToast('Trong kho không còn bàn này.');return false;}
    const table=world.tables.find(item=>!item.placed);
    if(!table){showToast(`Quán đã đặt đủ ${world.map.tables.length} bàn. Hãy cất một bàn trước.`);return false;}
    const preferred=world.map.tables.find(item=>item.id===table.id),original=preferred&&[preferred.footprint[0],preferred.footprint[1]];
    const tile=original&&isValidTableTile(world,original,table.id)?original:firstValidTableTile(world,table.id);
    if(!tile){showToast('Không còn chỗ trống hợp lệ để đặt bàn.');return false;}
    table.styleId=styleId;table.placed=true;table.state='CLEAN';table.reserved=false;updateTableGeometry(table,tile);
    saveTableLayout(world);syncTableCollision(world.map,world.tables);renderTableShop();showToast(`Đã đặt ${style.name} vào quán.`);return true;
  }
  return false;
}

function applyUpgrade(type,roomId=world?.roomId||roomState.active){
  const state=upgradesForRoom(roomId);if(!(type in state)||state[type])return false;
  if(!TEST_MODE){showToast('Chi phí hạng mục nâng cấp này đang chờ chốt.');return false;}
  state[type]=1;renderUpgradePanel();
  const names={floor:'Sàn quán',kitchen:'Khu bếp',waiting:'Sảnh chờ'},roomName=ROOM_CONFIG[roomId]?.name||roomId;
  showToast(`${roomName}: đã nâng thử ${names[type].toLowerCase()}; chưa trừ Xu vì giá chưa chốt.`);
  return true;
}

function renderDecorShop(){
  if(!ui['decor-shop'])return;
  const capacity=world?.map?.decorSlots?.length||3;
  const shown=DECOR_CATALOG.filter(item=>decorFilter==='all'||item.tier===decorFilter||item.kind===decorFilter);
  ui['decor-shop'].innerHTML=shown.map(item=>{
    const owned=decorStoreState.owned.has(item.id),placed=decorStoreState.placed.includes(item.id);
    const action=placed?'CẤT ĐI':owned?'ĐẶT VÀO QUÁN':TEST_MODE?(item.tier==='rare'?'CHẾ THỬ · 5 MẢNH':'MUA THỬ · 0 XU'):'CHƯA CÓ GIÁ';
    return `<article class="decor-shop-card ${placed?'is-placed':''} tier-${item.tier} kind-${item.kind}" data-decor-id="${item.id}"><div class="decor-shop-art" style="background-image:url('${item.art}')"></div><div><span>${item.system}</span>${item.tier==='rare'?'<em>HIẾM</em>':''}<b>${item.name}</b><small>${item.effect}</small></div><button ${!owned&&!TEST_MODE?'disabled':''}>${action}</button></article>`;
  }).join('');
  if(ui['decor-capacity'])ui['decor-capacity'].textContent=`${decorStoreState.placed.length}/${capacity} món đang đặt`;
  if(ui['decor-edit-toggle']){ui['decor-edit-toggle'].classList.toggle('active',decorPlacementState.active);ui['decor-edit-toggle'].textContent=decorPlacementState.active?'XONG BỐ TRÍ':'TỰ CHỈNH VỊ TRÍ';}
}

function toggleDecorItem(id){
  const item=DECOR_CATALOG.find(entry=>entry.id===id);if(!item)return;
  if(!decorStoreState.owned.has(id)){if(!TEST_MODE){showToast('Giá nội thất đang chờ chốt.');return;}decorStoreState.owned.add(id);showToast(item.tier==='rare'?`Đã chế thử ${item.name}.`:`Đã mua thử ${item.name}.`);}
  else if(decorStoreState.placed.includes(id)){decorStoreState.placed=decorStoreState.placed.filter(entry=>entry!==id);delete decorStoreState.tiles[world.level][id];showToast(`Đã cất ${item.name}.`);}
  else{
    const capacity=world.map.decorSlots.length;if(decorStoreState.placed.length>=capacity){showToast(`Quán chỉ còn ${capacity} ô trang trí.`);return;}
    const tile=preferredDecorTile(world,item);if(!tile){showToast('Không còn ô sàn hợp lệ để đặt.');return;}
    decorStoreState.placed.push(id);decorStoreState.tiles[world.level][id]=tile;showToast(`Đã đặt ${item.name} vào quán.`);
  }
  refreshWorldDecor();renderDecorShop();
}

function toggleDecorPlacement(){
  decorPlacementState.active=!decorPlacementState.active;decorPlacementState.dragId=null;decorPlacementState.hoverTile=null;
  if(decorPlacementState.active){tablePlacementState.active=false;tablePlacementState.dragId=null;tablePlacementState.hoverTile=null;}
  canvas.classList.toggle('decor-editing',decorPlacementState.active||tablePlacementState.active);
  showToast(decorPlacementState.active?'Giữ và kéo món đồ tới ô muốn đặt.':'Đã lưu bố trí nội thất.');renderDecorShop();renderTableShop();
}
function toggleTablePlacement(){
  tablePlacementState.active=!tablePlacementState.active;tablePlacementState.dragId=null;tablePlacementState.hoverTile=null;
  if(tablePlacementState.active){decorPlacementState.active=false;decorPlacementState.dragId=null;decorPlacementState.hoverTile=null;}
  canvas.classList.toggle('decor-editing',decorPlacementState.active||tablePlacementState.active);
  showToast(tablePlacementState.active?'Giữ và kéo bàn sạch tới chỗ mới.':'Đã lưu vị trí bàn.');renderTableShop();renderDecorShop();
}
function canvasTileFromEvent(event){const rect=canvas.getBoundingClientRect();return [Math.floor((event.clientX-rect.left)*canvas.width/rect.width/TILE),Math.floor((event.clientY-rect.top)*canvas.height/rect.height/TILE)];}
function canvasPointFromEvent(event){const rect=canvas.getBoundingClientRect();return [(event.clientX-rect.left)*canvas.width/rect.width,(event.clientY-rect.top)*canvas.height/rect.height];}
function decorAtPoint(point){return [...world.decor].reverse().find(item=>{const [fw,fh]=item.footprint||[1,1],[dw,dh]=item.draw||[42,42],x=item.tile[0]*TILE+fw*TILE/2,y=(item.tile[1]+fh)*TILE-4;return point[0]>=x-dw/2&&point[0]<=x+dw/2&&point[1]>=y-dh&&point[1]<=y;});}
function beginDecorDrag(event){if(!decorPlacementState.active)return;const point=canvasPointFromEvent(event),item=decorAtPoint(point);if(!item)return;event.preventDefault();decorPlacementState.dragId=item.id;decorPlacementState.hoverTile=[...item.tile];decorPlacementState.grabOffset=[point[0]-item.tile[0]*TILE,point[1]-item.tile[1]*TILE];decorPlacementState.valid=true;canvas.setPointerCapture?.(event.pointerId);}
function moveDecorDrag(event){if(!decorPlacementState.active||!decorPlacementState.dragId)return;const point=canvasPointFromEvent(event),tile=[Math.round((point[0]-decorPlacementState.grabOffset[0])/TILE),Math.round((point[1]-decorPlacementState.grabOffset[1])/TILE)];decorPlacementState.hoverTile=tile;decorPlacementState.valid=isValidDecorTile(world,tile,decorPlacementState.dragId);}
function endDecorDrag(event){if(!decorPlacementState.active||!decorPlacementState.dragId)return;const id=decorPlacementState.dragId;if(decorPlacementState.valid&&decorPlacementState.hoverTile){decorStoreState.tiles[world.level][id]=[...decorPlacementState.hoverTile];refreshWorldDecor();showToast(`Đã chuyển ${DECOR_CATALOG.find(item=>item.id===id).name}.`);}else showToast('Ô này bị chặn, vị trí cũ được giữ nguyên.');decorPlacementState.dragId=null;decorPlacementState.hoverTile=null;decorPlacementState.valid=false;canvas.releasePointerCapture?.(event.pointerId);}
function tableAtPoint(point){return [...world.tables].reverse().find(table=>table.placed&&point[0]>=table.tile[0]*TILE-11&&point[0]<=table.tile[0]*TILE+75&&point[1]>=(table.tile[1]+1)*TILE-58&&point[1]<=(table.tile[1]+1)*TILE);}
function beginTableDrag(event){
  if(!tablePlacementState.active)return;
  const point=canvasPointFromEvent(event),table=tableAtPoint(point);if(!table)return;
  if(table.state!=='CLEAN'||table.reserved||world.jobs.some(job=>!job.done&&job.payload.tableId===table.id)){showToast('Chờ khách rời bàn và nhân viên dọn xong rồi hãy di chuyển.');return;}
  event.preventDefault();tablePlacementState.dragId=table.id;tablePlacementState.hoverTile=[...table.tile];tablePlacementState.grabOffset=[point[0]-table.tile[0]*TILE,point[1]-table.tile[1]*TILE];tablePlacementState.valid=true;canvas.setPointerCapture?.(event.pointerId);
}
function moveTableDrag(event){
  if(!tablePlacementState.active||!tablePlacementState.dragId)return;
  const point=canvasPointFromEvent(event),tile=[Math.round((point[0]-tablePlacementState.grabOffset[0])/TILE),Math.round((point[1]-tablePlacementState.grabOffset[1])/TILE)];
  tablePlacementState.hoverTile=tile;tablePlacementState.valid=isValidTableTile(world,tile,tablePlacementState.dragId);
}
function endTableDrag(event){
  if(!tablePlacementState.active||!tablePlacementState.dragId)return;
  const table=world.tables.find(item=>item.id===tablePlacementState.dragId),tile=tablePlacementState.hoverTile;
  if(table&&tile&&table.state==='CLEAN'&&!table.reserved&&isValidTableTile(world,tile,table.id)){updateTableGeometry(table,tile);saveTableLayout(world);syncTableCollision(world.map,world.tables);showToast('Đã chuyển bàn tới vị trí mới.');}
  else showToast('Vị trí này chặn lối đi hoặc bàn đang được dùng.');
  tablePlacementState.dragId=null;tablePlacementState.hoverTile=null;tablePlacementState.valid=false;canvas.releasePointerCapture?.(event.pointerId);
}

function gachaCardTemplate(card,index){
  const art=card.art?`<div class="gacha-card-art" style="background-image:url('${card.art}')"></div>`:`<div class="gacha-card-fallback">${card.name.slice(0,1)}</div>`;
  const starCount={A:3,S:4,SR:5,SSR:6}[card.rank]||3;
  return `<article class="gacha-result-card rank-${card.rank}" role="button" aria-label="Xem thông tin ${card.name}" tabindex="0" data-gacha-id="${card.id}" style="--delay:${index*.065}s"><i class="gacha-beam"></i><i class="gacha-card-sigil">✦</i>${card.duplicate?'':`<span class="gacha-new">NEW</span>`}<span class="gacha-rank-ribbon">${card.rank}</span>${art}<div class="gacha-card-copy"><b>${card.name}</b><small>${card.role}</small><span class="gacha-stars" aria-label="${starCount} sao">${'★'.repeat(starCount)}</span><small class="${card.duplicate?'gacha-duplicate':''}">${card.duplicate?'Đổi thành +1 Mảnh':'Nhân viên mới'}</small></div></article>`;
}

function showGachaDetail(card){
  if(!card||!ui['gacha-detail'])return;
  ui['gacha-detail'].hidden=false;
  ui['gacha-detail'].className=`gacha-detail rank-${card.rank}`;
  ui['gacha-detail'].innerHTML=`<button class="gacha-detail-close" type="button" data-gacha-detail-close aria-label="Đóng thông tin">×</button><div class="gacha-detail-art" style="background-image:url('${card.art}')"></div><div class="gacha-detail-copy"><span class="gacha-detail-rank">${card.rank}</span><h3>${card.name}</h3><p>${card.role} · Tốc độ ${card.speed} · Hiệu suất ${card.work}</p><b>KỸ NĂNG</b><p>${card.skill}</p><b>ĐẶC TÍNH</b><p>${card.quirk}</p></div>`;
}

function showGachaSummon(card){
  if(!ui['gacha-modal']||!ui['gacha-summon-stage'])return;
  ui['gacha-modal'].hidden=false;
  if(ui['gacha-reveal-panel'])ui['gacha-reveal-panel'].hidden=true;
  ui['gacha-summon-stage'].hidden=false;
  ui['gacha-summon-stage'].className=`gacha-summon-stage summon-rank-${card.rank}`;
  if(ui['summon-silhouette'])ui['summon-silhouette'].style.backgroundImage=`url('${card.art}')`;
  if(ui['summon-rank'])ui['summon-rank'].textContent=card.rank==='SSR'?'SSR · CỰC HIẾM':card.rank==='SR'?'SR · HIẾM':`${card.rank} · ÁP SUẤT ỔN ĐỊNH`;
  void ui['gacha-summon-stage'].offsetWidth;
  ui['gacha-summon-stage'].classList.add('is-active');
}

function showGachaResults(results){
  gachaState.lastResults=results;
  if(!ui['gacha-results']||!ui['gacha-modal'])return;
  ui['gacha-results'].classList.toggle('single',results.length===1);
  ui['gacha-results'].innerHTML=results.map(gachaCardTemplate).join('');
  if(ui['gacha-detail']){ui['gacha-detail'].hidden=true;ui['gacha-detail'].innerHTML='';}
  ui['gacha-modal'].hidden=false;
  if(ui['gacha-summon-stage']){ui['gacha-summon-stage'].classList.remove('is-active');ui['gacha-summon-stage'].hidden=true;}
  if(ui['gacha-reveal-panel'])ui['gacha-reveal-panel'].hidden=false;
  renderGachaStatus();
}

function pullGacha(count=1,instant=false,free=false){
  if(gachaState.busy||!ui['gacha-machine'])return Promise.resolve([]);
  count=count===10?10:1;const cost=count===10?GACHA_TEN_COST:GACHA_COST;
  if(!free&&economyState.coins<cost){showToast(`Cần ${cost.toLocaleString('vi-VN')} Xu để quay ×${count}.`);return Promise.resolve([]);}
  if(!free){economyState.coins-=cost;if(world)world.coins=economyState.coins;renderUI();}
  gachaState.busy=true;ui['gacha-machine'].classList.add('is-spinning');
  if(ui['gacha-one'])ui['gacha-one'].disabled=true;if(ui['gacha-ten'])ui['gacha-ten'].disabled=true;
  const results=Array.from({length:count},pullGachaCard);
  const showcase=[...results].sort((a,b)=>Object.keys(GACHA_RANKS).indexOf(b.rank)-Object.keys(GACHA_RANKS).indexOf(a.rank))[0];
  if(!instant)showGachaSummon(showcase);
  return new Promise(resolve=>setTimeout(()=>{
    ui['gacha-machine'].classList.remove('is-spinning');if(ui['gacha-one'])ui['gacha-one'].disabled=false;if(ui['gacha-ten'])ui['gacha-ten'].disabled=false;
    gachaState.busy=false;showGachaResults(results);resolve(results);
  },instant?0:1800));
}

canvas.addEventListener('click',event=>{
  if(decorPlacementState.active||tablePlacementState.active)return;
  const rect=canvas.getBoundingClientRect(),x=Math.floor((event.clientX-rect.left)*canvas.width/rect.width/TILE),y=Math.floor((event.clientY-rect.top)*canvas.height/rect.height/TILE);
  if(x>=0&&x<world.map.rows[0].length&&y>=0&&y<world.map.rows.length&&isTileWalkable(world.map,x,y))world.sentiActionAt([x,y]);
});
canvas.addEventListener('pointerdown',beginDecorDrag);canvas.addEventListener('pointermove',moveDecorDrag);canvas.addEventListener('pointerup',endDecorDrag);canvas.addEventListener('pointercancel',endDecorDrag);
canvas.addEventListener('pointerdown',beginTableDrag);canvas.addEventListener('pointermove',moveTableDrag);canvas.addEventListener('pointerup',endTableDrag);canvas.addEventListener('pointercancel',endTableDrag);
document.addEventListener('keydown',event=>{if(TEST_MODE&&event.key.toLowerCase()==='g'){world.debug=!world.debug;if(ui['debug-drawer'])ui['debug-drawer'].hidden=!world.debug;showToast(`Debug ${world.debug?'BẬT':'TẮT'}`);}});
if(ui['assignment-grid'])ui['assignment-grid'].addEventListener('change',event=>{const select=event.target.closest('[data-assignment-role]');if(select)updateAssignment(select.dataset.assignmentRole,Number(select.dataset.assignmentSlot),select.value);});
document.querySelectorAll('[data-room]').forEach(button=>button.addEventListener('click',()=>switchRoom(button.dataset.room)));
if(ui.roster)ui.roster.addEventListener('click',event=>{const card=event.target.closest('[data-follow-staff]');if(!card)return;roomState.selectedCharacterId=card.dataset.followStaff;roomState.followCharacter=true;renderRoomNavigation();centerSelectedCharacter(true);showToast(`Camera đang theo ${world.staff(roomState.selectedCharacterId)?.name||'nhân viên'}.`);});
if(ui['camera-follow'])ui['camera-follow'].addEventListener('click',()=>{roomState.followCharacter=!roomState.followCharacter;renderRoomNavigation();if(roomState.followCharacter)centerSelectedCharacter(true);showToast(`Camera theo nhân vật: ${roomState.followCharacter?'BẬT':'TẮT'}.`);});
if(ui['spawn-btn'])ui['spawn-btn'].addEventListener('click',()=>world.spawnGuest(true));
if(ui['doze-btn'])ui['doze-btn'].addEventListener('click',()=>world.forceDoze());
if(ui['conflict-btn'])ui['conflict-btn'].addEventListener('click',()=>world.toggleConflict());
if(ui['level-btn'])ui['level-btn'].addEventListener('click',async()=>{const target=world.roomId==='room1'?'room2':'room1';await switchRoom(target,{debug:true});ui['level-btn'].textContent=target==='room1'?'Nhảy Gian 2 debug':'Về Gian 1 debug';});
if(ui['speed-btn'])ui['speed-btn'].addEventListener('click',()=>{world.speed=world.speed===1?10:1;ui['speed-btn'].textContent=`Tốc độ ×${world.speed}`;});
ui['horn-btn'].addEventListener('click',()=>{if(world.rage<35){showToast('Cần 35 Nộ.');return;}world.rage-=35;world.stress=clamp(world.stress+18,0,100);world.characters.filter(c=>c.kind==='staff').forEach(c=>c.stamina=100);showToast('YATTA! Toàn đội đầy Stamina.');});
ui['tea-btn'].addEventListener('click',()=>{world.stress=clamp(world.stress-38,0,100);showToast('Fu Hua mỉm cười. Stress −38.');});
if(ui['chase-btn'])ui['chase-btn'].addEventListener('click',()=>showToast('Chế độ đuổi chỉ mở khi có sự cố VIP.'));
if(ui['gacha-one'])ui['gacha-one'].addEventListener('click',()=>pullGacha(1));
if(ui['gacha-ten'])ui['gacha-ten'].addEventListener('click',()=>pullGacha(10));
if(ui['gacha-again'])ui['gacha-again'].addEventListener('click',()=>{ui['gacha-modal'].hidden=true;pullGacha(1);});
if(ui['gacha-again-ten'])ui['gacha-again-ten'].addEventListener('click',()=>{ui['gacha-modal'].hidden=true;pullGacha(10);});
if(ui['gacha-close'])ui['gacha-close'].addEventListener('click',()=>{ui['gacha-modal'].hidden=true;if(ui['gacha-detail'])ui['gacha-detail'].hidden=true;});
if(ui['gacha-results'])ui['gacha-results'].addEventListener('click',event=>{const cardEl=event.target.closest('[data-gacha-id]');if(cardEl)showGachaDetail(GACHA_POOL.find(card=>card.id===cardEl.dataset.gachaId));});
if(ui['gacha-results'])ui['gacha-results'].addEventListener('keydown',event=>{if(!['Enter',' '].includes(event.key))return;const cardEl=event.target.closest('[data-gacha-id]');if(cardEl){event.preventDefault();showGachaDetail(GACHA_POOL.find(card=>card.id===cardEl.dataset.gachaId));}});
if(ui['gacha-detail'])ui['gacha-detail'].addEventListener('click',event=>{if(event.target.closest('[data-gacha-detail-close]'))ui['gacha-detail'].hidden=true;});
if(ui['staff-codex'])ui['staff-codex'].addEventListener('click',event=>{const cardEl=event.target.closest('[data-codex-id]');if(!cardEl)return;renderStaffSkill(cardEl.dataset.codexId);ui['staff-skill-panel']?.scrollIntoView({behavior:'smooth',block:'nearest'});});
document.querySelectorAll('[data-staff-mode]').forEach(button=>button.addEventListener('click',()=>setStaffMode(button.dataset.staffMode)));
if(ui['open-dorm'])ui['open-dorm'].addEventListener('click',openDormScreen);
if(ui['dorm-close'])ui['dorm-close'].addEventListener('click',closeDormScreen);
if(ui['dorm-modal'])ui['dorm-modal'].addEventListener('click',event=>{if(event.target===ui['dorm-modal'])closeDormScreen();});
if(ui['staff-dorm-list'])ui['staff-dorm-list'].addEventListener('click',event=>{const button=event.target.closest('[data-staff-train]');if(button)previewTrainStaff(button.dataset.staffTrain);});
document.querySelector('.dorm-decor-tools')?.addEventListener('click',event=>{const button=event.target.closest('[data-dorm-decor]');if(button)toggleDormDecor(button.dataset.dormDecor);});
document.querySelector('.dorm-floor-picker')?.addEventListener('click',event=>{const button=event.target.closest('[data-dorm-floor]');if(button)selectDormFloor(button.dataset.dormFloor);});
if(ui['dorm-room'])ui['dorm-room'].addEventListener('click',event=>{const resident=event.target.closest('[data-dorm-skill]');if(!resident)return;const card=ui['staff-dorm-list']?.querySelector(`[data-dorm-id="${resident.dataset.dormSkill}"]`);ui['staff-dorm-list']?.querySelectorAll('.is-focused').forEach(item=>item.classList.remove('is-focused'));card?.classList.add('is-focused');card?.scrollIntoView({behavior:'smooth',block:'center'});});
if(ui['vip-list'])ui['vip-list'].addEventListener('click',event=>{const button=event.target.closest('[data-vip-start]');if(button)startVipEvent(button.dataset.vipStart);});
if(ui['vip-event'])ui['vip-event'].addEventListener('click',event=>{const button=event.target.closest('[data-vip-action]');if(button)handleVipAction(button.dataset.vipAction);});
if(ui['gacha-modal'])ui['gacha-modal'].addEventListener('click',event=>{if(event.target===ui['gacha-modal'])ui['gacha-modal'].hidden=true;});
if(ui['recipe-lab'])ui['recipe-lab'].addEventListener('click',event=>{
  const ingredient=event.target.closest('[data-recipe-ingredient]');
  if(ingredient){toggleRecipeIngredient(decodeURIComponent(ingredient.dataset.recipeIngredient));return;}
  if(event.target.closest('[data-recipe-reset]')){recipeState.selected.clear();recipeState.lastResult='Đã dọn bàn nghiên cứu. Chọn 1–3 nguyên liệu để thử lại.';renderRecipeBook();return;}
  if(event.target.closest('[data-recipe-research]')){researchRecipe();return;}
  if(event.target.closest('[data-test-recipe-fragment]'))grantNextRecipeFragmentForTest();
});
if(ui['recipe-book-grid'])ui['recipe-book-grid'].addEventListener('click',event=>{const button=event.target.closest('[data-unlock-recipe]');if(button)unlockRecipeByFragment(button.dataset.unlockRecipe);});
if(ui['room-upgrade-list'])ui['room-upgrade-list'].addEventListener('click',event=>{const button=event.target.closest('[data-room-upgrade]');if(button)applyUpgrade(button.dataset.roomUpgrade);});
if(ui['restaurant-upgrade'])ui['restaurant-upgrade'].addEventListener('click',upgradeRestaurant);
if(ui['upgrade-test-pack'])ui['upgrade-test-pack'].addEventListener('click',grantRestaurantUpgradeTestPack);
if(ui['full-test-room2'])ui['full-test-room2'].addEventListener('click',enterFullResourceRoom2);
if(ui['decor-shop'])ui['decor-shop'].addEventListener('click',event=>{const card=event.target.closest('[data-decor-id]');if(card)toggleDecorItem(card.dataset.decorId);});
if(ui['decor-edit-toggle'])ui['decor-edit-toggle'].addEventListener('click',toggleDecorPlacement);
if(ui['table-shop'])ui['table-shop'].addEventListener('click',event=>{const button=event.target.closest('[data-table-action]'),card=button?.closest('[data-table-style]');if(card)tableAction(card.dataset.tableStyle,button.dataset.tableAction);});
if(ui['table-edit-toggle'])ui['table-edit-toggle'].addEventListener('click',toggleTablePlacement);
if(ui['staff-slot-list'])ui['staff-slot-list'].addEventListener('click',event=>{const button=event.target.closest('[data-staff-slot]');if(button)upgradeStaffSlot(button.dataset.staffSlot);});
if(ui['decor-filter'])ui['decor-filter'].addEventListener('change',event=>{decorFilter=event.target.value;renderDecorShop();});
if(ui['room-upgrade-reset'])ui['room-upgrade-reset'].addEventListener('click',()=>{const state=upgradesForRoom();Object.keys(state).forEach(key=>state[key]=0);renderUpgradePanel();showToast(`Đã hoàn tác nâng cấp thử của ${ROOM_CONFIG[roomState.active].name}.`);});
document.querySelectorAll('[data-scale]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-scale]').forEach(b=>b.classList.toggle('active',b===button));ui['canvas-wrap'].className=`canvas-wrap scale-${button.dataset.scale}`;requestAnimationFrame(()=>centerSelectedCharacter(true));}));

const PHASE_CONTENT={
  morning:{kicker:'01 · BUỔI SÁNG',title:'Thu mua nguyên liệu',copy:'Chọn khu vực và người đi. Nhân vật tự chạy vô tận; hết tim mới chốt số nguyên liệu mang về.'},
  afternoon:{kicker:'02 · BUỔI CHIỀU',title:'Chọn thực đơn & chuẩn bị món',copy:'Xem khẩu vị hôm nay, chọn món và số mẻ, kiểm kho hoặc mua phần còn thiếu rồi mới nấu.'},
  night:{kicker:'04 · KHUYA',title:'Tổng kết & nâng cấp',copy:'Xem kết quả ca, rửa bát lấy Mảnh Bản Vẽ, quản lý nhân sự hoặc mở rộng gian quán.'}
};
const SUPPLY_MAPS=[
  {id:'nagazora',icon:'🌧',name:'Phố Nagazora',description:'Cua Biển Chết · Rong Biển Honkai',drops:['Cua Biển Chết','Rong Biển Honkai']},
  {id:'arc',icon:'🌃',name:'Arc City',description:'Thịt Lợn Neon · Gia vị công nghiệp · Sắt Arc City',drops:['Thịt Lợn Neon','Gia vị công nghiệp'],iron:5},
  {id:'babylon',icon:'❄',name:'Babylon',description:'Cá Ngừ đóng băng · Đá Bào Parvati',drops:['Cá Ngừ đóng băng','Đá Bào Parvati']},
  {id:'taixuan',icon:'⛰',name:'Thái Hư Sơn',description:'Măng rừng · Gà chạy bộ · Lá trà',drops:['Măng rừng','Gà chạy bộ','Lá trà']}
];
const stockText=()=>Object.entries(phaseState.stock).filter(([,count])=>count>0).map(([name,count])=>`${name} ×${count}`).join(' · ')||'Kho đang trống';
let currentExpedition=null;
let currentCookingGame=null;
let currentWashingGame=null;
function phaseDetail(text,actions=''){return `<div class="phase-choice-detail"><p>${text}</p>${actions}</div>`;}
function renderPhaseScreen(){
  if(activePhase==='morning'){
    const buyers=[['senti','Senti tự đi'],...['pardofelis','sushang'].filter(id=>gachaState.owned.has(id)).map(id=>[id,STAFF[id].name])];
    ui['phase-screen'].innerHTML=`<div class="expedition-picker"><label>Người thu mua <select id="phase-buyer" ${phaseState.trips?'disabled':''}>${buyers.map(([id,name])=>`<option value="${id}" ${phaseState.buyer===id?'selected':''}>${name}</option>`).join('')}</select></label><span>${phaseState.trips?'Hôm nay đã thu mua xong.':'Chọn khu là vào event run ngay · A/D di chuyển · Space nhảy'}</span></div><div class="phase-screen-grid">${SUPPLY_MAPS.map(map=>`<article class="phase-screen-card ${phaseState.selectedMap===map.id?'is-selected':''}" style="--map-art:url('assets/event-demo/maps/${map.id==='arc'?'arc-city':map.id}.png')"><div class="phase-icon">${map.icon}</div><h3>${map.name}</h3><p>${map.description}</p><button type="button" data-supply-map="${map.id}" ${phaseState.trips?'disabled':''}>${phaseState.trips?'ĐÃ THU MUA':'CHỌN · VÀO RUN'}</button></article>`).join('')}</div>${phaseDetail(`Kho: ${stockText()}${economyState.arcIron?` · Sắt Arc City ×${economyState.arcIron}`:''}`,`<button type="button" data-phase-next="afternoon">SANG BUỔI CHIỀU →</button>`)}`;
    return;
  }
  if(activePhase==='afternoon'){
    const trend=dailyTrend(),trendDish=dishById(trend.dishId);
    if(!phaseState.planLocked){
      const total=plannedBatchCount(),requirements=planRequirements(),missing=missingPlanIngredients(),price=marketPrice();
      const menu=unlockedMenuIds().map(id=>{const dish=dishById(id),count=phaseState.plan[id]||0,isTrend=id===trend.dishId;return `<article class="prep-dish-card ${isTrend?'is-trend':''}"><img src="${dish.asset}" alt="${dish.name}"><div><span>${'★'.repeat(dish.stars)} · ${dish.system}${isTrend?' · GỢI Ý HÔM NAY':''}</span><h3>${dish.name}</h3><p>${dish.ingredients.join(' + ')}</p><b>${dish.price} Xu${isTrend?' · Dễ bán hơn hôm nay':''}</b></div><div class="prep-dish-actions"><button type="button" data-plan-remove="${id}" ${count<=0?'disabled':''}>−</button><label><input type="number" min="0" step="1" value="${count}" data-plan-count="${id}" aria-label="Số mẻ ${dish.name}"><small>mẻ · ${count*3} phần</small></label><button type="button" data-plan-dish="${id}">＋</button></div></article>`;}).join('');
      const requirementRows=Object.keys(requirements).length?Object.entries(requirements).map(([name,need])=>{const have=phaseState.stock[name]||0,short=Math.max(0,need-have),buyAll=short*price;return `<li class="${short?'is-missing':''}"><span>${name}</span><b>${have}/${need}</b>${short?`<button type="button" data-buy-ingredient="${encodeURIComponent(name)}" data-buy-count="${short}">MUA ĐỦ ×${short} · ${buyAll.toLocaleString('vi-VN')} XU</button>`:''}</li>`;}).join(''):'<li><span>Chưa chọn mẻ nấu.</span></li>';
      ui['phase-screen'].innerHTML=`<section class="prep-board"><header class="trend-banner"><div><small>GỢI Ý KHẨU VỊ HÔM NAY · KHÔNG BẮT BUỘC</small><h2>${trend.title}</h2><p>${trend.copy} Chị vẫn có thể chọn mọi món khác trong menu.</p></div><img src="${trendDish.asset}" alt="${trendDish.name}"><b>Gợi ý: ${trendDish.name}<br>Dễ bán hơn hôm nay</b></header><div class="prep-layout"><div><div class="prep-section-title"><b>1 · CHỌN MÓN VÀ SỐ LƯỢNG</b><span>Không giới hạn mẻ · mỗi mẻ 3 phần</span></div><div class="prep-menu">${menu}</div></div><aside class="prep-inventory"><div class="prep-section-title"><b>2 · KIỂM KHO</b><span>${total} mẻ · ${total*3} phần dự kiến</span></div><ul>${requirementRows}</ul><button class="prep-lock" type="button" data-lock-plan ${!total||Object.keys(missing).length?'disabled':''}>CHỐT ${total} MẺ · NẤU ${total*3} PHẦN →</button><button class="prep-open-restaurant is-locked" type="button" data-open-restaurant>🔥 MỞ QUÁN</button><small class="prep-open-note">Chọn món → nấu xong toàn bộ mẻ → bấm MỞ QUÁN.</small><p>Kho hiện có: ${stockText()}</p><p>Ví: <b>${economyState.coins.toLocaleString('vi-VN')} Xu</b>${gachaState.owned.has('pardofelis')?' · Pardo giảm Chợ Đen còn 210 Xu':''}</p><p class="prep-risk">⚠ Nấu dư mà bán không hết sẽ bị bỏ cuối ngày; nguyên liệu không hoàn lại.</p></aside></div></section>`;
      return;
    }
    const done=phaseState.planIndex>=phaseState.planQueue.length,currentDish=done?null:dishById(phaseState.planQueue[phaseState.planIndex]);
    const warmer=Object.entries(phaseState.preparedByDish).filter(([,count])=>count>0).map(([id,count])=>{const perfect=(phaseState.preparedQualityByDish[id]||[]).filter(quality=>quality==='perfect').length;return `<div><img src="${dishById(id).asset}" alt=""><span><b>${dishById(id).name}</b><small>${count} phần${perfect?` · ✨ ${perfect} Hoàn hảo`:''}</small></span></div>`;}).join('')||'<p>Chưa có món trong tủ.</p>';
    if(done){ui['phase-screen'].innerHTML=`<section class="prep-board"><header class="trend-banner"><div><small>ĐÃ CHUẨN BỊ XONG</small><h2>Tủ Giữ Ấm sẵn sàng</h2><p>Món Hoàn hảo được cộng ${Math.round(PERFECT_DISH_BONUS*100)}% giá bán. Đúng khẩu vị hôm nay được gọi nhiều hơn và giá +50%.</p></div><img src="${trendDish.asset}" alt=""><b>${trend.title}</b></header><div class="warmer-grid">${warmer}</div><div class="open-restaurant-box"><span>Ca bán giới hạn ${world.map.rushDuration} giây · hết giờ sẽ chốt món bán, món hết và món còn dư.</span><button type="button" data-open-restaurant ${phaseState.prepared<=0?'disabled':''}>LẬT BIỂN · MỞ QUÁN</button></div></section>`;return;}
    const steps=[['🔪','THÁI','Sơ chế nguyên liệu'],['🍳','XÀO','Canh lửa và đảo chảo'],['♨','HẦM','Hoàn thành mẻ']];
    ui['phase-screen'].innerHTML=`<section class="prep-board"><header class="cooking-batch-head"><img src="${currentDish.asset}" alt="${currentDish.name}"><div><small>MẺ ${phaseState.planIndex+1}/${phaseState.planQueue.length}</small><h2>${currentDish.name}</h2><p>Đạt xanh cả ba minigame để tạo món Hoàn hảo và nhận +${Math.round(PERFECT_DISH_BONUS*100)}% giá bán.</p></div></header><div class="phase-screen-grid cooking-steps">${steps.map((step,index)=>{const prior=phaseState.cookResults[index];return `<article class="phase-screen-card ${index===phaseState.cookStep?'is-selected':''} ${index<phaseState.cookStep?'is-complete':''} ${prior?.grade==='perfect'?'is-perfect':''}"><div class="phase-icon">${index<phaseState.cookStep?(prior?.grade==='perfect'?'★':'✓'):step[0]}</div><h3>${step[1]}</h3><p>${index<phaseState.cookStep?(prior?.grade==='perfect'?'Hoàn hảo · Xanh':'Tạm ổn · Vàng'):step[2]}</p><button type="button" data-cook-step="${index}" ${index!==phaseState.cookStep?'disabled':''}>${index===phaseState.cookStep?'CHƠI MINIGAME':index<phaseState.cookStep?'ĐÃ XONG':'CHỜ'}</button></article>`;}).join('')}</div><div class="warmer-grid compact">${warmer}</div><div class="open-restaurant-box is-locked"><span>🔒 Cần nấu xong ${phaseState.planQueue.length-phaseState.planIndex} mẻ còn lại trước khi mở quán.</span><button type="button" data-open-restaurant>🔥 MỞ QUÁN</button></div></section>`;
    return;
  }
  const cards=[['📋','Nhiệm vụ & tổng kết','Xem doanh thu và khách đã phục vụ','summary'],['🫧','Rửa bát','Rửa bát để nhận Mảnh Bản Vẽ','wash'],['🍲','Gacha nhân sự','Mở bảng nhân sự','staff'],['🏮','Mở rộng mặt bằng','Mở cửa hàng nội thất và nâng quán','upgrade']];
  ui['phase-screen'].innerHTML=`<div class="phase-screen-grid">${cards.map(card=>`<article class="phase-screen-card"><div class="phase-icon">${card[0]}</div><h3>${card[1]}</h3><p>${card[2]}</p><button type="button" data-night-action="${card[3]}" ${card[3]==='wash'&&phaseState.washes?'disabled':''}>${card[3]==='wash'&&phaseState.washes?'ĐÃ RỬA':card[3]==='wash'?'RỬA BÁT':'MỞ'}</button></article>`).join('')}</div>${phaseDetail(`Ngày ${phaseState.day}: <b>${world.metrics.served} khách</b> · ${world.revenue} Xu doanh thu · Uy tín ${world.rep}. Mảnh Bản Vẽ ×${phaseState.blueprintParts}.`,`<button type="button" data-next-day>SANG NGÀY MỚI →</button>`)}`;
}
function dispatchSupply(){
  const map=SUPPLY_MAPS.find(entry=>entry.id===phaseState.selectedMap);
  if(!map){showToast('Chọn khu vực thu mua trước.');return;}
  if(phaseState.trips){showToast('Hôm nay đã đi thu mua. Sang ngày mới để đi tiếp.');return;}
  if(currentExpedition)return;
  const buyer=phaseState.buyer;
  currentExpedition=startExpedition({container:ui['phase-screen'],map,buyer,
    onComplete(collected){
      currentExpedition=null;
      for(const [item,count] of Object.entries(collected))phaseState.stock[item]=(phaseState.stock[item]||0)+count+(buyer==='sushang'?1:0);
      if(map.iron)economyState.arcIron+=map.iron;
      phaseState.trips++;
      renderPhaseScreen();renderUI();
      showToast(`Đã về từ ${map.name}: ${Object.entries(collected).map(([item,count])=>`${item} ×${count}`).join(', ')}${map.iron?` · Sắt Arc City ×${map.iron}`:''}.`);
    },
    onLeave(){currentExpedition=null;renderPhaseScreen();showToast('Đã về chọn khu; nguyên liệu của chuyến chưa được nhập kho.');}
  });
}
function cookStep(index,result={grade:'good',perfect:false}){
  if(!phaseState.planLocked||phaseState.planIndex>=phaseState.planQueue.length)return;
  if(index!==phaseState.cookStep){showToast('Làm theo thứ tự: THÁI → XÀO → HẦM.');return;}
  phaseState.cookResults[index]=result;
  phaseState.cookStep++;
  if(phaseState.cookStep===3){const plannedDish=dishById(phaseState.planQueue[phaseState.planIndex]),burnt=phaseState.cookResults.some(entry=>entry?.grade==='burnt'),dish=burnt?dishById('burnt-congee'):plannedDish,perfect=!burnt&&phaseState.cookResults.every(entry=>entry?.grade==='perfect'),quality=perfect?'perfect':burnt?'burnt':'standard';for(const [name,count] of Object.entries(ingredientCounts(plannedDish)))phaseState.stock[name]-=count*2;if(burnt)recipeState.unlocked.add('burnt-congee');phaseState.preparedByDish[dish.id]=(phaseState.preparedByDish[dish.id]||0)+3;(phaseState.preparedQualityByDish[dish.id]??=[]).push(quality,quality,quality);phaseState.prepared+=3;phaseState.batches++;phaseState.planIndex++;phaseState.cookStep=0;phaseState.cookResults=[];renderRecipeBook();showToast(burnt?`🔥 Mẻ ${plannedDish.name} bị cháy · biến thành 3 Bát Cháo Khê.`:perfect?`✨ ${dish.name}: +3 món Hoàn hảo · thưởng +${Math.round(PERFECT_DISH_BONUS*100)}% khi bán!`:`${dish.name}: +3 phần chất lượng tiêu chuẩn trong Tủ Giữ Ấm.`);}
  else showToast(`${result.grade==='perfect'?'★ Hoàn hảo!':'Đạt hạng Vàng.'} Tiếp tục ${['THÁI','XÀO','HẦM'][phaseState.cookStep]}.`);
  renderPhaseScreen();
}

function launchCookingMiniGame(index){
  if(currentCookingGame)return;
  if(!phaseState.planLocked||phaseState.planIndex>=phaseState.planQueue.length||index!==phaseState.cookStep){showToast('Làm theo thứ tự: THÁI → XÀO → HẦM.');return;}
  const dish=dishById(phaseState.planQueue[phaseState.planIndex]);
  currentCookingGame=startCookingMiniGame({container:ui['phase-screen'],step:index,dish,
    onComplete(result){currentCookingGame=null;cookStep(index,result);},
    onCancel(){currentCookingGame=null;renderPhaseScreen();}
  });
}

function launchDishwashingMiniGame(){
  if(currentWashingGame||phaseState.washes)return;
  currentWashingGame=startDishwashingMiniGame({container:ui['phase-screen'],sentiAsset:STAFF.senti.asset,
    onComplete(result){currentWashingGame=null;phaseState.washes=1;phaseState.blueprintParts+=result.reward;renderPhaseScreen();showToast(`Senti rửa xong · Mảnh Bản Vẽ +${result.reward}.`);},
    onCancel(){currentWashingGame=null;renderPhaseScreen();}
  });
}

function setPlanDishCount(id,value){if(phaseState.planLocked||!unlockedMenuIds().includes(id))return;const next=Math.max(0,Math.floor(Number(value)||0));if(next)phaseState.plan[id]=next;else delete phaseState.plan[id];renderPhaseScreen();}
function changePlanDish(id,delta){if(phaseState.planLocked||!unlockedMenuIds().includes(id))return;setPlanDishCount(id,(phaseState.plan[id]||0)+delta);}
function buyIngredient(name,quantity=1){const unitPrice=marketPrice(),count=Math.max(1,Math.floor(Number(quantity)||1)),totalPrice=unitPrice*count;if(economyState.coins<totalPrice){showToast(`Chưa đủ ${totalPrice.toLocaleString('vi-VN')} Xu để mua ${name} ×${count}.`);return;}economyState.coins-=totalPrice;if(world)world.coins=economyState.coins;phaseState.stock[name]=(phaseState.stock[name]||0)+count;showToast(`Đã mua ${name} ×${count} · ${totalPrice.toLocaleString('vi-VN')} Xu.`);renderPhaseScreen();renderUI();}
function lockCookingPlan(){const missing=missingPlanIngredients();if(!plannedBatchCount()){showToast('Chọn ít nhất 1 mẻ trước.');return;}if(Object.keys(missing).length){showToast('Kho chưa đủ nguyên liệu. Thu mua hoặc mua thêm ở Chợ Đen.');return;}phaseState.planLocked=true;phaseState.planQueue=Object.entries(phaseState.plan).flatMap(([id,count])=>Array(count).fill(id));phaseState.planIndex=0;phaseState.cookStep=0;phaseState.cookResults=[];renderPhaseScreen();}
async function openRestaurant(){if(!phaseState.planLocked){showToast('Chọn món và chốt kế hoạch nấu trước khi mở quán.');return;}if(phaseState.planIndex<phaseState.planQueue.length){showToast(`Còn ${phaseState.planQueue.length-phaseState.planIndex} mẻ chưa nấu xong.`);return;}if(phaseState.prepared<=0){showToast('Tủ Giữ Ấm chưa có món.');return;}phaseState.rushEnded=false;await start(world.level,{roomId:world.roomId,speed:1,running:true});setPhase('evening');showToast(`Đã mở quán · ${phaseState.prepared} phần sẵn sàng bán.`);}
function showRushSummary(){if(phaseState.rushEnded)return;phaseState.rushEnded=true;ui['canvas-wrap'].hidden=true;ui['phase-screen'].hidden=false;const leftovers=Object.entries(phaseState.preparedByDish).filter(([,count])=>count>0).map(([id,count])=>`<div class="is-waste"><img src="${dishById(id).asset}" alt=""><span><b>${dishById(id).name}</b><small>Ế ${count} phần · bỏ cuối ngày, không hoàn nguyên liệu</small></span></div>`).join('')||'<p>Đã bán hết toàn bộ món chuẩn bị.</p>';ui['phase-kicker'].textContent='03 · HẾT GIỜ BÁN';ui['phase-title'].textContent='Đóng ca';ui['phase-copy'].textContent=phaseState.prepared?'Món bán ế được tính là lỗ và sẽ bị bỏ khi sang ngày mới.':'Đã bán hết món chuẩn bị trong ca.';ui['phase-screen'].innerHTML=`<section class="rush-summary"><h2>Ca bán đã kết thúc</h2><div class="rush-summary-stats"><b>${world.metrics.served}<small>khách đã phục vụ</small></b><b>${world.revenue}<small>Xu doanh thu</small></b><b>${phaseState.prepared}<small>phần bán ế · tính lỗ</small></b></div><div class="warmer-grid">${leftovers}</div><button type="button" data-phase-next="night">SANG KHUYA · TỔNG KẾT →</button></section>`;}
function openPanel(name){document.querySelector(`[data-panel="${name}"]`)?.click();document.querySelector('.control-column')?.scrollIntoView({behavior:'smooth',block:'nearest'});}
async function nextDay(){phaseState.day++;phaseState.trips=0;phaseState.batches=0;phaseState.cookStep=0;phaseState.cookResults=[];phaseState.washes=0;phaseState.selectedMap=null;phaseState.prepared=0;phaseState.preparedByDish={};phaseState.preparedQualityByDish={};phaseState.plan={};phaseState.planLocked=false;phaseState.planQueue=[];phaseState.planIndex=0;phaseState.rushEnded=false;await start(world.level,{roomId:world.roomId,speed:world.speed,running:false});setPhase('morning');showToast(`Ngày ${phaseState.day} bắt đầu. Chọn khu vực thu mua.`);}

function setPhase(phase){
  if(currentCookingGame){showToast('Hoàn thành minigame hoặc bấm VỀ BẾP trước.');return;}
  if(currentWashingGame){showToast('Hoàn thành rửa bát hoặc bấm VỀ TỔNG KẾT trước.');return;}
  if(currentExpedition&&phase!=='morning'){showToast('Hoàn thành lượt chạy hoặc bấm VỀ CHỌN KHU trước.');return;}
  if(currentExpedition&&phase==='morning')return;
  activePhase=phase;
  document.body.dataset.phase=phase;
  if(!ui['phase-screen'])return;
  document.querySelectorAll('[data-phase]').forEach(b=>b.classList.toggle('active',b.dataset.phase===phase));
  const canvasVisible=phase==='evening';ui['canvas-wrap'].hidden=!canvasVisible;ui['phase-screen'].hidden=canvasVisible;
  if(canvasVisible){ui['phase-kicker'].textContent='03 · BUỔI TỐI';ui['phase-title'].textContent='Rush Hour mở quán';ui['phase-copy'].textContent='Nhân viên tự nhận job, đi bộ tới đúng trạm rồi mới làm việc. Bấm trực tiếp trong quán để điều khiển Senti.';return;}
  const data=PHASE_CONTENT[phase];ui['phase-kicker'].textContent=data.kicker;ui['phase-title'].textContent=data.title;ui['phase-copy'].textContent=data.copy;
  document.querySelector('.day-chip b').textContent=String(phaseState.day).padStart(2,'0');
  ui['phase-objectives'].innerHTML=(phase==='morning'?['Chọn một trong bốn khu vực','Nhân vật tự chạy · Space để nhảy','Hết 4 tim thì chốt và nhập kho']:phase==='afternoon'?['Khẩu vị chỉ là gợi ý · tự chọn nhiều món','Không giới hạn mẻ · thiếu thì mua thêm','Nấu dư bán ế sẽ mất nguyên liệu']:['Xem kết quả ca và rửa bát','Quản lý nhân viên hoặc nâng quán','Bấm SANG NGÀY MỚI để thu mua tiếp']).map(item=>`<div>✓ ${item}</div>`).join('');
  renderPhaseScreen();
}

ui['phase-screen'].addEventListener('click',async event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.supplyMap){if(phaseState.trips)return;phaseState.selectedMap=button.dataset.supplyMap;dispatchSupply();return;}
  if(button.hasAttribute('data-dispatch-supply')){dispatchSupply();return;}
  if(button.dataset.planDish){changePlanDish(button.dataset.planDish,1);return;}
  if(button.dataset.planRemove){changePlanDish(button.dataset.planRemove,-1);return;}
  if(button.dataset.buyIngredient){buyIngredient(decodeURIComponent(button.dataset.buyIngredient),button.dataset.buyCount);return;}
  if(button.hasAttribute('data-lock-plan')){lockCookingPlan();return;}
  if(button.hasAttribute('data-open-restaurant')){await openRestaurant();return;}
  if(button.dataset.phaseNext){setPhase(button.dataset.phaseNext);return;}
  if(button.dataset.cookStep!==undefined){launchCookingMiniGame(Number(button.dataset.cookStep));return;}
  if(button.hasAttribute('data-next-day')){await nextDay();return;}
  if(button.dataset.nightAction==='summary'){renderPhaseScreen();showToast(`Tổng kết: ${world.metrics.served} khách · ${world.revenue} Xu.`);return;}
  if(button.dataset.nightAction==='wash'){launchDishwashingMiniGame();return;}
  if(button.dataset.nightAction==='staff'){openPanel('staff');return;}
  if(button.dataset.nightAction==='upgrade')openPanel('decor');
});
ui['phase-screen'].addEventListener('change',event=>{if(event.target.id==='phase-buyer')phaseState.buyer=event.target.value;if(event.target.dataset.planCount)setPlanDishCount(event.target.dataset.planCount,event.target.value);});

document.querySelectorAll('[data-phase]').forEach(button=>{
  button.disabled=!TEST_MODE;
  if(TEST_MODE)button.addEventListener('click',()=>setPhase(button.dataset.phase));
});
document.querySelectorAll('[data-phase-jump]').forEach(button=>button.addEventListener('click',()=>setPhase(button.dataset.phaseJump)));
document.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('active',b===button));
  document.querySelectorAll('[data-panel-view]').forEach(view=>view.classList.toggle('active',view.dataset.panelView===button.dataset.panel));
  if(button.dataset.panel==='menu')renderRecipeBook();
  if(button.dataset.panel==='staff'){renderAssignments();renderGachaStatus();}
  if(button.dataset.panel==='vip')renderVipSystem();
}));
if(ui['feature-tour'])ui['feature-tour'].addEventListener('click',()=>showToast('Sáng thu mua → Chiều nấu mẻ → Tối Rush Canvas → Khuya tổng kết.'));

window.__TAIXUAN_QA__={
  phase(){return {active:activePhase,day:phaseState.day,selectedMap:phaseState.selectedMap,buyer:phaseState.buyer,trips:phaseState.trips,stock:{...phaseState.stock},prepared:phaseState.prepared,preparedByDish:{...phaseState.preparedByDish},preparedQualityByDish:Object.fromEntries(Object.entries(phaseState.preparedQualityByDish).map(([id,quality])=>[id,[...quality]])),plan:{...phaseState.plan},planLocked:phaseState.planLocked,planIndex:phaseState.planIndex,batches:phaseState.batches,cookStep:phaseState.cookStep,cookResults:phaseState.cookResults.map(result=>({...result})),washes:phaseState.washes,blueprintParts:phaseState.blueprintParts,trend:{...dailyTrend()},run:currentExpedition?.snapshot()||null};},
  async reset(level='lv1',speed=10){phaseState.preparedByDish={'arc-city-bao':20};phaseState.preparedQualityByDish={'arc-city-bao':Array(20).fill('standard')};phaseState.prepared=20;phaseState.rushEnded=false;await start(level,{speed,running:true});setPhase('evening');return true;},
  finishExpedition(){return currentExpedition?.finishForTest()||false;},
  completeCookingMiniGame(){return currentCookingGame?.finishForTest()||false;},
  cookingMiniGame(){return currentCookingGame?.snapshot()||null;},
  completeWashingMiniGame(){return currentWashingGame?.finishForTest()||false;},
  washingMiniGame(){return currentWashingGame?.snapshot()||null;},
  endRush(){if(!world)return false;world.timeLeft=0;world.running=false;return true;},
  snapshot(){if(!world)return {ready:false,assets:Object.keys(characterImages),dishAssets:Object.keys(dishImages),jobs:[],guests:[],staff:[],tables:[]};return {ready:true,running:world.running,level:world.level,roomId:world.roomId,roomLevel:world.roomLevel,kitchenSlots:cookStationsForMap(world.map).length,time:world.time,timeLeft:world.timeLeft,revenue:world.revenue,assets:Object.keys(characterImages),dishAssets:Object.keys(dishImages),jobs:world.jobs.map(j=>({...j})),guests:world.guests.map(g=>({id:g.id,state:g.guestState,stateAge:g.stateAge,done:g.done,tile:g.tile,tableId:g.tableId,order:g.order})),staff:world.characters.filter(c=>c.kind==='staff').map(c=>({id:c.id,role:c.role,state:c.state,tile:c.tile,anim:c.anim,path:c.path,carry:Boolean(c.carry),dish:c.carry?.dish||null})),tables:world.tables.map(t=>({id:t.id,styleId:t.styleId,placed:t.placed,tile:t.tile,state:t.state,reserved:t.reserved,meal:t.meal?.dish||null})),staffSlots:{...staffSlotState},metrics:{...world.metrics},conflict:world.conflict};},
  forceDoze(){world.forceDoze();},toggleConflict(){world.toggleConflict();},spawn(){world.spawnGuest(true);},toggleDebug(){world.debug=!world.debug;},
  setReception(id){assignmentState[roomState.active].reception[0]=id;return start(world.level,{roomId:world.roomId,speed:world.speed});},
  setAssignments(assignments){const state=assignmentsForRoom();for(const [role,value] of Object.entries(assignments))if(state[role])state[role]=Array.isArray(value)?value:[value];return start(world.level,{roomId:world.roomId,speed:world.speed});},
  pullGacha(){return pullGacha(1,true,true);},
  pullGachaTen(){return pullGacha(10,true,true);},
  previewGacha(ids){const wanted=(ids||GACHA_POOL.map(card=>card.id)).map(id=>GACHA_POOL.find(card=>card.id===id)).filter(Boolean).map(card=>({...card,duplicate:false}));showGachaResults(wanted);return wanted;},
  gachaPool(){return GACHA_POOL.map(card=>({...card,loaded:Boolean(characterImages[card.id])}));},
  gacha(){return {pulls:gachaState.pulls,sinceS:gachaState.sinceS,sinceSSR:gachaState.sinceSSR,owned:[...gachaState.owned],shards:{...gachaState.shards},training:{...gachaState.training},lastResults:gachaState.lastResults};},
  recipes(){return {unlocked:[...recipeState.unlocked],fragments:[...recipeState.fragments],selected:[...recipeState.selected]};},
  selectRecipeIngredients(names=[]){recipeState.selected=new Set(names.filter(name=>RECIPE_INGREDIENTS.includes(name)).slice(0,3));renderRecipeBook();return [...recipeState.selected];},
  researchRecipe(){return researchRecipe();},
  grantRecipeFragment(id){if(!FRAGMENT_DISHES.includes(id))return false;recipeState.fragments.add(id);renderRecipeBook();return true;},
  unlockRecipe(id){return unlockRecipeByFragment(id);},
  dorm(){return {owned:[...gachaState.owned],shards:{...gachaState.shards},training:{...gachaState.training}};},
  trainStaff(id){return previewTrainStaff(id);},
  setStaffShards(id,count){if(!GACHA_POOL.some(card=>card.id===id))return false;gachaState.shards[id]=Math.max(0,Math.floor(Number(count)||0));renderGachaStatus();return gachaState.shards[id];},
  upgrade(type,roomId=roomState.active){applyUpgrade(type,roomId);return {...upgradesForRoom(roomId)};},upgrades(){return Object.fromEntries(Object.entries(roomUpgradeState).map(([id,state])=>[id,{...state}]));},
  wallet(){return {...economyState};},setWallet(coins,arcIron){economyState.coins=Math.max(0,Math.floor(coins));economyState.arcIron=Math.max(0,Math.floor(arcIron));Object.values(roomState.worlds).filter(Boolean).forEach(roomWorld=>roomWorld.coins=economyState.coins);return {...economyState};},upgradeRestaurant,grantRestaurantUpgradeTestPack,enterFullResourceRoom2,
  switchRoom(roomId){return switchRoom(roomId);},rooms(){return {active:roomState.active,unlocked:[...roomState.unlocked],cached:Object.fromEntries(Object.entries(roomState.worlds).map(([id,value])=>[id,Boolean(value)])),followCharacter:roomState.followCharacter,selectedCharacterId:roomState.selectedCharacterId};},
  decor(id){toggleDecorItem(id);return {owned:[...decorStoreState.owned],placed:[...decorStoreState.placed]};},decorState(){return {owned:[...decorStoreState.owned],placed:[...decorStoreState.placed]};},
  moveDecor(id,tile){if(!isValidDecorTile(world,tile,id))return false;decorStoreState.tiles[world.level][id]=[...tile];refreshWorldDecor();return true;},
  decorCatalog(){return DECOR_CATALOG.map(item=>({id:item.id,tier:item.tier,kind:item.kind,footprint:item.footprint,loaded:Boolean(environmentImages[item.assetKey])}));},
  tableAction(styleId,action){return tableAction(styleId,action);},
  tableState(){return {owned:{...tableStoreState[world.level].owned},tables:world.tables.map(t=>({id:t.id,styleId:t.styleId,placed:t.placed,tile:[...t.tile]}))};},
  moveTable(id,tile){const table=world.tables.find(item=>item.id===id);if(!table?.placed||table.state!=='CLEAN'||table.reserved||!isValidTableTile(world,tile,id))return false;updateTableGeometry(table,tile);saveTableLayout(world);syncTableCollision(world.map,world.tables);return true;},
  upgradeStaffSlot(role){upgradeStaffSlot(role);return {...staffSlotState};},
  assignments(){return JSON.parse(JSON.stringify(assignmentState));},
  startVip(id){return startVipEvent(id);},vipAction(action){handleVipAction(action);return {active:vipState.active,stage:vipState.stage,history:[...vipState.history]};},vip(){return {active:vipState.active,stage:vipState.stage,history:[...vipState.history]};},
  tableCatalog(){return TABLE_CATALOG.map(item=>({id:item.id,loaded:Boolean(environmentImages[item.tableAssetKey])&&Boolean(environmentImages[item.stoolAssetKey])}));}
};

await Promise.all([loadCharacterAssets(),loadEnvironmentAssets(),loadDishAssets()]);await start('lv1',{running:false});setPhase('morning');renderGachaStatus();renderRecipeBook();renderUpgradePanel();renderDecorShop();
if(TEST_MODE||PREP_DEMO_MODE)await enterFullResourceRoom2();
requestAnimationFrame(frame);
