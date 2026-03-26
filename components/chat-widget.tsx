"use client"

import { useEffect, useState } from "react"
import { MessageCircle, X } from "lucide-react"

const CHAT_URL =
  process.env.NEXT_PUBLIC_CHAT_URL ?? "https://concierge-crm.vercel.app/chat"

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [pulsing, setPulsing] = useState(true)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("open-chat", handler)
    return () => window.removeEventListener("open-chat", handler)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setPulsing(false), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {/* Iframe popup */}
      <div
        aria-hidden={!open}
        className="fixed bottom-[92px] right-6 z-50 w-[380px] h-[520px] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 transition-all duration-200"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(12px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <iframe
          src={CHAT_URL}
          className="w-full h-full border-none"
          allow="clipboard-write"
          title="Concierge Chat"
        />
      </div>

      {/* Floating button + label */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!open && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg pointer-events-none"
            style={{ background: "#112E2F", color: "#D4A574", border: "1px solid rgba(212,165,116,0.3)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D4A574" }} />
            Chat with us
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open chat"}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-110 focus:outline-none ${pulsing && !open ? "animate-pulse" : ""}`}
          style={{ backgroundColor: "#D4A574", color: "#0D0D0D" }}
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
        </button>
      </div>
    </>
  )
}
