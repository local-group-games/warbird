import { MapSchema, Schema, type } from "@colyseus/schema";
import { Body } from "../model/Body";

export class PhysicsState extends Schema {
  @type({ map: Body })
  bodies = new MapSchema<Body>();
}
