import { Component } from "../../Component";
import { ComponentType } from "../ComponentType";

export class Vehicle extends Component {
  getType() {
    return ComponentType.Vehicle;
  }
}
