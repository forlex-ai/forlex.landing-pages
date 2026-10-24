# Forlex Landing Pages Agent Guide

This is the canonical, tool-neutral entrypoint for coding agents working in the
`forlex-ai/forlex.landing-pages` repository (supported across Antigravity,
Cursor, Claude Code, and Codex).

## Repository Identity

- Package: `@forlex/landing-pages` (private, zero dependencies, never published)
- Runtime: Node `22` (`.node-version` + `.nvmrc`, `engines: >=20`)
- Package manager: npm only (`npm install`; no lockfile by design — see below)
- App: static HTML landing pages, no framework. Build is `scripts/build.mjs`
  (`lps/<slug>/source.html` + `lp.config.json` → `dist/`).
- Hosting: Vercel project `forlex-landing-pages` (team `forlex`), output `dist`,
  primary domain `go.forlex.ai`.
- Observability: PostHog (`lp_page_viewed`, `lp_cta_clicked`) + Meta Pixel
  (`PageView`, `ViewContent`, per-LP intent events), injected at build time via `shared/tracking/tracking.js`.
- Tests: `scripts/qa.mjs` (static + post-build gates) + CI smoke job.

## Commands (npm)

```bash
npm install                                             # no-op, zero deps
npm run build                                           # lps/*/source.html -> dist/
npm run qa                                              # pre-build: sources
npm run qa:built                                        # post-build: dist (OG + tracking injections)
npm run dev                                             # dist/ at http://127.0.0.1:3000
npm run new-lp -- --slug=my-lp --title="T" --desc="D"   # scaffold new LP
npm run extract-assets -- --slug=advogados              # dry-run; add --apply to extract
```

## Build Pipeline & Script Policy

1. **`lps/<slug>/source.html`**: single-file HTML owning copy, layout, inline `<style>`/JS, and base64 fonts/images. No external requests except build-injected tracking.
2. **`lps/<slug>/lp.config.json`**: typed contract — `title`, `description`, `expectedCtaCount`, `expectedUtm`, `ctaDestinationPrefix`, OG block, `robots`.
3. **`scripts/build.mjs`**: injects canonical, OG/Twitter, `robots`, favicon, Meta Pixel snippet, and `/assets/tracking-<slug>.js`; tags app CTAs with `data-lp-cta`; writes `dist/<slug>/index.html`.
4. **`shared/tracking/tracking.js`**: dependency-free vanilla JS template (<10 KB, DNT-aware) sending PostHog `POST <host>/capture/` (`sendBeacon` → `fetch keepalive` fallback) and `fbq` calls. `cta_block` resolution order: explicit `data-cta-block` → closest `[data-figma]` → `header`/`footer`/section `id` → `'unknown'`. Exposes `window.__forlexLp` (`slug`, `version`) for QA.
5. **Node ESM scripts (`scripts/*.mjs`)**: plain Node stdlib only (`node:fs`, `node:path`, `node:http`), runnable directly with `--help` usage comments, block-form `if` statements (no inline single-line `if`), and `snake_case` files / `camelCase` functions / `UPPER_SNAKE` constants.

## First Reads

Before editing, read only the context needed for the task:

- `README.md` for the URL map, quickstart, and open points.
- `CONTRIBUTING.md` before adding or updating any LP (the drop-in workflow).
- `docs/ENG-4705.md` + `docs/QA_CHECKLIST.md` before touching the OAB campaign LPs.
- `docs/ANALYTICS.md` before touching `shared/tracking/` or CTA hrefs.
- `docs/FORLEX_SITE_REWRITES.md` before changing slugs, canonical paths, or
  anything that affects `forlex.ai/<slug>` spec URLs.
- `docs/FIGMA.md` before visual QA against design frames.
- `REPO_SETUP.md` / `VERCEL_SETUP.md` / `DOMAIN_SETUP.md` before changing
  deploy, domain, or environment configuration.
- `lps/<slug>/DOCUMENTACAO_ORIGINAL.md` is a frozen handoff — read it, never edit it.

## Non-Negotiable LP Rules

- `lps/<slug>/source.html` is the source of truth. Never hand-edit `dist/`.
- CTA hrefs to `app.forlex.ai` must stay absolute with full UTMs. Never rewrite,
  shorten, or relativize them; `scripts/qa.mjs` fails CI on any mismatch.
- `<title>` / `<meta name="description">` in `source.html` must match
  `lp.config.json` exactly, or CI fails.
- Keep `?static=1` support, `prefers-reduced-motion` handling, sticky header,
  and `data-figma` block attributes in every LP.
- No external `<script src>` in `source.html`. Tracking is injected at build time.
- `robots` stays `noindex` until João explicitly approves indexing (flip via the
  `LP_ROBOTS` Vercel env, not by editing sources).
