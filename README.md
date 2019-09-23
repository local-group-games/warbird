# colyseus-test

## Description

This is an example project of how one might set up an action MOG using [Colyseus](https://colyseus.io) for networking, [p2.js](https://github.com/schteppe/p2.js) for physics, and [three.js](https://threejs.org) for rendering.

## Setup

```sh
# Install project dependencies
yarn
# Start Docker Compose development workflow
yarn dev
# OR host development workflow
yarn dev:server & yarn dev:client
```

## Overview

The project is a [Lerna](https://github.com/lerna/lerna) monorepo broken up into three major packages: `core`, `server`, and `client`.

### Core

The `core` package contains game state, logic, helpers, and the network protocol.

#### Entity-Component System

Game state and logic is organized using a simple [Entity-Component System](https://en.wikipedia.org/wiki/Entity_component_system) (ECS) architecture where:

* Each Colyseus room has a single `World` that controls a `MapSchema` of `Entity` instances.
* Each game object is represented by an `Entity` and can contain one or more stateful `Component` instances.
* `Component` instances are pure data and don't contain any functionality (i.e. they can't operate on their own data).
* `Systems` operate on `Component` state.

A system is a function that takes a World as its first argument. This function will be executed each tick when it is registered with a World. This is a **pure system** (although this is a misnomer - a pure system is not a pure function), and have the signature:

```ts
const mySystem = (world: World) => {
  const entities = world.getEntitiesByComponent(Pickup);

  // do stuff with Pickup entities
}

world.registerPureSystem(mySystem);
```

Below is a full example of a `World`, `System`, `Entity` and `Component` working together.

```ts
import { Room } from "colyseus";
import { Schema, type } from "@colyseus/schema";
import { Component, Entity, World, System } from "colyseus-test-core";

class Physical extends Component {
  @type("float32")
  angle = 0;
}

// Bunny is a "prefab" Entity that has a single Physical component by default.
class Bunny extends Entity {
  constructor() {
    super();
    this.addComponent(new Physical());
  }
}

const rotator: System = world => {
  // Find all Entities with a Physical component.
  for (const entity of world.getEntitiesByComponent(Physical)) {
    const physical = entity.getComponent(Physical);

    physical.angle += 0.01;
  }
}

class MyRoom extends Room {
  constructor(options: any) {
    super(options);

    const state = new RoomState();
    // Create the World instance. The constructor takes a MapSchema<Entity> as its only argument.
    const world = new World(state.entities);

    // Register the pure rotator system.
    world.addPureSystem(rotator);
    // Create and register a new Bunny entity that has a single Physical component.
    world.addEntity(new Bunny());

    // Step the world.
    this.setSimulationInterval(dt => world.update(dt));
  }
}
```

If your system needs to maintain state between ticks, you can extends the `System` class. A system might be stateful if it interacts with a third party (e.g. a physics library) or needs to store information between frames (e.g. a server message to be processed next tick). Pure systems should be favored over stateful systems where possible.

```ts
class PhysicsSystem extends System {
  execute(deltaTimeMs: number, changes: ChangeMap) {
    const entities = this.world.getEntitiesByComponent(Physical);

    // do stuff with entities
  }

  rotate() {
    // ...
  }
}
```

Stateful systems are registered when the world is created and cannot be added dynamically.

```ts
const world = new World(state.entities, { physics: new PhysicsSystem() });
```

To reference a stateful system from another system, use `world.systems`:

```ts
function inputSystem(world: World<{ physics: PhysicsSystem }>) {
  world.systems.physics.rotate(...);
}
```

On the client, you can query and retrieve an Entity's components using static methods on the `Entity` class:

```ts
if (Entity.hasComponent(entity, Physical)) {
  // ... 
}
```

### Server

> TODO

### Client

> TODO

