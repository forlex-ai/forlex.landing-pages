#!/usr/bin/env bash
# Push the landing-pages folder as a standalone repo.
# Usage: ./scripts/create-github-repo.sh --org forlex-ai --repo forlex-landing-pages [--branch main] [--remote git@github.com:...]
set -euo pipefail

ORG="forlex-ai"
REPO="forlex-landing-pages"
BRANCH="main"
REMOTE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --org) ORG="$2"; shift 2;;
    --repo) REPO="$2"; shift 2;;
    --branch) BRANCH="$2"; shift 2;;
    --remote) REMOTE="$2"; shift 2;;
    *) echo "unknown arg: $1" >&2; exit 1;;
  esac
done

if [[ -z "$REMOTE" ]]; then
  REMOTE="git@github.com:${ORG}/${REPO}.git"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$(cd "${SCRIPT_DIR}/.." && pwd)"
TMP="$(mktemp -d)/${REPO}"

echo "[create-repo] src=${SRC}"
echo "[create-repo] dst=${TMP}"
echo "[create-repo] remote=${REMOTE} branch=${BRANCH}"
echo "[create-repo] make sure 'gh repo create ${ORG}/${REPO}' already ran (or create it in GitHub UI)."

mkdir -p "$TMP"
cp -r "${SRC}/." "$TMP/"
cd "$TMP"
git init -b "$BRANCH"
git add .
git commit -m "feat: landing pages repo (ENG-4705 OAB LPs + Vercel static pipeline)"
git remote add origin "$REMOTE"
echo "[create-repo] ready. Review with: cd $TMP && git status"
echo "[create-repo] push with: cd $TMP && git push -u origin $BRANCH"
