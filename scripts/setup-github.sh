#!/usr/bin/env bash
# Run this script once after cloning to set up GitHub labels and Week 1 issues.
# Requires: gh CLI authenticated (gh auth login)

set -e

REPO="benflux-company/benflux-devtools"

echo "Setting up GitHub labels..."

# Delete defaults that clash
gh label delete "duplicate" --repo "$REPO" --yes 2>/dev/null || true
gh label delete "invalid"   --repo "$REPO" --yes 2>/dev/null || true
gh label delete "question"  --repo "$REPO" --yes 2>/dev/null || true
gh label delete "wontfix"   --repo "$REPO" --yes 2>/dev/null || true

# Create labels
gh label create "challenge"       --color "7B2D8B" --description "Weekly challenge task"         --repo "$REPO" --force
gh label create "week-1"          --color "0E8A16" --description "Week 1 — JSON Formatter"       --repo "$REPO" --force
gh label create "week-2"          --color "1D76DB" --description "Week 2 — JWT Decoder"          --repo "$REPO" --force
gh label create "good first issue"--color "7057FF" --description "Good for newcomers"            --repo "$REPO" --force
gh label create "help wanted"     --color "E4E669" --description "Extra attention needed"        --repo "$REPO" --force
gh label create "infrastructure"  --color "5319E7" --description "CI, Docker, tooling"           --repo "$REPO" --force
gh label create "documentation"   --color "FEF2C0" --description "Documentation improvements"   --repo "$REPO" --force
gh label create "enhancement"     --color "84B6EB" --description "Feature improvement"           --repo "$REPO" --force
gh label create "bug"             --color "D93F0B" --description "Something is broken"           --repo "$REPO" --force
gh label create "in review"       --color "F9D0C4" --description "PR under review"               --repo "$REPO" --force
gh label create "claimed"         --color "C2E0C6" --description "Issue has been claimed"        --repo "$REPO" --force

echo "Labels created."
echo ""
echo "Done! Visit https://github.com/$REPO/labels to verify."
