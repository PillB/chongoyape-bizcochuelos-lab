#!/bin/bash
# Push the .github/workflows/ files to origin/main.
# Requires the GitHub token to have the `workflow` scope.
# Run this after authorizing the workflow scope via:
#   gh auth refresh --hostname github.com --scopes workflow
set -e
cd /home/z/my-project
export PATH="/home/z/.local/bin:$PATH"

# Check if workflow scope is present
SCOPES=$(gh api -i user 2>&1 | rg -i 'x-oauth-scopes' | head -1)
if echo "$SCOPES" | grep -q 'workflow'; then
  echo "✓ workflow scope present — pushing workflow files"
  git add .github/
  git commit -m "CI/CD: add GitHub Actions workflows (ci.yml + deploy.yml)" 2>/dev/null || true
  git push origin main
  echo "✓ workflows pushed — CI/CD will now run on next push"
else
  echo "✗ workflow scope NOT present. Current scopes: $SCOPES"
  echo "  Run: gh auth refresh --hostname github.com --scopes workflow"
  echo "  Then authorize at https://github.com/login/device"
  exit 1
fi
