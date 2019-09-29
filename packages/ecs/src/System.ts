import { Query, QueryConfig, QueryResult } from "./Query";
import { World } from "./World";

export type PureSystem<
  C extends QueryConfig = QueryConfig,
  S extends { [key: string]: System } = {}
> = (world: World<S>, results: QueryResult<Query<C>>) => void;

export abstract class System<
  C extends QueryConfig = QueryConfig,
  S extends { [key: string]: System } = {}
> {
  private _world: World<S> | null = null;

  protected get world() {
    if (!this._world) {
      throw new Error(
        "Cannot access field `world` before System is initialized.",
      );
    }

    return this._world;
  }

  abstract readonly query: Query<C>;

  initialize(world: World<S>) {
    this._world = world;
  }

  abstract execute(entities: QueryResult<Query<C>>): void;
}
