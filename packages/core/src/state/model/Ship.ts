import { Body, BodyOptions } from "./Body";

const SHIP_TYPE = "ship";

export type ShipOptions = BodyOptions & {};

export class Ship extends Body {
  constructor(options: ShipOptions) {
    super(options);
    this.type = SHIP_TYPE;
    this.mass = 1;
  }
}
