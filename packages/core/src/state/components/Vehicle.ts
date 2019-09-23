import { Component } from "colyseus-test-ecs";
import { ComponentType } from "../ComponentType";

export class Vehicle extends Component {
  getType() {
    return ComponentType.Vehicle;
  }
}
