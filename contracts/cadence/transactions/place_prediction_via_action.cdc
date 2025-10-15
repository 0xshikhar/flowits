import PredictionActions from "PredictionActions"
import FlowToken from "FlowToken"
import FungibleToken from "FungibleToken"

/// Place prediction using Flow Actions (composable)
transaction(marketId: UInt64, outcome: String, amount: UFix64) {
    prepare(signer: auth(Storage) &Account) {
        // Create prediction action (DeFiActions.Sink)
        let predictionSink = PredictionActions.createPredictionAction(
            marketId: marketId,
            outcome: outcome,
            userAddress: signer.address
        )
        
        // Get FLOW vault
        let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("Could not borrow FlowToken vault")
        
        // Deposit into the sink (places prediction)
        predictionSink.depositCapacity(from: vaultRef)
        
        log("Prediction placed via Flow Action on market ".concat(marketId.toString()))
    }
}
