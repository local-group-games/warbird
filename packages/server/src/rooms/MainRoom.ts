import { Client, Room } from "colyseus";
import {
  Ball,
  GameMessage,
  GameMessageType,
  PhysicsDriver,
  PlayerCommandPayload,
  Ship,
  SystemState,
  Tile,
  Bullet,
  getBulletOptions,
  isBullet,
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
  private physics: PhysicsDriver;
  private commandsByClient = new WeakMap<Client, PlayerCommandPayload>();

  onCreate() {
    const system = new SystemState();
    const world = new World({
      gravity: [0, 0],
    });

    world.sleepMode = World.BODY_SLEEPING;
    world.defaultContactMaterial.restitution = 0.35;

    const physics = new PhysicsDriver(system.entities, world);

    for (const [x, y] of map) {
      const id = nanoid();
      const tile = new Tile({ id, x, y });

      system.entities[id] = tile;
    }

    const id = nanoid();
    const ball = new Ball({
      id,
      x: -10,
      y: -10,
    });

    system.entities[id] = ball;

    this.setState(system);
    this.setSimulationInterval(this.update);
    this.physics = physics;
  }

  onJoin(client: Client) {
    const id = client.sessionId;
    const x = (Math.random() - 0.5) * -5;
    const y = (Math.random() - 0.5) * -5;
    const body = new Ship({ id, x, y });

    this.state.entities[id] = body;
    this.state.entityIdsByClientSessionId[client.sessionId] = body.id;
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
    const [type, payload] = message;

    if (type === GameMessageType.PlayerCommand) {
      const [key, value] = payload;
      const command: PlayerCommandPayload = this.commandsByClient.get(client);

      command[key] = value;
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

      if (command.fire) {
        if (now - ship.lastFireTime > 100) {
          const id = nanoid();
          const bullet = new Bullet({
            id,
            ...getBulletOptions(ship),
          });

          this.state.entities[id] = bullet;

          ship.lastFireTime = now;
        }
      }
    }

    const bullets = Object.values(this.state.entities).filter(isBullet);

    for (const bullet of bullets) {
      if (now - bullet.createdTime >= 1000) {
        delete this.state.entities[bullet.id];
      }
    }

    this.physics.update(deltaTime);
  };

  onDispose() {
    this.physics.dispose();
  }
}
