import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TRACKING_ORDERS, TRACKING_STEPS } from "@/lib/tracking"

// Order tracking page — static, English only, one page per tracking number
// listed in lib/tracking.ts. Not linked from the landing and not indexed: the
// link is sent to the client directly.

export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(TRACKING_ORDERS).map((id) => ({ id }))
}

export const metadata: Metadata = {
  title: "Order tracking — Concierge",
  robots: "noindex, nofollow",
}

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = TRACKING_ORDERS[id]
  if (!order) notFound()

  return (
    <div className="min-h-dvh bg-background px-4 py-12">
      <main className="mx-auto max-w-md space-y-8">
        <header className="space-y-2">
          <Link href="/" className="text-sm font-semibold tracking-wide text-primary">
            CONCIERGE
          </Link>
          <h1 className="text-3xl font-bold text-foreground font-display">Order tracking</h1>
          <p className="text-sm text-muted-foreground">Tracking number</p>
          <p data-testid="tracking-number" className="break-all font-mono text-sm text-foreground">
            {id}
          </p>
        </header>

        <section className="rounded-[var(--radius)] border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Current status</p>
          <p data-testid="tracking-status" className="mt-1 text-xl font-semibold text-primary">
            {TRACKING_STEPS[order.current]}
          </p>

          <ol className="mt-6 space-y-5">
            {TRACKING_STEPS.map((step, i) => {
              const done = i < order.current
              const active = i === order.current
              return (
                <li key={step} className="flex items-center gap-3" aria-current={active ? "step" : undefined}>
                  <span
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                      done && "border-primary bg-primary text-primary-foreground",
                      active && "border-primary text-primary",
                      !done && !active && "border-border text-muted-foreground",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span className={done || active ? "text-foreground" : "text-muted-foreground"}>{step}</span>
                </li>
              )
            })}
          </ol>
        </section>

        <p className="text-sm text-muted-foreground">
          Questions about your order? Reply to us on WhatsApp.
        </p>
      </main>
    </div>
  )
}
