import { Ball, Tile, Destructible, Physical } from "@warbird/core";
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
      const tile = new Tile();
      const tileBody = tile.getComponent(Physical);
      const tileDestructible = tile.getComponent(Destructible);
      tileBody.x = x;
      tileBody.y = y;
      tileDestructible.invulnerable = true;
      this.world.addEntity(tile);
    }

    for (let i = 0; i < 10; i++) {
      const ball = new Ball();
      const ballBody = ball.getComponent(Physical);
      ballBody.x = Math.random() * -10;
      ballBody.y = Math.random() * -10;
      this.world.addEntity(ball);
    }
  }
}
