// Rules adapted from GEAR-SYSTEM.md and SYSTEMS-PROGRESSION.md.
export const CORES=[
 ['cloth_resolve','Cloth-Wrapped Resolve',2,20,35,.02,'Né hoàn hảo: đòn kế tiếp +12% sát thương.','Trận đầu · Chương 1'],
 ['training_fists','Schicksal Training Fists',3,30,62,.04,'Đánh thường +8% sát thương.','Boss · Chương 1'],
 ['jade_current','Jade Current Bracers',3,30,58,.06,'Đổi hình thái: +8% tốc đánh trong 4 giây.','Chương 2'],
 ['tai_xuan','Grips of Tai Xuan',4,40,96,.08,'Phản đòn tạo kiếm ảnh.','Chương 5'],
 ['fenghuang_down','Fenghuang Down',4,40,92,.06,'Trợ chiến để lại lông vũ hồi phục.','Chương 3'],
 ['domain_sentience','Domain of Sentience',5,50,132,.10,'Nối ba hình thái để tăng Resolve.','Chương 7'],
 ['infinite_intimidator','Infinite Intimidator',5,50,145,.08,'Combo 30 tạo đòn choáng.','Thử thách cuối game'],
 ['incredibly_infinite','Incredibly Infinite Intimidator',6,65,182,.12,'PRI-ARM · Biến đổi tuyệt kỹ.','Đột phá Infinite Intimidator'],
 ['shattered_core','Shattered Memory Core',6,65,170,.10,'Nối đòn cùng Fu Hua tăng Assist.','Kết thúc Ký ức #0']
].map((c,index)=>({id:c[0],name:c[1],rarity:c[2],max:c[3],atk:c[4],crit:c[5],passive:c[6],source:c[7],index}));
export const SETS=[
 {id:'training_memory',name:'Training Memory',rarity:2,file:'stigmata-training-memory-2star-v1.png',stats:[{atk:10,normal:.05},{hp:100,reduction:.04},{def:10,move:.05}],parts:['ATK +10 · Đánh thường +5%','HP +100 · Giảm sát thương nhận 4%','DEF +10 · Tốc chạy +5%'],two:'Khiên checkpoint kéo dài thêm 3 giây.',three:'Hồi 15% HP một lần mỗi phân đoạn.',source:'Ba trận đầu Chương 1'},
 {id:'nagazora_survivor',name:'Nagazora Survivor',rarity:3,file:'stigmata-nagazora-survivor-3star-v1.png',stats:[{atk:18,physical:.06},{hp:160},{crit:.04}],parts:['ATK +18 · Vật lý +6%','HP +160 · Kháng choáng 20%','Crit +4%'],two:'Phản đòn hoàn hảo phóng sét ký ức 80% ATK.',three:'Mất HP: +12% tốc chạy và +10% sát thương trong 6 giây.',source:'Hai ký ức ẩn + boss Chương 1'},
 {id:'taixuan_companions',name:'Taixuan Companions',rarity:4,file:'stigmata-taixuan-companions-4star-v1.png',stats:[{atk:28},{hp:220},{crit:.06}],parts:['ATK +28 · Assist +15%','HP +220 · Khiên khi gọi Fu Hua','Crit +6% · Hồi Assist +12%'],two:'Né hoàn hảo giảm hồi chiêu Fu Hua.',three:'Edge of Taixuan tạo vùng Song Hành.',source:'Chương 3–5'},
 {id:'sovereign_sentience',name:'Sovereign of Sentience',rarity:5,file:'stigmata-sovereign-sentience-5star-v1.png',stats:[{atk:42,physical:.12},{hp:280},{crit:.08}],parts:['ATK +42 · Vật lý +12%','HP +280','Crit +8%'],two:'Combo khiến mục tiêu nhận thêm sát thương.',three:'Tăng sức mạnh Herrscher finisher.',source:'Chương 7'},
 {id:'shattered_memories',name:'Shattered Memories',rarity:5,file:'stigmata-shattered-memories-secret-v1.png',stats:[{atk:38,total:.08},{hp:250},{crit:.07}],parts:['ATK +38 · Sát thương +8%','HP +250','Crit +7%'],two:'Nối đòn nhận Memory Echo.',three:'5 Echo kích hoạt Dual Finisher.',source:'Đủ 21 ký ức · Kết thúc bí mật'}
];
export function ensureGear(s){s.cores??={};s.equippedCore??=null;s.stigmaInventory??={};s.slots??={T:null,M:null,B:null};s.presets??={};s.skills??={sword:0,dodge:0};s.xp??=0;s.torus??=0;s.storyEvents??=[];s.endlessBest??=0;return s}
export function grantGear(s,id){ensureGear(s);if(CORES.some(c=>c.id===id)){if(!s.cores[id])s.cores[id]={level:1,cap:10};}else if(!s.stigmaInventory[id])s.stigmaInventory[id]={level:1};}
export function stats(s){ensureGear(s);const v={hp:1000+(s.level-1)*35,atk:100+(s.level-1)*5,def:80+(s.level-1)*3,crit:.05,critDamage:1.5,move:0,normal:0,physical:0,total:0,reduction:0,sets:{}};
 const c=CORES.find(c=>c.id===s.equippedCore),own=s.cores[s.equippedCore];if(c&&own){v.atk+=Math.round(c.atk*(.25+.75*own.level/c.max));v.crit+=c.crit;if(c.id==='training_fists')v.normal+=.08;}
 for(const [slot,id] of Object.entries(s.slots)){if(!id||!s.stigmaInventory[id])continue;const [setId,piece]=id.split(':');if(piece!==slot)continue;const set=SETS.find(a=>a.id===setId);if(!set)continue;const index=['T','M','B'].indexOf(piece),factor=1+(s.stigmaInventory[id].level-1)*.12;for(const [k,value] of Object.entries(set.stats[index]))v[k]+=value*factor;v.sets[setId]=(v.sets[setId]||0)+1;}
 v.crit=Math.min(.75,v.crit);v.hp=Math.round(v.hp);v.atk=Math.round(v.atk);v.def=Math.round(v.def);return v;
}
export function equipCore(s,id){ensureGear(s);if(id!==null&&!s.cores[id])return false;s.equippedCore=id;return true}
export function equipStigma(s,slot,id){ensureGear(s);if(!['T','M','B'].includes(slot)||id!==null&&(!s.stigmaInventory[id]||id.split(':')[1]!==slot))return false;s.slots[slot]=id;return true}
export function upgradeCost(s,id){const core=CORES.find(c=>c.id===id),o=core?s.cores[id]:s.stigmaInventory[id];if(!o)return null;if(core){if(o.level>=core.max)return null;if(o.level>=o.cap)return {gold:200*core.rarity,alloy:core.rarity,breakthrough:true};return {gold:40+o.level*12,alloy:0};}if(o.level>=5)return null;return {gold:100*o.level,alloy:o.level>=3?1:0};}
export function upgrade(s,id){const cost=upgradeCost(s,id);if(!cost||s.gold<cost.gold||s.materials<cost.alloy)return false;s.gold-=cost.gold;s.materials-=cost.alloy;if(s.cores[id]){if(cost.breakthrough)s.cores[id].cap=Math.min(CORES.find(c=>c.id===id).max,s.cores[id].cap+10);else s.cores[id].level++;}else s.stigmaInventory[id].level++;return true}
export function recommended(s){const cores=CORES.filter(c=>s.cores[c.id]).sort((a,b)=>b.atk-a.atk);s.equippedCore=cores[0]?.id||null;for(const slot of ['T','M','B']){const sets=SETS.filter(a=>s.stigmaInventory[a.id+':'+slot]).sort((a,b)=>b.rarity-a.rarity);s.slots[slot]=sets[0]?sets[0].id+':'+slot:null;}}
export function storePreset(s,name){if(!['Story','Boss','Endless','Tự chọn'].includes(name))return false;s.presets[name]={core:s.equippedCore,slots:{...s.slots}};return true}
export function applyPreset(s,name){const p=s.presets[name];if(!p)return false;if(p.core&&!s.cores[p.core]||Object.values(p.slots).some(id=>id&&!s.stigmaInventory[id]))return false;s.equippedCore=p.core;s.slots={...p.slots};return true}
export function addXP(s,n){s.xp+=n;while(s.level<50&&s.xp>=s.level*150){s.xp-=s.level*150;s.level++;}}
