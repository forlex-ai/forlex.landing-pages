#!/usr/bin/env node
/**
 * Analyze (and optionally extract) base64 data-URI assets from LP sources.
 *
 * ENG-4705 QA notes the HTMLs are ~1.2 MB / ~680 KB due to embedded images.
 * For v1 we ship the HTML as-is (pixel-perfect). When Lighthouse flags weight,
 * run this script to externalize images/fonts:
 *
 *   node scripts/extract-assets.mjs --slug=advogados            # dry-run report
 *   node scripts/extract-assets.mjs --slug=advogados --apply    # writes lps/<slug>/assets/* + patched source.html
 *
 * --apply rewrites source.html in place (keeps a .bak) and writes extracted
 * files under lps/<slug>/assets/. Re-run `npm run build` afterwards; build.mjs
 * does not yet auto-copy lps/<slug>/assets — v2 will wire that. For now this
 * script is a report + extraction helper for the follow-up optimization.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function arg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}
const slug = arg('slug');
const apply = process.argv.includes('--apply');

function extFor(mime) {
  const map = {
    'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg',
    'image/gif': 'gif', 'image/avif': 'avif', 'font/woff2': 'woff2', 'font/woff': 'woff',
    'font/ttf': 'ttf', 'application/font-woff2': 'woff2',
  };
  return map[mime] || 'bin';
}

function analyzeOne(s) {
  const file = join(ROOT, 'lps', s, 'source.html');
  if (!existsSync(file)) {
    console.error(`source not found: ${file}`);
    process.exit(1);
  }
  const html = readFileSync(file, 'utf8');
  const re = /data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)/g;
  let m;
  let total = 0;
  let count = 0;
  const byMime = {};
  const matches = [];
  while ((m = re.exec(html)) !== null) {
    const mime = m[1];
    const b64 = m[2];
    const bytes = Math.floor((b64.length * 3) / 4);
    total += bytes;
    count += 1;
    byMime[mime] = (byMime[mime] || 0) + bytes;
    matches.push({ mime, b64, bytes, index: m.index });
  }
  const fileBytes = statSync(file).size;
  console.log(`\n[${s}] ${file}`);
  console.log(`  source: ${(fileBytes / 1024).toFixed(1)} KB, embedded data-URIs: ${count}, embedded bytes: ~${(total / 1024).toFixed(1)} KB (${((total / fileBytes) * 100).toFixed(1)}%)`);
  for (const [mime, bytes] of Object.entries(byMime).sort((a, b) => b[1] - a[1])) {
    console.log(`    - ${mime}: ~${(bytes / 1024).toFixed(1)} KB`);
  }
  const largest = [...matches].sort((a, b) => b.bytes - a.bytes).slice(0, 5);
  largest.forEach((l, i) => console.log(`    #${i + 1} largest: ${l.mime} ~${(l.bytes / 1024).toFixed(1)} KB`));

  if (apply && matches.length > 0) {
    const assetsDir = join(ROOT, 'lps', s, 'assets');
    mkdirSync(assetsDir, { recursive: true });
    let out = html;
    let n = 0;
    for (const item of matches) {
      n += 1;
      const ext = extFor(item.mime);
      const name = `embedded-${String(n).padStart(3, '0')}.${ext}`;
      const buf = Buffer.from(item.b64, 'base64');
      writeFileSync(join(assetsDir, name), buf);
      out = out.replace(`data:${item.mime};base64,${item.b64}`, `/assets/${s}/${name}`);
    }
    writeFileSync(`${file}.bak`, html, 'utf8');
    writeFileSync(file, out, 'utf8');
    console.log(`  [apply] extracted ${n} files -> lps/${s}/assets/ (source.html.bak kept). TODO: wire lps/<slug>/assets into build.mjs public copy.`);
  } else if (!apply) {
    console.log('  (dry-run; re-run with --apply to extract)');
  }
}

const slugs = slug ? [slug] : ['advogados', 'upgrade-premium'];
for (const s of slugs) {
  if (!existsSync(join(ROOT, 'lps', s, 'source.html'))) {
    console.warn(`skip ${s}: no source.html`);
    continue;
  }
  analyzeOne(s);
}
