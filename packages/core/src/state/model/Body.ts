export enum CollisionGroup {
  Static = Math.pow(2, 1),
  Vehicle = Math.pow(2, 2),
  Projectile = Math.pow(2, 3),
}

export interface Body {
  id: string;
  x: number;
  y: number;
  angle: number;
  mass: number;
  width: number;
  height: number;
  angularVelocity: number;
  velocityX: number;
  velocityY: number;
  angularDamping: number;
  damping: number;
  fixedRotation: boolean;
  collisionGroup: CollisionGroup;
  collisionMask: number;
  sensor: boolean;
}
