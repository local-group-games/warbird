import { EntitySchema } from "../state";
import { Destructible } from "../state/model/Destructible";

export const isDestructible = (
  entity: any,
): entity is EntitySchema & Destructible =>
  typeof (entity as any).health === "number";
