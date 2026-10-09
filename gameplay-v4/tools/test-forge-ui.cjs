const {chromium}=require('./playwright-runtime.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>errors.push(e.stack||e.message));
 const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/boss-checkpoint.json')));delete fixture.forgeParts; // simulate a v4 journey saved before named parts
 await page.goto('http://127.0.0.1:4181/?qa=1');try{await page.waitForFunction(()=>window.__qa?.ready,null,{timeout:10000});}catch(e){console.error(JSON.stringify({errors,body:(await page.locator('body').innerText()).slice(0,600)}));throw e;}
 await page.evaluate(save=>localStorage.setItem('sentience-gameplay-v4-save-20260926',JSON.stringify(save)),fixture);
 await page.reload();await page.waitForFunction(()=>window.__qa?.ready);
 await page.locator('#gear').click();await page.locator('[data-tab=forge]').click();
 assert.equal(await page.locator('.forge-recipe').count(),6);
 assert.equal(await page.locator('.resource-part').textContent().then(x=>x.trim()),'6 Cuộn mạch Namiko');
 assert(await page.locator('[data-craft=cas_ii_namiko]').isEnabled());
 for(const id of ['grips_tai_xuan','keys_oblivion','infinite_intimidator','domain_sentience','incredibly_infinite_intimidator'])assert(await page.locator(`[data-craft=${id}]`).isDisabled());
 assert((await page.locator('[data-craft=infinite_intimidator]').locator('..').textContent()).includes('Viên gạch thức tỉnh'));
 await page.locator('[data-forge-kind=stigma]').click();assert.equal(await page.locator('.forge-recipe').count(),11);assert(await page.locator('[data-craft="attila:M"]').isEnabled());assert((await page.locator('.forge-kind-tabs').textContent()).includes('RÈN VẾT THÁNH'));
 await page.screenshot({path:path.join(__dirname,'../qa/forge-materials-before.png'),fullPage:true});
 await page.locator('[data-forge-kind=weapon]').click();
 await page.locator('[data-craft=cas_ii_namiko]').click();
 const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('sentience-gameplay-v4-save-20260926')));
 assert(save.cores.cas_ii_namiko);assert.equal(save.forgeParts.namiko_coil,2);
 assert.equal(save.gold,fixture.gold-650);assert.equal(save.materials,fixture.materials-12);assert.equal(save.crystals,fixture.crystals-9);
 assert.equal(errors.length,0,errors.join('\n'));
 await page.screenshot({path:path.join(__dirname,'../qa/forge-materials-after.png'),fullPage:true});
 console.log(JSON.stringify({weaponRecipes:6,stigmaRecipes:11,legacyCoils:6,remainingCoils:save.forgeParts.namiko_coil,futureWeaponsLocked:true,errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
