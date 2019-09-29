import { Capacitor } from "@warbird/core";
import { PureSystem } from "@warbird/ecs";

export type CapacitorQuery = {
  capacitors: Capacitor;
};

export const CapacitorSystem: PureSystem<CapacitorQuery> = (world, query) => {
  const { capacitors } = query;
  const deltaTimeS = world.clock.deltaTime / 1000;

  for (let i = 0; i < capacitors.length; i++) {
    const entity = capacitors[i];
    const capacitor = entity.getComponent(Capacitor);

    capacitor.energy = Math.min(
      Math.max(0, capacitor.energy + capacitor.energyPerS * deltaTimeS),
      100,
    );
  }
};
