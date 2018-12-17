#!/usr/bin/env bash
set -e

babel --watch src --out-dir dist --source-maps --copy-files --ignore '**/node_modules' --ignore '**/*.test.js'
