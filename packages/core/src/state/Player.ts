import { Schema, type } from "@colyseus/schema";
import nanoid from "nanoid";
import { PlayerInputs } from "../protocol";

export class Player extends Schema {
  @type("string")
  id: string = nanoid();
  @type("string")
  name: string = "";
  @type("boolean")
  connected: boolean = false;
  @type("string")
  vehicleId: string | null = null;

  input: PlayerInputs = {
    thrustForward: false,
    thrustReverse: false,
    turnLeft: false,
    turnRight: false,
    afterburners: false,
    activateWeapon: false,
  };
}
