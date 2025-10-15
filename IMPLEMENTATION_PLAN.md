# FlowBattle (Moments App) - Detailed Implementation Plan

**Timeline**: 2 weeks  
**Priority Tracks**: Flow Forte Actions ($6K) + Dapper Integration ($4K + $5K + $5K)  
**Tech Stack**: Flow Cadence, Flow Actions (FLIP-338), FCL, Next.js 14, Prisma, PostgreSQL

---

## PHASE 1: Foundation & Cadence Contracts (Days 1-4)

### 1.1 Flow Project Setup

**Setup flow.json**
```json
{
  "contracts": {
    "PredictionMarket": "./cadence/contracts/PredictionMarket.cdc",
    "NFTBattle": "./cadence/contracts/NFTBattle.cdc",
    "AchievementNFT": "./cadence/contracts/AchievementNFT.cdc",
    "PredictionActions": "./cadence/contracts/actions/PredictionActions.cdc",
    "BattleActions": "./cadence/contracts/actions/BattleActions.cdc",
    "RewardDistributor": "./cadence/contracts/RewardDistributor.cdc"
  },
  "dependencies": {
    "DeFiActions": "mainnet://92195d814edf9cb0.DeFiActions",
    "NonFungibleToken": "mainnet://1d7e57aa55817448.NonFungibleToken",
    "MetadataViews": "mainnet://1d7e57aa55817448.MetadataViews",
    "FlowToken": "mainnet://1654653399040a61.FlowToken",
    "FungibleToken": "mainnet://f233dcee88fe0abe.FungibleToken"
  }
}
```

**Install Flow CLI**
```bash
brew install flow-cli
flow project init
flow dependencies install
```

---

### 1.2 Core Cadence Contracts

#### **PredictionMarket.cdc** (Main prediction logic)

