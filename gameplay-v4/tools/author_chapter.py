from pathlib import Path
import json,copy
R=Path(__file__).resolve().parents[1]
d=json.loads((R/'level-chapter-1.json').read_text(encoding='utf-8-sig'));lib=json.loads((R/'endless-patterns.json').read_text(encoding='utf-8-sig'))
d['revision']='4-narrative-adventure'
d['opening']=[['Senti','...Chỗ này là đâu? Tại sao trông quen vậy?'],['Senti','...Mà khoan, tại sao ta lại hỏi câu đó?'],['Senti','Này. Con quái đằng kia. Nhìn ta này.'],['Senti','...Đi xuyên qua luôn? Ta đang đứng ngay đây mà.'],['Senti','Bình tĩnh. Gọi kiếm ra, đập một trận là chúng sẽ—'],['Senti','...Tay ta?'],['Senti','Không. Ta vẫn ở đây. Thanh kiếm trong khối ký ức kia... ta còn chạm được vào nó.']]
d['openingStaging']=['wind','wake','ignored','ghost','summon','hand-glitch','crystal']
af={a['m']:a for a in d['arenas']}
af[100]['before']=[['Senti','À. Giờ thì các ngươi thấy ta rồi?'],['Senti','Được. Nhớ cho kỹ gương mặt này!']]
af[100]['after']=[['Senti','Đúng rồi! Không ai được phép phớt lờ ta!'],['Senti','...Tiếng động vừa rồi là từ trên mái nhà?'],['Senti','Cách ra đòn đó... Không thể nhầm được. Bà cụ!']]
af[450]['before']=[['Senti','Tiếng đánh nhau ở phía bên kia. Đường dưới sập mất rồi.'],['Senti','Ngươi định chặn ta? Cứ lao tới đi. Ta đang chờ đấy.']]
af[450]['after']=[['Senti','Trông hung hăng vậy mà chỉ biết lao thẳng.'],['Senti','Bà cụ! Nghe thấy ta không?'],['Senti','...Sao lại im rồi?']]
af[900]['before']=[['Senti','Vừa nãy tòa nhà đó còn nguyên. Chớp mắt một cái đã biến mất.'],['Senti','Không phải thành phố đang sụp... có thứ gì đó đang làm nó quên mất hình dạng của mình.'],['Senti','Giống bàn tay ta lúc nãy.']]
af[900]['after']=[['Senti','Những mảnh này có hơi ấm. Chúng không chỉ là đá vụn.'],['Senti','Nếu thành phố còn nhớ được một căn bếp... nó cũng phải nhớ bà cụ ở đâu chứ.'],['Senti','Đèn đỏ phía trước. Ta đã nhìn thấy nó rồi.']]
af[1300]['before']=[['Senti','Bà cụ! Cuối cùng cũng—'],['Fu Hua · Vọng ảnh','...Còn một đợt nữa.'],['Senti','Đằng sau! BÀ CỤ!'],['Fu Hua · Vọng ảnh','...Còn một đợt nữa.'],['Senti','Không. Vừa nãy bà ấy đã ngã xuống. Sao lại đứng đúng chỗ đó?'],['Senti','Ta sẽ dọn đám quái này trước. Lần này bà không phải đánh một mình.']]
af[1300]['after']=[['Senti','Dừng lại rồi... Bà cụ, nhìn ta đi.'],['Senti','Chưa được. Ba vết nứt vẫn đang kéo bà ấy về chỗ cũ.'],['Senti','Được thôi. Một nút không đủ thì ta phá cả ba.']]
af[1700]['before']=[['Fu Hua · Vọng ảnh','...Đừng lại gần. Nơi này...'],['Senti','Bà vừa nghe thấy ta, đúng không?'],['Senti','Đừng biến mất nữa. Ta sắp tới rồi.']]
af[1700]['after']=[['Senti','Ta đã thấy bà cụ kiệt sức đủ rồi.'],['Senti','Lần này cứ để ta mở đường.']]
af[2000]['before']=[['Senti','Chỉ còn ngươi đứng giữa ta và bà ấy.'],['Senti','Một đống ký ức ghép lại. Tránh đường ra!']]
af[2000]['after']=[['Senti','Thấy chưa? Chưa cần đủ đồ ta đã vô địch rồi!'],['Senti','...Bà cụ? Đứng dậy được không?'],['Fu Hua','...Cậu là ai?'],['Senti','...'],['Senti','Bà cụ... không nhớ ta sao?'],['Fu Hua','Ta...'],['Ký ức chính #1','Bụi đá. Một bàn tay vươn xuống. Một bàn tay nắm lấy. Gương mặt cả hai người đều nhòe đi.'],['Senti','Đừng cố. Bà đang đau.'],['Fu Hua','Nơi này... là ký ức. Không phải thực tại.'],['Senti','Vậy thì ta sẽ đưa bà ra ngoài.'],['Senti','Không sao. Bà cụ sẽ nhớ ra thôi. Mà nếu không nhớ... ta sẽ ép bà cụ nhớ!'],['Fu Hua','...Cậu lúc nào cũng nói như vậy sao?'],['Senti','Sau này bà sẽ biết. Đi thôi.'],['Giọng nói lạ','Ký ức #7,203. Sai lệch phát hiện. Bắt đầu hiệu đính.']]
beats=[
 (25,'after-sword','Senti','Đỏ mắt lên hết rồi à? Vậy là thanh kiếm kéo ta trở lại với thế giới này.'),
 (68,'self-check','Senti','Tay vẫn còn. Kiếm vẫn còn. Ta cũng vẫn còn. Tốt.'),
 (155,'voice','Senti','Tiếng quyền đó... mỗi lần dạy ta tập, bà cụ đều ra đòn như vậy.'),
 (225,'shortcut','Senti','Đường dưới bị bịt kín. Lên mái nhà. Ta không định đợi thành phố này sập xong.'),
 (310,'empty-city','Senti','Không người. Không tiếng xe. Chỉ có quái và tiếng đánh nhau ở phía trước...'),
 (405,'roof','Senti','Bà cụ! Nếu nghe thấy thì trả lời ta một tiếng!'),
 (505,'quiet','Senti','...Lại im rồi. Đừng nói là ta vừa nghe nhầm.'),
 (605,'crumble','Senti','Đứng lâu là nền vỡ. Thành phố này đúng là không muốn giữ khách.'),
 (720,'glimpse','Senti','Áo trắng ở bên kia! Khoan— biến mất rồi?'),
 (810,'fracture','Senti','Con đường vừa nhấp nháy. Không phải mắt ta. Là chính nó.'),
 (980,'kitchen-echo','Senti','Những thứ nhỏ nhặt thế này mà cũng bị nhốt lại... ai lại muốn giữ cả một căn bếp cháy?'),
 (1080,'warmth','Senti','Ta nhớ cảm giác này. Không nhớ vì sao. Nhưng ta biết nó thuộc về bà cụ.'),
 (1190,'redlight','Senti','Đèn đỏ. Vết nứt trên biển báo. Ta đã đi qua chỗ này rồi.'),
 (1370,'first-break','Senti','Một vết nứt đã biến mất. Lần này không còn quay lại từ đầu nữa.'),
 (1480,'resolve','Senti','Bà cụ cứ thích tự mình gánh hết. Đến cả trong ký ức cũng vậy.'),
 (1570,'three-locks','Senti','Ba nút còn lại đang nối vào bà ấy. Phải chém theo dòng sáng, từ ngoài vào trong.'),
 (1640,'heard','Senti','Bà ấy vừa quay đầu. Ta thấy rồi. Chỉ cần thêm một chút nữa.'),
 (1800,'collapse','Senti','Nút vỡ rồi, cả Nagazora cũng bắt đầu tan theo. Không được dừng.'),
 (1900,'last','Senti','Ta tới đây. Lần này bà không phải đứng dậy một mình nữa.')]
