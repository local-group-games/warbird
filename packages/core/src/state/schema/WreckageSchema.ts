import { type } from "@colyseus/schema";
import { CollisionGroup } from "../model/Body";
import { Entity } from "../model/Entity";
import { Wreckage } from "../model/Wreckage";
import { BodySchema } from "./BodySchema";

const wreckageType = "wreckage";

export class WreckageSchema extends BodySchema implements Wreckage {
  type = wreckageType;

  createdTimeMs = Date.now();
  lifeTimeMs = 10000;

  @type("uint8")
  health = 100;
  @type("boolean")
  invulnerable = false;

  mass = 0;
  collisionGroup = CollisionGroup.Static;
  collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;
  sensor = true;
}

export const isWreckage = (entity: Entity): entity is WreckageSchema =>
  entity.type === wreckageType;
