import { Clock, Server } from "colyseus";
import { MapSchema } from "@colyseus/schema";
import { ChangeTree } from "@colyseus/schema/lib/ChangeTree";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { PureSystem, System } from "./System";
import { Constructor } from "./types";

export enum EntityChangeType {
  Added = "added",
  Updated = "updated",
  Removed = "removed",
}

export type ChangeMap = { [K in EntityChangeType]: Set<Entity> };

export class World<S extends { [key: string]: System } = {}> {
  private readonly schema: MapSchema<Entity>;
  private readonly cache = new Map<string, Entity[]>();
  private entities = new Set<string>();
  private pureSystems: PureSystem[] = [];
  private adding = new Set<Entity>();
  private removing = new Set<Entity>();

  readonly clock: Clock;
  readonly changes: ChangeMap = {
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
      this.systems[systemKey].initialize(this);
    }

    for (const entityId in schema) {
      this.registerEntity(schema[entityId]);
    }
  }

  registerPureSystem(...pureSystems: PureSystem[]) {
    for (let i = 0; i < pureSystems.length; i++) {
      const system = pureSystems[i];

      if (this.pureSystems.indexOf(system) > -1) {
        return;
      }

      this.pureSystems.push(system);
    }
  }

  getEntitiesByComponent<C extends Constructor<Component>>(...ctors: C[]) {
    const types = ctors.map(c => c.prototype.getType());
    const cacheKey = types.sort((a, b) => a.type - b.type).toString();
    const result = this.cache.get(cacheKey) || [];

    if (result.length === 0) {
      for (const entityId in this.schema) {
        const entity: Entity = this.schema[entityId];
        const typeMatch = ctors.some(ctor => entity.hasComponent(ctor));

        if (typeMatch) {
          result.push(entity);
        }
      }

      this.cache.set(cacheKey, result);
    }

    return result;
  }

  registerEntity(entity: Entity) {
    this.changes.added.add(entity);
    this.entities.add(entity.id);
  }

  unregisterEntity(entity: Entity) {
    this.changes.removed.add(entity);
    this.entities.delete(entity.id);
  }

  tick() {
    for (const systemKey in this.systems) {
      this.systems[systemKey].execute();
    }

    for (let i = 0; i < this.pureSystems.length; i++) {
      this.pureSystems[i](this);
    }

    this.changes.added.clear();
    this.changes.removed.clear();
    this.changes.updated.clear();

    // Process additions and removals
    this.adding.forEach(entity => {
      this.schema[entity.id] = entity;
      this.registerEntity(entity);
    });
    this.removing.forEach(entity => {
      delete this.schema[entity.id];
      this.unregisterEntity(entity);
    });

    this.adding.clear();
    this.removing.clear();

    this.cache.forEach(arr => (arr.length = 0));

    const changes = (this.schema as any).$changes as ChangeTree;

    for (const entityId of changes.changes as string[]) {
      this.changes.updated.add(this.schema[entityId]);
    }
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