```cadence
import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"
import NonFungibleToken from "NonFungibleToken"

access(all) contract PredictionMarket {
    
    // Events
    access(all) event MarketCreated(marketId: UInt64, creator: Address, question: String)
    access(all) event PredictionPlaced(marketId: UInt64, user: Address, outcome: String, amount: UFix64)
    access(all) event MarketResolved(marketId: UInt64, winningOutcome: String)
    access(all) event WinningsClaimed(marketId: UInt64, user: Address, amount: UFix64)
    
    // Storage paths
    access(all) let AdminStoragePath: StoragePath
    access(all) let MarketPublicPath: PublicPath
    
    access(all) var nextMarketId: UInt64
    access(all) var markets: @{UInt64: Market}
    
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
        
        init(marketId: UInt64, creator: Address, question: String, closeTime: UFix64, 
             minStake: UFix64, creatorFeePercent: UFix64) {
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
    
    access(all) resource Market {
        access(all) let info: MarketInfo
        access(all) var predictions: {Address: Prediction}
        access(all) var totalPool: @FlowToken.Vault
        
        init(creator: Address, question: String, closeTime: UFix64, minStake: UFix64, creatorFeePercent: UFix64) {
            self.info = MarketInfo(
                marketId: PredictionMarket.nextMarketId,
                creator: creator,
                question: question,
                closeTime: closeTime,
                minStake: minStake,
                creatorFeePercent: creatorFeePercent
            )
            self.predictions = {}
            self.totalPool <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>()) as! @FlowToken.Vault
        }
        
        access(all) fun placePrediction(user: Address, outcome: String, payment: @{FungibleToken.Vault}) {
            pre {
                getCurrentBlock().timestamp <= self.info.closeTime: "Market closed"
                payment.balance >= self.info.minStake: "Below minimum stake"
                outcome == "yes" || outcome == "no": "Invalid outcome"
                !self.info.isResolved: "Market already resolved"
            }
            
            let amount = payment.balance
            self.totalPool.deposit(from: <-payment)
            
            if outcome == "yes" {
                self.info.totalYesVolume = self.info.totalYesVolume + amount
            } else {
                self.info.totalNoVolume = self.info.totalNoVolume + amount
            }
            
            self.predictions[user] = Prediction(outcome: outcome, amount: amount, claimed: false)
            
            emit PredictionPlaced(marketId: self.info.marketId, user: user, outcome: outcome, amount: amount)
        }
        
        access(all) fun resolveMarket(winningOutcome: String) {
            pre {
                !self.info.isResolved: "Already resolved"
                winningOutcome == "yes" || winningOutcome == "no": "Invalid outcome"
            }
            
            self.info.isResolved = true
            self.info.winningOutcome = winningOutcome
            
            emit MarketResolved(marketId: self.info.marketId, winningOutcome: winningOutcome)
        }
        
        access(all) fun claimWinnings(user: Address, receiver: &{FungibleToken.Receiver}) {
            pre {
                self.info.isResolved: "Market not resolved"
                self.predictions[user] != nil: "No prediction found"
                !self.predictions[user]!.claimed: "Already claimed"
            }
            
            let prediction = self.predictions[user]!
            let totalWinningVolume = self.info.winningOutcome == "yes" 
                ? self.info.totalYesVolume 
                : self.info.totalNoVolume
            
            if prediction.outcome == self.info.winningOutcome {
                let totalPool = self.totalPool.balance
                let creatorFee = totalPool * self.info.creatorFeePercent / 100.0
                let distributionPool = totalPool - creatorFee
                
                let userShare = (prediction.amount / totalWinningVolume) * distributionPool
                let payout <- self.totalPool.withdraw(amount: userShare)
                
                receiver.deposit(from: <-payout)
                self.predictions[user]!.claimed = true
                
                emit WinningsClaimed(marketId: self.info.marketId, user: user, amount: userShare)
            }
        }
    }
    
    access(all) struct Prediction {
        access(all) let outcome: String
        access(all) let amount: UFix64
        access(all) var claimed: Bool
        
        init(outcome: String, amount: UFix64, claimed: Bool) {
            self.outcome = outcome
            self.amount = amount
            self.claimed = claimed
        }
    }
    
    access(all) fun createMarket(creator: Address, question: String, closeTime: UFix64, 
                                 minStake: UFix64, creatorFeePercent: UFix64): UInt64 {
        let market <- create Market(
            creator: creator,
            question: question,
            closeTime: closeTime,
            minStake: minStake,
            creatorFeePercent: creatorFeePercent
        )
        
        let marketId = self.nextMarketId
        self.markets[marketId] <-! market
        self.nextMarketId = self.nextMarketId + 1
        
        emit MarketCreated(marketId: marketId, creator: creator, question: question)
        return marketId
    }
    
    init() {
        self.nextMarketId = 0
        self.markets <- {}
        self.AdminStoragePath = /storage/PredictionMarketAdmin
        self.MarketPublicPath = /public/PredictionMarket
    }
}
```

---

#### **PredictionActions.cdc** (Flow Actions implementation)

```cadence
import DeFiActions from "DeFiActions"
import FungibleToken from "FungibleToken"
import FlowToken from "FlowToken"
import PredictionMarket from "PredictionMarket"

access(all) contract PredictionActions {
    
    // Prediction Sink: Receives FLOW tokens and places them as predictions
    access(all) struct PredictionSink: DeFiActions.Sink {
        access(contract) var uniqueID: DeFiActions.UniqueIdentifier?
        access(all) let marketId: UInt64
        access(all) let outcome: String
        access(all) let userAddress: Address
        
        init(marketId: UInt64, outcome: String, userAddress: Address, uniqueID: DeFiActions.UniqueIdentifier?) {
            self.marketId = marketId
            self.outcome = outcome
            self.userAddress = userAddress
            self.uniqueID = uniqueID
        }
        
        access(all) view fun getSinkType(): Type {
            return Type<@FlowToken.Vault>()
        }
        
        access(all) fun minimumCapacity(): UFix64 {
            // Get market min stake from PredictionMarket contract
            return 1.0 // Minimum 1 FLOW
        }
        
        access(all) fun depositCapacity(from: auth(FungibleToken.Withdraw) &{FungibleToken.Vault}) {
            pre {
                from.getType() == self.getSinkType(): "Invalid vault type"
            }
            
            let amount = from.balance
            if amount == 0.0 { return }
            
            let payment <- from.withdraw(amount: amount) as! @FlowToken.Vault
            
            // Place prediction on market
            PredictionMarket.markets[self.marketId]?.placePrediction(
                user: self.userAddress,
                outcome: self.outcome,
                payment: <-payment
            )
        }
        
        access(all) fun getComponentInfo(): DeFiActions.ComponentInfo {
            return DeFiActions.ComponentInfo(
                type: self.getType(),
                id: self.id(),
                innerComponents: []
            )
        }
        
        access(contract) view fun copyID(): DeFiActions.UniqueIdentifier? {
            return self.uniqueID
        }
        
        access(contract) fun setID(_ id: DeFiActions.UniqueIdentifier?) {
            self.uniqueID = id
        }
    }
    
    // Create prediction action
    access(all) fun createPredictionAction(marketId: UInt64, outcome: String, userAddress: Address): PredictionSink {
        return PredictionSink(
            marketId: marketId,
            outcome: outcome,
            userAddress: userAddress,
            uniqueID: nil
        )
    }
}
```

