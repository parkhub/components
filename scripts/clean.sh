#!/usr/bin/env bash
set -e

if [ "$1" == "" ]; then
  echo "Cleaning core and registry..."
  rm -rf dist
  npm run clean --prefix ./registry
elif [ "$1" == "core" ]; then
  echo "Cleaning core only..."
  rm -rf dist
elif [ "$1" == "registry" ]; then
  echo "Cleaning registry only..."
  npm run clean --prefix ./registry
else
  echo "Unknown clean target '$1'"
  exit 1
fi
