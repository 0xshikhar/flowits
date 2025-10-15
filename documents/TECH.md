# 🏗️ Technical Architecture ( initial version - feel free to update)

## Tech Stack

### Frontend
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "ui_components": "shadcn/ui",
  "state_management": "Zustand",
  "form_handling": "React Hook Form + Zod",
  "animations": "Framer Motion",
  "video_player": "react-player",
  "swipe_gestures": "react-swipeable",
  "wallet_integration": "wagmi + viem",
  "image_optimization": "Next.js Image + Cloudinary"
}

### Backend
{
  "api": "Next.js API Routes",
  "database": "PostgreSQL cloud server with prisma",
  "orm": "Prisma",
  "authentication": "Privy - no need for any other type of auth",
  "file_upload": "Cloudinary",
  "websockets": "Pusher (for real-time updates)" - i dont think we need it in our current stage and setup
}

### Blockchain
{   
  "chain": "Flow EVM",
  "oracles": "Custom admin oracle (manual resolution)",
  "nft_standards": "ERC-721",
  "forte_integration": "Flow Forte Actions SDK"
}

### External APIs
{
  "nft_data": "Find Labs API (Flow NFT metadata)",
  "nft_images": "Dapper asset endpoints",
  "sports_stats": "ESPN API / NBA Stats API",
  "notifications": "Web3 Push Protocol / OneSignal",
  "analytics": "Vercel Analytics"
}

## Details Doc

### Best Use of Flow Forte Actions and Workflows [All Projects]

Judging Criteria

Bounty Overview

The new Forte upgrade, live on Flow has released powerful new capabilities such as Flow Actions (FLIP-338) - a brand-new standard that turn protocol logic into self-contained, reusable onchain building blocks you can call without importing ABIs, reading contract code, or writing brittle glue scripts. Each Action is a trustless workflow with clear metadata, built-in safety checks, atomic execution, and verifiable success criteria—think standardized onchain APIs that plug together like Lego bricks. For AI agents, this means instant discovery of available protocols, safe composition of complex workflows, and full automation without off-chain keepers or servers.

Another powerful feature is Schedued Transactions which let smart contracts execute code at (or after) a chosen time without an external transaction. You schedule work now; the network executes it later. This enables recurring jobs, deferred actions, and autonomous workflows.

This bounty is calling on builders to push the boundaries by using either of these two new features, creating new connectors to major protocols, chaining cross-protocol workflows, integrating Actions into games, integrating fully onchain agents with actions, or tools that help others discover and use useful Actions and more. Whether you’re into DeFi, gaming, or novel automation, this is your chance to shape the future of composability and define how agents interact with Web3.

### Dapper: Best Dapper Data & Insights Tool
Judging Criteria

Bounty Overview

Create valuable data and analytics tools to provide insights into the Dapper ecosystem.

Focus Areas: Providing external, transparent, and user-friendly metrics for market health, collection value, and user behavior.

Target IPs: NFL ALL DAY, NBA Top Shot, Disney Pinnacle, CryptoKitties MeowCoins.

Inspired By: The Disney Pinnacle bot, LiveToken, Flowvana, etc.

Example Applications:

A real-time NFT marketplace tracker for NBA Top Shot or NFL ALL DAY with features that collectors would benefit from.

“MomentsWiki” - A platform where users can add additional information about NFTs, verified through on-chain signatures and requiring Moment ownership. Allows for collectors to add additional context, notes, and unique commentary around Moments.

“Sales Bot” - Similar to the Disney Pinnacle Bot on X, a bot which tracks big sales for MeowCoins, any Dapper NFT, and more.

Links:

Find Labs API for accessing on-chain Data easily

Account Linking with NBA Topshot - Tutorial (how to build an app using Topshot): 

Native Data Availability with Cadence Scripts (Tutorial on building a script to pull Topshot moments).

Example of Disney Pinnacle Twitter bot

Disney Pinnacle Address

You can retrieve pin images by constructing an endpoint using a base url + render id (can be found on the NFT) + asset name as in this example: https://assets.disneypinnacle.com/render/${ed.renderID}/front.png.

### Dapper: Top Game Integration Across NBA Top Shot, NFL ALL DAY & Disney Pinnacle

Judging Criteria

Bounty Overview

Develop applications or experiences that build on top of the various game modes for Dapper Labs' sports platforms.

Focus Areas: Creating new layers of interaction or engagement for existing game modes. For the NBA, this is the FastBreak game. We invite you to get inspiration by other official game modes by NFL Allday like: PlayBook, Pick ‘Em, Huddle, or One & Done

