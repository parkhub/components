#!/usr/bin/env bash
set -e
echo "Cleansing registry..."
bash $(dirname "$0")/clean.sh
babel-node ./scripts/js/cleanse.js
rm -rf node_modules
rm -f package-lock.json
