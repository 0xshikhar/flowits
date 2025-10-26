# 🚀 Quick Start Guide - Moments Web App

## Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Flow CLI installed (for emulator)

## 1. Install Dependencies

```bash
cd web-app
pnpm install
```

## 2. Start Flow Emulator

**Terminal 1:**
```bash
cd ../contracts
flow emulator start
```

Keep this running.

## 3. Deploy Contracts

**Terminal 2:**
```bash
cd ../contracts
flow project deploy --network=emulator
```

Expected output:
```
✅ PredictionMarket -> 0xf8d6e0586b0a20c7
✅ PredictionActions -> 0xf8d6e0586b0a20c7
✅ NFTBattle -> 0xf8d6e0586b0a20c7
✅ AchievementNFT -> 0xf8d6e0586b0a20c7
```

## 4. Start Web App

**Terminal 3:**
```bash
cd ../web-app
pnpm dev
```

## 5. Open Browser

Navigate to: **http://localhost:3000**

## 🎯 Pages to Explore

1. **Home** - `/` - Landing page with hero
2. **Feed** - `/feed` - Prediction markets
3. **Profile** - `/profile` - Stats & achievements

## 🔗 Connect Wallet

1. Click "Connect Wallet" button
2. Select wallet provider (Flow Wallet, Lilico, etc.)
3. Approve connection
4. Start making predictions!

## 📝 Environment Variables

Create `.env.local` in web-app directory:

```env
NEXT_PUBLIC_FLOW_NETWORK=emulator
```

For testnet:
```env
NEXT_PUBLIC_FLOW_NETWORK=testnet
```

## 🎨 Design Features

- **Light Theme Only** - Warm cream/beige aesthetic
- **Glassmorphism** - Frosted glass effects
- **Gradient Accents** - Orange/amber highlights
- **Smooth Animations** - Slide, fade, lift effects
- **Mobile-First** - Bottom navigation bar

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -- -p 3001
```

### Emulator Not Running
```bash
# Check if emulator is running
flow emulator status

# Restart emulator
flow emulator start
```

### Contracts Not Deployed
```bash
# Redeploy contracts
cd contracts
flow project deploy --network=emulator --update
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📦 Build for Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## 🧪 Testing

```bash
# Test contracts
cd ../contracts
./test.sh

# Build frontend (validates TypeScript)
cd ../web-app
pnpm build
```

## 🎯 Key Features

### Home Page
- Hero section with CTAs
- Feature showcase
- Stats display

### Feed Page
- Swipeable prediction cards
- Real-time stats bar
- YES/NO prediction buttons
- FLOW amount input
- Transaction via Flow Actions

### Profile Page
- User stats (predictions, accuracy, winnings, streak)
- Achievement badges
- Recent activity feed
- Wallet connection prompt

## 🌐 Network Configuration

### Emulator (Default)
- Access Node: `http://localhost:8888`
- Contracts: `0xf8d6e0586b0a20c7`

### Testnet
- Access Node: `https://rest-testnet.onflow.org`
- Discovery: `https://fcl-discovery.onflow.org/testnet/authn`

### Mainnet
- Access Node: `https://rest-mainnet.onflow.org`
- Discovery: `https://fcl-discovery.onflow.org/authn`

## 💡 Tips

1. **Use Flow Dev Wallet** for emulator testing
2. **Check browser console** for FCL logs
3. **Keep emulator running** while developing
4. **Refresh page** after deploying new contracts
5. **Use Chrome DevTools** for responsive testing

## 📚 Next Steps

1. ✅ Connect wallet
2. ✅ Browse prediction markets
3. ✅ Make your first prediction
4. ✅ Check your profile stats
5. ✅ Unlock achievements

## 🆘 Need Help?

- Check `IMPLEMENTATION_NOTES.md` for details
- Read `MIGRATION_SUMMARY.md` for architecture
- See Flow docs: https://developers.flow.com
- FCL guide: https://developers.flow.com/tools/clients/fcl-js

---

**Happy Predicting! 🎯**
