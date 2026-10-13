#!/usr/bin/env node
/**
 * Build landing pages for Vercel static hosting.
 *
 * Reads lps/<slug>/source.html + lp.config.json, injects:
 * - canonical + Open Graph / Twitter tags
 * - robots directive (LP_ROBOTS env, defaults to config)
 * - Meta Pixel snippet (LP_META_PIXEL_ID) + shared tracking.js (PostHog lightweight capture)
 * - data-cta-block hints on app CTAs (best-effort, tracking.js also infers at runtime)
 *
 * Output: dist/<slug>/index.html + dist/assets/tracking-<slug>.js + dist/index.html
 *
 * Env:
 *   LP_BASE_URL (default https://go.forlex.ai)
 *   LP_POSTHOG_KEY, LP_POSTHOG_HOST (default https://b.forlex.ai)
 *   LP_META_PIXEL_ID
 *   LP_ROBOTS (noindex|index, default from lp.config.json)
 *   LP_DISABLE_TRACKING (true|false)
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LPS_DIR = join(ROOT, 'lps');
const DIST_DIR = join(ROOT, 'dist');
const TRACKING_SRC = join(ROOT, 'shared', 'tracking', 'tracking.js');

function env(name, fallback = '') {
  const v = process.env[name];
  return v === undefined || v === '' ? fallback : v;
}

function loadDotEnv() {
  for (const file of ['.env', '.env.local']) {
    const p = join(ROOT, file);
    if (!existsSync(p)) continue;
    const lines = readFileSync(p, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

function metaPixelSnippet(pixelId) {
  if (!pixelId) return '<!-- Meta Pixel not configured (LP_META_PIXEL_ID empty) -->';
  return `<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" /></noscript>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectHead(html, { config, baseUrl, pixelId, trackingSrc, robots }) {
  const canonical = `${baseUrl}${config.canonicalPath}`;
  const ogUrl = canonical;
  const ogImage = `${baseUrl}${config.og.imagePath}`;
  const injection = `
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="canonical" href="${escapeHtml(canonical)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Forlex" />
<meta property="og:title" content="${escapeHtml(config.og.title)}" />
<meta property="og:description" content="${escapeHtml(config.og.description)}" />
<meta property="og:url" content="${escapeHtml(ogUrl)}" />
<meta property="og:image" content="${escapeHtml(ogImage)}" />
<meta property="og:image:width" content="${config.og.imageWidth || 1200}" />
<meta property="og:image:height" content="${config.og.imageHeight || 630}" />
<meta property="og:image:alt" content="${escapeHtml(config.og.imageAlt || config.og.title)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(config.og.title)}" />
<meta name="twitter:description" content="${escapeHtml(config.og.description)}" />
<meta name="twitter:image" content="${escapeHtml(ogImage)}" />
${metaPixelSnippet(pixelId)}
<script defer src="${escapeHtml(trackingSrc)}"></script>
`;

  let out = html;
  // Normalize robots directive (ENG-4705: keep noindex until João confirms).
  if (/<meta\s+name=["']robots["']/i.test(out)) {
    out = out.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${robots}">`);
  } else {
    out = out.replace(/<\/head>/i, `  <meta name="robots" content="${robots}">\n</head>`);
  }
  // Inject before </head>.
  if (out.includes('</head>')) {
    out = out.replace('</head>', `${injection}</head>`);
  } else {
    out = `${injection}\n${out}`;
  }
  return out;
}

function tagCtas(html, slug) {
  // Add data-lp-cta + best-effort data-cta-block by looking backwards for data-figma.
  // tracking.js re-infers the block at runtime via closest('[data-figma]'), so this is a hint only.
  return html.replace(/<a\s+([^>]*href="[^"]*app\.forlex\.ai[^"]*"[^>]*)>/gi, (match, attrs) => {
    if (/data-lp-cta/i.test(attrs)) return match;
    return `<a ${attrs} data-lp-cta="true" data-lp-slug="${slug}">`;
  });
}

function buildTrackingJs({ slug, version, posthogKey, posthogHost, pixelId, baseUrl, disabled }) {
  let js = readFileSync(TRACKING_SRC, 'utf8');
  const replacements = {
    __LP_SLUG__: slug,
    __LP_VERSION__: version,
    __POSTHOG_KEY__: posthogKey,
    __POSTHOG_HOST__: posthogHost,
    __META_PIXEL_ID__: pixelId,
    __BASE_URL__: baseUrl,
    __TRACKING_DISABLED__: disabled ? 'true' : 'false',
  };
  for (const [key, value] of Object.entries(replacements)) {
    js = js.split(key).join(value);
  }
  return js;
}

function listSlugs() {
  return readdirSync(LPS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => existsSync(join(LPS_DIR, name, 'lp.config.json')));
}

function main() {
  loadDotEnv();
  const baseUrl = env('LP_BASE_URL', 'https://go.forlex.ai').replace(/\/+$/, '');
  const posthogKey = env('LP_POSTHOG_KEY', '');
  const posthogHost = env('LP_POSTHOG_HOST', 'https://b.forlex.ai').replace(/\/+$/, '');
  const pixelId = env('LP_META_PIXEL_ID', '');
  const robotsOverride = env('LP_ROBOTS', '');
  const disabled = env('LP_DISABLE_TRACKING', 'false') === 'true';

  if (!existsSync(TRACKING_SRC)) {
    console.error(`tracking.js not found at ${TRACKING_SRC}`);
    process.exit(1);
  }

  mkdirSync(DIST_DIR, { recursive: true });
  mkdirSync(join(DIST_DIR, 'assets'), { recursive: true });

  // Copy public/ verbatim.
  const publicDir = join(ROOT, 'public');
  if (existsSync(publicDir)) {
    cpSync(publicDir, DIST_DIR, { recursive: true });
  }

  const slugs = listSlugs();
  if (slugs.length === 0) {
    console.error('No LPs found in lps/*/lp.config.json');
    process.exit(1);
  }

  const built = [];
  for (const slug of slugs) {
    const lpDir = join(LPS_DIR, slug);
    const config = JSON.parse(readFileSync(join(lpDir, 'lp.config.json'), 'utf8'));
    const sourceFile = join(lpDir, config.sourceFile || 'source.html');
    if (!existsSync(sourceFile)) {
      console.error(`[${slug}] source not found: ${sourceFile}`);
      process.exit(1);
    }
    const robots = robotsOverride || config.robots || 'noindex';
    let html = readFileSync(sourceFile, 'utf8');
    html = tagCtas(html, slug);
    const trackingFilename = `tracking-${slug}.js`;
    const trackingJs = buildTrackingJs({
      slug,
      version: config.version || 'v1',
      posthogKey,
      posthogHost,
      pixelId,
      baseUrl,
      disabled,
    });
    const trackingVersion = createHash('sha256').update(trackingJs).digest('hex').slice(0, 12);
    const trackingSrc = `/assets/${trackingFilename}?v=${trackingVersion}`;
    html = injectHead(html, { config, baseUrl, pixelId, trackingSrc, robots });

    const outDir = join(DIST_DIR, slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');

    writeFileSync(join(DIST_DIR, 'assets', trackingFilename), trackingJs, 'utf8');

    const bytes = statSync(join(outDir, 'index.html')).size;
    built.push({ slug, version: config.version, bytes, robots });
    console.log(`[build] ${slug} (${config.version}) -> dist/${slug}/index.html (${(bytes / 1024).toFixed(1)} KB, robots=${robots})`);
  }

  // LP index (internal, always noindex).
  const indexHtml = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Forlex Landing Pages</title>
<meta name="robots" content="noindex, nofollow" />
<style>body{font-family:system-ui,sans-serif;max-width:720px;margin:48px auto;padding:0 24px;color:#111}code{background:#f3f4f6;padding:2px 6px;border-radius:6px}</style>
</head>
<body>
<h1>Forlex Landing Pages</h1>
<p>Internal index. Campaign traffic goes directly to each LP URL.</p>
<ul>
${built.map((b) => `  <li><a href="/${b.slug}"><code>/${b.slug}</code></a> — ${escapeHtml(b.version)} (${(b.bytes / 1024).toFixed(0)} KB)</li>`).join('\n')}
</ul>
<p>Base URL: <code>${escapeHtml(baseUrl)}</code></p>
</body>
</html>
`;
  writeFileSync(join(DIST_DIR, 'index.html'), indexHtml, 'utf8');

  if (!posthogKey) console.warn('[build] WARN: LP_POSTHOG_KEY is empty — PostHog capture will no-op until configured.');
  if (!pixelId) console.warn('[build] WARN: LP_META_PIXEL_ID is empty — Meta Pixel will no-op until configured.');
  console.log(`[build] done: ${built.length} LP(s) -> dist/`);
}

main();
