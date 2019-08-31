import { type } from "@colyseus/schema";
import { Body } from "./Body";
import { CollisionGroup } from "./collision";
import { Destructible } from "./Destructible";

export class Tile extends Body implements Destructible {
  type = "tile";
  mass = 0;
  @type("uint8")
  health = 100;

  collisionGroup = CollisionGroup.Static;
  collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;
}

export class StaticTile extends Body {
  type = "tile";
  mass = 0;

  collisionGroup = CollisionGroup.Static;
  collisionMask = CollisionGroup.Projectile | CollisionGroup.Vehicle;
}
