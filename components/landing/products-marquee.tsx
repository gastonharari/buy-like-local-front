import {
  Shirt,
  Ticket,
  Wine,
  ShoppingBag,
  Cookie,
  Leaf,
  Package,
  Footprints,
  Disc3,
  Sparkles,
} from "lucide-react"

const MARQUEE_ICONS = [
  Shirt,
  Ticket,
  Wine,
  ShoppingBag,
  Cookie,
  Leaf,
  Package,
  Footprints,
  Disc3,
  Sparkles,
]

interface ProductsMarqueeProps {
  eyebrow: string
  aria: string
  items: string[]
}

export function ProductsMarquee({ eyebrow, aria, items }: ProductsMarqueeProps) {
  return (
    <section aria-label={aria} className="relative overflow-hidden py-10 md:py-12">
      <p className="mb-6 text-center font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        — {eyebrow} —
      </p>

      {/* TODO: WCAG 2.2.2 — add an explicit pause control; v1 relies on hover-pause + prefers-reduced-motion */}
      <div className="cg-marquee">
        <div className="cg-marquee-track">
          <ul className="flex shrink-0 items-center gap-3 pr-3 md:gap-4 md:pr-4">
            {items.map((item, i) => {
              const Icon = MARQUEE_ICONS[i % MARQUEE_ICONS.length]
              return (
                <li
                  key={i}
                  className="flex items-center gap-2.5 whitespace-nowrap rounded-full cg-gradient-border px-5 py-2.5"
                >
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm text-cream-suave">{item}</span>
                </li>
              )
            })}
          </ul>
          <ul aria-hidden="true" className="flex shrink-0 items-center gap-3 pr-3 md:gap-4 md:pr-4">
            {items.map((item, i) => {
              const Icon = MARQUEE_ICONS[i % MARQUEE_ICONS.length]
              return (
                <li
                  key={i}
                  className="flex items-center gap-2.5 whitespace-nowrap rounded-full cg-gradient-border px-5 py-2.5"
                >
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="text-sm text-cream-suave">{item}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
