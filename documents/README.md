# FlowBattle aka Moments ⚔️

**Polymarket meets Tinder for Sports NFTs on Flow**

we will be using Moments name everywhere

Swipeable prediction markets with Flow Actions integration and Dapper NFT utility.

---

## 🎯 What is FlowBattle?

 is a gamified prediction market platform built on Flow blockchain that combines:

- **Swipeable Feed** - TikTok-style interface for predictions
- **Flow Actions** - Composable DeFi primitives (FLIP-338)
- **NFT Battles** - Stake NBA Top Shot/NFL All Day NFTs
- **Real-time Odds** - Dynamic market-making
- **Soulbound Achievements** - Non-transferable milestone NFTs

---

## 🏆 Prize Tracks

### Flow Forte Actions ($6K)
✅ **PredictionActions.cdc** implements `DeFiActions.Sink`
✅ Composable prediction placement
✅ Discoverable metadata
⏳ Scheduled transactions (in progress)

### Dapper Integration ($14K total)
✅ **NFT Utility** ($5K) - Battle system with real stakes
✅ **Data & Insights** ($4K) - Real-time odds & analytics
✅ **Game Integration** ($5K) - FastBreak-inspired battles

---

## 🚀 Quick Start

### Prerequisites

```bash
# Install Flow CLI
brew install flow-cli

# Install Node.js dependencies
cd web-app && pnpm install
```

### 1. Start Flow Emulator

```bash
cd contracts
flow emulator start
```

### 2. Deploy Contracts (in new terminal)

```bash
cd contracts
./deploy.sh emulator
```

### 3. Start Web App

```bash
cd web-app
pnpm dev
```

Visit **http://localhost:3000/feed**

---

## 📁 Project Structure

```
FlowBattle/
├── contracts/                  # Cadence contracts
│   ├── cadence/
│   │   ├── contracts/
│   │   │   ├── PredictionMarket.cdc      ✅ Core prediction logic
│   │   │   ├── PredictionActions.cdc     ⭐ Flow Actions integration
│   │   │   ├── NFTBattle.cdc             ✅ NFT battle system
│   │   │   └── AchievementNFT.cdc        ✅ Soulbound NFTs
│   │   ├── transactions/                 ✅ 5 transactions
│   │   ├── scripts/                      ✅ Query scripts
│   │   └── tests/                        ✅ Comprehensive tests
│   ├── flow.json                         ✅ Flow configuration
│   ├── deploy.sh                         ✅ Deployment script
│   └── test.sh                           ✅ Test runner
│
├── web-app/                    # Next.js frontend
│   ├── src/
│   │   ├── lib/flow/
│   │   │   ├── config.ts                 ✅ FCL configuration
│   │   │   ├── transactions.ts           ✅ Transaction functions
│   │   │   └── scripts.ts                ✅ Query functions
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx         ✅ Wallet integration
│   │   │   └── PredictionCard.tsx        ✅ Interactive cards
│   │   └── app/
│   │       ├── feed/page.tsx             ✅ Swipeable feed
│   │       └── create/page.tsx           ✅ Market creation
│   └── build.sh                          ✅ Build script
│
├── QUICKSTART.md               ✅ Getting started guide
├── IMPLEMENTATION_SUMMARY.md   ✅ Technical details
└── test-all.sh                 ✅ Complete test suite
```

---

## 🧪 Testing

### Run All Tests

```bash
./test-all.sh
```

### Test Contracts Only

```bash
cd contracts
./test.sh
```

### Build Frontend

```bash
cd web-app
./build.sh
```

---

## 📝 Core Contracts

### 1. PredictionMarket.cdc

Core prediction market logic:

```cadence
// Create market
PredictionMarket.createMarket(
  creator: Address,
  question: "Will LeBron score 40+ points?",
  closeTime: futureTimestamp,
  minStake: 1.0,
  creatorFeePercent: 5.0
)

// Place prediction
PredictionMarket.placePrediction(
  marketId: 0,
  user: userAddress,
  outcome: "yes",
  payment: <-flowTokens
)

// Claim winnings
PredictionMarket.claimWinnings(
  marketId: 0,
  user: userAddress,
  receiver: &vaultRef
)
```

### 2. PredictionActions.cdc ⭐

**Flow Actions integration** - the key differentiator:

```cadence
// Create composable prediction action
let predictionSink = PredictionActions.createPredictionAction(
  marketId: 0,
  outcome: "yes",
  userAddress: signer.address
)

// Deposit FLOW (automatically places prediction)
predictionSink.depositCapacity(from: vaultRef)

// Can be composed with other DeFi actions!
swapAction.pipe(predictionSink)
```

**Why this wins:**
- ✅ Implements `DeFiActions.Sink` interface
- ✅ Composable with other protocols
- ✅ Discoverable via metadata
- ✅ Follows FLIP-338 specification

### 3. NFTBattle.cdc

NFT battle system:

```cadence
// Create battle
NFTBattle.createBattle(
  creator: Address,
  condition: "Higher serial number wins",
  closeTime: futureTimestamp
)

// Accept challenge
NFTBattle.acceptBattle(battleId: 0, opponent: Address)

// Community bets on outcome
NFTBattle.placeBet(
  battleId: 0,
  user: Address,
  side: "creator",
  payment: <-flowTokens
)
```

### 4. AchievementNFT.cdc

Soulbound achievement NFTs:

