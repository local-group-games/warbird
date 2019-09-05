#!/bin/bash

# Remove symlinks (kompose compresses the directory and tar doensn't like symlinks)
# ./node_modules/.bin/lerna clean --yes
# rm -rf node_modules

gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://gcr.io

# Build docker images
docker build -t gcr.io/osmium-250702/osmium-client -f ./docker/prod-client.Dockerfile .
docker build -t gcr.io/osmium-250702/osmium-server -f ./docker/prod-server.Dockerfile .

# Push docker images
docker push gcr.io/osmium-250702/osmium-client
docker push gcr.io/osmium-250702/osmium-server

# Remove the active deployment
kubectl delete -f ./deploy

# Build, push, and deploy
kubectl create -f ./deploy
