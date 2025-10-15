#!/bin/bash

echo "🚀 Deploying FlowBattle Contracts..."
echo ""

NETWORK=${1:-emulator}

if [ "$NETWORK" = "emulator" ]; then
    echo "📡 Deploying to Flow Emulator..."
    echo ""
    echo "Make sure emulator is running in another terminal:"
    echo "   flow emulator start"
    echo ""
    read -p "Press enter to continue..."
fi

cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
flow dependencies install

echo ""
echo "🔨 Deploying contracts to $NETWORK..."
flow project deploy --network=$NETWORK --update

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Contract addresses:"
    if [ "$NETWORK" = "emulator" ]; then
        echo "  PredictionMarket: 0xf8d6e0586b0a20c7"
        echo "  PredictionActions: 0xf8d6e0586b0a20c7"
        echo "  NFTBattle: 0xf8d6e0586b0a20c7"
        echo "  AchievementNFT: 0xf8d6e0586b0a20c7"
    fi
else
    echo ""
    echo "❌ Deployment failed"
    exit 1
fi
