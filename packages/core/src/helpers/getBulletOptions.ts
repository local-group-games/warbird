import { Body } from "../state";

const BULLET_VELOCITY = 25;

export function getBulletOptions(
  origin: Body,
  velocity: number = BULLET_VELOCITY,
) {
  const { angle, height, x, y, velocityX, velocityY } = origin;
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  return {
    x: -height * s + x,
    y: height * c + y,
    velocityX: -velocity * s + velocityX,
    velocityY: velocity * c + velocityY,
  };
}
