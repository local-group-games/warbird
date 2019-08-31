import { Entity } from "./Entity";

export interface Destructible {
  health: number;
}

export const isDestructible = <T extends Entity>(entity: T) =>
  typeof (entity as any).health === "number";
