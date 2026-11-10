# Pages, components and i18n

Next.js 15 App Router. Always dark, no theme toggle.

> Stack note: this repo is on **Next 15**, while the CRM is on **Next 16**. They are not pinned
> together — don't "align" them casually, and don't let `npm audit fix --force` move either.

## Routes

| Route | Type | What |
|---|---|---|
| `/` | client page | the landing — hero, how it works, services, testimonials, about, FAQ, final CTA, footer |
| `/r/[code]` | server page, `force-dynamic` | partner referral landing. See [referrals.md](referrals.md). |
| `/payment-success` | page | where PayPal returns the traveler after paying |
| `/track/[id]` | static server page (`generateStaticParams`, `dynamicParams = false`), English only, `noindex, nofollow` | order tracking for a client. Tracking numbers (UUIDs) and their current step live in `lib/tracking.ts`; steps are Payment received → In preparation → Received → Shipped to customer → Received by customer; every reached step is ticked, the current one included (it also gets a ring and bold label). To move an order, change its `current` index and redeploy. Unknown ids 404. Not linked from anywhere — the link is sent to the client. |
| `/privacy` | static server page, English only | privacy policy. Required by **Meta App Review** for the WhatsApp app ("Buy Like Local"): the app's Privacy Policy URL is `/privacy` and its Data Deletion URL is `/privacy#data-deletion` — keep that anchor id stable. Legal copy is deliberately outside the EN/ES/PT i18n (one canonical version). Linked from the landing footer nav. |
| `/api/r/start-whatsapp` | route handler, `runtime: nodejs` | server-to-server hop into the CRM |
| `/wa-connect` | server shell + client component, English only | **internal tool**, `noindex, nofollow`, not linked from anywhere. Launches Meta's WhatsApp **Embedded Signup v2 (Coexistence, `featureType: whatsapp_business_app_onboarding`)** — Meta retires the v2 launch shape on 2026-10-15, so this needs a verified migration to v4 before then — so the business admin can connect the company WhatsApp number — the one in the WhatsApp Business app — to Cloud API. Configuration id from `NEXT_PUBLIC_WA_CONFIG_ID` (or `?config_id=…` to override). When the popup posts `FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING`, the `FB.login` authorization `code` (30 s TTL) plus `waba_id`/`phone_number_id` are POSTed to this repo's own `/api/wa-onboarding`, which forwards them server-side (`CRM_API_URL`/`INTERNAL_API_TOKEN`, already required for referrals) to the CRM's `POST /api/internal/whatsapp/onboarding`, which subscribes the WABA and requests the contacts + history sync. A "Re-run sync" button repeats the call without a code (system-user token on the backend). Like `/privacy`, its copy is deliberately outside the EN/ES/PT i18n. |
| `/api/wa-onboarding` | route handler, `runtime: nodejs` | server-to-server hop into the CRM for `/wa-connect`'s onboarding POST — same shape as `/api/r/start-whatsapp`, reuses `CRM_API_URL`/`INTERNAL_API_TOKEN` |
| `/en/online-shopping-in-argentina`, `/pt/compras-online-na-argentina`, `/es/compras-online-en-argentina` | static server page | guide: online shopping in Argentina, for people who don't know MercadoLibre yet. See [Guide pages](#guide-pages-and-faq-hubs). |
| `/en/buy-on-mercadolibre-as-a-foreigner`, `/pt/comprar-no-mercadolibre-sendo-estrangeiro`, `/es/comprar-en-mercadolibre-siendo-extranjero` | static server page | guide: MercadoLibre without a DNI |
| `/en/mercado-pago-for-tourists`, `/pt/mercado-pago-para-turistas`, `/es/mercado-pago-para-turistas` | **308 redirect** (`redirects()` in `next.config.mjs`) | removed guides → the MercadoLibre guide of the same language, query string kept. See [No Mercado Pago](#no-mercado-pago). |
| `/en/ticketek-passline-without-dni`, `/pt/ticketek-passline-sem-dni`, `/es/ticketek-passline-sin-dni` | static server page | guide: show tickets without a DNI |
| `/en/faq`, `/pt/faq`, `/es/faq` | static server page | FAQ hubs, 11 questions each, with FAQPage JSON-LD |
| `/api/clicks` | route handler, `runtime: nodejs` | paid-click code proxy into the CRM (`/api/internal/ad-clicks`). See [whatsapp-ref.md](whatsapp-ref.md). |
| `/robots.txt`, `/sitemap.xml` | `app/robots.ts`, `app/sitemap.ts` | crawler rules and the page list. See [operations.md](operations.md#seo). |

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

### WhatsApp links and FAQ schema

- The four WhatsApp links use `useWhatsAppLink(t.waLink)`: the hand-written pre-filled message plus
  the visitor's `(ref XX)` — see [whatsapp-ref.md](whatsapp-ref.md).
- The landing renders its own **FAQPage JSON-LD**, built from `translations.en.faq.items` (English
  is what the page server-renders), next to the FAQ section. It used to be a hand-written copy in
  `app/layout.tsx` that had drifted from the visible FAQ and was printed on every route.
- **The FAQ names no payment method** (decision of 2026-11-09, `campaigns/2026-11-08/decisiones.md`
  #6): "How does payment work?" says we send a payment link in the chat and you always see the
  exact total before paying — in all three languages, no PayPal. `e2e/faq-jsonld.spec.ts` checks
  the copy and the rendered accordion in EN/ES/PT. As a second guard, any question that mentions
  an `UNCONFIRMED_CLAIMS` term (`lib/faq.ts`, today PayPal) is left out of the JSON-LD.

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

## Guide pages and FAQ hubs

Twelve static pages under `/en/*`, `/es/*` and `/pt/*` (three guides and the FAQ hub, in three languages), written to be found and quoted by ChatGPT
search, Bing and Google: the first paragraph answers the question directly, then "how it works" in steps, a
couple of short sections, 4–6 FAQ items, and the WhatsApp CTA.

| File | What |
|---|---|
| `lib/content/guides.ts` | every page's copy, metadata, `updated` date and WhatsApp sentence; `GUIDE_UI` strings |
| `lib/content/faq-items.ts` | the FAQ question pool (EN/ES/PT, same ids) and the 11 ids of the hubs |
| `lib/faq.ts` | publish guard, self-link removal, FAQPage JSON-LD builders |
| `components/guide/guide-page.tsx` | the one layout all twelve pages use, plus `guideMetadata()` (canonical, hreflang for every language + x-default = EN, OG) |
| `components/whatsapp-button.tsx` | the CTA with the ref |
| `app/{en,es,pt}/<slug>/page.tsx` | three-line route files |

Why outside `lib/translations.ts`: each language has its own URL and the copy is long-form. Same
reasoning as `/privacy`.

**`lang`**: the root layout's `<html lang="en">` can't change per route (it would take one root
layout per language, i.e. moving every route into route groups, or reading the path from a header,
which makes every page dynamic). So each page wraps its content in a `<div lang>` — `pt-BR` and
`es-AR` — and declares its language through hreflang and `og:locale`.

**The online-shopping guides** (`/en/online-shopping-in-argentina`, `/pt/compras-online-na-argentina`,
`/es/compras-online-en-argentina`, decision 8 of 2026-11-09) are for the traveler who wants to buy
something online and doesn't know MercadoLibre: the first lines say that in Argentina most online
shopping happens on MercadoLibre, that it asks for an Argentine DNI, and that we buy for you; the
last section of the body links to the MercadoLibre guide of the same language (`link` on a
section; `e2e/guides-i18n.spec.ts` checks it). Google's
"Compras" ad groups land here, so the slugs are fixed. **Amazon** may only appear as a neutral
comparison ("the way you'd use Amazon at home") — never say or imply that Amazon doesn't deliver to
or operate in Argentina; `e2e/faq-jsonld.spec.ts` rejects any other sentence that names it. Their
FAQ adds one question to the pool, `where-shop-online`, which is not on the hubs (they stay at 11).

**The Spanish pages** (`/es/*`, added on 2026-11-09 for the campaigns, which now run in EN, ES and PT)
are for **Spanish-speaking foreigners in Argentina** — Uruguayans, Chileans, Colombians, Spaniards —
not for Argentines, who don't have the problem. The slugs are fixed: Google Ads (ad group ML-ES) and
ChatGPT Ads already point at them. Copy rules on top of the ones below: rioplatense voseo
("podés", "mandanos"), as in BRAND.md's ES tagline ("Encargate de disfrutar") and the landing's ES
copy; always "DNI argentino" (a Spaniard has a DNI too); "te espera donde te quedes" as the
fulfilment line (BRAND.md's approved phrasing). Their hreflang is plain `es`, so they serve every
Spanish speaker.

**FAQ rules** (enforced by `e2e/faq-jsonld.spec.ts`):

- Questions phrased as a traveler types them into ChatGPT. The direct answer (`answer`) is the
  first one or two sentences, **40–60 words**, without selling; then an optional `detail` and a
  link to the page that explains it (dropped automatically on that same page).
- Answers are **always visible** (no accordion): the FAQPage JSON-LD is built from the same objects
  and must match the page text exactly. The JSON-LD answer carries the link as an `<a>`.
- Exactly one FAQPage per page; 11 questions on each hub (12 until decision 10 removed the
  Mercado Pago one — don't pad it back), 4–6 on each guide.
- **TODOs**: anything not yet confirmed goes in the item's `todo` field (`"TODO(gaston): …"`), which
  is never rendered — the visible answer is an interim one that is safe to publish. As a second
  guard, an item whose *visible* text contains `TODO` is neither rendered nor put in the JSON-LD.
  List them with `grep -rn "TODO(gaston)" lib/content`.

**Claims** (session brief + `BRAND.md`): the 10–20% fee, "quote before you pay, nothing charged
until you approve", "waits for you where you're staying", returns/claims handled — all already on
the site. Never: PayPal or any payment method, delivery times or dates, ticket availability,
response times, DNI/bank help. The pages say what we *don't* do (QR payments, transfers, currency
exchange, paperwork).

**Language versions**: pages with the same `topic` (`online-shopping`, `mercadolibre`, `tickets`,
`faq`) are the same page in each language of `GUIDE_LANGS`. From that one key come the hreflang
alternates of each page (`hreflangPaths()`: every language + `x-default` = English), the sitemap's
alternates and the header's language switch (`EN | ES | PT` codes like the landing's toggle, but links,
since each language has its own URL; the current one is `aria-current="page"`). A topic missing
in a language, or present twice, fails the build (check at the end of `guides.ts`), because
hreflang that isn't reciprocal is ignored by Google. `e2e/guides-i18n.spec.ts` checks canonical,
hreflang, `lang`, the switch and the sitemap for every page in the content file.

**Header on phones**: below `sm` the header's WhatsApp button is icon-only (`iconOnlyOnMobile` on
`WhatsAppButton`; "WhatsApp" stays as its `aria-label`, like the landing's header) and the logo
caps at 32px high, so logo + `EN | ES | PT` + button fit in 320px. With the full "WhatsApp" label
the header was 411px wide and mobile browsers zoomed the whole page out. When checking this, compare
`scrollWidth` with the *device* width: on a mobile viewport `innerWidth` grows with the content, so
`scrollWidth > innerWidth` never fires.

**Adding a page**: add a `GuideContent` to `lib/content/guides.ts` in every language, all with the
same `topic`, create the three-line route files, and add the paths to
`GUIDES` in `e2e/faq-jsonld.spec.ts`. The sitemap and the footer links pick it up from the content
file. When you edit a page, bump its `updated` date — it is shown on the page and is the sitemap's
`lastModified`.

Not linked from the landing yet (to keep this PR off `app/page.tsx` while #13 rewrites it): they
are reachable through the sitemap and link to each other. Add them to the landing footer after #13.

### No Mercado Pago

Decision 10 (2026-11-10, `campaigns/2026-11-08/decisiones.md`): **Concierge doesn't do Mercado Pago
for tourists.** The guides `/en/mercado-pago-for-tourists`, `/pt/mercado-pago-para-turistas` and
`/es/mercado-pago-para-turistas` were deleted (EN/PT had been live since PR #33) and the FAQ
question "How do I use Mercado Pago as a tourist?" left the pool, so the hubs have 11 questions.
The three URLs answer a **308** to the MercadoLibre guide of the same language (`redirects()` in
`next.config.mjs`), keeping the query string so `utm_*`/`gclid` — and the WhatsApp ref — survive an
old ad or bookmark.

What may still mention Mercado Pago: only statements that we *don't* do it (the `dni-bank-help`
answer: "doesn't handle DNI, residency, bank or Mercado Pago paperwork"). Never as a service, a
guide, a payment method or a keyword. `e2e/no-mercado-pago.spec.ts` checks the redirects and that no
route or link points at `/*/mercado-pago*`.

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
