#!/usr/bin/env bash
set -e
if [ "$1" == "gen" ]; then
  npm run docs:gen --prefix ./registry
else
  echo "Unknown docs command '$1'"
  exit 1
fi
