#!/usr/bin/env bash
set -e

if [ "$1" == "" ]; then
  echo "Linting core and registry..."
  eslint . --fix --cache
  npm run lint --prefix ./registry
elif [ "$1" == "core" ]; then
  echo "Linting core only..."
  eslint . --fix --cache
elif [ "$1" == "registry" ]; then
  echo "Cleaning registry only..."
  npm run lint --prefix ./registry
else
  echo "Linting with options '$@'"
  eslint "$@" --fix --cache
fi
