import { PureSystem } from "../../System";
import { Capacitor } from "../components";

export const CapacitorSystem: PureSystem = (world, deltaTimeMs) => {
  const entities = world.getEntitiesByComponent(Capacitor);
  const deltaTimeS = deltaTimeMs / 1000;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const capacitor = entity.getComponent(Capacitor);

    capacitor.energy = Math.min(
      Math.max(0, capacitor.energy + capacitor.energyPerS * deltaTimeS),
      100,
    );
  }
};
