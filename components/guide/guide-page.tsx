import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { GUIDE_UI, guidesIn, hreflangPaths, languageVersions, type GuideContent } from "@/lib/content/guides"
import { SITE_URL, answerBody, faqForPage, faqPageSchema } from "@/lib/faq"

// Server-rendered page for every guide and FAQ hub in lib/content/guides.ts. Everything
// except the WhatsApp buttons is static HTML, so crawlers (OAI-SearchBot, Bingbot, Googlebot)
// read the answers and the FAQ without running JavaScript. FAQ answers are always visible —
// no accordion — because the FAQPage JSON-LD must match text that is on the page.

export function guideMetadata(page: GuideContent): Metadata {
  const ui = GUIDE_UI[page.lang]
  const languages = Object.fromEntries(
    Object.entries(hreflangPaths(page)).map(([hreflang, path]) => [hreflang, `${SITE_URL}${path}`]),
  )
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: {
      canonical: `${SITE_URL}${page.path}`,
      languages,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      url: `${SITE_URL}${page.path}`,
      siteName: "Concierge",
      locale: ui.ogLocale,
      type: "article",
      images: [{ url: "/buenos-aires-obelisco-night.jpg", width: 1200, height: 630, alt: page.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.meta.title,
      description: page.meta.description,
      images: ["/buenos-aires-obelisco-night.jpg"],
    },
  }
}

function formatDate(iso: string, locale: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function GuidePage({ page }: { page: GuideContent }) {
  const ui = GUIDE_UI[page.lang]
  const faq = faqForPage(page.faq, page.path)
  const faqPath = `/${page.lang}/faq`

  return (
    <div lang={ui.htmlLang} className="min-h-dvh bg-background">
      <JsonLd id="faq-jsonld" data={faqPageSchema(faq, page.path)} />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="shrink-0" aria-label={`Concierge — ${ui.home}`}>
            <Image
              src="/concierge-logo.svg"
              alt="Concierge Buenos Aires"
              width={232}
              height={61}
              className="h-auto max-h-[32px] sm:max-h-[44px] w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language switch: same "EN | ES | PT" codes as the landing's toggle, but links, since each
                language is its own URL. */}
            <nav aria-label={ui.languageNav} className="flex items-center text-sm text-muted-foreground">
              {languageVersions(page).map((version, i) => (
                <span key={version.lang} className="flex items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="mx-0.5 opacity-30">
                      |
                    </span>
                  )}
                  {version.lang === page.lang ? (
                    <span
                      aria-current="page"
                      className="min-h-[44px] min-w-[28px] inline-flex items-center justify-center font-semibold text-foreground"
                    >
                      {version.lang.toUpperCase()}
                    </span>
                  ) : (
                    <Link
                      href={version.path}
                      hrefLang={version.lang}
                      title={GUIDE_UI[version.lang].languageName}
                      className="min-h-[44px] min-w-[28px] inline-flex items-center justify-center hover:text-foreground transition-colors"
                    >
                      {version.lang.toUpperCase()}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
            <WhatsAppButton
              message={page.waMessage}
              label="WhatsApp"
              location="guide_header"
              size="sm"
              iconOnlyOnMobile
            />
          </div>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12 md:py-16">
        <article className="max-w-3xl mx-auto space-y-14">
          {/* ── Direct answer ─────────────────────────────────────────────── */}
          <section data-section="guide-hero" className="space-y-6">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold">{page.eyebrow}</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              {page.h1}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-cream-suave">{page.lead}</p>
            <div className="flex flex-col items-start gap-3 pt-2">
              <WhatsAppButton message={page.waMessage} label={ui.cta} location="guide_hero" />
              <p className="text-xs text-muted-foreground">
                {ui.updated} <time dateTime={page.updated}>{formatDate(page.updated, ui.htmlLang)}</time>
              </p>
            </div>
          </section>

          {/* ── How it works ──────────────────────────────────────────────── */}
          {page.steps && (
            <section className="space-y-6">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{ui.stepsTitle}</h2>
              <ol className="grid gap-4 sm:grid-cols-2">
                {page.steps.map((step, i) => (
                  <li key={step.title} className="rounded-xl border border-border bg-card p-6 space-y-2">
                    <span aria-hidden="true" className="block text-3xl font-bold text-primary/40">
                      0{i + 1}
                    </span>
                    <h3 className="text-lg font-bold text-card-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {page.sections?.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p} className="text-muted-foreground leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {/* ── FAQ ───────────────────────────────────────────────────────── */}
          <section id="faq" data-testid="faq" className="space-y-6 scroll-mt-20">
            {page.kind === "guide" && (
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{ui.faqTitle}</h2>
            )}
            <div className="space-y-4">
              {faq.map((item) => {
                const Heading = page.kind === "faq" ? "h2" : "h3"
                return (
                  <div
                    key={item.id}
                    id={item.id}
                    data-faq-item
                    className="rounded-xl border border-border bg-card p-6 space-y-3 scroll-mt-20"
                  >
                    <Heading data-faq-q className="text-lg md:text-xl font-semibold text-foreground">
                      {item.q}
                    </Heading>
                    <div data-faq-a className="space-y-2 text-muted-foreground leading-relaxed">
                      <p>{answerBody(item)}</p>
                      {item.link && (
                        <p>
                          <Link href={item.link.href} className="text-primary hover:underline">
                            {item.link.label}
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Final CTA ─────────────────────────────────────────────────── */}
          <section data-section="guide-final-cta" className="rounded-2xl border border-border bg-card/30 p-8 text-center space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">{ui.finalTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{ui.finalText}</p>
            <div className="flex justify-center pt-2">
              <WhatsAppButton message={page.waMessage} label={ui.cta} location="guide_final_cta" />
            </div>
          </section>
        </article>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="bg-card border-t border-border pt-10"
        style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="container mx-auto px-4 grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <span className="text-xl font-bold text-foreground font-display block">Concierge</span>
            <p className="text-muted-foreground text-sm leading-relaxed">{ui.tagline}</p>
          </div>
          <nav className="space-y-2" aria-label={ui.guidesTitle}>
            <p className="text-foreground font-semibold text-sm uppercase tracking-wider">{ui.guidesTitle}</p>
            {guidesIn(page.lang).map((g) => (
              <Link
                key={g.path}
                href={g.path}
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {g.h1}
              </Link>
            ))}
            <Link href={faqPath} className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
              {ui.faqLink}
            </Link>
          </nav>
          <div className="space-y-2">
            <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
              concierge.com.ar
            </Link>
            <a
              href="mailto:info@concierge.com.ar"
              className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              info@concierge.com.ar
            </a>
            <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
              {ui.privacy}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
