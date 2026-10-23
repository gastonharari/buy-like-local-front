#!/usr/bin/env bash
# Offline tests for scripts/palmera-deploy.sh against a stubbed `gh`, a bare
# local "origin" and a throwaway clone (no network, no token).
# Run by hand:  bash scripts/palmera-deploy.test.sh
set -euo pipefail

SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/palmera-deploy.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

pass=0; fail=0
check() { # name expected actual
  if [ "$2" == "$3" ]; then pass=$((pass + 1)); else
    fail=$((fail + 1)); printf 'FAIL: %s\n--- expected\n%s\n--- actual\n%s\n' "$1" "$2" "$3"
  fi
}
contains() { # name needle haystack
  if [[ "$3" == *"$2"* ]]; then pass=$((pass + 1)); else
    fail=$((fail + 1)); printf 'FAIL: %s\n--- missing\n%s\n--- in\n%s\n' "$1" "$2" "$3"
  fi
}

# gh stub: logs every call; `pr list` answers with $GH_STUB_OPEN_PR (empty = none).
mkdir -p "$TMP/bin"
cat > "$TMP/bin/gh" <<'STUB'
#!/usr/bin/env bash
echo "gh $*" >> "$GH_LOG"
if [ "$1 $2" == "pr list" ]; then printf '%s' "${GH_STUB_OPEN_PR:-}"; fi
STUB
chmod +x "$TMP/bin/gh"
export PATH="$TMP/bin:$PATH" GH_LOG="$TMP/gh.log"
export PALMERA_AUTHOR_NAME="Gaston Harari" PALMERA_AUTHOR_EMAIL="gaston@example.com"
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1

# origin with one merge on main, committed at a fixed date (the "merge time").
git init -q --bare -b main "$TMP/origin.git"
git clone -q "$TMP/origin.git" "$TMP/seed" 2>/dev/null
(
  cd "$TMP/seed"
  echo hi > README.md && git add README.md
  GIT_COMMITTER_DATE="2026-10-22T21:15:30-03:00" \
    git -c user.name=uvolman -c user.email=u@example.com commit -q -m "feat: algo (#1)"
  git push -q origin main
)
SHA="$(git -C "$TMP/seed" rev-parse HEAD)"

run() { # actor -> runs the script in a fresh clone, prints its output
  rm -rf "$TMP/work" && git clone -q "$TMP/origin.git" "$TMP/work" 2>/dev/null
  : > "$GH_LOG"
  (cd "$TMP/work" && ACTOR="$1" SHA="$SHA" bash "$SCRIPT")
}

# ── someone else merged: nothing recorded ────────────────────────────────────
out="$(run gastonharari)"
contains "other actor is skipped" "nothing to record" "$out"
check "other actor: no gh calls" "" "$(cat "$GH_LOG")"
check "other actor: no branch pushed" "" "$(git -C "$TMP/origin.git" branch --list chore/palmera-deploy)"

# ── uvolman merged, no open PR: branch pushed + PR created ───────────────────
run uvolman >/dev/null
check "file records hash and UTC merge date" \
  "$(printf 'commit=%s\ndate=2026-10-23T00:15:30Z' "$SHA")" \
  "$(git -C "$TMP/origin.git" show chore/palmera-deploy:palmera.deploy)"
check "commit authored by the repo owner" "Gaston Harari <gaston@example.com>" \
  "$(git -C "$TMP/origin.git" log -1 --format='%an <%ae>' chore/palmera-deploy)"
check "branch sits on top of main" "$SHA" \
  "$(git -C "$TMP/origin.git" rev-parse chore/palmera-deploy~1)"
contains "PR created against main" "gh pr create --head chore/palmera-deploy --base main --title chore: palmera.deploy ${SHA:0:7}" "$(cat "$GH_LOG")"
check "main itself untouched" "$SHA" "$(git -C "$TMP/origin.git" rev-parse main)"

# ── uvolman merged again while a palmera PR is open: PR edited, not duplicated
GH_STUB_OPEN_PR=42 run uvolman >/dev/null
contains "open PR is edited" "gh pr edit 42 --title chore: palmera.deploy ${SHA:0:7}" "$(cat "$GH_LOG")"
check "no second PR" "" "$(grep 'pr create' "$GH_LOG" || true)"

# ── main already records this commit: no-op ──────────────────────────────────
(
  cd "$TMP/seed" && git pull -q origin main 2>/dev/null
  git fetch -q origin chore/palmera-deploy && git checkout -q FETCH_HEAD -- palmera.deploy
  git -c user.name=g -c user.email=g@example.com commit -q -m "chore: palmera.deploy" && git push -q origin main
)
out="$(run uvolman)"
contains "already recorded is a no-op" "nothing to do" "$out"
check "no-op: no gh calls" "" "$(cat "$GH_LOG")"

echo "palmera-deploy: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
