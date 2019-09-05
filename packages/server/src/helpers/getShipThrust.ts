import { PlayerCommandPayload } from "colyseus-test-core";

const SHIP_BASE_THRUST = 10;
const SHIP_AFTERBURNER_THRUST_MODIFIER = 2;

export function getShipThrust(command: PlayerCommandPayload) {
  return (
    (Number(command.thrustForward) - Number(command.thrustReverse)) *
    SHIP_BASE_THRUST *
    (command.afterburners ? SHIP_AFTERBURNER_THRUST_MODIFIER : 1)
  );
}