```cadence
// Mint achievement (admin only)
minter.mintAchievement(
  recipient: &userCollection,
  achievementType: "first_prediction",
  name: "First Blood",
  description: "Placed your first prediction",
  tier: "bronze"
)

// Non-transferable!
collection.withdraw() // panics
```

---

## 🎨 Frontend Features

### Gamified Light Theme

- **Purple/Pink gradients** - Betting platform aesthetics
- **Smooth animations** - Card transitions, button states
- **Real-time updates** - Live odds, balance display
- **Mobile-first** - Responsive design

### Key Components

#### WalletConnect.tsx
```typescript
// FCL wallet integration
import { fcl } from "@/lib/flow/config"

// Connect wallet
await fcl.authenticate()

// Get balance
const balance = await getFlowBalance(address)
```

#### PredictionCard.tsx
```typescript
// Interactive prediction card
<PredictionCard
  marketId={1}
  question="Will LeBron score 40+ points?"
  totalYesVolume="125.5"
  totalNoVolume="89.3"
  closeTime={timestamp}
/>
```

### Pages

- **/feed** - Swipeable prediction feed with navigation
- **/create** - Market creation interface
- **/profile** - User stats & achievements (coming soon)

---

## 🔧 Configuration

### Environment Variables

Create `web-app/.env.local`:

```bash
NEXT_PUBLIC_FLOW_NETWORK=testnet  # or mainnet, emulator
DATABASE_URL="postgresql://..."   # Optional
```

### Contract Addresses

Update in `web-app/src/lib/flow/config.ts`:

```typescript
const CONTRACTS = {
  testnet: {
    PredictionMarket: "0xYOUR_ADDRESS",
    PredictionActions: "0xYOUR_ADDRESS",
    NFTBattle: "0xYOUR_ADDRESS",
    AchievementNFT: "0xYOUR_ADDRESS",
  }
}
```

---

## 📊 Flow Actions Architecture

### Traditional Approach
```cadence
transaction {
  prepare(signer: auth(Storage) &Account) {
    let vault <- signer.storage.borrow<&FlowToken.Vault>(...)
    let payment <- vault.withdraw(amount: 10.0)
    PredictionMarket.placePrediction(...)
  }
}
```

### Flow Actions Approach ⭐
```cadence
transaction {
  prepare(signer: auth(Storage) &Account) {
    // Create composable action
    let sink = PredictionActions.createPredictionAction(...)
    
    // Deposit funds (action executes automatically)
    let vault = signer.storage.borrow<&FlowToken.Vault>(...)
    sink.depositCapacity(from: vault)
    
    // Can be chained with other actions!
  }
}
```

### Benefits

1. **Composability** - Chain with swaps, lending, etc.
2. **Discoverability** - AI agents can find via metadata
3. **Standardization** - Follows FLIP-338 spec
4. **Innovation** - First prediction market as DeFi Action

---

## 🎬 Demo Script

### Opening (30s)
"FlowBattle - Swipe. Predict. Win."
- Show swipeable feed
- Place prediction with one tap

### Flow Actions (90s) ⭐
- Show code: PredictionSink implements DeFiActions.Sink
- Explain composability
- Demo prediction via Action
- Compare with traditional approach

### Dapper Integration (60s)
- Show NBA Top Shot NFTs
- Create NFT battle
- Community bets on outcome

### Closing (30s)
- Recap: Flow Actions + Dapper NFTs + Consumer UX
- Live demo link

---

## 🐛 Known Issues

### TypeScript Warnings

FCL v1.12 type definitions cause warnings in `transactions.ts`. These are **safe to ignore** and work correctly at runtime. Suppressed with:

```typescript
const getAuthz = () => fcl.currentUser.authorization as any
```

### Missing Features (In Progress)

- [ ] Admin resolution interface
- [ ] Scheduled transactions for automated payouts
- [ ] NBA Top Shot UI integration
- [ ] Leaderboards
- [ ] Achievement auto-minting

---

## 📚 Resources

- **Flow Docs**: https://developers.flow.com
- **Cadence**: https://cadence-lang.org
- **Flow Actions (FLIP-338)**: https://github.com/onflow/flips/blob/main/application/20231222-defi-actions.md
- **FCL**: https://developers.flow.com/tools/clients/fcl-js
- **NBA Top Shot**: https://nbatopshot.com

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Test contracts: `cd contracts && ./test.sh`
4. Test frontend: `cd web-app && ./build.sh`
5. Submit PR

---

## 📄 License

MIT

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- Core prediction markets
- Flow Actions integration
- NFT battle system
- Gamified UI

### Phase 2 (Next Week)
- [ ] Deploy to testnet
- [ ] NBA Top Shot integration
- [ ] Admin dashboard
- [ ] Leaderboards

### Phase 3 (Future)
- [ ] Scheduled automated payouts
- [ ] Achievement auto-minting
- [ ] Mobile app
- [ ] Mainnet launch

---

## 💰 Prize Potential

- **Flow Forte Actions**: $6,000
- **Dapper NFT Utility**: $5,000
- **Dapper Data & Insights**: $4,000
- **Dapper Game Integration**: $5,000

**Total**: $20,000

---

## 🚀 Let's Ship This!

```bash
# Test everything
./test-all.sh

# Start development
cd contracts && flow emulator start
cd contracts && ./deploy.sh
cd web-app && pnpm dev
```

**Built with ❤️ on Flow**
