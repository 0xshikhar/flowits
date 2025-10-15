import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"
import NonFungibleToken from "NonFungibleToken"

/// NFTBattle - Battle system where users stake NFTs and community bets on outcomes
access(all) contract NFTBattle {
    
    access(all) event BattleCreated(battleId: UInt64, creator: Address, nftType: String, condition: String)
    access(all) event BattleAccepted(battleId: UInt64, opponent: Address)
    access(all) event BattleBetPlaced(battleId: UInt64, user: Address, side: String, amount: UFix64)
    access(all) event BattleResolved(battleId: UInt64, winner: String)
    access(all) event BattleWinningsClaimed(battleId: UInt64, user: Address, amount: UFix64)
    
    access(all) let AdminStoragePath: StoragePath
    access(all) var nextBattleId: UInt64
    access(contract) let battles: @{UInt64: Battle}
    
    access(all) struct BattleInfo {
        access(all) let battleId: UInt64
        access(all) let creator: Address
        access(all) var opponent: Address?
        access(all) let condition: String
        access(all) let closeTime: UFix64
        access(all) var status: String
        access(all) var winner: String?
        access(all) var creatorPool: UFix64
        access(all) var opponentPool: UFix64
        
        init(battleId: UInt64, creator: Address, condition: String, closeTime: UFix64) {
            self.battleId = battleId
            self.creator = creator
            self.opponent = nil
            self.condition = condition
            self.closeTime = closeTime
            self.status = "pending"
            self.winner = nil
            self.creatorPool = 0.0
            self.opponentPool = 0.0
        }
    }
    
    access(all) struct BattleBetData {
        access(all) let side: String
        access(all) let amount: UFix64
        access(all) var claimed: Bool
        
        init(side: String, amount: UFix64) {
            self.side = side
            self.amount = amount
            self.claimed = false
        }
    }
    
    access(all) resource Battle {
        access(self) var info: BattleInfo
        access(self) let bets: {Address: BattleBetData}
        access(self) let totalPool: @FlowToken.Vault
        
        init(creator: Address, condition: String, closeTime: UFix64) {
            self.info = BattleInfo(battleId: NFTBattle.nextBattleId, creator: creator, condition: condition, closeTime: closeTime)
            self.bets = {}
            self.totalPool <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>()) as! @FlowToken.Vault
        }
        
        access(all) fun acceptBattle(opponent: Address) {
            pre {
                self.info.status == "pending": "Battle not pending"
                self.info.opponent == nil: "Battle already accepted"
            }
            
            self.info.opponent = opponent
            self.info.status = "active"
            emit BattleAccepted(battleId: self.info.battleId, opponent: opponent)
        }
        
        access(all) fun placeBet(user: Address, side: String, payment: @{FungibleToken.Vault}) {
            pre {
                self.info.status == "active": "Battle not active"
                getCurrentBlock().timestamp < self.info.closeTime: "Battle closed"
                side == "creator" || side == "opponent": "Invalid side"
                self.bets[user] == nil: "Already bet"
                payment.balance > 0.0: "Must bet positive amount"
            }
            
            let amount = payment.balance
            self.totalPool.deposit(from: <-payment)
            
            if side == "creator" {
                self.info.creatorPool = self.info.creatorPool + amount
            } else {
                self.info.opponentPool = self.info.opponentPool + amount
            }
            
            self.bets[user] = BattleBetData(side: side, amount: amount)
            emit BattleBetPlaced(battleId: self.info.battleId, user: user, side: side, amount: amount)
        }
        
        access(all) fun resolveBattle(winner: String) {
            pre {
                self.info.status == "active": "Battle not active"
                winner == "creator" || winner == "opponent": "Invalid winner"
                getCurrentBlock().timestamp >= self.info.closeTime: "Battle not closed"
            }
            
            self.info.status = "resolved"
            self.info.winner = winner
            emit BattleResolved(battleId: self.info.battleId, winner: winner)
        }
        
        access(all) fun claimWinnings(user: Address, receiver: &{FungibleToken.Receiver}) {
            pre {
                self.info.status == "resolved": "Battle not resolved"
                self.bets[user] != nil: "No bet found"
                !self.bets[user]!.claimed: "Already claimed"
            }
            
            let bet = self.bets[user]!
            
            if bet.side == self.info.winner {
                let totalWinningPool = self.info.winner == "creator" ? self.info.creatorPool : self.info.opponentPool
                let totalPool = self.totalPool.balance
                let userShare = (bet.amount / totalWinningPool) * totalPool
                let payout <- self.totalPool.withdraw(amount: userShare)
                receiver.deposit(from: <-payout)
                emit BattleWinningsClaimed(battleId: self.info.battleId, user: user, amount: userShare)
            }
            
            self.bets[user]!.claimed = true
        }
        
        access(all) fun getInfo(): BattleInfo {
            return self.info
        }
        
        access(all) fun getBet(user: Address): BattleBetData? {
            return self.bets[user]
        }
    }
    
    access(all) resource Admin {
        access(all) fun resolveBattle(battleId: UInt64, winner: String) {
            let battleRef = &NFTBattle.battles[battleId] as &Battle?
            battleRef?.resolveBattle(winner: winner)
        }
    }
    
    access(all) fun createBattle(creator: Address, condition: String, closeTime: UFix64): UInt64 {
        let battle <- create Battle(creator: creator, condition: condition, closeTime: closeTime)
        let battleId = self.nextBattleId
        self.battles[battleId] <-! battle
        self.nextBattleId = self.nextBattleId + 1
        emit BattleCreated(battleId: battleId, creator: creator, nftType: "Generic", condition: condition)
        return battleId
    }
    
    access(all) fun acceptBattle(battleId: UInt64, opponent: Address) {
        let battleRef = &self.battles[battleId] as &Battle? ?? panic("Battle not found")
        battleRef.acceptBattle(opponent: opponent)
    }
    
    access(all) fun placeBet(battleId: UInt64, user: Address, side: String, payment: @{FungibleToken.Vault}) {
        let battleRef = &self.battles[battleId] as &Battle? ?? panic("Battle not found")
        battleRef.placeBet(user: user, side: side, payment: <-payment)
    }
    
    access(all) fun claimWinnings(battleId: UInt64, user: Address, receiver: &{FungibleToken.Receiver}) {
        let battleRef = &self.battles[battleId] as &Battle? ?? panic("Battle not found")
        battleRef.claimWinnings(user: user, receiver: receiver)
    }
    
    access(all) fun getBattleInfo(battleId: UInt64): BattleInfo? {
        return self.battles[battleId]?.getInfo()
    }
    
    init() {
        self.nextBattleId = 0
        self.battles <- {}
        self.AdminStoragePath = /storage/NFTBattleAdmin
        let admin <- create Admin()
        self.account.storage.save(<-admin, to: self.AdminStoragePath)
    }
}
