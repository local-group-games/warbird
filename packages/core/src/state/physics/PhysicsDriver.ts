import { MapSchema } from "@colyseus/schema";
import { ChangeTree } from "@colyseus/schema/lib/ChangeTree";
import { AABB, Body as P2Body, Box, World } from "p2";
import { Body } from "../model/Body";
import { BodySchema, EntitySchema, isBody } from "../schema";
import { syncBodyToSchema } from "./syncBody";

type CollisionHandler = (a: BodySchema, b: BodySchema) => void;

type PhysicsDriverOptions = {
  state: MapSchema<EntitySchema>;
  onCollisionStart?: CollisionHandler;
  onCollisionEnd?: CollisionHandler;
};

type P2PhysicsDriverOptions = PhysicsDriverOptions & { world: World };

export class P2PhysicsDriver {
  private state: MapSchema<EntitySchema>;
  private world: World;
  private p2BodiesBySchemaId = new Map<string, P2Body>();
  private schemaIdsByP2Body = new Map<P2Body, string>();
  private onCollisionStart: CollisionHandler;
  private onCollisionEnd: CollisionHandler;

  constructor(options: P2PhysicsDriverOptions) {
    const { state, world, onCollisionStart, onCollisionEnd } = options;

    this.state = state;
    this.world = world;
    this.onCollisionStart = onCollisionStart || (() => {});
    this.onCollisionEnd = onCollisionEnd || (() => {});

    world.on(
      "beginContact",
      (e: { bodyA: P2Body; bodyB: P2Body }) => {
        const { bodyA, bodyB } = e;
        const idA = this.schemaIdsByP2Body.get(bodyA);
        const idB = this.schemaIdsByP2Body.get(bodyB);

        if (!(idA && idB)) {
          console.warn(`Collision occurred between unregistered entities.`);
          return;
        }

        const a = this.state[idA];
        const b = this.state[idB];

        if (!(a && b)) {
          console.warn(
            `Cannot trigger collision handler for entity ${
              a ? idB : idA
            } because it has been removed.`,
          );
          return;
        }

        this.onCollisionStart(a, b);
      },
      null,
    );

    world.on(
      "endContact",
      (e: { bodyA: P2Body; bodyB: P2Body }) => {
        // const { bodyA, bodyB } = e;
        // const idA = this.schemaIdsByP2Body.get(bodyA);
        // const idB = this.schemaIdsByP2Body.get(bodyB);
        // if (!(idA && idB)) {
        //   console.warn(`Collision occurred between unregistered entities.`);
        //   return;
        // }
        // this.onCollisionEnd(this.state[idA], this.state[idB]);
      },
      null,
    );
  }

  update(deltaTime: number) {
    const changes = (this.state as any).$changes as ChangeTree;

    for (const schemaId of changes.changes) {
      const id = schemaId as string;
      const schema = this.state[id];

      let body = this.p2BodiesBySchemaId.get(id);

      // Body removed
      if (!schema) {
        this.p2BodiesBySchemaId.delete(id);

        if (body) {
          this.world.removeBody(body);
          this.schemaIdsByP2Body.delete(body);
        } else {
          console.warn(`Schema removed without body.`);
        }

        continue;
      }

      if (!isBody(schema)) {
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
          collisionGroup,
          collisionMask,
          angularDamping,
          damping,
        } = schema;
        const shape = new Box({ width, height });

        shape.collisionGroup = collisionGroup;
        shape.collisionMask = collisionMask;

        body = new P2Body({
          position: [x, y],
          mass,
          velocity: [velocityX, velocityY],
          fixedRotation,
        });
        body.angularDamping = angularDamping;
        body.damping = damping;
        body.addShape(shape);

        this.world.addBody(body);
        this.p2BodiesBySchemaId.set(id, body);
        this.schemaIdsByP2Body.set(body, schema.id);
      }

      body.wakeUp();
    }

    this.world.step(1 / 60, deltaTime / 1000, 10);

    this.p2BodiesBySchemaId.forEach((body, schemaId) => {
      const schema = this.state[schemaId];

      if (schema) {
        syncBodyToSchema(body, schema);
      }
    });
  }

  query(x1: number, y1: number, x2: number, y2: number) {
    const aabb = new AABB({
      lowerBound: [x1, y1],
      upperBound: [x2, y2],
    });
    const result = this.world.broadphase.aabbQuery(this.world, aabb);

    return result.map(body => {
      const schemaId = this.schemaIdsByP2Body.get(body);

      if (!schemaId) {
        throw new Error(`Could not resolve schema when querying.`);
      }

      const state = this.state[schemaId];

      return state;
    });
  }

  applyForceLocal(
    schema: Body,
    force: [number, number],
    point?: [number, number],
  ) {
    const body = this.p2BodiesBySchemaId.get(schema.id);

    if (!body) {
      console.warn(`Attempted to apply force to an unregistered body.`);
      return;
    }

    body.applyForceLocal(force, point);
  }

  rotate(schema: Body, angle: number) {
    const body = this.p2BodiesBySchemaId.get(schema.id);

    if (!body) {
      console.warn(`Attempted to rotate an unregistered body.`);
      return;
    }

    body.angle = angle;
    body.angularVelocity = 0;
  }

  dispose() {}
}
