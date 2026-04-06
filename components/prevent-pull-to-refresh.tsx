"use client"

import { useEffect } from "react"

export function PreventPullToRefresh() {
  useEffect(() => {
    let startY = 0
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const onMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && e.touches[0].clientY > startY) {
        e.preventDefault()
      }
    }
    document.addEventListener("touchstart", onStart, { passive: true })
    document.addEventListener("touchmove", onMove, { passive: false })
    return () => {
      document.removeEventListener("touchstart", onStart)
      document.removeEventListener("touchmove", onMove)
    }
  }, [])
  return null
}
