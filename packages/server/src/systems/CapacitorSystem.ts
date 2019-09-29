import { Capacitor } from "@warbird/core";
import { PureSystem, Query } from "@warbird/ecs";

export type CapacitorQuery = {
  entities: Capacitor;
};

export const CAPACITOR_QUERY: Query<CapacitorQuery> = {
  entities: [Capacitor],
};

export const CapacitorSystem: PureSystem<CapacitorQuery> = (world, query) => {
  const { entities } = query;
  const deltaTimeS = world.clock.deltaTime / 1000;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const capacitor = entity.getComponent(Capacitor);

    capacitor.energy = Math.min(
      Math.max(0, capacitor.energy + capacitor.energyPerS * deltaTimeS),
      100,
    );
  }
};
