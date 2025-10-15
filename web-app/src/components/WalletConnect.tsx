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
      await fcl.authenticate()
    } catch (error) {
      console.error("Connection error:", error)
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
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {loading ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-md">
        <Coins className="h-4 w-4 text-yellow-600" />
        <span className="font-bold text-yellow-900">{balance} FLOW</span>
      </div>
      
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-purple-300 shadow-md">
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        <span className="font-mono text-sm text-gray-700">
          {user.addr?.slice(0, 6)}...{user.addr?.slice(-4)}
        </span>
      </div>

      <Button
        onClick={disconnect}
        variant="outline"
        size="icon"
        className="border-2 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
      >
        <LogOut className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  )
}
