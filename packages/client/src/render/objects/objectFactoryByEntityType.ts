import { Entity, EntityType } from "@warbird/core";
import { RenderObject } from "../../types";
import { createBall } from "./createBall";
import { createProjectile } from "./createProjectile";
import { createShip } from "./createShip";
import { createTile } from "./createTile";
import { createWreck } from "./createWreck";

export const objectFactoryByEntityType: {
  [key: number]: (entity: Entity) => RenderObject | Promise<RenderObject>;
} = {
  [EntityType.Ball]: createBall,
  [EntityType.Bullet]: createProjectile,
  [EntityType.Ship]: createShip,
  [EntityType.Tile]: createTile,
  [EntityType.Wreck]: createWreck,
};
