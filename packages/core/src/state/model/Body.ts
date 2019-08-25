import { type } from "@colyseus/schema";
import { Entity, EntityOptions } from "./Entity";

export type BodyOptions = EntityOptions & {
  x?: number;
  y?: number;
  angle?: number;
  angularVelocity?: number;
  mass?: number;
  width?: number;
  height?: number;
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
  @type("number")
  width: number = 1;
  @type("number")
  height: number = 1;

  type = "body";

  constructor(options: BodyOptions) {
    super(options);
    Object.assign(this, options);
  }
}
