#!/bin/bash

echo "🧪 Running FlowBattle Contract Verification..."
echo ""

# Check if flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo "❌ Flow CLI not found. Please install it first:"
    echo "   brew install flow-cli"
    exit 1
fi

echo "✅ Flow CLI found"
echo ""

cd "$(dirname "$0")"

# Lint contracts
echo "📝 Linting Cadence contracts..."
echo ""

echo "Checking PredictionMarket.cdc..."
flow cadence lint cadence/contracts/PredictionMarket.cdc
if [ $? -ne 0 ]; then
    echo "❌ PredictionMarket.cdc has errors"
    exit 1
fi

echo "Checking PredictionActions.cdc..."
flow cadence lint cadence/contracts/PredictionActions.cdc
if [ $? -ne 0 ]; then
    echo "❌ PredictionActions.cdc has errors"
    exit 1
fi

echo "Checking NFTBattle.cdc..."
flow cadence lint cadence/contracts/NFTBattle.cdc
if [ $? -ne 0 ]; then
    echo "❌ NFTBattle.cdc has errors"
    exit 1
fi

echo "Checking AchievementNFT.cdc..."
flow cadence lint cadence/contracts/AchievementNFT.cdc
if [ $? -ne 0 ]; then
    echo "❌ AchievementNFT.cdc has errors"
    exit 1
fi

echo ""
echo "✅ All contracts pass linting!"
echo ""
echo "To deploy and test:"
echo "  1. flow emulator start (in another terminal)"
echo "  2. flow project deploy --network=emulator"
echo "  3. Test transactions:"
echo "     flow transactions send cadence/transactions/create_market.cdc ..."
