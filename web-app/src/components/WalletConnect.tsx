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
      const result = await fcl.authenticate()
      console.log('✅ Wallet authentication result:', result)
    } catch (error: any) {
      console.error("❌ Connection error:", error)
      // Only show error if it's not a user cancellation
      if (error?.message && !error.message.includes('Declined') && !error.message.includes('Halted')) {
        alert('Failed to connect wallet. Please try again.')
      }
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
        className="bg-[#a4ff31] hover:bg-[#b8ff52] text-black font-bold shadow-lg hover:shadow-xl transition-all duration-200 neon-glow border-2 border-[#a4ff31]"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {loading ? "Connecting..." : "Connect"}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-[#e8ffe0] px-3 py-2 border-2 border-[#a4ff31] shadow-md">
        <Coins className="h-4 w-4 text-black" />
        <span className="font-bold text-black text-sm">{balance}</span>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-2 border-2 border-gray-300 shadow-md">
        <div className="h-2 w-2 bg-[#a4ff31] animate-pulse" />
        <span className="font-mono text-xs text-gray-700">
          {user.addr?.slice(0, 6)}...{user.addr?.slice(-4)}
        </span>
      </div>

      <Button
        onClick={disconnect}
        variant="outline"
        size="icon"
        className="border-2 border-gray-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
      >
        <LogOut className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  )
}
