import { Entity } from "../../Entity";
import { CollisionGroup } from "../CollisionGroup";
import { Destructible } from "../components";
import { Body } from "../components/Body";
import { Expireable } from "../components/Expireable";
import { createIsEntity, EntityType } from "../EntityType";
import { Pickup } from "../components/Pickup";

export class Wreck extends Entity {
  type = EntityType.Wreck;

  constructor() {
    super();

    const body = new Body();
    const expireable = new Expireable();
    const destructible = new Destructible();
    const pickup = new Pickup();

    destructible.health = 100;

    body.mass = 0;
    body.collisionGroup = CollisionGroup.Static;
    body.collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;
    body.sensor = true;

    expireable.lifeTimeMs = 10000;

    this.addComponent(body, expireable, destructible, pickup);
  }
}

export const isWreck = createIsEntity<Wreck>(EntityType.Wreck);
