# New repo bootstrap — `forlex-ai/forlex-landing-pages`

This folder is the complete source of the new repo. It was scaffolded inside `platform.backend`
(branch `test`) so it can be reviewed as a PR first, then pushed as a standalone repo.

## Option A — push this folder as the new repo (recommended)

```bash
# 1. Create the empty GitHub repo (needs repo-create permission in forlex-ai org)
gh repo create forlex-ai/forlex-landing-pages --public --description "Forlex campaign landing pages (Vercel, lp.forlex.ai)"

# 2. Extract this folder as the new repo root (keeps history out, clean start)
cd /tmp
rm -rf forlex-landing-pages && mkdir forlex-landing-pages
cp -r /workspace/landing-pages/. /tmp/forlex-landing-pages/
cd /tmp/forlex-landing-pages
git init -b main
git add .
git commit -m "feat: landing pages repo (ENG-4705 OAB LPs + Vercel static pipeline)"
git remote add origin git@github.com:forlex-ai/forlex-landing-pages.git
git push -u origin main

# 3. Protect main + require QA workflow (GitHub UI: Settings → Branches)
# Required checks: `qa` (see .github/workflows/qa.yml)
```

Or run the helper (does steps 2–3 after you create the repo):

```bash
./scripts/create-github-repo.sh --org forlex-ai --repo forlex-landing-pages
```

## Option B — keep as a submodule of platform.backend (like forlex.site)

Only if you want `libs/forlex.landing` pinned in the monorepo. After Option A:

```bash
cd /workspace
git submodule add -b main git@github.com:forlex-ai/forlex-landing-pages.git libs/forlex.landing
git commit -m "chore: add forlex.landing submodule"
```

Default recommendation is **standalone repo, no submodule** — LPs deploy independently
and marketing should not need the monorepo checkout.

## After the repo exists

1. Vercel: import `forlex-ai/forlex-landing-pages` → see `VERCEL_SETUP.md`.
2. Domain: add `lp.forlex.ai` → see `DOMAIN_SETUP.md`.
3. Env vars: `LP_BASE_URL`, `LP_POSTHOG_KEY`, `LP_POSTHOG_HOST`, `LP_META_PIXEL_ID`, `LP_ROBOTS`.
4. forlex.site rewrites for `forlex.ai/advogados` + `forlex.ai/upgrade-premium` → see `docs/FORLEX_SITE_REWRITES.md`.
5. Update Linear ENG-4705 with preview + production URLs, request João's sign-off on `robots` + OG.

## Naming

- Repo: `forlex-ai/forlex-landing-pages` (matches `@forlex/landing-pages` package name).
- Vercel project: `forlex-landing-pages`.
- Domain: `lp.forlex.ai` (primary). Avoid `go.` (used for shortlinks elsewhere) and bare `forlex.ai/*`
  (owned by `forlex.site`; served via rewrites, not DNS).
