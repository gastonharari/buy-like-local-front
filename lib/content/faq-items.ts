import type { FaqItem } from "@/lib/faq"

// Question pool shared by the guide pages (4–6 each) and the /en/faq, /pt/faq, /es/faq hubs (11
// each). Same ids in every language; e2e/faq-jsonld.spec.ts checks the pools match, TODOs included.
//
// Writing rules (session-1 brief + BRAND.md):
// - Questions phrased the way a traveler types them into ChatGPT. No real customer phrasing from
//   ChatGPT traffic exists yet; these start from the examples in the brief.
// - `answer` = the first one or two sentences, 40–60 words, answers the question without selling.
//   e2e/faq-jsonld.spec.ts enforces the word count.
// - Claims: commission 10–20% (confirmed by the brief) and what the current site already says
//   (quote before paying, no payment without approval, returns/claims handled, waits where you
//   stay, EN/ES/PT, WhatsApp or web chat). Never: PayPal or any payment method, delivery dates
//   or times, ticket availability, response times, DNI/bank help.
// - Anything that still needs Gastón goes in `todo` ("TODO(gaston): …"), which is never
//   rendered; the visible answer stays a safe interim one.
// - Spanish: rioplatense voseo ("podés", "mandanos"), as in BRAND.md ("Encargate de disfrutar")
//   and the landing's ES copy. The reader is a Spanish-speaking foreigner in Argentina (Uruguay,
//   Chile, Colombia, Spain…), not an Argentine: always "DNI argentino", never assume local ties.

type Pool = Record<string, FaqItem>

