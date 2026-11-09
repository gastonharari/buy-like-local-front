// Ad-platform tag IDs. All come from environment variables (set in Vercel, never committed) and
// each tag simply doesn't load while its variable is empty. Values are pattern-checked because
// they are interpolated into inline <script>s — a malformed value disables the tag instead of
// injecting anything. See docs/operations.md "Ad tags".
//
// NEXT_PUBLIC_* must be read with the literal `process.env.NEXT_PUBLIC_…` expression so Next can
// inline them at build time; changing one needs a redeploy.

function pick(value: string | undefined, pattern: RegExp): string | null {
  const v = value?.trim()
  return v && pattern.test(v) ? v : null
}

/** Google Ads tag ("AW-123456789"). Configured on the existing gtag.js next to GA4. */
export const GOOGLE_ADS_ID = pick(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, /^AW-\d{6,15}$/)

/** Label of the Google Ads conversion action "whatsapp_click" (the part after the slash). */
export const GOOGLE_ADS_WHATSAPP_LABEL = pick(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL,
  /^[A-Za-z0-9_-]{1,64}$/,
)

/** ChatGPT Ads Measurement Pixel id (OpenAI Ads Manager → Conversions). Given by session 4. */
export const OPENAI_PIXEL_ID = pick(process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID, /^[A-Za-z0-9_-]{1,128}$/)

/** Bing Webmaster Tools `msvalidate.01` content. Server-only: read in app/layout.tsx metadata. */
export function bingVerification() {
  const code = pick(process.env.BING_SITE_VERIFICATION, /^[A-Za-z0-9]{8,64}$/)
  return code ? { other: { "msvalidate.01": code } } : undefined
}

/** One extra gtag line for app/layout.tsx's GA4 inline script; empty without an Ads id. */
export function googleAdsConfigLine(): string {
  return GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""
}

/** Custom-event name shared by GA4, the Google Ads conversion and the OpenAI pixel. */
export const WHATSAPP_CLICK_EVENT = "whatsapp_click"

/**
 * Reports a WhatsApp-button tap as a conversion to Google Ads and to the ChatGPT Ads pixel.
 * Called by trackEvent("whatsapp_click", …); each platform is skipped while its id is missing.
 */
export function reportWhatsAppConversion(): void {
  if (typeof window === "undefined") return
  try {
    if (GOOGLE_ADS_ID && GOOGLE_ADS_WHATSAPP_LABEL) {
      window.gtag?.("event", "conversion", {
        send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_WHATSAPP_LABEL}`,
      })
    }
    if (OPENAI_PIXEL_ID) {
      window.oaiq?.("measure", "custom", { type: "custom" }, { custom_event_name: WHATSAPP_CLICK_EVENT })
    }
  } catch {
    // a tag error must never block the WhatsApp link
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    oaiq?: (...args: unknown[]) => void
  }
}
