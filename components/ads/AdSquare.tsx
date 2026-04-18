/**
 * AdSquare — 1080×1080 ad template
 *
 * Encodes all Concierge editorial design patterns:
 * - Concierge Eyebrow Mark (Poppins 600, uppercase, tracking-[0.18em], Sand)
 * - Split-color headline (Cream main + Sand accent line)
 * - Brand marker bar (120×3px, Sand, bottom-left)
 * - WhatsApp CTA (full-width of copy block, bg-accent)
 * - Footer: concierge.com.ar in muted text
 * - Background: Obsidian or Deep Teal only
 *
 * Usage:
 *   <AdSquare
 *     eyebrow="FOR FOREIGN TOURISTS"
 *     headlineMain="Foreign tourist in"
 *     headlineAccent="Buenos Aires?"
 *     subline="Cards declined? Apps blocked? We fix it."
 *     bullets={["Tickets", "Shopping", "Deliveries"]}
 *     background="obsidian"
 *   />
 *
 * To export as image: render inside a div with w-[1080px] h-[1080px]
 * and use html-to-image or Puppeteer screenshot.
 */

interface AdSquareProps {
  /** Eyebrow label — rendered as "— LABEL —" in Sand uppercase */
  eyebrow: string
  /** Main headline line — rendered in Cream */
  headlineMain: string
  /** Accent headline line — rendered in Sand */
  headlineAccent: string
  /** Supporting subline below the headline */
  subline?: string
  /** Optional bullet list (max 3) — rendered as "Item · Item · Item" */
  bullets?: string[]
  /** Background surface */
  background?: "obsidian" | "teal"
  /** Override WhatsApp link */
  waLink?: string
}

export function AdSquare({
  eyebrow,
  headlineMain,
  headlineAccent,
  subline,
  bullets,
  background = "obsidian",
  waLink = "https://wa.me/5491158637341",
}: AdSquareProps) {
  const bgClass = background === "teal" ? "bg-card" : "bg-background"

  return (
    <div
      className={`relative ${bgClass} w-full aspect-square overflow-hidden`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* Subtle gradient overlay — depth without lightening */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none" />

      {/* Content layout */}
      <div className="relative h-full flex flex-col justify-between p-10">

        {/* ── Top: Brand eyebrow mark ────────────────────────────── */}
        <div>
          <span
            className="text-primary text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            — {eyebrow} —
          </span>
        </div>

        {/* ── Middle: Headline + subline + bullets ──────────────── */}
        <div className="space-y-5">
          {/* Brand marker bar */}
          <div className="h-[3px] w-[120px] bg-primary" />

          {/* Split-color headline */}
          <h2
            className="text-[52px] leading-[1.05] font-bold tracking-tight"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <span className="block text-foreground">{headlineMain}</span>
            <span className="block text-primary">{headlineAccent}</span>
          </h2>

          {/* Subline */}
          {subline && (
            <p className="text-cream-suave text-lg leading-snug max-w-[340px]">
              {subline}
            </p>
          )}

          {/* Bullets */}
          {bullets && bullets.length > 0 && (
            <p className="text-muted-foreground text-sm tracking-wide">
              {bullets.join(" · ")}
            </p>
          )}
        </div>

        {/* ── Bottom: CTA + footer ──────────────────────────────── */}
        <div className="space-y-4">
          {/* WhatsApp CTA — full-width of copy block */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-accent text-accent-foreground font-bold text-base py-4 rounded-md hover:bg-accent/90 transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Message us on WhatsApp
          </a>

          {/* Footer */}
          <p className="text-muted-foreground text-xs text-right tracking-wide">
            concierge.com.ar
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── WhatsApp SVG (self-contained so the component has no external deps) ────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.45zM12.045 21.785h-.007c-1.773 0-3.513-.476-5.031-1.37l-.361-.214-3.741.981 1.001-3.652-.235-.374c-.986-1.57-1.507-3.385-1.505-5.25C2.169 6.4 6.634 1.95 12.05 1.95c2.62 0 5.08 1.02 6.931 2.87 1.85 1.849 2.867 4.31 2.866 6.929-.003 5.408-4.47 9.836-9.802 9.836zm5.39-7.363c-.294-.147-1.742-.858-2.012-.957-.27-.098-.466-.147-.663.148-.198.294-.76.956-.932 1.154-.173.197-.345.22-.638.073-.294-.147-1.24-.458-2.362-1.458-.872-.779-1.461-1.74-1.633-2.034-.172-.294-.018-.453.129-.6.133-.132.294-.344.441-.516.148-.172.197-.294.295-.49.099-.197.05-.369-.025-.516-.074-.148-.663-1.6-.908-2.19-.24-.577-.483-.498-.663-.508-.172-.007-.369-.008-.565-.008-.197 0-.516.074-.786.369-.27.294-1.03 1.006-1.03 2.453 0 1.448 1.054 2.848 1.201 3.045.147.197 2.072 3.163 5.021 4.434.702.303 1.25.484 1.677.619.705.225 1.347.193 1.854.117.565-.083 1.741-.711 1.987-1.398.245-.688.245-1.277.172-1.399-.074-.123-.27-.197-.565-.344z" />
    </svg>
  )
}
