import {CORES,SETS,ensureGear} from './gear-system.js';
import {newSave} from './engine.js';
import {FORGE_MATERIALS} from './story-crafting.js';
// Import only known fields, bounded numbers and catalog IDs. Never render imported HTML.
export function sanitizeSave(input){
 if(!input||input.version!==4||!Number.isInteger(input.level)||input.level<1||input.level>50)return null;
 input=ensureGear(structuredClone(input));const s=ensureGear(newSave()),num=(v,max=1e8)=>Number.isFinite(v)&&v>=0?Math.min(max,Math.floor(v)):0;
 for(const k of ['gold','crystals','materials','torus','xp','elapsed','endlessBest'])s[k]=num(input[k]);s.level=input.level;
 s.chapter=input.chapter>=7||input.cleared?.includes(7720)?7:input.chapter>=6||input.cleared?.includes(6580)?6:input.chapter>=5||input.cleared?.includes(5440)?5:input.chapter>=4||input.cleared?.includes(4300)?4:input.chapter>=3||input.cleared?.includes(3200)?3:input.chapter===2||input.cleared?.includes(2000)?2:1;
 for(const id of Object.keys(FORGE_MATERIALS))if(id!=='alloy'&&id!=='crystal'&&id!=='torus')s.forgeParts[id]=num(input.forgeParts?.[id],10000);
 for(const k of ['started','introSeen','equipmentUnlocked','assistUnlocked','dualUnlocked','endlessUnlocked'])s[k]=input[k]===true;
 for(const k of ['weapons','chapters','cleared','collected','visited','defeated','seenScenes','memories','nodes','storyEvents'])s[k]=Array.isArray(input[k])?input[k].filter(v=>typeof v==='string'&&v.length<100||Number.isFinite(v)).slice(0,2000):s[k]||[];
 s.weapons=s.weapons.filter(v=>['sword','spear','chain'].includes(v));s.weapon=s.weapons.includes(input.weapon)?input.weapon:s.weapons[0]||null;
 for(const id of s.weapons)s.weaponLevels[id]=Math.max(1,num(input.weaponLevels?.[id],50));
 const checkpoints=[8,2000,0,112,300,462,700,912,1150,1280,1315,1510,1712,1980,2140,2230,2400,2480,2650,2870,3000,3170,3200,3310,3485,3640,3770,3925,4060,4185,4265,4300,4340,4450,4625,4780,4910,5065,5200,5325,5405,5440,5480,5590,5765,5920,6050,6205,6340,6465,6545,6580,6620,6730,6905,7060,7190,7345,7480,7605,7685,7720,7760,7870,8045,8200,8330,8460,8640,8760,8860,8900];s.checkpoint={m:checkpoints.includes(input.checkpoint?.m)?input.checkpoint.m:0,hp:Math.max(1,num(input.checkpoint?.hp,10000))};
 for(const c of CORES){const o=input.cores?.[c.id];if(o&&typeof o==='object'){const cap=Math.max(10,Math.min(c.max,num(o.cap,c.max)));s.cores[c.id]={level:Math.max(1,Math.min(cap,num(o.level,cap))),cap};}}
 for(const set of SETS)for(const slot of ['T','M','B']){const id=set.id+':'+slot;if(input.stigmaInventory?.[id])s.stigmaInventory[id]={level:Math.max(1,num(input.stigmaInventory[id].level,set.maxLevel))};}
 s.equippedCore=s.cores[input.equippedCore]&&CORES.some(c=>c.id===input.equippedCore&&c.available)?input.equippedCore:null;
 for(const slot of ['T','M','B']){const id=input.slots?.[slot];s.slots[slot]=typeof id==='string'&&id.endsWith(':'+slot)&&s.stigmaInventory[id]&&SETS.some(set=>set.available&&id.startsWith(set.id+':'))?id:null;}
 for(const id of ['sword','dodge'])s.skills[id]=num(input.skills?.[id],5);
 for(const name of ['Story','Boss','Endless','Tự chọn']){const p=input.presets?.[name];if(!p||typeof p!=='object')continue;s.presets[name]={core:s.cores[p.core]&&CORES.some(c=>c.available&&c.id===p.core)?p.core:null,slots:{}};for(const slot of ['T','M','B']){const id=p.slots?.[slot];s.presets[name].slots[slot]=typeof id==='string'&&id.endsWith(':'+slot)&&s.stigmaInventory[id]&&SETS.some(set=>set.available&&id.startsWith(set.id+':'))?id:null;}}
 s.journal=Array.isArray(input.journal)?input.journal.filter(e=>e&&typeof e.title==='string'&&Array.isArray(e.lines)).slice(0,200).map(e=>({id:String(e.id).slice(0,2000),m:num(e.m,9000),title:e.title.slice(0,120),lines:e.lines.filter(l=>Array.isArray(l)&&l.length===2&&l.every(t=>typeof t==='string')).slice(0,25).map(l=>l.map(t=>t.slice(0,1000).replaceAll('BÀ CỤ','OLD TIMER').replaceAll('BÀ ẤY','CÔ ẤY').replaceAll('Bà cụ','Old Timer').replaceAll('bà cụ','Old Timer').replaceAll('Bà ấy','Cô ấy').replaceAll('bà ấy','cô ấy')))})):[];
 if(input.album&&typeof input.album==='object'){s.album.unlocked=Array.isArray(input.album.unlocked)?input.album.unlocked.filter(x=>typeof x==='string').slice(0,200):[];s.album.side=Array.isArray(input.album.side)?input.album.side.filter(x=>typeof x==='string').slice(0,100):[];s.album.keepsakes=Array.isArray(input.album.keepsakes)?input.album.keepsakes.filter(x=>typeof x==='string').slice(0,100):[];s.album.marks={};for(const [id,marks] of Object.entries(input.album.marks||{}).slice(0,250))if(Array.isArray(marks))s.album.marks[String(id).slice(0,80)]=marks.filter(x=>['white','green','red'].includes(x));}
 if(input.courtyard&&typeof input.courtyard==='object'){s.courtyard.tasks={};for(const [id,status] of Object.entries(input.courtyard.tasks||{}).slice(0,20))if(typeof id==='string'&&status==='done')s.courtyard.tasks[id.slice(0,40)]='done';s.courtyard.secret=input.courtyard.secret===true;s.courtyard.visited=input.courtyard.visited===true;s.courtyard.tomorrow=input.courtyard.tomorrow===true;s.courtyard.teaTypes=Array.isArray(input.courtyard.teaTypes)?input.courtyard.teaTypes.filter(x=>typeof x==='string').slice(0,10):[];s.courtyard.decor=Array.isArray(input.courtyard.decor)?input.courtyard.decor.filter(x=>typeof x==='string').slice(0,20):[];}
 s.deaths={};for(const m of checkpoints)if(input.deaths?.[m])s.deaths[m]=num(input.deaths[m],1000);
 for(const [m,events] of [[450,['forge-attila-m']],[900,['forge-attila-b','forge-namiko']],[4300,['forge-dirac']],[6580,['forge-shattered-swords']],[8900,['forge-pericles']]])if(s.cleared.includes(m))for(const event of events)if(!s.storyEvents.includes(event))s.storyEvents.push(event);
 return s;
}

