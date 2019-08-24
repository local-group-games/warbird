import { MapSchema, Schema, type, ArraySchema } from "@colyseus/schema";
import { Body } from "./model/Body";

export class SystemState extends Schema {
  @type([Body])
  entities = new ArraySchema<Body>();
  @type({ map: "string" })
  entityIdsByClientSessionId = new MapSchema<string>();
}
