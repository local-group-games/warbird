import { type } from "@colyseus/schema";
import { CollisionGroup } from "../model/Body";
import { Entity } from "../model/Entity";
import { Tile } from "../model/Tile";
import { BodySchema } from "./BodySchema";
import { EntitySchema } from "./EntitySchema";

const tileType = "tile";

export class TileSchema extends EntitySchema implements Tile {
  type = tileType;

  createdTimeMs = Date.now();
  lifeTimeMs = 0;

  @type("uint8")
  health = 100;
  @type("boolean")
  invulnerable = false;

  getBodyOptions() {
    return {
      mass: 0,
      collisionGroup: CollisionGroup.Static,
      collisionMask: CollisionGroup.Projectile | CollisionGroup.Vehicle,
    };
  }
}

export const isTile = (entity: Entity): entity is Tile =>
  entity.type === tileType;
