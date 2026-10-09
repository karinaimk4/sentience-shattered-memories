from pathlib import Path
R=Path(__file__).resolve().parents[1];p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8-sig')
s=s.replace("function showDialogue(){g.dialogueClock=0;const line", "function showDialogue(){g.dialogueClock=0;g.dialogueReveal=0;const line")
s=s.replace("$('#dialogue-text').textContent=line[1];", "g.dialogueFullText=line[1];$('#dialogue-text').textContent='';")
s=s.replace("if(!g||g.phase!=='dialogue')return;tone", "if(!g||g.phase!=='dialogue')return;if(g.dialogueReveal<(g.dialogueFullText?.length||0)){g.dialogueReveal=g.dialogueFullText.length;$('#dialogue-text').textContent=g.dialogueFullText;return;}tone")
s=s.replace("g.presentationTime+=dt;g.dialogueClock+=dt;", "g.presentationTime+=dt;g.dialogueClock+=dt;if(g.phase==='dialogue'){g.dialogueReveal=Math.min(g.dialogueFullText.length,(g.dialogueReveal||0)+dt*42);$('#dialogue-text').textContent=g.dialogueFullText.slice(0,Math.floor(g.dialogueReveal));}")
s=s.replace("function loop(now){const delta", "function loop(now){updateAmbience();const delta")
s+='\n'+(R/'tools/presentation.part.js').read_text(encoding='utf-8')
p.write_text(s,encoding='utf-8')
