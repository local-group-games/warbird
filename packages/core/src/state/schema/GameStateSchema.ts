import { MapSchema, Schema, type } from "@colyseus/schema";
import { GameState } from "../model/GameState";
import { EntitySchema } from "./EntitySchema";
import { PlayerSchema } from "./PlayerSchema";

export class GameStateSchema extends Schema implements GameState {
  @type({ map: EntitySchema })
  entities = new MapSchema<EntitySchema>();
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();
}
