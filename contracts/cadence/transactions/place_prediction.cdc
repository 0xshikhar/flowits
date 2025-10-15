import PredictionMarket from "PredictionMarket"
import FlowToken from "FlowToken"
import FungibleToken from "FungibleToken"

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
        
        log("Prediction placed on market ".concat(marketId.toString()))
    }
}
