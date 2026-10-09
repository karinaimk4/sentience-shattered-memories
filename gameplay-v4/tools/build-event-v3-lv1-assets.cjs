const { chromium } = require('./playwright-runtime.cjs');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const outDir = path.join(projectRoot, 'assets', 'event-v3', 'lv1');

const jobs = [
  { source: 'lv1-ground-source.png', output: 'lv1-ground.png', width: 640, height: 416, mode: 'cover' },
  { source: 'cart-kitchen-source.png', output: 'cart-kitchen.png', width: 96, height: 72 },
  { source: 'barrel-table-source.png', output: 'barrel-table.png', width: 64, height: 40 },
  { source: 'barrel-stool-source.png', output: 'barrel-stool.png', width: 32, height: 28 },
  { source: 'wash-basin-source.png', output: 'wash-basin.png', width: 32, height: 40 },
  { source: 'reception-counter-source.png', output: 'reception-counter.png', width: 96, height: 48 },
  { source: 'fuhua-tea-seat-source.png', output: 'fuhua-tea-seat.png', width: 40, height: 44 },
  { source: 'cart-kitchen-upgrade-source.png', output: 'cart-kitchen-upgrade.png', width: 96, height: 72 },
  { source: 'waiting-lobby-source.png', output: 'waiting-lobby.png', width: 96, height: 64 },
  { source: 'lv1-front-source.png', output: 'lv1-front.png', width: 640, height: 128, alphaCutoff: 24 }
];

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setContent('<!doctype html><title>asset builder</title>');

  for (const job of jobs) {
    const sourcePath = path.join(outDir, 'generated-source', job.source);
    const sourceDataUrl = `data:image/png;base64,${fs.readFileSync(sourcePath).toString('base64')}`;
    const dataUrl = await page.evaluate(async ({ spec, sourceDataUrl }) => {
      const image = new Image();
      image.src = sourceDataUrl;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = spec.width;
      canvas.height = spec.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.imageSmoothingEnabled = false;

      if (spec.mode === 'cover') {
        const targetRatio = spec.width / spec.height;
        const sourceRatio = image.naturalWidth / image.naturalHeight;
        let sx = 0, sy = 0, sw = image.naturalWidth, sh = image.naturalHeight;
        if (sourceRatio > targetRatio) {
          sw = Math.round(sh * targetRatio);
          sx = Math.floor((image.naturalWidth - sw) / 2);
        } else {
          sh = Math.round(sw / targetRatio);
          sy = Math.floor((image.naturalHeight - sh) / 2);
        }
        context.drawImage(image, sx, sy, sw, sh, 0, 0, spec.width, spec.height);
      } else {
        const scan = document.createElement('canvas');
        scan.width = image.naturalWidth;
        scan.height = image.naturalHeight;
        const scanContext = scan.getContext('2d', { willReadFrequently: true });
        scanContext.drawImage(image, 0, 0);
        const pixels = scanContext.getImageData(0, 0, scan.width, scan.height).data;
        const cutoff = spec.alphaCutoff ?? 40;
        let left = scan.width, top = scan.height, right = -1, bottom = -1;
        for (let y = 0; y < scan.height; y++) {
          for (let x = 0; x < scan.width; x++) {
            if (pixels[(y * scan.width + x) * 4 + 3] < cutoff) continue;
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }
        if (right < left || bottom < top) throw new Error(`No visible pixels in ${spec.source}`);
        const cropWidth = right - left + 1;
        const cropHeight = bottom - top + 1;
        const scale = Math.min((spec.width - 2) / cropWidth, (spec.height - 2) / cropHeight);
        const drawWidth = Math.max(1, Math.floor(cropWidth * scale));
        const drawHeight = Math.max(1, Math.floor(cropHeight * scale));
        const drawX = Math.floor((spec.width - drawWidth) / 2);
        const drawY = spec.height - drawHeight - 1;
        context.drawImage(image, left, top, cropWidth, cropHeight, drawX, drawY, drawWidth, drawHeight);
        const output = context.getImageData(0, 0, spec.width, spec.height);
        for (let i = 3; i < output.data.length; i += 4) {
          if (output.data[i] < cutoff) output.data[i] = 0;
        }
        context.putImageData(output, 0, 0);
      }
      return canvas.toDataURL('image/png');
    }, { spec: job, sourceDataUrl });

    fs.writeFileSync(path.join(outDir, job.output), Buffer.from(dataUrl.split(',')[1], 'base64'));
  }

  await browser.close();
  console.log(JSON.stringify({ result: 'PASS', outputs: jobs.map(job => job.output) }));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
