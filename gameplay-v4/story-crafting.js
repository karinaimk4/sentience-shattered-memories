import {grantGear} from './gear-system.js';

// Icon indexes address row-major cells in the 5x3 assets/forge-materials-v2.png sheet.
export const FORGE_MATERIALS={
 alloy:{name:'Hợp kim',icon:0,source:'Quái tinh nhuệ và thùng tiếp tế'},
 crystal:{name:'Tinh thể ký ức',icon:1,source:'Arena và thùng tiếp tế'},
 namiko_coil:{name:'Cuộn mạch Namiko',icon:2,source:'Thùng phụ tùng Nagazora · Chương 1'},
 taixuan_script:{name:'Ấn quyết Taixuan',icon:3,source:'Thử thách Taixuan · Chương 5'},
 oblivion_inscription:{name:'Bản khắc Lãng Quên',icon:4,source:'Ký ức sâu · Chương 6'},
 sentience_prism:{name:'Lõi Ý Thức',icon:5,source:'Thử thách cuối · Chương 7'},
 brick_heart:{name:'Viên gạch thức tỉnh',icon:6,source:'Vật phẩm đặc biệt từ nhiệm vụ riêng · Chương 7'},
 brick_rune:{name:'Dấu ấn Gạch',icon:7,source:'Thử thách gạch · Chương 7'},
 crimson_stamp:{name:'Huy hiệu Bất Tận',icon:8,source:'Thử thách PRI-ARM · Chương 7'},
 torus:{name:'Torus',icon:9,source:'Thử thách vũ khí bậc cao'},
 dirac_residue:{name:'Dư ảnh Dirac',icon:10,source:'Mốc Endless sau Chương 3'},
 shattered_sword_shard:{name:'Mảnh Kiếm Vỡ',icon:11,source:'Mốc Endless sau Chương 5'},
 pericles_laurel:{name:'Nguyệt Quế Hoàng Kim',icon:12,source:'Mốc Endless sau Chương 7'}
};

