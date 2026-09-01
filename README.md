# Concierge — landing page

The public marketing site at **[concierge.com.ar](https://www.concierge.com.ar)**.

Concierge is a personal shopper for foreign tourists in Buenos Aires: local systems reject foreign
cards and accounts, so we buy, pay and get things on the traveler's behalf, as locals. This site
sells that and hands visitors off to WhatsApp or a web chat — both of which land in the
[CRM](../buy-like-local/) (repo `concierge-crm`), where an operator and an AI agent take over.

> Directory is `front/`, GitHub repo is **`buy-like-local-front`**. They don't match.

Multilingual (EN/ES/PT), always dark, no light mode.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15, App Router |
| Styling | Tailwind CSS v4 + shadcn/Radix |
| Fonts | Inter (body), Poppins (headings), Geist Mono |
| Analytics | GA4 + Meta Pixel + Vercel Analytics, behind consent mode |
| Edge state | Vercel KV (optional — no-op when unconfigured) |
| Hosting | Vercel |

This repo is on **Next 15**; the CRM is on **Next 16**. They're not pinned together.

## Running it

```bash
npm install
npm run dev     # http://localhost:3001
```

Port 3001, because the CRM frontend owns 3000 and they often run together. No env vars are needed
for the main landing — only the referral flow requires configuration, see
[docs/operations.md](docs/operations.md).

```bash
npm run build
npm run lint
npx playwright test    # e2e/landing-smoke.spec.ts
```

## Routes

| Route | What |
|---|---|
| `/` | the landing — hero, how it works, services, testimonials, about, FAQ, final CTA |
| `/r/[code]` | partner referral landing, co-branded, logs the click and hands off to WhatsApp |
| `/payment-success` | where PayPal returns the traveler after paying |
| `/privacy` | privacy policy (English) — Meta App Review's Privacy Policy URL; `#data-deletion` is the Data Deletion URL |
| `/api/r/start-whatsapp` | server-to-server hop into the CRM to attribute the referral |

## Layout

```
app/
  page.tsx                    the landing (one client component)
  layout.tsx                  fonts, metadata, JSON-LD, GA4, Meta Pixel, widget, cookie banner
  globals.css                 brand design tokens
  r/[code]/                   referral landing + its client component
  privacy/                    privacy policy (static, English) — Meta App Review URLs
  api/r/start-whatsapp/       CRM handoff
components/
  chat-widget.tsx             floating bubble → CRM chat in an iframe
  cookie-banner.tsx           consent, drives GA4 consent mode
  ui/                         shadcn primitives
lib/
  translations.ts             all copy, EN/ES/PT
  kv.ts                       Vercel KV client (no-op when unconfigured)
  analytics.ts                trackEvent helper
docs/                         full reference — see below
design-system-SKILL.md        the design authority (a Claude skill)
```

## Documentation

`CLAUDE.md` holds conventions and traps. Everything else is in **[`docs/`](docs/)**:

| Doc | For |
|---|---|
| [pages.md](docs/pages.md) | routes, sections, components, i18n, copy scope |
| [design-system.md](docs/design-system.md) | tokens, CTA hierarchy, the iOS rules |
| [referrals.md](docs/referrals.md) | `/r/[code]`, the KV click outbox, the CRM contract |
| [operations.md](docs/operations.md) | env vars, analytics, SEO, CI, deploy |

**Every PR that changes product code updates the matching doc in the same PR.** A `docs-coverage`
CI job comments when one looks missing; it never blocks the merge.

## Conventions

- No light mode. The site is always dark; `:root` tokens *are* the dark theme.
- **Never hardcode a hex** — use the Tailwind semantic classes. Tokens live in `app/globals.css`.
- WhatsApp green `#25D366` is for the WhatsApp CTA only, never as a general brand colour.
- Testimonials stay in English — they're quotes from foreign tourists. Don't translate them.
- Never leave a fixed-position overlay in the DOM while hidden; iOS Safari ignores
  `pointer-events: none` on composited layers and it eats touch scrolling.
- Brand scope (what we can and can't promise) is in [`../BRAND.md`](../BRAND.md). Products and
  show/concert tickets are in scope; **restaurant reservations are not**.
