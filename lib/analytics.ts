import { WHATSAPP_CLICK_EVENT, reportWhatsAppConversion } from "@/lib/marketing"

export function trackEvent(event: string, params?: Record<string, string>) {
  if (typeof window === "undefined") return
  if (window.gtag) {
    window.gtag("event", event, params)
  }
  // Every WhatsApp button already fires this GA4 event, so this is the single place that also
  // reports it as a conversion to Google Ads and the ChatGPT Ads pixel (lib/marketing.ts).
  if (event === WHATSAPP_CLICK_EVENT) {
    reportWhatsAppConversion()
  }
}
