import { type } from "@colyseus/schema";
import { Component, Entity } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export class Body extends Component {
  getType() {
    return ComponentType.Body;
  }

  @type("float32")
  x: number = 0;
  @type("float32")
  y: number = 0;
  @type("float32")
  angle: number = 0;
  @type("float32")
  width: number = 1;
  @type("float32")
  height: number = 1;

  mass = 0;
  angularVelocity = 0;
  velocityX = 0;
  velocityY = 0;
  angularDamping = 0;
  damping = 0;
  fixedRotation = false;
  collisionGroup = 0;
  collisionMask = 0;
  sensor = false;

  collisions = new Set<Entity>();
}
