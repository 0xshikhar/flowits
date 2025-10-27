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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Live Predictions</h1>
          <p className="text-gray-600 font-medium">Swipe through markets and place your bets</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="dual-block-card p-6 hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#a4ff31] flex items-center justify-center neon-glow">
                  <Trophy className="h-6 w-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Active Markets</p>
                  <p className="text-3xl font-black text-gray-900">{mockMarkets.length}</p>
                </div>
              </div>
            </div>

            <div className="dual-block-card p-6 hover-lift">
              <p className="text-sm text-gray-600 font-semibold mb-2">Total Volume</p>
              <p className="text-3xl font-black text-[#a4ff31]">
                {mockMarkets.reduce((sum, m) => sum + parseFloat(m.totalYesVolume) + parseFloat(m.totalNoVolume), 0).toFixed(1)} FLOW
              </p>
            </div>

            <div className="dual-block-card p-6 hover-lift">
              <p className="text-sm text-gray-600 font-semibold mb-2">Your Position</p>
              <p className="text-2xl font-bold text-gray-900">{currentIndex + 1} / {mockMarkets.length}</p>
            </div>

            {/* Quick Actions */}
            <div className="dual-block-card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/create">
                  <Button className="w-full bg-[#a4ff31] hover:bg-[#b8ff52] text-black font-bold shadow-lg neon-glow">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Market
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full border border-gray-800 hover:border-[#a4ff31] hover:bg-[#e8ffe0] font-bold">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Card Area */}
          <div className="lg:col-span-2 space-y-6">
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
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                size="lg"
                variant="outline"
                className="border border-gray-800 hover:border-[#a4ff31] hover:bg-[#e8ffe0] disabled:opacity-30 font-bold px-8"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>

              {/* Progress Dots */}
              <div className="flex gap-2">
                {mockMarkets.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-3 transition-all duration-300 cursor-pointer ${
                      idx === currentIndex
                        ? "w-8 bg-[#a4ff31] shadow-lg"
                        : "w-3 bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => {
                      setDirection(idx > currentIndex ? "right" : "left")
                      setTimeout(() => {
                        setCurrentIndex(idx)
                        setDirection(null)
                      }, 300)
                    }}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={currentIndex === mockMarkets.length - 1}
                size="lg"
                className="bg-[#a4ff31] hover:bg-[#b8ff52] text-black disabled:opacity-30 font-bold px-8 neon-glow"
              >
                Next
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
