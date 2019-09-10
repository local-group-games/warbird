import { Body } from "../physics";
import { Destructible } from "./behaviors/Destructible";
import { Expireable } from "./behaviors/Expireable";
import { CollisionGroup } from "./CollisionGroup";
import { createIsEntity, EntityType } from "./EntityType";

export class Wreckage extends Expireable(Destructible(Body)) {
  type = EntityType.Wreckage;

  lifeTimeMs = 10000;

  health = 100;

  mass = 0;
  collisionGroup = CollisionGroup.Static;
  collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;
  sensor = true;
}
export const isWreckage = createIsEntity<Wreckage>(EntityType.Wreckage);
