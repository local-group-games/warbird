#!/bin/bash

# Remove symlinks (kompose compresses the directory and tar doensn't like symlinks)
./node_modules/.bin/lerna clean --yes
rm -rf node_modules

# Log in to GCR
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://gcr.io

# Remove the active deployment
kompose down

# Build, push, and deploy
kompose up
