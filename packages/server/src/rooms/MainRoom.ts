import { Client, Room } from "colyseus";
import {
  GameMessage,
  GameMessageType,
  PhysicsDriver,
  PhysicsState,
} from "colyseus-test-core";
import { Body, Box, World } from "p2";

export class MainRoom extends Room {
  private physics: PhysicsDriver;

  onInit() {
    const state = new PhysicsState();
    const world = new World({
      gravity: [0, 0],
    });
    const physics = new PhysicsDriver(state, world);

    this.physics = physics;

    this.setState(state);
    this.setSimulationInterval((deltaTime: number) =>
      physics.update(deltaTime),
    );
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
    this.clientEntities.set(client, body);
  }

  private clientEntities = new Map<Client, Body>();

  onMessage(client: Client, message: GameMessage) {
    const body = this.clientEntities.get(client);
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
    const body = this.clientEntities.get(client);

    this.clientEntities.delete(client);
    this.physics.world.removeBody(body);
  }

  onDispose() {
    this.physics.dispose();
  }
}
