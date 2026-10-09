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
  const width=900,height=320,ground=255,worldLength=1430;
  const hero=loadImage(`assets/event-v3/${HERO_ART[buyer]||HERO_ART.senti}`);
  const background=loadImage(`assets/event-demo/maps/${MAP_ART[map.id]}.png`);
  const icons=Object.fromEntries(map.drops.map(name=>[name,loadImage(`assets/event-demo/ingredients/${ITEM_ART[name]}.png`)]));
  const pickups=[185,340,505,670,835,1000,1165,1320].map((x,index)=>({x,y:index%3===1?ground-95:ground-46,name:map.drops[index%map.drops.length],taken:false}));
  const hazards=[430,750,1100].map(x=>({x}));
  const state={x:38,y:ground-64,vy:0,hearts:4,collected:{},count:0,finished:false,invincible:0,started:false};
  const input={left:false,right:false,jump:false};
  let raf=0,last=0,dead=false;
  container.innerHTML=`<section class="expedition" aria-label="Chuyến thu mua ${map.name}">
    <header class="expedition-head"><div><small>EVENT RUN · ${map.name.toUpperCase()}</small><h2>Thu thập nguyên liệu</h2><p>Đi qua bản đồ, nhặt ít nhất 3 nguyên liệu rồi tới cổng về. Né vùng nguy hiểm để giữ hàng.</p></div><button type="button" data-run-leave>← VỀ CHỌN KHU</button></header>
    <div class="expedition-hud"><b data-run-health>❤❤❤❤</b><span data-run-items>Nguyên liệu 0/3</span><span data-run-distance>0 m</span></div>
    <canvas class="expedition-canvas" width="${width}" height="${height}" aria-label="Màn chạy thu thập nguyên liệu"></canvas>
    <div class="expedition-controls"><button type="button" data-run-input="left" aria-label="Đi trái">◀ TRÁI</button><button type="button" data-run-input="right" aria-label="Đi phải">PHẢI ▶</button><button type="button" data-run-input="jump" aria-label="Nhảy">↑ NHẢY</button><span>A/D hoặc ←/→ di chuyển · Space/W/↑ nhảy</span></div>
    <div class="expedition-message" data-run-message role="status">Đi tới và chạm vào nguyên liệu để nhặt.</div>
  </section>`;
  container.scrollTop=0;
  const canvas=container.querySelector('canvas'),ctx=canvas.getContext('2d');
  const health=container.querySelector('[data-run-health]'),items=container.querySelector('[data-run-items]'),distance=container.querySelector('[data-run-distance]'),message=container.querySelector('[data-run-message]');
  const setMessage=text=>{message.textContent=text;};
  const keyType=key=>({a:'left',ArrowLeft:'left',d:'right',ArrowRight:'right',w:'jump',ArrowUp:'jump',' ':'jump',Space:'jump'})[key];
  function keyDown(event){const type=keyType(event.key);if(!type)return;if(!container.querySelector('.expedition'))return;event.preventDefault();input[type]=true;state.started=true;}
  function keyUp(event){const type=keyType(event.key);if(type){event.preventDefault();input[type]=false;}}
  function releaseInput(){input.left=input.right=input.jump=false;}
  function pointerDown(event){const type=event.target.closest('[data-run-input]')?.dataset.runInput;if(!type)return;event.preventDefault();input[type]=true;state.started=true;event.target.setPointerCapture?.(event.pointerId);}
  function pointerUp(event){const type=event.target.closest('[data-run-input]')?.dataset.runInput;if(type)input[type]=false;}
  function leave(){destroy();onLeave();}
  function finish(){
    if(state.count<3){setMessage(`Cần nhặt thêm ${3-state.count} nguyên liệu rồi mới về quán.`);state.x=worldLength-155;return;}
    state.finished=true;destroy();onComplete({...state.collected});
  }
  function update(dt){
    const step=Math.min(dt,2);
    if(state.invincible>0)state.invincible-=step;
    const speed=5.4*step;
    if(input.left)state.x=Math.max(10,state.x-speed);
    if(input.right)state.x=Math.min(worldLength-40,state.x+speed);
    if(input.jump&&state.y>=ground-64-.5){state.vy=-12.7;state.started=true;}
    state.vy+=0.62*step;state.y=Math.min(ground-64,state.y+state.vy*step);
    if(state.y>=ground-64)state.vy=0;
    for(const item of pickups){
      if(item.taken)continue;
      if(Math.abs((state.x+27)-item.x)<33&&Math.abs((state.y+34)-item.y)<40){item.taken=true;state.collected[item.name]=(state.collected[item.name]||0)+1;state.count++;setMessage(`Đã nhặt ${item.name}! Tiếp tục tới cổng về.`);}
    }
    for(const hazard of hazards){
      if(Math.abs(state.x-hazard.x)<27&&state.y>ground-105&&state.invincible<=0){
        state.hearts--;state.invincible=85;state.x=Math.max(10,state.x-62);setMessage('Trúng vùng nguy hiểm! Né bằng nút NHẢY.');
        if(state.hearts<=0){state.hearts=4;state.x=38;state.y=ground-64;state.vy=0;state.invincible=110;setMessage('Đã quay lại đầu đường; nguyên liệu vừa nhặt vẫn còn trong túi.');}
      }
    }
    health.textContent='❤'.repeat(state.hearts)+'♡'.repeat(4-state.hearts);
    items.textContent=`Nguyên liệu ${state.count}/3`;
    distance.textContent=`${Math.round(state.x/worldLength*100)}% đường về`;
    if(state.x>=worldLength-55)finish();
  }
  function drawImageCover(image,x,y,w,h){if(!image.complete||!image.naturalWidth)return false;const scale=Math.max(w/image.naturalWidth,h/image.naturalHeight);const sw=w/scale,sh=h/scale;ctx.drawImage(image,(image.naturalWidth-sw)/2,(image.naturalHeight-sh)/2,sw,sh,x,y,w,h);return true;}
  function render(){
    const camera=Math.max(0,Math.min(worldLength-width,state.x-170));
    ctx.clearRect(0,0,width,height);
    if(!drawImageCover(background,0,0,width,height)) {ctx.fillStyle='#263b54';ctx.fillRect(0,0,width,height);}
    ctx.fillStyle='#09162799';ctx.fillRect(0,0,width,height);
    ctx.fillStyle='#142936';ctx.fillRect(0,ground,width,height-ground);
    ctx.fillStyle=map.id==='babylon'?'#bcdde9':map.id==='taixuan'?'#819d89':'#68b4c9';ctx.fillRect(0,ground,width,6);
    for(let x=0;x<worldLength;x+=72){let sx=x-camera;if(sx<-72||sx>width)continue;ctx.fillStyle='#ffffff22';ctx.fillRect(sx,ground+24,42,3);}
    for(const hazard of hazards){const sx=hazard.x-camera;if(sx<-60||sx>width+60)continue;ctx.fillStyle='#d64b58';ctx.beginPath();ctx.moveTo(sx-24,ground);ctx.lineTo(sx,ground-32);ctx.lineTo(sx+24,ground);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffe7bc';ctx.lineWidth=3;ctx.stroke();}
    for(const item of pickups){if(item.taken)continue;const sx=item.x-camera;if(sx<-50||sx>width+50)continue;ctx.fillStyle='#f6dfad';ctx.beginPath();ctx.arc(sx,item.y,26,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#623e42';ctx.lineWidth=3;ctx.stroke();const art=icons[item.name];if(art.complete&&art.naturalWidth)ctx.drawImage(art,sx-23,item.y-23,46,46);}
    const gate=worldLength-25-camera;if(gate>-80&&gate<width+100){ctx.fillStyle='#d7ede5';ctx.fillRect(gate-17,ground-122,34,122);ctx.fillStyle='#509f88';ctx.fillRect(gate-21,ground-127,42,10);ctx.fillStyle='#112b39';ctx.font='bold 15px system-ui';ctx.fillText('VỀ QUÁN',gate-35,ground-140);}
    const hx=state.x-camera;if(state.invincible<=0||Math.floor(state.invincible/6)%2===0){
      if(hero.complete&&hero.naturalWidth)ctx.drawImage(hero,0,0,48,64,hx,state.y,56,68);
      else {ctx.fillStyle='#e46f78';ctx.fillRect(hx+8,state.y+5,40,59);}
    }
    ctx.fillStyle='#f8e0a6';ctx.fillRect(15,15,(width-30)*(state.x/worldLength),6);ctx.strokeStyle='#fff5';ctx.strokeRect(15,15,width-30,6);
  }
  function frame(time){if(dead)return;const dt=last?Math.min((time-last)/16.667,2):1;last=time;update(dt);render();if(!dead)raf=requestAnimationFrame(frame);}
  function destroy(){if(dead)return;dead=true;cancelAnimationFrame(raf);window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',releaseInput);container.removeEventListener('pointerdown',pointerDown);container.removeEventListener('pointerup',pointerUp);container.removeEventListener('pointercancel',pointerUp);container.querySelector('[data-run-leave]')?.removeEventListener('click',leave);}
  window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',releaseInput);
  container.addEventListener('pointerdown',pointerDown);container.addEventListener('pointerup',pointerUp);container.addEventListener('pointercancel',pointerUp);
  container.querySelector('[data-run-leave]').addEventListener('click',leave);
  raf=requestAnimationFrame(frame);
  return {destroy,snapshot:()=>({x:state.x,hearts:state.hearts,count:state.count,collected:{...state.collected},finished:state.finished,pickups:pickups.map(item=>({name:item.name,taken:item.taken}))})};
}
