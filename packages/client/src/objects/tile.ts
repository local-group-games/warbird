import { Tile, Body, Entity, Destructible } from "@warbird/core";
import { BoxGeometry, Material, Math, Mesh, MeshStandardMaterial } from "three";
import { RenderObject } from "../types";

export function createTile(tile: Tile): RenderObject {
  const body = Entity.getComponent(tile, Body);
  const destructible = Entity.getComponent(tile, Destructible);
  const geometry = new BoxGeometry(body.width, body.height, 1);
  const material = new MeshStandardMaterial({
    color: destructible.invulnerable ? 0xffffff : 0x6933fe,
    emissive: 0xffffff,
    emissiveIntensity: 0.1,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = body.x;
  mesh.position.y = body.y;
  material.transparent = true;
  material.metalness = 0.2;
  material.roughness = 0.7;

  return {
    object: mesh,
    update: () => {
      const material = mesh.material as Material;
      material.opacity = Math.lerp(
        material.opacity,
        destructible.health / 100,
        0.5,
      );
    },
  };
}
