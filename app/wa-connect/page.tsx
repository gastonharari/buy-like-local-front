import type { Metadata } from "next"
import { Suspense } from "react"
import WaConnect from "./wa-connect"

// /wa-connect — internal one-shot tool that launches Meta's WhatsApp
// Embedded Signup (Coexistence variant) so the business admin can connect
// the company's own WhatsApp number to Cloud API.
//
// Not linked from anywhere and noindexed on purpose: it is an operator
// utility, not a public page. The interactive logic (FB JS SDK, message
// listener) lives in the client component; this server shell exists so the
// route can export metadata (client components can't).

export const metadata: Metadata = {
  title: "WhatsApp Connect — Concierge (internal)",
  robots: { index: false, follow: false },
  // Without this, the page inherits the root layout's canonical (the
  // homepage) — a noindex page pointing its canonical at an indexed one is
  // a conflicting signal search engines warn about. Self-canonical instead.
  alternates: { canonical: "/wa-connect" },
}

export default function WaConnectPage() {
  return (
    // useSearchParams in the client component requires a Suspense boundary
    // (same pattern as /payment-success).
    <Suspense fallback={null}>
      <WaConnect />
    </Suspense>
  )
}
