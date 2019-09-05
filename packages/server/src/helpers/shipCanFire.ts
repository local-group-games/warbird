import { ShipSchema, PlayerCommandPayload } from "colyseus-test-core";

export function shipCanFire(
  ship: ShipSchema,
  command: PlayerCommandPayload,
  now: number,
) {
  return (
    command.fire &&
    ship.energy >= ship.weapons[0].energyCost &&
    now - ship.weapons[0].lastFireTime >= ship.weapons[0].fireRate * 100
  );
}
