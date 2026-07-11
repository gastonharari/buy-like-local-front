"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  MessageCircle,
  ShoppingBag,
  Package,
  ShoppingCart,
  Ticket,
  Wine,
  Instagram,
  type LucideIcon,
} from "lucide-react"
import { translations, type Lang } from "@/lib/translations"
import { trackEvent } from "@/lib/analytics"
import { ChatMockup } from "@/components/landing/chat-mockup"
import { StepFlow } from "@/components/landing/step-flow"
import { TrustBand } from "@/components/landing/trust-band"
import { ProductsMarquee } from "@/components/landing/products-marquee"
import { CtaBar } from "@/components/landing/cta-bar"
import { useRevealAll, usePointerGlow } from "@/hooks/use-reveal"

// ─── Static data ────────────────────────────────────────────────────────────

const STEP_ICONS: LucideIcon[] = [MessageCircle, ShoppingBag, Package]

const SERVICE_ICONS = [ShoppingCart, Ticket, Wine]

// Testimonials are always in English — they're quotes from foreign tourists
// PLACEHOLDER: swap these with real testimonials when available
const TESTIMONIALS = [
  {
    flag: "🇧🇷",
    quote:
      "I needed to buy something on MercadoLibre and couldn't create an account. Concierge handled everything in 2 hours. Incredible.",
    name: "Lucas M.",
    country: "Brazil",
  },
  {
    flag: "🇺🇸",
    quote:
      "Couldn't pay with my US card anywhere online. One WhatsApp message and they sorted it all out.",
    name: "Sarah K.",
    country: "United States",
  },
  {
    flag: "🇺🇾",
    quote:
      "Quería comprar una camiseta de Independiente en la página de Puma pero no me dejaba pagar. Concierge la compró por mí.",
    name: "Matías R.",
    country: "Uruguay",
  },
]

const FOOTER_LINK_HREFS = ["#how-it-works", "#services", "#faq", "#about"]

// ─── WhatsApp SVG icon ───────────────────────────────────────────────────────

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

