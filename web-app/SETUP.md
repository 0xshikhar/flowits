# Moments App - Setup Guide

## Prerequisites

- Node.js 18+ and pnpm installed
- PostgreSQL database (cloud or local)
- Flow CLI installed (for contract deployment)

## Quick Start

### 1. Install Dependencies

```bash
cd web-app
pnpm install
```

### 2. Environment Setup

Create `.env` file with:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Flow Network
NEXT_PUBLIC_FLOW_NETWORK=testnet

# Optional: OpenAI (if using AI features)
OPENAI_API_KEY=your_key_here
```

### 3. Database Setup

Generate Prisma client and push schema:

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Deploy Contracts (if not already deployed)

```bash
cd ../contracts
flow project deploy --network testnet
```

### 5. Run Development Server

```bash
cd ../web-app
pnpm dev
```

Visit `http://localhost:3000`

## Key Features Implemented

### ✅ Completed

1. **Prisma Schema** - Full database schema with Post, Prediction, Battle, User models
2. **API Routes**:
   - `/api/posts` - Create and fetch prediction posts
   - `/api/predictions` - Place and track predictions
   - `/api/battles` - NFT battle management
   - `/api/leaderboard` - Rankings by earnings, accuracy, volume
3. **Pages**:
   - `/feed` - Swipeable prediction feed
   - `/create` - Create prediction markets
   - `/profile` - User stats and history
   - `/battles` - NFT battle arena
   - `/leaderboard` - Top performers
   - `/admin` - Market resolution interface
4. **Flow Integration**:
   - FCL wallet connection
   - On-chain transactions (create market, place prediction, claim winnings)
   - Flow Actions support (PredictionActions.cdc)
5. **UI Components** - shadcn/ui with custom styling

### 🚧 Next Steps

1. **Run Prisma Generate**:
   ```bash
   pnpm prisma generate
   ```
   This will create TypeScript types from the schema and fix lint errors.

2. **Update Feed Page** - Fetch posts from database instead of mock data

3. **Media Upload** - Integrate Cloudinary for image/video uploads

4. **NFT Integration** - Connect Find Labs API for NFT display

5. **Testing** - Test end-to-end flow:
   - Connect wallet
   - Create market
   - Place prediction
   - Resolve market
   - Claim winnings

## Architecture

### Database Models

- **User** - Wallet address, stats, achievements
- **Post** - Prediction market with media, NFT attachment
- **Prediction** - User bets on posts
- **Battle** - NFT vs NFT battles with community betting
- **BattleBet** - Bets on battle outcomes
- **Achievement** - Unlockable badges
- **Follow** - Social connections
- **Comment** - Post comments
- **Notification** - User notifications

### Flow Contracts

Located in `/contracts/cadence/contracts/`:
- `PredictionMarket.cdc` - Core prediction logic
- `PredictionActions.cdc` - Flow Actions integration
- `NFTBattle.cdc` - Battle mechanics
- `AchievementNFT.cdc` - Soulbound achievement NFTs

### API Structure

```
/api
├── posts/          # Prediction posts CRUD
├── predictions/    # Place/claim predictions
├── battles/        # Battle management
├── leaderboard/    # Rankings
└── admin/          # Market resolution
```

## Troubleshooting

### Prisma Errors

If you see "Property 'post' does not exist on type 'PrismaClient'":
```bash
pnpm prisma generate
```

### Flow Connection Issues

- Ensure `NEXT_PUBLIC_FLOW_NETWORK` is set correctly
- Check contract addresses in `/src/lib/flow/config.ts`
- Verify contracts are deployed on testnet

### Database Connection

- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Run `pnpm prisma db push` to sync schema

## Development Workflow

1. Make schema changes in `prisma/schema.prisma`
2. Run `pnpm prisma generate` to update types
3. Run `pnpm prisma db push` to sync database
4. Update API routes if needed
5. Test in browser

## Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy

### Manual

```bash
pnpm build
pnpm start
```

## Resources

- [Flow Documentation](https://developers.flow.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [FCL Documentation](https://developers.flow.com/tools/clients/fcl-js)
