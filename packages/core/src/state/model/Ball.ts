import { Body } from "./Body";
import { CollisionGroup } from "./collision";

export class Ball extends Body {
  type = "ball";
  mass = 0.6;
  width = 1;
  height = 1;

  fixedRotation = true;
  damping = 0.3;
  collisionGroup = CollisionGroup.Projectile;
  collisionMask =
    CollisionGroup.Projectile | CollisionGroup.Static | CollisionGroup.Vehicle;
}
