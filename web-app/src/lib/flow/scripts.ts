import { fcl, getContractAddress } from "./config"
import * as t from "@onflow/types"

export interface MarketInfo {
  marketId: number
  creator: string
  question: string
  closeTime: number
  minStake: string
  creatorFeePercent: string
  isResolved: boolean
  winningOutcome: string | null
  totalYesVolume: string
  totalNoVolume: string
}

export const getMarketInfo = async (marketId: number): Promise<MarketInfo | null> => {
  try {
    const result = await fcl.query({
      cadence: `
        import PredictionMarket from ${getContractAddress("PredictionMarket")}

        access(all) fun main(marketId: UInt64): PredictionMarket.MarketInfo? {
          return PredictionMarket.getMarketInfo(marketId: marketId)
        }
      `,
      args: (arg, t) => [arg(marketId, t.UInt64)],
    })

    return result
  } catch (error) {
    console.error("Error fetching market info:", error)
    return null
  }
}

export const getFlowBalance = async (address: string): Promise<string> => {
  try {
    const result = await fcl.query({
      cadence: `
        import FlowToken from ${getContractAddress("FlowToken")}
        import FungibleToken from ${getContractAddress("FungibleToken")}

        access(all) fun main(address: Address): UFix64 {
          let account = getAccount(address)
          let vaultRef = account.capabilities.borrow<&{FungibleToken.Balance}>(
            /public/flowTokenBalance
          ) ?? panic("Could not borrow Balance reference")
          
          return vaultRef.balance
        }
      `,
      args: (arg, t) => [arg(address, t.Address)],
    })

    return result
  } catch (error) {
    console.error("Error fetching FLOW balance:", error)
    return "0.0"
  }
}

export const getNBATopShotMoments = async (address: string) => {
  try {
    const result = await fcl.query({
      cadence: `
        import TopShot from 0x0b2a3299cc857e29
        import MetadataViews from 0x1d7e57aa55817448

        access(all) struct MomentData {
          access(all) let id: UInt64
          access(all) let playId: UInt32
          access(all) let serialNumber: UInt32
          
          init(id: UInt64, playId: UInt32, serialNumber: UInt32) {
            self.id = id
            self.playId = playId
            self.serialNumber = serialNumber
          }
        }

        access(all) fun main(address: Address): [MomentData] {
          let account = getAccount(address)
          
          let collectionRef = account.capabilities.borrow<&{TopShot.MomentCollectionPublic}>(
            TopShot.CollectionPublicPath
          )
          
          if collectionRef == nil {
            return []
          }
          
          let ids = collectionRef!.getIDs()
          let moments: [MomentData] = []
          
          for id in ids {
            let nft = collectionRef!.borrowMoment(id: id)
            if nft != nil {
              moments.append(MomentData(
                id: id,
                playId: nft!.data.playID,
                serialNumber: nft!.data.serialNumber
              ))
            }
          }
          
          return moments
        }
      `,
      args: (arg, t) => [arg(address, t.Address)],
    })

    return result || []
  } catch (error) {
    console.error("Error fetching NBA Top Shot moments:", error)
    return []
  }
}
