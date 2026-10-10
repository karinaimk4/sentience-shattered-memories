const MAP_ART={nagazora:'nagazora',arc:'arc-city',babylon:'babylon',taixuan:'taixuan'};
const ITEM_ART={
  'Cua Biển Chết':'dead-sea-crab','Rong Biển Honkai':'honkai-seaweed',
  'Thịt Lợn Neon':'neon-pork','Gia vị công nghiệp':'industrial-spice',
  'Cá Ngừ đóng băng':'frozen-tuna','Đá Bào Parvati':'parvati-ice',
  'Măng rừng':'bamboo-shoot','Gà chạy bộ':'taixuan-chicken','Lá trà':'thousand-year-tea'
};
const HERO_ART={senti:'preview-sprites/senti-preview.png',pardofelis:'staff-sprites/pardofelis.png',sushang:'staff-sprites/sushang.png'};
const loadImage=src=>{const image=new Image();image.src=src;return image;};

export function startExpedition({container,map,buyer,onComplete,onLeave}){
  const width=900,height=320,ground=255;
  const hero=loadImage(`assets/event-v3/${HERO_ART[buyer]||HERO_ART.senti}`);
  const background=loadImage(`assets/event-demo/maps/${MAP_ART[map.id]}.png`);
  const icons=Object.fromEntries(map.drops.map(name=>[name,loadImage(`assets/event-demo/ingredients/${ITEM_ART[name]}.png`)]));
  const pickups=[],hazards=[];
  const state={x:38,y:ground-64,vy:0,hearts:4,collected:{},count:0,finished:false,invincible:0,started:true,distance:0};
  const input={left:false,right:false,jump:false};
  let nextPickup=185,nextHazard=430,pickupIndex=0,hazardIndex=0,jumpHeld=false,raf=0,last=0,dead=false;

  container.innerHTML=`<section class="expedition" aria-label="Chuyến thu mua ${map.name}">
    <header class="expedition-head"><div><small>ENDLESS RUN · ${map.name.toUpperCase()}</small><h2>Thu thập nguyên liệu</h2><p>Nhân vật tự chạy. Nhảy qua chướng ngại, nhặt càng nhiều càng tốt; hết 4 tim chuyến sẽ kết thúc.</p></div><button type="button" data-run-leave>← HỦY CHUYẾN</button></header>
    <div class="expedition-hud"><b data-run-health>❤❤❤❤</b><span data-run-items>Nguyên liệu 0</span><span data-run-distance>0 m</span></div>
    <canvas class="expedition-canvas" width="${width}" height="${height}" aria-label="Màn chạy vô tận thu thập nguyên liệu"></canvas>
    <div class="expedition-controls"><button type="button" data-run-input="left" aria-label="Chậm lại">◀ CHẬM</button><button type="button" data-run-input="right" aria-label="Tăng tốc">TĂNG TỐC ▶</button><button type="button" data-run-input="jump" aria-label="Nhảy">↑ NHẢY</button><span>A/D giảm/tăng tốc · Space/W/↑ nhảy</span></div>
    <div class="expedition-message" data-run-message role="status">Chuyến thu mua đã bắt đầu · cố giữ 4 tim càng lâu càng tốt!</div>
    <div class="expedition-result" data-run-result hidden></div>
  </section>`;
  container.scrollTop=0;
  const canvas=container.querySelector('canvas'),ctx=canvas.getContext('2d');
  const health=container.querySelector('[data-run-health]'),items=container.querySelector('[data-run-items]'),distance=container.querySelector('[data-run-distance]'),message=container.querySelector('[data-run-message]'),result=container.querySelector('[data-run-result]');
  const setMessage=text=>{message.textContent=text;};
  const keyType=key=>({a:'left',ArrowLeft:'left',d:'right',ArrowRight:'right',w:'jump',ArrowUp:'jump',' ':'jump',Space:'jump'})[key];
  function keyDown(event){const type=keyType(event.key);if(!type||state.finished||!container.querySelector('.expedition'))return;event.preventDefault();input[type]=true;state.started=true;}
  function keyUp(event){const type=keyType(event.key);if(type){event.preventDefault();input[type]=false;if(type==='jump')jumpHeld=false;}}
  function releaseInput(){input.left=input.right=input.jump=false;jumpHeld=false;}
  function pointerDown(event){const type=event.target.closest('[data-run-input]')?.dataset.runInput;if(!type||state.finished)return;event.preventDefault();input[type]=true;state.started=true;event.target.setPointerCapture?.(event.pointerId);}
  function pointerUp(event){const type=event.target.closest('[data-run-input]')?.dataset.runInput;if(type){input[type]=false;if(type==='jump')jumpHeld=false;}}
  function leave(){destroy();onLeave();}
  function claim(){const loot={...state.collected};destroy();onComplete(loot);}
  function spawnAhead(){
    const edge=state.x+width+520;
    while(nextPickup<edge){pickups.push({x:nextPickup,y:pickupIndex%3===1?ground-98:ground-47,name:map.drops[pickupIndex%map.drops.length],taken:false});pickupIndex++;nextPickup+=145+(pickupIndex%4)*17;}
    while(nextHazard<edge){hazards.push({x:nextHazard,hit:false});hazardIndex++;nextHazard+=305+(hazardIndex%3)*55;}
  }
  function finishRun(){
    if(state.finished)return;
    state.finished=true;releaseInput();
    const loot=Object.entries(state.collected).map(([name,count])=>`<div><img src="assets/event-demo/ingredients/${ITEM_ART[name]}.png" alt=""><span><b>${name}</b><small>×${count}</small></span></div>`).join('')||'<p>Chuyến này chưa nhặt được nguyên liệu.</p>';
    result.hidden=false;result.innerHTML=`<small>HẾT TIM · KẾT THÚC CHUYẾN</small><h3>Đã chạy ${state.distance} m</h3><div class="expedition-loot">${loot}</div><button type="button" data-run-claim>NHẬP KHO &amp; VỀ BẾP →</button>`;
    result.querySelector('[data-run-claim]').addEventListener('click',claim);
    container.querySelector('.expedition-controls').hidden=true;
    setMessage(`Chuyến kết thúc: ${state.count} nguyên liệu. Kiểm tra thành quả rồi nhập kho.`);
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function finishForTest(){
    if(state.finished)return false;
    for(let i=0;i<6;i++){const name=map.drops[i%map.drops.length];state.collected[name]=(state.collected[name]||0)+1;state.count++;}
    state.distance=Math.max(state.distance,120);state.hearts=0;finishRun();return true;
  }
  function update(dt){
    if(state.finished)return;
    const step=Math.min(dt,2);spawnAhead();
    if(state.invincible>0)state.invincible-=step;
    const baseSpeed=4.15+Math.min(2.1,state.distance/1800),speed=Math.max(2.35,baseSpeed+(input.right?1.55:0)-(input.left?1.8:0));
    state.x+=speed*step;state.distance=Math.max(0,Math.floor((state.x-38)/10));
    const grounded=state.y>=ground-64-.5;
    if(input.jump&&grounded&&!jumpHeld){state.vy=-12.7;jumpHeld=true;}
    state.vy+=0.62*step;state.y=Math.min(ground-64,state.y+state.vy*step);
    if(state.y>=ground-64)state.vy=0;
    for(const item of pickups){
      if(item.taken)continue;
      if(Math.abs((state.x+27)-item.x)<34&&Math.abs((state.y+34)-item.y)<42){item.taken=true;state.collected[item.name]=(state.collected[item.name]||0)+1;state.count++;setMessage(`Đã nhặt ${item.name}! Còn ${state.hearts} tim.`);}
    }
    for(const hazard of hazards){
      if(hazard.hit)continue;
      if(Math.abs(state.x-hazard.x)<29&&state.y>ground-105&&state.invincible<=0){hazard.hit=true;state.hearts--;state.invincible=78;setMessage(state.hearts?`Va phải chướng ngại · còn ${state.hearts} tim!`:'Hết tim! Đang chốt nguyên liệu...');if(state.hearts<=0)finishRun();}
    }
    while(pickups.length&&pickups[0].x<state.x-350)pickups.shift();
    while(hazards.length&&hazards[0].x<state.x-350)hazards.shift();
    health.textContent='❤'.repeat(state.hearts)+'♡'.repeat(4-state.hearts);
    items.textContent=`Nguyên liệu ${state.count}`;distance.textContent=`${state.distance} m`;
  }
  function drawImageCover(image,x,y,w,h){if(!image.complete||!image.naturalWidth)return false;const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight),sw=w/scale,sh=h/scale;ctx.drawImage(image,(image.naturalWidth-sw)/2,(image.naturalHeight-sh)/2,sw,sh,x,y,w,h);return true;}
  function render(){
    const camera=Math.max(0,state.x-170);ctx.clearRect(0,0,width,height);
    if(!drawImageCover(background,0,0,width,height)){ctx.fillStyle='#263b54';ctx.fillRect(0,0,width,height);}
    ctx.fillStyle='#09162799';ctx.fillRect(0,0,width,height);ctx.fillStyle='#142936';ctx.fillRect(0,ground,width,height-ground);
    ctx.fillStyle=map.id==='babylon'?'#bcdde9':map.id==='taixuan'?'#819d89':'#68b4c9';ctx.fillRect(0,ground,width,6);
    const markerStart=Math.floor(camera/72)*72;for(let x=markerStart;x<camera+width+72;x+=72){const sx=x-camera;ctx.fillStyle='#ffffff22';ctx.fillRect(sx,ground+24,42,3);}
    for(const hazard of hazards){const sx=hazard.x-camera;if(sx<-60||sx>width+60)continue;ctx.fillStyle=hazard.hit?'#6c5361':'#d64b58';ctx.beginPath();ctx.moveTo(sx-24,ground);ctx.lineTo(sx,ground-32);ctx.lineTo(sx+24,ground);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffe7bc';ctx.lineWidth=3;ctx.stroke();}
    for(const item of pickups){if(item.taken)continue;const sx=item.x-camera;if(sx<-50||sx>width+50)continue;ctx.fillStyle='#f6dfad';ctx.beginPath();ctx.arc(sx,item.y,26,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#623e42';ctx.lineWidth=3;ctx.stroke();const art=icons[item.name];if(art.complete&&art.naturalWidth)ctx.drawImage(art,sx-23,item.y-23,46,46);}
    const hx=state.x-camera;if(state.invincible<=0||Math.floor(state.invincible/6)%2===0){if(hero.complete&&hero.naturalWidth)ctx.drawImage(hero,0,0,48,64,hx,state.y,56,68);else{ctx.fillStyle='#e46f78';ctx.fillRect(hx+8,state.y+5,40,59);}}
    ctx.fillStyle='#0a1b25b8';ctx.fillRect(15,14,215,27);ctx.fillStyle='#f8e0a6';ctx.font='900 13px system-ui';ctx.fillText(`ENDLESS · ${state.distance} m`,28,33);
  }
  function frame(time){if(dead)return;const dt=last?Math.min((time-last)/16.667,2):1;last=time;update(dt);render();if(!dead&&!state.finished)raf=requestAnimationFrame(frame);}
  function destroy(){if(dead)return;dead=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',releaseInput);container.removeEventListener('pointerdown',pointerDown);container.removeEventListener('pointerup',pointerUp);container.removeEventListener('pointercancel',pointerUp);container.querySelector('[data-run-leave]')?.removeEventListener('click',leave);container.querySelector('[data-run-claim]')?.removeEventListener('click',claim);}
  window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',releaseInput);
  container.addEventListener('pointerdown',pointerDown);container.addEventListener('pointerup',pointerUp);container.addEventListener('pointercancel',pointerUp);container.querySelector('[data-run-leave]').addEventListener('click',leave);
  spawnAhead();raf=requestAnimationFrame(frame);
  return {destroy,finishForTest,snapshot:()=>({x:state.x,hearts:state.hearts,count:state.count,distance:state.distance,collected:{...state.collected},finished:state.finished,pickups:pickups.map(item=>({name:item.name,taken:item.taken}))})};
}
