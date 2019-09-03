import { Tile } from "colyseus-test-core";
import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";

export function createTile(tile: Tile) {
  const geometry = new BoxGeometry(tile.width, tile.height, 1);
  const material = new MeshStandardMaterial({
    color: tile.invulnerable ? 0xffffff : 0x6933fe,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = tile.x;
  mesh.position.y = tile.y;
  material.transparent = true;
  material.metalness = 0.2;
  material.roughness = 0.7;

  return mesh;
}
