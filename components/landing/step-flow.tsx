import type { LucideIcon } from "lucide-react"

interface StepFlowProps {
  steps: { title: string; description: string }[]
  icons: LucideIcon[]
}

export function StepFlow({ steps, icons }: StepFlowProps) {
  return (
    <div data-reveal className="cg-reveal relative">
      {/* Desktop beam */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-8 hidden h-0.5 md:block"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cg-beam-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#D4A574" stopOpacity="0.9" />
            <stop offset="1" stopColor="#4E9C94" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path
          d="M0 1 H100"
          pathLength={1}
          className="cg-beam"
          stroke="url(#cg-beam-grad)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          fill="none"
        />
      </svg>

      {/* Mobile beam */}
      <div
        aria-hidden="true"
        className="cg-beam-v pointer-events-none absolute bottom-10 left-8 top-8 w-px bg-gradient-to-b from-primary/70 via-primary/40 to-teal-bright/60 md:hidden"
      />

      <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((step, i) => {
          const Icon = icons[i]
          return (
            <div key={i} className="relative flex gap-5 md:block">
              {/* Giant faded step number — right side on mobile, behind the node on desktop */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 right-0 select-none font-display text-6xl font-bold text-primary/10 md:left-1/2 md:right-auto md:top-0 md:-translate-x-1/2"
              >
                0{i + 1}
              </span>

              <div
                className="cg-node relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full cg-gradient-border md:mx-auto"
                style={{ "--d": `${1.6 + i * 0.25}s` } as React.CSSProperties}
              >
                <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>

              <div className="flex-1 md:text-center">
                <div
                  data-reveal
                  className="cg-reveal mt-5 rounded-2xl cg-gradient-border p-6"
                  style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
                >
                  <h3 className="font-display text-lg font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
