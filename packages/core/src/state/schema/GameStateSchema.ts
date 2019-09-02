import { MapSchema, Schema, type } from "@colyseus/schema";
import { GameState } from "../model/GameState";
import { BodySchema } from "./BodySchema";
import { EntitySchema } from "./EntitySchema";
import { PlayerSchema } from "./PlayerSchema";

export class GameStateSchema extends Schema implements GameState {
  @type({ map: EntitySchema })
  entities = new MapSchema<EntitySchema>();
  @type({ map: BodySchema })
  bodies = new MapSchema<BodySchema>();
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();
}
