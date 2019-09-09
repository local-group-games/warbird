import { PlayerInputs } from "colyseus-test-core";

const SHIP_BASE_THRUST = 10;
const SHIP_AFTERBURNER_THRUST_MODIFIER = 2;

export function getShipThrust(input: PlayerInputs) {
  return (
    (Number(input.thrustForward) - Number(input.thrustReverse)) *
    (input.afterburners ? SHIP_AFTERBURNER_THRUST_MODIFIER : 1) *
    SHIP_BASE_THRUST
  );
}
