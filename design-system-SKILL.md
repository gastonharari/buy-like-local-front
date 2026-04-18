---
name: design-system
description: Act as the design system authority for Concierge. Use this skill whenever the user asks about UI components, design tokens, Tailwind classes, color palette, typography, spacing, component variants, or anything related to building or reviewing UI for concierge.com.ar. Trigger for requests like "build a new section", "what component should I use", "review this UI", "add a CTA button", "what's our color for X", "design a card for Y", or any frontend work in the /front directory. Always produce code that uses the design token system — never hardcode hex values. Always stay within the brand constraints.
---

# Design System — Concierge

**Stack:** Next.js 15, Tailwind CSS v4, TypeScript, shadcn/ui component library  
**Root CSS:** `/front/app/globals.css`  
**Components:** `/front/components/ui/`  
**Framework:** Dark-first design. The site always renders in dark mode (no light mode toggle).

---

## Color Tokens

Design tokens are CSS variables defined in `:root` at `/front/app/globals.css`. Always use Tailwind semantic classes — **never hardcode hex values**.

| Token | CSS Variable | Hex | Tailwind Class | Use |
|-------|-------------|-----|----------------|-----|
| Obsidian | `--background` | `#0D0D0D` | `bg-background` | Page background |
| Deep Teal | `--card` | `#111f20` | `bg-card` | Cards, surfaces, panels |
| Deep Teal (secondary) | `--secondary` | `#1e3637` | `bg-secondary` | Secondary buttons, hover states |
| Sand | `--primary` | `#D4A574` | `bg-primary` / `text-primary` | CTAs, accents, key highlights |
| Cream | `--foreground` | `#F5F0EB` | `text-foreground` | Body text, primary readable content |
| Cream (card text) | `--card-foreground` | `#F5F0EB` | `text-card-foreground` | Text on cards |
| Cream Suave | `--cream-suave` | `#E8D5C0` | `text-cream-suave` | Hero subtitles, secondary prominent text |
| Muted text | `--muted-foreground` | `#8a8072` | `text-muted-foreground` | Subtitles, secondary text, labels |
| WhatsApp Green | `--accent` | `#25D366` | `bg-accent` | **Exclusively** WhatsApp CTA buttons |
| WhatsApp text | `--accent-foreground` | `#ffffff` | `text-accent-foreground` | Text on WhatsApp buttons (white on green) |
| Border | `--border` | `#1e3637` | `border-border` | All borders, dividers |
| Ring | `--ring` | `#D4A574` | `ring-ring` | Focus rings (matches Sand) |

### Color Rules

- **Sand (`--primary`) is the CTA color** for everything non-WhatsApp. Use sparingly — one Sand CTA per section max.
- **WhatsApp Green (`--accent`) is reserved exclusively** for the WhatsApp button. Never use green for anything else.
- **Never use `bg-white` or `bg-black`** — always use token-based classes.
- **Dark surfaces stack:** `bg-background` → `bg-card` → `bg-secondary`. Never layer two `bg-background` elements.

---

## Typography

**Currently loaded in `layout.tsx`:**

| Typeface | CSS Variable | Tailwind Class | Use |
|----------|-------------|----------------|-----|
| Inter | `--font-inter` → `--font-sans` | `font-sans` | Body text, UI labels, buttons |
| Poppins (600/700/800) | `--font-poppins` → `--font-display` | `font-display` | Display headlines, ad headers, hero titles |
| Geist Mono | `--font-geist-mono` → `--font-mono` | `font-mono` | Code snippets only |

**Notes on Poppins:**
- Loaded at weight 600/700/800 only — always use `font-semibold`, `font-bold`, or `font-extrabold`
- `--font-display: var(--font-poppins)` is live in `globals.css` `@theme inline` → use `font-display` class
- Use for: hero headlines, section titles, ad copy headlines, editorial moments
- Do NOT use for body text, labels, or UI elements — keep those on Inter (`font-sans`)

**Ad creatives (HTML — canonical):**
- **Playfair Display** — ad headlines (serif, Opción A confirmada)
- **DM Sans** — ad body, trust bars, CTA labels

**Web product (current implementation):**
- **Poppins** (`font-display`) — web headlines, section titles
- **Inter** (`font-sans`) — web body, UI, labels

⚠️ **Typography debt:** `app/globals.css` `@theme inline` exposes `--font-sans` (Inter) and `--font-mono` (Geist). Poppins is loaded in `layout.tsx` but NOT exposed as `--font-display` in `@theme inline` yet — add it. Do not mix with Geist from `styles/globals.css` (that file is secondary/legacy).

### Type Scale

Use Tailwind's default scale with these conventions:

| Level | Class | Use |
|-------|-------|-----|
| Hero | `text-5xl font-bold` | Main headline above the fold |
| Section title | `text-3xl font-semibold` | H2-level section headers |
| Card title | `text-xl font-semibold` | Card and component titles |
| Body | `text-base` | Paragraph text |
| Caption | `text-sm text-muted-foreground` | Labels, descriptions, metadata |
| Micro | `text-xs text-muted-foreground` | Timestamps, badges, fine print |

