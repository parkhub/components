#!/usr/bin/env bash
set -e

if [ "$1" == "" ]; then
  echo "Cleansing core and registry..."
  npm run cleanse --prefix ./registry
  bash $(dirname "$0")/clean.sh core
  rm -rf node_modules
  rm -f package-lock.json
elif [ "$1" == "core" ]; then
  echo "Cleansing core only..."
  bash $(dirname "$0")/clean.sh core
  rm -rf node_modules
  rm -f package-lock.json
elif [ "$1" == "registry" ]; then
  echo "Cleansing registry only..."
  npm run cleanse --prefix ./registry
else
  echo "Unknown cleanse target '$1'"
  exit 1
fi