// Future recipes stay visible as a progression preview. They cannot be forged
// until their chapters, blueprint events and material drops exist in gameplay.
export const RECIPES=[
 {id:'attila:M',name:'Attila (M)',rarity:3,chapter:1,event:'forge-attila-m',gold:250,materials:3,crystals:3,story:'Dấu khắc tìm thấy trên mái nhà. Gom hợp kim để tái tạo phần giữa của ký ức chiến binh.'},
 {id:'attila:B',name:'Attila (B)',rarity:3,chapter:1,event:'forge-attila-b',gold:350,materials:5,crystals:4,story:'Mảnh khuôn nằm trong khu ký ức vỡ. Nó chỉ ổn định khi được ghép bằng tinh thể.'},
 {id:'dirac:T',name:'Dirac (T)',rarity:4,chapter:3,event:'forge-dirac',gold:1100,materials:16,crystals:8,parts:{dirac_residue:4},story:'Dữ liệu quỹ đạo tìm thấy trong Helheim. Dư ảnh Dirac giữ lại nhịp né và phản công của phần trên.'},
 {id:'dirac:M',name:'Dirac (M)',rarity:4,chapter:3,event:'forge-dirac',gold:1200,materials:18,crystals:9,parts:{dirac_residue:4},story:'Mặt cắt không gian từ Phòng 28. Chỉ ổn định khi ghép đủ bốn Dư ảnh Dirac.'},
 {id:'dirac:B',name:'Dirac (B)',rarity:4,chapter:3,event:'forge-dirac',gold:1300,materials:20,crystals:10,parts:{dirac_residue:4},story:'Dấu chân thoát khỏi Helheim được khắc thành phần dưới của bộ Vết Thánh.'},
 {id:'shattered_swords:T',name:'Raksha (T)',rarity:4,chapter:5,event:'forge-shattered-swords',gold:1750,materials:24,crystals:10,parts:{shattered_sword_shard:5},story:'Năm mảnh kiếm mang ký ức của Raksha. Rèn lại sau khi Fu Hua thôi dùng quá khứ để tự trừng phạt.'},
 {id:'shattered_swords:M',name:'Sushang (M)',rarity:4,chapter:5,event:'forge-shattered-swords',gold:1850,materials:26,crystals:11,parts:{shattered_sword_shard:5},story:'Phần giữa lưu lại nhịp kiếm được hóa giải trong Thất Kiếm Trận.'},
 {id:'shattered_swords:B',name:'Empyrea Phoenix (B)',rarity:4,chapter:5,event:'forge-shattered-swords',gold:1950,materials:28,crystals:12,parts:{shattered_sword_shard:5},story:'Mảnh cuối mang cái bóng Tố Y vẽ lại dưới chân Fu Hua, neo bộ Vết Thánh vào thực tại.'},
 {id:'pericles:T',name:'Pericles (T)',rarity:4,chapter:7,event:'forge-pericles',gold:2600,materials:32,crystals:16,torus:2,parts:{pericles_laurel:6},story:'Nguyệt quế kết tinh từ những lựa chọn Mnemosyne không thể hiệu đính.'},
 {id:'pericles:M',name:'Pericles (M)',rarity:4,chapter:7,event:'forge-pericles',gold:2750,materials:34,crystals:18,torus:2,parts:{pericles_laurel:6},story:'Mảnh giữa giữ nhịp phối hợp của Senti và Fu Hua trong Ultimate cuối.'},
 {id:'pericles:B',name:'Pericles (B)',rarity:4,chapter:7,event:'forge-pericles',gold:2900,materials:36,crystals:20,torus:2,parts:{pericles_laurel:6},story:'Phần dưới được rèn từ con đường họ tự chọn sau khi Ký ức #0 mở ra.'},
 {id:'cas_ii_namiko',name:'CAS-II Namiko',rarity:3,chapter:1,event:'forge-namiko',gold:650,materials:12,crystals:9,parts:{namiko_coil:4},story:'Bản thiết kế ở trạm cứu hộ. Hai thùng phụ tùng Nagazora chứa đủ cuộn mạch riêng để tái tạo bộ phát xung.'},
 {id:'grips_tai_xuan',name:'Grips of Tai Xuan',rarity:4,chapter:5,event:'forge-tai-xuan',gold:1600,materials:24,parts:{taixuan_script:8},story:'Chương 5 · Phân biệt Taixuan thật và ảo để thu thập ấn quyết; bản thiết kế xuất hiện sau thử thách Bài học thứ tám.'},
 {id:'keys_oblivion',name:'Keys of Oblivion',rarity:4,chapter:6,event:'forge-keys-oblivion',gold:1900,materials:28,parts:{oblivion_inscription:8},story:'Chương 6 · Sáu bản khắc nằm trên hai tuyến đường; hai bản còn lại được giữ trong ký ức phụ. Bản thiết kế hoàn chỉnh sau khi Jizo bị đánh bại.'},
 {id:'infinite_intimidator',name:'Infinite Intimidator',rarity:4,chapter:7,event:'forge-brick',gold:2200,materials:30,parts:{brick_heart:1,brick_rune:8},story:'Viên gạch thức tỉnh chỉ nhận từ Lời Cám Dỗ Ngược; tám Dấu ấn Gạch phải mang về từ các mốc Endless.'},
 {id:'domain_sentience',name:'Domain of Sentience',rarity:5,chapter:7,event:'forge-domain',base:'keys_oblivion',gold:3600,materials:40,torus:6,parts:{sentience_prism:12},story:'PRI-ARM · Cần Keys of Oblivion đã sở hữu, Lõi Ý Thức từ thử thách cuối và Torus.'},
 {id:'incredibly_infinite_intimidator',name:'Incredibly Infinite Intimidator',rarity:5,chapter:7,event:'forge-brick-pri',base:'infinite_intimidator',gold:4000,materials:44,torus:8,parts:{crimson_stamp:12},story:'PRI-ARM · Bản thiết kế mở sau Chương 7; Huy hiệu Bất Tận chỉ rơi theo mốc quãng đường Endless.'}
];

export function ownsRecipeItem(s,id){return !!(id.includes(':')?s.stigmaInventory?.[id]:s.cores?.[id]);}
export function addForgePart(s,id,count=1){if(!FORGE_MATERIALS[id]||!Number.isInteger(count)||count<=0)return false;s.forgeParts??={};s.forgeParts[id]=(s.forgeParts[id]||0)+count;return true;}
export function recipeNeeds(s,r){return Object.entries(r.parts||{}).map(([id,count])=>({id,count,owned:s.forgeParts?.[id]||0,...FORGE_MATERIALS[id]}));}
export function canCraft(s,id){
 const r=RECIPES.find(r=>r.id===id);
 if(!r||r.available===false||ownsRecipeItem(s,id)||!s.storyEvents?.includes(r.event)||!s.chapters?.includes(r.chapter))return false;
 if(r.base&&!s.cores?.[r.base])return false;
 if(!['gold','materials','crystals','torus'].every(k=>(s[k]||0)>=(r[k]||0)))return false;
 return recipeNeeds(s,r).every(part=>part.owned>=part.count);
}
export function craft(s,id){
 if(!canCraft(s,id))return false;
 const r=RECIPES.find(r=>r.id===id);
 for(const key of ['gold','materials','crystals','torus'])s[key]=(s[key]||0)-(r[key]||0);
 for(const [part,count] of Object.entries(r.parts||{}))s.forgeParts[part]-=count;
 grantGear(s,id);s.storyEvents.push('crafted:'+id);s.journal??=[];
 s.journal.push({id:'crafted:'+id,title:'Bàn rèn ký ức',m:s.checkpoint.m,lines:[['Trang bị',r.name+' đã được tái tạo.'],['Ghi chép',r.story]]});
 return true;
}
