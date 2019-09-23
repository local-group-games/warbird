import { Entity } from "../../Entity";
import { CollisionGroup } from "../CollisionGroup";
import { Destructible, Inventory, Vehicle } from "../components";
import { Body } from "../components/Body";
import { Capacitor } from "../components/Capacitor";
import { Arsenal } from "../components/Arsenal";
import { createIsEntity, EntityType } from "../EntityType";

export class Ship extends Entity {
  type = EntityType.Ship;

  constructor() {
    super();

    const capacitor = new Capacitor();
    const destructible = new Destructible();
    const arsenal = new Arsenal();
    const body = new Body();
    const inventory = new Inventory();
    const vehicle = new Vehicle();

    capacitor.energy = 100;

    body.mass = 2;
    body.width = 1;
    body.height = 2;
    body.angularDamping = 0.5;
    body.damping = 0.3;
    body.collisionGroup = CollisionGroup.Vehicle;
    body.collisionMask =
      CollisionGroup.Vehicle |
      CollisionGroup.Projectile |
      CollisionGroup.Static;

    this.addComponent(
      capacitor,
      destructible,
      arsenal,
      body,
      inventory,
      vehicle,
    );
  }
}

export const isShip = createIsEntity<Ship>(EntityType.Ship);
