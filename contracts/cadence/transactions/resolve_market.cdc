import PredictionMarket from "PredictionMarket"

transaction(marketId: UInt64, winningOutcome: String) {
    let adminRef: &PredictionMarket.Admin
    
    prepare(signer: auth(Storage) &Account) {
        self.adminRef = signer.storage.borrow<&PredictionMarket.Admin>(
            from: PredictionMarket.AdminStoragePath
        ) ?? panic("Could not borrow admin reference")
    }
    
    execute {
        self.adminRef.resolveMarket(marketId: marketId, winningOutcome: winningOutcome)
        log("Market resolved with winning outcome: ".concat(winningOutcome))
    }
}
