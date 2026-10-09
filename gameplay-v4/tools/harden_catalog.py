from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'gear-system.js';s=p.read_text(encoding='utf-8').replace("if(!preset||!preset.slots)continue;","if(!preset||typeof preset!=='object'||!preset.slots||typeof preset.slots!=='object')continue;")
s=s.replace('if(c&&own){','if(c?.available&&own){').replace('if(!set)continue;','if(!set?.available)continue;')
p.write_text(s,encoding='utf-8')
p=r/'save-validation.js';s=p.read_text(encoding='utf-8').replace('s.cores[input.equippedCore]?input.equippedCore:null','s.cores[input.equippedCore]&&CORES.some(c=>c.id===input.equippedCore&&c.available)?input.equippedCore:null').replace("&&s.stigmaInventory[id]?id:null","&&s.stigmaInventory[id]&&SETS.some(set=>set.available&&id.startsWith(set.id+':'))?id:null").replace('s.cores[p.core]?p.core:null','s.cores[p.core]&&CORES.some(c=>c.available&&c.id===p.core)?p.core:null')
p.write_text(s,encoding='utf-8')
p=r/'gameplay-v2.js';s=p.read_text(encoding='utf-8').replace("+(g.survivorBuff>0?.1:0)",'').replace("*(g.clothBoost?1.12:1)",'').replace('g.clothBoost=false;','').replace("'survivorBuff',",'')
p.write_text(s,encoding='utf-8')
