import { Body, Destructible, Inventory, Pickup, Wreck } from "@warbird/core";
import { PureSystem, Query } from "@warbird/ecs";

export type DestructibleQuery = {
  entities: Body | Destructible;
};

export const DESTRUCTIBLE_QUERY: Query<DestructibleQuery> = {
  entities: [Body, Destructible],
};

export const DestructibleSystem: PureSystem<DestructibleQuery> = (
  world,
  query,
) => {
  const { entities } = query;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const body = entity.getComponent(Body);
    const destructible = entity.getComponent(Destructible);
    const inventory = entity.tryGetComponent(Inventory);

    if (destructible.health <= 0) {
      world.removeEntity(entity);

      if (inventory) {
        const wreck = new Wreck();
        const wreckBody = wreck.getComponent(Body);
        const wreckPickup = wreck.getComponent(Pickup);

        wreckBody.x = body.x;
        wreckBody.y = body.y;
        wreckPickup.scrap = inventory.scrap;

        world.addEntity(wreck);
      }
    }
  }
};
