import { Client, Room } from "colyseus";
import { Body, World } from "p2";
import { PhysicsState } from "../physics/PhysicsState";
import { PhysicsWorld } from "../physics/PhysicsWorld";

export class MainRoom extends Room {
  private physics: PhysicsWorld;

  onInit(options: any) {
    const state = new PhysicsState();
    const world = new World({
      gravity: [0, 5],
    });
    const physics = new PhysicsWorld(state, world);

    this.physics = physics;

    this.setState(physics.state);
    this.setSimulationInterval((deltaTime: number) =>
      physics.update(deltaTime),
    );
  }

  onJoin(client: Client, options: any, auth: any) {
    this.physics.addBody(
      new Body({
        position: [0, 0],
      }),
    );
  }

  onMessage(client: Client, message: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {
    this.physics.dispose();
  }
}
