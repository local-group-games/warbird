import { type, Schema } from "@colyseus/schema";
import { Body, CollisionGroup } from "../model/Body";
import nanoid = require("nanoid");

export class BodySchema extends Schema implements Body {
  @type("string")
  id: string = nanoid();
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

  constructor(options?: any) {
    super();

    if (options) {
      Object.assign(this, options);
    }
  }
}
