import { Entity, Bullet } from "../state";

export const isBullet = (entity: Entity): entity is Bullet =>
  entity.type === "bullet";
