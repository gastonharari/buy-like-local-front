export type Lang = "en" | "es" | "pt"

interface LangConfig {
  waLink: string
  header: { cta: string }
  hero: {
    h1: string
    h1Echo: string
    subtitle: string
    cta: string
    chatCta: string
    eyebrow: string
    ctaNote: string
    chat: {
      aria: string
      status: string
      messages: Array<{ from: "tourist" | "concierge"; text: string }>
    }
  }
  trust: { items: Array<{ title: string; sub: string }> }
  marquee: { eyebrow: string; aria: string; items: string[] }
  midCta: { text: string; cta: string }
  ctaBar: { label: string }
  howItWorks: {
    eyebrow: string
    title: string
    steps: Array<{ title: string; description: string }>
  }
  services: {
    eyebrow: string
    title: string
    items: Array<{ title: string; description: string }>
  }
  testimonials: { eyebrow: string; title: string }
  about: { title: string; body: string; contact: string }
  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string }>
  }
  finalCta: { h2: string; subtitle: string; cta: string; chatCta: string; ctaNote: string }
  footer: {
    tagline: string
    linkLabels: string[]
    legal: string
  }
}

export const translations: Record<Lang, LangConfig> = {
  en: {
    waLink:
      "https://wa.me/5491158637341?text=Hi!%20I'm%20spending%20some%20time%20in%20BA%20and%20need%20someone%20local%20to%20help%20me%20out",
    header: {
      cta: "Chat with us",
    },
    hero: {
      h1: "Local, handled.",
      h1Echo: "You just enjoy.",
      subtitle:
        "Can't pay with foreign cards or create a local account? We handle it.",
      chatCta: "No WhatsApp? Chat here",
      cta: "Chat on WhatsApp",
      eyebrow: "Your local fixer in Buenos Aires",
      ctaNote: "No app. No signup. One message.",
      chat: {
        aria: "Example WhatsApp conversation with Concierge",
        status: "on WhatsApp · 24/7",
        messages: [
          {
            from: "tourist",
            text: "Hey! I want a River Plate jersey but my card keeps getting declined 😅",
          },
          {
            from: "concierge",
            text: "On it. We buy it for you — you pay with PayPal.",
          },
          {
            from: "concierge",
            text: "Done. Your jersey is waiting where you stay ✨",
          },
        ],
      },
    },
    trust: {
      items: [
        { title: "24/7 on WhatsApp", sub: "One message and we're on it" },
        { title: "Pay with PayPal", sub: "Credit, debit, or balance — quote first" },
        { title: "EN · ES · PT", sub: "We speak your language" },
        { title: "Waiting where you stay", sub: "Hotel or Airbnb" },
      ],
    },
    marquee: {
      eyebrow: "What we get you",
      aria: "Products and tickets we get you",
      items: [
        "Football jersey",
        "Sold-out show ticket",
        "Mendoza wine",
        "Leather jacket",
        "Alfajores",
        "Mate & bombilla",
        "That MercadoLibre find",
        "Local-drop sneakers",
        "Vinyl records",
        "Perfume",
      ],
    },
    midCta: {
      text: "Everything up there — we get it for you.",
      cta: "Ask on WhatsApp",
    },
    ctaBar: { label: "Chat on WhatsApp" },
    howItWorks: {
      eyebrow: "How it works",
      title: "How it works",
      steps: [
        {
          title: "Message us on WhatsApp",
          description:
            "Tell us what you need — event tickets, MercadoLibre orders, or local store purchases.",
        },
        {
          title: "We find it and buy it",
          description: "We find it, buy it, and keep you posted on the chat.",
        },
        {
          title: "Your order, sorted",
          description:
            "It's waiting where you stay. All through the chat.",
        },
      ],
    },
    services: {
      eyebrow: "At your fingertips",
      title: "What we can do",
      items: [
        {
          title: "Online Shopping",
          description:
            "We buy for you on MercadoLibre, Fravega, Farmacity, and any local store",
        },
        {
          title: "Show & Concert Tickets",
          description:
            "Even the sold-out ones",
        },
        {
          title: "Local Products",
          description:
            "Artisan goods, wine, leather, sweets — packaged for travel",
        },
      ],
    },
    testimonials: {
      eyebrow: "What travelers say",
      title: "What our clients say",
    },
    about: {
      title: "Who's behind Concierge?",
      body: "We're a local team in Buenos Aires. We know how frustrating it is to visit Argentina and not be able to buy, pay, or book things because of card and account restrictions. We created Concierge to fix that — a simple WhatsApp message connects you with someone who gets it for you, so you can enjoy your trip.",
      contact: "Questions? Email us at info@concierge.com.ar",
    },
    faq: {
      eyebrow: "Questions",
      title: "Frequently asked questions",
      items: [
        {
          q: "How does payment work?",
          a: "We send you a PayPal link. You can pay with credit card, debit card, or PayPal balance. You always see the exact total before paying.",
        },
        {
          q: "Is this safe?",
          a: "Yes. We send you a detailed quote before charging anything. No payment without your approval.",
        },
        {
          q: "What if something goes wrong?",
          a: "We handle returns and claims on your behalf. If there's an issue, the risk is on us.",
        },
        {
          q: "Where do I get my order?",
          a: "It'll be waiting where you stay — hotel or Airbnb, anywhere in Buenos Aires.",
        },
        {
          q: "What can't you buy?",
          a: "Illegal or restricted items, and anything outside products or event tickets.",
        },
        {
          q: "Do I need to create an account?",
          a: "No. Just WhatsApp or our chat. That's it.",
        },
        {
          q: "What languages do you speak?",
          a: "English, Español, and Português.",
        },
      ],
    },
    finalCta: {
      h2: "Ready to shop like a local?",
      subtitle: "It starts with a message. Tell us what you need.",
      chatCta: "No WhatsApp? Chat here",
      cta: "Chat on WhatsApp",
      ctaNote: "No app. No signup. One message.",
    },
    footer: {
      tagline: "Event tickets, MercadoLibre, local stores — handled.",
      linkLabels: ["How it works", "Services", "FAQ", "About"],
      legal: "© 2026 Concierge. All rights reserved.",
    },
  },

  es: {
    waLink:
      "https://wa.me/5491158637341?text=Hola!%20Voy%20a%20estar%20un%20tiempo%20en%20BA%20y%20necesito%20alguien%20local%20que%20me%20d%C3%A9%20una%20mano",
    header: {
      cta: "Chatear con nosotros",
    },
    hero: {
      h1: "Nos encargamos de lo local.",
      h1Echo: "Encárgate de disfrutar.",
      subtitle:
        "No podés pagar con tarjeta extranjera? No podés crear cuenta local? Escribinos — lo compramos por vos.",
      chatCta: "¿Sin WhatsApp? Chateá acá",
      cta: "Chateá por WhatsApp",
      eyebrow: "Tu fixer local en Buenos Aires",
      ctaNote: "Sin app. Sin registro. Un mensaje.",
      chat: {
        aria: "Ejemplo de conversación de WhatsApp con Concierge",
        status: "en WhatsApp · 24/7",
        messages: [
          {
            from: "tourist",
            text: "Hola! Quiero la camiseta de River pero mi tarjeta no pasa 😅",
          },
          {
            from: "concierge",
            text: "Dejalo en nuestras manos. La compramos por vos — pagás con PayPal.",
          },
          {
            from: "concierge",
            text: "Listo. Tu camiseta te espera donde te quedes ✨",
          },
        ],
      },
    },
    trust: {
      items: [
        { title: "24/7 en WhatsApp", sub: "Un mensaje y arrancamos" },
        { title: "Pagás con PayPal", sub: "Tarjeta, débito o saldo — cotización antes" },
        { title: "EN · ES · PT", sub: "Hablamos tu idioma" },
        { title: "Te espera donde te quedes", sub: "Hotel o Airbnb" },
      ],
    },
    marquee: {
      eyebrow: "Lo que conseguimos",
      aria: "Productos y entradas que conseguimos",
      items: [
        "Camiseta de fútbol",
        "Entrada al show agotado",
        "Vino de Mendoza",
        "Campera de cuero",
        "Alfajores",
        "Mate y bombilla",
        "Ese hallazgo de MercadoLibre",
        "Zapatillas edición local",
        "Vinilos",
        "Perfume",
      ],
    },
    midCta: {
      text: "Eso que viste ahí arriba — te lo conseguimos.",
      cta: "Pedilo por WhatsApp",
    },
    ctaBar: { label: "Chateá por WhatsApp" },
    howItWorks: {
      eyebrow: "Así funciona",
      title: "Cómo funciona",
      steps: [
        {
          title: "Escribinos por WhatsApp",
          description:
            "Contanos qué necesitás — entradas para eventos, pedidos en MercadoLibre o compras en tiendas locales.",
        },
        {
          title: "Lo conseguimos por vos",
          description:
            "Lo buscamos, lo compramos y te vamos contando por el chat.",
        },
        {
          title: "Tu pedido, resuelto",
          description:
            "Te espera donde te quedes. Todo por el chat.",
        },
      ],
    },
    services: {
      eyebrow: "A tu alcance",
      title: "Qué podemos hacer",
      items: [
        {
          title: "Compras Online",
          description:
            "Compramos por vos en MercadoLibre, Fravega, Farmacity y cualquier tienda local",
        },
        {
          title: "Entradas a Shows y Recitales",
          description:
            "Incluso los agotados",
        },
        {
          title: "Productos Locales",
          description: "Artesanías, vinos, cuero, dulces típicos para llevar",
        },
      ],
    },
    testimonials: {
      eyebrow: "Lo que dicen",
      title: "Lo que dicen nuestros clientes",
    },
    about: {
      title: "Quiénes somos",
      body: "Somos un equipo local en Buenos Aires. Sabemos lo frustrante que es visitar Argentina y no poder comprar, pagar o reservar por restricciones de tarjetas y cuentas. Creamos Concierge para resolver eso — un simple mensaje de WhatsApp te conecta con alguien que lo consigue por vos, para que vos disfrutes tu viaje.",
      contact: "Consultas? Escribinos a info@concierge.com.ar",
    },
    faq: {
      eyebrow: "Dudas",
      title: "Preguntas frecuentes",
      items: [
        {
          q: "Cómo funciona el pago?",
          a: "Te mandamos un link de PayPal. Podés pagar con tarjeta de crédito, débito o saldo de PayPal. Siempre ves el total exacto antes de pagar.",
        },
        {
          q: "Es seguro?",
          a: "Sí. Te mandamos cotización detallada antes de cobrar. Sin pago sin tu aprobación.",
        },
        {
          q: "Qué pasa si hay un problema?",
          a: "Gestionamos devoluciones y reclamos por vos. Si hay un problema, el riesgo es nuestro.",
        },
        {
          q: "Dónde recibo mi pedido?",
          a: "Te espera donde te quedes — hotel o Airbnb, en cualquier parte de Buenos Aires.",
        },
        {
          q: "Qué no pueden comprar?",
          a: "Artículos ilegales o restringidos, y lo que esté fuera de productos y entradas.",
        },
        {
          q: "Necesito crear una cuenta?",
          a: "No. Solo WhatsApp o nuestro chat. Nada más.",
        },
        {
          q: "En qué idiomas trabajan?",
          a: "English, Español y Português.",
        },
      ],
    },
    finalCta: {
      h2: "Listo para comprar como un local?",
      subtitle: "Empieza con un mensaje. Contanos qué necesitás.",
      chatCta: "¿Sin WhatsApp? Chateá acá",
      cta: "Chateá por WhatsApp",
      ctaNote: "Sin app. Sin registro. Un mensaje.",
    },
    footer: {
      tagline: "Entradas, MercadoLibre, tiendas locales — resuelto.",
      linkLabels: [
        "Cómo funciona",
        "Servicios",
        "FAQ",
        "Quiénes somos",
      ],
      legal: "© 2026 Concierge. Todos los derechos reservados.",
    },
  },

  pt: {
    waLink:
      "https://wa.me/5491158637341?text=Oi!%20Vou%20ficar%20um%20tempo%20em%20BA%20e%20preciso%20de%20algu%C3%A9m%20local%20que%20me%20d%C3%AA%20uma%20m%C3%A3o",
    header: {
      cta: "Falar conosco",
    },
    hero: {
      h1: "A gente cuida do local.",
      h1Echo: "Cuide de aproveitar.",
      subtitle:
        "Não consegue pagar com cartão estrangeiro? Não consegue criar conta local? Fale conosco — compramos pra você.",
      chatCta: "Sem WhatsApp? Chat aqui",
      cta: "Fale pelo WhatsApp",
      eyebrow: "Seu fixer local em Buenos Aires",
      ctaNote: "Sem app. Sem cadastro. Uma mensagem.",
      chat: {
        aria: "Exemplo de conversa no WhatsApp com a Concierge",
        status: "no WhatsApp · 24/7",
        messages: [
          {
            from: "tourist",
            text: "Oi! Quero uma camisa do River mas meu cartão não passa 😅",
          },
          {
            from: "concierge",
            text: "Deixa com a gente. Compramos pra você — você paga com PayPal.",
          },
          {
            from: "concierge",
            text: "Prontinho. Sua camisa te espera onde você ficar ✨",
          },
        ],
      },
    },
    trust: {
      items: [
        { title: "24/7 no WhatsApp", sub: "Uma mensagem e já começamos" },
        { title: "Pague com PayPal", sub: "Cartão, débito ou saldo — cotação antes" },
        { title: "EN · ES · PT", sub: "A gente fala seu idioma" },
        { title: "Te espera onde você ficar", sub: "Hotel ou Airbnb" },
      ],
    },
    marquee: {
      eyebrow: "O que a gente consegue",
      aria: "Produtos e ingressos que a gente consegue",
      items: [
        "Camisa de futebol",
        "Ingresso pro show esgotado",
        "Vinho de Mendoza",
        "Jaqueta de couro",
        "Alfajores",
        "Mate e bomba",
        "Aquele achado do MercadoLibre",
        "Tênis edição local",
        "Vinis",
        "Perfume",
      ],
    },
    midCta: {
      text: "Tudo isso aí em cima — a gente consegue pra você.",
      cta: "Peça pelo WhatsApp",
    },
    ctaBar: { label: "Fale no WhatsApp" },
    howItWorks: {
      eyebrow: "Como funciona",
      title: "Como funciona",
      steps: [
        {
          title: "Mande mensagem no WhatsApp",
          description:
            "Diga o que precisa — ingressos para eventos, pedidos no MercadoLibre ou compras em lojas locais.",
        },
        {
          title: "A gente compra pra você",
          description:
            "Buscamos, compramos e te contamos tudo pelo chat.",
        },
        {
          title: "Seu pedido, resolvido",
          description:
            "Te espera onde você ficar. Tudo pelo chat.",
        },
      ],
    },
    services: {
      eyebrow: "Ao seu alcance",
      title: "O que podemos fazer",
      items: [
        {
          title: "Compras Online",
          description:
            "Compramos pra você no MercadoLibre, Fravega, Farmacity e qualquer loja local",
        },
        {
          title: "Ingressos para Shows e Recitais",
          description:
            "Até os esgotados",
        },
        {
          title: "Produtos Locais",
          description: "Artesanato, vinhos, couro, doces típicos para levar",
        },
      ],
    },
    testimonials: {
      eyebrow: "O que dizem",
      title: "O que nossos clientes dizem",
    },
    about: {
      title: "Quem somos",
      body: "Somos uma equipe local em Buenos Aires. Sabemos como é frustrante visitar a Argentina e não conseguir comprar, pagar ou reservar por restrições de cartões e contas. Criamos o Concierge pra resolver isso — uma simples mensagem no WhatsApp te conecta com alguém que consegue pra você, assim você aproveita sua viagem.",
      contact: "Dúvidas? Escreva pra info@concierge.com.ar",
    },
    faq: {
      eyebrow: "Dúvidas",
      title: "Perguntas frequentes",
      items: [
        {
          q: "Como funciona o pagamento?",
          a: "Enviamos um link do PayPal. Você pode pagar com cartão de crédito, débito ou saldo do PayPal. Sempre vê o total exato antes de pagar.",
        },
        {
          q: "É seguro?",
          a: "Sim. Enviamos cotação detalhada antes de cobrar. Sem pagamento sem sua aprovação.",
        },
        {
          q: "E se algo der errado?",
          a: "Cuidamos de devoluções e reclamações por você. Se houver problema, o risco é nosso.",
        },
        {
          q: "Onde eu recebo meu pedido?",
          a: "Vai te esperar onde você ficar — hotel ou Airbnb, em qualquer lugar de Buenos Aires.",
        },
        {
          q: "O que não podem comprar?",
          a: "Itens ilegais ou restritos, e o que estiver fora de produtos e ingressos.",
        },
        {
          q: "Preciso criar uma conta?",
          a: "Não. Só WhatsApp ou nosso chat. Só isso.",
        },
        {
          q: "Em quais idiomas trabalham?",
          a: "English, Español e Português.",
        },
      ],
    },
    finalCta: {
      h2: "Pronto para comprar como um local?",
      subtitle: "Começa com uma mensagem. Diga o que precisa.",
      chatCta: "Sem WhatsApp? Chat aqui",
      cta: "Fale pelo WhatsApp",
      ctaNote: "Sem app. Sem cadastro. Uma mensagem.",
    },
    footer: {
      tagline: "Ingressos, MercadoLibre, lojas locais — resolvido.",
      linkLabels: ["Como funciona", "Serviços", "FAQ", "Quem somos"],
      legal: "© 2026 Concierge. Todos os direitos reservados.",
    },
  },
}
