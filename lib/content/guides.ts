import type { FaqItem } from "@/lib/faq"
import { FAQ_EN, FAQ_ES, FAQ_PT, HUB_FAQ_IDS } from "@/lib/content/faq-items"

// The guide pages (MercadoLibre, Mercado Pago, Ticketek/Passline) and the FAQ hubs, in EN, ES and
// PT: copy, metadata and sitemap dates.
//
// Why this isn't in lib/translations.ts: each language has its own URL (the ES slugs are fixed by
// the Google and ChatGPT Ads campaigns), and the copy is long-form. translations.ts stays the
// landing's EN/ES/PT toggle copy (same reasoning as /privacy, which also lives outside it).
//
// Voice: local friend, short sentences, problem first (BRAND.md). Claims allowed: the 10–20% fee,
// quote before paying, "waits for you where you're staying" ("te espera donde te quedes"). Never:
// PayPal or any payment method, delivery dates, ticket availability, response times, DNI/bank
// help, "official", or anything that suggests we are or partner with MercadoLibre.
//
// Spanish is for Spanish-speaking foreigners in Argentina, not for Argentines: rioplatense voseo
// (BRAND.md, "Encargate de disfrutar"), always "DNI argentino".
//
// When you edit a page, bump its `updated` date: it is shown on the page and is the sitemap's
// lastModified.

/** Every language a guide exists in, in the order of the language switch (same as the landing). */
export const GUIDE_LANGS = ["en", "es", "pt"] as const
export type GuideLang = (typeof GUIDE_LANGS)[number]

/**
 * What a page is about. The pages that share a topic are the same page in each language: they
 * become each other's hreflang alternates and the targets of the language switch.
 */
export type GuideTopic = "mercadolibre" | "mercado-pago" | "tickets" | "faq"

export type GuideContent = {
  lang: GuideLang
  /** URL path, also the key. */
  path: string
  topic: GuideTopic
  /** YYYY-MM-DD. */
  updated: string
  kind: "guide" | "faq"
  meta: { title: string; description: string }
  eyebrow: string
  h1: string
  /** First paragraph: the direct answer. */
  lead: string
  steps?: Array<{ title: string; text: string }>
  sections?: Array<{ title: string; paragraphs: string[] }>
  faq: FaqItem[]
  /** Pre-filled WhatsApp sentence in the page's language; the ref is appended at runtime. */
  waMessage: string
}

export const GUIDE_UI: Record<
  GuideLang,
  {
    htmlLang: string
    ogLocale: string
    home: string
    cta: string
    stepsTitle: string
    faqTitle: string
    updated: string
    finalTitle: string
    finalText: string
    guidesTitle: string
    faqLink: string
    privacy: string
    tagline: string
    /** The language's own name, e.g. "Português" (tooltip of the language switch). */
    languageName: string
    /** aria-label of the language switch. */
    languageNav: string
  }
> = {
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    home: "Home",
    cta: "Chat on WhatsApp",
    stepsTitle: "How it works",
    faqTitle: "Questions travelers ask",
    updated: "Updated",
    finalTitle: "Tell us what you need",
    finalText:
      "Send us the link, the product or the show. You get a quote with the exact total before you pay anything.",
    guidesTitle: "Guides",
    faqLink: "FAQ",
    privacy: "Privacy Policy",
    tagline: "Products and show tickets in Buenos Aires, handled.",
    languageName: "English",
    languageNav: "Language",
  },
  es: {
    // Rioplatense copy for every Spanish speaker: hreflang is plain "es", the content says es-AR.
    htmlLang: "es-AR",
    ogLocale: "es_AR",
    home: "Inicio",
    cta: "Chateá por WhatsApp",
    stepsTitle: "Cómo funciona",
    faqTitle: "Lo que preguntan los viajeros",
    updated: "Actualizado el",
    finalTitle: "Contanos qué necesitás",
    finalText:
      "Mandanos el link, el producto o el show. Te pasamos una cotización con el total exacto antes de que pagues nada.",
    guidesTitle: "Guías",
    faqLink: "Preguntas frecuentes",
    privacy: "Política de privacidad",
    tagline: "Productos y entradas para shows en Buenos Aires, resuelto.",
    languageName: "Español",
    languageNav: "Idioma",
  },
  pt: {
    htmlLang: "pt-BR",
    ogLocale: "pt_BR",
    home: "Início",
    cta: "Fale pelo WhatsApp",
    stepsTitle: "Como funciona",
    faqTitle: "Perguntas que os viajantes fazem",
    updated: "Atualizado em",
    finalTitle: "Conta pra gente o que você precisa",
    finalText:
      "Manda o link, o produto ou o show. Você recebe um orçamento com o total exato antes de pagar qualquer coisa.",
    guidesTitle: "Guias",
    faqLink: "Perguntas frequentes",
    privacy: "Política de privacidade",
    tagline: "Produtos e ingressos para shows em Buenos Aires, resolvido.",
    languageName: "Português",
    languageNav: "Idioma",
  },
}

