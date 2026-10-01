# Vercel setup — `forlex-landing-pages`

## 1. Import the repo

Vercel Dashboard → Add New → Project → Import `forlex-ai/forlex.landing-pages`.

| Setting | Value |
| --- | --- |
| Framework Preset | `Other` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` (default; repo has zero deps, no lockfile) |
| Node.js Version | `22.x` |
| Root Directory | `.` (repo root) |

`vercel.json` already sets `buildCommand`, `outputDirectory`, `cleanUrls`, security headers
and long-cache for `/assets/*`. No extra config needed.

## 2. Environment variables

Vercel → Project → Settings → Environment Variables. Set for **Production + Preview**
(Preview can use the same PostHog key; use a test Pixel ID if you have one):

| Name | Value | Notes |
| --- | --- | --- |
| `LP_BASE_URL` | `https://lp.forlex.ai` | Preview builds override automatically? No — keep prod URL; canonical/OG always point to prod (intentional). |
| `LP_POSTHOG_KEY` | `<phc_...>` | Copy `NUXT_PUBLIC_POSTHOG_KEY` from the `forlex.site` Vercel project. |
| `LP_POSTHOG_HOST` | `https://b.forlex.ai` | Same reverse proxy as `forlex.site`. |
| `LP_META_PIXEL_ID` | `<pixel id>` | Meta Events Manager → Data Sources. Empty = Pixel snippet skipped (build warns). |
| `LP_ROBOTS` | `noindex` | Keep until João confirms indexation (ENG-4705 open point). |
| `LP_DISABLE_TRACKING` | `false` | Set `true` only for local dev without keys. |

Redeploy after changing env vars (they are baked in at build time).

## 3. Preview workflow

- Every PR gets a Vercel Preview URL (`https://forlex-landing-pages-<hash>.vercel.app`).
- Share `.../advogados` + `.../upgrade-premium` (+ `?static=1` screenshots) on the Linear issue.
- `npm run qa:built` runs in CI (`.github/workflows/qa.yml`) and must pass before merge.

## 4. Production

- Merge to `main` → auto-deploy to production (`lp.forlex.ai` once the domain is attached).
- Verify: `curl -sI https://lp.forlex.ai/advogados | head`, check `200`, `strict-transport-security`,
  no redirect chain (UTMs must survive — rewrites, not redirects, on the `forlex.site` side).

## 5. Observability

- Vercel Analytics / Speed Insights: optional; PostHog remains the source of truth for
  `lp_page_viewed` / `lp_cta_clicked`. Enable Speed Insights in Vercel if you want Web Vitals
  without extra code.
- Logs: static hosting has no function logs; QA failures surface in GitHub Actions + Vercel build logs.

## 6. Rollback

- Vercel → Deployments → Promote a previous production deployment (instant).
- LP content is versioned per `lp.config.json` (`LP_A_v4.4`, `LP_B_upgrade_v1`) — keep old
  `source.html` in git history; no runtime feature flags needed for v1.
