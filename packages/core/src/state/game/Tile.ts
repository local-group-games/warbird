import { Body } from "../physics/Body";
import { Destructible } from "./behaviors/Destructible";
import { Expireable } from "./behaviors/Expireable";
import { CollisionGroup } from "./CollisionGroup";
import { createIsEntity, EntityType } from "./EntityType";

export class Tile extends Expireable(Destructible(Body)) {
  type = EntityType.Tile;

  health = 100;

  mass = 0;
  collisionGroup = CollisionGroup.Static;
  collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;
}

export const isTile = createIsEntity<Tile>(EntityType.Tile);
