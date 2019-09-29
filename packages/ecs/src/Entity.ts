import { ArraySchema, Schema, type } from "@colyseus/schema";
import nanoid from "nanoid";
import { Component } from "./Component";
import { Constructor } from "./types";
import { World } from "./World";

export abstract class Entity<C extends Component = Component> extends Schema {
  @type("string")
  id = nanoid();
  @type("int8")
  type: number = 0;
  @type([Component])
  readonly components = new ArraySchema<Component>();

  private _world: World | null = null;

  protected get world() {
    if (!this._world) {
      throw new Error("Tried to read world before registration");
    }

    return this._world;
  }

  register(world: World) {
    this._world = world;
  }

  addComponent<T extends C>(component: T) {
    if (this.components.indexOf(component) > -1) {
      return;
    }

    this.components.push(component);
  }

  hasComponent<T extends C>(ctor: Constructor<T>) {
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].type === ctor.prototype.getType()) {
        return true;
      }
    }

    return false;
  }

  tryGetComponent<T extends Component>(ctor: Constructor<T>): T | null {
    try {
      return (this.getComponent(ctor as any) as any) as T;
    } catch (e) {
      return null;
    }
  }

  getComponent<T extends C>(ctor: Constructor<T>) {
    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i];

      if (component.type === ctor.prototype.getType()) {
        return component as T;
      }
    }

    throw new Error(
      `Component ${ctor.name} (${ctor.prototype.type}) not found in entity ${
        this.id
      } with components ${this.components
        .map(c => `${c.constructor.name} (${c.type})`)
        .join(", ")}`,
    );
  }

  static getComponent<C extends Component, E extends Entity<C>>(
    entity: E,
    ctor: Constructor<C>,
  ) {
    return Entity.prototype.getComponent.call(entity, ctor) as C;
  }

  static tryGetComponent<C extends Component, E extends Entity<C>>(
    entity: E,
    ctor: Constructor<C>,
  ) {
    return Entity.prototype.tryGetComponent.call(entity, ctor) as C;
  }

  static hasComponent<C extends Component, E extends Entity<C>>(
    entity: E,
    ctor: Constructor<C>,
  ) {
    return Entity.prototype.hasComponent.call(entity, ctor);
  }
}
