import { MessageCircle, ShieldCheck, Languages, MapPin } from "lucide-react"

const TRUST_ICONS = [MessageCircle, ShieldCheck, Languages, MapPin]

interface TrustBandProps {
  items: { title: string; sub: string }[]
}

export function TrustBand({ items }: TrustBandProps) {
  return (
    <section
      data-section="trust"
      className="relative border-y border-border/40 bg-card/20 py-8 md:py-10"
    >
      <div className="mx-auto max-w-6xl px-4">
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = TRUST_ICONS[i]
            return (
              <li
                key={i}
                data-reveal
                className="group cg-reveal cg-gradient-border cg-glow-hover flex items-center gap-3 rounded-2xl p-4 md:p-5"
                style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Icon className="h-5 w-5 text-primary cg-icon-pop" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold leading-tight">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
