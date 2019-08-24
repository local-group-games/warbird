import { MapSchema, Schema, type, ArraySchema } from "@colyseus/schema";
import { PlayerCommandPayload } from "../protocol/input";
import { PhysicsState } from "./physics";

export class Tile extends Schema {
  @type("number")
  x: number = 0;
  @type("number")
  y: number = 0;
}

export class SystemState extends Schema {
  @type(PhysicsState)
  physics: PhysicsState = new PhysicsState();
  @type({ map: "number" })
  entityIdsByClientId = new MapSchema<string>();
  @type([Tile])
  tiles = new ArraySchema<Tile>();
}
