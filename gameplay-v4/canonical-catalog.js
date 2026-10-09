// Names, silhouettes and reference descriptions checked against Honkai Impact 3 Wiki.
// Story rewards and the level-scaled base stats belong to this 2D adaptation.
const wiki=name=>'https://honkaiimpact3.fandom.com/wiki/'+name.replaceAll(' ','_');
export const CORES=[
 {id:'armored_bracers',name:'Armored Bracers',rarity:1,maxRarity:2,max:20,atk:78,crt:8,passive:'Găng tay cơ bản; không có kỹ năng chủ động hay nội tại riêng.',source:'Story · Trận đầu Chương 1',available:true},
 {id:'cas_ii_namiko',name:'CAS-II Namiko',rarity:3,maxRarity:4,max:35,atk:165,crt:12,passive:'Humidifier tăng sát thương vật lý. Wander tạo sóng xung kích theo đường thẳng.',source:'Bàn rèn · Thiết kế tại trạm cứu hộ Chương 1',available:true,runtime:'Vật lý +15%. R: sóng xung kích 450% ATK, hồi 10 giây. Bản 2D chưa dùng SP.'},
 {id:'grips_tai_xuan',name:'Grips of Tai Xuan',rarity:4,maxRarity:5,max:50,atk:267,crt:34,passive:'Yin Yang gọi ba kiếm ảnh Hỏa và Time Lock. Unlimited cộng sát thương toàn phần từ các loại đòn khác nhau.',source:'Bàn rèn · Bài học thứ tám tại Mount Taixuan',available:true,runtime:'ATK/CRT cao hơn; hiệu ứng kiếm ảnh và Time Lock được chuyển thành chỉ số chiến đấu trong bản 2D.'},
 {id:'keys_oblivion',name:'Keys of Oblivion',rarity:4,maxRarity:5,max:50,atk:290,crt:18,passive:'Iron Will tạo Mind Mark để đòn Combo hồi SP. Lingering Thought hỗ trợ sát thương vật lý của đội khi người cầm ở ngoài sân.',source:'Bàn rèn · Bản thiết kế sau Jizo, Chương 6',available:true},
 {id:'domain_sentience',name:'Domain of Sentience',rarity:5,maxRarity:6,max:65,atk:400,crt:48,passive:'PRI-ARM của Keys of Oblivion. Tăng Crit Rate, tăng vật lý trong Herrscher form, giữ cơ chế Mind Mark và hỗ trợ đội.',source:'Bàn rèn PRI-ARM · Hạ Mnemosyne, Chương 7',available:true},
 {id:'infinite_intimidator',name:'Infinite Intimidator',rarity:4,maxRarity:5,max:50,atk:298,crt:13,passive:'Surprise Strike ném gạch gây sát thương diện rộng. Với HoS, trúng đích hồi SP, gây Coma và đổi chuỗi đánh trong burst mode.',source:'Bàn rèn · Lời Cám Dỗ Ngược, Chương 7',available:true},
 {id:'incredibly_infinite_intimidator',name:'Incredibly Infinite Intimidator',rarity:5,maxRarity:6,max:65,atk:436,crt:23,passive:'PRI-ARM của Infinite Intimidator. Unparalleled ném gạch; Regal tăng đòn vũ khí kế tiếp, hồi HP/SP trong burst mode.',source:'Bàn rèn PRI-ARM · Hoàn thành Chương 7',available:true}
].map((c,index)=>({...c,index,crit:0,wiki:wiki(c.name),art:index<4?'weapons-base.png':'weapons-advanced.png',artIndex:index<4?index:index-4}));
export const SETS=[
 {id:'attila',name:'Attila',rarity:3,maxRarity:4,maxLevel:35,file:'attila.png',pieceFiles:['attila-T.png','attila-M.png','attila-B.png'],available:true,
  stats:[{hp:338,atk:59,def:75},{hp:338,def:75,crt:3},{hp:338,atk:29,def:75}],
  parts:['Combo >10: tốc chạy +15%.','Combo >20: DEF +41%.','Combo >30: sát thương vật lý +31%.'],
  two:'Crit DMG +30%. Phần tăng SP cho MECH không áp dụng cho Senti (BIO).',three:'CRT +40% trong chiến đấu.',source:'Story · Nhận T; rèn M/B từ bản thiết kế',pieceNames:['Attila (T)','Attila (M)','Attila (B)']},
 {id:'marco_polo',name:'Marco Polo',rarity:4,maxRarity:5,maxLevel:50,file:'marco-polo.png',available:true,
  stats:[{hp:315,atk:102,def:67},{hp:458,def:154,crt:8},{hp:386,atk:56,def:44,crt:8}],
  parts:['Vật lý +15%; combo >30 cộng thêm 15%.','Crit DMG +25%; combo >30 cộng thêm 25%.','Crit Rate +11%. Phần hồi SP của bản gốc chưa dùng trong bản 2D.'],
  two:'Combo >25: đòn thứ ba gây thêm 250% ATK vật lý, hồi 5 giây.',three:'Combo >25: hồi 200 HP mỗi 5 giây.',source:'Story · Hai ký ức ẩn + Nagazora Husk',pieceNames:['Marco Polo (T)','Marco Polo (M)','Marco Polo (B)']},
 {id:'dirac',name:'Dirac',rarity:4,maxRarity:5,maxLevel:50,file:'dirac.png',available:true,
  stats:[{hp:386,atk:113,def:66},{hp:483,def:177,crt:8},{hp:398,atk:60,def:88,crt:14}],
  parts:['Anti-Matter: tăng Crit Rate; vào sân hoặc dùng kỹ năng vũ khí cho thêm Crit Rate tạm thời.','Path Integral: tăng Total DMG cho Ultimate/Burst; tăng dần trong burst mode.','Dawn: tăng vật lý và phục hồi SP có điều kiện.'],
  two:'Kết hợp các hiệu ứng của bộ để tăng Total DMG và kéo dài thời gian hiệu lực.',three:'Hiệu ứng Impair gắn với trạng thái đầy đủ của bộ.',source:'Bàn rèn · Dữ liệu Helheim sau Chương 3',pieceNames:['Dirac (T)','Dirac (M)','Dirac (B)']},
 {id:'shattered_swords',name:'Shattered Swords',rarity:4,maxRarity:5,maxLevel:50,file:'shattered-swords.png',available:true,
  stats:[{hp:410,atk:105,def:88},{hp:386,def:177,crt:21},{hp:386,atk:64,def:22,crt:18}],
  parts:['Raksha: vật lý +20%; Ultimate Evasion cộng thêm 20% trong 15 giây.','Sushang: vật lý +30%; giảm sát thương nhận trong burst mode.','Empyrea Phoenix: Combo ATK tăng Crit DMG toàn đội trong 15 giây.'],
  two:'Herrscher form tăng Crit DMG đội; đánh trúng tích dấu ấn, đủ 15 tầng gây nổ vật lý.',three:'Vào sân tăng Crit Rate đội; đòn trong Herrscher form tích Total DMG đội.',source:'Bàn rèn · Mảnh Kiếm Vỡ từ Thái Hư và Endless',pieceNames:['Raksha (T)','Sushang (M)','Empyrea Phoenix (B)']},
 {id:'pericles',name:'Pericles',rarity:4,maxRarity:5,maxLevel:50,file:'pericles.png',available:true,
  stats:[{hp:386,atk:113,def:44},{hp:483,def:199,crt:8},{hp:386,atk:64,def:44,crt:16}],
  parts:['Tăng sát thương vật lý và Total DMG trong burst mode.','Tăng Crit Rate và sát thương Ultimate/Burst.','Kỹ năng vũ khí ngoài burst mode chuẩn bị bonus cho lần burst tiếp theo.'],
  two:'Maritime Empire: Ultimate tạo cửa sổ tăng vật lý và Crit DMG.',three:'Golden Era: tăng Crit DMG; tiêu SP tăng vật lý; tăng Crit Rate khi chiến đấu một mình.',source:'Bàn rèn hậu truyện · Nguyệt Quế Hoàng Kim từ Endless',pieceNames:['Pericles (T)','Pericles (M)','Pericles (B)']}
].map(s=>({...s,wiki:wiki(s.name)}));
export const LEGACY_CORES={cloth_resolve:'armored_bracers',training_fists:'cas_ii_namiko',tai_xuan:'grips_tai_xuan',incredibly_infinite:'incredibly_infinite_intimidator'};
export const LEGACY_SETS={training_memory:'attila',nagazora_survivor:'marco_polo',taixuan_companions:'dirac',sovereign_sentience:'shattered_swords',shattered_memories:'pericles'};
export const migrateId=id=>{if(typeof id!=='string'||!id)return null;if(Object.hasOwn(LEGACY_CORES,id))return LEGACY_CORES[id];const [set,slot]=id.split(':');return Object.hasOwn(LEGACY_SETS,set)?LEGACY_SETS[set]+':'+slot:id};
