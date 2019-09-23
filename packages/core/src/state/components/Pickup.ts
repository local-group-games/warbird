import { type } from "@colyseus/schema";
import { Component } from "colyseus-test-ecs";
import { ComponentType } from "../ComponentType";

export class Pickup extends Component {
  getType() {
    return ComponentType.Pickup;
  }

  @type("uint16")
  scrap: number = 0;
}
