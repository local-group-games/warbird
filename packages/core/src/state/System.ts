import { World, ChangeMap } from "./World";

export type PureSystem<S extends { [key: string]: System } = {}> = (
  world: World<S>,
  deltaTimeMs: number,
  changeMap: ChangeMap,
) => void;

export abstract class System<S extends { [key: string]: System } = {}> {
  protected world: World<S>;

  initialize(world: World<S>) {
    this.world = world;
  }

  abstract execute(deltaTimeMs: number, changeMap: ChangeMap): void;
}
