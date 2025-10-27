"use client"

import { useEffect, useState } from "react"
import { fcl } from "@/lib/flow/config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getContractAddress } from "@/lib/flow/config"

interface Market {
  id: string
  marketId: number
  question: string
  closeTime: string
  isResolved: boolean
  totalYesVolume: string
  totalNoVolume: string
  creator: {
    walletAddress: string
    username?: string
  }
}

export default function AdminPage() {
  const [user, setUser] = useState<any>({ loggedIn: false })
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [resolving, setResolving] = useState<number | null>(null)

  useEffect(() => {
    fcl.currentUser.subscribe(setUser)
  }, [])

  useEffect(() => {
    if (user.loggedIn) {
      fetchUnresolvedMarkets()
    }
  }, [user.loggedIn])

  const fetchUnresolvedMarkets = async () => {
    try {
      const response = await fetch("/api/markets?resolved=false")
      const data = await response.json()
      
      // Filter markets that are past close time
      const now = Date.now()
      const pastCloseTime = data.markets.filter((m: Market) => 
        new Date(m.closeTime).getTime() < now
      )
      
      setMarkets(pastCloseTime)
    } catch (error) {
      console.error("Error fetching markets:", error)
      toast.error("Failed to fetch markets")
    } finally {
      setLoading(false)
    }
  }

  const resolveMarket = async (marketId: number, winningOutcome: "yes" | "no") => {
    if (!user.loggedIn) {
      toast.error("Please connect your wallet")
      return
    }

    setResolving(marketId)

    try {
      // Type helper for FCL authorization
      const getAuthz = () => fcl.currentUser.authorization as any

      // Call on-chain transaction
      const transactionId = await fcl.mutate({
        cadence: `
          import PredictionMarket from ${getContractAddress("PredictionMarket")}

          transaction(marketId: UInt64, winningOutcome: String) {
            prepare(signer: auth(Storage) &Account) {
              PredictionMarket.resolveMarket(
                marketId: marketId,
                winningOutcome: winningOutcome
              )
            }
          }
        `,
        args: (arg: any, t: any) => [
          arg(marketId, t.UInt64),
          arg(winningOutcome, t.String),
        ],
        proposer: getAuthz(),
        payer: getAuthz(),
        authorizations: [getAuthz()],
        limit: 999,
      })

      toast.info("Transaction submitted. Waiting for confirmation...")

      const result = await fcl.tx(transactionId).onceSealed()
      
      if (result.status === 4) {
        // Update database
        const market = markets.find((m) => m.marketId === marketId)
        if (market) {
          await fetch(`/api/markets/${market.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              isResolved: true,
              winningOutcome,
            }),
          })
        }

        toast.success(`Market resolved! Winner: ${winningOutcome.toUpperCase()}`)
        fetchUnresolvedMarkets()
      } else {
        toast.error("Transaction failed")
      }
    } catch (error: any) {
      console.error("Error resolving market:", error)
      toast.error(error.message || "Failed to resolve market")
    } finally {
      setResolving(null)
    }
  }

  if (!user.loggedIn) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Please connect your wallet to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => fcl.authenticate()} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Resolve markets that have passed their close time
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading markets...</p>
        </div>
      ) : markets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No markets pending resolution
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {markets.map((market) => {
            const totalVolume = parseFloat(market.totalYesVolume) + parseFloat(market.totalNoVolume)
            const yesPercent = totalVolume > 0 
              ? ((parseFloat(market.totalYesVolume) / totalVolume) * 100).toFixed(1)
              : "50.0"
            const noPercent = totalVolume > 0
              ? ((parseFloat(market.totalNoVolume) / totalVolume) * 100).toFixed(1)
              : "50.0"

            return (
              <Card key={market.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {market.question}
                      </CardTitle>
                      <CardDescription>
                        Market ID: {market.marketId} • Created by{" "}
                        {market.creator.username || market.creator.walletAddress.slice(0, 8)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      Closed {new Date(market.closeTime).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Volume Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950">
                        <div className="text-sm text-muted-foreground mb-1">YES Volume</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {market.totalYesVolume} FLOW
                        </div>
                        <div className="text-sm text-muted-foreground">{yesPercent}%</div>
                      </div>
                      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950">
                        <div className="text-sm text-muted-foreground mb-1">NO Volume</div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {market.totalNoVolume} FLOW
                        </div>
                        <div className="text-sm text-muted-foreground">{noPercent}%</div>
                      </div>
                    </div>

                    {/* Resolution Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={() => resolveMarket(market.marketId, "yes")}
                        disabled={resolving !== null}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {resolving === market.marketId ? "Resolving..." : "Resolve as YES"}
                      </Button>
                      <Button
                        onClick={() => resolveMarket(market.marketId, "no")}
                        disabled={resolving !== null}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        {resolving === market.marketId ? "Resolving..." : "Resolve as NO"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
