import { Schema, type } from "@colyseus/schema";
import { PlayerInputs } from "../../protocol";
import nanoid from "nanoid";

export class Player extends Schema {
  @type("string")
  id: string = nanoid();
  @type("string")
  name: string = "";
  @type("boolean")
  connected: boolean = false;
  @type("string")
  shipId: string | null = null;

  input: PlayerInputs = {
    thrustForward: false,
    thrustReverse: false,
    turnLeft: false,
    turnRight: false,
    afterburners: false,
    activateWeapon: false,
  };
}
