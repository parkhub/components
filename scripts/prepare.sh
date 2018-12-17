#!/usr/bin/env bash
set -e
if [ "$noprepare" == "true" ]; then
  echo "Setup run directly, skipping prepare..."
else
  echo "Running prepare..."
  bash noinstall="true" $(dirname "$0")/setup.sh
fi
