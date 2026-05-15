import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RequestBody = {
  phone: string
  name?: string
  code: string
}

export async function POST(req: Request) {
  const crmURL = process.env.CRM_API_URL
  const token = process.env.INTERNAL_API_TOKEN

  if (!crmURL || !token) {
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 })
  }

  let body: RequestBody
  try {
    body = (await req.json()) as RequestBody
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 })
  }

  if (!body.phone?.trim() || !body.code?.trim()) {
    return NextResponse.json({ error: "phone and code are required" }, { status: 400 })
  }

  try {
    const r = await fetch(`${crmURL}/api/internal/users/from-referral`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify({
        phone: body.phone.trim(),
        name: body.name?.trim() ?? "",
        code: body.code.trim(),
        channel: "WHATSAPP",
      }),
      cache: "no-store",
    })
    if (!r.ok) {
      const text = await r.text()
      console.error("[start-whatsapp] CRM error:", r.status, text)
      return NextResponse.json({ error: "service error" }, { status: 502 })
    }
    const data = (await r.json()) as { user_id: string; wa_url: string }
    return NextResponse.json({ wa_url: data.wa_url })
  } catch (err) {
    console.error("[start-whatsapp] fetch failed:", err)
    return NextResponse.json({ error: "service error" }, { status: 502 })
  }
}
