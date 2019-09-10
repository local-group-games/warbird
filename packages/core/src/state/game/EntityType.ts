import { Entity } from "../Entity";

export enum EntityType {
  Tile,
  Ball,
  Ship,
  Projectile,
  Wreckage,
}

export function createIsEntity<T extends Entity>(type: EntityType) {
  return (entity: Entity): entity is T => entity.type === type;
}
