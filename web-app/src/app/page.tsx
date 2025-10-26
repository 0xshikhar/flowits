import Link from "next/link"
import { ArrowRight, Zap, Trophy, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen gradient-warm">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border-2 border-orange-300 text-orange-900 font-semibold text-sm">
              <Zap className="h-4 w-4" />
              Powered by Flow Blockchain
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Moments</span>
            <br />
            <span className="text-foreground">Sports Prediction Markets</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Swipe through predictions. Battle with NFTs. Win real rewards on Flow blockchain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/feed">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                Start Predicting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/profile">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:bg-secondary/50 font-semibold">
                View Stats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-8 hover-lift">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Markets</h3>
            <p className="text-muted-foreground">
              Real-time prediction markets on NBA, NFL, and more. Dynamic odds that update instantly.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 hover-lift">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">NFT Battles</h3>
            <p className="text-muted-foreground">
              Stake your NBA Top Shot or NFL All Day NFTs in epic battles. Winner takes all.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 hover-lift">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Join thousands of sports fans making predictions and earning rewards together.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="glass rounded-3xl p-12 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">$2.5M+</div>
              <div className="text-muted-foreground">Total Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">15K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-muted-foreground">Markets Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gradient mb-2">98%</div>
              <div className="text-muted-foreground">Win Rate Paid</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
