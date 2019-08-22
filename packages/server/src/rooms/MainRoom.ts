import { Client, Room } from "colyseus";
import {
  GameMessage,
  GameMessageType,
  PhysicsDriver,
  SystemState,
} from "colyseus-test-core";
import { Body, Box, World } from "p2";

export class MainRoom extends Room<SystemState> {
  private physics: PhysicsDriver;

  onInit() {
    const system = new SystemState();
    const world = new World({
      gravity: [0, 0],
    });
    const physics = new PhysicsDriver(system.physics, world);

    this.physics = physics;

    this.setState(system);
    this.setSimulationInterval(deltaTime => physics.update(deltaTime));
  }

  onJoin(client: Client) {
    const x = (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 5;
    const body = new Body({
      mass: 1,
      position: [x, y],
    });
    const shape = new Box({
      width: 1,
      height: 1,
    });

    body.addShape(shape);

    this.physics.world.addBody(body);
    this.state.entityIdsByClientId[client.id] = body.id;
  }

  onMessage(client: Client, message: GameMessage) {
    const bodyId = this.state.entityIdsByClientId[client.id];
    // @ts-ignore
    const body = this.physics.world.getBodyById(bodyId);
    const [type, payload] = message;

    if (type === GameMessageType.PlayerCommand) {
      if (payload.thrustForward || payload.thrustReverse) {
        const thrust =
          (Number(payload.thrustForward) - Number(payload.thrustReverse)) *
          5 *
          (payload.afterburners ? 2 : 1);

        body.applyForceLocal([0, thrust]);
      }

      if (payload.turnLeft || payload.turnRight) {
        const turn =
          (Number(payload.turnLeft) - Number(payload.turnRight)) * 0.05;

        body.angle += turn;
        body.angularVelocity = 0;
      }
    }
  }

  onLeave(client: Client) {
    const bodyId = this.state.entityIdsByClientId[client.id];
    // @ts-ignore
    const body = this.physics.world.getBodyById(bodyId);

    delete this.state.entityIdsByClientId[client.id];
    this.physics.world.removeBody(body);
  }

  onDispose() {
    this.physics.dispose();
  }
}
