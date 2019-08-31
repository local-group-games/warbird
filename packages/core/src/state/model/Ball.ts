import { Body } from "./Body";
import { CollisionGroup } from "./collision";

export class Ball extends Body {
  type = "ball";
  mass = 0.6;
  width = 1;
  height = 1;

  damping = 0.5;
  angularDamping = 0.5;
  collisionGroup = CollisionGroup.Vehicle;
  collisionMask =
    CollisionGroup.Projectile | CollisionGroup.Static | CollisionGroup.Vehicle;
}
