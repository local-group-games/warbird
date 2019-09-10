import { Body } from "../physics/Body";
import { Expireable } from "./behaviors/Expireable";
import { CollisionGroup } from "./CollisionGroup";
import { createIsEntity, EntityType } from "./EntityType";

export class Projectile extends Expireable(Body) {
  type = EntityType.Projectile;
  createdTimeMs = Date.now();
  lifeTimeMs = 1000;
  mass = 0.1;
  width = 0.3;
  height = 0.3;
  collisionGroup = CollisionGroup.Projectile;
  collisionMask = CollisionGroup.Static | CollisionGroup.Vehicle;
  fixedRotation = true;
}

export const isProjectile = createIsEntity<Projectile>(EntityType.Projectile);
