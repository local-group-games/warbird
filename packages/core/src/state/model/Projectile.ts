import { Entity } from "./Entity";
import { Expireable } from "./Expireable";
import { Body } from "./Body";

export interface Projectile extends Entity, Body, Expireable {}
