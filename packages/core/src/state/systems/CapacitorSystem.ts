import { PureSystem } from "colyseus-test-ecs";
import { Capacitor } from "../components";

export const CapacitorSystem: PureSystem = world => {
  const entities = world.getEntitiesByComponent(Capacitor);
  const deltaTimeS = world.clock.deltaTimeMs / 1000;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const capacitor = entity.getComponent(Capacitor);

    capacitor.energy = Math.min(
      Math.max(0, capacitor.energy + capacitor.energyPerS * deltaTimeS),
      100,
    );
  }
};
