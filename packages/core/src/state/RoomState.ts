import { MapSchema, Schema, type } from "@colyseus/schema";
import { Entity } from "colyseus-test-ecs";
import { Player } from "./Player";

export class RoomState extends Schema {
  @type({ map: Entity })
  entities = new MapSchema<Entity>();
  @type({ map: Player })
  players = new MapSchema<Player>();
}
