import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export class Projectile extends Component {
  getType() {
    return ComponentType.Projectile;
  }
}
