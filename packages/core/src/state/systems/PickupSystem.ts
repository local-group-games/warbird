import { PureSystem } from "@warbird/ecs";
import { Body, Inventory, Vehicle } from "../components";
import { Pickup } from "../components/Pickup";

export const PickupSystem: PureSystem = world => {
  for (const pickupEntity of world.getEntitiesByComponent(Pickup)) {
    const body = pickupEntity.getComponent(Body);
    const pickup = pickupEntity.getComponent(Pickup);

    body.collisions.forEach(entity => {
      const vehicle = entity.tryGetComponent(Vehicle);
      const inventory = entity.tryGetComponent(Inventory);

      if (vehicle && inventory) {
        inventory.scrap += pickup.scrap;
        world.removeEntity(pickupEntity);
      }
    });
  }
};
