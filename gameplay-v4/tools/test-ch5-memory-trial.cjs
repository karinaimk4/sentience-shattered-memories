const { chromium } = require('./playwright-runtime.cjs');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1060, height: 760 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = process.env.HOS_BASE_URL || 'http://127.0.0.1:4192/build-assets-v4';
  await page.goto(base.replace(/\/$/, '') + '/?qa=1');
  await page.waitForFunction(() => window.__qa?.ready);
  await page.evaluate(() => {
    __qa.start('story');
    __qa.manual();
    __qa.startMemoryTrial('testimony');
  });
  await page.locator('#game').screenshot({ path: path.join(__dirname, '../qa/ch5-memory-trial-layout-fixed.png') });

  let state = await page.evaluate(() => __qa.step(['KeyE'], 1));
  assert.equal(state.memoryTrial.step, 0);
  assert.equal(state.memoryTrial.feedback, 'wrong');
  assert.match(state.memoryTrial.message, /^SAI/);
  await page.locator('#game').screenshot({ path: path.join(__dirname, '../qa/ch5-memory-trial-wrong-feedback.png') });

  await page.evaluate(() => __qa.step([], 1));
  state = await page.evaluate(() => __qa.step(['ArrowRight'], 1));
  assert.equal(state.memoryTrial.choice, 1);
  await page.evaluate(() => __qa.step([], 1));
  state = await page.evaluate(() => __qa.step(['KeyE'], 1));
  assert.equal(state.memoryTrial.step, 1);
  assert.equal(state.memoryTrial.feedback, 'correct');
  assert.match(state.memoryTrial.message, /^ĐÚNG/);
  await page.locator('#game').screenshot({ path: path.join(__dirname, '../qa/ch5-memory-trial-correct-feedback.png') });

  assert.deepEqual(errors, []);
  await browser.close();
  console.log(JSON.stringify({ ok: true, step: state.memoryTrial.step, choice: state.memoryTrial.choice, errors }));
})().catch(error => {
  console.error(error);
  process.exit(1);
});
