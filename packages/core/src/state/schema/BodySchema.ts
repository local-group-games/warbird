import { type } from "@colyseus/schema";
import { Body, CollisionGroup } from "../model/Body";
import { EntitySchema } from "./EntitySchema";

export class BodySchema extends EntitySchema implements Body {
  @type("float32")
  x: number = 0;
  @type("float32")
  y: number = 0;
  @type("float32")
  angle: number = 0;
  @type("float32")
  width: number = 1;
  @type("float32")
  height: number = 1;

  mass = 0;
  angularVelocity = 0;
  velocityX = 0;
  velocityY = 0;
  angularDamping = 0;
  damping = 0;
  fixedRotation = false;
  collisionGroup = CollisionGroup.Static;
  collisionMask =
    CollisionGroup.Static | CollisionGroup.Projectile | CollisionGroup.Vehicle;
  sensor = false;
}

export const isBody = (entity: any): entity is BodySchema =>
  typeof entity.x === "number";
