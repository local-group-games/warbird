import { MapSchema, Schema, type } from "@colyseus/schema";
import { PlayerCommandPayload } from "../protocol/input";
import { PhysicsState } from "./physics";

export class SystemState extends Schema {
  @type(PhysicsState)
  physics: PhysicsState = new PhysicsState();
  @type({ map: "number" })
  entityIdsByClientId = new MapSchema<string>();
}
