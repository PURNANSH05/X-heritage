import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

function sendFile(res, filePath) {
  const type = mimeTypes[extname(filePath)] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
  });
  createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api')) {
    const proxyReq = http.request(
      {
        host: 'localhost',
        port: 4000,
        path: req.url,
        method: req.method,
        headers: req.headers
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );
    proxyReq.on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Bad Gateway: backend is down. ${err.message}`);
    });
    req.pipe(proxyReq);
    return;
  }

  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safePath = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = join(root, safePath);

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    sendFile(res, filePath);
    return;
  }

  const indexPath = join(root, 'index.html');
  if (existsSync(indexPath)) {
    sendFile(res, indexPath);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Build output not found. Run npm run build first.');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`HeritageX frontend serving on http://localhost:${port}`);
});

