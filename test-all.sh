#!/bin/bash

echo "🧪 FlowBattle - Complete Test Suite"
echo "===================================="
echo ""

# Test contracts
echo "1️⃣  Testing Cadence Contracts..."
echo "--------------------------------"
cd contracts
chmod +x test.sh
./test.sh

if [ $? -ne 0 ]; then
    echo "❌ Contract tests failed"
    exit 1
fi

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
echo "✅ All tests passed!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Start emulator: cd contracts && flow emulator start"
echo "2. Deploy contracts: cd contracts && ./deploy.sh"
echo "3. Start web app: cd web-app && pnpm dev"
