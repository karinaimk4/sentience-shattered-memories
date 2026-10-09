// Authored Story obstacles. Endless generation deliberately remains unchanged.
export const WEATHER=[
 {id:'hail-street',kind:'hail',from:230,to:300,title:'MƯA ĐÁ',hint:'Hai điểm rơi mỗi đợt · Đổi nhịp chạy hoặc L né'},
 {id:'hail-roofs',kind:'hail',from:540,to:610,title:'MƯA ĐÁ TRÊN MÁI',hint:'Quan sát vệt sáng · Đừng lao thẳng mãi'},
 {id:'snow-memory',kind:'snow',from:965,to:1018,title:'BÃO TUYẾT KÝ ỨC',hint:'Giữ S khi gió mạnh · Tiến lên giữa các đợt'},
 {id:'snow-crossing',kind:'snow',from:1172,to:1215,title:'GIÓ LẠNH DỒN ĐỢT',hint:'Giữ S để chống gió và mảnh băng'},
 {id:'hail-loop',kind:'hail',from:1395,to:1470,title:'MƯA ĐÁ RẠN VỠ',hint:'Hai đợt băng nối tiếp · L né khỏi vùng sáng'}
];
export const WEATHER_ARC=[
 {id:'arc-rain',kind:'neon',from:2000,to:2460,title:'MƯA NEON ARC CITY',hint:'Biển hiệu có thể rơi · Quan sát vùng cảnh báo'},
 {id:'arc-sky',kind:'neon',from:2460,to:2630,title:'MƯA TRÊN KHÔNG',hint:'Bầy quái bay · Dùng Thương đánh tầm cao'},
 {id:'heliopolis-steam',kind:'steam',from:2630,to:2890,title:'ĐƯỜNG HẦM HELIOPOLIS',hint:'Hơi nóng và laser theo nhịp đèn'},
 {id:'train-wind',kind:'wind',from:2890,to:3240,title:'GIÓ TRÊN NÓC TÀU',hint:'L né/dash để giữ đà · Space vượt thùng hàng'}
];
export function safeGround(world,x,margin=70){return !world.gaps.some(g=>x>g.x-margin&&x<g.x+g.w+margin)&&!world.platforms.some(p=>!p.destroyed&&x>p.x-margin&&x<p.x+p.w+margin);}
export function findGround(world,x,level,margin=70){for(let delta=0;delta<=1100;delta+=32){for(const direction of delta?[1,-1]:[1]){const px=x+delta*direction;if(px<640||!safeGround(world,px,margin))continue;if(level.arenas.some(a=>px>a.m*64-350&&px<a.m*64+1250)||level.checkpoints.some(m=>Math.abs(px-m*64)<240)||(level.investigations||[]).some(c=>Math.abs(px-c.m*64)<150)||(level.nodes||[]).some(n=>Math.abs(px-n.m*64)<280))continue;return px;}}return null;}
export function configureEnvironment(world,level){
 if(level.chapter>=3){
  world.weather=(level.weather||[]).map(z=>({...z}));world.vents=[];world.pickups=[];world.salvage=[];world.chapterHazards=[];
  for(const [i,cache] of (level.salvage||[]).entries()){const x=findGround(world,cache.m*64,level,85);if(x!==null)world.salvage.push({id:cache.id||`salvage-ch${level.chapter}-${i}`,x,y:level.physics.groundY});}
  const heals=level.chapter===3?[3260,3410,3600,3760,3930,4110,4230]:level.chapter===4?[4410,4560,4740,4920,5100,5280,5390]:level.chapter===5?[5550,5700,5890,6080,6250,6430,6520]:level.chapter===6?[6670,6810,6990,7180,7360,7520,7670]:[7810,7970,8150,8320,8500,8680,8840];
  for(const [i,m] of heals.entries()){const x=findGround(world,m*64,level,85);if(x!==null)world.pickups.push({id:`heal-ch${level.chapter}-${i}`,x,y:level.physics.groundY-32,amount:.25});}
  if(level.chapter===3){for(const [i,m] of [3320,3390,3485,3670,3970,4150].entries()){const x=findGround(world,m*64,level,110);if(x!==null)world.chapterHazards.push({id:`lab-drip-${i}`,kind:'lab-drip',x,offset:i*.78});}}
  if(level.chapter===4){for(const [i,m] of [4440,4515,4780,5015,5140,5350].entries()){const x=findGround(world,m*64,level,110);if(x!==null)world.chapterHazards.push({id:`ice-spike-${i}`,kind:'ice-spike',x,offset:i*.83});}}
  if(level.chapter===5){for(const [i,m] of [5580,5660,5860,6040,6250,6470].entries()){const x=findGround(world,m*64,level,115);if(x!==null)world.chapterHazards.push({id:`palm-wave-${i}`,kind:'palm-wave',x,offset:i*.91});}}
  if(level.chapter===7){for(const [i,m] of [7820,7925,8240,8390,8580,8780].entries()){const x=findGround(world,m*64,level,115);if(x!==null)world.chapterHazards.push({id:`memory-seam-${i}`,kind:'palm-wave',x,offset:i*.73});}}
  return world;
 }
 if(level.chapter===2){
  world.weather=WEATHER_ARC.map(z=>({...z}));world.vents=[];world.pickups=[];world.salvage=[];world.chapterHazards=[];
  for(const [i,m] of [2655,2695,2755,2815,2880].entries()){const x=findGround(world,m*64,level,125);if(x!==null)world.vents.push({id:'heli-steam-'+i,x,w:105,phase:i*.8,t:0});}
  for(const [i,m] of [2070,2180,2310,2450,2580,2710,2830,2960,3090,3170].entries()){const x=findGround(world,m*64,level,80);if(x!==null)world.pickups.push({id:'heal-arc-'+i,x,y:level.physics.groundY-32,amount:.25});}
  for(const [i,m] of [2115,2355,2725,3005].entries()){const x=findGround(world,m*64,level,80);if(x!==null)world.salvage.push({id:'salvage-arc-'+i,x,y:level.physics.groundY});}
  for(const [i,m] of [2125,2265,2325,2435].entries()){const x=findGround(world,m*64,level,75);if(x!==null)world.chapterHazards.push({id:'sign-'+i,kind:'falling-sign',x,offset:i*.77});}
  for(const [i,m] of [2665,2730,2805].entries()){const x=findGround(world,m*64,level,100);if(x!==null)world.chapterHazards.push({id:'laser-'+i,kind:'neon-laser',x,offset:i*1.25});}
  for(const [i,m] of [2945,3015,3085,3145].entries()){const x=findGround(world,m*64,level,110);if(x!==null)world.chapterHazards.push({id:'cargo-'+i,kind:'cargo',x,offset:i*1.31});}
  return world;
 }
 world.weather=WEATHER.map(z=>({...z}));world.vents=[];world.pickups=[];world.salvage=[];
 for(const [i,m] of [330,840,1530,1840].entries()){const x=findGround(world,m*64,level,150);if(x!==null)world.vents.push({id:'steam-'+i,x,w:100,phase:i*.71,t:0});}
 for(const gap of world.gaps)if([1039,1124,1487,1796,1935].some(m=>Math.abs(gap.x/64-m)<2))gap.hazard='lava';
 for(const [i,m] of [280,615,785,1075,1230,1455,1645,1885,1960].entries()){const x=findGround(world,m*64,level,80);if(x!==null)world.pickups.push({id:'heal-story-'+i,x,y:level.physics.groundY-32,amount:.25});}
 for(const [i,m] of [385,1110,1548].entries()){const x=findGround(world,m*64,level,85);if(x!==null)world.salvage.push({id:'salvage-story-'+i,x,y:level.physics.groundY});}
 return world;
}
export function repairStoryCoins(world,physics){
 const floor=physics.groundY;let repaired=0;
 for(const c of world.coins){
  const original={x:c.x,y:c.y};
  // A floating shelf with less than a crouching body's clearance is not a lower route.
  const blocked=world.platforms.filter(p=>c.x>p.x-14&&c.x<p.x+p.w+14&&c.y>p.y-10&&c.y<p.y+p.h+12);
  const lowCeiling=world.platforms.filter(p=>p.kind!=='gate'&&c.x>p.x-14&&c.x<p.x+p.w+14&&c.y>p.y&&floor-(p.y+p.h)<64);
  const platform=[...blocked,...lowCeiling].sort((a,b)=>a.y-b.y)[0];
  if(platform){c.y=platform.y-30;c.x=Math.max(platform.x+18,Math.min(platform.x+platform.w-18,c.x));}
  // Coins on a moving surface follow its displacement instead of floating inside it.
  const support=world.platforms.find(p=>c.x>=p.x&&c.x<=p.x+p.w&&Math.abs(c.y-(p.y-30))<18);
  if(support?.kind==='moving'){c.support=support.id;c.dx=c.x-support.x;c.dy=c.y-support.y;}
  if(c.x!==original.x||c.y!==original.y){c.repaired=true;repaired++;}
 }
 world.coinRepairs=repaired;return repaired;
}
export function weatherAt(x,chapter=1){return (chapter===2?WEATHER_ARC:WEATHER).find(z=>x/64>=z.from&&x/64<z.to)||null;}
export function snowPhase(t){const phase=t%6;return phase<1.6?'warning':phase<3.1?'gust':'calm';}
export function ventPhase(t){const phase=t%5.7;return phase<1.4?'warning':phase<2.5?'active':'calm';}
export function canCollect(c,p,radius=40){return Math.abs(c.x-p.x)<radius&&c.y>p.y-p.h-16&&c.y<p.y+16;}
