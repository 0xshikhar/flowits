# Testnet Deployment Guide

## ✅ Fixed Issues

1. **Removed duplicate deployment** - Contracts were being deployed to both `emulator-account` and `test-account` on testnet
2. **Updated frontend config** - Changed contract addresses to use `0x7782fffb2efed309` (your test-account address)
3. **Added ExampleConnectors** - Added to all network configs to fix TypeScript errors

## 📋 Prerequisites

Before deploying to testnet, ensure:

1. ✅ You have a funded testnet account (`test-account`)
2. ✅ The private key file `test-account.pkey` exists in contracts directory
3. ✅ Your account has sufficient FLOW tokens for deployment (~10 FLOW)

## 🚀 Deployment Steps

### Step 1: Verify Account Balance

```bash
cd contracts
flow accounts get 0x7782fffb2efed309 --network testnet
```

You should see a balance. If not, get testnet FLOW from:
- **Flow Faucet**: https://testnet-faucet.onflow.org

### Step 2: Deploy Contracts

```bash
flow project deploy --network testnet
```

This will deploy to **test-account** (`0x7782fffb2efed309`):
- PredictionMarket
- PredictionActions  
- NFTBattle
- AchievementNFT
- ExampleConnectors

### Step 3: Verify Deployment

```bash
# Check if contracts are deployed
flow accounts get 0x7782fffb2efed309 --network testnet
```

You should see all 5 contracts listed.

## 🌐 Frontend Configuration

The frontend is already configured for testnet:

### Current `.env.local`:
```env
NEXT_PUBLIC_FLOW_NETWORK=testnet
```

### Contract Addresses (Auto-configured):
- **Account**: `0x7782fffb2efed309`
- **All Custom Contracts**: Deployed to this account
- **System Contracts**: Standard testnet addresses

## 🔧 Troubleshooting

### Error: "use of closed network connection"

This means you're trying to connect to emulator but it's not running. Use `--network testnet`:

```bash
flow project deploy --network testnet
```

### Error: "same contract cannot be deployed to multiple accounts"

Fixed! I removed the duplicate deployment configuration. Your `flow.json` now only deploys to `test-account` on testnet.

### Error: "account does not have sufficient balance"

Get testnet FLOW from faucet:
```bash
# Visit: https://testnet-faucet.onflow.org
# Enter address: 0x7782fffb2efed309
```

### Error: "cannot find private key"

Ensure `test-account.pkey` exists:
```bash
ls -la test-account.pkey
```

If missing, create it with your private key:
```bash
echo "YOUR_PRIVATE_KEY_HEX" > test-account.pkey
```

## 📱 Wallet Configuration

### Flow Wallet (https://wallet.flow.com)

**Important**: Flow wallets only support **testnet** and **mainnet**, NOT emulator.

1. Create/Import testnet account
2. Ensure you're on **Testnet** network
3. Connect to your dApp
4. Approve transactions

### Supported Wallets for Testnet:
- ✅ Flow Wallet (wallet.flow.com)
- ✅ Lilico Wallet
- ✅ Blocto Wallet
- ✅ Dapper Wallet
- ❌ Local Emulator (not supported by production wallets)

## 🎯 Network Comparison

| Feature | Emulator | Testnet | Mainnet |
|---------|----------|---------|---------|
| **Wallet Support** | Dev Wallet only | All wallets | All wallets |
| **Cost** | Free | Free (faucet) | Real FLOW |
| **Speed** | Instant | ~2-3 sec | ~2-3 sec |
| **Data Persistence** | Lost on restart | Persistent | Persistent |
| **Use Case** | Local dev | Testing | Production |

## 🔄 Migration Path

### From Emulator to Testnet:

1. ✅ Fix `flow.json` deployments (DONE)
2. ✅ Update frontend config (DONE)
3. Deploy to testnet: `flow project deploy --network testnet`
4. Update `.env.local`: `NEXT_PUBLIC_FLOW_NETWORK=testnet`
5. Restart web app: `pnpm dev`
6. Connect with real wallet

### From Testnet to Mainnet:

1. Get mainnet account with FLOW
2. Update `flow.json` with mainnet account
3. Deploy: `flow project deploy --network mainnet`
4. Update frontend: `NEXT_PUBLIC_FLOW_NETWORK=mainnet`
5. Update contract addresses in `config.ts`

## 📊 Current Configuration

### flow.json (Fixed)
```json
{
  "deployments": {
    "emulator": {
      "emulator-account": [/* contracts */]
    },
    "testnet": {
      "test-account": [
        "PredictionMarket",
        "PredictionActions",
        "NFTBattle",
        "AchievementNFT",
        "ExampleConnectors"
      ]
    }
  }
}
```

### Frontend config.ts (Updated)
```typescript
testnet: {
  PredictionMarket: "0x7782fffb2efed309",
  PredictionActions: "0x7782fffb2efed309",
  NFTBattle: "0x7782fffb2efed309",
  AchievementNFT: "0x7782fffb2efed309",
  ExampleConnectors: "0x7782fffb2efed309",
  // System contracts...
}
```

## ✅ Quick Checklist

Before deploying:
- [ ] Funded testnet account
- [ ] Private key file exists
- [ ] Network set to testnet
- [ ] No emulator running (to avoid confusion)

For deployment:
```bash
# 1. Check account
flow accounts get 0x7782fffb2efed309 --network testnet

# 2. Deploy
flow project deploy --network testnet

# 3. Update frontend env
echo "NEXT_PUBLIC_FLOW_NETWORK=testnet" > ../web-app/.env.local

# 4. Start frontend
cd ../web-app && pnpm dev
```

## 🎉 Success Indicators

After successful deployment:

1. ✅ All contracts show in account: `flow accounts get 0x7782fffb2efed309 --network testnet`
2. ✅ Frontend loads without errors
3. ✅ Wallet connects successfully
4. ✅ Can view prediction markets
5. ✅ Transactions work

## 📞 Support

If you encounter issues:

1. Check Flow CLI version: `flow version` (should be v1.19+)
2. Verify network connectivity: `ping access.devnet.nodes.onflow.org`
3. Check Flow status: https://status.onflow.org
4. Review transaction errors in wallet

## 🔗 Resources

- **Flow Testnet Faucet**: https://testnet-faucet.onflow.org
- **Flow Testnet Explorer**: https://testnet.flowdiver.io
- **Flow Wallet**: https://wallet.flow.com
- **Flow Documentation**: https://developers.flow.com

---

**Now you're ready to deploy to testnet!** 🚀
