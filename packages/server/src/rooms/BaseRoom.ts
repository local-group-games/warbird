import {
  Arsenal,
  Body,
  Destructible,
  Expireable,
  GameMessage,
  GameMessageType,
  Inventory,
  Player,
  RoomState,
  Ship,
  Tile,
  Weapon,
  World,
  isShip,
  Pickup,
  Projectile,
  Capacitor,
} from "@warbird/core";
import { Client, Room } from "colyseus";
import {
  CapacitorSystem,
  DestructibleSystem,
  ExpireableSystem,
  PhysicsSystem,
  PickupSystem,
  ProjectileCollisionSystem,
  VehicleSystem,
} from "../systems";

export type WarbirdWorld = World<{
  vehicle: VehicleSystem;
  physics: PhysicsSystem;
}>;

export abstract class BaseRoom extends Room<RoomState> {
  private _world: WarbirdWorld | null = null;

  protected get world(): WarbirdWorld {
    if (!this._world) {
      throw new Error(`World accessed before onCreate() was called.`);
    }

    return this._world;
  }

  onCreate(options: any) {
    const state = new RoomState();
    const world = new World(this.clock, state.entities, {
      vehicle: new VehicleSystem(),
      physics: new PhysicsSystem(),
    });

    this._world = world;

    this.world.registerPureSystem(PickupSystem, {
      pickups: [Pickup],
    });
    this.world.registerPureSystem(DestructibleSystem, {
      destructibles: [Body, Destructible],
    });
    this.world.registerPureSystem(ProjectileCollisionSystem, {
      projectiles: [Projectile],
    });
    this.world.registerPureSystem(CapacitorSystem, { capacitors: [Capacitor] });
    this.world.registerPureSystem(ExpireableSystem, {
      expireables: [Expireable],
    });

    this.setState(state);
    this.setPatchRate((1 / 30) * 1000);
    this.setSimulationInterval(this.update);
  }

  spawn(player: Player) {
    const ship = new Ship();
    const shipDestructible = ship.getComponent(Destructible);
    const shipBody = ship.getComponent(Body);
    const arsenal = ship.getComponent(Arsenal);
    const weapon1 = new Weapon();
    const weapon2 = new Weapon();

    weapon2.fireRate = 1;
    weapon2.energyCost = 5;
    weapon2.projectileVelocity = 10;

    arsenal.weapons.push(weapon1, weapon2);
    arsenal.activeWeapon = 0;

    shipDestructible.health = 100;
    shipBody.x = (Math.random() - 0.5) * -5;
    shipBody.y = (Math.random() - 0.5) * -5;

    player.vehicleId = ship.id;
    ship.playerId = player.id;

    this.world.addEntity(ship);
  }

  onJoin(client: Client) {
    const { sessionId } = client;
    const player = new Player();

    player.id = sessionId;
    player.name = "<player_name>";
    player.connected = true;

    this.state.players[player.id] = player;
    this.spawn(player);
  }

  onMessage(client: Client, message: GameMessage) {
    const player: Player = this.state.players[client.sessionId];

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

        if (!player.vehicleId) {
          break;
        }

        const ship: Ship = this.state.entities[player.vehicleId];
        const inventory = ship.getComponent(Inventory);

        if (inventory.scrap <= 0) {
          break;
        }

        const tile = new Tile();
        const shipBody = ship.getComponent(Body);
        const tileBody = tile.getComponent(Body);
        const tileExpireable = tile.getComponent(Expireable);

        tileExpireable.lifeTimeMs = 30 * 60 * 1000;
        tileBody.x = x;
        tileBody.y = y;

        const queryWidth = tileBody.width / 2 - 0.01;
        const queryHeight = tileBody.height / 2 - 0.01;
        const query = this.world.systems.physics.aabbQuery(
          x,
          y,
          x + queryWidth,
          y + queryHeight,
        );

        if (
          query.length === 0 &&
          Math.abs(shipBody.x - tileBody.x) < 5 &&
          Math.abs(shipBody.y - tileBody.y) < 5
        ) {
          this.world.addEntity(tile);
          inventory.scrap -= 1;
        }

        break;
      }
      case GameMessageType.ChangeWeapon: {
        const index = message[1];
        const player: Player = this.state.players[client.sessionId];

        if (!player.vehicleId) {
          break;
        }

        const ship: Ship = this.state.entities[player.vehicleId];
        const arsenal = ship.getComponent(Arsenal);
        const weapon = arsenal.weapons[index];

        if (weapon) {
          arsenal.activeWeapon = index;
        }
      }
      default:
        break;
    }
  }

  async onLeave(client: Client) {
    const player: Player = this.state.players[client.sessionId];

    player.connected = false;

    try {
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);

      player.connected = true;
    } catch (e) {
      const { sessionId } = client;
      const player: Player = this.state.players[sessionId];

      if (player.vehicleId) {
        const ship: Ship = this.state.entities[player.vehicleId];

        if (ship) {
          this.world.removeEntity(ship);
        }

        delete this.state.players[sessionId];
      }
    }
  }

  findPlayerByShip(ship: Ship): Player | null {
    for (const clientId in this.clients) {
      const client = this.clients[clientId];
      const player: Player = this.state.players[client.sessionId];

      if (!player.vehicleId) {
        continue;
      }

      const playerShip = this.state.entities[player.vehicleId];

      if (ship === playerShip) {
        return player;
      }
    }

    return null;
  }

  update = () => {
    for (const client of this.clients) {
      const player: Player = this.state.players[client.sessionId];

      this.world.systems.vehicle.applyInput(player);
    }

    this.world.tick();

    this.world.changes.removed.forEach(entity => {
      if (!isShip(entity)) {
        return;
      }

      const { playerId } = entity;

      if (!playerId) {
        return;
      }

      const player = this.state.players[playerId];

      if (player) {
        setTimeout(() => this.spawn(player), 5000);
      }
    });
  };
}