export const FAQ_EN: Pool = {
  "where-shop-online": {
    id: "where-shop-online",
    q: "Where can I shop online in Argentina as a tourist?",
    answer:
      "Mostly on MercadoLibre: it's where Argentina shops online, the way you'd use Amazon at home, and many local stores sell there too. To buy on it you need an account verified with an Argentine DNI, so most tourists can't check out. Concierge buys it for you with our local account once you approve the quote.",
    link: { href: "/en/buy-on-mercadolibre-as-a-foreigner", label: "Guide: buying on MercadoLibre as a foreigner" },
  },
  "ml-without-dni": {
    id: "ml-without-dni",
    q: "Can I buy on MercadoLibre without a DNI?",
    answer:
      "Not on your own: MercadoLibre Argentina asks for an Argentine DNI to create and verify an account, so most tourists can't finish signing up. Concierge buys it for you instead: you send us the product link on WhatsApp, approve the quote, and we buy it with our local account.",
    detail: "Then it waits for you where you're staying in Buenos Aires.",
    link: { href: "/en/buy-on-mercadolibre-as-a-foreigner", label: "Guide: buying on MercadoLibre as a foreigner" },
  },
  "ml-foreign-card": {
    id: "ml-foreign-card",
    q: "Can I use my foreign card on MercadoLibre Argentina?",
    answer:
      "Even when a foreign card works, you first need a MercadoLibre Argentina account, which asks for an Argentine DNI, and many foreign cards are declined at checkout anyway. Concierge gets around both: we buy it for you with our local account and pay locally, after you approve the quote.",
    link: { href: "/en/buy-on-mercadolibre-as-a-foreigner", label: "Guide: buying on MercadoLibre as a foreigner" },
  },
  "tickets-foreigners": {
    id: "tickets-foreigners",
    q: "Can foreigners buy Ticketek or Passline tickets?",
    answer:
      "Often not on their own: Ticketek and Passline usually ask for an Argentine DNI when you sign up or check out, and foreign cards are often declined. Concierge buys the tickets for you with our local account once you approve the quote, as long as there are tickets on sale.",
    link: { href: "/en/ticketek-passline-without-dni", label: "Guide: Ticketek and Passline without a DNI" },
  },
  "tickets-how-get": {
    id: "tickets-how-get",
    q: "How do I get the tickets you buy for me?",
    answer:
      "It depends on how each show issues its tickets: some are e-tickets, others are transferred in the ticketing app or picked up at the venue. Before buying, we check that show's rules with you and tell you how you'll get in, so you know before you pay.",
    link: { href: "/en/ticketek-passline-without-dni", label: "Guide: Ticketek and Passline without a DNI" },
    todo: "TODO(gaston): confirmar cómo le llega la entrada al cliente (e-ticket, transferencia en la app de la ticketera, retiro en boletería) y qué pasa con las entradas nominativas a nombre de quien compra. La respuesta visible no promete un método.",
  },
  fee: {
    id: "fee",
    q: "How does Concierge charge?",
    answer:
      "Concierge charges a service fee of 10 to 20% of the purchase price, depending on the order. Before buying anything we send you a quote with the exact total, our fee included, and nothing is charged until you approve it in the chat.",
    detail: "There's nothing to sign up for: you only pay for the purchases you approve.",
    link: { href: "/en/faq#fee", label: "All questions about Concierge" },
  },
  timing: {
    id: "timing",
    q: "How long does a purchase take?",
    answer:
      "It depends on the store, the product and where it ships from, so we don't promise a fixed time. Before you pay, we tell you what we know about timing for your specific purchase, and we keep you posted in the WhatsApp chat until it's waiting where you stay.",
    link: { href: "/en/faq#timing", label: "All questions about Concierge" },
    todo: "TODO(gaston): agregar plazos típicos confirmados (MercadoLibre, tiendas locales, entradas). Hoy no hay dato confirmado y la respuesta visible no promete ningún plazo.",
  },
  "pay-from-abroad": {
    id: "pay-from-abroad",
    q: "How do I pay you from abroad?",
    answer:
      "You pay online, from wherever you are, after you approve the quote. You don't need an Argentine bank account, card or DNI to pay us: we send you the payment details in the WhatsApp chat, together with the exact total in your quote.",
    link: { href: "/en/faq#pay-from-abroad", label: "All questions about Concierge" },
    todo: "TODO(gaston): nombrar los medios de pago confirmados (¿tarjeta extranjera? ¿por qué procesador? ¿USD o ARS?). El brief de la sesión 1 prohíbe afirmar PayPal hasta confirmarlo; la respuesta visible no nombra ningún medio.",
  },
  "where-receive": {
    id: "where-receive",
    q: "Where do I get what you buy for me?",
    answer:
      "Your order waits for you where you're staying in Buenos Aires, whether that's a hotel or an Airbnb. Send us the address in the chat when you approve the quote, and we coordinate the rest with you there, so you don't have to deal with the store or the courier.",
    link: { href: "/en/faq#where-receive", label: "All questions about Concierge" },
  },
  "what-can-you-buy": {
    id: "what-can-you-buy",
    q: "What can Concierge buy for me?",
    answer:
      "Concierge buys products on MercadoLibre and in local stores, from clothes and electronics to wine and gifts, and tickets to shows and concerts in Buenos Aires. We don't do food delivery, QR payments in shops, money transfers, currency exchange or paperwork such as a DNI or a bank account.",
    detail: "Illegal or restricted items are out too.",
    link: { href: "/en/faq#what-can-you-buy", label: "All questions about Concierge" },
  },
  "local-stores": {
    id: "local-stores",
    q: "Can you buy from Argentine stores that aren't on MercadoLibre?",
    answer:
      "Yes: besides MercadoLibre, we buy from local online stores and brand websites, such as Fravega or Farmacity, when they reject foreign cards or ask for a DNI at checkout. Send us the link or the product name on WhatsApp, and we quote it the same way, with our 10 to 20% fee included.",
    link: { href: "/en/buy-on-mercadolibre-as-a-foreigner", label: "Guide: buying on MercadoLibre as a foreigner" },
  },
  "dni-bank-help": {
    id: "dni-bank-help",
    q: "Can you help me get a DNI or open an Argentine bank account?",
    answer:
      "No: Concierge doesn't handle DNI, residency, bank or Mercado Pago paperwork, and we can't open accounts in your name. What we do is buy for you with our own local account, products on MercadoLibre and in local stores and tickets to shows, so you don't need them to buy.",
    link: { href: "/en/faq#dni-bank-help", label: "All questions about Concierge" },
  },
  safe: {
    id: "safe",
    q: "Is it safe to let Concierge buy for me?",
    answer:
      "Yes: you always get a detailed quote with the exact total before we buy anything, and nothing is charged until you approve it. Every step happens in the WhatsApp chat, and if something goes wrong with the order we handle returns and claims with the store on your behalf.",
    link: { href: "/en/faq#safe", label: "All questions about Concierge" },
  },
  "phone-number": {
    id: "phone-number",
    q: "Do I need an Argentine phone number or an account with Concierge?",
    answer:
      "Neither: you write to us on WhatsApp from your own number, from any country, and there's no app to download and nothing to sign up for. If you don't use WhatsApp, you can also chat with us from the website, in English, Spanish or Portuguese.",
    link: { href: "/en/faq#phone-number", label: "All questions about Concierge" },
  },
}

