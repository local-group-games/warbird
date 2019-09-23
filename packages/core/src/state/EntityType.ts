import { Entity } from "colyseus-test-ecs";

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
