"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { translations, type Lang } from "@/lib/translations"
import { MessageCircle, Globe } from "lucide-react"

type PartnerData = {
  code: string
  name: string
  headline: string | null
  active: boolean
}

const COPY: Record<Lang, {
  defaultHeadline: (name: string) => string
  blurb: string
  whatsappCta: string
  webchatCta: string
  modalTitle: string
  modalDescription: string
  phoneLabel: string
  phonePlaceholder: string
  nameLabel: string
  namePlaceholder: string
  continueBtn: string
  loadingBtn: string
  errorMsg: string
}> = {
  en: {
    defaultHeadline: (name) => `Welcome — guest of ${name}`,
    blurb:
      "Concierge handles MercadoLibre, local stores, food delivery, and reservations for you in Buenos Aires. Pick how you want to talk to us:",
    whatsappCta: "Continue on WhatsApp",
    webchatCta: "Continue on web chat",
    modalTitle: "What's your WhatsApp number?",
    modalDescription:
      "We'll create your contact and open WhatsApp with a pre-filled message.",
    phoneLabel: "WhatsApp number (with country code)",
    phonePlaceholder: "+1 555 123 4567",
    nameLabel: "Your first name (optional)",
    namePlaceholder: "Jane",
    continueBtn: "Continue to WhatsApp",
    loadingBtn: "Connecting...",
    errorMsg: "Couldn't connect. Try again in a moment.",
  },
  es: {
    defaultHeadline: (name) => `Bienvenido — huésped de ${name}`,
    blurb:
      "Concierge te ayuda con MercadoLibre, tiendas locales, delivery de comida y reservas en Buenos Aires. Elegí cómo querés hablar con nosotros:",
    whatsappCta: "Seguir por WhatsApp",
    webchatCta: "Seguir por chat web",
    modalTitle: "¿Cuál es tu número de WhatsApp?",
    modalDescription:
      "Creamos tu contacto y abrimos WhatsApp con un mensaje pre-escrito.",
    phoneLabel: "Número de WhatsApp (con código de país)",
    phonePlaceholder: "+54 9 11 1234 5678",
    nameLabel: "Tu nombre (opcional)",
    namePlaceholder: "Juan",
    continueBtn: "Continuar a WhatsApp",
    loadingBtn: "Conectando...",
    errorMsg: "No pudimos conectar. Intentá de nuevo en un momento.",
  },
  pt: {
    defaultHeadline: (name) => `Bem-vindo — hóspede do ${name}`,
    blurb:
      "Concierge ajuda você com MercadoLibre, lojas locais, delivery e reservas em Buenos Aires. Escolha como quer falar com a gente:",
    whatsappCta: "Continuar no WhatsApp",
    webchatCta: "Continuar no chat web",
    modalTitle: "Qual é o seu número de WhatsApp?",
    modalDescription:
      "Criamos seu contato e abrimos o WhatsApp com uma mensagem pré-escrita.",
    phoneLabel: "Número de WhatsApp (com código do país)",
    phonePlaceholder: "+55 11 91234 5678",
    nameLabel: "Seu primeiro nome (opcional)",
    namePlaceholder: "João",
    continueBtn: "Continuar para o WhatsApp",
    loadingBtn: "Conectando...",
    errorMsg: "Não conseguimos conectar. Tente novamente em instantes.",
  },
}

function detectLang(): Lang {
  if (typeof window === "undefined") return "en"
  const stored = localStorage.getItem("concierge-lang")
  if (stored === "en" || stored === "es" || stored === "pt") return stored
  const nav = navigator.language.toLowerCase()
  if (nav.startsWith("pt")) return "pt"
  if (nav.startsWith("es")) return "es"
  return "en"
}

const CHAT_BASE_URL = process.env.NEXT_PUBLIC_CHAT_URL ?? "https://concierge-crm.vercel.app/chat"

export function ReferralLanding({ partner }: { partner: PartnerData }) {
  const [lang, setLang] = useState<Lang>("en")
  const [open, setOpen] = useState(false)
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLang(detectLang())
  }, [])

  const t = COPY[lang]
  const headline = partner.headline ?? t.defaultHeadline(partner.name)

  async function handleWhatsAppSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const r = await fetch("/api/r/start-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), name: name.trim(), code: partner.code }),
      })
      if (!r.ok) throw new Error("network")
      const { wa_url } = (await r.json()) as { wa_url: string }
      if (typeof window !== "undefined" && (window as any).fbq) {
        ;(window as any).fbq("track", "Lead")
      }
      window.location.href = wa_url
    } catch {
      setError(t.errorMsg)
      setSubmitting(false)
    }
  }

  function handleWebChat() {
    const url = `${CHAT_BASE_URL}?ref=${encodeURIComponent(partner.code)}`
    window.location.href = url
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      <div className="w-full max-w-xl flex flex-col items-center text-center gap-8">
        <div className="space-y-3">
          <p className="text-[#D4A574] uppercase tracking-widest text-sm font-semibold">
            Concierge · Buenos Aires
          </p>
          <h1 className="font-[family-name:var(--font-poppins)] text-3xl md:text-4xl font-bold leading-tight">
            {headline}
          </h1>
          <p className="text-[#E8D5C0] text-base md:text-lg leading-relaxed">{t.blurb}</p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full text-base font-semibold"
            style={{ backgroundColor: "#25D366", color: "white" }}
            onClick={() => setOpen(true)}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {t.whatsappCta}
          </Button>
          <Button
            size="default"
            variant="outline"
            className="w-full"
            style={{
              border: "1.5px solid #D4A574",
              backgroundColor: "transparent",
              color: "#D4A574",
            }}
            onClick={handleWebChat}
          >
            <Globe className="mr-2 h-4 w-4" />
            {t.webchatCta}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{t.modalTitle}</DialogTitle>
            <DialogDescription>{t.modalDescription}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="phone">{t.phoneLabel}</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">{t.nameLabel}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <DialogFooter>
              <Button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: "#25D366", color: "white" }}
                className="w-full"
              >
                {submitting ? t.loadingBtn : t.continueBtn}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
