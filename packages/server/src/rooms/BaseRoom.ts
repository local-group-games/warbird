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
  isShip,
  isWreckage,
  P2PhysicsDriver,
  PlayerSchema,
  ShipSchema,
  TileSchema,
  WreckageSchema,
  WeaponSchema,
} from "colyseus-test-core";
import { World } from "p2";
import { detect } from "../helpers/detect";
import { getShipThrust } from "../helpers/getShipThrust";
import { getShipTurn } from "../helpers/getShipTurn";

const PLAYER_SPAWN_TIMEOUT = 2000;

const SHIP_ENERGY_PER_S = 20;
const SHIP_ENERGY_COST_PER_THRUST_PER_S = 2;

const PROJECTILE_BASE_DAMAGE = 25;

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

  onProjectileHit = (bullet: BulletSchema, destructible: Destructible) => {
    if (destructible.invulnerable) {
      return;
    }

    this.removeEntity(bullet);

    destructible.health -= PROJECTILE_BASE_DAMAGE;
  };

  onWreckageHit = (wreckage: WreckageSchema, ship: ShipSchema) => {
    const player = this.findPlayerByShip(ship);

    this.removeEntity(wreckage);

    if (player) {
      player.scrap += 3;
    }
  };

  onCollisionStart = (a: BodySchema, b: BodySchema) => {
    detect(isBullet, isDestructible, a, b, this.onProjectileHit);
    detect(isWreckage, isShip, a, b, this.onWreckageHit);
  };

  addEntity(entity: EntitySchema) {
    this.entitiesToAdd.add(entity);
  }

  removeEntity(entity: EntitySchema) {
    this.entitiesToRemove.add(entity);
  }

  spawn(player: PlayerSchema) {
    const ship = new ShipSchema();
    const weapon1 = new WeaponSchema();
    const weapon2 = new WeaponSchema();

    weapon2.fireRate = 1;
    weapon2.energyCost = 5;
    weapon2.projectileVelocity = 10;

    ship.weapons.push(weapon1, weapon2);
    ship.activeWeapon = 0;

    ship.x = (Math.random() - 0.5) * -5;
    ship.y = (Math.random() - 0.5) * -5;

    player.shipId = ship.id;

    this.addEntity(ship);
  }

  spawnWreckage(ship: ShipSchema) {
    const wreckage = new WreckageSchema();

    wreckage.x = ship.x;
    wreckage.y = ship.y;

    this.addEntity(wreckage);
  }

  onJoin(client: Client) {
    const { sessionId } = client;
    const player = new PlayerSchema();

    player.id = sessionId;
    player.name = "<player_name>";
    player.connected = true;

    this.state.players[player.id] = player;
    this.spawn(player);
  }

  onMessage(client: Client, message: GameMessage) {
    const player: PlayerSchema = this.state.players[client.sessionId];

    if (!player) {
      console.warn("Received message from unregistered client");
      return;
    }

    switch (message[0]) {
      case GameMessageType.PlayerCommand: {
        const [key, value] = message[1];

        player.input[key] = value;

        break;
      }
      case GameMessageType.PlaceTile: {
        const [x, y] = message[1].map(Math.round);

        if (player.scrap <= 0) {
          break;
        }

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
          player.scrap -= 1;
        }

        break;
      }
      case GameMessageType.ChangeWeapon: {
        const index = message[1];
        const player: PlayerSchema = this.state.players[client.sessionId];
        const ship: ShipSchema = this.state.entities[player.shipId];
        const weapon = ship.weapons[index];

        if (weapon) {
          ship.activeWeapon = index;
        }
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

  findPlayerByShip(ship: ShipSchema): PlayerSchema | null {
    for (const clientId in this.clients) {
      const client = this.clients[clientId];
      const player = this.state.players[client.sessionId];
      const playerShip = this.state.entities[player.shipId];

      if (ship === playerShip) {
        return player;
      }
    }

    return null;
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

        if (isShip(entity)) {
          this.spawnWreckage(entity);

          const player = this.findPlayerByShip(entity);

          if (player) {
            setTimeout(() => this.spawn(player), PLAYER_SPAWN_TIMEOUT);
          }
        }
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
      const { input: command } = player;

      if (!ship) {
        continue;
      }

      if (command.thrustForward || command.thrustReverse) {
        const thrust = getShipThrust(command);
        const thrustCost =
          Math.abs(thrust) * SHIP_ENERGY_COST_PER_THRUST_PER_S * deltaTimeS;

        if (ship.energy >= thrustCost) {
          ship.energy -= thrustCost;

          this.physics.applyForceLocal(ship, 0, thrust);
        }
      }

      if (command.turnLeft || command.turnRight) {
        const turn = getShipTurn(command);

        this.physics.rotate(ship, ship.angle + turn);
      }

      if (command.activateWeapon) {
        const weapon = ship.weapons[ship.activeWeapon];

        if (weapon) {
          const {
            energyCost,
            fireRate,
            lastFireTime,
            projectileVelocity,
          } = weapon;

          if (
            ship.energy >= energyCost &&
            now - lastFireTime >= fireRate * 100
          ) {
            const bullet = new BulletSchema();

            Object.assign(bullet, getBulletOptions(ship, projectileVelocity));

            this.addEntity(bullet);

            weapon.lastFireTime = now;
            ship.energy -= energyCost;
          }
        }
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
