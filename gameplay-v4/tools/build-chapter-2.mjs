import fs from 'node:fs';
import path from 'node:path';

// Chapter 2 keeps global metre coordinates so an old Chapter 1 save can continue
// without resetting its inventory, journal, or checkpoint history.
const root=path.resolve(import.meta.dirname,'..');
const scenes=[
  {from:2000,to:2220,id:'arc-roofs',name:'2.1 · MÁI NHÀ ARC CITY',objective:'Theo tín hiệu qua những mái nhà mưa',line:'Mưa, neon, mái nhà trơn. Old Timer, đừng tụt lại đấy.'},
  {from:2220,to:2460,id:'neon-loop',name:'2.2 · PHỐ NEON BỊ LẶP',objective:'Tìm bảng hiệu nhiễu · Dùng Kiếm phá nút lặp',line:'Tiệm bánh bao kia... ta vừa chạy ngang qua rồi.'},
  {from:2460,to:2630,id:'spear-sky',name:'2.3 · KÝ ỨC TRÊN KHÔNG',objective:'Nhận Thương rồi đánh bầy quái bay',line:'Kiếm không với tới. Thứ trên trời kia đang gọi ta à?'},
  {from:2630,to:2890,id:'heliopolis',name:'2.4 · ĐƯỜNG HẦM HELIOPOLIS',objective:'Né hơi nóng · Đâm xuyên giáp quái cơ giới',line:'Đường hầm Schicksal. Đèn kia chớp cùng nhịp với ký ức.'},
  {from:2890,to:3200,id:'schicksal-train',name:'2.5 · NÓC TÀU SCHICKSAL',objective:'Giữ đà giữa gió mạnh · Né thùng hàng',line:'Tàu đã cất cánh. Lần này đừng để gió thổi bay ta!'},
  {from:3200,to:3240,id:'chariot',name:'GLITCH CHARIOT',objective:'Thương phá giáp · Kiếm phản lao · Né cú đáp',line:''}
];
const opening=[
 ['Senti','...Rơi đúng lên mái nhà. Arc City. Mưa lạnh hơn Nagazora nhiều.'],
 ['Fu Hua','Cậu vừa kéo cả hai ra khỏi một ký ức. Tín hiệu trước mặt là gì?'],
 ['Senti','Chưa biết. Nhưng ký ức của Old Timer đang bị ai đó lấy đi. Chạy hay đứng đây?'],
 ['Fu Hua','...Chạy. Tôi theo sau.'],
 ['Senti','Được! Nhưng đừng có giành mất pha ra mắt của ta.']
];
const arenas=[
 {m:2200,name:'MƯA TRÊN MÁI',waves:[['enemy','knight'],['elite','enemy']],before:[['Fu Hua','Hai phía. Bên trái tôi chặn, cậu giữ lối đi.'],['Senti','Cô vẫn chưa nhớ ta, nhưng ăn ý thì còn đấy!']],after:[['Senti','Oi! Bánh bao hấp! Dừng lại chút—'],['Fu Hua','Không.'],['Senti','Old Timer nhẫn tâm quá!']]},
 {m:2560,name:'BẦY CÁNH KÝ ỨC',waves:[['flyer','flyer'],['flyer','machine','flyer']],before:[['Senti','Đồ chơi mới! Giờ thì đừng hòng bay khỏi tầm với.'],['Fu Hua','Thương dài hơn Kiếm. Nhắm vào lõi của chúng.']],after:[['Fu Hua','Trên trời còn tiếng cánh. Tín hiệu đi vào Heliopolis.'],['Senti','Đâm thủng giáp rồi đi tiếp.']]},
 {m:2850,name:'CHỐT CHẶN HELIOPOLIS',waves:[['machine','machine'],['elite','machine']],before:[['Fu Hua','Hơi nóng theo nhịp đèn. Đợi tắt rồi băng qua.'],['Senti','Ta chọn cách nhanh hơn: đánh vỡ cả cỗ máy!']],after:[['Senti','Tàu vận chuyển vừa khởi động. Lên nóc tàu trước khi nó bay!'],['Fu Hua','Cẩn thận gió ngược ở khoang hàng.']]},
 {m:3200,name:'GLITCH CHARIOT',waves:[['machine','flyer'],['chariot']],before:[['Fu Hua','Khiên của Chariot nối với ba trụ trên sàn. Đánh nó trực tiếp lúc này vô ích.'],['Senti','Trụ đỏ dùng Kiếm, xanh dùng Thương, tím thì lướt xuyên bằng L. Ta nhìn thấy đường dẫn.'],['Fu Hua','Khi cả ba trụ tắt, Thương mới xuyên được giáp. Phản cú lao bằng Kiếm để mở lõi.'],['Senti','Hai lớp phòng thủ, một lõi. Ta sẽ bóc từng lớp.']],after:[['Senti','Ta không cần Old Timer cứu đâu nhé.'],['Fu Hua','Tôi biết.'],['Senti','...Nhưng cảm ơn.'],['Ký ức chính #2','Fu Hua ngồi một mình trong phòng tối. “...Ta đã sống bao lâu rồi? Và tại sao ta vẫn nhớ?”'],['Fu Hua','Helheim Labs... Cơ sở đó đã đóng cửa từ lâu. Tàu đang tự đổi hướng.'],['Senti','Nghe sặc mùi cạm bẫy.'],['Fu Hua','Đúng vậy.'],['Senti','Quá tuyệt. Ta thích bẫy!'],['Hệ thống tàu','Ký ức #2,891 · Mẫu thí nghiệm: Fu Hua · Trạng thái: Đang hiệu đính.']]}
];
const beats=[
 [2055,'arc-rain','Senti','Arc City ban đêm. Cảnh này chắc đẹp lắm nếu ta không bị truy sát.'],
 [2115,'hua-distance','Fu Hua','Tôi nhớ đường phố này. Nhưng không nhớ đã cùng cậu đi qua.'],
 [2280,'bun-sign','Senti','Tiệm bánh bao? Mùi thơm đó là thật hay là ký ức?'],
 [2340,'neon-repeat','Senti','Cùng cái đèn, cùng vũng nước. Lối này đang chạy thành vòng.'],
 [2410,'after-sign','Fu Hua','Một bảng hiệu giữ nhịp lặp. Phá nó rồi đường mới mở.'],
 [2510,'spear-catch','Senti','Kiếm không với tới bầy đó. Cây Thương từ mảnh ký ức này thì khác!'],
 [2680,'tunnel-warning','Fu Hua','Đèn vàng nháy trước khi ống phun. Nhìn nhịp rồi đi.'],
 [2950,'train-wind','Senti','Old Timer, gió mạnh thì núp sau ta. Ta có Thương giữ thăng bằng!'],
 [3070,'train-signal','Fu Hua','Tín hiệu ở đầu tàu. Có ai đó đang viết lại ký ức của tôi.']
].map(([m,id,speaker,text])=>({m,id:`ch2-${id}`,speaker,text}));
const investigations=[
 {m:2110,id:'ch2-roof-signal',title:'ĂNG-TEN ĐỨT',lines:[['Dấu vết','Một ăng-ten gãy vẫn phát tín hiệu ký ức từ Heliopolis.'],['Fu Hua','Đây là đường truyền Schicksal. Có người đang dùng nó để kéo ký ức ra khỏi thành phố.'],['Senti','Vậy ta lần theo dây. Người lấy trộm phải ở phía trước.']]},
 {m:2740,id:'ch2-hangar-log',title:'NHẬT KÝ HÀNG HÓA',lines:[['Nhật ký','“Mẫu ký ức F.H. — chuyển sang kho lưu trữ trên tàu. Quyền truy cập: MNEMOSYNE.”'],['Senti','Tên đó lại xuất hiện. Old Timer, cô nhớ gì về nó không?'],['Fu Hua','Không. Và chính chuyện đó làm tôi lo.']]},
 {m:3075,id:'ch2-train-console',title:'BẢNG ĐIỀU HƯỚNG',lines:[['Hệ thống','Đích đến ban đầu: Arc City. Đích đến mới: Helheim Labs. Lệnh chuyển hướng không có chữ ký.'],['Fu Hua','Tàu đã bị chiếm quyền. Chúng ta đang bị dẫn tới chỗ họ muốn.'],['Senti','Cứ tới. Ta sẽ khiến kẻ đó phải lộ mặt.']]}
];
// These five beats are compulsory. Optional E-clues add detail, but the core
// relationship and mystery never depend on the player finding a tiny hotspot.
const cutscenes=[
 {m:2240,id:'ch2-roof-choice',visual:'rooftop',title:'MƯA TRÊN ARC CITY',lines:[
  ['Fu Hua','Tôi biết mái nhà này. Bậc thang thứ ba sẽ sụp.'],['Senti','Cô nhớ cả bậc thang, nhưng không nhớ lần ta kéo cô qua nó?'],['Fu Hua','...Không. Tôi xin lỗi.'],['Senti','Đừng xin lỗi. Cứ chỉ đường. Ta sẽ nhớ phần còn lại cho cả hai.']]},
 {m:2420,id:'ch2-loop-proof',requiresNode:'neon-sign',visual:'loop',title:'BẢNG HIỆU KHÔNG GHI TÊN',lines:[
  ['Dữ liệu bảng đèn','Bản ghi F.H. được phát lại 72 lần. Người đi cùng: [KHÔNG XÁC ĐỊNH].'],['Senti','Ta đứng ngay cạnh cô ấy. Vậy mà hệ thống vẫn xóa tên ta.'],['Fu Hua','Tôi có thể chưa nhớ, nhưng tôi đang thấy cậu ở đây.'],['Senti','...Ừ. Thế là đủ để đi tiếp. Tìm kẻ viết bản ghi này.']]},
 {m:2530,id:'ch2-spear-memory',requiresSpear:true,visual:'spear',title:'CÁCH CẦM THƯƠNG',lines:[
  ['Fu Hua','Tay trái thấp hơn một chút. Nếu không, khi đâm sẽ hở sườn.'],['Senti','Cô vừa sửa tư thế ta mà không cần nghĩ.'],['Fu Hua','Cơ thể nhớ trước cả trí óc... Tôi đã dạy cậu?'],['Senti','Nhiều lần. Nhưng ta thích nghe cô nói lại.']]},
 {m:2810,id:'ch2-cargo-truth',visual:'archive',title:'LỆNH VẬN CHUYỂN',lines:[
  ['Máy ghi hàng hóa','Mẫu F.H. · ký ức tách khỏi vật chủ · điểm nhận: Helheim Labs · người duyệt: MNEMOSYNE.'],['Fu Hua','Lệnh này mang chữ ký của tôi. Nhưng tôi chưa từng ký.'],['Senti','Kẻ đó không chỉ đánh cắp ký ức. Nó đang dùng giọng và tên cô để làm việc.'],['Fu Hua','Vậy tại Helheim sẽ có câu trả lời. Hoặc một cái bẫy.'],['Senti','Ta sẽ đi cùng cô vào cả hai.']]},
 {m:3130,id:'ch2-train-vow',visual:'train',title:'TÀU KHÔNG THỂ QUAY ĐẦU',lines:[
  ['Hệ thống tàu','Điều hướng đã khóa. Đích đến: Helheim Labs. Thời gian va chạm với khoang nhận: 04:12.'],['Fu Hua','Nếu ký ức đó đúng, nơi này giữ nhiều thứ tôi đã cố quên.'],['Senti','Cô không cần kể trước khi sẵn sàng.'],['Fu Hua','Cậu vẫn muốn đi tiếp?'],['Senti','Ta đã lên tàu rồi, Old Timer. Ta không xuống một mình.']]}
];
const memories=[
 {id:'hidden-3',m:2391,y:403,title:'BẢNG HIỆU BÁNH BAO',requiresNode:'neon-sign',lines:[['Ký ức ẩn #3','Sau một buổi tập, Senti bày sách và vũ khí khắp phòng. Fu Hua lặng lẽ dọn, thở dài rồi cười rất khẽ.'],['Senti','Hóa ra Old Timer có cười. Cô ấy chẳng bao giờ chịu nhận.'],['Dấu ấn ký ức','Một lát cắt bình yên đã được giữ lại trong nhật ký.']]},
 {id:'hidden-4',m:2940,y:392,title:'ĐUÔI TÀU TRONG GIÓ',requiresDash:true,lines:[['Ký ức ẩn #4','Fu Hua sửa tư thế Thương cho Senti. Senti ngáp dài, nhưng vẫn lặp lại từng động tác cô ấy vừa dạy.'],['Fu Hua','...Hình ảnh này. Tôi đã từng dạy cậu sao?'],['Senti','Nhiều hơn một lần. Cô sẽ nhớ lại.']]}
];
const patrols=[
 {m:2070,kind:'enemy'},{m:2150,kind:'knight'},{m:2290,kind:'enemy'},{m:2430,kind:'elite'},
 {m:2520,kind:'flyer'},{m:2615,kind:'flyer'},{m:2710,kind:'machine'},{m:2790,kind:'machine'},
 {m:2940,kind:'flyer'},{m:3020,kind:'machine'},{m:3120,kind:'flyer'}
];
const kinds=['gap','upper','gate','stairs','breakable','gap','moving','skirmish','gate','upper'];
const placementMeters=[2025,2060,2090,2120,2160,2240,2270,2310,2350,2410,2465,2500,2590,2635,2670,2700,2745,2780,2880,2910,2955,2990,3030,3065,3100,3135];
const authoredPatterns=placementMeters.map((m,i)=>{
 const kind=kinds[i%kinds.length],hard=i>15&&['gap','moving'].includes(kind),p={id:`ch2-layout-${i}`,length:1450,difficulty:hard?'hard':'normal',kind,region:scenes.find(s=>m>=s.from&&m<s.to)?.id||'arc-roofs'};
 if(['gap','moving'].includes(kind)){p.gap={offset:660,ratio:kind==='moving'?.74:.58+(i%3)*.04};if(kind==='moving')p.intermediate=true;}
 if(['stairs','upper','skirmish'].includes(kind)){p.heights=[55,105,150];p.spacing=160;p.blockWidth=140;if(kind==='skirmish')p.enemyOffset=1100;}
 if(kind==='gate'){p.offset=640;p.width=170;p.clearance=74;}
 if(kind==='breakable')p.offset=650;
 return p;
});
const level={chapter:2,title:'THÀNH PHỐ KHÔNG NGỦ, KÝ ỨC KHÔNG DỪNG',lengthMeters:3240,pixelsPerMeter:64,targetMinutes:[10,14],physics:{speed:320,backSpeed:230,gravity:1800,jumpVelocity:680,groundY:490},
 opening,scenes,arenas,checkpoints:[2000,2140,2230,2400,2480,2650,2870,3000,3170],placements:placementMeters.map((m,i)=>({m,pattern:`ch2-layout-${i}`})),authoredPatterns,patrols,
 beats,investigations,cutscenes,memories,nodes:[{id:'neon-sign',m:2385,order:0,hp:80}],spearMemory:{m:2485,y:385},
 gearRewards:{},blueprintRewards:{},gearStories:{'3200':[['Tàn dư của Chariot','Giáp ảo tan đi, để lại Hợp kim và Tinh thể trong khoang hàng. Ký ức chính #2 mở ra sau đó, sâu hơn bất cứ món trang bị nào.']]},
 sources:['HoS_Script_Ch1-4.md · Chương 2','HoS_Story_Bible.md · Arc City & Heliopolis','HoS_Game_Design_Doc.md · Glitch Chariot']};
fs.writeFileSync(path.join(root,'level-chapter-2.json'),JSON.stringify(level,null,2)+'\n');
