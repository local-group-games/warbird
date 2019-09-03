import { Capacitor } from "./Capacitor";
import { Entity } from "./Entity";
import { WeaponSystem } from "./WeaponSystem";
import { Body } from "./Body";

export interface Ship extends Entity, Body, Capacitor, WeaponSystem {}
