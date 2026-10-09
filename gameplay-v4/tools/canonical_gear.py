from pathlib import Path
import json
R=Path(__file__).resolve().parents[1];p=R/'gear-system.js';old=p.read_text(encoding='utf-8');(R/'docs/gear-system-before-wiki.js').write_text(old,encoding='utf-8')
a=old.index('export function upgradeCost');tail=old[a:]
tail=tail.replace('if(o.level>=5)return null',"if(o.level>=(SETS.find(set=>id.startsWith(set.id+':'))?.maxLevel||50))return null")
head='''import {CORES,SETS,migrateId} from './canonical-catalog.js';
export {CORES,SETS} from './canonical-catalog.js';
export function ensureGear(s){s.cores??={};s.equippedCore??=null;s.stigmaInventory??={};s.slots??={T:null,M:null,B:null};s.presets??={};s.skills??={sword:0,dodge:0};s.xp??=0;s.torus??=0;s.storyEvents??=[];s.endlessBest??=0;
 if(s.gearSchema!==2){for(const bag of ['cores','stigmaInventory']){const mapped={};for(const [id,value] of Object.entries(s[bag]))mapped[migrateId(id)]=value;s[bag]=mapped;}s.equippedCore=migrateId(s.equippedCore);for(const slot of ['T','M','B'])s.slots[slot]=migrateId(s.slots[slot]);for(const preset of Object.values(s.presets)){if(!preset||!preset.slots)continue;preset.core=migrateId(preset.core);for(const slot of ['T','M','B'])preset.slots[slot]=migrateId(preset.slots[slot]);}s.gearSchema=2;}
 return s;
}
export function grantGear(s,id){ensureGear(s);id=migrateId(id);if(CORES.some(c=>c.id===id)){if(!s.cores[id])s.cores[id]={level:1,cap:10};}else if(SETS.some(set=>['T','M','B'].some(slot=>set.id+':'+slot===id))&&!s.stigmaInventory[id])s.stigmaInventory[id]={level:1};}
export function stats(s,{combo=0}={}){ensureGear(s);const v={hp:1000+(s.level-1)*35,atk:100+(s.level-1)*5,def:80+(s.level-1)*3,crit:.05,crt:0,critDamage:1.5,move:0,normal:0,physical:0,total:0,reduction:0,sets:{}};
 const c=CORES.find(c=>c.id===s.equippedCore),own=s.cores[s.equippedCore];if(c&&own){const factor=.2+.8*own.level/c.max;v.atk+=c.atk*factor;v.crt+=c.crt*factor;if(c.id==='cas_ii_namiko')v.physical+=.15;}
 const has=id=>Object.values(s.slots).includes(id)&&!!s.stigmaInventory[id];
 for(const [slot,id] of Object.entries(s.slots)){if(!id||!s.stigmaInventory[id])continue;const [setId,piece]=id.split(':');if(piece!==slot)continue;const set=SETS.find(a=>a.id===setId);if(!set)continue;const index=['T','M','B'].indexOf(piece),factor=.2+.8*(s.stigmaInventory[id].level-1)/(set.maxLevel-1);for(const [k,value] of Object.entries(set.stats[index]))v[k]+=value*factor;v.sets[setId]=(v.sets[setId]||0)+1;}
 if(has('attila:T')&&combo>10)v.move+=.15;if(has('attila:M')&&combo>20)v.def*=1.41;if(has('attila:B')&&combo>30)v.physical+=.31;
 if(v.sets.attila>=2)v.critDamage+=.3;if(v.sets.attila>=3)v.crt*=1.4;
 if(has('marco_polo:T'))v.physical+=.15+(combo>30?.15:0);if(has('marco_polo:M'))v.critDamage+=.25+(combo>30?.25:0);if(has('marco_polo:B'))v.crit+=.11;
 v.crit=Math.min(.75,v.crit+v.crt/(s.level*5+75));for(const k of ['hp','atk','def'])v[k]=Math.round(v[k]);return v;
}
export function equipCore(s,id){ensureGear(s);if(id!==null&&(!s.cores[id]||!CORES.find(c=>c.id===id)?.available))return false;s.equippedCore=id;return true}
export function equipStigma(s,slot,id){ensureGear(s);if(!['T','M','B'].includes(slot)||id!==null&&(!s.stigmaInventory[id]||id.split(':')[1]!==slot||!SETS.find(set=>id.startsWith(set.id+':'))?.available))return false;s.slots[slot]=id;return true}
'''
p.write_text(head+tail,encoding='utf-8')
p=R/'save-validation.js';s=p.read_text(encoding='utf-8');s=s.replace("const s=ensureGear(newSave()),num=", "input=ensureGear(structuredClone(input));const s=ensureGear(newSave()),num=")
s=s.replace('num(input.stigmaInventory[id].level,5)','num(input.stigmaInventory[id].level,set.maxLevel)')
p.write_text(s,encoding='utf-8')
p=R/'level-chapter-1.json';l=json.loads(p.read_text(encoding='utf-8'));m={'cloth_resolve':'armored_bracers','training_fists':'cas_ii_namiko','training_memory':'attila','nagazora_survivor':'marco_polo'}
for key,items in l['gearRewards'].items():l['gearRewards'][key]=[m.get(v,v) if ':' not in v else m.get(v.split(':')[0],v.split(':')[0])+':'+v.split(':')[1] for v in items]
p.write_text(json.dumps(l,ensure_ascii=False,indent=2),encoding='utf-8')
p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8-sig')
s=s.replace("'nagazora_survivor:T':'nagazora_survivor:B'","'marco_polo:T':'marco_polo:B'")
s=s.replace("if(save.equippedCore==='cloth_resolve')g.clothBoost=true;",'')
s=s.replace("if(sv.sets.nagazora_survivor>=3)g.survivorBuff=6;",'')
s=s.replace("p.hurtTime=sv.sets.nagazora_survivor?.176:.22",'p.hurtTime=.22')
s=s.replace("if(stats(save).sets.training_memory>=2)g.p.invuln=5;",'g.p.invuln=Math.max(g.p.invuln,2);')
s=s.replace("if(stats(save).sets.training_memory>=3)g.hp=Math.min(maxHP(),g.hp+maxHP()*.15)",'')
s=s.replace("const v=stats(save),dmg=", "const v=stats(save,{combo:g.combo}),dmg=")
s=s.replace("const sv=stats(save);amount=", "const sv=stats(save,{combo:g.combo});amount=")
s=s.replace("stats(save).move+(g.survivorBuff>0?.12:0)", "stats(save,{combo:g.combo}).move")
s=s.replace("*(random()<v.crit?1.5:1)","*(random()<v.crit?v.critDamage:1)")
s=s.replace("if(g.empowered&&stats(save).sets.nagazora_survivor>=2)for(const other of g.enemies)if(other.hp>0&&Math.abs(other.x-e.x)<240)hitEnemy(other,Math.round(stats(save).atk*.8),'echo');", "if(v.sets.marco_polo>=2&&g.combo>25&&a.step>=3&&(g.marcoHitCD||0)<=0){g.marcoHitCD=5;hitEnemy(e,Math.round(v.atk*2.5),'echo');}")
s=s.replace("for(const k of ['dash','dashCD','dodgeCombo','survivorBuff'])", "for(const k of ['dash','dashCD','dodgeCombo','survivorBuff','marcoHitCD','marcoHealCD','weaponSkillCD'])")
s=s.replace("g.time+=dt;g.elapsed+=dt;", "g.time+=dt;g.elapsed+=dt;if(stats(save).sets.marco_polo>=3&&g.combo>25&&(g.marcoHealCD||0)<=0){g.marcoHealCD=5;g.hp=Math.min(maxHP(),g.hp+200);}")
s=s.replace("if(pressed.has('KeyQ'))assist();", "if(pressed.has('KeyR'))weaponSkill();if(pressed.has('KeyQ'))assist();")
s=s.replace("ctx.fillStyle=j===Math.floor(g.time)%3?'#f8b897':'#665472'", "ctx.fillStyle=g.nodes[0]?.destroyed?(j===2?'#98dace':'#445853'):(j===Math.floor(g.time)%3?'#f8b897':'#665472')")
s+='''\nfunction weaponSkill(){if(!g||save.equippedCore!=='cas_ii_namiko'||(g.weaponSkillCD||0)>0||!['explore','arena'].includes(g.phase))return;g.weaponSkillCD=10;const p=g.p;for(const e of g.enemies)if(e.hp>0&&(e.x-p.x)*p.face>0&&Math.abs(e.x-p.x)<550)hitEnemy(e,Math.round(stats(save).atk*4.5),'weapon-skill');spark(p.x+p.face*120,p.y-45,'#b9d7ff',30);tone(145,.3,'triangle');toast('WANDER · SÓNG XUNG KÍCH',1.5);}\n'''
p.write_text(s,encoding='utf-8')
print('Canonical item identities and first-chapter effects integrated')
