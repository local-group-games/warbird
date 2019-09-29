import { Entity } from "@warbird/ecs";
import { CollisionGroup } from "../CollisionGroup";
import { Destructible } from "../components";
import { Body } from "../components/Body";
import { Expireable } from "../components/Expireable";
import { EntityType } from "../EntityType";

export class Tile extends Entity {
  type = EntityType.Tile;

  constructor() {
    super();

    const body = new Body();
    const destructible = new Destructible();
    const expireable = new Expireable();

    body.mass = 0;
    body.collisionGroup = CollisionGroup.Static;
    body.collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;

    destructible.health = 100;

    this.addComponent(body);
    this.addComponent(expireable);
    this.addComponent(destructible);
  }
}
