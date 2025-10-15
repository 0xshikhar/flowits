import { fcl, getContractAddress } from "./config"
import * as t from "@onflow/types"

export interface CreateMarketParams {
  question: string
  closeTime: number
  minStake: string
  creatorFeePercent: string
}

export interface PlacePredictionParams {
  marketId: number
  outcome: "yes" | "no"
  amount: string
}

export const createMarket = async (params: CreateMarketParams) => {
  const { question, closeTime, minStake, creatorFeePercent } = params

  const transactionId = await fcl.mutate({
    cadence: `
      import PredictionMarket from ${getContractAddress("PredictionMarket")}

      transaction(question: String, closeTime: UFix64, minStake: UFix64, creatorFeePercent: UFix64) {
        prepare(signer: auth(Storage) &Account) {
          let marketId = PredictionMarket.createMarket(
            creator: signer.address,
            question: question,
            closeTime: closeTime,
            minStake: minStake,
            creatorFeePercent: creatorFeePercent
          )
          
          log("Market created with ID: ".concat(marketId.toString()))
        }
      }
    `,
    args: (arg, t) => [
      arg(question, t.String),
      arg(closeTime.toFixed(1), t.UFix64),
      arg(minStake, t.UFix64),
      arg(creatorFeePercent, t.UFix64),
    ],
    proposer: fcl.currentUser.authorization,
    payer: fcl.currentUser.authorization,
    authorizations: [fcl.currentUser.authorization],
    limit: 999,
  })

  return fcl.tx(transactionId).onceSealed()
}

export const placePrediction = async (params: PlacePredictionParams) => {
  const { marketId, outcome, amount } = params

  const transactionId = await fcl.mutate({
    cadence: `
      import PredictionMarket from ${getContractAddress("PredictionMarket")}
      import FlowToken from ${getContractAddress("FlowToken")}
      import FungibleToken from ${getContractAddress("FungibleToken")}

      transaction(marketId: UInt64, outcome: String, amount: UFix64) {
        let payment: @{FungibleToken.Vault}
        
        prepare(signer: auth(Storage) &Account) {
          let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
          ) ?? panic("Could not borrow FlowToken vault")
          
          self.payment <- vaultRef.withdraw(amount: amount)
        }
        
        execute {
          PredictionMarket.placePrediction(
            marketId: marketId,
            user: self.payment.owner!.address,
            outcome: outcome,
            payment: <-self.payment
          )
        }
      }
    `,
    args: (arg, t) => [arg(marketId, t.UInt64), arg(outcome, t.String), arg(amount, t.UFix64)],
    proposer: fcl.currentUser.authorization,
    payer: fcl.currentUser.authorization,
    authorizations: [fcl.currentUser.authorization],
    limit: 999,
  })

  return fcl.tx(transactionId).onceSealed()
}

export const placePredictionViaAction = async (params: PlacePredictionParams) => {
  const { marketId, outcome, amount } = params

  const transactionId = await fcl.mutate({
    cadence: `
      import PredictionActions from ${getContractAddress("PredictionActions")}
      import FlowToken from ${getContractAddress("FlowToken")}
      import FungibleToken from ${getContractAddress("FungibleToken")}

      transaction(marketId: UInt64, outcome: String, amount: UFix64) {
        prepare(signer: auth(Storage) &Account) {
          let predictionSink = PredictionActions.createPredictionAction(
            marketId: marketId,
            outcome: outcome,
            userAddress: signer.address
          )
          
          let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
          ) ?? panic("Could not borrow FlowToken vault")
          
          predictionSink.depositCapacity(from: vaultRef)
        }
      }
    `,
    args: (arg, t) => [arg(marketId, t.UInt64), arg(outcome, t.String), arg(amount, t.UFix64)],
    proposer: fcl.currentUser.authorization,
    payer: fcl.currentUser.authorization,
    authorizations: [fcl.currentUser.authorization],
    limit: 999,
  })

  return fcl.tx(transactionId).onceSealed()
}

export const claimWinnings = async (marketId: number) => {
  const transactionId = await fcl.mutate({
    cadence: `
      import PredictionMarket from ${getContractAddress("PredictionMarket")}
      import FlowToken from ${getContractAddress("FlowToken")}
      import FungibleToken from ${getContractAddress("FungibleToken")}

      transaction(marketId: UInt64) {
        let receiverRef: &{FungibleToken.Receiver}
        
        prepare(signer: auth(Storage) &Account) {
          self.receiverRef = signer.capabilities.borrow<&{FungibleToken.Receiver}>(
            /public/flowTokenReceiver
          ) ?? panic("Could not borrow FlowToken receiver")
        }
        
        execute {
          PredictionMarket.claimWinnings(
            marketId: marketId,
            user: self.receiverRef.owner!.address,
            receiver: self.receiverRef
          )
        }
      }
    `,
    args: (arg, t) => [arg(marketId, t.UInt64)],
    proposer: fcl.currentUser.authorization,
    payer: fcl.currentUser.authorization,
    authorizations: [fcl.currentUser.authorization],
    limit: 999,
  })

  return fcl.tx(transactionId).onceSealed()
}
