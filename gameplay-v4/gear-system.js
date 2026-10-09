import {CORES,SETS,migrateId} from './canonical-catalog.js';
export {CORES,SETS} from './canonical-catalog.js';
export function ensureGear(s){for(const key of ['cores','stigmaInventory','slots','presets','skills'])if(!s[key]||typeof s[key]!=='object'||Array.isArray(s[key]))s[key]={};s.equippedCore??=null;for(const slot of ['T','M','B'])s.slots[slot]??=null;s.skills.sword??=0;s.skills.dodge??=0;s.xp??=0;s.torus??=0;s.storyEvents??=[];s.endlessBest??=0;
 // Old journeys already collected these three caches before named forge parts existed.
 if(!s.forgeParts||typeof s.forgeParts!=='object'||Array.isArray(s.forgeParts))s.forgeParts={};
 if(!Object.hasOwn(s.forgeParts,'namiko_coil'))s.forgeParts.namiko_coil=(s.collected||[]).filter(id=>/^salvage-story-[012]$/.test(id)).length*2;
 if(s.gearSchema!==2){for(const bag of ['cores','stigmaInventory']){const mapped={};for(const [id,value] of Object.entries(s[bag]))mapped[migrateId(id)]=value;s[bag]=mapped;}s.equippedCore=migrateId(s.equippedCore);for(const slot of ['T','M','B'])s.slots[slot]=migrateId(s.slots[slot]);for(const preset of Object.values(s.presets)){if(!preset||typeof preset!=='object'||!preset.slots||typeof preset.slots!=='object')continue;preset.core=migrateId(preset.core);for(const slot of ['T','M','B'])preset.slots[slot]=migrateId(preset.slots[slot]);}s.gearSchema=2;}
 return s;
}
export function grantGear(s,id){ensureGear(s);id=migrateId(id);if(CORES.some(c=>c.id===id)){if(!s.cores[id])s.cores[id]={level:1,cap:10};}else if(SETS.some(set=>['T','M','B'].some(slot=>set.id+':'+slot===id))&&!s.stigmaInventory[id])s.stigmaInventory[id]={level:1};}
export function stats(s,{combo=0}={}){ensureGear(s);const v={hp:1000+(s.level-1)*35,atk:100+(s.level-1)*5,def:80+(s.level-1)*3,crit:.05,crt:0,critDamage:1.5,move:0,normal:0,physical:0,total:0,reduction:0,sets:{}};
 const c=CORES.find(c=>c.id===s.equippedCore),own=s.cores[s.equippedCore];if(c?.available&&own){const factor=.2+.8*own.level/c.max;v.atk+=c.atk*factor;v.crt+=c.crt*factor;if(c.id==='cas_ii_namiko')v.physical+=.15;}
 const has=id=>Object.values(s.slots).includes(id)&&!!s.stigmaInventory[id];
 for(const [slot,id] of Object.entries(s.slots)){if(!id||!s.stigmaInventory[id])continue;const [setId,piece]=id.split(':');if(piece!==slot)continue;const set=SETS.find(a=>a.id===setId);if(!set?.available)continue;const index=['T','M','B'].indexOf(piece),factor=.2+.8*(s.stigmaInventory[id].level-1)/(set.maxLevel-1);for(const [k,value] of Object.entries(set.stats[index]))v[k]+=value*factor;v.sets[setId]=(v.sets[setId]||0)+1;}
 if(has('attila:T')&&combo>10)v.move+=.15;if(has('attila:M')&&combo>20)v.def*=1.41;if(has('attila:B')&&combo>30)v.physical+=.31;
 if(v.sets.attila>=2)v.critDamage+=.3;if(v.sets.attila>=3)v.crt*=1.4;
 if(has('marco_polo:T'))v.physical+=.15+(combo>30?.15:0);if(has('marco_polo:M'))v.critDamage+=.25+(combo>30?.25:0);if(has('marco_polo:B'))v.crit+=.11;
 if(has('dirac:T'))v.crit+=.1;if(has('dirac:M'))v.total+=.18;if(has('dirac:B'))v.physical+=.2;if(v.sets.dirac>=2)v.total+=.1;if(v.sets.dirac>=3){v.physical+=.15;v.reduction+=.1;}
 if(has('shattered_swords:T'))v.physical+=.2;if(has('shattered_swords:M'))v.reduction+=.15;if(has('shattered_swords:B'))v.critDamage+=.25;if(v.sets.shattered_swords>=2)v.critDamage+=.2;if(v.sets.shattered_swords>=3){v.total+=.2;v.crit+=.1;}
 if(has('pericles:T'))v.physical+=.25;if(has('pericles:M')){v.crit+=.12;v.total+=.1;}if(has('pericles:B'))v.normal+=.2;if(v.sets.pericles>=2){v.physical+=.15;v.critDamage+=.2;}if(v.sets.pericles>=3){v.total+=.2;v.crit+=.1;}
 v.crit=Math.min(.75,v.crit+v.crt/(s.level*5+75));for(const k of ['hp','atk','def'])v[k]=Math.round(v[k]);return v;
}
export function equipCore(s,id){ensureGear(s);if(id!==null&&(!s.cores[id]||!CORES.find(c=>c.id===id)?.available))return false;s.equippedCore=id;return true}
export function equipStigma(s,slot,id){ensureGear(s);if(!['T','M','B'].includes(slot)||id!==null&&(!s.stigmaInventory[id]||id.split(':')[1]!==slot||!SETS.find(set=>id.startsWith(set.id+':'))?.available))return false;s.slots[slot]=id;return true}
export function upgradeCost(s,id){const core=CORES.find(c=>c.id===id),o=core?s.cores[id]:s.stigmaInventory[id];if(!o)return null;if(core){if(o.level>=core.max)return null;if(o.level>=o.cap)return {gold:200*core.rarity,alloy:core.rarity,breakthrough:true};return {gold:40+o.level*12,alloy:0};}if(o.level>=(SETS.find(set=>id.startsWith(set.id+':'))?.maxLevel||50))return null;return {gold:100*o.level,alloy:o.level>=3?1:0};}
export function upgrade(s,id){const cost=upgradeCost(s,id);if(!cost||s.gold<cost.gold||s.materials<cost.alloy)return false;s.gold-=cost.gold;s.materials-=cost.alloy;if(s.cores[id]){if(cost.breakthrough)s.cores[id].cap=Math.min(CORES.find(c=>c.id===id).max,s.cores[id].cap+10);else s.cores[id].level++;}else s.stigmaInventory[id].level++;return true}
export function recommended(s){const cores=CORES.filter(c=>c.available&&s.cores[c.id]).sort((a,b)=>b.atk-a.atk);s.equippedCore=cores[0]?.id||null;for(const slot of ['T','M','B']){const sets=SETS.filter(a=>a.available&&s.stigmaInventory[a.id+':'+slot]).sort((a,b)=>b.rarity-a.rarity);s.slots[slot]=sets[0]?sets[0].id+':'+slot:null;}}
export function storePreset(s,name){if(!['Story','Boss','Endless','Tự chọn'].includes(name))return false;s.presets[name]={core:s.equippedCore,slots:{...s.slots}};return true}
export function applyPreset(s,name){const p=s.presets[name];if(!p||!p.slots)return false;const preview=structuredClone(s);if(!equipCore(preview,p.core))return false;for(const slot of ['T','M','B'])if(!equipStigma(preview,slot,p.slots[slot]??null))return false;s.equippedCore=preview.equippedCore;s.slots={...preview.slots};return true}
export function addXP(s,n){s.xp+=n;while(s.level<50&&s.xp>=s.level*150){s.xp-=s.level*150;s.level++;}}
