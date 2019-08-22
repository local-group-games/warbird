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

export type PlayerCommand = Message<
  GameMessageType.PlayerCommand,
  PlayerCommandPayload
>;

export function command(payload: PlayerCommandPayload): PlayerCommand {
  return [GameMessageType.PlayerCommand, payload];
}

export type GameMessage = PlayerCommand;
