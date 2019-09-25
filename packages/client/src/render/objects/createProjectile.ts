import { Body, Bullet, Entity } from "@warbird/core";
import { interpolateEntity } from "../helpers/interpolateEntity";
import { RenderObject } from "../../types";

export async function createProjectile(bullet: Bullet): Promise<RenderObject> {
  const { CircleGeometry, Mesh, MeshStandardMaterial } = await import("three");
  const body = Entity.getComponent(bullet, Body);
  const geometry = new CircleGeometry(body.width / 3, 6);
  const material = new MeshStandardMaterial({
    color: 0xefdfaa,
    emissive: 0xefdfaa,
    emissiveIntensity: 1,
  });
  const mesh = new Mesh(geometry, material);

  mesh.position.x = body.x;
  mesh.position.y = body.y;

  return {
    object: mesh,
    update: () => interpolateEntity(body, mesh),
  };
}