---

### 1.3 NFT Battle Contract

**NFTBattle.cdc**
- NFT escrow mechanism
- Community betting on battles
- Winner determination logic
- NFT transfer on resolution

---

### 1.4 Achievement NFT Contract

**AchievementNFT.cdc** (Soulbound NFT)
- Non-transferable achievement NFTs
- Metadata for achievement types
- Minting restricted to authorized contracts

---

## PHASE 2: Flow Actions & Scheduled Transactions (Days 5-7)

### 2.1 Scheduled Transactions Setup

**Transaction: schedule_creator_payouts.cdc**
```cadence
import PredictionMarket from "PredictionMarket"
import RewardDistributor from "RewardDistributor"
import FlowToken from "FlowToken"

transaction {
    prepare(signer: auth(Storage) &Account) {
        // Schedule weekly creator payouts
        // Runs every Sunday at midnight
        
        let distributor = signer.storage.borrow<&RewardDistributor>(from: /storage/RewardDistributor)
            ?? panic("Reward distributor not found")
        
        distributor.distributeWeeklyCreatorRewards()
    }
}
```

**Schedule this via Flow scheduled transactions:**
- Frequency: Weekly (every Sunday 00:00 UTC)
- Action: Distribute creator fees from markets
- Automated via Flow's scheduled transaction feature

### 2.2 Achievement Checker (Scheduled)

**Transaction: check_achievements.cdc**
```cadence
import AchievementNFT from "AchievementNFT"

transaction {
    prepare(signer: auth(Storage) &Account) {
        // Daily achievement check
        // Mint NFTs for users who hit milestones
        
        let checker = signer.storage.borrow<&AchievementNFT.AchievementChecker>(from: /storage/AchievementChecker)
            ?? panic("Achievement checker not found")
        
        checker.checkAndMintAchievements()
    }
}
```

**Schedule:**
- Frequency: Daily (02:00 UTC)
- Action: Check user stats, mint achievement NFTs

---

## PHASE 3: Frontend Integration with FCL (Days 8-11)

### 3.1 FCL Wallet Integration

**Install dependencies:**
```bash
pnpm add @onflow/fcl @onflow/types
```

**Configure FCL (src/lib/flow.ts):**
```typescript
import * as fcl from "@onflow/fcl"

fcl.config({
  "app.detail.title": "FlowBattle",
  "app.detail.icon": "https://flowbattle.app/logo.png",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "0xPredictionMarket": "YOUR_CONTRACT_ADDRESS",
  "0xNFTBattle": "YOUR_CONTRACT_ADDRESS",
  "0xPredictionActions": "YOUR_CONTRACT_ADDRESS"
})

export { fcl }
```

### 3.2 Wallet Connection Component

**components/WalletConnect.tsx:**
```typescript
import { fcl } from "@/lib/flow"
import { useEffect, useState } from "react"

export function WalletConnect() {
  const [user, setUser] = useState({ loggedIn: false, addr: "" })

  useEffect(() => {
    fcl.currentUser.subscribe(setUser)
  }, [])

  const connect = () => fcl.authenticate()
  const disconnect = () => fcl.unauthenticate()

  return (
    <div>
      {!user.loggedIn ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <span>{user.addr}</span>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  )
}
```

### 3.3 Place Prediction Transaction

