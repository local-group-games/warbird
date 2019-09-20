import { Component } from "../../Component";
import { type } from "@colyseus/schema";
import { ComponentType } from "../ComponentType";

export class Expireable extends Component {
  getType() {
    return ComponentType.Expireable;
  }

  @type("uint32")
  createdTimeMs: number = 0;
  @type("uint32")
  lifeTimeMs: number = 0;
}
