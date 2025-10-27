import Link from "next/link"
import { ArrowRight, Zap, Trophy, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#a4ff31] text-black font-semibold text-sm">
              <Zap className="h-4 w-4 text-[#a4ff31]" />
              Powered by Flow Blockchain
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-gradient-green">Moments</span>
            <br />
            <span className="text-foreground">Sports Prediction Markets</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Swipe through predictions. Battle with NFTs. Win real rewards on Flow blockchain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/feed">
              <Button size="lg" className="text-lg px-8 py-6 bg-[#a4ff31] hover:bg-[#b8ff52] text-black font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 neon-glow">
                Start Predicting
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/profile">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-gray-400 hover:bg-gray-100 font-semibold">
                View Stats
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="dual-block-card p-8 hover-lift">
            <div className="h-12 w-12 bg-[#a4ff31] flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Markets</h3>
            <p className="text-muted-foreground">
              Real-time prediction markets on NBA, NFL, and more. Dynamic odds that update instantly.
            </p>
          </div>

          <div className="dual-block-card p-8 hover-lift">
            <div className="h-12 w-12 bg-[#a4ff31] flex items-center justify-center mb-4">
              <Trophy className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">NFT Battles</h3>
            <p className="text-muted-foreground">
              Stake your NBA Top Shot or NFL All Day NFTs in epic battles. Winner takes all.
            </p>
          </div>

          <div className="dual-block-card p-8 hover-lift">
            <div className="h-12 w-12 bg-[#a4ff31] flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Join thousands of sports fans making predictions and earning rewards together.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto">
        <div className="dual-block-card p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#a4ff31] mb-2">$2.5M+</div>
              <div className="text-muted-foreground">Total Volume</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#a4ff31] mb-2">15K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#a4ff31] mb-2">500+</div>
              <div className="text-muted-foreground">Markets Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#a4ff31] mb-2">98%</div>
              <div className="text-muted-foreground">Win Rate Paid</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
