from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]
p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8');(R/'docs/gameplay-before-story-expansion.js').write_text(s,encoding='utf-8')
def change(a,b):
 global s
 assert a in s,a[:100]
 s=s.replace(a,b)
imports="""import {updateEnvironment,drawEnvironment} from './environment-runtime.js';
import {safeGround,snowPhase,canCollect} from './story-environment.js';
import {initHusk,huskDamage,updateHusk,drawHusk} from './boss-husk.js';
import {GameAudio} from './audio-system.js';
import {initializeSessions,writeSession,listSessions,createSession,selectSession,renameSession} from './story-sessions.js';
"""
s=imports+s
change("let manifest,animations", "initializeSessions(localStorage);\nconst gameAudio=new GameAudio();\nlet manifest,animations")
change("v.gain.setValueAtTime(volume,audio.currentTime)","v.gain.setValueAtTime(volume*gameAudio.settings.sfx,audio.currentTime)")
change("audio.resume()}catch{}", "audio.resume();gameAudio.unlock(audio)}catch{}")
change("localStorage.setItem(SAVE_KEY,JSON.stringify(save));committed", "localStorage.setItem(SAVE_KEY,JSON.stringify(save));writeSession(localStorage,save);committed")
change("if(e.hp<=0)return;e.hp-=damage;", "if(e.hp<=0)return;if(e.ai){damage=huskDamage(e,damage);if(!damage){if((e.blockPop||0)<g.time){pop(e.x,e.y-120,'KHIÊN KÝ ỨC','#c9a5f5');e.blockPop=g.time+.7;}return;}}e.hp-=damage;")
change("metrics.swings++;setAnim", "metrics.swings++;if(g.mode==='story')gameAudio.cue(p.comboStep%2?'slash-1':'slash-2');setAnim")
change("metrics.hits++;pop", "metrics.hits++;if(g.mode==='story')gameAudio.cue('impact');pop")
change("metric('dodge');spark", "metric('dodge');if(g.mode==='story')gameAudio.cue('evade',{cooldown:.65});spark")
change("if(g.mode==='endless'&&!g.arena&&!left)vx=speed();", "if(g.mode==='story'&&g.environment?.weather?.kind==='snow'&&snowPhase(g.environment.clock)==='gust'&&p.grounded&&safeGround(g.world,p.x,320))vx*=down?.52:.72;\n if(g.mode==='endless'&&!g.arena&&!left)vx=speed();")
change("if(g.arena)e.x=clamp", "if(g.arena)e.x=clamp")
change("if(e.stun>0){", "if(e.ai){updateHusk(e,g,dt,{damage,say:text=>say('Senti',text),cue:()=>gameAudio.cue('hos-battle',{voice:true,cooldown:18}),summon(kinds,phase){for(const [i,kind] of kinds.entries()){const guard=spawnEnemy(kind,g.arena.x+(i?660:10),`husk-guard-${phase}-${i}`);guard.bossGuard=true;guard.hp=guard.maxHP=Math.round(guard.hp*.8);g.enemies.push(guard);}},parry(){metric('perfect_parry');spark(e.x,e.y-65,'#fff1ad',24);gameAudio.cue('impact');}});continue;}\n  if(e.stun>0){")
change("wave.forEach((kind,i)=>g.enemies.push(spawnEnemy(kind,g.arena.x+570+i*98,`a${g.arena.m}w${g.wave}e${i}`)))", "wave.forEach((kind,i)=>{const enemy=spawnEnemy(kind,g.arena.x+570+i*98,`a${g.arena.m}w${g.wave}e${i}`);if(kind==='boss'&&g.mode==='story')initHusk(enemy);g.enemies.push(enemy);})")
change("save.equipmentUnlocked=true;save.crystals+=3;", "save.equipmentUnlocked=true;save.crystals+=3;for(const event of chapter.blueprintRewards?.[a.m]||[])g.storyEvents.add(event);")
change("if(g.mode==='story')dialogue(a.after,finish);", "if(g.mode==='story')dialogue(a.m===2000?[...a.after,...(chapter.gearStories?.[a.m]||[])]:[...(chapter.gearStories?.[a.m]||[]),...a.after],finish);")
change("updateCombat(dt);for(const bolt", "updateEnvironment(g,dt,{notify:toast,damage(amount,x,kind){const before=g.hp;damage(amount,x);if(g.hp<before){metrics.environmentHits=(metrics.environmentHits||0)+1;metric('hazard:'+kind);}},impact:spark,needsHeal:()=>g.hp<maxHP()-1,heal(amount,x,y){const gain=Math.min(maxHP()-g.hp,Math.round(maxHP()*amount));g.hp+=gain;metrics.heals=(metrics.heals||0)+1;pop(x,y-30,'+'+gain+' HP','#aaf3d1');spark(x,y,'#9af2d4',20);tone(740,.2,'sine');}});\n if(g.phase==='dying'){pressed.clear();return;}updateCombat(dt);for(const bolt")
change("for(const c of g.world.coins)if(!g.collected.has(c.id)&&Math.abs(c.x-p.x)<32&&c.y>p.y-p.h-12&&c.y<p.y+12)", "for(const c of g.world.coins){if(c.support){const b=g.world.platforms.find(b=>b.id===c.support);if(b){c.x=b.x+c.dx;c.y=b.y+c.dy;}}}for(const c of g.world.coins)if(!g.collected.has(c.id)&&(g.mode==='story'?canCollect(c,p):Math.abs(c.x-p.x)<32&&c.y>p.y-p.h-12&&c.y<p.y+12))")
change("drawGround();drawStoryObjects();", "drawGround();drawStoryObjects();drawEnvironment(ctx,g,{label,width:W,floor:chapter.physics.groundY});")
change("drawStoryOverlay();drawNarrative();", "for(const boss of g.enemies)if(boss.ai&&boss.hp>0&&g.phase==='arena')drawHusk(ctx,boss,g,label);drawStoryOverlay();drawNarrative();")
change("if(e.kind==='boss'&&e.telegraph>0)label", "if(e.kind==='boss'&&!e.ai&&e.telegraph>0)label")
change("function updateAmbience(){\n if(!audio)return;", "function updateAmbience(){\n const active=screen==='play'&&g&&!['paused','finished','dying'].includes(g.phase),silence=g?.phase==='dialogue'&&g.arena?.m===2000&&g.memories.has('main-1')&&g.dialogueIndex>=2&&g.dialogueIndex<=4;\n gameAudio.update({enabled:!!active&&g.mode==='story',muted,silence,dialogue:g?.phase==='dialogue'});\n if(!audio)return;if(g?.mode==='story'){if(ambience)ambience.bus.gain.setTargetAtTime(0,audio.currentTime,.3);return;}")
# Avoid duplicated local declarations in the original Endless-only fallback.
change("const active=!muted&&screen==='play'&&g&&!['paused','finished'].includes(g.phase),silence=g?.phase==='dialogue'&&g.arena?.m===2000&&g.memories.has('main-1')&&g.dialogueIndex>=2&&g.dialogueIndex<=4;", "const synthActive=!muted&&screen==='play'&&g&&!['paused','finished'].includes(g.phase);")
change("active&&!silence?.3:0", "synthActive&&!silence?.3:0")
change("if(!active)return;const scene", "if(!synthActive)return;const scene")
change("g.loopCount++;g.rescueState='failed';", "g.loopCount++;g.rescueState='failed';if(g.mode==='story')gameAudio.cue('hua-battle',{voice:true,cooldown:20});")
change("dialogueIndex:g?.dialogueIndex,", "dialogueIndex:g?.dialogueIndex,environment:g?.environment,vents:g?.world.vents,pickups:g?.world.pickups,audioStatus:gameAudio.status,coinRepairs:g?.world.coinRepairs,")
# Add recoverable salvage caches beside environmental challenges.
change("const prompt=$('#interaction-prompt');", "for(const cache of g.world.salvage||[]){if(g.collected.has(cache.id)||Math.abs(p.x-cache.x)>85||g.phase!=='explore')continue;g.interaction={id:cache.id,label:'E · THU GOM PHỤ TÙNG RÈN'};if(pressed.has('KeyE')){g.collected.add(cache.id);save.materials+=4;save.crystals+=3;dialogue([['Dấu vết cũ','Một thùng tiếp tế còn niêm phong. Những người từng chiến đấu ở đây đã để lại phụ tùng cho người đến sau.'],['Senti','Vẫn dùng được. Ta sẽ mang chúng ra khỏi nơi này.'],['Vật liệu','Nhận 4 Hợp kim và 3 Tinh thể. Dùng tại bàn rèn ở trang Chuẩn bị.']],()=>{g.phase='explore'});}}\n const prompt=$('#interaction-prompt');")
# An old save keeps ownership; all new loot has its narrative/forge source.
for a,b in [('BÀ ẤY','CÔ ẤY'),('Bà ấy','Cô ấy'),('bà ấy','cô ấy'),('Bà cụ','Old Timer'),('bà cụ','Old Timer')]:s=s.replace(a,b)
# Existing button now opens the journey selector instead of erasing the current run.
s=re.sub(r"\$\('#new-story'\)\.onclick=\(\)=>\{.*?\};", "$('#new-story').onclick=()=>showJourneys();",s)
p.write_text(s,encoding='utf-8')
p=R/'level-chapter-1.json';j=json.loads(p.read_text(encoding='utf-8'));raw=json.dumps(j,ensure_ascii=False)
for a,b in [('Bà ấy','Cô ấy'),('bà ấy','cô ấy'),('Bà cụ','Old Timer'),('bà cụ','Old Timer'),('Bà đang đau','Cô đang đau'),('đưa bà ra','đưa cô ra'),('Sau này bà sẽ','Sau này cô sẽ')]:raw=raw.replace(a,b)
j=json.loads(raw);j['gearRewards']={'100':['armored_bracers','attila:T'],'2000':['marco_polo:M']}
j['blueprintRewards']={'450':['forge-attila-m'],'900':['forge-attila-b','forge-namiko']}
j['gearStories']={
 '100':[['Dấu vết người bảo vệ','Trong tủ cứu hộ có một đôi Armored Bracers và dấu khắc Attila (T). Một người đã ở lại giữ con phố này cho dân chạy thoát.'],['Senti','Không ai nhớ tên người đó nữa sao? Vậy ta giữ lấy. Lần này sẽ có người trở về.']],
 '450':[['Bản thiết kế','Bên dưới đống đổ nát là khuôn Attila (M), chưa thể sử dụng. Cần Hợp kim và Tinh thể để khôi phục.'],['Senti','Tìm thêm phụ tùng trên đường. Ta không để ký ức này mất thêm lần nữa.']],
 '900':[['Trạm cứu hộ','Ngăn kéo lưu bản thiết kế CAS-II Namiko và khuôn Attila (B). Nét bút dừng giữa dòng, trước khi công việc hoàn thành.'],['Senti','Sóng xung kích... có thể mở được đường. Phần còn lại để ta làm.'],['Bàn rèn','Đã mở công thức. Thu gom thùng phụ tùng dọc đường; rèn ở trang Chuẩn bị tại checkpoint.']],
 '2000':[['Ký ức còn lại','Khi Husk tan rã, một dấu khắc Marco Polo (M) ở lại trên nền đá. Ký ức về những bước chân vẫn tiến về phía trước.']]}
