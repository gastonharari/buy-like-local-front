import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Server-to-server proxy for /wa-connect: the browser never holds the CRM's
// internal shared secret and there's no cross-origin call to allowlist.
// Reuses CRM_API_URL / INTERNAL_API_TOKEN, already required server env vars
// for the referral flow (see docs/operations.md) — no new config.
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
    const r = await fetch(`${crmURL}/api/internal/whatsapp/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const json = await r.json().catch(() => ({ error: `HTTP ${r.status} without a JSON body` }))
    return NextResponse.json(json, { status: r.status })
  } catch (err) {
    console.error("[wa-onboarding] fetch failed:", err)
    return NextResponse.json({ error: "service error" }, { status: 502 })
  }
}