Target Platforms: NFL All Day and NBA Top Shot.

Example Applications:

“FastBreak - Best Performance” - A way for a group of friends to bet against one another on who will do the best in that week's FastBreak run. 

“Backing Other Collectors” - A way for users to bet on the outcome of other collectors

“Real Time Performance” - A tool that visualizes a player's real-time performance across multiple game types

Links:

CryptoKitties Contracts

Bartholomeow

Catseye

Pawderick

Gwendolion

Purrzival

HotCocoa

Burn Contract Address: 0xe249E18Fe5c30a972B5CfE3FF04144beBD365967

NBA Topshot 

Topshot Address

TShot Token Address (ecosystem project)

Topshot Data endpoints for media 

NFL All Day Contracts:

NFL All Day Address

Disney Pinnacle Contracts

Disney Pinnacle Address

You can retrieve pin images by constructing an endpoint using a base url + render id (can be found on the NFT) + asset name as in this example: https://assets.disneypinnacle.com/render/${ed.renderID}/front.png.

Games:

Fastbreak

### Dapper: Top Dapper NFT Experience Unlocking Real Utility

Judging Criteria

Bounty Overview

Build creative and compelling uses for Dapper's collectible assets to enhance their usage and composability within the ecosystem.

Focus Areas: Cryptokitties Ethereum NFTs, MeowCoins, NBA Top Shot Moments, NFL ALL DAY Moments, Community made TSHOT token.

Target Platforms: Cryptokitties, NFL All Day and NBA Top Shot.

Example Applications:

Applications that let users use Moments as game pieces, whether it’s to “play” against each other, “wager” against each other, or similar.

“Fractionlisation” - A platform where users can “split” a high-value NFT into multiple slicers where people can buy and sell ownership of smaller parts, whilst the core NFT is securely held in a vault

“NFT Gallery” - A social application where users can "show off" or create visual art and media using their owned Moments or CryptoKitties.

“Burn To Earn” - A vaulting app where users can contribute MeowCoins, FLOW tokens, or NFTs. Other users can then burn NFTs for a lotterised chance to win the contents. The Vault creator can select what can be eligible to be burnt.

Links:

Data Resources

Find Labs API for accessing on-chain Data easily

Account Linking with NBA Topshot - Tutorial (how to build an app using Topshot): 

Native Data Availability with Cadence Scripts (Tutorial on building a script to pull Topshot moments).

Example of Disney Pinnacle Twitter bot

CryptoKitties Contracts

Bartholomeow

Catseye

Pawderick

Gwendolion

Purrzival

HotCocoa

Burn Contract Address: 0xe249E18Fe5c30a972B5CfE3FF04144beBD365967

NBA Topshot 

Topshot Address

TShot Token Address (ecosystem project)

Topshot Data endpoints for media 

NFL All Day Contracts:

NFL All Day Address

Disney Pinnacle Contracts

Disney Pinnacle Address

You can retrieve pin images by constructing an endpoint using a base url + render id (can be found on the NFT) + asset name as in this example: https://assets.disneypinnacle.com/render/${ed.renderID}/front.png. 

Games:

Fastbreak


## 📁 Project Structure
moments/
├── TECH.md (this file)
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── contracts/
│   ├── PredictionMarket.sol
│   ├── NFTBattle.sol
│   ├── AchievementNFT.sol
│   └── CreatorRewards.sol
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (landing page)
│   │   ├── feed/
│   │   │   └── page.tsx (main swipeable feed)
│   │   ├── battles/
│   │   │   ├── page.tsx (battles list)
│   │   │   └── [id]/page.tsx (battle detail)
│   │   ├── create/
│   │   │   └── page.tsx (create post/battle)
│   │   ├── profile/
│   │   │   └── [id]/page.tsx
│   │   ├── leaderboard/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   └── resolve/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── posts/
│   │       │   ├── create/route.ts
│   │       │   ├── feed/route.ts
│   │       │   └── [id]/route.ts
│   │       ├── predictions/
│   │       │   ├── place/route.ts
│   │       │   └── my/route.ts
│   │       ├── battles/
│   │       │   ├── create/route.ts
│   │       │   ├── accept/route.ts
│   │       │   └── bet/route.ts
│   │       ├── users/
│   │       │   └── [id]/route.ts
│   │       ├── leaderboards/route.ts
│   │       ├── admin/
│   │       │   └── resolve/route.ts
│   │       └── cloudinary/
│   │           └── sign/route.ts
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── feed/
│   │   │   ├── SwipeableCard.tsx
│   │   │   ├── PredictionModal.tsx
│   │   │   └── PostCard.tsx
│   │   ├── battles/
│   │   │   ├── BattleCard.tsx
│   │   │   ├── CreateBattleModal.tsx
│   │   │   └── BattleResult.tsx
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── StatsGrid.tsx
│   │   │   └── ActivityFeed.tsx
│   │   ├── leaderboard/
│   │   │   └── LeaderboardTable.tsx
│   │   └── shared/
│   │       ├── NFTDisplay.tsx
│   │       ├── WalletConnect.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   ├── cloudinary.ts
│   │   ├── wagmi.ts
│   │   ├── contracts.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useSwipeable.ts
│   │   ├── usePrediction.ts
│   │   ├── useBattle.ts
│   │   └── useUserNFTs.ts
│   ├── store/
│   │   ├── userStore.ts
│   │   └── feedStore.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── contracts.ts
│   │   └── api.ts
│   └── constants/
│       ├── contracts.ts
│       └── config.ts
└── public/
    ├── images/
    └── icons/


