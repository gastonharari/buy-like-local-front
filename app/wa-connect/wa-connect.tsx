"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

// Internal tool: launches Meta's WhatsApp Embedded Signup (Coexistence
// variant) so the business admin can connect the company's own WhatsApp
// number to Cloud API.
//
// Flow:
//   1. The Facebook JS SDK is loaded and FB.init'd with our app id.
//   2. "Connect WhatsApp" calls FB.login with the config_id taken from the
//      URL (?config_id=...) and the coexistence onboarding extras.
//   3. Meta's popup posts a `message` back to this window when signup
//      finishes — that WA_EMBEDDED_SIGNUP payload carries the asset ids
//      (waba_id, and phone_number_id when present). We render it verbatim.
//   4. The FB.login callback returns an authorization `code` to exchange
//      server-side for a business token. Shown with a do-not-share warning.
//
// English only + outside lib/translations.ts on purpose: internal operator
// tool, not marketing copy (same rationale as /privacy).

const FB_APP_ID = "809120058372328"
const FB_SDK_URL = "https://connect.facebook.net/en_US/sdk.js"
const FB_SDK_VERSION = "v21.0"

// Session-info messages are only trusted from Facebook's own origins.
const FB_MESSAGE_ORIGINS = ["https://www.facebook.com", "https://web.facebook.com"]

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
  data?: {
    waba_id?: string
    phone_number_id?: string
    [key: string]: unknown
  }
  [key: string]: unknown
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

export default function WaConnect() {
  const searchParams = useSearchParams()
  const configId = searchParams.get("config_id")

  const [sdkReady, setSdkReady] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [signupPayload, setSignupPayload] = useState<WaSignupMessage | null>(null)
  const [loginResponse, setLoginResponse] = useState<FbLoginResponse | null>(null)

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
        if (data.type === "WA_EMBEDDED_SIGNUP") {
          setSignupPayload(data)
        }
      } catch {
        // Non-JSON messages from facebook.com are unrelated — ignore.
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  const launchSignup = useCallback(() => {
    if (!configId) return
    if (!window.FB) {
      setStatus("Facebook SDK is not loaded yet — wait a moment and try again.")
      return
    }
    setStatus("Waiting for the Meta signup popup to finish…")
    window.FB.login(
      (response: FbLoginResponse) => {
        setLoginResponse(response)
        setStatus(
          response.authResponse?.code
            ? "Signup flow returned an authorization code."
            : "Login callback returned without a code (cancelled or failed).",
        )
      },
      {
        config_id: configId,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "whatsapp_business_app_onboarding",
          sessionInfoVersion: "3",
        },
      },
    )
  }, [configId])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-3xl px-4 py-12 space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-primary">
            Concierge — internal tool
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">Connect WhatsApp to Cloud API</h1>
          <p className="text-muted-foreground leading-relaxed">
            Launches Meta&apos;s Embedded Signup (Coexistence) for the business WhatsApp
            number. Run this signed in to Facebook as the business admin. The asset ids
            returned below are what the backend needs.
          </p>
        </header>

        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          {configId ? (
            <p className="text-sm text-muted-foreground">
              Using configuration{" "}
              <code className="rounded bg-background px-1.5 py-0.5 font-mono text-primary">
                {configId}
              </code>
            </p>
          ) : (
            <p className="text-sm text-primary">
              Missing <code className="font-mono">config_id</code>. Open this page as{" "}
              <code className="font-mono">/wa-connect?config_id=&lt;configuration id&gt;</code>{" "}
              using the Embedded Signup configuration id from the Meta app dashboard.
            </p>
          )}

          <button
            type="button"
            onClick={launchSignup}
            disabled={!configId}
            className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Connect WhatsApp
          </button>

          <p className="text-xs text-muted-foreground">
            {sdkReady ? "Facebook SDK loaded." : "Loading Facebook SDK…"}
            {status ? ` ${status}` : ""}
          </p>
        </section>

        {signupPayload && (
          <section className="rounded-lg border border-primary/40 bg-card p-6 space-y-4">
            <h2 className="text-xl font-bold">Session info (WA_EMBEDDED_SIGNUP)</h2>
            <dl className="grid gap-2 text-sm">
              <div className="flex flex-wrap gap-2">
                <dt className="text-muted-foreground">event:</dt>
                <dd className="font-mono text-primary">
                  {signupPayload.event ?? "(absent)"}
                  {signupPayload.event !== "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING" &&
                    " — expected FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING"}
                </dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="text-muted-foreground">waba_id:</dt>
                <dd className="font-mono text-primary">
                  {signupPayload.data?.waba_id ?? "(absent)"}
                </dd>
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className="text-muted-foreground">phone_number_id:</dt>
                <dd className="font-mono text-primary">
                  {signupPayload.data?.phone_number_id ??
                    "(absent — normal for the coexistence FINISH event)"}
                </dd>
              </div>
            </dl>
            <pre className="overflow-x-auto rounded bg-background p-4 text-xs leading-relaxed">
              {JSON.stringify(signupPayload, null, 2)}
            </pre>
          </section>
        )}

        {loginResponse && (
          <section className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-xl font-bold">FB.login response</h2>
            {loginResponse.authResponse?.code && (
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">code: </span>
                  <span className="break-all font-mono text-primary">
                    {loginResponse.authResponse.code}
                  </span>
                </p>
                <p className="text-xs text-primary">
                  Do not share this code — it can be exchanged for a business access
                  token. Use it server-side right away; it expires in minutes.
                </p>
              </div>
            )}
            <pre className="overflow-x-auto rounded bg-background p-4 text-xs leading-relaxed">
              {JSON.stringify(loginResponse, null, 2)}
            </pre>
          </section>
        )}
      </main>
    </div>
  )
}
