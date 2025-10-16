# Moments - Manual Testing Guide

**Status**: Contracts deployed successfully ✅  
**Network**: Emulator (ready for testnet)

---

## 🚀 Quick Start

### 1. Start Emulator

```bash
cd contracts
flow emulator start
```

Keep this terminal open.

### 2. Deploy Contracts (New Terminal)

```bash
cd contracts
flow project deploy --network=emulator
```

Expected output:
```
🎉 All contracts deployed successfully

PredictionMarket -> 0xf8d6e0586b0a20c7 ✅
PredictionActions -> 0xf8d6e0586b0a20c7 ✅
NFTBattle -> 0xf8d6e0586b0a20c7 ✅
AchievementNFT -> 0xf8d6e0586b0a20c7 ✅
```

---

## 📝 Test Scenarios

### Scenario 1: Create & Query Market

#### Step 1: Create Market

```bash
cd contracts

# Calculate future timestamp (1 hour from now)
FUTURE_TIME=$(python3 -c "import time; print(time.time() + 3600)")

# Create market
flow transactions send \
  cadence/transactions/create_market.cdc \
  "Will LeBron score 40+ points tonight?" \
  $FUTURE_TIME \
  1.0 \
  5.0 \
  --network=emulator \
  --signer=emulator-account
```

**Expected**: Transaction succeeds, market ID 0 created

#### Step 2: Query Market

```bash
flow scripts execute \
  cadence/scripts/get_market_info.cdc \
  0 \
  --network=emulator
```

**Expected Output**:
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
  "totalYesVolume": 0.0,
  "totalNoVolume": 0.0
}
```

---

### Scenario 2: Place Prediction (Traditional)

```bash
# Place YES prediction with 5 FLOW
flow transactions send \
  cadence/transactions/place_prediction.cdc \
  0 \
  "yes" \
  5.0 \
  --network=emulator \
  --signer=emulator-account
```

**Expected**: Transaction succeeds

#### Verify Prediction

```bash
flow scripts execute \
  cadence/scripts/get_user_prediction.cdc \
  0 \
  "0xf8d6e0586b0a20c7" \
  --network=emulator
```

**Expected Output**:
```json
{
  "outcome": "yes",
  "amount": 5.0,
  "claimed": false
}
```

#### Verify Market Updated

```bash
flow scripts execute \
  cadence/scripts/get_market_info.cdc \
  0 \
  --network=emulator
```

**Expected**: `totalYesVolume` should be 5.0

---

### Scenario 3: Place Prediction via Flow Actions ⭐

```bash
# Place prediction using Flow Actions
flow transactions send \
  cadence/transactions/place_prediction_via_action.cdc \
  0 \
  "no" \
  3.0 \
  --network=emulator \
  --signer=emulator-account
```

**Expected**: Transaction succeeds

#### Verify Both Predictions

```bash
# Check market info
flow scripts execute \
  cadence/scripts/get_market_info.cdc \
  0 \
  --network=emulator
```

**Expected**:
- `totalYesVolume`: 5.0
- `totalNoVolume`: 3.0
- Total pool: 8.0 FLOW

---

### Scenario 4: Resolve Market & Claim Winnings

#### Step 1: Wait for Market to Close

```bash
# For testing, create a market that closes in 5 seconds
FUTURE_TIME=$(python3 -c "import time; print(time.time() + 5)")

flow transactions send \
  cadence/transactions/create_market.cdc \
  "Quick test market" \
  $FUTURE_TIME \
  1.0 \
  5.0 \
  --network=emulator \
  --signer=emulator-account

# Place predictions
flow transactions send \
  cadence/transactions/place_prediction.cdc \
  1 \
  "yes" \
  10.0 \
  --network=emulator \
  --signer=emulator-account

# Wait 6 seconds
sleep 6
```

#### Step 2: Resolve Market

```bash
flow transactions send \
  cadence/transactions/resolve_market.cdc \
  1 \
  "yes" \
  --network=emulator \
  --signer=emulator-account
