# Contributing — adding / updating LPs

## Workflow (single-file HTML in, static deploy out)

1. Scaffold (new LP) or copy (new version):
   ```bash
   npm run new-lp -- --slug=minha-campanha --title="Título" --desc="Descrição"
   # or: cp -r lps/advogados lps/advogados-v2  (then rename slug in lp.config.json)
   ```
2. Paste the final single-file HTML into `lps/<slug>/source.html`.
   - Keep fonts/images embedded (base64) for v1 — pixel-perfect first, optimize later.
   - Keep `?static=1` support (`URLSearchParams` + `.static` class) and `prefers-reduced-motion`.
   - Keep header `position: sticky` and `data-figma` attributes per block (tracking uses them for `cta_block`).
3. Update `lps/<slug>/lp.config.json`:
   - `title` / `description` must match the `<title>` / `<meta name="description">` in `source.html` exactly.
   - `expectedCtaCount` + `expectedUtm` must match every `app.forlex.ai` link.
   - `og.title/description/imagePath/imageAlt`.
4. Add `public/og/<slug>.png` (1200×630). Placeholders are solid-color PNGs + SVGs — replace with designed art.
5. Build + QA:
   ```bash
   npm run build && npm run qa:built
   npm run dev  # manual check at /<slug>, ?static=1, mobile 390 + desktop 1440
   ```

## Conventions

- Slugs: lowercase kebab (`advogados`, `upgrade-premium`). One folder per URL path.
- `source.html` is the source of truth — never hand-edit `dist/`.
- `lp.config.json` versions (`LP_A_v4.4`) track the design handoff version, not semver.
- Keep `DOCUMENTACAO_ORIGINAL.md` next to the source for João's handoff docs (do not edit; add notes to `README.md`).
- CTAs: all app links must be absolute `https://app.forlex.ai/...` with full UTMs. Never use relative `/login`.
- No external `<script src>` in `source.html` — tracking is injected at build time.

## QA gates (CI runs `npm run build && npm run qa:built`)

- Title/description match config; viewport/charset/theme-color/robots present.
- CTA count + exact UTMs (fails on any mismatch).
- `?static=1`, `prefers-reduced-motion`, sticky header present.
- Post-build: canonical + OG/Twitter + `tracking-<slug>.js` injected; only allowlisted external scripts.
- Manual (see `docs/QA_CHECKLIST.md`): 390/768/1440 no-horizontal-scroll, all CTAs → app with UTMs,
  PostHog + Pixel fire, anchors work with fixed header, Lighthouse without severe regression.

## Lighthouse follow-up (when HTML weight flags)

```bash
node scripts/extract-assets.mjs --slug=advogados            # dry-run: embedded-bytes report
node scripts/extract-assets.mjs --slug=advogados --apply    # extract to lps/<slug>/assets/ (keeps .bak)
```

Extraction is a follow-up, not part of `npm run build` for v1 — review the diff, re-run QA + visual check.