export const FAQ_PT: Pool = {
  "where-shop-online": {
    id: "where-shop-online",
    q: "Onde comprar online na Argentina sendo turista?",
    answer:
      "Principalmente no MercadoLibre: é onde a Argentina compra online, como você usaria a Amazon em casa, e muitas lojas locais vendem lá também. Para comprar, você precisa de uma conta verificada com DNI argentino, então a maioria dos turistas não consegue finalizar. O Concierge compra por você com a nossa conta local, depois que você aprova o orçamento.",
    link: { href: "/pt/comprar-no-mercadolibre-sendo-estrangeiro", label: "Guia: comprar no MercadoLibre sendo estrangeiro" },
  },
  "ml-without-dni": {
    id: "ml-without-dni",
    q: "Dá pra comprar no MercadoLibre sem DNI?",
    answer:
      "Sozinho, não: o MercadoLibre da Argentina pede um DNI argentino para criar e verificar a conta, então a maioria dos turistas não consegue terminar o cadastro. O Concierge compra por você: você manda o link do produto no WhatsApp, aprova o orçamento e a gente compra com a nossa conta local.",
    detail: "Depois, ele fica te esperando onde você está hospedado em Buenos Aires.",
    link: { href: "/pt/comprar-no-mercadolibre-sendo-estrangeiro", label: "Guia: comprar no MercadoLibre sendo estrangeiro" },
  },
  "ml-foreign-card": {
    id: "ml-foreign-card",
    q: "Dá pra usar cartão estrangeiro no MercadoLibre da Argentina?",
    answer:
      "Mesmo quando o cartão estrangeiro funciona, primeiro você precisa de uma conta no MercadoLibre da Argentina, que pede DNI argentino, e muitos cartões de fora são recusados no checkout. O Concierge resolve as duas coisas: a gente compra por você com a nossa conta local e paga aqui, depois que você aprova o orçamento.",
    link: { href: "/pt/comprar-no-mercadolibre-sendo-estrangeiro", label: "Guia: comprar no MercadoLibre sendo estrangeiro" },
  },
  "tickets-foreigners": {
    id: "tickets-foreigners",
    q: "Estrangeiro consegue comprar ingresso na Ticketek ou na Passline?",
    answer:
      "Muitas vezes, sozinho não: a Ticketek e a Passline costumam pedir DNI argentino no cadastro ou na compra, e cartões estrangeiros são recusados com frequência. O Concierge compra os ingressos por você com a nossa conta local, depois que você aprova o orçamento, desde que haja ingressos à venda.",
    link: { href: "/pt/ticketek-passline-sem-dni", label: "Guia: Ticketek e Passline sem DNI" },
  },
  "tickets-how-get": {
    id: "tickets-how-get",
    q: "Como eu recebo os ingressos que vocês compram?",
    answer:
      "Depende de como cada show emite os ingressos: alguns são e-tickets, outros são transferidos no app da bilheteria ou retirados no local. Antes de comprar, a gente confere as regras daquele show com você e explica como você vai entrar, para você saber tudo antes de pagar.",
    link: { href: "/pt/ticketek-passline-sem-dni", label: "Guia: Ticketek e Passline sem DNI" },
    todo: "TODO(gaston): confirmar como o ingresso chega ao cliente (e-ticket, transferência no app, retirada na bilheteria) e o que acontece com ingressos nominais. Mesmo ponto que o TODO de tickets-how-get em inglês.",
  },
  fee: {
    id: "fee",
    q: "Como o Concierge cobra?",
    answer:
      "O Concierge cobra uma taxa de serviço de 10 a 20% do valor da compra, dependendo do pedido. Antes de comprar qualquer coisa, a gente manda um orçamento com o total exato, taxa incluída, e nada é cobrado até você aprovar no chat.",
    detail: "Não tem cadastro: você só paga pelas compras que aprovar.",
    link: { href: "/pt/faq#fee", label: "Todas as perguntas sobre o Concierge" },
  },
  timing: {
    id: "timing",
    q: "Quanto tempo demora uma compra?",
    answer:
      "Depende da loja, do produto e de onde ele sai, então a gente não promete um prazo fixo. Antes de você pagar, a gente conta o que sabe sobre o prazo da sua compra e vai te atualizando no chat do WhatsApp até ela estar te esperando onde você está hospedado.",
    link: { href: "/pt/faq#timing", label: "Todas as perguntas sobre o Concierge" },
    todo: "TODO(gaston): mesmo ponto que o TODO de timing em inglês: prazos típicos confirmados.",
  },
  "pay-from-abroad": {
    id: "pay-from-abroad",
    q: "Como eu pago vocês do exterior?",
    answer:
      "Você paga online, de onde estiver, depois de aprovar o orçamento. Não precisa de conta bancária, cartão ou DNI argentino para pagar a gente: mandamos os dados de pagamento no chat do WhatsApp, junto com o total exato do seu orçamento.",
    link: { href: "/pt/faq#pay-from-abroad", label: "Todas as perguntas sobre o Concierge" },
    todo: "TODO(gaston): mesmo ponto que o TODO de pay-from-abroad em inglês: meios de pagamento confirmados.",
  },
  "where-receive": {
    id: "where-receive",
    q: "Onde eu recebo o que vocês compram?",
    answer:
      "Seu pedido fica te esperando onde você está hospedado em Buenos Aires, seja hotel ou Airbnb. Você manda o endereço no chat quando aprova o orçamento, e a gente combina o resto com você por lá, sem você precisar falar com a loja ou com a transportadora.",
    link: { href: "/pt/faq#where-receive", label: "Todas as perguntas sobre o Concierge" },
  },
  "what-can-you-buy": {
    id: "what-can-you-buy",
    q: "O que o Concierge pode comprar pra mim?",
    answer:
      "O Concierge compra produtos no MercadoLibre e em lojas locais, de roupa e eletrônicos a vinho e presentes, e ingressos para shows e concertos em Buenos Aires. A gente não faz delivery de comida, pagamento com QR em lojas, transferências, câmbio nem trâmites como DNI ou conta bancária.",
    detail: "Itens ilegais ou restritos também ficam de fora.",
    link: { href: "/pt/faq#what-can-you-buy", label: "Todas as perguntas sobre o Concierge" },
  },
  "local-stores": {
    id: "local-stores",
    q: "Vocês compram em lojas argentinas que não estão no MercadoLibre?",
    answer:
      "Sim: além do MercadoLibre, a gente compra em lojas online e sites de marcas locais, como Fravega ou Farmacity, quando eles recusam cartão estrangeiro ou pedem DNI no checkout. Você manda o link ou o nome do produto no WhatsApp e a gente faz o orçamento do mesmo jeito, com a nossa taxa de 10 a 20% incluída.",
    link: { href: "/pt/comprar-no-mercadolibre-sendo-estrangeiro", label: "Guia: comprar no MercadoLibre sendo estrangeiro" },
  },
  "dni-bank-help": {
    id: "dni-bank-help",
    q: "Vocês ajudam a tirar DNI ou abrir conta em banco argentino?",
    answer:
      "Não: o Concierge não cuida de trâmites de DNI, residência, banco ou Mercado Pago, e não abre contas no seu nome. O que a gente faz é comprar por você com a nossa conta local, produtos no MercadoLibre e em lojas locais e ingressos para shows, então você não precisa desses documentos para comprar.",
    link: { href: "/pt/faq#dni-bank-help", label: "Todas as perguntas sobre o Concierge" },
  },
  safe: {
    id: "safe",
    q: "É seguro deixar o Concierge comprar por mim?",
    answer:
      "Sim: você sempre recebe um orçamento detalhado com o total exato antes de a gente comprar qualquer coisa, e nada é cobrado até você aprovar. Tudo acontece no chat do WhatsApp, e se algo der errado com o pedido, a gente cuida de devoluções e reclamações com a loja por você.",
    link: { href: "/pt/faq#safe", label: "Todas as perguntas sobre o Concierge" },
  },
  "phone-number": {
    id: "phone-number",
    q: "Preciso de número argentino ou de cadastro no Concierge?",
    answer:
      "Nenhum dos dois: você fala com a gente pelo WhatsApp do seu próprio número, de qualquer país, sem baixar app nem fazer cadastro. Se você não usa WhatsApp, também dá pra conversar pelo chat do site, em português, espanhol ou inglês.",
    link: { href: "/pt/faq#phone-number", label: "Todas as perguntas sobre o Concierge" },
  },
}

