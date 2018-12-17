#!/usr/bin/env bash
set -e

if [ "$1" == "" ]; then
  echo "Building core and registry..."
  babel src -d dist --source-maps --ignore "**/*.test.js" --ignore "**/__mocks__"
  # TODO BRN: replace rsync with something that works on windows
  rsync -avz --exclude "*.js" --exclude "__tests__" --exclude "__snapshots__" --exclude "__mocks__" --exclude "node_modules" src/ dist/
  npm run build --prefix ./registry
elif [ "$1" == "core" ]; then
  echo "Building core only..."
  babel src -d dist --source-maps --ignore "**/*.test.js" --ignore "**/__mocks__"
  # TODO BRN: replace rsync with something that works on windows
  rsync -avz --exclude "*.js" --exclude "__tests__" --exclude "__snapshots__" --exclude "__mocks__" --exclude "node_modules" src/ dist/
elif [ "$1" == "registry" ]; then
  echo "Building registry only..."
  npm run build --prefix ./registry
else
  echo "Unknown build target '$1'"
  exit 1
fi
