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
      <div className="min-h-screen p-6 md:p-10 flex items-center justify-center">
        <Card className="dual-block-card p-10 text-center max-w-md">
          <div className="h-20 w-20 mx-auto mb-6 bg-[#a4ff31] flex items-center justify-center shadow-xl neon-glow">
            <Trophy className="h-12 w-12 text-black" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gradient-green">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-8 text-lg">View your stats, achievements, and prediction history</p>
          <WalletConnect />
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-10">
      <main className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600 font-medium">Your Stats & Achievements</p>
          </div>
          <Link href="/feed">
            <Button variant="outline" size="icon" className="border border-gray-800 hover:border-[#a4ff31] hover:bg-[#e8ffe0]">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
            <Card className="dual-block-card p-6 text-center hover-lift">
              <div className="h-12 w-12 mx-auto mb-3 bg-[#a4ff31] flex items-center justify-center">
                <Target className="h-7 w-7 text-black" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPredictions}</p>
              <p className="text-sm text-muted-foreground font-semibold">Total Predictions</p>
            </Card>

            <Card className="dual-block-card p-6 text-center hover-lift">
              <div className="h-12 w-12 mx-auto mb-3 bg-[#a4ff31] flex items-center justify-center">
                <Trophy className="h-7 w-7 text-black" />
              </div>
              <p className="text-3xl font-bold text-[#a4ff31] mb-1">{stats.accuracy}%</p>
              <p className="text-sm text-muted-foreground font-semibold">Accuracy</p>
            </Card>

            <Card className="dual-block-card p-6 text-center hover-lift">
              <div className="h-12 w-12 mx-auto mb-3 bg-[#a4ff31] flex items-center justify-center">
                <Award className="h-7 w-7 text-black" />
              </div>
              <p className="text-3xl font-bold text-[#a4ff31] mb-1">{stats.totalWinnings}</p>
              <p className="text-sm text-muted-foreground font-semibold">FLOW Won</p>
            </Card>

            <Card className="dual-block-card p-6 text-center hover-lift">
              <div className="h-12 w-12 mx-auto mb-3 bg-[#a4ff31] flex items-center justify-center">
                <Flame className="h-7 w-7 text-black" />
              </div>
              <p className="text-3xl font-bold text-[#a4ff31] mb-1">{stats.currentStreak}</p>
              <p className="text-sm text-muted-foreground font-semibold">Current Streak</p>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="dual-block-card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="h-10 w-10 bg-[#a4ff31] flex items-center justify-center">
                <Award className="h-6 w-6 text-black" />
              </div>
              <span className="text-gradient-green">Achievements</span>
            </h2>
            <div className="grid gap-4">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-300 hover-lift"
                >
                  <div className="text-5xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge className="bg-[#a4ff31] text-black font-semibold px-4 py-1 shadow-md">Unlocked</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="dual-block-card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="h-10 w-10 bg-[#a4ff31] flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-black" />
              </div>
              <span className="text-gradient-green">Recent Predictions</span>
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 bg-gray-50 border border-gray-300 hover-lift"
                >
                  <div>
                    <p className="font-bold text-foreground">Will LeBron score 40+ points?</p>
                    <p className="text-sm text-muted-foreground mt-1">Predicted: <span className="font-semibold text-[#a4ff31]">YES</span> • <span className="font-semibold">5.0 FLOW</span></p>
                  </div>
                  <Badge className="bg-[#a4ff31] text-black font-semibold px-4 py-1.5 shadow-md">Won</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
