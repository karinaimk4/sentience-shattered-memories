from pathlib import Path
import shutil
root=Path(__file__).resolve().parents[1]
dest=root/'assets/wiki-redraws'; dest.mkdir(exist_ok=True)
source=Path(r'C:\Users\Admin\.codex\generated_images\01a0dd08-6cad-74e1-865a-c60286e9b69d')
images={'weapons-base':'989e5833-ab31-46c6-9951-9a21067cfdcd','weapons-advanced':'d2efeaef-c997-42a8-a0c7-44901517d314','marco-polo':'5ac87657-3607-43c9-b37f-9344f5f8f15c','dirac':'0e89f089-8579-4e1d-b69d-bd15d6918540','shattered-swords':'8385a652-6096-4793-aba1-ca597cafb75c','pericles':'4ffba3ec-0fed-45f6-a907-3597716c9a7c'}
for name,id in images.items(): shutil.copy2(source/f'exec-{id}.png',dest/f'{name}.png')
p=root/'loadout.js';s=p.read_text(encoding='utf-8')
s=s.replace("selectedCore='cloth_resolve',selectedSet='training_memory'","selectedCore='armored_bracers',selectedSet='attila'")
s=s.replace('background-position:${c.index%3*50}% ${Math.floor(c.index/3)*50}%',"background-image:url('assets/wiki-redraws/${c.art}');background-position:${c.artIndex%2*100}% ${Math.floor(c.artIndex/2)*100}%")
s=s.replace('assets/original-library/${set.file}','assets/wiki-redraws/${set.file}')
s=s.replace('Lõi Vũ Khí','Vũ khí').replace('LÕI VŨ KHÍ','VŨ KHÍ · GAUNTLETS').replace('GỠ LÕI','GỠ VŨ KHÍ').replace('Không mặc lõi','Chưa mặc vũ khí')
s=s.replace('Một lõi dùng chung cho cả ba hình thái chiến đấu.','Một ô Gauntlets dùng chung cho ba hình thái Kiếm / Thương / Xích.').replace('Chọn một lõi để xem chỉ số và nơi nhận.','Chọn vũ khí để xem hình, hiệu ứng và nơi nhận trong Story.')
s=s.replace('<p>${c.passive}</p>','<p>${c.passive}</p><p class="wiki-meta">HI3 · ${c.rarity}–${c.maxRarity}★ · ATK ${c.atk} / CRT ${c.crt} ở cấp tối đa · <a href="${c.wiki}" target="_blank" rel="noopener noreferrer">Xem wiki ↗</a></p><p>${c.available?(c.runtime||"Không có kỹ năng riêng. Chỉ số tăng theo cấp trang bị trong bản 2D."):"Chưa mở trong Chương 1. Mô tả trên là hiệu ứng trong HI3."}</p>')
s=s.replace('Nguồn: ${c.source}','Nhận trong bản fan game: ${c.source}')
s=s.replace("${own?'':'disabled'}>${s.equippedCore", "${own&&c.available?'':'disabled'}>${s.equippedCore")
s=s.replace("${!own?'<p class=\"dim\">Nội tại này thuộc nội dung chưa mở. Không cộng chỉ số khi chưa sở hữu.</p>':''}","${!own?'<p class=\"dim\">Chưa sở hữu. Chỉ số này chưa được cộng cho nhân vật.</p>':''}")
s=s.replace("<h3>${slot} · ${['Trên','Giữa','Dưới'][i]}</h3>",'<h3>${set.pieceNames[i]}</h3>')
s=s.replace("own.level+'/5'","own.level+'/'+set.maxLevel")
s=s.replace("${own?'':'disabled'}>${s.slots", "${own&&set.available?'':'disabled'}>${s.slots")
s=s.replace('<h2>Vết Thánh · T / M / B</h2>','<h2>Vết Thánh · T / M / B</h2><p>${set.rarity}–${set.maxRarity}★ · <a href="${set.wiki}" target="_blank" rel="noopener noreferrer">Xem bộ gốc trên wiki ↗</a>${set.available?" · Hiệu ứng bên dưới áp dụng trong bản 2D.":" · Chưa mở trong Chương 1; hiệu ứng tham khảo từ HI3."}</p>')
p.write_text(s,encoding='utf-8')
p=root/'loadout.css';s=p.read_text(encoding='utf-8').replace("background-image:url('assets/original-library/equipment-weapon-cores-v1.png');background-size:300% 300%","background-size:200% 200%")
s+='\n.equipment-pane a{color:#dbc193;text-underline-offset:3px}.wiki-meta{border-top:1px solid #ffffff18;padding-top:12px}.core-grid{grid-template-columns:repeat(4,1fr)}.item-card.locked{opacity:.75}.item-card.locked small{color:#9a9caa}@media(max-width:650px){.core-grid{grid-template-columns:repeat(2,1fr)}}\n'
p.write_text(s,encoding='utf-8')
p=root/'index.html';s=p.read_text(encoding='utf-8').replace('Đã mở Chương 2 · Nhận bộ Training Memory.','Đã hoàn thành Chương 1 · Arc City đang chờ.').replace('<kbd>E</kbd> Tương tác','<kbd>E</kbd> Tương tác <kbd>R</kbd> Kỹ năng vũ khí').replace('<button data-key="KeyE">TƯƠNG TÁC</button>','<button data-key="KeyE">TƯƠNG TÁC</button><button data-key="KeyR">VŨ KHÍ</button>')
p.write_text(s,encoding='utf-8')
for name in ['test-systems.mjs','test-ui-modes.cjs','test-v4.cjs']:
 p=root/'tools'/name;s=p.read_text(encoding='utf-8')
 for old,new in [('cloth_resolve','armored_bracers'),('training_fists','cas_ii_namiko'),('training_memory','attila')]:s=s.replace(old,new)
 p.write_text(s,encoding='utf-8')
print('Copied six redraw atlases; updated equipment UI and test IDs.')
