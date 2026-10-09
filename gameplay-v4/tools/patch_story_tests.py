from pathlib import Path
R=Path(__file__).resolve().parents[1]
p=R/'gameplay-v2.js';s=p.read_text(encoding='utf-8').replace("window.addEventListener('keydown',e=>{", "window.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;")
s=s.replace("$('#audio-settings').onclick=()=>openAudioSettings(gameAudio);", "$('#audio-settings').onclick=()=>{const resume=screen==='play'&&g&&['explore','arena'].includes(g.phase);if(resume)pause();const dialog=openAudioSettings(gameAudio);dialog.addEventListener('close',()=>{if(resume&&g?.phase==='paused')pause();},{once:true});};")
p.write_text(s,encoding='utf-8')
p=R/'story-panels.js';s=p.read_text(encoding='utf-8');s=s.replace("dialog.showModal();}","dialog.showModal();return dialog;}");p.write_text(s,encoding='utf-8')
p=R/'tools/test-ui-modes.cjs';s=p.read_text(encoding='utf-8').replace('assert(earned.cores.cas_ii_namiko);',"assert(earned.storyEvents.includes('forge-namiko'));assert(!earned.cores.cas_ii_namiko);")
s=s.replace("await page.locator('#gear').click();await page.locator('#recommend').click();", "await page.locator('#gear').click();await page.locator('[data-tab=forge]').first().click();assert(await page.locator('[data-craft=cas_ii_namiko]').isEnabled());await page.screenshot({path:path.join(__dirname,'../qa/forge.png'),fullPage:true});await page.locator('[data-craft=cas_ii_namiko]').click();assert(await page.locator('[data-craft=cas_ii_namiko]').isDisabled());await page.locator('[data-tab=character]').first().click();await page.locator('#recommend').click();")
p.write_text(s,encoding='utf-8')
print('Updated modal pause behavior and earned crafting UI test.')
