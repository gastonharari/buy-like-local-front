# Design system

**The canonical reference is [`../design-system-SKILL.md`](../design-system-SKILL.md)** — a Claude
skill that auto-loads for UI work in this repo. It has the full token table, component variants,
typography scale and spacing rules.

This file holds only what the skill doesn't: rules that came out of shipping bugs, and the
relationship between the token layers.

Source of truth for values: `app/globals.css`. Brand-level truth (scope, voice, claims):
`../../BRAND.md`.

## Token layers

Three layers, and mixing them up is the usual cause of "the colour is right but it looks wrong":

1. **CSS variables in `:root`** (`app/globals.css`) — the hex values.
2. **`@theme inline`** — maps those variables to Tailwind's `--color-*` scale, which is what makes
   `bg-card` / `text-primary` work.
3. **Tailwind semantic classes** — what components actually use.

**Never hardcode a hex in a component.** Go through the semantic class.

There is deliberately **no `.dark` block**: the site is always dark, the `:root` tokens *are* the
dark theme, and no `class="dark"` is ever applied. `theme-provider.tsx` exists but exposes no
toggle. Adding a light mode means rethinking every token, not adding a class.

## Core palette

| Role | Variable | Hex | Class |
|---|---|---|---|
| Obsidian page bg | `--background` | `#0D0D0D` | `bg-background` |
| Deep Teal surface | `--card`, `--popover` | `#111f20` | `bg-card` |
| Deep Teal secondary | `--secondary`, `--muted`, `--border`, `--input` | `#1e3637` | `bg-secondary`, `border-border` |
| Sand | `--primary`, `--ring` | `#D4A574` | `bg-primary`, `text-primary` |
| Cream | `--foreground` | `#F5F0EB` | `text-foreground` |
| Cream suave | `--cream-suave` | `#E8D5C0` | `text-cream-suave` |
| Muted text | `--muted-foreground` | `#8a8072` | `text-muted-foreground` |
| WhatsApp green | `--accent` | `#25d366` | `bg-accent` |

`--radius: 0.875rem`. Fonts: Inter (body, `--font-sans`), Poppins (display, `--font-display`),
Geist Mono (`--font-mono`).

The `--chart-*` and `--sidebar-*` tokens are shadcn defaults in oklch. **They are not brand
colours** and no component on the site uses them. Ignore them; don't build charts off them without
re-deriving from the brand palette.

## WhatsApp green is not a brand colour

`#25D366` is WhatsApp's, and it is allowed in exactly one context: **the WhatsApp CTA button** (and
the step icons that refer to it). It's mapped to `--accent` for that purpose.

- Never use it as a general accent, background, or brand colour.
- Never use it in the CRM at all.
- Brand teal is `#112E2F` / `#1e3637`. When you want "our green", you want teal.

## CTA hierarchy

Wherever both CTAs appear (WhatsApp + web chat):

| | Style | Size |
|---|---|---|
| **Primary** — WhatsApp | solid green: `background:#25D366`, `color:white` | `size="lg"` |
| **Secondary** — chat | outlined sand: `border:1.5px solid #D4A574`, transparent bg, `color:#D4A574` | `size="default"` |

The size difference is part of the hierarchy, not decoration — matching sizes makes the two read as
equal options and flattens conversion.

## Contrast rules

- Never sand text on a sand-tinted `rgba()` background — invisible.
- Never mid-teal text on a teal-tinted `rgba()` background — invisible.
- An `rgba()` header background must match the current page background, not a leftover hex from a
  previous palette.

## iOS rules

Both came from real breakage; see [pages.md](pages.md#the-chat-widget) for the full context.

1. **Never leave a fixed-position overlay in the DOM while hidden.** iOS Safari ignores
   `pointer-events: none` on compositing layers created by `transition`, `transform` or
   `willChange`, and the invisible element eats touch scrolling. Use conditional rendering, or
   `visibility: hidden`.
2. **Avoid `willChange: "transform"` on fixed elements** — it creates exactly that layer.

Also prefer **`min-h-dvh` over `min-h-screen`** for full-height sections: mobile Safari's `vh`
excludes the URL bar and overflows.

## Assets

Logos and icons in `assets/` (SVG, four colourways: claro, negro, sand, teal) and `public/`.
Favicon is `app/icon.svg`, picked up automatically by the App Router.
