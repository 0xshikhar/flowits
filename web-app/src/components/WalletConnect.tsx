"use client"

import { useEffect, useState } from "react"
import { fcl } from "@/lib/flow/config"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, Coins } from "lucide-react"
import { getFlowBalance } from "@/lib/flow/scripts"

interface FlowUser {
  loggedIn?: boolean
  addr?: string
}

export function WalletConnect() {
  const [user, setUser] = useState<FlowUser>({ loggedIn: false })
  const [balance, setBalance] = useState<string>("0.0")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fcl.currentUser.subscribe((currentUser: any) => {
      setUser(currentUser)
    })
  }, [])

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user.addr) return
      const bal = await getFlowBalance(user.addr)
      setBalance(parseFloat(bal).toFixed(2))
    }

    if (user.loggedIn && user.addr) {
      fetchBalance()
    }
  }, [user.loggedIn, user.addr])

  const connect = async () => {
    setLoading(true)
    try {
      console.log('🔐 Attempting to connect wallet...')
      await fcl.authenticate()
      console.log('✅ Wallet connected successfully')
    } catch (error) {
      console.error("❌ Connection error:", error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    fcl.unauthenticate()
  }

  if (!user.loggedIn) {
    return (
      <Button
        onClick={connect}
        disabled={loading}
        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 rounded-xl"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {loading ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl border-2 border-amber-200 shadow-md">
        <Coins className="h-4 w-4 text-amber-600" />
        <span className="font-bold text-foreground">{balance} FLOW</span>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 glass px-3 py-2 rounded-xl border-2 border-border shadow-md">
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        <span className="font-mono text-sm text-foreground">
          {user.addr?.slice(0, 6)}...{user.addr?.slice(-4)}
        </span>
      </div>

      <Button
        onClick={disconnect}
        variant="outline"
        size="icon"
        className="border-2 border-border hover:bg-red-50 hover:border-red-400 transition-all duration-200 rounded-xl"
      >
        <LogOut className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  )
}
