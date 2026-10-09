const { spawn } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = String(process.env.SMOKE_PORT || '4322');
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['scripts/serve-web-game.cjs'], {
  cwd: root,
  env: { ...process.env, PORT: port },
  stdio: ['ignore', 'pipe', 'inherit']
});

let started = false;
const timeout = setTimeout(() => finish(1, new Error('Preview server did not start in time.')), 15000);

server.stdout.on('data', chunk => {
  process.stdout.write(chunk);
  if (!started && chunk.toString().includes(`${baseUrl}/`)) {
    started = true;
    clearTimeout(timeout);
    const test = spawn(process.execPath, ['gameplay-v4/tools/test-event-v3-main-build.cjs'], {
      cwd: root,
      env: { ...process.env, HOS_BASE_URL: baseUrl },
      stdio: 'inherit'
    });
    test.on('exit', code => finish(code || 0));
    test.on('error', error => finish(1, error));
  }
});
server.on('error', error => finish(1, error));

let finished = false;
function finish(code, error) {
  if (finished) return;
  finished = true;
  clearTimeout(timeout);
  if (error) console.error(error);
  server.kill();
  process.exitCode = code;
}
