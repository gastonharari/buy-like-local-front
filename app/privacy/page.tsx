import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"

// Privacy policy — a static, server-rendered page in English (the audience is
// foreign travelers, and Meta's App Review team reads it for the WhatsApp app
// "Buy Like Local"). Meta requires both a public Privacy Policy URL and a
// public Data Deletion URL — the latter is /privacy#data-deletion.
//
// English only on purpose: legal copy is not part of the EN/ES/PT marketing
// i18n in lib/translations.ts, and a single canonical version avoids
// divergence between translations of a legal text.

export const metadata: Metadata = {
  title: "Privacy Policy — Concierge",
  description:
    "How Concierge (Buy Like Local) collects, uses, and protects your data when you use our WhatsApp concierge service in Buenos Aires.",
  alternates: {
    canonical: "https://www.concierge.com.ar/privacy",
  },
  robots: "index, follow",
  openGraph: {
    title: "Privacy Policy — Concierge",
    description:
      "How Concierge (Buy Like Local) collects, uses, and protects your data.",
    url: "https://www.concierge.com.ar/privacy",
    siteName: "Concierge",
    type: "website",
  },
}

const LAST_UPDATED = "September 2026"

function Section({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-foreground font-display"
          >
            Concierge
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* ── Title ──────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wider text-primary font-semibold">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {LAST_UPDATED}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Concierge (&ldquo;we&rdquo;, &ldquo;us&rdquo;), also operating as{" "}
              <span className="text-foreground">Buy Like Local</span>, is a
              personal concierge service in Buenos Aires, Argentina, that helps
              foreign travelers buy products, get tickets, and arrange
              deliveries through WhatsApp and our web chat. This policy
              explains what data we collect when you use the service or visit{" "}
              <span className="text-foreground">concierge.com.ar</span>, and
              how we use and protect it.
            </p>
          </div>

          <Section title="What we collect">
            <p>When you contact us or use the service, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="text-foreground">Contact details</span> — your
                name and your phone / WhatsApp number.
              </li>
              <li>
                <span className="text-foreground">Message content</span> — the
                messages you send us, including text, voice notes, and any
                images or documents you share.
              </li>
              <li>
                <span className="text-foreground">Order and booking details</span>{" "}
                — what you ask us to buy, book, or deliver: items, delivery
                addresses, dates, and related preferences.
              </li>
            </ul>
            <p>
              We only ask for the information needed to complete your request.
              Please do not send us data we do not need (for example, full card
              numbers or government ID documents, unless a specific purchase
              legally requires it and we ask for it).
            </p>
          </Section>

          <Section title="How we use your data">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                To provide the concierge service: making purchases, arranging
                deliveries, and completing bookings on your behalf.
              </li>
              <li>
                To communicate with you about your requests, orders, and
                payments.
              </li>
              <li>
                To draft replies with AI assistance:{" "}
                <span className="text-foreground">
                  our system may use AI to help draft responses, and every
                  reply is reviewed by a human operator
                </span>{" "}
                before it is sent.
              </li>
            </ul>
            <p>
              We do not sell your personal data, and we do not use it for
              third-party advertising.
            </p>
          </Section>

          <Section title="WhatsApp">
            <p>
              Messages you send to our WhatsApp number are processed through{" "}
              <span className="text-foreground">
                Meta&rsquo;s WhatsApp Business Platform (Cloud API)
              </span>
              . This means Meta Platforms, Inc. acts as a processor that
              transmits and hosts WhatsApp messages exchanged with us, under{" "}
              <a
                href="https://www.whatsapp.com/legal/business-terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                WhatsApp&rsquo;s Business terms
              </a>{" "}
              and Meta&rsquo;s own privacy practices. Your use of WhatsApp
              itself is also governed by{" "}
              <a
                href="https://www.whatsapp.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                WhatsApp&rsquo;s Privacy Policy
              </a>
              .
            </p>
          </Section>

          <Section title="Service providers">
            <p>
              We share data only with the providers needed to run the service,
              and only to the extent necessary:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="text-foreground">Meta (WhatsApp)</span> —
                message transmission via the WhatsApp Business Platform (Cloud
                API).
              </li>
              <li>
                <span className="text-foreground">Anthropic</span> — AI-assisted
                drafting of replies (message content may be processed to
                generate a draft; a human operator reviews it).
              </li>
              <li>
                <span className="text-foreground">Amazon Web Services (AWS)</span>{" "}
                — hosting and storage of our systems and data.
              </li>
              <li>
                <span className="text-foreground">PayPal</span> — payment
                processing. Payments are made through PayPal; we never see or
                store your full card details.
              </li>
            </ul>
          </Section>

          <Section title="Retention and security">
            <p>
              We keep conversation and order records only as long as needed to
              provide the service, handle follow-ups, and meet legal and
              accounting obligations, after which they are deleted.
            </p>
            <p>
              Data is stored on access-controlled infrastructure, encrypted in
              transit, and accessible only to the operators who need it to
              handle your requests.
            </p>
          </Section>

          <Section title="Your rights">
            <p>You can, at any time:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ask what personal data we hold about you.</li>
              <li>Ask us to correct inaccurate data.</li>
              <li>
                Ask us to delete your data (see{" "}
                <a href="#data-deletion" className="text-primary hover:underline">
                  Data deletion
                </a>{" "}
                below).
              </li>
              <li>Stop using the service at any time — just stop messaging us.</li>
            </ul>
          </Section>

          <Section id="data-deletion" title="Data deletion">
            <p>
              To request deletion of your data — your contact details, message
              history, and order records — contact us through any of these
              channels:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Message us on WhatsApp or through the chat on{" "}
                <Link href="/" className="text-primary hover:underline">
                  concierge.com.ar
                </Link>{" "}
                and ask us to delete your data.
              </li>
              <li>
                Email{" "}
                <a
                  href="mailto:info@concierge.com.ar"
                  className="text-primary hover:underline"
                >
                  info@concierge.com.ar
                </a>{" "}
                with the subject &ldquo;Data deletion request&rdquo;, from the
                phone number or with the WhatsApp number you used with us.
              </li>
            </ul>
            <p>
              We will confirm your request and delete your personal data within{" "}
              <span className="text-foreground">30 days</span>, except for the
              minimal records we are legally required to keep (for example,
              invoicing records).
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy or your data? Reach us on WhatsApp,
              through the chat on{" "}
              <Link href="/" className="text-primary hover:underline">
                concierge.com.ar
              </Link>
              , or by email at{" "}
              <a
                href="mailto:info@concierge.com.ar"
                className="text-primary hover:underline"
              >
                info@concierge.com.ar
              </a>
              .
            </p>
            <p>Last updated: {LAST_UPDATED}.</p>
          </Section>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 Concierge. All rights reserved. ·{" "}
            <Link href="/" className="hover:text-foreground transition-colors">
              concierge.com.ar
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
