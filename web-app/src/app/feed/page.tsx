"use client"

import { useState, useEffect } from "react"
import { WalletConnect } from "@/components/WalletConnect"
import { PredictionCard } from "@/components/PredictionCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Plus, Trophy, User } from "lucide-react"
import Link from "next/link"

// Mock data - replace with actual API calls
const mockMarkets = [
  {
    marketId: 1,
    question: "Will LeBron score 40+ points tonight vs Celtics?",
    closeTime: Date.now() / 1000 + 14400, // 4 hours from now
    minStake: "1.0",
    totalYesVolume: "125.5",
    totalNoVolume: "89.3",
    creator: "0x1234567890abcdef",
    mediaUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
  },
  {
    marketId: 2,
    question: "Will Steph Curry hit 8+ three-pointers this game?",
    closeTime: Date.now() / 1000 + 7200,
    minStake: "0.5",
    totalYesVolume: "67.2",
    totalNoVolume: "103.8",
    creator: "0xabcdef1234567890",
    mediaUrl: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800",
  },
  {
    marketId: 3,
    question: "Will the Lakers win by 10+ points?",
    closeTime: Date.now() / 1000 + 10800,
    minStake: "2.0",
    totalYesVolume: "234.7",
    totalNoVolume: "198.4",
    creator: "0x9876543210fedcba",
    mediaUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800",
  },
]

export default function FeedPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)

  const handleNext = () => {
    if (currentIndex < mockMarkets.length - 1) {
      setDirection("right")
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
        setDirection(null)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection("left")
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1)
        setDirection(null)
      }, 300)
    }
  }

  const currentMarket = mockMarkets[currentIndex]

  return (
    <div className="min-h-screen gradient-warm">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b-2 border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gradient">
                  Moments
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Prediction Markets</p>
              </div>
            </div>

            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 animate-slide-up">
            <div className="glass rounded-2xl p-5 hover-lift text-center border-2 border-orange-200">
              <p className="text-3xl font-bold text-gradient">{mockMarkets.length}</p>
              <p className="text-sm text-muted-foreground font-semibold mt-1">Active Markets</p>
            </div>
            <div className="glass rounded-2xl p-5 hover-lift text-center border-2 border-green-200">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {mockMarkets.reduce((sum, m) => sum + parseFloat(m.totalYesVolume) + parseFloat(m.totalNoVolume), 0).toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground font-semibold mt-1">Total FLOW</p>
            </div>
            <div className="glass rounded-2xl p-5 hover-lift text-center border-2 border-amber-200">
              <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{currentIndex + 1}/{mockMarkets.length}</p>
              <p className="text-sm text-muted-foreground font-semibold mt-1">Current</p>
            </div>
          </div>

          {/* Card Container */}
          <div className="relative">
            <div
              className={`transition-all duration-300 ${
                direction === "left"
                  ? "translate-x-[-100px] opacity-0"
                  : direction === "right"
                    ? "translate-x-[100px] opacity-0"
                    : "translate-x-0 opacity-100"
              }`}
            >
              <PredictionCard {...currentMarket} />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                size="lg"
                className="glass border-2 border-border hover:bg-secondary disabled:opacity-30 shadow-lg hover-lift font-semibold"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentIndex === mockMarkets.length - 1}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white disabled:opacity-30 shadow-xl hover-lift font-bold"
              >
                Next
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2">
            {mockMarkets.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-gradient-to-r from-orange-500 to-amber-500 shadow-md"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t-2 border-border shadow-2xl pb-safe">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link href="/feed">
              <Button variant="ghost" className="flex-col h-auto gap-1 text-orange-600 hover:bg-orange-50">
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
              <Button variant="ghost" className="flex-col h-auto gap-1 hover:bg-secondary">
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
