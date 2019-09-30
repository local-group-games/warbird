import { Entity } from "@warbird/ecs";
import { CollisionGroup } from "../CollisionGroup";
import { Destructible, Inventory } from "../components";
import { Physical } from "../components/Physical";
import { Expireable } from "../components/Expireable";
import { Pickup } from "../components/Pickup";
import { EntityType } from "../EntityType";

export class Wreck extends Entity {
  type = EntityType.Wreck;

  constructor() {
    super();

    const body = new Physical();
    const expireable = new Expireable();
    const destructible = new Destructible();
    const pickup = new Pickup();
    const inventory = new Inventory();

    destructible.health = 100;

    body.mass = 0;
    body.collisionGroup = CollisionGroup.Static;
    body.collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;
    body.sensor = true;

    expireable.lifeTimeMs = 10000;

    this.addComponent(body);
    this.addComponent(expireable);
    this.addComponent(destructible);
    this.addComponent(pickup);
    this.addComponent(inventory);
  }
}
