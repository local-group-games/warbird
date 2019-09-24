import { PureSystem } from "@warbird/ecs";
import { Destructible, Inventory, Body, Pickup } from "../components";
import { Wreck } from "../entities";

export const DestructibleSystem: PureSystem = world => {
  const entities = world.getEntitiesByComponent(Destructible);

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
