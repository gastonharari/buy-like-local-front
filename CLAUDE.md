# Concierge landing — working notes

Public marketing site for Concierge (concierge.com.ar). Multilingual EN/ES/PT, Next.js 15 App
Router, always dark. Hands visitors off to WhatsApp or the CRM's web chat.

> Directory `front/`, GitHub repo **`buy-like-local-front`**. They don't match.

## Docs

`docs/` is the full reference — read the relevant file instead of re-reading the code.

| Doc | For |
|---|---|
| [docs/pages.md](docs/pages.md) | routes, landing sections, components, i18n, copy scope |
| [docs/design-system.md](docs/design-system.md) | token layers, CTA hierarchy, iOS rules |
| [docs/referrals.md](docs/referrals.md) | `/r/[code]`, the KV click outbox, the CRM contract |
| [docs/operations.md](docs/operations.md) | env vars, analytics, SEO, CI, Vercel deploy |

`design-system-SKILL.md` is the canonical token reference and auto-loads for UI work. The CRM is a
**separate repo** (`../buy-like-local/`) — its API, data model and referral rules are documented
there.

**Docs move with the code.** Any PR changing product code updates the matching `docs/` file in the
same PR. The `docs-coverage` CI job comments when one looks missing — it never blocks. Mapping
table: [docs/README.md](docs/README.md).

## Local dev

```bash
npm run dev   # port 3001 — the CRM frontend owns 3000
```

Works with **no env vars**: the chat widget falls back to the prod CRM URL, KV becomes a no-op, and
`/r/[code]` renders its generic fallback. Only the referral path needs configuration.

## Stack note

This repo is on **Next 15.5.x**. The CRM is on **Next 16**. They are *not* pinned together — don't
"align" them casually, and don't let `npm audit fix --force` move either one.

## Pitfalls

- **iOS scroll rule.** Never leave a fixed-position overlay in the DOM while hidden. iOS Safari
  ignores `pointer-events: none` on compositing layers created by `transition`, `transform` or
  `willChange`, and the invisible element blocks touch scrolling. Use conditional rendering, or
  `visibility: hidden`. Avoid `willChange: "transform"` on fixed elements.
- **`min-h-dvh`, not `min-h-screen`** for full-height sections — mobile Safari's `vh` excludes the
  URL bar and overflows.
- **The chat iframe is cross-origin** and cannot read this site's `localStorage`. Language reaches
  it only via `postMessage({type:"set-lang", lang})`, sent on load *and* on every change.
- **`CRM_API_URL` / `INTERNAL_API_TOKEN` are server-only** (no `NEXT_PUBLIC_`) and mandatory for
  referrals. Missing → `/r/[code]` silently renders the generic page and `/api/r/start-whatsapp`
  500s. `CRM_API_URL` takes **no trailing slash**.
- **`/wa-connect` posts through `/api/wa-onboarding`**, a route handler (same shape as
  `/api/r/start-whatsapp`) — not directly from the browser to the CRM. It reuses the existing
  server-only `CRM_API_URL` / `INTERNAL_API_TOKEN` (already mandatory for referrals), so there's no
  operator-pasted secret and no CRM CORS exception. `NEXT_PUBLIC_WA_CONFIG_ID` (Meta Embedded
  Signup configuration id) is still public and overridable with `?config_id=`. **The CRM's
  `/api/internal/whatsapp/onboarding` route itself still needs concierge-crm PR #62 merged and
  deployed before this works in any environment** — nothing here enforces that ordering.
- **The KV click outbox has no consumer.** Comments in `app/r/[code]/page.tsx` reference
  `reconcile-clicks` / `reconcile-partners` jobs that **don't exist**. Failed click posts sit in KV
  until the 30d TTL expires. See [docs/referrals.md](docs/referrals.md).
- **Can't verify prod from here.** Vercel SSO + PIN and Bot Protection block datacenter IPs, so
  the deployed site isn't visible to an agent. Verify locally, or hand the commands to a human.

## Conventions

- **Proceed autonomously.** No confirmation needed for local changes.
- No light mode. `:root` tokens *are* the dark theme; no `class="dark"` is applied anywhere.
- **Never hardcode a hex** — go through the Tailwind semantic classes.
- **WhatsApp green `#25D366` is only for the WhatsApp CTA.** Never a general accent, never in the
  CRM. Brand teal is `#112E2F` / `#1e3637`.
- **Dual CTA hierarchy**: primary = solid green (`size="lg"`), secondary = outlined sand
  (`size="default"`). The size gap is part of the hierarchy.
- **Testimonials stay in English** — they're foreign-tourist quotes, and they're deliberately not
  in `LangConfig`. Don't translate them.
- `bg-card/30` on alternating sections is intentional warmth, not a leftover.
- Adding copy means adding it to `LangConfig` **and** all three languages in `lib/translations.ts`.

## Brand scope — check before writing copy

Canonical: [`../BRAND.md`](../BRAND.md), mirrored in the `cmo-concierge` skill.

- ✅ **Physical products** (we buy them for you) and **tickets to shows/concerts**, sold-out included.
- ❌ **Restaurant/bar reservations** ("te conseguimos mesa") — no. Also no general experience
  fixing, food delivery, currency exchange, or DNI/bank/migration help.
- The barrier we sell against is the local **account/identity**, not only the foreign card.