j['arenas'][-1]['before']=[['Dấu vết Nagazora','Những mảnh giáp từ các con phố vừa đi qua trôi về cùng một điểm. Cánh cổng sau lưng Fu Hua khép lại.'],['Fu Hua','...Nó lại đến.'],['Senti','Vậy ra ngươi là thứ cứ kéo cô ấy trở về.'],['Nagazora Husk','TIẾN TRÌNH HIỆU ĐÍNH: XÓA NHÂN CHỨNG.'],['Senti','Ta đã nhớ đường tới đây. Và lần này, ta sẽ nhớ cả cách đập nát ngươi.'],['Dấu hiệu chiến đấu','Lõi chỉ mở sau mỗi chiêu. Nhảy qua sóng, né hoặc phản đòn cú lao, cúi dưới tia quét. Khi khiên xuất hiện, hạ lính giữ khiên trước.']]
j['beats'] += [{'id':'snow-lore','m':963,'speaker':'Senti','text':'Tuyết ở Nagazora? Một ký ức khác đang tràn vào... phải qua trước khi nó nuốt cả con phố.'},{'id':'lava-lore','m':1030,'speaker':'Senti','text':'Mặt đường đỏ lên rồi. Không phải ánh đèn. Đừng chạm xuống khe nứt.'}]
j['beats'].sort(key=lambda b:b['m'])
j['memories'][0]['lines'].append(['Ký ức kết tinh','Sự ấm áp nhỏ nhoi còn lại hóa thành Marco Polo (T). Mang nó theo để không quên cảm giác có một nơi để trở về.'])
j['memories'][1]['lines'].append(['Ký ức kết tinh','Giọt mưa đầu tiên đọng lại thành Marco Polo (B). Một bằng chứng rằng Senti từng chạm được vào thế giới.'])
p.write_text(json.dumps(j,ensure_ascii=False,indent=2),encoding='utf-8')
print('Integrated environment, multi-phase boss, loot stories, crafting unlocks, audio and journey entry points.')
