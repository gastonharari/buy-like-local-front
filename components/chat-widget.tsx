"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, MessageCircle, X } from "lucide-react"
import type { Lang } from "@/lib/translations"

const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL ?? "https://concierge-crm.vercel.app/chat"

const WIDGET_I18N: Record<Lang, { label: string; openInTab: string }> = {
  en: { label: "Chat with us",        openInTab: "Open in new tab" },
  es: { label: "Chateá con nosotros", openInTab: "Abrir en nueva pestaña" },
  pt: { label: "Fale conosco",        openInTab: "Abrir em nova aba" },
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

function playNotificationSound() {
  try {
    const ctx = new AudioContext()
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    const tones = [1046.5, 1318.5]
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = "sine"
      osc.frequency.value = freq
      osc.connect(gain)
      const start = ctx.currentTime + i * 0.12
      gain.gain.setValueAtTime(0.35, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)
      osc.start(start)
      osc.stop(start + 0.22)
    })
    setTimeout(() => ctx.close(), 600)
  } catch { /* AudioContext may be blocked */ }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [pulsing, setPulsing] = useState(true)
  const [unread, setUnread] = useState(false)
  const [lang, setLang] = useState<Lang>("en")
  const [revealed, setRevealed] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setLang(detectLang())
  }, [])

  useEffect(() => {
    function handleLangChange(e: Event) {
      const newLang = (e as CustomEvent<Lang>).detail
      setLang(newLang)
      iframeRef.current?.contentWindow?.postMessage({ type: "set-lang", lang: newLang }, "*")
    }
    window.addEventListener("lang-change", handleLangChange)
    return () => window.removeEventListener("lang-change", handleLangChange)
  }, [])

  useEffect(() => {
    const handler = () => { setOpen(true); setRevealed(true) }
    window.addEventListener("open-chat", handler)
    return () => window.removeEventListener("open-chat", handler)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setPulsing(false), 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (open) {
      const y = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.dataset.scrollLockY = String(y)
    } else {
      const y = parseInt(document.body.dataset.scrollLockY ?? "0", 10)
      document.body.style.overflow = ""
      delete document.body.dataset.scrollLockY
      if (y) window.scrollTo(0, y)
    }
    return () => {
      document.body.style.overflow = ""
      delete document.body.dataset.scrollLockY
    }
  }, [open])

  useEffect(() => {
    let raf: number
    function handleScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        setRevealed(window.scrollY > window.innerHeight * 0.7)
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => { window.removeEventListener("scroll", handleScroll); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type !== "new-message") return
      playNotificationSound()
      setUnread(prev => (!open ? true : prev))
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [open])

  const i18n = WIDGET_I18N[lang]

  return (
    <>
      {/* Backdrop overlay — conditionally rendered to avoid iOS fixed-element scroll blocking */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Popup */}
      <div
        aria-hidden={!open}
        className="fixed right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
        style={{
          bottom: "calc(6rem + env(safe-area-inset-bottom))",
          width: "min(420px, calc(100vw - 48px))",
          background: "#111f20",
          visibility: open ? "visible" : "hidden",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 200ms ease, transform 200ms ease",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,165,116,0.25)",
        }}
      >
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-3 py-2.5 shrink-0"
          style={{ background: "#112E2F", borderBottom: "1px solid rgba(212,165,116,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "#D4A574", color: "#0D0D0D" }}
            >C</span>
            <span className="text-sm font-semibold" style={{ color: "#F5EFE6" }}>Concierge</span>
          </div>
          <a
            href={CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={i18n.openInTab}
            className="flex items-center gap-1 text-xs"
            style={{ color: "#D4A574", transition: "opacity 150ms ease" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>{i18n.openInTab}</span>
          </a>
        </div>

        {/* iframe — height: viewport minus button area (96px) minus toolbar (42px) minus top margin (24px), capped at 560px */}
        <iframe
          ref={iframeRef}
          src={CHAT_URL}
          className="w-full border-none block"
          style={{ height: "min(540px, calc(100dvh - 210px))", minHeight: "300px" }}
          allow="clipboard-write"
          title="Concierge Chat"
          onLoad={() => iframeRef.current?.contentWindow?.postMessage({ type: "set-lang", lang }, "*")}
        />
      </div>

      {/* Floating button + label — hidden until user scrolls past hero */}
      <div
        className="fixed right-6 z-50 flex flex-col items-end gap-2"
        style={{
          bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
          opacity: (revealed || open) ? 1 : 0,
          transform: (revealed || open) ? "translateY(0)" : "translateY(16px)",
          pointerEvents: "none",
          transition: "opacity 300ms ease, transform 300ms ease",
        }}
      >
        {!open && (
          <button
            onClick={() => { setOpen(true); setUnread(false) }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg cursor-pointer"
            style={{ background: "#112E2F", color: "#D4A574", border: "1px solid rgba(212,165,116,0.3)", pointerEvents: (revealed || open) ? "auto" : "none" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D4A574" }} />
            {i18n.label}
          </button>
        )}
        <button
          onClick={() => { setOpen((v) => !v); setUnread(false) }}
          aria-label={open ? "Close chat" : "Open chat"}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full focus:outline-none ${pulsing && !open ? "animate-pulse" : ""}`}
          style={{
            backgroundColor: "#D4A574",
            color: "#0D0D0D",
            boxShadow: "0 4px 20px rgba(212,165,116,0.35)",
            transition: "transform 150ms ease, box-shadow 150ms ease",
            pointerEvents: (revealed || open) ? "auto" : "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(212,165,116,0.5)" }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(212,165,116,0.35)" }}
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
          {unread && !open && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold animate-bounce"
              style={{ background: "#ef4444", color: "#fff" }}
            >!</span>
          )}
        </button>
      </div>
    </>
  )
}
