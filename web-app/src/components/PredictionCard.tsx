"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Clock, Coins, TrendingUp, Users } from "lucide-react"
import { placePredictionViaAction } from "@/lib/flow/transactions"
import { toast } from "sonner"

interface PredictionCardProps {
  marketId: number
  question: string
  closeTime: number
  minStake: string
  totalYesVolume: string
  totalNoVolume: string
  mediaUrl?: string
  creator: string
}

export function PredictionCard({
  marketId,
  question,
  closeTime,
  minStake,
  totalYesVolume,
  totalNoVolume,
  mediaUrl,
  creator,
}: PredictionCardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no" | null>(null)
  const [amount, setAmount] = useState(minStake)
  const [loading, setLoading] = useState(false)

  const totalVolume = parseFloat(totalYesVolume) + parseFloat(totalNoVolume)
  const yesPercent = totalVolume > 0 ? (parseFloat(totalYesVolume) / totalVolume) * 100 : 50
  const noPercent = totalVolume > 0 ? (parseFloat(totalNoVolume) / totalVolume) * 100 : 50

  const timeLeft = Math.max(0, closeTime - Date.now() / 1000)
  const hoursLeft = Math.floor(timeLeft / 3600)
  const minutesLeft = Math.floor((timeLeft % 3600) / 60)

  const handlePredict = async () => {
    if (!selectedOutcome) {
      toast.error("Please select YES or NO")
      return
    }

    setLoading(true)
    try {
      await placePredictionViaAction({
        marketId,
        outcome: selectedOutcome,
        amount,
      })
      toast.success("Prediction placed! 🎉")
      setSelectedOutcome(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to place prediction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden square-box-green hover-lift">
      {/* Media Section */}
      {mediaUrl && (
        <div className="relative h-80 bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl} alt="Prediction" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-500 text-white border-2 border-green-400 font-bold shadow-lg neon-glow">
              <Coins className="mr-1 h-4 w-4" />
              {totalVolume.toFixed(0)} FLOW
            </Badge>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-5">
        {/* Question */}
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{question}</h3>
          <p className="text-sm text-gray-600">
            by <span className="font-bold text-green-600">{creator.slice(0, 8)}...</span>
          </p>
        </div>

        {/* Time & Stats */}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border-2 border-green-300">
            <Clock className="h-4 w-4 text-green-600" />
            <span className="font-bold text-green-900">{hoursLeft}h {minutesLeft}m</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-gray-300">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="font-bold text-gray-900">{Math.floor(totalVolume / parseFloat(minStake))}</span>
          </div>
        </div>

        {/* Odds Display */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-green-600">YES {yesPercent.toFixed(0)}%</span>
            <span className="text-red-600">NO {noPercent.toFixed(0)}%</span>
          </div>
          <div className="h-6 bg-gray-200 rounded-lg overflow-hidden flex border-2 border-gray-300">
            <div
              className="bg-green-500 transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${yesPercent}%` }}
            >
              {yesPercent > 15 && `${yesPercent.toFixed(0)}%`}
            </div>
            <div
              className="bg-red-500 transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: `${noPercent}%` }}
            >
              {noPercent > 15 && `${noPercent.toFixed(0)}%`}
            </div>
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setSelectedOutcome("yes")}
            className={`h-20 text-xl font-black transition-all duration-200 rounded-lg ${
              selectedOutcome === "yes"
                ? "bg-green-500 text-white scale-105 shadow-xl neon-glow border-2 border-green-400"
                : "bg-white text-green-600 hover:bg-green-50 border-2 border-green-500 shadow-lg"
            }`}
          >
            <ThumbsUp className="mr-2 h-7 w-7" />
            YES
          </Button>
          <Button
            onClick={() => setSelectedOutcome("no")}
            className={`h-20 text-xl font-black transition-all duration-200 rounded-lg ${
              selectedOutcome === "no"
                ? "bg-red-500 text-white scale-105 shadow-xl border-2 border-red-400"
                : "bg-white text-red-600 hover:bg-red-50 border-2 border-red-500 shadow-lg"
            }`}
          >
            <ThumbsDown className="mr-2 h-7 w-7" />
            NO
          </Button>
        </div>

        {/* Amount Input */}
        {selectedOutcome && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minStake}
                step="0.1"
                className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg font-bold text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="Amount"
              />
              <span className="font-black text-green-600 text-lg">FLOW</span>
            </div>

            <Button
              onClick={handlePredict}
              disabled={loading}
              className="w-full h-16 text-xl font-black bg-green-500 hover:bg-green-600 text-white shadow-xl hover:shadow-2xl neon-glow transition-all duration-200 rounded-lg"
            >
              {loading ? (
                "Placing Prediction..."
              ) : (
                <>
                  <TrendingUp className="mr-2 h-6 w-6" />
                  Bet {amount} FLOW on {selectedOutcome.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Min Stake Info */}
        <p className="text-sm text-center text-gray-600">
          Minimum stake: <span className="font-bold text-green-600">{minStake} FLOW</span>
        </p>
      </div>
    </Card>
  )
}
