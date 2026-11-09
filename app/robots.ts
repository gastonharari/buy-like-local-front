import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/faq"

// /robots.txt. The search and answer-engine crawlers get their own groups with an explicit
// Allow: a crawler that matches a named group ignores the "*" group entirely, so each group
// repeats the same small Disallow list. Nothing here blocks a public page: only the API routes
// and the internal /wa-connect tool are excluded. GPTBot (training) isn't named and falls under
// "*". See docs/operations.md "SEO".
const DISALLOW = ["/api/", "/wa-connect"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "OAI-SearchBot", allow: "/", disallow: DISALLOW },
      { userAgent: "ChatGPT-User", allow: "/", disallow: DISALLOW },
      { userAgent: "Bingbot", allow: "/", disallow: DISALLOW },
      { userAgent: "*", allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
