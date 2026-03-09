import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Buy Like Local | Buy Argentine Products in USD via WhatsApp",
  description:
    "Buy Like Local is a WhatsApp concierge that helps foreigners, tourists, and expats buy authentic Argentine products in USD. International shipping from Buenos Aires. Pay with international credit cards.",
  generator: "v0.app",
  metadataBase: new URL("https://buylikelocal.com"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "buy Argentine products",
    "Argentina shopping concierge",
    "buy from Argentina in USD",
    "Argentine brands international shipping",
    "WhatsApp concierge Argentina",
    "Buenos Aires personal shopper",
    "buy Argentine wine online",
    "Argentine leather goods",
    "buy alfajores online",
    "shop Argentina from abroad",
    "foreign credit card Argentina",
    "expat shopping Buenos Aires",
  ],
  openGraph: {
    title: "Buy Like Local | Buy Argentine Products in USD via WhatsApp",
    description:
      "WhatsApp concierge helping foreigners buy authentic Argentine brands in USD. Leather, wine, fashion, artisan goods. International shipping from Buenos Aires.",
    url: "https://buylikelocal.com",
    siteName: "Buy Like Local",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Like Local | Buy Argentine Products in USD",
    description:
      "WhatsApp concierge helping foreigners buy authentic Argentine brands in USD. International shipping from Buenos Aires.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Buy Like Local",
    url: "https://buylikelocal.com",
    description:
      "Buy Like Local is a WhatsApp-based concierge service that helps foreigners, tourists, and expats buy authentic Argentine products in USD and ships them internationally from Buenos Aires.",
    areaServed: "Worldwide",
    foundingLocation: {
      "@type": "Place",
      name: "Buenos Aires, Argentina",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+5491158637341",
      availableLanguage: ["English", "Spanish"],
    },
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Buy Like Local - Argentine Shopping Concierge",
    description:
      "WhatsApp-based personal shopping concierge in Buenos Aires, Argentina. Helps foreigners buy local Argentine brands (wine, leather, fashion, artisan goods, alfajores, dulce de leche) in USD with international shipping. Accepts Visa, Mastercard, Amex, PayPal.",
    provider: {
      "@type": "Organization",
      name: "Buy Like Local",
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    serviceType: "Personal Shopping Concierge",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      description:
        "Average order between $50 and $500 USD. Service fee included in quoted price. International shipping quoted separately.",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can foreigners buy from Argentine brands?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Buy Like Local helps foreigners, tourists, and expats purchase from Argentine brands. Many local shops only accept Argentine payment methods or sell in-store only. We handle the purchase on your behalf and accept international credit cards in USD.",
        },
      },
      {
        "@type": "Question",
        name: "How do I pay in USD?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All prices are quoted in USD. You pay via international credit card (Visa, Mastercard, Amex), PayPal, or wire transfer. No Argentine pesos needed.",
        },
      },
      {
        "@type": "Question",
        name: "Do you ship internationally from Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We ship worldwide from Buenos Aires. Delivery takes 5-10 business days to the US and Europe, 7-14 days to Asia and Oceania. Tracking provided on all shipments.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use my international credit card?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We accept Visa, Mastercard, and American Express from any country. All transactions are processed securely in USD.",
        },
      },
      {
        "@type": "Question",
        name: "What Argentine products can I buy through Buy Like Local?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We source from any brand or store in Argentina: fashion designers, boutique wineries in Mendoza, leather artisans in San Telmo, specialty food producers (alfajores, dulce de leche, mate), and more. If it is sold in Argentina, we can get it for you.",
        },
      },
      {
        "@type": "Question",
        name: "Why not buy directly from the Argentine brand?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most Argentine brands do not sell online to international customers, do not accept foreign credit cards, and do not ship internationally. Buy Like Local bridges that gap by acting as your local buyer.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body className={`font-sans ${inter.variable} ${GeistMono.variable} antialiased`}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JK2YHFCTCD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'wait_for_update': 500,
              'regions': ['AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU','IE','IS','IT','LI','LT','LU','LV','MT','NL','NO','PL','PT','RO','SE','SI','SK']
            });

            gtag('consent', 'default', {
              'ad_storage': 'granted',
              'ad_user_data': 'granted',
              'ad_personalization': 'granted',
              'analytics_storage': 'granted'
            });

            gtag('js', new Date());
            gtag('config', 'G-JK2YHFCTCD');
          `}
        </Script>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
