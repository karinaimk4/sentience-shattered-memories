// Input-only driver. No teleporting, healing, inventory or save mutations.
module.exports=function installBot(){
 window.bot={stall:0,lastX:0,frames:0,jumpReleased:true,allowFall:false};
 window.drive=function(count,stopAtMeters=Infinity){
  let s;
  for(let i=0;i<count;i++){
   s=__qa.snapshot();if(s.phase==='finished'||s.p.x/64>=stopAtMeters)break;
   if(s.phase==='dialogue'){if(window.bot.pauseDialogues)return {...s,capture:'dialogue'};if(window.bot.stopRescue&&s.rescueState==='failed')return {...s,capture:'rescue'};if(window.bot.stopEnding&&s.arena?.m===2000&&s.memories.includes('main-1')&&s.dialogueIndex===2)return {...s,capture:'ending'};__qa.advance();continue}if(s.phase==='upgrade'){document.querySelector('[data-run-upgrade=power]').click();continue}
   if(s.phase==='courtyard'){
    const codes=s.courtyard?.x>1028?['KeyE']:['KeyD'];
    __qa.step(codes,1,false);continue;
   }
   if(s.phase==='memory-trial'){
    const trial=s.memoryTrial,codes=[];
    if(trial.done)codes.push('KeyE');
    else if(trial.type==='bowls'){
     const expected=[0,7,1,6,2,5,3,4][trial.step];
     if(trial.cursor!==expected)codes.push(((expected-trial.cursor+8)%8)<=4?'ArrowRight':'ArrowLeft');else codes.push('KeyE');
    }else if(trial.type==='hide'){
     if(trial.cursor<trial.target)codes.push('ArrowRight');else if(trial.cursor>trial.target)codes.push('ArrowLeft');else codes.push('KeyE');
    }else if(trial.type==='salvage'){
     const expected=[2,0,1][trial.step];if(trial.cursor!==expected)codes.push('ArrowRight');else codes.push('KeyE');
    }else if(trial.type==='temptation'){
     if(trial.step===0)codes.push('KeyD');else if(trial.step===1)codes.push('KeyJ');else{const expected=[2,0,1][trial.score];if(trial.choice!==expected)codes.push('ArrowRight');else codes.push('KeyE');}
    }else if(trial.type==='graffiti'){if(Math.abs(trial.pulse-.5)<.09)codes.push('KeyE');}
    else if(trial.type==='painting'){if(Math.abs(trial.pulse-.5)<.09)codes.push('KeyE');}
    else if(trial.type==='moon'){
     if(trial.step===0){if(Math.abs(trial.pulse-.5)<.09)codes.push('KeyE');}
     else if(trial.step===2)codes.push('KeyE');
    }
    else if(trial.type==='testimony'){
     const expected=[1,2,0][trial.step];if(trial.choice!==expected)codes.push('ArrowRight');else codes.push('KeyE');
    }else if(trial.type==='rescue'){if(trial.pulse>.45&&trial.pulse<.55)codes.push('KeyK');}
    else codes.push('KeyE');
    __qa.step(codes,1,false);continue;
   }
   if(s.phase==='paused'){document.querySelector('#resume').click();continue}
   if(s.phase==='dying'){__qa.step([],0);return s;}
   const p=s.p,k=[],bot=window.bot;bot.frames++;if(s.interaction&&!bot.ignoreInteractions)k.push('KeyE');const activeSide=s.sideStories?.find(q=>q.state==='active');
   let jump=false;const node=!bot.ignoreNodes&&s.nodes?.find(n=>!n.destroyed&&(s.save.chapter>=2||n.order!==0||s.loopCount>0)&&Math.abs(n.x-p.x)<250&&s.nodes.filter(v=>v.order<n.order).every(v=>v.destroyed));
   const boss=s.enemies.find(e=>e.hp>0&&e.ai);
   const pylon=boss?.ai.type==='chariot'?boss.ai.pylons.filter(v=>!v.down).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0]:null;
   const alive=s.enemies.filter(e=>e.hp>0&&(!boss?.ai.barrier||e.bossGuard)).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x)),e=boss?.ai.type==='chariot'&&boss.ai.open>0||boss?.ai.type==='seven-swords'||boss?.ai.type==='phantom'?boss:alive[0];
   if(node){const dx=node.x-p.x;k.push(node.requiredWeapon==='spear'?'Digit2':node.requiredWeapon==='chain'?'Digit3':'Digit1','KeyJ');if(Math.abs(dx)>(node.requiredWeapon==='spear'?120:node.requiredWeapon==='chain'?110:75)||Math.sign(dx)!==p.face)k.push(dx>0?'KeyD':'KeyA');}else if(s.phase==='arena'||activeSide||(e&&Math.abs(e.x-p.x)<200&&Math.abs(e.y-p.y)<80)){
    const sevenWeapon=()=>{const a=boss.ai;if(a.encounter==='branch-a')return a.armor>0&&a.reveal>0&&a.light>=.72?'spear':'sword';if(a.encounter==='branch-b')return a.bell>0?'chain':'sword';if(a.encounter==='branch-c')return a.lastWeapon==='sword'?'spear':a.lastWeapon==='spear'?'chain':'sword';return a.formationRound===2?'spear':a.formationRound===3&&!a.assistReady?'chain':'sword';};
    const phantomWeapon=()=>{const a=boss.ai;if(a.phase===1)return a.stance>0?'spear':'sword';if(a.dualReady)return 'sword';return {sword:'spear',spear:'chain',chain:'sword'}[a.copyWeapon]||'sword';};
    let weapon=s.save.chapter>=4?(boss?.ai.type==='mnemosyne'?(boss.ai.expected==='dual'?'sword':boss.ai.expected||'sword'):boss?.ai.type==='jizo'?(boss.ai.round===3?(boss.ai.coreOpen>0?'chain':'sword'):boss.ai.round===4?(boss.ai.order?.[boss.ai.sequenceStep]||'sword'):'sword'):boss?.ai.type==='parvati'?(boss.ai.armor?'spear':boss.ai.move==='roll'?'chain':'sword'):boss?.ai.type==='phantom'?phantomWeapon():boss?.ai.type==='seven-swords'?sevenWeapon():e?.iceArmor>0||e?.kind==='flyer'||e?.kind==='machine'?'spear':'sword'):s.save.chapter===3?(boss?.ai.type==='heimdall'?(boss.ai.shield?'spear':'sword'):e?.kind==='flyer'||e?.kind==='machine'?'spear':'sword'):s.save.chapter===2?(pylon?(pylon.weapon==='dash'?'sword':pylon.weapon):boss?.ai.type==='chariot'&&boss.ai.plates===0?'sword':e?.kind==='flyer'||e?.kind==='machine'||boss?.ai.plates>0?'spear':'sword'):s.save.weapons.includes('spear')?'spear':'sword';
    const weaponKey=weapon==='spear'?'Digit2':weapon==='chain'?'Digit3':'Digit1',switching=s.save.weapon!==weapon;
    if(switching){if(!p.attack)k.push(weaponKey);}else k.push(weaponKey,'KeyJ');
    const range=weapon==='spear'?140:weapon==='chain'?125:84;
    if(pylon){const dx=pylon.x-p.x;const desired=pylon.weapon==='dash'?95:weapon==='spear'?112:75;if(Math.abs(dx)>desired||Math.sign(dx)!==p.face)k.push(dx>0?'KeyD':'KeyA');if(pylon.weapon==='dash'&&Math.abs(dx)<125){k.push(dx>0?'KeyD':'KeyA');if(bot.frames%12===0)k.push('KeyL');}}
    else if(e){const dx=e.x-p.x;if(Math.abs(dx)>range||Math.sign(dx)!==p.face)k.push(dx>0?'KeyD':'KeyA');
     if(alive.some(a=>a.move==='charge'&&a.telegraph>0&&a.telegraph<.22&&Math.abs(a.x-p.x)<a.reach+100))k.push('KeyK');
     if(alive.some(a=>!a.ai&&a.move!=='charge'&&a.telegraph>0&&a.telegraph<.35&&Math.abs(a.x-p.x)<a.reach+30)&&p.grounded)jump=true;
    }
    if(s.save.assistUnlocked&&bot.frames%60===0)k.push('KeyQ');
   }else{
    k.push('KeyD');const gate=s.platforms.find(b=>b.kind==='gate'&&p.x>b.x-80&&p.x<b.x+b.w+40&&p.y>450);
    if(gate)k.push('KeyS');
    if(!bot.allowFall&&!gate){
     const gap=s.gaps.find(h=>p.x<h.x+h.w&&p.x>h.x-28);if(gap&&p.grounded)jump=true;
     const block=s.platforms.find(b=>!['gate','pulse','moving'].includes(b.kind)&&b.x>p.x-10&&b.x-p.x<80&&b.y<p.y-5&&b.y>p.y-128);
     if(block&&p.grounded){if(block.kind==='breakable'&&s.save.weapons.length)k.push('KeyJ');else jump=true;}
    }
   }
   if(s.platforms.some(b=>b.kind==='gate'&&p.x>b.x-80&&p.x<b.x+b.w+40&&p.y>450)){k.push('KeyS','KeyD');const left=k.indexOf('KeyA');if(left>=0)k.splice(left,1);}
   if(s.environment?.weather?.kind==='snow'&&s.environment.clock%6<3.1)k.push('KeyS');
   if(s.vents?.some(v=>Math.abs(v.x-p.x)<120&&((v.t+v.phase)%5.7)<2.5)&&p.grounded)jump=true;
   if(boss){
    const ai=boss.ai,phase=ai.state,skill=ai.move;
    if(ai.type==='mnemosyne'&&ai.fake){k.length=0;k.push('KeyJ');}
    if(ai.type==='mnemosyne'&&ai.erase){k.length=0;k.push('KeyD','KeyE');}
    if(ai.type==='mnemosyne'&&ai.ultimate){k.length=0;const code=['ArrowUp','ArrowRight','ArrowDown','ArrowLeft','KeyJ'][ai.ultimateStep];if(code)k.push(code);}
    const remove=code=>{let index;while((index=k.indexOf(code))>=0)k.splice(index,1)};
    if(phase==='tell'||phase==='attack'){
     if(!ai.barrier){remove('KeyJ');remove('KeyD');remove('KeyA');}
     if(skill==='beam'){remove('KeyD');remove('KeyA');remove('KeyJ');k.push('KeyS');jump=false;}
     if(skill==='rain'&&phase==='tell'&&ai.targets?.length){const candidates=[s.arena.x-85,s.arena.x+170,s.arena.x+430,s.arena.x+745].filter(x=>ai.targets.every(t=>Math.abs(t-x)>80)).sort((a,b)=>Math.abs(a-p.x)-Math.abs(b-p.x));if(candidates.length&&Math.abs(candidates[0]-p.x)>20){remove('KeyD');remove('KeyA');k.push(candidates[0]>p.x?'KeyD':'KeyA');}}
     if(skill==='rush'&&((phase==='tell'&&ai.t<.15)||(phase==='attack'&&Math.abs(p.x-boss.x)<190))){k.push('KeyK');if(Math.abs(p.x-boss.x)<95&&phase==='attack')k.push('KeyL');}
     if(ai.type==='chariot'){
      if(skill==='dash'&&phase==='attack'&&Math.abs(p.x-boss.x)<188){remove('Digit2');k.push('Digit1','KeyK');}
      if(skill==='leap'&&phase==='tell'&&ai.t<.42&&Math.abs(p.x-ai.target)<185)jump=true;
      if(skill==='tail'&&phase==='attack'&&ai.t<.4)k.push('KeyL');
      if(skill==='beam'&&(phase==='tell'&&ai.t<.42||phase==='attack')){remove('KeyD');remove('KeyA');k.push('KeyS');jump=false;}
      if(skill==='snare'&&phase==='attack'&&ai.t<.36&&Math.abs(p.x-ai.target)<145)k.push('KeyL');
     }
     if(ai.type==='heimdall'){
      if(skill==='lunge'&&phase==='attack'&&Math.abs(p.x-boss.x)<180){remove('Digit2');k.push('Digit1','KeyK');}
      if(skill==='shockwave'&&phase==='tell'&&ai.t<.38&&p.grounded)jump=true;
      if(skill==='laser'&&(phase==='tell'&&ai.t<.42||phase==='attack')){remove('KeyD');remove('KeyA');k.push('KeyS');jump=false;}
      if(skill==='combo'&&phase==='tell'&&ai.t<.4){if(s.save.assistUnlocked)k.push('KeyQ');k.push('KeyL');}
     }
     if(ai.type==='parvati'){
      if(skill==='roll'&&(phase==='tell'||phase==='attack')){remove('Digit1');remove('Digit2');k.push('Digit3','KeyJ');if(Math.abs(p.x-boss.x)<170)k.push('KeyL');}
      if(skill==='pillar'&&phase==='tell'&&ai.t<.42)k.push('KeyL');
      if(skill==='breath'&&(phase==='tell'&&ai.t<.42||phase==='attack')){remove('KeyJ');k.push('KeyS');}
      if(skill==='shatter'&&phase==='tell'&&ai.t<.46){k.push('KeyL');jump=false;}
     }
     if(ai.type==='phantom'){
      if(skill==='palm'&&phase==='attack'&&ai.t>.27){remove('Digit2');k.push('Digit1','KeyK');}
      if((skill==='wave'||skill==='spear')&&phase==='tell'&&ai.t<.4&&p.grounded)jump=true;
      if(skill==='chain'&&phase==='attack')k.push('KeyL');
      if(skill==='falseFinish'&&phase==='tell'){remove('KeyL');}
      if(skill==='falseFinish'&&phase==='attack'&&ai.t>.32){remove('KeyJ');k.push('KeyL');}
      if(ai.phase===2&&ai.dualReady&&s.save.dualUnlocked)k.push('KeyQ');
     }
     if(ai.type==='seven-swords'){
      if(ai.encounter==='branch-a'&&skill==='triều-vũ'&&phase==='attack'&&ai.t<.4&&ai.t>.16){remove('Digit2');remove('Digit3');k.push('Digit1','KeyK');}
      if(ai.encounter==='branch-b'&&skill==='arrow'&&(phase==='tell'||phase==='attack'))k.push('KeyL');
      if(ai.encounter==='branch-c'&&ai.inputLock==='weapon'){remove('KeyJ');remove('Digit1');remove('Digit2');remove('Digit3');}
      if(ai.encounter==='branch-c'&&skill==='qi'&&(phase==='tell'||phase==='attack'))k.push('KeyL');
      if(ai.encounter==='branch-c'&&ai.sheathePrompt)k.push('KeyE');
      if(ai.encounter==='formation'&&ai.formationRound===1){remove('KeyJ');if(ai.attackIndex===7&&phase==='attack'&&ai.t<.48&&ai.t>.16){remove('KeyL');k.push('Digit1','KeyK');}else if(skill==='wave'){remove('KeyL');if(phase==='attack'&&ai.t<.82&&ai.t>.66)jump=true;}else if(phase==='tell')remove('KeyL');else if(phase==='attack'&&ai.t<.58&&ai.t>.42)k.push('KeyL');}
      if(ai.encounter==='formation'&&ai.formationRound>1&&phase==='attack')k.push('KeyL');
      if(ai.encounter==='formation'&&ai.formationRound===3&&ai.assistReady&&s.save.dualUnlocked)k.push('KeyQ');
     }
     if(ai.type==='jizo'){
      const avoidFx=()=>{const danger=(ai.fx||[]).filter(f=>f.delay<.22&&f.life>.04).map(f=>f.x),candidates=[s.arena.x-55,s.arena.x+90,s.arena.x+235,s.arena.x+380,s.arena.x+525,s.arena.x+670,s.arena.x+755],safe=ai.safeX??candidates.sort((a,b)=>Math.min(...danger.map(x=>Math.abs(b-x)),999)-Math.min(...danger.map(x=>Math.abs(a-x)),999))[0];remove('KeyD');remove('KeyA');if(Math.abs(safe-p.x)>16)k.push(safe>p.x?'KeyD':'KeyA');if(danger.some(x=>Math.abs(x-p.x)<92))k.push('KeyL');};
      if(['blades','fire'].includes(skill)&&(phase==='tell'||phase==='attack'))avoidFx();
      if(ai.round===1){remove('KeyJ');if(skill==='storm'&&phase==='attack'){remove('KeyD');remove('KeyA');const target=ai.target??p.x;k.push(p.x<=target?'KeyA':'KeyD','KeyL');}}
      if(ai.round===2){
       remove('KeyJ');
       if(skill==='storm'&&phase==='tell'){const rod=ai.rodPositions?.[ai.rodIndex];remove('KeyD');remove('KeyA');if(rod!=null&&Math.abs(rod-p.x)>12)k.push(rod>p.x?'KeyD':'KeyA');}
       if(skill==='storm'&&phase==='attack'){remove('KeyD');remove('KeyA');const target=ai.target??p.x;k.push(p.x<=target?'KeyA':'KeyD','KeyL');}
       if(ai.rodCharged&&s.save.assistUnlocked)k.push('KeyQ');
      }
      if(ai.round===3){
       if(ai.coreOpen>0){remove('Digit1');remove('Digit2');remove('KeyJ');k.push('Digit3');if(s.save.weapon==='chain')k.push('KeyJ');const dx=boss.x-p.x;if(Math.abs(dx)>112){remove('KeyD');remove('KeyA');k.push(dx>0?'KeyD':'KeyA');}}
       else remove('KeyJ');
       if(skill==='cross'&&(phase==='tell'||phase==='attack')){const dx=boss.x-p.x;if(Math.abs(dx)>145){remove('KeyD');remove('KeyA');k.push(dx>0?'KeyD':'KeyA');}if(phase==='attack'&&ai.t<.48&&ai.t>.12){remove('KeyL');k.push('KeyK');}}
      }
      if(ai.round===4){const expected=ai.order?.[ai.sequenceStep];if(ai.open<=0&&!ai.sequenceReady&&s.save.weapon!==expected)remove('KeyJ');if(ai.sequenceReady&&!ai.assistHit&&s.save.assistUnlocked)k.push('KeyQ');if(phase==='attack'&&ai.open<=0)k.push('KeyL');}
     }
     if(ai.type==='mnemosyne'){
      if(ai.fake){k.length=0;k.push('KeyJ');}
      else if(ai.erase){k.length=0;k.push('KeyD','KeyE');}
      else if(ai.ultimate){k.length=0;const code=['ArrowUp','ArrowRight','ArrowDown','ArrowLeft','KeyJ'][ai.ultimateStep];if(code)k.push(code);}
      else if(ai.phase===1&&ai.round===1&&phase==='attack')k.push('KeyL');
      else if(ai.phase===1&&ai.round===3){remove('KeyJ');const danger=(ai.fx||[]).filter(f=>f.delay<.2&&f.life>.08).map(f=>f.x),spots=[s.arena.x+55,s.arena.x+225,s.arena.x+395,s.arena.x+565,s.arena.x+735],safe=spots.sort((a,b)=>Math.min(...danger.map(x=>Math.abs(b-x)),999)-Math.min(...danger.map(x=>Math.abs(a-x)),999))[0];remove('KeyD');remove('KeyA');if(Math.abs(safe-p.x)>18)k.push(safe>p.x?'KeyD':'KeyA');if(danger.some(x=>Math.abs(x-p.x)<90))k.push('KeyL');}
      else if(ai.phase===2&&ai.round===1){remove('KeyJ');if(phase==='attack')k.push('KeyL');}
      else if(ai.phase===2&&ai.round===3){remove('KeyJ');const target=ai.zones?.[ai.trueZone];if(target!=null){remove('KeyD');remove('KeyA');if(Math.abs(target-p.x)>18)k.push(target>p.x?'KeyD':'KeyA');}}
      else if(ai.phase===2&&ai.round===4&&s.save.dualUnlocked)k.push('KeyQ');
      else if(ai.phase===3&&ai.round===1){remove('KeyJ');if(phase==='attack')k.push('Digit1','KeyK');}
      else if(ai.phase===3&&ai.round===2){remove('Digit1');remove('Digit2');k.push('Digit3','KeyJ');}
      else if(ai.phase===3&&ai.round===3){remove('KeyJ');if(phase==='attack')k.push('KeyL');}
     }
    }
    if(ai.type==='jizo'&&ai.round===2&&ai.rodCharged&&s.save.assistUnlocked)k.push('KeyQ');
    if(ai.type==='jizo'&&ai.round===3&&ai.coreOpen>0&&s.save.weapon!=='chain')remove('KeyJ');
    if(ai.type==='jizo'&&ai.round===4){const expected=ai.order?.[ai.sequenceStep];if(ai.open<=0&&!ai.sequenceReady&&s.save.weapon!==expected)remove('KeyJ');if(ai.sequenceReady&&!ai.assistHit&&s.save.assistUnlocked)k.push('KeyQ');}
    if(ai.type==='mnemosyne'&&ai.phase===2&&ai.round===4&&s.save.dualUnlocked)k.push('KeyQ');
    if(ai.type==='seven-swords'&&ai.encounter==='branch-c'&&ai.sheathePrompt)k.push('KeyE');
    if(['seven-swords','phantom'].includes(ai.type)&&bot.frames%2)remove('KeyJ');
    const wave=ai.fx?.find(f=>f.kind==='wave'&&f.delay<=0&&(p.x-f.x)*f.vx>=0&&Math.abs(p.x-f.x)<125);
    if(wave&&(p.grounded||p.vy>0&&p.airJumps>0))jump=true;
   }
   if(bot.seekMemories&&!s.memories.includes('hidden-1')&&p.x/64>=861.5&&p.x/64<868&&(p.grounded||p.vy>-150&&p.airJumps>0))jump=true;
   if(bot.seekMemories&&!s.memories.includes('hidden-2')&&p.x/64>1927&&p.x/64<1931)k.push('KeyS');
   if(bot.seekMemories&&s.save.chapter===2&&!s.memories.includes('hidden-4')&&p.x/64>2939&&p.x/64<2941)k.push('KeyL');
   if(!s.arena&&p.grounded&&s.platforms.some(b=>!['gate','pulse','moving'].includes(b.kind)&&b.x>p.x-10&&b.x-p.x<55&&b.y<p.y-5&&b.y>p.y-128))jump=true; if(jump&&bot.jumpReleased){k.push('Space');bot.jumpReleased=false;}else bot.jumpReleased=true;
   if(Math.abs(p.x-bot.lastX)<.1&&s.phase==='explore')bot.stall++;else bot.stall=0;bot.lastX=p.x;
   if(bot.stall>240)return {...s,stalled:true};
   __qa.step(k,1,false);
  }
  __qa.step([],0);return __qa.snapshot();
 };
};




