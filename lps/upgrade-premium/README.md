# LP B — `/upgrade-premium` (upgrade Starter → Premium)

- **Version:** `LP_B_upgrade_v1` (01/10/2026). Formerly `LP C v1` in working files; only change: rename + `utm_content=lp_b_upgrade`.
- **Audience:** advogados com Starter ativo (grátis via OAB).
- **Goal:** upgrade para Premium (30% off via OAB).
- **Source:** `source.html` (byte-identical to Linear attachment `LP_B_upgrade_v1.html` except build injections).
- **Original docs:** `DOCUMENTACAO_ORIGINAL.md` (frozen handoff from João — do not edit).

## CTAs (6, all identical destination)

`https://app.forlex.ai/login?utm_source=meta&utm_medium=paid_social&utm_campaign=convenio_oab&utm_content=lp_b_upgrade`

Blocks: Header, Hero, Comparativo Starter x Premium, Benefícios, Oferta, CTA final.

## Flags

- `?static=1` — final state, no animations (screenshots).
- `prefers-reduced-motion` — respected (no brand rotation on this LP by design).

## Mobile note

Comparativo becomes cards on mobile, Premium first, Starter second (inherited from source).

## QA

```bash
npm run build && npm run qa:built
npm run dev  # http://127.0.0.1:3000/upgrade-premium
```

See `docs/QA_CHECKLIST.md` for the full manual checklist.
