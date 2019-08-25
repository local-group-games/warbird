import { ArraySchema } from "@colyseus/schema";
import { ChangeTree } from "@colyseus/schema/lib/ChangeTree";
import { Body as P2Body, Box, World } from "p2";
import { Body } from "../model/Body";
import { syncBodyToSchema } from "./syncBody";

export class PhysicsDriver {
  private state: ArraySchema<Body>;
  private world: World;
  private bodiesBySchema = new Map<Body, P2Body>();

  constructor(state: ArraySchema<Body>, world: World) {
    this.state = state;
    this.world = world;
  }

  update(deltaTime: number) {
    const changes = (this.state as any).$changes as ChangeTree;

    for (const index of changes.allChanges) {
      const schema: Body = this.state[index as number];
      let body = this.bodiesBySchema.get(schema);

      if (!schema) {
        this.bodiesBySchema.delete(schema);

        if (body) {
          this.world.removeBody(body);
        } else {
          console.warn(`Schema removed without body.`);
        }

        return;
      }

      if (!body) {
        const { x, y, mass, width, height } = schema;
        const shape = new Box({ width, height });

        body = new P2Body({
          position: [x, y],
          mass,
        });

        body.addShape(shape);

        this.world.addBody(body);
        this.bodiesBySchema.set(schema, body);

        return;
      }

      this.world.step(1 / 60, deltaTime / 1000, 10);

      syncBodyToSchema(body, schema);
    }
  }

  applyForceLocal(
    schema: Body,
    force: [number, number],
    point?: [number, number],
  ) {
    const body = this.bodiesBySchema.get(schema);

    if (!body) {
      console.warn(`Attempted to apply force to an unregistered body.`);
      return;
    }

    body.applyForceLocal(force, point);
  }

  rotate(schema: Body, angle: number) {
    const body = this.bodiesBySchema.get(schema);

    if (!body) {
      console.warn(`Attempted to rotate an unregistered body.`);
      return;
    }

    body.angle = angle;
    body.angularVelocity = 0;
  }

  dispose() {}
}
