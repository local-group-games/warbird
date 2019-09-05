import { Schema, type } from "@colyseus/schema";
import { PlayerCommandPayload } from "../../protocol";
import { Player } from "../model/Player";
import nanoid from "nanoid";

export class PlayerSchema extends Schema implements Player {
  @type("string")
  id: string = nanoid();
  @type("string")
  name: string = "";
  @type("boolean")
  connected: boolean = false;
  @type("string")
  shipId: string | null = null;
  @type("int16")
  scrap: number = 0;

  command: PlayerCommandPayload = {
    thrustForward: false,
    thrustReverse: false,
    turnLeft: false,
    turnRight: false,
    afterburners: false,
    fire: false,
  };
}