---

## Border Radius

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `--radius` (base) | `0.875rem` | `rounded-lg` |
| Small | `calc(var(--radius) - 4px)` | `rounded-md` |
| Large | `var(--radius)` | `rounded-lg` |
| Extra large | `calc(var(--radius) + 4px)` | `rounded-xl` |

**Convention:** Cards and panels use `rounded-xl`. Buttons use `rounded-md`. Inputs use `rounded-md`.

---

## Component Library — shadcn/ui

All components live at `/front/components/ui/`. Built on Radix UI primitives + Tailwind CVA.

### Available Components

| Component | File | Notes |
|-----------|------|-------|
| Button | `button.tsx` | Variants: default, destructive, outline, secondary, ghost, link |
| Card | `card.tsx` | Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction |
| Badge | `badge.tsx` | Status indicators |
| Input | `input.tsx` | Text inputs |
| Textarea | `textarea.tsx` | Multi-line inputs |
| Dialog | `dialog.tsx` | Modals |
| Drawer | `drawer.tsx` | Mobile bottom sheets |
| Sheet | `sheet.tsx` | Side panels |
| Separator | `separator.tsx` | Horizontal/vertical dividers |
| Tabs | `tabs.tsx` | Tab navigation |
| Accordion | `accordion.tsx` | Collapsible sections |
| Skeleton | `skeleton.tsx` | Loading states |
| Spinner | `spinner.tsx` | Loading indicator |
| Avatar | `avatar.tsx` | User/service avatars |
| Tooltip | `tooltip.tsx` | Hover hints |
| Popover | `popover.tsx` | Floating content |
| Select | `select.tsx` | Dropdowns |
| Checkbox | `checkbox.tsx` | Checkboxes |
| Switch | `switch.tsx` | Toggle switches |
| Slider | `slider.tsx` | Range sliders |
| Progress | `progress.tsx` | Progress bars |
| Alert | `alert.tsx` | Notification banners |
| Toast / Sonner | `sonner.tsx` | Toast notifications |
| Form | `form.tsx` | react-hook-form wrapper |
| Table | `table.tsx` | Data tables |
| Calendar | `calendar.tsx` | Date picker base |

### Button Variants — Usage Guide

```tsx
// Primary CTA — Sand background, for main conversion actions
<Button variant="default">Message us</Button>

// WhatsApp CTA — use bg-accent override, not a variant
<Button className="bg-accent text-accent-foreground hover:bg-accent/90">
  WhatsApp
</Button>

// Secondary action
<Button variant="secondary">Learn more</Button>

// Subtle action, no background
<Button variant="ghost">View details</Button>

// Outlined
<Button variant="outline">See all</Button>

// Text link
<Button variant="link">See pricing</Button>

// Sizes
<Button size="lg">Large CTA</Button>   // h-10 px-6
<Button size="default">Default</Button> // h-9 px-4
<Button size="sm">Small</Button>        // h-8 px-3
<Button size="icon"><Icon /></Button>   // Square 36px
```

### Card — Usage Guide

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle or description</CardDescription>
    <CardAction><Button size="sm">Action</Button></CardAction>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
```

Cards use `bg-card` (Deep Teal `#111f20`) by default. Never wrap a Card inside another Card.

---

## Layout Patterns

### Page Structure

```tsx
// Standard page section
<section className="py-16 px-4 md:px-8 lg:px-16">
  <div className="max-w-5xl mx-auto">
    {/* content */}
  </div>
</section>

// Dark card grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>...</Card>
</div>
```

### CTA Hierarchy on a Page

1. **Primary (Sand)** — one per page section. `<Button variant="default">` 
2. **WhatsApp** — sticky or bottom of hero. Custom `bg-accent` class.
3. **Secondary** — supporting actions. `<Button variant="secondary">` or `variant="outline"`

Never put two Sand buttons side by side.

### Spacing Conventions

| Gap | Class | Use |
|-----|-------|-----|
| Section padding | `py-16 md:py-24` | Between major page sections |
| Card internal | `gap-6` (built in) | Card sub-components |
| Grid gap | `gap-4` or `gap-6` | Card grids |
| Inline gap | `gap-2` | Icon + label inside a button/badge |
| Small stacks | `space-y-4` | Label + input stacks |

---

## Editorial Elements

These are visual patterns used in ads, social posts, and editorial/hero content (NOT in product UI). Codified here so future ads are consistent.

### Concierge Eyebrow Mark

A compact brand identifier for ads and editorial placements where the full wordmark lockup is too heavy.

| Property | Value |
|----------|-------|
| Font | Poppins 600 (`font-display font-semibold`) |
| Case | Uppercase (`uppercase`) |
| Letter spacing | `tracking-[0.18em]` |
| Font size | `text-sm` (~14px) |
| Color | Sand (`text-primary`) |
| Background | Obsidian or Deep Teal only |
| Format | `— LABEL —` with em dashes |

