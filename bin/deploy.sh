#!/bin/bash

./node_modules/.bin/lerna clean
rm -rf node_modules
docker login -u oauth2accesstoken -p "$(gcloud auth print-access-token)" https://gcr.io
kompose down
kompose up
