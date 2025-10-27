#!/bin/bash

echo "🔍 Testing TypeScript compilation..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
pnpm build:prisma

# Run TypeScript check
echo "🔎 Checking TypeScript types..."
npx tsc --noEmit --pretty

if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed!"
    
    echo "🏗️  Building Next.js app..."
    npx next build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build successful!"
        exit 0
    else
        echo "❌ Build failed!"
        exit 1
    fi
else
    echo "❌ TypeScript check failed!"
    exit 1
fi