```

**Expected**: Transaction succeeds, market resolved

#### Step 3: Claim Winnings

```bash
flow transactions send \
  cadence/transactions/claim_winnings.cdc \
  1 \
  --network=emulator \
  --signer=emulator-account
```

**Expected**: Transaction succeeds, winnings claimed

---

## 🎮 Frontend Testing

### Start Frontend

```bash
cd web-app
pnpm dev
```

Visit: **http://localhost:3000**

### Test Checklist

#### 1. Feed Page (`/feed`)
- [ ] Page loads without errors
- [ ] Cards display correctly
- [ ] Navigation buttons work
- [ ] Stats bar shows data
- [ ] Bottom nav works

#### 2. Create Page (`/create`)
- [ ] Form renders
- [ ] All inputs work
- [ ] Date picker functions
- [ ] Fee calculator updates
- [ ] Submit button enabled

#### 3. Profile Page (`/profile`)
- [ ] Stats display
- [ ] Achievements show
- [ ] Recent activity section renders

#### 4. Wallet Connection
- [ ] "Connect Wallet" button visible
- [ ] Click opens wallet selector
- [ ] (Note: Requires testnet deployment for real wallet testing)

---

## 🔍 Verification Commands

### Check Contract Deployment

```bash
flow accounts get 0xf8d6e0586b0a20c7 --network=emulator
```

**Expected**: Shows deployed contracts

### Check Account Balance

```bash
flow accounts get 0xf8d6e0586b0a20c7 --network=emulator | grep Balance
```

**Expected**: Shows FLOW balance (should be ~1000 FLOW on emulator)

### List All Markets

```bash
# Check nextMarketId
flow scripts execute \
  -c "import PredictionMarket from 0xf8d6e0586b0a20c7; access(all) fun main(): UInt64 { return PredictionMarket.nextMarketId }" \
  --network=emulator
```

**Expected**: Returns number of markets created

---

## 🐛 Troubleshooting

### Issue: Transaction Fails

**Check**:
1. Emulator is running
2. Contracts are deployed
3. Arguments are correct type
4. Account has sufficient FLOW

**Debug**:
```bash
# Check emulator logs in the terminal where it's running
# Look for error messages
```

### Issue: Script Returns Nil

**Possible Causes**:
- Market doesn't exist (wrong ID)
- User hasn't placed prediction
- Contract not deployed

**Verify**:
```bash
# Check if market exists
flow scripts execute cadence/scripts/get_market_info.cdc 0 --network=emulator
```

### Issue: "Market Not Found"

**Solution**:
- Use correct market ID (starts at 0)
- Verify market was created successfully
- Check `nextMarketId` to see how many markets exist

---

## ✅ Success Criteria

### Contracts ✅
- [x] All 4 contracts deploy without errors
- [x] Transactions execute successfully
- [x] Scripts return expected data
- [x] Events emit correctly

### Frontend ✅
- [x] Build succeeds
- [x] All pages render
- [x] No console errors
- [x] Mobile responsive

### Integration ⏳
- [ ] End-to-end flow (create → predict → resolve → claim)
- [ ] Multiple users testing
- [ ] Testnet deployment
- [ ] Real wallet connection

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Scenario 1: Create & Query Market
- Create market: [ ] Pass [ ] Fail
- Query market: [ ] Pass [ ] Fail

Scenario 2: Place Prediction
- Traditional: [ ] Pass [ ] Fail
- Via Actions: [ ] Pass [ ] Fail

Scenario 3: Resolve & Claim
- Resolve: [ ] Pass [ ] Fail
- Claim: [ ] Pass [ ] Fail

Frontend:
- Feed page: [ ] Pass [ ] Fail
- Create page: [ ] Pass [ ] Fail
- Profile page: [ ] Pass [ ] Fail

Notes:
_________________________________
_________________________________
```

---

## 🚀 Next: Testnet Deployment

Once emulator testing is complete:

1. Create testnet account
2. Fund with faucet
3. Update `flow.json`
4. Deploy to testnet
5. Test with real wallet
6. Record demo video

See `TESTING_GUIDE.md` for detailed testnet instructions.

---

**Happy Testing! 🎉**
