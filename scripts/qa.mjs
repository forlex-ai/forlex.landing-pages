#!/usr/bin/env node
/**
 * QA for landing pages (ENG-4705 checklist, automated subset).
 *
 * Usage:
 *   node scripts/qa.mjs                 # QA against lps/<slug>/source.html (pre-build)
 *   node scripts/qa.mjs --dir=dist      # QA against dist/<slug>/index.html (post-build, includes OG + tracking)
 *
 * Checks per LP (from lp.config.json):
 * - meta title/description match config, viewport/charset/theme-color present
 * - robots directive present (and matches LP_ROBOTS/config when --dir=dist)
 * - CTA count == expectedCtaCount, all app.forlex.ai CTAs carry exact expected UTMs
 * - ?static=1 + prefers-reduced-motion + sticky header present
 * - no external <script src="http(s)"> except allowlisted tracking hosts (post-build)
 * - OG + canonical + tracking present (post-build only)
 * - no `console.error(` / `debugger` leftovers in source
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function arg(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

const DIR = arg('dir', 'lps');
const CHECK_BUILT = DIR === 'dist';

let failures = 0;
let warnings = 0;

function pass(slug, msg) {
  console.log(`  ✓ [${slug}] ${msg}`);
}
function fail(slug, msg) {
  failures += 1;
  console.log(`  ✗ [${slug}] ${msg}`);
}
function warn(slug, msg) {
  warnings += 1;
  console.log(`  ! [${slug}] ${msg}`);
}

function listSlugs() {
  const lpsDir = join(ROOT, 'lps');
  return readdirSync(lpsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => existsSync(join(lpsDir, n, 'lp.config.json')));
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function qaOne(slug) {
  console.log(`\n[${slug}]`);
  const config = JSON.parse(readFileSync(join(ROOT, 'lps', slug, 'lp.config.json'), 'utf8'));
  const file = CHECK_BUILT
    ? join(ROOT, 'dist', slug, 'index.html')
    : join(ROOT, 'lps', slug, config.sourceFile || 'source.html');
  if (!existsSync(file)) {
    fail(slug, `file not found: ${file} (run npm run build first for --dir=dist)`);
    return;
  }
  const html = readFileSync(file, 'utf8');

  // Meta basics.
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
  if (!title) fail(slug, 'missing <title>');
  else if (title !== config.title) fail(slug, `title mismatch:\n    expected: ${config.title}\n    actual:   ${title}`);
  else pass(slug, 'title matches config');

  const desc = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i)?.[1] || '';
  if (!desc) fail(slug, 'missing meta description');
  else if (decodeEntities(desc) !== config.description) fail(slug, 'meta description mismatch (see lp.config.json)');
  else pass(slug, 'meta description matches config');

  if (!/<meta\s+name=["']viewport["']/i.test(html)) fail(slug, 'missing viewport meta');
  else pass(slug, 'viewport present');

  if (!/<meta\s+charset/i.test(html)) fail(slug, 'missing charset meta');
  else pass(slug, 'charset present');

  if (!/<meta\s+name=["']theme-color["']/i.test(html)) warn(slug, 'missing theme-color meta');
  else pass(slug, 'theme-color present');

  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i)?.[1] || '';
  if (!robots) fail(slug, 'missing robots meta');
  else {
    const expected = process.env.LP_ROBOTS || config.robots || 'noindex';
    if (CHECK_BUILT && robots !== expected) fail(slug, `robots mismatch: expected "${expected}", got "${robots}"`);
    else pass(slug, `robots="${robots}"`);
  }

  // CTAs.
  const hrefs = [...html.matchAll(/<a\s+[^>]*href="([^"]*app\.forlex\.ai[^"]*)"[^>]*>/gi)].map((m) => decodeEntities(m[1]));
  if (hrefs.length !== config.expectedCtaCount) {
    fail(slug, `CTA count: expected ${config.expectedCtaCount}, found ${hrefs.length}`);
  } else {
    pass(slug, `${hrefs.length} CTAs found`);
  }
  let utmBad = 0;
  for (const href of hrefs) {
    let url;
    try {
      url = new URL(href);
    } catch {
      utmBad += 1;
      continue;
    }
    if (!href.startsWith(config.ctaDestinationPrefix)) utmBad += 1;
    for (const [k, v] of Object.entries(config.expectedUtm)) {
      if (url.searchParams.get(k) !== v) utmBad += 1;
    }
  }
  if (utmBad > 0) fail(slug, `${utmBad} CTA/UTM mismatch(es): all CTAs must start with ${config.ctaDestinationPrefix} + ${JSON.stringify(config.expectedUtm)}`);
  else if (hrefs.length > 0) pass(slug, 'all CTA UTMs exact');

  // Behavior flags.
  if (!html.includes('prefers-reduced-motion')) fail(slug, 'missing prefers-reduced-motion handling');
  else pass(slug, 'prefers-reduced-motion respected');

  if (!/URLSearchParams/.test(html) || !html.includes('static')) warn(slug, '?static=1 support not detected (expected URLSearchParams + static flag)');
  else pass(slug, '?static=1 support present');

  if (slug === 'advogados' && !html.includes('brands')) warn(slug, '?brands=0 support not detected');
  else if (slug === 'advogados') pass(slug, '?brands=0 support present');

  if (!/position:\s*sticky/i.test(html)) warn(slug, 'sticky header not detected (position: sticky)');
  else pass(slug, 'sticky header present');

  // Leftover debugging.
  if (/console\.error\(|debugger;/.test(html)) warn(slug, 'found console.error/debugger in HTML');
  else pass(slug, 'no console.error/debugger leftovers');

  // External scripts (post-build allows tracking hosts only).
  const externalScripts = [...html.matchAll(/<script\s+[^>]*src="(https?:[^"]+)"[^>]*>/gi)].map((m) => m[1]);
  if (!CHECK_BUILT) {
    if (externalScripts.length > 0) warn(slug, `pre-build source has ${externalScripts.length} external script(s): ${externalScripts.slice(0, 3).join(', ')}`);
    else pass(slug, 'self-contained: no external scripts in source');
  } else {
    const allowed = ['connect.facebook.net', 'b.forlex.ai', 'eu-assets.i.posthog.com', 'us-assets.i.posthog.com'];
    const bad = externalScripts.filter((src) => !allowed.some((h) => src.includes(h)));
    // Relative tracking.js (/assets/tracking-<slug>.js) is expected and not in this list (https? only).
    if (bad.length > 0) fail(slug, `unexpected external scripts: ${bad.join(', ')}`);
    else pass(slug, `external scripts OK (${externalScripts.length} allowlisted)`);
  }

  // Post-build injections.
  if (CHECK_BUILT) {
    const checks = [
      ['canonical', /<link\s+rel=["']canonical["']/i],
      ['og:title', /property=["']og:title["']/i],
      ['og:description', /property=["']og:description["']/i],
      ['og:image', /property=["']og:image["']/i],
      ['twitter:card', /name=["']twitter:card["']/i],
      ['tracking.js', new RegExp(`/assets/tracking-${slug}\\.js`)],
    ];
    for (const [name, re] of checks) {
      if (!re.test(html)) fail(slug, `post-build injection missing: ${name}`);
      else pass(slug, `injected: ${name}`);
    }
    const trackingPath = join(ROOT, 'dist', 'assets', `tracking-${slug}.js`);
    if (!existsSync(trackingPath)) {
      fail(slug, 'tracking asset missing');
    } else {
      const version = createHash('sha256').update(readFileSync(trackingPath)).digest('hex').slice(0, 12);
      if (!html.includes(`/assets/tracking-${slug}.js?v=${version}`)) {
        fail(slug, 'tracking URL version does not match the emitted bundle');
      } else {
        pass(slug, 'tracking URL version matches bundle content');
      }
    }
    if (!html.includes('fbq(') && !html.includes('Meta Pixel not configured')) warn(slug, 'Meta Pixel snippet not detected');
    else pass(slug, 'Meta Pixel snippet present (or explicitly skipped)');
  }

  // Size report.
  const kb = Buffer.byteLength(html, 'utf8') / 1024;
  console.log(`  · [${slug}] ${(kb).toFixed(1)} KB ${CHECK_BUILT ? '(built)' : '(source)'}`);
  if (kb > 1500) warn(slug, 'HTML > 1.5 MB — consider scripts/extract-assets.mjs to externalize base64 images');
}

function main() {
  const slugs = listSlugs();
  if (slugs.length === 0) {
    console.error('No LPs found.');
    process.exit(1);
  }
  console.log(`LP QA (${CHECK_BUILT ? 'dist (post-build)' : 'lps source (pre-build)'}) — ${slugs.length} page(s)`);
  for (const slug of slugs) qaOne(slug);
  console.log(`\nQA done: ${failures} failure(s), ${warnings} warning(s).`);
  if (failures > 0) process.exit(1);
}

main();
