# Pages, components and i18n

Next.js 15 App Router. Six routes, one of them an API route. Always dark, no theme toggle.

> Stack note: this repo is on **Next 15**, while the CRM is on **Next 16**. They are not pinned
> together — don't "align" them casually, and don't let `npm audit fix --force` move either.

## Routes

| Route | Type | What |
|---|---|---|
| `/` | client page | the landing — hero, how it works, services, testimonials, about, FAQ, final CTA, footer |
| `/r/[code]` | server page, `force-dynamic` | partner referral landing. See [referrals.md](referrals.md). |
| `/payment-success` | page | where PayPal returns the traveler after paying |
| `/privacy` | static server page, English only | privacy policy. Required by **Meta App Review** for the WhatsApp app ("Buy Like Local"): the app's Privacy Policy URL is `/privacy` and its Data Deletion URL is `/privacy#data-deletion` — keep that anchor id stable. Legal copy is deliberately outside the EN/ES/PT i18n (one canonical version). Linked from the landing footer nav. |
| `/api/r/start-whatsapp` | route handler, `runtime: nodejs` | server-to-server hop into the CRM |
| `/wa-connect` | server shell + client component, English only | **internal tool**, `noindex, nofollow`, not linked from anywhere. Launches Meta's WhatsApp **Embedded Signup v4 (Coexistence, `featureType: whatsapp_business_app_onboarding`)** so the business admin can connect the company WhatsApp number — the one in the WhatsApp Business app — to Cloud API. Configuration id from `NEXT_PUBLIC_WA_CONFIG_ID` (or `?config_id=…` to override); the operator pastes the CRM's internal API token (memory only). When the popup posts `FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING`, the `FB.login` authorization `code` (30 s TTL) plus `waba_id`/`phone_number_id` are POSTed straight from the browser to `NEXT_PUBLIC_CRM_API_URL` + `/api/internal/whatsapp/onboarding` (`X-Internal-Token`), which subscribes the WABA and requests the contacts + history sync. A "Re-run sync" button repeats the call without a code (system-user token on the backend). Like `/privacy`, its copy is deliberately outside the EN/ES/PT i18n. |

`/r/[code]` sets `dynamic = "force-dynamic"` and `revalidate = 0` deliberately — the page must
render per-request to log the click and read live partner data.

## The landing (`app/page.tsx`)

One client component. Language state lives here and is threaded into every section.

Sections, in order — each carries a `data-section` or `id` used for scroll tracking:

`hero` → `how-it-works` → `services` → `testimonials` → `about` → `faq` → `final-cta` → footer.

Layout details that exist for a reason:

- The hero uses **`min-h-dvh`, not `min-h-screen`** — mobile Safari sizes `vh` against the
  viewport *without* the URL bar, so `min-h-screen` overflows there.
- Mobile `py-10` / `text-4xl` / `text-2xl` for h1 and echo; desktop `md:py-20` / `md:text-7xl` /
  `md:text-5xl`.
- `bg-card/30` on alternating sections gives subtle teal warmth over the obsidian background.
  Intentional, not a leftover.
- `overflow-clip` on hero and final CTA contains the decorative blur elements.

### Scroll instrumentation

Two independent trackers, both firing GA4 events via `trackEvent`:

- **Section views** — an `IntersectionObserver` over the section ids, deduped by a
  `useRef(new Set())` so each section reports once per page load.
- **Scroll depth** — percentage thresholds, deduped the same way.

FAQ accordion expansion also fires an event, carrying the question text truncated to 100 chars.

The dedupe sets are refs, not state, on purpose: re-rendering on every scroll event would be
disastrous.

## Components

| Component | Notes |
|---|---|
| `chat-widget.tsx` | floating chat bubble → iframe to the CRM. See below. |
| `cookie-banner.tsx` | consent; drives GA4 consent mode. See [operations.md](operations.md). |
| `prevent-pull-to-refresh.tsx` | suppresses the mobile pull-to-refresh gesture |
| `theme-provider.tsx` | present, but the site is always dark — no toggle is exposed |
| `ads/AdSquare.tsx`, `ads/AdVertical.tsx` | ad-creative render targets, not part of the live page |
| `ui/**` | shadcn/Radix primitives, mostly untouched |

### The chat widget

`components/chat-widget.tsx` embeds `https://concierge-crm.vercel.app/chat` in a 420px-wide iframe
popup (override with `NEXT_PUBLIC_CHAT_URL`; the CRM URL is a hardcoded fallback).

Every one of these is load-bearing, and most were bug fixes:

- **Scroll-based reveal** — hidden (`opacity: 0`, `pointerEvents: none`) until the user scrolls
  past 70% of viewport height, then a 300ms ease-out.
- **Backdrop is conditionally rendered** (`{open && …}`), not just hidden. A full-viewport
  `fixed inset-0` element left in the DOM blocks touch scrolling on iOS Safari **even with
  `pointer-events: none`**, because the compositor doesn't honour it on layers created by
  `transition` / `transform` / `willChange`.
- **Popup uses `visibility: hidden`** when closed, not only `opacity`/`pointer-events` — iOS
  respects `visibility` for hit-testing far more reliably.
- **Body scroll lock** — `document.body.style.overflow = "hidden"` while open, restored on close.
- **Language sync** — the iframe gets `postMessage({type:"set-lang", lang})` on load and on every
  language change. It's on a different origin, so it cannot read this site's `localStorage`.
- Page CTAs open it with `window.dispatchEvent(new CustomEvent("open-chat"))`, which also forces
  `revealed = true` so a CTA above the fold still works.
- Iframe height: `min(540px, calc(100dvh - 210px))`, floor 300px.

**The iOS rule, generalised:** never leave a fixed-position overlay in the DOM while hidden. Use
conditional rendering or `visibility: hidden`, and avoid `willChange: "transform"` on fixed
elements.

## i18n

`lib/translations.ts` exports `translations: Record<Lang, LangConfig>` with
`type Lang = "en" | "es" | "pt"`. No i18n library — a plain typed object.

Detection order: `localStorage("concierge-lang")` → `navigator.language` → **`en`**.

`LangConfig` covers `waLink`, `header.cta`, `hero{h1,h1Echo,subtitle,cta,chatCta}`,
`howItWorks{title,steps[]}`, `services{title,items[]}`, `testimonials.title`,
`about{title,body,contact}`, `faq{title,items[{q,a}]}`, `finalCta{h2,subtitle,cta,chatCta}`,
`footer{tagline,linkLabels[],legal}`.

Two things to know:

- **`waLink` is per-language** — each carries its own URL-encoded pre-filled WhatsApp message. When
  you change the business number, change it in all three.
- **Testimonials are always English** and are *not* in `LangConfig`. They're quotes from foreign
  tourists; translating them would be fabricating them. Don't add them to the translation object.

Adding a field means adding it to `LangConfig` and to all three language objects — TypeScript will
tell you if you miss one, which is the whole reason it's a typed record.

## Copy constraints

The brand's scope rules are in `../BRAND.md` (canonical) and mirrored in the `cmo-concierge`
skill. The two that bite when writing landing copy:

- ✅ In scope: **physical products** (we buy them for you) and **tickets to shows/concerts**,
  including sold-out ones.
- ❌ Out of scope: **restaurant/bar reservations** ("te conseguimos mesa" — no), general "any
  experience" fixing, food delivery, currency exchange, DNI/bank/migration help.

The real barrier being sold against is the local **account/identity**, not just the foreign card.
