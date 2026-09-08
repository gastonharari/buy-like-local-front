"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

// Internal tool: launches Meta's WhatsApp Embedded Signup (Coexistence
// variant) so the business admin can connect the company's own WhatsApp
// number — the one living in the WhatsApp Business app on the phone — to
// Cloud API, and hands the result to the CRM backend.
//
// Flow:
//   1. The Facebook JS SDK is loaded and FB.init'd with our app id.
//   2. "Connect WhatsApp" calls FB.login with the config_id (env or URL) and
//      the coexistence extras (featureType whatsapp_business_app_onboarding).
//   3. Meta's popup posts `message` events back to this window while the
//      flow runs; the last one, FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING,
//      carries the waba_id (and phone_number_id when present).
//   4. The FB.login callback returns an authorization `code` (30-second TTL).
//      It's sent right away, together with the ids, to
//      POST {CRM_API}/api/internal/whatsapp/onboarding, which exchanges it
//      for a business token, subscribes the app to the WABA and requests
//      the contacts + history sync. See concierge-crm docs/whatsapp.md.
//
// The internal API token is typed by the operator and kept in memory only.
//
// English only + outside lib/translations.ts on purpose: internal operator
// tool, not marketing copy (same rationale as /privacy).

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID ?? "809120058372328"
const FB_SDK_URL = "https://connect.facebook.net/en_US/sdk.js"
// Keep in sync with graphAPIVersion in the backend (internal/whatsapp/meta/graph.go).
const FB_SDK_VERSION = "v24.0"
const CRM_API_URL = (process.env.NEXT_PUBLIC_CRM_API_URL ?? "https://s2xovhuoq0.execute-api.us-east-1.amazonaws.com/prod").replace(/\/$/, "")
const ENV_CONFIG_ID = process.env.NEXT_PUBLIC_WA_CONFIG_ID ?? ""

// Session-info messages are only trusted from Facebook's own origins.
const FB_MESSAGE_ORIGINS = ["https://www.facebook.com", "https://web.facebook.com"]

const COEXISTENCE_FINISH = "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING"

interface FbLoginResponse {
  status?: string
  authResponse?: {
    code?: string
    [key: string]: unknown
  } | null
  [key: string]: unknown
}

