import { Entity } from "../../Entity";
import { CollisionGroup } from "../CollisionGroup";
import { Destructible } from "../components";
import { Body } from "../components/Body";
import { Expireable } from "../components/Expireable";
import { createIsEntity, EntityType } from "../EntityType";

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

    this.addComponent(body, expireable, destructible);
  }
}

export const isTile = createIsEntity<Tile>(EntityType.Tile);
