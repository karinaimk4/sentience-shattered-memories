from pathlib import Path
R=Path(__file__).resolve().parents[1]
p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8')
s=s.replace("drawSprite(line[0]==='Fu Hua'?'hua.0':'idle.7',90,155,1.5,1,1,x)","drawDialoguePortrait(line[0],x)")
s=s.replace("label(g.arena.name,W/2,48,'#f5dbaa',16);", "if(!g.enemies.some(e=>e.ai))label(g.arena.name,W/2,48,'#f5dbaa',16);")
s=s.replace("if(e.hp>0){const width=e.kind==='boss'?125:70;", "if(e.hp>0&&!e.ai){const width=e.kind==='boss'?125:70;")
s=s.replace("save.stigmata=['training-top','training-middle','training-bottom'];",'')
s+='''
function drawDialoguePortrait(speaker,target){
 if(speaker==='Fu Hua'||speaker==='Senti'||speaker==='HoS'){drawSprite(speaker==='Fu Hua'?'hua.0':'idle.7',90,155,1.5,1,1,target);return;}
 if(speaker==='Nagazora Husk'){const r=enemyManifest.frames.find(f=>f.kind==='husk'&&f.pose===0).rect,scale=Math.min(160/r[2],160/r[3]);target.drawImage(enemyAtlas,...r,(180-r[2]*scale)/2,170-r[3]*scale,r[2]*scale,r[3]*scale);return;}
 target.fillStyle='#1b192d';target.fillRect(30,30,120,110);target.strokeStyle='#bda4ce';target.lineWidth=2;target.beginPath();target.moveTo(90,35);target.lineTo(120,85);target.lineTo(90,137);target.lineTo(60,85);target.closePath();target.stroke();target.fillStyle='#e2c4f0';target.fillRect(85,78,10,14);
}
'''
p.write_text(s,encoding='utf-8')
p=R/'loadout.js';s=p.read_text(encoding='utf-8').replace("return `<article><h3>${r.name}","return `<article><div class=\"forge-art\">${r.id.includes(':')?stigmaArt(SETS.find(set=>r.id.startsWith(set.id+':')),['T','M','B'].indexOf(r.id.split(':')[1])):coreArt(CORES.find(c=>c.id===r.id))}</div><h3>${r.name}")
p.write_text(s,encoding='utf-8')
p=R/'loadout.css';s=p.read_text(encoding='utf-8')+'\n.forge-art{float:right;width:95px;margin:0 0 10px 20px}.forge-grid article{display:flow-root}\n';p.write_text(s,encoding='utf-8')
print('Polished boss intro portrait, boss HUD, and illustrated forge recipes.')
