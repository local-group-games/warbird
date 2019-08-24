import { Body as P2Body } from "p2";
import { Body } from "../model/Body";

export function syncSchemaToBody(state: Body, body: P2Body) {
  body.angularVelocity = state.angularVelocity;
  body.angle = state.angle;
  body.position[0] = state.x;
  body.position[1] = state.y;
  body.mass = state.mass;
}

export function syncBodyToSchema(body: P2Body, state: Body) {
  state.angularVelocity = body.angularVelocity;
  state.angle = body.interpolatedAngle;
  state.x = body.position[0];
  state.y = body.position[1];
  state.mass = body.mass;
}