// ─── Main component ──────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState<Lang>("en")
  const [scrolled, setScrolled] = useState(false)
  const [showCtaBar, setShowCtaBar] = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)

  useRevealAll()
  usePointerGlow(heroRef)

  useEffect(() => {
    const stored = localStorage.getItem("concierge-lang")
    if (stored === "en" || stored === "es" || stored === "pt") {
      setLang(stored)
    } else {
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("pt")) setLang("pt")
      else if (browserLang.startsWith("es")) setLang("es")
    }
  }, [])

  useEffect(() => {
    let raf: number
    const handleScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 20))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Track section visibility
  const sectionsTracked = useRef(new Set<string>())
  useEffect(() => {
    const SECTION_IDS = ["hero", "trust", "how-it-works", "services", "testimonials", "about", "faq", "final-cta"]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-section") ?? entry.target.id
          if (entry.isIntersecting && id && !sectionsTracked.current.has(id)) {
            sectionsTracked.current.add(id)
            trackEvent("section_view", { section: id })
          }
        })
      },
      { threshold: 0.3 }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.querySelector(`[data-section="${id}"], #${id}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Sticky CTA bar visibility — the section_view observer above unobserves
  // each section after its first view, so it can't drive an always-on bar.
  // This is a separate, continuously-watching observer over just hero + final-cta.
  useEffect(() => {
    const heroEl = heroRef.current
    const finalCtaEl = document.querySelector('[data-section="final-cta"]')
    if (!heroEl || !finalCtaEl) return

    const inView: Record<string, boolean> = { hero: true, "final-cta": false }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-section")
          if (id) inView[id] = entry.isIntersecting
        })
        setShowCtaBar(!inView.hero && !inView["final-cta"])
      },
      { threshold: 0.2 }
    )
    observer.observe(heroEl)
    observer.observe(finalCtaEl)
    return () => observer.disconnect()
  }, [])

  // Reserve space for the sticky CTA bar so the chat widget's FAB doesn't
  // sit underneath it (consumed by components/chat-widget.tsx).
  useEffect(() => {
    if (showCtaBar) {
      document.documentElement.style.setProperty("--cg-ctabar", "64px")
    } else {
      document.documentElement.style.removeProperty("--cg-ctabar")
    }
    return () => {
      document.documentElement.style.removeProperty("--cg-ctabar")
    }
  }, [showCtaBar])

  // Track scroll depth milestones
  const depthTracked = useRef(new Set<number>())
  useEffect(() => {
    const MILESTONES = [25, 50, 75, 100]
    function handleScroll() {
      const scrollPct = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
      MILESTONES.forEach((m) => {
        if (scrollPct >= m && !depthTracked.current.has(m)) {
          depthTracked.current.add(m)
          trackEvent("scroll_depth", { percent: String(m) })
        }
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const changeLang = (newLang: Lang) => {
    setLang(newLang)
    localStorage.setItem("concierge-lang", newLang)
    window.dispatchEvent(new CustomEvent("lang-change", { detail: newLang }))
    document.documentElement.lang = newLang
    trackEvent("language_change", { language: newLang })
  }

  const t = translations[lang]

  return (
    <>
      {/* ── Skip navigation ──────────────────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded focus:bg-background focus:text-foreground focus:font-semibold focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* ── Sticky Header ────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b border-border/40 transition-shadow duration-300 bg-background/85 backdrop-blur-md ${
          scrolled ? "shadow-[0_4px_12px_rgba(0,0,0,0.5)]" : ""
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <a href="#" className="shrink-0" onClick={() => trackEvent("logo_click")}>
            <Image
              src="/concierge-logo.svg"
              alt="Concierge Buenos Aires"
              width={232}
              height={61}
              className="h-auto max-h-[48px] w-auto"
              priority
            />
          </a>

          {/* Language toggle + CTA */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-0.5 sm:gap-1 text-sm text-muted-foreground">
              {(["en", "es", "pt"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i > 0 && <span className="mx-0.5 sm:mx-1 opacity-30">|</span>}
                  <button
                    onClick={() => changeLang(l)}
                    aria-pressed={lang === l}
                    className={`min-h-[44px] min-w-[28px] sm:min-w-[44px] transition-colors duration-150 hover:text-foreground ${
                      lang === l
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                asChild
              >
                <a href={t.waLink} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { location: "header" })}>
                  <WhatsAppIcon className="w-4 h-4 sm:mr-1.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex font-semibold hover:scale-105 transition-transform duration-200 border border-primary text-primary hover:bg-primary/10 hover:text-primary"
                onClick={() => { trackEvent("chat_open", { location: "header" }); window.dispatchEvent(new CustomEvent("open-chat")) }}
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                {t.header.cta}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="min-h-dvh pt-16">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          data-section="hero"
          className="relative flex min-h-dvh items-center overflow-hidden"
        >
          {/* Background stack */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none cg-kenburns">
            <Image
              src="/buenos-aires-obelisco-night.jpg"
              alt="Buenos Aires Obelisco at night"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/70 via-background/45 to-background" />
          <div aria-hidden="true" className="cg-grid-overlay absolute inset-0 pointer-events-none" />
          <div
            aria-hidden="true"
            className="cg-drift pointer-events-none absolute -left-24 top-24 h-96 w-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(212,165,116,.14), transparent 70%)" }}
          />
          <div
            aria-hidden="true"
            className="cg-drift-2 pointer-events-none absolute -right-24 bottom-24 h-96 w-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(78,156,148,.12), transparent 70%)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(400px circle at var(--mx, 50%) var(--my, 40%), rgba(212,165,116,.07), transparent 70%)" }}
          />
          <div aria-hidden="true" className="cg-noise absolute inset-0 pointer-events-none" />

          <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Copy column */}
            <div className="text-center lg:text-left">
              <p
                className="cg-rise font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                style={{ "--rise-delay": "0s" } as React.CSSProperties}
              >
                — {t.hero.eyebrow} —
              </p>

              <h1
                className="cg-rise font-display tracking-tight text-foreground mt-4"
                style={{ "--rise-delay": ".1s" } as React.CSSProperties}
              >
                <span className="block text-4xl md:text-7xl font-bold text-balance">
                  {t.hero.h1}
                </span>
                <span className="cg-shimmer block text-2xl md:text-5xl font-semibold text-balance mt-2">
                  {t.hero.h1Echo}
                </span>
              </h1>

              <div
                aria-hidden="true"
                className="cg-rise mx-auto mt-5 h-[3px] w-[120px] bg-primary lg:mx-0"
                style={{ "--rise-delay": ".2s" } as React.CSSProperties}
              />

              <p
                className="cg-rise text-lg md:text-xl max-w-2xl mx-auto text-balance leading-relaxed mt-6 text-cream-suave lg:mx-0"
                style={{ "--rise-delay": ".3s" } as React.CSSProperties}
              >
                {t.hero.subtitle}
              </p>

              <div
                className="cg-rise flex flex-col items-center lg:items-start gap-3 pt-4"
                style={{ "--rise-delay": ".4s" } as React.CSSProperties}
              >
                <Button
                  size="lg"
                  className="cg-sheen text-lg px-10 py-6 font-bold bg-accent text-accent-foreground hover:bg-accent/90 transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-xl"
                  asChild
                >
                  <a href={t.waLink} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent("whatsapp_click", { location: "hero" }); (window as any).fbq?.('track', 'Lead') }}>
                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                    {t.hero.cta}
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="default"
                  className="font-semibold transition-transform duration-300 hover:scale-105 border border-primary text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={() => { trackEvent("chat_open", { location: "hero" }); window.dispatchEvent(new CustomEvent("open-chat")) }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.hero.chatCta}
                </Button>
              </div>

              <p
                className="cg-rise mt-3 text-xs text-muted-foreground"
                style={{ "--rise-delay": ".5s" } as React.CSSProperties}
              >
                {t.hero.ctaNote}
              </p>
            </div>

            {/* Chat mockup column */}
            <div className="cg-rise mt-4 lg:mt-0" style={{ "--rise-delay": ".45s" } as React.CSSProperties}>
              <ChatMockup chat={t.hero.chat} />
            </div>
          </div>
        </section>

        {/* ── Trust Band ───────────────────────────────────────────────────── */}
        <TrustBand items={t.trust.items} />

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="py-24 bg-card/30 relative overflow-hidden scroll-mt-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(78,156,148,.12), transparent 70%)" }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div data-reveal className="cg-reveal text-center mb-16">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                — {t.howItWorks.eyebrow} —
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-4 text-balance text-foreground font-display">
                {t.howItWorks.title}
              </h2>
              <div aria-hidden="true" className="mx-auto h-[3px] w-[120px] bg-primary" />
            </div>

            <div className="max-w-6xl mx-auto">
              <StepFlow steps={t.howItWorks.steps} icons={STEP_ICONS} />
            </div>
          </div>
        </section>

        {/* ── Products Marquee ─────────────────────────────────────────────── */}
        <ProductsMarquee eyebrow={t.marquee.eyebrow} aria={t.marquee.aria} items={t.marquee.items} />

        {/* ── Mid CTA band ─────────────────────────────────────────────────── */}
        <section className="relative py-10">
          <div className="container mx-auto flex flex-col items-center gap-5 px-4 text-center sm:flex-row sm:justify-center sm:text-left">
            <p data-reveal className="cg-reveal font-display text-xl font-semibold md:text-2xl">
              {t.midCta.text}
            </p>
            <Button
              size="default"
              className="cg-sheen font-bold bg-accent text-accent-foreground hover:bg-accent/90 transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-xl"
              asChild
            >
              <a href={t.waLink} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent("whatsapp_click", { location: "mid" }); (window as any).fbq?.('track', 'Lead') }}>
                <WhatsAppIcon className="w-4 h-4 mr-2" />
                {t.midCta.cta}
              </a>
            </Button>
          </div>
        </section>

        {/* ── What We Can Do ───────────────────────────────────────────────── */}
        <section
          id="services"
          className="py-24 bg-background relative overflow-hidden scroll-mt-20"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                — {t.services.eyebrow} —
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-4 text-balance text-foreground font-display">
                {t.services.title}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {t.services.items.map((item, i) => {
                const Icon = SERVICE_ICONS[i]
                return (
                  <div
                    key={i}
                    data-reveal
                    className="group cg-reveal cg-gradient-border cg-glow-hover rounded-2xl p-6 space-y-4"
                    style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
                  >
                    <div
                      aria-hidden="true"
                      className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300"
                    >
                      <Icon className="w-6 h-6 text-primary cg-icon-pop" />
                    </div>
                    <h3 className="text-lg font-bold text-card-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        <section
          id="testimonials"
          className="py-24 bg-card/30 relative overflow-hidden scroll-mt-20"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                — {t.testimonials.eyebrow} —
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-4 text-balance text-foreground font-display">
                {t.testimonials.title}
              </h2>
            </div>

            {/* PLACEHOLDER testimonials — replace with real ones when available */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {TESTIMONIALS.map((item, i) => (
                <div
                  key={i}
                  data-reveal
                  className="cg-reveal cg-gradient-border rounded-2xl relative p-8 space-y-6"
                  style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
                >
                  {/* Large quotation mark */}
                  <span
                    className="absolute top-4 left-6 text-6xl leading-none text-primary/25 font-display select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="text-foreground leading-relaxed pt-6 relative z-10 text-left">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                    <span aria-hidden="true" className="text-2xl">
                      {item.flag}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {item.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.country}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About Us ─────────────────────────────────────────────────────── */}
        <section
          id="about"
          className="py-24 bg-card relative overflow-hidden scroll-mt-20"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-balance text-foreground font-display">
                {t.about.title}
              </h2>
              <div aria-hidden="true" className="mx-auto h-[3px] w-[120px] bg-primary" />
              <div
                data-reveal
                className="cg-reveal cg-gradient-border-glass rounded-3xl p-8 md:p-10 text-left"
              >
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t.about.body}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  <a
                    href="mailto:info@concierge.com.ar"
                    className="text-primary hover:underline"
                    onClick={() => trackEvent("email_click", { location: "about" })}
                  >
                    {t.about.contact}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section
          id="faq"
          className="py-24 bg-card/30 relative overflow-hidden scroll-mt-20"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                — {t.faq.eyebrow} —
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 mt-4 text-balance text-foreground font-display">
                {t.faq.title}
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3" onValueChange={(value) => { if (value) { const idx = parseInt(value.replace("item-", ""), 10); trackEvent("faq_expand", { question: t.faq.items[idx]?.q?.slice(0, 100) ?? value }) } }}>
                {t.faq.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="cg-gradient-border rounded-2xl px-6 transition-colors duration-200 data-[state=open]:border-primary/40 data-[state=open]:shadow-[0_0_30px_-12px_rgba(212,165,116,.4)]"
                  >
                    <AccordionTrigger className="text-left text-foreground font-semibold hover:no-underline py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section data-section="final-cta" className="py-32 relative overflow-clip">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/buenos-aires-obelisco-night.jpg"
              alt="Buenos Aires Obelisco at night"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
            <div aria-hidden="true" className="cg-grid-overlay absolute inset-0" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div data-reveal className="cg-reveal max-w-3xl mx-auto text-center space-y-8 relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/4 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(212,165,116,.22), transparent 70%)" }}
              />
              <h2 className="text-4xl md:text-6xl font-bold text-balance text-foreground font-display">
                {t.finalCta.h2}
              </h2>
              <p className="text-xl text-muted-foreground text-balance leading-relaxed">
                {t.finalCta.subtitle}
              </p>
              <div className="flex flex-col items-center gap-3">
                <Button
                  size="lg"
                  className="cg-sheen text-lg px-10 py-6 font-bold bg-accent text-accent-foreground hover:bg-accent/90 transition-[transform,box-shadow] duration-300 hover:scale-105 hover:shadow-xl"
                  asChild
                >
                  <a href={t.waLink} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent("whatsapp_click", { location: "final_cta" }); (window as any).fbq?.('track', 'Lead') }}>
                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                    {t.finalCta.cta}
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="default"
                  className="font-semibold transition-transform duration-300 hover:scale-105 border border-primary text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={() => { trackEvent("chat_open", { location: "final_cta" }); window.dispatchEvent(new CustomEvent("open-chat")) }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t.finalCta.chatCta}
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{t.finalCta.ctaNote}</p>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="bg-card pt-12"
        style={{ paddingBottom: "calc(3rem + env(safe-area-inset-bottom))" }}
      >
        <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 md:gap-6 mb-10">
            {/* Brand */}
            <div className="space-y-3">
              <span className="text-2xl font-bold text-foreground font-display block">
                Concierge
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.footer.tagline}
              </p>
              <a
                href="https://instagram.com/concierge.ok"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                onClick={() => trackEvent("social_click", { platform: "instagram" })}
              >
                <Instagram className="w-4 h-4" />
                @concierge.ok
              </a>
            </div>

            {/* Nav links */}
            <div className="space-y-3">
              <p className="text-foreground font-semibold text-sm uppercase tracking-wider">
                Navigation
              </p>
              <nav className="space-y-2">
                {t.footer.linkLabels.map((label, i) => (
                  <a
                    key={i}
                    href={FOOTER_LINK_HREFS[i]}
                    className="cg-underline block text-muted-foreground hover:text-foreground transition-colors text-sm"
                    onClick={() => trackEvent("footer_nav_click", { destination: FOOTER_LINK_HREFS[i] })}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact + language */}
            <div className="space-y-3">
              <p className="text-foreground font-semibold text-sm uppercase tracking-wider">
                Contact
              </p>
              <a
                href="mailto:info@concierge.com.ar"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
                onClick={() => trackEvent("email_click", { location: "footer" })}
              >
                info@concierge.com.ar
              </a>
              <a
                href={t.waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                onClick={() => trackEvent("whatsapp_click", { location: "footer" })}
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>

              {/* Language selector */}
              <div className="flex items-center gap-2 pt-2">
                {(["en", "es", "pt"] as Lang[]).map((l, i) => (
                  <span key={l} className="flex items-center">
                    {i > 0 && <span className="mr-2 text-border">|</span>}
                    <button
                      onClick={() => changeLang(l)}
                      aria-pressed={lang === l}
                      className={`min-h-[44px] min-w-[44px] text-sm transition-colors duration-150 ${
                        lang === l
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-center">
            <p className="text-xs text-muted-foreground">{t.footer.legal}</p>
          </div>
        </div>
      </footer>

      {/* ── Sticky CTA bar (mobile only) — conditionally mounted, never just hidden */}
      {showCtaBar && (
        <CtaBar
          label={t.ctaBar.label}
          waLink={t.waLink}
          onCta={() => {
            trackEvent("whatsapp_click", { location: "sticky" })
            ;(window as any).fbq?.('track', 'Lead')
          }}
        />
      )}
    </>
  )
}