🗄️ Database Schema (Prisma)

// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
// ==================== USER MODEL ====================
model User {
  id              String   @id @default(cuid())
  walletAddress   String   @unique
  username        String?  @unique
  bio             String?
  avatar          String?  // Cloudinary URL or ENS avatar
  isAdmin         Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // Stats
  totalPredictions    Int     @default(0)
  correctPredictions  Int     @default(0)
  totalEarnings       Decimal @default(0) @db.Decimal(18, 6)
  battleWins          Int     @default(0)
  battleLosses        Int     @default(0)
  currentStreak       Int     @default(0)
  longestStreak       Int     @default(0)
  // Relations
  posts            Post[]
  predictions      Prediction[]
  battlesCreated   Battle[]        @relation("BattleCreator")
  battlesOpponent  Battle[]        @relation("BattleOpponent")
  battleBets       BattleBet[]
  achievements     Achievement[]
  followers        Follow[]        @relation("UserFollowers")
  following        Follow[]        @relation("UserFollowing")
  notifications    Notification[]
  @@index([walletAddress])
  @@index([username])
}
// ==================== POST MODEL ====================
model Post {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Content
  mediaUrl        String   // Cloudinary URL (image or video)
  mediaType       String   // "image" or "video"
  thumbnailUrl    String?  // For video thumbnails
  caption         String   @db.Text
  
  // NFT Attachment (optional)
  nftContractAddr String?
  nftTokenId      String?
  nftChainId      Int?
  nftImageUrl     String?
  nftName         String?
  // Prediction Details
  question        String   @db.Text
  marketType      String   // "binary" (yes/no), "scalar" (number guess), "categorical" (multiple choice)
  closeTime       DateTime
  minStake        Decimal  @db.Decimal(18, 6)
  maxStake        Decimal  @db.Decimal(18, 6)
  creatorFeePercent Decimal @default(5) @db.Decimal(5, 2) // 5.00 = 5%
  // Blockchain
  contractAddress String?  // PredictionMarket contract address
  marketId        String?  // On-chain market ID
  // Status
  status          String   @default("active") // "active", "closed", "resolved", "cancelled"
  isResolved      Boolean  @default(false)
  winningOutcome  String?  // "yes", "no", or specific value
  resolvedAt      DateTime?
  resolvedBy      String?  // Admin wallet address
  // Volume Tracking
  totalVolume     Decimal  @default(0) @db.Decimal(18, 6)
  yesVolume       Decimal  @default(0) @db.Decimal(18, 6)
  noVolume        Decimal  @default(0) @db.Decimal(18, 6)
  uniquePredictors Int    @default(0)
  // Engagement
  views           Int      @default(0)
  likes           Int      @default(0)
  comments        Int      @default(0)
  shares          Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // Relations
  predictions     Prediction[]
  comments        Comment[]
  @@index([userId])
  @@index([status])
  @@index([closeTime])
  @@index([createdAt])
}
// ==================== PREDICTION MODEL ====================
model Prediction {
  id              String   @id @default(cuid())
  postId          String
  post            Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Prediction Data
  outcome         String   // "yes", "no", or specific value
  amount          Decimal  @db.Decimal(18, 6)
  potentialWin    Decimal  @db.Decimal(18, 6) // Calculated at time of prediction
  
  // Blockchain
  txHash          String?  // Transaction hash
  
  // Status
  status          String   @default("pending") // "pending", "won", "lost", "refunded"
  claimed         Boolean  @default(false)
  claimedAmount   Decimal? @db.Decimal(18, 6)
  claimedAt       DateTime?
  createdAt       DateTime @default(now())
  @@index([postId])
  @@index([userId])
  @@index([status])
  @@unique([postId, userId]) // One prediction per user per post
}
// ==================== BATTLE MODEL ====================
model Battle {
  id              String   @id @default(cuid())
  
  // Participants
  creatorId       String
  creator         User     @relation("BattleCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  opponentId      String?
  opponent        User?    @relation("BattleOpponent", fields: [opponentId], references: [id], onDelete: SetNull)
  // NFT Stakes
  creatorNFTAddr  String
  creatorNFTId    String
  creatorNFTImage String?
  creatorNFTName  String?
  
  opponentNFTAddr  String?
  opponentNFTId    String?
  opponentNFTImage String?
  opponentNFTName  String?
  // Battle Configuration
  battleType      String   // "1v1", "collection_showdown", "squad_battle"
  condition       String   @db.Text // Description of win condition
  conditionType   String   // "player_stats", "price_movement", "community_vote"
  closeTime       DateTime
  
  // Blockchain
  contractAddress String?
  battleId        String?  // On-chain battle ID
  escrowTxHash    String?
  // Status
  status          String   @default("pending") // "pending", "active", "resolved", "cancelled"
  winner          String?  // "creator" or "opponent"
  resolvedAt      DateTime?
  resolvedBy      String?
  // Community Betting
  bettingEnabled  Boolean  @default(true)
  totalPool       Decimal  @default(0) @db.Decimal(18, 6)
  creatorPool     Decimal  @default(0) @db.Decimal(18, 6)
  opponentPool    Decimal  @default(0) @db.Decimal(18, 6)
  // Engagement
  views           Int      @default(0)
  bettorsCount    Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  // Relations
  bets            BattleBet[]
  @@index([creatorId])
  @@index([opponentId])
  @@index([status])
  @@index([closeTime])
}
// ==================== BATTLE BET MODEL ====================
model BattleBet {
  id              String   @id @default(cuid())
  battleId        String
  battle          Battle   @relation(fields: [battleId], references: [id], onDelete: Cascade)
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Bet Data
  side            String   // "creator" or "opponent"
  amount          Decimal  @db.Decimal(18, 6)
  potentialWin    Decimal  @db.Decimal(18, 6)
  // Blockchain
  txHash          String?
  // Status
  status          String   @default("pending") // "pending", "won", "lost", "refunded"
  claimed         Boolean  @default(false)
  claimedAmount   Decimal? @db.Decimal(18, 6)
  claimedAt       DateTime?
  createdAt       DateTime @default(now())
  @@index([battleId])
  @@index([userId])
  @@unique([battleId, userId]) // One bet per user per battle
}
// ==================== ACHIEVEMENT MODEL ====================
model Achievement {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Achievement Data
  type            String   // "hot_streak", "diamond_hands", "whale", etc.
  name            String
  description     String
  tier            String   // "bronze", "silver", "gold", "legendary"
  iconUrl         String?
  // Blockchain (if minted as NFT)
  nftTokenId      String?  @unique
  nftTxHash       String?
  unlockedAt      DateTime @default(now())
  @@index([userId])
  @@index([type])
}
// ==================== FOLLOW MODEL ====================
model Follow {
  id              String   @id @default(cuid())
  followerId      String
  follower        User     @relation("UserFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  followingId     String
  following       User     @relation("UserFollowers", fields: [followingId], references: [id], onDelete: Cascade)
  
  createdAt       DateTime @default(now())
  @@unique([followerId, followingId])
  @@index([followerId])
  @@index([followingId])
}
// ==================== COMMENT MODEL ====================
model Comment {
  id              String   @id @default(cuid())
  postId          String
  post            Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId          String
  walletAddress   String   // Denormalized for quick lookup
  username        String?
  avatar          String?
  
  content         String   @db.Text
  
  createdAt       DateTime @default(now())
  @@index([postId])
  @@index([userId])
}
// ==================== NOTIFICATION MODEL ====================
model Notification {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type            String   // "prediction_won", "battle_challenge", "new_follower", "achievement_unlocked"
  title           String
  message         String   @db.Text
  actionUrl       String?  // Link to relevant page
  
  read            Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  @@index([userId, read])
  @@index([createdAt])
}
// ==================== LEADERBOARD CACHE MODEL ====================
model LeaderboardCache {
  id              String   @id @default(cuid())
  category        String   @unique // "accuracy", "earnings", "battles", "streak"
  data            Json     // Cached leaderboard data
  updatedAt       DateTime @default(now())
  @@index([category])
}
