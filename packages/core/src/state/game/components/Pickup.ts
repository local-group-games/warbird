import { type } from "@colyseus/schema";
import { Component } from "../../Component";
import { ComponentType } from "../ComponentType";

export class Pickup extends Component {
  getType() {
    return ComponentType.Pickup;
  }

  @type("uint16")
  scrap: number;
}
