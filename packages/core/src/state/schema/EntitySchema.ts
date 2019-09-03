import { Schema, type } from "@colyseus/schema";
import nanoid from "nanoid";
import { Entity } from "../model/Entity";

export class EntitySchema extends Schema implements Entity {
  @type("string")
  id: string = nanoid();
  @type("string")
  type: string = "entity";
}
