import { Component } from "../../Component";
import { ComponentType } from "../ComponentType";

export class Projectile extends Component {
  getType() {
    return ComponentType.Projectile;
  }
}
