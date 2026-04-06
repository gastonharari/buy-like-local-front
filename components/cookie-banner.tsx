"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent")
    if (!stored) {
      setVisible(true)
    } else if (stored === "granted") {
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      })
    }
  }, [])

  const accept = () => {
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    })
    localStorage.setItem("cookie_consent", "granted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem("cookie_consent", "denied")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card" style={{ willChange: "transform", touchAction: "pan-y" }}>
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          We use Google Analytics to understand how visitors use this site.{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary hover:text-primary/80"
          >
            Learn more
          </a>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="ghost" onClick={decline} className="text-muted-foreground hover:text-foreground">
            Decline
          </Button>
          <Button size="sm" onClick={accept} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
