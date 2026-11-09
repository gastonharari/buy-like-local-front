"use client"

import { useEffect, useState } from "react"
import { ATTRIBUTION_EVENT, currentRef, withRef } from "@/lib/wa-ref"

/**
 * The WhatsApp ref ("GS-7K2Q", "CO", …) for this visitor, or null. It is null during the server
 * render and the first client render (localStorage isn't readable there), then follows every
 * change: the landing capture, the code arriving from /api/clicks, another tab (storage event).
 */
export function useWaRef(): string | null {
  const [ref, setRef] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setRef(currentRef())
    update()
    window.addEventListener(ATTRIBUTION_EVENT, update)
    window.addEventListener("storage", update)
    return () => {
      window.removeEventListener(ATTRIBUTION_EVENT, update)
      window.removeEventListener("storage", update)
    }
  }, [])

  return ref
}

/** A hand-written wa.me link (e.g. `translations[lang].waLink`) with the visitor's ref appended. */
export function useWhatsAppLink(waUrl: string): string {
  return withRef(waUrl, useWaRef())
}
