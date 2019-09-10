import { Schema, type } from "@colyseus/schema";

export class Weapon extends Schema {
  @type("uint8")
  fireRate = 2;
  @type("uint32")
  lastFireTime = 0;
  @type("uint8")
  energyCost = 10;
  @type("uint8")
  projectileVelocity = 25;
}
