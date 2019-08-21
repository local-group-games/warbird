#!/bin/bash

lerna run build \
  --scope=colyseus-test-client \
  --include-filtered-dependencies

lerna run start \
  --scope=colyseus-test-client \
  --stream
