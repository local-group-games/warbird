import { Schema, type } from "@colyseus/schema";

export class BodyState extends Schema {
  @type("number")
  x: number;
  @type("number")
  y: number;
}
