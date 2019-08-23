#!/bin/bash

lerna run build \
  --scope=colyseus-test-server \
  --include-filtered-dependencies
