import { headers } from "next/headers"
import { after } from "next/server"
import { ReferralLanding } from "./referral-landing"
import { kvEnabled, kvGet, kvSet } from "@/lib/kv"

export const dynamic = "force-dynamic"
export const revalidate = 0

type PartnerData = {
  code: string
  name: string
  headline: string | null
  message_template?: string | null
  active: boolean
}

const CLICK_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days

async function fetchPartnerFromCRM(code: string): Promise<PartnerData | null> {
  const crmURL = process.env.CRM_API_URL
  const token = process.env.INTERNAL_API_TOKEN
  if (!crmURL || !token) {
    console.error("[r/[code]] missing CRM_API_URL or INTERNAL_API_TOKEN")
    return null
  }
  try {
    const res = await fetch(
      `${crmURL}/api/internal/partners/by-code/${encodeURIComponent(code)}`,
      {
        headers: { "X-Internal-Token": token },
        cache: "no-store",
      },
    )
    if (!res.ok) return null
    return (await res.json()) as PartnerData
  } catch (err) {
    console.error("[r/[code]] fetch partner failed:", err)
    return null
  }
}

async function fetchPartner(code: string): Promise<PartnerData | null> {
  // KV-first read at the edge — falls back to CRM if the integration is unconfigured
  // or the partner hasn't been mirrored yet (the daily reconcile-partners job could
  // backfill, but the CRM fallback already covers the gap).
  if (kvEnabled()) {
    try {
      const cached = await kvGet<PartnerData>(`partner:${code}`)
      if (cached) return cached
    } catch (err) {
      console.error("[r/[code]] kv get failed:", err)
    }
  }
  return fetchPartnerFromCRM(code)
}

async function postClickToCRM(record: {
  id: string
  code: string
  user_agent: string | null
  ip: string | null
  referer: string | null
  clicked_at: string
}): Promise<void> {
  const crmURL = process.env.CRM_API_URL
  const token = process.env.INTERNAL_API_TOKEN
  if (!crmURL || !token) {
    throw new Error("missing CRM config")
  }
  const res = await fetch(`${crmURL}/api/internal/clicks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Token": token,
    },
    body: JSON.stringify(record),
    cache: "no-store",
    // small budget so a slow CRM doesn't keep the edge worker alive forever
    signal: AbortSignal.timeout(4000),
  })
  if (!res.ok) {
    throw new Error(`CRM ${res.status}`)
  }
}

async function logClick(code: string, h: Headers): Promise<void> {
  const record = {
    id:
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    code,
    user_agent: h.get("user-agent"),
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    referer: h.get("referer"),
    clicked_at: new Date().toISOString(),
  }

  // Outbox: write to KV first so the daily reconcile-clicks job can recover
  // anything that never made it to Postgres. Records are never deleted —
  // the 30d TTL handles cleanup.
  const kvOn = kvEnabled()
  if (kvOn) {
    try {
      await kvSet(
        `click:${record.id}`,
        { ...record, synced: false, attempts: 0 },
        CLICK_TTL_SECONDS,
      )
    } catch (err) {
      console.error("[r/[code]] kv outbox write failed:", err)
    }
  }

  try {
    await postClickToCRM(record)
    if (kvOn) {
      try {
        await kvSet(
          `click:${record.id}`,
          {
            ...record,
            synced: true,
            attempts: 1,
            synced_at: new Date().toISOString(),
          },
          CLICK_TTL_SECONDS,
        )
      } catch (err) {
        // Flag stays as synced=false — reconciler will retry. Drift is detected
        // server-side by Exists(id) so this is safe.
        console.error("[r/[code]] kv flip-to-synced failed:", err)
      }
    }
  } catch (err) {
    console.error("[r/[code]] CRM post failed:", err)
    if (kvOn) {
      try {
        await kvSet(
          `click:${record.id}`,
          {
            ...record,
            synced: false,
            attempts: 1,
            last_error: String(err).slice(0, 200),
          },
          CLICK_TTL_SECONDS,
        )
      } catch (err2) {
        console.error("[r/[code]] kv error-flag write failed:", err2)
      }
    }
  }
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const h = await headers()

  const partner = await fetchPartner(code)

  // Click logging is deferred to after the response is streamed.
  after(async () => {
    await logClick(code, h)
  })

  const fallback: PartnerData = {
    code,
    name: "Concierge",
    headline: null,
    active: true,
  }
  return <ReferralLanding partner={partner ?? fallback} />
}
