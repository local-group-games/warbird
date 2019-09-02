import { CollisionGroup } from "../model/Body";
import { Projectile } from "../model/Projectile";
import { EntitySchema } from "./EntitySchema";

const bulletType = "bullet";

export class BulletSchema extends EntitySchema implements Projectile {
  type = bulletType;

  createdTimeMs = Date.now();
  lifeTimeMs = 1000;

  getBodyOptions() {
    return {
      mass: 0.1,
      width: 0.3,
      height: 0.3,
      collisionGroup: CollisionGroup.Projectile,
      collisionMask: CollisionGroup.Static | CollisionGroup.Vehicle,
    };
  }
}

export const isBullet = (entity: any): entity is BulletSchema =>
  entity.type === bulletType;
