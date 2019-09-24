import { type } from "@colyseus/schema";
import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export class Pickup extends Component {
  getType() {
    return ComponentType.Pickup;
  }

  @type("uint16")
  scrap: number = 0;
}
