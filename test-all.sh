#!/bin/bash

echo "🧪 FlowBattle - Complete Test Suite"
echo "===================================="
echo ""

# Verify contracts compile
echo "1️⃣  Verifying Cadence Contracts..."
echo "--------------------------------"
cd contracts

echo "Checking contract syntax..."
flow cadence lint cadence/contracts/PredictionMarket.cdc
flow cadence lint cadence/contracts/PredictionActions.cdc
flow cadence lint cadence/contracts/NFTBattle.cdc
flow cadence lint cadence/contracts/AchievementNFT.cdc

if [ $? -ne 0 ]; then
    echo "❌ Contract linting failed"
    exit 1
fi

echo "✅ All contracts pass linting"
cd ..
echo ""

# Build frontend
echo "2️⃣  Building Frontend..."
echo "--------------------------------"
cd web-app
chmod +x build.sh
./build.sh

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..
echo ""

echo "================================"
echo "✅ All checks passed!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Start emulator: cd contracts && flow emulator start"
echo "2. Deploy contracts: cd contracts && flow project deploy --network=emulator"
echo "3. Start web app: cd web-app && pnpm dev"
echo ""
echo "For manual testing:"
echo "  - Create market: flow transactions send cadence/transactions/create_market.cdc ..."
echo "  - Place prediction: flow transactions send cadence/transactions/place_prediction.cdc ..."
echo "  - Get market info: flow scripts execute cadence/scripts/get_market_info.cdc 0"
