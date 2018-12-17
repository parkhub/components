#!/usr/bin/env bash
set -e

echo "Testing registry..."
if [ "$1" == "core" ]; then
  jest .
else
  jest "$@"
fi

if [ "$1" == "ci" ]; then
  jest . --runInBand --forceExit --colors
  # codecov
fi
