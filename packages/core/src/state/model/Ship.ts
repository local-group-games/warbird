import { Body } from "./Body";
import { Capacitor } from "./Capacitor";
import { Destructible } from "./Destructible";
import { Entity } from "./Entity";
import { WeaponSystem } from "./WeaponSystem";

export interface Ship
  extends Entity,
    Body,
    Destructible,
    Capacitor,
    WeaponSystem {}
