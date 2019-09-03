import { Entity } from "./Entity";
import { Player } from "./Player";

export interface GameState {
  entities: { [entityId: string]: Entity };
  players: { [playerId: string]: Player };
}
