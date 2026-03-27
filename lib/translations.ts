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
  pricing: { title: string; body: string; subDetail: string; note: string }
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
      "https://wa.me/5491158637341?text=Hi!%20I%20saw%20Concierge%20and%20I'd%20like%20to%20place%20an%20order",
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
            "Tell us what you need: products, reservations, tickets, online purchases, anything.",
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
          title: "Food & Delivery",
          description:
            "We order from PedidosYa, Rappi, or buy directly from local spots",
        },
        {
          title: "Experiences",
          description:
            "Restaurant reservations, tango shows, tours, event tickets",
        },
        {
          title: "Local Products",
          description:
            "Artisan goods, wine, leather, sweets — packaged for travel",
        },
        {
          title: "Payments & Services",
          description:
            "QR payments, SUBE card top-ups, and anything needing a local account",
        },
        {
          title: "Whatever You Need",
          description: "Not on the list? Ask us. We'll do our best.",
        },
      ],
    },
    testimonials: {
      title: "What our clients say",
    },
    about: {
      title: "Who's behind Concierge?",
      body: "We're a local team in Buenos Aires. We know how frustrating it is to visit Argentina and not be able to buy, pay, or book things because of card and account restrictions. We created Concierge to fix that — a simple WhatsApp message connects you with someone who handles everything locally, so you can enjoy your trip.",
      contact: "Questions? Email us at hola@concierge.com.ar",
    },
    pricing: {
      title: "Transparent pricing",
      body: "You pay the product price + our service fee. Before we buy anything, we send you an exact quote with the total cost. No surprises, no hidden fees.",
      subDetail:
        "Service fee: varies by order (typically 10-20%). You always approve the total before we proceed.",
      note: "Payment via Mercado Pago, bank transfer, or crypto. All in USD or ARS.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          q: "How does payment work?",
          a: "We send you a payment link via Mercado Pago or bank transfer details. You can pay in USD or ARS. You always see the exact total before paying.",
        },
        {
          q: "Is this safe?",
          a: "Yes. We're a registered company in Buenos Aires. We send you a detailed quote before charging anything. No payment without your approval.",
        },
        {
          q: "How long does delivery take?",
          a: "Depends on the order. Food delivery: 1-2 hours. Online purchases: 24-48 hours. Experiences and reservations: usually same day.",
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
          a: "No. Just WhatsApp. That's it.",
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
      tagline: "Every local errand in Buenos Aires, handled.",
      linkLabels: ["How it works", "Services", "Pricing", "FAQ", "About"],
      legal: "© 2026 Concierge. All rights reserved.",
    },
  },

  es: {
    waLink:
      "https://wa.me/5491158637341?text=Hola!%20Vi%20Concierge%20y%20quiero%20hacer%20un%20pedido",
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
            "Contanos qué necesitás: productos, reservas, entradas, compras online, lo que sea.",
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
          title: "Food & Delivery",
          description:
            "Pedimos por PedidosYa, Rappi, o compramos directo en locales",
        },
        {
          title: "Experiencias",
          description:
            "Reservas en restaurantes, shows de tango, tours, entradas",
        },
        {
          title: "Productos Locales",
          description: "Artesanías, vinos, cuero, dulces típicos para llevar",
        },
        {
          title: "Pagos y Servicios",
          description:
            "Pagos con QR, carga de SUBE, y lo que necesite cuenta local",
        },
        {
          title: "Lo Que Necesites",
          description: "No está en la lista? Preguntanos. Hacemos lo posible.",
        },
      ],
    },
    testimonials: {
      title: "Lo que dicen nuestros clientes",
    },
    about: {
      title: "Quiénes somos",
      body: "Somos un equipo local en Buenos Aires. Sabemos lo frustrante que es visitar Argentina y no poder comprar, pagar o reservar por restricciones de tarjetas y cuentas. Creamos Concierge para resolver eso — un simple mensaje de WhatsApp te conecta con alguien que gestiona todo localmente, para que vos disfrutes tu viaje.",
      contact: "Consultas? Escribinos a hola@concierge.com.ar",
    },
    pricing: {
      title: "Precios transparentes",
      body: "Pagás el precio del producto + nuestra comisión de servicio. Antes de comprar, te mandamos una cotización exacta con el costo total. Sin sorpresas, sin costos ocultos.",
      subDetail:
        "Comisión de servicio: varía según el pedido (generalmente 10-20%). Siempre aprobás el total antes de que avancemos.",
      note: "Pago por Mercado Pago, transferencia bancaria o crypto. Todo en USD o ARS.",
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        {
          q: "Cómo funciona el pago?",
          a: "Te mandamos un link de pago por Mercado Pago o datos de transferencia. Podés pagar en USD o ARS. Siempre ves el total exacto antes de pagar.",
        },
        {
          q: "Es seguro?",
          a: "Sí. Somos una empresa registrada en Buenos Aires. Te mandamos cotización detallada antes de cobrar. Sin pago sin tu aprobación.",
        },
        {
          q: "Cuánto tarda la entrega?",
          a: "Depende del pedido. Food delivery: 1-2 horas. Compras online: 24-48 horas. Experiencias y reservas: generalmente en el día.",
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
          a: "No. Solo WhatsApp. Nada más.",
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
      tagline: "Cada gestión local en Buenos Aires, resuelta.",
      linkLabels: [
        "Cómo funciona",
        "Servicios",
        "Precios",
        "FAQ",
        "Quiénes somos",
      ],
      legal: "© 2026 Concierge. Todos los derechos reservados.",
    },
  },

  pt: {
    waLink:
      "https://wa.me/5491158637341?text=Oi!%20Vi%20o%20Concierge%20e%20quero%20fazer%20um%20pedido",
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
            "Diga o que precisa: produtos, reservas, ingressos, compras online, qualquer coisa.",
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
          title: "Food & Delivery",
          description:
            "Pedimos no PedidosYa, Rappi, ou compramos direto em locais",
        },
        {
          title: "Experiências",
          description:
            "Reservas em restaurantes, shows de tango, tours, ingressos",
        },
        {
          title: "Produtos Locais",
          description: "Artesanato, vinhos, couro, doces típicos para levar",
        },
        {
          title: "Pagamentos e Serviços",
          description:
            "Pagamentos QR, recarga de SUBE, e tudo que precise de conta local",
        },
        {
          title: "O Que Precisar",
          description: "Não está na lista? Pergunte. Fazemos o possível.",
        },
      ],
    },
    testimonials: {
      title: "O que nossos clientes dizem",
    },
    about: {
      title: "Quem somos",
      body: "Somos uma equipe local em Buenos Aires. Sabemos como é frustrante visitar a Argentina e não conseguir comprar, pagar ou reservar por restrições de cartões e contas. Criamos o Concierge pra resolver isso — uma simples mensagem no WhatsApp te conecta com alguém que resolve tudo localmente, pra você aproveitar sua viagem.",
      contact: "Dúvidas? Escreva pra hola@concierge.com.ar",
    },
    pricing: {
      title: "Preços transparentes",
      body: "Você paga o preço do produto + nossa taxa de serviço. Antes de comprar, enviamos uma cotação exata com o custo total. Sem surpresas, sem taxas ocultas.",
      subDetail:
        "Taxa de serviço: varia por pedido (geralmente 10-20%). Você sempre aprova o total antes de prosseguirmos.",
      note: "Pagamento via Mercado Pago, transferência bancária ou crypto. Tudo em USD ou ARS.",
    },
    faq: {
      title: "Perguntas frequentes",
      items: [
        {
          q: "Como funciona o pagamento?",
          a: "Enviamos um link de pagamento via Mercado Pago ou dados de transferência. Pode pagar em USD ou ARS. Sempre vê o total exato antes de pagar.",
        },
        {
          q: "É seguro?",
          a: "Sim. Somos uma empresa registrada em Buenos Aires. Enviamos cotação detalhada antes de cobrar. Sem pagamento sem sua aprovação.",
        },
        {
          q: "Quanto tempo demora a entrega?",
          a: "Depende do pedido. Food delivery: 1-2 horas. Compras online: 24-48 horas. Experiências e reservas: geralmente no mesmo dia.",
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
          a: "Não. Só WhatsApp. Só isso.",
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
      tagline: "Cada tarefa local em Buenos Aires, resolvida.",
      linkLabels: ["Como funciona", "Serviços", "Preços", "FAQ", "Quem somos"],
      legal: "© 2026 Concierge. Todos os direitos reservados.",
    },
  },
}
