const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

export function startDishwashingMiniGame({container,sentiAsset,onComplete,onCancel}){
  const width=760,height=360,totalPlates=6;
  let raf=0,destroyed=false,started=false,ended=false,dragging=false,startTime=0;
  const senti=new Image();senti.src=sentiAsset;
  const state={plate:0,cleaned:0,timeLeft:40,progress:0,streak:0,misses:0,spots:[],sponge:{x:520,y:210},feedback:'Kéo miếng bọt qua vết bẩn'};
  const makeSpots=()=>{state.spots=Array.from({length:7},(_,index)=>({x:390+(index%3)*74+(Math.random()*24-12),y:128+Math.floor(index/3)*55+(Math.random()*18-9),r:15+Math.random()*9,clean:0}));};
  makeSpots();
  container.innerHTML=`<section class="washing-game"><header class="cooking-game-head"><div class="cooking-game-goal"><span class="wash-senti-avatar" style="background-image:url('${sentiAsset}')"></span><span><small>KHUYA · SENTI TRỰC BẾP</small><h2>Senti rửa bát</h2><p>Kéo bọt xà phòng chà sạch 6 chồng bát trước khi hết giờ.</p></span></div><button type="button" data-wash-cancel>← VỀ TỔNG KẾT</button></header><div class="cooking-game-brief"><b>Giữ chuột/ngón tay và chà trùng từng vết bẩn.</b><span data-wash-status>0/${totalPlates} chồng</span></div><div class="cooking-game-meter"><i data-wash-meter></i></div><div class="cooking-canvas-wrap"><canvas width="${width}" height="${height}" aria-label="Minigame Senti rửa bát"></canvas><div class="cooking-game-result intro" data-wash-result><b>SENTI SẴN SÀNG!</b><span>Chà sạch liên tục để giữ chuỗi YATTA.</span><button type="button" data-wash-start>BẮT ĐẦU RỬA</button></div></div><footer class="cooking-game-foot"><span>THỜI GIAN <b data-wash-time>40,0s</b></span><em>Hoàn thành nhanh: +2 Mảnh Bản Vẽ · hoàn thành thường: +1</em></footer></section>`;
  container.scrollTop=0;
  const canvas=container.querySelector('canvas'),ctx=canvas.getContext('2d'),result=container.querySelector('[data-wash-result]'),meter=container.querySelector('[data-wash-meter]'),status=container.querySelector('[data-wash-status]'),timeLabel=container.querySelector('[data-wash-time]');
  ctx.imageSmoothingEnabled=false;
  function point(event){const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*width/rect.width,y:(event.clientY-rect.top)*height/rect.height};}
  function scrub(p){state.sponge=p;let hit=false;for(const spot of state.spots){if(spot.clean>=1)continue;const d=Math.hypot(p.x-spot.x,p.y-spot.y);if(d<spot.r+28){spot.clean=clamp(spot.clean+.16,0,1);hit=true;}}if(hit)state.streak++;else state.misses++;if(state.spots.every(spot=>spot.clean>=1))finishPlate();}
  function finishPlate(){state.plate++;state.cleaned++;state.progress=state.cleaned/totalPlates;state.feedback=state.plate>=totalPlates?'SẠCH BONG!':`Chồng ${state.plate} sạch · tiếp tục!`;if(state.plate>=totalPlates){finish(true);return;}makeSpots();}
  function pointerDown(event){if(!started||ended||event.target!==canvas)return;dragging=true;event.preventDefault();scrub(point(event));canvas.setPointerCapture?.(event.pointerId);}
  function pointerMove(event){if(!dragging||ended)return;event.preventDefault();scrub(point(event));}
  function pointerUp(event){dragging=false;canvas.releasePointerCapture?.(event.pointerId);}
  function rounded(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
  function draw(time){
    const bg=ctx.createLinearGradient(0,0,0,height);bg.addColorStop(0,'#bcecf2');bg.addColorStop(1,'#f8dfbd');ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
    ctx.fillStyle='#6d4659';rounded(24,24,176,312,22);ctx.fillStyle='#f3c49b';rounded(34,34,156,292,17);
    if(senti.complete&&senti.naturalWidth){ctx.drawImage(senti,38,70,148,148);}else{ctx.fillStyle='#e95f6e';ctx.beginPath();ctx.arc(112,130,55,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#654052';ctx.font='1000 18px system-ui';ctx.textAlign='center';ctx.fillText('SENTI',112,240);ctx.font='800 13px system-ui';ctx.fillText(state.feedback,112,268);ctx.fillText(`Chuỗi chà ${state.streak}`,112,292);
    ctx.fillStyle='#6c8590';rounded(240,54,490,260,32);ctx.fillStyle='#dff7f5';rounded(258,72,454,222,24);ctx.fillStyle='#8cd5dd';rounded(275,92,420,182,22);
    ctx.fillStyle='#fffdf2';ctx.beginPath();ctx.ellipse(505,181,160,94,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#619da8';ctx.lineWidth=8;ctx.stroke();ctx.beginPath();ctx.ellipse(505,181,118,66,0,0,Math.PI*2);ctx.strokeStyle='#c7dde1';ctx.lineWidth=4;ctx.stroke();
    for(const spot of state.spots){if(spot.clean>=1)continue;ctx.globalAlpha=1-spot.clean;ctx.fillStyle='#8c5c3e';ctx.beginPath();ctx.arc(spot.x,spot.y,spot.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5b4035';ctx.beginPath();ctx.arc(spot.x+4,spot.y-3,spot.r*.45,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
    if(started&&!ended){ctx.fillStyle='#fff';for(let i=0;i<9;i++){const a=time/420+i*.7;ctx.globalAlpha=.45+.35*Math.sin(a);ctx.beginPath();ctx.arc(state.sponge.x+Math.cos(a)*24,state.sponge.y+Math.sin(a)*17,5+(i%3),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;ctx.fillStyle='#f2bf55';rounded(state.sponge.x-24,state.sponge.y-14,48,28,10);ctx.strokeStyle='#855638';ctx.lineWidth=4;ctx.stroke();}
    ctx.textAlign='left';ctx.fillStyle='#4c5960';ctx.font='1000 15px system-ui';ctx.fillText(`CHỒNG ${Math.min(state.plate+1,totalPlates)}/${totalPlates}`,282,44);
  }
  function update(time){state.timeLeft=Math.max(0,40-(time-startTime)/1000);timeLabel.textContent=`${state.timeLeft.toFixed(1).replace('.',',')}s`;status.textContent=`${state.cleaned}/${totalPlates} chồng`;meter.style.width=`${Math.round(state.progress*100)}%`;if(state.timeLeft<=0)finish(false);}
  function finish(success){if(ended)return;ended=true;dragging=false;cancelAnimationFrame(raf);result.hidden=false;const fast=success&&state.timeLeft>=16;result.className=`cooking-game-result ${success?'success':'failed'}`;result.innerHTML=success?`<b>${fast?'★ RỬA SIÊU TỐC!':'✓ SẠCH HẾT!'}</b><span>Senti đã xử lý ${totalPlates} chồng bát · ${fast?'+2':'+1'} Mảnh Bản Vẽ.</span>`:`<b>HẾT GIỜ!</b><span>Còn ${totalPlates-state.cleaned} chồng chưa sạch.</span><button type="button" data-wash-retry>RỬA LẠI</button>`;if(success)setTimeout(()=>{destroy();onComplete({fast,reward:fast?2:1,timeLeft:state.timeLeft});},1100);else result.querySelector('[data-wash-retry]').addEventListener('click',reset);}
  function reset(){ended=false;started=true;dragging=false;Object.assign(state,{plate:0,cleaned:0,timeLeft:40,progress:0,streak:0,misses:0,feedback:'Kéo miếng bọt qua vết bẩn'});makeSpots();startTime=performance.now();result.hidden=true;frame.last=0;raf=requestAnimationFrame(frame);}
  function begin(){if(started)return;started=true;startTime=performance.now();result.hidden=true;frame.last=0;}
  function frame(time){if(destroyed||ended)return;draw(time);if(started)update(time);raf=requestAnimationFrame(frame);}
  function cancel(){destroy();onCancel();}
  function destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointercancel',pointerUp);container.querySelector('[data-wash-cancel]')?.removeEventListener('click',cancel);}
  function finishForTest(){if(!started)begin();state.cleaned=totalPlates;state.plate=totalPlates;state.progress=1;state.timeLeft=22;finish(true);return true;}
  canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerUp);container.querySelector('[data-wash-cancel]').addEventListener('click',cancel);result.querySelector('[data-wash-start]').addEventListener('click',begin);raf=requestAnimationFrame(frame);
  return{destroy,finishForTest,snapshot:()=>({...state,spots:state.spots.map(spot=>({...spot})),ended,started})};
}
