import { Body } from "./Body";
import { CollisionGroup } from "./collision";

export class Ship extends Body {
  type = "ship";
  mass = 2;
  width = 1;
  height = 2;

  lastFireTime = 0;
  collisionGroup = CollisionGroup.Vehicle;
  collisionMask =
    CollisionGroup.Vehicle | CollisionGroup.Projectile | CollisionGroup.Static;
}
