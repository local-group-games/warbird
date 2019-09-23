import { Component } from "colyseus-test-ecs";
import { ComponentType } from "../ComponentType";

export class Projectile extends Component {
  getType() {
    return ComponentType.Projectile;
  }
}
