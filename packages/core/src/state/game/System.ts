import { MapSchema, Schema, type } from "@colyseus/schema";
import { Entity } from "../Entity";
import { Player } from "./Player";

export class System extends Schema {
  @type({ map: Entity })
  entities = new MapSchema<Entity>();
  @type({ map: Player })
  players = new MapSchema<Player>();
}
