import { EntityType } from "@warbird/core";
import { createBall } from "./createBall";
import { createProjectile } from "./createProjectile";
import { createShip } from "./createShip";
import { createTile } from "./createTile";
import { createWreck } from "./createWreck";
import { RenderObject } from "../../types";

export const objectFactoryByEntityType: {
  [K in EntityType]: (...args: any[]) => Promise<RenderObject>;
} = {
  [EntityType.Ball]: createBall,
  [EntityType.Bullet]: createProjectile,
  [EntityType.Ship]: createShip,
  [EntityType.Tile]: createTile,
  [EntityType.Wreck]: createWreck,
};