**lib/transactions/placePrediction.ts:**
```typescript
import { fcl } from "@/lib/flow"
import * as t from "@onflow/types"

export async function placePrediction(marketId: number, outcome: string, amount: string) {
  const transactionId = await fcl.mutate({
    cadence: `
      import PredictionMarket from 0xPredictionMarket
      import FlowToken from 0xFlowToken
      import FungibleToken from 0xFungibleToken
      
      transaction(marketId: UInt64, outcome: String, amount: UFix64) {
        let payment: @{FungibleToken.Vault}
        
        prepare(signer: auth(Storage) &Account) {
          let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
          ) ?? panic("Could not borrow FlowToken vault")
          
          self.payment <- vaultRef.withdraw(amount: amount)
        }
        
        execute {
          PredictionMarket.markets[marketId]?.placePrediction(
            user: signer.address,
            outcome: outcome,
            payment: <-self.payment
          )
        }
      }
    `,
    args: (arg, t) => [
      arg(marketId, t.UInt64),
      arg(outcome, t.String),
      arg(amount, t.UFix64)
    ],
    proposer: fcl.authz,
    payer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 999
  })

  return fcl.tx(transactionId).onceSealed()
}
```

### 3.4 Read NFTs from Wallet (Dapper Integration)

**lib/scripts/getUserNFTs.ts:**
```typescript
import { fcl } from "@/lib/flow"

export async function getUserNBATopShotNFTs(address: string) {
  return await fcl.query({
    cadence: `
      import TopShot from 0x0b2a3299cc857e29
      import MetadataViews from 0x1d7e57aa55817448
      
      access(all) fun main(address: Address): [MomentData] {
        let account = getAccount(address)
        let collectionRef = account.capabilities.borrow<&{TopShot.MomentCollectionPublic}>(
          TopShot.CollectionPublicPath
        ) ?? panic("Could not borrow collection")
        
        let ids = collectionRef.getIDs()
        let moments: [MomentData] = []
        
        for id in ids {
          let nft = collectionRef.borrowMoment(id: id)
          let metadata = TopShot.getPlayMetaData(playID: nft.data.playID)!
          
          moments.append(MomentData(
            id: id,
            playId: nft.data.playID,
            serialNumber: nft.data.serialNumber,
            playerName: metadata["FullName"]!,
            imageUrl: "https://assets.nbatopshot.com/media/\(nft.data.playID)/media.png"
          ))
        }
        
        return moments
      }
      
      access(all) struct MomentData {
        access(all) let id: UInt64
        access(all) let playId: UInt32
        access(all) let serialNumber: UInt32
        access(all) let playerName: String
        access(all) let imageUrl: String
        
        init(id: UInt64, playId: UInt32, serialNumber: UInt32, playerName: String, imageUrl: String) {
          self.id = id
          self.playId = playId
          self.serialNumber = serialNumber
          self.playerName = playerName
          self.imageUrl = imageUrl
        }
      }
    `,
    args: (arg, t) => [arg(address, t.Address)]
  })
}
```

---

## PHASE 4: Dapper NFT Integration (Days 11-12)

### 4.1 NBA Top Shot Integration

**Contracts to import:**
- `TopShot: 0x0b2a3299cc857e29` (Mainnet)
- Collection reading
- Moment metadata

**Key features:**
- Display user's NBA moments
- Attach moments to prediction posts
- Use in NFT battles

### 4.2 NFL All Day Integration

Similar pattern to NBA Top Shot:
- `AllDay: 0xe4cf4bdc1751c65d` (Mainnet)
- Read user's NFL moments
- Display player stats

### 4.3 Find Labs API Integration

**lib/findlabs.ts:**
```typescript
const FINDLABS_API = "https://prod-main-net-dashboard-api.azurewebsites.net"

export async function getNFTsByAddress(address: string) {
  const response = await fetch(`${FINDLABS_API}/api/nfts/collections?address=${address}`)
  return response.json()
}

export async function getNFTMetadata(collection: string, tokenId: string) {
  const response = await fetch(`${FINDLABS_API}/api/nfts/${collection}/${tokenId}`)
  return response.json()
}
```

---

## PHASE 5: Admin & Analytics (Days 13-14)

### 5.1 Admin Resolution Interface

