import { Entity, Ship } from "../state";

export const isShip = (entity: Entity): entity is Ship =>
  entity.type === "ship";
