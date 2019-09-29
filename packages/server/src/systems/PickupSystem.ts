import { Body, Inventory, Pickup, Vehicle } from "@warbird/core";
import { PureSystem, Query } from "@warbird/ecs";

type PickupQuery = {
  entities: Pickup | Body;
};

export const PICKUP_QUERY: Query<PickupQuery> = {
  entities: [Pickup, Body],
};

export const PickupSystem: PureSystem<PickupQuery> = (world, query) => {
  const { entities } = query;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
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
