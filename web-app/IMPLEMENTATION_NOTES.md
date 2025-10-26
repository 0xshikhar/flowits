# Moments Web App - Implementation Notes

## Overview
Modern, futuristic sports prediction market platform built on Flow blockchain with a world-class light theme design.

## Key Changes Made

### 1. **Removed Dependencies**
- ❌ Removed `@privy-io/react-auth` and `@privy-io/server-auth`
- ❌ Removed `wagmi`, `viem`, `@rainbow-me/rainbowkit`
- ❌ Removed `siwe` (Ethereum-specific)
- ✅ Kept `@onflow/fcl` (upgraded to v1.20.0)
- ✅ Added `framer-motion` for animations
- ✅ Added `react-spring` for physics-based animations

### 2. **Design System**
- **Color Palette**: Warm cream/beige base with orange/amber accents
- **Theme**: Light-only theme with futuristic aesthetics
- **Components**: Glassmorphism effects, gradient borders, smooth animations
- **Typography**: Bold headings with gradient text effects

### 3. **Flow Integration**
- Pure Flow wallet integration via FCL
- No Ethereum/EVM dependencies
- Simplified authentication flow
- Enhanced wallet connection UI

### 4. **Pages Redesigned**

#### Home Page (`/`)
- Hero section with gradient text
- Feature cards with glassmorphism
- Stats showcase
- Call-to-action buttons

#### Feed Page (`/feed`)
- Swipeable prediction cards
- Real-time stats bar
- Smooth navigation
- Modern bottom navigation

#### Profile Page (`/profile`)
- Stats dashboard with gradient cards
- Achievement showcase
- Recent activity feed
- Responsive design

### 5. **Components Enhanced**

#### PredictionCard
- Glassmorphic design
- Animated odds display
- Interactive YES/NO buttons
- Smooth transitions

#### WalletConnect
- Already Flow-based (no changes needed)
- Displays balance and address
- Clean disconnect flow

## Installation

```bash
cd web-app
pnpm install
```

## Running the App

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_FLOW_NETWORK=emulator  # or testnet, mainnet
```

## Design Highlights

### Color System
- **Background**: Warm cream (#faf8f3)
- **Primary Gradient**: Orange to Amber
- **Accents**: Green (success), Red (danger), Purple (achievements)
- **Text**: Dark with high contrast

### Custom CSS Classes
- `.glass` - Glassmorphism effect
- `.gradient-warm` - Warm background gradient
- `.gradient-card` - Card gradient
- `.hover-lift` - Lift on hover
- `.text-gradient` - Gradient text
- `.animate-slide-up` - Slide up animation
- `.animate-fade-in` - Fade in animation

### Typography
- **Headings**: Bold with gradient effects
- **Body**: Inter font family
- **Monospace**: For addresses

## Flow Blockchain Integration

### Contracts
- PredictionMarket
- PredictionActions (Flow Actions)
- NFTBattle
- AchievementNFT

### Network Support
- Emulator (default)
- Testnet
- Mainnet

## Features

### ✅ Implemented
- Flow wallet connection
- Prediction card UI
- Profile stats
- Achievement system
- Responsive design
- Light theme
- Animations

### 🚧 To Implement
- Real-time market data
- Transaction history
- NFT battle UI
- Market creation form
- Admin dashboard

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Blockchain**: Flow (FCL)
- **Animations**: Framer Motion, React Spring
- **State**: React Query

## Performance

- Optimized images
- Code splitting
- Lazy loading
- Minimal bundle size (removed heavy Ethereum deps)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Notes

- All pages use light theme only
- Removed Navbar component (not needed)
- Bottom navigation for mobile-first design
- Glassmorphism for modern feel
- Gradient accents throughout
