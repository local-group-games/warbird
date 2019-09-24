import { Entity } from "@warbird/ecs";

export enum EntityType {
  Tile,
  Ball,
  Ship,
  Bullet,
  Wreck,
}

export function createIsEntity<T extends Entity>(type: EntityType) {
  return (entity: Entity): entity is T => entity.type === type;
}
