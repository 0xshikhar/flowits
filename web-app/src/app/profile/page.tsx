"use client"

import { useEffect, useState } from "react"
import { WalletConnect } from "@/components/WalletConnect"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Target, Flame, Award } from "lucide-react"
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center">
        <Card className="p-8 text-center border-4 border-purple-200 shadow-2xl max-w-md">
          <Trophy className="h-16 w-16 mx-auto text-purple-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">View your stats, achievements, and prediction history</p>
          <WalletConnect />
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b-4 border-purple-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/feed">
                <Button variant="ghost" size="icon" className="border-2 border-purple-200">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Profile
              </h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-32">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center border-2 border-purple-200 shadow-lg">
              <Target className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <p className="text-3xl font-bold text-purple-600">{stats.totalPredictions}</p>
              <p className="text-sm text-gray-600 font-semibold">Total Predictions</p>
            </Card>

            <Card className="p-6 text-center border-2 border-green-200 shadow-lg">
              <Trophy className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-3xl font-bold text-green-600">{stats.accuracy}%</p>
              <p className="text-sm text-gray-600 font-semibold">Accuracy</p>
            </Card>

            <Card className="p-6 text-center border-2 border-yellow-200 shadow-lg">
              <Award className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
              <p className="text-3xl font-bold text-yellow-600">{stats.totalWinnings}</p>
              <p className="text-sm text-gray-600 font-semibold">FLOW Won</p>
            </Card>

            <Card className="p-6 text-center border-2 border-orange-200 shadow-lg">
              <Flame className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <p className="text-3xl font-bold text-orange-600">{stats.currentStreak}</p>
              <p className="text-sm text-gray-600 font-semibold">Current Streak</p>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="p-6 border-4 border-purple-200 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-500" />
              Achievements
            </h2>
            <div className="grid gap-4">
              {stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
                >
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{achievement.name}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <Badge className="bg-purple-500 text-white">Unlocked</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 border-4 border-purple-200 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Recent Predictions</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200"
                >
                  <div>
                    <p className="font-semibold">Will LeBron score 40+ points?</p>
                    <p className="text-sm text-gray-600">Predicted: YES • 5.0 FLOW</p>
                  </div>
                  <Badge className="bg-green-500 text-white">Won</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t-4 border-purple-200 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <Link href="/feed">
              <Button variant="ghost" className="flex-col h-auto gap-1">
                <Trophy className="h-6 w-6" />
                <span className="text-xs font-semibold">Feed</span>
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" className="flex-col h-auto gap-1">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-6 shadow-xl border-4 border-white">
                  <span className="text-2xl">+</span>
                </div>
                <span className="text-xs font-semibold">Create</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="flex-col h-auto gap-1 text-purple-600">
                <Award className="h-6 w-6" />
                <span className="text-xs font-semibold">Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
