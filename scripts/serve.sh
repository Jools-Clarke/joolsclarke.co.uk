#!/usr/bin/env bash
# Build the site and serve it at http://localhost:4000, rebuilding and
# reloading the browser whenever a file changes. Ctrl+C to stop.
#
#   scripts/serve.sh                 # usual
#   scripts/serve.sh --port 4001     # any extra options go to `jekyll serve`
set -euo pipefail
source "$(dirname "$0")/env.sh"
exec bundle exec jekyll serve --livereload "$@"
