import { Destructible } from "./Destructible";
import { Entity } from "./Entity";
import { Expireable } from "./Expireable";

export interface Tile extends Entity, Destructible, Expireable {}
