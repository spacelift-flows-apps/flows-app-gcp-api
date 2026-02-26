#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "=== Generating gRPC apps ==="
npx tsx scriptsv2/grpc/protoGenerator.ts

echo ""
echo "=== Generating Compute apps ==="
npx tsx scriptsv2/compute/computeGenerator.ts

echo ""
echo "=== Generating DNS app ==="
npx tsx scriptsv2/dns/dnsGenerator.ts

echo ""
echo "=== Formatting ==="
for dir in generatedv2/*/; do
  echo "  Formatting $dir..."
  (cd "$dir" && npm run format --silent 2>/dev/null) || echo "  ⚠ Format failed for $dir"
done

echo ""
echo "=== Type-checking ==="
failed=0
for dir in generatedv2/*/; do
  echo -n "  $dir "
  if (cd "$dir" && npm run typecheck --silent 2>&1); then
    echo "✓"
  else
    echo "✗"
    failed=1
  fi
done

echo ""
if [ "$failed" -eq 0 ]; then
  echo "✅ All apps generated, formatted, and type-checked successfully."
else
  echo "❌ Some apps failed type-checking."
  exit 1
fi
