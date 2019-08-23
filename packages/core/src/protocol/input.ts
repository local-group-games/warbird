import { Message } from "./Message";

export enum GameMessageType {
  PlayerCommand,
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

export function command<K extends keyof PlayerCommandPayload>(
  type: K,
  value: PlayerCommandPayload[K],
): PlayerCommand<K> {
  return [GameMessageType.PlayerCommand, [type, value]];
}

export type GameMessage = PlayerCommand;
