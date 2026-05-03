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
    const run = async () => {
      try {
        await fetch(`${API_URL}/api/payments/paypal/capture?token=${encodeURIComponent(token)}`, {
          method: "POST",
        })
      } catch (err) {
        console.error("payment capture failed", err)
      } finally {
        if (!cancelled) router.replace("/")
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [token, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
        <p className="text-base text-foreground/80">Procesando tu pago…</p>
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
