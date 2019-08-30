import { Body as P2Body } from "p2";
import { Body } from "../model/Body";

export function syncBodyToSchema(body: P2Body, state: Body) {
  state.angularVelocity = body.angularVelocity;
  state.angle = body.angle;
  state.x = body.position[0];
  state.y = body.position[1];
  state.mass = body.mass;
  state.velocityX = body.velocity[0];
  state.velocityY = body.velocity[1];
}
