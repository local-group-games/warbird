import { ArraySchema, type } from "@colyseus/schema";
import { Constructor } from "../../../types/Constructor";
import { Weapon } from "../Weapon";

export interface IWeaponSystem {
  weapons: Weapon[];
  activeWeapon: number;
}

export function WeaponSystem<T extends Constructor<{}>>(Base: T) {
  class BaseWithWeaponSystem extends Base implements IWeaponSystem {
    @type([Weapon])
    weapons = new ArraySchema<Weapon>();
    @type("uint8")
    activeWeapon = 0;
  }

  return BaseWithWeaponSystem;
}
