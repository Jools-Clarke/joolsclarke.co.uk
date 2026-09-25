# Sourced by the other scripts: puts the conda "jekyll" env's Ruby and gems
# on PATH (same as `conda activate jekyll`, without needing conda in this
# shell) and installs the gems on first run. Override the env location with
# JEKYLL_ENV_DIR=/path/to/env.
cd "$(dirname "${BASH_SOURCE[0]:-$0}")/.."

ENV_DIR=${JEKYLL_ENV_DIR:-/opt/homebrew/anaconda3/envs/jekyll}
if [ -d "$ENV_DIR" ]; then
  export GEM_HOME="$ENV_DIR/share/rubygems" GEM_PATH="$ENV_DIR/share/rubygems"
  export PATH="$GEM_HOME/bin:$ENV_DIR/bin:$PATH"
fi
# Ruby needs a UTF-8 locale to read the ☆ characters etc.
export LANG=${LANG:-en_US.UTF-8} LC_ALL=${LC_ALL:-en_US.UTF-8}

bundle check >/dev/null 2>&1 || bundle install
