# FlowBattle Contracts Deployment Guide

## Prerequisites

1. Install Flow CLI:
```bash
brew install flow-cli
```

2. Verify installation:
```bash
flow version
```

## Local Development (Emulator)

### 1. Start Flow Emulator
```bash
cd contracts
flow emulator start
```

### 2. Deploy Contracts (in new terminal)
```bash
flow project deploy --network=emulator
```

### 3. Test Contracts
```bash
# Create a test market
flow transactions send cadence/transactions/create_market.cdc \
  "Will LeBron score 40+ points?" \
  $(date -v+4H +%s).0 \
  1.0 \
  5.0 \
  --network=emulator

# Place a prediction
flow transactions send cadence/transactions/place_prediction.cdc \
  0 \
  "yes" \
  5.0 \
  --network=emulator

# Get market info
flow scripts execute cadence/scripts/get_market_info.cdc 0 --network=emulator
```

## Testnet Deployment

### 1. Create Testnet Account
```bash
flow keys generate
# Save the private key securely!
```

### 2. Fund Account
- Go to https://testnet-faucet.onflow.org/
- Enter your address
- Request testnet FLOW tokens

### 3. Update flow.json
Add your testnet account:
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
  }
}
```

### 4. Deploy to Testnet
```bash
flow project deploy --network=testnet --update
```

### 5. Update Web App
Update contract addresses in `web-app/src/lib/flow/config.ts`:
```typescript
testnet: {
  PredictionMarket: "0xYOUR_ADDRESS",
  PredictionActions: "0xYOUR_ADDRESS",
  NFTBattle: "0xYOUR_ADDRESS",
  AchievementNFT: "0xYOUR_ADDRESS",
}
```

## Contract Addresses

### Emulator
- All contracts: `0xf8d6e0586b0a20c7`

### Testnet
- PredictionMarket: `TBD`
- PredictionActions: `TBD`
- NFTBattle: `TBD`
- AchievementNFT: `TBD`

### Mainnet
- Coming soon after testing

## Flow Actions Integration

### Key Features

1. **PredictionActions.PredictionSink** implements `DeFiActions.Sink`
   - Composable with other Flow protocols
   - Discoverable via metadata
   - Can be chained in complex workflows

2. **Usage Example**:
```cadence
// Create prediction action
let predictionSink = PredictionActions.createPredictionAction(
  marketId: 1,
  outcome: "yes",
  userAddress: signer.address
)

// Deposit FLOW (places prediction)
predictionSink.depositCapacity(from: vaultRef)
```

3. **Composability**:
```cadence
// Can be composed with other DeFi actions
let swapAction = SwapConnectors.createSwapAction(...)
let predictionAction = PredictionActions.createPredictionAction(...)

// Chain actions together
swapAction.pipe(predictionAction)
```

## Testing Checklist

- [ ] Deploy all contracts successfully
- [ ] Create a test market
- [ ] Place predictions (YES and NO)
- [ ] Resolve market (admin)
- [ ] Claim winnings
- [ ] Test Flow Actions integration
- [ ] Verify events are emitted
- [ ] Check creator fee collection

## Troubleshooting

### "Contract not found" error
- Ensure dependencies are installed: `flow dependencies install`
- Check flow.json has correct import addresses

### "Insufficient FLOW" error
- Fund your account from faucet
- Check minimum stake requirements

### "Market not found" error
- Verify marketId exists
- Check if using correct network

## Next Steps

1. Deploy to testnet
2. Test with real wallets (Lilico, Blocto)
3. Integrate with web app
4. Add scheduled transactions for automated payouts
5. Deploy to mainnet

## Support

- Flow Discord: https://discord.gg/flow
- Flow Docs: https://developers.flow.com
- Cadence Docs: https://cadence-lang.org
