import { Body } from "p2";
import { BodyState } from "./BodyState";

export function syncBody(body: Body, state: BodyState) {
  state.x = body.position[0];
  state.y = body.position[1];
}
