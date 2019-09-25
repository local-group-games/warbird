import { Body } from "@warbird/core";
import { Entity, System } from "@warbird/ecs";
import { AABB, Body as P2Body, Box, World as P2World } from "p2";

export type CollisionHandler = (a: Body, b: Body) => void;

export type PhysicsSystemOptions = {};

const trunc2 = (x: number) => Math.floor(x * 100) / 100;

const CONTACT_PAIR: any[] = [];

function getContactPair(
  e: { bodyA: P2Body; bodyB: P2Body },
  entityIdsByP2Body: Map<P2Body, string>,
  out: string[] = CONTACT_PAIR,
) {
  const { bodyA, bodyB } = e;
  const idA = entityIdsByP2Body.get(bodyA);
  const idB = entityIdsByP2Body.get(bodyB);

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

export function syncP2BodyToEntity(body: P2Body, state: Body) {
  state.angularVelocity = trunc2(body.angularVelocity);
  state.angle = trunc2(body.angle);
  state.x = trunc2(body.position[0]);
  state.y = trunc2(body.position[1]);
  state.mass = trunc2(body.mass);
  state.velocityX = trunc2(body.velocity[0]);
  state.velocityY = trunc2(body.velocity[1]);
}

export function buildP2BodyFromEntity(entity: Entity) {
  const body = entity.getComponent(Body);
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
  } = body;
  const shape = new Box({ width, height });

  shape.collisionGroup = collisionGroup;
  shape.collisionMask = collisionMask;
  shape.sensor = sensor;

  const p2Body = new P2Body({
    position: [x, y],
    mass,
    velocity: [velocityX, velocityY],
    fixedRotation,
  });
  p2Body.angularDamping = angularDamping;
  p2Body.damping = damping;
  p2Body.addShape(shape);

  return p2Body;
}

export class PhysicsSystem extends System {
  static FORCE = [0, 0] as [number, number];

  private p2World: P2World;
  private p2BodiesByEntityId = new Map<string, P2Body>();
  private entityIdsByP2Body = new Map<P2Body, string>();

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

  private onBeginContact = (e: { bodyA: P2Body; bodyB: P2Body }) => {
    const [entityIdA, entityIdB] = getContactPair(e, this.entityIdsByP2Body);
    const entityA = this.world.getEntityById(entityIdA);
    const entityB = this.world.getEntityById(entityIdB);
    const bodyA = entityA.getComponent(Body);
    const bodyB = entityB.getComponent(Body);

    bodyA.collisions.add(entityB);
    bodyB.collisions.add(entityA);
  };

  private onEndContact = (e: { bodyA: P2Body; bodyB: P2Body }) => {
    let entityIdA: string;
    let entityIdB: string;

    try {
      [entityIdA, entityIdB] = getContactPair(e, this.entityIdsByP2Body);
    } catch (e) {
      console.warn(`Entity removed during onBeginContact handler.`);
      return;
    }

    const entityA = this.world.getEntityById(entityIdA);
    const entityB = this.world.getEntityById(entityIdB);
    const bodyA = entityA.getComponent(Body);
    const bodyB = entityB.getComponent(Body);

    bodyA.collisions.delete(entityB);
    bodyB.collisions.delete(entityA);
  };

  query(x1: number, y1: number, x2: number, y2: number) {
    const aabb = new AABB({
      lowerBound: [x1, y1],
      upperBound: [x2, y2],
    });
    const result = this.p2World.broadphase.aabbQuery(this.p2World, aabb);

    return result.map(body => {
      const entity = this.entityIdsByP2Body.get(body);

      if (!entity) {
        throw new Error(`Could not resolve schema when querying.`);
      }

      return entity;
    });
  }

  rotateBody(entity: Entity, delta: number) {
    const p2Body = this.p2BodiesByEntityId.get(entity.id);

    if (p2Body) {
      p2Body.angle += delta;
      p2Body.angularVelocity = 0;
    }
  }

  applyForceToBody(entity: Entity, x: number, y: number) {
    const p2Body = this.p2BodiesByEntityId.get(entity.id);

    if (p2Body) {
      PhysicsSystem.FORCE[0] = x;
      PhysicsSystem.FORCE[1] = y;

      p2Body.wakeUp();
      p2Body.applyForceLocal(PhysicsSystem.FORCE);
    }
  }

  execute() {
    const deltaTimeS = this.world.clock.deltaTime / 1000;
    const entities = this.world.getEntitiesByComponent(Body);

    for (const entity of this.world.changes.removed) {
      const body = entity.tryGetComponent(Body);

      if (body) {
        for (const collision of body.collisions) {
          const collisionBody = collision.getComponent(Body);

          collisionBody.collisions.delete(entity);
        }

        const p2Body = this.p2BodiesByEntityId.get(entity.id);

        this.p2BodiesByEntityId.delete(entity.id);

        if (p2Body) {
          this.p2World.removeBody(p2Body);
          this.entityIdsByP2Body.delete(p2Body);
        } else {
          console.warn(`Schema removed without body.`);
        }
      }
    }

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      if (this.world.changes.added.has(entity)) {
        const p2Body = buildP2BodyFromEntity(entity);

        this.p2World.addBody(p2Body);
        this.p2BodiesByEntityId.set(entity.id, p2Body);
        this.entityIdsByP2Body.set(p2Body, entity.id);
      }
    }

    this.p2World.step(1 / 60, deltaTimeS, 10);

    this.p2BodiesByEntityId.forEach((p2Body, entityId) => {
      const entity = this.world.getEntityById(entityId);
      const body = entity.getComponent(Body);

      if (body) {
        syncP2BodyToEntity(p2Body, body);
      }
    });
  }
}
