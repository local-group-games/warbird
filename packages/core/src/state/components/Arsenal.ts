import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export interface WeaponProps {
  fireRate: number;
  lastFireTime: number;
  energyCost: number;
  projectileVelocity: number;
}

export class Weapon extends Schema implements WeaponProps {
  @type("uint8")
  fireRate = 2;
  @type("uint32")
  lastFireTime = 0;
  @type("uint8")
  energyCost = 10;
  @type("uint8")
  projectileVelocity = 25;
}

export interface ArsenalProps {
  weapons: WeaponProps[];
  activeWeapon: number;
}

export class Arsenal extends Component implements ArsenalProps {
  getType() {
    return ComponentType.Arsenal;
  }

  @type([Weapon])
  weapons = new ArraySchema<Weapon>();
  @type("uint8")
  activeWeapon = 0;
}
