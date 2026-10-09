import {startExpedition} from './event-v3-expedition.js';
const TILE = 32;
const FIXED_STEP = 1 / 60;
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
const roomUpgradeState={
  room1:{floor:0,kitchen:0,waiting:0},
  room2:{floor:0,kitchen:0,waiting:0}
};
const RESTAURANT_UPGRADE_COST={coins:10000,arcIron:50};
const FULL_TEST_RESOURCES={coins:999999,arcIron:999};
const economyState={coins:0,arcIron:0,unlockedLv2:false};
const ROOM_CONFIG={
  room1:{mapId:'lv1',level:1,name:'Gian 1 · Quầy Nagazora',location:'NAGAZORA · GIAN 1 NGOÀI TRỜI',tables:3,kitchens:1},
  room2:{mapId:'lv2',level:2,name:'Gian 2 · Quán Heliopolis',location:'ARC CITY · GIAN 2 BÊN PHẢI',tables:6,kitchens:3,chefs:2}
};
const roomState={active:'room1',unlocked:new Set(['room1']),worlds:{room1:null,room2:null},selectedCharacterId:'senti',followCharacter:true,followClock:0};
let restaurantUpgradeBusy=false;
const staffSlotState={reception:1,server:1,chef:1,cleaner:1};
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
let world;
let activePhase = 'evening';
const phaseState={day:1,selectedMap:null,buyer:'senti',trips:0,stock:{},prepared:0,batches:0,cookStep:0,washes:0,blueprintParts:0};
let lastFrame = performance.now();
let accumulator = 0;
let toastClock = 0;
let rosterRenderKey = '';
const characterImages = {};
const environmentImages = {};

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