interface WaSignupMessage {
  type: string
  event?: string
  version?: number
  data?: {
    waba_id?: string
    phone_number_id?: string
    business_id?: string
    current_step?: string
    error_message?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

interface OnboardingResult {
  token_source?: string
  token_expires_in_seconds?: number
  waba_id?: string
  phone_number_id?: string
  display_phone_number?: string
  platform_type?: string
  is_on_biz_app?: boolean
  subscribed?: boolean
  contacts_sync_request_id?: string
  history_sync_request_id?: string
  warnings?: string[]
  error?: string
  step?: string
  meta_code?: number
}

// Minimal FB SDK surface — declared here instead of pulling in a types dep.
declare global {
  interface Window {
    FB?: {
      init: (options: {
        appId: string
        autoLogAppEvents?: boolean
        xfbml?: boolean
        version: string
      }) => void
      login: (
        callback: (response: FbLoginResponse) => void,
        options?: Record<string, unknown>,
      ) => void
    }
    fbAsyncInit?: () => void
  }
}

type LogLine = { ts: string; label: string; body: string }

export default function WaConnect() {
  const searchParams = useSearchParams()
  const configId = searchParams.get("config_id") ?? ENV_CONFIG_ID

  const [sdkReady, setSdkReady] = useState(false)
  const [status, setStatus] = useState<{ text: string; tone: "info" | "ok" | "err" } | null>(null)
  const [internalToken, setInternalToken] = useState("")
  const [signupPayload, setSignupPayload] = useState<WaSignupMessage | null>(null)
  const [pendingCode, setPendingCode] = useState<string | null>(null)
  const [result, setResult] = useState<OnboardingResult | null>(null)
  const [sending, setSending] = useState(false)
  const [log, setLog] = useState<LogLine[]>([])

  // The message listener and the login callback both need the latest
  // session info / token without re-subscribing — refs, not state closures.
  const signupRef = useRef<WaSignupMessage | null>(null)
  const tokenRef = useRef("")
  tokenRef.current = internalToken

  const appendLog = useCallback((label: string, body: unknown) => {
    const line: LogLine = {
      ts: new Date().toISOString().slice(11, 19),
      label,
      body: typeof body === "string" ? body : JSON.stringify(body, null, 2),
    }
    setLog((prev) => [...prev, line])
    console.log("[wa-connect]", label, body)
  }, [])

  // Load the Facebook JS SDK once and init it.
  useEffect(() => {
    if (window.FB) {
      setSdkReady(true)
      return
    }
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: FB_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: FB_SDK_VERSION,
      })
      setSdkReady(true)
    }
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script")
      script.id = "facebook-jssdk"
      script.src = FB_SDK_URL
      script.async = true
      script.defer = true
      script.crossOrigin = "anonymous"
      document.body.appendChild(script)
    }
  }, [])

  // Session-info listener — this is what actually returns the asset ids.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!FB_MESSAGE_ORIGINS.includes(event.origin)) return
      try {
        const data: WaSignupMessage = JSON.parse(event.data)
        if (data.type !== "WA_EMBEDDED_SIGNUP") return
        signupRef.current = data
        setSignupPayload(data)
        appendLog(`WA_EMBEDDED_SIGNUP · ${data.event ?? "(no event)"}`, data)
        if (data.event === COEXISTENCE_FINISH) {
          setStatus({ text: `Flow finished (coexistence). waba_id=${data.data?.waba_id ?? "?"} — waiting for the authorization code…`, tone: "ok" })
        } else if (data.event === "FINISH" || data.event === "FINISH_ONLY_WABA") {
          setStatus({ text: `Flow finished with event ${data.event}, NOT the coexistence one. The number was NOT connected in coexistence mode — do not send the code. Check the featureType / configuration.`, tone: "err" })
        } else if (data.event === "CANCEL") {
          setStatus({ text: `Flow abandoned at step: ${data.data?.current_step ?? "?"}`, tone: "err" })
        } else if (data.event === "ERROR") {
          setStatus({ text: `Meta reported an error: ${data.data?.error_message ?? JSON.stringify(data.data)}`, tone: "err" })
        }
      } catch {
        // Non-JSON messages from facebook.com are unrelated — ignore.
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [appendLog])

  const sendToBackend = useCallback(async (body: Record<string, unknown>, label: string) => {
    const token = tokenRef.current.trim()
    if (!token) {
      setStatus({ text: "Missing internal API token — paste it and retry.", tone: "err" })
      return
    }
    setSending(true)
    setStatus({ text: `${label}…`, tone: "info" })
    appendLog(`POST ${CRM_API_URL}/api/internal/whatsapp/onboarding`, { ...body, code: body.code ? "(sent)" : undefined })
    try {
      const res = await fetch(`${CRM_API_URL}/api/internal/whatsapp/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Internal-Token": token },
        body: JSON.stringify(body),
      })
      const json = (await res.json().catch(() => ({ error: `HTTP ${res.status} without a JSON body` }))) as OnboardingResult
      setResult(json)
      appendLog(`backend ${res.status}`, json)
      if (res.ok) {
        const syncNote = json.history_sync_request_id
          ? "history + contacts sync requested"
          : "subscribed — check the warnings for the sync"
        setStatus({ text: `✅ Onboarding done: ${json.display_phone_number ?? json.phone_number_id} on WABA ${json.waba_id} — ${syncNote}.`, tone: "ok" })
        setPendingCode(null)
      } else {
        setStatus({ text: `❌ Backend answered ${res.status}${json.step ? ` at step ${json.step}` : ""}: ${json.error ?? "unknown error"}`, tone: "err" })
      }
    } catch (err) {
      setStatus({ text: `❌ Could not reach the backend: ${String(err)}`, tone: "err" })
    } finally {
      setSending(false)
    }
  }, [appendLog])

  const fbLoginCallback = useCallback((response: FbLoginResponse) => {
    appendLog("FB.login response", { status: response.status, hasCode: Boolean(response.authResponse?.code) })
    const code = response.authResponse?.code
    if (!code) {
      setStatus({ text: "The popup closed without an authorization code (cancelled, or Meta returned an error — see the events).", tone: "err" })
      return
    }
    setPendingCode(code)
    // The session-info message normally lands before this callback; give it
    // a beat if it hasn't, then send regardless — the backend can discover
    // the WABA from the token when waba_id is missing, and the code only
    // lives 30 seconds.
    const trySend = (attempt: number) => {
      const info = signupRef.current
      if (info?.event === COEXISTENCE_FINISH || attempt >= 4) {
        if (info && info.event !== COEXISTENCE_FINISH) {
          setStatus({ text: `Got a code, but the flow ended with ${info.event ?? "no event"} instead of ${COEXISTENCE_FINISH}. Not sending automatically — use "Send code anyway" only if you know why.`, tone: "err" })
          return
        }
        void sendToBackend({ code, waba_id: info?.data?.waba_id ?? "", phone_number_id: info?.data?.phone_number_id ?? "" }, "Exchanging the code and subscribing the WABA")
        return
      }
      setTimeout(() => trySend(attempt + 1), 500)
    }
    trySend(0)
  }, [appendLog, sendToBackend])

  const launchSignup = useCallback(() => {
    if (!configId) return
    if (!window.FB) {
      setStatus({ text: "Facebook SDK is not loaded yet — wait a moment and try again.", tone: "err" })
      return
    }
    setResult(null)
    setPendingCode(null)
    signupRef.current = null
    setSignupPayload(null)
    setStatus({ text: "Waiting for the Meta signup popup to finish…", tone: "info" })
    appendLog("FB.login", { config_id: configId, featureType: "whatsapp_business_app_onboarding", sessionInfoVersion: "3", sdk: FB_SDK_VERSION })
    window.FB.login(fbLoginCallback, {
      config_id: configId,
      response_type: "code",
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: "whatsapp_business_app_onboarding",
        sessionInfoVersion: "3",
      },
    })
  }, [configId, appendLog, fbLoginCallback])

  const resync = useCallback(() => {
    const wabaId = signupRef.current?.data?.waba_id ?? result?.waba_id ?? ""
    if (!wabaId) {
      setStatus({ text: "No waba_id known yet — run the flow first, or paste the WABA id in the URL as ?waba_id=…", tone: "err" })
      return
    }
    void sendToBackend({ waba_id: wabaId, phone_number_id: result?.phone_number_id ?? "" }, "Re-requesting the contacts + history sync with the system-user token")
  }, [result, sendToBackend])

  const canLaunch = Boolean(configId) && internalToken.trim().length > 0 && !sending
  const toneClass = status?.tone === "ok" ? "text-accent" : status?.tone === "err" ? "text-primary" : "text-muted-foreground"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-primary">
            Concierge — internal tool
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">Connect WhatsApp to Cloud API</h1>
          <p className="text-muted-foreground leading-relaxed">
            Launches Meta&apos;s Embedded Signup (Coexistence) for the business WhatsApp number and
            hands the result to the CRM backend, which subscribes the number and requests the
            contacts + history sync. Run this signed in to Facebook as an admin of the Meta app.
          </p>
        </header>

        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          {configId ? (
            <p className="text-sm text-muted-foreground">
              Using configuration{" "}
              <code className="rounded bg-background px-1.5 py-0.5 font-mono text-primary">
                {configId}
              </code>
              {" "}· app <code className="font-mono">{FB_APP_ID}</code> · SDK {FB_SDK_VERSION} · backend{" "}
              <code className="font-mono break-all">{CRM_API_URL}</code>
            </p>
          ) : (
            <p className="text-sm text-primary">
              Missing <code className="font-mono">config_id</code>. Set{" "}
              <code className="font-mono">NEXT_PUBLIC_WA_CONFIG_ID</code> in Vercel or open this page as{" "}
              <code className="font-mono">/wa-connect?config_id=&lt;configuration id&gt;</code>{" "}
              using the Embedded Signup configuration id from the Meta app dashboard.
            </p>
          )}

          <label className="block text-sm text-muted-foreground">
            Internal API token (kept in memory only)
            <input
              type="password"
              autoComplete="off"
              value={internalToken}
              onChange={(e) => setInternalToken(e.target.value)}
              placeholder="X-Internal-Token of the CRM backend"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-foreground"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={launchSignup}
              disabled={!canLaunch}
              className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Connect WhatsApp
            </button>
            <button
              type="button"
              onClick={resync}
              disabled={sending || internalToken.trim().length === 0}
              className="rounded-md border border-primary px-6 py-3 font-semibold text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Re-run sync (no code)
            </button>
            {pendingCode && signupPayload && signupPayload.event !== COEXISTENCE_FINISH && (
              <button
                type="button"
                onClick={() => void sendToBackend({ code: pendingCode, waba_id: signupPayload.data?.waba_id ?? "", phone_number_id: signupPayload.data?.phone_number_id ?? "" }, "Sending the code anyway")}
                disabled={sending}
                className="rounded-md border border-border px-6 py-3 font-semibold text-muted-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Send code anyway
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            {sdkReady ? "Facebook SDK loaded." : "Loading Facebook SDK…"}
          </p>
          {status && <p className={`text-sm font-semibold ${toneClass}`}>{status.text}</p>}

          <div className="rounded-md border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Before clicking</p>
            <p>1. The phone must have WhatsApp Business ≥ 2.24.17 with the number active; every linked device (WhatsApp Web/Desktop) will be unlinked by the flow.</p>
            <p>2. In the popup you must see <em>&quot;connect your existing WhatsApp Business account&quot;</em>. If it shows the regular WABA/number creation instead, close it — the coexistence feature isn&apos;t active for this configuration.</p>
            <p>3. Enter the number → the phone gets a message from the Facebook Business account → <em>Connect to the Business Platform</em> → <em>Confirm</em> (share history) → paste the text code shown by the app into the popup. There is no QR.</p>
            <p>4. When the popup closes, the code is sent automatically; the contacts + history sync must happen within 24 hours of this moment.</p>
          </div>
        </section>

        {result && (
          <section className={`rounded-lg border p-6 space-y-3 bg-card ${result.error ? "border-primary/60" : "border-accent/50"}`}>
            <h2 className="text-xl font-bold">{result.error ? "Backend error" : "Backend result"}</h2>
            {!result.error && (
              <dl className="grid gap-1 text-sm">
                <Row k="waba_id" v={result.waba_id} />
                <Row k="phone_number_id" v={result.phone_number_id} />
                <Row k="number" v={result.display_phone_number} />
                <Row k="platform_type / is_on_biz_app" v={`${result.platform_type ?? "?"} / ${String(result.is_on_biz_app)}`} />
                <Row k="subscribed_apps" v={String(result.subscribed)} />
                <Row k="contacts sync request" v={result.contacts_sync_request_id ?? "(not requested)"} />
                <Row k="history sync request" v={result.history_sync_request_id ?? "(not requested)"} />
                <Row k="token" v={`${result.token_source ?? "?"}${result.token_expires_in_seconds ? ` · expires in ${Math.round(result.token_expires_in_seconds / 86400)} days` : ""}`} />
              </dl>
            )}
            {result.error && (
              <p className="text-sm text-primary">
                step <code className="font-mono">{result.step ?? "?"}</code>
                {result.meta_code ? <> · Meta code <code className="font-mono">{result.meta_code}</code></> : null}: {result.error}
              </p>
            )}
            {result.warnings && result.warnings.length > 0 && (
              <ul className="list-disc pl-5 text-sm text-primary space-y-1">
                {result.warnings.map((w) => <li key={w}>{w}</li>)}
              </ul>
            )}
          </section>
        )}

        {signupPayload && (
          <section className="rounded-lg border border-border bg-card p-6 space-y-3">
            <h2 className="text-xl font-bold">Session info (WA_EMBEDDED_SIGNUP)</h2>
            <dl className="grid gap-1 text-sm">
              <Row k="event" v={`${signupPayload.event ?? "(absent)"}${signupPayload.event !== COEXISTENCE_FINISH ? ` — expected ${COEXISTENCE_FINISH}` : ""}`} />
              <Row k="waba_id" v={signupPayload.data?.waba_id ?? "(absent)"} />
              <Row k="phone_number_id" v={signupPayload.data?.phone_number_id ?? "(absent — normal for the coexistence FINISH event; the backend looks it up)"} />
            </dl>
          </section>
        )}

        <section className="rounded-lg border border-border bg-card p-6 space-y-3">
          <h2 className="text-xl font-bold">Events</h2>
          <pre className="overflow-x-auto rounded bg-background p-4 text-xs leading-relaxed whitespace-pre-wrap break-all min-h-[60px]">
            {log.length === 0 ? "waiting…" : log.map((l) => `[${l.ts}] ${l.label}\n${l.body}`).join("\n\n")}
          </pre>
        </section>
      </main>
    </div>
  )
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <dt className="text-muted-foreground">{k}:</dt>
      <dd className="font-mono text-primary break-all">{v ?? "(absent)"}</dd>
    </div>
  )
}
