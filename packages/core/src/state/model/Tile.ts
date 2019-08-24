import { Body, BodyOptions } from "./Body";
import { EntityOptions } from "./Entity";

const TILE_TYPE = "tile";

export type TileOptions = EntityOptions & Pick<BodyOptions, "x" | "y">;

export class Tile extends Body {
  constructor(options: TileOptions) {
    super(options);
    this.type = TILE_TYPE;
    this.mass = 0;
  }
}