**Usage:**
- In ads: eyebrow above main headline — e.g., `— FOR FOREIGN TOURISTS —`, `— YOUR LOCAL BUYER —`
- **All ads must have an eyebrow mark** — it anchors the piece and creates campaign consistency
- Not used inside web product UI (use the full wordmark lockup for that)
- Convives with the full lockup: eyebrow = ad/social mark; full lockup = web header/footer/print

```tsx
// Eyebrow mark pattern
<span className="font-display font-semibold uppercase text-sm tracking-[0.18em] text-primary">
  — FOR FOREIGN TOURISTS —
</span>
```

### Brand Marker Bar

A thin horizontal Sand bar used as a visual signature on editorial pieces.

| Property | Value |
|----------|-------|
| Dimensions | 120×3px |
| Color | Sand (`bg-primary`) |
| Position | Bottom-left of copy block |
| Padding | Aligns with headline left edge |
| Use | Ads, social post templates, editorial headers |
| Not for | Product UI (cards, buttons, forms) |

```tsx
// Brand marker bar
<div className="h-[3px] w-[120px] bg-primary" />
```

**When to use:** Ads, editorial moments, social posts. Functions as a closing "signature" on a visual piece.

---

## Brand Constraints in UI

These are hard rules — never violate them in any component:

1. **No stock photo energy** — no sunset photos, passport imagery, airplane wing shots. Use real Buenos Aires street photos, real WhatsApp screenshots, real local product shots.
2. **Dark palette always** — background is always Obsidian or Deep Teal. Never white or light gray sections.
3. **Sand is an accent, not a surface** — never fill a large area with `#D4A574`. It's for CTAs, underlines, icon accents.
4. **WhatsApp Green is isolated** — only on the WhatsApp CTA button. If you see it elsewhere, that's a bug.
5. **Problem-first hierarchy** — hero sections show the pain point BEFORE the solution. The brand name is never the first thing visible.
6. **No fintech aesthetics** — no gradients from purple to blue, no crypto-looking patterns, no "holographic" effects.
7. **Max 5 hashtags** on any public-facing content rendered in UI.
8. **Never mention pricing** in any UI component — no fee tables, no "from $X" labels.

---

## Anti-Patterns to Avoid

```tsx
// ❌ Never hardcode hex
<div className="bg-[#D4A574]">

// ❌ Never use light backgrounds  
<section className="bg-white">

// ❌ Never put two primary CTAs side by side
<Button>CTA 1</Button>
<Button>CTA 2</Button>

// ❌ Never use accent for non-WhatsApp
<Button className="bg-accent">Book now</Button>

// ✅ Correct — use tokens
<div className="bg-primary text-primary-foreground">

// ✅ Correct — WhatsApp specific
<Button className="bg-accent text-accent-foreground">WhatsApp us</Button>

// ✅ Correct — separate hierarchy
<Button variant="default">Message us</Button>
<Button variant="outline">Learn more</Button>
```

---

## Typography Debt (pending fix)

| File | Font | Status |
|------|------|--------|
| `/front/app/globals.css` | Inter | **Active** — `--font-sans` |
| `/front/app/globals.css` `@theme inline` | Poppins | **Loaded** in `layout.tsx` but **NOT exposed** as `--font-display` yet — add it |
| `/front/styles/globals.css` | Geist | Secondary / likely unused |
| Brand spec | DM Sans | Not loaded — Inter is functional substitute |
| Brand spec | Playfair Display | **Not loaded. Pending decision.** |

**`font-display` is now live.** `--font-display: var(--font-poppins)` is already in `globals.css` `@theme inline`. Use `font-display` everywhere display text appears.

**Serif (Playfair Display) — decision resolved:**
Ad HTML creatives use Playfair Display + DM Sans (brand spec). If you want web hero sections to match ad aesthetic, load it in `layout.tsx`:
```tsx
import { Inter, Poppins, Playfair_Display } from "next/font/google"
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
```
Then add `--font-serif: var(--font-playfair)` to `@theme inline`. Use `font-serif` for editorial hero sections only. Currently **not loaded** in web — Poppins (`font-display`) is the web headline substitute.

---

## File Locations

| Asset | Path |
|-------|------|
| CSS tokens | `/front/app/globals.css` |
| Components | `/front/components/ui/*.tsx` |
| Ad templates | `/front/components/ads/AdSquare.tsx`, `AdVertical.tsx` |
| Layout | `/front/app/layout.tsx` |
| Landing page | `/front/app/page.tsx` |
| Translations | `/front/lib/translations.ts` |
| Utils (cn) | `/front/lib/utils.ts` |
| Brand memory | `~/.claude/projects/.../memory/project_brand.md` |
| CMO skill | `/concierge/agents/performance/Instagram-Posts/cmo-concierge-SKILL.md` |
