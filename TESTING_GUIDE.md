# FlowBattle - Testing & Build Guide

## 🧪 Complete Test Suite

### Quick Test (All Components)

```bash
./test-all.sh
```

This runs:
1. ✅ Cadence contract tests
2. ✅ Frontend build verification
3. ✅ TypeScript type checking

---

## 📝 Contract Testing

### Run Contract Tests

```bash
cd contracts
./test.sh
```

### Manual Testing with Emulator

#### 1. Start Emulator

```bash
cd contracts
flow emulator start
```

Keep this terminal open.

#### 2. Deploy Contracts (new terminal)

```bash
cd contracts
./deploy.sh emulator
```

Expected output:
```
✅ Deployment successful!

Contract addresses:
  PredictionMarket: 0xf8d6e0586b0a20c7
  PredictionActions: 0xf8d6e0586b0a20c7
  NFTBattle: 0xf8d6e0586b0a20c7
  AchievementNFT: 0xf8d6e0586b0a20c7
```

#### 3. Test Transactions

**Create a market:**
```bash
flow transactions send cadence/transactions/create_market.cdc \
  "Will LeBron score 40+ points tonight?" \
  $(python3 -c "import time; print(time.time() + 14400)") \
  1.0 \
  5.0 \
  --network=emulator \
  --signer=emulator-account
```

**Place prediction:**
```bash
flow transactions send cadence/transactions/place_prediction.cdc \
  0 \
  "yes" \
  5.0 \
  --network=emulator \
  --signer=emulator-account
```

**Place prediction via Flow Actions:**
```bash
flow transactions send cadence/transactions/place_prediction_via_action.cdc \
  0 \
  "yes" \
  3.0 \
  --network=emulator \
  --signer=emulator-account
```

**Get market info:**
```bash
flow scripts execute cadence/scripts/get_market_info.cdc 0 --network=emulator
```

Expected output:
```json
{
  "marketId": 0,
  "creator": "0xf8d6e0586b0a20c7",
  "question": "Will LeBron score 40+ points tonight?",
  "closeTime": 1234567890.0,
  "minStake": 1.0,
  "creatorFeePercent": 5.0,
  "isResolved": false,
  "winningOutcome": null,
  "totalYesVolume": 8.0,
  "totalNoVolume": 0.0
}
```

**Resolve market (after close time):**
```bash
flow transactions send cadence/transactions/resolve_market.cdc \
  0 \
  "yes" \
  --network=emulator \
  --signer=emulator-account
```

**Claim winnings:**
```bash
flow transactions send cadence/transactions/claim_winnings.cdc \
  0 \
  --network=emulator \
  --signer=emulator-account
```

---

## 🎨 Frontend Testing

### Build Test

```bash
cd web-app
./build.sh
```

Expected output:
```
✅ Build successful!

To start production server:
   pnpm start

To start development server:
   pnpm dev
```

### Development Server

```bash
cd web-app
pnpm dev
```

Visit: **http://localhost:3000**

### Test Checklist

#### 1. Wallet Connection
- [ ] Click "Connect Wallet"
- [ ] Select Lilico/Blocto wallet
- [ ] Verify address displays
- [ ] Verify FLOW balance shows

#### 2. Feed Page (`/feed`)
- [ ] Cards display correctly
- [ ] Navigation buttons work
- [ ] Progress indicators update
- [ ] Stats bar shows data
- [ ] Bottom nav works

#### 3. Prediction Interaction
- [ ] Click YES/NO button
- [ ] Amount input appears
- [ ] Enter amount
- [ ] Click "Place Prediction"
- [ ] Wallet popup appears
- [ ] Transaction succeeds
- [ ] Success toast shows

#### 4. Create Page (`/create`)
- [ ] Question input works
- [ ] Media upload works
- [ ] Date picker works
- [ ] Min stake input works
- [ ] Fee calculator updates
- [ ] Submit creates market
- [ ] Redirects to feed

#### 5. Profile Page (`/profile`)
- [ ] Stats display
- [ ] Achievements show
- [ ] Recent activity loads

---

## 🔍 Debugging

### Contract Issues

**Error: "Contract not found"**
```bash
cd contracts
flow dependencies install
flow project deploy --network=emulator --update
```

**Error: "Insufficient FLOW"**
```bash
# Check balance
flow accounts get 0xf8d6e0586b0a20c7 --network=emulator

# Emulator accounts have 1000 FLOW by default
```

**Error: "Market not found"**
```bash
# Verify market exists
flow scripts execute cadence/scripts/get_market_info.cdc 0 --network=emulator

# Check nextMarketId
flow scripts execute -c "import PredictionMarket from 0xf8d6e0586b0a20c7; access(all) fun main(): UInt64 { return PredictionMarket.nextMarketId }" --network=emulator
```

### Frontend Issues

**Error: "Cannot connect to wallet"**
- Check `NEXT_PUBLIC_FLOW_NETWORK` in `.env.local`
- Ensure using testnet/mainnet wallet (not emulator)
- Try different wallet (Lilico vs Blocto)

