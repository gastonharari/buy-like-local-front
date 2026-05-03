"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const API_URL = "https://s2xovhuoq0.execute-api.us-east-1.amazonaws.com/prod"

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      router.replace("/")
      return
    }
    let cancelled = false
    fetch(`${API_URL}/api/payments/paypal/capture?token=${encodeURIComponent(token)}`, {
      method: "POST",
    }).catch((err) => {
      console.error("payment capture failed", err)
    })
    const timer = setTimeout(() => {
      if (!cancelled) router.replace("/")
    }, 6000)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [token, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">¡Pago confirmado!</h1>
        <p className="text-base text-foreground/70">Te llevamos al inicio en unos segundos…</p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
