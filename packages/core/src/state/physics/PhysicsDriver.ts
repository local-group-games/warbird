import { MapSchema } from "@colyseus/schema";
import { ChangeTree } from "@colyseus/schema/lib/ChangeTree";
import { Body as P2Body, Box, World } from "p2";
import { Body } from "../model/Body";
import { syncBodyToSchema } from "./syncBody";

export class PhysicsDriver {
  private state: MapSchema<Body>;
  private world: World;
  private bodiesBySchemaId = new Map<string, P2Body>();

  constructor(state: MapSchema<Body>, world: World) {
    this.state = state;
    this.world = world;
  }

  update(deltaTime: number) {
    const changes = (this.state as any).$changes as ChangeTree;

    for (const bodyId of changes.changes) {
      const id = bodyId as string;
      const schema: Body = this.state[id];
      let body = this.bodiesBySchemaId.get(id);

      // Body removed
      if (!schema) {
        this.bodiesBySchemaId.delete(id);

        if (body) {
          this.world.removeBody(body);
        } else {
          console.warn(`Schema removed without body.`);
        }

        continue;
      }

      if (!body) {
        const {
          x,
          y,
          mass,
          width,
          height,
          velocityX,
          velocityY,
          fixedRotation,
        } = schema;
        const shape = new Box({ width, height });

        body = new P2Body({
          position: [x, y],
          mass,
          velocity: [velocityX, velocityY],
          fixedRotation,
        });
        body.addShape(shape);

        this.world.addBody(body);
        this.bodiesBySchemaId.set(id, body);
      }

      body.wakeUp();
    }

    this.world.step(1 / 60, deltaTime / 1000, 10);

    this.bodiesBySchemaId.forEach((body, schemaId) => {
      const schema = this.state[schemaId];

      if (schema) {
        syncBodyToSchema(body, schema);
      }
    });
  }

  applyForceLocal(
    schema: Body,
    force: [number, number],
    point?: [number, number],
  ) {
    const body = this.bodiesBySchemaId.get(schema.id);

    if (!body) {
      console.warn(`Attempted to apply force to an unregistered body.`);
      return;
    }

    body.applyForceLocal(force, point);
  }

  rotate(schema: Body, angle: number) {
    const body = this.bodiesBySchemaId.get(schema.id);

    if (!body) {
      console.warn(`Attempted to rotate an unregistered body.`);
      return;
    }

    body.angle = angle;
    body.angularVelocity = 0;
  }

  dispose() {}
}
