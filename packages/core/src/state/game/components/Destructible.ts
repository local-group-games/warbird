import { Component } from "../../Component";
import { type } from "@colyseus/schema";
import { ComponentType } from "../ComponentType";

export class Destructible extends Component {
  getType() {
    return ComponentType.Destructible;
  }

  @type("uint8")
  health: number = 1;
  @type("boolean")
  invulnerable: boolean = false;
}
