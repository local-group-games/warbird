import { Schema, type } from "@colyseus/schema";

export class Component extends Schema {
  @type("int8")
  type: number;

  constructor() {
    super();
    this.type = this.getType();
  }

  getType(): number {
    throw new Error("getType() not implemented");
  }
}
