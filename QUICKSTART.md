# FlowBattle - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Deploy Contracts Locally

```bash
# Navigate to contracts folder
cd contracts

# Start Flow emulator
flow emulator start

# In a new terminal, deploy contracts
flow project deploy --network=emulator
```

### Step 2: Start Web App

```bash
# Navigate to web-app folder
cd web-app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Step 3: Open App

Visit `http://localhost:3000/feed` and connect your wallet!

---

## 📋 What's Been Built

### ✅ Cadence Contracts (Flow Actions Integrated)

1. **PredictionMarket.cdc** - Core prediction market logic
   - Create markets with questions
   - Place predictions (YES/NO)
   - Claim winnings after resolution
   - Creator fees (0-20%)

2. **PredictionActions.cdc** - Flow Actions Integration ⭐
   - Implements `DeFiActions.Sink`
   - Composable prediction placement
   - Discoverable via metadata
   - **KEY FOR WINNING FLOW FORTE TRACK**

3. **NFTBattle.cdc** - NFT battle system
   - Stake NFTs in battles
   - Community betting
   - Winner takes all

4. **AchievementNFT.cdc** - Soulbound achievements
   - Non-transferable NFTs
   - Unlocked via milestones
   - Can be auto-minted via scheduled transactions

### ✅ Frontend (Gamified Light Theme)

1. **Wallet Connection** - FCL integration
   - Connect Flow wallets (Lilico, Blocto)
   - Display FLOW balance
   - Real-time connection status

2. **Swipeable Feed** - Main prediction interface
   - Card-based UI
   - Live odds display
   - One-click predictions
   - Progress indicators

3. **Create Market** - Post creation
   - Upload media
   - Set parameters
   - Estimated earnings calculator

4. **Gamified Design**
   - Light theme with purple/pink gradients
   - Betting platform aesthetics
   - Smooth animations
   - Mobile-first responsive

---

## 🎯 Flow Actions Integration (Forte Track)

### How It Works

```cadence
// Traditional approach
PredictionMarket.placePrediction(marketId, user, outcome, payment)

// Flow Actions approach (composable!)
let predictionSink = PredictionActions.createPredictionAction(
  marketId: 1,
  outcome: "yes",
  userAddress: signer.address
)
predictionSink.depositCapacity(from: vaultRef)
```

### Why This Wins

1. **Composability** - Can chain with other DeFi protocols
2. **Discoverability** - Metadata makes it findable by AI agents
3. **Standardization** - Follows FLIP-338 spec
4. **Automation** - Enables complex workflows

### Demo Points

- Show prediction via Action in transaction
- Explain composability benefits
- Highlight metadata/discovery
- Compare with traditional approach

---

## 🏆 Dapper Integration Strategy

### NBA Top Shot / NFL All Day

```typescript
// Read user's NFTs
const moments = await getNBATopShotMoments(userAddress)

// Display in UI
// Attach to prediction posts
// Use in NFT battles
```

### Contract Addresses (Mainnet)

- NBA Top Shot: `0x0b2a3299cc857e29`
- NFL All Day: `0xe4cf4bdc1751c65d`

### Features

1. **NFT Display** - Show user's moments
2. **Battle Stakes** - Use NFTs as collateral
3. **Post Attachments** - Add NFTs to predictions
4. **Real Utility** - Not just display, actual gameplay

---

## 📝 Next Steps

### Immediate (Today)

- [ ] Test contracts on emulator
- [ ] Deploy to Flow testnet
- [ ] Update contract addresses in web app
- [ ] Test wallet connection with Lilico

### This Week

- [ ] Integrate NBA Top Shot NFT reading
- [ ] Add battle creation UI
- [ ] Implement admin resolution interface
- [ ] Create leaderboards
- [ ] Add scheduled transactions for payouts

### Before Submission

- [ ] Deploy to testnet/mainnet
- [ ] Record demo video (3-5 min)
- [ ] Write FORTE_INTEGRATION.md
- [ ] Test all features end-to-end
- [ ] Polish UI/UX

---

## 🎬 Demo Video Script

### Opening (30 sec)
"FlowBattle - Polymarket meets Tinder for Sports NFTs"
- Show swipeable feed
- Place prediction with one swipe

### Flow Actions (60 sec)
- Explain composability
- Show code: PredictionSink implements DeFiActions.Sink
- Demo prediction via Action
- Highlight metadata/discovery

### Dapper Integration (60 sec)
- Show NBA Top Shot NFTs in wallet
- Attach NFT to prediction post
- Create NFT battle
- Community bets on outcome

### Automation (30 sec)
- Scheduled creator payouts
- Achievement auto-minting
- Market settlement notifications

### Closing (30 sec)
- Recap: Flow Actions + Dapper NFTs + Consumer UX
- Call to action: Try it live!

---

## 💡 Tips for Winning

### Flow Forte Track ($6K)

✅ **Must Have:**
- DeFiActions.Sink implementation (done!)
- Scheduled transactions (add this week)
- Clear documentation of benefits

✅ **Bonus Points:**
- Show composability with other protocols
- AI agent discoverability
- Complex workflow examples

### Dapper Tracks ($14K total)

✅ **NFT Utility ($5K):**
- NFTs as battle stakes
- Real gameplay, not just display

✅ **Data & Insights ($4K):**
- Real-time odds
- Leaderboards
- User analytics

✅ **Game Integration ($5K):**
- Battle system (FastBreak-inspired)
- Performance-based outcomes
- Community engagement

---

## 🐛 Troubleshooting

### Contracts won't deploy
```bash
flow dependencies install
flow project deploy --network=emulator --update
```

### Wallet won't connect
- Check NEXT_PUBLIC_FLOW_NETWORK in .env
- Ensure using testnet/mainnet wallet
- Try Lilico or Blocto wallet

### Transaction fails
- Check FLOW balance
- Verify contract addresses
- Check market exists and is open

---

## 📚 Resources

- **Flow Docs**: https://developers.flow.com
- **Cadence Lang**: https://cadence-lang.org
- **Flow Actions**: https://github.com/onflow/flips/blob/main/application/20231222-defi-actions.md
- **FCL Docs**: https://developers.flow.com/tools/clients/fcl-js
- **Find Labs API**: https://find.xyz/api

---

## 🎉 You're Ready!

The foundation is built. Now:
1. Test locally
2. Deploy to testnet
3. Add remaining features
4. Polish & record demo
5. Submit & win! 🏆

**Good luck! 🚀**
