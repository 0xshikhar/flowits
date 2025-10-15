import PredictionMarket from "PredictionMarket"

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
