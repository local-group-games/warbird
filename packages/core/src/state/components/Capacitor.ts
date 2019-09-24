import { type } from "@colyseus/schema";
import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export class Capacitor extends Component {
  getType() {
    return ComponentType.Capacitor;
  }

  @type("uint16")
  energy: number = 0;
  @type("uint16")
  energyPerS: number = 25;
}
