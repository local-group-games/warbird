import { World } from "./World";

export type PureSystem<S extends { [key: string]: System } = {}> = (
  world: World<S>,
) => void;

export abstract class System<S extends { [key: string]: System } = {}> {
  private _world: World<S> | null = null;

  protected get world() {
    if (!this._world) {
      throw new Error(
        "Cannot access field `world` before System is initialized.",
      );
    }

    return this._world;
  }

  initialize(world: World<S>) {
    this._world = world;
  }

  abstract execute(): void;
}
