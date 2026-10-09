from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
p=R/'level-chapter-1.json';l=json.loads(p.read_text(encoding='utf-8-sig'))
for t in l['authoredPatterns']:
 if t.get('gap'):t['gap']['ratio']=min(t['gap']['ratio'],{'tutorial':.6,'normal':.7,'hard':.85}[t['difficulty']])
for b in l['beats']:
 if b['id']=='kitchen-echo':b['requiresMemory']='hidden-1'
 if b['id']=='shortcut':b['text']='Tiếng động trên cao. Phải tìm đường lên mái nhà... bà ấy không ở dưới này.'
p.write_text(json.dumps(l,ensure_ascii=False,indent=2),encoding='utf-8')
p=R/'save-validation.js';s=p.read_text(encoding='utf-8');s=s.replace('[0,8,125,475,925,1330,1450,1725,2000]',str([8,2000]+l['checkpoints']));p.write_text(s,encoding='utf-8')
p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8-sig');s=s.replace('if(m<beat.m||g.storyEvents.has(beat.id))','if(m<beat.m||g.storyEvents.has(beat.id)||beat.requiresMemory&&!g.memories.has(beat.requiresMemory))');s=s.replace("$('#sector-title').textContent=", "$('#play').classList.toggle('cinematic',g.phase==='dialogue');$('#sector-title').textContent=");p.write_text(s,encoding='utf-8')
