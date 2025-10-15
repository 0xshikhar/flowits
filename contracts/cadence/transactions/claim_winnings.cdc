import PredictionMarket from "PredictionMarket"
import FlowToken from "FlowToken"
import FungibleToken from "FungibleToken"

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
        
        log("Winnings claimed from market ".concat(marketId.toString()))
    }
}
