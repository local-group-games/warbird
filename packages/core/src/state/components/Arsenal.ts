import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

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

export class Arsenal extends Component {
  getType() {
    return ComponentType.Arsenal;
  }

  @type([Weapon])
  weapons = new ArraySchema<Weapon>();
  @type("uint8")
  activeWeapon = 0;
}
