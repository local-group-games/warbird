import { Client, Room } from "colyseus";
import { PhysicsState, PhysicsWorld } from "colyseus-test-core";
import { Body, World } from "p2";

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

  onMessage(client: Client, message: any) {
    if (message === "turn") {
      this.physics.world.bodies.forEach(body => {
        body.angularVelocity -= 0.1;
      });
    }
  }

  onLeave(client: Client, consented: boolean) {}

  onDispose() {
    this.physics.dispose();
  }
}
