import { BallSchema, TileSchema } from "colyseus-test-core";
import { BaseRoom } from "./BaseRoom";

const map: number[][] = [
  [0, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [4, 1],
  [4, 0],
];

export class MainRoom extends BaseRoom {
  onCreate(options: any) {
    super.onCreate(options);

    for (const [x, y] of map) {
      const tile = new TileSchema();

      tile.x = x;
      tile.y = y;

      tile.invulnerable = true;

      this.addEntity(tile);
    }

    for (let i = 0; i < 10; i++) {
      const ball = new BallSchema();

      ball.x = Math.random() * -10;
      ball.y = Math.random() * -10;

      this.addEntity(ball);
    }
  }
}
