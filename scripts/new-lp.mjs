#!/usr/bin/env node
/**
 * Scaffold a new LP from templates/.
 * Usage: node scripts/new-lp.mjs --slug=minha-campanha --title="Título" --desc="Descrição"
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function arg(name, fallback = '') {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

const slug = arg('slug');
const title = arg('title', `Forlex — ${slug}`);
const desc = arg('desc', 'Nova landing page Forlex.');

if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('Usage: node scripts/new-lp.mjs --slug=my-lp --title="Title" --desc="Description"');
  console.error('Slug must match /^[a-z0-9][a-z0-9-]*$/');
  process.exit(1);
}

const dest = join(ROOT, 'lps', slug);
if (existsSync(dest)) {
  console.error(`lps/${slug} already exists.`);
  process.exit(1);
}
mkdirSync(dest, { recursive: true });

const configTemplate = readFileSync(join(ROOT, 'templates', 'lp.config.template.json'), 'utf8');
const sourceTemplate = readFileSync(join(ROOT, 'templates', 'source.template.html'), 'utf8');

const config = configTemplate
  .split('__SLUG__').join(slug)
  .split('__TITLE__').join(title.replace(/"/g, '\\"'))
  .split('__DESCRIPTION__').join(desc.replace(/"/g, '\\"'));
writeFileSync(join(dest, 'lp.config.json'), config, 'utf8');
writeFileSync(join(dest, 'source.html'), sourceTemplate.split('__TITLE__').join(title).split('__SLUG__').join(slug), 'utf8');
writeFileSync(join(dest, 'README.md'), `# ${slug}\n\n> LP scaffold. Replace \`source.html\` with the final single-file HTML, then update \`lp.config.json\` (CTAs, UTMs, OG) and run \`npm run build && npm run qa:built\`.\n`, 'utf8');

console.log(`[new-lp] created lps/${slug}/ (source.html + lp.config.json + README.md)`);
console.log('[new-lp] next: edit source.html, update expectedCtaCount/expectedUtm, add OG image to public/og/, run npm run build && npm run qa:built');
