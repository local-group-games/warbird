#!/bin/bash

nodemon \
  --ext ts \
  --watch ./packages/server/src/ \
  --exec "lerna run build --scope=@warbird/server --include-filtered-dependencies && cd ./packages/server && npm run start"
