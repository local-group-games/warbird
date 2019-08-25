import { Entity, Ball } from "../state";

export const isBall = (entity: Entity): entity is Ball =>
  entity.type === "ball";
