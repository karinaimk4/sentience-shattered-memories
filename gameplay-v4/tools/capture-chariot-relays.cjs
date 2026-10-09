const { chromium } = require('./playwright-runtime.cjs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4190/?qa=1');
  await page.waitForFunction(() => window.__qa?.ready);
  await page.evaluate(() => {
    window.__qa.manual();
    window.__qa.start('demo');
    for (let i = 0; i < 12; i++) {
      window.__qa.advance();
      window.__qa.step([], 3, false);
    }
    window.__qa.step([], 4, true);
  });
  await page.screenshot({ path: path.join(__dirname, '../qa/chariot-relays-final.png') });
  const result = await page.evaluate(() => ({ snapshot: window.__qa.snapshot(), images: [...document.images].filter(i => i.src.includes('chariot-relay')).map(i => ({ src: i.src, complete: i.complete, width: i.naturalWidth })) }));
  console.log(JSON.stringify({ phase: result.snapshot.phase, boss: result.snapshot.enemies?.find(e => e.ai?.type === 'chariot')?.ai?.pylons, errors }, null, 2));
  await browser.close();
  if (errors.length) process.exitCode = 1;
})();
