import { Client, Room } from "colyseus";
import {
  Body,
  GameMessage,
  GameMessageType,
  PhysicsDriver,
  PlayerCommandPayload,
  SystemState,
  Ship,
  Tile,
} from "colyseus-test-core";
import { World } from "p2";

const tiles = [
  { x: 5, y: 5 },
  { x: 5, y: 6 },
  { x: 6, y: 6 },
  { x: 7, y: 6 },
  { x: 8, y: 6 },
  { x: 9, y: 6 },
  { x: 9, y: 5 },
];

export class MainRoom extends Room<SystemState> {
  private physics: PhysicsDriver;
  private commandsByClient = new WeakMap<Client, PlayerCommandPayload>();

  onCreate() {
    const system = new SystemState();
    const world = new World({
      gravity: [0, 0],
    });
    const physics = new PhysicsDriver(system.entities, world);

    this.physics = physics;

    for (const tile of tiles) {
      system.entities.push(new Tile({ id: Math.random().toString(), ...tile }));
    }

    this.setState(system);
    this.setSimulationInterval(this.update);
  }

  onJoin(client: Client) {
    const id = client.sessionId;
    const x = (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 5;
    const body = new Ship({ id, x, y });

    this.state.entities.push(body);
    this.state.entityIdsByClientSessionId[client.sessionId] = body.id;
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
    const [type, payload] = message;

    if (type === GameMessageType.PlayerCommand) {
      const [key, value] = payload;
      const command: PlayerCommandPayload = this.commandsByClient.get(client);

      command[key] = value;
    }
  }

  onLeave(client: Client) {
    const entityId = this.state.entityIdsByClientSessionId[client.sessionId];
    const entityIndex = this.state.entities.findIndex(
      entity => entity.id === entityId,
    );

    this.state.entities.splice(entityIndex, 1);

    delete this.state.entityIdsByClientSessionId[client.sessionId];

    this.commandsByClient.delete(client);
  }

  update = (deltaTime: number) => {
    for (const client of this.clients) {
      const command = this.commandsByClient.get(client);
      const entityId = this.state.entityIdsByClientSessionId[client.sessionId];
      const body: Body = this.state.entities.find(
        entity => entity.id === entityId,
      );

      if (command.thrustForward || command.thrustReverse) {
        const thrust =
          (Number(command.thrustForward) - Number(command.thrustReverse)) *
          5 *
          (command.afterburners ? 2 : 1);

        this.physics.applyForceLocal(body, [0, thrust]);
      }

      if (command.turnLeft || command.turnRight) {
        const turn =
          (Number(command.turnLeft) - Number(command.turnRight)) * 0.05;

        body.angle += turn;
        body.angularVelocity = 0;
      }
    }

    this.physics.update(deltaTime);
  };

  onDispose() {
    this.physics.dispose();
  }
}
