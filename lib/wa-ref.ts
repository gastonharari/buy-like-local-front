// WhatsApp reference code ("ref") — which channel a WhatsApp conversation came from.
//
// Every WhatsApp button on the site pre-fills a natural sentence in the page's language and, when we
// know the channel, appends " (ref XX)" or " (ref GS-7K2Q)". The CRM parses that suffix from the
// traveler's first message (regex `(?i)\(ref\s+([a-z]{2})(?:-([a-z0-9]+))?\)`) and attributes the
// conversation. Contract: campaigns/2026-11-08/contrato-api-clicks.md (§6 browser side, §7 the ref).
//
// Two records live in localStorage, both for 90 days:
//   - the paid click (`concierge-click`): written when a page is opened with gclid / gbraid / wbraid,
//     POSTed once to /api/clicks to get a short code ("GS-7K2Q"); retried on the next page load
//     with the same click_id until it gets one.
//   - the channel (`concierge-channel`): the last utm_source (+ utm_campaign for creators), kept
//     while the visitor moves between pages; a new utm_source in the URL replaces it.
//
// The CRM decides the prefix of the code (contract §3); the browser only maps utm_source to the
// fixed refs that need no code. Every storage access is wrapped: Safari private mode and blocked
// storage throw, and a broken ref must never break a WhatsApp button — worst case it has no ref.

export const WA_NUMBER = "5491158637341"

export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000
export const CLICKS_ENDPOINT = "/api/clicks"
export const CLICKS_TIMEOUT_MS = 3000

/** Dispatched on `window` whenever the stored click or channel changes. */
export const ATTRIBUTION_EVENT = "concierge-attribution"

const CLICK_KEY = "concierge-click"
const CHANNEL_KEY = "concierge-channel"

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const
const PAID_KEYS = ["gclid", "gbraid", "wbraid"] as const
type UtmKey = (typeof UTM_KEYS)[number]
type PaidKey = (typeof PAID_KEYS)[number]

const FIELD_MAX = 256
const LANDING_URL_MAX = 2048

/** Contract §4: the code the CRM returns. Anything else is ignored. */
export const CLICK_CODE_RE = /^(GS|CA)-[2-9A-HJKMNP-TV-Z]{4}$/

export type StoredClick = {
  click_id: string
  landing_url: string
  landed_at: string
  code?: string
  /** Set when the CRM answered 400/422: the same body will never succeed, so stop retrying. */
  rejected?: boolean
  expires_at: number
} & Partial<Record<PaidKey | UtmKey, string>>

export type StoredChannel = {
  utm_source: string
  utm_campaign?: string
  expires_at: number
}

// ─── Pure helpers (no browser APIs — unit-tested in e2e/wa-ref.spec.ts) ─────────────────────────

/** Contract §6.6: utm_campaign upper-cased, accents removed, only A-Z0-9, at most 20 chars. */
export function creatorName(campaign: string | undefined | null): string {
  return (campaign ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20)
}

/** The fixed ref for a utm_source (contract §6.5). `null` = no ref. */
export function refForSource(
  source: string | undefined | null,
  campaign?: string | null,
): string | null {
  switch ((source ?? "").trim().toLowerCase()) {
    case "google":
      return "GS"
    case "chatgpt_ads":
      return "CA"
    case "chatgpt.com":
      return "CO"
    case "instagram":
      return "IG"
    case "creator": {
      const name = creatorName(campaign)
      return name ? `CR-${name}` : "CR"
    }
    default:
      return null
  }
}

/**
 * Contract §6.5, in order: a stored paid click with a code → that code; a stored paid click
 * without a code → "GS"; otherwise the channel's fixed ref; otherwise no ref.
 */
export function resolveRef(
  click: Pick<StoredClick, "code"> | null,
  channel: Pick<StoredChannel, "utm_source" | "utm_campaign"> | null,
): string | null {
  if (click) return click.code && CLICK_CODE_RE.test(click.code) ? click.code : "GS"
  if (channel) return refForSource(channel.utm_source, channel.utm_campaign)
  return null
}

/** "<natural sentence> (ref XX)" — or the sentence alone when there is no ref. */
export function appendRef(message: string, ref: string | null): string {
  return ref ? `${message} (ref ${ref})` : message
}

