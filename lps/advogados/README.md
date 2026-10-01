# LP A — `/advogados` (novos usuários)

- **Version:** `LP_A_v4.4` (01/10/2026). Only change vs `v4.3.1`: all CTAs → `app.forlex.ai/login` + UTMs.
- **Audience:** advogados com OAB ativa que ainda não usam a Forlex.
- **Goal:** criar conta + ativar Starter (grátis via parceria OAB Nacional).
- **Source:** `source.html` (byte-identical to Linear attachment `LP_A_v4.4.html` except build injections).
- **Original docs:** `DOCUMENTACAO_ORIGINAL.md` (frozen handoff from João — do not edit).

## CTAs (7, all identical destination)

`https://app.forlex.ai/login?utm_source=meta&utm_medium=paid_social&utm_campaign=convenio_oab&utm_content=lp_a`

Blocks: Header, Hero, Funcionalidades escritório, Comparativo, Oferta Starter, Oferta Premium, CTA final.

## Flags

- `?static=1` — final state, no animations (screenshots).
- `?brands=0` — freeze H1 brand rotation on ChatGPT (default rotates ChatGPT/Claude/Gemini).
- `prefers-reduced-motion` — static headline, no entrance animations.

## QA

```bash
npm run build && npm run qa:built
npm run dev  # http://127.0.0.1:3000/advogados
```

See `docs/QA_CHECKLIST.md` for the full manual checklist.
