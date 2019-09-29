import { Entity } from "@warbird/ecs";
import { CollisionGroup } from "../CollisionGroup";
import { Body } from "../components/Body";
import { Expireable } from "../components/Expireable";
import { Projectile } from "../components/Projectile";
import { EntityType } from "../EntityType";

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

    this.addComponent(projectile);
    this.addComponent(expireable);
    this.addComponent(body);
  }
}
