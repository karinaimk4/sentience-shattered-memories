const CHAPTERS=[
 ['Tỉnh Dậy Giữa Nagazora','Thanh Kiếm Thức Tỉnh','Chariot Giữa Đổ Nát','Thực Tại Rạn Nứt','Ngã Tư Lặp Lại','Nagazora Husk','Bếp Thái Hư','Cơn Mưa Đầu Tiên','Không Ai Nhớ Ta'],
 ['Mưa Trên Arc City','Bảng Hiệu Không Ghi Tên','Cách Cầm Thương','Lệnh Vận Chuyển','Tàu Không Thể Quay Đầu','Glitch Chariot','Bảng Hiệu Bánh Bao','Đuôi Tàu Trong Gió','Thành Phố Không Ngủ'],
 ['Bể Chứa Ký Ức','Kho Lưu Trữ','Lối Đi Của Phù Hoa','Phù Hoa Mở Đường','Sân Bay Schicksal','Hồ Sơ Bị Xóa Lần Thứ 28','Tin Nhắn Kỹ Thuật Viên','Hai Bí Mật Trong Phòng Lab','Aesir Heimdall'],
 ['Bão Tuyết Babylon','Hành Lang Lồng Ấp','Xích Nhận','Qua Vực','Lõi Babylon','Những Cái Tên Bị Xóa','Ấm Trà Chưa Nguội','Hai Vật Nhỏ Trong Tuyết','Parvati Hai Mạng'],
 ['Thái Hư Hoàn Hảo','Sân Sau Không Còn Yên Tĩnh','Lời Cảnh Báo Của Tần Tố Y','Bảy Lời Khai','Đêm Không Tiếng','Nhát Kiếm Đã Xảy Ra','Bảy Trận Một Người','Thất Kiếm Trận','Người Không Có Khuyết Điểm'],
 ['Yên Lặng Trong Biển Lượng Tử','Món Quà Không Gắp Được','Kolosten · Lựa Chọn Cũ','Ký Ức Chồng Lên Ký Ức','Từ Chối Hy Sinh','Bong Bóng Đen','Hai Đường Gặp Lại','Jizo · Nhịp Ba','Ta Là Ai · Ta Đã Quên Gì'],
 ['Chiếc Kẹp Tóc','Bình Minh Trên Núi','Sáu Bàn Ký Ức','Bữa Cơm Khét Lẹt','Một Thế Giới Là Lăng Mộ','Bát Nước Đã Đổ','Lời Cám Dỗ Ngược','Chém Đứt Sự Hoàn Hảo','Ký Ức #0']
];
const SLUGS=[
 ['tinh-day-giua-nagazora','thanh-kiem-thuc-tinh','chariot-giua-do-nat-bg','thuc-tai-ran-nut','nga-tu-lap-lai','nagazora-husk-bg','bep-thai-hu','con-mua-dau-tien','khong-ai-nho-ta'],
 ['mua-tren-arc-city','bang-hieu-khong-ghi-ten','cach-cam-thuong','lenh-van-chuyen','tau-khong-the-quay-dau','glitch-chariot-bg','bang-hieu-banh-bao','duoi-tau-trong-gio','thanh-pho-khong-ngu'],
 ['be-chua-ky-uc','kho-luu-tru','loi-di-cua-phu-hoa','phu-hoa-mo-duong','san-bay-schicksal','ho-so-bi-xoa-lan-28','tin-nhan-ky-thuat-vien','hai-bi-mat-trong-phong-lab','aesir-heimdall-bg'],
 ['bao-tuyet-babylon','hanh-lang-long-ap','xich-nhan','qua-vuc','loi-babylon','nhung-cai-ten-bi-xoa','am-tra-chua-nguoi','hai-vat-nho-trong-tuyet','parvati-hai-mang-bg']
];
const DESCRIPTIONS=[
 [
  'Senti tỉnh dậy giữa ngã tư Nagazora, không biết ai đã gọi tên mình trước khi thành phố im tiếng.',
  'Thanh kiếm kẹt trong bê tông phản ứng với bàn tay Senti như thể nó vẫn nhớ người chủ cũ.',
  'Một cỗ Chariot chặn con phố đổ nát. Trận đánh đầu tiên buộc Senti học cách đọc nhịp máy thay vì chỉ chém tới.',
  'Bầu trời rạn như kính. Senti nhận ra Nagazora đang lặp lại một ký ức đã bị ai đó chỉnh sửa.',
  'Cùng một ngã tư trở lại ba lần, nhưng cái bóng đứng yên. Đường thoát nằm ở chi tiết không chịu lặp.',
  'Nagazora Husk khoác ký ức của người đã mất làm áo giáp. Muốn thắng, Senti phải phá vòng lặp nuôi sống nó.',
  'Mùi cháo từ căn bếp Thái Hư hiện lên giữa vỉa hè. Một ký ức không thuộc về Senti vẫn khiến cô thấy đói.',
  'Senti đứng yên dưới mưa, lần đầu cảm nhận thứ nước không mang theo dữ liệu hay mệnh lệnh.',
  'Đám đông đi xuyên qua cô như một bóng ma. Senti quyết định tự nhớ lấy mình, dù cả thành phố đã quên.'
 ],
 [
  'Mưa Arc City kéo dài suốt đêm. Tín hiệu ký ức bị đánh cắp dẫn Senti lên những mái nhà không ngủ.',
  'Một bảng hiệu trống tên vẫn tỏa mùi bánh hấp. Có người đã xóa chữ, nhưng không xóa được thói quen quay về.',
  'Phù Hoa chỉnh lại tay cầm thương cho Senti. Bài học ngắn ngủi ấy trở thành nhịp phối hợp đầu tiên của hai người.',
  'Lệnh vận chuyển chỉ còn con dấu đỏ và một tuyến tàu tới Helheim. Phần tên hàng đã bị cạo sạch.',
  'Đoàn tàu lao vào đường hầm không có nhánh quay đầu. Senti chọn đứng trên nóc tàu thay vì chờ trong bóng tối.',
  'Glitch Chariot khóa lõi bằng ba trụ tiếp năng lượng. Mỗi trụ đòi một kỹ thuật khác trước khi lớp khiên sụp xuống.',
  'Một chiếc bánh bao nóng khiến cuộc truy đuổi dừng đúng ba phút. Senti tuyên bố đây là quyết định chiến thuật.',
  'Ngồi ở đuôi tàu, Senti nhìn Arc City nhỏ dần và nghe Phù Hoa kể nửa câu chuyện rồi im lặng.',
  'Thành phố vẫn sáng khi chuyến tàu rời ga. Một ô cửa đỏ duy nhất còn giữ tín hiệu của người đã gọi họ đến.'
 ],
 [
  'Những mảnh ký ức trôi trong bể chứa Helheim phản chiếu Senti và một khuôn mặt giống cô đến khó chịu.',
  'Kho lưu trữ dài bất tận cất hàng nghìn hồ sơ Phù Hoa. Mỗi mục đều kết thúc bằng cùng một dấu xóa.',
  'Các cánh cửa thép bị mở bằng một quyền duy nhất. Senti lần theo dấu lõm để tìm người đang đi trước mình.',
  'Phù Hoa phá tung cửa cuối và ánh sáng tràn vào. Senti nhận ra Old Timer đã tự mở đường tới đây một mình.',
  'Hai người băng qua sân bay Schicksal trong đêm, vừa chiến đấu vừa ghép lại những đoạn ký ức bị cắt rời.',
  'Hồ sơ bị xóa lần thứ 28 vẫn còn con số viết tay. Có người đã thử giữ Phù Hoa lại ít nhất hai mươi tám lần.',
  'Tin nhắn của kỹ thuật viên không còn đọc được, nhưng cốc cà phê lạnh cho thấy người ấy đã chờ đến phút cuối.',
  'Dưới hai tấm vải trắng là hai bí mật cùng mang một gương mặt. Phù Hoa và Senti đều không muốn mở trước.',
  'Aesir Heimdall canh cổng sân bay bằng chuỗi kiếm và lõi khóa. Chỉ đòn hỗ trợ đúng nhịp mới mở được sơ hở.'
 ],
 [
  'Bão tuyết Babylon kéo Phù Hoa về quá khứ. Senti bước lên trước, buộc cô ấy tiếp tục đi thay vì biến mất trong tuyết.',
  'Hành lang lồng ấp giữ lại những cái tên từng bị xem như vật thí nghiệm. Mỗi ô kính là một lời khai chưa được nghe.',
  'Sợi xích từng dùng để giam giữ nay quấn quanh tay Senti. Cô chọn biến nó thành thứ kéo Phù Hoa khỏi vực sâu.',
  'Bên kia vực không có cầu. Senti và Phù Hoa phải dùng xích, đà chạy và niềm tin vừa đủ để sang cùng nhau.',
  'Lõi Babylon chiếu lại quá khứ theo thứ tự sai. Hai người phá máy chiếu trước khi ký ức giả trở thành sự thật.',
  'Tên trên các bia dữ liệu đã bị cào mất, nhưng nét tay vẫn khác nhau. Phù Hoa nhớ ra từng người một.',
  'Ấm trà còn ấm trong căn phòng bỏ hoang. Có người đã chuẩn bị hai chén và tin rằng họ sẽ quay lại.',
  'Một chén trà và tấm chăn gấp nằm giữa tuyết. Những vật nhỏ chứng minh ký ức dịu dàng cũng có thể sống sót.',
  'Parvati đứng dậy sau thanh máu đầu, tích nộ và phủ băng toàn sân. Phù Hoa lao vào hỗ trợ khi Senti tưởng trận đấu đã kết thúc.'
 ]
];
const CH5_ART=['courtyard-map.png','courtyard-storyboard.png','senti-saves-fu-hua.png','seven-swords-lineup.png','seven-swords-formation.png','senti-saves-fu-hua.png','seven-swords-lineup.png','seven-swords-formation.png','boss-concepts.png'];
const CH6_ART=['assets/original-library/map-06-sea-of-quanta-v1.png','assets/quanta/ch6-side-keepsakes-v1.png','assets/original-library/map-05-kolosten-storm-v1.png','assets/original-library/transition-03-taixuan-quanta-v1.png','assets/quanta/ch6-side-keepsakes-v1.png','assets/quanta/quanta-props-v1.png','assets/original-library/map-05-kolosten-storm-v1.png','assets/quanta/jizo-combat-sheet-v2.png','assets/original-library/map-08-imaginary-tree-boss-arena-v1.png'];
const CH6_DESCRIPTIONS=[
 'Senti tỉnh dậy một mình giữa các bong bóng thực tại. Xích Nhận đứt và thanh Assist im lặng, nhưng cô quyết định tự tìm Phù Hoa.',
 'Một con chim bông méo mó giữ lại buổi Phù Hoa đứng trước máy gắp quà ba mươi phút, và lần Senti gian lận để khiến cô ấy bật cười.',
 'Phù Hoa trở lại Kolosten, nơi ký ức buộc cô chọn hy sinh. Không có vũ khí, cô mở đường bằng quyền pháp Taixuan.',
 'Nagazora, Babylon và Thái Hư va vào nhau. Senti từ chối để Mnemosyne xóa những phần ký ức không tương thích.',
 'Ảo ảnh yêu cầu Phù Hoa đứng yên nhận đòn. Cô nhớ lời Senti, mỉm cười và đấm vỡ lựa chọn cũ.',
 'Husk–Nihilius đứng trong một bong bóng đen đúng ba giây. Senti nhìn lại, rồi tiếp tục đi tìm Old Timer.',
 'Senti phá ranh giới lượng tử và đáp xuống giữa bão. Hai nửa xích nối lại, thanh Assist bừng sáng.',
 'Jizo buộc cả hai đọc đòn, phá cột sét, kéo lõi ký ức và ghép Kiếm–Thương–Xích trước Dual Combo nhịp ba.',
 'Hai mảnh ký ức ghép lại: “Ta là ai?” và “Ta đã quên gì?” Cả hai cùng bắt đầu từ khoảng trống và tự tìm câu trả lời.'
];
const CH7_ART=['assets/imaginary/ch7-artifacts-v1.svg','assets/original-library/map-08-imaginary-tree-boss-arena-v1.png','assets/original-library/map-08-imaginary-tree-boss-arena-v1.png','assets/imaginary/ch7-artifacts-v1.svg','assets/original-library/map-08-imaginary-tree-boss-arena-v1.png','assets/taixuan/seven-swords-lineup.png','assets/imaginary/mnemosyne-combat-v1.svg','assets/original-library/map-08-imaginary-tree-boss-arena-v1.png','assets/imaginary/ch7-artifacts-v1.svg'];
const CH7_DESCRIPTIONS=[
 'Fu Hua lặng lẽ mua một chiếc kẹp tóc nhỏ. Senti giữ nó không phải vì nguồn gốc, mà vì lựa chọn đã giữ nó đến hôm nay.',
 'Sau hai phút mưa dữ liệu, cả hai ngồi tựa lưng nhìn bình minh. Senti gọi đó là ký ức của “chúng ta”.',
 'Sáu ký ức đau được mở lại như sáu vết thương. Mỗi vết thương trở thành sức mạnh khi họ tự chọn mang nó đi cùng.',
 'Nồi mì cháy đen bị Mnemosyne coi là dữ liệu vô nghĩa. Fu Hua nhớ đó là bát mì ngon nhất vì Senti đã nấu cho cô.',
 'Những người thân quen bị đóng băng ở khoảnh khắc hạnh phúc nhất. Fu Hua nhận ra sự hoàn hảo không thay đổi chỉ là một lăng mộ.',
 'Một lời xin lỗi hoàn hảo của Thất Kiếm không thể làm nước đã đổ chảy ngược. Senti kéo Fu Hua khỏi điều ngọt ngào nhưng giả tạo ấy.',
 'Mnemosyne tặng Senti một Old Timer luôn nghe lời. Cô đập nát ảo ảnh vì người cô chọn phải có quyền phản đối mình.',
 'Xích giữ thời gian, Thương xuyên điểm neo, Kiếm chém đường hiệu đính. Hai người xé lớp sơn trắng khỏi Imaginary Tree.',
 'Một giọt nước mắt cổ xưa mang lời cầu xin được sống. Senti chạm vào nó, hiểu nguồn gốc của mình rồi vẫn tự chọn con người sẽ trở thành.'
];
const SIDE=[
 {id:'v-side-bowl',title:'Bát Gỗ Thứ Tám',art:'assets/taixuan/courtyard-storyboard.png',hint:'Một chỗ ngồi chưa từng được dùng.',description:'Senti đặt lại bảy chiếc bát theo những thói quen Phù Hoa vẫn nhớ. Chiếc bát trơn cuối cùng không dành cho người học trò thứ tám—nó giữ chỗ cho người thầy chưa từng chịu ngồi xuống cùng họ.'},
 {id:'v-side-hide',title:'Trốn Tìm Không Dấu Chân',art:'assets/taixuan/courtyard-black-orb.png',hint:'Tiếng cười còn lại trên tuyết.',description:'Uyển Hề và Uyển Như xóa dấu chân, buộc Phù Hoa tìm hai đứa chỉ bằng tiếng cười. Mảnh ký ức giữ lại chiếc khăn bịt mắt đỏ và một ngày luyện kiếm đã biến thành trò chơi.'},
 {id:'v-side-painting',title:'Bức Tranh Thiếu Một Gương Mặt',art:'assets/taixuan/senti-saves-fu-hua.png',hint:'Một khuôn mặt chưa kịp vẽ.',description:'Tần Tố Y đã vẽ đủ bảy người nhưng luôn để trống vị trí của sư phụ. Senti giữ tờ giấy, kéo Phù Hoa trở lại gần các học trò, để ba nét mực cuối cùng khép thành bức tranh tám người.'},
 {id:'v-side-moon',title:'Kiếm Dưới Trăng',art:'assets/taixuan/seven-swords-formation.png',hint:'Có lúc thắng nghĩa là tra kiếm vào vỏ.',description:'Phù Hoa và Trình Lăng Sương đứng dưới trăng mà không rút kiếm. Họ đặt tay lên chuôi, nghe hết điều đã im lặng quá lâu, rồi lựa chọn tra một lưỡi kiếm chưa từng rời vỏ.'}
];
const ROMAN=['I','II','III','IV','V','VI','VII'];
const HINTS=['Tiếp tục Story để mở ký ức.','Tìm một lối rẽ hoặc kỷ vật bị bỏ quên.','Hoàn thành thử thách gắn với ký ức này.'];

