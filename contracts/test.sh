#!/bin/bash

echo "🧪 Running FlowBattle Contract Tests..."
echo ""

# Check if flow CLI is installed
if ! command -v flow &> /dev/null; then
    echo "❌ Flow CLI not found. Please install it first:"
    echo "   brew install flow-cli"
    exit 1
fi

echo "✅ Flow CLI found"
echo ""

# Run tests
echo "📝 Running Cadence tests..."
cd "$(dirname "$0")"

flow test cadence/tests/basic_test.cdc --network=emulator

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
    echo ""
    echo "Note: For full integration tests, deploy contracts and test manually:"
    echo "  1. flow emulator start"
    echo "  2. flow project deploy --network=emulator"
    echo "  3. Test transactions in cadence/transactions/"
else
    echo ""
    echo "❌ Tests failed"
    exit 1
fi
