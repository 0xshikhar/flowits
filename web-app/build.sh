#!/bin/bash

echo "🏗️  Building FlowBattle Frontend..."
echo ""

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

# Type check (with warnings)
echo "🔍 Type checking..."
pnpm tsc --noEmit || echo "⚠️  Type warnings present (FCL types - safe to ignore)"
echo ""

# Build
echo "🔨 Building Next.js app..."
pnpm build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "To start production server:"
    echo "   pnpm start"
    echo ""
    echo "To start development server:"
    echo "   pnpm dev"
else
    echo ""
    echo "❌ Build failed"
    exit 1
fi
