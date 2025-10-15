import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"

access(all) contract PredictionMarket {
    
    access(all) event MarketCreated(marketId: UInt64, creator: Address, question: String, closeTime: UFix64)
    access(all) event PredictionPlaced(marketId: UInt64, user: Address, outcome: String, amount: UFix64)
    access(all) event MarketResolved(marketId: UInt64, winningOutcome: String, totalPool: UFix64)
    access(all) event WinningsClaimed(marketId: UInt64, user: Address, amount: UFix64)
    
    access(all) let AdminStoragePath: StoragePath
    access(all) var nextMarketId: UInt64
    access(contract) let markets: @{UInt64: Market}
    
    access(all) struct MarketInfo {
        access(all) let marketId: UInt64
        access(all) let creator: Address
        access(all) let question: String
        access(all) let closeTime: UFix64
        access(all) let minStake: UFix64
        access(all) let creatorFeePercent: UFix64
        access(all) var isResolved: Bool
        access(all) var winningOutcome: String?
        access(all) var totalYesVolume: UFix64
        access(all) var totalNoVolume: UFix64
        
        access(contract) fun updateYesVolume(_ amount: UFix64) {
            self.totalYesVolume = self.totalYesVolume + amount
        }
        
        access(contract) fun updateNoVolume(_ amount: UFix64) {
            self.totalNoVolume = self.totalNoVolume + amount
        }
        
        access(contract) fun resolve(_ outcome: String) {
            self.isResolved = true
            self.winningOutcome = outcome
        }
        
        init(marketId: UInt64, creator: Address, question: String, closeTime: UFix64, minStake: UFix64, creatorFeePercent: UFix64) {
            self.marketId = marketId
            self.creator = creator
            self.question = question
            self.closeTime = closeTime
            self.minStake = minStake
            self.creatorFeePercent = creatorFeePercent
            self.isResolved = false
            self.winningOutcome = nil
            self.totalYesVolume = 0.0
            self.totalNoVolume = 0.0
        }
    }
    
    access(all) struct PredictionData {
        access(all) let outcome: String
        access(all) let amount: UFix64
        access(all) let claimed: Bool
        
        init(outcome: String, amount: UFix64, claimed: Bool) {
            self.outcome = outcome
            self.amount = amount
            self.claimed = claimed
        }
    }
    
    access(all) resource Market {
        access(self) var info: MarketInfo
        access(self) let predictions: {Address: PredictionData}
        access(self) let totalPool: @FlowToken.Vault
        
        init(creator: Address, question: String, closeTime: UFix64, minStake: UFix64, creatorFeePercent: UFix64) {
            self.info = MarketInfo(marketId: PredictionMarket.nextMarketId, creator: creator, question: question, closeTime: closeTime, minStake: minStake, creatorFeePercent: creatorFeePercent)
            self.predictions = {}
            self.totalPool <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>()) as! @FlowToken.Vault
        }
        
        access(all) fun placePrediction(user: Address, outcome: String, payment: @{FungibleToken.Vault}) {
            pre {
                getCurrentBlock().timestamp < self.info.closeTime: "Market closed"
                payment.balance >= self.info.minStake: "Below minimum stake"
                outcome == "yes" || outcome == "no": "Invalid outcome"
                !self.info.isResolved: "Market resolved"
                self.predictions[user] == nil: "Already predicted"
            }
            
            let amount = payment.balance
            self.totalPool.deposit(from: <-payment)
            
            if outcome == "yes" {
                self.info.updateYesVolume(amount)
            } else {
                self.info.updateNoVolume(amount)
            }
            
            self.predictions[user] = PredictionData(outcome: outcome, amount: amount, claimed: false)
            emit PredictionPlaced(marketId: self.info.marketId, user: user, outcome: outcome, amount: amount)
        }
        
        access(all) fun resolveMarket(winningOutcome: String) {
            pre {
                !self.info.isResolved: "Already resolved"
                winningOutcome == "yes" || winningOutcome == "no": "Invalid outcome"
            }
            
            self.info.resolve(winningOutcome)
            emit MarketResolved(marketId: self.info.marketId, winningOutcome: winningOutcome, totalPool: self.totalPool.balance)
        }
        
        access(all) fun claimWinnings(user: Address, receiver: &{FungibleToken.Receiver}) {
            pre {
                self.info.isResolved: "Not resolved"
                self.predictions[user] != nil: "No prediction"
                !self.predictions[user]!.claimed: "Already claimed"
            }
            
            let prediction = self.predictions[user]!
            
            if prediction.outcome == self.info.winningOutcome {
                let totalWinningVolume = self.info.winningOutcome == "yes" ? self.info.totalYesVolume : self.info.totalNoVolume
                let totalPool = self.totalPool.balance
                let creatorFee = totalPool * self.info.creatorFeePercent / 100.0
                let distributionPool = totalPool - creatorFee
                let userShare = (prediction.amount / totalWinningVolume) * distributionPool
                let payout <- self.totalPool.withdraw(amount: userShare)
                receiver.deposit(from: <-payout)
                emit WinningsClaimed(marketId: self.info.marketId, user: user, amount: userShare)
            }
            
            self.predictions[user] = PredictionData(outcome: prediction.outcome, amount: prediction.amount, claimed: true)
        }
        
        access(all) fun getInfo(): MarketInfo {
            return self.info
        }
        
        access(all) fun getPrediction(user: Address): PredictionData? {
            return self.predictions[user]
        }
    }
    
    access(all) resource Admin {
        access(all) fun resolveMarket(marketId: UInt64, winningOutcome: String) {
            let marketRef = &PredictionMarket.markets[marketId] as &Market?
            marketRef?.resolveMarket(winningOutcome: winningOutcome)
        }
    }
    
    access(all) fun createMarket(creator: Address, question: String, closeTime: UFix64, minStake: UFix64, creatorFeePercent: UFix64): UInt64 {
        let market <- create Market(creator: creator, question: question, closeTime: closeTime, minStake: minStake, creatorFeePercent: creatorFeePercent)
        let marketId = self.nextMarketId
        self.markets[marketId] <-! market
        self.nextMarketId = self.nextMarketId + 1
        emit MarketCreated(marketId: marketId, creator: creator, question: question, closeTime: closeTime)
        return marketId
    }
    
    access(all) fun getMarketInfo(marketId: UInt64): MarketInfo? {
        return self.markets[marketId]?.getInfo()
    }
    
    access(all) fun placePrediction(marketId: UInt64, user: Address, outcome: String, payment: @{FungibleToken.Vault}) {
        let marketRef = &self.markets[marketId] as &Market? ?? panic("Market not found")
        marketRef.placePrediction(user: user, outcome: outcome, payment: <-payment)
    }
    
    access(all) fun claimWinnings(marketId: UInt64, user: Address, receiver: &{FungibleToken.Receiver}) {
        let marketRef = &self.markets[marketId] as &Market? ?? panic("Market not found")
        marketRef.claimWinnings(user: user, receiver: receiver)
    }
    
    init() {
        self.nextMarketId = 0
        self.markets <- {}
        self.AdminStoragePath = /storage/PredictionMarketAdmin
        let admin <- create Admin()
        self.account.storage.save(<-admin, to: self.AdminStoragePath)
    }
}
