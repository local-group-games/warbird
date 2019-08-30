import { MapSchema, Schema, type } from "@colyseus/schema";
import { Body } from "./model/Body";

export class SystemState extends Schema {
  @type({ map: Body })
  entities = new MapSchema<Body>();
  @type({ map: "string" })
  entityIdsByClientSessionId = new MapSchema<string>();
}
