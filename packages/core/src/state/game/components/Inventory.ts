import { Component } from "../../Component";
import { type } from "@colyseus/schema";
import { ComponentType } from "../ComponentType";

export class Inventory extends Component {
  getType() {
    return ComponentType.Inventory;
  }

  @type("uint16")
  scrap = 0;
}
