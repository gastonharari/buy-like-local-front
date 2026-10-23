#!/usr/bin/env bash
# Records a deploy merged by $PALMERA_ACTOR in palmera.deploy (commit hash +
# merge date, UTC) and opens or refreshes ONE pull request with that change.
# Same script as in concierge-crm and buy-like-local. main is protected (PRs
# only, no bypass), so it can't be pushed straight to main from Actions.
# The branch is pushed and the PR opened with $GH_TOKEN, a
# token of the repo owner: the PR shows up under their name and, unlike
# GITHUB_TOKEN, the push triggers CI on it.
#
# Env:
#   ACTOR          who triggered the push (github.actor = who merged the PR)
#   PALMERA_ACTOR  only this login's merges are recorded (default: uvolman)
#   SHA            the merged commit (github.sha)
#   BASE_REF       branch the PR targets (default: main)
#   GH_TOKEN       read by gh to create/edit the PR
#   PALMERA_AUTHOR_NAME / PALMERA_AUTHOR_EMAIL  commit identity
# Run from the root of a checkout with full history (fetch-depth: 0) whose
# `origin` remote already authenticates as the PR author.
set -euo pipefail

ACTOR="${ACTOR:?}"
SHA="${SHA:?}"
PALMERA_ACTOR="${PALMERA_ACTOR:-uvolman}"
BASE_REF="${BASE_REF:-main}"
FILE=palmera.deploy
BRANCH=chore/palmera-deploy

if [ "$ACTOR" != "$PALMERA_ACTOR" ]; then
  echo "palmera.deploy: merged by $ACTOR, not $PALMERA_ACTOR, nothing to record."
  exit 0
fi

# The merge commit's committer date is the moment the PR was merged.
date="$(TZ=UTC git log -1 --format=%cd --date=format-local:%Y-%m-%dT%H:%M:%SZ "$SHA")"

# Start from the latest base so the PR is always up to date (strict checks).
git fetch -q origin "$BASE_REF"
git checkout -q -B "$BRANCH" FETCH_HEAD
printf 'commit=%s\ndate=%s\n' "$SHA" "$date" > "$FILE"
git add "$FILE"
if git diff --cached --quiet; then
  echo "palmera.deploy already records $SHA on $BASE_REF, nothing to do."
  exit 0
fi
git -c user.name="${PALMERA_AUTHOR_NAME:?}" -c user.email="${PALMERA_AUTHOR_EMAIL:?}" \
  commit -q -m "chore: palmera.deploy ${SHA:0:7}"
# One PR at a time: a newer deploy rewrites the branch, so the open PR always
# carries the latest deploy.
git push -q --force origin "$BRANCH"

title="chore: palmera.deploy ${SHA:0:7}"
body="Registra en \`palmera.deploy\` el deploy de ${SHA:0:7}, mergeado por \`${PALMERA_ACTOR}\` el ${date}.

\`\`\`
$(cat "$FILE")
\`\`\`

Lo abrió CD solo. No deploya nada: solo cambia \`palmera.deploy\`."

existing="$(gh pr list --head "$BRANCH" --base "$BASE_REF" --state open --json number --jq '.[0].number // empty')"
if [ -n "$existing" ]; then
  gh pr edit "$existing" --title "$title" --body "$body"
  echo "palmera.deploy: updated PR #$existing."
else
  gh pr create --head "$BRANCH" --base "$BASE_REF" --title "$title" --body "$body"
fi
