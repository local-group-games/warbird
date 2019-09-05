import { PlayerCommandPayload } from "colyseus-test-core";

const SHIP_BASE_TURN = 0.06;

export function getShipTurn(command: PlayerCommandPayload) {
  return (
    (Number(command.turnLeft) - Number(command.turnRight)) * SHIP_BASE_TURN
  );
}