export const ALBUM_CARDS=CHAPTERS.flatMap((titles,ci)=>titles.map((title,i)=>({
 id:`${ci+1}-${String(i+1).padStart(2,'0')}`,chapter:ci+1,index:i+1,title,
 art:ci<4?`assets/album/album-ch${ci+1}-${String(i+1).padStart(2,'0')}-${SLUGS[ci][i]}.png`:ci===4?`assets/taixuan/${CH5_ART[i]}`:ci===5?CH6_ART[i]:CH7_ART[i],
 hint:HINTS[(i+ci)%HINTS.length],
 description:ci<4?DESCRIPTIONS[ci][i]:ci===4?'Một phần của Thái Hư Hoàn Hảo bị Mnemosyne viết lại.':ci===5?CH6_DESCRIPTIONS[i]:CH7_DESCRIPTIONS[i]
})));

export function ensureAlbum(save){
 if(!save.album||typeof save.album!=='object')save.album={unlocked:[],marks:{},keepsakes:[],side:[]};
 save.album.unlocked=Array.isArray(save.album.unlocked)?save.album.unlocked:[];
 save.album.marks=save.album.marks&&typeof save.album.marks==='object'?save.album.marks:{};
 save.album.keepsakes=Array.isArray(save.album.keepsakes)?save.album.keepsakes:[];
 save.album.side=Array.isArray(save.album.side)?save.album.side:[];
 // Migrate old sessions without erasing the feeling of discovery.
 const reached=Math.max(1,Math.min(7,save.chapter||1));
 const migrate=(id)=>{if(!save.album.unlocked.includes(id))save.album.unlocked.push(id);const marks=new Set(save.album.marks[id]||[]);marks.add('white');save.album.marks[id]=[...marks];};
 for(let ch=1;ch<reached;ch++)for(let i=1;i<=9;i++)migrate(`${ch}-${String(i).padStart(2,'0')}`);
 if(reached===5&&save.cleared?.includes(5440))migrate('5-01');
 return save.album;
}

