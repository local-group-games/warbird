import { Wreckage } from "colyseus-test-core";
import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
} from "three";

export function createWreckage(tile: Wreckage) {
  const geometry = new OctahedronGeometry(tile.width / 2, 0);
  const material = new MeshStandardMaterial({
    color: 0x44ffbb,
    emissive: 0x00ff00,
    emissiveIntensity: 0.2,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = tile.x;
  mesh.position.y = tile.y;
  material.transparent = true;
  material.metalness = 0.9;
  material.roughness = 0.2;

  return mesh;
}
