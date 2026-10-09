const { chromium } = require('./playwright-runtime.cjs');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const fixture = JSON.parse(fs.readFileSync(path.join(root, 'qa/boss-checkpoint.json'), 'utf8'));
const outputDir = path.join(root, 'qa/boss-demo-raw');
fs.mkdirSync(outputDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: { dir: outputDir, size: { width: 1440, height: 1080 } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => { const details=error.stack||error.message;if(!details.includes('widget.sndcdn.com'))errors.push(details); });
  await page.goto('http://127.0.0.1:4181/?qa=1');
  await page.waitForFunction(() => window.__qa?.ready);
  await page.evaluate(save => localStorage.setItem('sentience-gameplay-v4-save-20260926', JSON.stringify(save)), fixture);
  await page.reload();
  await page.waitForFunction(() => window.__qa?.ready);
  await page.locator('#story').click();
  await page.evaluate(() => __qa.manual());
  await page.evaluate(require('./bot.cjs'));
  const videoEpoch = Date.now();
  let state;
  for (let i = 0; i < 1000; i++) {
    state = await page.evaluate(() => __qa.snapshot());
    if (state.phase === 'dialogue' && state.arena?.m === 2000) break;
    if (state.phase === 'dying') throw Error('Died before boss intro');
    await page.evaluate(() => drive(1));
  }
  if (state.phase !== 'dialogue') throw Error('Did not reach boss intro');
  const clipStartSec = (Date.now() - videoEpoch) / 1000;
  await page.waitForTimeout(800);
  let dialogueLines = 0;
  while (state.phase === 'dialogue' && dialogueLines < 8) {
    const oldIndex = state.dialogueIndex;
    await page.evaluate(() => __qa.step([], 240));
    await page.waitForTimeout(950);
    state = await page.evaluate(() => { __qa.advance(); return __qa.snapshot(); });
    if (state.dialogueIndex === oldIndex && state.phase === 'dialogue') {
      state = await page.evaluate(() => { __qa.advance(); return __qa.snapshot(); });
    }
    dialogueLines++;
    await page.waitForTimeout(160);
  }
  let frames = 0;
  let bossEvents = [];
  let lastPhase = 0;
  while (!['dying', 'finished'].includes(state.phase) && frames < 7000) {
    state = await page.evaluate(() => drive(8));
    frames += 8;
    const boss = state.enemies.find(e => e.ai && e.hp > 0);
    if (boss?.ai.phase && boss.ai.phase !== lastPhase) {
      lastPhase = boss.ai.phase;
      bossEvents.push({ time: (Date.now() - videoEpoch) / 1000, phase: lastPhase });
    }
    await page.waitForTimeout(55);
  }
  if (state.phase !== 'finished') throw Error(`Boss demo ended in ${state.phase}`);
  await page.waitForTimeout(1500);
  const clipEndSec = (Date.now() - videoEpoch) / 1000;
  const video = page.video();
  await context.close();
  const rawPath = await video.path();
  await browser.close();
  const metadata = { rawPath, clipStartSec, clipEndSec, dialogueLines, frames, bossEvents, bossRecord: state.bossRecord, phase: state.phase, errors };
  fs.writeFileSync(path.join(root, 'qa/boss-demo-meta.json'), JSON.stringify(metadata, null, 2));
  console.log(JSON.stringify(metadata));
  if (errors.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
