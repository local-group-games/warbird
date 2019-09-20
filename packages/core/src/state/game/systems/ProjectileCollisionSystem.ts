import { PureSystem } from "../../System";
import { Destructible, Body } from "../components";
import { Projectile } from "../components/Projectile";

export const ProjectileCollisionSystem: PureSystem = world => {
  const projectiles = world.getEntitiesByComponent(Projectile);

  for (let i = 0; i < projectiles.length; i++) {
    const projectileEntity = projectiles[i];
    const body = projectileEntity.getComponent(Body);

    body.collisions.forEach(entity => {
      const destructible = entity.tryGetComponent(Destructible);

      if (destructible && !destructible.invulnerable) {
        destructible.health -= 25;
        world.removeEntity(projectileEntity);
      }
    });
  }
};
