import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { Suspense } from "react"
import { CookieBanner } from "@/components/cookie-banner"
import { ChatWidget } from "@/components/chat-widget"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Concierge — Your Local Concierge in Buenos Aires | Buy, Book & Deliver",
  description:
    "Can't buy with foreign cards in Argentina? Concierge handles MercadoLibre, local stores, food delivery, and reservations for you. Just WhatsApp us.",
  metadataBase: new URL("https://www.concierge.com.ar"),
  alternates: {
    canonical: "https://www.concierge.com.ar",
  },
  keywords: [
    "concierge Buenos Aires",
    "foreign card Argentina",
    "buy MercadoLibre tourist",
    "Buenos Aires personal shopper",
    "WhatsApp concierge Argentina",
    "PedidosYa foreign card",
    "Argentina tourist shopping",
    "buy like local Buenos Aires",
    "Mercado Pago tourist",
    "Argentina expat shopping",
  ],
  openGraph: {
    title: "Concierge — Shop Buenos Aires Like a Local",
    description:
      "Foreign tourist in Argentina? We buy, book, and deliver for you. One WhatsApp message is all it takes.",
    url: "https://www.concierge.com.ar",
    siteName: "Concierge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/buenos-aires-obelisco-night.jpg",
        width: 1200,
        height: 630,
        alt: "Concierge — Your local concierge in Buenos Aires",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concierge — Shop Buenos Aires Like a Local",
    description:
      "Foreign tourist in Argentina? We buy, book, and deliver for you. One WhatsApp message is all it takes.",
    images: ["/buenos-aires-obelisco-night.jpg"],
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
    name: "Concierge",
    url: "https://www.concierge.com.ar",
    description:
      "Concierge is a WhatsApp-based local concierge service in Buenos Aires that helps foreign tourists buy, book, and receive orders when foreign cards and local accounts are blocked.",
    areaServed: "Buenos Aires, Argentina",
    foundingLocation: {
      "@type": "Place",
      name: "Buenos Aires, Argentina",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+5491158637341",
      email: "info@concierge.com.ar",
      availableLanguage: ["English", "Spanish", "Portuguese"],
    },
    sameAs: ["https://instagram.com/concierge.ok"],
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Concierge — Buenos Aires Local Concierge",
    description:
      "WhatsApp-based concierge service for foreign tourists in Buenos Aires. We buy on MercadoLibre, order food delivery, make reservations, handle QR payments, and deliver to your hotel or Airbnb.",
    provider: {
      "@type": "Organization",
      name: "Concierge",
    },
    areaServed: {
      "@type": "Place",
      name: "Buenos Aires, Argentina",
    },
    serviceType: "Local Concierge / Personal Shopping",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      description:
        "Service fee typically 10-20% of order value. Exact quote sent before purchase. Payment via Mercado Pago, bank transfer, or crypto.",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does payment work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We send you a payment link via Mercado Pago or bank transfer details. You can pay in USD or ARS. You always see the exact total before paying.",
        },
      },
      {
        "@type": "Question",
        name: "Is Concierge safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We're a registered company in Buenos Aires. We send you a detailed quote before charging anything. No payment without your approval.",
        },
      },
      {
        "@type": "Question",
        name: "How long does delivery take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Depends on the order. Food delivery: 1-2 hours. Online purchases: 24-48 hours. Experiences and reservations: usually same day.",
        },
      },
      {
        "@type": "Question",
        name: "Do you deliver to hotels or Airbnbs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, anywhere in Buenos Aires. Just send us the address.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Just WhatsApp. That's it.",
        },
      },
      {
        "@type": "Question",
        name: "What languages do you speak?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "English, Español, and Português.",
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
      <body
        className={`font-sans ${inter.variable} ${poppins.variable} ${GeistMono.variable} antialiased`}
      >
        {/* Google Analytics 4 */}
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

        {/* Meta Pixel — replace TODO_PIXEL_ID with actual pixel ID */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'TODO_PIXEL_ID');
            fbq('track', 'PageView');
          `}
        </Script>

        <Suspense fallback={null}>{children}</Suspense>
        <CookieBanner />
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  )
}
