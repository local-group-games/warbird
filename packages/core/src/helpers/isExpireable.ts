import { Expireable } from "../state/model/Expireable";

export const isExpireable = (entity: object): entity is Expireable =>
  typeof (entity as any).createdTimeMs === "number" &&
  typeof (entity as any).lifeTimeMs === "number" &&
  (entity as any).lifeTimeMs > 0;
