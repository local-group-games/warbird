import { type } from "@colyseus/schema";
import { Constructor } from "../../../types/Constructor";

export interface IExpireable {
  createdTimeMs: number;
  lifeTimeMs: number;
}

export function Expireable<T extends Constructor<{}>>(Base: T) {
  class BaseWithExpireable extends Base implements IExpireable {
    @type("uint32")
    createdTimeMs: number = Date.now();
    @type("number")
    lifeTimeMs: number = Infinity;
  }

  return BaseWithExpireable;
}

export const isExpireable = (entity: object): entity is IExpireable =>
  typeof (entity as any).createdTimeMs === "number";
