#!/usr/bin/env bash
set -e

echo "Linting registry..."
if [ "$1" == "" ] then
  eslint . --fix --cache
else
  eslint "$@" --fix --cache
fi
