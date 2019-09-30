import { Physical } from "@warbird/core";
import { Entity, Query, QueryResult, System } from "@warbird/ecs";
import { AABB, Body, Box, World as P2World } from "p2";

export type CollisionHandler = (a: Physical, b: Physical) => void;

export type PhysicsSystemOptions = {};

const trunc2 = (x: number) => Math.floor(x * 100) / 100;

const CONTACT_PAIR: any[] = [];

function getContactPair(
  e: { bodyA: Body; bodyB: Body },
  entityIdsByBody: Map<Body, string>,
  out: string[] = CONTACT_PAIR,
) {
  const { bodyA, bodyB } = e;
  const idA = entityIdsByBody.get(bodyA);
  const idB = entityIdsByBody.get(bodyB);

  if (!(idA && idB)) {
    throw new Error(
      `Cannot trigger collision handler for id ${
        idA ? idB : idA
      } because it has been removed.`,
    );
  }

  out[0] = idA;
  out[1] = idB;

  return out;
}

export function syncBodyToEntity(body: Body, physical: Physical) {
  physical.angularVelocity = body.angularVelocity;
  physical.mass = body.mass;
  physical.velocityX = body.velocity[0];
  physical.velocityY = body.velocity[1];

  // Truncate networked floats to 2 decimals
  physical.angle = trunc2(body.angle);
  physical.x = trunc2(body.position[0]);
  physical.y = trunc2(body.position[1]);
}

export function buildBodyFromEntity(entity: Entity) {
  const physical = entity.getComponent(Physical);
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
    sensor,
  } = physical;
  const shape = new Box({ width, height });

  shape.collisionGroup = collisionGroup;
  shape.collisionMask = collisionMask;
  shape.sensor = sensor;

  const body = new Body({
    position: [x, y],
    mass,
    velocity: [velocityX, velocityY],
    fixedRotation,
  });
  body.angularDamping = angularDamping;
  body.damping = damping;
  body.addShape(shape);

  return body;
}

export type PhysicsQuery = {
  entities: Physical;
};

export class PhysicsSystem extends System<PhysicsQuery> {
  static FORCE = [0, 0] as [number, number];

  private p2World: P2World;
  private bodiesByEntityId = new Map<string, Body>();
  private entityIdsByBody = new Map<Body, string>();

  query = { entities: [Physical] };

  constructor(options: PhysicsSystemOptions = {}) {
    super();

    this.p2World = new P2World({
      gravity: [0, 0],
    });
    this.p2World.sleepMode = P2World.BODY_SLEEPING;
    this.p2World.defaultContactMaterial.restitution = 0.35;

    this.p2World.on("beginContact", this.onBeginContact, null);
    this.p2World.on("endContact", this.onEndContact, null);
  }

  private onBeginContact = (e: { bodyA: Body; bodyB: Body }) => {
    const [entityIdA, entityIdB] = getContactPair(e, this.entityIdsByBody);
    const entityA = this.world.getEntityById(entityIdA);
    const entityB = this.world.getEntityById(entityIdB);
    const physicalA = entityA.getComponent(Physical);
    const physicalB = entityB.getComponent(Physical);

    physicalA.collisions.add(entityB);
    physicalB.collisions.add(entityA);
  };

  private onEndContact = (e: { bodyA: Body; bodyB: Body }) => {
    let entityIdA: string;
    let entityIdB: string;

    try {
      [entityIdA, entityIdB] = getContactPair(e, this.entityIdsByBody);
    } catch (e) {
      console.warn(`Entity removed during onBeginContact handler.`);
      return;
    }

    const entityA = this.world.getEntityById(entityIdA);
    const entityB = this.world.getEntityById(entityIdB);
    const physicalA = entityA.getComponent(Physical);
    const physicalB = entityB.getComponent(Physical);

    physicalA.collisions.delete(entityB);
    physicalB.collisions.delete(entityA);
  };

  aabbQuery(x1: number, y1: number, x2: number, y2: number) {
    const aabb = new AABB({
      lowerBound: [x1, y1],
      upperBound: [x2, y2],
    });
    const result = this.p2World.broadphase.aabbQuery(this.p2World, aabb);

    return result.map(body => {
      const entity = this.entityIdsByBody.get(body);

      if (!entity) {
        throw new Error(`Could not resolve schema when querying.`);
      }

      return entity;
    });
  }

  rotateBody(entity: Entity, delta: number) {
    const body = this.bodiesByEntityId.get(entity.id);

    if (body) {
      body.angle += delta;
      body.angularVelocity = 0;
    }
  }

  applyForceToBody(entity: Entity, x: number, y: number) {
    const body = this.bodiesByEntityId.get(entity.id);

    if (body) {
      PhysicsSystem.FORCE[0] = x;
      PhysicsSystem.FORCE[1] = y;

      body.wakeUp();
      body.applyForceLocal(PhysicsSystem.FORCE);
    }
  }

  execute(query: QueryResult<Query<PhysicsQuery>>) {
    const { entities } = query;
    const deltaTimeS = this.world.clock.deltaTime / 1000;

    for (const entity of this.world.changes.removed) {
      const physical = entity.tryGetComponent(Physical);

      if (physical) {
        for (const collision of physical.collisions) {
          const collisionBody = collision.getComponent(Physical);

          collisionBody.collisions.delete(entity);
        }

        const body = this.bodiesByEntityId.get(entity.id);

        this.bodiesByEntityId.delete(entity.id);

        if (body) {
          this.p2World.removeBody(body);
          this.entityIdsByBody.delete(body);
        } else {
          console.warn(`Schema removed without body.`);
        }
      }
    }

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      if (this.world.changes.added.has(entity)) {
        const body = buildBodyFromEntity(entity);

        this.p2World.addBody(body);
        this.bodiesByEntityId.set(entity.id, body);
        this.entityIdsByBody.set(body, entity.id);
      }
    }

    this.p2World.step(1 / 60, deltaTimeS, 10);

    this.bodiesByEntityId.forEach((body, entityId) => {
      const entity = this.world.getEntityById(entityId);
      const physical = entity.getComponent(Physical);

      if (physical) {
        syncBodyToEntity(body, physical);
      }
    });
  }
}
