import { Body, Inventory, Pickup, Vehicle } from "@warbird/core";
import { PureSystem } from "@warbird/ecs";

type PickupQuery = {
  pickups: Pickup | Body;
};

export const PickupSystem: PureSystem<PickupQuery> = (world, { pickups }) => {
  for (let i = 0; i < pickups.length; i++) {
    const entity = pickups[i];
    const body = entity.getComponent(Body);
    const pickup = entity.getComponent(Pickup);

    if (!body) {
      continue;
    }

    body.collisions.forEach(bodyEntity => {
      const vehicle = bodyEntity.tryGetComponent(Vehicle);
      const inventory = bodyEntity.tryGetComponent(Inventory);

      if (vehicle && inventory) {
        inventory.scrap += pickup.scrap;
        world.removeEntity(entity);
      }
    });
  }
};
