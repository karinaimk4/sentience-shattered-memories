import { cp, copyFile, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'gameplay-v4');
const output = path.join(root, 'web-dist');
const githubFileLimit = 100 * 1024 * 1024;
const githubPagesSiteLimit = 1024 * 1024 * 1024;

if (path.dirname(output) !== root || path.basename(output) !== 'web-dist') {
  throw new Error(`Refusing to clean unexpected output path: ${output}`);
}

const files = [
  'animation-manifest.json',
  'assets-manifest.json',
  'audio-manifest.json',
  'audio-system.js',
  'battle-track.css',
  'boss-chariot.js',
  'boss-heimdall.js',
  'boss-husk.js',
  'boss-jizo.js',
  'boss-mnemosyne.js',
  'boss-parvati.js',
  'boss-phantom.js',
  'boss-seven-swords.js',
  'canonical-catalog.js',
  'endless-patterns.json',
  'enemy-story-manifest.json',
  'engine.js',
  'environment-runtime.js',
  'event-demo-pixel.css',
  'event-v3-economy.css',
  'event-v3-cooking.js',
  'event-v3-expedition.js',
  'event-v3-washing.js',
  'event-v3-greybox.js',
  'event-v3-integrated.css',
  'event-v3.html',
  'gameplay-v2.js',
  'gear-system.js',
  'index.html',
  'level-chapter-1.json',
  'level-chapter-2.json',
  'level-chapter-3.json',
  'level-chapter-4.json',
  'level-chapter-5.json',
  'level-chapter-6.json',
  'level-chapter-7.json',
  'loadout.css',
  'loadout.js',
  'memory-album.css',
  'memory-album.js',
  'narrative.css',
  'save-validation.js',
  'story-crafting.js',
  'story-environment.js',
  'story-panels.js',
  'story-sessions.js',
  'styles-v2.css',
  'taixuan-courtyard.js',
  'taixuan-side-memories.js',
  'terrain-story-manifest.json'
];

const dataFiles = ['restaurant-lv1.json', 'restaurant-lv2.json'];

async function requireFile(file) {
  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) throw new Error(`Required source file is missing: ${path.relative(root, file)}`);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(full));
    else if (entry.isFile()) result.push(full);
  }
  return result;
}

await Promise.all(files.map(name => requireFile(path.join(source, name))));
await Promise.all(dataFiles.map(name => requireFile(path.join(source, 'data', name))));
await requireFile(path.join(source, 'assets', 'characters-alpha.png'));

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'data'), { recursive: true });

for (const name of files) {
  await copyFile(path.join(source, name), path.join(output, name));
}
for (const name of dataFiles) {
  await copyFile(path.join(source, 'data', name), path.join(output, 'data', name));
}
await cp(path.join(source, 'assets'), path.join(output, 'assets'), { recursive: true });

const builtFiles = await walk(output);
let totalBytes = 0;
let largest = { file: '', bytes: 0 };
for (const file of builtFiles) {
  const { size } = await stat(file);
  totalBytes += size;
  if (size > largest.bytes) largest = { file: path.relative(output, file).replaceAll('\\', '/'), bytes: size };
  if (size > githubFileLimit) {
    throw new Error(`GitHub file limit exceeded (${(size / 1024 / 1024).toFixed(2)} MiB): ${path.relative(output, file)}`);
  }
}
if (totalBytes > githubPagesSiteLimit) {
  throw new Error(`GitHub Pages site limit exceeded: ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);
}

const report = {
  source: 'gameplay-v4',
  output: 'web-dist',
  files: builtFiles.length,
  totalBytes,
  largest,
  githubIndividualFileLimitBytes: githubFileLimit,
  githubPagesSiteLimitBytes: githubPagesSiteLimit,
  entrypoints: ['index.html', 'event-v3.html']
};
await writeFile(path.join(output, '.nojekyll'), '');
await writeFile(path.join(output, 'build-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
