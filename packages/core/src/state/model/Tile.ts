import { Destructible } from "./Destructible";
import { Entity } from "./Entity";
import { Expireable } from "./Expireable";
import { Body } from "./Body";

export interface Tile extends Entity, Body, Destructible, Expireable {}
