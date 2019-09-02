import { Capacitor } from "./Capacitor";
import { Entity } from "./Entity";
import { WeaponSystem } from "./WeaponSystem";

export interface Ship extends Entity, Capacitor, WeaponSystem {}
