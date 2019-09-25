import { Expireable } from "@warbird/core";
import { PureSystem } from "@warbird/ecs";

export const ExpireableSystem: PureSystem = world => {
  const entities = world.getEntitiesByComponent(Expireable);

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const expireable = entity.getComponent(Expireable);

    if (world.changes.added.has(entity)) {
      expireable.createdTimeMs = world.clock.currentTime;
    }

    if (
      expireable.lifeTimeMs > 0 &&
      world.clock.currentTime - expireable.createdTimeMs >=
        expireable.lifeTimeMs
    ) {
      world.removeEntity(entity);
    }
  }
};
