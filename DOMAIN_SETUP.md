# Domain setup — `go.forlex.ai`

## Decision

| Host | Owner (Vercel project) | Purpose |
| --- | --- | --- |
| `go.forlex.ai` | `forlex-landing-pages` Vercel project (repo `forlex-ai/forlex.landing-pages`) | Primary LP domain. Meta Ads point here. |
| `www.forlex.ai/advogados`, `www.forlex.ai/upgrade-premium` | `forlex.site` (rewrites → LP deployment) | ENG-4705 spec URLs. Served via rewrite (URL preserved, no redirect, UTMs intact). |
| `forlex.ai/*` (apex) | `forlex.site` (301 → `www.forlex.ai`) | Unchanged. |

Do **not** point `forlex.ai` DNS at the LP project — the apex + `www` stay on `forlex.site`.
The LP project only owns the `go` subdomain.

> Why `go` and not `lp`? `lp.forlex.ai` is taken: it CNAMEs to a Lovable
> experiment (`huggable-remix-spark.lovable.app`, "Forlex | Sistema para
> advogados" stub). Migrating it needs the owner's sign-off. `go.forlex.ai`
> was free, is shorter in ads, and matches the conventional go-link pattern.
> Revisit only if the Lovable site is retired.

## 1. Vercel side (done)

`go.forlex.ai` is added to the `forlex-landing-pages` project (team `forlex`)
and staged. Vercel issues TLS automatically once DNS points at it.

## 2. DNS — Cloudflare (manual, 2 min)

**Authority: Cloudflare** (`cesar`/`elisabeth.ns.cloudflare.com`) — not Vercel.
`vercel dns ls forlex.ai` shows an inactive record set; ignore it.

Cloudflare Dashboard → `forlex.ai` zone → DNS → Records → Add:

```
Type:  CNAME
Name:  go
Target: cname.vercel-dns.com
TTL:   Auto
Proxy: OFF (DNS-only, grey cloud)
```

Use **DNS-only**. If the record is proxied (orange cloud), set SSL mode to
**Full (strict)** so Vercel can issue/renew the cert — but prefer DNS-only:
Vercel handles TLS + edge cache, and proxying adds a TLS-terminating hop that
complicates `strict-transport-security` and client-IP analytics.

Verify (allow ~1 min for propagation):

```bash
# expect: cname.vercel-dns.com.
nslookup -type=CNAME go.forlex.ai

curl -sI https://go.forlex.ai/advogados | head -n 20
# expect: HTTP/2 200, strict-transport-security, no location: header
# (Vercel deployment protection covers *.vercel.app URLs only;
# custom domains are public, same posture as forlex.site.)
```

## 3. forlex.site rewrites (spec URLs)

`forlex.ai/advogados` + `forlex.ai/upgrade-premium` are implemented as **rewrites** in the
`forlex.site` Vercel project, not redirects — the browser URL stays `forlex.ai/...` while
Vercel serves bytes from the LP deployment. Full snippet + QA in `docs/FORLEX_SITE_REWRITES.md`.

Target origin for the rewrites: `https://go.forlex.ai` (stable custom domain) — never the
`*.vercel.app` hosts (those are SSO-protected, and preview hosts rotate per deploy).

## 4. Cookies / auth

LPs set no auth cookies. `localStorage` keys (`forlex_journey_id`, `forlex_lp_distinct_id`)
are per-host, so `go.forlex.ai` and `www.forlex.ai` do not share them — this is fine:
the `journey_id` is forwarded as a query param on app handoff only when forlex.site builds
the URL. LPs preserve UTMs and send their own `journey_id` in PostHog events; the app session
joins on `utm_*` + `ph_distinct_id` where available. See `docs/ANALYTICS.md`.