**pages/admin/resolve.tsx:**
- List markets past closeTime
- Input winning outcome
- Call `resolveMarket()` transaction
- Secure with admin wallet check

### 5.2 Leaderboards

**Calculate from database:**
- Most accurate predictions
- Highest earnings
- Battle champions
- Current streaks

### 5.3 Analytics Dashboard

**Track metrics:**
- Daily active users
- Total prediction volume
- Markets created
- Battles won/lost
- Achievement distribution

---

## IMPLEMENTATION CHECKLIST

### ✅ **Week 1: Cadence & Flow Actions**
- [ ] Setup flow.json with dependencies
- [ ] Write PredictionMarket.cdc
- [ ] Write PredictionActions.cdc (DeFiActions.Sink)
- [ ] Write NFTBattle.cdc
- [ ] Write AchievementNFT.cdc
- [ ] Write RewardDistributor.cdc
- [ ] Deploy to Flow Testnet
- [ ] Test contracts with flow-cli

### ✅ **Week 2: Frontend & Integration**
- [ ] Configure FCL
- [ ] Build wallet connection
- [ ] Implement prediction placement
- [ ] Implement battle creation
- [ ] Integrate NBA Top Shot NFT reading
- [ ] Integrate NFL All Day NFT reading
- [ ] Setup Find Labs API
- [ ] Build swipeable feed UI
- [ ] Admin resolution interface
- [ ] Leaderboards
- [ ] Schedule automated transactions
- [ ] Deploy to Vercel
- [ ] Demo video creation

---

## FORTE ACTIONS JUDGING STRATEGY

### **Maximum Points:**

1. **DeFiActions Integration (Core)**
   - ✅ PredictionSink implements DeFiActions.Sink
   - ✅ BattleSink implements DeFiActions.Sink
   - ✅ Composable with other Flow protocols
   - ✅ Clear metadata via getComponentInfo()

2. **Scheduled Transactions**
   - ✅ Weekly creator payouts (automated)
   - ✅ Daily achievement minting (automated)
   - ✅ Market settlement notifications

3. **Documentation**
   - Create FORTE_INTEGRATION.md showing:
     - How Actions are structured
     - How to compose PredictionSink with other protocols
     - Scheduled transaction setup
     - Benefits for ecosystem

4. **Demo Focus**
   - Show prediction placement via Action
   - Show automated payout execution
   - Show achievement auto-minting
   - Emphasize composability

---

## DAPPER INTEGRATION JUDGING STRATEGY

### **NBA/NFL NFT Utility ($5K track)**
- NFTs as battle stakes
- NFTs attached to prediction posts
- Real utility beyond static collecting

### **Data & Insights ($4K track)**
- Real-time odds calculation
- User accuracy metrics
- Leaderboards with win rates
- Battle statistics

### **Game Integration ($5K track)**
- Battle system inspired by FastBreak
- Performance-based outcomes
- Community betting on battles

---

## CRITICAL SUCCESS FACTORS

1. **Flow Actions MUST be clearly visible**
   - Not just "we use scheduled transactions"
   - Show composable DeFiActions patterns
   - Document discovery/metadata

2. **Dapper NFTs MUST be interactive**
   - Not just display
   - Actual gameplay utility
   - Real stakes in battles

3. **MVP scope is realistic**
   - Focus on 2-3 core features done well
   - Cut achievements if needed
   - Ensure prediction + battle work perfectly

4. **Demo video is crucial**
   - 3-5 minutes
   - Show Forte automation live
   - Show NFT battles
   - Technical depth + consumer appeal

---

## QUESTIONS TO RESOLVE BEFORE CODING

1. **Admin oracle for resolution** - Acceptable for MVP?
   - ✅ Yes, manual admin resolution is fine
   - Future: ESPN API integration

2. **Flow wallet** - Which wallet to recommend?
   - Lilico wallet
   - Blocto wallet
   - Flow Reference Wallet

3. **NFT contracts** - Use actual mainnet TopShot?
   - ✅ Yes, read from mainnet contracts
   - Create on testnet for testing

4. **Database** - PostgreSQL ready?
   - ✅ Yes, Prisma schema already created

**Ready to start coding?** Let me know and I'll help implement any specific component!
