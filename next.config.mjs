/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Decision 10 (2026-11-10): Concierge doesn't do Mercado Pago for tourists, so its guides are
  // gone. EN/PT were live since PR #33 (indexed, maybe in ads), ES never shipped but its slug was
  // already in campaign plans: each goes to the MercadoLibre guide of the same language. Permanent
  // (308) so search engines move the URL; Next keeps the query string, so utm_* and gclid survive
  // and the WhatsApp ref still works. Test: e2e/no-mercado-pago.spec.ts.
  async redirects() {
    return [
      { source: "/en/mercado-pago-for-tourists", destination: "/en/buy-on-mercadolibre-as-a-foreigner", permanent: true },
      { source: "/pt/mercado-pago-para-turistas", destination: "/pt/comprar-no-mercadolibre-sendo-estrangeiro", permanent: true },
      { source: "/es/mercado-pago-para-turistas", destination: "/es/comprar-en-mercadolibre-siendo-extranjero", permanent: true },
    ]
  },
  async rewrites() {
    const crmUrl = process.env.NEXT_PUBLIC_CRM_URL ?? "https://concierge-crm.vercel.app"
    return [
      {
        source: "/chat",
        destination: `${crmUrl}/chat`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ]
  },
}

export default nextConfig