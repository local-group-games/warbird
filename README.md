# colyseus-test

## Description

This is an example project of how one might set up an action MOG using [Colyseus](https://colyseus.io) for networking, [p2.js](https://github.com/schteppe/p2.js) for physics, and [three.js](https://threejs.org) for rendering.

## Setup

```sh
yarn                              # Install project dependencies
yarn dev                          # Docker Compose development workflow
yarn dev:server & yarn dev:client # Host development workflow
```

## Overview

The project is a [Lerna](https://github.com/lerna/lerna) monorepo broken up into four major packages: `ecs`, `core`, `server`, and `client`.

### [`colyseus-test-ecs`](packages/ecs)

The [`colyseus-test-ecs`](packages/ecs) package contains tools to help organize server-side game logic using the using the [Entity-Component System](https://en.wikipedia.org/wiki/Entity_component_system) (ECS) pattern.

### [`colyseus-test-core`](packages/core)

The [`colyseus-test-core`](packages/core) package contains game entities, components, and systems. In addition, `core` houses shared helpers and networking protocols used by both server and client packages.

### [`colyseus-test-server`](packages/server)

The [`colyseus-test-server`](packages/server) package houses the game server that contains a single room used in each arena. Currently, the server does not scale and is limited to a single room.

### [`colyseus-test-client`](packages/client)

The [`colyseus-test-client`](packages/client) package houses a web client for the game. The game is rendered using three.js and the UI is built with React.

