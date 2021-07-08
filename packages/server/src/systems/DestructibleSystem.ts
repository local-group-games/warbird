import { Destructible, Inventory, Physical, Wreck } from "@warbird/core";
import { PureSystem, Query } from "@warbird/ecs";

export type DestructibleQuery = {
  entities: Physical | Destructible;
};

export const DESTRUCTIBLE_QUERY: Query<DestructibleQuery> = {
  entities: [Physical, Destructible],
};

export const DestructibleSystem: PureSystem<DestructibleQuery> = (
  world,
  query,
) => {
  const { entities } = query;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const body = entity.getComponent(Physical);
    const destructible = entity.getComponent(Destructible);
    const inventory = entity.tryGetComponent(Inventory);

    if (destructible.health <= 0) {
      world.removeEntity(entity);

      if (inventory) {
        const wreck = new Wreck();
        const wreckBody = wreck.getComponent(Physical);
        const wreckInventory = wreck.getComponent(Inventory);

        wreckBody.x = body.x;
        wreckBody.y = body.y;
        wreckInventory.scrap = inventory.scrap;

        world.addEntity(wreck);
      }
    }
  }
};
