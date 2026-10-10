const INGREDIENT_ART={
  'Đá Bào Parvati':'parvati-ice','Thịt Lợn Neon':'neon-pork','Nấm Ký Ức':'memory-mushroom',
  'Gia vị công nghiệp':'industrial-spice','Cà Chua Nhiễu Sóng':'glitch-tomato','Măng rừng':'bamboo-shoot',
  'Rong Biển Honkai':'honkai-seaweed','Lá trà':'thousand-year-tea','Gà chạy bộ':'taixuan-chicken',
  'Cua Biển Chết':'dead-sea-crab','Cá Ngừ đóng băng':'frozen-tuna','Lõi Heimdall':'heimdall-core'
};
const STEP_META=[
  {key:'slice',kicker:'01 · SƠ CHẾ',title:'Thái nguyên liệu',instruction:'Vuốt dọc đúng tâm vạch. Cắt càng lệch, chất lượng càng giảm.',target:6},
  {key:'fry',kicker:'02 · XÀO CHẢO',title:'Đảo chảo trên lửa',instruction:'Đảo vừa lực: quá nhẹ chưa chín, quá mạnh sẽ văng đồ ăn.',target:8},
  {key:'simmer',kicker:'03 · HẦM',title:'Canh nhiệt nồi hầm',instruction:'Canh 3 mốc nhiệt ngẫu nhiên. Chốt xanh là hoàn hảo, quá nhiệt sẽ cháy.',target:3}
];
const GRADE_META={
  perfect:{label:'HOÀN HẢO',short:'XANH',points:2,color:'#4fc58b'},
  good:{label:'TẠM ỔN',short:'VÀNG',points:1,color:'#f2c84b'},
  burnt:{label:'CHÁY / LỆCH',short:'ĐỎ',points:0,color:'#ef6656'}
};
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const loadImage=src=>{const image=new Image();image.src=src;return image;};

