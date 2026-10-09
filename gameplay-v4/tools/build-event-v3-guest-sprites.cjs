const { chromium } = require('./playwright-runtime.cjs');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const modelDir = path.join(projectRoot, 'assets', 'event-v3', 'guest-model-sheets');
const spriteDir = path.join(projectRoot, 'assets', 'event-v3', 'guest-sprites');
const jobs = [
  ['guest-adult-male-v1.png', 'guest-adult-male.png'],
  ['guest-adult-female-v1.png', 'guest-adult-female.png'],
  ['guest-child-v1.png', 'guest-child.png']
];

(async () => {
  fs.mkdirSync(spriteDir, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setContent('<!doctype html><title>guest sprite builder</title>');
  for (const [sourceName, outputName] of jobs) {
    const sourceDataUrl = `data:image/png;base64,${fs.readFileSync(path.join(modelDir, sourceName)).toString('base64')}`;
    const outputDataUrl = await page.evaluate(async sourceDataUrl => {
      const image = new Image();
      image.src = sourceDataUrl;
      await image.decode();
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = image.naturalWidth;
      sourceCanvas.height = image.naturalHeight;
      const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
      sourceContext.drawImage(image, 0, 0);
      const sourcePixels = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height).data;
      const sheet = document.createElement('canvas');
      sheet.width = 144;
      sheet.height = 64;
      const context = sheet.getContext('2d', { willReadFrequently: true });
      context.imageSmoothingEnabled = false;

      for (let pose = 0; pose < 3; pose++) {
        const segmentLeft = Math.floor(pose * sourceCanvas.width / 3);
        const segmentRight = Math.floor((pose + 1) * sourceCanvas.width / 3) - 1;
        let left = segmentRight, top = sourceCanvas.height - 1, right = segmentLeft, bottom = 0;
        for (let y = 0; y < sourceCanvas.height; y++) {
          for (let x = segmentLeft; x <= segmentRight; x++) {
            if (sourcePixels[(y * sourceCanvas.width + x) * 4 + 3] < 80) continue;
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
          }
        }
        const cropWidth = right - left + 1;
        const cropHeight = bottom - top + 1;
        const scale = Math.min(46 / cropWidth, 58 / cropHeight);
        const drawWidth = Math.max(1, Math.floor(cropWidth * scale));
        const drawHeight = Math.max(1, Math.floor(cropHeight * scale));
        const drawX = pose * 48 + Math.floor((48 - drawWidth) / 2);
        const drawY = 60 - drawHeight;
        context.drawImage(image, left, top, cropWidth, cropHeight, drawX, drawY, drawWidth, drawHeight);
      }
      const output = context.getImageData(0, 0, sheet.width, sheet.height);
      for (let i = 3; i < output.data.length; i += 4) output.data[i] = output.data[i] >= 80 ? 255 : 0;
      context.putImageData(output, 0, 0);
      return sheet.toDataURL('image/png');
    }, sourceDataUrl);
    fs.writeFileSync(path.join(spriteDir, outputName), Buffer.from(outputDataUrl.split(',')[1], 'base64'));
  }
  await browser.close();
  console.log(JSON.stringify({ result: 'PASS', outputs: jobs.map(job => job[1]) }));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
