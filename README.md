# Forlex Landing Pages

Static-first repo for campaign landing pages. Deploys to Vercel as `lp.forlex.ai`.

- **Stack:** zero-dependency static HTML + Node build (no framework). Each LP is a self-contained `source.html` (single-file workflow from design/AI) plus a `lp.config.json` with CTAs, UTMs and OG.
- **Why a separate repo:** campaign LPs iterate faster than `forlex.site`, need isolated deploys/previews, and keep paid-traffic experiments out of the main marketing site deploy queue.
- **ENG-4705:** ships `advogados` (LP A) and `upgrade-premium` (LP B) for the OAB × Forlex Meta Ads campaign.

## URLs

| LP | LP domain (new) | Marketing URL (ENG-4705 spec, via forlex.site rewrite) |
| --- | --- | --- |
| LP A — novos usuários (Starter grátis) | `https://lp.forlex.ai/advogados` | `https://www.forlex.ai/advogados` |
| LP B — upgrade (Premium 30% off) | `https://lp.forlex.ai/upgrade-premium` | `https://www.forlex.ai/upgrade-premium` |

Meta Ads should point to the LP domain directly (`lp.forlex.ai/...`). The `forlex.ai/...` URLs keep working via rewrites in `forlex.site` (see `docs/FORLEX_SITE_REWRITES.md`) so the ENG-4705 spec stays valid.

## Quickstart

```bash
cp .env.example .env.local
# fill LP_POSTHOG_KEY + LP_META_PIXEL_ID (or leave empty for local dev)

npm run build     # lps/*/source.html -> dist/
npm run qa        # pre-build QA (sources)
npm run qa:built  # post-build QA (dist, includes OG + tracking)
npm run dev       # serve dist/ at http://127.0.0.1:3000
```

Open `http://127.0.0.1:3000/advogados` and `http://127.0.0.1:3000/upgrade-premium`.
Flags: `?static=1` disables animations (screenshots), `?brands=0` freezes the LP-A headline rotation.

## Repo layout

```
lps/<slug>/
  source.html              # final single-file HTML (fonts/images embedded)
  lp.config.json           # title, description, CTAs, UTMs, OG, robots
  README.md                # per-LP notes + QA
  DOCUMENTACAO_ORIGINAL.md # João's original .md (ENG-4705 LPs only)
shared/tracking/tracking.js  # PostHog (lightweight capture) + Meta Pixel CTA tracking
scripts/
  build.mjs              # inject OG/canonical/robots/tracking -> dist/
  qa.mjs                 # automated ENG-4705 checks (CTA count, UTMs, meta, flags)
  dev.mjs                # zero-dep static server
  new-lp.mjs             # scaffold lps/<slug>/
  extract-assets.mjs     # report/extract base64 assets (Lighthouse follow-up)
public/
  robots.txt favicon.svg og/*.png  # copied verbatim to dist/
templates/               # new-LP scaffolds
docs/                    # setup + analytics + QA runbooks
```

## Adding a new LP

```bash
npm run new-lp -- --slug=minha-campanha --title="Título" --desc="Descrição"
# paste final HTML into lps/minha-campanha/source.html
# update lps/minha-campanha/lp.config.json (expectedCtaCount, expectedUtm, og)
# add public/og/minha-campanha.png (1200x630)
npm run build && npm run qa:built
```

Full workflow: `CONTRIBUTING.md`.

## Tracking

- PostHog: `lp_page_viewed` (+ `$pageview`) and `lp_cta_clicked` with `lp_slug`, `cta_block`, `cta_text`, `cta_href`, UTMs, `journey_id`. Uses `https://b.forlex.ai` proxy host, respects DNT.
- Meta Pixel: `PageView` + `Lead` on every CTA click (+ `LpCtaClicked` custom event).
- UTMs are never rewritten — clicks land on `app.forlex.ai/login` with the query string intact.

Schema + verification: `docs/ANALYTICS.md`.

## Deploy

- Vercel project: framework `Other`, build `npm run build`, output `dist`. See `VERCEL_SETUP.md`.
- Domain: `lp.forlex.ai` (CNAME to `cname.vercel-dns.com`). See `DOMAIN_SETUP.md`.
- Env vars (Vercel → Production + Preview): `LP_BASE_URL`, `LP_POSTHOG_KEY`, `LP_POSTHOG_HOST`, `LP_META_PIXEL_ID`, `LP_ROBOTS=noindex`.
- `forlex.ai/advogados` + `forlex.ai/upgrade-premium` stay live via `forlex.site` rewrites (no redirect, URL preserved, UTMs intact). See `docs/FORLEX_SITE_REWRITES.md`.

New repo bootstrap (GitHub + Vercel CLI): `REPO_SETUP.md`.

## Status / open points (ENG-4705)

- [ ] João confirms `robots`: keep `noindex` (current) or allow indexing.
- [ ] Designed OG images replace `public/og/*.png` placeholders (currently solid-color 1200×630 so validators pass).
- [ ] `LP_META_PIXEL_ID` + `LP_POSTHOG_KEY` set in Vercel (build warns when empty).
- [ ] If Lighthouse flags weight (LP A ~1.2 MB, LP B ~680 KB base64), run `scripts/extract-assets.mjs` follow-up.
- [ ] Confirm canonical Figma: Linear links `Forlex-Meta-Ads-OAB-v3`, latest message links `Forlex-LPs---Campanhas` — see `docs/FIGMA.md`.

## Links

- Linear ENG-4705: `https://linear.app/forlex/issue/ENG-4705/publicar-lps-campanha-oab-forlexaiadvogados-lp-a-e-forlexaiupgrade`
- Docs: `docs/ENG-4705.md`, `docs/QA_CHECKLIST.md`, `docs/ANALYTICS.md`, `docs/FORLEX_SITE_REWRITES.md`
