import { Tile } from "colyseus-test-core";
import { BoxGeometry, Material, Math, Mesh, MeshStandardMaterial } from "three";
import { RenderObject } from "../types";

export function createTile(tile: Tile): RenderObject {
  const geometry = new BoxGeometry(tile.width, tile.height, 1);
  const material = new MeshStandardMaterial({
    color: tile.invulnerable ? 0xffffff : 0x6933fe,
    emissive: 0x00ff99,
    emissiveIntensity: 0.1,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = tile.x;
  mesh.position.y = tile.y;
  material.transparent = true;
  material.metalness = 0.2;
  material.roughness = 0.7;

  return {
    object: mesh,
    update: () => {
      const material = mesh.material as Material;
      material.opacity = Math.lerp(material.opacity, tile.health / 100, 0.5);
    },
  };
}
