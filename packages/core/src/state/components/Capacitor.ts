import { type } from "@colyseus/schema";
import { Component } from "@warbird/ecs";
import { ComponentType } from "../ComponentType";

export interface CapacitorProps {
  energy: number;
  energyPerS: number;
}

export class Capacitor extends Component implements CapacitorProps {
  getType() {
    return ComponentType.Capacitor;
  }

  @type("uint16")
  energy = 0;
  @type("uint16")
  energyPerS = 25;
}