d['beats']=[dict(m=m,id=id,speaker=sp,text=text) for m,id,sp,text in beats]
d['investigations']=[
 {'m':285,'id':'broken-sign','title':'BIỂN CHỈ ĐƯỜNG BỊ XÓA','lines':[['Senti','Tên đường bị xóa sạch. Nhưng vết nứt thì còn.'],['Senti','Có thứ gì đó đang sửa nơi này... mà sửa chẳng ra hồn.']]},
 {'m':745,'id':'white-feather','title':'DẤU VẾT QUEN THUỘC','lines':[['Senti','Dấu quyền trên cột. Mép vỡ còn mới.'],['Senti','Là bà ấy. Lần này chắc chắn.']]},
 {'m':1160,'id':'clock','title':'CHIẾC ĐỒNG HỒ DỪNG LẠI','lines':[['Senti','Kim giây cứ quay về cùng một chỗ.'],['Senti','Nếu lát nữa lại gặp cái đèn đỏ ấy... ta biết phải tìm gì rồi.']]}]
for s in d['scenes']:
 s['objective']={'street':'Tìm dấu hiệu chứng minh mình vẫn tồn tại','roofs':'Lần theo tiếng quyền trên những mái nhà sụp','fracture':'Theo dấu Fu Hua qua các ký ức đang bị xóa','loop':'Cứu Fu Hua khỏi cảnh chiến đấu lặp lại','escape':'Cắt ba nút đang giữ Fu Hua · Chạy khỏi đổ nát','husk':'Giữ lối ra cho Fu Hua · Phá kẻ chặn đường'}[s['id']]
# Author each placement as a distinct layout variant instead of replaying a short cyclic template.
base={p['id']:p for p in lib['patterns']};new=[]
for i,pos in enumerate(d['placements']):
 m=pos['m'];p=copy.deepcopy(base[pos['pattern']]);p['id']=f'ch1-authored-{i:02d}';p['label']=f'Nagazora encounter {i+1}'
 if p['kind'] in ('stairs','upper'):
  choices=[[42,92],[55,105,145],[38,82,128,160],[65,115,75],[48,108,148,95]]
  p['heights']=choices[i%len(choices)];p['spacing']=145+(i%3)*20;p['blockWidth']=p['spacing']
 if p.get('gap'):p['gap']['ratio']=[.55,.62,.68][i%3] if p['difficulty']!='hard' else .82
 if p['kind']=='gate':p['width']=140+(i%4)*25
 p['region']='roofs' if 400<m<800 else 'fracture' if 800<m<1250 else 'escape' if m>1600 else 'street'
 if p['kind']=='breakable':p['offset']+=i%3*45
 new.append(p);pos['pattern']=p['id']
d['authoredPatterns']=new
for a in d['arenas']:
 if a['m']==450:a['waves']=[['elite'],['elite','enemy']]
 if a['m']==900:a['waves']=[['enemy','knight'],['knight','enemy']]
 if a['m']==1700:a['waves']=[['elite','knight'],['enemy','enemy']]
# Item rewards are earned in chapter gameplay; shapes and equipment cores are separate.
d['gearRewards']={'100':['cloth_resolve','training_memory:T'],'450':['training_memory:M'],'900':['training_memory:B'],'2000':['training_fists','nagazora_survivor:M']}
(R/'level-chapter-1.json').write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
print('Authored:',len(new),'layouts,',len(beats),'ambient story beats, 3 investigations, expanded cinematic scenes')
