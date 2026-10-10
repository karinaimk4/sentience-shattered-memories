const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
  const base=(process.env.HOS_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1536,height:1000}});
  const errors=[],missing=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&response.url().startsWith('http://127.0.0.1:'))missing.push(`${response.status()} ${response.url()}`);});

  await page.goto(`${base}/event-v3.html?test=full&qa=day-flow`);
  await page.waitForFunction(()=>window.__TAIXUAN_QA__?.snapshot().ready&&window.__TAIXUAN_QA__.phase().active==='afternoon',null,{timeout:60000});
  assert(await page.locator('.trend-banner').isVisible(),'Buổi chiều phải hiện khẩu vị hôm nay');

  await page.locator('[data-panel="menu"]').click();
  const researchUnlocked=await page.evaluate(()=>{
    window.__TAIXUAN_QA__.selectRecipeIngredients(['Cà Chua Nhiễu Sóng','Măng rừng']);
    window.__TAIXUAN_QA__.researchRecipe();
    return window.__TAIXUAN_QA__.recipes().unlocked;
  });
  assert(researchUnlocked.includes('glitch-salad'),'Nghiên cứu đúng nguyên liệu phải mở Salad Nhiễu Sóng');
  await page.locator('[data-test-recipe-fragment]').click();
  const fragmentRecipe=await page.evaluate(()=>window.__TAIXUAN_QA__.recipes().fragments[0]);
  assert(fragmentRecipe,'Boss test phải rơi một Mảnh Công Thức');
  await page.locator(`[data-unlock-recipe="${fragmentRecipe}"]`).click();
  assert((await page.evaluate(()=>window.__TAIXUAN_QA__.recipes().unlocked)).includes(fragmentRecipe),'Giải mã mảnh phải mở món 4–5 sao');
  await page.screenshot({path:path.join(__dirname,'../qa/event-v3-recipe-book.png'),fullPage:true});

  await page.locator('[data-panel="staff"]').click();
  await page.locator('#gacha-one').click();
  await page.waitForSelector('#gacha-summon-stage:not([hidden])');
  await page.waitForTimeout(1100);
  await page.screenshot({path:path.join(__dirname,'../qa/event-v3-gacha-effect.png'),fullPage:true});
  await page.waitForSelector('#gacha-reveal-panel:not([hidden])');
  assert(await page.locator('.gacha-result-card').isVisible(),'Hiệu ứng phải kết thúc bằng thẻ nhân viên');
  await page.locator('#gacha-close').click();

  const trendId=await page.evaluate(()=>window.__TAIXUAN_QA__.phase().trend.dishId);
  const secondDishId=await page.locator('[data-plan-dish]').evaluateAll((buttons,trend)=>buttons.map(button=>button.dataset.planDish).find(id=>id!==trend),trendId);
  for(let index=0;index<4;index++)await page.locator(`[data-plan-dish="${trendId}"]`).click();
  await page.locator(`[data-plan-dish="${secondDishId}"]`).click();
  let freePlan=await page.evaluate(()=>window.__TAIXUAN_QA__.phase().plan);
  assert.equal(freePlan[trendId],4,'Không được khóa kế hoạch ở 3 mẻ');
  assert.equal(freePlan[secondDishId],1,'Phải chọn được nhiều món cùng lúc');
  for(let index=0;index<3;index++)await page.locator(`[data-plan-remove="${trendId}"]`).click();
  await page.locator(`[data-plan-remove="${secondDishId}"]`).click();
  assert.equal((await page.evaluate(()=>window.__TAIXUAN_QA__.phase().plan))[trendId],1);
  await page.screenshot({path:path.join(__dirname,'../qa/event-v3-plan-menu.png'),fullPage:true});
  await page.locator('[data-lock-plan]').click();
  for(const step of [0,1,2]){
    await page.locator(`[data-cook-step="${step}"]`).click();
    await page.waitForFunction(expected=>window.__TAIXUAN_QA__.cookingMiniGame()?.step===expected,step);
    await page.evaluate(()=>window.__TAIXUAN_QA__.completeCookingMiniGame());
    await page.waitForFunction(([expected,last])=>last?window.__TAIXUAN_QA__.phase().prepared===3:window.__TAIXUAN_QA__.phase().cookStep===expected+1,[step,step===2]);
  }
  const cooked=await page.evaluate(()=>window.__TAIXUAN_QA__.phase());
  assert.equal(cooked.prepared,3);
  assert.equal(cooked.preparedByDish[trendId],3);
  assert(await page.locator('[data-open-restaurant]').isVisible(),'Nấu xong mới được hiện nút Mở quán');
  await page.screenshot({path:path.join(__dirname,'../qa/event-v3-prep-menu.png'),fullPage:true});

  await page.locator('[data-open-restaurant]').click();
  await page.waitForFunction(()=>window.__TAIXUAN_QA__.snapshot().running===true);
  assert.equal((await page.evaluate(()=>window.__TAIXUAN_QA__.phase())).active,'evening');
  assert(await page.locator('#rush-canvas').isVisible());
  await page.evaluate(()=>window.__TAIXUAN_QA__.endRush());
  await page.waitForSelector('.rush-summary');
  await page.locator('[data-phase-next="night"]').click();
  await page.locator('[data-night-action="wash"]').click();
  await page.locator('[data-next-day]').click();
  await page.waitForFunction(()=>window.__TAIXUAN_QA__.phase().active==='morning');
  assert.equal((await page.evaluate(()=>window.__TAIXUAN_QA__.phase())).active,'morning');

  await page.locator('[data-supply-map="arc"]').click();
  assert((await page.evaluate(()=>window.__TAIXUAN_QA__.phase())).run,'Chọn khu phải bắt đầu Endless Run');
  await page.evaluate(()=>window.__TAIXUAN_QA__.finishExpedition());
  await page.waitForSelector('.expedition-result');
  assert.equal((await page.evaluate(()=>window.__TAIXUAN_QA__.phase().run.finished)),true);
  await page.screenshot({path:path.join(__dirname,'../qa/event-v3-endless-result.png'),fullPage:true});
  await page.locator('[data-run-claim]').click();
  const returned=await page.evaluate(()=>window.__TAIXUAN_QA__.phase());
  assert.equal(returned.trips,1);
  assert(Object.values(returned.stock).some(count=>count>0));
  assert.deepEqual(missing,[]);
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log(JSON.stringify({ok:true,recipes:true,gachaEffect:true,trend:true,planning:true,cooking:true,explicitOpen:true,rushSummary:true,endless:true,claim:true,missing,errors}));
})().catch(error=>{console.error(error);process.exit(1)});
