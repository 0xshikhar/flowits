"use client"

import { useEffect, useState } from "react"
import { WalletConnect } from "@/components/WalletConnect"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Target, Flame, Award, TrendingUp, User, Plus } from "lucide-react"
import Link from "next/link"
import { fcl } from "@/lib/flow/config"

interface FlowUser {
  loggedIn?: boolean
  addr?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<FlowUser>({ loggedIn: false })

  useEffect(() => {
    fcl.currentUser.subscribe((currentUser: any) => {
      setUser(currentUser)
    })
  }, [])

  // Mock data - replace with actual API calls
  const stats = {
    totalPredictions: 42,
    correctPredictions: 28,
    accuracy: 66.7,
    totalWinnings: 156.8,
    currentStreak: 5,
    achievements: [
      { id: 1, name: "First Blood", description: "Made your first prediction", icon: "🎯" },
      { id: 2, name: "Hot Streak", description: "5 correct predictions in a row", icon: "🔥" },
      { id: 3, name: "High Roller", description: "Wagered 100+ FLOW", icon: "💎" },
    ],
  }

  if (!user.loggedIn) {
    return (
      <div className="min-h-screen gradient-warm flex items-center justify-center p-4">
        <Card className="glass p-10 text-center border-2 border-border shadow-2xl max-w-md rounded-3xl">
          <div className="h-20 w-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl">
            <Trophy className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gradient">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-8 text-lg">View your stats, achievements, and prediction history</p>
          <WalletConnect />
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b-2 border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/feed">
                <Button variant="ghost" size="icon" className="hover:bg-secondary border-2 border-border rounded-xl">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-black text-gradient">
                  Profile
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Your Stats & Achievements</p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-32">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
            <Card className="glass p-6 text-center border-2 border-purple-200 shadow-lg hover-lift rounded-2xl">
              <div className="h-12 w-12 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Target className="h-7 w-7 text-white" />
              </div>
              <p className="text-3xl font-bold text-gradient mb-1">{stats.totalPredictions}</p>
              <p className="text-sm text-muted-foreground font-semibold">Total Predictions</p>
            </Card>

            <Card className="glass p-6 text-center border-2 border-green-200 shadow-lg hover-lift rounded-2xl">
              <div className="h-12 w-12 mx-auto mb-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">{stats.accuracy}%</p>
              <p className="text-sm text-muted-foreground font-semibold">Accuracy</p>
            </Card>

            <Card className="glass p-6 text-center border-2 border-amber-200 shadow-lg hover-lift rounded-2xl">
              <div className="h-12 w-12 mx-auto mb-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <Award className="h-7 w-7 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-1">{stats.totalWinnings}</p>
              <p className="text-sm text-muted-foreground font-semibold">FLOW Won</p>
            </Card>

            <Card className="glass p-6 text-center border-2 border-orange-200 shadow-lg hover-lift rounded-2xl">
              <div className="h-12 w-12 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <Flame className="h-7 w-7 text-white" />
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">{stats.currentStreak}</p>
              <p className="text-sm text-muted-foreground font-semibold">Current Streak</p>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="glass p-8 border-2 border-border shadow-2xl rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <span className="text-gradient">Achievements</span>
            </h2>
            <div className="grid gap-4">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-5 gradient-card rounded-2xl border-2 border-border hover-lift"
                >
                  <div className="text-5xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-4 py-1 shadow-md">Unlocked</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="glass p-8 border-2 border-border shadow-2xl rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-gradient">Recent Predictions</span>
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 gradient-card rounded-2xl border-2 border-border hover-lift"
                >
                  <div>
                    <p className="font-bold text-foreground">Will LeBron score 40+ points?</p>
                    <p className="text-sm text-muted-foreground mt-1">Predicted: <span className="font-semibold text-green-600">YES</span> • <span className="font-semibold">5.0 FLOW</span></p>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-4 py-1.5 shadow-md">Won</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t-2 border-border shadow-2xl pb-safe">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link href="/feed">
              <Button variant="ghost" className="flex-col h-auto gap-1 hover:bg-secondary">
                <Trophy className="h-6 w-6" />
                <span className="text-xs font-semibold">Feed</span>
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" className="flex-col h-auto gap-1 hover:bg-transparent">
                <div className="h-14 w-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center -mt-8 shadow-xl border-4 border-background hover:shadow-2xl transition-all hover:scale-105">
                  <Plus className="h-7 w-7 text-white" />
                </div>
                <span className="text-xs font-semibold mt-1">Create</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="flex-col h-auto gap-1 text-orange-600 hover:bg-orange-50">
                <User className="h-6 w-6" />
                <span className="text-xs font-semibold">Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
