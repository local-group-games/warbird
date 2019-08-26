import { Body as P2Body } from "p2";
import { Body } from "../model/Body";

const toDecimal = (x: number, n: number = 2) => parseFloat(x.toFixed(n));

export function syncBodyToSchema(body: P2Body, state: Body) {
  state.angularVelocity = toDecimal(body.angularVelocity);
  state.angle = toDecimal(body.interpolatedAngle);
  state.x = toDecimal(body.interpolatedPosition[0]);
  state.y = toDecimal(body.interpolatedPosition[1]);
  state.mass = toDecimal(body.mass);
  state.velocityX = toDecimal(body.velocity[0]);
  state.velocityY = toDecimal(body.velocity[1]);
}
