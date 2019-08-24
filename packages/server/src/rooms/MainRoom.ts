import { Client, Room } from "colyseus";
import {
  GameMessage,
  GameMessageType,
  PhysicsDriver,
  SystemState,
  PlayerCommandPayload,
  Tile,
} from "colyseus-test-core";
import { Body, Box, World } from "p2";

export class MainRoom extends Room<SystemState> {
  private physics: PhysicsDriver;
  private commandsByClient = new WeakMap<Client, PlayerCommandPayload>();

  onInit() {
    const system = new SystemState();
    const world = new World({
      gravity: [0, 0],
    });
    const physics = new PhysicsDriver(system.physics, world);

    system.physics.bodies.onChange = console.log;

    this.physics = physics;

    const t = new Tile();

    t.x = 2;
    t.y = 2;

    system.tiles.push(t);

    physics.world.addBody(
      new Body({
        position: [2, 2],
        mass: 0,
      }),
    );

    this.setState(system);
    this.setSimulationInterval(this.update);
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
    this.commandsByClient.set(client, {
      thrustForward: false,
      thrustReverse: false,
      turnLeft: false,
      turnRight: false,
      afterburners: false,
      fire: false,
    });
  }

  onMessage(client: Client, message: GameMessage) {
    const bodyId = this.state.entityIdsByClientId[client.id];

    // @ts-ignore
    const body = this.physics.world.getBodyById(bodyId);
    const [type, payload] = message;

    if (type === GameMessageType.PlayerCommand) {
      const [key, value] = payload;
      const command: PlayerCommandPayload = this.commandsByClient.get(client);

      command[key] = value;
    }
  }

  onLeave(client: Client) {
    const bodyId = this.state.entityIdsByClientId[client.id];
    // @ts-ignore
    const body = this.physics.world.getBodyById(bodyId);

    delete this.state.entityIdsByClientId[client.id];
    this.commandsByClient.delete(client);
    this.physics.world.removeBody(body);
  }

  update = (deltaTime: number) => {
    this.physics.update(deltaTime);

    for (const client of this.clients) {
      const command = this.commandsByClient.get(client);
      const bodyId = this.state.entityIdsByClientId[client.id];
      // @ts-ignore
      const body = this.physics.world.getBodyById(bodyId);

      if (command.thrustForward || command.thrustReverse) {
        const thrust =
          (Number(command.thrustForward) - Number(command.thrustReverse)) *
          5 *
          (command.afterburners ? 2 : 1);

        body.applyForceLocal([0, thrust]);
      }

      if (command.turnLeft || command.turnRight) {
        const turn =
          (Number(command.turnLeft) - Number(command.turnRight)) * 0.05;

        body.angle += turn;
        body.angularVelocity = 0;
      }
    }
  };

  onDispose() {
    this.physics.dispose();
  }
}
