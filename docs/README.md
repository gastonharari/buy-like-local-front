# Concierge landing — reference docs

Full reference for the public marketing site at **concierge.com.ar**. `CLAUDE.md` at the repo root
is the short always-loaded file (traps + conventions); everything long lives here and is read on
demand.

Repo trap: this directory is `front/`, the GitHub repo is **`gastonharari/buy-like-local-front`**.
They don't match — and the *other* concierge repo has the inverse trap.

## Index

| Doc | Read it when you need |
|---|---|
| [pages.md](pages.md) | routes, page sections, components, i18n |
| [design-system.md](design-system.md) | tokens, CTA hierarchy, the iOS rules |
| [referrals.md](referrals.md) | `/r/[code]`, the KV click outbox, the CRM handoff |
| [operations.md](operations.md) | env vars, analytics, CI, Vercel deploy |

The CRM this site hands off to is a **separate repo** (`concierge-crm`, directory
`../buy-like-local/`). Anything about the backend API, the chat widget's server side, or the
referral data model lives in its `docs/`.

## Docs move with the code

**Every PR that changes product code updates the matching doc in the same PR.** A `docs-coverage`
job comments on the PR when one looks missing. It never fails the build. Escape hatch: the
`skip-docs` label or `[skip-docs]` in the PR title.

| If you changed | Update |
|---|---|
| `app/r/**`, `lib/kv.ts`, `app/api/r/**` | [referrals.md](referrals.md) |
| `app/globals.css` | [design-system.md](design-system.md) |
| `app/layout.tsx`, `lib/analytics.ts`, `.github/**` | [operations.md](operations.md) |
| `app/**`, `components/**`, `lib/translations.ts` | [pages.md](pages.md) |

Touching any file under `docs/` satisfies the check — the mapping says *which* file is most likely
stale, it isn't enforced literally.

Note that `design-system-SKILL.md` at the repo root is a **Claude skill**, loaded automatically for
UI work. It is the canonical token reference; [design-system.md](design-system.md) points at it
rather than duplicating it. Change tokens in `globals.css` → update the skill → the doc only needs
touching if a *rule* changed.
