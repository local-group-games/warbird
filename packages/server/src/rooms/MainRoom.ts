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

const map = pattern.map(([x, y]) => [x + 10, y + 10]);

export class MainRoom extends Room<SystemState> {
  private physics: P2PhysicsDriver;
  private commandsByClient = new WeakMap<Client, PlayerCommandPayload>();
  private entitiesToAdd = new Set<Entity>();

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
      onCollisionStart: (a, b) => {
        if (a.type === "bullet" && b.type === "tile") {
          (b as Tile).health -= 25;
          delete this.state.entities[a.id];
        } else if (a.type === "tile" && b.type === "bullet") {
          (a as Tile).health -= 25;
          delete this.state.entities[b.id];
        }
      },
      onCollisionEnd: () => {},
    });

    for (const [x, y] of map) {
      this.addEntity(new Tile({ id: nanoid(), x, y }));
    }

    this.addEntity(
      new Ball({
        id: nanoid(),
        x: -10,
        y: -10,
      }),
    );

    this.setState(system);
    this.setSimulationInterval(this.update);
    this.physics = physics;
  }

  addEntity(entity: Entity) {
    this.entitiesToAdd.add(entity);
  }

  onJoin(client: Client) {
    const id = client.sessionId;
    const x = (Math.random() - 0.5) * -5;
    const y = (Math.random() - 0.5) * -5;
    const ship = new Ship({ id, x, y });

    this.addEntity(ship);
    this.state.entityIdsByClientSessionId[client.sessionId] = ship.id;
    this.commandsByClient.set(client, {
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
        const command: PlayerCommandPayload = this.commandsByClient.get(client);

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

  onLeave(client: Client) {
    const entityId = this.state.entityIdsByClientSessionId[client.sessionId];

    delete this.state.entities[entityId];
    delete this.state.entityIdsByClientSessionId[client.sessionId];

    this.commandsByClient.delete(client);
  }

  update = (deltaTime: number) => {
    const now = Date.now();

    this.entitiesToAdd.forEach(
      entity => (this.state.entities[entity.id] = entity),
    );
    this.entitiesToAdd.clear();

    for (const client of this.clients) {
      const command = this.commandsByClient.get(client);
      const entityId = this.state.entityIdsByClientSessionId[client.sessionId];
      const ship = this.state.entities[entityId];

      if (command.thrustForward || command.thrustReverse) {
        const thrust =
          (Number(command.thrustForward) - Number(command.thrustReverse)) *
          10 *
          (command.afterburners ? 2 : 1);

        this.physics.applyForceLocal(ship, [0, thrust]);
      }

      if (command.turnLeft || command.turnRight) {
        const turn =
          (Number(command.turnLeft) - Number(command.turnRight)) * 0.075;

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

    for (const entityId in this.state.entities) {
      const entity = this.state.entities[entityId];

      if (isBullet(entity) && now - entity.createdTime >= 1000) {
        delete this.state.entities[entity.id];
      }

      if (isDestructible(entity) && entity.health <= 0) {
        delete this.state.entities[entity.id];
      }
    }

    this.physics.update(deltaTime);
  };

  onDispose() {
    this.physics.dispose();
  }
}
