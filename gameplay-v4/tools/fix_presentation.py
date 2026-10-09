from pathlib import Path
R=Path(__file__).resolve().parents[1];p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8-sig')
s=s.replace("g.world.platforms.push({id:'memory-balcony'", "g.world.platforms.push({id:'memory-sign',x:865*64-420,y:390,w:130,h:30,kind:'floating'},{id:'memory-step',x:865*64-245,y:330,w:120,h:30,kind:'floating'},{id:'memory-balcony'")
s=s.replace("}else if(g.arena?.loop&&g.rescueState==='failed'){\n  ctx.fillStyle", "}else if(g.arena?.loop&&g.rescueState==='failed'){\n  cinematicBackdrop(2);ctx.fillStyle")
s=s.replace("}else if(g.arena?.m===2000&&g.memories.has('main-1')&&stage<11){\n  ctx.fillStyle", "}else if(g.arena?.m===2000&&g.memories.has('main-1')&&stage<11){\n  cinematicBackdrop(3);ctx.fillStyle")
s+='''\nfunction cinematicBackdrop(cell){const cw=sceneAtlas.width/2,ch=sceneAtlas.height/2;ctx.drawImage(sceneAtlas,(cell%2)*cw,Math.floor(cell/2)*ch,cw,ch,0,35,W,435);}\n'''
p.write_text(s,encoding='utf-8')
