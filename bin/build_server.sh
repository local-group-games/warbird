#!/bin/bash

lerna run build \
  --scope=@warbird/server \
  --include-filtered-dependencies
