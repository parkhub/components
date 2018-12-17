#!/usr/bin/env bash
set -e

echo "Setting up registry..."
if [ "$noinstall" == "true" ]; then
  echo "Install already run"
else
  noprepare="true" npm install
fi
babel-node ./scripts/js/setup.js
bash $(dirname "$0")/build.sh