/** wa.me deep link with the pre-filled message. */
export function whatsappUrl(message: string, ref: string | null = null): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(appendRef(message, ref))}`
}

/**
 * Appends the ref to the `text` of an existing wa.me URL (the hand-written links in
 * lib/translations.ts). Returns the URL untouched when there is no ref or it can't be parsed.
 */
export function withRef(waUrl: string, ref: string | null): string {
  if (!ref) return waUrl
  try {
    const url = new URL(waUrl)
    const text = url.searchParams.get("text") ?? ""
    return `${url.origin}${url.pathname}?text=${encodeURIComponent(appendRef(text, ref))}`
  } catch {
    return waUrl
  }
}

/** RFC 4122 v4. `crypto.randomUUID` only exists in secure contexts (https / localhost). */
export function uuidv4(): string {
  const c = globalThis.crypto
  if (typeof c?.randomUUID === "function") return c.randomUUID()
  const b = new Uint8Array(16)
  c.getRandomValues(b)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("")
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

/** Body of POST /api/clicks (contract §2). Long optional fields are cut to the contract's limits. */
export function clickPayload(click: StoredClick): Record<string, string> {
  const body: Record<string, string> = {
    click_id: click.click_id,
    landing_url: click.landing_url.slice(0, LANDING_URL_MAX),
    landed_at: click.landed_at,
  }
  // Click ids go as they came (a cut gclid is useless for offline conversions; the CRM 400s it).
  for (const k of PAID_KEYS) if (click[k]) body[k] = click[k] as string
  for (const k of UTM_KEYS) if (click[k]) body[k] = (click[k] as string).slice(0, FIELD_MAX)
  return body
}

// ─── Storage ─────────────────────────────────────────────────────────────────────────────────────

function readJSON<T extends { expires_at: number }>(key: string, now: number): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const value = JSON.parse(raw) as T
    if (typeof value?.expires_at !== "number" || value.expires_at <= now) {
      window.localStorage.removeItem(key)
      return null
    }
    return value
  } catch {
    return null
  }
}

function write(key: string, value: unknown | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage blocked or full — the button just goes without a ref
  }
}

function emitChange() {
  try {
    window.dispatchEvent(new Event(ATTRIBUTION_EVENT))
  } catch {
    // ignore
  }
}

export function readClick(now = Date.now()): StoredClick | null {
  const click = readJSON<StoredClick>(CLICK_KEY, now)
  return click && typeof click.click_id === "string" ? click : null
}

export function readChannel(now = Date.now()): StoredChannel | null {
  const channel = readJSON<StoredChannel>(CHANNEL_KEY, now)
  return channel && typeof channel.utm_source === "string" ? channel : null
}

/** The ref the WhatsApp buttons should carry right now. */
export function currentRef(now = Date.now()): string | null {
  if (typeof window === "undefined") return null
  return resolveRef(readClick(now), readChannel(now))
}

/**
 * Reads the landing URL and updates the stored click / channel (contract §6.1 and §6.4).
 * - gclid / gbraid / wbraid present: a different click id replaces the stored click (new
 *   click_id); the same one keeps it, code included.
 * - utm_source present: replaces the channel. Without a paid click id, a non-Google channel also
 *   drops the stored Google click — the newest touch wins (a later Google landing keeps it).
 * - neither: nothing changes, so the channel survives navigation between pages.
 */
export function captureAttribution(href: string, now = Date.now()): void {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return
  }
  const params = url.searchParams
  const get = (k: string) => params.get(k)?.trim() || undefined

  const paid: Partial<Record<PaidKey, string>> = {}
  for (const k of PAID_KEYS) {
    const v = get(k)
    if (v) paid[k] = v
  }
  const utm: Partial<Record<UtmKey, string>> = {}
  for (const k of UTM_KEYS) {
    const v = params.get(k) // raw, as the contract asks; the CRM lower-cases when comparing
    if (v && v.trim()) utm[k] = v
  }
  const hasPaid = Object.keys(paid).length > 0
  let changed = false

  if (hasPaid) {
    const stored = readClick(now)
    const same =
      stored !== null && PAID_KEYS.every((k) => (stored[k] ?? undefined) === (paid[k] ?? undefined))
    if (!same) {
      const click: StoredClick = {
        click_id: uuidv4(),
        ...paid,
        ...utm,
        landing_url: `${url.pathname}${url.search}`,
        landed_at: new Date(now).toISOString(),
        expires_at: now + ATTRIBUTION_TTL_MS,
      }
      write(CLICK_KEY, click)
      changed = true
    }
  }

  if (utm.utm_source) {
    const channel: StoredChannel = {
      utm_source: utm.utm_source,
      ...(utm.utm_campaign ? { utm_campaign: utm.utm_campaign } : {}),
      expires_at: now + ATTRIBUTION_TTL_MS,
    }
    write(CHANNEL_KEY, channel)
    changed = true
    if (!hasPaid && refForSource(utm.utm_source) !== "GS" && readClick(now)) {
      write(CLICK_KEY, null)
    }
  }

  if (changed) emitChange()
}

let inflight: Promise<void> | null = null

/**
 * POSTs the stored click to /api/clicks if it has no code yet (contract §6.2–6.3). Called on
 * every page load; one request at a time per tab. A failure leaves the click as it is, so the
 * next page load retries with the same click_id (the CRM answers 200 + the original code).
 */
export function syncClick(fetchImpl: typeof fetch = fetch, now = Date.now()): Promise<void> {
  if (inflight) return inflight
  inflight = doSync(fetchImpl, now).finally(() => {
    inflight = null
  })
  return inflight
}

async function doSync(fetchImpl: typeof fetch, now: number): Promise<void> {
  const click = readClick(now)
  if (!click || click.code || click.rejected) return

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), CLICKS_TIMEOUT_MS)
  try {
    const res = await fetchImpl(CLICKS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clickPayload(click)),
      signal: controller.signal,
    })
    const latest = readClick()
    if (!latest || latest.click_id !== click.click_id) return // replaced meanwhile
    if (res.ok) {
      const json = (await res.json().catch(() => null)) as { code?: unknown } | null
      if (typeof json?.code === "string" && CLICK_CODE_RE.test(json.code)) {
        write(CLICK_KEY, { ...latest, code: json.code })
        emitChange()
      }
    } else if (res.status === 400 || res.status === 422) {
      write(CLICK_KEY, { ...latest, rejected: true })
    }
  } catch {
    // network error, timeout or CRM down — retry on the next page load
  } finally {
    clearTimeout(timer)
  }
}
