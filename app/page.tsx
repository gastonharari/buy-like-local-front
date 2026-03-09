import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Search, ShoppingBag, Sparkles, Globe, Heart } from "lucide-react"

export default function Home() {
  const whatsappNumber = "5491158637341" // Updated WhatsApp number to the correct one
  const whatsappMessage = encodeURIComponent("Hi! I'd like to learn more about Buy Like Local")
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/buenos-aires-obelisco-night.jpg"
            alt="Buenos Aires Obelisco at night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Your Local Concierge</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance text-foreground">
              Your local concierge
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Connect with authentic local products and experiences via WhatsApp. Shop like a local, wherever you
              travel.
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
      <section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/artisan-market-buenos-aires-night.jpg"
            alt="Artisan market in Buenos Aires"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-background/90" />
        </div>

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
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/local-workshop-artisan-argentina.jpg"
            alt="Local artisan workshop"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-background/92" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">Why choose us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Bridging digital and physical</h3>
              <p className="text-muted-foreground leading-relaxed">
                We break down the barrier between digital and physical. Get unique products that aren't available
                online.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Personalized service</h3>
              <p className="text-muted-foreground leading-relaxed">
                Friendly, personalized attention from local people who know every corner of the city.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Cross-border shopping</h3>
              <p className="text-muted-foreground leading-relaxed">
                We shop in any country and deliver it to you wherever you are. Live like a local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/buenos-aires-street-scene-evening.jpg"
            alt="Buenos Aires street scene"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-background/95" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">What we can do for you</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              From exclusive products to unforgettable experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 bg-card border-border hover:border-primary/50">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/malbec-wine-from-mendoza-argentina.jpg"
                  alt="Malbec wine from Mendoza"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Malbec from Mendoza</h3>
                <p className="text-muted-foreground">"Order a bottle of Malbec from Mendoza delivered to your hotel"</p>
              </div>
            </Card>

            <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 bg-card border-border hover:border-primary/50">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/custom-leather-jacket-san-telmo-buenos-aires.jpg"
                  alt="Custom leather jacket in San Telmo"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Custom leather jacket</h3>
                <p className="text-muted-foreground">"Have a custom leather jacket made in San Telmo"</p>
              </div>
            </Card>

            <Card className="overflow-hidden group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 bg-card border-border hover:border-primary/50">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/alfajores-dulce-de-leche-argentina.jpg"
                  alt="Alfajores and dulce de leche"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-card-foreground">Sweet treats for home</h3>
                <p className="text-muted-foreground">
                  "Get a box of alfajores and dulce de leche for your friends back home"
                </p>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
            <div className="aspect-square overflow-hidden rounded-lg group">
              <img
                src="/obelisco-daytime-buenos-aires.jpg"
                alt="Obelisco during daytime"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg group">
              <img
                src="/san-telmo-market-buenos-aires.jpg"
                alt="San Telmo market"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg group">
              <img
                src="/argentine-mate-culture.jpg"
                alt="Argentine mate culture"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg group">
              <img
                src="/colorful-la-boca-neighborhood.jpg"
                alt="Colorful La Boca neighborhood"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg group">
              <img
                src="/argentine-asado-grill.jpg"
                alt="Argentine asado"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg group">
              <img
                src="/recoleta-cemetery-buenos-aires.jpg"
                alt="Recoleta Cemetery"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg group">
              <img
                src="/tango-dancers-buenos-aires.jpg"
                alt="Tango dancers"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg group">
              <img
                src="/palermo-soho-street-art.jpg"
                alt="Palermo Soho street art"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20" />
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
  )
}