const pick = (pool: Record<string, FaqItem>, ids: readonly string[]): FaqItem[] =>
  ids.map((id) => {
    const item = pool[id]
    if (!item) throw new Error(`unknown FAQ id: ${id}`)
    return item
  })

const UPDATED = "2026-11-09"

const PAGES: GuideContent[] = [
  // ── MercadoLibre ────────────────────────────────────────────────────────────────────────────
  {
    lang: "en",
    path: "/en/buy-on-mercadolibre-as-a-foreigner",
    topic: "mercadolibre",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "How to buy on MercadoLibre Argentina as a foreigner (no DNI) | Concierge",
      description:
        "MercadoLibre Argentina asks for a DNI to open an account, so most tourists can't buy there. Concierge buys it for you: send the link on WhatsApp, approve the quote.",
    },
    eyebrow: "MercadoLibre · Buenos Aires",
    h1: "How to buy on MercadoLibre as a foreigner",
    lead: "You can't open a MercadoLibre Argentina account without an Argentine DNI, so as a tourist you usually can't buy there yourself. Concierge buys it for you: send us the product link on WhatsApp, approve the quote, and we buy it with our local account. Then it waits for you where you're staying in Buenos Aires.",
    steps: [
      {
        title: "Send us the link",
        text: "Copy the MercadoLibre link, or send a screenshot, on WhatsApp. Tell us the size, color or anything else that matters.",
      },
      {
        title: "Approve the quote",
        text: "We send you the exact total, with our fee of 10 to 20% included. Nothing is charged until you say yes.",
      },
      {
        title: "We buy it",
        text: "We buy it with our local account and follow the order for you. You see every step in the chat.",
      },
      {
        title: "It waits where you stay",
        text: "Your order waits for you where you're staying in Buenos Aires, hotel or Airbnb.",
      },
    ],
    sections: [
      {
        title: "Why MercadoLibre doesn't work for tourists",
        paragraphs: [
          "MercadoLibre Argentina verifies every buyer with a DNI, the Argentine national ID. Without one you can't finish signing up, and many foreign cards are declined at checkout anyway.",
          "It isn't only MercadoLibre: many local online stores ask for the same things. We buy there too.",
        ],
      },
      {
        title: "What we can buy for you",
        paragraphs: [
          "Almost anything sold on MercadoLibre or in a local store: clothes, football shirts, electronics, wine, leather, gifts to take home. Illegal or restricted items are out.",
        ],
      },
    ],
    faq: pick(FAQ_EN, ["ml-without-dni", "ml-foreign-card", "fee", "where-receive", "local-stores", "safe"]),
    waMessage: "Hi! I need help buying something on MercadoLibre",
  },
  {
    lang: "pt",
    path: "/pt/comprar-no-mercadolibre-sendo-estrangeiro",
    topic: "mercadolibre",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "Como comprar no MercadoLibre da Argentina sendo estrangeiro (sem DNI) | Concierge",
      description:
        "O MercadoLibre da Argentina pede DNI para abrir conta, então a maioria dos turistas não consegue comprar. O Concierge compra por você: mande o link no WhatsApp.",
    },
    eyebrow: "MercadoLibre · Buenos Aires",
    h1: "Como comprar no MercadoLibre sendo estrangeiro",
    lead: "Sem DNI argentino não dá para abrir uma conta no MercadoLibre da Argentina, então, como turista, você normalmente não consegue comprar sozinho. O Concierge compra por você: manda o link do produto no WhatsApp, aprova o orçamento e a gente compra com a nossa conta local. Depois, ele fica te esperando onde você está hospedado em Buenos Aires.",
    steps: [
      {
        title: "Manda o link",
        text: "Copia o link do MercadoLibre, ou manda um print, no WhatsApp. Diz o tamanho, a cor ou o que mais importar.",
      },
      {
        title: "Aprova o orçamento",
        text: "A gente manda o total exato, com a nossa taxa de 10 a 20% incluída. Nada é cobrado até você dizer que sim.",
      },
      {
        title: "A gente compra",
        text: "Compramos com a nossa conta local e acompanhamos o pedido por você. Você vê cada passo no chat.",
      },
      {
        title: "Fica te esperando",
        text: "Seu pedido fica te esperando onde você está hospedado em Buenos Aires, hotel ou Airbnb.",
      },
    ],
    sections: [
      {
        title: "Por que o MercadoLibre não funciona para turistas",
        paragraphs: [
          "O MercadoLibre da Argentina verifica cada comprador com o DNI, o documento de identidade argentino. Sem ele você não termina o cadastro, e muitos cartões estrangeiros são recusados no checkout de qualquer jeito.",
          "Não é só o MercadoLibre: muitas lojas online locais pedem as mesmas coisas. A gente compra lá também.",
        ],
      },
      {
        title: "O que a gente pode comprar pra você",
        paragraphs: [
          "Quase tudo o que se vende no MercadoLibre ou numa loja local: roupa, camisa de futebol, eletrônicos, vinho, couro, presentes para levar. Itens ilegais ou restritos ficam de fora.",
        ],
      },
    ],
    faq: pick(FAQ_PT, ["ml-without-dni", "ml-foreign-card", "fee", "where-receive", "local-stores", "safe"]),
    waMessage: "Oi! Preciso de ajuda para comprar algo no MercadoLibre",
  },
  {
    lang: "es",
    path: "/es/comprar-en-mercadolibre-siendo-extranjero",
    topic: "mercadolibre",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "Cómo comprar en MercadoLibre Argentina siendo extranjero (sin DNI) | Concierge",
      description:
        "MercadoLibre Argentina pide DNI argentino para abrir una cuenta, así que la mayoría de los extranjeros no puede comprar. Lo compramos por vos: mandanos el link por WhatsApp.",
    },
    eyebrow: "MercadoLibre · Buenos Aires",
    h1: "Cómo comprar en MercadoLibre siendo extranjero",
    lead: "Sin DNI argentino no podés abrir una cuenta en MercadoLibre Argentina, así que, como extranjero, normalmente no podés comprar por tu cuenta. En Concierge lo compramos por vos: nos mandás el link del producto por WhatsApp, aprobás la cotización y lo compramos con nuestra cuenta local. Después te espera donde te quedes en Buenos Aires.",
    steps: [
      {
        title: "Mandanos el link",
        text: "Copiá el link de MercadoLibre, o mandá una captura, por WhatsApp. Decinos el talle, el color o lo que importe.",
      },
      {
        title: "Aprobá la cotización",
        text: "Te mandamos el total exacto, con nuestra comisión del 10 al 20% incluida. No se cobra nada hasta que digas que sí.",
      },
      {
        title: "Lo compramos",
        text: "Lo compramos con nuestra cuenta local y seguimos el pedido por vos. Ves cada paso en el chat.",
      },
      {
        title: "Te espera donde te quedes",
        text: "Tu pedido te espera donde te quedes en Buenos Aires, hotel o Airbnb.",
      },
    ],
    sections: [
      {
        title: "Por qué MercadoLibre no funciona para extranjeros",
        paragraphs: [
          "MercadoLibre Argentina verifica a cada comprador con el DNI, el documento de identidad argentino. Sin DNI no podés terminar el registro, y además muchas tarjetas extranjeras se rechazan al pagar.",
          "No es solo MercadoLibre: muchas tiendas online locales piden lo mismo. Ahí también compramos.",
        ],
      },
      {
        title: "Qué podemos comprar por vos",
        paragraphs: [
          "Casi todo lo que se vende en MercadoLibre o en una tienda local: ropa, camisetas de fútbol, electrónica, vino, cuero, regalos para llevar. Lo ilegal o restringido queda afuera.",
        ],
      },
    ],
    faq: pick(FAQ_ES, ["ml-without-dni", "ml-foreign-card", "fee", "where-receive", "local-stores", "safe"]),
    waMessage: "¡Hola! Necesito ayuda para comprar algo en MercadoLibre",
  },

  // ── Mercado Pago ────────────────────────────────────────────────────────────────────────────
  {
    lang: "en",
    path: "/en/mercado-pago-for-tourists",
    topic: "mercado-pago",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "Mercado Pago for tourists: can you use it without a DNI? | Concierge",
      description:
        "Opening a Mercado Pago account requires an Argentine DNI, so most tourists can't use it. For products and show tickets, Concierge pays with our account and buys for you.",
    },
    eyebrow: "Mercado Pago · Buenos Aires",
    h1: "Mercado Pago for tourists",
    lead: "Without an Argentine DNI you can't open a Mercado Pago account, so as a tourist you usually can't use it to pay online stores, MercadoLibre or ticket sites. Concierge buys for you: tell us what you want on WhatsApp, approve the quote, and we pay with our own local account.",
    steps: [
      {
        title: "Tell us what you want",
        text: "Send us the link to the product, or the name of the show, on WhatsApp.",
      },
      {
        title: "Approve the quote",
        text: "We send you the exact total, with our fee of 10 to 20% included. Nothing is charged until you say yes.",
      },
      {
        title: "We pay and buy it",
        text: "We pay with our own account and place the order for you.",
      },
      {
        title: "You get it",
        text: "Products wait for you where you're staying in Buenos Aires. For tickets, we tell you before buying how you'll get in.",
      },
    ],
    sections: [
      {
        title: "Why Mercado Pago matters",
        paragraphs: [
          "Mercado Pago is the payment app behind MercadoLibre and many Argentine online stores and ticket sites. To open an account it asks for an Argentine DNI, so without one you get stuck at the payment step.",
        ],
      },
      {
        title: "What we can and can't do",
        paragraphs: [
          "We can buy products on MercadoLibre and in local stores, and tickets to shows and concerts.",
          "We can't pay QR codes in shops, restaurants or taxis, send money, exchange currency, or help with DNI, bank or Mercado Pago paperwork.",
        ],
      },
    ],
    faq: pick(FAQ_EN, ["mercado-pago-tourist", "what-can-you-buy", "dni-bank-help", "pay-from-abroad", "fee"]),
    waMessage: "Hi! I need help buying something that asks for Mercado Pago",
  },
  {
    lang: "pt",
    path: "/pt/mercado-pago-para-turistas",
    topic: "mercado-pago",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "Mercado Pago para turistas: dá pra usar sem DNI? | Concierge",
      description:
        "Abrir uma conta no Mercado Pago exige DNI argentino, então a maioria dos turistas não consegue usar. Para produtos e ingressos, o Concierge paga e compra por você.",
    },
    eyebrow: "Mercado Pago · Buenos Aires",
    h1: "Mercado Pago para turistas",
    lead: "Sem DNI argentino não dá para abrir uma conta no Mercado Pago, então, como turista, você normalmente não consegue usar para pagar lojas online, o MercadoLibre ou sites de ingressos. O Concierge compra por você: conta no WhatsApp o que você quer, aprova o orçamento e a gente paga com a nossa conta local.",
    steps: [
      {
        title: "Conta o que você quer",
        text: "Manda o link do produto, ou o nome do show, no WhatsApp.",
      },
      {
        title: "Aprova o orçamento",
        text: "A gente manda o total exato, com a nossa taxa de 10 a 20% incluída. Nada é cobrado até você dizer que sim.",
      },
      {
        title: "A gente paga e compra",
        text: "Pagamos com a nossa conta e fazemos o pedido por você.",
      },
      {
        title: "Chega até você",
        text: "Produtos ficam te esperando onde você está hospedado em Buenos Aires. Para ingressos, a gente explica antes de comprar como você vai entrar.",
      },
    ],
    sections: [
      {
        title: "Por que o Mercado Pago importa",
        paragraphs: [
          "O Mercado Pago é o app de pagamento por trás do MercadoLibre e de muitas lojas online e sites de ingressos argentinos. Para abrir uma conta ele pede DNI argentino, então sem ele você trava na hora de pagar.",
        ],
      },
      {
        title: "O que a gente faz e o que não faz",
        paragraphs: [
          "A gente compra produtos no MercadoLibre e em lojas locais, e ingressos para shows e concertos.",
          "A gente não paga QR em lojas, restaurantes ou táxis, não envia dinheiro, não troca moeda e não ajuda com trâmites de DNI, banco ou Mercado Pago.",
        ],
      },
    ],
    faq: pick(FAQ_PT, ["mercado-pago-tourist", "what-can-you-buy", "dni-bank-help", "pay-from-abroad", "fee"]),
    waMessage: "Oi! Preciso de ajuda para comprar algo que pede Mercado Pago",
  },
  {
    lang: "es",
    path: "/es/mercado-pago-para-turistas",
    topic: "mercado-pago",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "Mercado Pago para turistas: ¿se puede usar sin DNI? | Concierge",
      description:
        "Para abrir una cuenta de Mercado Pago hace falta DNI argentino, así que la mayoría de los turistas no puede usarlo. Para productos y entradas, pagamos y compramos por vos.",
    },
    eyebrow: "Mercado Pago · Buenos Aires",
    h1: "Mercado Pago para turistas",
    lead: "Sin DNI argentino no podés abrir una cuenta de Mercado Pago, así que, como turista, normalmente no podés usarlo para pagar en tiendas online, en MercadoLibre o en sitios de entradas. En Concierge compramos por vos: nos contás por WhatsApp qué querés, aprobás la cotización y pagamos con nuestra propia cuenta local.",
    steps: [
      {
        title: "Contanos qué querés",
        text: "Mandanos por WhatsApp el link del producto o el nombre del show.",
      },
      {
        title: "Aprobá la cotización",
        text: "Te mandamos el total exacto, con nuestra comisión del 10 al 20% incluida. No se cobra nada hasta que digas que sí.",
      },
      {
        title: "Pagamos y compramos",
        text: "Pagamos con nuestra cuenta y hacemos el pedido por vos.",
      },
      {
        title: "Lo tenés",
        text: "Los productos te esperan donde te quedes en Buenos Aires. Con las entradas, antes de comprar te contamos cómo vas a entrar.",
      },
    ],
    sections: [
      {
        title: "Por qué importa Mercado Pago",
        paragraphs: [
          "Mercado Pago es la app de pagos detrás de MercadoLibre y de muchas tiendas online y sitios de entradas de Argentina. Para abrir una cuenta pide DNI argentino, así que sin DNI te trabás en el momento de pagar.",
        ],
      },
      {
        title: "Qué hacemos y qué no",
        paragraphs: [
          "Compramos productos en MercadoLibre y en tiendas locales, y entradas para shows y recitales.",
          "No pagamos QR en negocios, restaurantes ni taxis, no enviamos dinero, no cambiamos moneda y no ayudamos con trámites de DNI, banco ni Mercado Pago.",
        ],
      },
    ],
    faq: pick(FAQ_ES, ["mercado-pago-tourist", "what-can-you-buy", "dni-bank-help", "pay-from-abroad", "fee"]),
    waMessage: "¡Hola! Necesito ayuda para comprar algo que pide Mercado Pago",
  },

  // ── Ticketek / Passline ─────────────────────────────────────────────────────────────────────
  {
    lang: "en",
    path: "/en/ticketek-passline-without-dni",
    topic: "tickets",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "Buy Ticketek and Passline tickets without a DNI | Concierge",
      description:
        "Ticketek and Passline usually ask for an Argentine DNI and decline many foreign cards. Concierge buys the tickets for you with our local account after you approve the quote.",
    },
    eyebrow: "Ticketek · Passline · Buenos Aires",
    h1: "Ticketek and Passline tickets without a DNI",
    lead: "Ticketek and Passline usually ask for an Argentine DNI to create the account or finish the purchase, and many foreign cards are declined, so buying on your own as a tourist rarely works. Concierge buys the tickets for you: send us the show on WhatsApp, approve the quote, and we buy them with our local account.",
    steps: [
      {
        title: "Send us the show",
        text: "The Ticketek or Passline link, or just the artist, date and venue, plus how many tickets and which section you want.",
      },
      {
        title: "We check and quote",
        text: "We go over that show's rules with you, including how its tickets are issued, and send the exact total with our 10 to 20% fee included.",
      },
      {
        title: "We buy them",
        text: "Once you approve, we buy the tickets with our local account, as long as they're still on sale.",
      },
      {
        title: "You get in",
        text: "Before you pay, you already know how you'll get the tickets for that specific show.",
      },
    ],
    sections: [
      {
        title: "Why ticket sites are hard for tourists",
        paragraphs: [
          "Both platforms usually tie the account to an Argentine ID, and checkout often rejects foreign cards. A local account and a card that works in Argentina solve both.",
        ],
      },
      {
        title: "What we can't promise",
        paragraphs: [
          "We can't promise availability: tickets depend on what's on sale when we buy. You only pay for tickets you approved in the quote.",
        ],
      },
    ],
    faq: pick(FAQ_EN, ["tickets-foreigners", "tickets-how-get", "fee", "pay-from-abroad", "safe"]),
    waMessage: "Hi! I need help buying tickets for a show in Buenos Aires",
  },
  {
    lang: "pt",
    path: "/pt/ticketek-passline-sem-dni",
    topic: "tickets",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "Comprar ingressos na Ticketek e na Passline sem DNI | Concierge",
      description:
        "A Ticketek e a Passline costumam pedir DNI argentino e recusam muitos cartões estrangeiros. O Concierge compra os ingressos por você depois que você aprova o orçamento.",
    },
    eyebrow: "Ticketek · Passline · Buenos Aires",
    h1: "Ingressos na Ticketek e na Passline sem DNI",
    lead: "A Ticketek e a Passline costumam pedir DNI argentino para criar a conta ou finalizar a compra, e muitos cartões estrangeiros são recusados, então comprar sozinho como turista quase nunca funciona. O Concierge compra os ingressos por você: manda o show no WhatsApp, aprova o orçamento e a gente compra com a nossa conta local.",
    steps: [
      {
        title: "Manda o show",
        text: "O link da Ticketek ou da Passline, ou só o artista, a data e o local, e quantos ingressos e qual setor você quer.",
      },
      {
        title: "A gente confere e orça",
        text: "Revisamos com você as regras daquele show, inclusive como os ingressos são emitidos, e mandamos o total exato com a nossa taxa de 10 a 20% incluída.",
      },
      {
        title: "A gente compra",
        text: "Depois que você aprova, compramos os ingressos com a nossa conta local, desde que ainda estejam à venda.",
      },
      {
        title: "Você entra",
        text: "Antes de pagar, você já sabe como vai receber os ingressos daquele show.",
      },
    ],
    sections: [
      {
        title: "Por que os sites de ingressos são difíceis para turistas",
        paragraphs: [
          "As duas plataformas costumam ligar a conta a um documento argentino, e o checkout costuma recusar cartões estrangeiros. Uma conta local e um cartão que funciona na Argentina resolvem as duas coisas.",
        ],
      },
      {
        title: "O que a gente não pode prometer",
        paragraphs: [
          "A gente não pode prometer disponibilidade: os ingressos dependem do que estiver à venda na hora da compra. Você só paga pelos ingressos que aprovou no orçamento.",
        ],
      },
    ],
    faq: pick(FAQ_PT, ["tickets-foreigners", "tickets-how-get", "fee", "pay-from-abroad", "safe"]),
    waMessage: "Oi! Preciso de ajuda para comprar ingressos para um show em Buenos Aires",
  },
  {
    lang: "es",
    path: "/es/ticketek-passline-sin-dni",
    topic: "tickets",
    updated: UPDATED,
    kind: "guide",
    meta: {
      title: "Comprar entradas en Ticketek y Passline sin DNI | Concierge",
      description:
        "Ticketek y Passline suelen pedir DNI argentino y rechazan muchas tarjetas extranjeras. Compramos las entradas por vos con nuestra cuenta local cuando aprobás la cotización.",
    },
    eyebrow: "Ticketek · Passline · Buenos Aires",
    h1: "Entradas en Ticketek y Passline sin DNI",
    lead: "Ticketek y Passline suelen pedir DNI argentino para crear la cuenta o terminar la compra, y muchas tarjetas extranjeras se rechazan, así que comprar por tu cuenta siendo turista casi nunca funciona. En Concierge compramos las entradas por vos: nos mandás el show por WhatsApp, aprobás la cotización y las compramos con nuestra cuenta local.",
    steps: [
      {
        title: "Mandanos el show",
        text: "El link de Ticketek o Passline, o solo el artista, la fecha y el lugar, más cuántas entradas y qué sector querés.",
      },
      {
        title: "Revisamos y cotizamos",
        text: "Repasamos con vos las reglas de ese show, incluido cómo se emiten las entradas, y te mandamos el total exacto con nuestra comisión del 10 al 20% incluida.",
      },
      {
        title: "Las compramos",
        text: "Cuando aprobás, compramos las entradas con nuestra cuenta local, siempre que sigan a la venta.",
      },
      {
        title: "Entrás al show",
        text: "Antes de pagar ya sabés cómo vas a recibir las entradas de ese show.",
      },
    ],
    sections: [
      {
        title: "Por qué los sitios de entradas son difíciles para turistas",
        paragraphs: [
          "Las dos plataformas suelen atar la cuenta a un documento argentino, y al pagar suelen rechazar tarjetas extranjeras. Una cuenta local y una tarjeta que funciona en Argentina resuelven las dos cosas.",
        ],
      },
      {
        title: "Lo que no podemos prometer",
        paragraphs: [
          "No podemos prometer disponibilidad: las entradas dependen de lo que esté a la venta cuando compramos. Solo pagás las entradas que aprobaste en la cotización.",
        ],
      },
    ],
    faq: pick(FAQ_ES, ["tickets-foreigners", "tickets-how-get", "fee", "pay-from-abroad", "safe"]),
    waMessage: "¡Hola! Necesito ayuda para comprar entradas para un show en Buenos Aires",
  },

  // ── FAQ hubs ────────────────────────────────────────────────────────────────────────────────
  {
    lang: "en",
    path: "/en/faq",
    topic: "faq",
    updated: UPDATED,
    kind: "faq",
    meta: {
      title: "Buying in Argentina as a foreigner: FAQ | Concierge",
      description:
        "Can you buy on MercadoLibre without a DNI? Use Mercado Pago as a tourist? Buy Ticketek tickets as a foreigner? Short answers, and how Concierge charges (10 to 20%).",
    },
    eyebrow: "FAQ",
    h1: "Buying in Argentina as a foreigner: questions and answers",
    lead: "Straight answers about MercadoLibre, Mercado Pago, Ticketek and Passline when you don't have an Argentine DNI, and about how Concierge buys for you.",
    faq: pick(FAQ_EN, HUB_FAQ_IDS),
    waMessage: "Hi! I need help buying something in Argentina",
  },
  {
    lang: "pt",
    path: "/pt/faq",
    topic: "faq",
    updated: UPDATED,
    kind: "faq",
    meta: {
      title: "Comprar na Argentina sendo estrangeiro: perguntas frequentes | Concierge",
      description:
        "Dá pra comprar no MercadoLibre sem DNI? Usar o Mercado Pago sendo turista? Comprar ingresso na Ticketek sendo estrangeiro? Respostas curtas, e como o Concierge cobra.",
    },
    eyebrow: "Perguntas frequentes",
    h1: "Comprar na Argentina sendo estrangeiro: perguntas e respostas",
    lead: "Respostas diretas sobre MercadoLibre, Mercado Pago, Ticketek e Passline quando você não tem DNI argentino, e sobre como o Concierge compra por você.",
    faq: pick(FAQ_PT, HUB_FAQ_IDS),
    waMessage: "Oi! Preciso de ajuda para comprar algo na Argentina",
  },
  {
    lang: "es",
    path: "/es/faq",
    topic: "faq",
    updated: UPDATED,
    kind: "faq",
    meta: {
      title: "Comprar en Argentina siendo extranjero: preguntas frecuentes | Concierge",
      description:
        "¿Se puede comprar en MercadoLibre sin DNI? ¿Usar Mercado Pago siendo turista? ¿Comprar entradas en Ticketek siendo extranjero? Respuestas cortas, y cómo cobra Concierge.",
    },
    eyebrow: "Preguntas frecuentes",
    h1: "Comprar en Argentina siendo extranjero: preguntas y respuestas",
    lead: "Respuestas directas sobre MercadoLibre, Mercado Pago, Ticketek y Passline cuando no tenés DNI argentino, y sobre cómo compramos por vos en Concierge.",
    faq: pick(FAQ_ES, HUB_FAQ_IDS),
    waMessage: "¡Hola! Necesito ayuda para comprar algo en Argentina",
  },
]

