import { Client, Room } from "colyseus";
import {
  BodySchema,
  BulletSchema,
  Destructible,
  EntitySchema,
  GameMessage,
  GameMessageType,
  GameStateSchema,
  getBulletOptions,
  isBullet,
  isDestructible,
  isExpireable,
  P2PhysicsDriver,
  PlayerCommandPayload,
  PlayerSchema,
  ShipSchema,
  TileSchema,
} from "colyseus-test-core";
import { World } from "p2";

const SHIP_BASE_THRUST = 10;
const SHIP_AFTERBURNER_THRUST_MODIFIER = 2;
const SHIP_BASE_TURN = 0.06;
const SHIP_ENERGY_PER_S = 20;
const SHIP_ENERGY_COST_PER_THRUST_PER_S = 2;

const PROJECTILE_BASE_DAMAGE = 25;

function getShipThrust(command: PlayerCommandPayload) {
  return (
    (Number(command.thrustForward) - Number(command.thrustReverse)) *
    SHIP_BASE_THRUST *
    (command.afterburners ? SHIP_AFTERBURNER_THRUST_MODIFIER : 1)
  );
}

function getShipTurn(command: PlayerCommandPayload) {
  return (
    (Number(command.turnLeft) - Number(command.turnRight)) * SHIP_BASE_TURN
  );
}

function shipCanFire(
  ship: ShipSchema,
  command: PlayerCommandPayload,
  now: number,
) {
  return (
    command.fire &&
    ship.energy >= ship.weapons[0].energyCost &&
    now - ship.weapons[0].lastFireTime >= ship.weapons[0].fireRate * 100
  );
}

export abstract class BaseRoom extends Room<GameStateSchema> {
  private physics: P2PhysicsDriver;
  private entitiesToAdd = new Set<EntitySchema>();
  private entitiesToRemove = new Set<EntitySchema>();

  onCreate(options: any) {
    const state = new GameStateSchema();
    const world = new World({
      gravity: [0, 0],
    });

    world.sleepMode = World.BODY_SLEEPING;
    world.defaultContactMaterial.restitution = 0.35;

    const physics = new P2PhysicsDriver({
      state: state.entities,
      world,
      onCollisionStart: this.onCollisionStart,
    });

    this.setState(state);
    this.setPatchRate((1 / 30) * 1000);
    this.setSimulationInterval(this.update);
    this.physics = physics;
  }

  onCollisionStart = (entityA: BodySchema, entityB: BodySchema) => {
    let projectile: BulletSchema;
    let destructible: Destructible;

    if (isBullet(entityA) && isDestructible(entityB) && !entityB.invulnerable) {
      projectile = entityA;
      destructible = entityB;
    } else if (
      isBullet(entityB) &&
      isDestructible(entityA) &&
      !entityA.invulnerable
    ) {
      projectile = entityB;
      destructible = entityA;
    }

    if (projectile && destructible) {
      destructible.health -= PROJECTILE_BASE_DAMAGE;
      this.removeEntity(projectile);
    }
  };

  addEntity(entity: EntitySchema) {
    this.entitiesToAdd.add(entity);
  }

  removeEntity(entity: EntitySchema) {
    this.entitiesToRemove.add(entity);
  }

  onJoin(client: Client) {
    const { sessionId } = client;
    const ship = new ShipSchema();

    ship.x = (Math.random() - 0.5) * -5;
    ship.y = (Math.random() - 0.5) * -5;

    const player = new PlayerSchema();

    player.id = sessionId;
    player.shipId = ship.id;
    player.name = "<player_name>";
    player.connected = true;

    this.state.players[player.id] = player;
    this.addEntity(ship);
  }

  onMessage(client: Client, message: GameMessage) {
    switch (message[0]) {
      case GameMessageType.PlayerCommand: {
        const [key, value] = message[1];
        const player = this.state.players[client.sessionId];

        player.command[key] = value;

        break;
      }
      case GameMessageType.PlaceTile: {
        const [x, y] = message[1].map(Math.round);
        const player: PlayerSchema = this.state.players[client.sessionId];
        const ship: ShipSchema = this.state.entities[player.shipId];
        const tile = new TileSchema();

        tile.lifeTimeMs = 30 * 60 * 1000;
        tile.x = x;
        tile.y = y;

        const queryWidth = tile.width / 2 - 0.01;
        const queryHeight = tile.height / 2 - 0.01;
        const query = this.physics.query(x, y, x + queryWidth, y + queryHeight);

        if (
          query.length === 0 &&
          Math.abs(ship.x - tile.x) < 5 &&
          Math.abs(ship.y - tile.y) < 5
        ) {
          this.addEntity(tile);
        }

        break;
      }
      default:
        break;
    }
  }

  async onLeave(client: Client) {
    const player: PlayerSchema = this.state.players[client.sessionId];

    player.connected = false;

    try {
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);

      player.connected = true;
    } catch (e) {
      const { sessionId } = client;
      const player: PlayerSchema = this.state.players[sessionId];
      const ship: ShipSchema = this.state.entities[player.shipId];

      if (ship) {
        this.removeEntity(ship);
      }

      delete this.state.players[sessionId];
    }
  }

  prune() {
    const now = Date.now();

    for (const entityId in this.state.entities) {
      const entity: EntitySchema = this.state.entities[entityId];

      if (
        (isExpireable(entity) &&
          now - entity.createdTimeMs >= entity.lifeTimeMs) ||
        (isDestructible(entity) && entity.health <= 0)
      ) {
        this.removeEntity(entity);
      }
    }
  }

  update = (deltaTime: number) => {
    const now = Date.now();
    const deltaTimeS = deltaTime / 1000;

    this.prune();

    for (const client of this.clients) {
      const player: PlayerSchema = this.state.players[client.sessionId];
      const ship: ShipSchema = this.state.entities[player.shipId];
      const { command } = player;

      if (!ship) {
        continue;
      }

      if (command.thrustForward || command.thrustReverse) {
        const thrust = getShipThrust(command);
        const thrustCost =
          thrust * SHIP_ENERGY_COST_PER_THRUST_PER_S * deltaTimeS;

        if (ship.energy >= thrustCost) {
          ship.energy -= thrustCost;

          this.physics.applyForceLocal(ship, [0, thrust]);
        }
      }

      if (command.turnLeft || command.turnRight) {
        const turn = getShipTurn(command);

        this.physics.rotate(ship, ship.angle + turn);
      }

      if (shipCanFire(ship, command, now)) {
        const bullet = new BulletSchema();

        Object.assign(bullet, getBulletOptions(ship));

        this.addEntity(bullet);

        ship.weapons[0].lastFireTime = now;
        ship.energy -= ship.weapons[0].energyCost;
      }

      ship.energy = Math.min(
        Math.max(0, ship.energy + SHIP_ENERGY_PER_S * deltaTimeS),
        100,
      );
    }

    this.entitiesToAdd.forEach(entity => {
      this.state.entities[entity.id] = entity;
    });
    this.entitiesToAdd.clear();

    this.entitiesToRemove.forEach(entity => {
      delete this.state.entities[entity.id];
    });
    this.entitiesToRemove.clear();

    this.physics.update(deltaTime);
  };

  onDispose() {
    this.physics.dispose();
  }
}
