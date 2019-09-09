import { Message } from "./Message";

export enum GameMessageType {
  PlayerCommand,
  PlaceTile,
  ChangeWeapon,
}

export type PlayerInputs = {
  thrustForward: boolean;
  thrustReverse: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  afterburners: boolean;
  activateWeapon: boolean;
};

export type PlayerInputMessage<
  T extends keyof PlayerInputs = keyof PlayerInputs
> = Message<GameMessageType.PlayerCommand, [T, PlayerInputs[T]]>;
export type PlaceTile = Message<GameMessageType.PlaceTile, [number, number]>;
export type ChangeWeapon = Message<GameMessageType.ChangeWeapon, number>;

export function command<K extends keyof PlayerInputs>(
  type: K,
  value: PlayerInputs[K],
): PlayerInputMessage<K> {
  return [GameMessageType.PlayerCommand, [type, value]];
}

export function placeTile(x: number, y: number): PlaceTile {
  return [GameMessageType.PlaceTile, [x, y]];
}

export function changeWeapon(index: number): ChangeWeapon {
  return [GameMessageType.ChangeWeapon, index];
}

export type GameMessage = PlayerInputMessage | PlaceTile | ChangeWeapon;
