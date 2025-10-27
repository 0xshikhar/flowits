#!/bin/bash

set -e

echo "🔍 Verifying Build Fixes..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📦 Step 1: Generating Prisma Client..."
pnpm build:prisma
echo -e "${GREEN}✓ Prisma client generated${NC}"
echo ""

echo "🔎 Step 2: Type Checking..."
if npx tsc --noEmit --pretty 2>&1 | tee /tmp/tsc-output.log; then
    echo -e "${GREEN}✓ TypeScript check passed!${NC}"
else
    echo -e "${RED}✗ TypeScript errors found${NC}"
    echo ""
    echo "Errors:"
    cat /tmp/tsc-output.log
    exit 1
fi
echo ""

echo "🏗️  Step 3: Building Next.js Application..."
if pnpm run build; then
    echo -e "${GREEN}✓ Build successful!${NC}"
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   ✅ ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "You can now run:"
    echo "  pnpm dev    - Start development server"
    echo "  pnpm start  - Start production server"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
