import { CollisionGroup } from "../model/Body";
import { Projectile } from "../model/Projectile";
import { BodySchema } from "./BodySchema";

const bulletType = "bullet";

export class BulletSchema extends BodySchema implements Projectile {
  type = bulletType;
  createdTimeMs = Date.now();
  lifeTimeMs = 1000;
  mass = 0.1;
  width = 0.3;
  height = 0.3;
  collisionGroup = CollisionGroup.Projectile;
  collisionMask = CollisionGroup.Static | CollisionGroup.Vehicle;
  fixedRotation = true;
}

export const isBullet = (entity: any): entity is BulletSchema =>
  entity.type === bulletType;
