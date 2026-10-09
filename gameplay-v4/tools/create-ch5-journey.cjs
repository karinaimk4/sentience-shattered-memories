const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const s=JSON.parse(fs.readFileSync(path.join(root,'qa','boss-checkpoint.json'),'utf8'));
Object.assign(s,{
 chapter:5,chapters:[1,2,3,4,5],level:40,xp:0,gold:5200,crystals:80,materials:65,
 weapons:['sword','spear','chain'],weapon:'sword',weaponLevels:{sword:4,spear:4,chain:3},
 equipmentUnlocked:true,assistUnlocked:true,dualUnlocked:false,endlessUnlocked:false,
 checkpoint:{m:5480,hp:2300},elapsed:0,started:true,introSeen:true,
 cleared:[2000,2200,2560,2850,3200,3420,3705,3990,4300,4560,4845,5130,5440],
 visited:[0,1980,2000,2200,2560,2850,3170,3200,3420,3705,3990,4300,4560,4845,5130,5440,5480],
 defeated:[],collected:[],seenScenes:[],nodes:[],memories:['main-1','main-2','main-3','main-4'],
 storyEvents:[],journal:[],deaths:{},
 album:{unlocked:Array.from({length:36},(_,i)=>`${Math.floor(i/9)+1}-${String(i%9+1).padStart(2,'0')}`),marks:Object.fromEntries(Array.from({length:36},(_,i)=>[`${Math.floor(i/9)+1}-${String(i%9+1).padStart(2,'0')}`,['white']])),keepsakes:[],side:[]},
 courtyard:{tasks:{},secret:false,visited:false,teaTypes:[],tomorrow:false,decor:[]},
 cores:{cas_ii_namiko:{level:30,cap:35}},equippedCore:'cas_ii_namiko',
 stigmaInventory:{'marco_polo:T':{level:40},'marco_polo:M':{level:40},'marco_polo:B':{level:40}},
 slots:{T:'marco_polo:T',M:'marco_polo:M',B:'marco_polo:B'},presets:{},skills:{sword:2,dodge:2},
 forgeParts:{namiko_coil:6,taixuan_script:0,oblivion_inscription:0,sentience_prism:0,brick_heart:0,brick_rune:0,crimson_stamp:0,dirac_residue:0,shattered_sword_shard:0,pericles_laurel:0}
});
const now=Date.now(),payload={type:'sentience-shattered-memories-journey',format:1,exportedAt:new Date(now).toISOString(),journey:{name:'Bắt đầu Chương 5 · Thái Hư',created:now,updated:now},save:s};
const out=path.join(root,'qa','Hanh-trinh-Chuong-5.json');fs.writeFileSync(out,JSON.stringify(payload,null,2));console.log(out);
