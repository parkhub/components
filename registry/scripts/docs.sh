#!/usr/bin/env bash
set -e
if [ "$1" == "gen" ]; then
  echo "Generating docs..."
  babel-node ./scripts/js/docs-gen.js
else
  echo "unknown docs command $1"
  exit 1
fi
