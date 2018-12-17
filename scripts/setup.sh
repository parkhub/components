#!/usr/bin/env bash
set -e

if [ "$1" == "" ]; then
  echo "Setting up core and registry..."
  if [ "$noinstall" == "true" ]; then
    echo "Install already run"
  else
    noprepare="true" npm install
  fi
  bash $(dirname "$0")/build.sh core
  npm run setup --prefix ./registry
elif [ "$1" == "core" ]; then
  echo "Setting up core only..."
  if [ "$noinstall" == "true" ]; then
    echo "Install already run"
  else
    noprepare="true" npm install
  fi
  bash $(dirname "$0")/build.sh core
  # npm run build:core
elif [ "$1" == "registry" ]; then
  echo "Setting up registry only..."
  npm run setup --prefix ./registry
elif [ "$1" == "ci" ]; then
  echo "Setting up ci..."
  npm install -g codecov
else
  echo "Unknown setup target '$1'"
  exit 1
fi
