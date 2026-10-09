const { chromium } = require('./playwright-runtime.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1536, height: 1040 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('http://127.0.0.1:4319/event-demo.html');
  await page.evaluate(() => localStorage.removeItem('taixuan-event-demo-v1'));
  await page.reload();
  await page.waitForSelector('#restaurant-stage');
  await page.waitForTimeout(450);
  const startButton = page.getByRole('button', { name: 'BẮT ĐẦU CHƠI DEMO' });
  if (await startButton.isVisible()) await startButton.click();

  assert.match(await page.locator('#phase-title').textContent(), /Đi chợ/);
  const chickenBefore = Number(await page.locator('.ingredient-mini').first().locator('b').textContent());
  await page.locator('[data-select-map="taixuan"]').click();
  await page.locator('[data-dispatch]').click();
  const chickenAfter = Number(await page.locator('.ingredient-mini').first().locator('b').textContent());
  assert(chickenAfter > chickenBefore, 'Expedition must add ingredients');

  await page.locator('[data-demo="afternoon"]').click();
  for (let i = 0; i < 5; i++) await page.locator('[data-qte="slice"]').click();
  await page.waitForTimeout(650);
  await page.locator('[data-qte="toss"]').click();
  await page.waitForTimeout(900);
  await page.locator('[data-qte="heat"]').click();
  assert.match(await page.locator('#modal-card h2').textContent(), /(NGON|HOÀN HẢO|TẠM ỔN|KHÊ)/);
  await page.locator('#modal-card [data-close-modal]').last().click();

  await page.locator('[data-demo="evening"]').click();
  assert.match(await page.locator('#rush-timer').textContent(), /CÒN 60s/);
  await page.waitForTimeout(4200);
  assert.notEqual(await page.locator('#rush-timer').textContent(), '00:60');
  const qaDir = path.join(__dirname, '../qa');
  fs.mkdirSync(qaDir, { recursive: true });
  await page.screenshot({ path: path.join(qaDir, 'event-demo-restaurant.png'), fullPage: true });

  await page.locator('[data-demo="vip"]').click();
  await page.locator('[data-vip="kalpas"]').click();
  await page.locator('[data-vip-action="yatta"]').click();
  assert.match(await page.locator('#modal-card').textContent(), /5.000 Xu/);
  await page.locator('#modal-card [data-close-modal]').last().click();

  await page.locator('[data-demo="stress"]').click();
  assert.match(await page.locator('#event-ticker').textContent(), /Fu Hua bốc hỏa/);
  await page.locator('[data-demo="night"]').click();
  await page.locator('[data-gacha]').click();
  await page.locator('[data-roll-gacha]').click();
  assert.match(await page.locator('#modal-card').textContent(), /Pardofelis/);
  await page.locator('#modal-card [data-close-modal]').first().click();

  const brokenImages = await page.evaluate(() => [...document.images]
    .filter(image => !image.complete || image.naturalWidth === 0)
    .map(image => image.src));
  assert.deepEqual(brokenImages, [], 'All displayed images must load');

  await page.screenshot({ path: path.join(qaDir, 'event-demo-full.png'), fullPage: true });
  await page.setViewportSize({ width: 430, height: 932 });
  await page.screenshot({ path: path.join(qaDir, 'event-demo-mobile.png'), fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Mobile layout must not overflow horizontally');
  assert.equal(errors.length, 0, errors.join('\n'));

  console.log(JSON.stringify({
    result: 'PASS',
    tested: ['expedition', 'cooking QTE', 'rush hour', 'VIP Kalpas', 'Fu Hua rage', 'gacha', 'assets', 'mobile'],
    screenshots: ['qa/event-demo-restaurant.png', 'qa/event-demo-full.png', 'qa/event-demo-mobile.png']
  }));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
