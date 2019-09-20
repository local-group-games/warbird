import { PureSystem } from "../../System";
import { Expireable } from "../components";

export const ExpireableSystem: PureSystem = (world, deltaTimeMs, changes) => {
  const entities = world.getEntitiesByComponent(Expireable);

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const expireable = entity.getComponent(Expireable);

    if (changes.added.has(entity)) {
      expireable.createdTimeMs = world.clock.now;
    }

    if (
      expireable.lifeTimeMs > 0 &&
      world.clock.now - expireable.createdTimeMs >= expireable.lifeTimeMs
    ) {
      world.removeEntity(entity);
    }
  }
};
