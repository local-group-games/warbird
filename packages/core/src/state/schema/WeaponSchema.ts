import { Schema, type } from "@colyseus/schema";
import { Weapon } from "../model/WeaponSystem";

export class WeaponSchema extends Schema implements Weapon {
  @type("uint8")
  fireRate = 1;
  @type("uint32")
  lastFireTime = 0;
  @type("uint8")
  energyCost = 10;
}
