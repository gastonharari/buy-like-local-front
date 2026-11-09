// FAQ items for the guide pages and the /en/faq, /pt/faq hubs, and the FAQPage JSON-LD built from
// them. The visible text and the JSON-LD come from the same object, so they can't drift apart
// (e2e/faq-jsonld.spec.ts checks it against the rendered page anyway).

export const SITE_URL = "https://www.concierge.com.ar"

export type FaqItem = {
  /** Stable anchor id: /en/faq#<id>. Same id in EN and PT. */
  id: string
  q: string
  /** The direct answer: first one or two sentences, 40–60 words, no selling. */
  answer: string
  /** Optional detail after the answer. */
  detail?: string
  /** "The page that explains it". Dropped automatically on that same page. */
  link?: { href: string; label: string }
  /**
   * Note for Gastón with what still needs confirming ("TODO(gaston): …"). NEVER rendered: the
   * visible answer is an interim one that is safe to publish as it is. Grep "TODO(gaston)".
   */
  todo?: string
}

/**
 * Publish guard: an item whose visible text contains "TODO" is not rendered nor put in the
 * JSON-LD, so a half-edited answer can never reach a visitor or a crawler.
 */
export function isPublishable(item: FaqItem): boolean {
  return ![item.q, item.answer, item.detail, item.link?.label].some((t) => t?.includes("TODO"))
}

/** The items as they render on `path`: publishable only, self-links removed. */
export function faqForPage(items: FaqItem[], path: string): FaqItem[] {
  return items.filter(isPublishable).map((item) => {
    if (!item.link || item.link.href.split("#")[0] !== path) return item
    const { link: _selfLink, ...rest } = item
    return rest
  })
}

/** The answer paragraph as it is shown: answer + detail. */
export function answerBody(item: FaqItem): string {
  return item.detail ? `${item.answer} ${item.detail}` : item.answer
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

/**
 * Answer text for the JSON-LD: the same visible text, with the link as an <a> (Google allows
 * links in Answer.text). Stripping the tags gives back exactly what the page shows.
 */
export function answerHtml(item: FaqItem): string {
  const body = escapeHtml(answerBody(item))
  if (!item.link) return body
  return `${body} <a href="${SITE_URL}${item.link.href}">${escapeHtml(item.link.label)}</a>`
}

export function faqPageSchema(items: FaqItem[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${SITE_URL}${path}`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: answerHtml(item) },
    })),
  }
}

/**
 * Claims that must not reach structured data until Gastón confirms them (session-1 brief: "nada de
 * PayPal"). Questions that mention them stay visible on the page — that copy is his call — but are
 * left out of the JSON-LD, which ChatGPT and search engines quote.
 */
export const UNCONFIRMED_CLAIMS = /paypal/i

/**
 * FAQPage for plain {q, a} pairs (the home page's accordion in lib/translations.ts), minus the
 * questions that mention an UNCONFIRMED_CLAIMS term.
 */
export function plainFaqPageSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.filter((item) => !UNCONFIRMED_CLAIMS.test(`${item.q} ${item.a}`)).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }
}
