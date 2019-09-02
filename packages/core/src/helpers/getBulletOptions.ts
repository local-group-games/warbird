import { BodySchema } from "../state";

const BULLET_VELOCITY = 25;

export function getBulletOptions(origin: BodySchema) {
  const s = Math.sin(origin.angle);
  const c = Math.cos(origin.angle);
  const x = -1 * s + origin.x;
  const y = 1 * c + origin.y;
  const velocityX = -BULLET_VELOCITY * s + origin.velocityX;
  const velocityY = BULLET_VELOCITY * c + origin.velocityY;

  return {
    x,
    y,
    velocityX,
    velocityY,
    fixedRotation: true,
  };
}
