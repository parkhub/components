#!/usr/bin/env bash
set -e

if [ "$1" == "" ]; then
  echo "Testing core and registry..."
  jest .
  npm run test --prefix ./registry
elif [ "$1" == "core" ]; then
  echo "Testing core only..."
  jest .
elif [ "$1" == "registry" ]; then
  echo "Testing registry only..."
  npm run test --prefix ./registry
elif [ "$1" == "ci" ]; then
  echo "Testing core and registry in ci mode..."
  jest . --runInBand --forceExit --colors
  npm run test --prefix ./registry -- ci
  codecov
else
  echo "Testing with options '$@'"
  jest "$@"
fi