const keyOf = ([x,y]) => `${x},${y}`;
const sameTile = (a,b) => a && b && a[0] === b[0] && a[1] === b[1];
const manhattan = (a,b) => Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const seeded = (() => { let seed=0x51e17; return () => ((seed=Math.imul(seed,1664525)+1013904223|0)>>>0)/4294967296; })();
const roomIdForLevel=level=>level==='lv2'?'room2':'room1';
const cookStationsForMap=map=>map.stations.cooks||[map.stations.cook];

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
  if(saved)return saved.map(item=>updateTableGeometry({...item,state:'CLEAN',guestId:null,reserved:false},item.tile));
  const styleId=map.id==='lv1'?'basic':'polished';
  const layout=map.tables.map(template=>updateTableGeometry({id:template.id,styleId,placed:true,state:'CLEAN',guestId:null,reserved:false},[template.footprint[0],template.footprint[1]]));
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
    this.map=map; this.level=map.id; this.roomId=options.roomId||roomIdForLevel(map.id);this.roomLevel=ROOM_CONFIG[this.roomId]?.level||1;this.time=0; this.timeLeft=map.rushDuration; this.speed=options.speed||1; this.running=true;
    if(this.level==='lv2'){staffSlotState.chef=Math.max(staffSlotState.chef,2);gachaState.owned.add('yae');}
    this.debug=false; this.coins=economyState.coins; this.rep=50; this.stress=0; this.rage=0; this.atmosphere=0; this.revenue=0;
    this.jobs=[]; this.characters=[]; this.guests=[]; this.floorItems=[]; this.decor=[]; this.plates=[]; this.nextId=1;
    this.spawnClock=0; this.windClock=0; this.patrolClock=0; this.huaPatrolIndex=0; this.dozeClock=0; this.conflict=false;
    this.metrics={maxJobWait:0,maxGuestState:0,overlapSeconds:0,overlapPairs:{},slideViolations:0,slideDetails:{},jobStarvationViolations:0,completedJobs:0,served:0,angry:0};
    this.tables=initialTablesForMap(map);syncTableCollision(this.map,this.tables);
    this.assignments={reception:'rozaliya',server:'liliya',chef:'kiana',cleaner:'griseo',...(options.assignments||{})};
    this.receptionId=this.assignments.reception;
    this.addStaff('senti',map.stations.sentiSpawn);
    this.addStaff('fuhua',map.stations.fuHuaHome);
    for(const role of ['reception','server','chef','cleaner'])this.addRoleStaff(role);
    this.decor=decorForMap(map);syncDecorCollision(this.map,this.decor);
    this.spawnGuest(true);
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
    const primary=this.assignments[role],ids=[primary,...STAFF_BY_ROLE[role].filter(id=>id!==primary&&id!=='veliona'&&gachaState.owned.has(id))].slice(0,staffSlotState[role]);
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
    target=target||queue[queue.length-1];
    const id=`guest${this.nextId++}`;
    const archetype=GUEST_ARCHETYPES[Math.floor(seeded()*GUEST_ARCHETYPES.length)];
    const g=new Character(id,{...archetype,name:archetype.name,role:'guest',speed:3,work:1},this.map.stations.entrance,'guest');
    Object.assign(g,{guestState:this.conflict?'CONFUSED':'WALK_IN',stateAge:0,patience:100,queueTarget:target,order:null,tableId:null,eatLeft:0,done:false});
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
    this.time+=dt; this.timeLeft=Math.max(0,this.timeLeft-dt); if(this.timeLeft<=0) this.running=false;
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
        if(table){ table.reserved=true;g.tableId=table.id;this.addJob('SEAT','reception',this.map.stations.seatGreeting,'down',.6,2,{guestId:g.id,tableId:table.id}); }
      }
      if(g.guestState==='SEATED_WAITING'&&!this.jobForGuest(g)){
        if(phaseState.prepared>0){
          phaseState.prepared--;
          this.plates.push({guestId:g.id,tableId:g.tableId,bornAt:this.time,dish:'Bánh Bao Mưa'});
          this.addJob('SERVE','server',this.map.stations.passPickup,'up',.3,2,{guestId:g.id,tableId:g.tableId,dish:'Bánh Bao Mưa'});
        }else{
          const role=this.characters.some(c=>c.kind==='staff'&&c.role==='chef')?'chef':'senti';
          const cookStation=this.availableCookStation();
          if(cookStation)this.addJob('COOK',role,cookStation,'down',1.5,2,{guestId:g.id,tableId:g.tableId,dish:'Bánh Bao Mưa'});
        }
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
      c.anim='work_serve';job.workLeft-=dt;if(job.workLeft<=0){const g=this.guests.find(x=>x.id===job.payload.guestId);if(g){g.guestState='EATING';g.eatLeft=4;g.stateAge=0;}c.carry=null;this.complete(c,job,3);}
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
    if(job.type==='CLEAN_TABLE'&&table){table.state='CLEAN';table.reserved=false;table.guestId=null;this.complete(c,job,4);return;}
    if(job.type==='PICK_TRASH'){this.floorItems=this.floorItems.filter(i=>i.id!==job.payload.itemId);this.complete(c,job,2);return;}
    this.complete(c,job,3);
  }
  complete(c,job,stamina){job.done=true;c.jobId=null;c.state='IDLE';c.stamina=Math.max(0,c.stamina-stamina);this.metrics.completedJobs++;}
  cancelSeatJob(c,job,guest){job.done=true;c.jobId=null;c.state='IDLE';if(guest){guest.guestState='AT_FRONT';guest.stateAge=0;guest.tableId=null;}const table=this.tables.find(t=>t.id===job.payload.tableId);if(table)table.reserved=false;}
  payAndLeave(g){
    const table=this.tables.find(t=>t.id===g.tableId);if(table){table.state='DIRTY';table.reserved=false;table.guestId=null;}
    const pay=15+Math.round(15*(this.atmosphere<=-30?.25:this.atmosphere>=30?.08:.15));this.coins+=pay;economyState.coins=this.coins;this.revenue+=pay;this.metrics.served++;
    g.guestState='PAY_AND_LEAVE';g.stateAge=0;g.goTo(this.map.stations.entrance,this.map);
  }
  angryLeave(g){
    this.rep=Math.max(0,this.rep-3);this.stress=clamp(this.stress+5,0,100);this.metrics.angry++;
    const table=this.tables.find(t=>t.id===g.tableId);if(table){table.state='DIRTY';table.reserved=false;if(seeded()<.5)this.spawnTrash();}
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
  for(const table of w.tables.filter(table=>table.placed))drawables.push({sortY:(table.tile[1]+1)*TILE,draw:()=>drawDiningTable(table)});
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
  ctx.font='bold 7px ui-monospace';ctx.textAlign='left';ctx.fillStyle='#fff0d5';ctx.fillText('BẾP HELIOPOLIS · 3 TRẠM',48,44);
  ctx.fillStyle='#15283bcc';ctx.fillRect(322,34,286,15);
  ctx.fillStyle='#61d4da';ctx.fillRect(328,38,3,7);ctx.fillStyle='#d6fbfa';ctx.fillText('RỬA · PASS · KHO LẠNH',338,44);

  // Dining rug gives the second room its own spatial identity.
  ctx.fillStyle='#213e52aa';ctx.fillRect(48,144,544,144);
  ctx.strokeStyle='#e7bd6955';ctx.lineWidth=2;ctx.strokeRect(49,145,542,142);
  for(let x=64;x<592;x+=32){ctx.fillStyle='#e7bd6917';ctx.fillRect(x,151,2,130);}

  ctx.fillStyle='#102137';ctx.fillRect(0,384,640,32);
  ctx.fillStyle='#5fd8d9';ctx.fillRect(0,384,640,3);
  ctx.fillStyle='#ef74b7';ctx.fillRect(208,384,224,3);
  ctx.font='bold 8px ui-monospace';ctx.textAlign='right';ctx.fillStyle='#87e5e0';ctx.fillText('ARC CITY // GIAN 2',624,406);
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

function drawDiningTable(table){
  const style=TABLE_CATALOG.find(item=>item.id===table.styleId)||TABLE_CATALOG[0],x=table.tile[0]*TILE,y=(table.tile[1]+1)*TILE;
  const tableArt=environmentImages[style.tableAssetKey],stoolArt=environmentImages[style.stoolAssetKey];
  ctx.save();if(tablePlacementState.dragId===table.id)ctx.globalAlpha=.58;
  if(stoolArt)for(const stool of table.stools)ctx.drawImage(stoolArt,stool[0]*TILE-1,(stool[1]+1)*TILE-34,34,34);
  if(tableArt)ctx.drawImage(tableArt,x-11,y-58,86,58);else{ctx.fillStyle='#98643f';ctx.fillRect(x-8,y-42,80,38);}
  if(table.state==='DIRTY')drawDirtyDishes(x,y);
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
    ctx.font='7px ui-monospace';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(c.name,x,y+10);return;
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
  if(c.kind==='guest'&&c.guestState==='SEATED_WAITING')drawBubble(c,'🍽');
  ctx.font='7px ui-monospace';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(c.name,x,y+10);
}

function drawPassPlate(plate,w){
  const age=w.time-plate.bornAt,pop=age<.55?Math.sin(Math.PI*age/.55)*10:0;
  const index=Math.max(0,w.plates.indexOf(plate));const x=177+(index%2)*18,y=113-pop;
  ctx.save();ctx.lineWidth=2;ctx.strokeStyle='#30203a';ctx.fillStyle='#f7f0dc';ctx.beginPath();ctx.ellipse(x,y,10,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#ed7451';ctx.fillRect(x-5,y-5,10,4);ctx.fillStyle='#7fc36a';ctx.fillRect(x+1,y-7,4,3);
  if(age<.65){ctx.fillStyle='#ffe777';ctx.fillRect(x-15,y-12,3,3);ctx.fillRect(x+13,y-15,3,3);}
  ctx.strokeStyle='#ffffffaa';ctx.beginPath();ctx.moveTo(x-3,y-9);ctx.lineTo(x-5,y-14);ctx.moveTo(x+3,y-9);ctx.lineTo(x+5,y-15);ctx.stroke();ctx.restore();
}

function drawCarry(c,x,y,behind){
  const side=c.facing==='right'?13:c.facing==='left'?-13:0;
  const trayY=y+(c.facing==='up'?-36:-25)+(Math.floor(c.animTime*8)%2?-1:0);
  const trayX=x+side;ctx.save();ctx.lineWidth=2;ctx.strokeStyle='#291c34';ctx.fillStyle='#70483f';ctx.fillRect(trayX-11,trayY,22,5);ctx.strokeRect(trayX-11,trayY,22,5);
  ctx.fillStyle='#fff2d1';ctx.beginPath();ctx.ellipse(trayX,trayY-2,8,3,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#ef7252';ctx.fillRect(trayX-4,trayY-6,8,3);
  if(!behind){ctx.strokeStyle='#ffffffbb';ctx.beginPath();ctx.moveTo(trayX-3,trayY-8);ctx.lineTo(trayX-5,trayY-13);ctx.moveTo(trayX+3,trayY-8);ctx.lineTo(trayX+5,trayY-14);ctx.stroke();}
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

function drawBubble(c,text){const x=Math.round(c.px),y=Math.round(c.py)-66;ctx.font='bold 8px ui-monospace';const width=ctx.measureText(text).width+10;ctx.fillStyle='#fff';ctx.fillRect(x-width/2,y-9,width,14);ctx.fillStyle='#21182e';ctx.textAlign='center';ctx.fillText(text,x,y+1);}
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
  if(world){drawWorld(world);renderUI();centerSelectedCharacter();}requestAnimationFrame(frame);
}

function currentAssignments(){return {reception:ui['reception-select']?.value||'rozaliya',server:ui['server-select']?.value||'liliya',chef:ui['chef-select']?.value||'kiana',cleaner:ui['cleaner-select']?.value||'griseo'};}
async function start(level='lv1',options={}){
  const roomId=options.roomId||roomIdForLevel(level);
  world=new World(await loadMap(level),{...options,roomId,assignments:options.assignments||currentAssignments()});
  roomState.active=roomId;roomState.worlds[roomId]=world;rosterRenderKey='';window.__TAIXUAN_WORLD__=world;
  renderDecorShop();renderTableShop();renderStaffSlots();renderUpgradePanel();requestAnimationFrame(()=>centerSelectedCharacter(true));
}
async function switchRoom(roomId,{debug=false}={}){
  if(!ROOM_CONFIG[roomId])return false;
  if(!debug&&!roomState.unlocked.has(roomId)){showToast('Gian 2 đang khóa. Cần đủ 10.000 Xu và 50 Sắt Arc City để mở.');return false;}
  const cached=roomState.worlds[roomId];
  if(cached){world=cached;world.coins=economyState.coins;roomState.active=roomId;rosterRenderKey='';window.__TAIXUAN_WORLD__=world;renderDecorShop();renderTableShop();renderStaffSlots();renderUpgradePanel();requestAnimationFrame(()=>centerSelectedCharacter(true));return true;}
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
  if(duplicate)gachaState.shards[card.id]=(gachaState.shards[card.id]||0)+1;else{gachaState.owned.add(card.id);world?.fillOpenStaffSlots();renderStaffSlots();}
  return {...card,duplicate};
}

function renderGachaStatus(){
  if(ui['pity-s'])ui['pity-s'].textContent=`${gachaState.sinceS}/10`;
  if(ui['pity-ssr'])ui['pity-ssr'].textContent=`${gachaState.sinceSSR}/50`;
  if(ui['gacha-collection']){
    const shards=Object.values(gachaState.shards).reduce((sum,value)=>sum+value,0);
    ui['gacha-collection'].innerHTML=`<span>Bộ sưu tập nhân sự</span><b>${gachaState.owned.size}/${GACHA_POOL.length}</b><span>✦ Mảnh ${shards}</span>`;
  }
  if(ui['staff-codex'])ui['staff-codex'].innerHTML=GACHA_POOL.map(card=>`<button class="staff-codex-card rank-${card.rank}" data-codex-id="${card.id}"><span style="background-image:url('${card.art}')"></span><b>${card.name}</b><small>${card.role}</small><em>${card.rank}</em></button>`).join('');
  renderStaffDorm();
}

function renderStaffDorm(){
  if(!ui['staff-dorm-list'])return;
  const owned=GACHA_POOL.filter(card=>gachaState.owned.has(card.id));
  if(!owned.length){ui['staff-dorm-list'].innerHTML='<div class="empty-state">Chưa có nhân viên để vào KTX.</div>';return;}
  ui['staff-dorm-list'].innerHTML=owned.map(card=>{
    const shards=gachaState.shards[card.id]||0,training=gachaState.training[card.id]||0;
    return `<article class="staff-dorm-card rank-${card.rank}" data-dorm-id="${card.id}"><div class="staff-dorm-art" style="background-image:url('${card.art}')"><em>${card.rank}</em></div><div class="staff-dorm-copy"><span>${card.role}</span><b>${card.name}</b><small>${card.skill}</small><p><i>✦ Mảnh ${shards}</i><strong>Bậc thử ${training}</strong></p>${training?'<small class="staff-dorm-bonus">Kỹ năng ↑ · Tật xấu ↓ (xem trước)</small>':''}</div><button data-staff-train="${card.id}">NÂNG THỬ</button></article>`;
  }).join('');
}

function previewTrainStaff(id){
  const card=GACHA_POOL.find(entry=>entry.id===id);
  if(!card||!gachaState.owned.has(id)){showToast('Cần chiêu mộ nhân viên trước khi vào KTX.');return false;}
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
    ui['room-upgrade-list'].innerHTML=items.map(([id,icon,name,copy])=>`<article class="room-upgrade-item ${state[id]?'is-upgraded':''}"><span>${icon}</span><div><b>${name}</b><small>${copy}</small></div><button data-room-upgrade="${id}" ${state[id]?'disabled':''}>${state[id]?'ĐÃ NÂNG':'NÂNG THỬ'}</button></article>`).join('');
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
  Object.values(roomState.worlds).filter(Boolean).forEach(roomWorld=>roomWorld.coins=economyState.coins);
  await start('lv2',{roomId:'room2',speed:world?.speed||1});
  roomState.selectedCharacterId='kiana';roomState.followCharacter=true;rosterRenderKey='';
  setPhase('evening');renderGachaStatus();renderUpgradePanel();renderDecorShop();renderTableShop();renderStaffSlots();
  if(ui['full-test-room2']){ui['full-test-room2'].classList.add('active');ui['full-test-room2'].textContent='✓ GIAN 2 · FULL TÀI NGUYÊN';}
  showToast('Bản test đã mở Gian 2: 999.999 Xu, 999 Sắt, mở toàn bộ nhân sự và nội thất trong kho.');
  return {wallet:{...economyState},room:roomState.active,staff:[...gachaState.owned],decor:[...decorStoreState.owned]};
}

function renderStaffSlots(){
  if(!ui['staff-slot-list'])return;
  ui['staff-slot-list'].innerHTML=['reception','server','chef','cleaner'].map(role=>{
    const max=STAFF_BY_ROLE[role].filter(id=>id!=='veliona').length,capacity=staffSlotState[role];
    const active=world?.characters.filter(c=>c.kind==='staff'&&c.role===role).length||0;
    const locked=world?.level==='lv1'&&['chef','cleaner'].includes(role);
    return `<article class="staff-slot-row"><div><b>${ROLE_LABEL[role]}</b><small>${locked?'Mở ở Lv.2':`${active}/${capacity} người đang làm`} · tối đa ${max} vị trí</small></div><button data-staff-slot="${role}" ${capacity>=max?'disabled':''}>${capacity>=max?'ĐÃ ĐỦ':`MỞ Ô ${capacity+1}`}</button></article>`;
  }).join('');
}

function upgradeStaffSlot(role){
  const max=STAFF_BY_ROLE[role]?.filter(id=>id!=='veliona').length||0;
  if(!max||staffSlotState[role]>=max)return;
  staffSlotState[role]++;
  world.fillOpenStaffSlots();renderStaffSlots();
  showToast(`Đã mở ${staffSlotState[role]} vị trí ${ROLE_LABEL[role]}. Nhân viên đã chiêu mộ sẽ vào ca.`);
}

function tablePlacedCount(styleId){return world.tables.filter(table=>table.placed&&table.styleId===styleId).length;}
function renderTableShop(){
  if(!ui['table-shop']||!world)return;
  const state=tableStoreState[world.level],capacity=world.map.tables.length;
  ui['table-capacity'].textContent=`${world.tables.filter(table=>table.placed).length}/${capacity} bàn đang đặt`;
  ui['table-shop'].innerHTML=TABLE_CATALOG.map(item=>{
    const owned=state.owned[item.id],placed=tablePlacedCount(item.id),stored=owned-placed;
    return `<article class="table-shop-card" data-table-style="${item.id}"><img src="${ENVIRONMENT_ASSETS[item.tableAssetKey]}" alt="${item.name}"><div class="table-shop-info"><strong>${item.name}</strong><small>CẤP ${item.level} · ${item.description}</small><span>Sở hữu ${owned} · Đang đặt ${placed} · Trong kho ${stored}</span></div><div class="table-shop-actions"><button data-table-action="buy">MUA THỬ</button><button data-table-action="place" ${stored<=0?'disabled':''}>ĐẶT</button><button data-table-action="store" ${placed<=0?'disabled':''}>CẤT 1</button></div></article>`;
  }).join('');
  ui['table-edit-toggle'].classList.toggle('active',tablePlacementState.active);
  ui['table-edit-toggle'].textContent=tablePlacementState.active?'XONG DI CHUYỂN':'DI CHUYỂN BÀN';
}

function tableAction(styleId,action){
  const state=tableStoreState[world.level],style=TABLE_CATALOG.find(item=>item.id===styleId);if(!style)return false;
  if(action==='buy'){state.owned[styleId]++;showToast(`Đã mua thử ${style.name}.`);renderTableShop();return true;}
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
    const action=placed?'CẤT ĐI':owned?'ĐẶT VÀO QUÁN':item.tier==='rare'?'CHẾ THỬ · 5 MẢNH':'MUA THỬ · 0 XU';
    return `<article class="decor-shop-card ${placed?'is-placed':''} tier-${item.tier} kind-${item.kind}" data-decor-id="${item.id}"><div class="decor-shop-art" style="background-image:url('${item.art}')"></div><div><span>${item.system}</span>${item.tier==='rare'?'<em>HIẾM</em>':''}<b>${item.name}</b><small>${item.effect}</small></div><button>${action}</button></article>`;
  }).join('');
  if(ui['decor-capacity'])ui['decor-capacity'].textContent=`${decorStoreState.placed.length}/${capacity} món đang đặt`;
  if(ui['decor-edit-toggle']){ui['decor-edit-toggle'].classList.toggle('active',decorPlacementState.active);ui['decor-edit-toggle'].textContent=decorPlacementState.active?'XONG BỐ TRÍ':'TỰ CHỈNH VỊ TRÍ';}
}

function toggleDecorItem(id){
  const item=DECOR_CATALOG.find(entry=>entry.id===id);if(!item)return;
  if(!decorStoreState.owned.has(id)){decorStoreState.owned.add(id);showToast(item.tier==='rare'?`Đã chế thử ${item.name}.`:`Đã mua thử ${item.name}.`);}
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
  return `<article class="gacha-result-card rank-${card.rank}" tabindex="0" data-gacha-id="${card.id}" style="--delay:${index*.05}s"><i class="gacha-beam"></i>${card.duplicate?'':`<span class="gacha-new">NEW</span>`}${art}<div class="gacha-card-copy"><b>${card.name}</b><small>${card.role}</small><strong class="gacha-rank-hero">${card.rank}</strong><small class="gacha-skill-line">${card.skill}</small><small class="${card.duplicate?'gacha-duplicate':''}">${card.duplicate?'Trùng → +1 Mảnh Đột Phá':'Đã vào bộ sưu tập'}</small></div></article>`;
}

function showGachaDetail(card){
  if(!card||!ui['gacha-detail'])return;
  ui['gacha-detail'].hidden=false;
  ui['gacha-detail'].className=`gacha-detail rank-${card.rank}`;
  ui['gacha-detail'].innerHTML=`<div class="gacha-detail-art" style="background-image:url('${card.art}')"></div><div><span class="gacha-detail-rank">${card.rank}</span><h3>${card.name}</h3><p>${card.role} · Tốc độ ${card.speed} · Hiệu suất ${card.work}</p><b>KỸ NĂNG</b><p>${card.skill}</p><b>ĐẶC TÍNH</b><p>${card.quirk}</p></div>`;
}

function showGachaResults(results){
  gachaState.lastResults=results;
  if(!ui['gacha-results']||!ui['gacha-modal'])return;
  ui['gacha-results'].classList.toggle('single',results.length===1);
  ui['gacha-results'].innerHTML=results.map(gachaCardTemplate).join('');
  showGachaDetail([...results].sort((a,b)=>Object.keys(GACHA_RANKS).indexOf(b.rank)-Object.keys(GACHA_RANKS).indexOf(a.rank))[0]);
  ui['gacha-modal'].hidden=false;
  renderGachaStatus();
}

function pullGacha(_count=1,instant=false){
  if(gachaState.busy||!ui['gacha-machine'])return Promise.resolve([]);
  gachaState.busy=true;ui['gacha-machine'].classList.add('is-spinning');
  ui['gacha-one'].disabled=true;
  return new Promise(resolve=>setTimeout(()=>{
    const results=[pullGachaCard()];
    ui['gacha-machine'].classList.remove('is-spinning');ui['gacha-one'].disabled=false;
    gachaState.busy=false;showGachaResults(results);resolve(results);
  },instant?0:900));
}

canvas.addEventListener('click',event=>{
  if(decorPlacementState.active||tablePlacementState.active)return;
  const rect=canvas.getBoundingClientRect(),x=Math.floor((event.clientX-rect.left)*canvas.width/rect.width/TILE),y=Math.floor((event.clientY-rect.top)*canvas.height/rect.height/TILE);
  if(x>=0&&x<world.map.rows[0].length&&y>=0&&y<world.map.rows.length&&isTileWalkable(world.map,x,y))world.sentiActionAt([x,y]);
});
canvas.addEventListener('pointerdown',beginDecorDrag);canvas.addEventListener('pointermove',moveDecorDrag);canvas.addEventListener('pointerup',endDecorDrag);canvas.addEventListener('pointercancel',endDecorDrag);
canvas.addEventListener('pointerdown',beginTableDrag);canvas.addEventListener('pointermove',moveTableDrag);canvas.addEventListener('pointerup',endTableDrag);canvas.addEventListener('pointercancel',endTableDrag);
document.addEventListener('keydown',event=>{if(event.key.toLowerCase()==='g'){world.debug=!world.debug;if(ui['debug-drawer'])ui['debug-drawer'].hidden=!world.debug;showToast(`Debug ${world.debug?'BẬT':'TẮT'}`);}});
document.querySelectorAll('.staff-assignment').forEach(select=>select.addEventListener('change',()=>start(world.level,{roomId:world.roomId,speed:world.speed})));
document.querySelectorAll('[data-room]').forEach(button=>button.addEventListener('click',()=>switchRoom(button.dataset.room)));
if(ui.roster)ui.roster.addEventListener('click',event=>{const card=event.target.closest('[data-follow-staff]');if(!card)return;roomState.selectedCharacterId=card.dataset.followStaff;roomState.followCharacter=true;renderRoomNavigation();centerSelectedCharacter(true);showToast(`Camera đang theo ${world.staff(roomState.selectedCharacterId)?.name||'nhân viên'}.`);});
if(ui['camera-follow'])ui['camera-follow'].addEventListener('click',()=>{roomState.followCharacter=!roomState.followCharacter;renderRoomNavigation();if(roomState.followCharacter)centerSelectedCharacter(true);showToast(`Camera theo nhân vật: ${roomState.followCharacter?'BẬT':'TẮT'}.`);});
ui['spawn-btn'].addEventListener('click',()=>world.spawnGuest(true));
ui['doze-btn'].addEventListener('click',()=>world.forceDoze());
ui['conflict-btn'].addEventListener('click',()=>world.toggleConflict());
ui['level-btn'].addEventListener('click',async()=>{const target=world.roomId==='room1'?'room2':'room1';await switchRoom(target,{debug:true});ui['level-btn'].textContent=target==='room1'?'Nhảy Gian 2 debug':'Về Gian 1 debug';});
ui['speed-btn'].addEventListener('click',()=>{world.speed=world.speed===1?10:1;ui['speed-btn'].textContent=`Tốc độ ×${world.speed}`;});
ui['horn-btn'].addEventListener('click',()=>{if(world.rage<35){showToast('Cần 35 Nộ.');return;}world.rage-=35;world.stress=clamp(world.stress+18,0,100);world.characters.filter(c=>c.kind==='staff').forEach(c=>c.stamina=100);showToast('YATTA! Toàn đội đầy Stamina.');});
ui['tea-btn'].addEventListener('click',()=>{world.stress=clamp(world.stress-38,0,100);showToast('Fu Hua mỉm cười. Stress −38.');});
ui['chase-btn'].addEventListener('click',()=>showToast('Greybox: click khách để đuổi sẽ nối ở pass tương tác.'));
if(ui['gacha-one'])ui['gacha-one'].addEventListener('click',()=>pullGacha(1));
if(ui['gacha-again'])ui['gacha-again'].addEventListener('click',()=>{ui['gacha-modal'].hidden=true;pullGacha(1);});
if(ui['gacha-close'])ui['gacha-close'].addEventListener('click',()=>{ui['gacha-modal'].hidden=true;});
if(ui['gacha-results'])ui['gacha-results'].addEventListener('click',event=>{const cardEl=event.target.closest('[data-gacha-id]');if(cardEl)showGachaDetail(GACHA_POOL.find(card=>card.id===cardEl.dataset.gachaId));});
if(ui['staff-codex'])ui['staff-codex'].addEventListener('click',event=>{const cardEl=event.target.closest('[data-codex-id]');if(!cardEl)return;const card=GACHA_POOL.find(entry=>entry.id===cardEl.dataset.codexId);showGachaResults([{...card,duplicate:gachaState.owned.has(card.id)}]);});
document.querySelectorAll('[data-staff-mode]').forEach(button=>button.addEventListener('click',()=>setStaffMode(button.dataset.staffMode)));
if(ui['staff-dorm-list'])ui['staff-dorm-list'].addEventListener('click',event=>{const button=event.target.closest('[data-staff-train]');if(button)previewTrainStaff(button.dataset.staffTrain);});
if(ui['gacha-modal'])ui['gacha-modal'].addEventListener('click',event=>{if(event.target===ui['gacha-modal'])ui['gacha-modal'].hidden=true;});
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
  morning:{kicker:'01 · BUỔI SÁNG',title:'Thu mua nguyên liệu',copy:'Chọn khu vực và người đi, vào event run để nhặt nguyên liệu. Mang hàng về quán mới có thể nấu.'},
  afternoon:{kicker:'02 · BUỔI CHIỀU',title:'Chuẩn bị món',copy:'Làm ba thao tác Thái → Xào → Hầm để nấu một mẻ. Một mẻ dùng 2 nguyên liệu và cho 3 phần vào Tủ Giữ Ấm.'},
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
function phaseDetail(text,actions=''){return `<div class="phase-choice-detail"><p>${text}</p>${actions}</div>`;}
function renderPhaseScreen(){
  if(activePhase==='morning'){
    const buyers=[['senti','Senti tự đi'],...['pardofelis','sushang'].filter(id=>gachaState.owned.has(id)).map(id=>[id,STAFF[id].name])];
    ui['phase-screen'].innerHTML=`<div class="expedition-picker"><label>Người thu mua <select id="phase-buyer" ${phaseState.trips?'disabled':''}>${buyers.map(([id,name])=>`<option value="${id}" ${phaseState.buyer===id?'selected':''}>${name}</option>`).join('')}</select></label><span>${phaseState.trips?'Hôm nay đã thu mua xong.':'Chọn khu là vào event run ngay · A/D di chuyển · Space nhảy'}</span></div><div class="phase-screen-grid">${SUPPLY_MAPS.map(map=>`<article class="phase-screen-card ${phaseState.selectedMap===map.id?'is-selected':''}" style="--map-art:url('assets/event-demo/maps/${map.id==='arc'?'arc-city':map.id}.png')"><div class="phase-icon">${map.icon}</div><h3>${map.name}</h3><p>${map.description}</p><button type="button" data-supply-map="${map.id}" ${phaseState.trips?'disabled':''}>${phaseState.trips?'ĐÃ THU MUA':'CHỌN · VÀO RUN'}</button></article>`).join('')}</div>${phaseDetail(`Kho: ${stockText()}${economyState.arcIron?` · Sắt Arc City ×${economyState.arcIron}`:''}`,`<button type="button" data-phase-next="afternoon">SANG BUỔI CHIỀU →</button>`)}`;
    return;
  }
  if(activePhase==='afternoon'){
    const steps=[['🔪','THÁI','1. Sơ chế nguyên liệu'],['🍳','XÀO','2. Canh lửa và đảo chảo'],['♨','HẦM','3. Hoàn thành mẻ'],['🧺','TỦ GIỮ ẤM',`${phaseState.prepared} phần đã nấu`]];
    ui['phase-screen'].innerHTML=`<div class="phase-screen-grid">${steps.map((step,index)=>`<article class="phase-screen-card ${index===phaseState.cookStep?'is-selected':''}"><div class="phase-icon">${step[0]}</div><h3>${step[1]}</h3><p>${step[2]}</p><button type="button" data-cook-step="${index}">${index===3?'XEM TỦ':'THỰC HIỆN'}</button></article>`).join('')}</div>${phaseDetail(`Mẻ ${phaseState.batches}/3 · Bước kế tiếp: <b>${steps[phaseState.cookStep][1]}</b> · Tủ giữ ấm: <b>${phaseState.prepared} phần</b>.<br>Kho: ${stockText()}`,`<button type="button" data-phase-next="evening">MỞ QUÁN BUỔI TỐI →</button>`)}`;
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
function cookStep(index){
  if(index===3){showToast(`Tủ giữ ấm đang có ${phaseState.prepared} phần.`);return;}
  if(index!==phaseState.cookStep){showToast('Làm theo thứ tự: THÁI → XÀO → HẦM.');return;}
  if(phaseState.batches>=3){showToast('Buổi chiều chỉ nấu tối đa 3 mẻ.');return;}
  if(Object.values(phaseState.stock).reduce((sum,count)=>sum+count,0)<2){showToast('Kho thiếu nguyên liệu. Thu mua buổi sáng trước.');return;}
  phaseState.cookStep++;
  if(phaseState.cookStep===3){let needed=2;for(const item of Object.keys(phaseState.stock)){const used=Math.min(needed,phaseState.stock[item]);phaseState.stock[item]-=used;needed-=used;if(!needed)break;}phaseState.prepared+=3;phaseState.batches++;phaseState.cookStep=0;showToast('Mẻ đã hoàn thành · +3 phần trong Tủ Giữ Ấm.');}
  else showToast(`Đã làm bước ${index+1}/3. Tiếp tục ${['THÁI','XÀO','HẦM'][phaseState.cookStep]}.`);
  renderPhaseScreen();
}
function openPanel(name){document.querySelector(`[data-panel="${name}"]`)?.click();document.querySelector('.control-column')?.scrollIntoView({behavior:'smooth',block:'nearest'});}
async function nextDay(){phaseState.day++;phaseState.trips=0;phaseState.batches=0;phaseState.cookStep=0;phaseState.washes=0;phaseState.selectedMap=null;await start(world.level,{roomId:world.roomId,speed:world.speed});setPhase('morning');showToast(`Ngày ${phaseState.day} bắt đầu. Chọn khu vực thu mua.`);}

function setPhase(phase){
  if(currentExpedition&&phase!=='morning'){showToast('Hoàn thành lượt chạy hoặc bấm VỀ CHỌN KHU trước.');return;}
  if(currentExpedition&&phase==='morning')return;
  activePhase=phase;
  if(!ui['phase-screen'])return;
  document.querySelectorAll('[data-phase]').forEach(b=>b.classList.toggle('active',b.dataset.phase===phase));
  const canvasVisible=phase==='evening';ui['canvas-wrap'].hidden=!canvasVisible;ui['phase-screen'].hidden=canvasVisible;
  if(canvasVisible){ui['phase-kicker'].textContent='03 · BUỔI TỐI';ui['phase-title'].textContent='Rush Hour mở quán';ui['phase-copy'].textContent='Nhân viên tự nhận job, đi bộ tới đúng trạm rồi mới làm việc. Bấm trực tiếp trong quán để điều khiển Senti.';return;}
  const data=PHASE_CONTENT[phase];ui['phase-kicker'].textContent=data.kicker;ui['phase-title'].textContent=data.title;ui['phase-copy'].textContent=data.copy;
  document.querySelector('.day-chip b').textContent=String(phaseState.day).padStart(2,'0');
  ui['phase-objectives'].innerHTML=(phase==='morning'?['Chọn một trong bốn khu vực','A/D di chuyển · Space nhảy','Nhặt ít nhất 3 nguyên liệu và tới cổng về']:phase==='afternoon'?['Thu mua đủ nguyên liệu trước','Bấm THÁI → XÀO → HẦM','Mỗi mẻ cho 3 phần vào Tủ Giữ Ấm']:['Xem kết quả ca và rửa bát','Quản lý nhân viên hoặc nâng quán','Bấm SANG NGÀY MỚI để thu mua tiếp']).map(item=>`<div>✓ ${item}</div>`).join('');
  renderPhaseScreen();
}

ui['phase-screen'].addEventListener('click',async event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.supplyMap){if(phaseState.trips)return;phaseState.selectedMap=button.dataset.supplyMap;dispatchSupply();return;}
  if(button.hasAttribute('data-dispatch-supply')){dispatchSupply();return;}
  if(button.dataset.phaseNext){setPhase(button.dataset.phaseNext);return;}
  if(button.dataset.cookStep!==undefined){cookStep(Number(button.dataset.cookStep));return;}
  if(button.hasAttribute('data-next-day')){await nextDay();return;}
  if(button.dataset.nightAction==='summary'){renderPhaseScreen();showToast(`Tổng kết: ${world.metrics.served} khách · ${world.revenue} Xu.`);return;}
  if(button.dataset.nightAction==='wash'){if(phaseState.washes)return;phaseState.washes=1;phaseState.blueprintParts++;showToast(`Đã rửa bát · Mảnh Bản Vẽ ×${phaseState.blueprintParts}.`);renderPhaseScreen();return;}
  if(button.dataset.nightAction==='staff'){openPanel('staff');return;}
  if(button.dataset.nightAction==='upgrade')openPanel('decor');
});
ui['phase-screen'].addEventListener('change',event=>{if(event.target.id==='phase-buyer')phaseState.buyer=event.target.value;});

document.querySelectorAll('[data-phase]').forEach(button=>button.addEventListener('click',()=>setPhase(button.dataset.phase)));
document.querySelectorAll('[data-phase-jump]').forEach(button=>button.addEventListener('click',()=>setPhase(button.dataset.phaseJump)));
document.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('active',b===button));
  document.querySelectorAll('[data-panel-view]').forEach(view=>view.classList.toggle('active',view.dataset.panelView===button.dataset.panel));
}));
if(ui['feature-tour'])ui['feature-tour'].addEventListener('click',()=>showToast('Sáng thu mua → Chiều nấu mẻ → Tối Rush Canvas → Khuya tổng kết.'));

