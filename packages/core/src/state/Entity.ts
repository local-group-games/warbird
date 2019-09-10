import { Schema, type } from "@colyseus/schema";
import nanoid from "nanoid";

export abstract class Entity extends Schema {
  @type("string")
  id: string = nanoid();
  @type("int8")
  type: number;
}