export const GUIDE_PAGES: ReadonlyMap<string, GuideContent> = new Map(PAGES.map((p) => [p.path, p]))

// Every topic exists once in every language, so the hreflang sets are complete and reciprocal
// (Google drops an hreflang that the other page doesn't return). Checked at build time.
for (const topic of new Set(PAGES.map((p) => p.topic))) {
  for (const lang of GUIDE_LANGS) {
    const n = PAGES.filter((p) => p.topic === topic && p.lang === lang).length
    if (n !== 1) throw new Error(`guide topic "${topic}" has ${n} pages in "${lang}" (want exactly 1)`)
  }
}

/** The same page in every language, itself included, in GUIDE_LANGS order. */
export function languageVersions(page: GuideContent): GuideContent[] {
  return GUIDE_LANGS.map((lang) => PAGES.find((p) => p.topic === page.topic && p.lang === lang)!)
}

/** hreflang → path for a page's topic. English is the x-default. */
export function hreflangPaths(page: GuideContent): Record<string, string> {
  const versions = languageVersions(page)
  const paths: Record<string, string> = Object.fromEntries(versions.map((v) => [v.lang, v.path]))
  return { ...paths, "x-default": paths.en }
}

export function getGuide(path: string): GuideContent {
  const page = GUIDE_PAGES.get(path)
  if (!page) throw new Error(`unknown guide page: ${path}`)
  return page
}

/** Guides (not the FAQ hubs) in one language, for the footer links. */
export function guidesIn(lang: GuideLang): GuideContent[] {
  return PAGES.filter((p) => p.lang === lang && p.kind === "guide")
}
