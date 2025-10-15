"use client"

import { useState } from "react"
import { WalletConnect } from "@/components/WalletConnect"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Calendar, Coins, Percent, Sparkles } from "lucide-react"
import Link from "next/link"
import { createMarket } from "@/lib/flow/transactions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function CreatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    question: "",
    closeTime: "",
    minStake: "1.0",
    creatorFee: "5.0",
    mediaFile: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.question || !formData.closeTime) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const closeTimeUnix = new Date(formData.closeTime).getTime() / 1000

      await createMarket({
        question: formData.question,
        closeTime: closeTimeUnix,
        minStake: formData.minStake,
        creatorFeePercent: formData.creatorFee,
      })

      toast.success("Market created successfully! 🎉")
      router.push("/feed")
    } catch (error: any) {
      toast.error(error.message || "Failed to create market")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, mediaFile: e.target.files[0] })
    }
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
                Create Prediction
              </h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-32">
        <div className="max-w-2xl mx-auto">
          <Card className="border-4 border-purple-200 shadow-2xl bg-white p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question */}
              <div className="space-y-2">
                <Label htmlFor="question" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Prediction Question
                </Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g., Will LeBron score 40+ points tonight vs Celtics?"
                  className="min-h-24 text-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  required
                />
                <p className="text-sm text-gray-500">Make it clear and specific!</p>
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <Label htmlFor="media" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-purple-500" />
                  Upload Image/Video (Optional)
                </Label>
                <div className="border-4 border-dashed border-purple-200 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer bg-purple-50/50">
                  <input
                    id="media"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="media" className="cursor-pointer">
                    {formData.mediaFile ? (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 mx-auto text-purple-500" />
                        <p className="font-semibold text-purple-600">{formData.mediaFile.name}</p>
                        <p className="text-sm text-gray-500">Click to change</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="font-semibold text-gray-600">Click to upload</p>
                        <p className="text-sm text-gray-500">Max 10 seconds for video</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Close Time */}
              <div className="space-y-2">
                <Label htmlFor="closeTime" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Close Time
                </Label>
                <Input
                  id="closeTime"
                  type="datetime-local"
                  value={formData.closeTime}
                  onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                  className="text-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  required
                />
                <p className="text-sm text-gray-500">When should predictions close?</p>
              </div>

              {/* Min Stake */}
              <div className="space-y-2">
                <Label htmlFor="minStake" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-purple-500" />
                  Minimum Stake (FLOW)
                </Label>
                <Input
                  id="minStake"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.minStake}
                  onChange={(e) => setFormData({ ...formData, minStake: e.target.value })}
                  className="text-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  required
                />
                <p className="text-sm text-gray-500">Minimum amount users can bet</p>
              </div>

              {/* Creator Fee */}
              <div className="space-y-2">
                <Label htmlFor="creatorFee" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-purple-500" />
                  Creator Fee (%)
                </Label>
                <Input
                  id="creatorFee"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.creatorFee}
                  onChange={(e) => setFormData({ ...formData, creatorFee: e.target.value })}
                  className="text-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                  required
                />
                <p className="text-sm text-gray-500">Your earnings from total pool (max 20%)</p>
              </div>

              {/* Estimated Earnings */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Estimated earnings (if pool reaches 100 FLOW):</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {(100 * parseFloat(formData.creatorFee) / 100).toFixed(2)} FLOW
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  "Creating Market..."
                ) : (
                  <>
                    <Sparkles className="mr-2 h-6 w-6" />
                    Create Prediction Market
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Tips */}
          <div className="mt-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-3">💡 Tips for Success</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Make questions clear and verifiable (sports stats work best!)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Set close time before the event happens</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Lower min stake = more participants</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Add engaging media to attract more bets</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
