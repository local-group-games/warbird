#!/bin/bash

# Remove symlinks (kompose compresses the directory and tar doensn't like symlinks)
./node_modules/.bin/lerna clean --yes
rm -rf node_modules

# Remove the active deployment
kompose down

# Build, push, and deploy
kompose up
