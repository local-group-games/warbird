import { Body, Entity, Wreck } from "@warbird/core";
import { RenderObject } from "../../types";

const ROTATION_PER_MS = 0.0005;

export async function createWreck(wreck: Wreck): Promise<RenderObject> {
  const { Mesh, MeshStandardMaterial, OctahedronGeometry } = await import(
    "three"
  );
  const body = Entity.getComponent(wreck, Body);
  const geometry = new OctahedronGeometry(body.width / 2, 0);
  const material = new MeshStandardMaterial({
    color: 0xefdd22,
    emissive: 0x44ff00,
    emissiveIntensity: 0.5,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = body.x;
  mesh.position.y = body.y;
  material.transparent = true;
  material.metalness = 0.9;
  material.roughness = 0.4;
  material.opacity = 0.8;

  return {
    object: mesh,
    update: deltaTimeMs => {
      const rotation = ROTATION_PER_MS * deltaTimeMs * 2 * Math.PI;
      mesh.rotation.x += rotation;
      mesh.rotation.y += rotation;
    },
  };
}
