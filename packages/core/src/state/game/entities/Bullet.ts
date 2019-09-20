import { Body } from "../components/Body";
import { Expireable } from "../components/Expireable";
import { CollisionGroup } from "../CollisionGroup";
import { createIsEntity, EntityType } from "../EntityType";
import { Projectile } from "../components/Projectile";
import { Entity } from "../../Entity";

export class Bullet extends Entity {
  type = EntityType.Bullet;

  constructor() {
    super();

    const body = new Body();
    const projectile = new Projectile();
    const expireable = new Expireable();

    body.mass = 0.1;
    body.width = 0.3;
    body.height = 0.3;
    body.collisionGroup = CollisionGroup.Projectile;
    body.collisionMask = CollisionGroup.Static | CollisionGroup.Vehicle;
    body.fixedRotation = true;

    expireable.lifeTimeMs = 1000;

    this.addComponent(projectile, expireable, body);
  }
}

export const isProjectile = createIsEntity<Bullet>(EntityType.Bullet);
