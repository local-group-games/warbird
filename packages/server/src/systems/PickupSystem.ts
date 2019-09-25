import { Body, Inventory, Pickup, Vehicle } from "@warbird/core";
import { PureSystem } from "@warbird/ecs";

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
