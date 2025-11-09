#!/bin/bash

# GitHub Zread Button - Release Preparation Script
# 准备发布到各大浏览器扩展商店

set -e

echo "🚀 GitHub Zread Button - Release Preparation"
echo "=========================================="
echo ""

# Get version from wxt.config.ts
VERSION=$(grep -o "version: '[^']*'" wxt.config.ts | cut -d "'" -f 2)
echo "📦 Version: $VERSION"
echo ""

# Step 1: Run tests
echo "✅ Step 1/6: Running tests..."
pnpm test --run || {
    echo "❌ Tests failed! Please fix before releasing."
    exit 1
}
echo "✓ Tests passed!"
echo ""

# Step 2: Type check
echo "✅ Step 2/6: Type checking..."
pnpm run type-check || {
    echo "❌ Type check failed! Please fix before releasing."
    exit 1
}
echo "✓ Type check passed!"
echo ""

# Step 3: Lint
echo "✅ Step 3/6: Linting code..."
pnpm run lint || {
    echo "⚠️  Linting issues found. Please review."
}
echo "✓ Linting complete!"
echo ""

# Step 4: Build all browsers
echo "✅ Step 4/6: Building for all browsers..."

# Build Chrome
echo "  Building for Chrome..."
pnpm run build
echo "  ✓ Chrome build complete"

# Build Firefox
echo "  Building for Firefox..."
pnpm run build:firefox
echo "  ✓ Firefox build complete"

echo "✓ All builds complete!"
echo ""

# Step 5: Create distribution directory
echo "✅ Step 5/6: Creating distribution packages..."
mkdir -p dist

# Package Chrome
echo "  Packaging Chrome extension..."
cd .output/chrome-mv3
zip -r -q ../../dist/github-zread-button-chrome-v${VERSION}.zip .
cd ../..
echo "  ✓ Chrome package: dist/github-zread-button-chrome-v${VERSION}.zip"

# Package Firefox
echo "  Packaging Firefox extension..."
cd .output/firefox-mv2
zip -r -q ../../dist/github-zread-button-firefox-v${VERSION}.zip .
cd ../..
echo "  ✓ Firefox package: dist/github-zread-button-firefox-v${VERSION}.zip"

# Package Edge (same as Chrome)
echo "  Packaging Edge extension..."
cp dist/github-zread-button-chrome-v${VERSION}.zip dist/github-zread-button-edge-v${VERSION}.zip
echo "  ✓ Edge package: dist/github-zread-button-edge-v${VERSION}.zip"

echo "✓ All packages created!"
echo ""

# Step 6: Generate checksums
echo "✅ Step 6/6: Generating checksums..."
cd dist
shasum -a 256 *.zip > checksums.txt
cd ..
echo "✓ Checksums saved to dist/checksums.txt"
echo ""

# Summary
echo "=========================================="
echo "🎉 Release preparation complete!"
echo ""
echo "📦 Distribution packages created:"
echo "  - dist/github-zread-button-chrome-v${VERSION}.zip"
echo "  - dist/github-zread-button-firefox-v${VERSION}.zip"
echo "  - dist/github-zread-button-edge-v${VERSION}.zip"
echo "  - dist/checksums.txt"
echo ""
echo "📋 Next steps:"
echo "  1. Review the packages in ./dist/"
echo "  2. Create a Git tag: git tag v${VERSION}"
echo "  3. Push the tag: git push --tags"
echo "  4. Upload to browser stores:"
echo "     - Chrome Web Store: https://chrome.google.com/webstore/devconsole"
echo "     - Firefox AMO: https://addons.mozilla.org/developers/"
echo "     - Edge Add-ons: https://partner.microsoft.com/dashboard"
echo ""
echo "📖 See docs/PUBLISHING_GUIDE.md for detailed instructions"
echo "=========================================="
