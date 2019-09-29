import { Body, Destructible, Inventory, Pickup, Wreck } from "@warbird/core";
import { PureSystem } from "@warbird/ecs";

type DestructibleQuery = {
  destructibles: Body | Destructible;
};

export const DestructibleSystem: PureSystem<DestructibleQuery> = (
  world,
  query,
) => {
  const { destructibles } = query;

  for (let i = 0; i < destructibles.length; i++) {
    const entity = destructibles[i];
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
