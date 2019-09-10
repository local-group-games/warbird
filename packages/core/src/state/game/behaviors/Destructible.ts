import { type } from "@colyseus/schema";
import { Constructor } from "../../../types/Constructor";

export interface IDestructible {
  health: number;
  invulnerable: boolean;
}

export function Destructible<T extends Constructor<{}>>(Base: T) {
  class BaseWithDestructible extends Base implements IDestructible {
    @type("uint8")
    health: number = 1;
    @type("boolean")
    invulnerable: boolean = false;
  }

  return BaseWithDestructible;
}

export const isDestructible = (entity: object): entity is IDestructible =>
  typeof (entity as any).health === "number";
