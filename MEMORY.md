# Forlex Landing Pages - Memory

Durable repo memory: why things are the way they are. Update when decisions change.

## Decisions

- **Separate repo, not `forlex.site` pages (2026-10-01).** Campaign LPs need
  isolated deploys (seconds, independent of the Nuxt release train), drop-in
  single-file HTML fidelity (João's handoff format), and zero CSP friction
  (`forlex.site` uses nonce-based CSP; LP inline styles/scripts + base64 would
  need per-route exclusions). Paid-traffic short-lived LPs live here;
  organic/evergreen/i18n/lead-form pages stay in `forlex.site`.
- **Static-first, zero dependencies (2026-10-01).** No framework runtime keeps
  TTFB minimal for paid traffic and removes the hydration-failure class
  (`forlex.site` ENG-3939). No lockfile by design; CI uses `npm install`.
- **Repo naming (2026-10-01).** `forlex-ai/forlex.landing-pages` follows the org
  dot-convention (`forlex.site`, `forlex.infra`). Hyphenated identifiers stay
  where required: Vercel project `forlex-landing-pages` (dots disallowed), npm
  `@forlex/landing-pages`, PostHog `app: 'forlex-landing-pages'`.
- **URL strategy (2026-10-01).** Primary LP host `go.forlex.ai` (this repo's
  Vercel project). ENG-4705 spec URLs (`forlex.ai/advogados`,
  `forlex.ai/upgrade-premium`) served via **rewrites** in `forlex.site`
  (edge-level, URL preserved, UTMs intact) — never redirects. Meta Ads point
  at `go.forlex.ai` directly.
- **Tracking without `posthog-js` (2026-10-01).** Lightweight
  `POST <host>/capture/` calls (~8 KB) instead of the full SDK (~100 KB).
  Events: `lp_page_viewed` (+ `$pageview`) and `lp_cta_clicked`. Meta Pixel:
  `PageView` + `Lead` per CTA. Respects DNT for PostHog; no-ops cleanly
  without keys.
- **Base64 kept for v1 (2026-10-01).** LP A ~1.2 MB / LP B ~680 KB ship
  as-is for pixel-perfect launch. `scripts/extract-assets.mjs` exists for the
  Lighthouse follow-up (57–61% of bytes are embedded); extraction is a
  deliberate follow-up, not part of the build.
- **`robots=noindex` default (2026-10-01).** Both ENG-4705 LPs ship `noindex`
  until João approves indexing. Flip via `LP_ROBOTS` env, not source edits.
- **Primary host `go.forlex.ai` (2026-10-01).** `lp.forlex.ai` was already
  taken by a Lovable experiment (CNAME to `*.lovable.app`); `go.*` was free
  and reads better in ads. DNS authority is **Cloudflare**, not Vercel
  (`vercel dns ls forlex.ai` shows an inactive set — ignore it). The `go`
  CNAME (`→ cname.vercel-dns.com`, DNS-only) is the one manual DNS step.
- **Vercel project provisioned via API (2026-10-01).**
  `prj_dvtpAH7SNGJrE6wQxYjtHXctenhR`, team `forlex`. Protection posture
  mirrors `site` (`prod_deployment_urls_and_all_previews`: custom domains
  public, `*.vercel.app` + previews SSO-gated). Deploys run via the temporary
  `deploy.yml` bridge until the Vercel GitHub App is granted repo access.

## Gotchas

- `gh` push auth: the sandbox git credential helper may present as
  `cursor[bot]` (403 on push). Push with an explicit token remote:
  `git -c credential.helper= push "https://x-access-token:$TOKEN@github.com/..."`.
- Vercel CLI auth: the CLI reads `VERCEL_TOKEN`, not `VERCEL_ACCESS_TOKEN`.
  Export `VERCEL_TOKEN="$VERCEL_ACCESS_TOKEN"` before `vercel` commands.
- `setup-node` npm cache and `npm ci` both fail without a lockfile — this
  repo must keep `npm install` in CI and Vercel install step.
- Direct push to `platform.backend:test` is blocked by repo rules (requires
  the Pipeline Summary check) — land via feature branch + PR.
- The LP-A `?brands=0` flag and brand rotation live in `source.html`; the
  build must never strip the `URLSearchParams` bootstrap snippet.
- Playwright MCP screenshots can only write under `/workspace` — copy to
  `/opt/cursor/artifacts/` afterwards for evidence.

## Open Points (ENG-4705)

- João: `robots` keep `noindex` vs allow indexing.
- Designed OG images to replace `public/og/*.png` placeholders.
- `LP_POSTHOG_KEY` + `LP_META_PIXEL_ID` values in Vercel env.
- Canonical Figma confirmation (renamed file, same file ID).
