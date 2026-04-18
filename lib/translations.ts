export type Lang = "en" | "es" | "pt"

interface LangConfig {
  waLink: string
  header: { cta: string }
  hero: { h1: string; h1Echo: string; subtitle: string; cta: string; chatCta: string }
  howItWorks: {
    title: string
    steps: Array<{ title: string; description: string }>
  }
  services: {
    title: string
    items: Array<{ title: string; description: string }>
  }
  testimonials: { title: string }
  about: { title: string; body: string; contact: string }
  faq: {
    title: string
    items: Array<{ q: string; a: string }>
  }
  finalCta: { h2: string; subtitle: string; cta: string; chatCta: string }
  footer: {
    tagline: string
    linkLabels: string[]
    legal: string
  }
}

export const translations: Record<Lang, LangConfig> = {
  en: {
    waLink:
      "https://wa.me/5491158637341?text=Hi!%20Spending%20some%20time%20in%20BA%20and%20need%20someone%20local%20to%20help%20me%20out",
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
    },
    howItWorks: {
      title: "How it works",
      steps: [
        {
          title: "Message us on WhatsApp",
          description:
            "Tell us what you need — event tickets, MercadoLibre orders, or local store purchases.",
        },
        {
          title: "Your local concierge handles everything",
          description: "We research, buy, book, and coordinate it all for you.",
        },
        {
          title: "Receive your order",
          description:
            "We deliver wherever you are. Everything managed through the chat.",
        },
      ],
    },
    services: {
      title: "What we can do",
      items: [
        {
          title: "Online Shopping",
          description:
            "We buy for you on MercadoLibre, Fravega, Farmacity, and any local store",
        },
        {
          title: "Experiences",
          description:
            "Tango shows, tours, event tickets",
        },
        {
          title: "Local Products",
          description:
            "Artisan goods, wine, leather, sweets — packaged for travel",
        },
      ],
    },
    testimonials: {
      title: "What our clients say",
    },
    about: {
      title: "Who's behind Concierge?",
      body: "We're a local team in Buenos Aires. We know how frustrating it is to visit Argentina and not be able to buy, pay, or book things because of card and account restrictions. We created Concierge to fix that — a simple WhatsApp message connects you with someone who handles everything locally, so you can enjoy your trip.",
      contact: "Questions? Email us at info@concierge.com.ar",
    },
    faq: {
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
          q: "Do you deliver to my hotel or Airbnb?",
          a: "Yes, anywhere in Buenos Aires. Just send us the address.",
        },
        {
          q: "What can't you buy?",
          a: "Illegal or restricted items. Everything else, yes.",
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
        "No podés pagar con tarjeta extranjera? No podés crear cuenta local? Escribinos — compramos, reservamos y entregamos por vos.",
      chatCta: "¿Sin WhatsApp? Chateá acá",
      cta: "Chateá por WhatsApp",
    },
    howItWorks: {
      title: "Cómo funciona",
      steps: [
        {
          title: "Escribinos por WhatsApp",
          description:
            "Contanos qué necesitás — entradas para eventos, pedidos en MercadoLibre o compras en tiendas locales.",
        },
        {
          title: "Tu concierge local se encarga de todo",
          description:
            "Investigamos, compramos, reservamos y coordinamos todo por vos.",
        },
        {
          title: "Recibí tu pedido",
          description:
            "Te lo entregamos donde estés. Todo se gestiona por el chat.",
        },
      ],
    },
    services: {
      title: "Qué podemos hacer",
      items: [
        {
          title: "Compras Online",
          description:
            "Compramos por vos en MercadoLibre, Fravega, Farmacity y cualquier tienda local",
        },
        {
          title: "Experiencias",
          description:
            "Shows de tango, tours, entradas para eventos",
        },
        {
          title: "Productos Locales",
          description: "Artesanías, vinos, cuero, dulces típicos para llevar",
        },
      ],
    },
    testimonials: {
      title: "Lo que dicen nuestros clientes",
    },
    about: {
      title: "Quiénes somos",
      body: "Somos un equipo local en Buenos Aires. Sabemos lo frustrante que es visitar Argentina y no poder comprar, pagar o reservar por restricciones de tarjetas y cuentas. Creamos Concierge para resolver eso — un simple mensaje de WhatsApp te conecta con alguien que gestiona todo localmente, para que vos disfrutes tu viaje.",
      contact: "Consultas? Escribinos a info@concierge.com.ar",
    },
    faq: {
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
          q: "Entregan a mi hotel o Airbnb?",
          a: "Sí, a cualquier dirección en Buenos Aires. Solo mandanos la dirección.",
        },
        {
          q: "Qué no pueden comprar?",
          a: "Artículos ilegales o restringidos. Todo lo demás, sí.",
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
        "Não consegue pagar com cartão estrangeiro? Não consegue criar conta local? Fale conosco — compramos, reservamos e entregamos pra você.",
      chatCta: "Sem WhatsApp? Chat aqui",
      cta: "Fale pelo WhatsApp",
    },
    howItWorks: {
      title: "Como funciona",
      steps: [
        {
          title: "Mande mensagem no WhatsApp",
          description:
            "Diga o que precisa — ingressos para eventos, pedidos no MercadoLibre ou compras em lojas locais.",
        },
        {
          title: "Seu concierge local cuida de tudo",
          description:
            "Pesquisamos, compramos, reservamos e coordenamos tudo pra você.",
        },
        {
          title: "Receba seu pedido",
          description:
            "Entregamos onde você estiver. Tudo gerenciado pelo chat.",
        },
      ],
    },
    services: {
      title: "O que podemos fazer",
      items: [
        {
          title: "Compras Online",
          description:
            "Compramos pra você no MercadoLibre, Fravega, Farmacity e qualquer loja local",
        },
        {
          title: "Experiências",
          description:
            "Shows de tango, tours, ingressos para eventos",
        },
        {
          title: "Produtos Locais",
          description: "Artesanato, vinhos, couro, doces típicos para levar",
        },
      ],
    },
    testimonials: {
      title: "O que nossos clientes dizem",
    },
    about: {
      title: "Quem somos",
      body: "Somos uma equipe local em Buenos Aires. Sabemos como é frustrante visitar a Argentina e não conseguir comprar, pagar ou reservar por restrições de cartões e contas. Criamos o Concierge pra resolver isso — uma simples mensagem no WhatsApp te conecta com alguém que resolve tudo localmente, pra você aproveitar sua viagem.",
      contact: "Dúvidas? Escreva pra info@concierge.com.ar",
    },
    faq: {
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
          q: "Entregam no meu hotel ou Airbnb?",
          a: "Sim, em qualquer endereço em Buenos Aires. Só mande o endereço.",
        },
        {
          q: "O que não podem comprar?",
          a: "Itens ilegais ou restritos. Todo o resto, sim.",
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
    },
    footer: {
      tagline: "Ingressos, MercadoLibre, lojas locais — resolvido.",
      linkLabels: ["Como funciona", "Serviços", "FAQ", "Quem somos"],
      legal: "© 2026 Concierge. Todos os direitos reservados.",
    },
  },
}