export function unlockAlbum(save,id,mark='white',keepsake){
 const a=ensureAlbum(save);if(!a.unlocked.includes(id))a.unlocked.push(id);
 const marks=new Set(a.marks[id]||[]);if(mark)marks.add(mark);a.marks[id]=[...marks];
 if(keepsake&&!a.keepsakes.includes(keepsake))a.keepsakes.push(keepsake);
 return id;
}
export function unlockSideAlbum(save,id,mark='white',keepsake){const a=ensureAlbum(save);if(!a.side.includes(id))a.side.push(id);const marks=new Set(a.marks[id]||[]);marks.add(mark);a.marks[id]=[...marks];if(keepsake&&!a.keepsakes.includes(keepsake))a.keepsakes.push(keepsake);}

function marksHTML(marks=[]){return `<span class="album-marks"><i class="white ${marks.includes('white')?'on':''}"></i><i class="green ${marks.includes('green')?'on':''}"></i><i class="red ${marks.includes('red')?'on':''}"></i></span>`}
function safe(text=''){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

export function createAlbumUI({save,getSave,onBack,onReplay}){
 const root=document.querySelector('#album-screen'),grid=root.querySelector('#album-grid'),sideGrid=root.querySelector('#album-side-grid');let chapter=1,selected=null;
 const currentSave=()=>getSave?.()||save;
 function allFor(ch){return ALBUM_CARDS.filter(c=>c.chapter===ch)}
 function cardButton(card,unlocked){const b=document.createElement('button');b.className='memory-card'+(unlocked?' unlocked':' locked');b.dataset.id=card.id;b.setAttribute('aria-label',unlocked?card.title:`Ký ức ${card.id} chưa mở`);b.innerHTML=unlocked?`${card.art?`<img src="${safe(card.art)}" alt="">`:''}<b>${safe(card.title)}</b>${marksHTML(ensureAlbum(currentSave()).marks[card.id])}`:`<span class="album-lock">▣</span><b>???</b><small>${safe(card.hint)}</small>`;b.onclick=()=>{selected=card;renderDetail();document.querySelectorAll('.memory-card.selected').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')};return b;}
 function renderGrid(){const a=ensureAlbum(currentSave());grid.replaceChildren();for(const card of allFor(chapter))grid.append(cardButton(card,a.unlocked.includes(card.id)));sideGrid.replaceChildren();root.querySelector('.album-side-title').hidden=chapter!==5;if(chapter===5)for(const card of SIDE)sideGrid.append(cardButton({...card,chapter:5},a.side.includes(card.id)));root.querySelectorAll('[data-album-chapter]').forEach(b=>b.classList.toggle('active',Number(b.dataset.albumChapter)===chapter));selected=allFor(chapter).find(c=>a.unlocked.includes(c.id))||allFor(chapter)[0];grid.querySelector(`[data-id="${selected.id}"]`)?.classList.add('selected');renderDetail();}
 function renderDetail(){const a=ensureAlbum(currentSave()),open=a.unlocked.includes(selected.id)||a.side.includes(selected.id),preview=root.querySelector('#album-preview');preview.src=open&&selected.art?selected.art:'assets/taixuan/memory-album-reference.png';preview.classList.toggle('locked',!open);root.querySelector('#album-memory-title').textContent=open?selected.title:'KÝ ỨC CHƯA MỞ';root.querySelector('#album-memory-description').textContent=open?selected.description||'Một ký ức phụ đã được giữ lại.':selected.hint;root.querySelector('#album-memory-marks').innerHTML=marksHTML(a.marks[selected.id]);root.querySelector('#album-keepsakes').textContent=a.keepsakes.length?`KỶ VẬT · ${a.keepsakes.join(' · ')}`:'KỶ VẬT · CHƯA CÓ';root.querySelector('#album-replay').disabled=!open;const total=63,got=a.unlocked.length;root.querySelector('#album-progress').textContent=`${got} / ${total}`;root.querySelector('#album-progress-fill').style.width=`${got/total*100}%`;}
 root.querySelectorAll('[data-album-chapter]').forEach(b=>b.onclick=()=>{chapter=Number(b.dataset.albumChapter);renderGrid()});
 root.querySelector('#album-replay').onclick=()=>selected&&onReplay?.(selected);
 root.querySelector('#album-back').onclick=()=>onBack?.();
 return {open(){root.hidden=false;renderGrid()},close(){root.hidden=true},refresh:renderGrid};
}

