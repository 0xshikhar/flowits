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
    <Card className="overflow-hidden border-4 border-purple-200 shadow-2xl bg-gradient-to-br from-white to-purple-50">
      {/* Media Section */}
      {mediaUrl && (
        <div className="relative h-64 bg-gradient-to-br from-purple-400 to-pink-400">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl} alt="Prediction" className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4">
            <Badge className="bg-yellow-400 text-yellow-900 font-bold border-2 border-yellow-600 shadow-lg">
              <Coins className="mr-1 h-3 w-3" />
              {totalVolume.toFixed(0)} FLOW Pool
            </Badge>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Question */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{question}</h3>
          <p className="text-sm text-gray-600">
            by <span className="font-semibold text-purple-600">{creator.slice(0, 8)}...</span>
          </p>
        </div>

        {/* Time & Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-orange-600 font-semibold">
            <Clock className="h-4 w-4" />
            {hoursLeft}h {minutesLeft}m left
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-4 w-4" />
            {Math.floor(totalVolume / parseFloat(minStake))} predictions
          </div>
        </div>

        {/* Odds Display */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-green-600">YES {yesPercent.toFixed(0)}%</span>
            <span className="text-red-600">NO {noPercent.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
              style={{ width: `${yesPercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
              style={{ width: `${noPercent}%` }}
            />
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setSelectedOutcome("yes")}
            className={`h-16 text-lg font-bold transition-all duration-200 ${
              selectedOutcome === "yes"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white scale-105 shadow-lg border-4 border-green-700"
                : "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-300"
            }`}
          >
            <ThumbsUp className="mr-2 h-5 w-5" />
            YES
          </Button>
          <Button
            onClick={() => setSelectedOutcome("no")}
            className={`h-16 text-lg font-bold transition-all duration-200 ${
              selectedOutcome === "no"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white scale-105 shadow-lg border-4 border-red-700"
                : "bg-red-100 text-red-700 hover:bg-red-200 border-2 border-red-300"
            }`}
          >
            <ThumbsDown className="mr-2 h-5 w-5" />
            NO
          </Button>
        </div>

        {/* Amount Input */}
        {selectedOutcome && (
          <div className="space-y-3 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minStake}
                step="0.1"
                className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg font-bold text-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                placeholder="Amount"
              />
              <span className="font-bold text-purple-600">FLOW</span>
            </div>

            <Button
              onClick={handlePredict}
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                "Placing Prediction..."
              ) : (
                <>
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Place {amount} FLOW on {selectedOutcome.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Min Stake Info */}
        <p className="text-xs text-center text-gray-500">
          Minimum stake: <span className="font-semibold text-purple-600">{minStake} FLOW</span>
        </p>
      </div>
    </Card>
  )
}
