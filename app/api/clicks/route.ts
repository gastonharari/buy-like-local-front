import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Server-to-server proxy for paid-click codes (leg A of POST /api/clicks — contract in
// campaigns/2026-11-08/contrato-api-clicks.md). The browser POSTs here when it lands with
// gclid / gbraid / wbraid; this forwards the body untouched to the CRM's
// POST /api/internal/ad-clicks with the internal token and returns the CRM's status and JSON as
// they are (201/200 {code, channel, click_id}, 400, 422, 500). Same shape as /api/wa-onboarding:
// the browser never holds INTERNAL_API_TOKEN and the CRM needs no CORS exception.
// Not /api/internal/clicks: that path is the partner-referral click log (docs/referrals.md).
const CRM_TIMEOUT_MS = 3000

export async function POST(req: Request) {
  const crmURL = process.env.CRM_API_URL
  const token = process.env.INTERNAL_API_TOKEN

  if (!crmURL || !token) {
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 })
  }

  try {
    const r = await fetch(`${crmURL}/api/internal/ad-clicks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    })
    const json = await r.json().catch(() => ({ error: `HTTP ${r.status} without a JSON body` }))
    return NextResponse.json(json, { status: r.status })
  } catch (err) {
    // Network error, or the CRM took longer than 3 s (AbortSignal.timeout → TimeoutError).
    console.error("[clicks] fetch failed:", err)
    return NextResponse.json({ error: "service error" }, { status: 502 })
  }
}
