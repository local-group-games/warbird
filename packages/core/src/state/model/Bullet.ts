import { Body } from "./Body";
import { CollisionGroup } from "./collision";

export class Bullet extends Body {
  type = "bullet";
  mass = 0.1;
  width = 0.3;
  height = 0.3;

  collisionGroup = CollisionGroup.Projectile;
  collisionMask = CollisionGroup.Static | CollisionGroup.Vehicle;
}