**Error: "Transaction failed"**
- Check contract addresses in `src/lib/flow/config.ts`
- Verify wallet has FLOW tokens
- Check browser console for details

**TypeScript errors**
- FCL type warnings are safe to ignore
- Run `pnpm tsc --noEmit` to check
- Build will succeed despite warnings

---

## 📊 Test Coverage

### Contracts ✅

- [x] Create market
- [x] Place prediction (traditional)
- [x] Place prediction (Flow Actions)
- [x] Resolve market
- [x] Claim winnings
- [x] Creator fee collection
- [x] NFT battle creation
- [x] Achievement minting

### Frontend ✅

- [x] Wallet connection
- [x] Balance display
- [x] Market display
- [x] Prediction placement
- [x] Market creation
- [x] Profile stats
- [x] Responsive design

### Integration 🔄

- [ ] End-to-end flow (create → predict → resolve → claim)
- [ ] NBA Top Shot NFT reading
- [ ] Battle system
- [ ] Achievement unlocking

---

## 🚀 Deployment Testing

### Testnet Deployment

#### 1. Create Testnet Account

```bash
flow keys generate
```

Save the private key securely!

#### 2. Fund Account

Visit: https://testnet-faucet.onflow.org/
- Enter your address
- Request testnet FLOW

#### 3. Update flow.json

```json
{
  "accounts": {
    "testnet-deployer": {
      "address": "YOUR_TESTNET_ADDRESS",
      "key": {
        "type": "hex",
        "index": 0,
        "signatureAlgorithm": "ECDSA_P256",
        "hashAlgorithm": "SHA3_256",
        "privateKey": "YOUR_PRIVATE_KEY"
      }
    }
  },
  "deployments": {
    "testnet": {
      "testnet-deployer": [
        "PredictionMarket",
        "PredictionActions",
        "NFTBattle",
        "AchievementNFT"
      ]
    }
  }
}
```

#### 4. Deploy

```bash
cd contracts
./deploy.sh testnet
```

#### 5. Update Frontend

In `web-app/src/lib/flow/config.ts`:

```typescript
testnet: {
  PredictionMarket: "0xYOUR_ADDRESS",
  PredictionActions: "0xYOUR_ADDRESS",
  NFTBattle: "0xYOUR_ADDRESS",
  AchievementNFT: "0xYOUR_ADDRESS",
}
```

#### 6. Test on Testnet

```bash
cd web-app
NEXT_PUBLIC_FLOW_NETWORK=testnet pnpm dev
```

Connect with Lilico/Blocto wallet and test!

---

## 📈 Performance Testing

### Load Testing

```bash
# Create 10 markets
for i in {1..10}; do
  flow transactions send cadence/transactions/create_market.cdc \
    "Test market $i" \
    $(python3 -c "import time; print(time.time() + 3600)") \
    1.0 \
    5.0 \
    --network=emulator \
    --signer=emulator-account
done

# Place 100 predictions
for i in {1..100}; do
  flow transactions send cadence/transactions/place_prediction.cdc \
    $(($i % 10)) \
    "yes" \
    1.0 \
    --network=emulator \
    --signer=emulator-account
done
```

### Frontend Performance

```bash
cd web-app
pnpm build
pnpm start

# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

---

## ✅ Pre-Submission Checklist

### Contracts
- [ ] All tests pass (`./contracts/test.sh`)
- [ ] Deployed to testnet
- [ ] Contract addresses documented
- [ ] Flow Actions integration verified
- [ ] Events emitting correctly

### Frontend
- [ ] Build succeeds (`./web-app/build.sh`)
- [ ] Wallet connection works
- [ ] All pages render
- [ ] Transactions execute
- [ ] Mobile responsive
- [ ] No console errors

### Documentation
- [ ] README.md complete
- [ ] QUICKSTART.md clear
- [ ] IMPLEMENTATION_SUMMARY.md detailed
- [ ] Code comments added
- [ ] Demo video recorded

### Demo
- [ ] 3-5 minute video
- [ ] Shows Flow Actions
- [ ] Shows Dapper integration
- [ ] Shows consumer UX
- [ ] Technical + visual appeal

---

## 🎯 Success Metrics

### Flow Forte Track
- ✅ DeFiActions.Sink implemented
- ✅ Composable architecture
- ✅ Clear documentation
- ⏳ Scheduled transactions (bonus)

### Dapper Tracks
- ✅ NFT battle system
- ✅ Real-time odds
- ⏳ NBA Top Shot UI (in progress)
- ✅ Game mechanics

---

## 🆘 Support

### Issues?

1. Check this guide
2. Review error messages
3. Check Flow Discord: https://discord.gg/flow
4. Review Flow docs: https://developers.flow.com

### Common Solutions

**"flow: command not found"**
```bash
brew install flow-cli
```

**"pnpm: command not found"**
```bash
npm install -g pnpm
```

**"Cannot find module"**
```bash
cd web-app
rm -rf node_modules .next
pnpm install
```

---

## 🎉 Ready to Ship!

```bash
# Final check
./test-all.sh

# If all green, you're ready! 🚀
```

**Good luck! 🏆**
