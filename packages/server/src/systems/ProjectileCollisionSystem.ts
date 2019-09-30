import { Physical, Destructible, Projectile } from "@warbird/core";
import { PureSystem, Query } from "@warbird/ecs";

export type ProjectileQuery = {
  entities: Physical | Projectile;
};

export const PROJECTILE_QUERY: Query<ProjectileQuery> = {
  entities: [Physical, Projectile],
};

export const ProjectileCollisionSystem: PureSystem<ProjectileQuery> = (
  world,
  query,
) => {
  const { entities } = query;

  for (let i = 0; i < entities.length; i++) {
    const projectileEntity = entities[i];
    const body = projectileEntity.getComponent(Physical);

    body.collisions.forEach(entity => {
      const destructible = entity.tryGetComponent(Destructible);

      if (destructible && !destructible.invulnerable) {
        destructible.health -= 25;
        world.removeEntity(projectileEntity);
      }
    });
  }
};
