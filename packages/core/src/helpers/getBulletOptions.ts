import { Ship } from "../state";

const BULLET_VELOCITY = 25;

export function getBulletOptions(ship: Ship) {
  const s = Math.sin(ship.angle);
  const c = Math.cos(ship.angle);
  const x = -1 * s + ship.x;
  const y = 1 * c + ship.y;
  const velocityX = -BULLET_VELOCITY * s + ship.velocityX;
  const velocityY = BULLET_VELOCITY * c + ship.velocityY;

  return {
    x,
    y,
    velocityX,
    velocityY,
    fixedRotation: true,
  };
}
