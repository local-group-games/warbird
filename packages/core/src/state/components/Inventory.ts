import { type } from "@colyseus/schema";
import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export class Inventory extends Component {
  getType() {
    return ComponentType.Inventory;
  }

  @type("uint16")
  scrap = 0;
}
