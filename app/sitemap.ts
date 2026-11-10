import type { MetadataRoute } from "next"
import { GUIDE_PAGES, hreflangPaths } from "@/lib/content/guides"
import { SITE_URL } from "@/lib/faq"

// /sitemap.xml — every public, indexable page with its real last-modified date (not the build
// time: a lastModified that changes on every deploy teaches crawlers to ignore it).
// Left out on purpose: /r/[code] (partner referrals), /track/[id] and /wa-connect (noindex),
// /payment-success (PayPal return page) and the API routes.
//
// Dates: guides and FAQ hubs take `updated` from lib/content/guides.ts. For "/" and "/privacy",
// bump the constant below when the page changes.
const HOME_UPDATED = "2026-09-01"
const PRIVACY_UPDATED = "2026-09-01"

export default function sitemap(): MetadataRoute.Sitemap {
  const guides: MetadataRoute.Sitemap = [...GUIDE_PAGES.values()].map((page) => {
    // Same hreflang set as the page's own <link rel="alternate">, x-default left to the page.
    const { "x-default": _default, ...languages } = hreflangPaths(page)
    return {
      url: `${SITE_URL}${page.path}`,
      lastModified: page.updated,
      changeFrequency: "monthly",
      priority: page.kind === "faq" ? 0.8 : 0.9,
      alternates: {
        languages: Object.fromEntries(Object.entries(languages).map(([l, path]) => [l, `${SITE_URL}${path}`])),
      },
    }
  })

  return [
    { url: SITE_URL, lastModified: HOME_UPDATED, changeFrequency: "weekly", priority: 1 },
    ...guides,
    { url: `${SITE_URL}/privacy`, lastModified: PRIVACY_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ]
}
