# forlex.site rewrites — serve `forlex.ai/advogados` from the LP deployment

ENG-4705 spec URLs live on the marketing host (`forlex.ai/...`, owned by the `forlex.site`
Vercel project), while LP bytes live in this repo (`go.forlex.ai`). Bridge them with
**rewrites** (not redirects): the browser URL stays `forlex.ai/...`, Vercel fetches HTML
from the LP deployment, and query strings (UTMs) pass through untouched.

## Change (in `forlex-ai/forlex.site`, file `vercel.json`)

Add a `rewrites` block **alongside** the existing `redirects` (apex → www stays first):

```json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "forlex.ai" }],
      "destination": "https://www.forlex.ai/:path*",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/advogados",
      "destination": "https://go.forlex.ai/advogados"
    },
    {
      "source": "/upgrade-premium",
      "destination": "https://go.forlex.ai/upgrade-premium"
    }
  ]
}
```

Notes:

- Target the stable custom domain (`https://go.forlex.ai/...`) — never a
  `*.vercel.app` URL. Deployment URLs are SSO-protected (same posture as
  `forlex.site`) and preview hosts rotate per deploy; a rewrite to one would
  serve the SSO login page instead of the LP.
- `cleanUrls` in this repo means `go.forlex.ai/advogados` serves `dist/advogados/index.html`
  (no trailing slash needed). The rewrite target works with or without trailing slash.
- Query strings are preserved by Vercel rewrites by default — `?utm_*` from Meta Ads reaches
  the LP HTML, and LP CTAs carry their own hardcoded UTMs to the app.
- Do **not** add these paths as Nuxt pages/routes in `forlex.site` — the rewrite must win.
  If Nuxt ever gains `/advogados.vue`, the Vercel rewrite still takes precedence for the exact
  path, but avoid the collision entirely.
- `robots` / canonical: LP HTML canonicals point to `go.forlex.ai/...` (the content owner).
  If João wants the spec URLs indexed instead, flip canonicals to `www.forlex.ai/...` in a
  follow-up (one-line change in `scripts/build.mjs` + `LP_BASE_URL` per-host logic).

## Alternative (not recommended): Nuxt `routeRules` proxy

Nuxt can proxy via `routeRules: { '/advogados': { proxy: 'https://go.forlex.ai/advogados' } }`,
but it burns a serverless invocation per LP view and complicates caching. Prefer Vercel-edge
rewrites (above): zero function cost, edge-cached.

## Rollout

1. Deploy this repo to production (`go.forlex.ai` live, QA green).
2. PR the `vercel.json` rewrite snippet to `forlex.site`, preview it:
   `curl -sI https://<forlex.site-preview>/advogados` → expect `200` (not `308`/`307`),
   `x-vercel-cache` hit on second request, body contains `LP_A_v4.4` marker comment.
3. Merge → verify `https://www.forlex.ai/advogados` + `/upgrade-premium` (single 200, no redirect chain).
4. Keep Meta Ads pointed at `go.forlex.ai/...` (primary) — the rewrites exist for spec compliance,
   organic shares, and QR codes that use the shorter `forlex.ai/...` form.

## Rollback

Revert the `forlex.site` PR (rewrites removed → `/advogados` 404s on `forlex.site`, while
`go.forlex.ai/...` keeps serving). Campaigns on `go.forlex.ai` are unaffected.
