import { type } from "@colyseus/schema";
import { CollisionGroup } from "../model/Body";
import { Entity } from "../model/Entity";
import { Tile } from "../model/Tile";
import { BodySchema } from "./BodySchema";

const tileType = "tile";

export class TileSchema extends BodySchema implements Tile {
  type = tileType;

  createdTimeMs = Date.now();
  lifeTimeMs = 0;

  @type("uint8")
  health = 100;
  @type("boolean")
  invulnerable = false;

  mass = 0;
  collisionGroup = CollisionGroup.Static;
  collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;
}

export const isTile = (entity: Entity): entity is Tile =>
  entity.type === tileType;
