import { type } from "@colyseus/schema";
import { Constructor } from "../../../types/Constructor";

export interface ICapacitor {
  energy: number;
}

export function Capacitor<T extends Constructor<{}>>(Base: T) {
  class BaseWithCapacitor extends Base implements ICapacitor {
    @type("uint16")
    energy: number = 0;
  }

  return BaseWithCapacitor;
}
