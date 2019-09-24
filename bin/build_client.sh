#!/bin/bash

lerna run build \
  --scope=@warbird/client \
  --include-filtered-dependencies
