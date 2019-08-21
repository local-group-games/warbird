import { MapSchema, Schema, type } from "@colyseus/schema";
import { BodyState } from "./BodyState";

export class PhysicsState extends Schema {
  @type({ map: BodyState })
  bodies = new MapSchema<BodyState>();
}
