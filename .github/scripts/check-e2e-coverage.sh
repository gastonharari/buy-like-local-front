#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# e2e coverage gate — WARN ONLY. Never fails CI, never blocks a merge.
#
# Automates the project convention "new features ship with their own e2e
# tests": when a PR to main changes product code, it nudges the author to also
# add/update an e2e test. It does NOT run tests and does NOT judge the test's
# quality — it only checks that *some* e2e file changed alongside the code.
#
# Contract: ALWAYS exits 0. Output = sticky PR comment + ::warning:: + summary.
# Portable down to bash 3.2 (no `mapfile`, no arrays) so it dry-runs on macOS.
#
# Env in: BASE_SHA HEAD_SHA PR_NUMBER PR_TITLE SKIP_LABEL GH_TOKEN
#         GITHUB_REPOSITORY GITHUB_STEP_SUMMARY (last two: runner-provided)
# ─────────────────────────────────────────────────────────────────────────────
set -uo pipefail   # NOT `set -e`: a failing gh call must never abort the gate.

# ╔═══ Per-repo config — the ONLY part that differs between the two repos ═════╗
COMMENT_MARKER="<!-- e2e-coverage-gate -->"
E2E_DESC="e2e/**"

# EXEMPT: a change here never triggers the gate (checked FIRST — overrides
# is_product, so e.g. a *.css file under app/ does not count as product).
is_exempt() {
  case "$1" in
    *.md|*.css|*.svg)                 return 0 ;;
    .github/*)                        return 0 ;;
    *package.json|*package-lock.json) return 0 ;;
    public/*|assets/*|styles/*)       return 0 ;;
    *.docx)                           return 0 ;;
    next.config.mjs|postcss.config.mjs|components.json|tsconfig.json|next-env.d.ts|playwright.config.ts) return 0 ;;
    *) return 1 ;;
  esac
}

# E2E: a changed file here SATISFIES the gate.
is_e2e() {
  case "$1" in
    e2e/*) return 0 ;;
    *) return 1 ;;
  esac
}

# PRODUCT: a change here REQUIRES an e2e file to also change.
is_product() {
  case "$1" in
    app/*|components/*|lib/*|hooks/*) return 0 ;;
    *) return 1 ;;
  esac
}
# ╚═══ End per-repo config ═══════════════════════════════════════════════════╝

# ── 1. Guard ────────────────────────────────────────────────────────────────
if [ -z "${BASE_SHA:-}" ] || [ -z "${HEAD_SHA:-}" ]; then
  echo "BASE_SHA/HEAD_SHA unset — nothing to gate."; exit 0
fi

# ── 2. Classify the PR's own changed files ──────────────────────────────────
# Three-dot diff (BASE...HEAD) = changes vs the merge base, i.e. only the PR's
# own commits — commits that landed on main afterwards do not count.
product_list=""; product_count=0; e2e_count=0; total=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  total=$((total + 1))
  is_exempt "$f" && continue
  if is_e2e "$f"; then e2e_count=$((e2e_count + 1)); continue; fi
  if is_product "$f"; then
    product_list="${product_list}- \`${f}\`
"
    product_count=$((product_count + 1))
  fi
done < <(git diff --name-only "${BASE_SHA}...${HEAD_SHA}" 2>/dev/null || true)

if [ "$total" -eq 0 ]; then
  echo "Empty PR diff — nothing to gate."; exit 0
fi
echo "PR diff: ${total} file(s) — product: ${product_count}, e2e: ${e2e_count}"

# ── 3. Escape hatch ─────────────────────────────────────────────────────────
skip_reason=""
case "${PR_TITLE:-}" in *"[skip-e2e]"*) skip_reason="\`[skip-e2e]\` en el título" ;; esac
[ "${SKIP_LABEL:-false}" = "true" ] && skip_reason="el label \`skip-e2e\`"

# ── 4. Decide ───────────────────────────────────────────────────────────────
needs_warning=false
if [ "$product_count" -gt 0 ] && [ "$e2e_count" -eq 0 ] && [ -z "$skip_reason" ]; then
  needs_warning=true
fi

# ── 5. Build the comment body (WARN or RESOLVED — both carry the marker) ─────
body="$(mktemp)"
if [ "$needs_warning" = true ]; then
  {
    echo "$COMMENT_MARKER"
    echo "### ⚠️ Cobertura e2e — este PR no agrega tests e2e"
    echo
    echo "Este PR cambia **código de producto** pero no agrega ni actualiza ningún test e2e en \`${E2E_DESC}\`."
    echo
    echo "Es una **advertencia, no un bloqueo** — CI sigue verde y podés mergear. Pero la convención del repo es que cada feature viaja con su test e2e."
    echo
    echo "<details><summary>Archivos de producto sin cobertura e2e (${product_count})</summary>"
    echo
    printf '%s' "$product_list"
    echo
    echo "</details>"
    echo
    echo "**Para limpiar este aviso:** agregá/actualizá un test en \`${E2E_DESC}\`, o poné el label \`skip-e2e\`, o \`[skip-e2e]\` en el título del PR."
    echo
    echo "_Se re-evalúa en cada push; este comentario se actualiza solo._"
  } > "$body"
else
  {
    echo "$COMMENT_MARKER"
    echo "### ✅ Cobertura e2e — OK"
    echo
    if [ -n "$skip_reason" ]; then
      echo "Chequeo de cobertura e2e salteado vía ${skip_reason}."
    elif [ "$product_count" -eq 0 ]; then
      echo "Este PR no cambia código de producto — no requiere test e2e."
    else
      echo "Este PR actualiza tests e2e en \`${E2E_DESC}\` (${e2e_count} archivo/s). ¡Gracias!"
    fi
  } > "$body"
fi

# ── 6. Annotation + step summary (always visible, need no token) ─────────────
if [ "$needs_warning" = true ]; then
  echo "::warning title=Cobertura e2e::El PR cambia código de producto sin tests e2e en ${E2E_DESC}. Solo aviso — CI sigue verde. Ver el comentario del PR."
fi
[ -n "${GITHUB_STEP_SUMMARY:-}" ] && tail -n +2 "$body" >> "$GITHUB_STEP_SUMMARY"

# ── 7. Sticky PR comment — best-effort, never aborts the gate ────────────────
if [ -n "${PR_NUMBER:-}" ] && [ -n "${GH_TOKEN:-}" ]; then
  repo="${GITHUB_REPOSITORY:-}"
  existing="$(gh api "repos/${repo}/issues/${PR_NUMBER}/comments" --paginate \
    --jq ".[] | select(.body | contains(\"${COMMENT_MARKER}\")) | .id" 2>/dev/null \
    | head -n1 || true)"
  if [ -n "$existing" ]; then
    jq -n --rawfile b "$body" '{body: $b}' \
      | gh api -X PATCH "repos/${repo}/issues/comments/${existing}" --input - >/dev/null 2>&1 \
      && echo "Sticky comment updated." || echo "Comment update failed (non-fatal)."
  elif [ "$needs_warning" = true ]; then
    jq -n --rawfile b "$body" '{body: $b}' \
      | gh api -X POST "repos/${repo}/issues/${PR_NUMBER}/comments" --input - >/dev/null 2>&1 \
      && echo "Sticky warning comment created." || echo "Comment create failed (non-fatal)."
  else
    echo "Clean PR, no prior comment — nothing to post."
  fi
else
  echo "No PR_NUMBER/GH_TOKEN — skipping comment (annotation + summary still emitted)."
fi

rm -f "$body"
exit 0
