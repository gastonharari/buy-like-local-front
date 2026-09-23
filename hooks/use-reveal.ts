"use client"

import { useEffect } from "react"

export function useRevealAll() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]")

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add("is-visible"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

export function usePointerGlow(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
      return
    }

    const el = ref.current
    if (!el) return

    let ticking = false
    let rafId = 0

    const handlePointerMove = (e: PointerEvent) => {
      if (ticking) return
      ticking = true
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`)
        el.style.setProperty("--my", `${e.clientY - rect.top}px`)
        ticking = false
      })
    }

    el.addEventListener("pointermove", handlePointerMove)

    return () => {
      el.removeEventListener("pointermove", handlePointerMove)
      cancelAnimationFrame(rafId)
    }
  }, [ref])
}
