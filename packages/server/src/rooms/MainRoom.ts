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
      const body = tile.makeBody({ x, y });

      tile.invulnerable = true;

      this.addEntity(tile, body);
    }

    for (let i = 0; i < 10; i++) {
      const ball = new BallSchema();
      const body = ball.makeBody({
        x: (Math.random() - 0.5) * 2 * 10,
        y: (Math.random() - 0.5) * 2 * 10,
      });

      this.addEntity(ball, body);
    }
  }
}
