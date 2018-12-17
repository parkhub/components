#!/usr/bin/env bash
# NOTE BRN: Cannot run babel-node here since this is run on postinstall from npm where dev devDependencies are not installed
node ./scripts/js/postinstall.js
