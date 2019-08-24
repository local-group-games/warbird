import { Schema, type } from "@colyseus/schema";

export type EntityOptions = {
  id: string;
};

export class Entity extends Schema {
  @type("string")
  id: string;
  @type("string")
  type: string = "entity";

  constructor(options: EntityOptions) {
    super();
    this.id = options.id;
  }
}
