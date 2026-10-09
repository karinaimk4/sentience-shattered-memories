from pathlib import Path
R=Path(__file__).resolve().parents[1]
p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8-sig')
s=s.replace('ensureGear(readSave(localStorage))','sanitizeSave(readSave(localStorage))||ensureGear(newSave())')
s=s.replace("g.hp=Math.max(60,save.checkpoint.hp)","g.hp=maxHP()")
s=s.replace("$('#return-home').onclick=()=>{switchScreen('home');save=structuredClone(committed);syncHome()}","$('#return-home').onclick=()=>{switchScreen('home');save=structuredClone(committed);g=null;syncHome()}")
s=s.replace("$('#complete-home').onclick=()=>{save=structuredClone(committed);gear()}","$('#complete-home').onclick=()=>{save=structuredClone(committed);g=null;gear()}")
s=s.replace("$('#pause-panel').hidden=true;$('#journal-panel')", "$('#pause-panel').hidden=true;$('#upgrade-panel').hidden=true;$('#interaction-prompt').hidden=true;$('#journal-panel')")
s=s.replace("g.p.invuln=2;toast", "g.p.invuln=2;toast")
s=s.replace("if(g.arena?.loop&&g.rescueState!=='freed')", "if(g.arena?.loop&&g.rescueState!=='freed')")
# Echo sightings coincide with the spoken clue, rather than describing an invisible event.
s=s.replace("if(g.mode!=='story')return;\n for(const clue", "if(g.mode!=='story')return;\n if(currentScene().id==='roofs'&&g.p.x/64>705&&g.p.x/64<745){const ex=850-(g.p.x/64-705)*10;drawSprite('hua.0',ex,300,1.05,1,.5+Math.sin(t*8)*.15);}\n if(['escape','husk'].includes(currentScene().id)&&g.nodes[0]?.destroyed&&g.phase!=='dialogue'){drawSprite('hua.0',g.p.x-g.camera-110,490,1,1,.55+.1*g.nodes.filter(n=>n.destroyed).length);}\n for(const clue")
s=s.replace("if(g.phase==='arena'&&!g.enemies.length)", "if(g.phase==='arena'&&!g.enemies.length)")
# Recovery is explicit in UI; leaving a live scene discards only work after its checkpoint.
s=s.replace("CHECKPOINT REACHED", "KÝ ỨC ĐÃ NEO · ESC ĐỂ MỞ TRANG BỊ")
p.write_text(s,encoding='utf-8')
p=R/'tools/test-v4.cjs';s=p.read_text(encoding='utf-8');s=s.replace("if(s.phase==='finished'||s.stalled||s.phase==='dying')break;", "if(s.phase==='dying'&&s.metrics.respawns<4){await page.evaluate(()=>__qa.step([],80));continue;}if(s.phase==='finished'||s.stalled||s.phase==='dying')break;")
s=s.replace("assert(s.loopCount>=1)","assert(s.storyEvents.includes('node:loop-light'))")
p.write_text(s,encoding='utf-8')
