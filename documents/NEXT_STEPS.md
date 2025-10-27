# Next Steps for Moments App

## ✅ What's Been Completed

### 1. Database Schema (Prisma)
- Complete schema matching TECH.md requirements
- Models: User, Post, Prediction, Battle, BattleBet, Achievement, Follow, Comment, Notification, LeaderboardCache
- All relations properly defined
- Proper indexing for performance

### 2. API Routes Created
- `/api/posts` - Create and fetch prediction posts
- `/api/predictions` - Place and track predictions  
- `/api/battles` - Battle management
- `/api/leaderboard` - Rankings (earnings, accuracy, volume)
- `/api/markets/[id]` - Individual market operations (legacy, can be removed)

### 3. Pages Implemented
- `/admin` - Market resolution interface with on-chain transaction
- `/leaderboard` - Three leaderboard tabs (earnings, accuracy, volume)
- `/battles` - NFT battle arena with active/pending/resolved tabs
- `/create` - Market creation form (needs media upload integration)
- `/feed` - Exists but needs database integration
- `/profile` - Exists but needs database integration

### 4. UI Components
- Added Avatar component (Radix UI)
- All shadcn/ui components in place
- Responsive design
- Toast notifications

### 5. External Integrations
- Find Labs API helper (`/src/lib/findlabs.ts`)
- Flow blockchain integration (FCL)
- NBA Top Shot NFT reading script

## 🚨 Critical Next Steps (Do These First)

### Step 1: Generate Prisma Client
```bash
cd web-app
pnpm prisma generate
```
This will:
- Create TypeScript types from schema
- Fix all lint errors about missing Prisma models
- Enable proper type checking

### Step 2: Push Schema to Database
```bash
pnpm prisma db push
```
This will sync your schema with the PostgreSQL database.

### Step 3: Update Feed Page
The feed page currently uses mock data. Update it to fetch from database:

**File: `/src/app/feed/page.tsx`**

Replace mock data with:
```typescript
const [posts, setPosts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchPosts()
}, [])

const fetchPosts = async () => {
  try {
    const response = await fetch('/api/posts?status=active&limit=50')
    const data = await response.json()
    setPosts(data.posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    setLoading(false)
  }
}
```

### Step 4: Fix Create Page Transaction Handling
**File: `/src/app/create/page.tsx` line 57**

The `result.authorizers` doesn't exist on TransactionStatus. Use:
```typescript
// Get user address from FCL
const user = await fcl.currentUser.snapshot()
const creatorAddress = user.addr

// Or extract from transaction events
const marketCreatedEvent = result.events?.find((e: any) => 
  e.type.includes("MarketCreated")
)
```

### Step 5: Create User on First Login
Add this to your wallet connection logic:

```typescript
// After successful FCL authentication
const user = await fcl.currentUser.snapshot()
if (user.loggedIn) {
  // Create/update user in database
  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: user.addr,
    }),
  })
}
```

## 📋 Additional Tasks

### Media Upload Integration
1. Set up Cloudinary account
2. Add Cloudinary config to `.env`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Update create page to upload media before creating post

### Battle Creation Page
Create `/src/app/battles/create/page.tsx`:
- NFT selection from user's wallet
- Battle condition input
- Opponent challenge
- On-chain escrow transaction

### Profile Page Enhancement
Update `/src/app/profile/page.tsx`:
- Fetch user's predictions from database
- Display win/loss stats
- Show achievement NFTs
- Battle history

### Scheduled Transactions
Implement automated tasks:
1. Weekly creator payouts
2. Daily achievement checks
3. Market auto-resolution (optional)

## 🧪 Testing Checklist

### End-to-End Flow
1. [ ] Connect wallet (testnet)
2. [ ] Create prediction market
3. [ ] Verify market appears in feed
4. [ ] Place prediction on market
5. [ ] Wait for close time
6. [ ] Resolve market (admin)
7. [ ] Claim winnings
8. [ ] Check leaderboard updates

### Battle Flow
1. [ ] Create battle with NFT
2. [ ] Accept battle (opponent)
3. [ ] Place bets on battle
4. [ ] Resolve battle
5. [ ] Claim battle winnings

## 🚀 Deployment

### Prerequisites
- PostgreSQL database URL
- Flow testnet account with deployed contracts
- Vercel account (recommended)

### Deploy Steps
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_FLOW_NETWORK=testnet`
4. Deploy

## 📝 Documentation Needed

### For Bounty Submission
1. **FORTE_INTEGRATION.md**
   - How PredictionActions work
   - Composability examples
   - Scheduled transaction setup

2. **Demo Video (3-5 minutes)**
   - Show wallet connection
   - Create prediction market
   - Place prediction
   - Show Flow Actions in action
   - Demonstrate NFT battles
   - Show leaderboards

3. **README.md Update**
   - Add screenshots
   - Feature highlights
   - Bounty alignment

## 🎯 Bounty Optimization

### Flow Forte Actions ($6K)
- ✅ DeFiActions.Sink implemented
- 🚧 Add scheduled transactions
- 🚧 Write FORTE_INTEGRATION.md
- 🚧 Show composability in demo

### Dapper: Data & Insights ($4K)
- ✅ Leaderboards implemented
- ✅ Real-time odds
- 🚧 Add more analytics
- 🚧 Battle statistics dashboard

### Dapper: Game Integration ($5K)
- ✅ Battle system
- ✅ Community betting
- 🚧 Performance-based outcomes
- 🚧 Integration with FastBreak data

### Dapper: NFT Utility ($5K)
- ✅ NFTs as battle stakes
- ✅ NFTs on prediction posts
- 🚧 NFT gallery
- 🚧 More utility features

## 💡 Quick Wins

These are easy additions that add value:

1. **Loading Skeletons** - Better UX during data fetch
2. **Empty States** - Friendly messages when no data
3. **Error Boundaries** - Graceful error handling
4. **Optimistic Updates** - Instant UI feedback
5. **Share Buttons** - Share predictions to Twitter
6. **Copy Links** - Easy sharing of markets/battles

## 🐛 Known Issues to Fix

1. **TypeScript Errors** - Run `prisma generate`
2. **Transaction Response** - Fix authorizers access
3. **Feed Mock Data** - Replace with DB queries
4. **Admin Auth** - Add authentication check
5. **Missing User API** - Create `/api/users` route

## 📞 Need Help?

If you encounter issues:

1. **Database Connection**
   ```bash
   pnpm prisma studio
   ```
   Opens visual database editor

2. **Flow Contracts**
   ```bash
   cd contracts
   flow project deploy --network testnet
   ```

3. **Clear Cache**
   ```bash
   rm -rf .next
   pnpm dev
   ```

## 🎉 You're Almost There!

The foundation is solid. Just need to:
1. Run `prisma generate`
2. Connect feed to database
3. Test the flow
4. Create demo video

Good luck! 🚀
