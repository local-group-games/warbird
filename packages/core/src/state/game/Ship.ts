import { Body } from "../physics/Body";
import { Capacitor } from "./behaviors/Capacitor";
import { Destructible } from "./behaviors/Destructible";
import { WeaponSystem } from "./behaviors/WeaponSystem";
import { CollisionGroup } from "./CollisionGroup";
import { createIsEntity, EntityType } from "./EntityType";

export class Ship extends Capacitor(WeaponSystem(Destructible(Body))) {
  type = EntityType.Ship;

  health = 100;

  mass = 2;
  width = 1;
  height = 2;
  angularDamping = 0.5;
  damping = 0.3;
  collisionGroup = CollisionGroup.Vehicle;
  collisionMask =
    CollisionGroup.Vehicle | CollisionGroup.Projectile | CollisionGroup.Static;
}

export const isShip = createIsEntity<Ship>(EntityType.Ship);
