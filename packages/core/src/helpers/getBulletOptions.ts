import { Ship } from "../state";

const BULLET_VELOCITY = 15;

export function getBulletOptions(ship: Ship) {
  const {
    angle,
    height,
    x: shipX,
    y: shipY,
    velocityX: shipVelocityX,
    velocityY: shipVelocityY,
  } = ship;
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const x = -1 * s + shipX;
  const y = 1 * c + shipY;
  const velocityX = -BULLET_VELOCITY * s + shipVelocityX;
  const velocityY = BULLET_VELOCITY * c + shipVelocityY;

  return {
    x,
    y,
    velocityX,
    velocityY,
    fixedRotation: true,
  };
}
