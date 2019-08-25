import { Entity, Tile } from "../state";

export const isTile = (entity: Entity): entity is Tile =>
  entity.type === "tile";
