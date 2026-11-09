"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { captureAttribution, syncClick } from "@/lib/wa-ref"

// Mounted once in the root layout. On every page (first load and client-side navigation) it reads
// utm_* / gclid / gbraid / wbraid from the URL into localStorage and, if a paid click is stored
// without a code yet, asks /api/clicks for one. Renders nothing. See lib/wa-ref.ts.
export function AttributionCapture() {
  const pathname = usePathname()

  useEffect(() => {
    captureAttribution(window.location.href)
    void syncClick()
  }, [pathname])

  return null
}
