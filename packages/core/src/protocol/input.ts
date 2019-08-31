import { Message } from "./Message";

export enum GameMessageType {
  PlayerCommand,
  PlaceTile,
}

export type PlayerCommandPayload = {
  thrustForward: boolean;
  thrustReverse: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  afterburners: boolean;
  fire: boolean;
};

export type PlayerCommand<
  T extends keyof PlayerCommandPayload = keyof PlayerCommandPayload
> = Message<GameMessageType.PlayerCommand, [T, PlayerCommandPayload[T]]>;
export type PlaceTile = Message<GameMessageType.PlaceTile, [number, number]>;

export function command<K extends keyof PlayerCommandPayload>(
  type: K,
  value: PlayerCommandPayload[K],
): PlayerCommand<K> {
  return [GameMessageType.PlayerCommand, [type, value]];
}

export function placeTile(x: number, y: number): PlaceTile {
  return [GameMessageType.PlaceTile, [x, y]];
}

export type GameMessage = PlayerCommand | PlaceTile;
