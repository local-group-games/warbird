import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export class Vehicle extends Component {
  getType() {
    return ComponentType.Vehicle;
  }
}
