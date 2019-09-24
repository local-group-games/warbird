import { Entity } from "@warbird/ecs";
import { CollisionGroup } from "../CollisionGroup";
import { Destructible, Inventory } from "../components";
import { Body } from "../components/Body";
import { createIsEntity, EntityType } from "../EntityType";

export class Ball extends Entity {
  type = EntityType.Ball;

  constructor() {
    super();

    const body = new Body();
    const destructible = new Destructible();
    const inventory = new Inventory();

    destructible.health = 50;

    body.mass = 0.6;
    body.width = 1;
    body.height = 1;
    body.damping = 0.5;
    body.angularDamping = 0.5;
    body.collisionGroup = CollisionGroup.Vehicle;
    body.collisionMask =
      CollisionGroup.Projectile |
      CollisionGroup.Static |
      CollisionGroup.Vehicle;

    inventory.scrap = 1;

    this.addComponent(body, destructible, inventory);
  }
}

export const isBall = createIsEntity<Ball>(EntityType.Ball);