window.__TAIXUAN_QA__={
  phase(){return {active:activePhase,day:phaseState.day,selectedMap:phaseState.selectedMap,buyer:phaseState.buyer,trips:phaseState.trips,stock:{...phaseState.stock},prepared:phaseState.prepared,batches:phaseState.batches,cookStep:phaseState.cookStep,washes:phaseState.washes,blueprintParts:phaseState.blueprintParts,run:currentExpedition?.snapshot()||null};},
  async reset(level='lv1',speed=10){await start(level,{speed});return true;},
  snapshot(){return {level:world.level,roomId:world.roomId,roomLevel:world.roomLevel,kitchenSlots:cookStationsForMap(world.map).length,time:world.time,timeLeft:world.timeLeft,assets:Object.keys(characterImages),jobs:world.jobs.map(j=>({...j})),guests:world.guests.map(g=>({id:g.id,state:g.guestState,stateAge:g.stateAge,done:g.done,tile:g.tile,tableId:g.tableId})),staff:world.characters.filter(c=>c.kind==='staff').map(c=>({id:c.id,role:c.role,state:c.state,tile:c.tile,anim:c.anim,path:c.path,carry:Boolean(c.carry)})),tables:world.tables.map(t=>({id:t.id,styleId:t.styleId,placed:t.placed,tile:t.tile,state:t.state,reserved:t.reserved})),staffSlots:{...staffSlotState},metrics:{...world.metrics},conflict:world.conflict};},
  forceDoze(){world.forceDoze();},toggleConflict(){world.toggleConflict();},spawn(){world.spawnGuest(true);},toggleDebug(){world.debug=!world.debug;},
  setReception(id){ui['reception-select'].value=id;return start(world.level,{roomId:world.roomId,speed:world.speed});},
  setAssignments(assignments){for(const [role,id] of Object.entries(assignments)){const select=ui[`${role}-select`];if(select)select.value=id;}return start(world.level,{roomId:world.roomId,speed:world.speed});},
  pullGacha(){return pullGacha(1,true);},
  previewGacha(ids){const wanted=(ids||GACHA_POOL.map(card=>card.id)).map(id=>GACHA_POOL.find(card=>card.id===id)).filter(Boolean).map(card=>({...card,duplicate:false}));showGachaResults(wanted);return wanted;},
  gachaPool(){return GACHA_POOL.map(card=>({...card,loaded:Boolean(characterImages[card.id])}));},
  gacha(){return {pulls:gachaState.pulls,sinceS:gachaState.sinceS,sinceSSR:gachaState.sinceSSR,owned:[...gachaState.owned],shards:{...gachaState.shards},training:{...gachaState.training},lastResults:gachaState.lastResults};},
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
  tableCatalog(){return TABLE_CATALOG.map(item=>({id:item.id,loaded:Boolean(environmentImages[item.tableAssetKey])&&Boolean(environmentImages[item.stoolAssetKey])}));}
};

await Promise.all([loadCharacterAssets(),loadEnvironmentAssets()]);await start('lv1');setPhase('evening');renderGachaStatus();renderUpgradePanel();renderDecorShop();
if(new URLSearchParams(location.search).get('test')==='full')await enterFullResourceRoom2();
requestAnimationFrame(frame);