export function startCookingMiniGame({container,step,dish,onComplete,onCancel}){
  const meta=STEP_META[step]||STEP_META[0],width=760,height=340;
  const ingredientName=dish.ingredients?.[step%dish.ingredients.length]||dish.ingredients?.[0]||dish.name;
  const ingredientKey=INGREDIENT_ART[ingredientName];
  const ingredientImage=loadImage(ingredientKey?`assets/event-demo/ingredients/${ingredientKey}.png`:dish.asset);
  const dishImage=loadImage(dish.asset);
  let raf=0,completionClock=0,destroyed=false,ended=false,startTime=0,dragging=false,lastPoint=null,gestureStart=null;
  const state={step,key:meta.key,started:false,progress:0,score:0,cuts:Array(meta.target).fill(false),cutResults:Array(meta.target).fill(null),cutOffsets:Array(meta.target).fill(0),panX:0,lastDirection:0,turnDistance:0,tosses:0,fryResults:[],spills:[],tossPulse:0,temp:18,heat:0,simmerRound:0,simmerResults:[],simmerTarget:56,simmerSpeed:24,timeLeft:45,feedback:null,feedbackUntil:0,finalGrade:null};

  container.innerHTML=`<section class="cooking-game" data-cooking-game="${meta.key}">
    <header class="cooking-game-head"><div class="cooking-game-goal"><img src="${dish.asset}" alt="${dish.name}"><span><small>${meta.kicker}</small><h2>${meta.title}</h2><p>${dish.name} · ${ingredientName}</p></span></div><button type="button" data-cooking-cancel>← VỀ BẾP</button></header>
    <div class="cooking-game-brief"><b>${meta.instruction}</b><span data-cooking-status>${meta.key==='slice'?'0/6 lát':meta.key==='fry'?'0/8 lần hất':'Mốc 1/3'}</span></div>
    <div class="cooking-game-meter"><i data-cooking-meter></i></div>
    <div class="cooking-grade-track" data-cooking-grades>${Array.from({length:meta.target},(_,index)=>`<i title="Lượt ${index+1}"></i>`).join('')}</div>
    <div class="cooking-canvas-wrap"><canvas width="${width}" height="${height}" aria-label="Minigame ${meta.title}"></canvas><div class="cooking-game-result intro" data-cooking-result><b>SẴN SÀNG?</b><span>${meta.instruction}</span><button type="button" data-cooking-start>BẮT ĐẦU</button></div></div>
    <div class="cooking-game-controls" data-cooking-controls hidden>${meta.key==='slice'?'<span>🖱 GIỮ CHUỘT VÀ VUỐT DỌC XUỐNG</span>':meta.key==='fry'?'<button type="button" data-cooking-input="left">◀ KÉO TRÁI</button><span>🍳 GIỮ LỰC VỪA PHẢI</span><button type="button" data-cooking-input="right">KÉO PHẢI ▶</button>':'<button type="button" data-cooking-input="down">🧯 HẠ LỬA</button><button class="cooking-lock" type="button" data-cooking-input="lock">✓ CHỐT NHIỆT</button><button type="button" data-cooking-input="up">🔥 TĂNG LỬA</button>'}</div>
    <footer class="cooking-game-foot"><span>THỜI GIAN <b data-cooking-time>45,0s</b></span><em>${meta.key==='slice'?'Xanh ≤ 10px · Vàng ≤ 30px · Đỏ khi quá lệch':meta.key==='fry'?'Xanh: lực vừa · Đỏ: văng đồ ăn':'Mỗi mốc đổi tốc độ và vùng nhiệt ngẫu nhiên'}</em></footer>
  </section>`;
  container.scrollTop=0;
  const canvas=container.querySelector('canvas'),ctx=canvas.getContext('2d'),meter=container.querySelector('[data-cooking-meter]'),status=container.querySelector('[data-cooking-status]'),timeLabel=container.querySelector('[data-cooking-time]'),result=container.querySelector('[data-cooking-result]'),controls=container.querySelector('[data-cooking-controls]'),gradeTrack=container.querySelector('[data-cooking-grades]');
  ctx.imageSmoothingEnabled=false;

  function localPoint(event){const rect=canvas.getBoundingClientRect();return {x:(event.clientX-rect.left)*width/rect.width,y:(event.clientY-rect.top)*height/rect.height};}
  function paintGrade(index,grade){const pip=gradeTrack.children[index];if(!pip)return;pip.className=grade;pip.textContent=grade==='perfect'?'★':grade==='good'?'●':'×';pip.title=GRADE_META[grade].label;}
  function showJudgement(grade,label=GRADE_META[grade].label){state.feedback={grade,label};state.feedbackUntil=performance.now()+800;}
  function aggregateGrade(results){
    if(results.length<meta.target)return null;
    if(results.every(grade=>grade==='perfect'))return 'perfect';
    if(meta.key==='simmer'&&results.includes('burnt'))return 'burnt';
    const average=results.reduce((sum,grade)=>sum+GRADE_META[grade].points,0)/(results.length*2);
    return average>=.5?'good':'burnt';
  }
  function completeFrom(results){const grade=aggregateGrade(results);if(grade)finish(grade);}
  function setupSimmerRound(){
    if(state.simmerRound>=meta.target){completeFrom(state.simmerResults);return;}
    state.temp=16+Math.random()*8;
    state.simmerTarget=44+Math.random()*28;
    state.simmerSpeed=21+Math.random()*25;
    state.heat=0;
  }
  function pointerDown(event){
    if(ended||!state.started)return;const input=event.target.closest?.('[data-cooking-input]')?.dataset.cookingInput;
    if(input){event.preventDefault();if(meta.key==='fry')nudgePan(input==='left'?-1:1);else if(input==='lock')lockTemperature();else state.heat=input==='up'?1:-1;return;}
    if(event.target!==canvas)return;event.preventDefault();dragging=true;lastPoint=localPoint(event);gestureStart={...lastPoint};canvas.setPointerCapture?.(event.pointerId);
  }
  function pointerMove(event){
    if(!dragging||ended||!state.started)return;const point=localPoint(event);
    if(meta.key==='fry')panMove(point.x-lastPoint.x);
    lastPoint=point;
  }
  function pointerUp(event){
    const input=event.target.closest?.('[data-cooking-input]')?.dataset.cookingInput;
    if(input&&meta.key==='simmer'&&input!=='lock')state.heat=0;
    if(dragging&&gestureStart&&event.target===canvas){const end=localPoint(event);if(meta.key==='slice')sliceGesture(gestureStart,end);else if(meta.key==='fry')panMove(end.x-(lastPoint?.x||gestureStart.x));}
    dragging=false;lastPoint=null;gestureStart=null;
  }
  function sliceGesture(from,to){
    const cutXs=[145,235,325,415,505,595],dy=to.y-from.y,dx=to.x-from.x;
    if(dy<95){showJudgement('burnt','VUỐT XUỐNG!');return;}
    const middleX=(from.x+to.x)/2;
    let index=-1,distance=Infinity;
    cutXs.forEach((x,i)=>{const next=Math.abs(middleX-x);if(!state.cuts[i]&&next<distance){distance=next;index=i;}});
    if(index<0||distance>60||Math.min(from.y,to.y)>150||Math.max(from.y,to.y)<220){showJudgement('burnt','TRƯỢT VẠCH!');return;}
    const slope=Math.abs(dx)/Math.max(1,Math.abs(dy));
    const grade=distance<=10&&slope<=.12?'perfect':distance<=30&&slope<=.38?'good':'burnt';
    state.cuts[index]=true;state.cutResults[index]=grade;state.cutOffsets[index]=clamp(middleX-cutXs[index],-42,42);state.score++;state.progress=state.score/meta.target;
    paintGrade(index,grade);showJudgement(grade,grade==='burnt'?'CẮT LỆCH!':GRADE_META[grade].label);
    if(state.score>=meta.target)completeFrom(state.cutResults);
  }
  function recordToss(){
    const force=state.turnDistance;
    if(force<28)return false;
    const grade=force>=52&&force<=96?'perfect':force<=125?'good':'burnt';
    state.fryResults.push(grade);state.tosses=state.fryResults.length;state.progress=state.tosses/meta.target;state.tossPulse=.45;
    if(grade==='burnt')state.spills.push({x:380+state.panX*.55+(Math.random()-.5)*240,y:250+Math.random()*45,r:7+Math.random()*7});
    paintGrade(state.tosses-1,grade);showJudgement(grade,grade==='burnt'?'VĂNG RA NGOÀI!':grade==='good'?'HƠI YẾU':'HẤT ĐẸP!');
    if(state.tosses>=meta.target)completeFrom(state.fryResults);
    return true;
  }
  function registerTurn(direction){if(state.lastDirection&&direction!==state.lastDirection){recordToss();state.turnDistance=0;}state.lastDirection=direction;}
  function panMove(dx){if(Math.abs(dx)<1)return;const direction=Math.sign(dx);registerTurn(direction);state.turnDistance+=Math.abs(dx);state.panX=clamp(state.panX+dx,-170,170);}
  function nudgePan(direction){registerTurn(direction);state.turnDistance+=58;state.panX=clamp(state.panX+direction*70,-170,170);}
  function lockTemperature(){
    if(meta.key!=='simmer'||state.simmerRound>=meta.target||ended)return;
    const difference=Math.abs(state.temp-state.simmerTarget);
    const grade=difference<=7?'perfect':difference<=17?'good':'burnt';
    state.simmerResults.push(grade);paintGrade(state.simmerRound,grade);showJudgement(grade,grade==='burnt'?'QUÁ NHIỆT!':grade==='good'?'TẠM ỔN':'ĐÚNG NHIỆT!');
    state.simmerRound++;state.progress=state.simmerRound/meta.target;
    if(state.simmerRound>=meta.target)completeFrom(state.simmerResults);else setupSimmerRound();
  }
  function keyDown(event){if(ended||!state.started)return;if(meta.key==='fry'&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){event.preventDefault();nudgePan(event.key==='ArrowLeft'?-1:1);}if(meta.key==='simmer'&&(event.key==='ArrowUp'||event.key==='ArrowDown')){event.preventDefault();state.heat=event.key==='ArrowUp'?1:-1;}if(meta.key==='simmer'&&(event.key===' '||event.key==='Enter')){event.preventDefault();lockTemperature();}}
  function keyUp(event){if(meta.key==='simmer'&&(event.key==='ArrowUp'||event.key==='ArrowDown'))state.heat=0;}
  function update(dt,time){
    state.timeLeft=Math.max(0,45-(time-startTime)/1000);
    if(meta.key==='simmer'){
      state.temp=clamp(state.temp+(state.simmerSpeed+state.heat*38)*dt,0,100);
      if(state.temp>=98){showJudgement('burnt','KHÉT RỒI!');state.simmerResults.push('burnt');paintGrade(state.simmerRound,'burnt');state.simmerRound++;state.progress=state.simmerRound/meta.target;if(state.simmerRound>=meta.target)completeFrom(state.simmerResults);else setupSimmerRound();}
    }
    state.tossPulse=Math.max(0,state.tossPulse-dt);
    meter.style.width=`${Math.round(clamp(state.progress,0,1)*100)}%`;
    status.textContent=meta.key==='slice'?`${state.score}/6 lát`:meta.key==='fry'?`${Math.min(state.tosses,8)}/8 lần hất`:`Mốc ${Math.min(state.simmerRound+1,3)}/3 · ${state.simmerSpeed<30?'CHẬM':state.simmerSpeed<39?'VỪA':'NHANH'}`;
    timeLabel.textContent=`${state.timeLeft.toFixed(1).replace('.',',')}s`;
    if(state.timeLeft<=0)finish('timeout');
  }
  function roundedRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);}
  function drawImageContain(image,x,y,w,h){if(!image.complete||!image.naturalWidth)return false;const scale=Math.min(w/image.naturalWidth,h/image.naturalHeight),dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)/2,dw,dh);return true;}
  function baseScene(){const gradient=ctx.createLinearGradient(0,0,0,height);gradient.addColorStop(0,'#e9f7ed');gradient.addColorStop(1,'#f9dfbb');ctx.fillStyle=gradient;ctx.fillRect(0,0,width,height);ctx.fillStyle='#ffffff70';for(let x=22;x<width;x+=48)for(let y=20;y<height;y+=48){ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);ctx.fill();}}
  function drawSlice(){
    baseScene();ctx.fillStyle='#b87645';roundedRect(70,58,620,235,30);ctx.fill();ctx.fillStyle='#f0bd78';roundedRect(82,70,596,211,24);ctx.fill();ctx.strokeStyle='#8b542f';ctx.lineWidth=5;ctx.stroke();
    const cutXs=[145,235,325,415,505,595];
    const drawIngredientPiece=(x,stroke)=>{ctx.fillStyle='#fff8ea';ctx.beginPath();ctx.arc(x,177,48,0,Math.PI*2);ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=4;ctx.stroke();if(!drawImageContain(ingredientImage,x-40,137,80,80)){ctx.fillStyle='#dc7c65';ctx.fillRect(x-24,151,48,52);}};
    cutXs.forEach((x,index)=>{
      const cut=state.cuts[index],grade=state.cutResults[index];
      if(cut){
        [-1,1].forEach(side=>{ctx.save();ctx.translate(side*9,side===-1?5:-3);ctx.rotate(side*(index%2?.05:-.05));ctx.beginPath();ctx.rect(side<0?x-58:x,120,58,115);ctx.clip();drawIngredientPiece(x,GRADE_META[grade].color);ctx.restore();});
        ctx.strokeStyle=GRADE_META[grade].color;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+state.cutOffsets[index],125);ctx.lineTo(x+state.cutOffsets[index],231);ctx.stroke();
      }else{
        drawIngredientPiece(x,'#d48752');ctx.setLineDash([8,7]);ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,104);ctx.lineTo(x,250);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#763e34';ctx.font='900 12px system-ui';ctx.fillText('↓',x-5,96);
      }
    });
    const knifeX=cutXs.find((_,index)=>!state.cuts[index])||650;ctx.save();ctx.translate(knifeX-18,90);ctx.rotate(-.45);ctx.fillStyle='#dce6e9';roundedRect(-8,-50,16,75,7);ctx.fill();ctx.fillStyle='#754234';roundedRect(-10,22,20,42,6);ctx.fill();ctx.restore();
  }
  function drawFry(){
    baseScene();ctx.fillStyle='#654a43';roundedRect(190,218,380,64,18);ctx.fill();ctx.fillStyle='#ee8b42';for(let x=235;x<535;x+=45){ctx.beginPath();ctx.moveTo(x,270);ctx.quadraticCurveTo(x+15,224,x+30,270);ctx.fill();}
    const x=380+state.panX*.55,pulse=state.tossPulse>0?1-state.tossPulse/.45:0,toss=state.tossPulse>0?Math.sin(pulse*Math.PI)*82:0;ctx.save();ctx.translate(x,0);ctx.fillStyle='#30343b';ctx.beginPath();ctx.ellipse(0,213,150,42,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111820';ctx.lineWidth=9;ctx.stroke();ctx.fillStyle='#4b5057';roundedRect(125,201,150,25,12);ctx.fill();ctx.fillStyle='#e9aa45';const foodCount=Math.max(3,8-state.spills.length);for(let i=0;i<foodCount;i++){const angle=i*.78+state.tosses*.45,px=Math.cos(angle)*80,py=195-Math.abs(Math.sin(angle))*42-toss*(.65+(i%3)*.13);ctx.beginPath();ctx.arc(px,py,12+(i%3),0,Math.PI*2);ctx.fill();}ctx.restore();
    state.spills.forEach((spill,index)=>{ctx.fillStyle=index%2?'#e75f44':'#e9aa45';ctx.beginPath();ctx.arc(spill.x,spill.y,spill.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8b4a35';ctx.lineWidth=2;ctx.stroke();});
    ctx.fillStyle='#663f35';ctx.font='900 17px system-ui';ctx.textAlign='center';ctx.fillText('LỰC VỪA MỚI KHÔNG RƠI ĐỒ',380,42);ctx.font='800 12px system-ui';ctx.fillStyle='#9c6450';ctx.fillText(`Đã rơi ${state.spills.length} miếng`,380,63);ctx.textAlign='left';
  }
  function drawSimmer(time){
    baseScene();const potX=250;ctx.fillStyle='#59636c';roundedRect(potX,115,260,145,24);ctx.fill();ctx.fillStyle='#343b43';roundedRect(potX-35,138,45,30,12);ctx.fill();roundedRect(potX+250,138,45,30,12);ctx.fill();ctx.fillStyle='#d78943';ctx.beginPath();ctx.ellipse(380,135,112,30,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#f4c76b';for(let i=0;i<10;i++){const angle=i*.7+time/500,px=380+Math.cos(angle)*76,py=133+Math.sin(angle)*15;ctx.beginPath();ctx.arc(px,py,5+(i%3),0,Math.PI*2);ctx.fill();}
    ctx.fillStyle=state.temp>88?'#ff4c35':'#d75b3f';for(let x=300;x<470;x+=43){const flame=14+Math.sin(time/170+x)*7+state.temp/12;ctx.beginPath();ctx.moveTo(x,279);ctx.quadraticCurveTo(x+10,279-flame,x+20,279);ctx.fill();}
    const gaugeTop=50,gaugeBottom=288,gaugeH=gaugeBottom-gaugeTop,tempY=gaugeBottom-state.temp/100*gaugeH,targetY=gaugeBottom-state.simmerTarget/100*gaugeH,perfectHalf=gaugeH*.07,goodHalf=gaugeH*.17;
    ctx.fillStyle='#e6e0d8';roundedRect(586,40,64,258,26);ctx.fill();ctx.fillStyle='#ef6656';ctx.fillRect(598,gaugeTop,40,gaugeH);ctx.fillStyle='#f2c84b';ctx.fillRect(598,targetY-goodHalf,40,goodHalf*2);ctx.fillStyle='#4fc58b';ctx.fillRect(598,targetY-perfectHalf,40,perfectHalf*2);ctx.strokeStyle='#68453d';ctx.lineWidth=4;ctx.strokeRect(598,gaugeTop,40,gaugeH);
    ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(576,tempY);ctx.lineTo(596,tempY-10);ctx.lineTo(596,tempY+10);ctx.closePath();ctx.fill();ctx.strokeStyle='#5c4037';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#5c4037';ctx.font='900 15px system-ui';ctx.fillText(`${Math.round(state.temp)}°`,656,tempY+5);ctx.font='800 11px system-ui';ctx.fillText(`MỤC TIÊU ${Math.round(state.simmerTarget)}°`,566,24);
    for(let i=0;i<6;i++){const bx=300+i*35,by=105-((time/18+i*23)%72);ctx.strokeStyle='#ffffffaa';ctx.lineWidth=3;ctx.beginPath();ctx.arc(bx,by,5+i%3,0,Math.PI*2);ctx.stroke();}
  }
  function drawFeedback(time){if(!state.feedback||time>state.feedbackUntil)return;const grade=state.feedback.grade;ctx.save();ctx.textAlign='center';ctx.font='1000 27px system-ui';ctx.lineWidth=7;ctx.strokeStyle='#fff';ctx.strokeText(state.feedback.label,380,94);ctx.fillStyle=GRADE_META[grade].color;ctx.fillText(state.feedback.label,380,94);ctx.restore();}
  function render(time){if(meta.key==='slice')drawSlice();else if(meta.key==='fry')drawFry();else drawSimmer(time);drawFeedback(time);}
  function finish(grade){
    if(ended)return;ended=true;dragging=false;state.heat=0;state.finalGrade=grade;cancelAnimationFrame(raf);controls.hidden=true;
    const passed=grade==='perfect'||grade==='good';
    result.hidden=false;result.className=`cooking-game-result ${passed?'success':'failed'} grade-${grade}`;
    if(grade==='perfect')result.innerHTML=`<b>★ HOÀN HẢO!</b><span>${meta.title} đạt hạng xanh · giữ chuỗi thưởng</span>`;
    else if(grade==='good')result.innerHTML=`<b>✓ TẠM ỔN</b><span>${meta.title} đạt hạng vàng · được qua bước</span>`;
    else result.innerHTML=`<b>${grade==='timeout'?'HẾT GIỜ!':'MÓN BỊ HỎNG!'}</b><span>${grade==='timeout'?'Chưa hoàn thành đủ thao tác.':'Điểm đỏ quá nhiều, làm lại để cứu mẻ nhé!'}</span><button type="button" data-cooking-retry>THỬ LẠI</button>`;
    if(passed){
      const judgements=meta.key==='slice'?[...state.cutResults]:meta.key==='fry'?[...state.fryResults]:[...state.simmerResults];
      completionClock=window.setTimeout(()=>{destroy();onComplete({grade,judgements,perfect:grade==='perfect'});},1050);
    }else result.querySelector('[data-cooking-retry]').addEventListener('click',reset);
  }
  function begin(){if(ended||state.started)return;state.started=true;if(meta.key==='simmer')setupSimmerRound();startTime=performance.now();frame.last=0;result.hidden=true;controls.hidden=false;}
  function reset(){
    ended=false;dragging=false;lastPoint=null;gestureStart=null;Object.assign(state,{started:true,progress:0,score:0,cuts:Array(meta.target).fill(false),cutResults:Array(meta.target).fill(null),cutOffsets:Array(meta.target).fill(0),panX:0,lastDirection:0,turnDistance:0,tosses:0,fryResults:[],spills:[],tossPulse:0,temp:18,heat:0,simmerRound:0,simmerResults:[],simmerTarget:56,simmerSpeed:24,timeLeft:45,feedback:null,feedbackUntil:0,finalGrade:null});Array.from(gradeTrack.children).forEach(pip=>{pip.className='';pip.textContent='';});if(meta.key==='simmer')setupSimmerRound();startTime=performance.now();frame.last=0;result.hidden=true;controls.hidden=false;raf=requestAnimationFrame(frame);
  }
  function finishForTest(){if(ended)return false;if(!state.started)begin();if(meta.key==='slice'){state.cuts.fill(true);state.cutResults.fill('perfect');state.score=meta.target;}else if(meta.key==='fry'){state.fryResults=Array(meta.target).fill('perfect');state.tosses=meta.target;}else{state.simmerResults=Array(meta.target).fill('perfect');state.simmerRound=meta.target;}Array.from(gradeTrack.children).forEach((_,index)=>paintGrade(index,'perfect'));state.progress=1;finish('perfect');return true;}
  function frame(time){if(destroyed||ended)return;const dt=Math.min(.05,(time-(frame.last||time))/1000);frame.last=time;if(state.started)update(dt,time);render(time);if(!destroyed&&!ended)raf=requestAnimationFrame(frame);}
  function cancel(){destroy();onCancel();}
  function destroy(){if(destroyed)return;destroyed=true;cancelAnimationFrame(raf);clearTimeout(completionClock);canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerup',pointerUp);canvas.removeEventListener('pointercancel',pointerUp);controls.removeEventListener('pointerdown',pointerDown);controls.removeEventListener('pointerup',pointerUp);controls.removeEventListener('pointercancel',pointerUp);window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);container.querySelector('[data-cooking-cancel]')?.removeEventListener('click',cancel);}
  canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('pointercancel',pointerUp);controls.addEventListener('pointerdown',pointerDown);controls.addEventListener('pointerup',pointerUp);controls.addEventListener('pointercancel',pointerUp);window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);container.querySelector('[data-cooking-cancel]').addEventListener('click',cancel);
  result.querySelector('[data-cooking-start]').addEventListener('click',begin);
  raf=requestAnimationFrame(frame);
  return {destroy,finishForTest,snapshot:()=>({...state,cuts:[...state.cuts],cutResults:[...state.cutResults],fryResults:[...state.fryResults],simmerResults:[...state.simmerResults],spills:[...state.spills],ended})};
}
