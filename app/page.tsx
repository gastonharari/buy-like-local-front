import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MessageCircle, Search, ShoppingBag, Sparkles, Globe, Heart, MapPin } from "lucide-react"

export default function Home() {
  const whatsappNumber = "5491158637341" // Updated WhatsApp number to the correct one
  const whatsappMessage = encodeURIComponent("Hi! I'd like to learn more about Buy Like Local")
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <>
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">Buy Like Local</span>
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />Chat on WhatsApp
            </a>
          </Button>
        </div>
      </header>

      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/buenos-aires-obelisco-night.jpg"
              alt="Buenos Aires Obelisco at night"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance text-foreground">
                Shop Buenos Aires like you live there
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
                Foreign tourist in Argentina? WhatsApp us and we handle Mercado Pago, QR codes, reservations, and local stores that don&apos;t accept foreign cards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50"
                  asChild
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-card/30 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">How it works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Three simple steps to get what you're looking for
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 text-center space-y-4 border-2 border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 bg-card">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-accent" />
                </div>
                <div className="text-6xl font-bold text-accent/30">01</div>
                <h3 className="text-2xl font-bold text-card-foreground">Message us on WhatsApp</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tell us what you're looking for. Local products, unique experiences, whatever you need.
                </p>
              </Card>

              <Card className="p-8 text-center space-y-4 border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 bg-card">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <div className="text-6xl font-bold text-primary/30">02</div>
                <h3 className="text-2xl font-bold text-card-foreground">Our local concierge takes care of everything</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We research, contact local shops, and manage reservations or purchases for you.
                </p>
              </Card>

              <Card className="p-8 text-center space-y-4 border-2 border-border hover:border-muted-foreground transition-all duration-300 hover:shadow-lg hover:shadow-muted-foreground/20 bg-card">
                <div className="w-16 h-16 rounded-full bg-muted-foreground/20 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-6xl font-bold text-muted-foreground/30">03</div>
                <h3 className="text-2xl font-bold text-card-foreground">You receive your product or reservation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We deliver or send the product to you. Everything is managed directly in the chat.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">Why choose us</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 group">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src="/nighttime-shopping-in-buenos-aires-argentina.jpg"
                    alt="Nighttime shopping street in Buenos Aires, Argentina"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-primary/80 backdrop-blur-sm flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-5 space-y-2 bg-card">
                  <h3 className="text-xl font-bold text-foreground">Bridging digital and physical</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We break down the barrier between digital and physical. Get unique products that aren't available
                    online.
                  </p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 group">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src="/local-workshop-artisan-argentina.jpg"
                    alt="Local artisan leather workshop in Buenos Aires, Argentina"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-primary/80 backdrop-blur-sm flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-5 space-y-2 bg-card">
                  <h3 className="text-xl font-bold text-foreground">Personalized service</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Friendly, personalized attention from local people who know every corner of the city.
                  </p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 group">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src="/vibrant-street-scene-in-buenos-aires-argentina-wit.jpg"
                    alt="Travelers in a vibrant Buenos Aires street scene, Argentina"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-primary/80 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-5 space-y-2 bg-card">
                  <h3 className="text-xl font-bold text-foreground">Local access, zero barriers</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Foreign cards blocked? We handle Mercado Pago, QR codes, and local wallets — so you get full access to Argentina&apos;s digital economy through a single WhatsApp message.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="py-24 bg-card/30 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">What we can do for you</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                From exclusive products to unforgettable experiences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 bg-card border-border hover:border-primary/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/malbec-wine-from-mendoza-argentina.jpg"
                    alt="Malbec wine from Mendoza"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm">Wine & Spirits</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">Malbec from Mendoza</h3>
                  <p className="text-muted-foreground">Boutique Malbec bottles delivered to your hotel or shipped internationally.</p>
                  <p className="text-xs text-primary font-medium mt-2">From USD 45 / bottle</p>
                </div>
              </Card>

              <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 bg-card border-border hover:border-primary/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/custom-leather-jacket-san-telmo-buenos-aires.jpg"
                    alt="Custom leather jacket in San Telmo"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <Badge className="absolute top-3 left-3 bg-accent/90 text-accent-foreground border-0 backdrop-blur-sm">Leather Goods</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">Custom leather jacket</h3>
                  <p className="text-muted-foreground">Custom-made leather jackets from San Telmo artisans. Your size, your design.</p>
                  <p className="text-xs text-primary font-medium mt-2">From USD 150 / jacket</p>
                </div>
              </Card>

              <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 bg-card border-border hover:border-primary/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/alfajores-dulce-de-leche-argentina.jpg"
                    alt="Alfajores and dulce de leche"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm">Sweet Treats</Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">Sweet treats for home</h3>
                  <p className="text-muted-foreground">Alfajores, dulce de leche, and artisan sweets. Vacuum-sealed for travel.</p>
                  <p className="text-xs text-primary font-medium mt-2">From USD 25 / box</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Discover Argentina Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">Discover Argentina</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                From iconic landmarks to hidden gems, explore the authentic side of Argentina
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4 max-w-7xl mx-auto">
              {/* Large tile: col-span-2, row-span-2 */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer md:col-span-2 md:row-span-2">
                <Image
                  src="/obelisco-daytime-buenos-aires.jpg"
                  alt="Obelisco during daytime"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-xs">Obelisco, Buenos Aires</span>
                  </div>
                </div>
              </div>

              {/* col 3, row 1 */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                <Image
                  src="/san-telmo-market-buenos-aires.jpg"
                  alt="San Telmo market"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-xs">San Telmo Market</span>
                  </div>
                </div>
              </div>

              {/* col 4, row 1 */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                <Image
                  src="/colorful-la-boca-neighborhood.jpg"
                  alt="Colorful La Boca neighborhood"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-xs">La Boca</span>
                  </div>
                </div>
              </div>

              {/* col 3, row 2 */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                <Image
                  src="/tango-dancers-buenos-aires.jpg"
                  alt="Tango dancers"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-xs">Tango, Buenos Aires</span>
                  </div>
                </div>
              </div>

              {/* col 4, row 2 */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                <Image
                  src="/recoleta-cemetery-buenos-aires.jpg"
                  alt="Recoleta Cemetery"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-xs">Recoleta Cemetery</span>
                  </div>
                </div>
              </div>

              {/* col 1, row 3 */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                <Image
                  src="/argentine-asado-grill.jpg"
                  alt="Argentine asado"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-xs">Argentine Asado</span>
                  </div>
                </div>
              </div>

              {/* col 2, row 3 */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer">
                <Image
                  src="/argentine-mate-culture.jpg"
                  alt="Argentine mate culture"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-xs">Mate Culture</span>
                  </div>
                </div>
              </div>

              {/* cols 3-4, row 3 (col-span-2) */}
              <div className="relative overflow-hidden rounded-xl group cursor-pointer md:col-span-2">
                <Image
                  src="/palermo-soho-street-art.jpg"
                  alt="Palermo Soho street art"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1.5 text-white">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="font-semibold text-xs">Palermo Soho</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/buenos-aires-street-scene-evening.jpg"
              alt="Buenos Aires street scene evening"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background/85" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-balance text-foreground">Start shopping like a local</h2>
              <p className="text-xl text-muted-foreground text-balance leading-relaxed">
                It's as simple as starting a conversation. Tell us what you're looking for and we'll take care of the
                rest.
              </p>
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-foreground">Buy Like Local</h3>
              <p className="text-muted-foreground">Your local concierge in Argentina</p>
              <p className="text-sm text-muted-foreground">© 2025 Buy Like Local. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
