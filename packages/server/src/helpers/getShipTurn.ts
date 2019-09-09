import { PlayerInputs } from "colyseus-test-core";

const SHIP_BASE_TURN = 0.05;

export function getShipTurn(input: PlayerInputs) {
  return (Number(input.turnLeft) - Number(input.turnRight)) * SHIP_BASE_TURN;
}