export const FAQ_ES: Pool = {
  "where-shop-online": {
    id: "where-shop-online",
    q: "¿Dónde puedo comprar online en Argentina siendo turista?",
    answer:
      "Sobre todo en MercadoLibre: es donde Argentina compra online, como vos usarías Amazon en tu país, y muchas tiendas locales también venden ahí. Para comprar necesitás una cuenta verificada con DNI argentino, así que la mayoría de los turistas no puede comprar. En Concierge lo compramos por vos con nuestra cuenta local, después de que apruebes la cotización.",
    link: { href: "/es/comprar-en-mercadolibre-siendo-extranjero", label: "Guía: comprar en MercadoLibre siendo extranjero" },
  },
  "ml-without-dni": {
    id: "ml-without-dni",
    q: "¿Puedo comprar en MercadoLibre sin DNI?",
    answer:
      "Por tu cuenta, no: MercadoLibre Argentina pide un DNI argentino para crear y verificar la cuenta, así que la mayoría de los extranjeros no puede terminar el registro. En Concierge lo compramos por vos: nos mandás el link del producto por WhatsApp, aprobás la cotización y lo compramos con nuestra cuenta local.",
    detail: "Después te espera donde te quedes en Buenos Aires.",
    link: { href: "/es/comprar-en-mercadolibre-siendo-extranjero", label: "Guía: comprar en MercadoLibre siendo extranjero" },
  },
  "ml-foreign-card": {
    id: "ml-foreign-card",
    q: "¿Puedo usar mi tarjeta extranjera en MercadoLibre Argentina?",
    answer:
      "Aunque tu tarjeta extranjera funcione, primero necesitás una cuenta de MercadoLibre Argentina, que pide DNI argentino, y muchas tarjetas de afuera se rechazan al pagar. En Concierge resolvemos las dos cosas: lo compramos por vos con nuestra cuenta local y pagamos acá, después de que apruebes la cotización.",
    link: { href: "/es/comprar-en-mercadolibre-siendo-extranjero", label: "Guía: comprar en MercadoLibre siendo extranjero" },
  },
  "tickets-foreigners": {
    id: "tickets-foreigners",
    q: "¿Un extranjero puede comprar entradas en Ticketek o Passline?",
    answer:
      "Muchas veces, por tu cuenta no: Ticketek y Passline suelen pedir DNI argentino al registrarte o al pagar, y las tarjetas extranjeras se rechazan seguido. En Concierge compramos las entradas por vos con nuestra cuenta local, después de que apruebes la cotización, siempre que haya entradas a la venta.",
    link: { href: "/es/ticketek-passline-sin-dni", label: "Guía: Ticketek y Passline sin DNI" },
  },
  "tickets-how-get": {
    id: "tickets-how-get",
    q: "¿Cómo recibo las entradas que compran por mí?",
    answer:
      "Depende de cómo emite las entradas cada show: algunas son e-tickets, otras se transfieren en la app de la ticketera o se retiran en el lugar. Antes de comprar, revisamos con vos las reglas de ese show y te contamos cómo vas a entrar, así lo sabés antes de pagar.",
    link: { href: "/es/ticketek-passline-sin-dni", label: "Guía: Ticketek y Passline sin DNI" },
    todo: "TODO(gaston): mismo punto que el TODO de tickets-how-get en inglés: cómo le llega la entrada al cliente (e-ticket, transferencia en la app, retiro en boletería) y qué pasa con las entradas nominativas. La respuesta visible no promete un método.",
  },
  fee: {
    id: "fee",
    q: "¿Cómo cobra Concierge?",
    answer:
      "Concierge cobra una comisión de servicio del 10 al 20% del valor de la compra, según el pedido. Antes de comprar nada te mandamos una cotización con el total exacto, comisión incluida, y no se cobra nada hasta que la aprobás en el chat.",
    detail: "No hay que registrarse: solo pagás las compras que aprobás.",
    link: { href: "/es/faq#fee", label: "Todas las preguntas sobre Concierge" },
  },
  timing: {
    id: "timing",
    q: "¿Cuánto tarda una compra?",
    answer:
      "Depende de la tienda, del producto y de dónde sale, así que no prometemos un plazo fijo. Antes de que pagues, te contamos lo que sabemos sobre los tiempos de tu compra y te vamos avisando por el chat de WhatsApp hasta que te esté esperando donde te quedes.",
    link: { href: "/es/faq#timing", label: "Todas las preguntas sobre Concierge" },
    todo: "TODO(gaston): mismo punto que el TODO de timing en inglés: plazos típicos confirmados (MercadoLibre, tiendas locales, entradas). La respuesta visible no promete ningún plazo.",
  },
  "pay-from-abroad": {
    id: "pay-from-abroad",
    q: "¿Cómo les pago desde el exterior?",
    answer:
      "Pagás online, desde donde estés, después de aprobar la cotización. Para pagarnos no necesitás cuenta bancaria, tarjeta ni DNI de Argentina: te mandamos los datos de pago por el chat de WhatsApp, junto con el total exacto de tu cotización, que siempre ves antes de pagar.",
    link: { href: "/es/faq#pay-from-abroad", label: "Todas las preguntas sobre Concierge" },
    todo: "TODO(gaston): mismo punto que el TODO de pay-from-abroad en inglés: medios de pago confirmados. La respuesta visible no nombra ningún medio (decisión 6 del 9-nov: nada de PayPal).",
  },
  "where-receive": {
    id: "where-receive",
    q: "¿Dónde recibo lo que compran por mí?",
    answer:
      "Tu pedido te espera donde te quedes en Buenos Aires, sea un hotel o un Airbnb. Cuando aprobás la cotización nos mandás la dirección por el chat, y coordinamos el resto con vos por ahí, sin que tengas que hablar con la tienda ni con el correo.",
    link: { href: "/es/faq#where-receive", label: "Todas las preguntas sobre Concierge" },
  },
  "what-can-you-buy": {
    id: "what-can-you-buy",
    q: "¿Qué puede comprar Concierge por mí?",
    answer:
      "En Concierge compramos productos en MercadoLibre y en tiendas locales, desde ropa y electrónica hasta vino y regalos, y entradas para shows y recitales en Buenos Aires. No hacemos delivery de comida, pagos con QR en negocios, transferencias de dinero, cambio de moneda ni trámites como DNI o cuenta bancaria.",
    detail: "Lo ilegal o restringido también queda afuera.",
    link: { href: "/es/faq#what-can-you-buy", label: "Todas las preguntas sobre Concierge" },
  },
  "local-stores": {
    id: "local-stores",
    q: "¿Compran en tiendas argentinas que no están en MercadoLibre?",
    answer:
      "Sí: además de MercadoLibre, compramos en tiendas online y sitios de marcas locales, como Frávega o Farmacity, cuando rechazan tarjetas extranjeras o piden DNI al pagar. Mandanos el link o el nombre del producto por WhatsApp y te lo cotizamos igual, con nuestra comisión del 10 al 20% incluida.",
    link: { href: "/es/comprar-en-mercadolibre-siendo-extranjero", label: "Guía: comprar en MercadoLibre siendo extranjero" },
  },
  "dni-bank-help": {
    id: "dni-bank-help",
    q: "¿Me ayudan a sacar el DNI o a abrir una cuenta en un banco argentino?",
    answer:
      "No: en Concierge no hacemos trámites de DNI, residencia, banco ni Mercado Pago, y no podemos abrir cuentas a tu nombre. Lo que hacemos es comprar por vos con nuestra propia cuenta local, productos en MercadoLibre y en tiendas locales y entradas para shows, así no necesitás esos documentos para comprar.",
    link: { href: "/es/faq#dni-bank-help", label: "Todas las preguntas sobre Concierge" },
  },
  safe: {
    id: "safe",
    q: "¿Es seguro que Concierge compre por mí?",
    answer:
      "Sí: siempre recibís una cotización detallada con el total exacto antes de que compremos nada, y no se cobra nada hasta que la aprobás. Todo pasa por el chat de WhatsApp, y si algo sale mal con el pedido, nos encargamos de las devoluciones y los reclamos con la tienda por vos.",
    link: { href: "/es/faq#safe", label: "Todas las preguntas sobre Concierge" },
  },
  "phone-number": {
    id: "phone-number",
    q: "¿Necesito un número argentino o una cuenta en Concierge?",
    answer:
      "Ninguna de las dos cosas: nos escribís por WhatsApp desde tu propio número, de cualquier país, y no tenés que descargar ninguna app ni registrarte. Si no usás WhatsApp, también podés hablar con nosotros por el chat de la web, en español, inglés o portugués.",
    link: { href: "/es/faq#phone-number", label: "Todas las preguntas sobre Concierge" },
  },
}

/**
 * The questions of /en/faq, /pt/faq and /es/faq, in order. 11 since decision 10 (2026-11-10) took
 * out "How do I use Mercado Pago as a tourist?"; don't pad it back to 12.
 */
export const HUB_FAQ_IDS = [
  "ml-without-dni",
  "tickets-foreigners",
  "fee",
  "timing",
  "pay-from-abroad",
  "where-receive",
  "what-can-you-buy",
  "local-stores",
  "dni-bank-help",
  "safe",
  "phone-number",
] as const
