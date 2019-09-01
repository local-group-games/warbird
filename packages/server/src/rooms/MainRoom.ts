import { Client, Room } from "colyseus";
import {
  Ball,
  Bullet,
  Entity,
  GameMessage,
  GameMessageType,
  getBulletOptions,
  isBullet,
  isDestructible,
  P2PhysicsDriver,
  PlayerCommandPayload,
  Ship,
  SystemState,
  Tile,
  StaticTile,
  Body,
  isTile,
} from "colyseus-test-core";
import nanoid from "nanoid";
import { World } from "p2";

const pattern: number[][] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [4, 0],
];

const SHIP_BASE_THRUST = 10;
const SHIP_AFTERBURNER_THRUST_MODIFIER = 2;
const SHIP_BASE_TURN = 0.06;

const map = pattern.map(([x, y]) => [x + 10, y + 10]);

export class MainRoom extends Room<SystemState> {
  private physics: P2PhysicsDriver;
  private commandsByClientId = new Map<string, PlayerCommandPayload>();
  private entitiesToAdd = new Set<Entity>();
  private entitiesToRemove = new Set<Entity>();

  onCreate() {
    const system = new SystemState();
    const world = new World({
      gravity: [0, 0],
    });

    world.sleepMode = World.BODY_SLEEPING;
    world.defaultContactMaterial.restitution = 0.35;

    const physics = new P2PhysicsDriver({
      state: system.entities,
      world,
      onCollisionStart: this.onCollisionStart,
    });

    for (const [x, y] of map) {
      this.addEntity(new StaticTile({ id: nanoid(), x, y }));
    }

    for (let i = 0; i < 10; i++) {
      this.addEntity(
        new Ball({
          id: nanoid(),
          x: Math.random() * -10,
          y: Math.random() * -10,
        }),
      );
    }

    this.setState(system);
    this.setPatchRate((1 / 30) * 1000);
    this.setSimulationInterval(this.update);
    this.physics = physics;
  }

  onCollisionStart = (a: Body, b: Body) => {
    if (isBullet(a) && isTile(b) && isDestructible(b)) {
      (b as Tile).health -= 25;
      this.removeEntity(a);
    } else if (isTile(a) && isBullet(b) && isDestructible(a)) {
      (a as Tile).health -= 25;
      this.removeEntity(b);
    }
  };

  addEntity(entity: Entity) {
    this.entitiesToAdd.add(entity);
  }

  removeEntity(entity: Entity) {
    this.entitiesToRemove.add(entity);
  }

  onJoin(client: Client) {
    const id = client.sessionId;
    const x = (Math.random() - 0.5) * -5;
    const y = (Math.random() - 0.5) * -5;
    const ship = new Ship({ id, x, y });

    this.addEntity(ship);
    this.state.entityIdsByClientSessionId[client.sessionId] = ship.id;
    this.commandsByClientId.set(client.sessionId, {
      thrustForward: false,
      thrustReverse: false,
      turnLeft: false,
      turnRight: false,
      afterburners: false,
      fire: false,
    });
  }

  onMessage(client: Client, message: GameMessage) {
    switch (message[0]) {
      case GameMessageType.PlayerCommand: {
        const [key, value] = message[1];
        const command: PlayerCommandPayload = this.commandsByClientId.get(
          client.id,
        );

        command[key] = value;
        break;
      }
      case GameMessageType.PlaceTile: {
        const [x, y] = message[1].map(Math.round);
        const player = this.state.entities[
          this.state.entityIdsByClientSessionId[client.sessionId]
        ];
        const tile = new Tile({ id: nanoid(), x, y });
        const w = tile.width / 2 - 0.01;
        const h = tile.height / 2 - 0.01;
        const query = this.physics.query(x, y, x + w, y + h);

        if (
          query.length === 0 &&
          Math.abs(player.x - x) < 5 &&
          Math.abs(player.y - y) < 5
        ) {
          this.addEntity(new Tile({ id: nanoid(), x, y }));
        }

        break;
      }
    }
  }

  async onLeave(client: Client) {
    try {
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);
    } catch (e) {
      console.log("RIP");
      const entityId = this.state.entityIdsByClientSessionId[client.sessionId];
      const entity = this.state.entities[entityId];

      delete this.state.entityIdsByClientSessionId[client.sessionId];

      this.removeEntity(entity);
      this.commandsByClientId.delete(client.id);
    }
  }

  update = (deltaTime: number) => {
    const now = Date.now();

    for (const entityId in this.state.entities) {
      const entity = this.state.entities[entityId];

      if (isBullet(entity) && now - entity.createdTime >= 1000) {
        this.removeEntity(entity);
      }

      if (isDestructible(entity) && entity.health <= 0) {
        this.removeEntity(entity);
      }
    }

    for (const client of this.clients) {
      const command = this.commandsByClientId.get(client.id);
      const entityId = this.state.entityIdsByClientSessionId[client.sessionId];
      const ship = this.state.entities[entityId];

      if (command.thrustForward || command.thrustReverse) {
        const thrust =
          (Number(command.thrustForward) - Number(command.thrustReverse)) *
          SHIP_BASE_THRUST *
          (command.afterburners ? SHIP_AFTERBURNER_THRUST_MODIFIER : 1);

        this.physics.applyForceLocal(ship, [0, thrust]);
      }

      if (command.turnLeft || command.turnRight) {
        const turn =
          (Number(command.turnLeft) - Number(command.turnRight)) *
          SHIP_BASE_TURN;

        this.physics.rotate(ship, ship.angle + turn);
      }

      if (command.fire && now - ship.lastFireTime >= 150) {
        const id = nanoid();
        const bullet = new Bullet({
          id,
          ...getBulletOptions(ship),
        });

        this.addEntity(bullet);

        ship.lastFireTime = now;
      }
    }

    this.entitiesToAdd.forEach(
      entity => (this.state.entities[entity.id] = entity),
    );
    this.entitiesToAdd.clear();

    this.entitiesToRemove.forEach(
      entity => delete this.state.entities[entity.id],
    );
    this.entitiesToRemove.clear();

    this.physics.update(deltaTime);
  };

  onDispose() {
    this.physics.dispose();
  }
}
