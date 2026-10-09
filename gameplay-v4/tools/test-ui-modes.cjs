const {chromium}=require('./playwright-runtime.cjs'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1440,height:1080}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4181/?qa=1');await page.waitForFunction(()=>window.__qa?.ready);
 const earned=JSON.parse(fs.readFileSync(path.join(__dirname,'../qa/story-run.json'))).s.save;assert(earned.storyEvents.includes('forge-namiko'));assert(!earned.cores.cas_ii_namiko);
 // UI fixture comes from the completed input-only story run, with no invented equipment.
 await page.evaluate(save=>localStorage.setItem('sentience-gameplay-v4-save-20260926',JSON.stringify(save)),earned);await page.reload();await page.waitForFunction(()=>window.__qa?.ready);
 await page.locator('#gear').click();await page.locator('[data-tab=forge]').first().click();assert(await page.locator('[data-craft=cas_ii_namiko]').isEnabled());await page.screenshot({path:path.join(__dirname,'../qa/forge.png'),fullPage:true});await page.locator('[data-craft=cas_ii_namiko]').click();assert(await page.locator('[data-craft=cas_ii_namiko]').isDisabled());await page.locator('[data-tab=character]').first().click();await page.locator('#recommend').click();await page.screenshot({path:path.join(__dirname,'../qa/loadout-character.png'),fullPage:true});
 await page.locator('[data-tab=core]').first().click();await page.locator('[data-core=cas_ii_namiko]').click();await page.screenshot({path:path.join(__dirname,'../qa/loadout-core.png'),fullPage:true});
 assert.equal(await page.locator('[data-equip-core=cas_ii_namiko]').isEnabled(),true);await page.locator('[data-core=domain_sentience]').click();assert.equal(await page.locator('[data-equip-core=domain_sentience]').isDisabled(),true);
 await page.locator('[data-tab=stigma]').first().click();await page.screenshot({path:path.join(__dirname,'../qa/loadout-stigma.png'),fullPage:true});
 await page.locator('[data-tab=presets]').click();await page.locator('[data-save-preset=Story]').click();await page.locator('[data-load-preset=Story]').click();await page.getByRole('button',{name:'LƯU VÀO Ô 1',exact:true}).click();assert.equal(await page.getByRole('button',{name:'KHÔI PHỤC',exact:true}).first().isEnabled(),true);
 await page.locator('#gear-back').click();const storyBefore=await page.evaluate(()=>JSON.parse(localStorage.getItem('sentience-gameplay-v4-save-20260926')));
 await page.locator('#endless').click();await page.evaluate(()=>__qa.manual());await page.evaluate(require('./bot.cjs'));
 let s;for(let i=0;i<16;i++){s=await page.evaluate(()=>drive(300));if(s.phase==='upgrade'){await page.screenshot({path:path.join(__dirname,'../qa/endless-upgrade.png')});await page.locator('[data-run-upgrade=power]').click();}if(s.phase==='dying'||s.phase==='finished')break;}
 s=await page.evaluate(()=>__qa.snapshot());assert.equal(s.mode,'endless');assert(s.upgrades>=1);assert.deepEqual(s.save.weapons,['sword','spear','chain']);await page.screenshot({path:path.join(__dirname,'../qa/endless.png')});
 // Let the runner miss a real gap. Only controls are used to end the run.
 await page.evaluate(()=>bot.allowFall=true);for(let i=0;i<40;i++){s=await page.evaluate(()=>drive(300));if(s.phase==='dying'){await page.evaluate(()=>__qa.step([],100));break;}if(s.phase==='finished')break;}
 s=await page.evaluate(()=>__qa.snapshot());assert.equal(s.phase,'finished');const storyAfter=await page.evaluate(()=>JSON.parse(localStorage.getItem('sentience-gameplay-v4-save-20260926')));
 assert(storyAfter.endlessBest>0);delete storyBefore.endlessBest;delete storyAfter.endlessBest;assert.deepEqual(storyAfter,storyBefore,'Endless must never alter story progress, items or currencies');
 await page.locator('#complete-home').click();await page.locator('[data-tab=core]').first().click();await page.locator('[data-core=armored_bracers]').click();const coin=await page.evaluate(()=>JSON.parse(localStorage.getItem('sentience-gameplay-v4-save-20260926')).gold);await page.locator('[data-upgrade=armored_bracers]').click();assert((await page.evaluate(()=>JSON.parse(localStorage.getItem('sentience-gameplay-v4-save-20260926')).gold))<coin,'Gear must still persist after leaving Endless');
 await page.setViewportSize({width:430,height:932});await page.screenshot({path:path.join(__dirname,'../qa/loadout-mobile.png'),fullPage:true});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 console.log(JSON.stringify({ui:'PASS earned equipment, locked gear, preset, manual slot, mobile width',endless:'PASS upgrade + death + isolated save',errors}));await browser.close();assert.equal(errors.length,0);
})().catch(e=>{console.error(e);process.exitCode=1});
