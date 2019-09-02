import { Schema, type } from "@colyseus/schema";
import { PlayerCommandPayload } from "../../protocol";
import { Player } from "../model/Player";

export class PlayerSchema extends Schema implements Player {
  @type("string")
  id: string;
  @type("string")
  name: string;
  @type("boolean")
  connected: boolean;
  @type("string")
  shipId: string | null = null;

  command: PlayerCommandPayload = {
    thrustForward: false,
    thrustReverse: false,
    turnLeft: false,
    turnRight: false,
    afterburners: false,
    fire: false,
  };
}
