const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict');
const path=require('node:path');

(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',error=>{const message=error.stack||error.message;if(!message.includes('widget.sndcdn.com'))errors.push(message)});
 const base=(process.env.HOS_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'');
 await page.goto(base+'/?qa=1');
 await page.waitForFunction(()=>window.__qa?.ready);
 await page.evaluate(()=>{__qa.start('endless');__qa.manual()});
 await page.evaluate(require('./bot.cjs'));
 let state=await page.evaluate(()=>drive(120000,750));
 assert.equal(state.endlessDrops.length,1,'Mốc 750 m phải tạo một vật phẩm có art trên đường chạy');
 await page.screenshot({path:path.join(__dirname,'../qa/endless-material-750m.png')});
 state=await page.evaluate(()=>drive(30000,760));
 assert.equal(state.endlessDrops.length,0,'Vật phẩm phải biến mất sau khi người chơi chạm vào');
 assert(Object.values(state.endlessLoot).some(value=>value>0),'Nguyên liệu nhặt được phải nằm trong túi của lượt Endless');
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log(JSON.stringify({ok:true,loot:state.endlessLoot}));
})().catch(error=>{console.error(error);process.exit(1)});
