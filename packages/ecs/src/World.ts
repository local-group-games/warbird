import { MapSchema } from "@colyseus/schema";
import { ChangeTree } from "@colyseus/schema/lib/ChangeTree";
import { Clock } from "colyseus";
import { Entity } from "./Entity";
import { Query, QueryConfig, QueryResult } from "./Query";
import { PureSystem, System } from "./System";

function getInitialQueryResult<Q extends Query>(query: Q) {
  const result = {};

  for (const queryName in query) {
    (result as any)[queryName] = [];
  }

  return result as QueryResult<Q>;
}

export class World<S extends { [key: string]: System } = {}> {
  private readonly schema: MapSchema<Entity>;
  private entities = new Set<string>();
  private pureSystems: PureSystem[] = [];
  private queryBySystem = new Map<System | PureSystem, Query>();
  private queryResultBySystem = new Map<System | PureSystem, QueryResult>();
  private adding = new Set<Entity>();
  private removing = new Set<Entity>();

  readonly clock: Clock;
  readonly changes = {
    added: new Set<Entity>(),
    updated: new Set<Entity>(),
    removed: new Set<Entity>(),
  };
  readonly systems: S;

  constructor(clock: Clock, schema: MapSchema<Entity>, systems?: S) {
    this.clock = clock;
    this.schema = schema;
    this.systems = systems as S;

    for (const systemKey in this.systems) {
      const system = this.systems[systemKey];

      system.initialize(this);
      this.queryBySystem.set(system, system.query);
    }

    for (const entityId in schema) {
      this.registerEntity(schema[entityId]);
    }
  }

  registerPureSystem<C extends QueryConfig>(
    pureSystem: PureSystem<C>,
    query: Query<C>,
  ) {
    const system = pureSystem as PureSystem;

    this.pureSystems.push(system);
    this.queryBySystem.set(system, query);
  }

  registerEntity = (entity: Entity) => {
    this.schema[entity.id] = entity;
    this.changes.added.add(entity);
    this.entities.add(entity.id);

    for (const [system, query] of this.queryBySystem) {
      let result = this.queryResultBySystem.get(system);

      if (!result) {
        result = getInitialQueryResult(query);
        this.queryResultBySystem.set(system, result);
      }

      for (const queryName in query) {
        const select = query[queryName];
        const entities = result[queryName];

        if (select.every(ctor => entity.hasComponent(ctor))) {
          entities.push(entity);
        }
      }
    }
  };

  unregisterEntity = (entity: Entity) => {
    delete this.schema[entity.id];
    this.changes.removed.add(entity);
    this.entities.delete(entity.id);

    for (const [system, query] of this.queryBySystem) {
      const result = this.queryResultBySystem.get(system);

      if (!result) {
        continue;
      }

      for (const queryName in query) {
        const select = query[queryName];
        const entities = result[queryName] as Entity[];

        if (select.every(ctor => entity.hasComponent(ctor))) {
          entities.splice(entities.indexOf(entity), 1);
        }
      }
    }
  };

  tick() {
    for (const systemKey in this.systems) {
      const system = this.systems[systemKey];
      const result = this.queryResultBySystem.get(system);

      if (result) {
        system.execute(result);
      }
    }

    for (let i = 0; i < this.pureSystems.length; i++) {
      const system = this.pureSystems[i];
      const result = this.queryResultBySystem.get(system);

      if (result) {
        system(this, result);
      }
    }

    this.changes.added.clear();
    this.changes.removed.clear();
    this.changes.updated.clear();

    const changes = (this.schema as any).$changes as ChangeTree;

    for (const entityId of changes.changes as string[]) {
      this.changes.updated.add(this.schema[entityId]);
    }

    this.adding.forEach(this.registerEntity);
    this.removing.forEach(this.unregisterEntity);
    this.adding.clear();
    this.removing.clear();
  }

  addEntity(entity: Entity) {
    this.adding.add(entity);
  }

  removeEntity(entity: Entity) {
    this.removing.add(entity);
  }

  getEntityById(id: string) {
    return (this.schema[id] as Entity) || null;
  }
}