- Never commit `.env` files, real PostHog keys, or Pixel IDs. Placeholders only
  (`<phc_...>`) — `security.yml` scans for secret patterns.

## Zero-Dependency Contract

This repo intentionally has **no runtime dependencies and no lockfile**:

- Do not add npm dependencies without a written justification in the PR
  (every byte ships to paid-traffic pages; the tracking budget is ~8 KB).
- CI uses `npm install`, never `npm ci` (see `fix(ci)` history — `setup-node`
  npm cache and `npm ci` both fail without a lockfile).
- `renovate.json` exists for GitHub Actions pin updates and future deps.

## Brand And Design System

- Official brand source of truth:
  `https://obvious-fade-767014.framer.app/forlex/overview`.
- LP typography is owned by each `source.html`: Sora for display/headlines,
  Inter for body/UI, embedded as base64 (offline + Figma compatible).
- Canonical brand primitives include `forlex-primary` `#598FB2`,
  `forlex-ink` `#0F2B38`, and `forlex-night` `#091920` (LP theme-color).
- Do not invent approximate brand colors or redraw logo assets.
- OG images live in `public/og/<slug>.png` (1200×630). Placeholders are
  solid-color PNGs — replace with designed art before launch, never ship a
  new LP without a real OG image.

## Analytics Contract

- Event surface: `source: 'lp'`, `app: 'forlex-landing-pages'`
  (hyphenated identifier convention, cf. `forlex-site`).
- Every LP must emit `lp_page_viewed` on load and `lp_cta_clicked` on every
  app-CTA click, with `lp_slug`, `cta_block`, `cta_text`, `cta_href`, UTMs,
  and `journey_id` (shared `forlex_journey_id` localStorage key with
  `forlex.site`, ENG-3746 convention).
- Meta Pixel: `PageView` + `ViewContent` on load, `Lead` for Advogados CTA
  clicks and `InitiateCheckout` for Premium CTA clicks. `content_name` is
  `lp_advogados` / `lp_upgrade_premium`; `cta` identifies the position.
  Completed conversions (`Purchase`, registration) belong in the app.
- PostHog capture respects `navigator.doNotTrack`. Tracking no-ops cleanly
  when keys are unset (local dev, no console errors).

## Deploy Contract

- Vercel project `forlex-landing-pages` (team `forlex`): framework `Other`,
  build `npm run build`, output `dist`, Node `22.x`.
- `vercel.json` owns `cleanUrls`, `trailingSlash: false`, security headers,
  and long-cache for `/assets/*`. Do not add redirects here for LP paths —
  spec-URL bridging lives in `forlex.site` rewrites.
- Env vars are baked in at build time (`LP_BASE_URL`, `LP_POSTHOG_KEY`,
  `LP_POSTHOG_HOST`, `LP_META_PIXEL_ID`, `LP_ROBOTS`, `LP_DISABLE_TRACKING`).
  Redeploy after changing them.
- Every PR gets a Vercel Preview URL. Post `<preview>/advogados` and
  `<preview>/upgrade-premium` (+ `?static=1` screenshots) on the Linear issue.

## Branch Promotion & Git Workflow

- **Two-branch promotion (`test` → `main`):** `test` is the integration branch and `main` is the production branch. Feature branches must be cut from `origin/test` and opened as Pull Requests targeting `--base test` — never open feature PRs directly against `main`.
- **Promotion PRs:** Only promote changes from `test` to `main` after `npm run qa`, `npm run build`, and `npm run qa:built` pass and preview URLs are verified.
- **Submodule workflow (`forlex.backend`):** Treat `libs/forlex.landing-pages` as an independent repository and delivery unit. Push feature branches and merge PRs to `test` inside `forlex.landing-pages` first, then bump the gitlink pointer in `forlex.backend` to the merged `origin/test` commit.
- **Anti-conflict & scanner hygiene for `AGENTS.md` and `MEMORY.md`:** insert new notes under their matching domain heading (never append raw entries at EOF, where concurrent PRs collide in 3-way Git merges), keep both files content-clean of false-positive secret-scanner literals (enforced by `.github/workflows/secret-scan.yml` and `.forlex/security/secret_scan.py`) instead of adding commit-SHA-bound `.forlex/security/exceptions.json` rules, and separate code/CI commits from shared-doc (`AGENTS.md` / `MEMORY.md`) commits in multi-file PRs.

## Sibling Repos

- `forlex-ai/forlex.site` (Nuxt, `www.forlex.ai`): owns the apex + `www`
  hosts and the `/advogados` + `/upgrade-premium` rewrites. Never add those
  paths as Nuxt pages — the rewrite must win.
- `forlex-ai/forlex.backend`: vendors this repo as submodule
  `libs/forlex.landing-pages` (same pattern as `libs/forlex.site`).
