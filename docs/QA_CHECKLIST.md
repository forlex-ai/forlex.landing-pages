# QA checklist — ENG-4705 (manual + automated)

Automated (`npm run build && npm run qa:built`, also in CI):

- [ ] Title/description match `lp.config.json`; viewport/charset/theme-color/robots present.
- [ ] LP A: exactly 7 CTAs; LP B: exactly 6 CTAs; all with exact UTMs.
- [ ] `?static=1`, `prefers-reduced-motion`, sticky header detected.
- [ ] Post-build: canonical + OG/Twitter + `tracking-<slug>.js` injected; no unexpected external scripts.

Manual (per Preview + Production deploy):

- [ ] `lp.forlex.ai/advogados` opens LP A, `lp.forlex.ai/upgrade-premium` opens LP B (HTTPS, no console errors).
- [ ] `www.forlex.ai/advogados` + `www.forlex.ai/upgrade-premium` serve the same bytes via rewrite
      (URL stays `forlex.ai/...`, no redirect chain — check Network tab, single 200).
- [ ] Desktop 1440 + mobile 390 vs `source.html` + Figma (incl. iOS Safari + Android Chrome).
- [ ] No horizontal scroll at 390 / 768 / 1440 (DevTools device toolbar + `document.documentElement.scrollWidth <= innerWidth`).
- [ ] LP A: click all 7 CTAs → `app.forlex.ai/login` with `utm_content=lp_a` intact.
- [ ] LP B: click all 6 CTAs → `app.forlex.ai/login` with `utm_content=lp_b_upgrade` intact.
- [ ] UTMs visible in the app PostHog session after click-through.
- [ ] PostHog: `lp_page_viewed` + `lp_cta_clicked` in Live Events (see `ANALYTICS.md`).
- [ ] Meta Pixel: `PageView` + `Lead` in Events Manager Test Events.
- [ ] Internal anchors (`#comparativo`, `#oferta`, `#topo`, `#funcionalidades`) work with the fixed header
      (target not hidden under the sticky bar).
- [ ] `?static=1` shows final state without animation (both LPs); `?brands=0` freezes LP-A headline;
      `prefers-reduced-motion` shows the static headline.
- [ ] Lighthouse mobile: no severe performance/a11y/SEO regression. Known weight: LP A ~1.2 MB,
      LP B ~680 KB (base64 images). If flagged, schedule `extract-assets.mjs` follow-up — do not
      block launch on weight alone.
- [ ] Meta title/description, `robots` (per João's decision), OG (`og:title/description/image`) verified
      (Meta Sharing Debugger + `curl` the built HTML).
- [ ] No forms on either page (nothing to test).

Sign-off:

- [ ] João confirms `robots` (`noindex` keep vs `index`).
- [ ] João approves OG images (placeholders in `public/og/*.png` until designed art lands).
- [ ] Preview URLs posted on ENG-4705; campaigns point at `lp.forlex.ai/...` (primary) after sign-off.
