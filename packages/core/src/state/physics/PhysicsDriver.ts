import { Body, World } from "p2";
import { BodyState } from "./BodyState";
import { PhysicsState } from "./PhysicsState";
import { syncBody } from "./syncBody";

export class PhysicsDriver {
  private state: PhysicsState;

  world: World;

  constructor(state: PhysicsState, world: World) {
    this.state = state;
    this.world = world;
    this.world.on("addBody", this.onAddBody);
    this.world.on("removeBody", this.onRemoveBody);
  }

  private onAddBody = ({ body }: { body: Body }) => {
    const data = new BodyState();
    const id = String(body.id);

    syncBody(body, data);
    this.state.bodies[id] = data;
  };

  private onRemoveBody = ({ body }: { body: Body }) => {
    const id = String(body.id);

    delete this.state.bodies[id];
  };

  update(deltaTime: number) {
    this.world.step(1 / 60, deltaTime / 1000, 10);

    for (const id in this.state.bodies) {
      // @ts-ignore
      const body = this.world.getBodyById(Number(id));

      if (body) {
        const data: BodyState = this.state.bodies[id];

        syncBody(body, data);
      }
    }
  }

  dispose() {
    this.world.off("addBody", this.onAddBody);
    this.world.off("removeBody", this.onRemoveBody);
  }
}
