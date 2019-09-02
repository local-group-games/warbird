import { Schema, type } from "@colyseus/schema";
import nanoid from "nanoid";
import { Entity } from "../model/Entity";
import { BodySchema } from "./BodySchema";

type BodyOptions = { [K in keyof BodySchema]?: BodySchema[K] };

export class EntitySchema extends Schema implements Entity {
  @type("string")
  id: string = nanoid();
  @type("string")
  type: string = "entity";
  @type("string")
  bodyId: string | null = null;

  getBodyOptions(): BodyOptions {
    return {};
  }

  makeBody(options?: BodyOptions) {
    if (this.bodyId) {
      console.warn(`Body already exists for entity ${this.id}`);
      return;
    }

    const body = new BodySchema({ ...this.getBodyOptions(), ...options });

    this.bodyId = body.id;

    return body;
  }
}
