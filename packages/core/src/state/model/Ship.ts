import { Body } from "./Body";

export class Ship extends Body {
  type = "ship";
  mass = 2;
  width = 1;
  height = 2;

  lastFireTime = 0;
}
