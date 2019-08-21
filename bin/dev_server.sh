#!/bin/bash

nodemon \
  --ext ts \
  --watch ./packages/server/src/ \
  --exec "lerna run build --scope=colyseus-test-server && cd ./packages/server && npm run start"
