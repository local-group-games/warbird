import { Physical, Inventory, Pickup, Vehicle } from "@warbird/core";
import { PureSystem, Query } from "@warbird/ecs";

type PickupQuery = {
  entities: Pickup | Physical;
};

export const PICKUP_QUERY: Query<PickupQuery> = {
  entities: [Pickup, Physical],
};

export const PickupSystem: PureSystem<PickupQuery> = (world, query) => {
  const { entities } = query;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const body = entity.getComponent(Physical);
    const inventory = entity.getComponent(Inventory);

    if (!body) {
      continue;
    }

    body.collisions.forEach(bodyEntity => {
      const vehicle = bodyEntity.tryGetComponent(Vehicle);
      const vehicleInventory = bodyEntity.tryGetComponent(Inventory);

      if (vehicle && vehicleInventory) {
        vehicleInventory.scrap += inventory.scrap;
        world.removeEntity(entity);
      }
    });
  }
};
