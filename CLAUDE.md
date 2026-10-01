# Forlex Landing Pages - Claude Code Rules

## Project Identity

- **Package**: `@forlex/landing-pages` (private static site, zero dependencies)
- **Runtime**: Node `22` (see `.node-version` + `.nvmrc`)
- **Package manager**: npm (use `npm install`, never `npm ci` — no lockfile by design)

## Core Stack

- **Framework**: none — self-contained HTML per LP, Node build scripts (ESM, no deps)
- **Styling**: inline `<style>` inside each `source.html` (no shared CSS, no Tailwind)
- **Observability**: PostHog lightweight capture + Meta Pixel, via `shared/tracking/tracking.js`
- **Testing**: `scripts/qa.mjs` gates + CI smoke job (curl assertions over `scripts/dev.mjs`)

## Commands (npm)

```bash
# Install (no-op, zero deps — keeps CI honest)
npm install

# Build (lps/*/source.html -> dist/)
npm run build

# QA
npm run qa            # pre-build: sources
npm run qa:built      # post-build: dist (OG + tracking injections)

# Dev server (dist/ at http://127.0.0.1:3000, clean URLs)
npm run dev

# Scaffold / analyze
npm run new-lp -- --slug=my-lp --title="T" --desc="D"
npm run extract-assets -- --slug=advogados   # dry-run; add --apply to extract
```

---

## Build Architecture

### Pipeline (top to bottom)

1. **`lps/<slug>/source.html`**: final single-file HTML. Owns copy, layout,
   styles, and behavior flags. Must stay self-contained (no external scripts).
2. **`lps/<slug>/lp.config.json`**: typed contract — title, description,
   `expectedCtaCount`, `expectedUtm`, `ctaDestinationPrefix`, OG block, robots.
   QA enforces it; the build injects from it.
3. **`scripts/build.mjs`**: reads 1+2, injects canonical + OG/Twitter + robots
   + favicon + Meta Pixel snippet + `<script src="/assets/tracking-<slug>.js">`,
   tags app CTAs with `data-lp-cta`, writes `dist/<slug>/index.html` and the
   per-slug tracking bundle (placeholder substitution, no bundler).
4. **`shared/tracking/tracking.js`**: vanilla JS template with
   `__LP_SLUG__`-style placeholders. Sends PostHog `POST <host>/capture/`
   (`sendBeacon` → `fetch keepalive` fallback) and `fbq` calls. Must stay
   dependency-free and DNT-aware.
5. **`scripts/dev.mjs`**: zero-dep static server for local dev + CI smoke.

### Boundaries

- Never import between LP sources — each `source.html` is independent.
- Shared code lives only in `shared/` + `scripts/` + `templates/`.
- `public/` is copied verbatim to `dist/` (robots, favicon, OG images).
- `dist/` is gitignored build output. Never edit, never commit.

---

## Tracking Conventions

- Keep `shared/tracking/tracking.js` dependency-free and under ~10 KB.
- New events need a schema entry in `docs/ANALYTICS.md` first.
- `cta_block` resolution order: explicit `data-cta-block` → closest
  `[data-figma]` → `header`/`footer`/section id → `'unknown'`.
- Never modify CTA `href`s at runtime. Read UTMs, don't write them.
- All network calls are best-effort (`try/catch`, no console errors when
  keys are missing or the network fails).
- Expose debug surface on `window.__forlexLp` (`slug`, `version`) for QA.

---

## QA Policy

- `scripts/qa.mjs` is the executable ENG-4705 checklist. Extend it when
  requirements change; keep checks deterministic (no network, no browser).
- Pre-build QA runs on sources; post-build QA (`--dir=dist`) additionally
  asserts injections (canonical, OG, tracking) and allowlisted externals.
- CI smoke (`qa.yml`, job `smoke`) boots `scripts/dev.mjs` and asserts
  HTTP 200 + key markers per LP. Keep it curl-based (fast, no Playwright
  in CI for this repo).
- Manual QA (device matrix, Pixel/PostHog live events, Lighthouse) follows
  `docs/QA_CHECKLIST.md` — link the run in the PR or Linear issue.

---

## JavaScript Fix Policy

Scripts are plain Node ESM with no typechecker. Prioritize correctness and safety.

### Core Constraints

- **No logic removal**: do not delete functional logic as a "fix"
- **Minimal changes**: surgical fixes targeting specific issues
- **No new dependencies**: solve with stdlib (`node:fs`, `node:path`, `node:http`)
- **No inline single-line `if`**: avoid `if (x) return y`. Prefer block form
- **Keep scripts runnable directly**: `node scripts/<name>.mjs` with `--help`-style
  usage text in the header comment

### Conventions

- Header comment on every script: purpose, usage, env vars.
- `snake_case` files, `camelCase` functions, `UPPER_SNAKE` env-derived constants.
- Fail with a clear message + non-zero exit; warn (don't fail) for missing
  optional config such as tracking keys.

---

## HTML Source Policy (`source.html`)

- Single file: inline CSS/JS, base64 fonts + images. No external requests
  except build-injected tracking.
- Required head: charset, viewport, `<title>`, meta description, robots,
  theme-color. OG/canonical/favicon are injected at build — don't hand-add.
- Required behavior: `?static=1` final-state flag, `prefers-reduced-motion`
  support, sticky header, `data-figma` per block.
- No `console.error` / `debugger` leftovers. No lorem ipsum. No review labels
  in shipped copy.
- Accessibility baseline: `lang="pt-BR"`, semantic landmarks, alt text on
  informative images, visible focus states, color-contrast-safe body text.

---

## Research Guidelines

When researching Vercel, PostHog capture API, or Meta Pixel behavior, gather
information before making implementation decisions.

### When to Research

- Vercel static rewrites/redirects/headers semantics and caching
- PostHog `/capture/` API payload shape and EU residency endpoints
- Meta Pixel standard vs custom events and `noscript` fallbacks

### When Not to Research Externally

- Questions about this codebase (use repo search and local docs first)
- Simple syntax lookups

---

## Slash Commands

This repo has no custom slash commands. Follow the workflow:

- `npm run build && npm run qa:built` before every commit touching `lps/`
- `npm run dev` + manual device-matrix check before requesting review
- Post Preview URLs + QA evidence on the Linear issue
