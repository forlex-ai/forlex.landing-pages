# Analytics — PostHog + Meta Pixel

## Design

LPs are static (no `posthog-js` bundle — saves ~100 KB). `shared/tracking/tracking.js`
sends lightweight `POST ${LP_POSTHOG_HOST}/capture/` calls plus standard `fbq` calls.

| Concern | PostHog | Meta Pixel |
| --- | --- | --- |
| Page view | `lp_page_viewed` + `$pageview` | `PageView` + `ViewContent` |
| CTA click | `lp_cta_clicked` | Advogados: `Lead`; Upgrade Premium: `InitiateCheckout` (+ `LpCtaClicked` custom) |
| Identity | `forlex_lp_distinct_id` (localStorage) + `forlex_journey_id` (shared key with forlex.site) | `fbq` cookies (`_fbp`) |
| DNT | skipped when `navigator.doNotTrack=1` (matches forlex.site) | still sent (Meta has no DNT handling; document if legal requires opt-out) |
| Disabled | `LP_DISABLE_TRACKING=true` or empty key → no-op | empty `LP_META_PIXEL_ID` → snippet skipped |

## Event schemas

### `lp_page_viewed` (+ `$pageview`, same props)

```json
{
  "source": "lp",
  "app": "forlex-landing-pages",
  "service": "platform",
  "environment": "production",
  "lp_slug": "advogados",
  "lp_version": "LP_A_v4.4",
  "page_path": "/advogados",
  "page_title": "...",
  "current_url": "https://go.forlex.ai/advogados?utm_...",
  "referrer_domain": "l.facebook.com",
  "journey_id": "<uuid, shared forlex_journey_id>",
  "utm_source": "meta",
  "utm_medium": "paid_social",
  "utm_campaign": "convenio_oab",
  "utm_content": "lp_a"
}
```

### `lp_cta_clicked`

`lp_page_viewed` props plus:

```json
{
  "cta_block": "Hero",
  "cta_text": "Criar minha conta grátis",
  "cta_href": "https://app.forlex.ai/login?utm_...",
  "cta_utm_content": "lp_a",
  "cta_utm_campaign": "convenio_oab"
}
```

`cta_block` comes from the closest `data-figma` ancestor (e.g. `Header`, `Hero`, `Oferta`),
falling back to `header` / `footer` / section `id`. Keep `data-figma` attributes in `source.html`.

### Meta Pixel

- On load: `PageView`, then `ViewContent` with `content_name: 'lp_advogados'`
  or `'lp_upgrade_premium'`.
- Advogados CTA: `Lead` with `{ content_name: 'lp_advogados', cta: '<position>' }`.
- Upgrade Premium CTA: `InitiateCheckout` with
  `{ content_name: 'lp_upgrade_premium', cta: '<position>' }`. This is an intent
  click, not a paid upgrade; no invented value or currency is sent.
- Both retain `LpCtaClicked` with `lp_slug`, `cta_block`, `cta_text`, and `cta`.
- `cta` positions: `header`, `hero`, `funcionalidades`, `comparativo`,
  `oferta_starter`, `oferta_premium`, `beneficios`, and `final` as applicable.
  The two offer cards on Advogados are distinguished separately. Explicit
  `data-meta-cta` wins; otherwise existing block attributes and card headings
  identify the position. PostHog's existing `cta_block` stays unchanged.
- Events are dispatched before navigation. Only an unmodified primary click
  in the same tab waits 200 ms when the configured Meta function is available.
  Modified clicks, other targets, disabled/unconfigured tracking, and previously
  canceled clicks retain native navigation. This bounded delay is best-effort,
  not an acknowledgement from Meta; blocked requests remain blocked.
- `CompleteRegistration` and `Purchase`/`Subscribe` belong in the app/backend
  after actual account creation/payment, with real values and deduplication.
  LPs do not emit these conversion events.
- Tracking URLs include a content-derived version query to avoid reusing the
  previous bundle under the long-lived asset cache. Asset paths remain stable
  for the existing exact-path site rewrites.

## Verification

1. **PostHog Live Events** (EU project): filter `app = forlex-landing-pages`, open the Preview URL
   with `?utm_source=meta&utm_medium=paid_social&utm_campaign=convenio_oab&utm_content=lp_a`,
   click a CTA. Expect `lp_page_viewed` → `lp_cta_clicked` with matching `journey_id`.
2. **App session join:** after clicking through, the app PostHog session should show the same
   `utm_*` (query string preserved). `ph_distinct_id` handoff is forlex.site-only; LPs join on UTMs.
3. **Meta Events Manager → Test Events:** open the Preview URL with the test code, expect
   `PageView` → `ViewContent` → `Lead` for Advogados or `InitiateCheckout`
   for Premium, with the corresponding `content_name` and CTA position.
4. **Network tab:** `POST https://b.forlex.ai/capture/` (200, `sendBeacon` or `fetch keepalive`),
   `POST https://www.facebook.com/tr/` (Pixel).
5. **DNT:** with `navigator.doNotTrack=1`, PostHog calls stop, Pixel continues (documented).

## forlex.site conventions reused

- `source`/`app`/`service`/`environment` surface props (org convention: filter `source=site` for site,
  `source=lp` for LPs).
- `forlex_journey_id` localStorage key (ENG-3746 site→app handoff).
- `utm_*` preservation (never rewrite CTA hrefs).
- `respect_dnt` for PostHog.
