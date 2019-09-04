import { BodySchema } from "../state";

const BULLET_VELOCITY = 25;

export function getBulletOptions(origin: BodySchema) {
  const { angle, height, x, y, velocityX, velocityY } = origin;
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  return {
    x: -height * s + x,
    y: height * c + y,
    velocityX: -BULLET_VELOCITY * s + velocityX,
    velocityY: BULLET_VELOCITY * c + velocityY,
  };
}
