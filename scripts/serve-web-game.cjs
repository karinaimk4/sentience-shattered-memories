const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'web-dist');
const port = Number(process.env.PORT || 4321);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400); response.end('Bad request'); return; }
  const requested = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const file = path.resolve(root, `.${requested}`);
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403); response.end('Forbidden'); return;
  }
  fs.stat(file, (error, info) => {
    if (error || !info.isFile()) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, {
      'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    fs.createReadStream(file).pipe(response);
  });
}).listen(port, '127.0.0.1', () => console.log(`Sentience web preview: http://127.0.0.1:${port}/`));
