# Domain setup — `lp.forlex.ai`

## Decision

| Host | Owner (Vercel project) | Purpose |
| --- | --- | --- |
| `lp.forlex.ai` | `forlex-landing-pages` (this repo) | Primary LP domain. Meta Ads point here. |
| `www.forlex.ai/advogados`, `www.forlex.ai/upgrade-premium` | `forlex.site` (rewrites → LP deployment) | ENG-4705 spec URLs. Served via rewrite (URL preserved, no redirect, UTMs intact). |
| `forlex.ai/*` (apex) | `forlex.site` (301 → `www.forlex.ai`) | Unchanged. |

Do **not** point `forlex.ai` DNS at the LP project — the apex + `www` stay on `forlex.site`.
The LP project only owns the `lp` subdomain.

## 1. Add the domain in Vercel

Vercel → `forlex-landing-pages` → Settings → Domains → Add `lp.forlex.ai`.

Vercel will show the required DNS record:

```
Type: CNAME
Name: lp
Value: cname.vercel-dns.com.
TTL: auto
```

## 2. DNS (Cloudflare / registrar)

Add the `lp` CNAME at the `forlex.ai` zone. If Cloudflare proxies the record (orange cloud),
set SSL mode to **Full (strict)** so Vercel can issue/renew the cert. Prefer **DNS-only**
(grey cloud) for `lp` unless you need Cloudflare WAF in front — Vercel handles TLS + edge cache.

Verify:

```bash
dig +short lp.forlex.ai
# expect: cname.vercel-dns.com. -> vercel edge IPs

curl -sI https://lp.forlex.ai/advogados | head -n 20
# expect: HTTP/2 200, strict-transport-security, no location: header
```

## 3. forlex.site rewrites (spec URLs)

`forlex.ai/advogados` + `forlex.ai/upgrade-premium` are implemented as **rewrites** in the
`forlex.site` Vercel project, not redirects — the browser URL stays `forlex.ai/...` while
Vercel serves bytes from the LP deployment. Full snippet + QA in `docs/FORLEX_SITE_REWRITES.md`.

Target origin for the rewrites: `https://lp.forlex.ai` (stable) — not the
`*.vercel.app` preview host (rotates per deploy).

## 4. Cookies / auth

LPs set no auth cookies. `localStorage` keys (`forlex_journey_id`, `forlex_lp_distinct_id`)
are per-host, so `lp.forlex.ai` and `www.forlex.ai` do not share them — this is fine:
the `journey_id` is forwarded as a query param on app handoff only when forlex.site builds
the URL. LPs preserve UTMs and send their own `journey_id` in PostHog events; the app session
joins on `utm_*` + `ph_distinct_id` where available. See `docs/ANALYTICS.md`.
