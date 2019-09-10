import { Body } from "../physics/Body";
import { CollisionGroup } from "./CollisionGroup";
import { createIsEntity, EntityType } from "./EntityType";

export class Ball extends Body {
  type = EntityType.Ball;
  mass = 0.6;
  width = 1;
  height = 1;
  damping = 0.5;
  angularDamping = 0.5;
  collisionGroup = CollisionGroup.Vehicle;
  collisionMask =
    CollisionGroup.Projectile | CollisionGroup.Static | CollisionGroup.Vehicle;
}

export const isBall = createIsEntity<Ball>(EntityType.Ball);
