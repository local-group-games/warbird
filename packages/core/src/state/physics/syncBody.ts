import { Body as P2Body } from "p2";
import { Body } from "./Body";

const trunc2 = (x: number) => Math.floor(x * 100) / 100;

export function syncBodyToSchema(body: P2Body, state: Body) {
  state.angularVelocity = trunc2(body.angularVelocity);
  state.angle = trunc2(body.angle);
  state.x = trunc2(body.position[0]);
  state.y = trunc2(body.position[1]);
  state.mass = trunc2(body.mass);
  state.velocityX = trunc2(body.velocity[0]);
  state.velocityY = trunc2(body.velocity[1]);
}
