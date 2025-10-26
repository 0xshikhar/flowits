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
    <Card className="overflow-hidden border-2 border-border shadow-2xl gradient-card hover-lift">
      {/* Media Section */}
      {mediaUrl && (
        <div className="relative h-72 bg-gradient-to-br from-orange-100 to-amber-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl} alt="Prediction" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge className="glass border-2 border-amber-300 text-foreground font-bold shadow-lg">
              <Coins className="mr-1 h-4 w-4 text-amber-600" />
              {totalVolume.toFixed(0)} FLOW Pool
            </Badge>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Question */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight">{question}</h3>
          <p className="text-sm text-muted-foreground">
            by <span className="font-semibold text-gradient">{creator.slice(0, 8)}...</span>
          </p>
        </div>

        {/* Time & Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-300">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="font-bold text-orange-900">{hoursLeft}h {minutesLeft}m</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{Math.floor(totalVolume / parseFloat(minStake))}</span>
          </div>
        </div>

        {/* Odds Display */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-green-700">YES {yesPercent.toFixed(0)}%</span>
            <span className="text-red-700">NO {noPercent.toFixed(0)}%</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${yesPercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-500"
              style={{ width: `${noPercent}%` }}
            />
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => setSelectedOutcome("yes")}
            className={`h-16 text-lg font-bold transition-all duration-200 rounded-2xl ${
              selectedOutcome === "yes"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-105 shadow-xl border-2 border-green-600"
                : "bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-300 hover:border-green-400"
            }`}
          >
            <ThumbsUp className="mr-2 h-6 w-6" />
            YES
          </Button>
          <Button
            onClick={() => setSelectedOutcome("no")}
            className={`h-16 text-lg font-bold transition-all duration-200 rounded-2xl ${
              selectedOutcome === "no"
                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white scale-105 shadow-xl border-2 border-red-600"
                : "bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-300 hover:border-red-400"
            }`}
          >
            <ThumbsDown className="mr-2 h-6 w-6" />
            NO
          </Button>
        </div>

        {/* Amount Input */}
        {selectedOutcome && (
          <div className="space-y-3 animate-slide-up">
            <div className="flex items-center gap-3 glass p-4 rounded-2xl border-2 border-border">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minStake}
                step="0.1"
                className="flex-1 px-4 py-3 bg-background border-2 border-border rounded-xl font-bold text-lg focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                placeholder="Amount"
              />
              <span className="font-bold text-gradient text-lg">FLOW</span>
            </div>

            <Button
              onClick={handlePredict}
              disabled={loading}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-xl hover:shadow-2xl transition-all duration-200 rounded-2xl"
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
        <p className="text-xs text-center text-muted-foreground">
          Minimum stake: <span className="font-bold text-gradient">{minStake} FLOW</span>
        </p>
      </div>
    </Card>
  )
}
