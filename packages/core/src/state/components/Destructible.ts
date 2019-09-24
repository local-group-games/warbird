import { type } from "@colyseus/schema";
import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export interface DestructibleProps {
  health: number;
  invulnerable: boolean;
}

export class Destructible extends Component implements DestructibleProps {
  getType() {
    return ComponentType.Destructible;
  }

  @type("uint8")
  health = 1;
  @type("boolean")
  invulnerable = false;
}
