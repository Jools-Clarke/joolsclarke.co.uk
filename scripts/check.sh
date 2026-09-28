#!/usr/bin/env bash
# Build the site exactly as GitHub Pages will (production mode) and check the
# result for broken links, links to the live site, missing previews, etc.
# Run it before pushing.  Exit code 0 = all good.
# Builds into a temporary folder, so it's safe while scripts/serve.sh is running.
set -euo pipefail
source "$(dirname "$0")/env.sh"
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
JEKYLL_ENV=production bundle exec jekyll build --quiet --destination "$out"
ruby scripts/check.rb "$out"
