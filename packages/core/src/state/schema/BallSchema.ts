import { Ball } from "../model/Ball";
import { CollisionGroup } from "../model/Body";
import { Entity } from "../model/Entity";
import { BodySchema } from "./BodySchema";

const ballType = "ball";

export class BallSchema extends BodySchema implements Ball {
  type = ballType;
  mass = 0.6;
  width = 1;
  height = 1;
  damping = 0.5;
  angularDamping = 0.5;
  collisionGroup = CollisionGroup.Vehicle;
  collisionMask =
    CollisionGroup.Projectile | CollisionGroup.Static | CollisionGroup.Vehicle;
}

export const isBall = (entity: Entity): entity is BallSchema =>
  entity.type === ballType;
