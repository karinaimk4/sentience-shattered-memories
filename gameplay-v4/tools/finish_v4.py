from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
p=R/'level-chapter-1.json';l=json.loads(p.read_text(encoding='utf-8'))
for t in l['authoredPatterns']:
 if t['region']=='roofs' and t['kind']=='upper':t['gap']={'offset':650,'ratio':.62}
p.write_text(json.dumps(l,ensure_ascii=False,indent=2),encoding='utf-8')
p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8-sig')
s=s.replace("function damage(amount,sourceX){const p=g.p;if(p.invuln>0", "function damage(amount,sourceX){const p=g.p;if(g.dash>0){metric('perfect_dodge');if(save.equippedCore==='cloth_resolve')g.clothBoost=true;}if(p.invuln>0")
s=s.replace("hitEnemy(e,g.empowered?Math.round(dmg*(save.equippedCore==='cloth_resolve'?2.24:2)):dmg,a.weapon);", "hitEnemy(e,Math.round(dmg*(g.empowered?2:1)*(g.clothBoost?1.12:1)),a.weapon);g.clothBoost=false;")
s=s.replace("$('#dialogue .eyebrow').textContent=`${g.arena?.name||'KÝ ỨC'}", "$('#dialogue .eyebrow').textContent=`${g.arena?.name||(!save.introSeen?'KHÔNG AI NHỚ TA':currentScene().name)}")
# At the ending Fu Hua must be visibly free of the loop before the emotional exchange.
s=s.replace("g.memories.add('main-1');", "g.memories.add('main-1');g.speechQueue=[];g.speechTime=0;")
p.write_text(s,encoding='utf-8')
p=R/'gear-system.js';s=p.read_text(encoding='utf-8');s=s.replace('Phản đòn hoàn hảo: đòn kế tiếp +12% sát thương.','Né hoàn hảo: đòn kế tiếp +12% sát thương.');p.write_text(s,encoding='utf-8')
p=R/'engine.js';s=p.read_text(encoding='utf-8');a=s.index('export function readSave(');b=s.index('export function validatePattern',a)
s=s[:a]+'''export function readSave(storage){
 for(const key of [SAVE_KEY,SAVE_KEY+'-backup'])try{const s=JSON.parse(storage.getItem(key));if(s?.version===4&&s.checkpoint&&Array.isArray(s.weapons)&&Number.isInteger(s.level)&&s.level>0&&s.level<=50)return {...newSave(),...s};}catch{}
 return newSave();
}
'''+s[b:];p.write_text(s,encoding='utf-8')
print('Finalized checkpoint recovery, roof gaps and core passive')
