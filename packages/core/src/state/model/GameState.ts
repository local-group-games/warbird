import { Body } from "./Body";
import { Entity } from "./Entity";
import { Player } from "./Player";

export interface GameState {
  entities: { [entityId: string]: Entity };
  bodies: { [bodyId: string]: Body };
  players: { [playerId: string]: Player };
}
