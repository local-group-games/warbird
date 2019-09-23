import { ArraySchema, Schema, type } from "@colyseus/schema";
import nanoid from "nanoid";
import { Constructor } from "../types/Constructor";
import { Component } from "./Component";

export abstract class Entity extends Schema {
  @type("string")
  id = nanoid();
  @type("int8")
  type: number = 0;
  @type([Component])
  protected components = new ArraySchema<Component>();

  addComponent(...components: Component[]) {
    for (let i = 0; i < components.length; i++) {
      const component = components[i];

      if (this.components.indexOf(component) > -1) {
        return;
      }

      this.components.push(component);
    }
  }

  hasComponent<C extends Component>(ctor: Constructor<C>) {
    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i].type === ctor.prototype.getType()) {
        return true;
      }
    }

    return false;
  }

  tryGetComponent<C extends Component>(ctor: Constructor<C>) {
    try {
      return this.getComponent(ctor);
    } catch (e) {
      return null;
    }
  }

  getComponent<C extends Component>(ctor: Constructor<C>) {
    for (let i = 0; i < this.components.length; i++) {
      const component = this.components[i];

      if (component.type === ctor.prototype.getType()) {
        return component as C;
      }
    }

    throw new Error(
      `Component ${ctor.name} (${ctor.prototype.type}) not found in entity ${
        this.id
      } with components ${this.components.map(c => c.type)}`,
    );
  }

  static getComponent<C extends Component>(
    entity: Entity,
    ctor: Constructor<C>,
  ) {
    return Entity.prototype.getComponent.call(entity, ctor) as C;
  }

  static tryGetComponent<C extends Component>(
    entity: Entity,
    ctor: Constructor<C>,
  ) {
    return Entity.prototype.tryGetComponent.call(entity, ctor) as C;
  }

  static hasComponent<C extends Component>(
    entity: Entity,
    ctor: Constructor<C>,
  ) {
    return Entity.prototype.hasComponent.call(entity, ctor);
  }
}
