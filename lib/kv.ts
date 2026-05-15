// Thin client around the Vercel KV REST API. Vercel injects
// KV_REST_API_URL and KV_REST_API_TOKEN automatically once the KV
// integration is connected to the project; locally these are unset
// and every method becomes a no-op so dev keeps working.

type Json = unknown

const URL_BASE = process.env.KV_REST_API_URL?.replace(/\/$/, "") ?? ""
const TOKEN = process.env.KV_REST_API_TOKEN ?? ""

export const kvEnabled = (): boolean => !!URL_BASE && !!TOKEN

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  }
}

export async function kvSet(
  key: string,
  value: Json,
  ttlSeconds?: number,
): Promise<void> {
  if (!kvEnabled()) return
  const url = ttlSeconds
    ? `${URL_BASE}/set/${encodeURIComponent(key)}?EX=${ttlSeconds}`
    : `${URL_BASE}/set/${encodeURIComponent(key)}`
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(value),
    cache: "no-store",
  })
  if (!res.ok) {
    throw new Error(`kv set ${key}: ${res.status} ${await res.text()}`)
  }
}

export async function kvGet<T = unknown>(key: string): Promise<T | null> {
  if (!kvEnabled()) return null
  const res = await fetch(`${URL_BASE}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
  })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`kv get ${key}: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { result: string | null }
  if (data.result == null) return null
  // Stored values are JSON strings.
  try {
    return JSON.parse(data.result) as T
  } catch {
    return data.result as unknown as T
  }
}
