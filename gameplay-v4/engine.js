import {repairStoryCoins,configureEnvironment} from './story-environment.js';
export const SAVE_KEY='sentience-gameplay-v4-save-20260926';
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export const jumpRange=(speed,gravity,velocity)=>speed*2*velocity/gravity;
export function newSave(){return {version:4,chapter:1,level:1,gold:0,crystals:0,materials:0,forgeParts:{},weapons:[],weapon:null,weaponLevels:{sword:0,spear:0,chain:0},stigmata:[],stigmaEquipped:false,equipmentUnlocked:false,assistUnlocked:false,dualUnlocked:false,endlessUnlocked:false,chapters:[1],cleared:[],collected:[],visited:[0],checkpoint:{m:0,hp:1000},elapsed:0,best:0,started:false,introSeen:false,seenScenes:[],defeated:[],album:{unlocked:[],marks:{},keepsakes:[],side:[]},courtyard:{tasks:{},secret:false,visited:false,teaTypes:[],tomorrow:false,decor:[]}};}
export function readSave(storage){
 for(const key of [SAVE_KEY,SAVE_KEY+'-backup'])try{const s=JSON.parse(storage.getItem(key));if(s?.version===4&&s.checkpoint&&Array.isArray(s.weapons)&&Number.isInteger(s.level)&&s.level>0&&s.level<=50)return {...newSave(),...s};}catch{}
 return newSave();
}
export function validatePattern(p,physics,{arenaZones=[],checkpoints=[],enemies=[]}={}){
 const issues=[],range=jumpRange(physics.speed,physics.gravity,physics.jumpVelocity),cap={tutorial:.6,normal:.7,hard:.85}[p.difficulty]||.7;
 if(p.gap&&p.gap.w>range*cap+.01)issues.push('gap exceeds jump envelope');
 if(p.gap&&p.difficulty==='hard'&&!p.intermediate)issues.push('hard gap requires intermediate platform');
 if(p.lead<physics.speed*1.5)issues.push('reaction lead below 1.5 seconds');
 for(const a of arenaZones)if(p.x<p.end&&p.x<a.end&&p.end>a.x)issues.push('hazard overlaps combat arena');
 for(const c of checkpoints)if(p.x<c+physics.speed*1.8&&p.end>c-90)issues.push('hazard too close to checkpoint/dialogue exit');
 if(p.kind==='gate'&&p.requiresAir)issues.push('gate cannot require an airborne entry');
 if(p.gap&&enemies.some(e=>Math.abs(e.x-p.gap.x)<160||Math.abs(e.x-p.gap.x-p.gap.w)<160))issues.push('enemy near gap edge');
 if(p.kind==='gate'&&p.gap)issues.push('conflicting jump and slide hazards');
 if(issues.length)console.warn('[Level validator]',p.id,issues.join('; '));
 return {valid:!issues.length,issues,range};
}
export function makeWorld(level,library){
 const world={gaps:[],platforms:[],coins:[],enemies:[],patterns:[],nextId:0,end:level.lengthMeters*level.pixelsPerMeter+1800};
 const zones=level.arenas.map(a=>({x:a.m*level.pixelsPerMeter-220,end:a.m*level.pixelsPerMeter+1150}));
 for(const pos of level.placements){const p=(level.authoredPatterns||library.patterns).find(x=>x.id===pos.pattern);addPattern(world,p,pos.m*level.pixelsPerMeter,level.physics,{arenaZones:zones,checkpoints:level.checkpoints.map(x=>x*level.pixelsPerMeter)});}
 for(const [i,patrol] of (level.patrols||[]).entries()){
  let x=patrol.m*level.pixelsPerMeter,tries=0;
  const unsafe=()=>zones.some(a=>x>a.x-200&&x<a.end+180)||world.gaps.some(h=>x>h.x-240&&x<h.x+h.w+240)||world.platforms.some(p=>x>p.x-90&&x<p.x+p.w+90)||level.checkpoints.some(m=>Math.abs(x-m*level.pixelsPerMeter)<240);
  while(unsafe()&&tries++<60)x+=30;
  if(!unsafe())world.enemies.push({x,kind:patrol.kind,id:`patrol-${i}`});else console.warn('[Patrol validator] No safe position',patrol.m);
 }
 repairStoryCoins(world,level.physics);configureEnvironment(world,level);return world;
}
export function addPattern(w,template,x,physics,restrictions={}){
 const p=structuredClone(template),range=jumpRange(physics.speed,physics.gravity,physics.jumpVelocity),g=physics.groundY;
 p.x=x;p.end=x+p.length;p.lead=Math.max(physics.speed*1.8,540);p.instance=w.nextId++;
 if(p.gap)p.gap={x:x+Math.max(p.gap.offset,p.lead),w:Math.floor(range*p.gap.ratio)};
 if(p.offset)p.offset=Math.max(p.offset,p.lead);
 if(!validatePattern(p,physics,restrictions).valid)return false;
 const id=`p${p.instance}`;
 const platform=(dx,y,width,h,kind='block',extra={})=>w.platforms.push({id:`${id}-b${w.platforms.length}`,x:x+dx,y,w:width,h,kind,baseX:x+dx,baseY:y,region:p.region,crumble:p.region==='roofs'&&kind==='floating',...extra});
 const coin=(dx,y,rare=false)=>w.coins.push({id:`${id}-c${w.coins.length}`,x:x+dx,y,rare,value:rare?25:3});
 if(p.gap){w.gaps.push({...p.gap,id,kind:p.kind});const offset=p.gap.x-x;for(let i=0;i<7;i++)coin(offset-45+(p.gap.w+90)*i/6,g-35-Math.sin(i/6*Math.PI)*105);
   if(p.intermediate)platform(offset+p.gap.w/2-35,g-38,76,35,'moving',{motion:28});
 }
 if(p.kind==='stairs'||p.kind==='upper'){
   p.heights.forEach((h,i)=>{platform(p.lead+10+i*(p.spacing||160),g-h,p.blockWidth||160,p.kind==='upper'?32:h,p.kind==='upper'?'floating':'block');coin(p.lead+90+i*(p.spacing||160),g-h-30,p.kind==='upper'&&i===2)});
   if(p.kind==='upper'){for(let j=0;j<3;j++)coin(630+j*100,g-24);}
 }else if(p.kind==='gate'){platform(p.offset,g-170,p.width,96,'gate');for(let i=0;i<4;i++)coin(p.offset-25+i*65,g-28);
 }else if(p.kind==='breakable'){platform(p.offset,g-68,74,68,'breakable',{hp:48});coin(p.offset+140,g-35,true);
 }else if(p.kind==='pulse'){p.heights.forEach((h,i)=>{platform(p.lead+20+i*170,g-h,110,30,'pulse',{phase:i*1.2});coin(p.lead+60+i*170,g-h-34,true)});
 }else if(p.kind==='skirmish'){platform(p.lead+40,g-65,120,65);coin(p.lead+100,g-95,true);w.enemies.push({x:x+p.enemyOffset,kind:'enemy',id:`${id}-e`});}
 if(!p.gap&&p.kind!=='gate')for(let i=0;i<4;i++)coin(100+i*95,g-30);
 w.patterns.push(p);w.gaps.sort((a,b)=>a.x-b.x);return true;
}
export function solidPlatforms(world,time){return world.platforms.filter(p=>!p.destroyed&&(p.kind!=='pulse'||Math.sin(time*1.5+(p.phase||0))>-.4)).map(p=>{p.prevX=p.x;p.prevY=p.y;if(p.kind==='moving'){p.x=p.baseX+Math.sin(time*1.8)*p.motion;p.y=p.baseY+Math.sin(time*1.4)*12}return p})}
export function body(p){return {x:p.x-p.w/2,y:p.y-p.h,w:p.w,h:p.h}}
export function movePlayer(p,dt,world,physics,solids){
 const oldX=p.x,oldY=p.y;
 if(p.support){const s=solids.find(x=>x.id===p.support);if(s)p.x+=s.x-(s.prevX??s.x)}
 p.x+=p.vx*dt;
 for(const s of solids)if(overlap(body(p),s)){if(oldX+p.w/2<=s.x+.1)p.x=s.x-p.w/2;else if(oldX-p.w/2>=s.x+s.w-.1)p.x=s.x+s.w+p.w/2;}
 p.vy+=physics.gravity*dt;p.y+=p.vy*dt;p.grounded=false;p.support=null;
 for(const s of solids)if(overlap(body(p),s)){
   if(oldY<=s.y+2&&p.vy>=0){p.y=s.y;p.vy=0;p.grounded=true;p.support=s.id;}
   else if(oldY-p.h>=s.y+s.h-2&&p.vy<0){p.y=s.y+s.h+p.h;p.vy=0;}
 }
 const overGap=world.gaps.some(g=>p.x+p.w*.15>g.x&&p.x-p.w*.15<g.x+g.w);
 if(!overGap&&oldY<=physics.groundY+2&&p.y>=physics.groundY){p.y=physics.groundY;p.vy=0;p.grounded=true;p.support=null;}
 return {landed:p.grounded&&oldY< p.y-2,dx:p.x-oldX};
}
export const WEAPONS={sword:{name:'Kiếm',startup:.1,active:.12,recovery:.19,range:106,damage:24},spear:{name:'Thương',startup:.17,active:.14,recovery:.27,range:170,damage:35},chain:{name:'Xích',startup:.2,active:.2,recovery:.29,range:155,damage:26}};
export const ENEMIES={enemy:{hp:165,damage:155,speed:85,reward:9,art:'enemy',reach:66},elite:{hp:420,damage:220,speed:75,reward:20,art:'enemy',reach:75,armor:.15},knight:{hp:290,damage:175,speed:115,reward:17,art:'knight',reach:83},flyer:{hp:330,damage:170,speed:105,reward:20,art:'flyer',reach:155},machine:{hp:480,damage:225,speed:120,reward:27,art:'machine',reach:85,armor:.2},chariot:{hp:3300,damage:290,speed:100,reward:260,art:'chariot',reach:175},heimdall:{hp:2900,damage:300,speed:85,reward:310,art:'machine',reach:190},parvati:{hp:1900,damage:285,speed:95,reward:340,art:'boss',reach:200},phantom:{hp:1850,damage:295,speed:120,reward:380,art:'boss',reach:190},'seven-swords':{hp:760,damage:285,speed:105,reward:520,art:'boss',reach:195},jizo:{hp:3600,damage:315,speed:92,reward:560,art:'boss',reach:200},mnemosyne:{hp:9000,damage:350,speed:88,reward:900,art:'boss',reach:210},mini:{hp:1650,damage:280,speed:70,reward:90,art:'boss',reach:140,scale:1.2},boss:{hp:2600,damage:310,speed:80,reward:200,art:'boss',reach:170,scale:1.45}};

