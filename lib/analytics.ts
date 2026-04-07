export function trackEvent(event: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, params)
  }
}
