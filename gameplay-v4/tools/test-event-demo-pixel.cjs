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

  await page.goto('http://127.0.0.1:4181/event-demo-pixel.html');
  await page.evaluate(() => localStorage.removeItem('taixuan-event-demo-pixel-v1'));
  await page.reload();
  await page.waitForSelector('#restaurant-stage');
  await page.waitForTimeout(500);
  const startButton = page.getByRole('button', { name: 'BẮT ĐẦU CHƠI DEMO' });
  if (await startButton.isVisible()) await startButton.click();

  await page.locator('[data-demo="evening"]').click();
  await page.waitForTimeout(1200);
  assert(await page.locator('.restaurant-world.world-3d').isVisible());
  assert.equal(await page.locator('.hi3-3d-sprite').count(), 5);
  assert.equal(await page.locator('.guest-3d-sprite').count(), 4);
  assert(await page.locator('.senti-floor').isVisible());
  assert(await page.locator('.fuhua-floor').isVisible());
  assert.match(await page.locator('.service-legend').textContent(), /VÀO.*CHỜ.*GỌI MÓN.*NẤU.*BƯNG.*ĂN.*TRẢ TIỀN.*DỌN/s);
  assert.match(await page.locator('.queue-caption').textContent(), /HÀNG CHỜ/);

  const qaDir = path.join(__dirname, '../qa');
  fs.mkdirSync(qaDir, { recursive: true });
  await page.screenshot({ path: path.join(qaDir, 'event-demo-pixel-restaurant.png'), fullPage: true });

  await page.locator('[data-panel="staff"]').click();
  assert(await page.locator('.staff-gacha-banner').isVisible());
  assert(await page.locator('.staff-gacha-banner [data-gacha]').isVisible());
  await page.screenshot({ path: path.join(qaDir, 'event-demo-gacha-staff.png'), fullPage: true });

  const activeModal = page.locator('#modal:not([hidden])');
  if (await activeModal.isVisible()) {
    const closeModal = activeModal.locator('[data-close-modal]').last();
    if (await closeModal.isVisible()) await closeModal.click();
  }
  await page.locator('[data-demo="vip"]').click();
  await page.locator('[data-vip="kalpas"]').first().click();
  assert(await page.locator('.vip-pixel-portrait').isVisible());
  await page.screenshot({ path: path.join(qaDir, 'event-demo-pixel-kalpas.png'), fullPage: true });

  const brokenImages = await page.evaluate(() => [...document.images]
    .filter(image => !image.complete || image.naturalWidth === 0)
    .map(image => image.src));
  assert.deepEqual(brokenImages, []);
  assert.equal(errors.length, 0, errors.join('\n'));

  console.log(JSON.stringify({
    result: 'PASS',
    tested: ['3D room', 'scaled HI3 character renders', 'Senti and Fu Hua', 'sharp 3D civilian guests', 'always-visible staff gacha', 'restaurant service flow', 'queue', 'Kalpas VIP portrait', 'assets'],
    screenshots: ['qa/event-demo-pixel-restaurant.png', 'qa/event-demo-gacha-staff.png', 'qa/event-demo-pixel-kalpas.png']
  }));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
