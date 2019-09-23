import { type } from "@colyseus/schema";
import { Component } from "colyseus-test-ecs";
import { ComponentType } from "../ComponentType";

export class Inventory extends Component {
  getType() {
    return ComponentType.Inventory;
  }

  @type("uint16")
  scrap = 0;
}
