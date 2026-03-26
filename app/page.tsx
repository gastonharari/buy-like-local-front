"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
  UtensilsCrossed,
  Ticket,
  Wine,
  QrCode,
  HelpCircle,
  Instagram,
  CheckCircle,
  CreditCard,
} from "lucide-react"
import { translations, type Lang } from "@/lib/translations"

// ─── Static data ────────────────────────────────────────────────────────────

const STEP_ICONS = [MessageCircle, ShoppingBag, Package]

const SERVICE_ICONS = [
  ShoppingCart,
  UtensilsCrossed,
  Ticket,
  Wine,
  QrCode,
  HelpCircle,
]

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
    flag: "🇬🇧",
    quote:
      "I wanted to order food delivery but PedidosYa wouldn't accept my card. Concierge saved my night.",
    name: "James R.",
    country: "United Kingdom",
  },
]

const FOOTER_LINK_HREFS = [
  "#how-it-works",
  "#services",
  "#pricing",
  "#faq",
  "#about",
]

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
  const [isPulsing, setIsPulsing] = useState(true)

  useEffect(() => {
    // Initialize language from localStorage, then browser preference
    const stored = localStorage.getItem("concierge-lang")
    if (stored === "en" || stored === "es" || stored === "pt") {
      setLang(stored)
    } else {
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("pt")) setLang("pt")
      else if (browserLang.startsWith("es")) setLang("es")
    }

    // Stop floating button pulse after 3 seconds
    const pulseTimer = setTimeout(() => setIsPulsing(false), 3000)
    return () => clearTimeout(pulseTimer)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const changeLang = (newLang: Lang) => {
    setLang(newLang)
    localStorage.setItem("concierge-lang", newLang)
  }

  const t = translations[lang]

  return (
    <>
      {/* ── Floating WhatsApp Button ─────────────────────────────────────── */}
      <a
        href={t.waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] ${isPulsing ? "animate-pulse" : ""}`}
        style={{ backgroundColor: "#25D366" }}
      >
        <WhatsAppIcon className="h-7 w-7 text-white" />
      </a>

      {/* ── Sticky Header ────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b border-border/40 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "bg-background/95 shadow-lg" : "bg-background/80"
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="shrink-0">
            <span
              className="text-xl font-bold text-foreground tracking-tight"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Concierge
            </span>
          </a>

          {/* Language toggle + CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {(["en", "es", "pt"] as Lang[]).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i > 0 && <span className="mx-1 opacity-30">|</span>}
                  <button
                    onClick={() => changeLang(l)}
                    className={`transition-colors duration-150 hover:text-foreground ${
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

            <Button
              size="sm"
              className="shrink-0 text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#25D366" }}
              asChild
            >
              <a href={t.waLink} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{t.header.cta}</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-16">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/buenos-aires-obelisco-night.jpg"
              alt="Buenos Aires Obelisco at night"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h1
                className="tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                <span className="block text-5xl md:text-7xl font-bold text-balance">
                  {t.hero.h1}
                </span>
                <span className="block text-3xl md:text-5xl font-semibold text-balance mt-2" style={{ color: "#D4A574" }}>
                  {t.hero.h1Echo}
                </span>
              </h1>

              <p className="text-lg md:text-xl max-w-2xl mx-auto text-balance leading-relaxed mt-6" style={{ color: "#E8D5C0" }}>
                {t.hero.subtitle}
              </p>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: "#25D366" }}
                  asChild
                >
                  <a href={t.waLink} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                    {t.hero.cta}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="py-24 bg-card/30 relative overflow-hidden scroll-mt-20"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {t.howItWorks.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {t.howItWorks.steps.map((step, i) => {
                const Icon = STEP_ICONS[i]
                const colors = [
                  { ring: "border-accent", icon: "bg-accent/20 text-accent", num: "text-accent/30" },
                  { ring: "border-primary", icon: "bg-primary/20 text-primary", num: "text-primary/30" },
                  { ring: "border-muted-foreground", icon: "bg-muted-foreground/20 text-muted-foreground", num: "text-muted-foreground/30" },
                ]
                const c = colors[i]
                return (
                  <Card
                    key={i}
                    className={`p-8 text-center space-y-4 border-2 border-border hover:${c.ring} transition-all duration-300 hover:shadow-lg bg-card`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full ${c.icon} flex items-center justify-center mx-auto`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className={`text-6xl font-bold ${c.num}`}>
                      0{i + 1}
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── What We Can Do ───────────────────────────────────────────────── */}
        <section
          id="services"
          className="py-24 bg-background relative overflow-hidden scroll-mt-20"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {t.services.title}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {t.services.items.map((item, i) => {
                const Icon = SERVICE_ICONS[i]
                return (
                  <Card
                    key={i}
                    className="p-6 space-y-4 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 bg-card group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-card-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </Card>
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
              <h2
                className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {t.testimonials.title}
              </h2>
            </div>

            {/* PLACEHOLDER testimonials — replace with real ones when available */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {TESTIMONIALS.map((item, i) => (
                <Card
                  key={i}
                  className="p-8 space-y-6 border border-border bg-card relative"
                >
                  {/* Large quotation mark */}
                  <span
                    className="absolute top-4 left-6 text-6xl leading-none text-primary/20 font-serif select-none"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="text-foreground leading-relaxed pt-6 relative z-10">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <span className="text-2xl">{item.flag}</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {item.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {item.country}
                      </p>
                    </div>
                  </div>
                </Card>
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
              <h2
                className="text-4xl md:text-5xl font-bold text-balance text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {t.about.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.about.body}
              </p>
              <p className="text-sm text-muted-foreground">
                <a
                  href="mailto:hola@concierge.com.ar"
                  className="text-primary hover:underline"
                >
                  {t.about.contact}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────────────── */}
        <section
          id="pricing"
          className="py-24 bg-background relative overflow-hidden scroll-mt-20"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2
                className="text-4xl md:text-5xl font-bold text-balance text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {t.pricing.title}
              </h2>

              <Card className="p-8 md:p-10 border border-border bg-card space-y-6 text-left">
                <p className="text-foreground leading-relaxed text-lg">
                  {t.pricing.body}
                </p>

                <div className="flex gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {t.pricing.subDetail}
                  </p>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-muted/10 border border-border">
                  <CreditCard className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">
                    {t.pricing.note}
                  </p>
                </div>
              </Card>
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
              <h2
                className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {t.faq.title}
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {t.faq.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="border border-border rounded-xl bg-card px-6 data-[state=open]:border-primary/40 transition-colors duration-200"
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
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/buenos-aires-obelisco-night.jpg"
              alt="Buenos Aires Obelisco at night"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2
                className="text-4xl md:text-6xl font-bold text-balance text-foreground"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {t.finalCta.h2}
              </h2>
              <p className="text-xl text-muted-foreground text-balance leading-relaxed">
                {t.finalCta.subtitle}
              </p>
              <Button
                size="lg"
                className="text-lg px-8 py-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "#25D366" }}
                asChild
              >
                <a href={t.waLink} target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="w-5 h-5 mr-2" />
                  {t.finalCta.cta}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10 md:gap-6 mb-10">
            {/* Brand */}
            <div className="space-y-3">
              <span
                className="text-2xl font-bold text-foreground block"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
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
                    className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
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
                href="mailto:hola@concierge.com.ar"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                hola@concierge.com.ar
              </a>
              <a
                href={t.waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
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
                      className={`text-sm transition-colors duration-150 ${
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
    </>
  )
}
