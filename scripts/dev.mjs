#!/usr/bin/env node
/**
 * Minimal static dev server (zero dependencies).
 * Serves dist/ at http://127.0.0.1:3000 with clean URLs (/advogados -> /advogados/index.html).
 * Rebuilds on --build or if dist/ is missing.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 3000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function ensureBuilt() {
  if (!existsSync(join(DIST, 'index.html')) || process.argv.includes('--build')) {
    console.log('[dev] building...');
    const r = spawnSync('node', [join(ROOT, 'scripts', 'build.mjs')], { stdio: 'inherit', cwd: ROOT });
    if (r.status !== 0) process.exit(r.status || 1);
  }
}

function resolvePath(urlPath) {
  const clean = urlPath.split('?')[0].split('#')[0];
  const candidates = [
    join(DIST, clean),
    join(DIST, clean, 'index.html'),
    join(DIST, `${clean}.html`),
  ];
  if (clean === '/' || clean === '') return join(DIST, 'index.html');
  for (const c of candidates) {
    try {
      const st = statSync(c);
      if (st.isFile()) return c;
      if (st.isDirectory()) {
        const idx = join(c, 'index.html');
        if (existsSync(idx)) return idx;
      }
    } catch { /* next */ }
  }
  return null;
}

ensureBuilt();
const server = http.createServer((req, res) => {
  const file = resolvePath(req.url || '/');
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found. Available: /advogados, /upgrade-premium\n');
    return;
  }
  const ext = extname(file).toLowerCase();
  res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[dev] http://127.0.0.1:${PORT}/`);
  console.log(`[dev] LPs: http://127.0.0.1:${PORT}/advogados  http://127.0.0.1:${PORT}/upgrade-premium`);
  console.log('[dev] flags: ?static=1 (no animation) · ?brands=0 (fixed headline, LP A only)');
});
