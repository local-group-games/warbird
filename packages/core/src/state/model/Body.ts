import { type } from "@colyseus/schema";
import { Entity, EntityOptions } from "./Entity";

export type BodyOptions = EntityOptions & {
  x?: number;
  y?: number;
  angle?: number;
  angularVelocity?: number;
  mass?: number;
};

export class Body extends Entity {
  @type("number")
  x: number = 0;
  @type("number")
  y: number = 0;
  @type("number")
  angle: number = 0;
  @type("number")
  angularVelocity: number = 0;
  @type("number")
  mass: number = 0;

  constructor(options: BodyOptions) {
    super(options);

    this.type = "body";

    Object.assign(this, options);
  }
}
