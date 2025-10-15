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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b-4 border-purple-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                FlowBattle
              </h1>
            </div>

            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border-2 border-purple-200 shadow-lg text-center">
              <p className="text-3xl font-bold text-purple-600">{mockMarkets.length}</p>
              <p className="text-sm text-gray-600 font-semibold">Active Markets</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-green-200 shadow-lg text-center">
              <p className="text-3xl font-bold text-green-600">
                {mockMarkets.reduce((sum, m) => sum + parseFloat(m.totalYesVolume) + parseFloat(m.totalNoVolume), 0).toFixed(0)}
              </p>
              <p className="text-sm text-gray-600 font-semibold">Total FLOW</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border-2 border-orange-200 shadow-lg text-center">
              <p className="text-3xl font-bold text-orange-600">{currentIndex + 1}/{mockMarkets.length}</p>
              <p className="text-sm text-gray-600 font-semibold">Current</p>
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
                className="bg-white border-2 border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-30 shadow-lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentIndex === mockMarkets.length - 1}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-30 shadow-lg"
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
                    ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                    : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t-4 border-purple-200 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <Link href="/feed">
              <Button variant="ghost" className="flex-col h-auto gap-1 text-purple-600">
                <Trophy className="h-6 w-6" />
                <span className="text-xs font-semibold">Feed</span>
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" className="flex-col h-auto gap-1">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center -mt-6 shadow-xl border-4 border-white">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-semibold">Create</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="flex-col h-auto gap-1">
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
