import { Body, Destructible, Projectile } from "@warbird/core";
import { PureSystem } from "@warbird/ecs";

export type ProjectileQuery = {
  entities: Body | Projectile;
};

export const ProjectileCollisionSystem: PureSystem<ProjectileQuery> = (
  world,
  query,
) => {
  const { entities } = query;

  for (let i = 0; i < entities.length; i++) {
    const projectileEntity = entities[i];
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
