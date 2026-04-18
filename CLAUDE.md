# Concierge — Marketing Landing Page (`/front`)

Landing page pública de Concierge. Multilenguaje (EN/ES/PT), Next.js 15 App Router, dark brand palette.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS v4 + shadcn/Radix UI |
| Fonts | Inter (body) + Poppins (headings) + Geist Mono |
| Analytics | Vercel Analytics + Google Analytics 4 (`G-JK2YHFCTCD`) + Meta Pixel (`1272933548278550`) |
| Hosting | Vercel |

## Local dev

```bash
cd front
npm run dev   # port 3001
```

## Key files

- `app/page.tsx` — main landing page (hero, how it works, services, testimonials, about, pricing, FAQ, final CTA, footer). Hero uses `min-h-dvh` (not `min-h-screen`) for correct mobile Safari sizing. Mobile: `py-10`, `text-4xl`/`text-2xl` for h1/echo; desktop: `md:py-20`, `md:text-7xl`/`md:text-5xl`.
- `app/layout.tsx` — root layout: fonts, metadata, GA4, Meta Pixel, ChatWidget, CookieBanner
- `lib/translations.ts` — all copy in EN/ES/PT (`LangConfig` interface)
- `components/chat-widget.tsx` — floating chat bubble (bottom-right)
- `app/globals.css` — brand design tokens

## Brand palette (CSS tokens)

| Token | Hex | Role |
|-------|-----|------|
| `--background` | `#0D0D0D` | Obsidian page bg |
| `--foreground` | `#F5F0EB` | Warm white text |
| `--card` | `#111f20` | Dark teal card surfaces |
| `--primary` | `#D4A574` | Sand — icon accents, borders, ring |
| `--primary-foreground` | `#0D0D0D` | Dark text on sand bg |
| `--muted-foreground` | `#8a8072` | Warm gray secondary text |
| `--border` | `#1e3637` | Teal border |
| `--accent` | `#25d366` | WhatsApp green (step icons) |

Hardcoded brand colors used inline (not as tokens):
- `#25D366` — WhatsApp CTA button background
- `#D4A574` — sand for outlined secondary CTAs
- `#112E2F` — chat widget label background
- `#E8D5C0` — hero subtitle text

## CTA hierarchy

Any time there are two CTAs (WhatsApp + chat):
- **Primary**: large solid green button (`background: #25D366, color: white`)
- **Secondary**: outlined sand button (`border: 1.5px solid #D4A574, backgroundColor: transparent, color: #D4A574`)
- Primary uses `size="lg"`, secondary uses `size="default"` to keep visual hierarchy clear

## Chat widget

`components/chat-widget.tsx` — embeds `https://concierge-crm.vercel.app/chat` in a 420px wide iframe popup.

- Floating button bottom-right, sand background, pulse animation for 4s on load
- **Scroll-based reveal**: button hidden (opacity 0, pointerEvents none) until user scrolls past 70% of viewport height. Smooth 300ms ease-out transition.
- **Backdrop overlay**: conditionally rendered (`{open && ...}`) `fixed inset-0 z-40` div with `rgba(0,0,0,0.4)` — only mounted when chat is open. Never leave a full-viewport fixed element in the DOM when hidden; iOS Safari's compositor blocks touch scrolling despite `pointer-events: none`.
- **Popup visibility**: uses `visibility: hidden` (not just `opacity: 0` / `pointer-events: none`) when closed — iOS respects `visibility` for hit-test exclusion more reliably than `pointer-events`.
- **Body scroll lock**: `document.body.style.overflow = "hidden"` when open, restored on close.
- **Language sync**: iframe receives `postMessage({ type: "set-lang", lang })` on load and whenever lang changes — iframe is on a different domain and can't read landing's localStorage.
- Page CTAs open it via: `window.dispatchEvent(new CustomEvent("open-chat"))` — also sets `revealed = true`
- `NEXT_PUBLIC_CHAT_URL` env var (optional — has fallback to the CRM URL)
- Iframe height: `min(540px, calc(100dvh - 210px))`, min 300px

## Translations

`lib/translations.ts` exports `translations: Record<Lang, LangConfig>` and `type Lang = "en" | "es" | "pt"`.

Language is detected from `localStorage("concierge-lang")` then `navigator.language`, defaulting to EN.

Key fields:
- `waLink` — WhatsApp deep link (lang-specific pre-filled message)
- `hero.cta` — WhatsApp CTA label
- `hero.chatCta` — web chat CTA label ("No WhatsApp? Chat here")
- `header.cta` — header chat button label
- `finalCta.cta` / `finalCta.chatCta` — same pattern as hero

## Env vars

```
NEXT_PUBLIC_CHAT_URL=https://concierge-crm.vercel.app/chat   # optional fallback already hardcoded
```

## Key conventions

- Always proceed autonomously (no confirmation needed for local changes).
- No light mode — site is always dark.
- Testimonials are always in English (they're foreign tourist quotes) — do not translate them.
- Meta Pixel ID is `1272933548278550` (wired in `layout.tsx`). Fires `PageView` on every page load. Hero and final CTA WhatsApp buttons fire `fbq('track', 'Lead')` on click via `onClick` in `page.tsx`.
- `bg-card/30` alternating sections create subtle teal warmth over obsidian bg — intentional.
- **iOS scroll rule**: never leave fixed-position overlays in the DOM when hidden. iOS Safari ignores `pointer-events: none` on compositing layers created by `transition`, `transform`, or `willChange`. Use conditional rendering or `visibility: hidden` instead. Avoid `willChange: "transform"` on fixed elements.
